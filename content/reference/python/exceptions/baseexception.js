// content/reference/python/exceptions/baseexception.js

export const meta = {
  slug:        'baseexception',
  name:        'BaseException',
  signature:   'BaseException(*args)',
  blurb:       'The root of every Python exception: defines args, str(), tracebacks, chaining and notes for all of them.',
  category:    'base',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'baseexception base exception root hierarchy args __traceback__ __cause__ __context__ __suppress_context__ __notes__ add_note with_traceback bare except catch all exception vs baseexception',
};

export const method = {
  slug:      'baseexception',
  name:      'BaseException',
  signature: 'BaseException(*args)',

  category:    'Base class',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Every exception inherits args, tracebacks, chaining and notes from here — but your own exceptions should subclass Exception, not this.',

  chain: ['BaseException'],

  cheat: {
    raisedBy: 'nothing directly — it is the root class',
    message:  "str(e): '' for no args, the arg for one, repr(args) for more",
    quickFix: 'Subclass Exception; catch Exception, not BaseException',
    watchOut: 'bare except: and except BaseException also catch Ctrl+C and sys.exit()',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Any positional arguments, stored unchanged in e.args. Keyword arguments are rejected: BaseException() takes no keyword arguments.' },
  ],

  modes: [
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Build an exception from comma-separated arguments and compare e.args with str(e).',
      params: [{ name: 'args', type: 'list[str]', hint: 'comma-separated, empty for none', input: 'csv' }],
      template: 'e = BaseException(*{$args})\n(e.args, str(e))',
      cases: [
        { id: 'one',  label: 'one arg',   values: { args: 'disk full' } },
        { id: 'two',  label: 'two args',  values: { args: 'disk full, /tmp' } },
        { id: 'none', label: 'no args',   values: { args: '' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Which clause catches it? Only ValueError is an Exception; the other three sit directly under BaseException.',
      params: [{ name: 'name', type: 'str', hint: 'class to raise', input: 'text' }],
      template: "kinds = {'ValueError': ValueError, 'KeyboardInterrupt': KeyboardInterrupt,\n         'SystemExit': SystemExit, 'GeneratorExit': GeneratorExit}\ntry:\n    try:\n        raise kinds[{$name}]('stop')\n    except Exception:\n        caught = 'except Exception'\nexcept BaseException:\n    caught = 'except BaseException'\ncaught",
      cases: [
        { id: 'value', label: 'ValueError',        values: { name: 'ValueError' } },
        { id: 'kbd',   label: 'KeyboardInterrupt', values: { name: 'KeyboardInterrupt' } },
        { id: 'exit',  label: 'SystemExit',        values: { name: 'SystemExit' } },
        { id: 'gen',   label: 'GeneratorExit',     values: { name: 'GeneratorExit' } },
      ],
    },
  ],
  demoExplainer: "In Raise, watch str(e) change shape: one argument prints as itself, two print as the repr of the whole tuple, none prints as an empty string. In Handle, KeyboardInterrupt, SystemExit and GeneratorExit all fall through except Exception — that is exactly why they inherit from BaseException. Type an unknown name and the KeyError from the dict lookup is caught by except Exception instead.",

  attributes: [
    { name: 'args',                 type: 'tuple', meaning: 'The positional constructor arguments, unchanged. str(e) is built from it.' },
    { name: '__traceback__',        type: 'traceback | None', meaning: 'The traceback object; None until the exception is raised. Writable.' },
    { name: '__cause__',            type: 'BaseException | None', meaning: 'Explicit chaining — set by raise NewError(...) from original.' },
    { name: '__context__',          type: 'BaseException | None', meaning: 'Implicit chaining — the exception that was being handled when this one was raised. Set automatically.' },
    { name: '__suppress_context__', type: 'bool', meaning: 'True after raise ... from ... (including from None): the traceback then hides __context__.' },
    { name: '__notes__',            type: 'list[str]', meaning: 'Extra lines shown after the message in the traceback. Created by the first add_note() call (3.11+).' },
    { name: 'add_note(note)',       type: 'method', meaning: 'Append a string to __notes__. A non-string raises TypeError. (3.11+)' },
    { name: 'with_traceback(tb)',   type: 'method', meaning: 'Set __traceback__ to tb and return the same exception object.' },
  ],

  patterns: [
    {
      name: 'Top-level catch that still lets Ctrl+C through',
      desc: 'Catch Exception for "anything went wrong" handling. KeyboardInterrupt and SystemExit keep working because they are not Exceptions.',
      code: "try:\n    run()\nexcept Exception as e:\n    log.error('run failed: %r', e)",
    },
    {
      name: 'Chain on purpose with from',
      desc: 'Translate a low-level error but keep it visible as __cause__ ("The above exception was the direct cause of…").',
      code: "try:\n    cfg = json.loads(text)\nexcept ValueError as e:\n    raise ConfigError('config.json is not valid JSON') from e",
    },
    {
      name: 'Add context with a note (3.11+)',
      desc: 'Attach where the error happened without changing its type or message, then re-raise.',
      code: "for n, line in enumerate(lines, 1):\n    try:\n        parse(line)\n    except ValueError as e:\n        e.add_note(f'line {n}: {line!r}')\n        raise",
    },
    {
      name: 'Clean up on anything, then re-raise',
      desc: 'The one legitimate use of except BaseException: run cleanup and re-raise, so Ctrl+C and sys.exit() still work.',
      code: "try:\n    work()\nexcept BaseException:\n    rollback()\n    raise",
    },
  ],

  examples: [
    { title: 'args keeps every argument', code: "ValueError('bad size', 42).args", returns: "('bad size', 42)" },
    { title: 'str() depends on how many args', code: "[str(Exception()), str(Exception('x')), str(Exception('x', 1))]", returns: "['', 'x', \"('x', 1)\"]" },
    { title: 'Notes appear under the message', code: "e = ValueError('bad row')\ne.add_note('while reading line 3')\nraise e", returns: 'ValueError: bad row\nwhile reading line 3' },
    { title: 'raise ... from sets __cause__', code: "try:\n    try:\n        int('x')\n    except ValueError as e:\n        raise RuntimeError('config broken') from e\nexcept RuntimeError as err:\n    r = (type(err.__cause__).__name__, err.__suppress_context__)\nr", returns: "('ValueError', True)" },
    { title: 'Raising inside except sets __context__', code: "try:\n    try:\n        {}['k']\n    except KeyError:\n        raise ValueError('lookup failed')\nexcept ValueError as err:\n    r = (repr(err.__context__), err.__cause__)\nr", returns: "(\"KeyError('k')\", None)" },
    { title: 'except Exception misses KeyboardInterrupt', code: "try:\n    try:\n        raise KeyboardInterrupt\n    except Exception:\n        r = 'Exception'\nexcept BaseException as e:\n    r = type(e).__name__\nr", returns: "'KeyboardInterrupt'" },
    { title: '__traceback__ is None until raised', code: "e = ValueError('x')\nbefore = e.__traceback__\ntry:\n    raise e\nexcept ValueError:\n    after = type(e.__traceback__).__name__\n(before, after)", returns: "(None, 'traceback')" },
    { title: 'with_traceback returns the same object', code: "e = ValueError('x')\ne.with_traceback(None) is e", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'A bare except swallows sys.exit()',
      desc: 'except: (and except BaseException:) catches SystemExit, so the program keeps running after it asked to exit. except Exception lets it through.',
      wrong: { label: 'bare except', code: "import sys\ndef main():\n    try:\n        sys.exit(2)\n    except:\n        return 'kept running'\nmain()", output: "'kept running'" },
      fix:   { label: 'except Exception', code: "import sys\ndef main():\n    try:\n        sys.exit(2)\n    except Exception:\n        return 'kept running'\ntry:\n    main()\nexcept SystemExit as e:\n    r = f'exiting with status {e.code}'\nr", output: "'exiting with status 2'" },
    },
    {
      name: 'Custom exceptions derived from BaseException',
      desc: 'Frameworks and libraries catch Exception for error handling. An error class derived from BaseException slips past all of them.',
      wrong: { label: '(BaseException)', code: "class AppError(BaseException):\n    pass\ntry:\n    try:\n        raise AppError('db down')\n    except Exception:\n        r = 'handled'\nexcept BaseException as e:\n    r = f'escaped: {e!r}'\nr", output: "\"escaped: AppError('db down')\"" },
      fix:   { label: '(Exception)', code: "class AppError(Exception):\n    pass\ntry:\n    try:\n        raise AppError('db down')\n    except Exception:\n        r = 'handled'\nexcept BaseException as e:\n    r = f'escaped: {e!r}'\nr", output: "'handled'" },
    },
    {
      name: 'Logging str(e) can log nothing',
      desc: 'An exception raised without arguments has an empty str(). Log repr(e) (or the type name) so the log line says what happened.',
      wrong: { label: "f'{e}'", code: "try:\n    raise TimeoutError\nexcept Exception as e:\n    msg = f'failed: {e}'\nmsg", output: "'failed: '" },
      fix:   { label: "f'{e!r}'", code: "try:\n    raise TimeoutError\nexcept Exception as e:\n    msg = f'failed: {e!r}'\nmsg", output: "'failed: TimeoutError()'" },
    },
  ],

  when: {
    use: [
      'Reading the shared attributes: args, __cause__, __context__, __notes__, __traceback__',
      'except BaseException: only to clean up and re-raise',
      'Type hints for code that accepts any exception object (loggers, reporters)',
    ],
    avoid: [
      'Base class for your own errors → subclass Exception',
      'Catch-all error handling → except Exception',
      'Bare except: — it is except BaseException in disguise',
    ],
  },

  notes: {
    cpython:        'Objects/exceptions.c — BaseException_str: empty for no args, str(args[0]) for one, str(args) otherwise',
    'Direct subclasses': 'Exception, BaseExceptionGroup, GeneratorExit, KeyboardInterrupt, SystemExit',
    'Bare except':  'except: catches exactly what except BaseException: catches',
    'Traceback display': '__cause__ is shown as "direct cause", __context__ as "During handling of the above exception…" unless __suppress_context__ is True',
  },

  related: [
    { name: 'Exception',         slug: 'exception',         when: 'The class to subclass and to catch' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'Ctrl+C — a BaseException, not an Exception' },
    { name: 'SystemExit',        slug: 'systemexit',        when: 'sys.exit() — also skips except Exception' },
    { name: 'GeneratorExit',     slug: 'generatorexit',     when: 'Sent into a generator by close()' },
    { name: 'ExceptionGroup',    slug: 'exceptiongroup',    when: 'BaseExceptionGroup is the other direct subclass' },
    { name: 'isinstance',        slug: 'isinstance',        when: 'The same check an except clause does', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between except Exception and a bare except?',
      a: 'A bare except: catches everything derived from BaseException — including KeyboardInterrupt (Ctrl+C), SystemExit (sys.exit()) and GeneratorExit. except Exception catches only ordinary errors and lets those three through, so the program can still be interrupted and can still exit. Use except Exception for catch-all handling; use a bare except or except BaseException only when you re-raise.',
    },
    {
      q: 'Should my custom exception inherit from BaseException or Exception?',
      a: 'Exception. The docs say BaseException is not meant to be directly inherited by user-defined classes. Code everywhere catches Exception for error handling, and an error derived straight from BaseException would slip past it like Ctrl+C does.',
    },
    {
      q: 'What is the difference between __cause__ and __context__?',
      a: '__context__ is set automatically when an exception is raised while another one is being handled. __cause__ is set explicitly with raise New(...) from old, which also sets __suppress_context__ to True. raise New(...) from None sets __cause__ to None and suppresses the context, hiding the original from the traceback.',
    },
    {
      q: 'How do I add extra information to an exception without changing it?',
      a: "Since Python 3.11, call e.add_note('some context') and re-raise. The note is stored in e.__notes__ and printed on its own line below the exception message in the traceback. On older versions, wrap it in a new exception with raise ... from e.",
    },
    {
      q: 'Why is str(e) empty?',
      a: "The exception was created with no arguments (raise TimeoutError, raise MyError()). str() of an exception is built from e.args, and an empty args gives ''. Use repr(e) or type(e).__name__ when logging.",
    },
  ],

  history: [
    { version: '3.11', note: 'add_note() and the __notes__ attribute were added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#BaseException',
    meta:  'Built-in exceptions',
  },
};
