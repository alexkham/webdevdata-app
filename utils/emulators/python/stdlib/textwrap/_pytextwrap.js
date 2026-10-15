// utils/emulators/python/stdlib/textwrap/_pytextwrap.js
//
// Port of CPython 3.13's Lib/textwrap.py for the textwrap demos — shared by
// the module hub and the member emulators. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
//   TextWrapper   every option (width, initial_indent, subsequent_indent,
//                 expand_tabs, tabsize, replace_whitespace,
//                 fix_sentence_endings, break_long_words, break_on_hyphens,
//                 drop_whitespace, max_lines, placeholder); _munge_whitespace,
//                 _split, _fix_sentence_endings, _handle_long_word and
//                 _wrap_chunks line by line
//   wrap / fill / shorten / dedent / indent
//
// The regular expressions are textwrap's own pattern strings (built the way
// textwrap.py builds them), run by the port of CPython's sre engine in
// ../re/_pyre.js — so \w, \d and \W are Python's Unicode classes, not
// JavaScript's. Lengths, slices and rfind() count code points, like Python
// str. str.strip() / split() / isspace() use Python's whitespace set
// (Py_UNICODE_ISSPACE), which is wider than the six ASCII characters
// textwrap itself treats as breakable whitespace.
//
// Python value model: str → string, int → number, None → null,
// bool → boolean, list → Array.

import { compile, escape, _internals, SRE_FLAG_VERBOSE, SRE_FLAG_MULTILINE } from '../re/_pyre.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';

const { uniIsSpace } = _internals;

const raise = (type, msg = '') => { throw new PyException(type, msg); };

// Work that would freeze the page is stopped — not a Python exception.
const MAX_TEXT = 20000;
function demoLimit(what) {
  const e = new Error(`the browser demo stops at ${MAX_TEXT.toLocaleString('en-US')} characters of ${what} (CPython would keep going)`);
  e.name = 'DemoLimit';
  throw e;
}
function neverReturns() {
  const e = new Error('CPython never returns for this input: the indent is longer than width, so not even an empty piece of the next chunk fits on the line, and wrap() loops forever (or until memory runs out)');
  e.name = 'DemoLimit';
  throw e;
}

// ─── str helpers (code points, Python whitespace) ────────────────────

const cps = (s) => Array.from(s);
export function pyLen(s) {
  let n = 0;
  // eslint-disable-next-line no-unused-vars
  for (const _ of s) n += 1;
  return n;
}
const isSpaceCh = (ch) => uniIsSpace(ch.codePointAt(0));

export function pyStrip(s) {
  const a = cps(s);
  let i = 0;
  let j = a.length;
  while (i < j && isSpaceCh(a[i])) i += 1;
  while (j > i && isSpaceCh(a[j - 1])) j -= 1;
  return a.slice(i, j).join('');
}
export function pyLstrip(s) {
  const a = cps(s);
  let i = 0;
  while (i < a.length && isSpaceCh(a[i])) i += 1;
  return a.slice(i).join('');
}
export function pyRstrip(s) {
  const a = cps(s);
  let j = a.length;
  while (j > 0 && isSpaceCh(a[j - 1])) j -= 1;
  return a.slice(0, j).join('');
}
// str.isspace(): non-empty and every character whitespace
export function pyIsSpace(s) {
  if (s === '') return false;
  for (const ch of s) if (!isSpaceCh(ch)) return false;
  return true;
}
// str.split() with no arguments
export function pySplitWs(s) {
  const out = [];
  let cur = '';
  for (const ch of s) {
    if (isSpaceCh(ch)) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

// A 'number' demo input as the Python value of the literal the code shows
// (utils/py-num.js): { num, repr, big } — big is the exact BigInt of an
// int, null for a float (1e+21). 'inf' raises NameError right here, as the
// argument is evaluated.
export function numArg(n, suggest) {
  const v = fromLiteral(n, suggest);
  if (v.int !== undefined) return { num: Number(v.int), repr: String(v.int), big: v.int };
  return { num: v.float, repr: pyFloatRepr(v.float), big: null };
}
const INT_MAX = 2147483647n;
const INT_MIN = -2147483648n;

// str.expandtabs(tabsize) — Objects/unicodeobject.c: the column restarts
// after \n and \r; tabsize <= 0 removes tabs. tabsize is a C int.
export function expandtabs(s, tabsize = 8) {
  if (tabsize !== null && typeof tabsize === 'object') {
    if (tabsize.big === null) raise('TypeError', "'float' object cannot be interpreted as an integer");
    if (tabsize.big > INT_MAX || tabsize.big < INT_MIN) raise('OverflowError', 'Python int too large to convert to C int');
    tabsize = tabsize.num;
  }
  let out = '';
  let linePos = 0;
  let size = 0;
  for (const ch of s) {
    if (ch === '\t') {
      if (tabsize > 0) {
        const incr = tabsize - (linePos % tabsize);
        size += incr;
        if (size > MAX_TEXT) demoLimit('expanded text');
        linePos += incr;
        out += ' '.repeat(incr);
      }
    } else {
      linePos += 1;
      size += 1;
      out += ch;
      if (ch === '\n' || ch === '\r') linePos = 0;
    }
  }
  return out;
}

// str.splitlines(keepends): \n \r \r\n \v \f \x1c \x1d \x1e \x85
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
      i = eol;
      start = eol;
    } else i += 1;
  }
  if (start < a.length) out.push(a.slice(start).join(''));
  return out;
}

