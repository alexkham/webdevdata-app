// content/reference/python/stdlib/time/struct-time-attributes.js
// the eleven named fields of time.struct_time

export const meta = {
  slug:        'struct-time-attributes',
  name:        'struct_time attributes',
  signature:   'st.tm_year, st.tm_mon, st.tm_mday, st.tm_hour, st.tm_min, st.tm_sec, st.tm_wday, st.tm_yday, st.tm_isdst, st.tm_zone, st.tm_gmtoff',
  blurb:       'The fields of a struct_time: tm_year, tm_mon (1-12), tm_mday, tm_hour, tm_min, tm_sec (0-61), tm_wday (Monday = 0), tm_yday (1-366), tm_isdst, plus tm_zone and tm_gmtoff.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3 (all versions); tm_zone / tm_gmtoff on all platforms since 3.6',
  searchTerms: 'struct_time attributes struct_time.tm_year struct_time.tm_mon struct_time.tm_mday struct_time.tm_hour struct_time.tm_min struct_time.tm_sec struct_time.tm_wday struct_time.tm_yday struct_time.tm_isdst struct_time.tm_zone struct_time.tm_gmtoff tm_year tm_mon tm_mday tm_hour tm_min tm_sec tm_wday tm_yday tm_isdst tm_zone tm_gmtoff weekday monday 0 day of year dst flag utc offset',
};

