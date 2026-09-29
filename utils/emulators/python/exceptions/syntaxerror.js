// utils/emulators/python/exceptions/syntaxerror.js
//
// Emulator for the SyntaxError demo modes. The demo strips its input down
// to bracket characters only and compile()s the result in 'eval' mode, so
// the emulator only has to model CPython 3.13 on the alphabet ()[]{}:
//
//   1. The tokenizer's bracket stack. The FIRST closing bracket with no
//      opener ("unmatched ')'") or the wrong opener ("closing parenthesis
//      ']' does not match opening parenthesis '('") always wins — CPython
//      re-tokenizes the rest of the source after a parser error, and these
//      tokenizer errors override whatever the parser said.
//   2. The PEG parser over the bracket tokens (atoms (), [], {}, nested
//      atoms, call trailers x(...) and subscript trailers x[...]). Tokens
//      are fetched lazily: if the parser ever asks for the token past the
//      end while a bracket is still open, the result is "'(' was never
//      closed" (innermost open bracket).
//   3. On a parse failure, the second pass with invalid_* rules: two
//      adjacent expressions inside brackets give "invalid syntax. Perhaps
//      you forgot a comma?"; otherwise plain "invalid syntax" located at
//      the last token the first pass looked at.
//
// Offsets are 1-based columns, like SyntaxError.offset.

import { raise } from '../../../py-exceptions.js';

const OPEN = { '(': ')', '[': ']', '{': '}' };
const CLOSE = { ')': '(', ']': '[', '}': '{' };
const MAXLEVEL = 200; // tokenizer nesting limit (Parser/lexer)

class NeverClosed extends Error {}
class Comma extends Error {
  constructor(start) {
    super('comma');
    this.start = start;
  }
}

// A parenthesized group (x) is not an AST node of its own: its location
// is that of x, which is where the comma hint points.

// compile(src, '<demo>', 'eval') for a bracket-only src.
// → null when it compiles, else { msg, offset }.
export function compileBrackets(src) {
  // 1. tokenizer pass — bracket stack and per-token nesting level
  const stack = [];
  const level = [];
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (OPEN[c]) {
      if (stack.length >= MAXLEVEL) return { msg: 'too many nested parentheses', offset: i + 1 };
      stack.push(i);
    } else {
      if (stack.length === 0) return { msg: `unmatched '${c}'`, offset: i + 1 };
      const o = src[stack[stack.length - 1]];
      if (o !== CLOSE[c]) {
        return { msg: `closing parenthesis '${c}' does not match opening parenthesis '${o}'`, offset: i + 1 };
      }
      stack.pop();
    }
    level.push(stack.length);
  }
  const n = src.length;
  const unclosed = stack.length > 0 ? stack[stack.length - 1] : -1;

  // 2./3. parser
  let horizon = 0; // furthest token index fetched
  let inv = false; // second pass: invalid_* rules enabled
  const groupLoc = new Map(); // '(' index of a group → location of its inner expression

  const peek = (i) => {
    if (i > horizon) horizon = i;
    if (i >= n) {
      if (unclosed >= 0) throw new NeverClosed();
      return 'EOF';
    }
    return src[i];
  };

  // bracketed atom / trailer body: open, [expression], close
  const enclosed = (i, close) => {
    if (peek(i + 1) === close) return i + 2;
    const e = expression(i + 1);
    if (e !== null && peek(e) === close) {
      if (close === ')') groupLoc.set(i, locOf(i + 1, e));
      return e + 1;
    }
    return null;
  };

  // AST start column of the expression spanning [i, end)
  const locOf = (i, end) => {
    if (src[i] === '(' && groupLoc.has(i) && closing(i) === end - 1) return groupLoc.get(i);
    return i;
  };
  const closing = (i) => {
    let d = 0;
    for (let k = i; k < n; k += 1) {
      d += OPEN[src[k]] ? 1 : -1;
      if (d === 0) return k;
    }
    return -1;
  };

  const atom = (i) => {
    const t = peek(i);
    return OPEN[t] ? enclosed(i, OPEN[t]) : null;
  };

  // primary: atom followed by call (...) / subscript [...] trailers.
  // A subscript needs a slice inside: x[] is not a trailer.
  const primary = (i) => {
    let end = atom(i);
    if (end === null) return null;
    for (;;) {
      const t = peek(end);
      let next = null;
      if (t === '(') next = enclosed(end, ')');
      else if (t === '[') {
        const e = expression(end + 1);
        if (e !== null && peek(e) === ']') next = e + 1;
      }
      else if (t === '{' && inv) {
        // second pass only: the `primary genexp` alternative falls into
        // invalid_comprehension, which accepts '{' as a comprehension
        // opener and parses what follows it as an expression — with the
        // invalid rules on. It never matches, but it looks ahead.
        const e = expression(end + 1);
        if (e !== null) peek(e);
      }
      if (next === null) return end;
      end = next;
    }
  };

  // disjunction and everything down to primary: the operator checks all
  // look at the token after the primary
  // memoized per (position, pass state), like the PEG parser's memo —
  // without it nested brackets would re-parse exponentially
  const memo = new Map();
  const disjunction = (i) => {
    const key = inv ? -1 - i : i;
    if (memo.has(key)) return memo.get(key);
    const end = primary(i);
    if (end !== null) peek(end);
    memo.set(key, end);
    return end;
  };

  const expression = (i) => {
    if (inv) {
      // invalid_expression: a=disjunction b=expression_without_invalid,
      // reported only inside brackets (level of b's last token > 0)
      const a = disjunction(i);
      if (a !== null) {
        // expression_without_invalid switches the invalid rules off
        // for everything parsed under it
        inv = false;
        let b;
        try {
          b = disjunction(a);
        } finally {
          inv = true;
        }
        if (b !== null && level[b - 1] > 0) throw new Comma(locOf(i, a));
      }
    }
    return disjunction(i);
  };

  const parseEval = () => {
    const e = expression(0);
    return e !== null && peek(e) === 'EOF' && e === n;
  };

  try {
    if (parseEval()) return null;
  } catch (err) {
    if (err instanceof NeverClosed) return { msg: `'${src[unclosed]}' was never closed`, offset: unclosed + 1 };
    throw err;
  }
  const lastToken = horizon;
  memo.clear();
  inv = true;
  try {
    parseEval();
  } catch (err) {
    if (err instanceof NeverClosed) return { msg: `'${src[unclosed]}' was never closed`, offset: unclosed + 1 };
    if (err instanceof Comma) return { msg: 'invalid syntax. Perhaps you forgot a comma?', offset: err.start + 1 };
    throw err;
  }
  if (n === 0) return { msg: 'invalid syntax', offset: 0 };
  return { msg: 'invalid syntax', offset: Math.min(lastToken, n - 1) + 1 };
}

const brackets = (code) => [...code].filter((c) => '()[]{}'.includes(c)).join('');

export default {
  trigger: (code) => {
    const err = compileBrackets(brackets(code));
    if (err) raise('SyntaxError', err.msg);
    return 'compiles';
  },

  handle: (code) => {
    const err = compileBrackets(brackets(code));
    if (err) return { __pyTuple: [err.msg, err.offset] };
    return 'compiles';
  },
};
