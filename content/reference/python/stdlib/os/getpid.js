// content/reference/python/stdlib/os/getpid.js

export const meta = {
  slug:        'getpid',
  name:        'os.getpid',
  signature:   'os.getpid() / os.getppid() / os.getpgid(pid) / os.getpgrp() / os.getsid(pid, /) / os.setpgid(pid, pgrp, /) / os.setpgrp() / os.setsid()',
  blurb:       'Process ids: your own pid and your parent pid (Unix and Windows), plus the Unix process-group and session calls used by shells and daemons.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (getppid on Windows 3.2+)',
  searchTerms: 'os.getpid getpid process id pid python os.getppid getppid parent process id os.getpgid getpgid os.getpgrp getpgrp process group os.getsid getsid session id os.setpgid setpgid os.setpgrp setpgrp os.setsid setsid daemon new session start_new_session process_group killpg',
};

export const method = {
  slug:      'getpid',
  name:      'os.getpid',
  signature: 'os.getpid() / os.getppid() / os.getpgid(pid) / os.getpgrp() / os.getsid(pid, /) / os.setpgid(pid, pgrp, /) / os.setpgrp() / os.setsid()',
  returns:   { type: 'int', desc: 'getpid / getppid / getpgid / getpgrp / getsid: an id. The set* calls return None.' },

  category:    'os function',
  version:     'Python 3.0+ (getppid on Windows 3.2+)',
  hasLiveDemo: false,

  subtitle: 'getpid() works everywhere and getppid() on Unix and Windows. The process-group and session calls (getpgid, getpgrp, getsid, setpgid, setpgrp, setsid) are Unix only: they let a shell or supervisor put children in their own group so one signal reaches the whole group.',

  covers: ['getpid', 'getppid', 'getpgid', 'getpgrp', 'getsid', 'setpgid', 'setpgrp', 'setsid'],

  cheat: {
    commonCall: 'os.getpid()',
    returns:    'int: the id of the current process',
    replaces:   'reading /proc/self or $$ in shell scripts',
    watchOut:   'All threads share one pid; pids are reused after a process exits',
  },

  parameters: [
    { name: 'pid',  type: 'int', required: true, default: null, desc: 'getpgid / getsid / setpgid: the process to ask about or change; 0 means the calling process.' },
    { name: 'pgrp', type: 'int', required: true, default: null, desc: 'setpgid only: the target process group id; 0 means use pid as the group id.' },
  ],

  patterns: [
    {
      name: 'Tag log lines with the pid',
      desc: 'Distinguish worker processes in a shared log.',
      code: "import logging\nlogging.basicConfig(format='%(process)d %(levelname)s %(message)s')",
    },
    {
      name: 'Run a child in its own session (Unix)',
      desc: 'start_new_session=True calls setsid() in the child, detaching it from your terminal and process group.',
      code: "import subprocess\nproc = subprocess.Popen(['long-job'], start_new_session=True)",
    },
    {
      name: 'Signal a whole process group (Unix)',
      desc: 'Put the child in a new group, then signal the group, so its own children stop too.',
      code: "import os, signal, subprocess\nproc = subprocess.Popen(['server'], process_group=0)\nos.killpg(os.getpgid(proc.pid), signal.SIGTERM)",
    },
    {
      name: 'Classic daemon step (Unix)',
      desc: 'After fork, the child becomes a session leader with no controlling terminal.',
      code: 'import os\nif os.fork() == 0:\n    os.setsid()\n    ...',
    },
  ],

  examples: [
    { title: 'A positive int',                      code: 'import os\nisinstance(os.getpid(), int) and os.getpid() > 0', returns: 'True' },
    { title: 'A child sees us as its parent',       code: "import os, sys, subprocess\nout = subprocess.run([sys.executable, '-c', 'import os; print(os.getppid())'], capture_output=True, text=True).stdout.strip()\nout == str(os.getpid())", returns: 'True' },
    { title: 'A child has its own pid',             code: "import os, sys, subprocess\nout = subprocess.run([sys.executable, '-c', 'import os; print(os.getpid())'], capture_output=True, text=True).stdout.strip()\nout != str(os.getpid())", returns: 'True' },
    { title: 'Threads share the process id',        code: 'import os, threading\nseen = []\nt = threading.Thread(target=lambda: seen.append(os.getpid()))\nt.start()\nt.join()\nseen[0] == os.getpid()', returns: 'True' },
    { title: 'Process groups exist only on Unix',   code: "import os\nall(hasattr(os, n) == (os.name == 'posix') for n in ('getpgid', 'getpgrp', 'getsid', 'setpgid', 'setpgrp', 'setsid'))", returns: 'True' },
    { title: 'multiprocessing names the main process', code: 'import multiprocessing\nmultiprocessing.current_process().name', returns: "'MainProcess'" },
  ],

  pitfalls: [
    {
      name: 'Using the pid to tell threads apart',
      desc: 'Every thread of a process has the same pid. Use threading.get_ident() or threading.get_native_id() for threads.',
      wrong: { label: 'os.getpid()', code: 'import os, threading\nseen = []\nt = threading.Thread(target=lambda: seen.append(os.getpid()))\nt.start()\nt.join()\nseen[0] != os.getpid()', output: 'False' },
      fix:   { label: 'get_native_id()', code: 'import threading\nseen = []\nt = threading.Thread(target=lambda: seen.append(threading.get_native_id()))\nt.start()\nt.join()\nseen[0] != threading.get_native_id()', output: 'True' },
    },
    {
      name: 'Building unique file names from the pid',
      desc: 'Two threads, or a later process that reuses the pid, get the same name. tempfile picks a name that is guaranteed new.',
      wrong: { label: "f'job-{pid}.tmp'", code: "import os\nnames = [f'job-{os.getpid()}.tmp' for _ in range(2)]\nnames[0] == names[1]", output: 'True' },
      fix:   { label: 'tempfile', code: "import os, tempfile\nfds = [tempfile.mkstemp(dir='.', prefix='job-') for _ in range(2)]\nfor fd, _ in fds:\n    os.close(fd)\nfds[0][1] == fds[1][1]", output: 'False' },
    },
  ],

  when: {
    use: [
      'Logging and debugging which process did something',
      'Checking whether you are still the original process after fork (compare a saved pid)',
      'Unix job control: own process group or session for a child or daemon',
    ],
    avoid: [
      'New sessions / groups for children → subprocess.Popen(start_new_session=True) or process_group=0 (Unix)',
      'Identifying threads → threading.get_ident() / get_native_id()',
      'Unique names → tempfile or uuid.uuid4()',
    ],
  },

  notes: {
    cpython:        'Direct wrappers of getpid(2), getppid(2), getpgid(2), getpgrp(2), getsid(2), setpgid(2), setpgrp(2) / setpgrp(0, 0) and setsid(2)',
    'Availability': 'getpid: all platforms (a stub on WASI). getppid: Unix, Windows (Windows since 3.2). getpgid, getpgrp, getsid, setpgid, setpgrp, setsid: Unix only',
    'getppid':      'When the parent has exited, Unix returns the pid of the init process (1); Windows keeps returning the old parent id, which may already belong to another process',
    'Errors':       'getpgid of a pid that does not exist raises ProcessLookupError (errno ESRCH)',
  },

  related: [
    { name: 'os.getuid', slug: 'getuid', when: 'Which user the process runs as' },
    { name: 'os.kill', slug: 'kill', when: 'Send a signal to a pid or group' },
    { name: 'os.fork', slug: 'fork', when: 'Create a child process (Unix)' },
    { name: 'os.waitpid', slug: 'waitpid', when: 'Wait for a child pid' },
    { name: 'os.openpty', slug: 'openpty', when: 'Terminals and tcgetpgrp' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo, and why do the examples not print a pid?',
      a: 'A pid is different on every run and machine. getpid and getppid work on Unix and Windows; the process-group and session functions are Unix only (docs: Availability: Unix, not WASI). The examples compare pids with each other instead of printing them.',
    },
    {
      q: 'How do I get the current process id in Python?',
      a: 'os.getpid(). For the parent use os.getppid(); for a child you started, Popen.pid.',
    },
    {
      q: 'What does os.setsid() do?',
      a: 'It makes the calling process the leader of a new session and a new process group, with no controlling terminal. Daemons call it after fork; subprocess does it for you with start_new_session=True.',
    },
    {
      q: 'Is os.getpid() unique?',
      a: 'Only among processes running at the same moment. After a process exits its pid can be reused, so do not use pids as permanent ids or file-name keys.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.getpid',
    meta:  'os.getpid / getppid / process groups and sessions',
  },
};
