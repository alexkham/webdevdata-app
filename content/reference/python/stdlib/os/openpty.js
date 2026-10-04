// content/reference/python/stdlib/os/openpty.js

export const meta = {
  slug:        'openpty',
  name:        'os.openpty',
  signature:   'os.openpty() / os.isatty(fd, /) / os.ttyname(fd, /) / os.posix_openpt(oflag, /) / ...',
  blurb:       'Terminals and pseudo-terminals: open a pty pair, ask whether an fd is a terminal (isatty, also on Windows) and which one (ttyname, ctermid), its encoding, its foreground process group, and the 3.13 POSIX calls posix_openpt / grantpt / unlockpt / ptsname.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (login_tty 3.11+, posix_openpt / grantpt / unlockpt / ptsname 3.13+)',
  searchTerms: 'os.openpty openpty pseudo terminal pty python os.isatty isatty is stdout a terminal piped os.ttyname ttyname os.ctermid ctermid controlling terminal os.device_encoding device_encoding os.tcgetpgrp tcgetpgrp os.tcsetpgrp tcsetpgrp foreground process group os.login_tty login_tty os.posix_openpt posix_openpt os.grantpt grantpt os.unlockpt unlockpt os.ptsname ptsname /dev/ptmx /dev/pts pty module expect colors',
};