// ─── TextWrapper ─────────────────────────────────────────────────────

// Hardcode the recognized whitespace characters to the US-ASCII
// whitespace characters (textwrap.py: some Unicode spaces, like U+00A0,
// are non-breaking).
const _whitespace = '\t\n\x0b\x0c\r ';

const word_punct = String.raw`[\w!"\'&.,?]`;
const letter = String.raw`[^\d\W]`;
const whitespace = `[${escape(_whitespace)}]`;
const nowhitespace = '[^' + whitespace.slice(1);

// the verbose pattern, line for line as in textwrap.py (joined with \n so
// the file's own line endings can never leak into the pattern string)
const WORDSEP_LINES = [
  '',
  String.raw`        ( # any whitespace`,
  String.raw`          %(ws)s+`,
  String.raw`        | # em-dash between words`,
  String.raw`          (?<=%(wp)s) -{2,} (?=\w)`,
  String.raw`        | # word, possibly hyphenated`,
  String.raw`          %(nws)s+? (?:`,
  String.raw`            # hyphenated word`,
  String.raw`              -(?: (?<=%(lt)s{2}-) | (?<=%(lt)s-%(lt)s-))`,
  String.raw`              (?= %(lt)s -? %(lt)s)`,
  String.raw`            | # end of word`,
  String.raw`              (?=%(ws)s|\Z)`,
  String.raw`            | # em-dash`,
  String.raw`              (?<=%(wp)s) (?=-{2,}\w)`,
  String.raw`            )`,
  String.raw`        )`,
];
const SUBST = { wp: word_punct, lt: letter, ws: whitespace, nws: nowhitespace };
const WORDSEP_PATTERN = WORDSEP_LINES.join('\n').replace(/%\((\w+)\)s/g, (_, k) => SUBST[k]);

// TextWrapper class attributes
export const unicode_whitespace_trans = new Map(cps(_whitespace).map((c) => [c.codePointAt(0), 32]));
export const wordsep_re = compile(WORDSEP_PATTERN, SRE_FLAG_VERBOSE);
export const wordsep_simple_re = compile(`(${whitespace}+)`);
export const sentence_end_re = compile(
  String.raw`[a-z]` // lowercase letter
  + String.raw`[\.\!\?]` // sentence-ending punct.
  + String.raw`[\"\']?` // optional end-of-quote
  + String.raw`\Z`, // end of chunk
);

// repr(TextWrapper.unicode_whitespace_trans)
export const unicodeWhitespaceTransRepr = () => ({
  __pyRaw: '{' + [...unicode_whitespace_trans].map(([k, v]) => `${k}: ${v}`).join(', ') + '}',
});

const DEFAULTS = {
  width: 70,
  initial_indent: '',
  subsequent_indent: '',
  expand_tabs: true,
  replace_whitespace: true,
  fix_sentence_endings: false,
  break_long_words: true,
  drop_whitespace: true,
  break_on_hyphens: true,
  tabsize: 8,
  max_lines: null,
  placeholder: ' [...]',
};

// Options are Python values: numbers may be plain JS numbers or numArg()
// results (width keeps its exact repr for the error message, tabsize is
// checked as a C int by expandtabs).
export class TextWrapper {
  constructor(options = {}) {
    for (const k of Object.keys(options)) {
      if (!(k in DEFAULTS)) raise('TypeError', `TextWrapper.__init__() got an unexpected keyword argument '${k}'`);
    }
    Object.assign(this, DEFAULTS, options);
    this._widthRepr = null;
    if (this.width !== null && typeof this.width === 'object') {
      this._widthRepr = this.width.repr;
      this.width = this.width.num;
    }
    this._tabsizeArg = this.tabsize;
    if (this.tabsize !== null && typeof this.tabsize === 'object') this.tabsize = this.tabsize.num;
    if (this.max_lines !== null && typeof this.max_lines === 'object') this.max_lines = this.max_lines.num;
  }

