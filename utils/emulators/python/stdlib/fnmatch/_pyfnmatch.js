// utils/emulators/python/stdlib/fnmatch/_pyfnmatch.js
//
// Port of CPython 3.13's Lib/fnmatch.py for the fnmatch demos, shared by
// the fnmatch hub and member emulators (and imported by the glob engine).
// Not a content page (leading underscore): never mapped by the generator.
//
//   translate / _translate / _join_translated_parts — line by line, so the
//   regular expression text is exactly what CPython 3.13 returns (atomic
//   groups, (?s:...)\Z, the bracket-expression rewriting).
//
//   Matching runs the translated regex itself: a small parser for the
//   subset of Python regex syntax that fnmatch.translate and glob.translate
//   produce (literals and escapes, ., [...] sets with ranges and
//   negation, groups (?:...) (?>...) (?s:...), the lookaheads (?!) and
//   (?!\.), quantifiers * + ? and their lazy forms, | and \Z), compiled to
//   an NFA and simulated (no backtracking, so no catastrophic patterns).
//   For a yes/no answer an atomic group (?>.*?FIXED) behaves like .*?FIXED
//   here: what follows it always starts with .*, so the earliest FIXED is
//   always a valid choice.
//
// fnmatch() and filter() normalise case with os.path.normcase — the
// identity on Linux and macOS, lower-case plus '/' → '\' on Windows. The
// demos emulate POSIX (normcase does nothing), as the pages say.
//
// str only (no bytes patterns).

import { PyException } from '../../../../py-exceptions.js';

// ── re.escape (Lib/re/__init__.py) ───────────────────────────
const SPECIAL = new Set([...'()[]{}?*+-|^$\\.&~# \t\n\r\v\f']);
export function reEscape(s) {
  let out = '';
  for (const c of s) out += SPECIAL.has(c) ? '\\' + c : c;
  return out;
}

const cp = (c) => c.codePointAt(0);

// ── translate ────────────────────────────────────────────────
// Python's pat.find(ch, start, end) over a code-point array
function findIn(arr, ch, start, end) {
  for (let k = Math.max(start, 0); k < Math.min(end, arr.length); k += 1) if (arr[k] === ch) return k;
  return -1;
}

// _translate(pat, STAR, QUESTION_MARK): list of regex pieces; STAR is any
// sentinel the caller passes (compared by identity, like `is`)
export function _translate(pat, STAR, QUESTION_MARK) {
  const res = [];
  const add = (x) => res.push(x);
  const p = Array.from(pat);
  let i = 0;
  const n = p.length;
  while (i < n) {
    const c = p[i];
    i += 1;
    if (c === '*') {
      // compress consecutive `*` into one
      if (res.length === 0 || res[res.length - 1] !== STAR) add(STAR);
    } else if (c === '?') {
      add(QUESTION_MARK);
    } else if (c === '[') {
      let j = i;
      if (j < n && p[j] === '!') j += 1;
      if (j < n && p[j] === ']') j += 1;
      while (j < n && p[j] !== ']') j += 1;
      if (j >= n) {
        add('\\[');
      } else {
        let stuff;
        if (!p.slice(i, j).includes('-')) {
          stuff = p.slice(i, j).join('').replaceAll('\\', '\\\\');
        } else {
          const chunks = [];
          let k = p[i] === '!' ? i + 2 : i + 1;
          for (;;) {
            k = findIn(p, '-', k, j);
            if (k < 0) break;
            chunks.push(p.slice(i, k));
            i = k + 1;
            k += 3;
          }
          const chunk = p.slice(i, j);
          if (chunk.length) chunks.push(chunk);
          else chunks[chunks.length - 1] = [...chunks[chunks.length - 1], '-'];
          // Remove empty ranges -- invalid in RE.
          for (let m = chunks.length - 1; m > 0; m -= 1) {
            const prev = chunks[m - 1];
            if (prev.length === 0) raise('IndexError', 'string index out of range');
            if (cp(prev[prev.length - 1]) > cp(chunks[m][0])) {
              chunks[m - 1] = [...prev.slice(0, -1), ...chunks[m].slice(1)];
              chunks.splice(m, 1);
            }
          }
          // Escape backslashes and hyphens for set difference (--).
          // Hyphens that create ranges shouldn't be escaped.
          stuff = chunks.map((s) => s.join('').replaceAll('\\', '\\\\').replaceAll('-', '\\-')).join('-');
        }
        // Escape set operations (&&, ~~ and ||).
        stuff = stuff.replace(/([&~|])/g, '\\$1');
        i = j + 1;
        if (!stuff) {
          // Empty range: never match.
          add('(?!)');
        } else if (stuff === '!') {
          // Negated empty range: match any character.
          add('.');
        } else {
          if (stuff[0] === '!') stuff = '^' + stuff.slice(1);
          else if (stuff[0] === '^' || stuff[0] === '[') stuff = '\\' + stuff;
          add(`[${stuff}]`);
        }
      }
    } else {
      add(reEscape(c));
    }
  }
  return res;
}

