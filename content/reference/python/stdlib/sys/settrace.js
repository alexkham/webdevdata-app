// content/reference/python/stdlib/sys/settrace.js — tracing and profiling hooks

export const meta = {
  slug:        'settrace',
  name:        'sys.settrace / setprofile / gettrace / getprofile / call_tracing',
  signature:   'sys.settrace(tracefunc) · sys.setprofile(profilefunc) · sys.gettrace() · sys.getprofile() · sys.call_tracing(func, args)',
  blurb:       'Install a Python function that the interpreter calls on every call, line, return and exception — the mechanism behind pdb, coverage tools and profilers. sys.monitoring (3.12+) is the faster successor.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'All versions (sys.monitoring 3.12+)',
  searchTerms: 'sys.settrace settrace sys.setprofile setprofile sys.gettrace gettrace sys.getprofile getprofile sys.call_tracing call_tracing sys.monitoring monitoring trace function python debugger coverage profiler line events call return exception c_call frame f_trace',
};

export const method = {
  slug:      'settrace',
  name:      'sys.settrace / setprofile / gettrace / getprofile / call_tracing',
  signature: 'sys.settrace(tracefunc) · sys.setprofile(profilefunc) · sys.gettrace() · sys.getprofile() · sys.call_tracing(func, args)',
  returns:   { type: 'None · callable | None', desc: 'set… return None; get… return the installed function or None; call_tracing returns func(*args).' },

  category:    'sys function',
  version:     'All versions (sys.monitoring 3.12+)',
  hasLiveDemo: false,

  subtitle: "A trace function receives (frame, event, arg) for 'call', 'line', 'return', 'exception' and (on request) 'opcode' events; a profile function gets 'call'/'return' plus 'c_call'/'c_return'/'c_exception' for built-ins. Both are per thread and slow everything down — they are tools for tools.",

  covers: ['settrace', 'setprofile', 'gettrace', 'getprofile', 'call_tracing'],

  cheat: {
    commonCall: 'sys.settrace(tracer)  …  sys.settrace(None)',
    returns:    'None; the tracer is called for every new frame',
    replaces:   'Hand-inserted print statements to follow execution',
    watchOut:   "The global tracer's return value is the local tracer — return None and you get no 'line' events",
  },

  parameters: [
    { name: 'tracefunc / profilefunc', type: 'callable | None', required: true, default: null, desc: 'Called as f(frame, event, arg). None removes it.' },
    { name: 'func, args', type: 'callable, tuple', required: true, default: null, desc: 'call_tracing: call func(*args) with tracing re-enabled from inside a trace function.' },
  ],

  patterns: [
    {
      name: 'Trace one function, then switch off',
      desc: 'Always remove the tracer in finally.',
      code: "import sys\ndef tracer(frame, event, arg):\n    print(event, frame.f_code.co_name, frame.f_lineno)\n    return tracer\nsys.settrace(tracer)\ntry:\n    suspicious()\nfinally:\n    sys.settrace(None)",
    },
    {
      name: 'All threads',
      desc: 'settrace affects only the calling thread; threading.settrace sets it for threads started afterwards.',
      code: 'import sys, threading\nthreading.settrace(tracer)\nsys.settrace(tracer)',
    },
    {
      name: 'Low-overhead events with sys.monitoring (3.12+)',
      desc: 'Register a tool id and only the events you need.',
      code: "import sys\nmon = sys.monitoring\nmon.use_tool_id(mon.PROFILER_ID, 'my-profiler')\nmon.register_callback(mon.PROFILER_ID, mon.events.PY_START, on_start)\nmon.set_events(mon.PROFILER_ID, mon.events.PY_START)",
    },
  ],

  examples: [
    { title: 'Every line of a call',     code: "import sys\nevents = []\ndef tracer(frame, event, arg):\n    events.append((event, frame.f_code.co_name))\n    return tracer\ndef f(x):\n    y = x + 1\n    return y\nsys.settrace(tracer)\ntry:\n    f(1)\nfinally:\n    sys.settrace(None)\nevents", returns: "[('call', 'f'), ('line', 'f'), ('line', 'f'), ('return', 'f')]" },
    { title: 'A profiler also sees built-ins', code: "import sys\nevents = []\ndef profiler(frame, event, arg):\n    name = arg.__name__ if event.startswith('c_') else frame.f_code.co_name\n    events.append((event, name))\ndef g(s):\n    return len(s)\nsys.setprofile(profiler)\ntry:\n    g('abc')\nfinally:\n    sys.setprofile(None)\nevents", returns: "[('call', 'g'), ('c_call', 'len'), ('c_return', 'len'), ('return', 'g'), ('c_call', 'setprofile')]" },
    { title: 'Nothing installed by default', code: 'import sys\n(sys.gettrace(), sys.getprofile())', returns: '(None, None)' },
    { title: 'gettrace returns what you set', code: 'import sys\ndef tracer(frame, event, arg):\n    return None\nsys.settrace(tracer)\ntry:\n    same = sys.gettrace() is tracer\nfinally:\n    sys.settrace(None)\nsame', returns: 'True' },
    { title: 'call_tracing just calls the function here', code: 'import sys\nsys.call_tracing(pow, (2, 10))', returns: '1024' },
    { title: 'sys.monitoring: count function starts', code: "import sys\nmon = sys.monitoring\nTOOL = mon.PROFILER_ID\nstarts = []\ndef on_start(code, offset):\n    starts.append(code.co_name)\ndef f():\n    pass\nmon.use_tool_id(TOOL, 'demo')\ntry:\n    mon.register_callback(TOOL, mon.events.PY_START, on_start)\n    mon.set_events(TOOL, mon.events.PY_START)\n    f()\n    f()\nfinally:\n    mon.set_events(TOOL, 0)\n    mon.register_callback(TOOL, mon.events.PY_START, None)\n    mon.free_tool_id(TOOL)\nstarts", returns: "['f', 'f']" },
    { title: 'The predefined tool ids', code: 'import sys\nm = sys.monitoring\n(m.DEBUGGER_ID, m.COVERAGE_ID, m.PROFILER_ID, m.OPTIMIZER_ID)', returns: '(0, 1, 2, 5)' },
  ],

  pitfalls: [
    {
      name: 'Returning None from the global tracer',
      desc: "The return value of the 'call' event becomes the frame's local tracer. Return None and the frame gets no 'line' or 'return' events.",
      wrong: { label: 'return None', code: "import sys\nevents = []\ndef tracer(frame, event, arg):\n    events.append(event)\ndef f():\n    return 1\nsys.settrace(tracer)\ntry:\n    f()\nfinally:\n    sys.settrace(None)\nevents", output: "['call']" },
      fix:   { label: 'return tracer', code: "import sys\nevents = []\ndef tracer(frame, event, arg):\n    events.append(event)\n    return tracer\ndef f():\n    return 1\nsys.settrace(tracer)\ntry:\n    f()\nfinally:\n    sys.settrace(None)\nevents", output: "['call', 'line', 'return']" },
    },
    {
      name: 'Expecting settrace to cover other threads',
      desc: 'The tracer belongs to the thread that installed it. threading.settrace installs it in threads started later.',
      wrong: { label: 'sys.settrace', code: "import sys, threading\nseen = set()\ndef tracer(frame, event, arg):\n    seen.add(frame.f_code.co_name)\ndef work():\n    pass\nsys.settrace(tracer)\ntry:\n    t = threading.Thread(target=work)\n    t.start()\n    t.join()\nfinally:\n    sys.settrace(None)\n'work' in seen", output: 'False' },
      fix:   { label: 'threading.settrace', code: "import threading\nseen = set()\ndef tracer(frame, event, arg):\n    seen.add(frame.f_code.co_name)\ndef work():\n    pass\nthreading.settrace(tracer)\ntry:\n    t = threading.Thread(target=work)\n    t.start()\n    t.join()\nfinally:\n    threading.settrace(None)\n'work' in seen", output: 'True' },
    },
  ],

  when: {
    use: [
      'Writing debuggers, coverage tools, call tracers and simple profilers',
      'One-off investigations of which code runs, in what order',
    ],
    avoid: [
      'Profiling → cProfile (on sys.monitoring since 3.12), profile (on setprofile) or a sampling profiler',
      'Coverage → coverage.py',
      'New tools on 3.12+ → sys.monitoring, which costs nothing for events you do not request',
    ],
  },

  notes: {
    cpython:          'Implemented on top of the PEP 669 monitoring machinery since 3.12 (Python/legacy_tracing.c); the tracer is disabled while it runs, which is what call_tracing works around',
    'Errors':         'An exception inside the trace function unsets it, as if settrace(None) had been called',
    'Line events':    "Per-line events can be turned off per frame with frame.f_trace_lines = False; 'opcode' events need frame.f_trace_opcodes = True",
    'sys.monitoring': 'A namespace (3.12+) with tool ids, events and callbacks; it is not a separate importable module, so access it as sys.monitoring',
  },

  related: [
    { name: 'sys.setrecursionlimit', slug: 'setrecursionlimit', when: 'The depth limit on the calls you trace' },
    { name: 'sys.audit',  slug: 'audit',      when: 'Hooks for interpreter events rather than code execution' },
    { name: 'sys.excepthook', slug: 'excepthook', when: 'React to uncaught exceptions only' },
    { name: 'breakpoint()', slug: 'breakpoint', when: 'Start the debugger built on settrace', category: 'functions' },
    { name: 'sys module', slug: 'sys',        when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between sys.settrace and sys.setprofile?',
      a: "settrace is for debuggers and coverage: it can get an event for every line. setprofile is for profilers: it only gets call and return events, but also for C functions (c_call, c_return, c_exception), and its return value is ignored.",
    },
    {
      q: 'Why does my trace function not see any lines?',
      a: "For the 'call' event it must return the function to use as the frame's local tracer (often itself). Returning None turns tracing off for that frame.",
    },
    {
      q: 'What is sys.monitoring?',
      a: 'The PEP 669 event API added in Python 3.12. Tools claim an id (DEBUGGER_ID, COVERAGE_ID, PROFILER_ID …), register callbacks and enable only the events they need, which is much faster than settrace for coverage and profiling.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.settrace',
    meta:  'sys.settrace',
  },
};