  // -- Private methods (possibly useful for subclasses to override) --

  _munge_whitespace(text) {
    if (this.expand_tabs) text = expandtabs(text, this._tabsizeArg);
    if (this.replace_whitespace) {
      let out = '';
      for (const ch of text) out += unicode_whitespace_trans.has(ch.codePointAt(0)) ? ' ' : ch;
      text = out;
    }
    return text;
  }

  _split(text) {
    let chunks;
    // `is True`: only the bool True selects the hyphen-aware regex
    if (this.break_on_hyphens === true) chunks = wordsep_re.split(text);
    else chunks = wordsep_simple_re.split(text);
    return chunks.filter((c) => c);
  }

  _fix_sentence_endings(chunks) {
    let i = 0;
    while (i < chunks.length - 1) {
      if (chunks[i + 1] === ' ' && sentence_end_re.search(chunks[i])) {
        chunks[i + 1] = '  ';
        i += 2;
      } else {
        i += 1;
      }
    }
  }

  _handle_long_word(reversedChunks, curLine, curLen, width) {
    // Figure out when indent is larger than the specified width, and make
    // sure at least one character is stripped off on every pass
    const spaceLeft = width < 1 ? 1 : width - curLen;

    // If we're allowed to break long words, then do so: put as much
    // of the next chunk onto the current line as will fit.
    if (this.break_long_words) {
      let end = spaceLeft;
      const chunk = cps(reversedChunks[reversedChunks.length - 1]);
      if (this.break_on_hyphens && chunk.length > spaceLeft) {
        // break after last hyphen, but only if there are
        // non-hyphens before it
        const hyphen = chunk.slice(0, Math.max(0, spaceLeft)).lastIndexOf('-');
        if (hyphen > 0 && chunk.slice(0, hyphen).some((c) => c !== '-')) end = hyphen + 1;
      }
      curLine.push(chunk.slice(0, end).join(''));
      reversedChunks[reversedChunks.length - 1] = chunk.slice(end).join('');
    } else if (curLine.length === 0) {
      // Otherwise, we have to preserve the long word intact.  Only add
      // it to the current line if there's nothing already there.
      curLine.push(reversedChunks.pop());
    }
    // If we're not allowed to break long words, and there's already
    // text on the current line, do nothing.
  }

  _wrap_chunks(chunks) {
    const lines = [];
    if (this.width <= 0) raise('ValueError', `invalid width ${this._widthRepr ?? String(this.width)} (must be > 0)`);
    if (this.max_lines !== null) {
      const indent = this.max_lines > 1 ? this.subsequent_indent : this.initial_indent;
      if (pyLen(indent) + pyLen(pyLstrip(this.placeholder)) > this.width) {
        raise('ValueError', 'placeholder too large for max width');
      }
    }

    // Arrange in reverse order so items can be efficiently popped
    // from a stack of chucks.
    chunks.reverse();
    const top = () => chunks[chunks.length - 1];

    while (chunks.length) {
      // (emulator only) the loop state is (chunks, lines) and only ever
      // shrinks / grows; an iteration that changes neither repeats forever
      // — CPython 3.13 really hangs there: with an indent longer than
      // width, e.g. wrap(' a', width=1, initial_indent='XX'), the empty
      // rest of ' ' never fits (0 <= -1 is false) and is never consumed
      const before = [chunks.length, top(), lines.length];

      // Start the list of chunks that will make up the current line.
      // curLen is just the length of all the chunks in curLine.
      const curLine = [];
      let curLen = 0;

      // Figure out which static string will prefix this line.
      const indent = lines.length ? this.subsequent_indent : this.initial_indent;

      // Maximum width for this line.
      const width = this.width - pyLen(indent);

      // First chunk on line is whitespace -- drop it, unless this
      // is the very beginning of the text (ie. no lines started yet).
      if (this.drop_whitespace && pyStrip(top()) === '' && lines.length) chunks.pop();

      while (chunks.length) {
        const l = pyLen(top());
        // Can at least squeeze this chunk onto the current line.
        if (curLen + l <= width) {
          curLine.push(chunks.pop());
          curLen += l;
        } else {
          // Nope, this line is full.
          break;
        }
      }

      // The current line is full, and the next chunk is too big to
      // fit on *any* line (not just this one).
      if (chunks.length && pyLen(top()) > width) {
        this._handle_long_word(chunks, curLine, curLen, width);
        curLen = curLine.reduce((n, c) => n + pyLen(c), 0);
      }

      // If the last chunk on this line is all whitespace, drop it.
      if (this.drop_whitespace && curLine.length && pyStrip(curLine[curLine.length - 1]) === '') {
        curLen -= pyLen(curLine[curLine.length - 1]);
        curLine.pop();
      }

      if (curLine.length) {
        if (
          this.max_lines === null
          || lines.length + 1 < this.max_lines
          || ((chunks.length === 0
            || (this.drop_whitespace && chunks.length === 1 && !pyStrip(chunks[0])))
            && curLen <= width)
        ) {
          // Convert current line back to a string and store it in
          // list of all lines (return value).
          lines.push(indent + curLine.join(''));
        } else {
          let placed = false;
          while (curLine.length) {
            if (pyStrip(curLine[curLine.length - 1]) && curLen + pyLen(this.placeholder) <= width) {
              curLine.push(this.placeholder);
              lines.push(indent + curLine.join(''));
              placed = true;
              break;
            }
            curLen -= pyLen(curLine[curLine.length - 1]);
            curLine.pop();
          }
          if (!placed) {
            let done = false;
            if (lines.length) {
              const prevLine = pyRstrip(lines[lines.length - 1]);
              if (pyLen(prevLine) + pyLen(this.placeholder) <= this.width) {
                lines[lines.length - 1] = prevLine + this.placeholder;
                done = true;
              }
            }
            if (!done) lines.push(indent + pyLstrip(this.placeholder));
          }
          break;
        }
      }
      if (chunks.length === before[0] && top() === before[1]) {
        // nothing consumed: the next iteration is the same one again —
        // unless only the line count changed and max_lines will stop it
        if (lines.length === before[2] || (before[2] > 0 && this.max_lines === null)) neverReturns();
      }
      if (lines.length > MAX_TEXT) demoLimit('output (counted in lines)');
    }
    return lines;
  }

