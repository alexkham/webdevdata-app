// content/reference/javascript/methods/global-eval.js
//
// Deliberately doc-only. eval IS synchronously demoable — but shipping a box
// that runs arbitrary user-supplied JavaScript in the page would undercut the
// page's own advice, and the demo inputs are not a sandbox. The examples are
// run in a real runtime instead.

export const meta = {
  slug:        'global-eval',
  name:        'eval',
  signature:   'eval(string)',
  blurb:       'Runs a string as code — and eval("{a: 1}") returns 1, not an object.',
  category:    'global',
  type:        'global',
  hasLiveDemo: false,
  version:     'ES1 (1997)',
  searchTerms: 'eval Function constructor indirect eval scope injection CSP performance deoptimise JSON.parse alternative javascript',
};

export const method = {
  slug:      'global-eval',
  name:      'eval',
  signature: 'eval(string)',
  returns:   { type: 'any', desc: 'The value of the last expression STATEMENT in the string. A block, or anything ending in a declaration, gives undefined or something surprising.' },

  category:    'Global function',
  version:     'ES1 (1997)',
  hasLiveDemo: false,

  subtitle: 'Almost every use has a better alternative. It is worth understanding anyway — because it appears in old code, because it explains why some code cannot be optimised, and because its parsing rules are genuinely surprising.',

  cheat: {
    commonCall: 'JSON.parse(text)',
    returns:    'the last expression value',
    replaces:   'nothing — almost everything replaces IT',
    watchOut:   'direct eval sees local scope; it also blocks optimisation',
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'Source to parse and run. A non-string is returned unchanged rather than evaluated, which is occasionally load-bearing in old code.' },
  ],

  patterns: [
    {
      name: 'Parse JSON',
      desc: 'The single most common thing eval was misused for.',
      code: 'const data = JSON.parse(text);',
    },
    {
      name: 'Look up a dynamic property',
      desc: 'Brackets, not eval.',
      code: 'const v = obj[name];',
    },
    {
      name: 'If you truly must, isolate it',
      desc: 'The Function constructor sees only global scope.',
      code: 'const f = new Function("a", "b", "return a + b");',
    },
  ],

  examples: [
    { title: 'An expression',       code: "eval('1 + 1')",        returns: '2' },
    { title: 'Braces are a BLOCK',  code: "eval('{a: 1}')",       returns: '1' },
    { title: 'Parenthesise for an object', code: "eval('({a: 1})')", returns: '{a: 1}' },
    { title: 'Non-strings pass through', code: 'eval(42)',         returns: '42' },
    { title: 'It sees local scope', code: "function f() { const x = 1; return eval('x'); }", returns: '1' },
    { title: 'Function does not',    code: "function f() { const x = 1; return new Function('return typeof x')(); }", returns: "'undefined'" },
  ],

  pitfalls: [
    {
      name: 'eval("{a: 1}") is not an object literal',
      desc: 'Leading braces start a BLOCK, so the contents are parsed as a labelled statement — a label named a, then the expression 1 — and the result is 1. This is the same ambiguity that makes an arrow function body need parentheses around an object.',
      wrong: { label: 'A labelled block', code: "eval('{a: 1}')", output: '1' },
      fix:   { label: 'Parenthesise',     code: "eval('({a: 1})')", output: '{a: 1}' },
    },
    {
      name: 'It is a code-injection hole',
      desc: 'Any string that reaches eval is executed with the full privileges of your page — cookies, storage, network. A value that came from a URL, a message or a database is not safe to evaluate, and there is no way to sanitise code into safety.',
      wrong: { label: 'Executes anything', code: 'eval(userInput)', output: 'whatever the user wrote' },
      fix:   { label: 'Parse, do not run', code: 'JSON.parse(userInput)', output: 'data only' },
    },
    {
      name: 'Direct eval can see and modify local scope',
      desc: 'A direct call reads the surrounding variables, which is why engines must disable optimisations for any function containing one. An INDIRECT call — through a variable, or globalThis.eval — runs in global scope instead, and the two behave differently for identical source.',
      wrong: { label: 'Sees the local', code: "function f() { const x = 1; return eval('x'); }", output: '1' },
      fix:   { label: 'Indirect is global', code: "function f() { const x = 1; const e = eval; return e('typeof x'); }", output: "'undefined'" },
    },
    {
      name: 'Content Security Policy usually blocks it',
      desc: "Any CSP without 'unsafe-eval' makes eval and the Function constructor throw. Code relying on either breaks the moment a security header is added, and the failure appears at runtime in production rather than in the build.",
      wrong: { label: 'Blocked by CSP', code: "eval('1 + 1')", output: 'EvalError under a strict CSP' },
      fix:   { label: 'Avoid it',       code: 'JSON.parse(text)', output: 'works under any policy' },
    },
  ],

  when: {
    use: [
      'Essentially never in application code',
      'A REPL, a playground or a devtools console — where running user code IS the product',
      'Reading old code that uses it',
    ],
    avoid: [
      'Parsing JSON → JSON.parse',
      'Dynamic property access → bracket notation',
      'Building a function from parts → the Function constructor, which at least isolates scope',
      'Anything under a Content Security Policy → it will throw',
    ],
  },

  notes: {
    complexity: 'Parsing plus execution — the string is compiled on every call',
    return:     'The last expression statement value, or undefined',
    cpython:    'V8: Builtins-global-eval',
    memory:     'Compiles fresh code each call; nothing is cached',
    threadSafe: 'Single-threaded; a direct eval disables optimisation of its enclosing function',
  },

  related: [
    { name: 'structuredClone',      slug: 'global-structuredclone', when: 'Copying data instead of evaluating code' },
    { name: 'Object.keys',          slug: 'object-keys',            when: 'Dynamic property access done properly' },
    { name: 'String.raw',           slug: 'string-raw',             when: 'Another feature about source text' },
    { name: 'setTimeout',           slug: 'global-settimeout',      when: 'It accepts a string, which is an eval in disguise' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'eval is one of the few things here that IS synchronously demoable — but shipping an input box that runs arbitrary JavaScript in the page would contradict everything this page says, and the demo inputs are not a sandbox. The examples above were run in a real runtime. If you want a place to evaluate code, a devtools console is the right tool.',
    },
    {
      q: 'Why does eval("{a: 1}") give 1?',
      a: 'Because a statement beginning with a brace is a BLOCK, not an object literal. Inside it, "a: 1" parses as a label called a applied to the expression 1, and the block value is that expression. Wrapping in parentheses forces the expression reading.',
      code: "eval('{a: 1}');     // 1\neval('({a: 1})');   // {a: 1}",
    },
    {
      q: 'What is the difference between direct and indirect eval?',
      a: 'A direct call — the identifier eval followed by parentheses — runs in the CALLER scope and can see local variables. Anything else, such as calling it through a variable or as globalThis.eval, is indirect and runs in global scope. Identical source, different results.',
      code: "const e = eval;\ne('code');   // indirect: global scope",
    },
    {
      q: 'Is the Function constructor safer?',
      a: 'Slightly — it cannot see local scope, so it does not defeat optimisation of the surrounding function and cannot read your closures. It is still arbitrary code execution and still blocked by CSP, so it is a lesser evil rather than a safe one.',
      code: 'const add = new Function("a", "b", "return a + b");',
    },
  ],

  history: [
    { version: 'ES1', note: 'eval present from the first version, with access to the caller scope.' },
    { version: 'ES5', note: 'Strict mode stopped eval from introducing variables into the enclosing scope; the direct/indirect distinction was specified.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval',
    meta:  'eval',
  },

  tryInTool: [],
};
