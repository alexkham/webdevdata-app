// utils/emulators/python/stdlib/xml-etree-elementtree/_pyet.js
//
// Port of CPython 3.13's xml.etree.ElementTree for the demos — shared by
// the module hub and member emulators. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
//   Parser     a port of the expat 2.7 code paths ElementTree uses
//              (xmltok_impl.c tokenizers, xmlrole.c prolog states,
//              xmlparse.c doProlog / doContent / storeAtts / addBinding /
//              epilogProcessor), namespace-aware with '}' as separator,
//              driven like the C XMLParser of Modules/_elementtree.c:
//              feed(str) once, then close(). Error codes, messages and
//              positions (line from 1, column from 0, in characters) are
//              expat's. Fuzzed against CPython (see the module report).
//              Not emulated → EmulatorLimit: DOCTYPE / DTDs (and so
//              entities other than the five predefined ones), a declared
//              encoding other than UTF-8, and a document whose first or
//              second character is NUL (expat's UTF-16 auto-detection).
//   TreeBuilder / XMLPullParser events — Modules/_elementtree.c semantics
//              (text and tail joined, comments and PIs dropped unless
//              insert_comments / insert_pis, events start, end, start-ns,
//              end-ns, comment, pi).
//   Element    the C Element's behaviour (keys()/items() return lists,
//              error messages of Modules/_elementtree.c).
//   ElementPath  Lib/xml/etree/ElementPath.py line by line, plus the C
//              fast path of find/findtext/findall for plain tag names.
//   Serializer  Lib/xml/etree/ElementTree.py: _namespaces, _serialize_xml,
//              _serialize_html, _serialize_text, the escaping helpers,
//              tostring/tostringlist/write output, indent(), and the C14N 2.0
//              writer (canonicalize / C14NWriterTarget).
//
// Value model: a parsed or built tree is made of Element objects; tags are
// str, or the COMMENT / PI sentinels (Python's Comment and
// ProcessingInstruction factory functions), or QName objects. attrib is a
// Map (insertion-ordered, like a dict).

import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export const limit = (msg) => { throw new PyException('EmulatorLimit', msg); };
const raise = (type, msg) => { throw new PyException(type, msg); };

// An integer demo argument as Python sees it: the demo writes the JS number
// with String(), so 1e21 and beyond reach Python as a float literal, and an
// int outside Py_ssize_t makes CPython's index conversions fail.
const SSIZE_MAX = 2n ** 63n - 1n;
const intArgKind = (n) => {
  const s = String(n);
  if (/[e.]/i.test(s) || !Number.isFinite(n)) return 'float';
  const b = BigInt(s);
  return b > SSIZE_MAX || b < -SSIZE_MAX - 1n ? 'big' : 'int';
};

// ─────────────────────────────────────────────────────────────
// expat: character classes
// ─────────────────────────────────────────────────────────────

// byte types of xmltok's namespace-aware UTF-8 encoding (asciitab.h with
// ':' as BT_COLON). Every non-ASCII code point is one BT_LEAD unit here:
// expat counts columns in characters, so a code point array matches it.
const BT_NONXML = 0, BT_LT = 2, BT_AMP = 3, BT_RSQB = 4, BT_LEAD = 5, BT_CR = 9, BT_LF = 10,
  BT_GT = 11, BT_QUOT = 12, BT_APOS = 13, BT_EQUALS = 14, BT_QUEST = 15, BT_EXCL = 16, BT_SOL = 17,
  BT_SEMI = 18, BT_NUM = 19, BT_LSQB = 20, BT_S = 21, BT_NMSTRT = 22, BT_COLON = 23, BT_HEX = 24,
  BT_DIGIT = 25, BT_NAME = 26, BT_MINUS = 27, BT_OTHER = 28, BT_PERCNT = 30, BT_LPAR = 31,
  BT_RPAR = 32, BT_AST = 33, BT_PLUS = 34, BT_COMMA = 35, BT_VERBAR = 36;

let ASCII = null;
function asciiTypes() {
  const t = new Uint8Array(128).fill(BT_NONXML);
  const set = (chars, ty) => { for (const c of chars) t[c.charCodeAt(0)] = ty; };
  t[9] = BT_S; t[10] = BT_LF; t[13] = BT_CR; t[32] = BT_S; t[0x7f] = BT_OTHER;
  set('$@\\^`{}~', BT_OTHER);
  set('!', BT_EXCL); set('"', BT_QUOT); set('#', BT_NUM); set('%', BT_PERCNT); set('&', BT_AMP);
  set("'", BT_APOS); set('(', BT_LPAR); set(')', BT_RPAR); set('*', BT_AST); set('+', BT_PLUS);
  set(',', BT_COMMA); set('-', BT_MINUS); set('.', BT_NAME); set('/', BT_SOL);
  set('0123456789', BT_DIGIT); set(':', BT_COLON); set(';', BT_SEMI); set('<', BT_LT);
  set('=', BT_EQUALS); set('>', BT_GT); set('?', BT_QUEST); set('ABCDEFabcdef', BT_HEX);
  set('GHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz_', BT_NMSTRT);
  set('[', BT_LSQB); set(']', BT_RSQB); set('|', BT_VERBAR);
  return t;
}

// Non-ASCII name characters of expat (its nametab.h: XML 1.0 4th edition
// Letter / Digit / CombiningChar / Extender; astral characters are never
// name characters). Read off CPython's pyexpat, BMP code point by code
// point, as ranges: base-36 "gap.length" pairs (gap from the previous
// range's end), decoded on first use.
const NMSTRT_RANGES = '5c.m,2.u,2.1l,3.a,3.7,2.1g,2.1v,a.z,4.1,5.t,1l.2g,j.6,5h,2.2,2,2.j,2.17,2.6,4,2,2,2,2.h,e.b,2.1t,2.b,2.z,f.1g,3.1,3.1,4.r,3.7,3.1,1k.11,3,8.11,22.q,6.2,1b.p,7.9,13.1y,3.4,2.e,2.3,2,g.1,f3.1g,4,r.9,10.7,3.1,3.l,2.6,2,4.3,z.1,2.2,f.1,k.5,5.1,3.l,2.6,2.1,2.1,2.1,w.3,2,k.2,h.6,2,2.2,2.l,2.6,2.1,2.4,4,z,11.7,3.1,3.l,2.6,2.1,3.3,4,v.1,2.2,10.5,4.2,2.3,4.1,2,2.1,4.1,4.2,4.7,2.2,24.7,2.2,2.m,2.9,2.4,13.1,10.7,2.2,2.m,2.9,2.4,11,2.1,10.7,2.2,2.m,2.f,13.1,4g.19,2,2.1,d.5,1o.1,2,3.1,2,3,7.3,2.6,2.2,2,2,3.1,2.1,2,2.1,a,3.4,3g.7,2.w,8n.11,b.12,a,2.1,2.2,2,2.1,2.4,16,2,2,c,2,2,4.1,4,6.2,2,2,2,2,4.1,4.1,2,15,a,3,3.1,8.1,2,2.6,15,5,9,2dj.4b,5.2h,7.l,3.5,3.11,3.5,3.7,2,2,2,2.u,3.1g,2.6,2,4.2,2.6,4.3,3.5,5.c,6.2,2.6,8a,4.1,3,2a.2,2v9,q.8,o.2b,d.2h,b.13,5p0.g4l,2fv.8mb';
const NAME_RANGES = '53,9.m,2.u,2.1l,3.a,3.7,2.1g,2.1v,a.z,4.1,5.t,1l.2g,j.6,f.1,1b.1x,r.1,11.4,2,2.j,2.17,2.6,4,2,2,2,2.h,e.b,2.1t,2.b,2.z,2.3,a.1g,3.1,3.1,4.r,3.7,3.1,1k.11,3,8.11,b.g,2.m,2.2,2,2.1,2,c.q,6.2,1b.p,6.i,e.9,7.1z,3.4,2.e,2.3,2.j,2.3,3.9,eg.2,2.1g,3.h,4.3,4.b,3.9,i.2,2.7,3.1,3.l,2.6,2,4.3,3,2.6,3.1,3.2,a,5.1,2.4,3.b,h,3.5,5.1,3.l,2.6,2.1,2.1,2.1,3,2.4,5.1,3.2,c.3,2,8.e,d.2,2.6,2,2.2,2.l,2.6,2.1,2.4,3.9,2.2,2.2,j,6.9,i.2,2.7,3.1,3.l,2.6,2.1,3.3,3.7,4.1,3.2,9.1,5.1,2.2,5.9,j.1,2.5,4.2,2.3,4.1,2,2.1,4.1,4.2,4.7,2.2,5.4,4.2,2.3,a,g.8,i.2,2.7,2.2,2.m,2.9,2.4,5.6,2.2,2.3,8.1,a.1,5.9,j.1,2.7,2.2,2.m,2.9,2.4,5.6,2.2,2.3,8.1,8,2.1,5.9,j.1,2.7,2.2,2.m,2.f,5.5,3.2,2.3,a,9.1,5.9,42.19,2.a,6.e,2.9,14.1,2,3.1,2,3,7.3,2.6,2.2,2,2,3.1,2.1,2.9,2.2,3.4,2,2.5,3.9,1r.1,7.9,c,2,2,5.9,2.w,8.j,2.5,5.5,2,2.k,4.6,2,6f.11,b.12,a,2.1,2.2,2,2.1,2.4,16,2,2,c,2,2,4.1,4,6.2,2,2,2,2,4.1,4.1,2,15,a,3,3.1,8.1,2,2.6,15,5,9,2dj.4b,5.2h,7.l,3.5,3.11,3.5,3.7,2,2,2,2.u,3.1g,2.6,2,4.2,2.6,4.3,3.5,5.c,6.2,2.6,5w.c,5,1x,4.1,3,2a.2,2v7,2,q.e,2.4,c.2b,5.1,3.1,3.2h,2.2,7.13,5p0.g4l,2fv.8mb';

function decodeRanges(text) {
  const out = [];
  let prev = 0;
  for (const part of text.split(',')) {
    const [gap, len] = part.split('.');
    const a = prev + parseInt(gap, 36);
    const b = a + (len ? parseInt(len, 36) : 0);
    out.push(a, b);
    prev = b;
  }
  return out;
}
let NMSTRT = null;
let NAMECH = null;
function inRanges(r, cp) {
  let lo = 0;
  let hi = r.length / 2 - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cp < r[2 * mid]) hi = mid - 1;
    else if (cp > r[2 * mid + 1]) lo = mid + 1;
    else return true;
  }
  return false;
}
const isInvalidCp = (cp) => cp === 0xfffe || cp === 0xffff;
const isNmstrtCp = (cp) => cp < 0x10000 && inRanges(NMSTRT, cp);
const isNameCp = (cp) => cp < 0x10000 && inRanges(NAMECH, cp);
function initTables() {
  if (ASCII) return;
  ASCII = asciiTypes();
  NMSTRT = decodeRanges(NMSTRT_RANGES);
  NAMECH = decodeRanges(NAME_RANGES);
}

// ─────────────────────────────────────────────────────────────
// expat: tokenizer (xmltok_impl.c)
// ─────────────────────────────────────────────────────────────

const T = {
  TRAILING_RSQB: -5, NONE: -4, TRAILING_CR: -3, PARTIAL_CHAR: -2, PARTIAL: -1, INVALID: 0,
  START_TAG_WITH_ATTS: 1, START_TAG_NO_ATTS: 2, EMPTY_ELEMENT_WITH_ATTS: 3, EMPTY_ELEMENT_NO_ATTS: 4,
  END_TAG: 5, DATA_CHARS: 6, DATA_NEWLINE: 7, CDATA_SECT_OPEN: 8, ENTITY_REF: 9, CHAR_REF: 10,
  PI: 11, XML_DECL: 12, COMMENT: 13, BOM: 14, PROLOG_S: 15, DECL_OPEN: 16, DECL_CLOSE: 17,
  NAME: 18, NMTOKEN: 19, POUND_NAME: 20, OR: 21, PERCENT: 22, OPEN_PAREN: 23, CLOSE_PAREN: 24,
  OPEN_BRACKET: 25, CLOSE_BRACKET: 26, LITERAL: 27, PARAM_ENTITY_REF: 28, INSTANCE_START: 29,
  NAME_QUESTION: 30, NAME_ASTERISK: 31, NAME_PLUS: 32, COND_SECT_OPEN: 33, COND_SECT_CLOSE: 34,
  CLOSE_PAREN_QUESTION: 35, CLOSE_PAREN_ASTERISK: 36, CLOSE_PAREN_PLUS: 37, COMMA: 38,
  ATTRIBUTE_VALUE_S: 39, CDATA_SECT_CLOSE: 40, PREFIXED_NAME: 41,
};

class Scanner {
  constructor(cps) {
    this.s = cps;
    this.end = cps.length;
    this.nt = 0; // *nextTokPtr
  }

  t(p) {
    const c = this.s[p];
    return c < 0x80 ? ASCII[c] : BT_LEAD;
  }

  // CHECK_NAME_CASES: 1 = a name character (advance), 0 = not one of these
  // types, -1 = XML_TOK_INVALID with nt set
  nameCase(p) {
    switch (this.t(p)) {
      case BT_NMSTRT: case BT_HEX: case BT_DIGIT: case BT_NAME: case BT_MINUS:
        return 1;
      case BT_LEAD: {
        const c = this.s[p];
        if (isInvalidCp(c) || !isNameCp(c)) { this.nt = p; return -1; }
        return 1;
      }
      default:
        return 0;
    }
  }

  // CHECK_NMSTRT_CASES
  nmstrtCase(p) {
    switch (this.t(p)) {
      case BT_NMSTRT: case BT_HEX:
        return 1;
      case BT_LEAD: {
        const c = this.s[p];
        if (isInvalidCp(c) || !isNmstrtCp(c)) { this.nt = p; return -1; }
        return 1;
      }
      default:
        return 0;
    }
  }

  // INVALID_CASES: -1 = XML_TOK_INVALID with nt set, 1 = a valid
  // non-ASCII character (advance), 0 = something else
  invalidCase(p) {
    const ty = this.t(p);
    if (ty === BT_LEAD) {
      if (isInvalidCp(this.s[p])) { this.nt = p; return -1; }
      return 1;
    }
    if (ty === BT_NONXML) { this.nt = p; return -1; }
    return 0;
  }

  // the '/' of '/>'
  sol(p, tok) {
    p += 1;
    if (p >= this.end) return T.PARTIAL;
    if (this.s[p] !== 0x3e) { this.nt = p; return T.INVALID; }
    this.nt = p + 1;
    return tok;
  }

  // p is just after '<!-'
  scanComment(p) {
    if (p < this.end) {
      if (this.s[p] !== 0x2d) { this.nt = p; return T.INVALID; }
      p += 1;
      while (p < this.end) {
        const r = this.invalidCase(p);
        if (r < 0) return T.INVALID;
        if (r > 0) { p += 1; continue; }
        if (this.t(p) === BT_MINUS) {
          p += 1;
          if (p >= this.end) return T.PARTIAL;
          if (this.s[p] === 0x2d) {
            p += 1;
            if (p >= this.end) return T.PARTIAL;
            if (this.s[p] !== 0x3e) { this.nt = p; return T.INVALID; }
            this.nt = p + 1;
            return T.COMMENT;
          }
          continue;
        }
        p += 1;
      }
    }
    return T.PARTIAL;
  }

