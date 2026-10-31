// utils/emulators/python/stdlib/tempfile/_pytempfile.js
//
// The parts of Lib/tempfile.py (CPython 3.13) the tempfile demos run, on top
// of the C io port in ../io/_pyio.js:
//   - _RandomNameSequence + the name rule of _mkstemp_inner / mkdtemp:
//     dir / (prefix + 8 random characters + suffix)
//   - SpooledTemporaryFile: BytesIO until a write pushes tell() past
//     max_size (or rollover() is called), then a real temporary file
//   - TemporaryDirectory: a fresh directory whose files vanish on exit
//
// Names are random and the temp directory differs per machine, so the demos
// only show facts that hold everywhere (prefix/suffix kept, 8 random
// characters, exists inside the with block, gone after). Inputs that the
// operating systems treat differently (path separators, characters Windows
// forbids, reserved device names, case-only differences) are outside the
// demo: DemoLimit.
//
// Not a content page (leading underscore): never mapped by the generator.

import { BytesIO, PyFloat, exc, demoLimit, truthy, MAX_BUFFER } from '../io/_pyio.js';

export const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789_';

// next(_RandomNameSequence()): ''.join(rng.choices(characters, k=8))
export function randomName() {
  let s = '';
  for (let i = 0; i < 8; i += 1) s += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  return s;
}

const SAFE = /^[A-Za-z0-9._-]*$/;
// prefix / suffix the demo can reproduce identically on Windows, macOS and Linux
export function checkAffix(value, what) {
  if (typeof value !== 'string' || !SAFE.test(value) || value.length > 40) {
    throw demoLimit(`The demo reproduces ${what} values made of letters, digits, '.', '_' and '-' (up to 40 characters); other characters are treated differently by Windows, macOS and Linux.`);
  }
  if (what === 'suffix' && /\.$/.test(value)) {
    throw demoLimit('Windows drops a trailing dot from file names, so the demo does not reproduce a suffix ending in "."');
  }
  return value;
}

const RESERVED = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/;
// a file name created inside the temporary directory
export function checkFileName(name) {
  if (!/^[a-z0-9._-]+$/.test(name) || name.length > 40 || name === '.' || name === '..' || name.endsWith('.') || RESERVED.test(name)) {
    throw demoLimit("The demo creates files with lowercase names made of letters, digits, '.', '_' and '-' (not ending in '.', not a Windows device name such as con or nul); other names behave differently across operating systems.");
  }
  return name;
}

// The file name mkstemp / NamedTemporaryFile / mkdtemp would create
export function tempName(prefix = 'tmp', suffix = '') {
  return prefix + randomName() + suffix;
}

// a > b for a Python int a (bigint) and an int / bool / float b
function gt(a, b) {
  if (b instanceof PyFloat) return Number(a) > b.f; // a is a small position: exact as a double
  if (typeof b === 'bigint') return a > b;
  if (typeof b === 'boolean') return a > (b ? 1n : 0n);
  throw exc('TypeError', "'>' not supported between instances of 'int' and 'str'");
}

// max_size and file.tell() > max_size
const exceeds = (pos, maxSize) => truthy(maxSize) && gt(pos, maxSize);

// A rolled-over SpooledTemporaryFile writes to a real temporary file
// (BufferedRandom); for write / seek / tell / read that behaves like a
// BytesIO, which is what models it here — except truncate(), which on a real
// file also extends it with zero bytes.
class DiskFile extends BytesIO {
  constructor() {
    super();
    this.pyType = 'BufferedRandom';
  }

  // lseek() refuses a target before the start (BytesIO clamps it to 0)
  seek(offset, whence = 0n) {
    if (typeof offset !== 'bigint' || (whence !== 0n && whence !== 1n && whence !== 2n)) {
      throw demoLimit('The demo seeks real files with an int offset and whence 0, 1 or 2.');
    }
    const base = whence === 0n ? 0n : whence === 1n ? this.pos : BigInt(this.size);
    if (base + offset < 0n) throw exc('OSError', '[Errno 22] Invalid argument');
    return super.seek(base + offset, 0n);
  }

  truncate(size = null) {
    const n = size === null ? this.pos : size;
    if (typeof n !== 'bigint' || n < 0n) throw demoLimit('Truncating a real file to a negative or non-int size gives an OS-specific error message.');
    if (n > BigInt(MAX_BUFFER)) throw demoLimit(`The demo keeps files under ${MAX_BUFFER} bytes.`);
    if (n > BigInt(this.size)) {
      const grown = new Uint8Array(Number(n)); // zero-filled
      grown.set(this.buf.subarray(0, this.size));
      this.buf = grown;
    }
    this.size = Number(n);
    return n;
  }
}

// Lib/tempfile.py SpooledTemporaryFile, binary mode
export class SpooledTemporaryFile {
  constructor(maxSize = 0n) {
    this._file = new BytesIO();
    this._max_size = maxSize;
    this._rolled = false;
  }

  get inMemory() { return this._file instanceof BytesIO && !(this._file instanceof DiskFile); }

  _check(file) {
    if (this._rolled) return;
    if (exceeds(file.tell(), this._max_size)) this.rollover();
  }

  rollover() {
    if (this._rolled) return null;
    const file = this._file;
    const newfile = new DiskFile();
    this._file = newfile;
    const pos = file.tell();
    newfile.write(file.getvalue());
    newfile.seek(pos, 0n);
    this._rolled = true;
    return null;
  }

  write(s) {
    const file = this._file;
    const rv = file.write(s);
    this._check(file);
    return rv;
  }

  truncate(size = null) {
    if (size === null) return this._file.truncate();
    if (gt(size, this._max_size)) this.rollover();
    return this._file.truncate(size);
  }

  seek(...args) { return this._file.seek(...args); }
  tell() { return this._file.tell(); }
  read(...args) { return this._file.read(...args); }
  get closed() { return this._file.closed; }

  enter() {
    if (this._file.closed) throw exc('ValueError', 'Cannot enter context with closed file');
    return this;
  }

  exit() {
    this._file.close();
    return false;
  }
}

// TemporaryDirectory: a directory of plain files that exists only inside the
// with block. Python dict / set semantics: writing the same name twice is
// one file.
export class TemporaryDirectory {
  constructor(prefix = 'tmp', suffix = '') {
    this.basename = tempName(prefix, suffix);
    this.files = new Map();
    this.exists = true;
  }

  writeFile(name, data) {
    this.files.set(checkFileName(name), data);
  }

  // sorted(os.listdir(d)) — ASCII names, so code-unit order is code-point order
  listdir() { return [...this.files.keys()].sort(); }

  cleanup() {
    this.files.clear();
    this.exists = false;
    return null;
  }
}
