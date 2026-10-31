// utils/emulators/python/stdlib/difflib/_pydifflib.js
//
// Port of CPython 3.13's Lib/difflib.py for the difflib demos — shared by
// the module hub and the member emulators. Not a content page (leading
// underscore), so the catalog generator never maps it. (3.12's difflib.py
// is identical apart from HtmlDiff's CSS, which is not ported.)
//
//   SequenceMatcher  __chain_b (junk via isjunk, the "popular" autojunk
//                    heuristic for b with 200+ items), find_longest_match,
//                    get_matching_blocks, get_opcodes, get_grouped_opcodes
//                    (a generator that mutates the cached opcodes list,
//                    exactly as CPython does), ratio, quick_ratio,
//                    real_quick_ratio
//   get_close_matches (heapq.nlargest semantics), Differ (compare,
//   _fancy_replace, _qformat with _keep_original_ws), ndiff, restore,
//   IS_LINE_JUNK, IS_CHARACTER_JUNK, unified_diff, context_diff,
//   diff_bytes (ascii/surrogateescape round trip)
//
// Python value model: a str sequence is compared by code points (Array.from),
// a list is a JS Array; lines and characters are JS strings, ints are JS
// numbers (callers keep them in the safe range), bytes are PyBytes (one
// char per byte, 0..255). Generators are JS generators, consumed lazily like
// CPython's, so errors surface at the same point.

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { fromLiteral } from '../../../../py-num.js';

const raise = (type, msg = '') => { throw new PyException(type, msg); };

// Work that would freeze the page is stopped — not a Python exception.
export function demoLimit(msg) {
  const e = new Error(msg);
  e.name = 'DemoLimit';
  throw e;
}
const MAX_ITEMS = 20000;        // elements per sequence
// inner-loop steps per demo evaluation: about a second of work in V8
const DEFAULT_STEPS = 12000000;
let maxSteps = DEFAULT_STEPS;
let steps = 0;
export function resetBudget(max = DEFAULT_STEPS) { steps = 0; maxSteps = max; }
function tick(n = 1) {
  steps += n;
  if (steps > maxSteps) demoLimit('the browser demo stops after 12 million comparison steps (CPython would keep going)');
}

// ─── Python str helpers ───────────────────────────────────────────────

// str.isspace() / re \s for str patterns (Py_UNICODE_ISSPACE, Unicode 15.1)
const SPACE = new Set([0x9, 0xa, 0xb, 0xc, 0xd, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x85, 0xa0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000]);
export const isSpace = (ch) => ch.length > 0 && Array.from(ch).every((c) => SPACE.has(c.codePointAt(0)));
const isSpaceCp = (c) => SPACE.has(c.codePointAt(0));

export const cps = (s) => Array.from(s);

export function pyRstrip(s) {
  const a = cps(s);
  let n = a.length;
  while (n > 0 && isSpaceCp(a[n - 1])) n -= 1;
  return a.slice(0, n).join('');
}

