// content/reference/python/stdlib/decimal/decimal.js — the Decimal constructor

export const meta = {
  slug:        'decimal',
  name:        'decimal.Decimal',
  signature:   "decimal.Decimal(value='0', context=None)",
  blurb:       "Make a Decimal from a str, int, float, tuple or another Decimal. Strings and ints convert exactly; a float converts exactly too — every binary digit of it.",
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: "Decimal constructor python decimal from string decimal from float Decimal(0.1) Decimal('0.1') exact conversion from_float Decimal.from_float create_decimal Context.create_decimal create_decimal_from_float Context.create_decimal_from_float string to decimal float to decimal ConversionSyntax invalid literal",
};

export const method = {
  slug:      'decimal',
  name:      'decimal.Decimal',
  signature: "decimal.Decimal(value='0', context=None)",
  returns:   { type: 'Decimal', desc: 'An immutable decimal number: a sign, a coefficient of decimal digits and an exponent — or Infinity, NaN or sNaN.' },

  category:    'decimal class',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: "The constructor never rounds: Decimal('1.23456789012345678901234567890') keeps all 30 digits whatever the precision. Rounding happens in arithmetic — or immediately, if you build the number with a context's create_decimal().",

  covers: ['Decimal', 'Decimal.from_float', 'Context.create_decimal', 'Context.create_decimal_from_float'],

  cheat: {
    commonCall: "Decimal('19.99')",
    returns:    "Decimal('19.99') — exact, trailing zeros kept",
    replaces:   'float() for money and other base-10 amounts',
    watchOut:   'Decimal(0.1) is the float 0.1000000000000000055511151231257827021181583404541015625',
  },

  parameters: [
    { name: 'value',   type: 'str | int | float | tuple | Decimal', required: false, default: "'0'", desc: "The number. A str may have a sign, digits with one point, an exponent (1.5E-3), underscores, surrounding whitespace, or be 'Infinity', 'Inf', 'NaN', 'sNaN' in any case. A tuple is (sign, digits, exponent)." },
    { name: 'context', type: 'Context', required: false, default: 'None', desc: 'Only used to signal problems with the conversion (an invalid string raises InvalidOperation if that is trapped). It does not round the value.' },
  ],

  modes: [
    {
      id: 'str',
      label: 'from a string',
      blurb: 'Type any number. The repr shows what was stored — note the exponent forms and kept zeros.',
      params: [{ name: 'text', type: 'str', hint: "e.g. '19.990'", input: 'text' }],
      template: 'from decimal import Decimal\nDecimal({$text})',
      cases: [
        { id: 'price', label: '19.990',     values: { text: '19.990' } },
        { id: 'under', label: ' 1_000.50 ', values: { text: ' 1_000.50 ' } },
        { id: 'exp',   label: '1.5e3',      values: { text: '1.5e3' } },
        { id: 'small', label: '0.0000001',  values: { text: '0.0000001' } },
        { id: 'inf',   label: '-inf',       values: { text: '-inf' } },
        { id: 'comma', label: '12,50',      values: { text: '12,50' } },
      ],
    },
    {
      id: 'float',
      label: 'from a float',
      blurb: 'Decimal(float) is exact, so it compares equal to the float. The Decimal of its text is the short number you typed — usually a different value.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'from decimal import Decimal\nd = Decimal({$x})\n(d, d == {$x}, Decimal(str({$x})) == {$x})',
      cases: [
        { id: 'tenth', label: '0.1',   values: { x: '0.1' } },
        { id: 'half',  label: '0.5',   values: { x: '0.5' } },
        { id: 'third', label: '0.3333333333333333', values: { x: '0.3333333333333333' } },
        { id: 'neg0',  label: '-0.0',  values: { x: '-0.0' } },
      ],
    },
    {
      id: 'create',
      label: 'create_decimal',
      blurb: 'The constructor keeps every digit; a context\'s create_decimal() rounds to its precision — and is strict about the text.',
      params: [
        { name: 'text', type: 'str', hint: 'a number',           input: 'text' },
        { name: 'prec', type: 'int', hint: 'context precision',  input: 'number' },
      ],
      template: 'from decimal import Decimal, Context\nctx = Context(prec={$prec})\n(Decimal({$text}), ctx.create_decimal({$text}))',
      cases: [
        { id: 'pi',    label: '3.14159265358979, prec 5', values: { text: '3.14159265358979', prec: '5' } },
        { id: 'half',  label: '2.5, prec 1',             values: { text: '2.5', prec: '1' } },
        { id: 'big',   label: '123456789, prec 3',       values: { text: '123456789', prec: '3' } },
        { id: 'space', label: "' 7', prec 3",            values: { text: ' 7', prec: '3' } },
      ],
    },
  ],
  demoExplainer: "The string forms: whitespace around the number and underscores are ignored, an exponent is kept as written, and 0.0000001 is shown as 1E-7 because repr switches to exponent notation for numbers that small. A comma is not a decimal point — '12,50' raises decimal.InvalidOperation with ConversionSyntax in the list. From a float, the Decimal is exactly the float's value, so d == x is True, while the Decimal of str(x) is 0.1 exactly and therefore not equal to the float 0.1 (it is equal for 0.5, which binary stores exactly). create_decimal() rounds with the context's ROUND_HALF_EVEN — 2.5 at one digit becomes 2 — and turns 123456789 into 1.23E+8; unlike the constructor it rejects surrounding whitespace.",

  patterns: [
    {
      name: 'Parse user input safely',
      desc: 'A bad string raises InvalidOperation (an ArithmeticError), not ValueError.',
      code: "from decimal import Decimal, InvalidOperation\ndef parse_amount(text):\n    try:\n        return Decimal(text.replace(',', ''))\n    except InvalidOperation:\n        return None",
    },
    {
      name: 'Float to Decimal without the binary noise',
      desc: 'str() of a float is its shortest round-trip form; convert that.',
      code: 'from decimal import Decimal\nd = Decimal(str(x))   # Decimal(0.1) would give 55 digits',
    },
    {
      name: 'Round while converting',
      desc: 'A context with the precision you want builds already-rounded Decimals.',
      code: "from decimal import Context\nctx = Context(prec=6)\nvalues = [ctx.create_decimal(s) for s in raw_strings]",
    },
  ],

  examples: [
    { title: 'From a string',            code: "from decimal import Decimal\nDecimal('3.14')", returns: "Decimal('3.14')" },
    { title: 'From an int — any size',   code: 'from decimal import Decimal\nDecimal(10**30)', returns: "Decimal('1000000000000000000000000000000')" },
    { title: 'From a (sign, digits, exponent) tuple', code: 'from decimal import Decimal\nDecimal((1, (3, 1, 4), -2))', returns: "Decimal('-3.14')" },
    { title: 'Underscores and spaces are allowed', code: "from decimal import Decimal\nDecimal(' 1_000.50 ')", returns: "Decimal('1000.50')" },
    { title: 'Special values',           code: "from decimal import Decimal\n[Decimal('Infinity'), Decimal('-0'), Decimal('NaN')]", returns: "[Decimal('Infinity'), Decimal('-0'), Decimal('NaN')]" },
    { title: 'from_float is the same exact conversion', code: 'from decimal import Decimal\nDecimal.from_float(0.1) == Decimal(0.1)', returns: 'True' },
    { title: 'create_decimal rounds',    code: "from decimal import Context\nContext(prec=5).create_decimal('1.2345678')", returns: "Decimal('1.2346')" },
    { title: 'Not a number',             code: "from decimal import Decimal\nDecimal('12,50')", returns: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
  ],

  pitfalls: [
    {
      name: 'Catching ValueError for bad input',
      desc: 'int() and float() raise ValueError for bad text; Decimal raises decimal.InvalidOperation, which is not a ValueError.',
      wrong: { label: 'except ValueError', code: "from decimal import Decimal\ntry:\n    amount = Decimal('12,50')\nexcept ValueError:\n    amount = None\namount", output: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
      fix:   { label: 'except InvalidOperation', code: "from decimal import Decimal, InvalidOperation\ntry:\n    amount = Decimal('12,50')\nexcept InvalidOperation:\n    amount = None\namount is None", output: 'True' },
    },
    {
      name: 'Expecting the constructor to round',
      desc: 'The context precision applies to arithmetic results, not to Decimal(...). Unary plus — or create_decimal — applies it.',
      wrong: { label: 'Decimal(text)', code: "from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    d = Decimal('1.23456')\nd", output: "Decimal('1.23456')" },
      fix:   { label: '+Decimal(text)', code: "from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    d = +Decimal('1.23456')\nd", output: "Decimal('1.23')" },
    },
    {
      name: 'Converting a float you meant as text',
      desc: 'A float literal is already binary. Decimal(1.1) is exact — exactly the wrong number.',
      wrong: { label: 'Decimal(1.1)', code: 'from decimal import Decimal\nDecimal(1.1)', output: "Decimal('1.100000000000000088817841970012523233890533447265625')" },
      fix:   { label: "Decimal('1.1')", code: "from decimal import Decimal\nDecimal('1.1')", output: "Decimal('1.1')" },
    },
  ],

  when: {
    use: [
      'Turning prices, amounts and other base-10 text into exact numbers',
      'Decimal(int) for whole numbers of any size — exact',
      'create_decimal() when inputs should be rounded to your precision immediately',
    ],
    avoid: [
      'Decimal(some_float) when you meant the number as written → Decimal(str(x))',
      'Locale-formatted text such as "1.234,50" → normalize it first',
      'Values computed as floats and only converted at the end → keep them Decimal throughout',
    ],
  },

  notes: {
    cpython:     'Modules/_decimal/_decimal.c: str → numeric_as_ascii() (Unicode digits and whitespace accepted, underscores removed) then libmpdec parses the text exactly; float → exact conversion of its binary value',
    'Versions':  'Decimal.from_float() 3.1; Decimal(float) 3.2 (raising FloatOperation when that trap is set, 3.3); underscores in the string 3.6',
    'Strictness': 'The constructor strips surrounding whitespace and removes underscores; Context.create_decimal() does neither and raises ConversionSyntax instead',
    'Immutability': 'Decimal objects are immutable and hashable; hash(Decimal("0.5")) == hash(0.5), so equal numbers are the same dict key',
  },

  related: [
    { name: 'decimal module', slug: 'decimal', when: 'Overview', category: 'stdlib' },
    { name: 'Context',        slug: 'context', when: 'create_decimal and precision' },
    { name: 'FloatOperation', slug: 'floatoperation', when: 'Make Decimal(float) an error' },
    { name: 'InvalidOperation', slug: 'invalidoperation', when: 'What bad strings raise' },
    { name: 'float()',        slug: 'float', when: 'The binary number you may be converting', category: 'functions' },
    { name: 'Fraction',       slug: 'fraction', when: 'Fraction(Decimal) is exact too', category: 'stdlib/fractions' },
  ],

  faq: [
    {
      q: 'How do I convert a string to a Decimal in Python?',
      a: "Decimal('12.50'). Whitespace around the number and underscores are allowed; a comma is not. Invalid text raises decimal.InvalidOperation (its message lists ConversionSyntax), so catch that, not ValueError.",
    },
    {
      q: 'Why does Decimal(0.1) print so many digits?',
      a: 'A float stores the binary fraction nearest to 0.1, and Decimal(float) converts that value exactly: 0.1000000000000000055511151231257827021181583404541015625. Use Decimal(str(x)) or Decimal(repr(x)) to get Decimal(\'0.1\').',
    },
    {
      q: 'What is the difference between Decimal() and Context.create_decimal()?',
      a: "Decimal() is exact and never rounds. ctx.create_decimal() rounds the value to ctx's precision with ctx's rounding, signals through ctx (so Inexact or Rounded flags are set there), and does not accept surrounding whitespace or underscores.",
    },
    {
      q: 'Are Decimal(\'1.0\') and Decimal(\'1\') equal?',
      a: "Yes: they compare equal and hash the same, so they are one dict key. They print differently because a Decimal remembers its exponent — Decimal('1.0') has one decimal place. normalize() strips the trailing zeros.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal',
    meta:  'decimal.Decimal',
  },
};
