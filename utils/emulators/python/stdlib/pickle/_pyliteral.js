// utils/emulators/python/stdlib/pickle/_pyliteral.js
//
// ast.literal_eval(text) for the pickle demos: Python literal text → the
// value model of _pypickle.js. Evaluation order and object identity follow
// CPython (Lib/ast.py over the PEG parser's constants): every literal makes
// a new object, except the singletons ('' and one-character latin-1 str,
// b'' and one-byte bytes, ()). Identity matters — the pickler memoizes
// str, bytes and containers by identity.
//
// Supported: None, True, False, int (decimal, 0x, 0o, 0b, underscores),
// float, str and bytes literals (all prefixes except f-strings; escapes;
// implicit concatenation), unary +/- on numbers, tuples (with or without
// parentheses), lists, dicts, sets and set(). Anything ast.literal_eval
// would reject (names, calls, operators, f-strings, complex numbers …) —
// whose error messages contain memory addresses or parser details — stops
// with a DemoLimit. Unhashable set elements / dict keys raise the real
// TypeError ("unhashable type: 'list'").

import { PyFloat, PyList, PyDict, PySet, pyStr, pyBytes, pyTuple, limit } from './_pypickle.js';

const notLiteral = (why) => limit(`not something this demo reads as a literal: ${why}. Type None, True, False, numbers, 'strings', b'bytes', or tuples, lists, dicts and sets of them`);

const MAX_DEPTH = 100;
const isDigit = (c) => c >= '0' && c <= '9';
const isIdentStart = (c) => /[A-Za-z_]/.test(c) || (c > '\x7f' && /\p{L}/u.test(c));
const isIdentChar = (c) => /[A-Za-z0-9_]/.test(c) || (c > '\x7f' && /[\p{L}\p{N}]/u.test(c));