// str.splitlines(keepends) — the line boundaries of Objects/unicodeobject.c
const LINE_BREAKS = new Set(['\n', '\r', '\x0b', '\x0c', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029']);
export function splitlines(s, keepends = false) {
  const a = cps(s);
  const out = [];
  let i = 0;
  let start = 0;
  while (i < a.length) {
    if (LINE_BREAKS.has(a[i])) {
      let eol = i + 1;
      if (a[i] === '\r' && a[i + 1] === '\n') eol = i + 2;
      out.push(a.slice(start, keepends ? eol : i).join(''));
      start = eol;
      i = eol;
    } else i += 1;
  }
  if (start < a.length) out.push(a.slice(start).join(''));
  return out;
}

// Python str ordering: by code point (JS < compares UTF-16 code units)
export function cmpStr(x, y) {
  const a = cps(x);
  const b = cps(y);
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const d = a[i].codePointAt(0) - b[i].codePointAt(0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return a.length === b.length ? 0 : a.length < b.length ? -1 : 1;
}

// ─── sequences, indexing and slicing with Python semantics ───────────

// A str is a sequence of code points; an Array is a list.
function asSeq(x) {
  if (typeof x === 'string') return { items: cps(x), kind: 'string' };
  if (Array.isArray(x)) return { items: x, kind: 'list' };
  if (x instanceof PyBytes) return { items: x.ints(), kind: 'bytes' };
  raise('TypeError', 'unsupported sequence');
  return null;
}

function at(items, kind, i) {
  let k = i;
  if (k < 0) k += items.length;
  if (k < 0 || k >= items.length) raise('IndexError', `${kind === 'string' ? 'string' : kind === 'bytes' ? 'index' : 'list'} index out of range`);
  return items[k];
}

// seq[start:stop] for int bounds
export function pySlice(items, start, stop) {
  const n = items.length;
  let s = start;
  let e = stop;
  if (s < 0) { s += n; if (s < 0) s = 0; } else if (s > n) s = n;
  if (e < 0) { e += n; if (e < 0) e = 0; } else if (e > n) e = n;
  return e > s ? items.slice(s, e) : [];
}

// ─── Match namedtuple and opcode tuples (Python repr) ────────────────

export class Match {
  constructor(a, b, size) { this.a = a; this.b = b; this.size = size; }
  toPy() { return { __pyRaw: `Match(a=${this.a}, b=${this.b}, size=${this.size})` }; }
}
export const opcodeToPy = (op) => ({ __pyTuple: op.slice() });

function calculateRatio(matches, length) {
  if (length) return (2.0 * matches) / length;
  return 1.0;
}

// ─── SequenceMatcher ─────────────────────────────────────────────────

export class SequenceMatcher {
  // isjunk: null or a JS function element → truthy
  constructor(isjunk = null, a = '', b = '', autojunk = true) {
    this.isjunk = isjunk;
    this.a = this.b = null;
    this.aRaw = this.bRaw = undefined;
    this.autojunk = autojunk;
    this.set_seqs(a, b);
  }

  set_seqs(a, b) {
    this.set_seq1(a);
    this.set_seq2(b);
  }

  set_seq1(a) {
    if (a === this.aRaw && typeof a !== 'string') return;   // `a is self.a`
    const s = asSeq(a);
    if (s.items.length > MAX_ITEMS) demoLimit(`the browser demo compares sequences of up to ${MAX_ITEMS.toLocaleString('en-US')} items`);
    this.aRaw = a;
    this.a = s.items;
    this.aKind = s.kind;
    this.matching_blocks = this.opcodes = null;
  }

  set_seq2(b) {
    if (b === this.bRaw && typeof b !== 'string') return;   // `b is self.b`
    const s = asSeq(b);
    if (s.items.length > MAX_ITEMS) demoLimit(`the browser demo compares sequences of up to ${MAX_ITEMS.toLocaleString('en-US')} items`);
    this.bRaw = b;
    this.b = s.items;
    this.bKind = s.kind;
    this.matching_blocks = this.opcodes = null;
    this.fullbcount = null;
    this.chainB();
  }

  chainB() {
    const b = this.b;
    const b2j = new Map();
    this.b2j = b2j;
    b.forEach((elt, i) => {
      if (Array.isArray(elt)) raise('TypeError', "unhashable type: 'list'");
      let indices = b2j.get(elt);
      if (!indices) { indices = []; b2j.set(elt, indices); }
      indices.push(i);
    });
    tick(b.length);

    // Purge junk elements
    const junk = new Set();
    this.bjunk = junk;
    const isjunk = this.isjunk;
    if (isjunk) {
      for (const elt of b2j.keys()) if (isjunk(elt)) junk.add(elt);
      for (const elt of junk) b2j.delete(elt);
    }

    // Purge popular elements that are not junk
    const popular = new Set();
    this.bpopular = popular;
    const n = b.length;
    if (this.autojunk && n >= 200) {
      const ntest = Math.floor(n / 100) + 1;
      for (const [elt, idxs] of b2j) if (idxs.length > ntest) popular.add(elt);
      for (const elt of popular) b2j.delete(elt);
    }
  }

  find_longest_match(alo = 0, ahi = null, blo = 0, bhi = null) {
    const { a, b, b2j, aKind, bKind } = this;
    const isbjunk = (x) => this.bjunk.has(x);
    if (ahi === null) ahi = a.length;
    if (bhi === null) bhi = b.length;
    let besti = alo;
    let bestj = blo;
    let bestsize = 0;
    let j2len = new Map();
    const nothing = [];
    for (let i = alo; i < ahi; i += 1) {
      const newj2len = new Map();
      const ai = at(a, aKind, i);
      if (Array.isArray(ai)) raise('TypeError', "unhashable type: 'list'");
      const js = b2j.get(ai) || nothing;
      tick(1 + js.length);
      for (const j of js) {
        if (j < blo) continue;
        if (j >= bhi) break;
        const k = (j2len.get(j - 1) || 0) + 1;
        newj2len.set(j, k);
        if (k > bestsize) {
          besti = i - k + 1;
          bestj = j - k + 1;
          bestsize = k;
        }
      }
      j2len = newj2len;
    }

    // Extend the best by non-junk elements on each end
    while (besti > alo && bestj > blo
      && !isbjunk(at(b, bKind, bestj - 1))
      && at(a, aKind, besti - 1) === at(b, bKind, bestj - 1)) {
      besti -= 1; bestj -= 1; bestsize += 1; tick();
    }
    while (besti + bestsize < ahi && bestj + bestsize < bhi
      && !isbjunk(at(b, bKind, bestj + bestsize))
      && at(a, aKind, besti + bestsize) === at(b, bKind, bestj + bestsize)) {
      bestsize += 1; tick();
    }

    // ... then suck up matching junk on each side
    while (besti > alo && bestj > blo
      && isbjunk(at(b, bKind, bestj - 1))
      && at(a, aKind, besti - 1) === at(b, bKind, bestj - 1)) {
      besti -= 1; bestj -= 1; bestsize += 1; tick();
    }
    while (besti + bestsize < ahi && bestj + bestsize < bhi
      && isbjunk(at(b, bKind, bestj + bestsize))
      && at(a, aKind, besti + bestsize) === at(b, bKind, bestj + bestsize)) {
      bestsize += 1; tick();
    }

    return new Match(besti, bestj, bestsize);
  }

  get_matching_blocks() {
    if (this.matching_blocks !== null) return this.matching_blocks;
    const la = this.a.length;
    const lb = this.b.length;
    const queue = [[0, la, 0, lb]];
    const matchingBlocks = [];
    while (queue.length) {
      const [alo, ahi, blo, bhi] = queue.pop();
      const x = this.find_longest_match(alo, ahi, blo, bhi);
      const { a: i, b: j, size: k } = x;
      if (k) {
        matchingBlocks.push([i, j, k]);
        if (alo < i && blo < j) queue.push([alo, i, blo, j]);
        if (i + k < ahi && j + k < bhi) queue.push([i + k, ahi, j + k, bhi]);
      }
    }
    matchingBlocks.sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]) || (p[2] - q[2]));

    let i1 = 0;
    let j1 = 0;
    let k1 = 0;
    const nonAdjacent = [];
    for (const [i2, j2, k2] of matchingBlocks) {
      if (i1 + k1 === i2 && j1 + k1 === j2) {
        k1 += k2;
      } else {
        if (k1) nonAdjacent.push([i1, j1, k1]);
        i1 = i2; j1 = j2; k1 = k2;
      }
    }
    if (k1) nonAdjacent.push([i1, j1, k1]);
    nonAdjacent.push([la, lb, 0]);
    this.matching_blocks = nonAdjacent.map(([p, q, r]) => new Match(p, q, r));
    return this.matching_blocks;
  }

  // opcodes are mutable arrays [tag, i1, i2, j1, j2] (CPython: tuples in a
  // cached list that get_grouped_opcodes rewrites in place)
  get_opcodes() {
    if (this.opcodes !== null) return this.opcodes;
    let i = 0;
    let j = 0;
    const answer = [];
    this.opcodes = answer;
    for (const { a: ai, b: bj, size } of this.get_matching_blocks()) {
      let tag = '';
      if (i < ai && j < bj) tag = 'replace';
      else if (i < ai) tag = 'delete';
      else if (j < bj) tag = 'insert';
      if (tag) answer.push([tag, i, ai, j, bj]);
      i = ai + size;
      j = bj + size;
      if (size) answer.push(['equal', ai, i, bj, j]);
    }
    return answer;
  }

  * get_grouped_opcodes(n = 3) {
    let codes = this.get_opcodes();
    if (!codes.length) codes = [['equal', 0, 1, 0, 1]];
    if (codes[0][0] === 'equal') {
      const [tag, i1, i2, j1, j2] = codes[0];
      codes[0] = [tag, Math.max(i1, i2 - n), i2, Math.max(j1, j2 - n), j2];
    }
    if (codes[codes.length - 1][0] === 'equal') {
      const [tag, i1, i2, j1, j2] = codes[codes.length - 1];
      codes[codes.length - 1] = [tag, i1, Math.min(i2, i1 + n), j1, Math.min(j2, j1 + n)];
    }
    const nn = n + n;
    let group = [];
    for (const code of codes) {
      let [tag, i1, i2, j1, j2] = code;   // eslint-disable-line prefer-const
      if (tag === 'equal' && i2 - i1 > nn) {
        group.push([tag, i1, Math.min(i2, i1 + n), j1, Math.min(j2, j1 + n)]);
        yield group;
        group = [];
        i1 = Math.max(i1, i2 - n);
        j1 = Math.max(j1, j2 - n);
      }
      group.push([tag, i1, i2, j1, j2]);
    }
    if (group.length && !(group.length === 1 && group[0][0] === 'equal')) yield group;
  }

  ratio() {
    const matches = this.get_matching_blocks().reduce((acc, m) => acc + m.size, 0);
    return calculateRatio(matches, this.a.length + this.b.length);
  }

  quick_ratio() {
    if (this.fullbcount === null) {
      const fullbcount = new Map();
      this.fullbcount = fullbcount;
      for (const elt of this.b) fullbcount.set(elt, (fullbcount.get(elt) || 0) + 1);
    }
    const fullbcount = this.fullbcount;
    const avail = new Map();
    let matches = 0;
    for (const elt of this.a) {
      const numb = avail.has(elt) ? avail.get(elt) : (fullbcount.get(elt) || 0);
      avail.set(elt, numb - 1);
      if (numb > 0) matches += 1;
    }
    tick(this.a.length + this.b.length);
    return calculateRatio(matches, this.a.length + this.b.length);
  }

  real_quick_ratio() {
    const la = this.a.length;
    const lb = this.b.length;
    return calculateRatio(Math.min(la, lb), la + lb);
  }
}

