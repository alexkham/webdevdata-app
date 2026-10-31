// utils/emulators/python/stdlib/shlex/_pyshlex.js
//
// Port of CPython 3.13's Lib/shlex.py for the shlex demos, shared by the
// shlex hub and member emulators. Not a content page (leading
// underscore): never mapped by the generator.
//
// The shlex class is ported line by line — read_token's state machine
// (' ', 'a', 'c', quote and escape states), get_token with the pushback
// deque, the source/sourcehook inclusion loop and the input-source stack,
// punctuation_chars with its own character pushback, lineno counting,
// the debug prints — so tokens, errors ('No closing quotation', 'No
// escaped character') and lineno are CPython's. split / join / quote are
// the module functions, quote with the same [^\w@%+=:,./-] ASCII test.
//
// Input streams are io.StringIO-like (read(1) / readline() / close());
// a string argument is wrapped exactly like shlex does. sys.stdin and real
// files are not available in the browser: sourcehook reads from an
// optional { name: text } map the demo creates, otherwise it stops with a
// DemoLimit. os.path is posixpath (Linux), as the pages say.

import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { isabs, join as pjoin, dirname as pdirname } from '../os-path/_posixpath.js';

const raise = (type, msg = '') => {
  throw new PyException(type, msg);
};

function demoLimit(msg) {
  const e = new Error(msg);
  e.name = 'DemoLimit';
  throw e;
}

// Python `ch in s` for one character ch and a str s (code points)
function has(s, ch) {
  if (typeof s !== 'string') {
    if (Array.isArray(s)) return s.includes(ch);
    raise('TypeError', `argument of type '${s === null ? 'NoneType' : typeof s}' is not iterable`);
  }
  if (ch.length === 1 && !/[\uD800-\uDFFF]/.test(ch)) return s.includes(ch);
  return Array.from(s).includes(ch);
}

const repr = (v) => (v === null ? 'None' : typeof v === 'string' ? pyStrRepr(v) : String(v));

// io.StringIO(text) with the default newline='\n' (no translation)
export class StringIO {
  constructor(text = '') {
    this.chars = Array.from(text);
    this.pos = 0;
    this.closed = false;
  }

  check() {
    if (this.closed) raise('ValueError', 'I/O operation on closed file');
  }

  read(n) {
    this.check();
    const out = this.chars.slice(this.pos, this.pos + n).join('');
    this.pos = Math.min(this.pos + n, this.chars.length);
    return out;
  }

  readline() {
    this.check();
    let out = '';
    while (this.pos < this.chars.length) {
      const c = this.chars[this.pos];
      this.pos += 1;
      out += c;
      if (c === '\n') break;
    }
    return out;
  }

  close() {
    this.closed = true;
  }
}

