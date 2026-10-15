// content/reference/python/stdlib/logging/loggeradapter.js

export const meta = {
  slug:        'loggeradapter',
  name:        'logging.LoggerAdapter',
  signature:   'logging.LoggerAdapter(logger, extra=None, merge_extra=False)',
  blurb:       'Wrap a logger so that every call carries the same contextual data — a request id, a user, a job name — through extra=, or through your own process() method.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.6+ (merge_extra 3.13+)',
  searchTerms: 'logging LoggerAdapter python add context to log messages request id per request logging LoggerAdapter.process merge_extra extra LoggerAdapter.debug LoggerAdapter.info LoggerAdapter.warning LoggerAdapter.warn LoggerAdapter.error LoggerAdapter.exception LoggerAdapter.critical LoggerAdapter.log LoggerAdapter.isEnabledFor LoggerAdapter.setLevel LoggerAdapter.getEffectiveLevel LoggerAdapter.hasHandlers LoggerAdapter.manager LoggerAdapter.name contextual logging prefix',
};

export const method = {
  slug:      'loggeradapter',
  name:      'logging.LoggerAdapter',
  signature: 'logging.LoggerAdapter(logger, extra=None, merge_extra=False)',
  returns:   { type: 'logging.LoggerAdapter', desc: 'An object with the logging methods of a Logger; each call passes through process() and then to the wrapped logger.' },

  category:    'logging class',
  version:     'Python 2.6+ (merge_extra 3.13+)',
  hasLiveDemo: true,

  subtitle: "adapter.info(msg, *args, **kwargs) checks the logger's level, calls self.process(msg, kwargs) — which by default puts the adapter's extra dict into kwargs['extra'] — and forwards everything to logger.log(). Until 3.13 the adapter's extra simply replaced any extra= passed to the call; merge_extra=True (3.13+) merges the two, the call's values winning.",

  covers: [
    'LoggerAdapter', 'LoggerAdapter.process', 'LoggerAdapter.debug', 'LoggerAdapter.info', 'LoggerAdapter.warning',
    'LoggerAdapter.warn', 'LoggerAdapter.error', 'LoggerAdapter.exception', 'LoggerAdapter.critical', 'LoggerAdapter.log',
    'LoggerAdapter.isEnabledFor', 'LoggerAdapter.setLevel', 'LoggerAdapter.getEffectiveLevel', 'LoggerAdapter.hasHandlers',
    'LoggerAdapter.manager', 'LoggerAdapter.name',
  ],

  cheat: {
    commonCall: "log = logging.LoggerAdapter(logging.getLogger(__name__), {'request_id': rid})",
    returns:    '<LoggerAdapter app.api (WARNING)>',
    replaces:   'repeating extra={...} on every call',
    watchOut:   'without merge_extra=True a call’s own extra= is ignored',
  },

  parameters: [
    { name: 'logger',      type: 'Logger',       required: true,  default: null,    desc: 'The logger to forward to (stored as adapter.logger; another adapter works too).' },
    { name: 'extra',       type: 'dict | None',  required: false, default: 'None',  desc: 'Context put on every record as attributes, for the format string (optional since 3.10).' },
    { name: 'merge_extra', type: 'bool',         required: false, default: 'False', desc: "3.13+: merge the adapter's extra with the extra= of each call instead of replacing it." },
  ],

  attributes: [
    { name: 'logger',      type: 'Logger',      meaning: 'The wrapped logger' },
    { name: 'extra',       type: 'dict | None', meaning: 'The context dict' },
    { name: 'merge_extra', type: 'bool',        meaning: 'Whether per-call extra is merged (3.13+)' },
    { name: 'name / manager', type: 'property', meaning: "The wrapped logger's name (read-only) and manager (assigning it sets logger.manager)" },
  ],

  modes: [
    {
      id: 'extra',
      label: 'merge_extra',
      blurb: "The adapter carries request_id 'r-17'. The second call also passes extra={'user': …}. merge_extra: 1 = True, 0 = False. Missing fields print as '-'.",
      params: [
        { name: 'merge', type: 'int', hint: '1 or 0',    input: 'number' },
        { name: 'user',  type: 'any', hint: 'a user name', input: 'auto' },
      ],
      template: "import io, logging\nlog = logging.getLogger('api')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('[%(request_id)s] [%(user)s] %(message)s', defaults={'request_id': '-', 'user': '-'}))\nlog.addHandler(handler)\nadapter = logging.LoggerAdapter(log, {'request_id': 'r-17'}, merge_extra=bool({$merge}))\ntry:\n    adapter.info('request started')\n    adapter.info('signed in', extra={'user': {$user}})\nfinally:\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'replace', label: 'merge_extra=False', values: { merge: '0', user: 'ada' } },
        { id: 'merge',   label: 'merge_extra=True',  values: { merge: '1', user: 'ada' } },
        { id: 'int',     label: 'user 42, merged',   values: { merge: '1', user: '42' } },
      ],
    },
    {
      id: 'process',
      label: 'process()',
      blurb: "JobAdapter overrides process() to put the job name in front of every message; the %-arguments still work.",
      params: [{ name: 'job', type: 'any', hint: 'a job name', input: 'auto' }],
      template: "import io, logging\nclass JobAdapter(logging.LoggerAdapter):\n    def process(self, msg, kwargs):\n        return f\"[{self.extra['job']}] {msg}\", kwargs\nlog = logging.getLogger('api.jobs')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nadapter = JobAdapter(log, {'job': {$job}})\ntry:\n    adapter.warning('retry %d of %d', 2, 3)\n    adapter.info('100% done')\nfinally:\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'name',  label: "'nightly-backup'", values: { job: 'nightly-backup' } },
        { id: 'num',   label: '7',                values: { job: '7' } },
      ],
    },
  ],
  demoExplainer: "By default the adapter overwrites kwargs['extra'] with its own dict, so the user passed to the second call is lost and the field falls back to its default '-'. With merge_extra=True (Python 3.13+; older versions reject the keyword) both dicts reach the record. In the process() tab the prefix is added to msg before the logger sees it; '%d of %d' is still filled from the arguments, and '100% done' — logged without arguments — is never %-formatted.",

  patterns: [
    {
      name: 'One adapter per request',
      desc: 'Cheap to create; every line of the request carries its id.',
      code: "import logging\nlog = logging.getLogger(__name__)\n\ndef handle(request):\n    rlog = logging.LoggerAdapter(log, {'request_id': request.id})\n    rlog.info('started %s', request.path)\n    ...\n    rlog.info('finished')",
    },
    {
      name: 'Prefix messages instead of adding fields',
      desc: 'Works with any format string, no %(field)s needed.',
      code: "import logging\n\nclass PrefixAdapter(logging.LoggerAdapter):\n    def process(self, msg, kwargs):\n        return f\"[{self.extra['prefix']}] {msg}\", kwargs",
    },
    {
      name: 'Context plus per-call fields (3.13+)',
      desc: 'merge_extra keeps both.',
      code: "import logging\nlog = logging.LoggerAdapter(logging.getLogger(__name__), {'tenant': tenant}, merge_extra=True)\nlog.info('invoice created', extra={'invoice': invoice_id})",
    },
  ],

  examples: [
    { title: 'process() injects extra',        code: "import logging\nlogging.LoggerAdapter(logging.getLogger('api.e2'), {'a': 1}).process('msg', {})", returns: "('msg', {'extra': {'a': 1}})" },
    { title: 'It delegates to the logger',     code: "import logging\nlog = logging.getLogger('api.e1')\nlog.setLevel(logging.INFO)\nadapter = logging.LoggerAdapter(log, {'request_id': 'r-1'})\n(adapter.name, adapter.manager is log.manager, adapter.getEffectiveLevel(), repr(adapter))", returns: "('api.e1', True, 20, '<LoggerAdapter api.e1 (INFO)>')" },
    { title: 'extra is optional (3.10+)',       code: "import logging\nlogging.LoggerAdapter(logging.getLogger('api.e3')).extra is None", returns: 'True' },
    { title: 'setLevel changes the logger',    code: "import logging\nlog = logging.getLogger('api.e4')\nadapter = logging.LoggerAdapter(log)\nadapter.setLevel(logging.ERROR)\n(log.level, adapter.isEnabledFor(logging.WARNING), adapter.hasHandlers())", returns: '(40, False, False)' },
    { title: 'log() and critical() carry the context', code: "import io, logging\nlog = logging.getLogger('api.e7')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(request_id)s %(message)s'))\nlog.addHandler(handler)\nadapter = logging.LoggerAdapter(log, {'request_id': 'r-9'})\nadapter.log(logging.WARNING, 'slow: %d ms', 870)\nadapter.critical('down')\nlog.removeHandler(handler)\nstream.getvalue().splitlines()", returns: "['WARNING r-9 slow: 870 ms', 'CRITICAL r-9 down']" },
    { title: 'exception() includes the traceback', code: "import io, logging\nlog = logging.getLogger('api.e5')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nlog.addHandler(handler := logging.StreamHandler(stream))\nadapter = logging.LoggerAdapter(log, {'job': 'sync'})\ntry:\n    {}['token']\nexcept KeyError:\n    adapter.exception('lookup failed')\nlog.removeHandler(handler)\n[line for line in stream.getvalue().splitlines() if not line.startswith(' ')]", returns: "['lookup failed', 'Traceback (most recent call last):', \"KeyError: 'token'\"]" },
    { title: 'Disabled levels skip process()',  code: "import logging\ncalls = []\nclass Spy(logging.LoggerAdapter):\n    def process(self, msg, kwargs):\n        calls.append(msg)\n        return msg, kwargs\nlog = logging.getLogger('api.dbg')\nlog.setLevel(logging.INFO)\nSpy(log).debug('skipped')\ncalls", returns: '[]' },
    { title: 'warn() is deprecated',           code: "import logging, warnings\nlog = logging.getLogger('api.e6')\nlog.setLevel(logging.ERROR)\nadapter = logging.LoggerAdapter(log)\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    adapter.warn('old spelling')\nstr(caught[0].message)", returns: "\"The 'warn' method is deprecated, use 'warning' instead\"" },
  ],

  pitfalls: [
    {
      name: 'Expecting extra= on a call to add to the context',
      desc: "Without merge_extra, process() replaces the call's extra with the adapter's, so per-call fields vanish. Use merge_extra=True (3.13+) or override process().",
      wrong: { label: 'default adapter', code: "import io, logging\nlog = logging.getLogger('api.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(request_id)s %(user)s %(message)s', defaults={'user': '?'}))\nlog.addHandler(handler)\nadapter = logging.LoggerAdapter(log, {'request_id': 'r-1'})\nadapter.info('signed in', extra={'user': 'ada'})\nlog.removeHandler(handler)\nstream.getvalue()", output: "'r-1 ? signed in\\n'" },
      fix:   { label: 'merge_extra=True', code: "import io, logging\nlog = logging.getLogger('api.pit1')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(request_id)s %(user)s %(message)s', defaults={'user': '?'}))\nlog.addHandler(handler)\nadapter = logging.LoggerAdapter(log, {'request_id': 'r-1'}, merge_extra=True)\nadapter.info('signed in', extra={'user': 'ada'})\nlog.removeHandler(handler)\nstream.getvalue()", output: "'r-1 ada signed in\\n'" },
    },
    {
      name: 'Configuring handlers through the adapter',
      desc: 'An adapter only has the logging methods and a few level helpers. Handlers, filters and propagate belong to adapter.logger.',
      wrong: { label: 'adapter.addHandler', code: "import logging\nadapter = logging.LoggerAdapter(logging.getLogger('api.pit2'), {'request_id': 'r-1'})\nadapter.addHandler(logging.NullHandler())", output: "AttributeError: 'LoggerAdapter' object has no attribute 'addHandler'. Did you mean: 'hasHandlers'?" },
      fix:   { label: 'adapter.logger.addHandler', code: "import logging\nadapter = logging.LoggerAdapter(logging.getLogger('api.pit2'), {'request_id': 'r-1'})\nadapter.logger.addHandler(null := logging.NullHandler())\nresult = adapter.hasHandlers()\nadapter.logger.removeHandler(null)\nresult", output: 'True' },
    },
  ],

  when: {
    use: [
      'The same context on every line of a request, job or connection',
      'Passing a context-aware logger into code that just calls .info()',
    ],
    avoid: [
      'Context for every record of the process → a Filter or setLogRecordFactory',
      'One-off fields → extra= on that call',
    ],
  },

  notes: {
    cpython:       "LoggerAdapter in Lib/logging/__init__.py: each level method calls self.log(LEVEL, …); log() checks isEnabledFor, then msg, kwargs = self.process(msg, kwargs) and self.logger.log(level, msg, *args, **kwargs)",
    'process()':   "Default: kwargs['extra'] = self.extra, or {**self.extra, **kwargs['extra']} when merge_extra is true and the call passed extra",
    'Delegation':  'isEnabledFor, setLevel, getEffectiveLevel and hasHandlers call the same methods of the wrapped logger; name and manager are properties returning the logger’s — name is read-only, while setting adapter.manager sets the wrapped logger’s manager',
    'Versions':    'Adapter delegation methods 3.2, manager 3.6, extra optional 3.10, merge_extra 3.13; warn() is deprecated like Logger.warn',
  },

  related: [
    { name: 'Logger.info and friends', slug: 'logger-info', when: 'extra= on a single call' },
    { name: 'logging.Filter', slug: 'filter', when: 'Context for all records of a handler' },
    { name: 'logging.Formatter', slug: 'formatter', when: 'defaults= for fields that may be missing' },
    { name: 'logging.exception', slug: 'exception', when: 'What adapter.exception() forwards to' },
    { name: 'Logger', slug: 'logger', when: 'The object it wraps' },
  ],

  faq: [
    {
      q: 'How do I add a request id to every log line?',
      a: "Wrap the logger: rlog = logging.LoggerAdapter(log, {'request_id': rid}) and use %(request_id)s in the format (with defaults={'request_id': '-'} for records logged without the adapter). Alternatively set the attribute in a Filter or use a contextvars-based filter for async code.",
    },
    {
      q: 'Why is the extra I pass to adapter.info() ignored?',
      a: "LoggerAdapter.process() replaces kwargs['extra'] with the adapter's own dict. On Python 3.13+ create the adapter with merge_extra=True; on older versions override process() to merge the dicts yourself.",
    },
    {
      q: 'LoggerAdapter or Filter for contextual information?',
      a: 'An adapter adds context to the calls made through it — good for per-request or per-object context you pass around. A filter on a handler adds attributes to every record that handler sees, whatever logger produced it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#loggeradapter-objects',
    meta:  'LoggerAdapter Objects',
  },

};
