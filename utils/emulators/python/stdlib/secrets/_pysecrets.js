// utils/emulators/python/stdlib/secrets/_pysecrets.js
//
// Port of CPython 3.13's Lib/secrets.py (and the random.SystemRandom it is
// built on) for the secrets demos. The randomness comes from the browser's
// crypto.getRandomValues (the Web Crypto CSPRNG), standing in for
// os.urandom — so, exactly like Python, every value differs on every run.
// Demos therefore only show facts that hold for every draw (lengths,
// alphabets, ranges, error messages); the functions below still really
// generate tokens and picks, so those facts are computed, not assumed.
// Not a content page (leading underscore).
//
// Value model: int → BigInt (integral JS numbers are accepted as ints),
// float → non-integral JS number, str → string, bytes → Uint8Array,
// list → JS array, None → null.

import { PyException } from '../../../../py-exceptions.js';
import { urlsafeB64encode, toAscii } from '../base64/_pybase64.js';
import { PyRandom } from '../random/_pyrandom.js';
import { PyFloat, numArg } from '../hashlib/_pyhashlib.js';

// numArg: a number typed into a demo as CPython reads its literal (int →
// BigInt, '1e+21' → PyFloat, inf → NameError) — see _pyhashlib.js
export { PyFloat, numArg };

const raise = (type, msg = '') => { throw new PyException(type, msg); };

function demoLimit(msg) {
  const e = new Error(`${msg} — run it in Python`);
  e.name = 'DemoLimit';
  throw e;
}

// secrets.DEFAULT_ENTROPY (bytes of randomness when nbytes is None)
export const DEFAULT_ENTROPY = 32;
const MAX_BYTES = 1 << 22;

export const pyTypeName = (v) => {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof Uint8Array) return 'bytes';
  if (Array.isArray(v)) return 'list';
  if (v && v.__pySet) return 'set';
  return 'object';
};
const isInt = (v) => typeof v === 'bigint' || typeof v === 'boolean' || (typeof v === 'number' && Number.isInteger(v));
const isNum = (v) => isInt(v) || typeof v === 'number' || v instanceof PyFloat;
const toBig = (v) => (typeof v === 'bigint' ? v : BigInt(Number(v)));

// operator.index(), as used by os.urandom's size argument
function index(v) {
  if (isInt(v)) return toBig(v);
  return raise('TypeError', `'${pyTypeName(v)}' object cannot be interpreted as an integer`);
}

// Python's < / <= between a value and the int 0, for the guards in
// random.py / secrets.py ("if k < 0", "if exclusive_upper_bound <= 0")
function belowZero(v, op) {
  if (!isNum(v)) raise('TypeError', `'${op}' not supported between instances of '${pyTypeName(v)}' and 'int'`);
  const x = typeof v === 'boolean' ? Number(v) : v instanceof PyFloat ? v.value : v;
  return op === '<' ? x < 0 : x <= 0;
}

// os.urandom(n)
export function urandom(n) {
  const k = index(n);
  if (k < 0n) raise('ValueError', 'negative argument not allowed');
  if (k > BigInt(MAX_BYTES)) demoLimit(`${k} random bytes is too many for the in-browser demo`);
  const out = new Uint8Array(Number(k));
  for (let i = 0; i < out.length; i += 65536) crypto.getRandomValues(out.subarray(i, Math.min(out.length, i + 65536)));
  return out;
}

const nbytesOf = (n) => (n === null || n === undefined ? DEFAULT_ENTROPY : n);

// secrets.token_bytes / token_hex / token_urlsafe
// (a JS number argument is a demo input: read as its Python literal)
export const tokenBytes = (n = null) => urandom(nbytesOf(numArg(n)));
export function tokenHex(n = null) {
  let s = '';
  for (const x of tokenBytes(n)) s += (x < 16 ? '0' : '') + x.toString(16);
  return s;
}
export function tokenUrlsafe(n = null) {
  const tok = Array.from(tokenBytes(n));
  return toAscii(urlsafeB64encode(tok)).replace(/=+$/, '');
}

