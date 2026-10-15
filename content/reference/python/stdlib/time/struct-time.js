// content/reference/python/stdlib/time/struct-time.js
// time.struct_time and its structseq class attributes

export const meta = {
  slug:        'struct-time',
  name:        'time.struct_time',
  signature:   'time.struct_time(sequence, dict={})',
  blurb:       'The named tuple of time fields that gmtime(), localtime() and strptime() return and asctime(), mktime() and strftime() accept: 9 indexable items plus tm_zone and tm_gmtoff as attributes.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3 (all versions); tm_zone / tm_gmtoff on all platforms since 3.6',
  searchTerms: 'time.struct_time struct_time python time tuple named tuple 9-tuple time fields structseq struct_time.n_fields struct_time.n_sequence_fields struct_time.n_unnamed_fields n_fields n_sequence_fields n_unnamed_fields readonly attribute convert struct_time to datetime struct_time to tuple takes an at least 9-sequence',
};

export const method = {
  slug:      'struct-time',
  name:      'time.struct_time',
  signature: 'time.struct_time(sequence, dict={})',
  returns:   { type: 'time.struct_time', desc: 'An immutable tuple subclass. Indexes 0-8 are the nine fields; tm_zone and tm_gmtoff are reachable by name only.' },

  category:    'time class',
  version:     'Python 3 (all versions); tm_zone / tm_gmtoff on all platforms since 3.6',
  hasLiveDemo: true,

  subtitle: 'A tuple with names: st[0] and st.tm_year are the same value. Immutable and only as validated as the code that made it - the constructor checks how many items there are, never their values.',

  covers: ['struct_time', 'struct_time.n_fields', 'struct_time.n_sequence_fields', 'struct_time.n_unnamed_fields'],

  cheat: {
    commonCall: 'st = time.gmtime(ts); st.tm_year, st[:3]',
    returns:    'time.struct_time(tm_year=..., ..., tm_isdst=...)',
    replaces:   'Plain 9-tuples and magic indexes',
    watchOut:   'read-only, len() is 9 although there are 11 fields',
  },

  parameters: [
    { name: 'sequence', type: 'iterable', required: true,  default: null,   desc: '9 to 11 values: the nine tuple fields, optionally followed by tm_zone and tm_gmtoff. Fewer than 9 or more than 11 raises TypeError.' },
    { name: 'dict',     type: 'dict',     required: false, default: '{}', desc: "Values for the fields after the sequence, by name: {'tm_zone': 'UTC', 'tm_gmtoff': 0}. Unknown names raise TypeError since Python 3.13 (3.12 ignores them), and so does anything that is not a dict - even None (time.struct_time() takes a dict as second arg, if any)." },
  ],

  attributes: [
    { name: 'n_sequence_fields', type: 'int = 9',  meaning: 'Fields visible as tuple items (len(st), indexing, unpacking).' },
    { name: 'n_fields',          type: 'int = 11', meaning: 'All fields, including tm_zone and tm_gmtoff, which exist only as attributes.' },
    { name: 'n_unnamed_fields',  type: 'int = 0',  meaning: 'Fields without a name - none for struct_time.' },
    { name: 'tm_year ... tm_gmtoff', type: 'fields', meaning: 'See the struct_time attributes page for ranges and meaning of each field.' },
  ],

  modes: [
    {
      id: 'access',
      label: 'tuple and names',
      blurb: 'The same value by index and by name, slicing, and the length that ignores tm_zone and tm_gmtoff.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: 'import time\nst = time.gmtime({$seconds})\n(st[0], st.tm_year, st[:3], len(st))',
      cases: [
        { id: 'recent', label: '1790000000', values: { seconds: '1790000000' } },
        { id: 'epoch',  label: '0',          values: { seconds: '0' } },
      ],
    },
    {
      id: 'build',
      label: 'build one',
      blurb: 'Construct a struct_time directly. Only the number of items is checked - not the values.',
      params: [
        { name: 'year',  type: 'int', hint: 'year',  input: 'number' },
        { name: 'month', type: 'int', hint: 'month', input: 'number' },
        { name: 'day',   type: 'int', hint: 'day',   input: 'number' },
      ],
      template: 'import time\ntime.struct_time(({$year}, {$month}, {$day}, 0, 0, 0, 0, 1, -1))',
      cases: [
        { id: 'ok',    label: 'a real date',   values: { year: '2026', month: '9',  day: '29' } },
        { id: 'wrong', label: 'month 13',      values: { year: '2026', month: '13', day: '45' } },
      ],
    },
  ],
  demoExplainer: 'Slicing returns a plain tuple, and len() counts only the nine sequence fields. The constructor happily stores month 13 and day 45 - the check happens later, when strftime or asctime receives the value (ValueError: month out of range). Values coming from gmtime, localtime and strptime are always consistent.',

  patterns: [
    {
      name: 'Unpack the date part',
      desc: 'Extended unpacking skips the fields you do not need.',
      code: 'import time\nyear, month, day, *_ = time.gmtime(ts)',
    },
    {
      name: 'struct_time → datetime',
      desc: 'The first six fields are datetime\'s positional arguments.',
      code: 'import time\nfrom datetime import datetime, timezone\ndt = datetime(*time.gmtime(ts)[:6], tzinfo=timezone.utc)',
    },
    {
      name: 'Change one field',
      desc: 'Build a new struct_time; copy.replace() does it by name in Python 3.13+.',
      code: 'import copy, time\nst = time.gmtime(ts)\nnext_year = copy.replace(st, tm_year=st.tm_year + 1)',
    },
    {
      name: 'As a dict',
      desc: 'Field names live on the class as member descriptors.',
      code: "import time\nst = time.gmtime(ts)\nfields = {name: getattr(st, name) for name in dir(st) if name.startswith('tm_')}",
    },
  ],

  examples: [
    { title: 'A tuple subclass',                  code: 'import time\nisinstance(time.gmtime(0), tuple)', returns: 'True' },
    { title: 'As a plain tuple',                  code: 'import time\ntuple(time.gmtime(0))', returns: '(1970, 1, 1, 0, 0, 0, 3, 1, 0)' },
    { title: 'Equal to the plain tuple',          code: 'import time\ntime.gmtime(0) == (1970, 1, 1, 0, 0, 0, 3, 1, 0)', returns: 'True' },
    { title: 'n_fields, n_sequence_fields, n_unnamed_fields', code: 'import time\n(time.struct_time.n_fields, time.struct_time.n_sequence_fields, time.struct_time.n_unnamed_fields)', returns: '(11, 9, 0)' },
    { title: 'Index 9 does not exist',            code: 'import time\ntime.gmtime(0)[9]', returns: 'IndexError: tuple index out of range' },
    { title: 'Extra fields by position',          code: "import time\ntime.struct_time((2026, 9, 29, 14, 30, 0, 1, 272, -1, 'UTC', 0)).tm_zone", returns: "'UTC'" },
    { title: 'Unpacking with a star',             code: 'import time\ny, m, d, *rest = time.gmtime(0)\n(y, m, d, len(rest))', returns: '(1970, 1, 1, 6)' },
    { title: 'At least nine items',               code: 'import time\ntime.struct_time((2026, 9, 29))', returns: 'TypeError: time.struct_time() takes an at least 9-sequence (3-sequence given)' },
  ],

  pitfalls: [
    {
      name: 'Assigning to a field',
      desc: 'struct_time is immutable like any tuple. Build a new one.',
      wrong: { label: 'st.tm_year = ...', code: 'import time\nst = time.gmtime(0)\nst.tm_year = 2027', output: 'AttributeError: readonly attribute' },
      fix:   { label: 'new tuple',        code: 'import time\nst = time.gmtime(0)\ntime.struct_time((2027,) + tuple(st)[1:])', output: 'time.struct_time(tm_year=2027, tm_mon=1, tm_mday=1, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=3, tm_yday=1, tm_isdst=0)' },
    },
    {
      name: 'Unpacking all eleven fields',
      desc: 'Only nine fields are tuple items; tm_zone and tm_gmtoff must be read by name.',
      wrong: { label: '11 names',   code: 'import time\nyear, mon, mday, hour, minute, sec, wday, yday, isdst, zone, gmtoff = time.gmtime(0)', output: 'ValueError: not enough values to unpack (expected 11, got 9)' },
      fix:   { label: 'attributes', code: 'import time\nst = time.gmtime(0)\n(st.tm_gmtoff, isinstance(st.tm_zone, str))', output: '(0, True)' },
    },
  ],

  when: {
    use: [
      'Passing time fields between gmtime / localtime / strptime and strftime / asctime / mktime',
      'Reading calendar fields of a timestamp by name',
    ],
    avoid: [
      'Date arithmetic or comparisons across zones → datetime',
      'Sub-second precision → struct_time has whole seconds only',
    ],
  },

  notes: {
    cpython:        'A structseq type (Objects/structseq.c), like os.stat_result and sys.version_info: a tuple subclass whose visible items are the first n_sequence_fields fields',
    'Equality':     'Compares and hashes like the plain 9-tuple; tm_zone and tm_gmtoff are ignored',
    'Pickling':     '__reduce__ keeps tm_zone and tm_gmtoff in a dict, so they survive pickle and copy',
    'copy.replace': 'Supported for struct_time from Python 3.13 (structseq gained __replace__)',
  },

  related: [
    { name: 'struct_time attributes', slug: 'struct-time-attributes', when: 'Every tm_ field and its range' },
    { name: 'time.gmtime',     slug: 'gmtime',   when: 'The usual way to get one' },
    { name: 'time.strftime',   slug: 'strftime', when: 'Format it as text' },
    { name: 'time module',     slug: 'time',     when: 'Overview', category: 'stdlib' },
    { name: 'datetime.timetuple', slug: 'timetuple', when: 'A struct_time from a datetime', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'How do I convert a struct_time to a datetime?',
      a: 'datetime(*st[:6]) uses the first six fields (year to second). Add tzinfo=timezone.utc when st came from gmtime(). For the opposite direction use dt.timetuple() or dt.utctimetuple().',
    },
    {
      q: 'Why is len(struct_time) 9 when it has 11 fields?',
      a: 'For compatibility with code that expects the classic 9-tuple, tm_zone and tm_gmtoff are extra attributes outside the sequence: n_sequence_fields is 9, n_fields is 11.',
    },
    {
      q: 'Can I modify a struct_time?',
      a: 'No - assignment raises AttributeError: readonly attribute. Create a new one with time.struct_time((new_year,) + tuple(st)[1:]) or, in Python 3.13+, copy.replace(st, tm_year=new_year).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.struct_time',
    meta:  'time.struct_time',
  },
};