export const method = {
  slug:      'struct-time-attributes',
  name:      'struct_time attributes',
  signature: 'st.tm_year, st.tm_mon, st.tm_mday, st.tm_hour, st.tm_min, st.tm_sec, st.tm_wday, st.tm_yday, st.tm_isdst, st.tm_zone, st.tm_gmtoff',
  returns:   { type: 'int | str | None', desc: 'The nine sequence fields are ints; tm_zone is a str and tm_gmtoff an int, or None when unknown.' },

  category:    'struct_time attribute',
  version:     'Python 3 (all versions); tm_zone / tm_gmtoff on all platforms since 3.6',
  hasLiveDemo: true,

  subtitle: 'Mostly the C struct tm, with friendlier numbering: the year is the real year and the month counts 1-12. The traps are the zero-based weekday and the one-based day of the year.',

  covers: [
    'struct_time.tm_year', 'struct_time.tm_mon', 'struct_time.tm_mday', 'struct_time.tm_hour', 'struct_time.tm_min',
    'struct_time.tm_sec', 'struct_time.tm_wday', 'struct_time.tm_yday', 'struct_time.tm_isdst', 'struct_time.tm_zone',
    'struct_time.tm_gmtoff',
  ],

  cheat: {
    commonCall: 'st = time.gmtime(ts); st.tm_year, st.tm_mon, st.tm_mday',
    returns:    'ints (tm_zone: str)',
    replaces:   'st[0], st[1], st[2] - indexes nobody remembers',
    watchOut:   'tm_wday: Monday = 0; tm_mon and tm_yday start at 1',
  },

  attributes: [
    { name: 'tm_year  [0]',  type: 'int',  meaning: 'The full year, e.g. 2026 (C stores year - 1900; Python does not).' },
    { name: 'tm_mon   [1]',  type: '1-12', meaning: 'Month, January = 1 (C uses 0-11).' },
    { name: 'tm_mday  [2]',  type: '1-31', meaning: 'Day of the month.' },
    { name: 'tm_hour  [3]',  type: '0-23', meaning: 'Hour.' },
    { name: 'tm_min   [4]',  type: '0-59', meaning: 'Minute.' },
    { name: 'tm_sec   [5]',  type: '0-61', meaning: 'Second; 60 is a leap second, 61 is accepted "for historical reasons".' },
    { name: 'tm_wday  [6]',  type: '0-6',  meaning: 'Weekday, Monday = 0 ... Sunday = 6 (strftime %w counts Sunday = 0).' },
    { name: 'tm_yday  [7]',  type: '1-366', meaning: 'Day of the year, 1 January = 1.' },
    { name: 'tm_isdst [8]',  type: '-1, 0, 1', meaning: 'Daylight saving time: 1 in effect, 0 not, -1 unknown (what strptime returns, and what mktime should get when unsure).' },
    { name: 'tm_zone',       type: 'str | None', meaning: "Zone abbreviation. Attribute only. gmtime() gives 'UTC' on Windows, 'GMT' on Linux; strptime() gives the text %Z matched, else None." },
    { name: 'tm_gmtoff',     type: 'int | None', meaning: 'Offset east of UTC in seconds (+19800 for +05:30). Attribute only. 0 from gmtime(); from strptime() only with %z, else None.' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'the tricky fields',
      blurb: 'Weekday, day of the year, DST flag and UTC offset of a timestamp, read in UTC.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: 'import time\nst = time.gmtime({$seconds})\n(st.tm_wday, st.tm_yday, st.tm_isdst, st.tm_gmtoff)',
      cases: [
        { id: 'epoch',  label: '0 (a Thursday)', values: { seconds: '0' } },
        { id: 'recent', label: '1790000000',     values: { seconds: '1790000000' } },
        { id: 'leap',   label: '31 Dec 2028',    values: { seconds: '1861833600' } },
      ],
    },
    {
      id: 'names',
      label: 'weekday name',
      blurb: 'Index a Monday-first list with tm_wday.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: "import time\nst = time.gmtime({$seconds})\ndays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']\n(days[st.tm_wday], st.tm_mon, st.tm_mday)",
      cases: [
        { id: 'recent', label: '1790000000', values: { seconds: '1790000000' } },
        { id: 'epoch',  label: '0',          values: { seconds: '0' } },
      ],
    },
  ],
  demoExplainer: '31 December 2028 is day 366: 2028 is a leap year. gmtime always reports tm_isdst = 0 and tm_gmtoff = 0, because UTC has neither daylight saving time nor an offset. tm_zone is left out on purpose - it is "UTC" on Windows but "GMT" on Linux.',

  patterns: [
    {
      name: 'Month name from tm_mon',
      desc: 'Subtract 1 - tm_mon starts at 1, Python lists at 0.',
      code: "import time\nMONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']\nname = MONTHS[time.gmtime(ts).tm_mon - 1]",
    },
    {
      name: 'Is it a weekend?',
      desc: 'Saturday and Sunday are 5 and 6.',
      code: 'import time\nweekend = time.localtime(ts).tm_wday >= 5',
    },
    {
      name: 'Current UTC offset of this machine',
      desc: 'tm_gmtoff of localtime() includes daylight saving time.',
      code: 'import time\nhours = time.localtime().tm_gmtoff / 3600',
    },
  ],

  examples: [
    { title: 'tm_mon starts at 1',                 code: 'import time\ntime.gmtime(0).tm_mon', returns: '1' },
    { title: 'tm_yday starts at 1 (1 Feb = 32)',   code: 'import time\ntime.gmtime(86400 * 31).tm_yday', returns: '32' },
    { title: 'gmtime: never DST',                  code: 'import time\ntime.gmtime(1790000000).tm_isdst', returns: '0' },
    { title: 'tm_gmtoff from a %z offset',         code: "import time\ntime.strptime('+0200', '%z').tm_gmtoff", returns: '7200' },
    { title: 'tm_zone from %Z is the matched text', code: "import time\ntime.strptime('GMT', '%Z').tm_zone", returns: "'GMT'" },
    { title: 'Not parsed means None',              code: "import time\ntime.strptime('2026', '%Y').tm_zone is None", returns: 'True' },
    { title: 'A leap second fits in tm_sec',       code: "import time\ntime.strptime('23:59:60', '%H:%M:%S').tm_sec", returns: '60' },
  ],

  pitfalls: [
    {
      name: 'Indexing a month list with tm_mon',
      desc: 'tm_mon is 1-12, so January picks the second entry (and December runs off the end).',
      wrong: { label: 'months[tm_mon]',     code: "import time\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']\nmonths[time.gmtime(0).tm_mon]", output: "'Feb'" },
      fix:   { label: 'months[tm_mon - 1]', code: "import time\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']\nmonths[time.gmtime(0).tm_mon - 1]", output: "'Jan'" },
    },
    {
      name: 'A Sunday-first weekday list',
      desc: 'tm_wday counts from Monday = 0. 1 January 1970 was a Thursday.',
      wrong: { label: 'Sun-first', code: "import time\n('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')[time.gmtime(0).tm_wday]", output: "'Wed'" },
      fix:   { label: 'Mon-first', code: "import time\n('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')[time.gmtime(0).tm_wday]", output: "'Thu'" },
    },
  ],

  when: {
    use: [
      'Reading calendar fields of a gmtime / localtime / strptime result by name',
      'tm_gmtoff and tm_zone of localtime(): the offset and zone in effect at that moment',
    ],
    avoid: [
      'Week numbers → strftime %U / %W / %V or date.isocalendar()',
      'Sub-second parts → datetime (microsecond)',
    ],
  },

  notes: {
    cpython:       'tmtotuple() in Modules/timemodule.c copies a C struct tm: year + 1900, month + 1, (weekday + 6) % 7 so that Monday = 0, day of year + 1',
    'Attribute only': 'tm_zone and tm_gmtoff are not tuple items (n_sequence_fields is 9) and do not take part in comparisons',
    'Read-only':   'Every field is read-only; build a new struct_time to change one',
  },

  related: [
    { name: 'time.struct_time', slug: 'struct-time',      when: 'The class, construction, tuple behaviour' },
    { name: 'time.gmtime',      slug: 'gmtime',           when: 'Fields of a timestamp in UTC' },
    { name: 'localtime / mktime', slug: 'localtime-mktime', when: 'Local fields with tm_isdst, tm_zone, tm_gmtoff' },
    { name: 'time.strptime',    slug: 'strptime',         when: 'Fields from text' },
    { name: 'time module',      slug: 'time',             when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does tm_wday start on Monday or Sunday?',
      a: 'Monday = 0 through Sunday = 6, like datetime.weekday(). The C struct tm and the strftime directive %w count from Sunday = 0 instead.',
    },
    {
      q: 'What does tm_isdst = -1 mean?',
      a: 'Unknown. strptime returns it because text rarely says whether daylight saving time applied; passing -1 to mktime lets the C library work it out for the local zone.',
    },
    {
      q: 'What is the difference between tm_gmtoff and time.timezone?',
      a: 'tm_gmtoff is the offset of that particular moment in seconds EAST of UTC, DST included. time.timezone is the standard-time offset of the machine in seconds WEST of UTC, so the signs are opposite.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.struct_time',
    meta:  'struct_time fields',
  },
};
