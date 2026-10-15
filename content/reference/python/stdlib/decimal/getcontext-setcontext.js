// content/reference/python/stdlib/decimal/getcontext-setcontext.js

export const meta = {
  slug:        'getcontext-setcontext',
  name:        'decimal.getcontext',
  signature:   'decimal.getcontext()  ·  decimal.setcontext(c)',
  blurb:       'Read or replace the current context — the precision, rounding and traps that Decimal arithmetic uses in this thread (or asyncio task).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'decimal getcontext setcontext current context getcontext().prec set decimal precision globally thread context contextvar asyncio decimal context per thread',
};

export const method = {
  slug:      'getcontext-setcontext',
  name:      'decimal.getcontext',
  signature: 'decimal.getcontext()  ·  decimal.setcontext(c)',
  returns:   { type: 'Context | None', desc: 'getcontext() returns the current Context object itself (not a copy); setcontext() returns None.' },

  category:    'decimal function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'getcontext() hands you the live current context: change its prec and every later calculation in this thread changes too. setcontext(c) swaps in another context. For a temporary change, localcontext() does the swap and the restore for you.',

  covers: ['getcontext', 'setcontext'],

  cheat: {
    commonCall: 'getcontext().prec',
    returns:    'the current Context; its prec is 28 unless something changed it',
    replaces:   'passing precision around by hand',
    watchOut:   'changing it inside a function changes it for the caller too',
  },

  parameters: [
    { name: 'c', type: 'Context', required: true, default: null, desc: 'setcontext only: the context to make current. If it is DefaultContext, BasicContext or ExtendedContext, a copy with cleared flags is installed instead.' },
  ],

  modes: [
    {
      id: 'swap',
      label: 'swap and restore',
      blurb: 'Install a new context, compute, and put the old one back in finally — what localcontext() does for you.',
      params: [
        { name: 'prec',     type: 'int', hint: 'significant digits', input: 'number' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name',     input: 'text' },
      ],
      template: 'from decimal import Decimal, Context, getcontext, setcontext\nsaved = getcontext()\nsetcontext(Context(prec={$prec}, rounding={$rounding}))\ntry:\n    result = Decimal(2).sqrt()\nfinally:\n    setcontext(saved)\nresult',
      cases: [
        { id: 'five',  label: 'prec 5',          values: { prec: '5', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'fifty', label: 'prec 50',         values: { prec: '50', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'up',    label: 'prec 3, ROUND_UP', values: { prec: '3', rounding: 'ROUND_UP' } },
        { id: 'zero',  label: 'prec 0',          values: { prec: '0', rounding: 'ROUND_HALF_EVEN' } },
      ],
    },
    {
      id: 'template',
      label: 'setcontext(ExtendedContext)',
      blurb: 'ExtendedContext traps nothing, so problems give Infinity or NaN. setcontext() installs a copy of it, not the object itself.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal, ExtendedContext, getcontext, setcontext\nsaved = getcontext()\nsetcontext(ExtendedContext)\ntry:\n    result = (Decimal({$a}) / Decimal({$b}), getcontext() is ExtendedContext)\nfinally:\n    setcontext(saved)\nresult',
      cases: [
        { id: 'zero',  label: '1/0', values: { a: '1', b: '0' } },
        { id: 'nan',   label: '0/0', values: { a: '0', b: '0' } },
        { id: 'third', label: '1/3', values: { a: '1', b: '3' } },
      ],
    },
  ],
  demoExplainer: 'sqrt(2) is computed to the installed precision — 1.4142 at 5 digits — but always rounded half-even, so ROUND_UP at 3 digits still gives 1.41. The finally clause puts the saved context back even if something raises. prec 0 fails in Context() before anything is swapped. Under ExtendedContext 1/0 gives Infinity and 0/0 gives NaN instead of raising, 1/3 has only 9 digits (its prec is 9), and getcontext() is ExtendedContext is False because setcontext() installed a copy.',

  patterns: [
    {
      name: 'Read the current settings',
      desc: 'getcontext() returns the live object; read attributes from it.',
      code: 'from decimal import getcontext\nctx = getcontext()\nprint(ctx.prec, ctx.rounding)',
    },
    {
      name: 'Program-wide settings at startup',
      desc: 'Set the main thread\'s context once, before any calculation — new threads start from DefaultContext, not from this.',
      code: 'from decimal import getcontext, ROUND_HALF_UP\nctx = getcontext()\nctx.prec = 34\nctx.rounding = ROUND_HALF_UP',
    },
    {
      name: 'Prefer localcontext for temporary changes',
      desc: 'It copies, installs and restores — the try/finally above in one line.',
      code: 'from decimal import localcontext\nwith localcontext(prec=50):\n    result = compute()',
    },
  ],

  examples: [
    { title: 'The same object every time', code: 'from decimal import getcontext\ngetcontext() is getcontext()', returns: 'True' },
    { title: 'Inside localcontext, getcontext() is the local one', code: 'from decimal import getcontext, localcontext\nwith localcontext(prec=7) as ctx:\n    same = getcontext() is ctx\nsame', returns: 'True' },
    { title: 'Swap in a context, then restore', code: 'from decimal import Decimal, Context, getcontext, setcontext\nsaved = getcontext()\nsetcontext(Context(prec=5))\ntry:\n    result = Decimal(2).sqrt()\nfinally:\n    setcontext(saved)\nresult', returns: "Decimal('1.4142')" },
    { title: 'A new thread starts from DefaultContext', code: 'import threading\nfrom decimal import getcontext, localcontext\nseen = []\ndef worker():\n    seen.append(getcontext().prec)\nwith localcontext(prec=5):\n    t = threading.Thread(target=worker)\n    t.start()\n    t.join()\nseen', returns: '[28]' },
    { title: 'setcontext needs a Context', code: 'from decimal import setcontext\nsetcontext(5)', returns: 'TypeError: argument must be a context' },
  ],

  pitfalls: [
    {
      name: 'Changing getcontext() inside a function',
      desc: 'The current context is shared by everything in the thread, so the change outlives the function. (The snippet restores it in finally so the damage stays visible but contained.)',
      wrong: { label: 'getcontext().prec = 3', code: 'from decimal import Decimal, getcontext, setcontext\nsaved = getcontext().copy()\ndef third():\n    getcontext().prec = 3\n    return Decimal(1) / 3\ntry:\n    third()\n    leaked = Decimal(2) / 3\nfinally:\n    setcontext(saved)\nleaked', output: "Decimal('0.667')" },
      fix:   { label: 'localcontext inside', code: 'from decimal import Decimal, localcontext\ndef third():\n    with localcontext(prec=3):\n        return Decimal(1) / 3\nthird()\nafter = Decimal(2) / 3\nafter', output: "Decimal('0.6666666666666666666666666667')" },
    },
    {
      name: 'Expecting threads to inherit the context',
      desc: 'Each thread gets its own context, copied from DefaultContext. Hand the worker a context and use it there.',
      wrong: { label: 'inherited?', code: 'import threading\nfrom decimal import getcontext, localcontext\nseen = []\ndef worker():\n    seen.append(getcontext().prec)\nwith localcontext(prec=5):\n    t = threading.Thread(target=worker)\n    t.start()\n    t.join()\nseen', output: '[28]' },
      fix:   { label: 'pass it in', code: 'import threading\nfrom decimal import Context, getcontext, localcontext\nseen = []\nctx = Context(prec=5)\ndef worker():\n    with localcontext(ctx):\n        seen.append(getcontext().prec)\nt = threading.Thread(target=worker)\nt.start()\nt.join()\nseen', output: '[5]' },
    },
  ],

  when: {
    use: [
      'Reading the current precision or rounding',
      'Configuring the main thread once at program start',
      'Installing a context for the whole life of a thread',
    ],
    avoid: [
      'A temporary change → localcontext(), which restores automatically',
      'Library functions → never change the caller\'s context; use localcontext() or Context methods',
      'Setting things up in one thread for another → each thread has its own context',
    ],
  },

  notes: {
    cpython:      'The current context lives in a contextvars.ContextVar (decimal.HAVE_CONTEXTVAR is True), so each thread has its own and setcontext() inside an asyncio task affects only that task. A task does inherit the Context object of the code that created it, so mutating getcontext() in a task (getcontext().prec = …) changes the context of the caller too. The first getcontext() in a thread creates the context as a copy of DefaultContext',
    'Templates':  'setcontext(DefaultContext / BasicContext / ExtendedContext) installs a copy with cleared flags, so the shared templates are never modified through the current context',
  },

  related: [
    { name: 'localcontext()', slug: 'localcontext', when: 'Temporary changes, restored automatically' },
    { name: 'Context',        slug: 'context',      when: 'What the context contains' },
    { name: 'DefaultContext and friends', slug: 'defaultcontext-basiccontext-extendedcontext', when: 'Where new contexts come from' },
    { name: 'HAVE_CONTEXTVAR', slug: 'limits', when: 'Per-task contexts' },
    { name: 'with',           slug: 'with', when: 'The statement localcontext() is used with', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I set the decimal precision globally in Python?',
      a: 'getcontext().prec = 50 changes the current context of the running thread. Other threads are not affected — each one starts from DefaultContext (set DefaultContext.prec before starting threads if they should all share a default). For one calculation, use with localcontext(prec=50): instead.',
    },
    {
      q: 'Does getcontext() return a copy?',
      a: 'No — it returns the live object, so getcontext().prec = 10 takes effect immediately. Use getcontext().copy() if you want a snapshot.',
    },
    {
      q: 'Is the decimal context thread-safe?',
      a: 'Yes in the sense that every thread has its own current context, so threads do not see each other\'s settings or flags. The template contexts (DefaultContext etc.) are shared module objects — do not change them while threads are running.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.getcontext',
    meta:  'decimal.getcontext / decimal.setcontext',
  },
};
