// content/reference/python/stdlib/logging/filter.js

export const meta = {
  slug:        'filter',
  name:        'logging.Filter',
  signature:   "logging.Filter(name='')",
  blurb:       "Decide per record whether it is logged. Filter(name) passes records from that logger and its children; any callable that takes a record works as a filter too, and may add attributes or (3.12+) return a replacement record.",
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (callables 3.2+, returning a record 3.12+)',
  searchTerms: 'logging Filter python Filter.filter addFilter removeFilter filter log records by logger name filter by message exclude health check logs add contextual information to log records filter function lambda redact passwords logging filter not working propagate',
};

export const method = {
  slug:      'filter',
  name:      'logging.Filter',
  signature: "logging.Filter(name='')  ·  Filter.filter(record)",
  returns:   { type: 'bool', desc: 'filter(record): True if record.name is name or starts with name + "."; always True for name="".' },

  category:    'logging class',
  version:     'Python 2.3+ (callables 3.2+, returning a record 3.12+)',
  hasLiveDemo: true,

  subtitle: "Loggers and handlers each keep a list of filters (addFilter / removeFilter). A record continues only if every filter returns a true value. The built-in Filter class only checks the logger name; most real filters are small functions or Filter subclasses that look at the message, drop noise, or set extra attributes for the format string.",

  covers: ['Filter', 'Filter.filter'],

  cheat: {
    commonCall: "handler.addFilter(lambda record: '/health' not in record.getMessage())",
    returns:    'None — the handler now skips matching records',
    replaces:   'if-statements around logging calls',
    watchOut:   'a function filter that returns None drops every record',
  },

  parameters: [
    { name: 'name',   type: 'str',       required: false, default: "''",  desc: "Logger name to allow, together with its descendants. '' allows every record." },
    { name: 'record', type: 'LogRecord', required: true,  default: null,  desc: 'filter(record): the record to check (or modify).' },
  ],

  modes: [
    {
      id: 'byname',
      label: 'Filter(name)',
      blurb: 'Which of five logger names does a Filter with your name let through?',
      params: [{ name: 'allowed', type: 'str', hint: "a logger name, '' = all", input: 'text' }],
      template: "import logging\nf = logging.Filter({$allowed})\nnames = ('shop', 'shop.cart', 'shop.cart.items', 'shopping', 'billing')\n[name for name in names if f.filter(logging.makeLogRecord({'name': name}))]",
      cases: [
        { id: 'shop',  label: "'shop'",      values: { allowed: 'shop' } },
        { id: 'cart',  label: "'shop.cart'", values: { allowed: 'shop.cart' } },
        { id: 'all',   label: "''",          values: { allowed: '' } },
        { id: 'pre',   label: "'sho'",       values: { allowed: 'sho' } },
      ],
    },
    {
      id: 'drop',
      label: 'function filter',
      blurb: 'A lambda on the handler drops every record whose message contains your text. Four requests are logged.',
      params: [{ name: 'word', type: 'str', hint: 'text to drop', input: 'text' }],
      template: "import io, logging\nlog = logging.getLogger('web.access')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.addFilter(lambda record: {$word} not in record.getMessage())\nlog.addHandler(handler)\ntry:\n    for path in ('/health', '/cart', '/health', '/checkout'):\n        log.info('GET %s 200', path)\nfinally:\n    log.removeHandler(handler)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'health', label: "'/health'", values: { word: '/health' } },
        { id: 'cart',   label: "'cart'",    values: { word: 'cart' } },
        { id: 'empty',  label: "''",        values: { word: '' } },
      ],
    },
  ],
  demoExplainer: "Filter('shop') passes 'shop' itself and everything below it, but not 'shopping': after the matching prefix the next character must be a dot. A prefix that is not a whole name ('sho') passes nothing, and '' passes everything. The function filter sees the merged message (getMessage) and drops any record for which it returns a false value — the empty string is contained in every message, so '' drops them all.",

  patterns: [
    {
      name: 'Add context to every record',
      desc: 'A filter that always passes but sets attributes the format string can use.',
      code: "import logging, socket\n\nclass HostFilter(logging.Filter):\n    def filter(self, record):\n        record.host = socket.gethostname()\n        return True\n\nhandler.addFilter(HostFilter())\nhandler.setFormatter(logging.Formatter('%(host)s %(levelname)s %(message)s'))",
    },
    {
      name: 'Keep a noisy endpoint out of the access log',
      desc: 'Any callable taking a record works (3.2+).',
      code: "import logging\nlogging.getLogger('uvicorn.access').addFilter(\n    lambda record: '/health' not in record.getMessage())",
    },
    {
      name: 'Redact without touching other handlers (3.12+)',
      desc: 'Return a modified copy; later filters and the emit use it, other handlers keep the original.',
      code: "import logging\n\ndef redact(record):\n    record = logging.makeLogRecord(record.__dict__)\n    record.msg = str(record.msg).replace(SECRET, '***')\n    return record\n\nhandler.addFilter(redact)",
    },
  ],

  examples: [
    { title: "Filter('') passes everything",  code: "import logging\nlogging.Filter().filter(logging.makeLogRecord({'name': 'anything'}))", returns: 'True' },
    { title: 'The name and its length',        code: "import logging\nf = logging.Filter('shop')\n(f.name, f.nlen)", returns: "('shop', 4)" },
    { title: 'Logger.filter returns the record', code: "import logging\nlog = logging.getLogger('web.e2')\nrecord = logging.makeLogRecord({'name': 'web.e2'})\nlog.filter(record) is record", returns: 'True' },
    { title: 'addFilter ignores duplicates',   code: "import logging\nlog = logging.getLogger('web.e6')\nf = logging.Filter('web')\nlog.addFilter(f)\nlog.addFilter(f)\ncount = len(log.filters)\nlog.removeFilter(f)\n(count, log.filters)", returns: '(1, [])' },
    { title: 'A Filter subclass adding a field', code: "import io, logging\nclass ContextFilter(logging.Filter):\n    def filter(self, record):\n        record.user = 'ada'\n        return True\nlog = logging.getLogger('web.ctx')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(user)s: %(message)s'))\nhandler.addFilter(ContextFilter())\nlog.addHandler(handler)\nlog.info('cart opened')\nlog.removeHandler(handler)\nstream.getvalue()", returns: "'ada: cart opened\\n'" },
    { title: 'Returning a new record (3.12+)', code: "import io, logging\nlog = logging.getLogger('web.e4')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\ndef redact(record):\n    record = logging.makeLogRecord(record.__dict__)\n    record.msg = record.msg.replace('hunter2', '***')\n    return record\nhandler.addFilter(redact)\nlog.addHandler(handler)\nlog.info('login with password hunter2')\nlog.removeHandler(handler)\nstream.getvalue()", returns: "'login with password ***\\n'" },
  ],

  pitfalls: [
    {
      name: 'A logger filter that should catch child loggers',
      desc: "Filters on a logger run only for records created on that logger. Records from 'web.pit1.access' propagate to the parent's handlers without passing the parent's filters. Put the filter on the handler.",
      wrong: { label: 'on the parent logger', code: "import io, logging\nparent = logging.getLogger('web.pit1')\nparent.setLevel(logging.INFO)\nparent.propagate = False\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nparent.addFilter(lambda record: 'health' not in record.getMessage())\ntry:\n    logging.getLogger('web.pit1.access').info('GET /health 200')\nfinally:\n    parent.filters.clear()\n    parent.removeHandler(handler)\nstream.getvalue()", output: "'GET /health 200\\n'" },
      fix:   { label: 'on the handler', code: "import io, logging\nparent = logging.getLogger('web.pit1')\nparent.setLevel(logging.INFO)\nparent.propagate = False\nstream = io.StringIO()\nparent.addHandler(handler := logging.StreamHandler(stream))\nhandler.addFilter(lambda record: 'health' not in record.getMessage())\ntry:\n    logging.getLogger('web.pit1.access').info('GET /health 200')\nfinally:\n    parent.removeHandler(handler)\nstream.getvalue()", output: "''" },
    },
    {
      name: 'A filter function without return True',
      desc: 'A function that only sets attributes returns None, which counts as "reject": every record silently disappears.',
      wrong: { label: 'no return', code: "import io, logging\nlog = logging.getLogger('web.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(host)s %(message)s'))\ndef add_host(record):\n    record.host = 'web1'\nhandler.addFilter(add_host)\nlog.addHandler(handler)\nlog.info('started')\nlog.removeHandler(handler)\nstream.getvalue()", output: "''" },
      fix:   { label: 'return True', code: "import io, logging\nlog = logging.getLogger('web.pit2')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(host)s %(message)s'))\ndef add_host(record):\n    record.host = 'web1'\n    return True\nhandler.addFilter(add_host)\nlog.addHandler(handler)\nlog.info('started')\nlog.removeHandler(handler)\nstream.getvalue()", output: "'web1 started\\n'" },
    },
  ],

  when: {
    use: [
      'Dropping noise by content (health checks, a chatty message) on one handler',
      'Adding contextual attributes (host, request id) for the format string',
      'Routing by logger name: Filter("app.db") on a handler',
    ],
    avoid: [
      'Dropping by level → logger.setLevel / handler.setLevel',
      'Context for one code path → extra= or a LoggerAdapter',
    ],
  },

  notes: {
    cpython:      "Filter.filter: True if nlen == 0 or record.name == name; otherwise record.name must start with name and have a '.' right after it",
    'Filterer':   'Logger and Handler inherit addFilter/removeFilter/filter from Filterer; filter() calls f.filter(record) if the object has a filter method, else f(record), stops at the first false result and returns the (possibly replaced) record',
    'Where they run': "Logger filters: in Logger.handle, only on the logger that created the record. Handler filters: in Handler.handle, for every record the handler receives",
    'Versions':   'Plain callables accepted since 3.2; returning a LogRecord to replace the record since 3.12',
  },

  related: [
    { name: 'logging.Handler', slug: 'handler', when: 'addFilter on a handler' },
    { name: 'Logger.propagate', slug: 'propagate', when: 'Why logger filters skip propagated records' },
    { name: 'LogRecord', slug: 'logrecord', when: 'What a filter receives' },
    { name: 'LoggerAdapter', slug: 'loggeradapter', when: 'The other way to add context' },
  ],

  faq: [
    {
      q: 'How do I filter log messages in Python?',
      a: "Attach a filter to the handler: handler.addFilter(lambda record: 'healthcheck' not in record.getMessage()). Any callable that takes a LogRecord and returns a true value to keep it works; use a Filter subclass for reusable filters.",
    },
    {
      q: 'Why does my logger filter not work for child loggers?',
      a: 'Logger filters are only applied to records logged directly on that logger. Records from child loggers reach the parent’s handlers without going through the parent logger’s filters. Attach the filter to the handler instead.',
    },
    {
      q: 'How do I add a custom field to every log record?',
      a: "A filter that sets the attribute and returns True: def f(record): record.request_id = current_id(); return True. Then use %(request_id)s in the format. setLogRecordFactory is the alternative when it must apply to every record of the process.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#filter-objects',
    meta:  'Filter Objects',
  },

};