// ─── get_close_matches ───────────────────────────────────────────────

// n: { int: bigint } | { float: number } (the Python value of the literal);
// cutoff: a JS number (a Python float).
export function get_close_matches(word, possibilities, n = { int: 3n }, cutoff = 0.6) {
  const nRepr = n.int !== undefined ? String(n.int) : pyFloatRepr(n.float);
  const nPos = n.int !== undefined ? n.int > 0n : n.float > 0;
  if (!nPos) raise('ValueError', `n must be > 0: ${nRepr}`);
  if (!(cutoff >= 0.0 && cutoff <= 1.0)) raise('ValueError', `cutoff must be in [0.0, 1.0]: ${pyFloatRepr(cutoff)}`);
  const result = [];
  const s = new SequenceMatcher();
  s.set_seq2(word);
  for (const x of possibilities) {
    tick();
    s.set_seq1(x);
    if (s.real_quick_ratio() >= cutoff && s.quick_ratio() >= cutoff && s.ratio() >= cutoff) {
      result.push([s.ratio(), x]);
    }
  }
  // heapq.nlargest(n, result): n == 1 (also 1.0) → max(); n >= len →
  // sorted(...)[:n] (a float n fails at that slice); otherwise the heap
  // path (a float n fails at range(0, -n, -1)), whose values are those of
  // sorted(result, reverse=True)[:n]
  const desc = (p, q) => (q[0] - p[0]) || cmpStr(q[1], p[1]);
  let best;
  if (n.int === 1n || n.float === 1) {
    best = result.length ? [result.slice().sort(desc)[0]] : [];
  } else if (n.float !== undefined) {
    if (n.float >= result.length) raise('TypeError', 'slice indices must be integers or None or have an __index__ method');
    raise('TypeError', "'float' object cannot be interpreted as an integer");
  } else {
    best = result.slice().sort(desc).slice(0, n.int > BigInt(result.length) ? result.length : Number(n.int));
  }
  return best.map(([, x]) => x);
}

