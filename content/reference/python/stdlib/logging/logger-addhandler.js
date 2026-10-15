// content/reference/python/stdlib/logging/logger-addhandler.js

export const meta = {
  slug:        'logger-addhandler',
  name:        'Logger.addHandler / removeHandler / hasHandlers',
  signature:   'Logger.addHandler(hdlr)',
  blurb:       "Attach a handler to a logger, detach it again, and ask whether any handler would see this logger's records (its own or, through propagation, its ancestors').",
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (hasHandlers 3.2+)',
  searchTerms: 'Logger.addHandler Logger.removeHandler Logger.hasHandlers addhandler python add handler to logger remove handler duplicate log lines logged twice handlers list hasHandlers propagate check if logger configured',
};

export const method = {
  slug:      'logger-addhandler',
  name:      'Logger.addHandler / removeHandler / hasHandlers',
  signature: 'Logger.addHandler(hdlr)  ·  Logger.removeHandler(hdlr)  ·  Logger.hasHandlers()',
  returns:   { type: 'None | bool', desc: 'addHandler / removeHandler: None. hasHandlers: True if this logger or an ancestor reachable through propagate has at least one handler.' },

  category:    'logging.Logger method',
  version:     'Python 2.3+ (hasHandlers 3.2+)',
  hasLiveDemo: true,

  subtitle: 'A logger keeps a plain list of handler objects, logger.handlers. addHandler appends unless that very object is already there; removeHandler drops it if present and is silent otherwise. Two different handlers on the same stream still print every line twice — the usual cause of duplicated output.',

  covers: ['Logger.addHandler', 'Logger.removeHandler', 'Logger.hasHandlers'],

  cheat: {
    commonCall: 'log.addHandler(logging.StreamHandler())',
    returns:    'None — log.handlers now contains it',
    replaces:   'basicConfig when only one logger needs output',
    watchOut:   'a new handler on every call duplicates lines',
  },

  parameters: [
    { name: 'hdlr', type: 'logging.Handler', required: true, default: null, desc: 'addHandler / removeHandler: the handler object. Identity counts — an equal-looking new handler is a different one.' },
  ],

  modes: [
    {
      id: 'add',
      label: 'two addHandler calls',
      blurb: "Handlers 'a' and 'b' write to the same stream with different prefixes. Add two of them (or the same one twice) and log one line.",
      params: [
        { name: 'first',  type: 'str', hint: "'a' or 'b'", input: 'text' },
        { name: 'second', type: 'str', hint: "'a' or 'b'", input: 'text' },
      ],
      template: "import io, logging\nlog = logging.getLogger('mailer')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nstream = io.StringIO()\nhandlers = {'a': logging.StreamHandler(stream), 'b': logging.StreamHandler(stream)}\nhandlers['a'].setFormatter(logging.Formatter('a> %(message)s'))\nhandlers['b'].setFormatter(logging.Formatter('b> %(message)s'))\ntry:\n    log.addHandler(handlers[{$first}])\n    log.addHandler(handlers[{$second}])\n    log.info('sent %d mails', 3)\nfinally:\n    for h in handlers.values():\n        log.removeHandler(h)\nstream.getvalue().splitlines()",
      cases: [
        { id: 'two',  label: "'a' + 'b'", values: { first: 'a', second: 'b' } },
        { id: 'same', label: "'a' twice", values: { first: 'a', second: 'a' } },
        { id: 'rev',  label: "'b' + 'a'", values: { first: 'b', second: 'a' } },
        { id: 'bad',  label: "'c'",       values: { first: 'a', second: 'c' } },
      ],
    },
    {
      id: 'has',
      label: 'hasHandlers()',
      blurb: "'notify' has a handler; 'notify.sms' sets propagate = False. Which loggers can reach a handler?",
      params: [{ name: 'name', type: 'str', hint: 'a logger name', input: 'text' }],
      template: "import logging\nnotify = logging.getLogger('notify')\nhandler = logging.NullHandler()\nnotify.addHandler(handler)\nlogging.getLogger('notify.sms').propagate = False\ntry:\n    result = logging.getLogger({$name}).hasHandlers()\nfinally:\n    notify.removeHandler(handler)\nresult",
      cases: [
        { id: 'self',  label: 'notify',         values: { name: 'notify' } },
        { id: 'child', label: 'notify.email',   values: { name: 'notify.email' } },
        { id: 'stop',  label: 'notify.sms',     values: { name: 'notify.sms' } },
        { id: 'deep',  label: 'notify.sms.otp', values: { name: 'notify.sms.otp' } },
        { id: 'other', label: 'billing',        values: { name: 'billing' } },
      ],
    },
  ],
  demoExplainer: "Two handlers on one logger each emit the record, so 'a' + 'b' prints the line twice, in the order they were added; adding the same handler object twice keeps one copy. In the second tab, 'notify.email' has no handler of its own but propagates to 'notify'. 'notify.sms' stops propagation, and so does everything below it — 'notify.sms.otp' climbs to 'notify.sms' and halts there. 'billing' reaches only the root logger, which has no handlers in a fresh interpreter.",

  patterns: [
    {
      name: 'Configure a logger once',
      desc: 'Guard the setup so importing or calling it twice does not stack handlers.',
      code: "import logging\n\ndef get_logger():\n    log = logging.getLogger('app')\n    if not log.handlers:\n        log.addHandler(logging.StreamHandler())\n        log.setLevel(logging.INFO)\n    return log",
    },
    {
      name: 'A temporary handler',
      desc: 'Capture the records of one operation, then detach.',
      code: "import io, logging\nbuf = io.StringIO()\nhandler = logging.StreamHandler(buf)\nlog = logging.getLogger('importer')\nlog.addHandler(handler)\ntry:\n    run_import()\nfinally:\n    log.removeHandler(handler)\nreport = buf.getvalue()",
    },
    {
      name: 'Library default: stay silent',
      desc: 'Libraries add a NullHandler and leave real handlers to the application.',
      code: "import logging\nlogging.getLogger('mylib').addHandler(logging.NullHandler())",
    },
  ],

  examples: [
    { title: 'handlers is a plain list',           code: "import logging\nlog = logging.getLogger('mailer.ex1')\nh = logging.NullHandler()\nlog.addHandler(h)\nfirst = list(log.handlers)\nlog.removeHandler(h)\n(first, log.handlers)", returns: '([<NullHandler (NOTSET)>], [])' },
    { title: 'The same object is added once',      code: "import logging\nlog = logging.getLogger('mailer.ex2')\nh = logging.NullHandler()\nlog.addHandler(h)\nlog.addHandler(h)\ncount = len(log.handlers)\nlog.removeHandler(h)\ncount", returns: '1' },
    { title: 'removeHandler of an unknown handler is silent', code: "import logging\nlogging.getLogger('mailer.ex3').removeHandler(logging.NullHandler())\n'no error'", returns: "'no error'" },
    { title: 'hasHandlers looks up the tree',      code: "import logging\nparent = logging.getLogger('alerts')\nh = logging.NullHandler()\nparent.addHandler(h)\nresult = logging.getLogger('alerts.pager').hasHandlers()\nparent.removeHandler(h)\nresult", returns: 'True' },
    { title: 'A fresh interpreter has no handlers anywhere', code: "import logging\nlogging.getLogger('untouched.module').hasHandlers()", returns: 'False' },
    { title: 'Each handler gets its own formatter', code: "import io, logging\nlog = logging.getLogger('mailer.ex6')\nlog.setLevel(logging.INFO)\nlog.propagate = False\nshort, full = io.StringIO(), io.StringIO()\nh1 = logging.StreamHandler(short)\nh2 = logging.StreamHandler(full)\nh2.setFormatter(logging.Formatter('%(levelname)s %(name)s %(message)s'))\nlog.addHandler(h1)\nlog.addHandler(h2)\nlog.info('queued')\nlog.removeHandler(h1)\nlog.removeHandler(h2)\n(short.getvalue(), full.getvalue())", returns: "('queued\\n', 'INFO mailer.ex6 queued\\n')" },
  ],

  pitfalls: [
    {
      name: 'A handler on the child and on the root',
      desc: 'The child prints the line, then the record propagates and the root handler prints it again. Keep handlers on one logger (usually the root) or set propagate = False on the child.',
      wrong: { label: 'both', code: "import io, logging\nroot = logging.getLogger()\nstream = io.StringIO()\nroot_handler = logging.StreamHandler(stream)\nchild = logging.getLogger('outbox.sender')\nchild.setLevel(logging.INFO)\nchild_handler = logging.StreamHandler(stream)\nroot.addHandler(root_handler)\nchild.addHandler(child_handler)\ntry:\n    child.info('mail sent')\nfinally:\n    root.removeHandler(root_handler)\n    child.removeHandler(child_handler)\nstream.getvalue().splitlines()", output: "['mail sent', 'mail sent']" },
      fix:   { label: 'root only', code: "import io, logging\nroot = logging.getLogger()\nstream = io.StringIO()\nroot_handler = logging.StreamHandler(stream)\nchild = logging.getLogger('outbox.sender')\nchild.setLevel(logging.INFO)\nroot.addHandler(root_handler)\ntry:\n    child.info('mail sent')\nfinally:\n    root.removeHandler(root_handler)\nstream.getvalue().splitlines()", output: "['mail sent']" },
    },
    {
      name: 'Removing a different handler object',
      desc: 'removeHandler compares identity. A freshly created handler is never the one on the logger, so nothing is removed and nothing is reported.',
      wrong: { label: 'new object', code: "import logging\nlog = logging.getLogger('mailer.pit2')\nlog.addHandler(logging.NullHandler())\nlog.removeHandler(logging.NullHandler())\ncount = len(log.handlers)\nlog.handlers.clear()\ncount", output: '1' },
      fix:   { label: 'keep a reference', code: "import logging\nlog = logging.getLogger('mailer.pit2')\nhandler = logging.NullHandler()\nlog.addHandler(handler)\nlog.removeHandler(handler)\nlen(log.handlers)", output: '0' },
    },
  ],

  when: {
    use: [
      'Sending one logger (or the root) to a console, file, socket …',
      'Temporarily capturing records in tests or reports',
      'hasHandlers to check whether an application configured logging at all',
    ],
    avoid: [
      'Adding handlers in library code → NullHandler at most; the application decides',
      'Calling addHandler in a function that runs many times → configure once at startup',
    ],
  },

  notes: {
    cpython:    'addHandler: `if not (hdlr in self.handlers): self.handlers.append(hdlr)` under the module lock; removeHandler: remove if present; hasHandlers walks c = c.parent while c.propagate',
    'Order':    'Handlers are called in the order they were added, the logger’s own first, then each ancestor’s',
    'Versions': 'hasHandlers was added in 3.2',
  },

  related: [
    { name: 'Logger.propagate', slug: 'propagate', when: 'How records reach the ancestors’ handlers' },
    { name: 'Handler', slug: 'handler', when: 'What you attach' },
    { name: 'StreamHandler', slug: 'streamhandler', when: 'The console / stream handler' },
    { name: 'NullHandler', slug: 'nullhandler', when: 'The do-nothing handler for libraries' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'Adds a handler to the root logger for you' },
  ],

  faq: [
    {
      q: 'Why is every log line printed twice?',
      a: 'Two handlers see the record: either the same logger got two handlers (an addHandler in code that runs twice), or a handler on a named logger plus one on the root logger, which the record reaches through propagation. Print logger.handlers and logging.getLogger().handlers to find them.',
    },
    {
      q: 'How do I remove all handlers from a logger?',
      a: 'for h in log.handlers[:]: log.removeHandler(h) — iterate over a copy. For the root logger, basicConfig(force=True) removes and closes the existing handlers before adding new ones.',
    },
    {
      q: 'What does hasHandlers() check?',
      a: 'Whether this logger or any ancestor reachable through propagate=True has at least one handler. False means records would only reach logging.lastResort (stderr, WARNING and above).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Logger.addHandler',
    meta:  'Logger.addHandler',
  },

};