export const method = {
  slug:      'openpty',
  name:      'os.openpty',
  signature: 'os.openpty() / os.isatty(fd, /) / os.ttyname(fd, /) / os.posix_openpt(oflag, /) / ...',
  returns:   { type: 'tuple[int, int]', desc: 'openpty: (master_fd, slave_fd). isatty: bool. ttyname / ctermid / ptsname: str. device_encoding: str or None. posix_openpt: an fd. tcgetpgrp: int.' },

  category:    'os function',
  version:     'Python 3.0+ (login_tty 3.11+, posix_openpt / grantpt / unlockpt / ptsname 3.13+)',
  hasLiveDemo: false,

  subtitle: 'A pseudo-terminal is a pair of fds: what a program writes to the slave side appears on the master side, and the program believes it talks to a real terminal (so it prints colours and line-buffers). isatty and device_encoding work on Unix and Windows; everything else here is Unix only.',

  covers: ['openpty', 'login_tty', 'ttyname', 'ctermid', 'isatty', 'device_encoding', 'tcgetpgrp', 'tcsetpgrp', 'posix_openpt', 'grantpt', 'unlockpt', 'ptsname'],

  cheat: {
    commonCall: 'sys.stdout.isatty()',
    returns:    'True in an interactive terminal, False when piped or captured',
    replaces:   'checking environment variables to guess whether output is interactive',
    watchOut:   'Most terminal work is easier with the pty module (Unix only)',
  },

  parameters: [
    { name: 'fd',    type: 'int', required: true, default: null, desc: 'An open file descriptor (isatty, ttyname, device_encoding, tcgetpgrp, tcsetpgrp, login_tty, grantpt, unlockpt, ptsname).' },
    { name: 'pg',    type: 'int', required: true, default: null, desc: 'tcsetpgrp only: the process group to make the foreground group of the terminal.' },
    { name: 'oflag', type: 'int', required: true, default: null, desc: 'posix_openpt only: open flags such as os.O_RDWR | os.O_NOCTTY (O_CLOEXEC is added automatically where available).' },
  ],

  patterns: [
    {
      name: 'Colours only for terminals',
      desc: 'Plain text when output goes to a file or pipe.',
      code: "import sys\nuse_color = sys.stdout.isatty()\nred = '\\033[31m' if use_color else ''",
    },
    {
      name: 'Run a child on a pseudo-terminal and read its output (Unix)',
      desc: 'The child sees a terminal on stdout, so it keeps colours and line buffering.',
      code: "import os, subprocess\nmaster, slave = os.openpty()\nproc = subprocess.Popen(['ls', '--color=auto'], stdout=slave, stderr=slave, close_fds=True)\nos.close(slave)\noutput = os.read(master, 65536)\nproc.wait()\nos.close(master)",
    },
    {
      name: 'The POSIX way to open a pty (3.13+)',
      desc: 'posix_openpt + grantpt + unlockpt + ptsname, as in C.',
      code: 'import os\nmaster = os.posix_openpt(os.O_RDWR | os.O_NOCTTY)\nos.grantpt(master)\nos.unlockpt(master)\nslave_name = os.ptsname(master)\nslave = os.open(slave_name, os.O_RDWR | os.O_NOCTTY)',
    },
    {
      name: 'Higher level: the pty module (Unix)',
      desc: 'pty.spawn runs a program connected to a new pseudo-terminal.',
      code: "import pty\npty.spawn(['bash'])",
    },
  ],

  examples: [
    { title: 'A pipe is not a terminal',           code: 'import os\nr, w = os.pipe()\ntry:\n    result = (os.isatty(r), os.isatty(w))\nfinally:\n    os.close(r)\n    os.close(w)\nresult', returns: '(False, False)' },
    { title: 'Neither is a regular file',           code: "import os\nwith open('f.txt', 'w') as f:\n    f.write('x')\nfd = os.open('f.txt', os.O_RDONLY)\ntry:\n    result = (os.isatty(fd), os.device_encoding(fd))\nfinally:\n    os.close(fd)\nresult", returns: '(False, None)' },
    { title: 'A closed or unknown fd is just False', code: 'import os\nos.isatty(9999)', returns: 'False' },
    { title: 'Captured output: no terminal',        code: 'import sys\nsys.stdout.isatty()', returns: 'False' },
    { title: 'A child with piped stdout sees no terminal', code: "import sys, subprocess\ncode = 'import sys; print(sys.stdout.isatty())'\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout.strip()", returns: "'False'" },
    { title: 'The pty functions are Unix only',     code: "import os\nall(hasattr(os, n) == (os.name == 'posix') for n in ('openpty', 'ttyname', 'ctermid', 'tcgetpgrp', 'login_tty'))", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Calling os.isatty(sys.stdout.fileno()) on a replaced stdout',
      desc: 'Test runners, notebooks and contextlib.redirect_stdout replace sys.stdout with objects that have no file descriptor. Ask the stream itself.',
      wrong: { label: 'fileno()', code: 'import contextlib, io, os, sys\nwith contextlib.redirect_stdout(io.StringIO()):\n    try:\n        result = os.isatty(sys.stdout.fileno())\n    except io.UnsupportedOperation as e:\n        result = type(e).__name__\nresult', output: "'UnsupportedOperation'" },
      fix:   { label: 'stream.isatty()', code: 'import contextlib, io, sys\nwith contextlib.redirect_stdout(io.StringIO()):\n    result = sys.stdout.isatty()\nresult', output: 'False' },
    },
    {
      name: 'Using device_encoding without a fallback',
      desc: 'device_encoding returns None when the fd is not a terminal (a file, a pipe), so string methods on the result crash.',
      wrong: { label: 'assume a str', code: "import os\nr, w = os.pipe()\ntry:\n    enc = os.device_encoding(w)\nfinally:\n    os.close(r)\n    os.close(w)\nenc.lower()", output: "AttributeError: 'NoneType' object has no attribute 'lower'" },
      fix:   { label: 'or a default', code: "import os\nr, w = os.pipe()\ntry:\n    enc = os.device_encoding(w) or 'utf-8'\nfinally:\n    os.close(r)\n    os.close(w)\nenc.lower()", output: "'utf-8'" },
    },
  ],

  when: {
    use: [
      'Deciding between coloured/interactive and plain output (isatty)',
      'Driving interactive programs that refuse to work with pipes (openpty, pty module)',
      'Job control in shells: tcgetpgrp / tcsetpgrp',
    ],
    avoid: [
      'Spawning and expecting interactive programs → pty.spawn or the third-party pexpect',
      'Windows → os has no pseudo-terminals there; use subprocess pipes',
      'Terminal size → os.get_terminal_size / shutil.get_terminal_size',
    ],
  },

  notes: {
    cpython:        'Thin wrappers of the C functions of the same names; openpty and posix_openpt return non-inheritable fds (openpty since 3.4). grantpt, unlockpt and ptsname do not close fd on failure; ptsname uses ptsname_r() where available',
    'Availability': 'isatty, device_encoding: Unix and Windows. ttyname: Unix. openpty, login_tty, ctermid, tcgetpgrp, tcsetpgrp, posix_openpt, grantpt, unlockpt, ptsname: Unix, not WASI. login_tty is 3.11+; posix_openpt, grantpt, unlockpt, ptsname are 3.13+',
    'device_encoding': 'Returns None unless fd is a terminal; on Unix in UTF-8 Mode it returns "UTF-8" (since 3.10)',
    'Errors':       'ttyname and tcgetpgrp on a pipe raise OSError with errno 25 (ENOTTY, "Inappropriate ioctl for device") on Linux; isatty never raises, it returns False',
    'login_tty':    'Makes the caller a session leader with fd as its controlling terminal and as stdin/stdout/stderr, then closes fd',
  },

  related: [
    { name: 'os.get_terminal_size', slug: 'get_terminal_size', when: 'Columns and lines of a terminal' },
    { name: 'os.getpid', slug: 'getpid', when: 'Process groups and sessions for tcsetpgrp' },
    { name: 'os.pipe', slug: 'pipe', when: 'The non-terminal way to connect processes' },
    { name: 'os.open', slug: 'open', when: 'Open the slave side by name' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why do the examples use pipes?',
      a: 'Pseudo-terminals are Unix only (openpty, ttyname and the others: Availability: Unix), and our examples run with captured output, where no terminal exists. Pipes and files give the same answers everywhere: isatty is False and device_encoding is None.',
    },
    {
      q: 'How do I check if Python output is going to a terminal or a pipe?',
      a: 'sys.stdout.isatty(). It is True in an interactive terminal and False when output is piped, redirected to a file or captured.',
    },
    {
      q: 'What is the difference between os.openpty and the pty module?',
      a: 'os.openpty just returns the (master, slave) fd pair. pty builds on it with pty.fork() and pty.spawn(), which start a child connected to the new terminal. Both are Unix only.',
    },
    {
      q: 'Why is os.posix_openpt missing?',
      a: 'posix_openpt, grantpt, unlockpt and ptsname were added in Python 3.13 and are Unix only. On older versions use os.openpty().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.openpty',
    meta:  'Terminals and pseudo-terminals',
  },
};