// ─── junk filters ────────────────────────────────────────────────────

// re.compile(r"\s*(?:#\s*)?$").match(line) is not None
export function IS_LINE_JUNK(line) {
  const a = cps(line);
  let i = 0;
  while (i < a.length && isSpaceCp(a[i])) i += 1;
  if (a[i] === '#') {
    i += 1;
    while (i < a.length && isSpaceCp(a[i])) i += 1;
  }
  return i === a.length;
}

// ch in ws — a substring test, so '' and ' \t' are junk too
export function IS_CHARACTER_JUNK(ch, ws = ' \t') {
  return ws.includes(ch);
}

// ─── Differ / ndiff / restore ────────────────────────────────────────

function keepOriginalWs(s, tagS) {
  const a = cps(s);
  const t = cps(tagS);
  const n = Math.min(a.length, t.length);
  let out = '';
  for (let i = 0; i < n; i += 1) out += (t[i] === ' ' && isSpaceCp(a[i])) ? a[i] : t[i];
  return out;
}

// '%s' % x
const pyStr = (x) => (typeof x === 'string' ? x : pyAnyRepr(x));

export class Differ {
  constructor(linejunk = null, charjunk = null) {
    this.linejunk = linejunk;
    this.charjunk = charjunk;
  }

  * compare(a, b) {
    const cruncher = new SequenceMatcher(this.linejunk, a, b);
    for (const [tag, alo, ahi, blo, bhi] of cruncher.get_opcodes()) {
      if (tag === 'replace') yield* this.fancyReplace(a, alo, ahi, b, blo, bhi);
      else if (tag === 'delete') yield* this.dump('-', a, alo, ahi);
      else if (tag === 'insert') yield* this.dump('+', b, blo, bhi);
      else yield* this.dump(' ', a, alo, ahi);
    }
  }