  _split_chunks(text) {
    if (typeof text !== 'string') raise('AttributeError', `'${text === null ? 'NoneType' : typeof text}' object has no attribute 'expandtabs'`);
    text = this._munge_whitespace(text);
    if (pyLen(text) > MAX_TEXT) demoLimit('text');
    return this._split(text);
  }

  // -- Public interface --

  wrap(text) {
    const chunks = this._split_chunks(text);
    if (this.fix_sentence_endings) this._fix_sentence_endings(chunks);
    return this._wrap_chunks(chunks);
  }

  fill(text) {
    return this.wrap(text).join('\n');
  }
}

// ─── Convenience interface ───────────────────────────────────────────

export function wrap(text, width = 70, kwargs = {}) {
  return new TextWrapper({ ...kwargs, width }).wrap(text);
}

export function fill(text, width = 70, kwargs = {}) {
  return new TextWrapper({ ...kwargs, width }).fill(text);
}

export function shorten(text, width, kwargs = {}) {
  if ('max_lines' in kwargs) raise('TypeError', "textwrap.TextWrapper() got multiple values for keyword argument 'max_lines'");
  const w = new TextWrapper({ ...kwargs, width, max_lines: 1 });
  return w.fill(pySplitWs(pyStrip(text)).join(' '));
}

// ─── Loosely related functionality ───────────────────────────────────

const _whitespace_only_re = compile('^[ \t]+$', SRE_FLAG_MULTILINE);
const _leading_whitespace_re = compile('(^[ \t]*)(?:[^ \t\n])', SRE_FLAG_MULTILINE);

export function dedent(text) {
  if (pyLen(text) > MAX_TEXT) demoLimit('text');
  // Look for the longest leading string of spaces and tabs common to
  // all lines.
  let margin = null;
  text = _whitespace_only_re.sub('', text);
  const indents = _leading_whitespace_re.findall(text);
  for (const ind of indents) {
    if (margin === null) {
      margin = ind;
    } else if (ind.startsWith(margin)) {
      // Current line more deeply indented than previous winner:
      // no change (previous winner is still on top).
    } else if (margin.startsWith(ind)) {
      // Current line consistent with and no deeper than previous winner:
      // it's the new winner.
      margin = ind;
    } else {
      // Find the largest common whitespace between current line and
      // previous winner.
      const n = Math.min(margin.length, ind.length); // spaces and tabs only
      for (let i = 0; i < n; i++) {
        if (margin[i] !== ind[i]) {
          margin = margin.slice(0, i);
          break;
        }
      }
    }
  }
  if (margin) text = compile('(?m)^' + margin).sub('', text);
  return text;
}

export function indent(text, prefix, predicate = null) {
  if (pyLen(text) > MAX_TEXT) demoLimit('text');
  // default: every line that is not whitespace only (splitlines(True)
  // never produces an empty string)
  const pred = predicate === null ? (s) => !pyIsSpace(s) : predicate;
  let out = '';
  for (const line of splitlines(text, true)) {
    if (pred(line)) out += prefix;
    out += line;
  }
  return out;
}
