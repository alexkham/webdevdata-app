// content/reference/python/functions/help.js
//
// Doc-only page: help() opens an interactive pager and writes to stdout,
// so there is nothing a sandboxed demo could honestly show.

export const meta = {
  slug:        'help',
  name:        'help',
  signature:   'help([object])',
  blurb:       'Open the built-in documentation browser for an object, or start interactive help.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.2+',
  searchTerms: 'help docs documentation docstring interactive pydoc manual explain repl',
};

export const method = {
  slug:      'help',
  name:      'help',
  signature: 'help([object])',
  returns:   { type: 'None', desc: 'Returns None. The documentation is PRINTED, often through a pager — it is not a value you can capture.' },

  category:    'Built-in function',
  version:     'Python 2.2+',
  hasLiveDemo: false,

  subtitle: 'A REPL tool, not a library function. It prints and returns None, which is exactly why it disappoints inside a script.',

  cheat: {
    commonCall: 'help(str.split)',
    returns:    'None — the text goes to stdout, not to you',
    replaces:   'switching to a browser to read the docs',
    watchOut:   'help(f()) documents the RESULT; you almost always meant help(f)',
  },

  parameters: [
    { name: 'object', type: 'Any', required: false, default: null, desc: 'Anything — a module, class, function, method, or a string naming one. Omitted starts the interactive help session.' },
  ],

  examples: [
    { title: 'A method',        code: 'help(str.split)',   returns: 'prints the signature and docstring' },
    { title: 'A whole module',  code: 'import json\nhelp(json)', returns: 'prints the module overview' },
    { title: 'By name',         code: "help('modules')",   returns: 'lists every importable module' },
    { title: 'Interactive',     code: 'help()',            returns: 'starts the help> prompt' },
    { title: 'Returns nothing', code: 'x = help(len)\nx',  returns: 'None' },
    { title: 'Get the raw text',code: 'str.split.__doc__', returns: 'the docstring as a string' },
  ],

  pitfalls: [
    {
      name: 'It returns None, it does not give you text',
      desc: 'help prints as a side effect. Assigning the call gets you None, and the documentation has already gone to stdout where your code cannot reach it.',
      wrong: { label: 'Nothing captured', code: 'text = help(len)\nprint(text)', output: 'None' },
      fix:   { label: 'Read the docstring', code: 'text = len.__doc__', output: 'the actual text' },
    },
    {
      name: 'Calling the function instead of naming it',
      desc: 'help(f()) evaluates f first and documents whatever came back — often an int or a string, giving you the docs for that type instead. The mistake looks harmless because it still prints something.',
      wrong: { label: 'Documents the result', code: 'help(len("abc"))', output: 'documents int, not len' },
      fix:   { label: 'Pass the object',      code: 'help(len)', output: 'documents len' },
    },
    {
      name: 'It blocks in a pager',
      desc: 'On most systems long output goes through a pager and waits for a keypress. In a script, a CI job or a notebook cell that means a hang rather than an error.',
      wrong: { label: 'Hangs the run', code: 'help(os)   # inside a script', output: 'waits for input at the pager' },
      fix:   { label: 'Use pydoc offline', code: 'python -m pydoc os', output: 'prints and exits' },
    },
    {
      name: 'Only as good as the docstrings',
      desc: 'help reads __doc__ at runtime, so undocumented code shows almost nothing — and a C extension without docstrings may show only a bare signature.',
      wrong: { label: 'Empty output', code: 'def f(x):\n    return x\nhelp(f)', output: 'f(x) and no description' },
      fix:   { label: 'Write a docstring', code: 'def f(x):\n    """Return x unchanged."""\n    return x', output: 'the description appears' },
    },
  ],

  when: {
    use: [
      'Exploring an unfamiliar API from the REPL',
      'Checking a signature without leaving the interpreter',
      'Listing available modules with help("modules")',
    ],
    avoid: [
      'Inside scripts or libraries — it prints and can block',
      'You want the text as a value → __doc__ or inspect.getdoc',
      'You want the signature programmatically → inspect.signature',
    ],
  },

  notes: {
    complexity: 'Not meaningful — introspects the object and formats text',
    return:     'Always None; the output goes to stdout',
    cpython:    'Lib/_sitebuiltins.py :: _Helper, delegating to Lib/pydoc.py',
    memory:     'Builds the documentation text transiently',
    threadSafe: 'Writes to stdout — interleaves badly with other threads printing',
  },

  related: [
    { name: 'dir',        slug: 'dir',        when: 'List the names on an object rather than read about them' },
    { name: 'vars',       slug: 'vars',       when: 'Inspect an object\'s __dict__ directly' },
    { name: 'type',       slug: 'type',       when: 'Ask what something is before reading its docs' },
    { name: 'repr',       slug: 'repr',       when: 'A short unambiguous view of a value' },
  ],

  faq: [
    {
      q: 'How do I get help output as a string?',
      a: 'help is built to print. Use inspect.getdoc for cleaned-up docstring text, or pydoc.render_doc for something closer to what help displays.',
      code: 'import inspect\ntext = inspect.getdoc(str.split)',
    },
    {
      q: 'Why does help() sometimes take over my terminal?',
      a: 'Calling it with no arguments starts an interactive help session with its own help> prompt. Type q or press Ctrl-D to leave it and return to the normal REPL.',
      code: 'help()\n# help> q',
    },
    {
      q: 'Can I read the docs without starting Python?',
      a: 'Yes — pydoc is the same machinery as a command line tool. It prints and exits, which makes it script-friendly, and it can also serve the docs as local HTML.',
      code: 'python -m pydoc str.split\npython -m pydoc -b        # browse in a browser',
    },
  ],

  history: [
    { version: '2.2', note: 'help added as a site builtin, wrapping the pydoc module.' },
    { version: '3.4', note: 'Output improved for signatures via the inspect.signature machinery.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#help',
    meta:  'help',
  },

  tryInTool: [],
};