  * dump(tag, x, lo, hi) {
    for (let i = lo; i < hi; i += 1) yield `${tag} ${pyStr(x[i])}`;
  }

  * plainReplace(a, alo, ahi, b, blo, bhi) {
    if (bhi - blo < ahi - alo) {
      yield* this.dump('+', b, blo, bhi);
      yield* this.dump('-', a, alo, ahi);
    } else {
      yield* this.dump('-', a, alo, ahi);
      yield* this.dump('+', b, blo, bhi);
    }
  }

  * fancyReplace(a, alo, ahi, b, blo, bhi) {
    let bestRatio = 0.74;
    const cutoff = 0.75;
    const cruncher = new SequenceMatcher(this.charjunk);
    let eqi = null;
    let eqj = null;
    let bestI;
    let bestJ;
    for (let j = blo; j < bhi; j += 1) {
      const bj = b[j];
      cruncher.set_seq2(bj);
      for (let i = alo; i < ahi; i += 1) {
        tick();
        const ai = a[i];
        if (ai === bj) {
          if (eqi === null) { eqi = i; eqj = j; }
          continue;
        }
        cruncher.set_seq1(ai);
        if (cruncher.real_quick_ratio() > bestRatio
          && cruncher.quick_ratio() > bestRatio
          && cruncher.ratio() > bestRatio) {
          bestRatio = cruncher.ratio();
          bestI = i;
          bestJ = j;
        }
      }
    }
    if (bestRatio < cutoff) {
      if (eqi === null) {
        yield* this.plainReplace(a, alo, ahi, b, blo, bhi);
        return;
      }
      bestI = eqi; bestJ = eqj; bestRatio = 1.0;
    } else {
      eqi = null;
    }

    yield* this.fancyHelper(a, alo, bestI, b, blo, bestJ);

    const aelt = a[bestI];
    const belt = b[bestJ];
    if (eqi === null) {
      let atags = '';
      let btags = '';
      cruncher.set_seqs(aelt, belt);
      for (const [tag, ai1, ai2, bj1, bj2] of cruncher.get_opcodes()) {
        const la = ai2 - ai1;
        const lb = bj2 - bj1;
        if (tag === 'replace') { atags += '^'.repeat(la); btags += '^'.repeat(lb); }
        else if (tag === 'delete') atags += '-'.repeat(la);
        else if (tag === 'insert') btags += '+'.repeat(lb);
        else { atags += ' '.repeat(la); btags += ' '.repeat(lb); }
      }
      yield* this.qformat(aelt, belt, atags, btags);
    } else {
      yield '  ' + aelt;
    }

    yield* this.fancyHelper(a, bestI + 1, ahi, b, bestJ + 1, bhi);
  }

