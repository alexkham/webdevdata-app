// content/reference/python/stdlib/subprocess/kill.js

export const meta = {
  slug:        'kill',
  name:        'Popen.kill',
  signature:   'Popen.terminate() · Popen.kill() · Popen.send_signal(signal)',
  blurb:       'Stop a Popen child: terminate() asks (SIGTERM), kill() forces (SIGKILL), send_signal() sends any signal. On Windows terminate() and kill() are the same TerminateProcess call.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3',
  searchTerms: 'Popen.kill kill Popen.terminate terminate Popen.send_signal send_signal stop subprocess kill process SIGTERM SIGKILL SIGINT CTRL_C_EVENT CTRL_BREAK_EVENT TerminateProcess graceful shutdown python',
};

export const method = {
  slug:      'kill',
  name:      'Popen.kill',
  signature: 'Popen.terminate() · Popen.kill() · Popen.send_signal(signal)',
  returns:   { type: 'None', desc: 'They only send the request; call wait() (or communicate()) afterwards to reap the child and get its returncode.' },

  category:    'Popen method',
  version:     'Python 3',
  hasLiveDemo: false,

  subtitle: 'All three return immediately and do nothing for a child that is already known to have exited. They do not wait: follow them with wait() — until then returncode stays None, and on POSIX the dead child lingers as a zombie.',

  covers: ['Popen.send_signal', 'Popen.terminate', 'Popen.kill'],

  cheat: {
    commonCall: 'proc.terminate(); proc.wait(timeout=5)',
    returns:    'None — the exit code comes from wait()',
    replaces:   'os.kill(proc.pid, signal.SIGTERM)',
    watchOut:   'Exit code differs: -15 / -9 on POSIX, 1 on Windows',
  },

  parameters: [
    { name: 'signal', type: 'int', required: true, default: null, desc: 'send_signal() only. POSIX: any signal number. Windows: only signal.SIGTERM (= terminate()), signal.CTRL_C_EVENT and signal.CTRL_BREAK_EVENT; anything else raises ValueError.' },
  ],

  patterns: [
    {
      name: 'Ask nicely, then force',
      desc: 'Give the child a chance to clean up before SIGKILL.',
      code: "import subprocess\nproc.terminate()\ntry:\n    proc.wait(timeout=5)\nexcept subprocess.TimeoutExpired:\n    proc.kill()\n    proc.wait()",
    },
    {
      name: 'Ctrl+C for a child (POSIX)',
      desc: 'SIGINT lets a Python child run its KeyboardInterrupt handling.',
      code: "import signal\nproc.send_signal(signal.SIGINT)\nproc.wait()",
    },
    {
      name: 'Ctrl+Break for a child (Windows)',
      desc: 'Needs a child started in its own process group.',
      code: "import signal, subprocess\nproc = subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)\nproc.send_signal(signal.CTRL_BREAK_EVENT)",
    },
    {
      name: 'Clean up whatever happens',
      desc: 'Kill in finally so an exception never leaves the child running.',
      code: "import subprocess\nproc = subprocess.Popen(cmd)\ntry:\n    do_work()\nfinally:\n    if proc.poll() is None:\n        proc.kill()\n        proc.wait()",
    },
  ],

  examples: [
    { title: 'terminate(), then wait()',          code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\np.terminate()\np.wait() != 0", returns: 'True' },
    { title: 'kill() after a wait timeout',       code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\ntry:\n    p.wait(timeout=0.5)\nexcept subprocess.TimeoutExpired:\n    p.kill()\n    p.wait()\np.returncode is not None", returns: 'True' },
    { title: 'send_signal(SIGTERM) works everywhere', code: "import signal, subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\np.send_signal(signal.SIGTERM)\np.wait() != 0", returns: 'True' },
    { title: 'No effect once the exit is known',  code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'pass'])\np.wait()\np.terminate()\np.kill()\np.returncode", returns: '0' },
    { title: 'Inside a with block',               code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)']) as p:\n    p.terminate()\np.returncode != 0", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Reading returncode right after kill()',
      desc: 'kill() only sends the request. The exit code arrives with wait().',
      wrong: { label: 'kill() only', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\np.kill()\nprint(p.returncode)\ncode = p.wait()  # clean up", output: 'None' },
      fix:   { label: 'kill() + wait()', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\np.kill()\np.wait()\np.returncode is not None", output: 'True' },
    },
    {
      name: 'Trying to stop what run() returned',
      desc: 'run() has already waited for the child; its CompletedProcess is a record with no kill(). A process you may need to stop must be started with Popen.',
      wrong: { label: 'run()', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'pass'])\nr.kill()", output: "AttributeError: 'CompletedProcess' object has no attribute 'kill'" },
      fix:   { label: 'Popen', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\np.kill()\np.wait() != 0", output: 'True' },
    },
  ],

  when: {
    use: [
      'terminate(): normal shutdown of a server or worker you started',
      'kill(): the child ignores terminate() or hangs',
      'send_signal(): SIGINT, SIGHUP, SIGUSR1 … on POSIX; CTRL_BREAK_EVENT on Windows',
    ],
    avoid: [
      'Stopping a whole process tree: with shell=True the signal goes to the shell (pid is the shell\'s) → start_new_session=True and os.killpg on POSIX',
      'Timeouts of run() — it already kills the child for you',
    ],
  },

  notes: {
    cpython:          'POSIX: terminate() = send_signal(SIGTERM), kill() = send_signal(SIGKILL); send_signal polls first, to lower the risk of signalling a pid that has been reused. Windows: terminate() calls TerminateProcess(handle, 1) and kill is the same function object',
    'Exit codes':     'Observed: terminate() then wait() gave -15 on Linux and 1 on Windows; kill() gave -9 on Linux and 1 on Windows',
    'Windows signals': 'send_signal(signal.SIGINT) raised ValueError("Unsupported signal: 2") on Windows; CTRL_C_EVENT / CTRL_BREAK_EVENT need creationflags=CREATE_NEW_PROCESS_GROUP',
  },

  related: [
    { name: 'Popen.wait / poll', slug: 'wait', when: 'Reap the child after the signal' },
    { name: 'Popen.communicate', slug: 'communicate', when: 'kill() then communicate() after a timeout' },
    { name: 'Popen', slug: 'popen', when: 'pid, returncode' },
    { name: 'CREATE_NEW_PROCESS_GROUP', slug: 'create_new_console', when: 'Needed for CTRL_BREAK_EVENT on Windows' },
    { name: 'os.kill', slug: 'kill', when: 'Signal any pid, not just your children', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'These methods signal a running child process, which a browser cannot start, and the resulting exit codes differ by platform (-15 / -9 on POSIX, 1 on Windows). The examples therefore only show results that are the same everywhere, such as returncode != 0.',
    },
    {
      q: 'What is the difference between terminate() and kill()?',
      a: 'On POSIX terminate() sends SIGTERM, which a program can catch to shut down cleanly, and kill() sends SIGKILL, which cannot be caught. On Windows both call TerminateProcess and are the same method (Popen.kill is Popen.terminate there).',
    },
    {
      q: 'Why is returncode still None after kill()?',
      a: 'kill() sends the signal and returns. The exit status is only collected by wait(), poll() or communicate(); call proc.wait() right after.',
    },
    {
      q: 'What returncode does a killed process have?',
      a: 'On POSIX the negative signal number: -15 after terminate(), -9 after kill(). On Windows TerminateProcess sets exit code 1 for both. Test for "not 0" if your code must run on both.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.Popen.kill',
    meta:  'Popen.kill / terminate / send_signal',
  },

};
