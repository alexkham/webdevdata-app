// content/reference/python/stdlib/os/nice.js

export const meta = {
  slug:        'nice',
  name:        'os.nice',
  signature:   'os.nice(increment, /) / os.getpriority(which, who) / os.setpriority(which, who, priority)',
  blurb:       'Make a process nicer to others: nice() adds to the niceness of the current process, getpriority / setpriority read and set it for a process, process group or user (PRIO_PROCESS, PRIO_PGRP, PRIO_USER). Unix only.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (getpriority / setpriority / PRIO_* 3.3+)',
  searchTerms: 'os.nice nice niceness process priority python lower priority background job os.getpriority getpriority os.setpriority setpriority os.PRIO_PROCESS PRIO_PROCESS os.PRIO_PGRP PRIO_PGRP os.PRIO_USER PRIO_USER renice -20 19 BELOW_NORMAL_PRIORITY_CLASS psutil nice',
};

export const method = {
  slug:      'nice',
  name:      'os.nice',
  signature: 'os.nice(increment, /) / os.getpriority(which, who) / os.setpriority(which, who, priority)',
  returns:   { type: 'int', desc: 'nice: the new niceness. getpriority: the current niceness. setpriority: None.' },

  category:    'os function',
  version:     'Python 3.0+ (getpriority / setpriority / PRIO_* 3.3+)',
  hasLiveDemo: false,

  subtitle: 'Niceness runs from -20 (most favoured) to 19 (least); 0 is the default. Raising it is always allowed, lowering it needs privileges, and the value is clamped at 19. Unix only (not WASI): Windows has priority classes instead (subprocess.BELOW_NORMAL_PRIORITY_CLASS and friends).',

  covers: ['nice', 'getpriority', 'setpriority', 'PRIO_PGRP', 'PRIO_PROCESS', 'PRIO_USER'],

  cheat: {
    commonCall: 'os.nice(10)',
    returns:    'the new niceness, e.g. 10',
    replaces:   'starting the script with the nice / renice commands',
    watchOut:   'Higher niceness = LOWER priority; you cannot lower it back without privileges',
  },

  parameters: [
    { name: 'increment', type: 'int', required: true, default: null, desc: 'nice only: added to the current niceness (negative needs privileges).' },
    { name: 'which',     type: 'int', required: true, default: null, desc: 'PRIO_PROCESS, PRIO_PGRP or PRIO_USER: what kind of id who is.' },
    { name: 'who',       type: 'int', required: true, default: null, desc: 'A pid, process group id or uid; 0 means the calling process, its group, or its real user.' },
    { name: 'priority',  type: 'int', required: true, default: null, desc: 'setpriority only: the absolute niceness, -20 to 19.' },
  ],

  patterns: [
    {
      name: 'Run a batch job in the background',
      desc: 'Make yourself nicer at start-up so interactive work stays responsive.',
      code: "import os\nif hasattr(os, 'nice'):\n    os.nice(10)",
    },
    {
      name: 'Lower the priority of a child only',
      desc: 'Your own priority stays the same; Unix uses the nice command, Windows a creation flag.',
      code: "import os, subprocess, sys\nif sys.platform == 'win32':\n    subprocess.run(['job'], creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS)\nelse:\n    subprocess.run(['nice', '-n', '10', 'job'])",
    },
    {
      name: 'Read and set another process',
      desc: 'Absolute values with getpriority / setpriority.',
      code: 'import os\ncurrent = os.getpriority(os.PRIO_PROCESS, pid)\nos.setpriority(os.PRIO_PROCESS, pid, min(19, current + 5))',
    },
  ],

  examples: [
    { title: 'Unix only',                        code: "import os\nall(hasattr(os, n) == (os.name == 'posix') for n in ('nice', 'getpriority', 'setpriority', 'PRIO_PROCESS'))", returns: 'True' },
    { title: 'Niceness range',                   code: 'lowest, highest = -20, 19\nlen(range(lowest, highest + 1))', returns: '40' },
    { title: 'nice() adds, setpriority() sets',  code: 'current, increment = 5, 10\n(current + increment, increment)', returns: '(15, 10)' },
    { title: 'The value is clamped at 19',       code: 'current = 5\nmin(19, current + 25)', returns: '19' },
    { title: 'Windows has priority classes instead', code: "import subprocess, sys\nhasattr(subprocess, 'BELOW_NORMAL_PRIORITY_CLASS') == (sys.platform == 'win32')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Thinking a higher number means higher priority',
      desc: 'Niceness is how nice you are to others: 19 gets the least CPU, -20 the most. Pick the most favoured process with min, not max.',
      wrong: { label: 'max niceness', code: "procs = {'backup': 19, 'web': 0, 'db': -5}\nmax(procs, key=procs.get)", output: "'backup'" },
      fix:   { label: 'min niceness', code: "procs = {'backup': 19, 'web': 0, 'db': -5}\nmin(procs, key=procs.get)", output: "'db'" },
    },
    {
      name: 'Passing an absolute value to nice()',
      desc: 'nice(10) adds 10 to the current niceness; it does not set it to 10. Use setpriority for an absolute value. (On Linux, a process at niceness 5 that calls os.nice(10) ends at 15.)',
      wrong: { label: 'treat as absolute', code: 'current = 5\nincrement = 10\nexpected = increment\nexpected == current + increment', output: 'False' },
      fix:   { label: 'it is relative', code: 'current = 5\nincrement = 10\nmin(19, current + increment)', output: '15' },
    },
  ],

  when: {
    use: [
      'Long batch jobs, builds, backups that should not slow down interactive work',
      'Supervisors that adjust the priority of their workers',
    ],
    avoid: [
      'Windows → subprocess creationflags=BELOW_NORMAL_PRIORITY_CLASS / IDLE_PRIORITY_CLASS, or psutil',
      'Real-time scheduling → os.sched_setscheduler with SCHED_FIFO / SCHED_RR',
      'I/O priority → the ionice command or psutil (os has no ionice)',
    ],
  },

  notes: {
    cpython:        'nice wraps nice(2); getpriority / setpriority wrap the C functions of the same name. On Linux getpriority(PRIO_PROCESS, 0) returns the niceness itself (19 after os.nice(25) in our check)',
    'Availability': 'Unix, not WASI (nice, getpriority, setpriority, PRIO_PROCESS, PRIO_PGRP, PRIO_USER). macOS adds PRIO_DARWIN_THREAD / PRIO_DARWIN_PROCESS / PRIO_DARWIN_BG / PRIO_DARWIN_NONUI (3.12+)',
    'Permissions':  'Raising niceness is always allowed; lowering it (even back to the start value) raises PermissionError without privileges, as our Linux check confirmed',
    'Linux values': 'PRIO_PROCESS == 0, PRIO_PGRP == 1, PRIO_USER == 2',
  },

  related: [
    { name: 'os.sched_setscheduler', slug: 'sched', when: 'Real-time policies and CPU affinity' },
    { name: 'os.cpu_count', slug: 'cpu_count', when: 'How many CPUs there are' },
    { name: 'os.getpid', slug: 'getpid', when: 'Ids to pass as who' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'What lowering niceness raises', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why do the examples not call os.nice?',
      a: 'os.nice, getpriority, setpriority and the PRIO_* constants are Unix only (docs: Availability: Unix, not WASI), and nice() changes the priority of the whole process for good. The examples show the rules with plain numbers.',
    },
    {
      q: 'How do I lower the priority of a Python process?',
      a: 'os.nice(10) on Unix (the return value is the new niceness). On Windows start the process with subprocess creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS or use psutil.',
    },
    {
      q: 'Why does os.nice(-5) raise PermissionError?',
      a: 'Making a process less nice (higher priority) needs root or CAP_SYS_NICE. Without it, you can only increase niceness.',
    },
    {
      q: 'What is the difference between os.nice and os.setpriority?',
      a: 'nice(increment) adds to the niceness of the calling process. setpriority(which, who, priority) sets an absolute value for any process, process group or user you are allowed to change.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.nice',
    meta:  'os.nice / getpriority / setpriority',
  },
};
