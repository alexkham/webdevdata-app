// content/reference/python/stdlib/subprocess/startupinfo.js

export const meta = {
  slug:        'startupinfo',
  name:        'subprocess.STARTUPINFO',
  signature:   'subprocess.STARTUPINFO(*, dwFlags=0, hStdInput=None, hStdOutput=None, hStdError=None, wShowWindow=0, lpAttributeList=None)',
  blurb:       'Windows only: the STARTUPINFO structure for CreateProcess — hide the child\'s window, set its standard handles, pass a handle list — plus its constants STARTF_*, SW_HIDE and STD_*_HANDLE.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3, Windows only (keyword arguments 3.7+, STARTF_FORCE*FEEDBACK 3.13+)',
  searchTerms: 'subprocess.STARTUPINFO STARTUPINFO STARTUPINFO.copy STARTF_USESTDHANDLES STARTF_USESHOWWINDOW STARTF_FORCEONFEEDBACK STARTF_FORCEOFFFEEDBACK SW_HIDE STD_INPUT_HANDLE STD_OUTPUT_HANDLE STD_ERROR_HANDLE hide console window windows subprocess dwFlags wShowWindow lpAttributeList handle_list',
};

export const method = {
  slug:      'startupinfo',
  name:      'subprocess.STARTUPINFO',
  signature: 'subprocess.STARTUPINFO(*, dwFlags=0, hStdInput=None, hStdOutput=None, hStdError=None, wShowWindow=0, lpAttributeList=None)',
  returns:   { type: 'STARTUPINFO', desc: 'A plain object; pass it as Popen(..., startupinfo=si). Popen works on a copy, so one object can be reused.' },

  category:    'subprocess class (Windows)',
  version:     'Python 3, Windows only (keyword arguments 3.7+, STARTF_FORCE*FEEDBACK 3.13+)',
  hasLiveDemo: false,

  subtitle: 'Exists only on Windows — on Linux and macOS subprocess has no STARTUPINFO and none of these constants, so guard every use with sys.platform == "win32". Its most common job: start a console program without flashing a console window.',

  covers: [
    'STARTUPINFO',
    'STARTF_USESTDHANDLES', 'STARTF_USESHOWWINDOW', 'STARTF_FORCEONFEEDBACK', 'STARTF_FORCEOFFFEEDBACK',
    'SW_HIDE',
    'STD_INPUT_HANDLE', 'STD_OUTPUT_HANDLE', 'STD_ERROR_HANDLE',
  ],

  cheat: {
    commonCall: 'si = subprocess.STARTUPINFO(dwFlags=subprocess.STARTF_USESHOWWINDOW, wShowWindow=subprocess.SW_HIDE)',
    returns:    'STARTUPINFO object for startupinfo=',
    replaces:   'ctypes STARTUPINFO structures',
    watchOut:   'AttributeError on Linux/macOS — guard with sys.platform',
  },

  parameters: [
    { name: 'dwFlags',     type: 'int', required: false, default: '0', desc: 'Bit field: STARTF_USESHOWWINDOW (1) makes wShowWindow count, STARTF_USESTDHANDLES (256) the three handles; STARTF_FORCEONFEEDBACK (64) / STARTF_FORCEOFFFEEDBACK (128) control the busy cursor (3.13+).' },
    { name: 'hStdInput / hStdOutput / hStdError', type: 'handle | None', required: false, default: 'None', desc: 'Standard handles, used only with STARTF_USESTDHANDLES. Popen fills them itself when you redirect streams.' },
    { name: 'wShowWindow', type: 'int', required: false, default: '0', desc: 'A ShowWindow value (SW_HIDE = 0 hides the window), used only with STARTF_USESHOWWINDOW.' },
    { name: 'lpAttributeList', type: 'dict | None', required: false, default: 'None', desc: "Extra attributes; supported: handle_list, the handles the child may inherit (3.7+). None (or any empty value) is stored as {'handle_list': []}." },
  ],

  attributes: [
    { name: 'STARTF_USESTDHANDLES',   type: 'int', meaning: '256 — use hStdInput / hStdOutput / hStdError.' },
    { name: 'STARTF_USESHOWWINDOW',   type: 'int', meaning: '1 — use wShowWindow.' },
    { name: 'STARTF_FORCEONFEEDBACK', type: 'int', meaning: '64 — show the "working in background" cursor while starting (3.13+).' },
    { name: 'STARTF_FORCEOFFFEEDBACK', type: 'int', meaning: '128 — leave the cursor alone while starting (3.13+).' },
    { name: 'SW_HIDE',                type: 'int', meaning: '0 — hide the window; Popen uses it for shell=True.' },
    { name: 'STD_INPUT_HANDLE',       type: 'int', meaning: '4294967286 (the DWORD form of -10) — the standard input device.' },
    { name: 'STD_OUTPUT_HANDLE',      type: 'int', meaning: '4294967285 (-11) — the standard output device.' },
    { name: 'STD_ERROR_HANDLE',       type: 'int', meaning: '4294967284 (-12) — the standard error device.' },
  ],

  patterns: [
    {
      name: 'No console window for a console program',
      desc: 'Typical for GUI apps or services that call command-line tools.',
      code: "import subprocess, sys\nkwargs = {}\nif sys.platform == 'win32':\n    si = subprocess.STARTUPINFO()\n    si.dwFlags |= subprocess.STARTF_USESHOWWINDOW\n    si.wShowWindow = subprocess.SW_HIDE\n    kwargs['startupinfo'] = si\nsubprocess.run(cmd, **kwargs)",
    },
    {
      name: 'Keyword form (3.7+)',
      desc: 'Same object in one line.',
      code: "import subprocess\nsi = subprocess.STARTUPINFO(dwFlags=subprocess.STARTF_USESHOWWINDOW, wShowWindow=subprocess.SW_HIDE)",
    },
    {
      name: 'Inherit one specific handle',
      desc: 'handle_list limits inheritance; the handle must be made inheritable first (os.set_handle_inheritable).',
      code: "import os, subprocess\nos.set_handle_inheritable(h, True)\nsi = subprocess.STARTUPINFO(lpAttributeList={'handle_list': [h]})\nsubprocess.Popen(cmd, startupinfo=si, close_fds=True)",
    },
  ],

  examples: [
    { title: 'Windows-only: the guard is always true', code: "import subprocess, sys\nnames = ['STARTUPINFO', 'STARTF_USESTDHANDLES', 'STARTF_USESHOWWINDOW', 'STARTF_FORCEONFEEDBACK', 'STARTF_FORCEOFFFEEDBACK', 'SW_HIDE', 'STD_INPUT_HANDLE', 'STD_OUTPUT_HANDLE', 'STD_ERROR_HANDLE']\nall(hasattr(subprocess, n) for n in names) == (sys.platform == 'win32')", returns: 'True' },
    { title: 'Portable: hide the window only on Windows', code: "import subprocess, sys\nkwargs = {}\nif sys.platform == 'win32':\n    si = subprocess.STARTUPINFO()\n    si.dwFlags |= subprocess.STARTF_USESHOWWINDOW\n    si.wShowWindow = subprocess.SW_HIDE\n    kwargs['startupinfo'] = si\nr = subprocess.run([sys.executable, '-c', 'print(\"ok\")'], capture_output=True, text=True, **kwargs)\nr.stdout", returns: "'ok\\n'" },
    { title: 'Flag values (fallbacks match Windows)', code: "import subprocess\n(getattr(subprocess, 'STARTF_USESTDHANDLES', 0x100), getattr(subprocess, 'STARTF_USESHOWWINDOW', 0x1), getattr(subprocess, 'SW_HIDE', 0))", returns: '(256, 1, 0)' },
    { title: 'The 3.13 cursor flags',          code: "import subprocess\n(getattr(subprocess, 'STARTF_FORCEONFEEDBACK', 0x40), getattr(subprocess, 'STARTF_FORCEOFFFEEDBACK', 0x80))", returns: '(64, 128)' },
    { title: 'STD_*_HANDLE are -10, -11, -12 as DWORDs', code: '(2**32 - 10, 2**32 - 11, 2**32 - 12)', returns: '(4294967286, 4294967285, 4294967284)' },
    { title: 'Popen does not modify your object', code: "import subprocess, sys\nif sys.platform == 'win32':\n    si = subprocess.STARTUPINFO()\n    before = si.dwFlags\n    subprocess.run([sys.executable, '-c', 'pass'], stdout=subprocess.DEVNULL, startupinfo=si)\n    unchanged = si.dwFlags == before\nelse:\n    unchanged = True\nunchanged", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Overwriting dwFlags instead of combining',
      desc: 'dwFlags is a bit field. Assigning a second flag drops the first; combine them with | (getattr fallbacks keep this snippet runnable off Windows).',
      wrong: { label: '=', code: "import subprocess\nflags = getattr(subprocess, 'STARTF_USESTDHANDLES', 0x100)\nflags = getattr(subprocess, 'STARTF_USESHOWWINDOW', 0x1)\nflags", output: '1' },
      fix:   { label: '|=', code: "import subprocess\nflags = getattr(subprocess, 'STARTF_USESTDHANDLES', 0x100)\nflags |= getattr(subprocess, 'STARTF_USESHOWWINDOW', 0x1)\nflags", output: '257' },
    },
    {
      name: 'Setting wShowWindow without its flag',
      desc: 'wShowWindow is ignored unless dwFlags contains STARTF_USESHOWWINDOW (and the handles likewise need STARTF_USESTDHANDLES). Test the bit before relying on it.',
      wrong: { label: 'flag missing', code: "import subprocess\ndw_flags = 0\nbool(dw_flags & getattr(subprocess, 'STARTF_USESHOWWINDOW', 0x1))", output: 'False' },
      fix:   { label: 'flag set', code: "import subprocess\ndw_flags = 0\ndw_flags |= getattr(subprocess, 'STARTF_USESHOWWINDOW', 0x1)\nbool(dw_flags & getattr(subprocess, 'STARTF_USESHOWWINDOW', 0x1))", output: 'True' },
    },
  ],

  when: {
    use: [
      'Hiding the console window of a child started from a GUI program',
      'Restricting which handles a child inherits (lpAttributeList handle_list)',
    ],
    avoid: [
      'Redirecting streams → stdin/stdout/stderr arguments (Popen sets the handles itself)',
      'Detaching or new consoles → creationflags (CREATE_NO_WINDOW, DETACHED_PROCESS, …)',
      'Any code that must run on Linux or macOS without a platform check',
    ],
  },

  notes: {
    cpython:          'Defined in Lib/subprocess.py only when msvcrt imports (Windows); the constants come from _winapi. Popen copies the object (copy(), bpo-34044) before adding its own flags',
    'Availability':   'Windows only. Linux subprocess.__all__ has none of these 9 names',
    'copy()':         'STARTUPINFO.copy() returns a new STARTUPINFO with the same fields and a fresh handle_list list',
    'Observed':       'On Windows 3.13: STARTUPINFO(dwFlags=STARTF_USESHOWWINDOW, wShowWindow=SW_HIDE) has dwFlags 1, wShowWindow 0, hStdInput None, lpAttributeList {\'handle_list\': []}; positional arguments raise TypeError',
  },

  related: [
    { name: 'CREATE_NO_WINDOW and other creation flags', slug: 'create_new_console', when: 'creationflags=, the other Windows knob' },
    { name: 'Priority classes', slug: 'normal_priority_class', when: 'Process priority via creationflags' },
    { name: 'Popen', slug: 'popen', when: 'startupinfo= argument' },
    { name: 'shell=True', slug: 'shell', when: 'Uses SW_HIDE for cmd.exe' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'STARTUPINFO and its constants exist only in the Windows build of subprocess and only matter when CreateProcess starts a real process, which a browser cannot do. The examples guard with sys.platform or getattr fallbacks so they print the same result everywhere.',
    },
    {
      q: 'How do I hide the console window when running a subprocess on Windows?',
      a: 'Either pass creationflags=subprocess.CREATE_NO_WINDOW, or a STARTUPINFO with dwFlags=STARTF_USESHOWWINDOW and wShowWindow=SW_HIDE. Both are Windows only; build them inside an if sys.platform == "win32" block.',
    },
    {
      q: 'Why does subprocess.STARTUPINFO raise AttributeError?',
      a: 'You are not on Windows. STARTUPINFO and the STARTF_*, SW_HIDE and STD_*_HANDLE constants are defined only in the Windows build of the module.',
    },
    {
      q: 'Can I reuse one STARTUPINFO for several processes?',
      a: 'Yes. Popen works on a copy of the object it is given, so your object is not changed by the call.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.STARTUPINFO',
    meta:  'subprocess.STARTUPINFO (Windows)',
  },

};