function raise(type, msg) {
  throw new PyException(type, msg);
}

export function _joinTranslatedParts(inp, STAR) {
  const res = [];
  const add = (x) => res.push(x);
  let i = 0;
  const n = inp.length;
  // Fixed pieces at the start?
  while (i < n && inp[i] !== STAR) {
    add(inp[i]);
    i += 1;
  }
  // Now deal with STAR fixed STAR fixed ...
  while (i < n) {
    i += 1;
    if (i === n) {
      add('.*');
      break;
    }
    const fixed = [];
    while (i < n && inp[i] !== STAR) {
      fixed.push(inp[i]);
      i += 1;
    }
    const f = fixed.join('');
    if (i === n) {
      add('.*');
      add(f);
    } else {
      add(`(?>.*?${f})`);
    }
  }
  return `(?s:${res.join('')})\\Z`;
}

const STAR_SENTINEL = { star: true };

function checkStr(v, what) {
  if (typeof v !== 'string') {
    raise('EmulatorLimit', `not emulated: ${what} must be a str in this demo`);
  }
}

export function translate(pat) {
  checkStr(pat, 'the pattern');
  return _joinTranslatedParts(_translate(pat, STAR_SENTINEL, '.'), STAR_SENTINEL);
}

// ── A small Python-regex subset → NFA ────────────────────────
// AST: { k: 'set', test } one character · { k: 'seq', items } ·
// { k: 'alt', items } · { k: 'rep', item, min: 0|1, max: 1|Infinity } ·
// { k: 'nla', test|null } (?!x) on one character, null = (?!) ·
// { k: 'end' } \Z

const LETTERS_DIGITS = /^[A-Za-z0-9]$/;

function reError(msg, pos) {
  raise('re.PatternError', `${msg} at position ${pos}`);
}

