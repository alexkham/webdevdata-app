// content/reference/python/stdlib/re/match-expand.js

export const meta = {
  slug:        'match-expand',
  name:        'Match.expand',
  signature:   'Match.expand(template)',
  blurb:       'Fill a re.sub-style template (\\1, \\g<name>, \\g<0>, \\n) from one match and return the resulting string.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'match expand python regex template backreference \\1 \\g<name> \\g<0> build string from groups Match.expand sub template',
};

export const method = {
  slug:      'match-expand',
  name:      'Match.expand',
  signature: 'Match.expand(template)',
  returns:   { type: 'str', desc: 'The template with group references replaced by the groups of this match.' },

  category:    're.Match method',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The replacement half of re.sub, applied to a single Match: the same template syntax, the same errors, but it returns only the expanded template — not the rest of the string.',

  covers: ['Match.expand'],

  cheat: {
    commonCall: "m.expand(r'\\g<last>, \\g<first>')",
    returns:    "'Lovelace, Ada'",
    replaces:   'f-strings built from m.group(1), m.group(2), …',
    watchOut:   'Template errors (bad escape, invalid group reference) raise re.PatternError',
  },

  parameters: [
    { name: 'template', type: 'str', required: true, default: null, desc: 'Replacement template: \\1…\\99, \\g<number>, \\g<name>, plus escapes like \\n and \\t. Write it as a raw string.' },
  ],

  modes: [
    {
      id: 'expand',
      label: 'expand',
      blurb: 'The first match of the pattern, expanded into the template.',
      params: [
        { name: 'pattern',  type: 'str', hint: 'a regular expression', input: 'text' },
        { name: 'text',     type: 'str', hint: 'text',                 input: 'text' },
        { name: 'template', type: 'str', hint: 'template',             input: 'text' },
      ],
      template: 'import re\nm = re.search({$pattern}, {$text})\nm.expand({$template})',
      cases: [
        { id: 'name',   label: 'swap names',     values: { pattern: '(?P<first>\\w+) (?P<last>\\w+)', text: 'Ada Lovelace', template: '\\g<last>, \\g<first>' } },
        { id: 'num',    label: 'numbered',       values: { pattern: '(\\d+)x(\\d+)', text: 'size 1920x1080', template: 'w=\\1 h=\\2' } },
        { id: 'whole',  label: 'whole match',    values: { pattern: '\\d+', text: 'id 42', template: '#\\g<0>' } },
        { id: 'nl',     label: 'escape \\n',     values: { pattern: '(\\w+)=(\\w+)', text: 'a=1', template: '\\1\\n\\2' } },
        { id: 'bad',    label: 'bad reference',  values: { pattern: '(\\w+)', text: 'hi', template: '\\3' } },
      ],
    },
  ],
  demoExplainer: "expand returns only the filled-in template; re.sub would also keep the text around the match. Escapes such as \\n become real characters (the result shows '\\n' because it is displayed with repr). Referring to a group the pattern does not have raises re.PatternError with a position inside the template.",

  patterns: [
    {
      name: 'One template, many records',
      desc: 'finditer + expand formats every match.',
      code: "import re\nlines = [m.expand(r'\\g<name> <\\g<email>>') for m in re.finditer(r'(?P<name>\\w+): (?P<email>\\S+)', text)]",
    },
    {
      name: 'Template from configuration',
      desc: 'Templates can be stored as data, unlike f-strings.',
      code: "import re\nlabel = m.expand(config['label_template'])",
    },
  ],

  examples: [
    { title: 'Named groups',          code: "import re\nm = re.search(r'(?P<user>\\w+)@(?P<host>[\\w.]+)', 'mail ada@example.com now')\nm.expand(r'\\g<host> <- \\1')", returns: "'example.com <- ada'" },
    { title: 'Numbered groups',       code: "import re\nre.match(r'(\\w+) (\\w+)', 'Ada Lovelace').expand(r'\\2, \\1')", returns: "'Lovelace, Ada'" },
    { title: 'Only the template',     code: "import re\nre.search(r'\\d+', 'id 42 end').expand(r'<\\g<0>>')", returns: "'<42>'" },
    { title: 'Unmatched group → empty', code: "import re\nre.match(r'(a)(b)?', 'a').expand(r'[\\1|\\2]')", returns: "'[a|]'" },
    { title: 'Bad reference',         code: "import re\nre.match(r'(a)', 'a').expand(r'\\2')", returns: 're.PatternError: invalid group reference 2 at position 1' },
  ],

  pitfalls: [
    {
      name: 'Template without a raw string',
      desc: "In a normal string '\\1' is the character with code 1 — the template never sees a group reference.",
      wrong: { label: "'\\1'", code: "import re\nre.match(r'(\\w+)', 'hi').expand('<\\1>')", output: "'<\\x01>'" },
      fix:   { label: "r'\\1'", code: "import re\nre.match(r'(\\w+)', 'hi').expand(r'<\\1>')", output: "'<hi>'" },
    },
    {
      name: 'Escapes that are not allowed',
      desc: 'Unknown escapes of ASCII letters are errors in templates, just like in re.sub.',
      wrong: { label: "r'\\d'", code: "import re\nre.match(r'(\\d)', '7').expand(r'\\d=\\1')", output: 're.PatternError: bad escape \\d at position 0' },
      fix:   { label: 'plain text', code: "import re\nre.match(r'(\\d)', '7').expand(r'digit=\\1')", output: "'digit=7'" },
    },
  ],

  when: {
    use: [
      'Formatting a match with a stored or user-configurable template',
      'Reusing the exact re.sub template syntax for one match',
    ],
    avoid: [
      'Templates you write in code → an f-string with m["name"] is clearer',
      'Replacing inside the full text → re.sub',
    ],
  },

  notes: {
    cpython:   'Match.expand calls re._compile_template (cached) and fills it — the same code path as re.sub with a string repl',
    'Unmatched groups': 'Replaced with an empty string since Python 3.5',
  },

  related: [
    { name: 're.sub',      slug: 'sub',         when: 'The same template, applied to every match in the text' },
    { name: 'Match.group', slug: 'match-group', when: 'Read single groups' },
    { name: 'Match.groups', slug: 'match-groups', when: 'groupdict() for f-strings / str.format' },
    { name: 'str.format()', slug: 'str-format', when: 'Format with {name} fields instead', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does Match.expand do?',
      a: "It substitutes the groups of one match into a template, using the re.sub syntax: re.match(r'(\\w+) (\\w+)', 'Ada Lovelace').expand(r'\\2, \\1') gives 'Lovelace, Ada'.",
    },
    {
      q: 'What is the difference between Match.expand and re.sub?',
      a: 're.sub replaces every match inside the whole string and returns the full new string; expand works on one Match and returns only the expanded template.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.Match.expand',
    meta:  'Match.expand',
  },
};