  // p is just after '<!'
  scanDecl(p) {
    if (p >= this.end) return T.PARTIAL;
    switch (this.t(p)) {
      case BT_MINUS: return this.scanComment(p + 1);
      case BT_LSQB: this.nt = p + 1; return T.COND_SECT_OPEN;
      case BT_NMSTRT: case BT_HEX: p += 1; break;
      default: this.nt = p; return T.INVALID;
    }
    while (p < this.end) {
      switch (this.t(p)) {
        case BT_PERCNT:
          if (this.end - p < 2) return T.PARTIAL;
          switch (this.t(p + 1)) {
            case BT_S: case BT_CR: case BT_LF: case BT_PERCNT:
              this.nt = p;
              return T.INVALID;
            default:
          }
        // falls through
        case BT_S: case BT_CR: case BT_LF:
          this.nt = p;
          return T.DECL_OPEN;
        case BT_NMSTRT: case BT_HEX:
          p += 1;
          break;
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  checkPiTarget(a, b) {
    if (b - a !== 3) return T.PI;
    let upper = false;
    const [c0, c1, c2] = [this.s[a], this.s[a + 1], this.s[a + 2]];
    if (c0 === 0x58) upper = true; else if (c0 !== 0x78) return T.PI;
    if (c1 === 0x4d) upper = true; else if (c1 !== 0x6d) return T.PI;
    if (c2 === 0x4c) upper = true; else if (c2 !== 0x6c) return T.PI;
    if (upper) return 0;
    return T.XML_DECL;
  }

  // p is just after '<?'
  scanPi(p) {
    const target = p;
    if (p >= this.end) return T.PARTIAL;
    let r = this.nmstrtCase(p);
    if (r < 0) return T.INVALID;
    if (r === 0) { this.nt = p; return T.INVALID; }
    p += 1;
    while (p < this.end) {
      r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      switch (this.t(p)) {
        case BT_S: case BT_CR: case BT_LF: {
          const tok = this.checkPiTarget(target, p);
          if (tok === 0) { this.nt = p; return T.INVALID; }
          p += 1;
          while (p < this.end) {
            const r2 = this.invalidCase(p);
            if (r2 < 0) return T.INVALID;
            if (r2 > 0) { p += 1; continue; }
            if (this.t(p) === BT_QUEST) {
              p += 1;
              if (p >= this.end) return T.PARTIAL;
              if (this.s[p] === 0x3e) { this.nt = p + 1; return tok; }
              continue;
            }
            p += 1;
          }
          return T.PARTIAL;
        }
        case BT_QUEST: {
          const tok = this.checkPiTarget(target, p);
          if (tok === 0) { this.nt = p; return T.INVALID; }
          p += 1;
          if (p >= this.end) return T.PARTIAL;
          if (this.s[p] === 0x3e) { this.nt = p + 1; return tok; }
          this.nt = p;
          return T.INVALID;
        }
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  // p is just after '<!['
  scanCdataSection(p) {
    if (this.end - p < 6) return T.PARTIAL;
    const CD = [0x43, 0x44, 0x41, 0x54, 0x41, 0x5b]; // CDATA[
    for (let i = 0; i < 6; i++, p++) {
      if (this.s[p] !== CD[i]) { this.nt = p; return T.INVALID; }
    }
    this.nt = p;
    return T.CDATA_SECT_OPEN;
  }

  // p is just after '</'
  scanEndTag(p) {
    if (p >= this.end) return T.PARTIAL;
    let r = this.nmstrtCase(p);
    if (r < 0) return T.INVALID;
    if (r === 0) { this.nt = p; return T.INVALID; }
    p += 1;
    while (p < this.end) {
      r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      switch (this.t(p)) {
        case BT_S: case BT_CR: case BT_LF:
          for (p += 1; p < this.end; p += 1) {
            const ty = this.t(p);
            if (ty === BT_S || ty === BT_CR || ty === BT_LF) continue;
            if (ty === BT_GT) { this.nt = p + 1; return T.END_TAG; }
            this.nt = p;
            return T.INVALID;
          }
          return T.PARTIAL;
        case BT_COLON:
          // no need to check qname syntax here, the end tag must match exactly
          p += 1;
          break;
        case BT_GT:
          this.nt = p + 1;
          return T.END_TAG;
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  // p is just after '&#x'
  scanHexCharRef(p) {
    if (p < this.end) {
      const ty = this.t(p);
      if (ty !== BT_DIGIT && ty !== BT_HEX) { this.nt = p; return T.INVALID; }
      for (p += 1; p < this.end; p += 1) {
        const t2 = this.t(p);
        if (t2 === BT_DIGIT || t2 === BT_HEX) continue;
        if (t2 === BT_SEMI) { this.nt = p + 1; return T.CHAR_REF; }
        this.nt = p;
        return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  // p is just after '&#'
  scanCharRef(p) {
    if (p < this.end) {
      if (this.s[p] === 0x78) return this.scanHexCharRef(p + 1);
      if (this.t(p) !== BT_DIGIT) { this.nt = p; return T.INVALID; }
      for (p += 1; p < this.end; p += 1) {
        const t2 = this.t(p);
        if (t2 === BT_DIGIT) continue;
        if (t2 === BT_SEMI) { this.nt = p + 1; return T.CHAR_REF; }
        this.nt = p;
        return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  // p is just after '&'
  scanRef(p) {
    if (p >= this.end) return T.PARTIAL;
    let r = this.nmstrtCase(p);
    if (r < 0) return T.INVALID;
    if (r === 0) {
      if (this.t(p) === BT_NUM) return this.scanCharRef(p + 1);
      this.nt = p;
      return T.INVALID;
    }
    p += 1;
    while (p < this.end) {
      r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      if (this.t(p) === BT_SEMI) { this.nt = p + 1; return T.ENTITY_REF; }
      this.nt = p;
      return T.INVALID;
    }
    return T.PARTIAL;
  }

  // p is just after the start tag's name and one white space character
  // (namespace-aware: at most one ':' per attribute name)
  scanAtts(p) {
    let hadColon = false;
    while (p < this.end) {
      let r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      const ty = this.t(p);
      if (ty === BT_COLON) {
        if (hadColon) { this.nt = p; return T.INVALID; }
        hadColon = true;
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        r = this.nmstrtCase(p);
        if (r < 0) return T.INVALID;
        if (r === 0) { this.nt = p; return T.INVALID; }
        p += 1;
        continue;
      }
      if (ty === BT_S || ty === BT_CR || ty === BT_LF) {
        for (;;) {
          p += 1;
          if (p >= this.end) return T.PARTIAL;
          const t2 = this.t(p);
          if (t2 === BT_EQUALS) break;
          if (t2 === BT_S || t2 === BT_LF || t2 === BT_CR) continue;
          this.nt = p;
          return T.INVALID;
        }
      } else if (ty !== BT_EQUALS) {
        this.nt = p;
        return T.INVALID;
      }
      // at '='
      hadColon = false;
      let open;
      for (;;) {
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        open = this.t(p);
        if (open === BT_QUOT || open === BT_APOS) break;
        if (open === BT_S || open === BT_LF || open === BT_CR) continue;
        this.nt = p;
        return T.INVALID;
      }
      p += 1;
      // in attribute value
      for (;;) {
        if (p >= this.end) return T.PARTIAL;
        const t2 = this.t(p);
        if (t2 === open) break;
        r = this.invalidCase(p);
        if (r < 0) return T.INVALID;
        if (r > 0) { p += 1; continue; }
        if (t2 === BT_AMP) {
          const tok = this.scanRef(p + 1);
          if (tok <= 0) return tok;
          p = this.nt;
          continue;
        }
        if (t2 === BT_LT) { this.nt = p; return T.INVALID; }
        p += 1;
      }
      p += 1;
      if (p >= this.end) return T.PARTIAL;
      switch (this.t(p)) {
        case BT_S: case BT_CR: case BT_LF:
          break;
        case BT_SOL:
          return this.sol(p, T.EMPTY_ELEMENT_WITH_ATTS);
        case BT_GT:
          this.nt = p + 1;
          return T.START_TAG_WITH_ATTS;
        default:
          this.nt = p;
          return T.INVALID;
      }
      // after the white space that follows a closing quote
      for (;;) {
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        r = this.nmstrtCase(p);
        if (r < 0) return T.INVALID;
        if (r > 0) { p += 1; break; }
        const t3 = this.t(p);
        if (t3 === BT_S || t3 === BT_CR || t3 === BT_LF) continue;
        if (t3 === BT_GT) { this.nt = p + 1; return T.START_TAG_WITH_ATTS; }
        if (t3 === BT_SOL) return this.sol(p, T.EMPTY_ELEMENT_WITH_ATTS);
        this.nt = p;
        return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  // p is just after '<'
  scanLt(p) {
    if (p >= this.end) return T.PARTIAL;
    let r = this.nmstrtCase(p);
    if (r < 0) return T.INVALID;
    if (r === 0) {
      switch (this.t(p)) {
        case BT_EXCL:
          p += 1;
          if (p >= this.end) return T.PARTIAL;
          switch (this.t(p)) {
            case BT_MINUS: return this.scanComment(p + 1);
            case BT_LSQB: return this.scanCdataSection(p + 1);
            default:
          }
          this.nt = p;
          return T.INVALID;
        case BT_QUEST:
          return this.scanPi(p + 1);
        case BT_SOL:
          return this.scanEndTag(p + 1);
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    p += 1;
    let hadColon = false;
    while (p < this.end) {
      r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      switch (this.t(p)) {
        case BT_COLON:
          if (hadColon) { this.nt = p; return T.INVALID; }
          hadColon = true;
          p += 1;
          if (p >= this.end) return T.PARTIAL;
          r = this.nmstrtCase(p);
          if (r < 0) return T.INVALID;
          if (r === 0) { this.nt = p; return T.INVALID; }
          p += 1;
          break;
        case BT_S: case BT_CR: case BT_LF:
          p += 1;
          while (p < this.end) {
            r = this.nmstrtCase(p);
            if (r < 0) return T.INVALID;
            if (r > 0) return this.scanAtts(p + 1);
            const ty = this.t(p);
            if (ty === BT_GT) { this.nt = p + 1; return T.START_TAG_NO_ATTS; }
            if (ty === BT_SOL) return this.sol(p, T.EMPTY_ELEMENT_NO_ATTS);
            if (ty === BT_S || ty === BT_CR || ty === BT_LF) { p += 1; continue; }
            this.nt = p;
            return T.INVALID;
          }
          return T.PARTIAL;
        case BT_GT:
          this.nt = p + 1;
          return T.START_TAG_NO_ATTS;
        case BT_SOL:
          return this.sol(p, T.EMPTY_ELEMENT_NO_ATTS);
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    return T.PARTIAL;
  }

  contentTok(p) {
    if (p >= this.end) return T.NONE;
    switch (this.t(p)) {
      case BT_LT:
        return this.scanLt(p + 1);
      case BT_AMP:
        return this.scanRef(p + 1);
      case BT_CR:
        p += 1;
        if (p >= this.end) return T.TRAILING_CR;
        if (this.t(p) === BT_LF) p += 1;
        this.nt = p;
        return T.DATA_NEWLINE;
      case BT_LF:
        this.nt = p + 1;
        return T.DATA_NEWLINE;
      case BT_RSQB:
        p += 1;
        if (p >= this.end) return T.TRAILING_RSQB;
        if (this.s[p] !== 0x5d) break;
        p += 1;
        if (p >= this.end) return T.TRAILING_RSQB;
        if (this.s[p] !== 0x3e) { p -= 1; break; }
        this.nt = p;
        return T.INVALID;
      default:
        if (this.invalidCase(p) < 0) return T.INVALID;
        p += 1;
    }
    while (p < this.end) {
      switch (this.t(p)) {
        case BT_LEAD:
          if (isInvalidCp(this.s[p])) { this.nt = p; return T.DATA_CHARS; }
          p += 1;
          break;
        case BT_RSQB:
          if (this.end - p >= 2) {
            if (this.s[p + 1] !== 0x5d) { p += 1; break; }
            if (this.end - p >= 3) {
              if (this.s[p + 2] !== 0x3e) { p += 1; break; }
              this.nt = p + 2;
              return T.INVALID;
            }
          }
        // falls through
        case BT_AMP: case BT_LT: case BT_NONXML: case BT_CR: case BT_LF:
          this.nt = p;
          return T.DATA_CHARS;
        default:
          p += 1;
      }
    }
    this.nt = p;
    return T.DATA_CHARS;
  }

  cdataSectionTok(p) {
    if (p >= this.end) return T.NONE;
    switch (this.t(p)) {
      case BT_RSQB:
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        if (this.s[p] !== 0x5d) break;
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        if (this.s[p] !== 0x3e) { p -= 1; break; }
        this.nt = p + 1;
        return T.CDATA_SECT_CLOSE;
      case BT_CR:
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        if (this.t(p) === BT_LF) p += 1;
        this.nt = p;
        return T.DATA_NEWLINE;
      case BT_LF:
        this.nt = p + 1;
        return T.DATA_NEWLINE;
      default:
        if (this.invalidCase(p) < 0) return T.INVALID;
        p += 1;
    }
    while (p < this.end) {
      switch (this.t(p)) {
        case BT_LEAD:
          if (isInvalidCp(this.s[p])) { this.nt = p; return T.DATA_CHARS; }
          p += 1;
          break;
        case BT_NONXML: case BT_CR: case BT_LF: case BT_RSQB:
          this.nt = p;
          return T.DATA_CHARS;
        default:
          p += 1;
      }
    }
    this.nt = p;
    return T.DATA_CHARS;
  }

  scanLit(open, p) {
    while (p < this.end) {
      const ty = this.t(p);
      const r = this.invalidCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      if (ty === BT_QUOT || ty === BT_APOS) {
        p += 1;
        if (ty !== open) continue;
        if (p >= this.end) return -T.LITERAL;
        this.nt = p;
        switch (this.t(p)) {
          case BT_S: case BT_CR: case BT_LF: case BT_GT: case BT_PERCNT: case BT_LSQB:
            return T.LITERAL;
          default:
            return T.INVALID;
        }
      }
      p += 1;
    }
    return T.PARTIAL;
  }

  // p is just after '%'
  scanPercent(p) {
    if (p >= this.end) return T.PARTIAL;
    let r = this.nmstrtCase(p);
    if (r < 0) return T.INVALID;
    if (r === 0) {
      switch (this.t(p)) {
        case BT_S: case BT_LF: case BT_CR: case BT_PERCNT:
          this.nt = p;
          return T.PERCENT;
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    p += 1;
    while (p < this.end) {
      r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      if (this.t(p) === BT_SEMI) { this.nt = p + 1; return T.PARAM_ENTITY_REF; }
      this.nt = p;
      return T.INVALID;
    }
    return T.PARTIAL;
  }

  // p is just after '#'
  scanPoundName(p) {
    if (p >= this.end) return T.PARTIAL;
    let r = this.nmstrtCase(p);
    if (r < 0) return T.INVALID;
    if (r === 0) { this.nt = p; return T.INVALID; }
    p += 1;
    while (p < this.end) {
      r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      switch (this.t(p)) {
        case BT_CR: case BT_LF: case BT_S: case BT_RPAR: case BT_GT: case BT_PERCNT: case BT_VERBAR:
          this.nt = p;
          return T.POUND_NAME;
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    return -T.POUND_NAME;
  }

  prologTok(p) {
    if (p >= this.end) return T.NONE;
    let tok;
    switch (this.t(p)) {
      case BT_QUOT:
        return this.scanLit(BT_QUOT, p + 1);
      case BT_APOS:
        return this.scanLit(BT_APOS, p + 1);
      case BT_LT:
        p += 1;
        if (p >= this.end) return T.PARTIAL;
        switch (this.t(p)) {
          case BT_EXCL: return this.scanDecl(p + 1);
          case BT_QUEST: return this.scanPi(p + 1);
          case BT_NMSTRT: case BT_HEX: case BT_LEAD:
            this.nt = p - 1;
            return T.INSTANCE_START;
          default:
        }
        this.nt = p;
        return T.INVALID;
      case BT_CR:
        if (p + 1 === this.end) {
          this.nt = this.end;
          return -T.PROLOG_S; // might be part of a CR/LF pair
        }
      // falls through
      case BT_S: case BT_LF:
        for (;;) {
          p += 1;
          if (p >= this.end) break;
          const ty = this.t(p);
          if (ty === BT_S || ty === BT_LF) continue;
          if (ty === BT_CR && p + 1 !== this.end) continue; // don't split CR/LF
          this.nt = p;
          return T.PROLOG_S;
        }
        this.nt = p;
        return T.PROLOG_S;
      case BT_PERCNT:
        return this.scanPercent(p + 1);
      case BT_COMMA:
        this.nt = p + 1;
        return T.COMMA;
      case BT_LSQB:
        this.nt = p + 1;
        return T.OPEN_BRACKET;
      case BT_RSQB:
        p += 1;
        if (p >= this.end) return -T.CLOSE_BRACKET;
        if (this.s[p] === 0x5d) {
          if (this.end - p < 2) return T.PARTIAL;
          if (this.s[p + 1] === 0x3e) { this.nt = p + 2; return T.COND_SECT_CLOSE; }
        }
        this.nt = p;
        return T.CLOSE_BRACKET;
      case BT_LPAR:
        this.nt = p + 1;
        return T.OPEN_PAREN;
      case BT_RPAR:
        p += 1;
        if (p >= this.end) return -T.CLOSE_PAREN;
        switch (this.t(p)) {
          case BT_AST: this.nt = p + 1; return T.CLOSE_PAREN_ASTERISK;
          case BT_QUEST: this.nt = p + 1; return T.CLOSE_PAREN_QUESTION;
          case BT_PLUS: this.nt = p + 1; return T.CLOSE_PAREN_PLUS;
          case BT_CR: case BT_LF: case BT_S: case BT_GT: case BT_COMMA: case BT_VERBAR: case BT_RPAR:
            this.nt = p;
            return T.CLOSE_PAREN;
          default:
        }
        this.nt = p;
        return T.INVALID;
      case BT_VERBAR:
        this.nt = p + 1;
        return T.OR;
      case BT_GT:
        this.nt = p + 1;
        return T.DECL_CLOSE;
      case BT_NUM:
        return this.scanPoundName(p + 1);
      case BT_LEAD: {
        const c = this.s[p];
        if (isInvalidCp(c)) { this.nt = p; return T.INVALID; }
        if (isNmstrtCp(c)) { p += 1; tok = T.NAME; break; }
        if (isNameCp(c)) { p += 1; tok = T.NMTOKEN; break; }
        this.nt = p;
        return T.INVALID;
      }
      case BT_NMSTRT: case BT_HEX:
        tok = T.NAME;
        p += 1;
        break;
      case BT_DIGIT: case BT_NAME: case BT_MINUS: case BT_COLON:
        tok = T.NMTOKEN;
        p += 1;
        break;
      default:
        this.nt = p;
        return T.INVALID;
    }
    while (p < this.end) {
      const r = this.nameCase(p);
      if (r < 0) return T.INVALID;
      if (r > 0) { p += 1; continue; }
      switch (this.t(p)) {
        case BT_GT: case BT_RPAR: case BT_COMMA: case BT_VERBAR: case BT_LSQB: case BT_PERCNT:
        case BT_S: case BT_CR: case BT_LF:
          this.nt = p;
          return tok;
        case BT_COLON:
          p += 1;
          if (tok === T.NAME) {
            if (p >= this.end) return T.PARTIAL;
            tok = T.PREFIXED_NAME;
            const r2 = this.nameCase(p);
            if (r2 < 0) return T.INVALID;
            if (r2 > 0) p += 1;
            else tok = T.NMTOKEN;
          } else if (tok === T.PREFIXED_NAME) {
            tok = T.NMTOKEN;
          }
          break;
        case BT_PLUS:
          if (tok === T.NMTOKEN) { this.nt = p; return T.INVALID; }
          this.nt = p + 1;
          return T.NAME_PLUS;
        case BT_AST:
          if (tok === T.NMTOKEN) { this.nt = p; return T.INVALID; }
          this.nt = p + 1;
          return T.NAME_ASTERISK;
        case BT_QUEST:
          if (tok === T.NMTOKEN) { this.nt = p; return T.INVALID; }
          this.nt = p + 1;
          return T.NAME_QUESTION;
        default:
          this.nt = p;
          return T.INVALID;
      }
    }
    return -tok;
  }

  // XmlNameLength (namespace-aware: ':' counts)
  nameLength(p) {
    const start = p;
    for (;;) {
      switch (this.t(p)) {
        case BT_LEAD: case BT_NMSTRT: case BT_COLON: case BT_HEX: case BT_DIGIT: case BT_NAME: case BT_MINUS:
          p += 1;
          break;
        default:
          return p - start;
      }
    }
  }

  skipS(p) {
    for (;;) {
      const ty = this.t(p);
      if (ty === BT_LF || ty === BT_CR || ty === BT_S) p += 1;
      else return p;
    }
  }

  // XmlCharRefNumber: p at '&'
  charRefNumber(p) {
    let result = 0;
    p += 2;
    if (this.s[p] === 0x78) {
      for (p += 1; this.s[p] !== 0x3b; p += 1) {
        const c = this.s[p];
        result = result * 16 + (c <= 0x39 ? c - 0x30 : c <= 0x46 ? c - 0x37 : c - 0x57);
        if (result >= 0x110000) return -1;
      }
    } else {
      for (; this.s[p] !== 0x3b; p += 1) {
        result = result * 10 + (this.s[p] - 0x30);
        if (result >= 0x110000) return -1;
      }
    }
    // checkCharRefNumber
    if (result >= 0xd800 && result <= 0xdfff) return -1;
    if (result < 0x80 && ASCII[result] === BT_NONXML) return -1;
    if (result === 0xfffe || result === 0xffff) return -1;
    return result;
  }

  // XmlPredefinedEntityName for the name in [a, b): the character or 0
  predefinedEntity(a, b) {
    const name = String.fromCodePoint(...this.s.slice(a, b));
    return { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" }[name] || 0;
  }

  str(a, b) {
    let out = '';
    for (let i = a; i < b; i++) out += String.fromCodePoint(this.s[i]);
    return out;
  }
}

// ─────────────────────────────────────────────────────────────
// expat: the parser (xmlparse.c), as driven by _elementtree's XMLParser
// ─────────────────────────────────────────────────────────────

const ERRORS = {
  2: 'syntax error', 3: 'no element found', 4: 'not well-formed (invalid token)', 5: 'unclosed token',
  6: 'partial character', 7: 'mismatched tag', 8: 'duplicate attribute', 9: 'junk after document element',
  10: 'illegal parameter entity reference', 11: 'undefined entity', 14: 'reference to invalid character number',
  17: 'XML or text declaration not at start of entity', 20: 'unclosed CDATA section', 27: 'unbound prefix',
  28: 'must not undeclare prefix', 30: 'XML declaration not well-formed',
  38: 'reserved prefix (xml) must not be undeclared or bound to another namespace name',
  39: 'reserved prefix (xmlns) must not be declared or undeclared',
  40: 'prefix must not be bound to one of the reserved namespace names',
};

export const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NS = 'http://www.w3.org/2000/xmlns/';

// xml.etree.ElementTree.ParseError (a SyntaxError): str(e) is the message
// with the position; .code is expat's error number, .position (line, column)
export class ParseError extends PyException {
  constructor(code, line, column) {
    super('xml.etree.ElementTree.ParseError', `${ERRORS[code]}: line ${line}, column ${column}`);
    this.code = code;
    this.position = [line, column];
    this.msg = this.message;
  }
}
const isParseError = (e) => e instanceof ParseError;
export { isParseError };

class Stop {
  constructor(code, ptr) { this.code = code; this.ptr = ptr; }
}

// Python str → the code points pyexpat hands to expat (str.encode('utf-8'):
// a lone surrogate is a UnicodeEncodeError)
export function codePoints(text, fileMode = false) {
  const out = [];
  let i = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      // read from a text file, str is encoded with 'surrogatepass' instead
      if (fileMode) limit('A lone surrogate in text read from a file is passed to expat as invalid UTF-8; not emulated.');
      raise('UnicodeEncodeError', `'utf-8' codec can't encode character '\\u${cp.toString(16)}' in position ${i}: surrogates not allowed`);
    }
    out.push(cp);
    i += 1;
  }
  return out;
}

// UTF-8 length of the code points cps[a, b)
function utf8Length(cps, a, b) {
  let n = 0;
  for (let i = a; i < b; i++) {
    const cp = cps[i];
    n += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  }
  return n;
}

// One expat parser with a handler object:
//   start(tag, attrs: [[name, value], ...]), end(tag), data(str),
//   comment(str), pi(target, data), startNs(prefix|null, uri|null), endNs(prefix|null)
// Names arrive as expat makes them ('uri}local'); the ElementTree layer
// turns them into '{uri}local'.
export class ExpatParser {
  constructor(handler) {
    initTables();
    this.h = handler;
    this.cps = [];
    this.pos = 0;           // where the next parse call resumes
    this.processor = 'init';
    this.prologState = 0;   // 0 = prolog0, 1 = prolog1
    this.tags = [];         // open elements: { raw: [a, b), name, bindings }
    this.bindings = new Map([['xml', [{ uri: XML_NS }]]]); // prefix (null = default) → stack
    this.error = null;
    // expat's input buffer in UTF-8 bytes (XML_GetBuffer / XML_ParseBuffer
    // bookkeeping: allocated size, parse pointer, end of data) for reparse
    // deferral, and its incremental position (m_position, m_positionPtr)
    this.buf = { has: false, lim: 0, ptr: 0, end: 0 };
    this.lastReq = 0;
    this.partialBefore = 0;
    this.deferral = true;   // XML_SetReparseDeferralEnabled (expat 2.6+)
    this.line = 1;
    this.col = 0;
    this.posPtr = 0;
  }

  // XML_GetBuffer(len): grows or compacts the buffer, keeping up to
  // XML_CONTEXT_BYTES (1024) already-parsed bytes before the parse pointer
  getBuffer(len) {
    const b = this.buf;
    this.lastReq = len;
    if (len > b.lim - b.end || !b.has) {
      const keep = Math.min(b.ptr, 1024);
      const needed = len + (b.end - b.ptr) + keep;
      if (b.has && needed <= b.lim) {
        if (keep < b.ptr) {
          const offset = b.ptr - keep;
          b.end -= offset;
          b.ptr -= offset;
        }
      } else {
        let size = b.lim || 1024;
        do size *= 2; while (size < needed);
        if (b.has) {
          b.end = b.end - b.ptr + keep;
          b.ptr = keep;
        }
        b.lim = size;
        b.has = true;
      }
    }
  }

  // XmlUpdatePosition over cps[posPtr, to): a CR LF pair split between two
  // updates counts as two line breaks, as in expat
  advance(to) {
    const s = this.cps;
    for (let i = this.posPtr; i < to; i++) {
      const c = s[i];
      if (c === 10) { this.line += 1; this.col = 0; } else if (c === 13) {
        this.line += 1;
        this.col = 0;
        if (i + 1 < to && s[i + 1] === 10) i += 1;
      } else this.col += 1;
    }
    if (to > this.posPtr) this.posPtr = to;
  }

  // XML_Parse(data, isFinal) → XML_GetBuffer + XML_ParseBuffer: the data is
  // appended and parsing resumes where the previous call stopped (a token
  // cut by the chunk boundary is re-read). Reparse deferral (callProcessor
  // in expat 2.6+): when the previous call consumed nothing, a non-final
  // call parses only once it has at least twice as many unparsed bytes, or
  // when another chunk of the same size would not fit the buffer.
  parse(text, isFinal) {
    if (this.error) limit('Calling feed() or close() again after a ParseError: expat then reports a shifted position. Not emulated.');
    if (this.finished) limit('Feeding a parser after close() is not emulated.');
    const added = text ? codePoints(text, this.fileMode) : [];
    const addedBytes = utf8Length(added, 0, added.length);
    this.getBuffer(addedBytes);
    for (const cp of added) this.cps.push(cp);
    this.buf.end += addedBytes;
    if (!this.S) this.S = new Scanner(this.cps);
    this.S.end = this.cps.length;
    this.haveMore = !isFinal;
    if (isFinal) this.finished = true;
    const b = this.buf;
    const haveNow = b.end - b.ptr;
    if (this.deferral && !isFinal) {
      const available = b.ptr - Math.min(b.ptr, 1024) + (b.lim - b.end);
      if (!(haveNow >= 2 * this.partialBefore || this.lastReq > available)) return;
    }
    const start = this.pos;
    try {
      this.run();
    } catch (e) {
      if (!(e instanceof Stop)) throw e;
      if (e.ptr >= this.posPtr) this.advance(e.ptr);
      this.error = new ParseError(e.code, this.line, this.col);
      throw this.error;
    }
    this.partialBefore = this.pos === start ? haveNow : 0;
    b.ptr += utf8Length(this.cps, start, this.pos);
    this.advance(this.pos);
  }

  fail(code, ptr) { throw new Stop(code, ptr); }

  run() {
    for (;;) {
      switch (this.processor) {
        case 'init': if (!this.initProcessor()) return; break;
        case 'prolog': if (!this.doProlog()) return; break;
        case 'content': if (!this.doContent()) return; break;
        case 'cdata': if (!this.doCdataSection()) return; break;
        case 'epilog': if (!this.epilog()) return; break;
        default: return;
      }
    }
  }

  // initScan: the BOM, and expat's encoding auto-detection from the first
  // two bytes (which still runs when UTF-8 was given explicitly)
  initProcessor() {
    const s = this.cps;
    if (s.length === 0) {
      if (this.haveMore) return false;
      this.fail(3, 0);
    }
    if (s.length === 1) {
      if (s[0] === 0 || s[0] === 0x3c) {
        if (this.haveMore) return false;
        this.fail(5, 0);
      }
    } else if (s[0] === 0 || (s[0] < 0x80 && s[1] === 0)) {
      limit('A NUL character at the very start makes expat guess UTF-16 for the whole document; that path is not emulated.');
    }
    if (s[0] === 0xfeff) this.pos = 1; // XML_TOK_BOM: prolog0 stays
    this.processor = 'prolog';
    return true;
  }

  doProlog() {
    const S = this.S;
    let p = this.pos;
    for (;;) {
      let tok = S.prologTok(p);
      let next = S.nt;
      if (tok <= 0) {
        if (this.haveMore && tok !== T.INVALID) { this.pos = p; return false; }
        switch (tok) {
          case T.INVALID: this.fail(4, next); break;
          case T.PARTIAL: this.fail(5, p); break;
          case T.PARTIAL_CHAR: this.fail(6, p); break;
          case -T.PROLOG_S: tok = T.PROLOG_S; break;
          case T.NONE: this.fail(3, p); break;
          default: tok = -tok; next = S.end;
        }
      }
      let role = 'error';
      switch (tok) {
        case T.PROLOG_S: role = 'none'; this.prologState = 1; break;
        case T.XML_DECL: if (this.prologState === 0) { role = 'xmldecl'; this.prologState = 1; } break;
        case T.PI: role = 'pi'; this.prologState = 1; break;
        case T.COMMENT: role = 'comment'; this.prologState = 1; break;
        case T.DECL_OPEN:
          if (S.str(p + 2, next) === 'DOCTYPE') {
            limit('A DOCTYPE (DTD) is outside what this demo reproduces: internal subsets and entity declarations are not emulated.');
          }
          break;
        case T.INSTANCE_START:
          this.pos = p;
          this.processor = 'content';
          return true;
        default:
      }
      if (role === 'error') {
        if (tok === T.PARAM_ENTITY_REF) this.fail(10, p);
        if (tok === T.XML_DECL) this.fail(17, p);
        this.fail(2, p);
      }
      if (role === 'xmldecl') this.processXmlDecl(p, next);
      else if (role === 'pi') this.reportPi(p, next);
      else if (role === 'comment') this.reportComment(p, next);
      p = next;
    }
  }

  // XmlParseXmlDecl (xmltok.c doParseXmlDecl / parsePseudoAttribute)
  processXmlDecl(s, next) {
    const S = this.S;
    const end = next - 2;
    const toAscii = (p) => (p >= end || S.s[p] >= 0x80 ? -1 : S.s[p]);
    const isSpace = (c) => c === 0x20 || c === 0x0d || c === 0x0a || c === 0x09;
    const isLetter = (c) => (c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a);
    let ptr = s + 5;
    // parsePseudoAttribute: null = no more attributes (ptr unchanged),
    // { bad } = malformed, else { name, nameStart, val, valEnd } and ptr
    // moves past the closing quote
    const pseudo = () => {
      let q = ptr;
      if (q === end) return null;
      if (!isSpace(toAscii(q))) return { bad: q };
      do q += 1; while (isSpace(toAscii(q)));
      if (q === end) return null;
      const nameStart = q;
      let nameEnd;
      let c;
      for (;;) {
        c = toAscii(q);
        if (c === -1) return { bad: q };
        if (c === 0x3d) { nameEnd = q; break; }
        if (isSpace(c)) {
          nameEnd = q;
          do { q += 1; c = toAscii(q); } while (isSpace(c));
          if (c !== 0x3d) return { bad: q };
          break;
        }
        q += 1;
      }
      if (q === nameStart) return { bad: q };
      q += 1;
      c = toAscii(q);
      while (isSpace(c)) { q += 1; c = toAscii(q); }
      if (c !== 0x22 && c !== 0x27) return { bad: q };
      const open = c;
      q += 1;
      const val = q;
      for (;; q += 1) {
        c = toAscii(q);
        if (c === open) break;
        if (!isLetter(c) && !(c >= 0x30 && c <= 0x39) && c !== 0x2e && c !== 0x2d && c !== 0x5f) return { bad: q };
      }
      const valEnd = q;
      ptr = q + 1;
      return { name: S.str(nameStart, nameEnd), nameStart, val, valEnd };
    };
    const bad = (p) => this.fail(30, p);
    let a = pseudo();
    if (a === null) bad(ptr);
    if (a.bad !== undefined) bad(a.bad);
    // an XML declaration must start with version
    if (a.name !== 'version') bad(a.nameStart);
    a = pseudo();
    if (a === null) return;
    if (a.bad !== undefined) bad(a.bad);
    if (a.name === 'encoding') {
      if (!isLetter(toAscii(a.val))) bad(a.val);
      const declared = S.str(a.val, a.valEnd);
      // a str fed to XMLParser.feed() is declared UTF-8 to expat and the
      // declaration is ignored; text read from a file goes in as bytes and
      // expat honours the declaration
      if (!(this.fileMode ? ['utf-8'] : ['utf-8', 'utf8']).includes(declared.toLowerCase())) {
        limit(`A declared encoding other than UTF-8 (encoding="${declared}") is not emulated here.`);
      }
      a = pseudo();
      if (a === null) return;
      if (a.bad !== undefined) bad(a.bad);
    }
    if (a.name !== 'standalone') bad(a.nameStart);
    const v = S.str(a.val, a.valEnd);
    if (v !== 'yes' && v !== 'no') bad(a.val);
    while (isSpace(toAscii(ptr))) ptr += 1;
    if (ptr !== end) bad(ptr);
  }

  // comment / PI text: line ends normalized (normalizeLines)
  normText(a, b) {
    return this.S.str(a, b).replace(/\r\n?/g, '\n');
  }

  reportComment(s, next) {
    if (this.h.comment) this.h.comment(this.normText(s + 4, next - 3));
  }

  reportPi(s, next) {
    const S = this.S;
    const start = s + 2;
    const tem = start + S.nameLength(start);
    const target = S.str(start, tem);
    if (this.h.pi) this.h.pi(target, this.normText(S.skipS(tem), next - 2));
  }

  doContent() {
    const S = this.S;
    let p = this.pos;
    for (;;) {
      const tok = S.contentTok(p);
      const next = S.nt;
      switch (tok) {
        case T.TRAILING_CR:
          if (this.haveMore) { this.pos = p; return false; }
          this.data('\n');
          this.fail(3, p);
          break;
        case T.NONE:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(3, p);
          break;
        case T.INVALID:
          this.fail(4, next);
          break;
        case T.PARTIAL:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(5, p);
          break;
        case T.PARTIAL_CHAR:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(6, p);
          break;
        case T.ENTITY_REF: {
          const ch = S.predefinedEntity(p + 1, next - 1);
          if (!ch) this.fail(11, p);
          this.data(ch);
          break;
        }
        case T.CHAR_REF: {
          const n = S.charRefNumber(p);
          if (n < 0) this.fail(14, p);
          this.data(String.fromCodePoint(n));
          break;
        }
        case T.XML_DECL:
          this.fail(17, p);
          break;
        case T.DATA_NEWLINE:
          this.data('\n');
          break;
        case T.CDATA_SECT_OPEN:
          this.pos = next;
          this.processor = 'cdata';
          return true;
        case T.TRAILING_RSQB:
          if (this.haveMore) { this.pos = p; return false; }
          this.data(S.str(p, S.end));
          this.fail(3, S.end);
          break;
        case T.DATA_CHARS:
          this.data(S.str(p, next));
          break;
        case T.PI:
          this.reportPi(p, next);
          break;
        case T.COMMENT:
          this.reportComment(p, next);
          break;
        case T.START_TAG_NO_ATTS:
        case T.START_TAG_WITH_ATTS: {
          const rawLen = S.nameLength(p + 1);
          const tag = { raw: [p + 1, p + 1 + rawLen], bindings: [] };
          this.tags.push(tag);
          const { name, attrs } = this.storeAtts(p, S.str(p + 1, p + 1 + rawLen), tag.bindings);
          tag.name = name;
          this.h.start(name, attrs);
          break;
        }
        case T.EMPTY_ELEMENT_NO_ATTS:
        case T.EMPTY_ELEMENT_WITH_ATTS: {
          const rawLen = S.nameLength(p + 1);
          const bindings = [];
          let stored;
          try {
            stored = this.storeAtts(p, S.str(p + 1, p + 1 + rawLen), bindings);
          } catch (e) {
            // an empty element ends the namespace scopes it opened even
            // when its attributes fail (xmlparse.c freeBindings)
            if (e instanceof Stop) this.freeBindings(bindings);
            throw e;
          }
          const { name, attrs } = stored;
          this.h.start(name, attrs);
          this.h.end(name);
          this.freeBindings(bindings);
          if (this.tags.length === 0) {
            this.pos = next;
            this.processor = 'epilog';
            return true;
          }
          break;
        }
        case T.END_TAG: {
          const tag = this.tags[this.tags.length - 1];
          const raw = p + 2;
          const len = S.nameLength(raw);
          const [a, b] = tag.raw;
          let same = len === b - a;
          for (let i = 0; same && i < len; i++) same = S.s[a + i] === S.s[raw + i];
          if (!same) this.fail(7, raw);
          this.tags.pop();
          this.h.end(tag.name);
          this.freeBindings(tag.bindings);
          if (this.tags.length === 0) {
            this.pos = next;
            this.processor = 'epilog';
            return true;
          }
          break;
        }
        default:
      }
      p = next;
    }
  }

  data(text) {
    if (this.h.data && text) this.h.data(text);
  }

  // bindings were pushed in declaration order; expat ends them newest first
  freeBindings(bindings) {
    while (bindings.length) {
      const prefix = bindings.pop();
      this.bindings.get(prefix).pop();
      if (this.h.endNs) this.h.endNs(prefix);
    }
  }

  binding(prefix) {
    const st = this.bindings.get(prefix);
    if (!st || st.length === 0) return null;
    return st[st.length - 1]; // { uri } or { uri: null } for an undeclared default
  }

  // xmlparse.c storeAtts + getAttributeId + addBinding, for a document
  // without a DTD (every attribute is CDATA, no defaults). s is the '<'.
  storeAtts(s, rawName, tagBindings) {
    const S = this.S;
    const atts = this.getAtts(s);
    const seen = new Set();
    const appAtts = [];
    for (const att of atts) {
      const qname = S.str(att.name, att.name + S.nameLength(att.name));
      if (seen.has(qname)) this.fail(8, att.name);
      seen.add(qname);
      const value = this.attValue(att.valuePtr, att.valueEnd, s);
      if (qname === 'xmlns' || qname.startsWith('xmlns:')) {
        this.addBinding(qname === 'xmlns' ? null : qname.slice(6), value, s, tagBindings);
      } else {
        appAtts.push({ qname, value });
      }
    }
    // expand prefixed attribute names; duplicates by expanded name
    const expanded = new Set();
    const attrs = [];
    for (const a of appAtts) {
      const colon = a.qname.indexOf(':');
      if (colon === -1) { attrs.push([a.qname, a.value]); continue; }
      const b = this.binding(a.qname.slice(0, colon));
      if (!b || b.uri === null) this.fail(27, s);
      const uriName = `${b.uri}}${a.qname.slice(colon + 1)}`;
      if (expanded.has(uriName)) this.fail(8, s);
      expanded.add(uriName);
      attrs.push([uriName, a.value]);
    }
    // the element type name
    let name = rawName;
    const colon = rawName.indexOf(':');
    if (colon !== -1) {
      const b = this.binding(rawName.slice(0, colon));
      if (!b || b.uri === null) this.fail(27, s);
      name = `${b.uri}}${rawName.slice(colon + 1)}`;
    } else {
      const d = this.binding(null);
      if (d && d.uri !== null) name = `${d.uri}}${rawName}`;
    }
    return { name, attrs };
  }

  addBinding(prefix, uri, s, tagBindings) {
    if (uri === '' && prefix !== null) this.fail(28, s);
    if (prefix === 'xmlns') this.fail(39, s);
    const mustBeXML = prefix === 'xml';
    // '}' is the namespace separator and not an RFC 3986 URI character
    if (uri.includes('}')) this.fail(2, s);
    const isXML = uri === XML_NS;
    const isXMLNS = !mustBeXML && uri === XMLNS_NS;
    if (mustBeXML !== isXML) this.fail(mustBeXML ? 38 : 40, s);
    if (isXMLNS) this.fail(40, s);
    if (!this.bindings.has(prefix)) this.bindings.set(prefix, []);
    const unbind = uri === '' && prefix === null;
    this.bindings.get(prefix).push({ uri: unbind ? null : uri });
    tagBindings.push(prefix);
    if (this.h.startNs) this.h.startNs(prefix, unbind ? null : uri);
  }

  // xmltok_impl.c getAtts over a validated start tag: name / value spans
  getAtts(p) {
    const S = this.S;
    const atts = [];
    let state = 1; // 0 other, 1 inName, 2 inValue
    let open = 0;
    let cur = null;
    for (p += 1; ; p += 1) {
      const ty = S.t(p);
      switch (ty) {
        case BT_LEAD: case BT_NMSTRT: case BT_HEX:
          if (state === 0) { cur = { name: p }; state = 1; }
          break;
        case BT_QUOT: case BT_APOS:
          if (state !== 2) { cur.valuePtr = p + 1; state = 2; open = ty; } else if (open === ty) {
            state = 0;
            cur.valueEnd = p;
            atts.push(cur);
          }
          break;
        case BT_S: case BT_CR: case BT_LF:
          if (state === 1) state = 0;
          break;
        case BT_GT: case BT_SOL:
          if (state !== 2) return atts;
          break;
        default:
      }
    }
  }

  // appendAttributeValue for a CDATA attribute: references expanded, each
  // white space character (tab, newline, CR LF) becomes one space
  attValue(a, b, tagStart) {
    const S = this.S;
    let out = '';
    let p = a;
    while (p < b) {
      const c = S.s[p];
      if (c === 0x26) {
        let q = p + 1;
        while (S.s[q] !== 0x3b) q += 1;
        if (S.s[p + 1] === 0x23) {
          const n = S.charRefNumber(p);
          if (n < 0) this.fail(14, p);
          out += String.fromCodePoint(n);
        } else {
          const ch = S.predefinedEntity(p + 1, q);
          if (!ch) this.fail(11, tagStart);
          out += ch;
        }
        p = q + 1;
      } else if (c === 0x0d) {
        out += ' ';
        p += S.s[p + 1] === 0x0a && p + 1 < b ? 2 : 1;
      } else if (c === 0x0a || c === 0x09 || c === 0x20) {
        out += ' ';
        p += 1;
      } else {
        out += String.fromCodePoint(c);
        p += 1;
      }
    }
    return out;
  }

  doCdataSection() {
    const S = this.S;
    let p = this.pos;
    for (;;) {
      const tok = S.cdataSectionTok(p);
      const next = S.nt;
      switch (tok) {
        case T.CDATA_SECT_CLOSE:
          this.pos = next;
          this.processor = 'content';
          return true;
        case T.DATA_NEWLINE:
          this.data('\n');
          break;
        case T.DATA_CHARS:
          this.data(S.str(p, next));
          break;
        case T.INVALID:
          this.fail(4, next);
          break;
        case T.PARTIAL_CHAR:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(6, p);
          break;
        case T.PARTIAL:
        case T.NONE:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(20, p);
          break;
        default:
      }
      p = next;
    }
  }

  // epilogProcessor: a lone CR at the end of the data is consumed (so a CR
  // LF pair split between two parse calls counts as two line breaks), and
  // any other token, a name cut by the end of the data included, is junk
  epilog() {
    const S = this.S;
    let p = this.pos;
    for (;;) {
      const tok = S.prologTok(p);
      const next = S.nt;
      switch (tok) {
        case -T.PROLOG_S:
          this.pos = next;
          return false;
        case T.NONE:
          this.pos = p;
          return false;
        case T.PROLOG_S:
          break;
        case T.PI:
          this.reportPi(p, next);
          break;
        case T.COMMENT:
          this.reportComment(p, next);
          break;
        case T.INVALID:
          this.fail(4, next);
          break;
        case T.PARTIAL:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(5, p);
          break;
        case T.PARTIAL_CHAR:
          if (this.haveMore) { this.pos = p; return false; }
          this.fail(6, p);
          break;
        default:
          this.fail(9, p);
      }
      p = next;
    }
  }
}

// ─────────────────────────────────────────────────────────────
// ElementTree: the element model
// ─────────────────────────────────────────────────────────────

// Python's Comment and ProcessingInstruction factories double as the tags
// of comment and PI elements
export const COMMENT = { factory: 'Comment' };
export const PI = { factory: 'ProcessingInstruction' };

export class QName {
  constructor(textOrUri, tag = null) {
    this.text = tag ? `{${textOrUri}}${tag}` : textOrUri;
  }
}

// Python ==, as far as tags go: str == QName compares the QName's text
const tagEq = (a, b) => {
  const x = a instanceof QName ? a.text : a;
  const y = b instanceof QName ? b.text : b;
  return x === y;
};

export const pyTypeName = (v) => {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number' || typeof v === 'bigint') return 'int';
  if (Array.isArray(v)) return 'list';
  if (v instanceof Element) return 'xml.etree.ElementTree.Element';
  if (v instanceof QName) return 'QName';
  return 'object';
};
const shortTypeName = (v) => (v instanceof Element ? 'Element' : pyTypeName(v));

export class Element {
  constructor(tag, attrib = null) {
    this.tag = tag;
    this.attrib = new Map(attrib || []);
    this.text = null;
    this.tail = null;
    this.children = [];
  }

  get length() { return this.children.length; }

  // elem[i]
  child(i) {
    const kind = intArgKind(i);
    if (kind === 'float') raise('TypeError', 'element indices must be integers');
    if (kind === 'big') raise('IndexError', "cannot fit 'int' into an index-sized integer");
    const n = this.children.length;
    const j = i < 0 ? i + n : i;
    if (j < 0 || j >= n) raise('IndexError', 'child index out of range');
    return this.children[j];
  }

  append(e) {
    if (!(e instanceof Element)) raise('TypeError', `append() argument 1 must be xml.etree.ElementTree.Element, not ${shortTypeName(e)}`);
    this.children.push(e);
  }

  extend(elements) {
    for (const e of elements) {
      if (!(e instanceof Element)) raise('TypeError', `expected an Element, not "${shortTypeName(e)}"`);
      this.children.push(e);
    }
  }

  insert(index, e) {
    if (!(e instanceof Element)) raise('TypeError', `insert() argument 2 must be xml.etree.ElementTree.Element, not ${shortTypeName(e)}`);
    const kind = intArgKind(index);
    if (kind === 'float') raise('TypeError', "'float' object cannot be interpreted as an integer");
    if (kind === 'big') raise('OverflowError', 'Python int too large to convert to C ssize_t');
    const n = this.children.length;
    let i = index;
    if (i < 0) { i += n; if (i < 0) i = 0; }
    if (i > n) i = n;
    this.children.splice(i, 0, e);
  }

  // compares by identity (Element has no __eq__)
  remove(e) {
    const i = this.children.indexOf(e);
    if (i === -1) raise('ValueError', 'list.remove(x): x not in list');
    this.children.splice(i, 1);
  }

  // the C Element drops its attribute dict: a dict fetched earlier keeps
  // its items
  clear() {
    this.attrib = new Map();
    this.children = [];
    this.text = null;
    this.tail = null;
  }

  // dict semantics: a QName key equals the str of its text (and another
  // QName with that text), the first key object stays
  keyOf(key) {
    if (this.attrib.has(key)) return key;
    for (const k of this.attrib.keys()) if (tagEq(k, key)) return k;
    return undefined;
  }
  get(key, dflt = null) { const k = this.keyOf(key); return k === undefined ? dflt : this.attrib.get(k); }
  set(key, value) { const k = this.keyOf(key); this.attrib.set(k === undefined ? key : k, value); }
  keys() { return [...this.attrib.keys()]; }
  items() { return [...this.attrib.entries()]; }
  makeelement(tag, attrib) { return new Element(tag, attrib); }

  * iter(tag = null) {
    const want = tag === '*' ? null : tag;
    const walk = function* walk(e) {
      if (want === null || tagEq(e.tag, want)) yield e;
      for (const c of e.children) yield* walk(c);
    };
    yield* walk(this);
  }

  // the C itertext: text of every element below (comments and PIs
  // included, unlike the pure-Python version), tails of all but this one
  * itertext() {
    const walk = function* walk(e, top) {
      if (e.text) yield e.text;
      for (const c of e.children) yield* walk(c, false);
      if (!top && e.tail) yield e.tail;
    };
    yield* walk(this, true);
  }

  find(path, namespaces = null) {
    if (checkpath(path) || namespaces !== null) return epFind(this, path, namespaces);
    for (const c of this.children) if (tagEq(c.tag, path)) return c;
    return null;
  }

  findtext(path, dflt = null, namespaces = null) {
    if (checkpath(path) || namespaces !== null) return epFindtext(this, path, dflt, namespaces);
    for (const c of this.children) if (tagEq(c.tag, path)) return c.text === null ? '' : c.text;
    return dflt;
  }

  findall(path, namespaces = null) {
    if (checkpath(path) || namespaces !== null) return epFindall(this, path, namespaces);
    return this.children.filter((c) => tagEq(c.tag, path));
  }

  iterfind(path, namespaces = null) {
    return epIterfind(this, path, namespaces);
  }
}

export function SubElement(parent, tag, attrib = null) {
  if (!(parent instanceof Element)) raise('TypeError', `SubElement() argument 1 must be xml.etree.ElementTree.Element, not ${shortTypeName(parent)}`);
  const e = new Element(tag, attrib);
  parent.children.push(e);
  return e;
}

export function Comment(text = null) {
  const e = new Element(COMMENT);
  e.text = text;
  return e;
}

export function ProcessingInstruction(target, text = null) {
  const e = new Element(PI);
  e.text = target;
  if (text) e.text = `${e.text} ${text}`;
  return e;
}

// hasattr(element, 'tag'): an ElementTree has no tag, so it is not one
export const iselement = (v) => v instanceof Element;

export class ElementTree {
  constructor(element = null) { this._root = element; }
  getroot() { return this._root; }
  iter(tag = null) { return this._root.iter(tag); }
  // a path starting with '/' warns (FutureWarning, on stderr) and gets a '.'
  static fix(path) { return path.slice(0, 1) === '/' ? `.${path}` : path; }
  find(path, ns = null) { return this._root.find(ElementTree.fix(path), ns); }
  findtext(path, dflt = null, ns = null) { return this._root.findtext(ElementTree.fix(path), dflt, ns); }
  findall(path, ns = null) { return this._root.findall(ElementTree.fix(path), ns); }
  iterfind(path, ns = null) { return this._root.iterfind(ElementTree.fix(path), ns); }
}

// ─────────────────────────────────────────────────────────────
// ElementTree: TreeBuilder and XMLParser (Modules/_elementtree.c)
// ─────────────────────────────────────────────────────────────

export class TreeBuilder {
  constructor({ insertComments = false, insertPis = false } = {}) {
    this.insertComments = insertComments;
    this.insertPis = insertPis;
    this.root = null;
    this.thisElem = null;     // the open element (None at top level)
    this.stack = [];
    this.last = null;
    this.lastForTail = null;
    this.dataParts = [];
    this.events = null;       // array when an XMLPullParser asked for events
    this.wanted = new Set();
  }

  flush() {
    if (this.dataParts.length === 0) return;
    const text = this.dataParts.join('');
    this.dataParts = [];
    if (this.lastForTail === null) {
      if (this.last !== null) this.last.text = this.last.text === null ? text : this.last.text + text;
    } else {
      const e = this.lastForTail;
      e.tail = e.tail === null ? text : e.tail + text;
    }
  }

  event(name, value) {
    if (this.events && this.wanted.has(name)) this.events.push([name, value]);
  }

  start(tag, attrib) {
    this.flush();
    const node = new Element(tag, attrib);
    if (this.thisElem !== null) this.thisElem.children.push(node);
    else {
      if (this.root !== null) raise('xml.etree.ElementTree.ParseError', 'multiple elements on top level');
      this.root = node;
    }
    this.stack.push(this.thisElem);
    this.thisElem = node;
    this.last = node;
    this.lastForTail = null;
    this.event('start', node);
    return node;
  }

  data(text) { this.dataParts.push(text); }

  end() {
    this.flush();
    if (this.stack.length === 0) raise('IndexError', 'pop from empty stack');
    this.last = this.thisElem;
    this.lastForTail = this.last;
    this.thisElem = this.stack.pop();
    this.event('end', this.last);
    return this.last;
  }

  comment(text) {
    this.flush();
    const node = Comment(text);
    if (this.insertComments && this.thisElem !== null) {
      this.thisElem.children.push(node);
      this.lastForTail = node;
    }
    this.event('comment', node);
    return node;
  }

  pi(target, text) {
    this.flush();
    const node = ProcessingInstruction(target, text);
    if (this.insertPis && this.thisElem !== null) {
      this.thisElem.children.push(node);
      this.lastForTail = node;
    }
    this.event('pi', node);
    return node;
  }

  close() { return this.root; }
}

// expat's 'uri}local' → ElementTree's '{uri}local'
const universal = (name) => (name.includes('}') ? `{${name}` : name);

const EVENT_NAMES = ['start', 'end', 'start-ns', 'end-ns', 'comment', 'pi'];

// The C XMLParser: any target object with optional start / end / data /
// comment / pi / start_ns / end_ns / close methods; a TreeBuilder gets the
// shortcuts _elementtree.c uses (events, end-ns value None).
export class XMLParser {
  constructor({ target = null } = {}) {
    this.target = target || new TreeBuilder();
    const tg = this.target;
    const isTB = tg instanceof TreeBuilder;
    this.expat = new ExpatParser({
      start: (name, attrs) => {
        if (tg.start) tg.start(universal(name), new Map(attrs.map(([k, v]) => [universal(k), v])));
      },
      end: (name) => { if (tg.end) tg.end(universal(name)); },
      data: (text) => { if (tg.data) tg.data(text); },
      comment: (text) => { if (tg.comment) tg.comment(text); },
      pi: (target, data) => { if (tg.pi) tg.pi(target, data); },
      startNs: (prefix, uri) => {
        if (isTB) tg.event('start-ns', { __pyTuple: [prefix || '', uri || ''] });
        else if (tg.start_ns) tg.start_ns(prefix || '', uri || '');
      },
      endNs: (prefix) => {
        if (isTB) tg.event('end-ns', null);
        else if (tg.end_ns) tg.end_ns(prefix || '');
      },
    });
  }

  feed(text) { this.expat.parse(text, false); }

  // 3.13: parse what is buffered now, with reparse deferral switched off
  // for this one call
  flush() {
    this.expat.deferral = false;
    try {
      this.expat.parse('', false);
    } finally {
      this.expat.deferral = true;
    }
  }

  close() {
    this.expat.parse('', true);
    return this.target.close ? this.target.close() : null;
  }

  setevents(queue, events) {
    if (!(this.target instanceof TreeBuilder)) raise('TypeError', 'event handling only supported for ElementTree.TreeBuilder targets');
    this.target.events = queue;
    for (const ev of events) {
      if (!EVENT_NAMES.includes(ev)) raise('ValueError', `unknown event '${ev}'`);
      this.target.wanted.add(ev);
    }
  }
}

// XMLPullParser: feed / close / read_events; a ParseError during feed is
// queued after the events before it
export class XMLPullParser {
  constructor(events = null) {
    this.queue = [];
    this.parser = new XMLParser({ target: new TreeBuilder() });
    this.parser.setevents(this.queue, events === null ? ['end'] : events);
  }

  feed(text) {
    if (this.parser === null) raise('ValueError', 'feed() called after end of stream');
    if (!text) return;
    try {
      this.parser.feed(text);
    } catch (e) {
      if (!(e instanceof ParseError)) throw e;
      this.queue.push(e);
    }
  }

  // unlike feed(), a ParseError here is raised, not queued
  flush() {
    if (this.parser === null) raise('ValueError', 'flush() called after end of stream');
    this.parser.flush();
  }

  close() {
    const root = this.parser.close();
    this.parser = null;
    return root;
  }

  * readEvents() {
    while (this.queue.length) {
      const ev = this.queue.shift();
      if (ev instanceof Error) throw ev;
      yield ev;
    }
  }
}

export function fromstring(text, parser = null) {
  const p = parser || new XMLParser({ target: new TreeBuilder() });
  p.feed(text);
  return p.close();
}

// ET.parse(io.StringIO(text)) and ElementTree(file=...) with the default
// parser: XMLParser._parse_whole reads 64 KiB pieces and hands them to expat
// as UTF-8 *bytes* — so, unlike feed(str), the XML declaration's encoding
// counts (anything but UTF-8 → limit)
export function parseFile(text) {
  const p = new XMLParser({ target: new TreeBuilder() });
  p.expat.fileMode = true;
  const cps = [...text];
  for (let i = 0; i < cps.length; i += 65536) p.feed(cps.slice(i, i + 65536).join(''));
  return p.close();
}

export function fromstringlist(sequence) {
  const p = new XMLParser({ target: new TreeBuilder() });
  for (const t of sequence) p.feed(t);
  return p.close();
}

// (root, [[id, element], ...]) — later duplicates replace earlier values
// in place, as a dict does
export function XMLID(text) {
  const root = fromstring(text);
  const ids = new Map();
  for (const e of root.iter()) {
    const id = e.get('id');
    if (id) ids.set(id, e);
  }
  return { root, ids };
}

// iterparse(source) over a text: [event, value] pairs in order; an error
// is thrown where CPython's iterator raises it (events before it are
// passed to onEvent first, if given)
export function iterparse(text, events = null, onEvent = null) {
  const pull = new XMLPullParser(events);
  const out = [];
  const take = () => {
    for (const ev of pull.readEvents()) {
      out.push(ev);
      if (onEvent) onEvent(ev);
    }
  };
  // io.StringIO.read(16 * 1024) chunks
  const cps = [...text];
  for (let i = 0; i < cps.length; i += 16384) {
    take();
    pull.feed(cps.slice(i, i + 16384).join(''));
  }
  take();
  const root = pull.close();
  take();
  return { events: out, root };
}

// ─────────────────────────────────────────────────────────────
// ElementPath (Lib/xml/etree/ElementPath.py)
// ─────────────────────────────────────────────────────────────

// Python's \s for str patterns
const WS = '\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000';
let XPATH_RE = null;
const xpathRe = () => {
  if (!XPATH_RE) {
    XPATH_RE = new RegExp(
      `('[^']*'|"[^"]*"|::|\\/\\/?|\\.\\.|\\(\\)|!=|[\\/.*:\\[\\]()@=])|((?:\\{[^}]+\\})?[^\\/\\[\\]()@!=${WS}]+)|[${WS}]+`,
      'gu',
    );
  }
  XPATH_RE.lastIndex = 0;
  return XPATH_RE;
};

// the C fast path: a tag with no path characters outside {...}
function checkpath(tag) {
  if (typeof tag !== 'string') return true;
  const s = [...tag];
  if (s.length >= 3 && s[0] === '{' && (s[1] === '}' || (s[1] === '*' && s[2] === '}'))) return true;
  let check = true;
  for (const ch of s) {
    if (ch === '{') check = false;
    else if (ch === '}') check = true;
    else if (check && '/*[@.'.includes(ch)) return true;
  }
  return false;
}

const nsGet = (namespaces, key) => (namespaces instanceof Map ? namespaces.get(key) : namespaces[key]);
const nsHas = (namespaces, key) => (namespaces instanceof Map ? namespaces.has(key) : Object.prototype.hasOwnProperty.call(namespaces, key));
const nsSize = (namespaces) => (namespaces instanceof Map ? namespaces.size : Object.keys(namespaces).length);

function* xpathTokenizer(pattern, namespaces) {
  const truthy = namespaces !== null && nsSize(namespaces) > 0;
  const defaultNamespace = truthy && nsHas(namespaces, '') ? nsGet(namespaces, '') : null;
  let parsingAttribute = false;
  for (const m of pattern.matchAll(xpathRe())) {
    const ttype = m[1] || '';
    const tag = m[2] || '';
    if (tag && tag[0] !== '{') {
      if (tag.includes(':')) {
        const i = tag.indexOf(':');
        const prefix = tag.slice(0, i);
        if (!truthy || !nsHas(namespaces, prefix)) raise('SyntaxError', `prefix ${pyStrRepr(prefix)} not found in prefix map`);
        yield [ttype, `{${nsGet(namespaces, prefix)}}${tag.slice(i + 1)}`];
      } else if (defaultNamespace && !parsingAttribute) {
        yield [ttype, `{${defaultNamespace}}${tag}`];
      } else {
        yield [ttype, tag];
      }
      parsingAttribute = false;
    } else {
      yield [ttype, tag];
      parsingAttribute = ttype === '@';
    }
  }
}

function getParentMap(context) {
  if (context.parentMap === null) {
    context.parentMap = new Map();
    for (const p of context.root.iter()) for (const e of p.children) context.parentMap.set(e, p);
  }
  return context.parentMap;
}

const isWildcardTag = (tag) => tag.slice(0, 3) === '{*}' || tag.slice(-2) === '}*';

function prepareTag(tag) {
  if (tag === '{*}*') {
    return function* sel(context, result) { for (const e of result) if (typeof e.tag === 'string') yield e; };
  }
  if (tag === '{}*') {
    return function* sel(context, result) { for (const e of result) if (typeof e.tag === 'string' && e.tag[0] !== '{') yield e; };
  }
  if (tag.slice(0, 3) === '{*}') {
    const suffix = [...tag.slice(2)];
    const local = tag.slice(3);
    return function* sel(context, result) {
      for (const e of result) {
        if (tagEq(e.tag, local)) { yield e; continue; }
        if (typeof e.tag === 'string') {
          const cps = [...e.tag];
          if (cps.slice(Math.max(cps.length - suffix.length, 0)).join('') === suffix.join('')) yield e;
        }
      }
    };
  }
  if (tag.slice(-2) === '}*') {
    const ns = [...tag.slice(0, -1)].join('');
    return function* sel(context, result) {
      for (const e of result) if (typeof e.tag === 'string' && [...e.tag].slice(0, [...ns].length).join('') === ns) yield e;
    };
  }
  raise('RuntimeError', `internal parser error, got ${tag}`);
  return null;
}

function prepareChild(next, token) {
  let tag = token[1];
  if (isWildcardTag(tag)) {
    const selectTag = prepareTag(tag);
    return (context, result) => selectTag(context, (function* children() { for (const e of result) yield* e.children; }()));
  }
  if (tag.slice(0, 2) === '{}') tag = tag.slice(2);
  return function* sel(context, result) {
    for (const e of result) for (const c of e.children) if (tagEq(c.tag, tag)) yield c;
  };
}

function prepareStar() {
  return function* sel(context, result) { for (const e of result) yield* e.children; };
}

function prepareSelf() {
  return function* sel(context, result) { yield* result; };
}

function prepareDescendant(next) {
  const token = next();
  if (token === undefined) return null;
  let tag;
  if (token[0] === '*') tag = '*';
  else if (!token[0]) tag = token[1];
  else raise('SyntaxError', 'invalid descendant');
  if (isWildcardTag(tag)) {
    const selectTag = prepareTag(tag);
    return (context, result) => selectTag(context, (function* desc() {
      for (const e of result) for (const d of e.iter()) if (d !== e) yield d;
    }()));
  }
  if (tag.slice(0, 2) === '{}') tag = tag.slice(2);
  return function* sel(context, result) {
    for (const e of result) for (const d of e.iter(tag)) if (d !== e) yield d;
  };
}

function prepareParent() {
  return function* sel(context, result) {
    const parentMap = getParentMap(context);
    const seen = new Set();
    for (const e of result) {
      if (parentMap.has(e)) {
        const p = parentMap.get(e);
        if (!seen.has(p)) { seen.add(p); yield p; }
      }
    }
  };
}

// Python's re.match(r"\-?\d+$", s) and int(s) for such a string
const DIGITS_RE = /^-?\p{Nd}+$/u;
function digitValue(ch) {
  let cp = ch.codePointAt(0);
  if (cp < 0x80) return cp - 0x30;
  let start = cp;
  while (/\p{Nd}/u.test(String.fromCodePoint(start - 1))) start -= 1;
  return (cp - start) % 10;
}
// int() of a token: sign, Unicode digits, single underscores between
// digits; null when int() would raise ValueError
function pyInt(s) {
  const m = /^([+-]?)(\p{Nd}+(?:_\p{Nd}+)*)$/u.exec(s);
  if (!m) return null;
  let v = 0n;
  for (const ch of m[2]) if (ch !== '_') v = v * 10n + BigInt(digitValue(ch));
  return m[1] === '-' ? -v : v;
}

function preparePredicate(next) {
  const signature = [];
  const predicate = [];
  for (;;) {
    let token = next();
    if (token === undefined) return null;
    if (token[0] === ']') break;
    if (token[0] === '' && token[1] === '') continue;
    if (token[0] && (token[0][0] === "'" || token[0][0] === '"')) token = ["'", token[0].slice(1, -1)];
    signature.push(token[0] || '-');
    predicate.push(token[1]);
  }
  const sig = signature.join('');
  if (sig === '@-') {
    const key = predicate[1];
    return function* sel(context, result) { for (const e of result) if (e.get(key) !== null) yield e; };
  }
  if (sig === "@-='" || sig === "@-!='") {
    const key = predicate[1];
    const value = predicate[predicate.length - 1];
    if (sig.includes('!=')) {
      return function* sel(context, result) {
        for (const e of result) { const v = e.get(key); if (v !== null && v !== value) yield e; }
      };
    }
    return function* sel(context, result) { for (const e of result) if (e.get(key) === value) yield e; };
  }
  if (sig === '-' && !DIGITS_RE.test(predicate[0])) {
    const tag = predicate[0];
    return function* sel(context, result) { for (const e of result) if (e.find(tag) !== null) yield e; };
  }
  if (sig === ".='" || sig === ".!='" || ((sig === "-='" || sig === "-!='") && !DIGITS_RE.test(predicate[0]))) {
    const tag = predicate[0];
    const value = predicate[predicate.length - 1];
    const neg = sig.includes('!=');
    const textOf = (e) => [...e.itertext()].join('');
    if (tag) {
      if (neg) {
        return function* sel(context, result) {
          for (const e of result) for (const x of e.iterfind(tag)) if (textOf(x) !== value) { yield e; break; }
        };
      }
      return function* sel(context, result) {
        for (const e of result) for (const x of e.findall(tag)) if (textOf(x) === value) { yield e; break; }
      };
    }
    if (neg) return function* sel(context, result) { for (const e of result) if (textOf(e) !== value) yield e; };
    return function* sel(context, result) { for (const e of result) if (textOf(e) === value) yield e; };
  }
  if (sig === '-' || sig === '-()' || sig === '-()-') {
    let index;
    if (sig === '-') {
      index = pyInt(predicate[0]) - 1n;
      if (index < 0n) raise('SyntaxError', 'XPath position >= 1 expected');
    } else {
      if (predicate[0] !== 'last') raise('SyntaxError', 'unsupported function');
      if (sig === '-()-') {
        const v = pyInt(predicate[2]);
        if (v === null) raise('SyntaxError', 'unsupported expression');
        index = v - 1n;
        if (index > -2n) raise('SyntaxError', 'XPath offset from last() must be negative');
      } else {
        index = -1n;
      }
    }
    return function* sel(context, result) {
      const parentMap = getParentMap(context);
      for (const e of result) {
        if (!parentMap.has(e)) continue;
        const elems = parentMap.get(e).findall(e.tag);
        const n = BigInt(elems.length);
        const i = index < 0n ? index + n : index;
        if (i >= 0n && i < n && elems[Number(i)] === e) yield e;
      }
    };
  }
  raise('SyntaxError', 'invalid predicate');
  return null;
}

const OPS = {
  '': prepareChild,
  '*': prepareStar,
  '.': prepareSelf,
  '..': prepareParent,
  '//': prepareDescendant,
  '[': preparePredicate,
};

// iterfind: null when the path has no tokens at all (Python returns None)
function epIterfind(elem, path, namespaces) {
  let p = path;
  if (p.slice(-1) === '/') p += '*';
  if (p.slice(0, 1) === '/') raise('SyntaxError', 'cannot use absolute path on element');
  const it = xpathTokenizer(p, namespaces);
  const next = () => { const r = it.next(); return r.done ? undefined : r.value; };
  let token = next();
  if (token === undefined) return null;
  const selector = [];
  for (;;) {
    if (!Object.prototype.hasOwnProperty.call(OPS, token[0])) raise('KeyError', pyStrRepr(token[0]));
    selector.push(OPS[token[0]](next, token));
    token = next();
    if (token === undefined) break;
    if (token[0] === '/') {
      token = next();
      if (token === undefined) break;
    }
  }
  let result = [elem];
  const context = { root: elem, parentMap: null };
  for (const select of selector) {
    if (typeof select !== 'function') raise('TypeError', "'NoneType' object is not callable");
    result = select(context, result);
  }
  return result;
}

function epFind(elem, path, namespaces) {
  const it = epIterfind(elem, path, namespaces);
  if (it === null) raise('TypeError', "'NoneType' object is not an iterator");
  for (const e of it) return e;
  return null;
}

function epFindall(elem, path, namespaces) {
  const it = epIterfind(elem, path, namespaces);
  if (it === null) raise('TypeError', "'NoneType' object is not iterable");
  return [...it];
}

function epFindtext(elem, path, dflt, namespaces) {
  const it = epIterfind(elem, path, namespaces);
  if (it === null) raise('TypeError', "'NoneType' object is not an iterator");
  for (const e of it) return e.text === null ? '' : e.text;
  return dflt;
}

// ─────────────────────────────────────────────────────────────
// Serialization (Lib/xml/etree/ElementTree.py)
// ─────────────────────────────────────────────────────────────

// _namespace_map: "well-known" prefixes. register_namespace() changes the
// real one for the whole process; emulators work on a copy.
export const NAMESPACE_MAP = [
  [XML_NS, 'xml'],
  ['http://www.w3.org/1999/xhtml', 'html'],
  ['http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf'],
  ['http://schemas.xmlsoap.org/wsdl/', 'wsdl'],
  ['http://www.w3.org/2001/XMLSchema', 'xs'],
  ['http://www.w3.org/2001/XMLSchema-instance', 'xsi'],
  ['http://purl.org/dc/elements/1.1/', 'dc'],
];
export const namespaceMap = () => new Map(NAMESPACE_MAP);
const DEFAULT_MAP = namespaceMap();

export function registerNamespace(map, prefix, uri) {
  if (/^ns\p{Nd}+\n?$/u.test(prefix)) raise('ValueError', 'Prefix format reserved for internal use');
  for (const [k, v] of [...map.entries()]) if (k === uri || v === prefix) map.delete(k);
  map.set(uri, prefix);
}

// Python str ordering (code points, not UTF-16 units)
export function cmpStr(a, b) {
  if (a === b) return 0;
  const x = [...a];
  const y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (x[i] !== y[i]) return x[i].codePointAt(0) - y[i].codePointAt(0);
  }
  return x.length - y.length;
}

const reprForError = (v) => {
  if (v === null || v === undefined) return 'None';
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof QName) return `<QName ${pyStrRepr(v.text)}>`;
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  return String(v);
};
const typeForError = (v) => (v instanceof QName ? 'QName' : pyTypeName(v));
function serializationError(v) {
  raise('TypeError', `cannot serialize ${reprForError(v)} (type ${typeForError(v)})`);
}

export function escapeCdata(text) {
  if (typeof text !== 'string') serializationError(text);
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeAttrib(text) {
  if (typeof text !== 'string') serializationError(text);
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/\r/g, '&#13;').replace(/\n/g, '&#10;').replace(/\t/g, '&#09;');
}

function escapeAttribHtml(text) {
  if (typeof text !== 'string') serializationError(text);
  return text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// "%s" % value
const pyStr = (v) => (v === null || v === undefined ? 'None' : v instanceof QName ? v.text : String(v));

// _namespaces(): qnames (tag/attribute name → serialized name) and the
// namespace declarations (uri → prefix) the root element will carry
function collectNamespaces(elem, defaultNamespace, nsMap) {
  const qnames = new Map([[null, null]]);
  const namespaces = new Map();
  if (defaultNamespace) namespaces.set(defaultNamespace, '');
  const addQname = (qname) => {
    if (typeof qname !== 'string') serializationError(qname);
    if (qname.slice(0, 1) === '{') {
      const rest = qname.slice(1);
      const k = rest.lastIndexOf('}');
      if (k === -1) raise('ValueError', 'not enough values to unpack (expected 2, got 1)');
      const uri = rest.slice(0, k);
      const tag = rest.slice(k + 1);
      let prefix = namespaces.has(uri) ? namespaces.get(uri) : null;
      if (prefix === null) {
        prefix = nsMap.has(uri) ? nsMap.get(uri) : null;
        if (prefix === null) prefix = `ns${namespaces.size}`;
        if (prefix !== 'xml') namespaces.set(uri, prefix);
      }
      qnames.set(qname, prefix ? `${prefix}:${tag}` : tag);
    } else {
      if (defaultNamespace) raise('ValueError', 'cannot use non-qualified names with default_namespace option');
      qnames.set(qname, qname);
    }
  };
  for (const e of elem.iter()) {
    const tag = e.tag;
    if (tag instanceof QName) {
      if (!qnames.has(tag.text)) addQname(tag.text);
    } else if (typeof tag === 'string') {
      if (!qnames.has(tag)) addQname(tag);
    } else if (tag !== null && tag !== COMMENT && tag !== PI) {
      serializationError(tag);
    }
    for (const [key0, value] of e.attrib) {
      const key = key0 instanceof QName ? key0.text : key0;
      if (!qnames.has(key)) addQname(key);
      if (value instanceof QName && !qnames.has(value.text)) addQname(value.text);
    }
    if (e.text instanceof QName && !qnames.has(e.text.text)) addQname(e.text.text);
  }
  return { qnames, namespaces };
}

const qnameOf = (qnames, tag) => qnames.get(tag instanceof QName ? tag.text : tag);

function writeNamespaces(write, namespaces) {
  const sorted = [...namespaces.entries()].sort((a, b) => cmpStr(a[1], b[1]));
  for (const [v, k] of sorted) write(` xmlns${k ? `:${k}` : k}="${escapeAttrib(v)}"`);
}

function serializeXml(write, elem, qnames, namespaces, shortEmpty) {
  const text = elem.text;
  if (elem.tag === COMMENT) write(`<!--${pyStr(text)}-->`);
  else if (elem.tag === PI) write(`<?${pyStr(text)}?>`);
  else {
    const tag = qnameOf(qnames, elem.tag);
    if (tag === null) {
      if (text) write(escapeCdata(text));
      for (const e of elem.children) serializeXml(write, e, qnames, null, shortEmpty);
    } else {
      write(`<${tag}`);
      const items = [...elem.attrib.entries()];
      if (items.length || (namespaces && namespaces.size)) {
        if (namespaces && namespaces.size) writeNamespaces(write, namespaces);
        for (const [k0, v0] of items) {
          const k = k0 instanceof QName ? k0.text : k0;
          const v = v0 instanceof QName ? qnames.get(v0.text) : escapeAttrib(v0);
          write(` ${qnames.get(k)}="${v}"`);
        }
      }
      if (text || elem.children.length || !shortEmpty) {
        write('>');
        if (text) write(escapeCdata(text));
        for (const e of elem.children) serializeXml(write, e, qnames, null, shortEmpty);
        write(`</${tag}>`);
      } else {
        write(' />');
      }
    }
  }
  if (elem.tail) write(escapeCdata(elem.tail));
}

export const HTML_EMPTY = new Set(['area', 'base', 'basefont', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function serializeHtml(write, elem, qnames, namespaces) {
  const text = elem.text;
  if (elem.tag === COMMENT) write(`<!--${escapeCdata(text)}-->`);
  else if (elem.tag === PI) write(`<?${escapeCdata(text)}?>`);
  else {
    const tag = qnameOf(qnames, elem.tag);
    if (tag === null) {
      if (text) write(escapeCdata(text));
      for (const e of elem.children) serializeHtml(write, e, qnames, null);
    } else {
      write(`<${tag}`);
      const items = [...elem.attrib.entries()];
      if (items.length || (namespaces && namespaces.size)) {
        if (namespaces && namespaces.size) writeNamespaces(write, namespaces);
        for (const [k0, v0] of items) {
          const k = k0 instanceof QName ? k0.text : k0;
          const v = v0 instanceof QName ? qnames.get(v0.text) : escapeAttribHtml(v0);
          write(` ${qnames.get(k)}="${v}"`);
        }
      }
      write('>');
      const ltag = tag.toLowerCase();
      if (text) {
        if (ltag === 'script' || ltag === 'style') write(text);
        else write(escapeCdata(text));
      }
      for (const e of elem.children) serializeHtml(write, e, qnames, null);
      if (!HTML_EMPTY.has(ltag)) write(`</${tag}>`);
    }
  }
  if (elem.tail) write(escapeCdata(elem.tail));
}

// The XML/HTML serializers and indent() recurse once per nesting level in
// Python: near 1000 levels they hit the recursion limit, at a depth that
// depends on the caller's stack and the Python version (3.13's HTML writer
// does not) — deeper trees are not emulated.
function checkDepth(root, what) {
  let max = 0;
  const stack = [[root, 1]];
  while (stack.length) {
    const [e, d] = stack.pop();
    if (d > max) max = d;
    for (const c of e.children) stack.push([c, d + 1]);
  }
  if (max > 900) limit(`Trees nested more than 900 levels deep reach Python's recursion limit in the ${what} (the exact depth depends on the call stack); not emulated.`);
}

function serializeText(write, elem) {
  for (const part of elem.itertext()) write(part);
  if (elem.tail) write(elem.tail);
}

// codecs the bytes output supports: Lib/encodings/aliases.py keys and
// encodings module names that resolve to utf_8 / ascii / latin_1
const CODEC_MODULES = { utf_8: 'utf-8', ascii: 'ascii', latin_1: 'latin-1' };
const CODEC_ALIASES = {
  cp65001: 'utf-8', u8: 'utf-8', utf: 'utf-8', utf8: 'utf-8', utf8_ucs2: 'utf-8', utf8_ucs4: 'utf-8',
  646: 'ascii', 'ansi_x3.4_1968': 'ascii', 'ansi_x3.4_1986': 'ascii', ansi_x3_4_1968: 'ascii', cp367: 'ascii',
  csascii: 'ascii', ibm367: 'ascii', iso646_us: 'ascii', 'iso_646.irv_1991': 'ascii', iso_ir_6: 'ascii', us: 'ascii',
  us_ascii: 'ascii',
  8859: 'latin-1', cp819: 'latin-1', csisolatin1: 'latin-1', ibm819: 'latin-1', iso8859: 'latin-1', iso8859_1: 'latin-1',
  iso_8859_1: 'latin-1', iso_8859_1_1987: 'latin-1', iso_ir_100: 'latin-1', l1: 'latin-1', latin: 'latin-1', latin1: 'latin-1',
};
// every other codec name CPython 3.13 knows (aliases + encodings modules,
// normalized): output in these is not emulated → EmulatorLimit; any other
// name is a real LookupError. Built from encodings.aliases / pkgutil.
const KNOWN_CODEC_NAMES = '037 1026 1125 1140 1250 1251 1252 1253 1254 1255 1256 1257 1258 273 424 437 500 775 850 852 855 857 858 860 '
  + '861 862 863 864 865 866 869 932 936 949 950 ansi arabic asmo_708 base64 base64_codec base_64 big5 big5_hkscs '
  + 'big5_tw big5hkscs bz2 bz2_codec charmap chinese cp037 cp1006 cp1026 cp1051 cp1125 cp1140 cp1250 cp1251 cp1252 '
  + 'cp1253 cp1254 cp1255 cp1256 cp1257 cp1258 cp1361 cp154 cp273 cp424 cp437 cp500 cp720 cp737 cp775 cp850 cp852 '
  + 'cp855 cp856 cp857 cp858 cp860 cp861 cp862 cp863 cp864 cp865 cp866 cp866u cp869 cp874 cp875 cp932 cp936 cp949 '
  + 'cp950 cp_gr cp_is csbig5 csibm037 csibm1026 csibm273 csibm424 csibm500 csibm855 csibm857 csibm858 csibm860 '
  + 'csibm861 csibm863 csibm864 csibm865 csibm866 csibm869 csiso2022jp csiso2022kr csiso58gb231280 csisolatin2 '
  + 'csisolatin3 csisolatin4 csisolatin5 csisolatin6 csisolatinarabic csisolatincyrillic csisolatingreek '
  + 'csisolatinhebrew cskoi8r cspc775baltic cspc850multilingual cspc862latinhebrew cspc8codepage437 cspcp852 '
  + 'csptcp154 csshiftjis cyrillic cyrillic_asian dbcs ebcdic_cp_be ebcdic_cp_ca ebcdic_cp_ch ebcdic_cp_he '
  + 'ebcdic_cp_nl ebcdic_cp_us ebcdic_cp_wt ecma_114 ecma_118 elot_928 euc_cn euc_jis2004 euc_jis_2004 euc_jisx0213 '
  + 'euc_jp euc_kr euccn eucgb2312_cn eucjis2004 eucjisx0213 eucjp euckr gb18030 gb18030_2000 gb2312 gb2312_1980 '
  + 'gb2312_80 gbk greek greek8 hebrew hex hex_codec hkscs hp_roman8 hz hz_gb hz_gb_2312 hzgb ibm037 ibm039 ibm1026 '
  + 'ibm1051 ibm1125 ibm1140 ibm273 ibm424 ibm437 ibm500 ibm775 ibm850 ibm852 ibm855 ibm857 ibm858 ibm860 ibm861 '
  + 'ibm862 ibm863 ibm864 ibm865 ibm866 ibm869 idna iso2022_jp iso2022_jp_1 iso2022_jp_2 iso2022_jp_2004 '
  + 'iso2022_jp_3 iso2022_jp_ext iso2022_kr iso2022jp iso2022jp_1 iso2022jp_2 iso2022jp_2004 iso2022jp_3 '
  + 'iso2022jp_ext iso2022kr iso8859_10 iso8859_11 iso8859_13 iso8859_14 iso8859_15 iso8859_16 iso8859_2 iso8859_3 '
  + 'iso8859_4 iso8859_5 iso8859_6 iso8859_7 iso8859_8 iso8859_9 iso_2022_jp iso_2022_jp_1 iso_2022_jp_2 '
  + 'iso_2022_jp_2004 iso_2022_jp_3 iso_2022_jp_ext iso_2022_kr iso_8859_10 iso_8859_10_1992 iso_8859_11 '
  + 'iso_8859_11_2001 iso_8859_13 iso_8859_14 iso_8859_14_1998 iso_8859_15 iso_8859_16 iso_8859_16_2001 iso_8859_2 '
  + 'iso_8859_2_1987 iso_8859_3 iso_8859_3_1988 iso_8859_4 iso_8859_4_1988 iso_8859_5 iso_8859_5_1988 iso_8859_6 '
  + 'iso_8859_6_1987 iso_8859_7 iso_8859_7_1987 iso_8859_8 iso_8859_8_1988 iso_8859_9 iso_8859_9_1989 iso_celtic '
  + 'iso_ir_101 iso_ir_109 iso_ir_110 iso_ir_126 iso_ir_127 iso_ir_138 iso_ir_144 iso_ir_148 iso_ir_157 iso_ir_166 '
  + 'iso_ir_199 iso_ir_226 iso_ir_58 jisx0213 johab koi8_r koi8_t koi8_u korean ks_c_5601 ks_c_5601_1987 ks_x_1001 '
  + 'ksc5601 ksx1001 kz1048 kz_1048 l10 l2 l3 l4 l5 l6 l7 l8 l9 latin10 latin2 latin3 latin4 latin5 latin6 latin7 '
  + 'latin8 latin9 mac_arabic mac_centeuro mac_croatian mac_cyrillic mac_farsi mac_greek mac_iceland mac_latin2 '
  + 'mac_roman mac_romanian mac_turkish maccentraleurope maccyrillic macgreek maciceland macintosh maclatin2 '
  + 'macroman macturkish mbcs ms1361 ms932 ms936 ms949 ms950 ms_kanji mskanji oem palmos pt154 ptcp154 punycode '
  + 'quopri quopri_codec quoted_printable quotedprintable r8 raw_unicode_escape rk1048 roman8 rot13 rot_13 ruscii '
  + 's_jis s_jis_2004 s_jisx0213 shift_jis shift_jis_2004 shift_jisx0213 shiftjis shiftjis2004 shiftjisx0213 sjis '
  + 'sjis_2004 sjisx0213 strk1048_2002 thai tis620 tis_620 tis_620_0 tis_620_2529_0 tis_620_2529_1 u16 u32 u7 u_jis '
  + 'uhc ujis undefined unicode_1_1_utf_7 unicode_escape unicodebigunmarked unicodelittleunmarked utf16 utf32 utf7 '
  + 'utf_16 utf_16_be utf_16_le utf_16be utf_16le utf_32 utf_32_be utf_32_le utf_32be utf_32le utf_7 utf_8_sig uu '
  + 'uu_codec windows_1250 windows_1251 windows_1252 windows_1253 windows_1254 windows_1255 windows_1256 '
  + 'windows_1257 windows_1258 windows_31j x_mac_japanese x_mac_korean x_mac_simp_chinese x_mac_trad_chinese zip '
  + 'zlib zlib_codec';
let KNOWN_CODECS = null;
// Lib/encodings/__init__.py: normalize_encoding() of the lower-cased name,
// then the aliases table (also with '.' → '_'), then a module of that name
function codecOf(encoding) {
  if (/[^\x20-\x7e\t\n\v\f\r]/.test(encoding)) limit('Encoding names with non-ASCII or control characters are not emulated here.');
  let norm = '';
  let punct = false;
  for (const c of encoding.toLowerCase()) {
    if (/[a-z0-9.]/.test(c)) {
      if (punct && norm) norm += '_';
      norm += c;
      punct = false;
    } else punct = true;
  }
  const alias = CODEC_ALIASES[norm] || CODEC_ALIASES[norm.replace(/\./g, '_')];
  if (alias) return alias;
  if (CODEC_MODULES[norm]) return CODEC_MODULES[norm];
  if (!KNOWN_CODECS) KNOWN_CODECS = new Set(KNOWN_CODEC_NAMES.split(' '));
  if (KNOWN_CODECS.has(norm) || KNOWN_CODECS.has(norm.replace(/\./g, '_'))) {
    limit(`Output in the ${encoding} encoding is not emulated here (UTF-8, ASCII and Latin-1 are).`);
  }
  raise('LookupError', `unknown encoding: ${encoding}`);
  return null;
}

// str → bytes with errors='xmlcharrefreplace'
function encodeText(text, codec) {
  const out = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (codec === 'utf-8') {
      for (const b of new TextEncoder().encode(ch)) out.push(b);
    } else if (cp < (codec === 'ascii' ? 0x80 : 0x100)) {
      out.push(cp);
    } else {
      for (const c of `&#${cp};`) out.push(c.charCodeAt(0));
    }
  }
  return out;
}

export class Bytes {
  constructor(arr) { this.bytes = arr; }
}

export function bytesRepr(arr) {
  const hasSq = arr.includes(0x27);
  const hasDq = arr.includes(0x22);
  const q = hasSq && !hasDq ? '"' : "'";
  let s = 'b' + q;
  for (const b of arr) {
    if (b === q.charCodeAt(0) || b === 0x5c) s += '\\' + String.fromCharCode(b);
    else if (b === 0x09) s += '\\t';
    else if (b === 0x0a) s += '\\n';
    else if (b === 0x0d) s += '\\r';
    else if (b < 0x20 || b >= 0x7f) s += '\\x' + b.toString(16).padStart(2, '0');
    else s += String.fromCharCode(b);
  }
  return s + q;
}

// ElementTree.write() to a stream: the list of str chunks it writes
// (the XML declaration first, when written) and the text/bytes mode
function writeChunks(root, opts, textStream) {
  const {
    encoding = null, xmlDeclaration = null, defaultNamespace = null,
    method = null, shortEmptyElements = true, nsMap = DEFAULT_MAP,
  } = opts;
  let m = method;
  if (!m) m = 'xml';
  else if (!['xml', 'html', 'text'].includes(m)) raise('ValueError', `unknown method ${pyStrRepr(m)}`);
  const enc = encoding || 'us-ascii';
  const unicode = enc.toLowerCase() === 'unicode';
  const codec = unicode ? null : codecOf(enc);
  const declared = unicode ? 'utf-8' : enc;
  const chunks = [];
  const write = (s) => {
    if (unicode && !textStream) raise('TypeError', "a bytes-like object is required, not 'str'");
    chunks.push(s);
  };
  if (m === 'xml' && (xmlDeclaration || (xmlDeclaration === null && !unicode && !['utf-8', 'us-ascii'].includes(declared.toLowerCase())))) {
    write(`<?xml version='1.0' encoding='${declared}'?>\n`);
  }
  if (m === 'text') serializeText(write, root);
  else {
    const { qnames, namespaces } = collectNamespaces(root, defaultNamespace, nsMap);
    checkDepth(root, 'serializer');
    if (m === 'xml') serializeXml(write, root, qnames, namespaces, shortEmptyElements);
    else serializeHtml(write, root, qnames, namespaces);
  }
  return { chunks, unicode, codec };
}

// tostring(): a str for encoding='unicode', else a Bytes object
export function tostring(elem, opts = {}) {
  const exact = opts.encoding === 'unicode';
  const { chunks, unicode, codec } = writeChunks(elem, opts, exact);
  const text = chunks.join('');
  // ('Unicode' etc. write str into a BytesIO: fine only when nothing is written)
  if (unicode) return exact ? text : new Bytes([]);
  return new Bytes(encodeText(text, codec));
}

// tostringlist(): the str chunks for encoding='unicode' (one per write),
// else the TextIOWrapper's flushes — one bytes object for output that
// fits its 8192-byte chunk
export function tostringlist(elem, opts = {}) {
  const { chunks, unicode, codec } = writeChunks(elem, opts, true);
  if (unicode) return chunks;
  if (chunks.length === 0) return [];
  const bytes = encodeText(chunks.join(''), codec);
  if (bytes.length > 8192) limit('tostringlist() output longer than 8192 bytes is split by io.TextIOWrapper buffering; not emulated.');
  return [new Bytes(bytes)];
}

// ElementTree.write(file) where file is an io.StringIO (encoding='unicode')
// or io.BytesIO (any other encoding): the stream's getvalue()
export function writeToStream(tree, opts, textStream) {
  const root = tree instanceof ElementTree ? tree.getroot() : tree;
  const { chunks, unicode, codec } = writeChunks(root, opts, textStream);
  const text = chunks.join('');
  if (textStream) {
    // a StringIO given bytes by the TextIOWrapper (when it flushes)
    if (!unicode && chunks.length) raise('TypeError', "string argument expected, got 'bytes'");
    return text;
  }
  return new Bytes(encodeText(text, codec));
}

// what dump(elem) prints
export function dumpText(elem) {
  const root = elem instanceof ElementTree ? elem.getroot() : elem;
  let out = tostring(root, { encoding: 'unicode' });
  const tail = root.tail;
  if (!tail || tail.slice(-1) !== '\n') out += '\n';
  return out;
}

// str.strip() == '' in Python terms
const WS_ONLY = new RegExp(`^[${WS}]*$`, 'u');
const isBlank = (s) => WS_ONLY.test(s);
const WS_EDGE = new RegExp(`^[${WS}]+|[${WS}]+$`, 'gu');
export const pyStrip = (s) => s.replace(WS_EDGE, '');

export function indent(tree, space = '  ', level = 0) {
  const root = tree instanceof ElementTree ? tree.getroot() : tree;
  if (level < 0) raise('ValueError', `Initial indentation level must be >= 0, got ${level}`);
  if (!root.children.length) return;
  // "\n" + level * space
  const kind = intArgKind(level);
  if (kind === 'float') raise('TypeError', "can't multiply sequence by non-int of type 'float'");
  if (kind === 'big') raise('OverflowError', "cannot fit 'int' into an index-sized integer");
  if (space.length && BigInt(String(level)) * BigInt(space.length) > SSIZE_MAX) raise('OverflowError', 'repeated string is too long');
  if (level * space.length > 100000) limit('An indentation string longer than 100,000 characters is not emulated here.');
  checkDepth(root, 'indent()');
  const indentations = [`\n${space.repeat(level)}`];
  const indentChildren = (elem, lvl) => {
    const childLevel = lvl + 1;
    let childIndentation = indentations[childLevel];
    if (childIndentation === undefined) {
      childIndentation = indentations[lvl] + space;
      indentations.push(childIndentation);
    }
    if (!elem.text || isBlank(elem.text)) elem.text = childIndentation;
    let child = null;
    for (child of elem.children) {
      if (child.children.length) indentChildren(child, childLevel);
      if (!child.tail || isBlank(child.tail)) child.tail = childIndentation;
    }
    if (isBlank(child.tail)) child.tail = indentations[lvl];
  };
  indentChildren(root, 0);
}

// ─────────────────────────────────────────────────────────────
// C14N 2.0 (canonicalize, C14NWriterTarget)
// ─────────────────────────────────────────────────────────────

const escapeCdataC14n = (text) => {
  if (typeof text !== 'string') serializationError(text);
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
};
const escapeAttribC14n = (text) => {
  if (typeof text !== 'string') serializationError(text);
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
    .replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
};
// re.compile(r'^\w+:\w+$', re.UNICODE).match ($ also before a final \n)
const looksLikePrefixName = (s) => /^[\p{L}\p{N}_]+:[\p{L}\p{N}_]+\n?$/u.test(s);

// sort key of sorted(qnames, key=lambda n: n.split('}', 1))
const splitKeyCmp = (a, b) => {
  const split = (n) => { const i = n.indexOf('}'); return i === -1 ? [n] : [n.slice(0, i), n.slice(i + 1)]; };
  const x = split(a);
  const y = split(b);
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const c = cmpStr(x[i], y[i]);
    if (c) return c;
  }
  return x.length - y.length;
};

// Python list [-1] and pop() on the writer's stacks (CPython's writer can
// unbalance them with qname_aware_tags: an IndexError is its real result)
const lastOf = (list) => {
  if (list.length === 0) raise('IndexError', 'list index out of range');
  return list[list.length - 1];
};
const popOf = (list) => {
  if (list.length === 0) raise('IndexError', 'pop from empty list');
  return list.pop();
};

export class C14NWriterTarget {
  constructor(write, {
    withComments = false, stripText = false, rewritePrefixes = false,
    qnameAwareTags = null, qnameAwareAttrs = null, excludeAttrs = null, excludeTags = null,
    nsMap = DEFAULT_MAP,
  } = {}) {
    this._write = write;
    this._data = [];
    this._withComments = withComments;
    this._stripText = stripText;
    this._excludeAttrs = excludeAttrs && excludeAttrs.length ? new Set(excludeAttrs) : null;
    this._excludeTags = excludeTags && excludeTags.length ? new Set(excludeTags) : null;
    this._rewritePrefixes = rewritePrefixes;
    this._qnameAwareTags = qnameAwareTags && qnameAwareTags.length ? new Set(qnameAwareTags) : null;
    this._qnameAwareAttrs = qnameAwareAttrs && qnameAwareAttrs.length ? new Set(qnameAwareAttrs) : null;
    this._declaredNsStack = [[[XML_NS, 'xml']]];
    this._nsStack = [];
    if (!rewritePrefixes) this._nsStack.push([...nsMap.entries()]);
    this._nsStack.push([]);
    this._prefixMap = new Map();
    this._preserveSpace = [false];
    this._pendingStart = null;
    this._rootSeen = false;
    this._rootDone = false;
    this._ignoredDepth = 0;
  }

  * iterNamespaces(stack) {
    for (let i = stack.length - 1; i >= 0; i--) yield* stack[i];
  }

  resolvePrefixName(prefixedName) {
    const i = prefixedName.indexOf(':');
    const prefix = prefixedName.slice(0, i);
    const name = prefixedName.slice(i + 1);
    for (const [uri, p] of this.iterNamespaces(this._nsStack)) if (p === prefix) return `{${uri}}${name}`;
    raise('ValueError', `Prefix ${prefix} of QName "${prefixedName}" is not declared in scope`);
    return null;
  }

  qname(qname, uri0 = null) {
    let uri = uri0;
    let tag;
    if (uri === null) {
      if (qname.slice(0, 1) === '{') {
        const rest = qname.slice(1);
        const k = rest.lastIndexOf('}');
        if (k === -1) raise('ValueError', 'not enough values to unpack (expected 2, got 1)');
        uri = rest.slice(0, k);
        tag = rest.slice(k + 1);
      } else {
        uri = '';
        tag = qname;
      }
    } else {
      tag = qname;
    }
    const seen = new Set();
    for (const [u, prefix] of this.iterNamespaces(this._declaredNsStack)) {
      if (u === uri && !seen.has(prefix)) return [prefix ? `${prefix}:${tag}` : tag, tag, uri];
      seen.add(prefix);
    }
    if (this._rewritePrefixes) {
      let prefix;
      if (this._prefixMap.has(uri)) prefix = this._prefixMap.get(uri);
      else { prefix = `n${this._prefixMap.size}`; this._prefixMap.set(uri, prefix); }
      lastOf(this._declaredNsStack).push([uri, prefix]);
      return [`${prefix}:${tag}`, tag, uri];
    }
    if (!uri && !seen.has('')) return [tag, tag, uri];
    for (const [u, prefix] of this.iterNamespaces(this._nsStack)) {
      if (u === uri) {
        lastOf(this._declaredNsStack).push([uri, prefix]);
        return [prefix ? `${prefix}:${tag}` : tag, tag, uri];
      }
    }
    if (!uri) return [tag, tag, uri];
    raise('ValueError', `Namespace "${uri}" is not declared in scope`);
    return null;
  }

  data(data) {
    if (!this._ignoredDepth) this._data.push(data);
  }

  flush() {
    let data = this._data.join('');
    this._data = [];
    if (this._stripText && !lastOf(this._preserveSpace)) data = pyStrip(data);
    if (this._pendingStart !== null) {
      const args = this._pendingStart;
      this._pendingStart = null;
      const qnameText = data && looksLikePrefixName(data) ? data : null;
      this.startElem(...args, qnameText);
      if (qnameText !== null) return;
    }
    if (data && this._rootSeen) this._write(escapeCdataC14n(data));
  }

  start_ns(prefix, uri) {
    if (this._ignoredDepth) return;
    if (this._data.length) this.flush();
    lastOf(this._nsStack).push([uri, prefix]);
  }

  start(tag, attrs) {
    if (this._excludeTags !== null && (this._ignoredDepth || this._excludeTags.has(tag))) {
      this._ignoredDepth += 1;
      return;
    }
    if (this._data.length) this.flush();
    const newNamespaces = [];
    this._declaredNsStack.push(newNamespaces);
    if (this._qnameAwareTags !== null && this._qnameAwareTags.has(tag)) {
      this._pendingStart = [tag, attrs, newNamespaces];
      return;
    }
    this.startElem(tag, attrs, newNamespaces, null);
  }

  startElem(tag, attrs0, newNamespaces, qnameText) {
    let attrs = attrs0;
    if (this._excludeAttrs !== null && attrs.size) {
      attrs = new Map([...attrs].filter(([k]) => !this._excludeAttrs.has(k)));
    }
    const qnames = new Set([tag, ...attrs.keys()]);
    const resolved = new Map();
    if (qnameText !== null) {
      const q = this.resolvePrefixName(qnameText);
      resolved.set(qnameText, q);
      qnames.add(q);
    }
    let qattrs = null;
    if (this._qnameAwareAttrs !== null && attrs.size) {
      const inter = [...attrs.keys()].filter((k) => this._qnameAwareAttrs.has(k));
      if (inter.length) {
        qattrs = new Set(inter);
        for (const name of inter) {
          const value = attrs.get(name);
          if (looksLikePrefixName(value)) {
            const q = this.resolvePrefixName(value);
            resolved.set(value, q);
            qnames.add(q);
          }
        }
      }
    }
    const parsed = new Map();
    for (const n of [...qnames].sort(splitKeyCmp)) parsed.set(n, this.qname(n));
    let attrList = [];
    if (newNamespaces.length) {
      attrList = newNamespaces.map(([uri, prefix]) => [prefix ? `xmlns:${prefix}` : 'xmlns', uri]);
      attrList.sort((a, b) => cmpStr(a[0], b[0]) || cmpStr(a[1], b[1]));
    }
    if (attrs.size) {
      for (const [k, v0] of [...attrs].sort((a, b) => cmpStr(a[0], b[0]))) {
        let v = v0;
        if (qattrs !== null && qattrs.has(k) && resolved.has(v)) v = parsed.get(resolved.get(v))[0];
        const [attrQname, attrName, uri] = parsed.get(k);
        attrList.push([uri ? attrQname : attrName, v]);
      }
    }
    const space = attrs.get(`{${XML_NS}}space`);
    this._preserveSpace.push(space ? space === 'preserve' : lastOf(this._preserveSpace));
    this._write(`<${parsed.get(tag)[0]}`);
    if (attrList.length) this._write(attrList.map(([k, v]) => ` ${k}="${escapeAttribC14n(v)}"`).join(''));
    this._write('>');
    if (qnameText !== null) this._write(escapeCdataC14n(parsed.get(resolved.get(qnameText))[0]));
    this._rootSeen = true;
    this._nsStack.push([]);
  }

  end(tag) {
    if (this._ignoredDepth) { this._ignoredDepth -= 1; return; }
    if (this._data.length) this.flush();
    this._write(`</${this.qname(tag)[0]}>`);
    popOf(this._preserveSpace);
    this._rootDone = this._preserveSpace.length === 1;
    popOf(this._declaredNsStack);
    popOf(this._nsStack);
  }

  comment(text) {
    if (!this._withComments) return;
    if (this._ignoredDepth) return;
    if (this._rootDone) this._write('\n');
    else if (this._rootSeen && this._data.length) this.flush();
    this._write(`<!--${escapeCdataC14n(text)}-->`);
    if (!this._rootSeen) this._write('\n');
  }

  pi(target, data) {
    if (this._ignoredDepth) return;
    if (this._rootDone) this._write('\n');
    else if (this._rootSeen && this._data.length) this.flush();
    this._write(data ? `<?${target} ${escapeCdataC14n(data)}?>` : `<?${target}?>`);
    if (!this._rootSeen) this._write('\n');
  }
}

export function canonicalize(xmlData, options = {}) {
  if (xmlData === null || xmlData === undefined) raise('ValueError', "Either 'xml_data' or 'from_file' must be provided as input");
  const out = [];
  const parser = new XMLParser({ target: new C14NWriterTarget((s) => out.push(s), options) });
  parser.feed(xmlData);
  parser.close();
  return out.join('');
}

// ─────────────────────────────────────────────────────────────
// Python reprs for demo output
// ─────────────────────────────────────────────────────────────

// repr() of the str / None / QName values that appear in trees
export function valueRepr(v) {
  if (v === null || v === undefined) return 'None';
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof QName) return `<QName ${pyStrRepr(v.text)}>`;
  if (v instanceof Bytes) return bytesRepr(v.bytes);
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  return String(v);
}

// a dict repr from [key, value] pairs, keeping their order
export const dictPy = (pairs) => ({ __pyRaw: `{${pairs.map(([k, v]) => `${valueRepr(k)}: ${valueRepr(v)}`).join(', ')}}` });

// elem.attrib as a Python dict value for the demo output
export const attribPy = (elem) => dictPy([...elem.attrib]);

// a tag for demo output: str (or QName); comment / PI tags are Python
// functions whose repr holds a memory address — demos never show them
export function tagPy(tag) {
  if (typeof tag === 'string' || tag === null) return tag;
  if (tag instanceof QName) return { __pyRaw: valueRepr(tag) };
  return limit('This element is a comment or processing instruction: its tag is the ET.Comment / ET.PI function, whose repr includes a memory address.');
}

// a Bytes value / str value as pyReprExact input
export const outPy = (v) => (v instanceof Bytes ? { __pyRaw: bytesRepr(v.bytes) } : v);

// str.splitlines()
export function pySplitlines(s) {
  const out = [];
  let cur = '';
  const cps = [...s];
  for (let i = 0; i < cps.length; i++) {
    const c = cps[i];
    if (c === '\r') {
      out.push(cur);
      cur = '';
      if (cps[i + 1] === '\n') i += 1;
    } else if ('\n\x0b\x0c\x1c\x1d\x1e\x85  '.includes(c)) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  if (cur !== '') out.push(cur);
  return out;
}