export function parseRegex(src) {
  const s = Array.from(src);
  let i = 0;
  const peek = () => s[i];

  function escapeChar(pos) {
    // after a backslash: only non-alphanumeric escapes and \Z are produced
    if (i >= s.length) reError('bad escape (end of pattern)', pos);
    const c = s[i];
    i += 1;
    if (LETTERS_DIGITS.test(c)) raise('EmulatorLimit', `not emulated: the escape \\${c} is outside what this demo's regex engine handles`);
    return c;
  }

  function parseSet(start) {
    // just after '['
    let negate = false;
    if (peek() === '^') {
      negate = true;
      i += 1;
    }
    const ranges = [];
    for (;;) {
      if (i >= s.length) reError('unterminated character set', start);
      let c = s[i];
      i += 1;
      if (c === ']' && ranges.length) break;
      let lo;
      if (c === '\\') {
        lo = cp(escapeChar(i - 1));
      } else lo = cp(c);
      if (peek() === '-') {
        i += 1;
        if (i >= s.length) reError('unterminated character set', start);
        c = s[i];
        i += 1;
        if (c === ']') {
          ranges.push([lo, lo], [45, 45]);
          break;
        }
        const hi = c === '\\' ? cp(escapeChar(i - 1)) : cp(c);
        if (hi < lo) raise('re.PatternError', `bad character range at position ${start}`);
        ranges.push([lo, hi]);
      } else ranges.push([lo, lo]);
    }
    const inSet = (x) => ranges.some(([a, b]) => x >= a && x <= b);
    return { k: 'set', test: negate ? (x) => !inSet(x) : inSet };
  }

  function parseAtom(dotall) {
    const c = s[i];
    const pos = i;
    i += 1;
    if (c === '.') return { k: 'set', test: dotall ? () => true : (x) => x !== 10 };
    if (c === '[') return parseSet(pos);
    if (c === '\\') {
      if (s[i] === 'Z') {
        i += 1;
        return { k: 'end' };
      }
      const e = escapeChar(pos);
      const v = cp(e);
      return { k: 'set', test: (x) => x === v };
    }
    if (c === '(') {
      if (s[i] !== '?') {
        const inner = parseAlt(dotall);
        if (s[i] !== ')') reError('missing ), unterminated subpattern', pos);
        i += 1;
        return inner;
      }
      i += 1;
      const kind = s[i];
      if (kind === ':' || kind === '>') {
        i += 1;
        const inner = parseAlt(dotall);
        if (s[i] !== ')') reError('missing ), unterminated subpattern', pos);
        i += 1;
        return inner;
      }
      if (kind === 's' && s[i + 1] === ':') {
        i += 2;
        const inner = parseAlt(true);
        if (s[i] !== ')') reError('missing ), unterminated subpattern', pos);
        i += 1;
        return inner;
      }
      if (kind === '!') {
        i += 1;
        if (s[i] === ')') {
          i += 1;
          return { k: 'nla', test: null };
        }
        const inner = parseAtom(dotall);
        if (inner.k !== 'set' || s[i] !== ')') raise('EmulatorLimit', 'not emulated: only one-character lookaheads are handled by this demo');
        i += 1;
        return { k: 'nla', test: inner.test };
      }
      raise('EmulatorLimit', 'not emulated: this group syntax is outside what the demo handles');
    }
    if ('*+?{'.includes(c)) reError('nothing to repeat', pos);
    if (c === '^' || c === '$') raise('EmulatorLimit', `not emulated: the anchor ${c} is outside what the demo handles`);
    const v = cp(c);
    return { k: 'set', test: (x) => x === v };
  }

  function parseSeq(dotall) {
    const items = [];
    while (i < s.length && s[i] !== '|' && s[i] !== ')') {
      let atom = parseAtom(dotall);
      while (i < s.length && '*+?'.includes(s[i])) {
        const q = s[i];
        i += 1;
        if (s[i] === '?') i += 1; // lazy: same yes/no answer
        if (atom.k === 'end' || atom.k === 'nla') reError('nothing to repeat', i - 1);
        atom = { k: 'rep', item: atom, min: q === '+' ? 1 : 0, max: q === '?' ? 1 : Infinity };
      }
      items.push(atom);
    }
    return { k: 'seq', items };
  }

  function parseAlt(dotall) {
    const items = [parseSeq(dotall)];
    while (s[i] === '|') {
      i += 1;
      items.push(parseSeq(dotall));
    }
    return items.length === 1 ? items[0] : { k: 'alt', items };
  }

  const ast = parseAlt(false);
  if (i < s.length) reError('unbalanced parenthesis', i);
  return ast;
}