  * fancyHelper(a, alo, ahi, b, blo, bhi) {
    if (alo < ahi) {
      if (blo < bhi) yield* this.fancyReplace(a, alo, ahi, b, blo, bhi);
      else yield* this.dump('-', a, alo, ahi);
    } else if (blo < bhi) {
      yield* this.dump('+', b, blo, bhi);
    }
  }

  * qformat(aline, bline, atags, btags) {
    const at2 = pyRstrip(keepOriginalWs(aline, atags));
    const bt2 = pyRstrip(keepOriginalWs(bline, btags));
    yield '- ' + aline;
    if (at2) yield `? ${at2}\n`;
    yield '+ ' + bline;
    if (bt2) yield `? ${bt2}\n`;
  }
}

export function ndiff(a, b, linejunk = null, charjunk = IS_CHARACTER_JUNK) {
  return new Differ(linejunk, charjunk).compare(a, b);
}

// which: { int: bigint } | { float: number } (the Python value of the literal)
export function* restore(delta, which) {
  const w = which.int !== undefined ? which.int : (Number.isFinite(which.float) ? BigInt(Math.trunc(which.float)) : null);
  let tag;
  if (w === 1n) tag = '- ';
  else if (w === 2n) tag = '+ ';
  else raise('ValueError', `unknown delta choice (must be 1 or 2): ${which.int !== undefined ? String(which.int) : pyFloatRepr(which.float)}`);
  for (const line of delta) {
    const head = cps(line).slice(0, 2).join('');
    if (head === '  ' || head === tag) yield cps(line).slice(2).join('');
  }
}

// ─── unified_diff / context_diff ─────────────────────────────────────

function formatRangeUnified(start, stop) {
  let beginning = start + 1;
  const length = stop - start;
  if (length === 1) return `${beginning}`;
  if (!length) beginning -= 1;
  return `${beginning},${length}`;
}

function formatRangeContext(start, stop) {
  let beginning = start + 1;
  const length = stop - start;
  if (!length) beginning -= 1;
  if (length <= 1) return `${beginning}`;
  return `${beginning},${beginning + length - 1}`;
}

// type(x).__name__ and repr(x) for the values the engine handles
function pyTypeName(x) {
  if (typeof x === 'string') return 'str';
  if (x instanceof PyBytes) return 'bytes';
  if (typeof x === 'boolean') return 'bool';
  if (typeof x === 'bigint') return 'int';
  if (typeof x === 'number') return Number.isSafeInteger(x) ? 'int' : 'float';   // ints stay in the safe range
  if (Array.isArray(x)) return 'list';
  if (x === null || x === undefined) return 'NoneType';
  return 'object';
}
function pyAnyRepr(x) {
  if (typeof x === 'string') return pyStrRepr(x);
  if (x instanceof PyBytes) return bytesRepr(x.s);
  if (typeof x === 'boolean') return x ? 'True' : 'False';
  if (typeof x === 'bigint') return String(x);
  if (typeof x === 'number') return Number.isSafeInteger(x) ? String(x) : pyFloatRepr(x);
  if (Array.isArray(x)) return `[${x.map(pyAnyRepr).join(', ')}]`;
  if (x === null || x === undefined) return 'None';
  return String(x);
}

