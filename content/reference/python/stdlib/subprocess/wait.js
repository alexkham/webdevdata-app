// content/reference/python/stdlib/subprocess/wait.js

export const meta = {
  slug:        'wait',
  name:        'Popen.wait',
  signature:   'Popen.wait(timeout=None) · Popen.poll()',
  blurb:       'wait() blocks until the child exits and returns its exit code; poll() checks without blocking and returns None while it still runs. Both set Popen.returncode.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3 (wait timeout 3.3+)',
  searchTerms: 'Popen.wait wait Popen.poll poll returncode is process still running check if subprocess finished wait for process timeout TimeoutExpired exit code zombie non-blocking python',
};

export const method = {
  slug:      'wait',
  name:      'Popen.wait',
  signature: 'Popen.wait(timeout=None) · Popen.poll()',
  returns:   { type: 'int | None', desc: 'wait(): the exit code. poll(): the exit code, or None if the child is still running.' },

  category:    'Popen method',
  version:     'Python 3 (wait timeout 3.3+)',
  hasLiveDemo: false,

  subtitle: 'The two ways to learn that a Popen child has finished. Neither reads the child\'s pipes — with stdout=PIPE or stderr=PIPE use communicate(), or a chatty child fills the pipe and both of you wait forever.',

  covers: ['Popen.wait', 'Popen.poll'],

  cheat: {
    commonCall: 'code = proc.wait(timeout=30)',
    returns:    'wait(): exit code · poll(): exit code or None',
    replaces:   'os.waitpid(pid, 0) / os.waitpid(pid, os.WNOHANG)',
    watchOut:   'Deadlocks with unread PIPEs — use communicate()',
  },

  parameters: [
    { name: 'timeout', type: 'float | None', required: false, default: 'None', desc: 'wait() only: seconds to wait. On expiry TimeoutExpired is raised; the child keeps running and you can wait() again.' },
  ],

  patterns: [
    {
      name: 'Do other work while it runs',
      desc: 'poll() returns None until the child has exited.',
      code: "import subprocess, time\nproc = subprocess.Popen(cmd)\nwhile proc.poll() is None:\n    update_progress_bar()\n    time.sleep(0.5)\nprint('exit code', proc.returncode)",
    },
    {
      name: 'Wait with a deadline, then stop it',
      desc: 'wait(timeout) never kills; do it yourself.',
      code: "import subprocess\ntry:\n    proc.wait(timeout=60)\nexcept subprocess.TimeoutExpired:\n    proc.terminate()\n    try:\n        proc.wait(timeout=5)\n    except subprocess.TimeoutExpired:\n        proc.kill()\n        proc.wait()",
    },
    {
      name: 'Wait for several children',
      desc: 'Start them all first, then wait for each.',
      code: "import subprocess\nprocs = [subprocess.Popen(['convert', f, f + '.png']) for f in files]\ncodes = [p.wait() for p in procs]",
    },
  ],

  examples: [
    { title: 'wait() returns the exit code',     code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; sys.exit(5)'])\np.wait()", returns: '5' },
    { title: 'poll() is None while running',     code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(0.5)'])\nbefore = p.poll()\np.wait()\n(before, p.returncode, p.poll())", returns: '(None, 0, 0)' },
    { title: 'A polling loop',                   code: "import subprocess, sys, time\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(0.3)'])\nchecks = 0\nwhile p.poll() is None:\n    checks += 1\n    time.sleep(0.05)\n(checks > 0, p.returncode)", returns: '(True, 0)' },
    { title: 'wait(timeout) raises, the child lives on', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\ntry:\n    p.wait(timeout=0.5)\nexcept subprocess.TimeoutExpired as e:\n    result = (type(e).__name__, e.timeout, p.poll())\nfinally:\n    p.kill()\n    p.wait()\nresult", returns: "('TimeoutExpired', 0.5, None)" },
    { title: 'Retrying wait() is safe',          code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(1)'])\ntries = 0\nwhile True:\n    try:\n        code = p.wait(timeout=0.3)\n        break\n    except subprocess.TimeoutExpired:\n        tries += 1\n(code, tries >= 1)", returns: '(0, True)' },
    { title: 'Once known, the code is cached',   code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; sys.exit(2)'])\n(p.wait(), p.wait(), p.poll(), p.returncode)", returns: '(2, 2, 2, 2)' },
    { title: 'timeout=0 just checks',            code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\ntry:\n    p.wait(timeout=0)\nexcept subprocess.TimeoutExpired as e:\n    result = e.timeout\nfinally:\n    p.kill()\n    p.wait()\nresult", returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Reading returncode without poll() or wait()',
      desc: 'Nothing updates returncode in the background: it stays None after the child has exited, until poll(), wait() or communicate() collects the status.',
      wrong: { label: 'returncode', code: "import subprocess, sys, time\np = subprocess.Popen([sys.executable, '-c', 'pass'])\ntime.sleep(1)\nprint(p.returncode)\np.wait()", output: 'None\n0' },
      fix:   { label: 'poll()', code: "import subprocess, sys, time\np = subprocess.Popen([sys.executable, '-c', 'pass'])\ntime.sleep(1)\np.poll()", output: '0' },
    },
    {
      name: 'wait() with an unread PIPE',
      desc: 'The child blocks once the pipe buffer is full; wait() never reads it, so neither side moves (the timeout is the only way out here).',
      wrong: { label: 'wait()', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.PIPE)\ntry:\n    p.wait(timeout=1)\n    result = 'finished'\nexcept subprocess.TimeoutExpired:\n    result = 'stuck: wait() does not read the pipe'\nfinally:\n    p.kill()\n    p.communicate()\nresult", output: "'stuck: wait() does not read the pipe'" },
      fix:   { label: 'communicate()', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.PIPE)\nout, _ = p.communicate(timeout=10)\n(len(out) > 1_000_000, p.returncode)", output: '(True, 0)' },
    },
  ],

  when: {
    use: [
      'wait(): block until a Popen child without PIPEs (or with drained PIPEs) has finished',
      'poll(): check from a loop or a UI timer without blocking',
      'wait(timeout): a deadline you handle yourself',
    ],
    avoid: [
      'Children whose output you piped → communicate()',
      'Waiting inside asyncio code → asyncio.create_subprocess_exec and await proc.wait()',
    ],
  },

  notes: {
    cpython:      'POSIX: os.waitpid (with WNOHANG for poll and for timeouts — a busy loop of short sleeps); Windows: WaitForSingleObject on the process handle, then GetExitCodeProcess',
    'returncode': 'None while unknown; on POSIX -N when the child was killed by signal N. With shell=True it is the shell\'s exit status, which may report a signal as 128+N',
    'Zombies':    'On POSIX a finished child stays a zombie until its status is collected — by wait(), poll(), communicate() or the with block',
  },

  related: [
    { name: 'Popen.communicate', slug: 'communicate', when: 'Wait and read the pipes' },
    { name: 'Popen.kill / terminate', slug: 'kill', when: 'Stop it, then wait()' },
    { name: 'Popen', slug: 'popen', when: 'The returncode attribute' },
    { name: 'TimeoutExpired', slug: 'timeoutexpired', when: 'What wait(timeout) raises' },
    { name: 'os.waitpid', slug: 'waitpid', when: 'The low-level call underneath (POSIX)', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'wait() and poll() watch a real child process, which a browser cannot start, and their timing depends on the machine. The examples use a child Python (sys.executable -c ...) and only show results that do not depend on timing or platform.',
    },
    {
      q: 'How do I check if a subprocess is still running?',
      a: 'proc.poll() returns None while it runs and the exit code once it has finished. It never blocks.',
    },
    {
      q: 'What is the difference between wait() and poll()?',
      a: 'wait() blocks until the child exits (or the timeout expires) and returns the exit code. poll() returns immediately: the exit code if the child has finished, otherwise None. Both store the code in returncode.',
    },
    {
      q: 'Why does proc.wait() hang?',
      a: 'Usually because the child is blocked writing to stdout=PIPE or stderr=PIPE that nobody reads — once the pipe buffer is full it cannot continue, and wait() does not read. Use proc.communicate(), or redirect the output to a file or DEVNULL.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.Popen.wait',
    meta:  'Popen.wait / Popen.poll',
  },

};