// Thompson NFA: states { t: 'char', test, out } | { t: 'split', a, b } |
// { t: 'nla', test, out } | { t: 'end', out } | { t: 'match' }
function compileNfa(ast) {
  const states = [];
  const mk = (st) => {
    states.push(st);
    return states.length - 1;
  };
  // returns [start, patchList(out-setters)]
  function build(node) {
    switch (node.k) {
      case 'set': {
        const id = mk({ t: 'char', test: node.test, out: -1 });
        return [id, [(o) => { states[id].out = o; }]];
      }
      case 'nla': {
        const id = mk({ t: 'nla', test: node.test, out: -1 });
        return [id, [(o) => { states[id].out = o; }]];
      }
      case 'end': {
        const id = mk({ t: 'end', out: -1 });
        return [id, [(o) => { states[id].out = o; }]];
      }
      case 'seq': {
        if (node.items.length === 0) {
          const id = mk({ t: 'split', a: -1, b: -1 });
          return [id, [(o) => { states[id].a = o; states[id].b = o; }]];
        }
        let [start, outs] = build(node.items[0]);
        for (const it of node.items.slice(1)) {
          const [s2, o2] = build(it);
          outs.forEach((f) => f(s2));
          outs = o2;
        }
        return [start, outs];
      }
      case 'alt': {
        let [start, outs] = build(node.items[0]);
        for (const it of node.items.slice(1)) {
          const [s2, o2] = build(it);
          const id = mk({ t: 'split', a: start, b: s2 });
          start = id;
          outs = [...outs, ...o2];
        }
        return [start, outs];
      }
      case 'rep': {
        if (node.max === 1) {
          // x?
          const [s1, o1] = build(node.item);
          const id = mk({ t: 'split', a: s1, b: -1 });
          return [id, [...o1, (o) => { states[id].b = o; }]];
        }
        const [s1, o1] = build(node.item);
        const id = mk({ t: 'split', a: s1, b: -1 });
        o1.forEach((f) => f(id));
        // x* starts at the split; x+ starts at x
        return [node.min === 1 ? s1 : id, [(o) => { states[id].b = o; }]];
      }
      default:
        throw new Error(`bad node ${node.k}`);
    }
  }
  const [start, outs] = build(ast);
  const fin = mk({ t: 'match' });
  outs.forEach((f) => f(fin));
  return { states, start };
}

// re.match(regex, s) is not None — anchored at the start, any end (the
// translated patterns end in \Z, so that means the whole string)
function nfaMatch(nfa, str) {
  const { states } = nfa;
  const chars = Array.from(str).map(cp);
  const n = chars.length;
  let cur = new Set();
  const addState = (set, id, pos, seen) => {
    if (id < 0 || seen.has(id)) return;
    seen.add(id);
    const st = states[id];
    if (st.t === 'split') {
      addState(set, st.a, pos, seen);
      addState(set, st.b, pos, seen);
    } else if (st.t === 'nla') {
      const ok = st.test === null ? false : !(pos < n && st.test(chars[pos]));
      if (ok) addState(set, st.out, pos, seen);
    } else if (st.t === 'end') {
      if (pos === n) addState(set, st.out, pos, seen);
    } else set.add(id);
  };
  addState(cur, nfa.start, 0, new Set());
  for (let pos = 0; ; pos += 1) {
    for (const id of cur) if (states[id].t === 'match') return true;
    if (pos >= n || cur.size === 0) return false;
    const next = new Set();
    const seen = new Set();
    for (const id of cur) {
      const st = states[id];
      if (st.t === 'char' && st.test(chars[pos])) addState(next, st.out, pos + 1, seen);
    }
    cur = next;
  }
}

const compiled = new Map();
// re.compile(regex).match → (s) => bool
export function compileRegex(regex) {
  let m = compiled.get(regex);
  if (!m) {
    const nfa = compileNfa(parseRegex(regex));
    m = (s) => nfaMatch(nfa, s);
    if (compiled.size > 2000) compiled.clear();
    compiled.set(regex, m);
  }
  return m;
}

// re.match(regex, s) is not None
export function reMatches(regex, s) {
  return compileRegex(regex)(s);
}

// ── public API ───────────────────────────────────────────────
// os.path.normcase on POSIX: the identity (it only checks the type)
export function normcase(s) {
  checkStr(s, 'each name');
  return s;
}

export function fnmatchcase(name, pat) {
  checkStr(name, 'the name');
  return compileRegex(translate(pat))(name);
}

// POSIX fnmatch(): normcase is the identity, so this is fnmatchcase
export function fnmatch(name, pat) {
  return fnmatchcase(normcase(name), normcase(pat));
}

export function filter(names, pat) {
  const match = compileRegex(translate(normcase(pat)));
  const out = [];
  for (const name of names) {
    checkStr(name, 'each name');
    if (match(name)) out.push(name);
  }
  return out;
}