function checkTypes(a, b, ...args) {
  if (a.length && typeof a[0] !== 'string') raise('TypeError', `lines to compare must be str, not ${pyTypeName(a[0])} (${pyAnyRepr(a[0])})`);
  if (b.length && typeof b[0] !== 'string') raise('TypeError', `lines to compare must be str, not ${pyTypeName(b[0])} (${pyAnyRepr(b[0])})`);
  for (const arg of args) if (typeof arg !== 'string') raise('TypeError', `all arguments must be str, not: ${pyAnyRepr(arg)}`);
}

// The Python value of a context-size literal, as a JS number that gives
// the same output: CPython never prints n, it only compares and adds it, so
// any n at least as large as both sequences behaves like that size (also
// for a float literal such as 1e+21). A negative n is reproduced while the
// arithmetic stays exact.
export function contextN(n, la, lb) {
  const v = typeof n === 'object' && n !== null ? n : fromLiteral(n);
  const cap = Math.max(la, lb, 1) + 2;
  if (v.int !== undefined) {
    if (v.int > BigInt(cap)) return cap;
    if (v.int < -1000000n) demoLimit('a negative n this large is not reproduced in the browser');
    return Number(v.int);
  }
  if (v.float > cap) return cap;
  demoLimit('a float n smaller than the inputs is not reproduced in the browser');
  return 0;
}

// prefix + line: str + str only, like CPython
function cat(prefix, line) {
  if (typeof line !== 'string') raise('TypeError', `can only concatenate str (not "${pyTypeName(line)}") to str`);
  return prefix + line;
}
// a str argument is a sequence of code points (3.13 diffs its characters)
const linesOf = (x) => (typeof x === 'string' ? cps(x) : x);

export function* unified_diff(a, b, fromfile = '', tofile = '', fromfiledate = '', tofiledate = '', n = 3, lineterm = '\n') {
  checkTypes(a, b, fromfile, tofile, fromfiledate, tofiledate, lineterm);
  const seqA = linesOf(a);
  const seqB = linesOf(b);
  let started = false;
  for (const group of new SequenceMatcher(null, a, b).get_grouped_opcodes(n)) {
    if (!started) {
      started = true;
      const fromdate = fromfiledate ? `\t${fromfiledate}` : '';
      const todate = tofiledate ? `\t${tofiledate}` : '';
      yield `--- ${fromfile}${fromdate}${lineterm}`;
      yield `+++ ${tofile}${todate}${lineterm}`;
    }
    const first = group[0];
    const last = group[group.length - 1];
    const file1Range = formatRangeUnified(first[1], last[2]);
    const file2Range = formatRangeUnified(first[3], last[4]);
    yield `@@ -${file1Range} +${file2Range} @@${lineterm}`;
    for (const [tag, i1, i2, j1, j2] of group) {
      if (tag === 'equal') {
        for (const line of pySlice(seqA, i1, i2)) yield cat(' ', line);
        continue;
      }
      if (tag === 'replace' || tag === 'delete') for (const line of pySlice(seqA, i1, i2)) yield cat('-', line);
      if (tag === 'replace' || tag === 'insert') for (const line of pySlice(seqB, j1, j2)) yield cat('+', line);
    }
  }
}

export function* context_diff(a, b, fromfile = '', tofile = '', fromfiledate = '', tofiledate = '', n = 3, lineterm = '\n') {
  checkTypes(a, b, fromfile, tofile, fromfiledate, tofiledate, lineterm);
  const seqA = linesOf(a);
  const seqB = linesOf(b);
  const prefix = { insert: '+ ', delete: '- ', replace: '! ', equal: '  ' };
  let started = false;
  for (const group of new SequenceMatcher(null, a, b).get_grouped_opcodes(n)) {
    if (!started) {
      started = true;
      const fromdate = fromfiledate ? `\t${fromfiledate}` : '';
      const todate = tofiledate ? `\t${tofiledate}` : '';
      yield `*** ${fromfile}${fromdate}${lineterm}`;
      yield `--- ${tofile}${todate}${lineterm}`;
    }
    const first = group[0];
    const last = group[group.length - 1];
    yield '***************' + lineterm;
    yield `*** ${formatRangeContext(first[1], last[2])} ****${lineterm}`;
    if (group.some(([tag]) => tag === 'replace' || tag === 'delete')) {
      for (const [tag, i1, i2] of group) {
        if (tag !== 'insert') for (const line of pySlice(seqA, i1, i2)) yield cat(prefix[tag], line);
      }
    }
    yield `--- ${formatRangeContext(first[3], last[4])} ----${lineterm}`;
    if (group.some(([tag]) => tag === 'replace' || tag === 'insert')) {
      for (const [tag, , , j1, j2] of group) {
        if (tag !== 'delete') for (const line of pySlice(seqB, j1, j2)) yield cat(prefix[tag], line);
      }
    }
  }
}

