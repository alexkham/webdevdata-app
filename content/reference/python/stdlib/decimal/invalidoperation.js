// content/reference/python/stdlib/decimal/invalidoperation.js — InvalidOperation and its four conditions

export const meta = {
  slug:        'invalidoperation',
  name:        'decimal.InvalidOperation',
  signature:   'decimal.InvalidOperation · ConversionSyntax · DivisionImpossible · DivisionUndefined · InvalidContext',
  blurb:       "Raised for an operation that has no sensible result: a string that is not a number, 0/0, Infinity - Infinity, the square root of a negative number, ordering a NaN. The list in the message names the exact condition.",
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: "decimal InvalidOperation ConversionSyntax DivisionImpossible DivisionUndefined InvalidContext decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>] invalid decimal string Decimal('abc') 0/0 decimal NaN sNaN signaling NaN sqrt negative decimal invalid literal for Decimal",
};

export const method = {
  slug:      'invalidoperation',
  name:      'decimal.InvalidOperation',
  signature: 'decimal.InvalidOperation · ConversionSyntax · DivisionImpossible · DivisionUndefined · InvalidContext',

  category:    'decimal exception',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: "What Decimal('abc'), Decimal(0) / 0 and Decimal(-4).sqrt() raise. It is trapped by default; untrapped, the operation returns NaN. CPython always raises the class InvalidOperation itself and names the specific condition — ConversionSyntax, DivisionImpossible, DivisionUndefined or plain InvalidOperation — in the list of the message.",

  covers: ['InvalidOperation', 'ConversionSyntax', 'DivisionImpossible', 'DivisionUndefined', 'InvalidContext'],

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'InvalidOperation'],

  cheat: {
    raisedBy: "Decimal('abc'), 0 / 0, Infinity - Infinity, sqrt or ln of a negative, x % 0, < or > with a NaN, arithmetic or comparison with an sNaN, quantize needing more than prec digits",
    message:  "[<class 'decimal.ConversionSyntax'>]",
    quickFix: 'except decimal.InvalidOperation — e.args[0] lists the specific condition',
    watchOut: 'The raised class is always InvalidOperation: except decimal.ConversionSyntax never matches',
  },

  modes: [
    {
      id: 'conditions',
      label: 'which condition',
      blurb: 'Integer-divide two Decimals; on InvalidOperation show the condition names from the exception.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal, InvalidOperation\ntry:\n    r = Decimal({$a}) // Decimal({$b})\nexcept InvalidOperation as e:\n    r = [c.__name__ for c in e.args[0]]\nr',
      cases: [
        { id: 'syntax', label: "'1,5' // 2",       values: { a: '1,5', b: '2' } },
        { id: 'undef',  label: '0 // 0',           values: { a: '0', b: '0' } },
        { id: 'imposs', label: '1E+30 // 1',       values: { a: '1E+30', b: '1' } },
        { id: 'inf',    label: 'inf // inf',       values: { a: 'Infinity', b: 'Infinity' } },
        { id: 'zero',   label: '7 // 0',           values: { a: '7', b: '0' } },
        { id: 'ok',     label: '7 // 2',           values: { a: '7', b: '2' } },
      ],
    },
    {
      id: 'quiet',
      label: 'untrapped → NaN',
      blurb: 'A private context with no traps: sqrt() returns NaN instead of raising, and the flag records what happened.',
      params: [{ name: 'x', type: 'str', hint: 'a number', input: 'text' }],
      template: 'from decimal import Context, Decimal, InvalidOperation\nctx = Context(traps=[])\nr = ctx.sqrt(Decimal({$x}))\n(r, ctx.flags[InvalidOperation])',
      cases: [
        { id: 'neg',  label: '-4',       values: { x: '-4' } },
        { id: 'pos',  label: '4',        values: { x: '4' } },
        { id: 'nz',   label: '-0',       values: { x: '-0' } },
        { id: 'nan',  label: 'NaN',      values: { x: 'NaN' } },
        { id: 'snan', label: '-sNaN12',  values: { x: '-sNaN12' } },
      ],
    },
    {
      id: 'nan',
      label: 'quiet vs signaling NaN',
      blurb: 'A quiet NaN flows through arithmetic silently; a signaling NaN raises as soon as it is used.',
      params: [{ name: 'x', type: 'str', hint: 'NaN, sNaN or a number', input: 'text' }],
      template: 'from decimal import Decimal\nx = Decimal({$x})\n(x + 1, x.is_nan(), x == x)',
      cases: [
        { id: 'qnan',    label: 'NaN',    values: { x: 'NaN' } },
        { id: 'payload', label: '-NaN7',  values: { x: '-NaN7' } },
        { id: 'snan',    label: 'sNaN',   values: { x: 'sNaN' } },
        { id: 'num',     label: '2',      values: { x: '2' } },
      ],
    },
  ],
  demoExplainer: "In the first tab '1,5' fails while converting (ConversionSyntax: the comma is not allowed), 0 // 0 is DivisionUndefined, and 1E+30 // 1 is DivisionImpossible because the integer quotient would need 31 digits and the default precision is 28. Infinity // Infinity is reported as plain InvalidOperation. 7 // 0 is not caught at all — it is DivisionByZero, a different signal. Untrapped, sqrt(-4) gives NaN and sets the flag, while the square root of -0 is -0 and a quiet NaN passes through without setting it. A signaling NaN is turned into a quiet NaN that keeps its sign and payload (-sNaN12 → -NaN12), with the flag set. In the last tab NaN + 1 is NaN and NaN == NaN is False, but sNaN + 1 raises.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "One item: the list of trapped conditions, e.g. ([<class 'decimal.ConversionSyntax'>],)." },
  ],

  patterns: [
    {
      name: 'Validate user input',
      desc: 'Decimal() is the parser; InvalidOperation means "not a number".',
      code: "from decimal import Decimal, InvalidOperation\n\ndef parse_amount(text):\n    try:\n        return Decimal(text.strip().replace(',', ''))\n    except InvalidOperation:\n        raise ValueError(f'not an amount: {text!r}') from None",
    },
    {
      name: 'Accept only finite numbers',
      desc: "'NaN' and 'Infinity' are valid Decimal strings — reject them explicitly.",
      code: "value = Decimal(text)\nif not value.is_finite():\n    raise ValueError('amount must be a finite number')",
    },
    {
      name: 'NaN instead of an exception for one block',
      desc: 'Untrap the signal locally; check the flag afterwards.',
      code: 'from decimal import InvalidOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[InvalidOperation] = False\n    ctx.clear_flags()\n    results = [x.sqrt() for x in values]\n    had_invalid = ctx.flags[InvalidOperation]',
    },
  ],

  examples: [
    { title: 'Not a number',                    code: "from decimal import Decimal\nDecimal('12.5 kg')", returns: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
    { title: 'Zero divided by zero',            code: 'from decimal import Decimal\nDecimal(0) / 0', returns: "decimal.InvalidOperation: [<class 'decimal.DivisionUndefined'>]" },
    { title: 'Integer quotient too long',       code: "from decimal import Decimal\nDecimal('1E+30') // 1", returns: "decimal.InvalidOperation: [<class 'decimal.DivisionImpossible'>]" },
    { title: 'Infinity minus infinity',         code: "from decimal import Decimal\nDecimal('Infinity') - Decimal('Infinity')", returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
    { title: 'Read the condition',              code: "from decimal import Decimal, InvalidOperation\ntry:\n    Decimal('abc')\nexcept InvalidOperation as e:\n    names = [c.__name__ for c in e.args[0]]\nnames", returns: "['ConversionSyntax']" },
    { title: 'Untrapped: NaN',                  code: "from decimal import Context, Decimal\nDecimal('abc', Context(traps=[]))", returns: "Decimal('NaN')" },
    { title: 'The four condition classes',      code: 'from decimal import InvalidOperation\n[c.__name__ for c in InvalidOperation.__subclasses__()]', returns: "['ConversionSyntax', 'DivisionImpossible', 'DivisionUndefined', 'InvalidContext']" },
    { title: 'Bad context values fail up front', code: 'from decimal import Context\nContext(prec=0)', returns: 'ValueError: valid range for prec is [1, MAX_PREC]' },
  ],

  pitfalls: [
    {
      name: 'Catching ValueError for a bad string',
      desc: "int('abc') and float('abc') raise ValueError, but Decimal('abc') raises InvalidOperation, an ArithmeticError.",
      wrong: { label: 'except ValueError',       code: "from decimal import Decimal\ntry:\n    Decimal('abc')\nexcept ValueError:\n    r = 'not a number'\nr", output: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
      fix:   { label: 'except InvalidOperation', code: "from decimal import Decimal, InvalidOperation\ntry:\n    Decimal('abc')\nexcept InvalidOperation:\n    r = 'not a number'\nr", output: "'not a number'" },
    },
    {
      name: 'Catching the condition class',
      desc: 'ConversionSyntax and the other conditions only appear in the list; the C module raises InvalidOperation itself.',
      wrong: { label: 'except ConversionSyntax', code: "import decimal\ntry:\n    decimal.Decimal('abc')\nexcept decimal.ConversionSyntax:\n    r = 'bad syntax'\nr", output: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
      fix:   { label: 'check e.args[0]',         code: "import decimal\ntry:\n    decimal.Decimal('abc')\nexcept decimal.InvalidOperation as e:\n    r = 'bad syntax' if decimal.ConversionSyntax in e.args[0] else 'other'\nr", output: "'bad syntax'" },
    },
    {
      name: 'Thousands separators in input',
      desc: 'Decimal() accepts digits, one point, an exponent, surrounding whitespace and underscores between digits — not commas or currency signs.',
      wrong: { label: "Decimal('1,234.50')", code: "from decimal import Decimal\nDecimal('1,234.50')", output: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
      fix:   { label: 'remove the commas',    code: "from decimal import Decimal\nDecimal('1,234.50'.replace(',', ''))", output: "Decimal('1234.50')" },
    },
  ],

  when: {
    use: [
      'except InvalidOperation around Decimal(text) to reject input that is not a number',
      'Untrapping it (with localcontext) when NaN results are an acceptable way to mark bad rows',
      "Checking e.args[0] when you must tell bad syntax from 0/0",
    ],
    avoid: [
      'except ValueError for Decimal parsing — it does not catch InvalidOperation',
      'except ConversionSyntax / DivisionUndefined — CPython never raises those classes',
      "Assuming Decimal('NaN') is rejected — it is a valid Decimal; test is_finite()",
    ],
  },

  notes: {
    cpython:       "The C module raises InvalidOperation with the specific conditions as a list ([<class 'decimal.ConversionSyntax'>]). Lib/_pydecimal.py also raises InvalidOperation for these conditions, but with a text explanation such as Invalid literal for Decimal: 'abc'",
    'ConversionSyntax':   'A string that is not a valid number: Decimal(), Context.create_decimal()',
    'DivisionImpossible': 'An integer quotient (//, %, divmod, remainder_near) that needs more digits than prec',
    'DivisionUndefined':  '0 / 0, 0 // 0 and 0 % 0. Also a ZeroDivisionError subclass, but since only InvalidOperation is ever raised, except ZeroDivisionError does not catch 0 / 0',
    'InvalidContext':     'An invalid context detected during an operation. Context() and attribute assignment already validate every field (ValueError or TypeError), so the Python API rejects bad contexts before an operation sees them',
    'Untrapped result':   'A quiet NaN; when the cause is a signaling NaN, a quiet NaN with the same sign and payload',
    'Not InvalidOperation': 'int(x) and round(x) of a NaN raise ValueError: cannot convert NaN to integer; float() of a quiet NaN is nan, of a signaling NaN ValueError: cannot convert signaling NaN to float',
  },

  related: [
    { name: 'DecimalException',  slug: 'decimalexception', when: 'Signals, flags and traps' },
    { name: 'DivisionByZero',    slug: 'divisionbyzero',   when: 'x / 0 when x is not 0' },
    { name: 'Decimal()',         slug: 'decimal',          when: 'What strings are accepted' },
    { name: 'quantize()',        slug: 'quantize',         when: 'When the result would need too many digits' },
    { name: 'is_nan() and friends', slug: 'predicates',    when: 'Test for NaN and sNaN' },
    { name: 'compare()',         slug: 'compare-max-min',  when: 'Comparisons involving NaN' },
    { name: 'ValueError',        slug: 'valueerror',       when: 'What int() and float() raise instead', category: 'exceptions' },
  ],

  faq: [
    {
      q: "What does decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>] mean?",
      a: "The string given to Decimal() is not a number — typically it contains a comma, a currency sign, a unit, or is empty. Clean it first (text.replace(',', '')). Surrounding whitespace and underscores between digits are accepted.",
    },
    {
      q: 'Why does Decimal 0/0 raise InvalidOperation and not DivisionByZero?',
      a: 'Zero divided by zero has no meaningful value, so the specification treats it as an invalid operation (condition DivisionUndefined). Any other number divided by zero is DivisionByZero. With the traps off they give NaN and a signed Infinity.',
    },
    {
      q: 'How do I get NaN instead of an InvalidOperation exception?',
      a: "Turn off the trap for that calculation: with localcontext() as ctx: ctx.traps[InvalidOperation] = False, or use a context built with Context(traps=[]). The flag ctx.flags[InvalidOperation] still records that it happened.",
    },
    {
      q: 'Why does comparing a Decimal NaN with < raise InvalidOperation?',
      a: 'Ordering comparisons with a NaN are invalid operations (a rule taken from IEEE 854), and the signal is trapped by default. == and != with a quiet NaN do not raise: they return False and True.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.InvalidOperation',
    meta:  'decimal.InvalidOperation',
  },
};