// random.SystemRandom.getrandbits(k):
//   if k < 0: raise ValueError; numbytes = (k + 7) // 8
//   int.from_bytes(_urandom(numbytes)) >> (numbytes * 8 - k)
export function randbits(k) {
  if (belowZero(k, '<')) raise('ValueError', 'number of bits must be non-negative');
  // a float k gets this far; (k + 7) // 8 is then a float, which urandom rejects
  if (!isInt(k)) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const kb = toBig(k);
  if (kb > 1n << 20n) demoLimit(`${kb} random bits is too many for the in-browser demo`);
  const nb = (kb + 7n) / 8n;
  let x = 0n;
  for (const b of urandom(nb)) x = (x << 8n) | BigInt(b);
  return x >> (nb * 8n - kb);
}

// Random._randbelow_with_getrandbits(n): k = n.bit_length(); draw k bits
// until the value is below n
function randbelowRaw(n) {
  const k = BigInt(n.toString(2).length);
  let r = randbits(k);
  while (r >= n) r = randbits(k);
  return r;
}

// secrets.randbelow(exclusive_upper_bound)
export function randbelow(n) {
  if (belowZero(n, '<=')) raise('ValueError', 'Upper bound must be positive.');
  if (!isInt(n)) raise('AttributeError', "'float' object has no attribute 'bit_length'");
  return randbelowRaw(toBig(n));
}

// secrets.choice(seq) = SystemRandom().choice: len(seq), then seq[i].
// seq: a string (str), array (list) or Uint8Array (bytes → int items)
export function choice(seq) {
  let items;
  if (typeof seq === 'string') items = [...seq];
  else if (Array.isArray(seq)) items = seq;
  else if (seq instanceof Uint8Array) items = Array.from(seq, (b) => BigInt(b));
  else if (seq && seq.__pySet) {
    if (seq.__pySet.length === 0) raise('IndexError', 'Cannot choose from an empty sequence');
    raise('TypeError', "'set' object is not subscriptable");
  } else raise('TypeError', `object of type '${pyTypeName(seq)}' has no len()`);
  if (items.length === 0) raise('IndexError', 'Cannot choose from an empty sequence');
  return items[Number(randbelowRaw(BigInt(items.length)))];
}

// secrets.compare_digest(a, b) = hmac.compare_digest (_hashlib.compare_digest
// with OpenSSL, else _operator._compare_digest — same rules and messages):
// str (ASCII only) on both sides, or bytes-like on both sides
const isBuf = (v) => v instanceof Uint8Array;
export function compareDigest(a, b) {
  if (typeof a === 'string' && typeof b === 'string') {
    // eslint-disable-next-line no-control-regex
    if (/[^\x00-\x7f]/.test(a) || /[^\x00-\x7f]/.test(b)) {
      raise('TypeError', 'comparing strings with non-ASCII characters is not supported');
    }
    return a === b;
  }
  if (!isBuf(a) && !isBuf(b)) {
    raise('TypeError', `unsupported operand types(s) or combination of types: '${pyTypeName(a)}' and '${pyTypeName(b)}'`);
  }
  if (!isBuf(a)) raise('TypeError', `a bytes-like object is required, not '${pyTypeName(a)}'`);
  if (!isBuf(b)) raise('TypeError', `a bytes-like object is required, not '${pyTypeName(b)}'`);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

// random.SystemRandom: Random with random(), getrandbits() and randbytes()
// drawn from os.urandom, seed() a no-op and no state. Every other method
// (randint, choice, shuffle, sample, uniform, gauss, …) is Random's own
// code running on these two primitives — the random engine's PyRandom.
export class SystemRandom extends PyRandom {
  // (int.from_bytes(_urandom(7)) >> 3) * RECIP_BPF
  random() {
    let x = 0n;
    for (const b of urandom(7)) x = (x << 8n) | BigInt(b);
    return Number(x >> 3n) * 2 ** -53;
  }

  getrandbits(k) { return randbits(k); }

  randbytes(n) { return urandom(n); }

  // "Stub method. Not used for a system random number generator."
  seed() { return null; }

  getstate() { return raise('NotImplementedError', 'System entropy source does not have state.'); }

  setstate() { return raise('NotImplementedError', 'System entropy source does not have state.'); }
}
