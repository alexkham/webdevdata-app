// content/reference/python/stdlib/time/timezone-tzname.js
// time.timezone, altzone, daylight, tzname and time.tzset

export const meta = {
  slug:        'timezone-tzname',
  name:        'time.timezone / altzone / daylight / tzname',
  signature:   'time.timezone · time.altzone · time.daylight · time.tzname · time.tzset()',
  blurb:       "The machine's local time zone as module constants: standard and DST offsets in seconds WEST of UTC, whether DST exists, the two zone names - and tzset() (Unix) to re-read them after changing TZ.",
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.timezone timezone time.altzone altzone time.daylight daylight time.tzname tzname time.tzset tzset python local time zone utc offset seconds west of utc dst daylight saving time zone name TZ environment variable change time zone',
};

export const method = {
  slug:      'timezone-tzname',
  name:      'time.timezone / altzone / daylight / tzname',
  signature: 'time.timezone · time.altzone · time.daylight · time.tzname · time.tzset()',
  returns:   { type: 'int | tuple[str, str] | None', desc: 'timezone, altzone: int seconds west of UTC. daylight: int, nonzero if the zone has DST. tzname: (standard name, DST name). tzset(): None.' },

  category:    'time constant',
  version:     'Python 3 (all versions)',
  hasLiveDemo: false,

  subtitle: 'Four values that describe the local zone of the machine running Python - so they differ from one computer to the next, and this page has no live demo. Note the sign: they count seconds WEST of UTC.',

  covers: ['timezone', 'altzone', 'daylight', 'tzname', 'tzset'],

  cheat: {
    commonCall: 'time.timezone, time.tzname',
    returns:    'e.g. -3600 and (\'CET\', \'CEST\') in Paris on Linux',
    replaces:   'Hard-coded UTC offsets',
    watchOut:   'west-positive: UTC+1 gives timezone = -3600; values reflect the rules at import time',
  },

  attributes: [
    { name: 'timezone', type: 'int',             meaning: 'Offset of local standard time in seconds west of UTC: positive in the Americas, negative in most of Europe, 0 in the UK.' },
    { name: 'altzone',  type: 'int',             meaning: 'Offset of local daylight saving time, seconds west of UTC. Only meaningful when daylight is nonzero.' },
    { name: 'daylight', type: 'int',             meaning: 'Nonzero if a DST zone is defined, 0 otherwise. On Linux CPython sets it by comparing the offsets of January and July of the current year, so a zone that only had DST in the past (Asia/Tokyo) gives 0.' },
    { name: 'tzname',   type: 'tuple[str, str]', meaning: "(standard name, DST name), e.g. ('EST', 'EDT') for New York on Linux; Windows uses long names ending in 'Standard Time' / 'Daylight Time'." },
    { name: 'tzset()',  type: 'Unix only',       meaning: 'Re-reads the TZ environment variable and recomputes the four values above (and what localtime uses). Missing on Windows.' },
  ],

  patterns: [
    {
      name: 'Current offset, DST included',
      desc: 'The docs recommend tm_gmtoff and tm_zone of localtime() over these constants.',
      code: 'import time\nlt = time.localtime()\noffset_hours = lt.tm_gmtoff / 3600  # east-positive\nzone = lt.tm_zone',
    },
    {
      name: 'Pick the right constant yourself',
      desc: 'If you must use them: altzone while DST is in effect, timezone otherwise.',
      code: 'import time\nwest = time.altzone if time.localtime().tm_isdst > 0 else time.timezone\nutc_offset_hours = -west / 3600',
    },
    {
      name: 'Switch the process to another zone (Unix)',
      desc: 'Set TZ to a zoneinfo name or a POSIX rule string, then call tzset().',
      code: "import os, time\nos.environ['TZ'] = 'America/New_York'\ntime.tzset()\nprint(time.tzname)  # ('EST', 'EDT')",
    },
    {
      name: 'Guard tzset on Windows',
      desc: 'Windows has no tzset; check before calling.',
      code: "import time\nif hasattr(time, 'tzset'):\n    time.tzset()",
    },
  ],

  examples: [
    { title: 'timezone is an int',              code: 'import time\ntype(time.timezone).__name__', returns: "'int'" },
    { title: 'tzname is a pair',                code: 'import time\n(type(time.tzname).__name__, len(time.tzname))', returns: "('tuple', 2)" },
    { title: 'daylight is 0 or 1 in practice',  code: 'import time\ntime.daylight in (0, 1)', returns: 'True' },
    { title: 'altzone is an int too',           code: 'import time\nisinstance(time.altzone, int)', returns: 'True' },
    { title: 'The recommended alternative',     code: 'import time\nlt = time.localtime()\nisinstance(lt.tm_gmtoff, int) and isinstance(lt.tm_zone, str)', returns: 'True' },
    { title: 'tzset exists everywhere but Windows', code: "import sys, time\nhasattr(time, 'tzset') == (sys.platform != 'win32')", returns: 'True' },
    { title: 'datetime knows the local offset', code: 'from datetime import datetime\ndatetime.now().astimezone().utcoffset() is not None', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Reading the sign the wrong way',
      desc: 'timezone counts seconds WEST of UTC, the opposite of the usual "UTC+1". Negate it to get the familiar east-positive offset.',
      wrong: { label: 'timezone // 3600',  code: 'timezone = -3600  # what time.timezone holds in Paris (UTC+1)\ntimezone // 3600', output: '-1' },
      fix:   { label: '-timezone // 3600', code: 'timezone = -3600  # what time.timezone holds in Paris (UTC+1)\n-timezone // 3600', output: '1' },
    },
    {
      name: 'Ignoring daylight saving time',
      desc: 'timezone is the STANDARD offset. In summer the zone is at altzone - which one applies depends on the date (tm_isdst).',
      wrong: { label: 'timezone always',     code: 'timezone, altzone = 18000, 14400  # New York: EST is UTC-5, EDT is UTC-4\ntm_isdst = 1                       # a summer date\n-timezone / 3600', output: '-5.0' },
      fix:   { label: 'altzone when tm_isdst', code: 'timezone, altzone = 18000, 14400  # New York: EST is UTC-5, EDT is UTC-4\ntm_isdst = 1                       # a summer date\n-(altzone if tm_isdst > 0 else timezone) / 3600', output: '-4.0' },
    },
  ],

  when: {
    use: [
      'A quick look at how the machine is configured',
      'Legacy code that formats offsets from these constants',
      'tzset(): tests or tools on Unix that switch TZ at run time',
    ],
    avoid: [
      'Offset of a specific moment → localtime(t).tm_gmtoff (DST and historical rule changes included)',
      'Any zone other than the machine\'s → zoneinfo.ZoneInfo with datetime',
      'Servers and stored data → UTC everywhere; convert only for display',
    ],
  },

  notes: {
    cpython:        "init_timezone() in Modules/timemodule.c sets the four values when the module is imported and again on tzset(). On Linux it calls localtime() for a moment in January and one in July of the current year and takes the offsets and zone names from those two results (swapped in the southern hemisphere) - so altzone is the real summer offset, e.g. -39600 for Australia/Lord_Howe, where timezone is -37800. On Windows it reads the C runtime's timezone and daylight, takes the names from GetTimeZoneInformation(), and altzone is simply timezone - 3600",
    'Stale values': 'The docs warn that the values reflect the rules in effect at import time (or the last tzset()) and may be wrong for dates in the past',
    'Availability': 'tzset(): Unix only. The four values exist on every platform; on Windows tzname holds long names such as "Eastern Standard Time"',
    'TZ format':    "tzset understands POSIX strings like 'EST+05EDT,M4.1.0,M10.5.0' and, on most Unix systems, zoneinfo names like 'Europe/Amsterdam'",
  },

  related: [
    { name: 'localtime / mktime', slug: 'localtime-mktime', when: 'Local conversions these constants describe' },
    { name: 'struct_time attributes', slug: 'struct-time-attributes', when: 'tm_gmtoff and tm_zone - the better source' },
    { name: 'time.strftime',   slug: 'strftime', when: '%z and %Z print the local zone too' },
    { name: 'time module',     slug: 'time',     when: 'Overview', category: 'stdlib' },
    { name: 'datetime.timezone', slug: 'timezone', when: 'Fixed offsets as objects', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'timezone, altzone, daylight and tzname describe the time zone of the machine running Python, so a live result would show the zone of our server, not yours - and tzset() does not exist on Windows. The examples only check types and relations that hold everywhere, and the pitfalls use offsets typed into the code.',
    },
    {
      q: 'Why is time.timezone negative in Europe?',
      a: 'It counts seconds WEST of UTC. Central Europe is one hour east (UTC+1), so timezone is -3600. Negate it, or use localtime().tm_gmtoff, which is east-positive.',
    },
    {
      q: 'How do I get the local time zone name in Python?',
      a: "time.tzname gives (standard, DST) names, and time.localtime().tm_zone the name in effect right now. For a proper zone object use datetime.now().astimezone().tzinfo, or zoneinfo for named IANA zones.",
    },
    {
      q: 'Why does time.tzset() raise AttributeError?',
      a: 'tzset is Unix only - Windows builds of Python do not have it. Check with hasattr(time, "tzset"), or avoid changing the process time zone and use zoneinfo instead.',
    },
    {
      q: 'Do I need to call tzset() after changing os.environ["TZ"]?',
      a: 'Yes, on Unix. The docs say changing TZ may affect localtime() without tzset(), but that should not be relied on - and timezone, altzone, daylight and tzname are only updated by tzset().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#timezone-constants',
    meta:  'Timezone constants and time.tzset',
  },
};
