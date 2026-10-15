// content/reference/python/stdlib/subprocess/normal_priority_class.js

export const meta = {
  slug:        'normal_priority_class',
  name:        'subprocess.NORMAL_PRIORITY_CLASS',
  signature:   'creationflags = IDLE_PRIORITY_CLASS | BELOW_NORMAL_PRIORITY_CLASS | NORMAL_PRIORITY_CLASS | ABOVE_NORMAL_PRIORITY_CLASS | HIGH_PRIORITY_CLASS | REALTIME_PRIORITY_CLASS',
  blurb:       'Windows only: the six process priority classes for Popen(creationflags=...), from IDLE (only when the machine is otherwise idle) to REALTIME (above the system\'s own threads).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.7+, Windows only',
  searchTerms: 'subprocess.NORMAL_PRIORITY_CLASS NORMAL_PRIORITY_CLASS IDLE_PRIORITY_CLASS BELOW_NORMAL_PRIORITY_CLASS ABOVE_NORMAL_PRIORITY_CLASS HIGH_PRIORITY_CLASS REALTIME_PRIORITY_CLASS process priority windows subprocess low priority background nice creationflags',
};

export const method = {
  slug:      'normal_priority_class',
  name:      'subprocess.NORMAL_PRIORITY_CLASS',
  signature: 'creationflags = IDLE_PRIORITY_CLASS | BELOW_NORMAL_PRIORITY_CLASS | NORMAL_PRIORITY_CLASS | ABOVE_NORMAL_PRIORITY_CLASS | HIGH_PRIORITY_CLASS | REALTIME_PRIORITY_CLASS',
  returns:   { type: 'int', desc: 'One priority bit, combined with other creation flags via |.' },

  category:    'subprocess constant (Windows)',
  version:     'Python 3.7+, Windows only',
  hasLiveDemo: false,

  subtitle: 'Pick one of them to start a child at a given scheduling priority on Windows. NORMAL is the default; BELOW_NORMAL or IDLE keep a heavy background job from slowing the desktop; REALTIME is almost never right. POSIX has no such names — use os.nice or nice there.',

  covers: [
    'IDLE_PRIORITY_CLASS', 'BELOW_NORMAL_PRIORITY_CLASS', 'NORMAL_PRIORITY_CLASS',
    'ABOVE_NORMAL_PRIORITY_CLASS', 'HIGH_PRIORITY_CLASS', 'REALTIME_PRIORITY_CLASS',
  ],

  cheat: {
    commonCall: 'subprocess.Popen(cmd, creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS)',
    returns:    'int bit flag (BELOW_NORMAL_PRIORITY_CLASS = 0x4000)',
    replaces:   'start /low, start /belownormal in cmd.exe',
    watchOut:   'REALTIME can starve mouse, keyboard and disk flushing',
  },

  parameters: [
    { name: 'IDLE_PRIORITY_CLASS',         type: 'int', required: false, default: '0x40',   desc: 'Lowest: the child runs when nothing else wants the CPU.' },
    { name: 'BELOW_NORMAL_PRIORITY_CLASS', type: 'int', required: false, default: '0x4000', desc: 'Below average priority.' },
    { name: 'NORMAL_PRIORITY_CLASS',       type: 'int', required: false, default: '0x20',   desc: 'Normal priority (the default).' },
    { name: 'ABOVE_NORMAL_PRIORITY_CLASS', type: 'int', required: false, default: '0x8000', desc: 'Above average priority.' },
    { name: 'HIGH_PRIORITY_CLASS',         type: 'int', required: false, default: '0x80',   desc: 'High priority.' },
    { name: 'REALTIME_PRIORITY_CLASS',     type: 'int', required: false, default: '0x100',  desc: 'Realtime: interrupts the system threads for mouse, keyboard and background disk flushing. Only for brief, hardware-facing tasks.' },
  ],

  patterns: [
    {
      name: 'Low-priority background job, portable',
      desc: 'Windows: BELOW_NORMAL; POSIX: run it under nice.',
      code: "import subprocess, sys\nif sys.platform == 'win32':\n    proc = subprocess.Popen(cmd, creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS)\nelse:\n    proc = subprocess.Popen(['nice', '-n', '10', *cmd])",
    },
    {
      name: 'Priority plus no window',
      desc: 'Combine with other creation flags using |.',
      code: "import subprocess\nflags = subprocess.IDLE_PRIORITY_CLASS | subprocess.CREATE_NO_WINDOW\nsubprocess.Popen(cmd, creationflags=flags)",
    },
  ],

  examples: [
    { title: 'Windows-only names',            code: "import subprocess, sys\nnames = ['IDLE_PRIORITY_CLASS', 'BELOW_NORMAL_PRIORITY_CLASS', 'NORMAL_PRIORITY_CLASS', 'ABOVE_NORMAL_PRIORITY_CLASS', 'HIGH_PRIORITY_CLASS', 'REALTIME_PRIORITY_CLASS']\nall(hasattr(subprocess, n) for n in names) == (sys.platform == 'win32')", returns: 'True' },
    { title: 'Run at idle priority where available', code: "import subprocess, sys\nprio = getattr(subprocess, 'IDLE_PRIORITY_CLASS', 0)\nsubprocess.run([sys.executable, '-c', 'print(\"background job\")'], capture_output=True, text=True, creationflags=prio).stdout", returns: "'background job\\n'" },
    { title: 'Combine with CREATE_NO_WINDOW', code: "import subprocess\nflags = getattr(subprocess, 'BELOW_NORMAL_PRIORITY_CLASS', 0x4000) | getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000)\nhex(flags)", returns: "'0x8004000'" },
    { title: 'Fallback 0 is valid everywhere', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'pass'], creationflags=getattr(subprocess, 'BELOW_NORMAL_PRIORITY_CLASS', 0))\nr.returncode", returns: '0' },
    { title: 'Pick a priority only on Windows', code: "import subprocess, sys\nflags = subprocess.BELOW_NORMAL_PRIORITY_CLASS if sys.platform == 'win32' else 0\nsubprocess.run([sys.executable, '-c', 'print(\"low priority\")'], capture_output=True, text=True, creationflags=flags).stdout", returns: "'low priority\\n'" },
  ],

  pitfalls: [
    {
      name: 'Assuming the values are ordered',
      desc: 'They are unrelated bits, not levels: comparing them with < says nothing about priority (IDLE 0x40 is numerically above NORMAL 0x20).',
      wrong: { label: '<', code: "import subprocess\nidle = getattr(subprocess, 'IDLE_PRIORITY_CLASS', 0x40)\nnormal = getattr(subprocess, 'NORMAL_PRIORITY_CLASS', 0x20)\nidle < normal", output: 'False' },
      fix:   { label: 'an explicit order', code: "import subprocess\nnames = ['IDLE_PRIORITY_CLASS', 'BELOW_NORMAL_PRIORITY_CLASS', 'NORMAL_PRIORITY_CLASS', 'ABOVE_NORMAL_PRIORITY_CLASS', 'HIGH_PRIORITY_CLASS', 'REALTIME_PRIORITY_CLASS']\nnames.index('IDLE_PRIORITY_CLASS') < names.index('NORMAL_PRIORITY_CLASS')", output: 'True' },
    },
    {
      name: 'Testing for a priority with ==',
      desc: 'Combined with other creation flags, the value is no longer the bare priority bit. Test it with &.',
      wrong: { label: '==', code: "import subprocess\nlow = getattr(subprocess, 'BELOW_NORMAL_PRIORITY_CLASS', 0x4000)\nflags = low | getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000)\nflags == low", output: 'False' },
      fix:   { label: '&', code: "import subprocess\nlow = getattr(subprocess, 'BELOW_NORMAL_PRIORITY_CLASS', 0x4000)\nflags = low | getattr(subprocess, 'CREATE_NO_WINDOW', 0x08000000)\nflags & low != 0", output: 'True' },
    },
  ],

  when: {
    use: [
      'BELOW_NORMAL / IDLE: long builds, backups and conversions in the background',
      'ABOVE_NORMAL / HIGH: short latency-sensitive helpers',
    ],
    avoid: [
      'REALTIME_PRIORITY_CLASS for ordinary programs — it competes with input handling and disk flushing',
      'Linux and macOS → nice / os.setpriority',
      'Changing the priority of an already running process → psutil (third party) or os.setpriority on POSIX',
    ],
  },

  notes: {
    cpython:      'Imported from _winapi on Windows (3.7+) and passed through Popen\'s creationflags to CreateProcess',
    'Values':     'Windows 3.13: IDLE 0x40, BELOW_NORMAL 0x4000, NORMAL 0x20, ABOVE_NORMAL 0x8000, HIGH 0x80, REALTIME 0x100',
    'POSIX':      'Not defined; a non-zero creationflags raises ValueError there',
  },

  related: [
    { name: 'Creation flags', slug: 'create_new_console', when: 'The other creationflags bits' },
    { name: 'STARTUPINFO', slug: 'startupinfo', when: 'Window and handle settings' },
    { name: 'Popen', slug: 'popen', when: 'creationflags= argument' },
    { name: 'os.nice', slug: 'nice', when: 'Lower the priority on POSIX', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'The priority classes exist only in the Windows build of subprocess and only take effect when a real process is created, which a browser cannot do. The examples use getattr(subprocess, NAME, fallback) so they print the same result on every system.',
    },
    {
      q: 'How do I run a subprocess with low priority on Windows?',
      a: 'Pass creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS (or IDLE_PRIORITY_CLASS for the lowest). These names exist only on Windows; on Linux and macOS start the command under nice instead.',
    },
    {
      q: 'Why does subprocess.BELOW_NORMAL_PRIORITY_CLASS raise AttributeError?',
      a: 'The priority classes are defined only in the Windows build of subprocess (since 3.7). On Linux and macOS use getattr(subprocess, "BELOW_NORMAL_PRIORITY_CLASS", 0) — 0 is the only creationflags value POSIX accepts — and lower the priority with nice instead.',
    },
    {
      q: 'Should I use REALTIME_PRIORITY_CLASS?',
      a: 'Almost never. The docs warn that it interrupts the system threads that handle mouse and keyboard input and background disk flushing; it suits only brief tasks that talk directly to hardware.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.NORMAL_PRIORITY_CLASS',
    meta:  'subprocess priority class constants (Windows)',
  },

};
