// content/reference/python/exceptions/exception.js

export const meta = {
  slug:        'exception',
  name:        'Exception',
  signature:   'Exception(*args)',
  blurb:       'The base class of every ordinary error — the one to subclass for your own exceptions and the one to catch in catch-all handlers.',
  category:    'base',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'exception base class custom exception subclass user defined exception catch all except exception as e raise exception generic error class myerror',
};

export const method = {
  slug:      'exception',
  name:      'Exception',
  signature: 'Exception(*args)',

  category:    'Base class',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Subclass it for your own errors and catch it for "anything went wrong" — it deliberately excludes Ctrl+C and sys.exit().',

  chain: ['BaseException', 'Exception'],

  cheat: {
    raisedBy: 'raise Exception(msg) — better: a specific subclass',
    message:  "whatever you pass: str(e) is the single arg, or repr(args)",
    quickFix: 'class MyError(Exception): pass — then raise MyError(...)',
    watchOut: 'except Exception around a big block hides your own bugs',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. All arguments are kept in e.args; no keyword arguments.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'except Exception catches whatever int() raises and reports it. Try something that is not a number.',
      params: [{ name: 'text', type: 'str', hint: 'string to convert', input: 'text' }],
      template: "def to_int(s):\n    try:\n        return int(s)\n    except Exception as e:\n        return f'{type(e).__name__}: {e}'\nto_int({$text})",
      cases: [
        { id: 'ok',     label: 'number',  values: { text: ' 42 ' } },
        { id: 'word',   label: 'word',    values: { text: 'forty-two' } },
        { id: 'float',  label: 'float',   values: { text: '4.2' } },
        { id: 'empty',  label: 'empty',   values: { text: '' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'A custom exception: subclass Exception, build the message with super().__init__, keep the details as attributes.',
      params: [
        { name: 'key',     type: 'str', hint: 'config key',  input: 'text' },
        { name: 'problem', type: 'str', hint: 'what is wrong', input: 'text' },
      ],
      template: "class ConfigError(Exception):\n    def __init__(self, key, problem):\n        super().__init__(f'{key}: {problem}')\n        self.key = key\ne = ConfigError({$key}, {$problem})\n(str(e), e.key, isinstance(e, Exception))",
      cases: [
        { id: 'port',    label: 'port',    values: { key: 'port', problem: 'must be 1-65535' } },
        { id: 'missing', label: 'missing', values: { key: 'db_url', problem: 'not set' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Handlers are tried top to bottom and the first match wins, so the most specific class goes first.',
      params: [{ name: 'name', type: 'str', hint: 'class to raise', input: 'text' }],
      template: "class AppError(Exception): pass\nclass NotFound(AppError): pass\nkinds = {'NotFound': NotFound, 'AppError': AppError, 'ValueError': ValueError}\ntry:\n    raise kinds[{$name}]('x')\nexcept NotFound:\n    r = 'NotFound handler'\nexcept AppError:\n    r = 'AppError handler'\nexcept Exception:\n    r = 'Exception handler'\nr",
      cases: [
        { id: 'nf',    label: 'NotFound',   values: { name: 'NotFound' } },
        { id: 'app',   label: 'AppError',   values: { name: 'AppError' } },
        { id: 'value', label: 'ValueError', values: { name: 'ValueError' } },
      ],
    },
  ],
  demoExplainer: "In Trigger the catch-all turns every failure into a string — convenient, but notice it reports ValueError for '4.2' just as happily as for a typo; the same clause would also swallow a bug in your own code. In Handle, NotFound is caught by the first clause even though it is also an AppError and an Exception: order matters, specific first.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'Constructor arguments. A custom __init__ should pass the message to super().__init__ so args and str(e) stay meaningful.' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'Set by raise MyError(...) from original — keeps the low-level error in the traceback.' },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised.' },
    { name: '__notes__',   type: 'list[str]', meaning: 'Notes added with add_note() (3.11+).' },
  ],

  patterns: [
    {
      name: 'One base class per library',
      desc: 'Callers can catch everything from your package with one except, or a single case precisely.',
      code: "class PaymentError(Exception):\n    \"\"\"Base class for this package.\"\"\"\n\nclass CardDeclined(PaymentError):\n    pass\n\nclass GatewayTimeout(PaymentError):\n    pass",
    },
    {
      name: 'Custom exception with data',
      desc: 'Pass a readable message to super().__init__ and keep machine-readable details as attributes.',
      code: "class HTTPError(Exception):\n    def __init__(self, status, url):\n        super().__init__(f'{status} for {url}')\n        self.status = status\n        self.url = url",
    },
    {
      name: 'Catch-all at the boundary only',
      desc: 'A broad except Exception belongs at the top of a request, job or thread — log with the traceback and move on.',
      code: "for job in jobs:\n    try:\n        job.run()\n    except Exception:\n        logger.exception('job %s failed', job.id)",
    },
  ],

  examples: [
    { title: 'Custom exception in two lines', code: "class QuotaExceeded(Exception):\n    pass\ntry:\n    raise QuotaExceeded('limit is 100 requests')\nexcept QuotaExceeded as e:\n    r = str(e)\nr", returns: "'limit is 100 requests'" },
    { title: 'Uncaught custom exception', code: "class QuotaExceeded(Exception):\n    pass\nraise QuotaExceeded('limit is 100 requests')", returns: 'QuotaExceeded: limit is 100 requests' },
    { title: 'Most built-in errors are Exceptions', code: "[issubclass(c, Exception) for c in (ValueError, KeyError, OSError, KeyboardInterrupt)]", returns: '[True, True, True, False]' },
    { title: 'Catching the base catches subclasses', code: "class AppError(Exception): pass\nclass NotFound(AppError): pass\ntry:\n    raise NotFound('user 7')\nexcept AppError as e:\n    r = f'{type(e).__name__}: {e}'\nr", returns: "'NotFound: user 7'" },
    { title: 'Forgetting super().__init__ loses args', code: "class BadError(Exception):\n    def __init__(self, code):\n        self.code = code\ne = BadError(404)\n(e.args, str(e))", returns: "((404,), '404')" },
    { title: 'Several args show as a tuple', code: "str(Exception('not found', 404))", returns: "\"('not found', 404)\"" },
    { title: 'Keyword arguments are rejected', code: "Exception(message='x')", returns: 'TypeError: Exception() takes no keyword arguments' },
  ],

  pitfalls: [
    {
      name: 'A wide except Exception hides bugs',
      desc: 'The handler was meant for bad input, but it also catches the NameError from using the wrong variable name — the function silently returns the fallback forever.',
      wrong: { label: 'Wide catch-all', code: "def price(item):\n    try:\n        return round(float(item['price']) * 1.2, 2)\n    except Exception:\n        return 0.0\ndef total(items):\n    try:\n        return sum(price(i) for i in cart)  # wrong name\n    except Exception:\n        return 0.0\ntotal([{'price': '10'}])", output: '0.0' },
      fix:   { label: 'Specific exceptions', code: "def price(item):\n    try:\n        return round(float(item['price']) * 1.2, 2)\n    except (KeyError, ValueError):\n        return 0.0\ndef total(items):\n    return sum(price(i) for i in cart)  # wrong name\ntotal([{'price': '10'}])", output: "NameError: name 'cart' is not defined" },
    },
    {
      name: 'Raising plain Exception',
      desc: 'Callers cannot catch a generic Exception precisely — they are forced into a catch-all. Raise a specific built-in or your own subclass.',
      wrong: { label: 'raise Exception', code: "def load(path):\n    raise Exception('file is empty')\ntry:\n    load('a.csv')\nexcept ValueError:\n    r = 'handled'\nr", output: 'Exception: file is empty' },
      fix:   { label: 'raise a subclass', code: "class EmptyFileError(ValueError):\n    pass\ndef load(path):\n    raise EmptyFileError('file is empty')\ntry:\n    load('a.csv')\nexcept ValueError:\n    r = 'handled'\nr", output: "'handled'" },
    },
    {
      name: 'Broad handler listed first',
      desc: 'except clauses are checked in order. A general clause above a specific one makes the specific one dead code.',
      wrong: { label: 'General first', code: "try:\n    {}['id']\nexcept Exception:\n    r = 'generic'\nexcept KeyError:\n    r = 'missing key'\nr", output: "'generic'" },
      fix:   { label: 'Specific first', code: "try:\n    {}['id']\nexcept KeyError:\n    r = 'missing key'\nexcept Exception:\n    r = 'generic'\nr", output: "'missing key'" },
    },
  ],

  when: {
    use: [
      'Base class for your own exception hierarchy',
      'Catch-all at a boundary: top of a request handler, worker loop, CLI main — with logging',
      'isinstance(e, Exception) to tell ordinary errors from Ctrl+C / exit',
    ],
    avoid: [
      'raise Exception(...) → raise ValueError, TypeError or your own subclass',
      'except Exception around a few lines where you know what can fail → catch that',
      'Catching everything including Ctrl+C → you almost never want that (BaseException)',
    ],
  },

  notes: {
    cpython:     'Objects/exceptions.c — Exception adds nothing to BaseException; it exists to separate errors from exit/interrupt signals',
    'Not caught by it': 'KeyboardInterrupt, SystemExit, GeneratorExit, BaseExceptionGroup (with non-Exception members)',
    'Naming':    'By convention custom exception names end in Error (PEP 8)',
    'Logging':   'logger.exception(msg) inside an except block logs the message plus the full traceback',
  },

  related: [
    { name: 'BaseException',     slug: 'baseexception',     when: 'The root — args, chaining, notes' },
    { name: 'ValueError',        slug: 'valueerror',        when: 'Right value type, bad value — common base for custom errors' },
    { name: 'TypeError',         slug: 'typeerror',         when: 'Wrong type of argument' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'Why except Exception does not catch Ctrl+C' },
    { name: 'ExceptionGroup',    slug: 'exceptiongroup',    when: 'Several exceptions raised together' },
    { name: 'isinstance',        slug: 'isinstance',        when: 'The check an except clause performs', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I create a custom exception in Python?',
      a: "Subclass Exception (or a more specific built-in such as ValueError): class InvalidOrder(Exception): pass. Raise it with raise InvalidOrder('quantity must be positive'). If you add an __init__, pass the message on with super().__init__(message) so e.args and str(e) work.",
    },
    {
      q: 'Is except Exception as e bad practice?',
      a: 'Not at a boundary — the top of a request handler, a worker loop, a CLI main — where you log the error with its traceback and carry on. It is bad around ordinary code, because it also catches NameError, AttributeError and TypeError from your own bugs and turns them into silent fallbacks.',
    },
    {
      q: 'What is the difference between Exception and BaseException?',
      a: 'BaseException is the root of all exceptions. Exception is its subclass for ordinary errors. KeyboardInterrupt, SystemExit and GeneratorExit derive directly from BaseException so that except Exception does not stop Ctrl+C or sys.exit(). Subclass and catch Exception.',
    },
    {
      q: 'Should I raise Exception directly?',
      a: 'Rarely. raise Exception(...) forces callers to catch every error to handle yours. Raise the most fitting built-in (ValueError, TypeError, KeyError, RuntimeError…) or a custom subclass that callers can catch by name.',
    },
    {
      q: 'Why does my custom exception print nothing or the wrong message?',
      a: 'Your __init__ did not call super().__init__(...). BaseException.__new__ still stores the constructor arguments in args, so str(e) shows those — e.g. a status code — rather than the message you meant. Call super().__init__(message) with the text you want.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#Exception',
    meta:  'Built-in exceptions',
  },
};
