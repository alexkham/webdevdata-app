// content/reference/python/keywords/try.js

export const meta = {
  slug:        'try',
  name:        'try / except / finally',
  signature:   'try: … except Error as e: …',
  blurb:       'Catch exceptions with except, run success-only code in else, and always clean up in finally.',
  category:    'errors-context',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'try except finally else try-except try/except catch exception handling error handling except as multiple exceptions except* exceptiongroup bare except cleanup keyword',
};

export const method = {
  slug:      'try',
  name:      'try / except / finally',
  signature: 'try: … except Error as e: …',

  category:    'Errors & context',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Python’s exception handler: except catches, else runs only when nothing was raised, finally runs no matter how the block is left.',

  covers: ['try', 'except', 'finally'],

  syntax: [
    { label: 'try / except', code: 'try:\n    risky()\nexcept ValueError as e:\n    handle(e)' },
    { label: 'several types', code: 'try:\n    risky()\nexcept (KeyError, IndexError):\n    handle()' },
    { label: 'all four clauses', code: 'try:\n    risky()\nexcept OSError:\n    on_error()\nelse:\n    on_success()\nfinally:\n    cleanup()' },
    { label: 'except* (3.11+)', code: 'try:\n    run_tasks()\nexcept* ValueError as eg:\n    handle(eg.exceptions)' },
  ],

  cheat: {
    useFor:    'except SomeError as e: for errors you can handle; finally: for cleanup that must always run',
    result:    'a statement — no value; the as name is deleted when the except block ends',
    pairsWith: 'raise, with, else, as, ExceptionGroup',
    watchOut:  'catch specific types; a return in finally silently discards the exception',
  },

  parameters: [
    { name: 'try body',   type: 'block',                    required: true,  default: null, desc: 'The code being protected. Keep it small — only the lines that can raise what you catch.' },
    { name: 'except',     type: 'expression (class/tuple)', required: false, default: null, desc: 'Matches if the raised exception is an instance of the class (or of any class in the tuple). Clauses are tried top to bottom; the first match wins. A bare except: matches everything and must come last.' },
    { name: 'as name',    type: 'name',                     required: false, default: null, desc: 'Bound to the exception object inside the except block, then deleted when the block ends.' },
    { name: 'else',       type: 'block',                    required: false, default: null, desc: 'Runs only if the try body finished without raising. Its own errors are not caught by the except clauses above.' },
    { name: 'finally',    type: 'block',                    required: false, default: null, desc: 'Runs last, on every way out: normal end, exception, return, break or continue.' },
  ],

  modes: [
    {
      id: 'order',
      label: 'order',
      blurb: 'Which blocks run, and in which order? Divide by zero to take the except path.',
      params: [{ name: 'd', type: 'int', hint: 'try 0', input: 'number' }],
      template: "steps = []\ntry:\n    steps.append('try')\n    ratio = 10 / {$d}\n    steps.append('try finished')\nexcept ZeroDivisionError:\n    steps.append('except')\nelse:\n    steps.append('else')\nfinally:\n    steps.append('finally')\nsteps",
      cases: [
        { id: 'ok',   label: 'no error',   values: { d: '4' } },
        { id: 'zero', label: 'd = 0',      values: { d: '0' } },
      ],
    },
    {
      id: 'multi',
      label: 'except (A, B)',
      blurb: 'One clause, two exception types. Out-of-range indexes and the zero item both land in it — other errors do not.',
      params: [{ name: 'index', type: 'int', hint: 'try 2, 3, -1', input: 'number' }],
      template: "items = [10, 20, 0]\ntry:\n    result = 100 // items[{$index}]\nexcept (IndexError, ZeroDivisionError) as e:\n    result = f'{type(e).__name__}: {e}'\nresult",
      cases: [
        { id: 'ok',    label: 'index 1',  values: { index: '1' } },
        { id: 'zero',  label: 'index 2',  values: { index: '2' } },
        { id: 'range', label: 'index 3',  values: { index: '3' } },
        { id: 'neg',   label: 'index -3', values: { index: '-3' } },
      ],
    },
    {
      id: 'finally',
      label: 'finally + return',
      blurb: 'Every path out of check() is a return — and finally still runs on each of them.',
      params: [{ name: 'n', type: 'int', hint: 'negative, 0, positive', input: 'number' }],
      template: "log = []\ndef check(n):\n    try:\n        if n < 0:\n            return 'negative'\n        return 10 // n\n    except ZeroDivisionError:\n        return 'zero'\n    finally:\n        log.append('finally ran')\n(check({$n}), log)",
      cases: [
        { id: 'pos',  label: 'n = 3',  values: { n: '3' } },
        { id: 'zero', label: 'n = 0',  values: { n: '0' } },
        { id: 'neg',  label: 'n = -1', values: { n: '-1' } },
      ],
    },
  ],
  demoExplainer: 'In the order tab, the step after the failing line never runs: an exception jumps straight to the matching except, and else is skipped. finally is in the list either way. In the except (A, B) tab, a float index (type 1e21 or more) raises TypeError, which the clause does not name — so it escapes uncaught. In the finally tab, the return value is computed first, then finally runs, then the function actually returns.',

  patterns: [
    {
      name: 'Handle one expected error',
      desc: 'Catch the narrowest type, at the one line that can raise it.',
      code: "try:\n    port = int(text)\nexcept ValueError:\n    port = 8080",
    },
    {
      name: 'else for the success path',
      desc: 'Code in else is not protected, so a bug there is not mistaken for the error you meant to catch.',
      code: "try:\n    f = open(path)\nexcept FileNotFoundError:\n    data = ''\nelse:\n    with f:\n        data = f.read()",
    },
    {
      name: 'Log and re-raise',
      desc: 'Bare raise inside except re-raises the same exception with its traceback.',
      code: "try:\n    process(job)\nexcept Exception:\n    log.exception('job failed')\n    raise",
    },
    {
      name: 'Always release a resource',
      desc: 'finally runs even on return or an exception; with is the shorter form when the object is a context manager.',
      code: "lock.acquire()\ntry:\n    update(shared)\nfinally:\n    lock.release()",
    },
  ],

  examples: [
    { title: 'Catch and inspect the error', code: "try:\n    int('abc')\nexcept ValueError as e:\n    print('bad number:', e)", returns: "bad number: invalid literal for int() with base 10: 'abc'" },
    { title: 'One clause, several types',  code: "for raw in ['7', 'x', None]:\n    try:\n        print(int(raw))\n    except (ValueError, TypeError) as e:\n        print(type(e).__name__)", returns: '7\nValueError\nTypeError' },
    { title: 'else and finally',            code: "def run(x):\n    try:\n        r = 10 / x\n    except ZeroDivisionError:\n        return 'except'\n    else:\n        return f'else {r}'\n    finally:\n        print('finally')\nprint(run(2))\nprint(run(0))", returns: 'finally\nelse 5.0\nfinally\nexcept' },
    { title: 'finally runs on break too',   code: "for i in range(3):\n    try:\n        if i == 1:\n            break\n    finally:\n        print('cleanup', i)", returns: 'cleanup 0\ncleanup 1' },
    { title: 'First matching clause wins',  code: "try:\n    {}['k']\nexcept LookupError:\n    print('LookupError clause')\nexcept KeyError:\n    print('never reached')", returns: 'LookupError clause' },
    { title: 'Bare except also catches Ctrl+C and exit', code: "for exc in (ValueError, KeyboardInterrupt, SystemExit):\n    try:\n        raise exc\n    except Exception:\n        print(exc.__name__, '-> except Exception')\n    except:\n        print(exc.__name__, '-> bare except')", returns: 'ValueError -> except Exception\nKeyboardInterrupt -> bare except\nSystemExit -> bare except' },
    { title: 'except* splits an ExceptionGroup', code: "try:\n    raise ExceptionGroup('batch', [ValueError('a'), TypeError('b'), ValueError('c')])\nexcept* ValueError as eg:\n    print('values:', eg.exceptions)\nexcept* TypeError as eg:\n    print('types:', eg.exceptions)", returns: "values: (ValueError('a'), ValueError('c'))\ntypes: (TypeError('b'),)" },
  ],

  pitfalls: [
    {
      name: 'return in finally swallows the exception',
      desc: 'A return (or break / continue) in finally discards the exception in flight — the caller never hears about it. Python 3.14 adds a SyntaxWarning for this; 3.13 says nothing.',
      wrong: { label: 'return in finally', code: "def save():\n    try:\n        raise OSError('disk full')\n    finally:\n        return 'saved'\nsave()", output: "'saved'" },
      fix:   { label: 'cleanup only',      code: "def save():\n    try:\n        raise OSError('disk full')\n    finally:\n        print('cleanup')\nsave()", output: 'cleanup\nOSError: disk full' },
    },
    {
      name: 'Bare except hides real bugs',
      desc: 'except: (and except Exception:) turn every mistake into the fallback value. Name the error you expect; anything else should crash loudly.',
      wrong: { label: 'catch everything', code: "def parse(s):\n    try:\n        return int(s)\n    except:\n        return 0\n(parse('12a'), parse(None))", output: '(0, 0)' },
      fix:   { label: 'catch ValueError', code: "def parse(s):\n    try:\n        return int(s)\n    except ValueError:\n        return 0\n(parse('12a'), parse(None))", output: "TypeError: int() argument must be a string, a bytes-like object or a real number, not 'NoneType'" },
    },
    {
      name: 'Using the as name after the except block',
      desc: 'Python deletes the name at the end of the except block (it would otherwise keep the whole stack frame alive). Copy it to another name if you need it later.',
      wrong: { label: 'read err afterwards', code: "try:\n    int('x')\nexcept ValueError as err:\n    pass\nprint(err)", output: "NameError: name 'err' is not defined" },
      fix:   { label: 'keep a copy',         code: "error = None\ntry:\n    int('x')\nexcept ValueError as err:\n    error = err\nerror", output: 'ValueError("invalid literal for int() with base 10: \'x\'")' },
    },
  ],

  when: {
    use: [
      'An operation can fail for reasons outside your control (files, network, user input, parsing)',
      'You can do something useful about the failure: a default, a retry, a clearer error',
      'Cleanup must happen no matter what (finally)',
    ],
    avoid: [
      'Opening files, locks, connections → with does the finally for you',
      'Checking a condition you can test cheaply and clearly → if (e.g. key in d, or d.get())',
      'Hiding errors you cannot handle → let them propagate',
    ],
  },

  notes: {
    cpython:   'try costs almost nothing when no exception is raised (3.11+ "zero-cost" exceptions: the handler table is only consulted when something is raised)',
    'Matching': 'except X matches if isinstance(exc, X); order clauses from most specific to most general — a base class listed first shadows its subclasses',
    'as':      'The as name is unbound when the except block ends (as if del name ran in a hidden finally). The same keyword binds names in with and import',
    'except*': 'Added in 3.11 for ExceptionGroup. A try uses either except or except*, never both, and except*: without a type is a SyntaxError',
  },

  related: [
    { name: 'raise',          slug: 'raise',          when: 'Throw or re-raise an exception' },
    { name: 'with',           slug: 'with',           when: 'try/finally cleanup packaged in a context manager' },
    { name: 'import (as)',    slug: 'import',         when: 'The as keyword is documented with import' },
    { name: 'BaseException',  slug: 'baseexception',  when: 'Root of the hierarchy — what bare except catches', category: 'exceptions' },
    { name: 'Exception',      slug: 'exception',      when: 'What except Exception catches (not Ctrl+C / exit)', category: 'exceptions' },
    { name: 'ExceptionGroup', slug: 'exceptiongroup', when: 'What except* splits', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I catch multiple exceptions in one except?',
      a: 'Put the types in a tuple: except (ValueError, TypeError) as e:. Up to Python 3.13 the parentheses are required — except ValueError, TypeError: is a SyntaxError ("multiple exception types must be parenthesized"). 3.14 allows dropping them when there is no as clause.',
    },
    {
      q: 'What is the difference between except: and except Exception:?',
      a: 'Bare except: catches everything derived from BaseException, including KeyboardInterrupt (Ctrl+C) and SystemExit (sys.exit()). except Exception: lets those two (and GeneratorExit) through, so the program can still be stopped. Prefer a specific type over either.',
    },
    {
      q: 'When does the else clause of try run?',
      a: 'Only if the try body finished without raising. It runs before finally. Code there is not protected by the except clauses, which is the point: an error in the success path is not mistaken for the one you meant to catch.',
    },
    {
      q: 'Does finally run if I return inside try?',
      a: 'Yes. The return value is evaluated, finally runs, then the function returns. If finally itself executes a return, that value wins and any exception in flight is discarded.',
    },
    {
      q: 'What is except* in Python?',
      a: 'A 3.11+ clause for ExceptionGroup (several exceptions raised together, e.g. by asyncio.TaskGroup). Each except* takes the matching sub-exceptions out of the group; more than one except* clause can run for one group.',
    },
  ],

  history: [
    { version: '3.8',  note: 'continue became legal inside a finally clause.' },
    { version: '3.11', note: 'except* for ExceptionGroup (PEP 654).' },
    { version: '3.14', note: 'Parentheses around several exception types may be dropped when there is no as clause (PEP 758); return, break or continue in finally now emits a SyntaxWarning (PEP 765).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#the-try-statement',
    meta:  'The try statement',
  },
};
