// content/reference/python/stdlib/decimal/predicates.js — is_* predicates, number_class, canonical, radix

export const meta = {
  slug:        'predicates',
  name:        'Decimal.is_nan',
  signature:   'Decimal.is_finite() · is_infinite() · is_nan() · is_qnan() · is_snan() · is_signed() · is_zero() · is_normal(context=None) · is_subnormal(context=None) · is_canonical() · number_class(context=None) · canonical() · radix()',
  blurb:       'Ask a Decimal what it is: finite, infinite, a quiet or signaling NaN, negative, zero, normal or subnormal — or get all of that as one number_class() string.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal is_nan is_finite is_infinite is_qnan is_snan is_signed is_zero is_normal is_subnormal is_canonical number_class canonical radix Decimal.is_nan Decimal.is_finite Decimal.is_infinite Decimal.is_qnan Decimal.is_snan Decimal.is_signed Decimal.is_zero Decimal.is_normal Decimal.is_subnormal Decimal.is_canonical Decimal.number_class Decimal.canonical Decimal.radix Context.is_nan Context.is_finite Context.is_infinite Context.is_qnan Context.is_snan Context.is_signed Context.is_zero Context.is_normal Context.is_subnormal Context.is_canonical Context.number_class Context.canonical Context.radix check decimal nan negative zero',
};

