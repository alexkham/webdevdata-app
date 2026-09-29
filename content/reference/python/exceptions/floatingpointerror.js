// content/reference/python/exceptions/floatingpointerror.js

export const meta = {
  slug:        'floatingpointerror',
  name:        'FloatingPointError',
  signature:   'FloatingPointError(*args)',
  blurb:       'Reserved for failed floating-point operations. The docs say "Not currently used" — CPython never raises it; NumPy does when told to.',
  category:    'arithmetic',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3 (all)',
  searchTerms: 'floatingpointerror floating point error float exception numpy seterr raise divide by zero encountered invalid value encountered overflow encountered nan inf',
};

export const method = {
  slug:      'floatingpointerror',
  name:      'FloatingPointError',
  signature: 'FloatingPointError(*args)',

  category:    'Arithmetic exception',
  version:     'Python 3 (all)',
  hasLiveDemo: false,

  subtitle: 'Plain Python never raises it — float problems show up as ZeroDivisionError, OverflowError, ValueError or a silent inf/nan. If you see it, NumPy (np.seterr) or your own code raised it.',

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'FloatingPointError'],

  cheat: {
    raisedBy: "NumPy with np.seterr(all='raise'); your own checks",
    message:  'whatever the raiser chose — NumPy: "divide by zero encountered in …"',
    quickFix: 'find the inf/nan source, or np.errstate to scope the setting',
    watchOut: 'CPython itself: "Not currently used"',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. str(e) is that message.' },
  ],

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'args[0] is the message. No operand or operation attributes.' },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised (implicit chaining).' },
  ],

  patterns: [
    {
      name: 'Turn silent inf/nan into an error',
      desc: 'Plain float +, - and * return inf or nan without raising. If that should be fatal, check and raise — FloatingPointError is the natural class to use.',
      code: "import math\n\ndef checked(x):\n    if not math.isfinite(x):\n        raise FloatingPointError(f'non-finite result: {x}')\n    return x",
    },
    {
      name: 'NumPy: raise only in one block',
      desc: 'np.errstate is a context manager, so the stricter setting does not leak into the rest of the program.',
      code: "import numpy as np\n\nwith np.errstate(divide='raise', invalid='raise'):\n    ratio = a / b",
    },
    {
      name: 'NumPy: catch it',
      desc: 'With floating-point errors set to raise, bad elements stop the computation with FloatingPointError.',
      code: "import numpy as np\n\nnp.seterr(all='raise')\ntry:\n    result = np.log(values)\nexcept FloatingPointError as e:\n    print('bad input:', e)",
    },
  ],

  examples: [
    { title: 'Construct it explicitly',          code: "str(FloatingPointError('overflow in pow'))", returns: "'overflow in pow'" },
    { title: 'It is an ArithmeticError',         code: "issubclass(FloatingPointError, ArithmeticError)", returns: 'True' },
    { title: 'Float overflow is silent here',    code: "1e308 * 10",                    returns: 'inf' },
    { title: 'inf - inf is a silent nan',        code: "float('inf') - float('inf')",   returns: 'nan' },
    { title: '0.0 / 0.0 is ZeroDivisionError',   code: "0.0 / 0.0",                     returns: 'ZeroDivisionError: float division by zero' },
    { title: 'Domain errors are ValueError',     code: "import math\nmath.sqrt(-1)",   returns: 'ValueError: math domain error' },
    { title: 'Raising it from your own check',   code: "import math\ndef checked(x):\n    if not math.isfinite(x):\n        raise FloatingPointError(f'non-finite result: {x}')\n    return x\nchecked(1e308 * 10)", returns: 'FloatingPointError: non-finite result: inf' },
  ],

  pitfalls: [
    {
      name: 'Catching FloatingPointError for plain Python math',
      desc: 'CPython raises a different class for each float problem, so this handler never runs. Catch ArithmeticError (or the specific class) instead.',
      wrong: { label: 'except FloatingPointError', code: "try:\n    r = 1.0 / 0.0\nexcept FloatingPointError:\n    r = 'handled'\nr", output: 'ZeroDivisionError: float division by zero' },
      fix:   { label: 'except ArithmeticError',    code: "try:\n    r = 1.0 / 0.0\nexcept ArithmeticError:\n    r = 'handled'\nr", output: "'handled'" },
    },
    {
      name: 'Expecting an exception for inf and nan',
      desc: 'Arithmetic that overflows or has no meaningful result returns inf/nan silently and poisons later results. Test with math.isfinite / math.isnan.',
      wrong: { label: 'No error, wrong value', code: "x = float('inf') - float('inf')\nx == x", output: 'False' },
      fix:   { label: 'math.isnan',            code: "import math\nx = float('inf') - float('inf')\nmath.isnan(x)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Your own numeric code wants a dedicated error for non-finite results',
      'Catching NumPy errors after np.seterr / np.errstate set to raise',
    ],
    avoid: [
      'Handling plain Python float errors → ZeroDivisionError, OverflowError, ValueError',
      'Catch-all for arithmetic → except ArithmeticError',
    ],
  },

  notes: {
    'Docs': 'The built-in exceptions page describes it in three words: Not currently used.',
    'History': 'The fpectl module (floating-point exception control, never enabled by default) was removed in Python 3.7',
    'NumPy': "np.seterr(all='raise') turns divide, over, invalid (and under) floating-point conditions into FloatingPointError",
    'Catch via': 'except ArithmeticError also catches ZeroDivisionError and OverflowError',
  },

  related: [
    { name: 'ArithmeticError',   slug: 'arithmeticerror',   when: 'Base class — catch this for any arithmetic failure' },
    { name: 'ZeroDivisionError', slug: 'zerodivisionerror', when: 'What x / 0.0 actually raises' },
    { name: 'OverflowError',     slug: 'overflowerror',     when: 'What math.exp(1000) actually raises' },
    { name: 'ValueError',        slug: 'valueerror',        when: 'What math.sqrt(-1) actually raises' },
    { name: 'float',             slug: 'float',             when: 'inf and nan values', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo for FloatingPointError?',
      a: 'There is nothing in plain Python that triggers it. The official docs describe FloatingPointError as "Not currently used": CPython reports float problems as ZeroDivisionError, OverflowError or ValueError, or returns inf/nan silently. The only ways to see it are raising it yourself (see the examples) or third-party code such as NumPy, which is not available in the demo sandbox.',
    },
    {
      q: 'Where does FloatingPointError come from then?',
      a: "Almost always NumPy. With np.seterr(all='raise') or inside np.errstate(...='raise'), NumPy raises FloatingPointError instead of returning inf/nan with a RuntimeWarning — for example (NumPy 2.2) FloatingPointError: divide by zero encountered in scalar divide, or invalid value encountered in sqrt.",
    },
    {
      q: 'How do I fix "FloatingPointError: invalid value encountered"?',
      a: 'An operation produced nan: 0/0, inf - inf, sqrt or log of a negative number. Find the inputs that cause it (np.isnan / np.isinf on the intermediate arrays), clean or mask them, or relax the setting with np.errstate(invalid=\'ignore\') for that block if nan is acceptable.',
    },
    {
      q: 'Should I catch FloatingPointError or ArithmeticError?',
      a: 'For plain Python arithmetic, catch the specific class (ZeroDivisionError, OverflowError) or ArithmeticError, which covers all three. except FloatingPointError alone only makes sense around NumPy code with raising enabled, or your own code that raises it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#FloatingPointError',
    meta:  'Built-in exceptions',
  },
};
