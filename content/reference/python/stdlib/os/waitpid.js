// content/reference/python/stdlib/os/waitpid.js

export const meta = {
  slug:        'waitpid',
  name:        'os.waitpid',
  signature:   'os.waitpid(pid, options, /) / wait() / wait3(options) / wait4(pid, options) / waitid(idtype, id, options, /) / os.waitstatus_to_exitcode(status) / os.WIFEXITED(status) ... / os.pidfd_open(pid, flags=0)',
  blurb:       'Wait for a child process to finish and decode its 16-bit wait status: the exit code sits in the high byte, the killing signal in the low 7 bits. waitstatus_to_exitcode() does the decoding for you, on Unix and Windows.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions); waitid 3.3+, waitstatus_to_exitcode and pidfd_open 3.9+',
  searchTerms: 'os.waitpid waitpid os.wait wait os.wait3 wait3 os.wait4 wait4 os.waitid waitid waitid_result os.waitstatus_to_exitcode waitstatus_to_exitcode WIFEXITED WEXITSTATUS WIFSIGNALED WTERMSIG WCOREDUMP WIFSTOPPED WSTOPSIG WIFCONTINUED WNOHANG WUNTRACED WCONTINUED WEXITED WSTOPPED WNOWAIT CLD_EXITED CLD_KILLED CLD_DUMPED CLD_TRAPPED CLD_STOPPED CLD_CONTINUED P_ALL P_PID P_PGID P_PIDFD os.pidfd_open pidfd_open wait for child process exit status python zombie ChildProcessError 768',
};