export const method = {
  slug:      'predicates',
  name:      'Decimal.is_nan',
  signature: 'Decimal.is_finite() · is_infinite() · is_nan() · is_qnan() · is_snan() · is_signed() · is_zero() · is_normal(context=None) · is_subnormal(context=None) · is_canonical() · number_class(context=None) · canonical() · radix()',
  returns:   { type: 'bool | str | Decimal', desc: "is_*: bool; number_class: one of ten strings such as '+Normal' or '-Zero'; canonical(): the same Decimal; radix(): Decimal('10')." },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'All of these are quiet: no flags, no rounding, no exceptions — even for a signaling NaN. Only is_normal, is_subnormal and number_class depend on a context (its Emin decides what counts as subnormal). canonical, is_canonical and radix exist for completeness: every Decimal is canonical and the radix is always 10.',

  covers: [
    'Decimal.is_finite', 'Decimal.is_infinite', 'Decimal.is_nan', 'Decimal.is_qnan', 'Decimal.is_snan', 'Decimal.is_signed', 'Decimal.is_zero',
    'Decimal.is_normal', 'Decimal.is_subnormal', 'Decimal.is_canonical', 'Decimal.number_class', 'Decimal.canonical', 'Decimal.radix',
    'Context.is_finite', 'Context.is_infinite', 'Context.is_nan', 'Context.is_qnan', 'Context.is_snan', 'Context.is_signed', 'Context.is_zero',
    'Context.is_normal', 'Context.is_subnormal', 'Context.is_canonical', 'Context.number_class', 'Context.canonical', 'Context.radix',
  ],

  cheat: {
    commonCall: 'x.is_nan()',
    returns:    'True for NaN and sNaN, False otherwise',
    replaces:   'the x != x trick (which raises for a signaling NaN)',
    watchOut:   'is_signed() is True for -0, which is not < 0',
  },

  parameters: [
    { name: 'context', type: 'Context', required: false, default: 'None', desc: 'is_normal, is_subnormal, number_class: the context whose Emin defines subnormal (None = current context). Context methods take the operand: ctx.is_nan(x); ctx.radix() takes nothing.' },
  ],

  modes: [
    {
      id: 'classify',
      label: 'classify',
      blurb: 'number_class() and every predicate that is True for your number.',
      params: [{ name: 'x', type: 'str', hint: 'a number or special value', input: 'text' }],
      template: "from decimal import Decimal\nx = Decimal({$x})\n(x.number_class(), [name for name in ('is_finite', 'is_infinite', 'is_nan', 'is_qnan', 'is_snan', 'is_signed', 'is_zero', 'is_normal', 'is_subnormal') if getattr(x, name)()])",
      cases: [
        { id: 'num',  label: '1.5',        values: { x: '1.5' } },
        { id: 'nz',   label: '-0',         values: { x: '-0' } },
        { id: 'nan',  label: 'NaN',        values: { x: 'NaN' } },
        { id: 'snan', label: '-sNaN',      values: { x: '-sNaN' } },
        { id: 'inf',  label: 'Infinity',   values: { x: 'Infinity' } },
        { id: 'sub',  label: '1E-1000000', values: { x: '1E-1000000' } },
        { id: 'zexp', label: '0E+5',       values: { x: '0E+5' } },
      ],
    },
    {
      id: 'context',
      label: 'normal vs subnormal',
      blurb: 'Whether a number is subnormal depends on the context: below Emin it is.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number', input: 'text' },
        { name: 'Emin', type: 'int', hint: '<= 0',     input: 'number' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(Emin={$Emin})\nx = Decimal({$x})\n(ctx.number_class(x), ctx.is_normal(x), ctx.is_subnormal(x))',
      cases: [
        { id: 'sub',  label: '0.001, Emin -2', values: { x: '0.001', Emin: '-2' } },
        { id: 'norm', label: '0.001, Emin -5', values: { x: '0.001', Emin: '-5' } },
        { id: 'neg',  label: '-1E-10, Emin -9', values: { x: '-1E-10', Emin: '-9' } },
        { id: 'zero', label: '0, Emin -9',     values: { x: '0', Emin: '-9' } },
      ],
    },
  ],
  demoExplainer: "number_class names one of ten classes: '+Normal', '-Zero', 'NaN', 'sNaN', '+Infinity', '+Subnormal' and so on. Zeros and NaNs carry a sign too, so -0 and -sNaN are is_signed() (but a NaN's class string has no sign). Zero is neither normal nor subnormal, and 0E+5 is still zero. 1E-1000000 is below the default Emin of -999999, hence subnormal. In the second tab 0.001 has adjusted exponent -3: subnormal when Emin is -2, normal when Emin is -5.",

  patterns: [
    {
      name: 'Reject non-finite input',
      desc: 'is_finite() is False for infinities and both kinds of NaN.',
      code: "from decimal import Decimal\ndef parse_amount(text):\n    value = Decimal(text)\n    if not value.is_finite():\n        raise ValueError(f'not a finite amount: {text}')\n    return value",
    },
    {
      name: 'Detect a negative zero',
      desc: 'is_signed() sees the sign that < 0 cannot.',
      code: 'if x.is_zero() and x.is_signed():\n    x = abs(x)   # print 0 instead of -0',
    },
    {
      name: 'Dispatch on the class',
      desc: 'One string covers sign and kind.',
      code: "kind = x.number_class()\nif kind in ('NaN', 'sNaN'):\n    handle_missing()\nelif kind.endswith('Infinity'):\n    handle_overflow()",
    },
  ],

  examples: [
    { title: '-0 is signed and zero',     code: "from decimal import Decimal\nDecimal('-0').is_signed(), Decimal('-0').is_zero()", returns: '(True, True)' },
    { title: 'Quiet vs signaling NaN',    code: "from decimal import Decimal\nDecimal('NaN').is_nan(), Decimal('sNaN').is_qnan()", returns: '(True, False)' },
    { title: 'Eight of the ten classes',  code: "from decimal import Decimal\n[Decimal(s).number_class() for s in ('-Infinity', '-1', '-0', '0', '1E-1000000', '7', 'NaN', 'sNaN')]", returns: "['-Infinity', '-Normal', '-Zero', '+Zero', '+Subnormal', '+Normal', 'NaN', 'sNaN']" },
    { title: 'Subnormal depends on Emin', code: "from decimal import Decimal, Context\nDecimal('0.001').is_normal(Context(Emin=-2))", returns: 'False' },
    { title: 'Context methods accept ints', code: "from decimal import Context\nctx = Context()\n(ctx.is_finite(3), ctx.is_zero(0), ctx.is_signed(-1), ctx.number_class(-1))", returns: "(True, True, True, '-Normal')" },
    { title: 'radix, canonical, is_canonical', code: 'from decimal import Decimal\n(Decimal(5).radix(), Decimal(5).canonical(), Decimal(5).is_canonical())', returns: "(Decimal('10'), Decimal('5'), True)" },
    { title: '…but Context.canonical wants a Decimal', code: 'from decimal import Context\nContext().canonical(5)', returns: 'TypeError: argument must be a Decimal' },
  ],

  pitfalls: [
    {
      name: 'Testing for NaN with x != x',
      desc: 'The float idiom compares a NaN with itself. For a signaling NaN that comparison signals InvalidOperation. is_nan() never signals.',
      wrong: { label: 'd != d', code: "from decimal import Decimal\nd = Decimal('sNaN')\nd != d", output: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
      fix:   { label: 'd.is_nan()', code: "from decimal import Decimal\nd = Decimal('sNaN')\nd.is_nan()", output: 'True' },
    },
    {
      name: 'Using math.isnan on a Decimal',
      desc: 'math converts to float first, and a signaling NaN cannot be converted.',
      wrong: { label: 'math.isnan', code: "import math\nfrom decimal import Decimal\nmath.isnan(Decimal('sNaN'))", output: 'ValueError: cannot convert signaling NaN to float' },
      fix:   { label: 'is_nan()', code: "from decimal import Decimal\nDecimal('sNaN').is_nan()", output: 'True' },
    },
    {
      name: 'Checking the sign with < 0',
      desc: '-0 equals 0, so it is not less than 0. is_signed() reports the sign bit.',
      wrong: { label: '< 0', code: "from decimal import Decimal\nDecimal('-0') < 0", output: 'False' },
      fix:   { label: 'is_signed()', code: "from decimal import Decimal\nDecimal('-0').is_signed()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Validating input: is_finite(), is_nan()',
      'Telling quiet from signaling NaNs, and -0 from 0',
      'number_class() when you need sign and kind in one value',
    ],
    avoid: [
      'math.isnan / math.isinf on Decimals → they convert to float',
      'is_canonical(), canonical(), radix() in real code — they are constant',
      'is_normal() without thinking about which context\'s Emin applies',
    ],
  },

  notes: {
    cpython:      'Each method is a direct libmpdec test (mpd_isnan, mpd_issubnormal, mpd_class, …); none of them sets flags or raises, sNaN included',
    'number_class': "One of '-Infinity', '-Normal', '-Subnormal', '-Zero', '+Zero', '+Subnormal', '+Normal', '+Infinity', 'NaN', 'sNaN'",
    'Subnormal':  'A non-zero finite number is subnormal when its adjusted exponent is below Emin; zeros are neither normal nor subnormal',
    'Context forms': 'ctx.is_canonical(x) and ctx.canonical(x) require a Decimal (TypeError otherwise); the other Context predicates accept ints',
  },

  related: [
    { name: 'Context', slug: 'context', when: 'Emin, Emax, Etiny' },
    { name: 'Overflow, Underflow, Subnormal', slug: 'overflow-underflow', when: 'The signals behind subnormal results' },
    { name: 'InvalidOperation', slug: 'invalidoperation', when: 'What a signaling NaN triggers' },
    { name: 'math.isnan / isinf', slug: 'isfinite-isinf-isnan', when: 'The float versions', category: 'stdlib/math' },
  ],

  faq: [
    {
      q: 'How do I check if a Decimal is NaN?',
      a: "x.is_nan() — True for both quiet NaN and signaling sNaN. is_qnan() and is_snan() tell them apart. Avoid x != x: it works for a quiet NaN but signals InvalidOperation for sNaN.",
    },
    {
      q: 'What is a subnormal Decimal?',
      a: "A non-zero number whose adjusted exponent is below the context's Emin (default -999999). It is stored with fewer significant digits, down to Etiny() = Emin - prec + 1; below that it underflows to zero.",
    },
    {
      q: 'What does number_class() return?',
      a: "A string naming the sign and kind: '-Infinity', '-Normal', '-Subnormal', '-Zero', '+Zero', '+Subnormal', '+Normal', '+Infinity', 'NaN' or 'sNaN'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.number_class',
    meta:  'decimal.Decimal.number_class and the is_* methods',
  },
};
