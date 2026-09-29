// content/reference/python/exceptions/keyboardinterrupt.js

export const meta = {
  slug:        'keyboardinterrupt',
  name:        'KeyboardInterrupt',
  signature:   'KeyboardInterrupt(*args)',
  blurb:       'Raised in the main thread when the user presses Ctrl+C (SIGINT); inherits from BaseException so except Exception does not stop it.',
  category:    'control',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'keyboardinterrupt keyboard interrupt ctrl+c ctrl c control c sigint signal stop program except exception does not catch bare except graceful shutdown',
};

export const method = {
  slug:      'keyboardinterrupt',
  name:      'KeyboardInterrupt',
  signature: 'KeyboardInterrupt(*args)',

  category:    'Control-flow exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Ctrl+C arrives as an exception — deliberately outside Exception, so catch-all error handlers cannot trap the user in a running program.',

  chain: ['BaseException', 'KeyboardInterrupt'],

  cheat: {
    raisedBy: 'Ctrl+C in a terminal (SIGINT), signal.raise_signal(signal.SIGINT)',
    message:  'empty — the traceback ends in a bare KeyboardInterrupt',
    quickFix: 'except KeyboardInterrupt: at the top level, cleanup in finally',
    watchOut: 'a bare except: swallows it and the program will not stop',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Normally none — Python raises it without arguments.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'A loop whose inner except Exception skips bad records. Step bad_at raises ValueError; step stop_at simulates Ctrl+C.',
      params: [
        { name: 'bad_at',  type: 'int', hint: 'step that raises ValueError', input: 'number' },
        { name: 'stop_at', type: 'int', hint: 'step that "presses Ctrl+C"', input: 'number' },
      ],
      template: "log = []\ntry:\n    for i in range(5):\n        try:\n            if i == {$bad_at}:\n                raise ValueError('bad record')\n            if i == {$stop_at}:\n                raise KeyboardInterrupt  # stands in for Ctrl+C\n            log.append(i)\n        except Exception:\n            log.append('skipped')\nexcept KeyboardInterrupt:\n    log.append('stopped')\nlog",
      cases: [
        { id: 'both',  label: 'bad 1, stop 3', values: { bad_at: '1', stop_at: '3' } },
        { id: 'never', label: 'no Ctrl+C',     values: { bad_at: '2', stop_at: '-1' } },
        { id: 'first', label: 'stop at 0',     values: { bad_at: '4', stop_at: '0' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'The usual shape: catch it once at the top, and put cleanup in finally so it runs either way.',
      params: [{ name: 'stop_at', type: 'int', hint: 'step that "presses Ctrl+C"', input: 'number' }],
      template: "log = []\ntry:\n    for i in range(5):\n        if i == {$stop_at}:\n            raise KeyboardInterrupt  # stands in for Ctrl+C\n        log.append(i)\nexcept KeyboardInterrupt:\n    log.append('interrupted')\nfinally:\n    log.append('cleanup')\nlog",
      cases: [
        { id: 'mid',  label: 'stop at 2', values: { stop_at: '2' } },
        { id: 'none', label: 'no Ctrl+C', values: { stop_at: '-1' } },
      ],
    },
  ],
  demoExplainer: "The ValueError at bad_at is 'skipped' and the loop carries on — that is what except Exception is for. The KeyboardInterrupt at stop_at goes straight through the same handler and ends the loop, because KeyboardInterrupt is not an Exception. The demo raises it explicitly; in a real program the interpreter raises it at whatever line is running when you press Ctrl+C.",

  attributes: [
    { name: 'args',          type: 'tuple', meaning: 'Empty when raised by Ctrl+C.' },
    { name: '__traceback__', type: 'traceback | None', meaning: 'Shows the line that was executing when the interrupt arrived — useful for finding where a program hangs.' },
  ],

  patterns: [
    {
      name: 'Graceful exit from a CLI',
      desc: 'Catch it once at the entry point, print a short message instead of a traceback, and exit with a non-zero status.',
      code: "import sys\n\ndef main():\n    ...\n\nif __name__ == '__main__':\n    try:\n        main()\n    except KeyboardInterrupt:\n        print('\\ncancelled', file=sys.stderr)\n        sys.exit(130)",
    },
    {
      name: 'Stop a long loop but keep partial results',
      desc: 'Save what was done, then re-raise so the program still exits as interrupted.',
      code: "results = []\ntry:\n    for item in items:\n        results.append(process(item))\nexcept KeyboardInterrupt:\n    save(results)\n    raise",
    },
    {
      name: 'Handle SIGINT without an exception',
      desc: 'Install a signal handler that sets a flag; the loop finishes the current step and stops cleanly.',
      code: "import signal\n\nstop = False\ndef on_sigint(signum, frame):\n    global stop\n    stop = True\nsignal.signal(signal.SIGINT, on_sigint)\n\nwhile not stop:\n    do_one_step()",
    },
  ],

  examples: [
    { title: 'Not an Exception subclass', code: 'issubclass(KeyboardInterrupt, Exception)', returns: 'False' },
    { title: 'Simulate Ctrl+C with a real SIGINT', code: "import signal\ntry:\n    signal.raise_signal(signal.SIGINT)\nexcept KeyboardInterrupt:\n    r = 'got Ctrl+C'\nr", returns: "'got Ctrl+C'" },
    { title: 'except Exception lets it through', code: "try:\n    try:\n        raise KeyboardInterrupt\n    except Exception:\n        r = 'caught by except Exception'\nexcept KeyboardInterrupt:\n    r = 'reached the outer handler'\nr", returns: "'reached the outer handler'" },
    { title: 'finally still runs', code: "log = []\ntry:\n    try:\n        raise KeyboardInterrupt\n    finally:\n        log.append('files closed')\nexcept KeyboardInterrupt:\n    log.append('interrupted')\nlog", returns: "['files closed', 'interrupted']" },
    { title: 'A custom SIGINT handler replaces it', code: "import signal\nseen = []\nold = signal.signal(signal.SIGINT, lambda signum, frame: seen.append(signum))\nsignal.raise_signal(signal.SIGINT)\nsignal.signal(signal.SIGINT, old)\nseen == [signal.SIGINT]", returns: 'True' },
    { title: 'The default handler is what raises it', code: 'import signal\nsignal.getsignal(signal.SIGINT) is signal.default_int_handler', returns: 'True' },
    { title: 'Uncaught, the last line has no message', code: 'raise KeyboardInterrupt', returns: 'KeyboardInterrupt' },
  ],

  pitfalls: [
    {
      name: 'A bare except makes the program unstoppable',
      desc: 'A retry loop with except: catches Ctrl+C as if it were a failed attempt and keeps going. except Exception lets the interrupt end the loop.',
      wrong: { label: 'bare except', code: "log = []\nfor attempt in range(3):\n    try:\n        raise KeyboardInterrupt  # user presses Ctrl+C\n    except:\n        log.append('retrying')\nlog", output: "['retrying', 'retrying', 'retrying']" },
      fix:   { label: 'except Exception', code: "log = []\ntry:\n    for attempt in range(3):\n        try:\n            raise KeyboardInterrupt  # user presses Ctrl+C\n        except Exception:\n            log.append('retrying')\nexcept KeyboardInterrupt:\n    log.append('stopped')\nlog", output: "['stopped']" },
    },
    {
      name: 'Catching it and carrying on silently',
      desc: 'Swallowing the interrupt hides that the work is incomplete. Clean up, then re-raise (or exit with a non-zero status).',
      wrong: { label: 'swallow', code: "done = []\ndef run():\n    try:\n        for i in range(5):\n            if i == 2:\n                raise KeyboardInterrupt\n            done.append(i)\n    except KeyboardInterrupt:\n        pass\n    return 'finished'\nrun()", output: "'finished'" },
      fix:   { label: 'clean up, re-raise', code: "done = []\ndef run():\n    try:\n        for i in range(5):\n            if i == 2:\n                raise KeyboardInterrupt\n            done.append(i)\n    except KeyboardInterrupt:\n        done.append('partial')\n        raise\n    return 'finished'\ntry:\n    run()\nexcept KeyboardInterrupt:\n    r = done\nr", output: "[0, 1, 'partial']" },
    },
  ],

  when: {
    use: [
      'Top-level except KeyboardInterrupt in a CLI to exit without a traceback',
      'Saving partial progress before re-raising',
      'Recognising it in logs: the traceback shows where the program was when interrupted',
    ],
    avoid: [
      'Catch-all error handling → except Exception (it already excludes Ctrl+C)',
      'Long-running services → handle SIGINT/SIGTERM with signal handlers',
      'Continuing normally after Ctrl+C → the user asked the program to stop',
    ],
  },

  notes: {
    cpython:   'Modules/signalmodule.c — the default SIGINT handler (signal.default_int_handler) raises KeyboardInterrupt in the main thread',
    'Threads': 'Only the main thread receives it; worker threads keep running unless they check a flag or are daemon threads',
    'Timing':  'Signal handlers run between bytecode instructions, so a long call into C code may not be interrupted until it returns',
    'Docs note': 'Because it can arrive at any line, it may leave state inconsistent — the docs advise ending the program as quickly as possible',
  },

  related: [
    { name: 'BaseException',  slug: 'baseexception',  when: 'The except Exception vs bare except rules' },
    { name: 'SystemExit',     slug: 'systemexit',     when: 'The other exit-type BaseException' },
    { name: 'Exception',      slug: 'exception',      when: 'What catch-all handlers should use' },
    { name: 'GeneratorExit',  slug: 'generatorexit',  when: 'Also BaseException-only' },
    { name: 'ExceptionGroup', slug: 'exceptiongroup', when: 'KeyboardInterrupt needs BaseExceptionGroup' },
  ],

  faq: [
    {
      q: 'Why does except Exception not catch KeyboardInterrupt?',
      a: "KeyboardInterrupt inherits directly from BaseException, not Exception — on purpose, so that catch-all error handlers do not prevent the user from stopping the program with Ctrl+C. Catch it explicitly with except KeyboardInterrupt, or use except BaseException if you really mean everything.",
    },
    {
      q: 'How do I exit cleanly when the user presses Ctrl+C?',
      a: "Wrap the entry point: try: main() except KeyboardInterrupt: print a short message and sys.exit(130) (130 is the shell convention for termination by SIGINT). Put resource cleanup in finally or with blocks so it runs no matter how the program ends.",
    },
    {
      q: 'Why does Ctrl+C not stop my program?',
      a: "Usually a bare except: or except BaseException: somewhere catches the KeyboardInterrupt and carries on. Other causes: the main thread is blocked in a C call that does not check for signals, the interrupt was delivered to the main thread while work runs in other threads, or the code replaced the SIGINT handler with signal.signal.",
    },
    {
      q: 'Can I raise KeyboardInterrupt from code?',
      a: 'Yes: raise KeyboardInterrupt, or send a real SIGINT with signal.raise_signal(signal.SIGINT) (Python 3.8+) or os.kill(os.getpid(), signal.SIGINT) on Unix. That is handy for testing Ctrl+C handling.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#KeyboardInterrupt',
    meta:  'Built-in exceptions',
  },
};
