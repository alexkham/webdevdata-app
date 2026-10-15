// content/reference/python/stdlib/subprocess/create_new_console.js

export const meta = {
  slug:        'create_new_console',
  name:        'subprocess.CREATE_NEW_CONSOLE',
  signature:   'creationflags = CREATE_NEW_CONSOLE | CREATE_NEW_PROCESS_GROUP | CREATE_NO_WINDOW | DETACHED_PROCESS | CREATE_DEFAULT_ERROR_MODE | CREATE_BREAKAWAY_FROM_JOB',
  blurb:       'Windows only: process-creation flags for Popen(creationflags=...) — a new console, no window at all, no console, a new process group, the default error mode, or breaking away from a job.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3, Windows only (all but the first two: 3.7+)',
  searchTerms: 'subprocess.CREATE_NEW_CONSOLE CREATE_NEW_CONSOLE CREATE_NEW_PROCESS_GROUP CREATE_NO_WINDOW DETACHED_PROCESS CREATE_DEFAULT_ERROR_MODE CREATE_BREAKAWAY_FROM_JOB creationflags windows subprocess no console window hide window detach process new console ctrl break process group',
};

export const method = {
  slug:      'create_new_console',
  name:      'subprocess.CREATE_NEW_CONSOLE',
  signature: 'creationflags = CREATE_NEW_CONSOLE | CREATE_NEW_PROCESS_GROUP | CREATE_NO_WINDOW | DETACHED_PROCESS | CREATE_DEFAULT_ERROR_MODE | CREATE_BREAKAWAY_FROM_JOB',
  returns:   { type: 'int', desc: 'Bit flags; combine with | and pass as creationflags= to Popen, run(), call() …' },

  category:    'subprocess constant (Windows)',
  version:     'Python 3, Windows only (all but the first two: 3.7+)',
  hasLiveDemo: false,

  subtitle: 'Handed straight to CreateProcess. They exist only in the Windows build of subprocess; on POSIX any non-zero creationflags raises ValueError, while creationflags=0 is accepted everywhere — which makes getattr(subprocess, NAME, 0) a portable default.',

  covers: [
    'CREATE_NEW_CONSOLE', 'CREATE_NEW_PROCESS_GROUP', 'CREATE_NO_WINDOW',
    'DETACHED_PROCESS', 'CREATE_DEFAULT_ERROR_MODE', 'CREATE_BREAKAWAY_FROM_JOB',
  ],

  cheat: {
    commonCall: 'subprocess.run(cmd, creationflags=subprocess.CREATE_NO_WINDOW)',
    returns:    'int bit flags (CREATE_NO_WINDOW = 0x8000000)',
    replaces:   'pythonw tricks and VBScript wrappers to hide consoles',
    watchOut:   'Non-zero creationflags on Linux/macOS → ValueError',
  },

  parameters: [
    { name: 'CREATE_NEW_CONSOLE',        type: 'int', required: false, default: '0x10',      desc: 'The child gets its own new console instead of sharing the parent\'s.' },
    { name: 'CREATE_NEW_PROCESS_GROUP',  type: 'int', required: false, default: '0x200',     desc: 'The child starts a new process group — needed to send it CTRL_BREAK_EVENT (os.kill / send_signal). Ignored together with CREATE_NEW_CONSOLE.' },
    { name: 'CREATE_NO_WINDOW',          type: 'int', required: false, default: '0x8000000', desc: 'A console program runs without creating a console window (3.7+).' },
    { name: 'DETACHED_PROCESS',          type: 'int', required: false, default: '0x8',       desc: 'The child does not inherit the parent\'s console. Cannot be combined with CREATE_NEW_CONSOLE (3.7+).' },
    { name: 'CREATE_DEFAULT_ERROR_MODE', type: 'int', required: false, default: '0x4000000', desc: 'The child gets the default error mode instead of inheriting the parent\'s (3.7+).' },
    { name: 'CREATE_BREAKAWAY_FROM_JOB', type: 'int', required: false, default: '0x1000000', desc: 'The child is not associated with the parent\'s job object (3.7+).' },
  ],

  patterns: [
    {
      name: 'No console window, portable',
      desc: 'On POSIX the getattr fallback is 0, which creationflags accepts.',
      code: "import subprocess\nsubprocess.run(cmd, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))",
    },
    {
      name: 'A child you can Ctrl+Break',
      desc: 'Own process group, then CTRL_BREAK_EVENT instead of killing it outright.',
      code: "import signal, subprocess\nproc = subprocess.Popen(cmd, creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)\n...\nproc.send_signal(signal.CTRL_BREAK_EVENT)\nproc.wait()",
    },
    {
      name: 'Open a program in its own console window',
      desc: 'A separate window that stays independent of yours.',
      code: "import subprocess\nsubprocess.Popen(['cmd.exe'], creationflags=subprocess.CREATE_NEW_CONSOLE)",
    },
  ],

  examples: [
    { title: 'Windows-only names',               code: "import subprocess, sys\nnames = ['CREATE_NEW_CONSOLE', 'CREATE_NEW_PROCESS_GROUP', 'DETACHED_PROCESS', 'CREATE_NO_WINDOW', 'CREATE_DEFAULT_ERROR_MODE', 'CREATE_BREAKAWAY_FROM_JOB']\nall(hasattr(subprocess, n) for n in names) == (sys.platform == 'win32')", returns: 'True' },
    { title: 'The getattr fallback runs anywhere', code: "import subprocess, sys\nflags = getattr(subprocess, 'CREATE_NO_WINDOW', 0)\nsubprocess.run([sys.executable, '-c', 'print(\"ok\")'], capture_output=True, text=True, creationflags=flags).stdout", returns: "'ok\\n'" },
    { title: 'Its value is 0 or 0x08000000',     code: "import subprocess\nflags = getattr(subprocess, 'CREATE_NO_WINDOW', 0)\nflags in (0, 0x08000000)", returns: 'True' },
    { title: 'Combining flags with |',            code: "import subprocess\nflags = getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0x200) | getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000)\n(hex(flags), flags & 0x200 != 0)", returns: "('0x8000200', True)" },
    { title: 'creationflags=0 is accepted everywhere', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'pass'], creationflags=0).returncode", returns: '0' },
    { title: 'Only set them on Windows',          code: "import subprocess, sys\nflags = 0\nif sys.platform == 'win32':\n    flags = subprocess.CREATE_NO_WINDOW\nsubprocess.run([sys.executable, '-c', 'pass'], creationflags=flags).returncode", returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Adding flags with + instead of |',
      desc: 'Flags are bits: + double-counts a flag that is already set and produces a different bit pattern. | is idempotent.',
      wrong: { label: '+', code: "import subprocess\ngroup = getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0x200)\nhex(group + group)", output: "'0x400'" },
      fix:   { label: '|', code: "import subprocess\ngroup = getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0x200)\nhex(group | group)", output: "'0x200'" },
    },
    {
      name: 'Testing a flag with ==',
      desc: 'Once several flags are combined, the value equals none of them. Test one bit with &.',
      wrong: { label: '==', code: "import subprocess\nno_window = getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000)\nflags = getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0x200) | no_window\nflags == no_window", output: 'False' },
      fix:   { label: '&', code: "import subprocess\nno_window = getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000)\nflags = getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0x200) | no_window\nflags & no_window != 0", output: 'True' },
    },
  ],

  when: {
    use: [
      'CREATE_NO_WINDOW: tools called from a GUI app or service without flashing consoles',
      'CREATE_NEW_PROCESS_GROUP: children you want to stop with CTRL_BREAK_EVENT',
      'CREATE_NEW_CONSOLE / DETACHED_PROCESS: programs that should have their own console, or none',
    ],
    avoid: [
      'Linux and macOS — use start_new_session=True / process_group= there',
      'DETACHED_PROCESS together with CREATE_NEW_CONSOLE (CreateProcess rejects it)',
      'Process priority → the *_PRIORITY_CLASS flags',
    ],
  },

  notes: {
    cpython:        'Imported from _winapi in the Windows branch of Lib/subprocess.py and passed unchanged to CreateProcess',
    'Values':       'Windows 3.13: CREATE_NEW_CONSOLE 0x10, CREATE_NEW_PROCESS_GROUP 0x200, CREATE_NO_WINDOW 0x8000000, DETACHED_PROCESS 0x8, CREATE_DEFAULT_ERROR_MODE 0x4000000, CREATE_BREAKAWAY_FROM_JOB 0x1000000',
    'Observed':     'DETACHED_PROCESS | CREATE_NEW_CONSOLE raised OSError [WinError 87] The parameter is incorrect',
    'POSIX':        'Popen raises ValueError("creationflags is only supported on Windows platforms") for any non-zero value (checked on Linux)',
  },

  related: [
    { name: 'Priority classes', slug: 'normal_priority_class', when: 'Also go into creationflags' },
    { name: 'STARTUPINFO', slug: 'startupinfo', when: 'The other way to hide a window' },
    { name: 'Popen.send_signal', slug: 'kill', when: 'CTRL_BREAK_EVENT needs a new process group' },
    { name: 'Popen', slug: 'popen', when: 'creationflags= argument' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'These flags only exist in the Windows build of subprocess and only do something when CreateProcess starts a real process, which a browser cannot do. The examples use getattr(subprocess, NAME, fallback) so they print the same result on Windows, Linux and macOS.',
    },
    {
      q: 'How do I stop a console window from popping up with subprocess on Windows?',
      a: 'creationflags=subprocess.CREATE_NO_WINDOW. For code that also runs elsewhere, use getattr(subprocess, "CREATE_NO_WINDOW", 0), since 0 is the only value POSIX accepts.',
    },
    {
      q: 'What is the difference between CREATE_NO_WINDOW, DETACHED_PROCESS and CREATE_NEW_CONSOLE?',
      a: 'CREATE_NO_WINDOW runs a console program without creating a window; DETACHED_PROCESS gives the child no console at all (not inheriting yours); CREATE_NEW_CONSOLE gives it a fresh console window of its own. DETACHED_PROCESS and CREATE_NEW_CONSOLE cannot be combined.',
    },
    {
      q: 'Why do I need CREATE_NEW_PROCESS_GROUP?',
      a: 'To send the child CTRL_BREAK_EVENT with Popen.send_signal or os.kill on Windows — the docs require the child to have been started with this flag.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.CREATE_NEW_CONSOLE',
    meta:  'subprocess Windows constants',
  },

};
