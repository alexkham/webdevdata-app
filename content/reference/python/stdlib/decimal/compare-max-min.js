// content/reference/python/stdlib/decimal/compare-max-min.js — comparisons, compare*, max*, min*

export const meta = {
  slug:        'compare-max-min',
  name:        'Decimal.compare',
  signature:   'Decimal.compare(other) · compare_signal(other) · compare_total(other) · compare_total_mag(other) · max(other) · min(other) · max_mag(other) · min_mag(other)',
  blurb:       'Comparing Decimals: the ==, < operators (also against ints, floats and Fractions), compare() returning a Decimal, the total order compare_total(), and max/min methods that handle NaN and round to the context.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal compare compare_signal compare_total compare_total_mag max min max_mag min_mag Decimal.compare Decimal.compare_signal Decimal.compare_total Decimal.compare_total_mag Decimal.max Decimal.min Decimal.max_mag Decimal.min_mag Context.compare Context.compare_signal Context.compare_total Context.compare_total_mag Context.max Context.min Context.max_mag Context.min_mag decimal equality float comparison NaN sorting total order',
};

export const method = {
  slug:      'compare-max-min',
  name:      'Decimal.compare',
  signature: 'Decimal.compare(other) · compare_signal(other) · compare_total(other) · compare_total_mag(other) · max(other) · min(other) · max_mag(other) · min_mag(other)',
  returns:   { type: 'Decimal | bool', desc: "compare*: Decimal('-1'), Decimal('0'), Decimal('1') (or NaN); max/min*: one of the operands, rounded to the context; operators: bool." },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "== and < compare numeric values exactly, even against floats: Decimal('1.0') == 1 is True, Decimal('0.1') == 0.1 is False. The methods add what the operators cannot: a Decimal result that can be NaN (compare), a total order that separates 1.0 from 1 and places NaNs (compare_total), and max/min that skip a quiet NaN.",

  covers: [
    'Decimal.compare', 'Decimal.compare_signal', 'Decimal.compare_total', 'Decimal.compare_total_mag',
    'Decimal.max', 'Decimal.min', 'Decimal.max_mag', 'Decimal.min_mag',
    'Context.compare', 'Context.compare_signal', 'Context.compare_total', 'Context.compare_total_mag',
    'Context.max', 'Context.min', 'Context.max_mag', 'Context.min_mag',
  ],

  cheat: {
    commonCall: "Decimal('1.0').compare(Decimal('1'))",
    returns:    "Decimal('0') — equal values; compare_total gives Decimal('-1')",
    replaces:   'cmp()-style three-way comparison',
    watchOut:   '<, <=, >, >= with a NaN raise InvalidOperation (== is just False)',
  },

  parameters: [
    { name: 'other',   type: 'Decimal | int', required: true,  default: null,   desc: 'The value to compare with. The methods accept Decimal or int; the operators also accept float and Fraction (compared exactly).' },
    { name: 'context', type: 'Context',       required: false, default: 'None', desc: 'For compare, compare_signal and max/min*: where NaN signals go and how the max/min result is rounded. compare_total(_mag) ignore it.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'compare vs ==',
      blurb: 'Numeric comparison, total order, and the operators for two Decimals.',
      params: [
        { name: 'a', type: 'str', hint: 'a number', input: 'text' },
        { name: 'b', type: 'str', hint: 'a number', input: 'text' },
      ],
      template: 'from decimal import Decimal\na, b = Decimal({$a}), Decimal({$b})\n(a.compare(b), a.compare_total(b), a == b, a < b)',
      cases: [
        { id: 'zeros', label: '1.0 and 1',   values: { a: '1.0', b: '1' } },
        { id: 'less',  label: '2 and 10',    values: { a: '2', b: '10' } },
        { id: 'sign',  label: '-0 and 0',    values: { a: '-0', b: '0' } },
        { id: 'nan',   label: 'NaN and 1',   values: { a: 'NaN', b: '1' } },
      ],
    },
    {
      id: 'float',
      label: 'against a float',
      blurb: 'Comparisons with a float are exact: the float\'s true binary value is used.',
      params: [
        { name: 'a', type: 'str',   hint: 'a Decimal string', input: 'text' },
        { name: 'f', type: 'float', hint: 'a float',          input: 'float' },
      ],
      template: 'from decimal import Decimal\nx = Decimal({$a})\n(x == {$f}, x < {$f}, x > {$f})',
      cases: [
        { id: 'tenth', label: "'0.1' vs 0.1",  values: { a: '0.1', f: '0.1' } },
        { id: 'half',  label: "'0.5' vs 0.5",  values: { a: '0.5', f: '0.5' } },
        { id: 'third', label: "'0.3333333333333333' vs same float", values: { a: '0.3333333333333333', f: '0.3333333333333333' } },
        { id: 'int',   label: "'2.0' vs 2.0",  values: { a: '2.0', f: '2' } },
      ],
    },
    {
      id: 'maxmin',
      label: 'max / min',
      blurb: 'The methods versus the built-in max(): sign, magnitude, and what happens with NaN.',
      params: [
        { name: 'a', type: 'str', hint: 'a number', input: 'text' },
        { name: 'b', type: 'str', hint: 'a number', input: 'text' },
      ],
      template: 'from decimal import Decimal\na, b = Decimal({$a}), Decimal({$b})\n(a.max(b), a.min(b), a.max_mag(b), a.min_mag(b), max(a, b))',
      cases: [
        { id: 'sign',  label: '-3 and 2',   values: { a: '-3', b: '2' } },
        { id: 'tie',   label: '1.0 and 1',  values: { a: '1.0', b: '1' } },
        { id: 'nan',   label: 'NaN and 5',  values: { a: 'NaN', b: '5' } },
      ],
    },
  ],
  demoExplainer: '1.0 and 1 are numerically equal (compare gives 0, == is True), but compare_total puts 1.0 first (-1) because its exponent is smaller; -0 and 0 likewise. With a NaN, compare returns NaN and == would be False, but < raises InvalidOperation. Against floats the comparison is exact: the float 0.1 is slightly larger than one tenth, so Decimal(\'0.1\') < 0.1; the float nearest 0.3333333333333333 is slightly larger than that 16-digit Decimal too; 0.5 and 2.0 are exact in binary and compare equal. max_mag/min_mag compare absolute values (-3 beats 2). For the tie 1.0 / 1, a.max(b) uses the total order and returns 1, while the built-in max() keeps the first argument, 1.0. With NaN and 5 the whole tuple fails: a.max(b) alone would return 5 (a quiet NaN is skipped, as in the examples), but the built-in max() compares with >, which raises InvalidOperation for a NaN.',

  patterns: [
    {
      name: 'Three-way comparison as an int',
      desc: 'compare() returns a Decimal; int() turns it into -1, 0 or 1 (NaN would fail).',
      code: 'from decimal import Decimal\nsign = int(a.compare(b))',
    },
    {
      name: 'Sort including NaNs',
      desc: 'compare_total defines an order for every Decimal, NaNs included.',
      code: 'import functools\nordered = sorted(values, key=functools.cmp_to_key(lambda a, b: int(a.compare_total(b))))',
    },
    {
      name: 'Largest value, ignoring missing data',
      desc: 'max() as a method skips a quiet NaN on either side.',
      code: "from decimal import Decimal\nfrom functools import reduce\nbest = reduce(lambda a, b: a.max(b), readings, Decimal('NaN'))",
    },
  ],

  examples: [
    { title: 'Equal values, compare() is 0', code: "from decimal import Decimal\nDecimal('1.0').compare(Decimal('1'))", returns: "Decimal('0')" },
    { title: 'Total order separates them',   code: "from decimal import Decimal\nDecimal('12.0').compare_total(Decimal('12'))", returns: "Decimal('-1')" },
    { title: 'compare_total_mag ignores signs', code: "from decimal import Decimal\nDecimal('-5').compare_total_mag(Decimal('3'))", returns: "Decimal('1')" },
    { title: 'NaN: compare quietly, compare_signal loudly', code: "from decimal import Decimal\nDecimal('NaN').compare(1)", returns: "Decimal('NaN')" },
    { title: 'max() skips a quiet NaN',      code: "from decimal import Decimal\nDecimal('NaN').max(Decimal(5))", returns: "Decimal('5')" },
    { title: 'max_mag compares sizes',       code: 'from decimal import Decimal\nDecimal(-3).max_mag(2)', returns: "Decimal('-3')" },
    { title: 'Sorting mixed numbers',        code: "from decimal import Decimal\nsorted([Decimal('0.3'), 0.1, 2, Decimal('1.5')])", returns: "[0.1, Decimal('0.3'), Decimal('1.5'), 2]" },
    { title: 'Context methods round the result', code: "from decimal import Context, Decimal\nContext(prec=3).max(Decimal('1.2345'), 1)", returns: "Decimal('1.23')" },
  ],

  pitfalls: [
    {
      name: 'Sorting a list that contains NaN',
      desc: 'sorted() uses <, and an ordering comparison with NaN signals InvalidOperation. Use the total order as a key.',
      wrong: { label: 'sorted()', code: "from decimal import Decimal\nsorted([Decimal('1'), Decimal('NaN')])", output: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
      fix:   { label: 'compare_total key', code: "import functools\nfrom decimal import Decimal\nsorted([Decimal('NaN'), Decimal('1'), Decimal('-2')], key=functools.cmp_to_key(lambda a, b: int(a.compare_total(b))))", output: "[Decimal('-2'), Decimal('1'), Decimal('NaN')]" },
    },
    {
      name: 'Comparing with a float literal',
      desc: 'The comparison is exact, and the float 0.1 is not one tenth. Compare Decimals with Decimals.',
      wrong: { label: '== 0.1', code: "from decimal import Decimal\nDecimal('0.1') == 0.1", output: 'False' },
      fix:   { label: '== Decimal(str(0.1))', code: "from decimal import Decimal\nDecimal('0.1') == Decimal(str(0.1))", output: 'True' },
    },
    {
      name: 'Deduplicating by value when the representation matters',
      desc: 'Equal Decimals hash the same, so a set keeps one of 1.0 and 1.00. Key on as_tuple() to keep both.',
      wrong: { label: 'set of Decimals', code: "from decimal import Decimal\nlen({Decimal('1.0'), Decimal('1.00')})", output: '1' },
      fix:   { label: 'set of as_tuple()', code: "from decimal import Decimal\nlen({d.as_tuple() for d in (Decimal('1.0'), Decimal('1.00'))})", output: '2' },
    },
  ],

  when: {
    use: [
      '== and < for ordinary comparisons, including against ints and floats',
      'compare_total for a deterministic order of any Decimals (NaNs, -0, different exponents)',
      'max/min methods to ignore missing values represented as NaN',
    ],
    avoid: [
      'compare() when you just need a bool → use the operators',
      'Ordering comparisons on data that may contain NaN → filter or use compare_total',
      'Mixing float literals into comparisons you expect to be decimal-exact',
    ],
  },

  notes: {
    cpython:      "Operators go through Decimal.__eq__/__lt__…: ints and Fractions are compared exactly, floats are converted exactly (setting the FloatOperation flag; ordering comparisons raise if it is trapped)",
    'NaN rules':  '== and != with a quiet NaN return False / True; <, <=, >, >= signal InvalidOperation (raised by default); any comparison with a signaling NaN signals',
    'Total order': '-NaN < -sNaN < -Infinity < negative numbers < -0 < 0 < positive numbers < Infinity < sNaN < NaN; equal values order by exponent',
    'max / min':  'Return the other operand when one is a quiet NaN; a tie is broken by the total order; the result is rounded to the context (Context methods: that context)',
  },

  related: [
    { name: 'FloatOperation', slug: 'floatoperation', when: 'Make float comparisons strict' },
    { name: 'InvalidOperation', slug: 'invalidoperation', when: 'What NaN ordering raises' },
    { name: 'normalize()', slug: 'normalize-adjusted', when: 'Make 1.0 and 1 identical' },
    { name: 'max()', slug: 'max', when: 'The built-in', category: 'functions' },
    { name: 'sorted()', slug: 'sorted', when: 'Sorting Decimals', category: 'functions' },
    { name: '== operator', slug: 'eq', when: 'Equality in general', category: 'operators' },
  ],

  faq: [
    {
      q: 'Can you compare a Decimal with a float in Python?',
      a: "Yes. Since Python 3.2 mixed comparisons are exact: Decimal('0.5') == 0.5 is True, Decimal('0.1') == 0.1 is False because the float is 0.1000000000000000055511151231257827…. Arithmetic between them is still a TypeError.",
    },
    {
      q: "Why is Decimal('1.0') == Decimal('1') True if they print differently?",
      a: 'Equality compares numeric value. The exponent (number of places) is part of the representation, not the value; compare_total() and as_tuple() see the difference.',
    },
    {
      q: 'Why does comparing with Decimal NaN raise an exception?',
      a: 'Ordering a NaN is an invalid operation in the decimal standard, and InvalidOperation is trapped by default. == and != do not signal for a quiet NaN; they return False and True.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.compare',
    meta:  'decimal.Decimal.compare',
  },
};