// ─── bytes and diff_bytes ────────────────────────────────────────────

// Python bytes: a JS string with one char (0..255) per byte.
export class PyBytes {
  constructor(latin1) { this.s = latin1; }
  ints() { return Array.from(this.s, (c) => c.charCodeAt(0)); }
  split(sep) { return this.s.split(sep.s).map((x) => new PyBytes(x)); }
  toPy() { return { __pyRaw: bytesRepr(this.s) }; }
  static utf8(str) {
    if (/[\uD800-\uDFFF]/u.test(str)) {   // with the u flag: lone surrogates only
      demoLimit('a lone surrogate cannot be encoded to UTF-8 (CPython raises UnicodeEncodeError)');
    }
    const u8 = new TextEncoder().encode(str);
    let s = '';
    for (const x of u8) s += String.fromCharCode(x);
    return new PyBytes(s);
  }
}

export function bytesRepr(s) {
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = 'b' + q;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (ch === '\\') out += '\\\\';
    else if (ch === q) out += '\\' + q;
    else if (ch === '\t') out += '\\t';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (c < 0x20 || c >= 0x7f) out += '\\x' + c.toString(16).padStart(2, '0');
    else out += ch;
  }
  return out + q;
}

// bytes.decode('ascii', 'surrogateescape') and back
const decodeSE = (bs) => {
  if (!(bs instanceof PyBytes)) raise('TypeError', `all arguments must be bytes, not ${pyTypeName(bs)} (${pyAnyRepr(bs)})`);
  let s = '';
  for (const ch of bs.s) {
    const c = ch.charCodeAt(0);
    s += c < 0x80 ? ch : String.fromCharCode(0xdc00 + c);
  }
  return s;
};
const encodeSE = (s) => {
  let out = '';
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    if (c < 0x80) out += s[i];
    else if (c >= 0xdc80 && c <= 0xdcff) out += String.fromCharCode(c - 0xdc00);
    else raise('UnicodeEncodeError', 'not representable');
  }
  return new PyBytes(out);
};

export function* diff_bytes(dfunc, a, b, fromfile = new PyBytes(''), tofile = new PyBytes(''), fromfiledate = new PyBytes(''), tofiledate = new PyBytes(''), n = 3, lineterm = new PyBytes('\n')) {
  const da = a.map(decodeSE);
  const db = b.map(decodeSE);
  const lines = dfunc(da, db, decodeSE(fromfile), decodeSE(tofile), decodeSE(fromfiledate), decodeSE(tofiledate), n, decodeSE(lineterm));
  for (const line of lines) yield encodeSE(line);
}

// ─── demo helpers ────────────────────────────────────────────────────

// The Python value of a 'number' demo input as written in the code.
export const literal = (n) => fromLiteral(n);

// A small int argument for index-like parameters (find_longest_match
// bounds): reproduced exactly within ±10**9.
export function smallInt(n) {
  const v = fromLiteral(n);
  if (v.int === undefined || v.int > 1000000000n || v.int < -1000000000n) {
    demoLimit('the browser demo takes index arguments between -1,000,000,000 and 1,000,000,000');
  }
  return Number(v.int);
}

// list(...) of a generator, with the work budget reset
export function run(fn) {
  resetBudget();
  return fn();
}
export const list = (gen) => [...gen];