export class Shlex {
  // shlex.shlex(instream=None, infile=None, posix=False, punctuation_chars=False)
  // opts.files: { name: text } for sourcehook's open(); opts.stdout: array
  // that receives the debug prints
  constructor(instream = null, infile = null, posix = false, punctuationChars = false, opts = {}) {
    if (typeof instream === 'string') instream = new StringIO(instream);
    if (instream !== null) {
      this.instream = instream;
      this.infile = infile;
    } else {
      demoLimit('Without instream, shlex reads sys.stdin — there is no keyboard input in the browser demo.');
    }
    this.files = opts.files || null;
    this.stdout = opts.stdout || [];
    this.posix = posix;
    this.eof = posix ? null : '';
    this.commenters = '#';
    this.wordchars = 'abcdfeghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    if (this.posix) {
      this.wordchars += 'ßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ';
    }
    this.whitespace = ' \t\r\n';
    this.whitespace_split = false;
    this.quotes = '\'"';
    this.escape = '\\';
    this.escapedquotes = '"';
    this.state = ' ';
    this.pushback = []; // deque: index 0 is the left end
    this.lineno = 1;
    this.debug = 0;
    this.token = '';
    this.filestack = [];
    this.source = null;
    if (!punctuationChars) punctuationChars = '';
    else if (punctuationChars === true) punctuationChars = '();<>|&';
    if (typeof punctuationChars !== 'string') demoLimit('The demo takes punctuation_chars as True, False or a str.');
    this._punctuation_chars = punctuationChars;
    if (punctuationChars) {
      // _pushback_chars is a push back queue used by lookahead logic
      this._pushback_chars = [];
      // these chars added because allowed in file names, args, wildcards
      this.wordchars += '~-./*?=';
      // remove any punctuation chars from wordchars
      const drop = new Set(Array.from(punctuationChars));
      this.wordchars = Array.from(this.wordchars).filter((c) => !drop.has(c)).join('');
    }
  }

  get punctuation_chars() {
    return this._punctuation_chars;
  }

  print(line) {
    this.stdout.push(line);
  }

  push_token(tok) {
    if (this.debug >= 1) this.print('shlex: pushing token ' + repr(tok));
    this.pushback.unshift(tok);
  }

  push_source(newstream, newfile = null) {
    if (typeof newstream === 'string') newstream = new StringIO(newstream);
    this.filestack.unshift([this.infile, this.instream, this.lineno]);
    this.infile = newfile;
    this.instream = newstream;
    this.lineno = 1;
    if (this.debug) {
      if (newfile !== null) this.print(`shlex: pushing to file ${newfile}`);
      else demoLimit('With debug on, push_source prints the stream object, whose repr contains a memory address.');
    }
  }

  pop_source() {
    this.instream.close();
    if (this.filestack.length === 0) raise('IndexError', 'pop from an empty deque');
    [this.infile, this.instream, this.lineno] = this.filestack.shift();
    if (this.debug) demoLimit('With debug on, pop_source prints the stream object, whose repr contains a memory address.');
    this.state = ' ';
  }

  get_token() {
    if (this.pushback.length) {
      const tok = this.pushback.shift();
      if (this.debug >= 1) this.print('shlex: popping token ' + repr(tok));
      return tok;
    }
    // No pushback.  Get a token.
    let raw = this.read_token();
    // Handle inclusions
    if (this.source !== null) {
      while (raw === this.source) {
        const spec = this.sourcehook(this.read_token());
        if (spec) {
          const [newfile, newstream] = spec;
          this.push_source(newstream, newfile);
        }
        raw = this.get_token();
      }
    }
    // Maybe we got EOF instead?
    while (raw === this.eof) {
      if (this.filestack.length === 0) return this.eof;
      this.pop_source();
      raw = this.get_token();
    }
    // Neither inclusion nor EOF
    if (this.debug >= 1) {
      if (raw !== this.eof) this.print('shlex: token=' + repr(raw));
      else this.print('shlex: token=EOF');
    }
    return raw;
  }

  read_token() {
    let quoted = false;
    let escapedstate = ' ';
    for (;;) {
      let nextchar;
      if (this.punctuation_chars && this._pushback_chars.length) nextchar = this._pushback_chars.pop();
      else nextchar = this.instream.read(1);
      if (nextchar === '\n') this.lineno += 1;
      if (this.debug >= 3) this.print(`shlex: in state ${repr(this.state)} I see character: ${repr(nextchar)}`);
      if (this.state === null) {
        this.token = ''; // past end of file
        break;
      } else if (this.state === ' ') {
        if (!nextchar) {
          this.state = null; // end of file
          break;
        } else if (has(this.whitespace, nextchar)) {
          if (this.debug >= 2) this.print('shlex: I see whitespace in whitespace state');
          if (this.token || (this.posix && quoted)) break; // emit current token
          else continue;
        } else if (has(this.commenters, nextchar)) {
          this.instream.readline();
          this.lineno += 1;
        } else if (this.posix && has(this.escape, nextchar)) {
          escapedstate = 'a';
          this.state = nextchar;
        } else if (has(this.wordchars, nextchar)) {
          this.token = nextchar;
          this.state = 'a';
        } else if (has(this.punctuation_chars, nextchar)) {
          this.token = nextchar;
          this.state = 'c';
        } else if (has(this.quotes, nextchar)) {
          if (!this.posix) this.token = nextchar;
          this.state = nextchar;
        } else if (this.whitespace_split) {
          this.token = nextchar;
          this.state = 'a';
        } else {
          this.token = nextchar;
          if (this.token || (this.posix && quoted)) break; // emit current token
          else continue;
        }
      } else if (has(this.quotes, this.state)) {
        quoted = true;
        if (!nextchar) {
          // end of file
          if (this.debug >= 2) this.print('shlex: I see EOF in quotes state');
          raise('ValueError', 'No closing quotation');
        }
        if (nextchar === this.state) {
          if (!this.posix) {
            this.token += nextchar;
            this.state = ' ';
            break;
          } else {
            this.state = 'a';
          }
        } else if (this.posix && has(this.escape, nextchar) && has(this.escapedquotes, this.state)) {
          escapedstate = this.state;
          this.state = nextchar;
        } else {
          this.token += nextchar;
        }
      } else if (has(this.escape, this.state)) {
        if (!nextchar) {
          // end of file
          if (this.debug >= 2) this.print('shlex: I see EOF in escape state');
          raise('ValueError', 'No escaped character');
        }
        // In posix shells, only the quote itself or the escape
        // character may be escaped within quotes.
        if (has(this.quotes, escapedstate) && nextchar !== this.state && nextchar !== escapedstate) {
          this.token += this.state;
        }
        this.token += nextchar;
        this.state = escapedstate;
      } else if (this.state === 'a' || this.state === 'c') {
        if (!nextchar) {
          this.state = null; // end of file
          break;
        } else if (has(this.whitespace, nextchar)) {
          if (this.debug >= 2) this.print('shlex: I see whitespace in word state');
          this.state = ' ';
          if (this.token || (this.posix && quoted)) break; // emit current token
          else continue;
        } else if (has(this.commenters, nextchar)) {
          this.instream.readline();
          this.lineno += 1;
          if (this.posix) {
            this.state = ' ';
            if (this.token || (this.posix && quoted)) break; // emit current token
            else continue;
          }
        } else if (this.state === 'c') {
          if (has(this.punctuation_chars, nextchar)) {
            this.token += nextchar;
          } else {
            if (!has(this.whitespace, nextchar)) this._pushback_chars.push(nextchar);
            this.state = ' ';
            break;
          }
        } else if (this.posix && has(this.quotes, nextchar)) {
          this.state = nextchar;
        } else if (this.posix && has(this.escape, nextchar)) {
          escapedstate = 'a';
          this.state = nextchar;
        } else if (has(this.wordchars, nextchar) || has(this.quotes, nextchar)
          || (this.whitespace_split && !has(this.punctuation_chars, nextchar))) {
          this.token += nextchar;
        } else {
          if (this.punctuation_chars) this._pushback_chars.push(nextchar);
          else this.pushback.unshift(nextchar);
          if (this.debug >= 2) this.print('shlex: I see punctuation in word state');
          this.state = ' ';
          if (this.token || (this.posix && quoted)) break; // emit current token
          else continue;
        }
      }
    }
    let result = this.token;
    this.token = '';
    if (this.posix && !quoted && result === '') result = null;
    if (this.debug > 1) {
      if (result) this.print('shlex: raw token=' + repr(result));
      else this.print('shlex: raw token=EOF');
    }
    return result;
  }

  sourcehook(newfile) {
    if (newfile === null) raise('TypeError', "'NoneType' object is not subscriptable");
    if (newfile === '') raise('IndexError', 'string index out of range');
    if (newfile[0] === '"') newfile = Array.from(newfile).slice(1, -1).join('');
    // This implements cpp-like semantics for relative-path inclusion.
    if (typeof this.infile === 'string' && !isabs(newfile)) newfile = pjoin(pdirname(this.infile), newfile);
    return [newfile, this.open(newfile)];
  }

  // open(newfile, "r")
  open(name) {
    if (!this.files) demoLimit('sourcehook opens a real file; this demo only has the files its snippet creates.');
    if (!Object.prototype.hasOwnProperty.call(this.files, name)) {
      raise('FileNotFoundError', `[Errno 2] No such file or directory: ${pyStrRepr(name)}`);
    }
    return new StringIO(this.files[name]);
  }

  error_leader(infile = null, lineno = null) {
    if (infile === null) infile = this.infile;
    if (lineno === null) lineno = this.lineno;
    return `"${infile === null ? 'None' : infile}", line ${lineno}: `;
  }

  // iter(lexer): get_token() until the eof value
  * [Symbol.iterator]() {
    for (;;) {
      const token = this.get_token();
      if (token === this.eof) return;
      yield token;
    }
  }

  // next(lexer)
  next() {
    const token = this.get_token();
    if (token === this.eof) raise('StopIteration');
    return token;
  }
}

// shlex.split(s, comments=False, posix=True)
export function split(s, comments = false, posix = true) {
  if (s === null || s === undefined) raise('ValueError', 's argument must not be None');
  const lex = new Shlex(s, null, posix);
  lex.whitespace_split = true;
  if (!comments) lex.commenters = '';
  return [...lex];
}

const UNSAFE = /[^A-Za-z0-9_@%+=:,./-]/;

// shlex.quote(s)
export function quote(s) {
  if (typeof s !== 'string') demoLimit('The demo quotes str values.');
  if (!s) return "''";
  if (!UNSAFE.test(s)) return s;
  // use single quotes, and put single quotes into double quotes
  // the string $'b is then quoted as '$'"'"'b'
  return "'" + s.replaceAll("'", "'\"'\"'") + "'";
}

// shlex.join(split_command)
export function join(splitCommand) {
  return splitCommand.map(quote).join(' ');
}