export const method = {
  slug:      'waitpid',
  name:      'os.waitpid',
  signature: 'os.waitpid(pid, options, /) / wait() / wait3(options) / wait4(pid, options) / waitid(idtype, id, options, /) / os.waitstatus_to_exitcode(status) / os.WIFEXITED(status) ... / os.pidfd_open(pid, flags=0)',
  returns:   { type: 'tuple[int, int] | int | bool | waitid_result | None', desc: 'waitpid/wait: (pid, status). wait3/wait4: (pid, status, rusage). waitid: a waitid_result (or None with WNOHANG). waitstatus_to_exitcode: the exit code, negative for a signal. W* helpers: bool or int. pidfd_open: a file descriptor.' },

  category:    'os function',
  version:     'Python 3 (all versions); waitid 3.3+, waitstatus_to_exitcode and pidfd_open 3.9+',
  hasLiveDemo: false,

  subtitle: 'Reap a finished child and find out how it ended. Only waitpid and waitstatus_to_exitcode exist on Windows too; wait, wait3, wait4, waitid, the W* status helpers and flags, the CLD_* codes and the P_* idtypes are Unix only, and pidfd_open needs Linux 5.3+.',

  covers: ['wait', 'wait3', 'wait4', 'waitid', 'waitid_result', 'waitpid', 'waitstatus_to_exitcode', 'WCONTINUED', 'WCOREDUMP', 'WEXITED', 'WEXITSTATUS', 'WIFCONTINUED', 'WIFEXITED', 'WIFSIGNALED', 'WIFSTOPPED', 'WNOHANG', 'WNOWAIT', 'WSTOPPED', 'WSTOPSIG', 'WTERMSIG', 'WUNTRACED', 'CLD_CONTINUED', 'CLD_DUMPED', 'CLD_EXITED', 'CLD_KILLED', 'CLD_STOPPED', 'CLD_TRAPPED', 'P_ALL', 'P_PID', 'P_PGID', 'P_PIDFD', 'pidfd_open'],

  cheat: {
    commonCall: 'pid, status = os.waitpid(pid, 0)',
    returns:    '(pid, wait status) - decode with waitstatus_to_exitcode',
    replaces:   'subprocess.Popen.wait() / .returncode',
    watchOut:   'the status is not the exit code: exit 3 is status 768',
  },

  parameters: [
    { name: 'pid',     type: 'int', required: true,  default: null, desc: 'waitpid/wait4 on Unix: > 0 that child, 0 any child in my process group, -1 any child, < -1 any child in process group -pid. On Windows: a process handle (as returned by spawn* with P_NOWAIT); <= 0 raises.' },
    { name: 'options', type: 'int', required: true,  default: null, desc: '0 for a normal blocking wait, or flags OR-ed together: WNOHANG, WUNTRACED, WCONTINUED (waitid: WEXITED, WSTOPPED, WCONTINUED, WNOHANG, WNOWAIT). Ignored on Windows.' },
    { name: 'status',  type: 'int', required: true,  default: null, desc: 'waitstatus_to_exitcode and the W* helpers: a wait status as returned by wait(), waitpid() or os.system() on Unix.' },
    { name: 'idtype, id', type: 'int', required: true, default: null, desc: 'waitid: P_PID (id is a pid), P_PGID (a process group), P_ALL (id ignored), P_PIDFD (id is a pidfd from pidfd_open, Linux 5.4+).' },
  ],

  patterns: [
    {
      name: 'Wait for one child and get its exit code',
      desc: 'Works on Unix and Windows (on Windows pid is the handle from spawn* P_NOWAIT).',
      code: "import os\n_, status = os.waitpid(pid, 0)\nexit_code = os.waitstatus_to_exitcode(status)",
    },
    {
      name: 'Reap finished children without blocking (Unix)',
      desc: 'WNOHANG returns (0, 0) when nothing has exited yet; ChildProcessError means there are no children left.',
      code: "import os\nwhile True:\n    try:\n        pid, status = os.waitpid(-1, os.WNOHANG)\n    except ChildProcessError:\n        break\n    if pid == 0:\n        break\n    print(pid, 'ended with', os.waitstatus_to_exitcode(status))",
    },
    {
      name: 'Decode a status with the W* helpers (Unix)',
      desc: 'Check WIFSTOPPED first: waitstatus_to_exitcode must not be called for a stopped child.',
      code: "import os\nif os.WIFEXITED(status):\n    print('exit code', os.WEXITSTATUS(status))\nelif os.WIFSIGNALED(status):\n    print('killed by signal', os.WTERMSIG(status), 'core dumped' if os.WCOREDUMP(status) else '')\nelif os.WIFSTOPPED(status):\n    print('stopped by signal', os.WSTOPSIG(status))",
    },
    {
      name: 'waitid and pidfd (Linux)',
      desc: 'A pidfd refers to one process and cannot be confused with a reused pid.',
      code: "import os\nfd = os.pidfd_open(pid)\ninfo = os.waitid(os.P_PIDFD, fd, os.WEXITED)\nos.close(fd)\nif info.si_code == os.CLD_EXITED:\n    print('exit code', info.si_status)",
    },
  ],

  examples: [
    { title: 'Status to exit code',          code: 'import os\nos.waitstatus_to_exitcode(3 << 8)', returns: '3' },
    { title: 'Decode a normal exit by hand', code: 'status = 768\n((status >> 8) & 0xff, status & 0x7f)', returns: '(3, 0)' },
    { title: 'Killed by a signal',           code: 'status = 9\n(status & 0x7f, (status & 0x7f) != 0)', returns: '(9, True)' },
    { title: 'The core-dump bit',            code: 'status = 134\n(status & 0x7f, bool(status & 0x80))', returns: '(6, True)' },
    { title: 'A stopped child',              code: 'status = 0x137f\n(status & 0xff == 0x7f, status >> 8)', returns: '(True, 19)' },
    { title: 'waitpid on a spawned child (Unix and Windows)', code: "import os, sys\npid = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(7))'])\n_, status = os.waitpid(pid, 0)\n(status, os.waitstatus_to_exitcode(status))", returns: '(1792, 7)' },
    { title: 'subprocess decodes it for you', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'raise SystemExit(7)']).returncode", returns: '7' },
    { title: 'No children: ChildProcessError', code: "import subprocess, sys\ncode = 'import os\\ntry:\\n    os.waitpid(-1, 0)\\nexcept ChildProcessError as e:\\n    print(type(e).__name__)'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'ChildProcessError\\n'" },
  ],

  pitfalls: [
    {
      name: 'Treating the status as the exit code',
      desc: 'waitpid returns a wait status, with the exit code shifted left by 8 bits (on Windows too). Convert it before comparing.',
      wrong: { label: 'raw status', code: "import os, sys\npid = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(7))'])\n_, status = os.waitpid(pid, 0)\nstatus == 7", output: 'False' },
      fix:   { label: 'waitstatus_to_exitcode', code: "import os, sys\npid = os.spawnv(os.P_NOWAIT, sys.executable, [sys.executable, '-c', 'raise(SystemExit(7))'])\n_, status = os.waitpid(pid, 0)\nos.waitstatus_to_exitcode(status) == 7", output: 'True' },
    },
    {
      name: 'Reading only the high byte',
      desc: 'A child killed by a signal has a high byte of 0, which looks like a clean exit. The low 7 bits hold the signal number - check them first (WIFSIGNALED / WTERMSIG do this).',
      wrong: { label: 'status >> 8', code: 'status = 9  # killed by signal 9\nstatus >> 8', output: '0' },
      fix:   { label: 'check the signal bits', code: "status = 9\nsig = status & 0x7f\n('killed by signal', sig) if sig else ('exit code', status >> 8)", output: "('killed by signal', 9)" },
    },
  ],

  when: {
    use: [
      'After os.fork or spawn* with P_NOWAIT - every child must be waited for, or it stays a zombie on Unix',
      'Decoding the status of os.system on Unix (waitstatus_to_exitcode)',
      'waitid / pidfd_open: race-free waiting on Linux',
    ],
    avoid: [
      'Processes started with subprocess → Popen.wait() / .returncode already decode the status',
      'waitpid(-1, ...) inside a library → it can reap children that belong to other code',
    ],
  },

  notes: {
    cpython:          'wait, wait3, wait4, waitid and waitpid wrap the C calls in Modules/posixmodule.c; on Windows waitpid uses _cwait. waitstatus_to_exitcode (3.9+) returns WEXITSTATUS for a normal exit, -WTERMSIG for a signal, raises ValueError otherwise; on Windows it returns status >> 8.',
    'Availability':   'waitpid and waitstatus_to_exitcode: Unix, Windows. wait, wait3, wait4, waitid, all W* functions and flags, CLD_*, P_ALL/P_PID/P_PGID/P_PIDFD: Unix only (waitid on macOS since 3.13). P_PIDFD needs Linux 5.4+, pidfd_open Linux 5.3+. None of them on WASI, Android or iOS.',
    'Status layout':  'Low 7 bits: the signal that killed the child (0 = it exited). Bit 0x80: a core file was produced. High byte: the exit code. A low byte of 0x7f means stopped, with the stop signal in the high byte.',
    'Windows':        'waitpid takes a process handle (any process, not only children), ignores options and returns the exit code shifted left by 8 bits so the Unix decoding still works.',
    'waitid_result':  'waitid returns a waitid_result with si_pid, si_uid, si_signo (always SIGCHLD), si_status and si_code (one of the CLD_* values; CLD_KILLED and CLD_STOPPED were added in 3.9).',
    'Linux values':   'On Linux: WNOHANG 1, WUNTRACED 2, WSTOPPED 2, WEXITED 4, WCONTINUED 8; CLD_EXITED 1 ... CLD_CONTINUED 6; P_ALL 0, P_PID 1, P_PGID 2, P_PIDFD 3. Other Unix systems may use other numbers - always use the names.',
  },

  related: [
    { name: 'os.fork',    slug: 'fork',    when: 'Create the child you wait for' },
    { name: 'os.spawnv',  slug: 'spawnv',  when: 'P_NOWAIT gives a pid to wait on' },
    { name: 'os.kill',    slug: 'kill',    when: 'Signal a child, then reap it' },
    { name: 'os.system',  slug: 'system',  when: 'Returns a wait status on Unix' },
    { name: 'os._exit',   slug: 'ex_ok',   when: 'Where exit codes come from' },
    { name: 'os module',  slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
    { name: 'OSError',    slug: 'oserror', when: 'Parent of ChildProcessError', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and which parts work on Windows?',
      a: 'Waiting needs real child processes, which cannot run inside the page. Only os.waitpid and os.waitstatus_to_exitcode exist on Windows; wait, wait3, wait4, waitid, the W* helpers and constants, CLD_* and P_* are Unix only, and pidfd_open needs Linux 5.3+. The examples decode statuses by hand and wait on a spawned Python child, which gives the same numbers on both systems.',
    },
    {
      q: 'Why is the exit status 256 or 768 instead of 1 or 3?',
      a: 'The wait status keeps the exit code in the high byte, so exit code 1 is 256 and 3 is 768. os.waitstatus_to_exitcode(768) returns 3; os.WEXITSTATUS(768) also gives 3 on Unix.',
    },
    {
      q: 'What does os.waitpid(-1, os.WNOHANG) return when nothing has finished?',
      a: '(0, 0) - no child changed state yet. If there are no children at all, it raises ChildProcessError instead.',
    },
    {
      q: 'How do I tell whether a child was killed by a signal?',
      a: 'os.WIFSIGNALED(status) is True and os.WTERMSIG(status) gives the signal number; waitstatus_to_exitcode returns it as a negative number, for example -9 for a status of 9 on Linux. subprocess shows the same as a negative returncode.',
    },
    {
      q: 'What is a zombie process and how do I avoid it?',
      a: 'A child that has ended but has not been waited for keeps an entry in the process table (Unix). Call waitpid for every child you fork or spawn with P_NOWAIT, or use subprocess, which waits for you.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.waitpid',
    meta:  'os.wait* / W* / CLD_* / P_* / pidfd_open',
  },
};
