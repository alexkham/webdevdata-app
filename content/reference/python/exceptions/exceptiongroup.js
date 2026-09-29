// content/reference/python/exceptions/exceptiongroup.js

export const meta = {
  slug:        'exceptiongroup',
  name:        'ExceptionGroup',
  signature:   'ExceptionGroup(msg, excs)',
  blurb:       'Wraps several exceptions raised together so they propagate as one; handled per type with except* (Python 3.11+).',
  category:    'base',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'exceptiongroup baseexceptiongroup exception group except* except star multiple exceptions taskgroup asyncio sub-exceptions subgroup split derive pep 654 3.11',
};

export const method = {
  slug:      'exceptiongroup',
  name:      'ExceptionGroup',
  signature: 'ExceptionGroup(msg, excs)',

  category:    'Base class',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'Several errors at once, in one exception: except* lets each handler take the members of its type, and anything unhandled is re-raised.',

  chain: ['BaseException', 'Exception', 'BaseExceptionGroup', 'ExceptionGroup'],

  cheat: {
    raisedBy: "asyncio.TaskGroup, raise ExceptionGroup('msg', [e1, e2])",
    message:  "msg (N sub-exceptions) — members are listed in the traceback",
    quickFix: 'except* ValueError as eg: ... then eg.exceptions',
    watchOut: 'plain except ValueError does NOT match a group containing ValueErrors',
  },

  parameters: [
    { name: 'msg',  type: 'str', required: true, default: null, desc: 'The group message, available as eg.message. Must be a str.' },
    { name: 'excs', type: 'Sequence[Exception]', required: true, default: null, desc: 'Non-empty sequence of exception instances, stored as the tuple eg.exceptions. ExceptionGroup accepts only Exception subclasses; use BaseExceptionGroup for others.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Validate every item, collect the failures, and raise them all at once instead of stopping at the first.',
      params: [{ name: 'values', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: "def parse_all(values):\n    nums, errors = [], []\n    for v in values:\n        try:\n            nums.append(int(v))\n        except ValueError as e:\n            errors.append(e)\n    if errors:\n        raise ExceptionGroup('bad values', errors)\n    return nums\ntry:\n    r = parse_all({$values})\nexcept ExceptionGroup as eg:\n    r = (str(eg), eg.exceptions)\nr",
      cases: [
        { id: 'ok',   label: 'all valid', values: { values: '1, 2, 3' } },
        { id: 'one',  label: 'one bad',   values: { values: '1, x, 3' } },
        { id: 'two',  label: 'two bad',   values: { values: '1, x, 2.5' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Build a group of n exceptions. str() counts the members; an empty group is not allowed.',
      params: [{ name: 'n', type: 'int', hint: 'number of members', input: 'number' }],
      template: "eg = ExceptionGroup('batch', [ValueError(i) for i in range({$n})])\nstr(eg)",
      cases: [
        { id: 'three', label: 'n = 3', values: { n: '3' } },
        { id: 'one',   label: 'n = 1', values: { n: '1' } },
        { id: 'zero',  label: 'n = 0', values: { n: '0' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'except* ValueError receives a group holding only the ValueErrors.',
      params: [{ name: 'values', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: "def parse_all(values):\n    nums, errors = [], []\n    for v in values:\n        try:\n            nums.append(int(v))\n        except ValueError as e:\n            errors.append(e)\n    if errors:\n        raise ExceptionGroup('bad values', errors)\n    return nums\ntry:\n    r = parse_all({$values})\nexcept* ValueError as eg:\n    r = [str(e) for e in eg.exceptions]\nr",
      cases: [
        { id: 'two', label: 'two bad',   values: { values: 'ten, 20, 3.0' } },
        { id: 'ok',  label: 'all valid', values: { values: '10, 20' } },
      ],
    },
  ],
  demoExplainer: "Every bad value is reported, not just the first — that is the point of a group. str(eg) only counts the members ('bad values (2 sub-exceptions)'); the details live in eg.exceptions. Uncaught, a group prints a traceback with one numbered section per member. In Raise, try n = 0: a group must contain at least one exception.",

  attributes: [
    { name: 'message',    type: 'str', meaning: 'The msg argument. Read-only.' },
    { name: 'exceptions', type: 'tuple', meaning: 'The member exceptions (may include nested groups). Read-only.' },
    { name: 'subgroup(condition)', type: 'method', meaning: 'A new group with only the matching members (a type, a tuple of types, or since 3.13 any callable), or None if nothing matches.' },
    { name: 'split(condition)',    type: 'method', meaning: '(match, rest) — subgroup(condition) plus a group of the non-matching members; either side may be None.' },
    { name: 'derive(excs)',        type: 'method', meaning: 'Same message, new members. Override it in subclasses so subgroup()/split() build your class.' },
  ],

  patterns: [
    {
      name: 'Report every validation failure',
      desc: 'Collect errors in a list, raise them together at the end.',
      code: "errors = []\nfor field, value in form.items():\n    try:\n        validate(field, value)\n    except ValueError as e:\n        e.add_note(f'field: {field}')\n        errors.append(e)\nif errors:\n    raise ExceptionGroup('invalid form', errors)",
    },
    {
      name: 'Handle each type separately',
      desc: 'Each except* clause runs at most once, with a group of just its matches. Unmatched members are re-raised.',
      code: "try:\n    run_all()\nexcept* TimeoutError as eg:\n    retry_later(len(eg.exceptions))\nexcept* ConnectionError as eg:\n    for e in eg.exceptions:\n        log.warning('connection failed: %s', e)",
    },
    {
      name: 'Concurrent tasks with asyncio.TaskGroup',
      desc: 'If tasks fail, TaskGroup cancels the rest and raises an ExceptionGroup of the failures.',
      code: "async def main():\n    try:\n        async with asyncio.TaskGroup() as tg:\n            for url in urls:\n                tg.create_task(fetch(url))\n    except* OSError as eg:\n        print(f'{len(eg.exceptions)} downloads failed')",
    },
  ],

  examples: [
    { title: 'message and exceptions', code: "eg = ExceptionGroup('two errors', [ValueError('a'), TypeError('b')])\n(str(eg), eg.exceptions)", returns: "('two errors (2 sub-exceptions)', (ValueError('a'), TypeError('b')))" },
    { title: 'except* runs one handler per type', code: "log = []\ntry:\n    raise ExceptionGroup('many', [ValueError('a'), TypeError('b'), ValueError('c')])\nexcept* ValueError as eg:\n    log.append(('value', len(eg.exceptions)))\nexcept* TypeError as eg:\n    log.append(('type', len(eg.exceptions)))\nlog", returns: "[('value', 2), ('type', 1)]" },
    { title: 'Unhandled members are re-raised', code: "try:\n    raise ExceptionGroup('many', [ValueError('a'), KeyError('k')])\nexcept* ValueError:\n    pass", returns: 'ExceptionGroup: many (1 sub-exception)' },
    { title: 'split() into match and rest', code: "eg = ExceptionGroup('m', [ValueError('a'), TypeError('b')])\neg.split(ValueError)", returns: "(ExceptionGroup('m', [ValueError('a')]), ExceptionGroup('m', [TypeError('b')]))" },
    { title: 'subgroup() with a predicate (3.13+)', code: "eg = ExceptionGroup('m', [ValueError('bad id'), ValueError('bad name')])\neg.subgroup(lambda e: 'id' in str(e))", returns: "ExceptionGroup('m', [ValueError('bad id')])" },
    { title: 'except* also catches a bare exception', code: "try:\n    raise ValueError('x')\nexcept* ValueError as eg:\n    r = repr(eg)\nr", returns: "\"ExceptionGroup('', (ValueError('x'),))\"" },
    { title: 'BaseExceptionGroup picks the right class', code: "[type(BaseExceptionGroup('m', [ValueError()])).__name__,\n type(BaseExceptionGroup('m', [KeyboardInterrupt()])).__name__]", returns: "['ExceptionGroup', 'BaseExceptionGroup']" },
    { title: 'asyncio.TaskGroup raises a group', code: "import asyncio\nasync def fail(x):\n    raise ValueError(x)\nasync def main():\n    async with asyncio.TaskGroup() as tg:\n        tg.create_task(fail('a'))\n        tg.create_task(fail('b'))\ntry:\n    asyncio.run(main())\nexcept* ValueError as eg:\n    r = (eg.message, sorted(str(e) for e in eg.exceptions))\nr", returns: "('unhandled errors in a TaskGroup', ['a', 'b'])" },
  ],

  pitfalls: [
    {
      name: 'Plain except does not look inside the group',
      desc: 'except ValueError matches only an exception whose type is ValueError. A group is an ExceptionGroup, so it goes straight past.',
      wrong: { label: 'except ValueError', code: "try:\n    raise ExceptionGroup('batch', [ValueError('bad')])\nexcept ValueError:\n    r = 'handled'\nr", output: 'ExceptionGroup: batch (1 sub-exception)' },
      fix:   { label: 'except* ValueError', code: "try:\n    raise ExceptionGroup('batch', [ValueError('bad')])\nexcept* ValueError:\n    r = 'handled'\nr", output: "'handled'" },
    },
    {
      name: 'Mixing except and except*',
      desc: 'A try statement uses either except or except* clauses, never both — it is a SyntaxError before anything runs.',
      wrong: { label: 'except + except*', code: "try:\n    pass\nexcept* ValueError:\n    pass\nexcept TypeError:\n    pass", output: "SyntaxError: cannot have both 'except' and 'except*' on the same 'try'" },
      fix:   { label: 'all except*', code: "try:\n    raise ExceptionGroup('m', [TypeError('t')])\nexcept* ValueError:\n    r = 'value'\nexcept* TypeError:\n    r = 'type'\nr", output: "'type'" },
    },
    {
      name: 'ExceptionGroup cannot hold KeyboardInterrupt',
      desc: 'ExceptionGroup only wraps Exception subclasses. For BaseExceptions use BaseExceptionGroup (or let it choose automatically).',
      wrong: { label: 'ExceptionGroup', code: "ExceptionGroup('stop', [KeyboardInterrupt()])", output: 'TypeError: Cannot nest BaseExceptions in an ExceptionGroup' },
      fix:   { label: 'BaseExceptionGroup', code: "BaseExceptionGroup('stop', [KeyboardInterrupt()])", output: "BaseExceptionGroup('stop', [KeyboardInterrupt()])" },
    },
    {
      name: 'except* ExceptionGroup',
      desc: 'except* already unpacks groups; asking it to match a group type is a TypeError at runtime. Use a plain except to catch the whole group.',
      wrong: { label: 'except* ExceptionGroup', code: "try:\n    raise ExceptionGroup('m', [ValueError()])\nexcept* ExceptionGroup:\n    r = 'handled'\nr", output: 'TypeError: catching ExceptionGroup with except* is not allowed. Use except instead.' },
      fix:   { label: 'except ExceptionGroup', code: "try:\n    raise ExceptionGroup('m', [ValueError()])\nexcept ExceptionGroup as eg:\n    r = len(eg.exceptions)\nr", output: '1' },
    },
  ],

  when: {
    use: [
      'Concurrency: several tasks can fail at once (asyncio.TaskGroup, your own worker pools)',
      'Validation that should report every problem, not just the first',
      'Cleanup code where more than one step can fail and none should be lost',
    ],
    avoid: [
      'Only one thing can fail → raise that exception directly',
      'Code that must run on Python 3.10 or older → the exceptiongroup backport or a list attribute on your own exception',
      'Just adding context to one error → add_note() or raise ... from e',
    ],
  },

  notes: {
    cpython:   'Objects/exceptions.c — BaseExceptionGroup.__new__ returns an ExceptionGroup when every member is an Exception',
    PEP:       'PEP 654 — Exception Groups and except*',
    'Nesting': 'Members may themselves be groups; subgroup()/split() preserve the nesting and drop empty sub-groups',
    'except* limits': 'break, continue and return are not allowed inside an except* block',
  },

  related: [
    { name: 'Exception',         slug: 'exception',         when: 'What ExceptionGroup members must be' },
    { name: 'BaseException',     slug: 'baseexception',     when: 'BaseExceptionGroup wraps these too' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'Needs BaseExceptionGroup, not ExceptionGroup' },
    { name: 'TimeoutError',      slug: 'timeouterror',      when: 'Common member of TaskGroup failures' },
    { name: 'isinstance',        slug: 'isinstance',        when: 'The match rule except* applies per member', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is except* in Python?',
      a: "except* (Python 3.11+) handles exception groups. except* ValueError as eg matches the ValueErrors inside a group; eg is a new ExceptionGroup containing just those. Every except* clause whose type matches runs once, and members no clause handled are re-raised in a group after the try statement.",
    },
    {
      q: 'What is the difference between ExceptionGroup and BaseExceptionGroup?',
      a: 'ExceptionGroup subclasses Exception and may only contain Exception instances, so except Exception catches it. BaseExceptionGroup subclasses BaseException and may contain anything, including KeyboardInterrupt and SystemExit. Calling BaseExceptionGroup(...) returns an ExceptionGroup automatically when all members are Exceptions.',
    },
    {
      q: 'Why does except ValueError not catch my ExceptionGroup?',
      a: 'A plain except checks the type of the raised object, which is ExceptionGroup, not ValueError. Use except* ValueError to match members inside the group, or except ExceptionGroup to catch the whole group and inspect eg.exceptions.',
    },
    {
      q: 'Where do ExceptionGroups come from if I never raise one?',
      a: 'Most often from asyncio.TaskGroup (Python 3.11+): when tasks fail it raises ExceptionGroup(\'unhandled errors in a TaskGroup\', [...]) with every failure. Libraries such as trio and anyio do the same for their task groups.',
    },
    {
      q: 'Can I use ExceptionGroup before Python 3.11?',
      a: 'Not as a built-in — ExceptionGroup, BaseExceptionGroup and the except* syntax were added in 3.11. The exceptiongroup package on PyPI backports the classes and a catch() helper, but the except* syntax itself needs 3.11.',
    },
  ],

  history: [
    { version: '3.11', note: 'ExceptionGroup and BaseExceptionGroup were added.' },
    { version: '3.13', note: 'subgroup() and split() accept any callable (other than a type object) as the condition.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ExceptionGroup',
    meta:  'Built-in exceptions',
  },
};