function tokenize(src) {
  const toks = [];
  let i = 0;
  let depth = 0;
  let lineStart = true; // at the start of a top-level line
  let sawExpr = false;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (lineStart && depth === 0) {
      // blank and comment-only lines are skipped; an indented line is an error
      let j = i;
      while (j < n && (src[j] === ' ' || src[j] === '\t')) j++;
      if (j >= n || src[j] === '\n' || src[j] === '#') {
        while (j < n && src[j] !== '\n') j++;
        i = j + 1;
        continue;
      }
      if (j > i || sawExpr) notLiteral('more than one line');
      lineStart = false;
      continue;
    }
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === '#') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '\\') {
      // a continuation must be followed by more of the expression
      if (src[i + 1] === '\n' && /\S/.test(src.slice(i + 2))) { i += 2; continue; }
      notLiteral('a stray backslash');
    }
    if (c === '\n') {
      i++;
      if (depth === 0) { lineStart = true; sawExpr = true; }
      continue;
    }
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1] || ''))) {
      const [tok, end] = readNumber(src, i);
      toks.push(tok);
      i = end;
      continue;
    }
    const pm = /^([rRuUbBfF]{1,2})?('''|"""|'|")/.exec(src.slice(i, i + 5));
    if (pm) {
      const [tok, end] = readString(src, i, pm[1] || '', pm[2]);
      toks.push(tok);
      i = end;
      continue;
    }
    if (isIdentStart(c)) {
      let j = i + 1;
      while (j < n && isIdentChar(src[j])) j++;
      toks.push({ t: 'name', v: src.slice(i, j) });
      i = j;
      continue;
    }
    if ('([{'.includes(c)) {
      depth++;
      if (depth > MAX_DEPTH) limit(`the demo reads up to ${MAX_DEPTH} levels of brackets`);
    } else if (')]}'.includes(c)) {
      if (depth === 0) notLiteral(`an unmatched '${c}'`);
      depth--;
    } else if (!',:+-'.includes(c)) {
      notLiteral(`'${c}' is not part of a literal`);
    }
    toks.push({ t: 'op', v: c });
    i++;
  }
  toks.push({ t: 'end' });
  return toks;
}

function readDigits(src, i, re) {
  // digit (["_"] digit)*
  if (!re.test(src[i] || '')) return i;
  i++;
  for (;;) {
    if (re.test(src[i] || '')) i++;
    else if (src[i] === '_' && re.test(src[i + 1] || '')) i += 2;
    else return i;
  }
}

function readNumber(src, start) {
  let i = start;
  let tok;
  const radix = /^0([xXoObB])/.exec(src.slice(i, i + 2));
  if (radix) {
    const kind = radix[1].toLowerCase();
    const re = kind === 'x' ? /[0-9a-fA-F]/ : kind === 'o' ? /[0-7]/ : /[01]/;
    let j = i + 2;
    if (src[j] === '_') j++;
    const end = readDigits(src, j, re);
    if (end === j) notLiteral('an incomplete number');
    const digits = src.slice(i + 2, end).replace(/_/g, '');
    tok = { t: 'int', v: BigInt('0' + kind + digits) };
    i = end;
  } else {
    const intEnd = readDigits(src, i, /\d/);
    let j = intEnd;
    let isFloat = false;
    if (src[j] === '.') {
      isFloat = true;
      j = readDigits(src, j + 1, /\d/);
    }
    if ((src[j] === 'e' || src[j] === 'E') && (intEnd > i || j > intEnd + 1)) {
      let k = j + 1;
      if (src[k] === '+' || src[k] === '-') k++;
      const expEnd = readDigits(src, k, /\d/);
      if (expEnd > k) { isFloat = true; j = expEnd; }
    }
    const text = src.slice(i, j).replace(/_/g, '');
    if (isFloat) tok = { t: 'float', v: Number(text) };
    else {
      if (/^0+[1-9]/.test(text)) notLiteral('leading zeros in a decimal integer');
      if (text.replace(/^0+(?=\d)/, '').length > 4300) limit('decimal integer literals over 4300 digits are refused by CPython (sys.set_int_max_str_digits)');
      tok = { t: 'int', v: BigInt(text) };
    }
    i = j;
  }
  if (src[i] === 'j' || src[i] === 'J') notLiteral('complex numbers are not part of the demo');
  if (i < src.length && (isIdentChar(src[i]) || src[i] === '.')) notLiteral('an invalid number');
  return [tok, i];
}

const SIMPLE_ESC = { '\n': '', '\\': '\\', "'": "'", '"': '"', a: '\x07', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\v' };

function readString(src, start, prefix, quote) {
  const p = prefix.toLowerCase();
  if (!['', 'r', 'u', 'b', 'br', 'rb', 'f', 'fr', 'rf'].includes(p)) notLiteral(`'${prefix}' is not a string prefix`);
  if (p.includes('f')) notLiteral('f-strings are not literals');
  const raw = p.includes('r');
  const isBytes = p.includes('b');
  let i = start + prefix.length + quote.length;
  const triple = quote.length === 3;
  let body = '';
  for (;;) {
    if (i >= src.length) notLiteral('an unterminated string');
    const c = src[i];
    if (src.startsWith(quote, i)) { i += quote.length; break; }
    if (c === '\n' && !triple) notLiteral('an unterminated string');
    if (c === '\\') {
      if (i + 1 >= src.length) notLiteral('an unterminated string');
      body += c + src[i + 1];
      i += 2;
      continue;
    }
    body += c;
    i++;
  }
  if (isBytes && /[^\x00-\x7f]/.test(body)) notLiteral('bytes literals can only contain ASCII characters');
  let value;
  if (raw) value = body;
  else {
    value = '';
    for (let k = 0; k < body.length; k++) {
      const c = body[k];
      if (c !== '\\') { value += c; continue; }
      const e = body[++k];
      if (e in SIMPLE_ESC) { value += SIMPLE_ESC[e]; continue; }
      if (e >= '0' && e <= '7') {
        let digits = e;
        while (digits.length < 3 && body[k + 1] >= '0' && body[k + 1] <= '7') digits += body[++k];
        const v = parseInt(digits, 8);
        if (isBytes && v > 0xff) notLiteral('an octal escape above \\377 in bytes');
        value += String.fromCharCode(v);
        continue;
      }
      if (e === 'x') {
        const h = body.slice(k + 1, k + 3);
        if (!/^[0-9a-fA-F]{2}$/.test(h)) notLiteral('a truncated \\x escape');
        value += String.fromCharCode(parseInt(h, 16));
        k += 2;
        continue;
      }
      if (!isBytes && (e === 'u' || e === 'U')) {
        const len = e === 'u' ? 4 : 8;
        const h = body.slice(k + 1, k + 1 + len);
        if (h.length < len || !/^[0-9a-fA-F]+$/.test(h)) notLiteral(`a truncated \\${e} escape`);
        const cp = parseInt(h, 16);
        if (cp > 0x10ffff) notLiteral('an escape beyond U+10FFFF');
        if (cp >= 0xd800 && cp <= 0xdfff) limit('the demo does not model lone surrogates');
        value += String.fromCodePoint(cp);
        k += len;
        continue;
      }
      if (!isBytes && e === 'N') notLiteral('\\N{...} escapes are not part of the demo');
      // an unknown escape keeps its backslash (with a SyntaxWarning)
      value += '\\' + e;
    }
  }
  return [{ t: 'str', v: value, bytes: isBytes }, i];
}

function parse(toks) {
  let pos = 0;
  const peek = () => toks[pos];
  const isOp = (v) => toks[pos].t === 'op' && toks[pos].v === v;
  const expect = (v) => {
    if (!isOp(v)) notLiteral(`expected '${v}'`);
    pos++;
  };

  function atom() {
    const tk = peek();
    if (tk.t === 'int' || tk.t === 'float') { pos++; return { k: 'num', tk }; }
    if (tk.t === 'str') {
      const parts = [];
      while (peek().t === 'str') parts.push(toks[pos++]);
      if (parts.some((p) => p.bytes !== parts[0].bytes)) notLiteral('bytes and str literals cannot be concatenated');
      return { k: parts[0].bytes ? 'bytes' : 'str', v: parts.map((p) => p.v).join('') };
    }
    if (tk.t === 'name') {
      pos++;
      if (tk.v === 'True') return { k: 'const', v: true };
      if (tk.v === 'False') return { k: 'const', v: false };
      if (tk.v === 'None') return { k: 'const', v: null };
      if (tk.v === 'set' && isOp('(') && toks[pos + 1].t === 'op' && toks[pos + 1].v === ')') {
        pos += 2;
        return { k: 'emptyset' };
      }
      return notLiteral(`the name '${tk.v}'`);
    }
    if (tk.t === 'op') {
      if (tk.v === '(') {
        pos++;
        if (isOp(')')) { pos++; return { k: 'tuple', items: [] }; }
        const [items, comma] = sequence(')');
        expect(')');
        return comma ? { k: 'tuple', items } : items[0];
      }
      if (tk.v === '[') {
        pos++;
        const [items] = isOp(']') ? [[]] : sequence(']');
        expect(']');
        return { k: 'list', items };
      }
      if (tk.v === '{') {
        pos++;
        if (isOp('}')) { pos++; return { k: 'dict', keys: [], vals: [] }; }
        const first = item();
        if (isOp(':')) {
          pos++;
          const keys = [first];
          const vals = [item()];
          while (isOp(',')) {
            pos++;
            if (isOp('}')) break;
            keys.push(item());
            expect(':');
            vals.push(item());
          }
          expect('}');
          return { k: 'dict', keys, vals };
        }
        const items = [first];
        while (isOp(',')) {
          pos++;
          if (isOp('}')) break;
          items.push(item());
        }
        expect('}');
        return { k: 'set', items };
      }
      if (tk.v === '+' || tk.v === '-') {
        pos++;
        const operand = atom();
        if (operand.k !== 'num' || operand.neg !== undefined) notLiteral('+ and - only apply to a number here');
        return { k: 'num', tk: operand.tk, neg: tk.v === '-' };
      }
    }
    return notLiteral(tk.t === 'end' ? 'the text ends too early' : `unexpected '${tk.v}'`);
  }
  // one element: a unary-signed atom; anything after it but , : ) ] } ends it
  function item() {
    const node = atom();
    const nx = peek();
    if (nx.t === 'op' && (nx.v === '+' || nx.v === '-')) notLiteral('arithmetic is not part of a literal');
    if (nx.t !== 'op' && nx.t !== 'end') notLiteral('two values without a comma between them');
    return node;
  }
  // item (',' item)* [','] up to the closer; reports whether a comma occurred
  function sequence(closer) {
    const items = [item()];
    let comma = false;
    while (isOp(',')) {
      comma = true;
      pos++;
      if (closer ? isOp(closer) : peek().t === 'end') break;
      items.push(item());
    }
    return [items, comma];
  }

  const [items, comma] = sequence(null);
  if (peek().t !== 'end') notLiteral(`unexpected '${peek().v}'`);
  return comma ? { k: 'tuple', items } : items[0];
}

// evaluation in ast.literal_eval's order (dict: key, value, insert)
function convert(node) {
  switch (node.k) {
    case 'const': return node.v;
    case 'num': {
      const { tk } = node;
      if (tk.t === 'int') return node.neg ? -tk.v : tk.v;
      return new PyFloat(node.neg ? -tk.v : tk.v);
    }
    case 'str': return pyStr(node.v);
    case 'bytes': return pyBytes(Uint8Array.from(node.v, (c) => c.charCodeAt(0)));
    case 'tuple': return pyTuple(node.items.map(convert));
    case 'list': return new PyList(node.items.map(convert));
    case 'emptyset': return new PySet();
    case 'set': {
      const s = new PySet();
      for (const it of node.items) s.add(convert(it));
      return s;
    }
    case 'dict': {
      const d = new PyDict();
      for (let i = 0; i < node.keys.length; i++) {
        const k = convert(node.keys[i]);
        const v = convert(node.vals[i]);
        d.set(k, v);
      }
      return d;
    }
    default: return notLiteral('unknown node');
  }
}

export function literalEval(text) {
  if (typeof text !== 'string') notLiteral('not text');
  let src = text.replace(/^[ \t]+/, '');
  if (src.includes('\0')) notLiteral('a NUL character');
  if (/[\f\v]/.test(src)) notLiteral('form feed or vertical tab');
  src = src.replace(/\r\n?/g, '\n');
  const toks = tokenize(src);
  if (toks.length === 1) notLiteral('the text is empty');
  return convert(parse(toks));
}
