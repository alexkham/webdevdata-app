// utils/emulators/python/eval.js
//
// Emulator for Python eval(). Real eval() is arbitrary code execution;
// the emulator refuses to be that dangerous. We handle a curated set of
// safe expressions (arithmetic, string method calls, literal lists /
// dicts, comprehensions on range) and REFUSE anything else with a
// clear message directing the user to ast.literal_eval.
//
// This is intentional: teaching what eval CAN do without shipping an
// actual eval-of-arbitrary-Python into the browser.

class SyntaxErrorLike extends Error {
  constructor(message) { super(message); this.name = 'SyntaxError'; }
}

const SAFE_RESULTS = {
  '1 + 2 * 3':                   '7',
  '"hello".upper()':             "'HELLO'",
  '[x * 2 for x in range(3)]':   '[0, 2, 4]',
  '{"a": 1, "b": 2}':            "{'a': 1, 'b': 2}",
  '10 > 5':                       'True',
  '10 < 5':                       'False',
  '"a" + "b"':                    "'ab'",
  '[1, 2, 3]':                    '[1, 2, 3]',
  '(1, 2, 3)':                    '(1, 2, 3)',
  '{1, 2, 3}':                    '{1, 2, 3}',
  '"hi".upper()':                 "'HI'",
  'len("hello")':                 '5',
  'sum([1, 2, 3])':               '6',
  'max(3, 5, 1)':                 '5',
};

function looksLikeStatement(s) {
  const t = s.trim();
  return (
    /^\s*(def|class|import|from|if|for|while|try|with)\s/.test(t) ||
    /^[a-zA-Z_][a-zA-Z_0-9]*\s*=\s*[^=]/.test(t)   // simple assignment
  );
}

export default function pyEval(expr) {
  const e = String(expr == null ? '' : expr);
  const trimmed = e.trim();

  if (trimmed === '') {
    throw new SyntaxErrorLike('unexpected EOF while parsing');
  }

  if (looksLikeStatement(trimmed)) {
    throw new SyntaxErrorLike('invalid syntax  # eval only accepts EXPRESSIONS — use exec for statements');
  }

  if (SAFE_RESULTS[trimmed] !== undefined) return SAFE_RESULTS[trimmed];

  // For anything else, return a placeholder — the demo cannot run
  // arbitrary Python safely.
  return `# eval() would execute this expression in Python.\n# The demo evaluates only a curated safe subset; for arbitrary\n# expressions, run Python directly. For untrusted data, use\n# ast.literal_eval instead.`;
}