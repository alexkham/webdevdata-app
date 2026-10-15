// utils/emulators/python/stdlib/hashlib/_pyhashlib.js
//
// Port of CPython 3.13's hashlib for the hashlib demos (and the HMAC demo
// on the secrets.compare_digest page): every guaranteed algorithm, the
// hash-object API, hashlib.new name resolution, pbkdf2_hmac, scrypt and
// file_digest, plus hmac.new (RFC 2104). Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// Algorithms
//   md5, sha1        → imported from the uuid engine (RFC 1321 / FIPS 180-4)
//   sha512           → imported from the random engine (FIPS 180-4, BigInt)
//   sha224, sha256   → 32-bit SHA-2 core below
//   sha384           → 64-bit SHA-2 core below (hi/lo Int32 words). The
//                      same core also runs SHA-512 inside the HMAC loops of
//                      pbkdf2_hmac / scrypt, where the BigInt version would
//                      be ~100x too slow; both are fuzzed bit-identical.
//   sha3_*, shake_*  → Keccak-f[1600] sponge (FIPS 202)
//   blake2b, blake2s → RFC 7693 with CPython's full parameter block
//                      (key, salt, person, digest_size and the tree params)
// Every constant table is computed from its definition (cube / square
// roots of primes, the Keccak LFSR and rotation walk), not typed in.
//
// Value model: bytes are Uint8Array; str inputs are encoded by the caller
// (utf8). Errors are PyExceptions named as a traceback's last line shows
// them. Work that would freeze the page throws a DemoLimit error instead.

import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';
import { md5 as md5Digest, sha1 as sha1Digest, utf8, bytesRepr } from '../uuid/_pyuuid.js';
import { sha512 as sha512Digest } from '../random/_pyrandom.js';

export { utf8, bytesRepr };

const raise = (type, msg = '') => { throw new PyException(type, msg); };

// A Python float that holds an integral value (1e+21 typed as a number):
// it must still be rejected wherever CPython wants an int.
export class PyFloat {
  constructor(value) { this.value = value; }
}
// A number typed into a demo, as CPython reads the literal the code shows:
// '16' → int (BigInt, exact even beyond 2**53), '1e+21' → float, and
// inf → NameError (it is not a literal). Call it on every number argument,
// in the order the literals appear in the code.
export function numArg(v) {
  if (typeof v !== 'number') return v;
  const n = fromLiteral(v);
  return n.int !== undefined ? n.int : new PyFloat(n.float);
}

export function demoLimit(msg) {
  const e = new Error(`${msg} — run it in Python`);
  e.name = 'DemoLimit';
  throw e;
}

// ── helpers ──────────────────────────────────────────────────
export const hex = (b) => {
  let s = '';
  for (const x of b) s += (x < 16 ? '0' : '') + x.toString(16);
  return s;
};
export const asBytes = (b) => ({ __pyRaw: bytesRepr(b) });

function concat(chunks, total) {
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return out;
}

const isBytes = (v) => v instanceof Uint8Array || Array.isArray(v);
const toU8 = (v) => (v instanceof Uint8Array ? v : Uint8Array.from(v));
function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (v instanceof PyFloat) return 'float';
  if (isBytes(v)) return 'bytes';
  return 'object';
}
// argument clinic's "must be X, not Y" names None as 'None', not 'NoneType'
const clinicTypeName = (v) => (v === null || v === undefined ? 'None' : pyTypeName(v));
const isPyInt = (v) => typeof v === 'bigint' || typeof v === 'boolean' || (typeof v === 'number' && Number.isInteger(v));

// data argument of the constructors and update()
function hashData(v) {
  if (isBytes(v)) return toU8(v);
  if (typeof v === 'string') raise('TypeError', 'Strings must be encoded before hashing');
  return raise('TypeError', 'object supporting the buffer API required');
}
// Py_buffer arguments (keys, salts, passwords)
function bufferArg(v) {
  if (isBytes(v)) return toU8(v);
  return raise('TypeError', `a bytes-like object is required, not '${pyTypeName(v)}'`);
}

// int arguments (Python ints arrive as BigInt or integral numbers) → BigInt,
// with the TypeError of operator.index() for anything else
function pyIndex(v) {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'boolean') return v ? 1n : 0n;
  if (typeof v === 'number' && Number.isInteger(v)) return BigInt(v);
  return raise('TypeError', `'${pyTypeName(v)}' object cannot be interpreted as an integer`);
}
// C integer conversions of argument clinic. The C long / unsigned long
// widths are those of Linux and macOS (64 bits); on Windows, where both are
// 32 bits, values from 2**31 (long) / 2**32 (unsigned long) up already fail
// here with the same message instead of reaching the range checks below.
const LONG_MAX = (1n << 63n) - 1n;
function cLong(v) {
  const b = pyIndex(v);
  if (b > LONG_MAX || b < -LONG_MAX - 1n) raise('OverflowError', 'Python int too large to convert to C long');
  return b;
}
function cInt(v) {
  const b = pyIndex(v);
  if (b > 2147483647n || b < -2147483648n) raise('OverflowError', 'Python int too large to convert to C int');
  return Number(b);
}

// ── integer roots for the constant tables ────────────────────
function iroot(n, k) {
  // floor(n ** (1/k)) for BigInt n >= 0
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / k) + 1);
  const kb = BigInt(k);
  for (;;) {
    const y = ((kb - 1n) * x + n / x ** (kb - 1n)) / kb;
    if (y >= x) break;
    x = y;
  }
  while (x ** kb > n) x -= 1n;
  while ((x + 1n) ** kb <= n) x += 1n;
  return x;
}
const PRIMES = (() => {
  const out = [];
  for (let n = 2; out.length < 80; n += 1) if (out.every((p) => n % p !== 0)) out.push(n);
  return out;
})();
const M32 = 0xffffffffn;
const M64 = (1n << 64n) - 1n;
// SHA-2 constants: fractional parts of cube roots (K) / square roots (H)
const K256 = Int32Array.from(PRIMES.slice(0, 64), (p) => Number(iroot(BigInt(p) << 96n, 3) & M32));
const H256 = Int32Array.from(PRIMES.slice(0, 8), (p) => Number(iroot(BigInt(p) << 64n, 2) & M32));
// SHA-224: the second 32 bits of the square roots of the 9th..16th primes
const H224 = Int32Array.from(PRIMES.slice(8, 16), (p) => Number(iroot(BigInt(p) << 128n, 2) & M32));
const split64 = (list) => {
  const out = new Int32Array(list.length * 2);
  list.forEach((v, i) => { out[2 * i] = Number(v >> 32n); out[2 * i + 1] = Number(v & M32); });
  return out;
};
const K512 = split64(PRIMES.map((p) => iroot(BigInt(p) << 192n, 3) & M64));
const H512 = split64(PRIMES.slice(0, 8).map((p) => iroot(BigInt(p) << 128n, 2) & M64));
const H384 = split64(PRIMES.slice(8, 16).map((p) => iroot(BigInt(p) << 128n, 2) & M64));

// ── Merkle–Damgård driver (SHA-2) ────────────────────────────
// state: { h, buf, n (bytes in buf), total (bytes hashed) }
function mdAlgo({ name, digestSize, blockSize, iv, compress, lenBytes, outWords }) {
  return {
    name, digestSize, blockSize,
    init: () => ({ h: iv.slice(), buf: new Uint8Array(blockSize), n: 0, total: 0 }),
    clone: (s) => ({ h: s.h.slice(), buf: s.buf.slice(), n: s.n, total: s.total }),
    update(s, data) {
      let i = 0;
      const len = data.length;
      s.total += len;
      if (s.n > 0) {
        const take = Math.min(blockSize - s.n, len);
        s.buf.set(data.subarray(i, i + take), s.n);
        s.n += take;
        i += take;
        if (s.n === blockSize) { compress(s.h, s.buf, 0); s.n = 0; }
      }
      for (; i + blockSize <= len; i += blockSize) compress(s.h, data, i);
      if (i < len) { s.buf.set(data.subarray(i), 0); s.n = len - i; }
    },
    final(s0) {
      const s = this.clone(s0);
      const bits = s.total * 8;
      const pad = new Uint8Array(((s.n + 1 + lenBytes + blockSize - 1) / blockSize | 0) * blockSize);
      pad.set(s.buf.subarray(0, s.n));
      pad[s.n] = 0x80;
      const hi = Math.floor(bits / 4294967296);
      const lo = bits >>> 0;
      const e = pad.length;
      pad[e - 8] = hi >>> 24; pad[e - 7] = (hi >>> 16) & 255; pad[e - 6] = (hi >>> 8) & 255; pad[e - 5] = hi & 255;
      pad[e - 4] = lo >>> 24; pad[e - 3] = (lo >>> 16) & 255; pad[e - 2] = (lo >>> 8) & 255; pad[e - 1] = lo & 255;
      for (let i = 0; i < pad.length; i += blockSize) compress(s.h, pad, i);
      const out = new Uint8Array(digestSize);
      for (let i = 0; i < digestSize; i += 1) {
        const w = s.h[i >> 2];
        out[i] = (w >>> (24 - 8 * (i & 3))) & 255;
      }
      return out;
    },
  };
}

const W256 = new Int32Array(64);
function compress256(h, b, off) {
  const w = W256;
  for (let t = 0; t < 16; t += 1) {
    const p = off + 4 * t;
    w[t] = (b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3];
  }
  for (let t = 16; t < 64; t += 1) {
    const x = w[t - 15];
    const y = w[t - 2];
    const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
    const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
    w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
  }
  let a = h[0], bb = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
  for (let t = 0; t < 64; t += 1) {
    const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
    const ch = (e & f) ^ (~e & g);
    const T1 = (hh + S1 + ch + K256[t] + w[t]) | 0;
    const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
    const maj = (a & bb) ^ (a & c) ^ (bb & c);
    const T2 = (S0 + maj) | 0;
    hh = g; g = f; f = e; e = (d + T1) | 0; d = c; c = bb; bb = a; a = (T1 + T2) | 0;
  }
  h[0] = (h[0] + a) | 0; h[1] = (h[1] + bb) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
  h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
}

// 64-bit words as (hi, lo) Int32 pairs
const W512 = new Int32Array(160);
function compress512(H, b, off) {
  const W = W512;
  for (let t = 0; t < 32; t += 1) {
    const p = off + 4 * t;
    W[t] = (b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3];
  }
  for (let t = 16; t < 80; t += 1) {
    const xh = W[2 * (t - 15)], xl = W[2 * (t - 15) + 1];
    const s0h = ((xh >>> 1) | (xl << 31)) ^ ((xh >>> 8) | (xl << 24)) ^ (xh >>> 7);
    const s0l = ((xl >>> 1) | (xh << 31)) ^ ((xl >>> 8) | (xh << 24)) ^ ((xl >>> 7) | (xh << 25));
    const yh = W[2 * (t - 2)], yl = W[2 * (t - 2) + 1];
    const s1h = ((yh >>> 19) | (yl << 13)) ^ ((yl >>> 29) | (yh << 3)) ^ (yh >>> 6);
    const s1l = ((yl >>> 19) | (yh << 13)) ^ ((yh >>> 29) | (yl << 3)) ^ ((yl >>> 6) | (yh << 26));
    const lo = (s1l >>> 0) + (W[2 * (t - 7) + 1] >>> 0) + (s0l >>> 0) + (W[2 * (t - 16) + 1] >>> 0);
    W[2 * t] = s1h + W[2 * (t - 7)] + s0h + W[2 * (t - 16)] + Math.floor(lo / 4294967296);
    W[2 * t + 1] = lo;
  }
  let ah = H[0], al = H[1], bh = H[2], bl = H[3], ch = H[4], cl = H[5], dh = H[6], dl = H[7];
  let eh = H[8], el = H[9], fh = H[10], fl = H[11], gh = H[12], gl = H[13], hh = H[14], hl = H[15];
  for (let t = 0; t < 80; t += 1) {
    const S1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
    const S1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));
    const chh = (eh & fh) ^ (~eh & gh);
    const chl = (el & fl) ^ (~el & gl);
    const t1l = (hl >>> 0) + (S1l >>> 0) + (chl >>> 0) + (K512[2 * t + 1] >>> 0) + (W[2 * t + 1] >>> 0);
    const t1h = (hh + S1h + chh + K512[2 * t] + W[2 * t] + Math.floor(t1l / 4294967296)) | 0;
    const T1l = t1l >>> 0;
    const S0h = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
    const S0l = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));
    const mjh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
    const mjl = (al & bl) ^ (al & cl) ^ (bl & cl);
    const t2l = (S0l >>> 0) + (mjl >>> 0);
    const t2h = (S0h + mjh + Math.floor(t2l / 4294967296)) | 0;
    hh = gh; hl = gl; gh = fh; gl = fl; fh = eh; fl = el;
    const el2 = (dl >>> 0) + T1l;
    eh = (dh + t1h + Math.floor(el2 / 4294967296)) | 0; el = el2 | 0;
    dh = ch; dl = cl; ch = bh; cl = bl; bh = ah; bl = al;
    const al2 = T1l + (t2l >>> 0);
    ah = (t1h + t2h + Math.floor(al2 / 4294967296)) | 0; al = al2 | 0;
  }
  const v = [ah, al, bh, bl, ch, cl, dh, dl, eh, el, fh, fl, gh, gl, hh, hl];
  for (let i = 0; i < 16; i += 2) {
    const lo = (H[i + 1] >>> 0) + (v[i + 1] >>> 0);
    H[i] = H[i] + v[i] + Math.floor(lo / 4294967296);
    H[i + 1] = lo;
  }
}

const SHA224 = mdAlgo({ name: 'sha224', digestSize: 28, blockSize: 64, iv: H224, compress: compress256, lenBytes: 8 });
const SHA256 = mdAlgo({ name: 'sha256', digestSize: 32, blockSize: 64, iv: H256, compress: compress256, lenBytes: 8 });
const SHA384 = mdAlgo({ name: 'sha384', digestSize: 48, blockSize: 128, iv: H384, compress: compress512, lenBytes: 16 });
// SHA-512 on the Int32 core: used only inside HMAC loops (see header)
const SHA512_FAST = mdAlgo({ name: 'sha512', digestSize: 64, blockSize: 128, iv: H512, compress: compress512, lenBytes: 16 });

// ── one-shot algorithms imported from other engines ──────────
function buffered(name, digestSize, blockSize, oneShot) {
  return {
    name, digestSize, blockSize,
    init: () => ({ chunks: [], total: 0 }),
    clone: (s) => ({ chunks: s.chunks.slice(), total: s.total }),
    update(s, data) { if (data.length) { s.chunks.push(data.slice()); s.total += data.length; } },
    final: (s) => oneShot(concat(s.chunks, s.total)),
  };
}
const MD5 = buffered('md5', 16, 64, md5Digest);
const SHA1 = buffered('sha1', 20, 64, sha1Digest);
const SHA512 = buffered('sha512', 64, 128, sha512Digest);

// ── Keccak-f[1600] (FIPS 202) ────────────────────────────────
// lanes as (lo, hi) Int32 pairs: lane i = (L[2i], L[2i + 1])
const RC = (() => {
  const out = new Int32Array(48);
  let lfsr = 1;
  for (let round = 0; round < 24; round += 1) {
    for (let j = 0; j < 7; j += 1) {
      const bit = lfsr & 1;
      lfsr = (lfsr & 0x80) ? ((lfsr << 1) ^ 0x71) & 0xff : (lfsr << 1) & 0xff;
      if (bit) {
        const pos = (1 << j) - 1;
        if (pos < 32) out[2 * round] |= 1 << pos;
        else out[2 * round + 1] |= 1 << (pos - 32);
      }
    }
  }
  return out;
})();
// rho offsets and pi destinations, from the (x, y) → (y, 2x + 3y) walk
const RHO = new Int32Array(25);
const PI = new Int32Array(25);
(() => {
  let x = 1, y = 0;
  for (let t = 0; t < 24; t += 1) {
    RHO[x + 5 * y] = (((t + 1) * (t + 2)) / 2) % 64;
    [x, y] = [y, (2 * x + 3 * y) % 5];
  }
  for (let xx = 0; xx < 5; xx += 1) {
    for (let yy = 0; yy < 5; yy += 1) PI[xx + 5 * yy] = yy + 5 * ((2 * xx + 3 * yy) % 5);
  }
})();

const KB = new Int32Array(50);
const KC = new Int32Array(10);
function keccakF(L) {
  const B = KB, C = KC;
  for (let round = 0; round < 24; round += 1) {
    // theta
    for (let x = 0; x < 5; x += 1) {
      C[2 * x] = L[2 * x] ^ L[2 * x + 10] ^ L[2 * x + 20] ^ L[2 * x + 30] ^ L[2 * x + 40];
      C[2 * x + 1] = L[2 * x + 1] ^ L[2 * x + 11] ^ L[2 * x + 21] ^ L[2 * x + 31] ^ L[2 * x + 41];
    }
    for (let x = 0; x < 5; x += 1) {
      const p = (x + 4) % 5, q = (x + 1) % 5;
      const ql = C[2 * q], qh = C[2 * q + 1];
      const dl = C[2 * p] ^ ((ql << 1) | (qh >>> 31));
      const dh = C[2 * p + 1] ^ ((qh << 1) | (ql >>> 31));
      for (let y = 0; y < 25; y += 5) { L[2 * (x + y)] ^= dl; L[2 * (x + y) + 1] ^= dh; }
    }
    // rho + pi
    for (let i = 0; i < 25; i += 1) {
      const lo = L[2 * i], hi = L[2 * i + 1];
      const r = RHO[i];
      const d = PI[i];
      if (r === 0) { B[2 * d] = lo; B[2 * d + 1] = hi; }
      else if (r < 32) { B[2 * d] = (lo << r) | (hi >>> (32 - r)); B[2 * d + 1] = (hi << r) | (lo >>> (32 - r)); }
      else if (r === 32) { B[2 * d] = hi; B[2 * d + 1] = lo; }
      else {
        const m = r - 32;
        B[2 * d] = (hi << m) | (lo >>> (32 - m));
        B[2 * d + 1] = (lo << m) | (hi >>> (32 - m));
      }
    }
    // chi
    for (let y = 0; y < 25; y += 5) {
      for (let x = 0; x < 5; x += 1) {
        const i = x + y, i1 = ((x + 1) % 5) + y, i2 = ((x + 2) % 5) + y;
        L[2 * i] = B[2 * i] ^ (~B[2 * i1] & B[2 * i2]);
        L[2 * i + 1] = B[2 * i + 1] ^ (~B[2 * i1 + 1] & B[2 * i2 + 1]);
      }
    }
    // iota
    L[0] ^= RC[2 * round];
    L[1] ^= RC[2 * round + 1];
  }
}

function absorbBlock(L, b, off, rate) {
  for (let i = 0; i < rate; i += 4) {
    L[i >> 2] ^= b[off + i] | (b[off + i + 1] << 8) | (b[off + i + 2] << 16) | (b[off + i + 3] << 24);
  }
  keccakF(L);
}

function spongeAlgo(name, rate, digestSize, ds) {
  return {
    name, digestSize, blockSize: rate, xof: digestSize === 0,
    init: () => ({ L: new Int32Array(50), buf: new Uint8Array(rate), n: 0 }),
    clone: (s) => ({ L: s.L.slice(), buf: s.buf.slice(), n: s.n }),
    update(s, data) {
      let i = 0;
      const len = data.length;
      if (s.n > 0) {
        const take = Math.min(rate - s.n, len);
        s.buf.set(data.subarray(0, take), s.n);
        s.n += take;
        i = take;
        if (s.n === rate) { absorbBlock(s.L, s.buf, 0, rate); s.n = 0; }
      }
      for (; i + rate <= len; i += rate) absorbBlock(s.L, data, i, rate);
      if (i < len) { s.buf.set(data.subarray(i), 0); s.n = len - i; }
    },
    final(s0, outLen = digestSize) {
      const s = this.clone(s0);
      const blk = new Uint8Array(rate);
      blk.set(s.buf.subarray(0, s.n));
      blk[s.n] ^= ds;
      blk[rate - 1] ^= 0x80;
      absorbBlock(s.L, blk, 0, rate);
      const out = new Uint8Array(outLen);
      let off = 0;
      for (;;) {
        for (let i = 0; i < rate && off < outLen; i += 1, off += 1) {
          out[off] = (s.L[i >> 2] >>> (8 * (i & 3))) & 255;
        }
        if (off >= outLen) break;
        keccakF(s.L);
      }
      return out;
    },
  };
}
const SHA3_224 = spongeAlgo('sha3_224', 144, 28, 0x06);
const SHA3_256 = spongeAlgo('sha3_256', 136, 32, 0x06);
const SHA3_384 = spongeAlgo('sha3_384', 104, 48, 0x06);
const SHA3_512 = spongeAlgo('sha3_512', 72, 64, 0x06);
const SHAKE_128 = spongeAlgo('shake_128', 168, 0, 0x1f);
const SHAKE_256 = spongeAlgo('shake_256', 136, 0, 0x1f);

// ── BLAKE2 (RFC 7693) ────────────────────────────────────────
const SIGMA = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
];
// BLAKE2b's IV is SHA-512's, BLAKE2s's is SHA-256's
const B2B_IV = H512;
const B2S_IV = H256;

// BLAKE2b: 64-bit words as (hi, lo) pairs in Int32Array(32)
const B2V = new Int32Array(32);
const B2M = new Int32Array(32);
function b2bG(v, a, b, c, d, xh, xl, yh, yl) {
  // a = a + b + x
  let lo = (v[2 * a + 1] >>> 0) + (v[2 * b + 1] >>> 0) + (xl >>> 0);
  v[2 * a] = v[2 * a] + v[2 * b] + xh + Math.floor(lo / 4294967296); v[2 * a + 1] = lo;
  // d = rotr(d ^ a, 32)
  let dh = v[2 * d] ^ v[2 * a], dl = v[2 * d + 1] ^ v[2 * a + 1];
  v[2 * d] = dl; v[2 * d + 1] = dh;
  // c = c + d
  lo = (v[2 * c + 1] >>> 0) + (v[2 * d + 1] >>> 0);
  v[2 * c] = v[2 * c] + v[2 * d] + Math.floor(lo / 4294967296); v[2 * c + 1] = lo;
  // b = rotr(b ^ c, 24)
  let bh = v[2 * b] ^ v[2 * c], bl = v[2 * b + 1] ^ v[2 * c + 1];
  v[2 * b] = (bh >>> 24) | (bl << 8); v[2 * b + 1] = (bl >>> 24) | (bh << 8);
  // a = a + b + y
  lo = (v[2 * a + 1] >>> 0) + (v[2 * b + 1] >>> 0) + (yl >>> 0);
  v[2 * a] = v[2 * a] + v[2 * b] + yh + Math.floor(lo / 4294967296); v[2 * a + 1] = lo;
  // d = rotr(d ^ a, 16)
  dh = v[2 * d] ^ v[2 * a]; dl = v[2 * d + 1] ^ v[2 * a + 1];
  v[2 * d] = (dh >>> 16) | (dl << 16); v[2 * d + 1] = (dl >>> 16) | (dh << 16);
  // c = c + d
  lo = (v[2 * c + 1] >>> 0) + (v[2 * d + 1] >>> 0);
  v[2 * c] = v[2 * c] + v[2 * d] + Math.floor(lo / 4294967296); v[2 * c + 1] = lo;
  // b = rotr(b ^ c, 63) = rotl(b ^ c, 1)
  bh = v[2 * b] ^ v[2 * c]; bl = v[2 * b + 1] ^ v[2 * c + 1];
  v[2 * b] = (bh << 1) | (bl >>> 31); v[2 * b + 1] = (bl << 1) | (bh >>> 31);
}
function b2bCompress(h, block, off, total, last, lastNode) {
  const v = B2V, m = B2M;
  for (let i = 0; i < 16; i += 1) {
    const p = off + 8 * i;
    m[2 * i + 1] = block[p] | (block[p + 1] << 8) | (block[p + 2] << 16) | (block[p + 3] << 24);
    m[2 * i] = block[p + 4] | (block[p + 5] << 8) | (block[p + 6] << 16) | (block[p + 7] << 24);
  }
  for (let i = 0; i < 16; i += 1) { v[i] = h[i]; v[i + 16] = B2B_IV[i]; }
  // t0 = total (< 2**53), t1 = 0
  v[25] ^= total >>> 0; // v12 lo
  v[24] ^= Math.floor(total / 4294967296); // v12 hi
  if (last) { v[28] = ~v[28]; v[29] = ~v[29]; } // v14 ^= ~0
  if (lastNode) { v[30] = ~v[30]; v[31] = ~v[31]; } // v15 ^= ~0
  for (let r = 0; r < 12; r += 1) {
    const s = SIGMA[r % 10];
    const G = (a, b, c, d, i) => b2bG(v, a, b, c, d, m[2 * s[i]], m[2 * s[i] + 1], m[2 * s[i + 1]], m[2 * s[i + 1] + 1]);
    G(0, 4, 8, 12, 0); G(1, 5, 9, 13, 2); G(2, 6, 10, 14, 4); G(3, 7, 11, 15, 6);
    G(0, 5, 10, 15, 8); G(1, 6, 11, 12, 10); G(2, 7, 8, 13, 12); G(3, 4, 9, 14, 14);
  }
  for (let i = 0; i < 16; i += 1) h[i] ^= v[i] ^ v[i + 16];
}

const S2V = new Int32Array(16);
const S2M = new Int32Array(16);
function b2sCompress(h, block, off, total, last, lastNode) {
  const v = S2V, m = S2M;
  for (let i = 0; i < 16; i += 1) {
    const p = off + 4 * i;
    m[i] = block[p] | (block[p + 1] << 8) | (block[p + 2] << 16) | (block[p + 3] << 24);
  }
  for (let i = 0; i < 8; i += 1) { v[i] = h[i]; v[i + 8] = B2S_IV[i]; }
  v[12] ^= total >>> 0;
  v[13] ^= Math.floor(total / 4294967296);
  if (last) v[14] = ~v[14];
  if (lastNode) v[15] = ~v[15];
  const G = (a, b, c, d, x, y) => {
    v[a] = (v[a] + v[b] + x) | 0; let t = v[d] ^ v[a]; v[d] = (t >>> 16) | (t << 16);
    v[c] = (v[c] + v[d]) | 0; t = v[b] ^ v[c]; v[b] = (t >>> 12) | (t << 20);
    v[a] = (v[a] + v[b] + y) | 0; t = v[d] ^ v[a]; v[d] = (t >>> 8) | (t << 24);
    v[c] = (v[c] + v[d]) | 0; t = v[b] ^ v[c]; v[b] = (t >>> 7) | (t << 25);
  };
  for (let r = 0; r < 10; r += 1) {
    const s = SIGMA[r];
    G(0, 4, 8, 12, m[s[0]], m[s[1]]); G(1, 5, 9, 13, m[s[2]], m[s[3]]);
    G(2, 6, 10, 14, m[s[4]], m[s[5]]); G(3, 7, 11, 15, m[s[6]], m[s[7]]);
    G(0, 5, 10, 15, m[s[8]], m[s[9]]); G(1, 6, 11, 12, m[s[10]], m[s[11]]);
    G(2, 7, 8, 13, m[s[12]], m[s[13]]); G(3, 4, 9, 14, m[s[14]], m[s[15]]);
  }
  for (let i = 0; i < 8; i += 1) h[i] ^= v[i] ^ v[i + 8];
}

const B2 = {
  blake2b: { name: 'blake2b', outBytes: 64, keyBytes: 64, saltBytes: 16, personBytes: 16, blockSize: 128, paramBytes: 64, iv: B2B_IV, compress: b2bCompress },
  blake2s: { name: 'blake2s', outBytes: 32, keyBytes: 32, saltBytes: 8, personBytes: 8, blockSize: 64, paramBytes: 32, iv: B2S_IV, compress: b2sCompress },
};
export const BLAKE2_CONSTANTS = {
  blake2b: { SALT_SIZE: 16, PERSON_SIZE: 16, MAX_KEY_SIZE: 64, MAX_DIGEST_SIZE: 64 },
  blake2s: { SALT_SIZE: 8, PERSON_SIZE: 8, MAX_KEY_SIZE: 32, MAX_DIGEST_SIZE: 32 },
};

// The parameter block, read as the little-endian words XORed into the IV
function b2ParamWords(spec, p) {
  const P = new Uint8Array(spec.paramBytes);
  P[0] = p.digestSize; P[1] = p.key.length; P[2] = p.fanout; P[3] = p.depth;
  P[4] = p.leafSize & 255; P[5] = (p.leafSize >>> 8) & 255; P[6] = (p.leafSize >>> 16) & 255; P[7] = (p.leafSize >>> 24) & 255;
  let off = p.nodeOffset;
  const offBytes = spec.name === 'blake2b' ? 8 : 6;
  for (let i = 0; i < offBytes; i += 1) { P[8 + i] = Number(off & 0xffn); off >>= 8n; }
  if (spec.name === 'blake2b') {
    P[16] = p.nodeDepth; P[17] = p.innerSize;
    P.set(p.salt, 32); P.set(p.person, 48);
  } else {
    P[14] = p.nodeDepth; P[15] = p.innerSize;
    P.set(p.salt, 16); P.set(p.person, 24);
  }
  const h = spec.iv.slice();
  if (spec.name === 'blake2b') {
    for (let i = 0; i < 8; i += 1) {
      const q = 8 * i;
      h[2 * i + 1] ^= P[q] | (P[q + 1] << 8) | (P[q + 2] << 16) | (P[q + 3] << 24);
      h[2 * i] ^= P[q + 4] | (P[q + 5] << 8) | (P[q + 6] << 16) | (P[q + 7] << 24);
    }
  } else {
    for (let i = 0; i < 8; i += 1) {
      const q = 4 * i;
      h[i] ^= P[q] | (P[q + 1] << 8) | (P[q + 2] << 16) | (P[q + 3] << 24);
    }
  }
  return h;
}

function blake2Algo(spec, p) {
  const bs = spec.blockSize;
  return {
    name: spec.name, digestSize: p.digestSize, blockSize: bs,
    init() {
      const s = { h: b2ParamWords(spec, p), buf: new Uint8Array(bs), n: 0, total: 0 };
      if (p.key.length > 0) { s.buf.set(p.key); s.n = bs; }
      return s;
    },
    clone: (s) => ({ h: s.h.slice(), buf: s.buf.slice(), n: s.n, total: s.total }),
    update(s, data) {
      // the last block must stay buffered until final(); last_node flags
      // only the final compression (f1 is set together with f0)
      let i = 0;
      const len = data.length;
      while (i < len) {
        if (s.n === bs) {
          s.total += bs;
          spec.compress(s.h, s.buf, 0, s.total, false, false);
          s.n = 0;
        }
        if (s.n === 0 && len - i > bs) {
          s.total += bs;
          spec.compress(s.h, data, i, s.total, false, false);
          i += bs;
          continue;
        }
        const take = Math.min(bs - s.n, len - i);
        s.buf.set(data.subarray(i, i + take), s.n);
        s.n += take;
        i += take;
      }
    },
    final(s0) {
      const s = this.clone(s0);
      s.total += s.n;
      s.buf.fill(0, s.n);
      spec.compress(s.h, s.buf, 0, s.total, true, p.lastNode);
      const out = new Uint8Array(p.digestSize);
      const words = spec.name === 'blake2b'
        ? (i) => s.h[(i >> 3) * 2 + ((i & 7) < 4 ? 1 : 0)] >>> (8 * (i & 3))
        : (i) => s.h[i >> 2] >>> (8 * (i & 3));
      for (let i = 0; i < p.digestSize; i += 1) out[i] = words(i) & 255;
      return out;
    },
  };
}

// keyword arguments of the blake2 constructors (Python ints as BigInt or number)
function blake2Params(spec, opts) {
  const o = {
    digestSize: spec.outBytes, key: new Uint8Array(0), salt: new Uint8Array(0), person: new Uint8Array(0),
    fanout: 1, depth: 1, leafSize: 0, nodeOffset: 0, nodeDepth: 0, innerSize: 0, lastNode: false, ...opts,
  };
  // argument conversion (clinic), in signature order: digest_size, key,
  // salt, person, fanout, depth, leaf_size, node_offset, node_depth,
  // inner_size — the first failing conversion wins
  const ds = cInt(o.digestSize);
  const key = bufferArg(o.key);
  const salt = bufferArg(o.salt);
  const person = bufferArg(o.person);
  const fanout = cInt(o.fanout);
  const depth = cInt(o.depth);
  // leaf_size / node_offset: clinic's unsigned long (long) converters —
  // a negative int is a ValueError, then PyLong_AsUnsignedLong(Long),
  // which does not call __index__: anything but an int is a TypeError
  const unsignedArg = (v) => {
    if (!isPyInt(v)) raise('TypeError', 'an integer is required');
    const b = pyIndex(v);
    if (b < 0n) raise('ValueError', 'value must be positive');
    return b;
  };
  const leafSize = unsignedArg(o.leafSize);
  if (leafSize > M64) raise('OverflowError', 'Python int too large to convert to C unsigned long');
  const nodeOffset = unsignedArg(o.nodeOffset);
  if (nodeOffset > M64) raise('OverflowError', 'int too big to convert');
  const nodeDepth = cInt(o.nodeDepth);
  const innerSize = cInt(o.innerSize);
  // body checks, in CPython's order
  if (ds <= 0 || ds > spec.outBytes) raise('ValueError', `digest_size must be between 1 and ${spec.outBytes} bytes`);
  if (salt.length > spec.saltBytes) raise('ValueError', `maximum salt length is ${spec.saltBytes} bytes`);
  if (person.length > spec.personBytes) raise('ValueError', `maximum person length is ${spec.personBytes} bytes`);
  if (fanout < 0 || fanout > 255) raise('ValueError', 'fanout must be between 0 and 255');
  if (depth <= 0 || depth > 255) raise('ValueError', 'depth must be between 1 and 255');
  // (64-bit unsigned long as on Linux / macOS; on Windows 2**32 and up
  // already fail in the conversion above)
  if (leafSize > M32) raise('OverflowError', 'leaf_size is too large');
  if (spec.name === 'blake2s' && nodeOffset > 0xffffffffffffn) raise('OverflowError', 'node_offset is too large');
  if (nodeDepth < 0 || nodeDepth > 255) raise('ValueError', 'node_depth must be between 0 and 255');
  if (innerSize < 0 || innerSize > spec.outBytes) raise('ValueError', `inner_size must be between 0 and is ${spec.outBytes}`);
  if (key.length > spec.keyBytes) raise('ValueError', `maximum key length is ${spec.keyBytes} bytes`);
  return {
    digestSize: ds, key, salt, person, fanout, depth, leafSize: Number(leafSize), nodeOffset,
    nodeDepth, innerSize, lastNode: Boolean(o.lastNode),
  };
}

// ── hash objects ─────────────────────────────────────────────
export class HashObject {
  constructor(algo, state) {
    this.algo = algo;
    this.state = state || algo.init();
  }
  get name() { return this.algo.name; }
  get digest_size() { return this.algo.digestSize; }
  get block_size() { return this.algo.blockSize; }
  // type(h).__name__ in error messages: OpenSSL objects are _hashlib.HASH
  get typeName() { return this.algo.name.startsWith('blake2') ? this.algo.name : 'HASH'; }
  update(data) { this.algo.update(this.state, hashData(data)); return null; }
  digest(length) {
    if (this.algo.xof) {
      if (length === undefined) raise('TypeError', "digest() missing required argument 'length' (pos 1)");
      return this.algo.final(this.state, xofLength(length, 'digest'));
    }
    if (length !== undefined) raise('TypeError', `${this.typeName}.digest() takes no arguments (1 given)`);
    return this.algo.final(this.state);
  }
  hexdigest(length) {
    if (this.algo.xof) {
      if (length === undefined) raise('TypeError', "hexdigest() missing required argument 'length' (pos 1)");
      return hex(this.algo.final(this.state, xofLength(length, 'hexdigest')));
    }
    if (length !== undefined) raise('TypeError', `${this.typeName}.hexdigest() takes no arguments (1 given)`);
    return hex(this.algo.final(this.state));
  }
  copy() { return new HashObject(this.algo, this.algo.clone(this.state)); }
}

// SHAKE's length argument (Py_ssize_t). A negative length reaches the
// allocation: PyBytes_FromStringAndSize rejects it in digest(), while
// hexdigest() asks PyMem_Malloc for a huge unsigned size first.
const XOF_MAX = 1 << 20;
function xofLength(length, method) {
  const n = pyIndex(length);
  if (n > LONG_MAX || n < -LONG_MAX - 1n) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  if (n < 0n) {
    if (method === 'digest') raise('SystemError', 'Negative size passed to PyBytes_FromStringAndSize');
    raise('MemoryError', '');
  }
  if (n > BigInt(XOF_MAX)) demoLimit(`a ${n}-byte SHAKE digest is too long for the in-browser demo`);
  return Number(n);
}

export const ALGOS = {
  md5: MD5, sha1: SHA1, sha224: SHA224, sha256: SHA256, sha384: SHA384, sha512: SHA512,
  sha3_224: SHA3_224, sha3_256: SHA3_256, sha3_384: SHA3_384, sha3_512: SHA3_512,
  shake_128: SHAKE_128, shake_256: SHAKE_256,
  blake2b: blake2Algo(B2.blake2b, blake2Params(B2.blake2b, {})),
  blake2s: blake2Algo(B2.blake2s, blake2Params(B2.blake2s, {})),
};

// sorted(hashlib.algorithms_guaranteed)
export const GUARANTEED = Object.keys(ALGOS).sort();

// named constructors: hashlib.sha256(data=b'')
export function construct(name, data) {
  const h = new HashObject(ALGOS[name]);
  if (data !== undefined) h.update(data);
  return h;
}

export function blake2(which, data, opts = {}) {
  const spec = B2[which];
  const p = blake2Params(spec, opts);
  const h = new HashObject(blake2Algo(spec, p));
  if (data !== undefined) h.update(data);
  return h;
}

// ── name resolution: hashlib.new / pbkdf2_hmac / file_digest ─
// CPython first looks the name up in _hashopenssl.c's table (exact case),
// then asks OpenSSL (EVP_MD_fetch: case-insensitive names, aliases and
// OIDs). Probed against CPython 3.13 + OpenSSL 3.0.16 (Windows) and 3.12 +
// OpenSSL 3.0.13 (Linux): identical. Names of algorithms that are NOT in
// algorithms_guaranteed resolve to null-with-a-reason: whether they exist
// depends on the OpenSSL build, so the demo will not guess.
const TABLE = {
  md5: 'md5', MD5: 'md5', sha1: 'sha1', SHA1: 'sha1', sha224: 'sha224', SHA224: 'sha224',
  sha256: 'sha256', SHA256: 'sha256', sha384: 'sha384', SHA384: 'sha384', sha512: 'sha512', SHA512: 'sha512',
  sha512_224: '?sha512_224', SHA512_224: '?sha512_224', sha512_256: '?sha512_256', SHA512_256: '?sha512_256',
  sha3_224: 'sha3_224', sha3_256: 'sha3_256', sha3_384: 'sha3_384', sha3_512: 'sha3_512',
  shake_128: 'shake_128', shake_256: 'shake_256',
  blake2s: 'blake2s', blake2s256: 'blake2s', blake2b: 'blake2b', blake2b512: 'blake2b',
};
const OPENSSL = {};
const ossl = (canon, names) => names.forEach((n) => { OPENSSL[n] = canon; });
ossl('md5', ['md5', 'ssl3-md5', '1.2.840.113549.2.5']);
ossl('sha1', ['sha1', 'sha-1', 'ssl3-sha1', '1.3.14.3.2.26']);
ossl('sha224', ['sha224', 'sha-224', 'sha2-224', '2.16.840.1.101.3.4.2.4']);
ossl('sha256', ['sha256', 'sha-256', 'sha2-256', '2.16.840.1.101.3.4.2.1']);
ossl('sha384', ['sha384', 'sha-384', 'sha2-384', '2.16.840.1.101.3.4.2.2']);
ossl('sha512', ['sha512', 'sha-512', 'sha2-512', '2.16.840.1.101.3.4.2.3']);
ossl('sha3_224', ['sha3-224', '2.16.840.1.101.3.4.2.7']);
ossl('sha3_256', ['sha3-256', '2.16.840.1.101.3.4.2.8']);
ossl('sha3_384', ['sha3-384', '2.16.840.1.101.3.4.2.9']);
ossl('sha3_512', ['sha3-512', '2.16.840.1.101.3.4.2.10']);
ossl('shake_128', ['shake128', 'shake-128', '2.16.840.1.101.3.4.2.11']);
ossl('shake_256', ['shake256', 'shake-256', '2.16.840.1.101.3.4.2.12']);
ossl('blake2b', ['blake2b512', 'blake2b-512', '1.3.6.1.4.1.1722.12.2.1.16']);
ossl('blake2s', ['blake2s256', 'blake2s-256', '1.3.6.1.4.1.1722.12.2.2.8']);
// provided by OpenSSL 3.0 too, but not guaranteed
ossl('?sha512_224', ['sha512-224', 'sha-512/224', 'sha2-512/224', '2.16.840.1.101.3.4.2.5']);
ossl('?sha512_256', ['sha512-256', 'sha-512/256', 'sha2-512/256', '2.16.840.1.101.3.4.2.6']);
ossl('?ripemd160', ['ripemd', 'ripemd160', 'ripemd-160', 'rmd160', '1.3.36.3.2.1']);
ossl('?md5-sha1', ['md5-sha1']);
ossl('?sm3', ['sm3', '1.2.156.10197.1.401']);
ossl('?KECCAK-KMAC', ['keccak-kmac-128', 'keccak-kmac128', 'keccak-kmac-256', 'keccak-kmac256']);
ossl('?NULL', ['null']);
// legacy-provider or newer-OpenSSL digests (OpenSSL 1.1.1, 3.2+ builds)
ossl('?md4', ['md4', '1.2.840.113549.2.4']);
ossl('?mdc2', ['mdc2', '2.5.8.3.101']);
ossl('?whirlpool', ['whirlpool', '1.0.10118.3.0.55']);
ossl('?sha256-192', ['sha256-192', 'sha2-256/192', 'sha-256/192']);
ossl('?keccak', ['keccak-224', 'keccak-256', 'keccak-384', 'keccak-512']);

// → { canon, openssl } | { optional: name } | null
export function resolveName(name) {
  if (Object.prototype.hasOwnProperty.call(TABLE, name)) {
    const c = TABLE[name];
    return c[0] === '?' ? { optional: c.slice(1) } : { canon: c, openssl: c !== 'blake2b' && c !== 'blake2s' };
  }
  // OpenSSL matches names case-insensitively (ASCII only)
  const lower = name.replace(/[A-Z]/g, (ch) => ch.toLowerCase());
  if (Object.prototype.hasOwnProperty.call(OPENSSL, lower)) {
    const c = OPENSSL[lower];
    return c[0] === '?' ? { optional: c.slice(1) } : { canon: c, openssl: true };
  }
  return null;
}

function optionalLimit(name, algo) {
  demoLimit(`'${name}' (${algo}) comes from OpenSSL and is not in algorithms_guaranteed: whether it exists depends on how your Python was built`);
}

// hashlib.new(name, data=b'')
export function hashNew(name, data) {
  // (a NUL inside the name fails _hashlib.new's str conversion; hashlib.new
  // reports that as the same TypeError as a non-str name)
  if (typeof name !== 'string' || name.includes('\0')) raise('TypeError', 'name must be a string');
  const r = resolveName(name);
  if (r && r.optional) optionalLimit(name, r.optional);
  if (!r) raise('ValueError', `unsupported hash type ${name}`);
  return construct(r.canon, data);
}

// hashlib.file_digest(fileobj, digest): fileobj modelled as its bytes
// (io.BytesIO(data) or a file opened 'rb'); digest is a name or a
// constructor name passed as { ctor: 'sha256' }
export function fileDigest(bytes, digest) {
  const h = typeof digest === 'string' ? hashNew(digest) : construct(digest.ctor);
  h.update(bytes);
  return h;
}

// ── HMAC (RFC 2104), as hmac.new(key, msg, digestmod) ───────
function hmacPrep(algo, key) {
  const bs = algo.blockSize;
  let k = key;
  if (k.length > bs) { const s = algo.init(); algo.update(s, k); k = algo.final(s); }
  const ipad = new Uint8Array(bs).fill(0x36);
  const opad = new Uint8Array(bs).fill(0x5c);
  for (let i = 0; i < k.length; i += 1) { ipad[i] ^= k[i]; opad[i] ^= k[i]; }
  const inner = algo.init(); algo.update(inner, ipad);
  const outer = algo.init(); algo.update(outer, opad);
  return { algo, inner, outer };
}
function hmacRun(pre, msg) {
  const { algo } = pre;
  const i = algo.clone(pre.inner);
  algo.update(i, msg);
  const o = algo.clone(pre.outer);
  algo.update(o, algo.final(i));
  return algo.final(o);
}

// hmac.new(key, msg, 'sha256' | hashlib.sha256).digest()
export function hmacDigest(key, msg, digestmod) {
  const k = bufferArg(key);
  const r = resolveName(digestmod);
  if (r && r.optional) optionalLimit(digestmod, r.optional);
  if (!r) raise('ValueError', `unsupported hash type ${digestmod}`);
  return hmacRun(hmacPrep(ALGOS[r.canon], k), bufferArg(msg));
}

// ── pbkdf2_hmac ──────────────────────────────────────────────
// Work budget so a demo never freezes the page: compressions weighted by
// their measured cost relative to one SHA-256 compression (~150 ms total)
const WORK_LIMIT = 180000;
const COST = {
  md5: 1.7, sha1: 1.7, sha224: 1, sha256: 1, sha384: 2.8, sha512: 2.8,
  sha3_224: 5.5, sha3_256: 5.5, sha3_384: 5.5, sha3_512: 5.5, shake_128: 5.5, shake_256: 5.5,
  blake2b: 7, blake2s: 2.5,
};
const KDF_ALGOS = { ...ALGOS, sha512: SHA512_FAST };

export function pbkdf2Hmac(hashName, password, salt, iterations, dklen = null) {
  // clinic: hash_name (str without NUL), password, salt, iterations (C long)
  if (typeof hashName !== 'string') raise('TypeError', `pbkdf2_hmac() argument 'hash_name' must be str, not ${clinicTypeName(hashName)}`);
  if (hashName.includes('\0')) raise('ValueError', 'embedded null character');
  const pw = bufferArg(password);
  const sl = bufferArg(salt);
  const it = cLong(iterations);
  // body: digest lookup, iteration range, then dklen (C long) and its range
  const r = resolveName(hashName);
  if (r && r.optional) optionalLimit(hashName, r.optional);
  if (!r) raise('_hashlib.UnsupportedDigestmodError', '[digital envelope routines] unsupported');
  const algo = KDF_ALGOS[r.canon];
  if (it < 1n) raise('ValueError', 'iteration value must be greater than 0.');
  if (it > 2147483647n) raise('OverflowError', 'iteration value is too great.');
  // dklen=None → EVP_MD_size(), which OpenSSL reports as 16 / 32 for SHAKE
  const defaultLen = algo.xof ? (algo.name === 'shake_128' ? 16 : 32) : algo.digestSize;
  const dk = dklen === null || dklen === undefined ? BigInt(defaultLen) : cLong(dklen);
  if (dk < 1n) raise('ValueError', 'key length must be greater than 0.');
  if (dk > 2147483647n) raise('OverflowError', 'key length is too great.');
  if (algo.xof) raise('ValueError', 'no reason supplied');
  return pbkdf2Raw(algo, pw, sl, Number(it), Number(dk));
}

function blocksPerHmac(algo, msgLen) {
  // compressions for one HMAC of a msgLen-byte message (inner + outer)
  const bs = algo.blockSize;
  return Math.ceil((msgLen + 17) / bs) + Math.ceil((algo.digestSize + 17) / bs);
}

function pbkdf2Raw(algo, pw, salt, iterations, dklen) {
  const hLen = algo.digestSize;
  const nBlocks = Math.ceil(dklen / hLen);
  const work = nBlocks * iterations * blocksPerHmac(algo, hLen) * COST[algo.name];
  if (work > WORK_LIMIT) demoLimit(`${iterations} iterations × ${nBlocks} block(s) is too much work for the in-browser demo`);
  const pre = hmacPrep(algo, pw);
  const out = new Uint8Array(nBlocks * hLen);
  const first = new Uint8Array(salt.length + 4);
  first.set(salt);
  for (let b = 1; b <= nBlocks; b += 1) {
    first[salt.length] = b >>> 24; first[salt.length + 1] = (b >>> 16) & 255;
    first[salt.length + 2] = (b >>> 8) & 255; first[salt.length + 3] = b & 255;
    let u = hmacRun(pre, first);
    const t = u.slice();
    for (let j = 1; j < iterations; j += 1) {
      u = hmacRun(pre, u);
      for (let k = 0; k < hLen; k += 1) t[k] ^= u[k];
    }
    out.set(t, (b - 1) * hLen);
  }
  return out.subarray(0, dklen);
}

// ── scrypt (RFC 7914), with OpenSSL 3.0's parameter checks ───
const SCRYPT_MAX_WORK = 1 << 17; // n * r * p, e.g. n=2**14, r=8, p=1
const INT_MAX = 2147483647;
const memLimit = () => raise('ValueError', '[digital envelope routines] memory limit exceeded');

// Keyword arguments left out are undefined; an explicit None is null (the
// two differ: salt=None is not a buffer, n=None is not an int).
export function scrypt(password, { salt, n, r, p, maxmem = 0, dklen = 64 } = {}) {
  // clinic, in signature order: password and salt (buffers; salt may be
  // omitted), n / r / p (int objects; may be omitted), maxmem and dklen
  // (C long)
  const pw = bufferArg(password);
  const sl = salt === undefined ? null : bufferArg(salt);
  const intObj = (v, nm) => {
    if (v === undefined || isPyInt(v)) return v;
    return raise('TypeError', `scrypt() argument '${nm}' must be int, not ${clinicTypeName(v)}`);
  };
  intObj(n, 'n'); intObj(r, 'r'); intObj(p, 'p');
  const mm = cLong(maxmem);
  const dk = cLong(dklen);
  if (sl === null) raise('TypeError', 'salt is required');
  // unsigned long arguments (64-bit on Linux and macOS; 32-bit on Windows,
  // where 2**32 and up give this TypeError too)
  const unsigned = (v, nm) => {
    if (v === undefined || pyIndex(v) < 0n || pyIndex(v) > M64) raise('TypeError', `${nm} is required and must be an unsigned int`);
    return pyIndex(v);
  };
  const N = unsigned(n, 'n');
  if (N < 2n || (N & (N - 1n)) !== 0n) raise('ValueError', 'n must be a power of 2.');
  const R = unsigned(r, 'r');
  const P = unsigned(p, 'p');
  if (mm < 0n || mm > BigInt(INT_MAX)) raise('ValueError', `maxmem must be positive and smaller than ${INT_MAX}`);
  if (dk < 1n || dk > BigInt(INT_MAX)) raise('ValueError', `dklen must be greater than 0 and smaller than ${INT_MAX}`);
  // OpenSSL's checks (crypto/evp/pbe_scrypt.c, providers/.../kdf/scrypt.c)
  if (R > M32 || P > M32) raise('ValueError', '[digital envelope routines] parameter too large');
  if (R === 0n || P === 0n) raise('ValueError', 'Invalid parameter combination for n, r, p, maxmem.');
  if (P > ((1n << 30n) - 1n) / R) memLimit();
  if (16n * R <= 63n && N >= (1n << (16n * R))) memLimit();
  const Blen = P * 128n * R;
  if (Blen > BigInt(INT_MAX)) memLimit();
  if (N + 2n > (M64 / 128n) / R) memLimit();
  const Vlen = 128n * R * (N + 2n);
  if (Blen + Vlen > (mm === 0n ? 32n * 1024n * 1024n : mm)) memLimit();
  if (N * R * P > BigInt(SCRYPT_MAX_WORK) || P * R > 1n << 14n) demoLimit(`n * r * p = ${N * R * P} is too much work for the in-browser demo (limit ${SCRYPT_MAX_WORK})`);
  if (dk > 1n << 16n) demoLimit(`a ${dk}-byte scrypt key is too long for the in-browser demo`);
  return scryptRaw(pw, sl, Number(N), Number(R), Number(P), Number(dk));
}

function salsa208(B, x) {
  // B: Uint32Array(16) in/out; x: scratch
  for (let i = 0; i < 16; i += 1) x[i] = B[i];
  const R = (a, b) => (a << b) | (a >>> (32 - b));
  for (let i = 0; i < 8; i += 2) {
    x[4] ^= R(x[0] + x[12], 7); x[8] ^= R(x[4] + x[0], 9);
    x[12] ^= R(x[8] + x[4], 13); x[0] ^= R(x[12] + x[8], 18);
    x[9] ^= R(x[5] + x[1], 7); x[13] ^= R(x[9] + x[5], 9);
    x[1] ^= R(x[13] + x[9], 13); x[5] ^= R(x[1] + x[13], 18);
    x[14] ^= R(x[10] + x[6], 7); x[2] ^= R(x[14] + x[10], 9);
    x[6] ^= R(x[2] + x[14], 13); x[10] ^= R(x[6] + x[2], 18);
    x[3] ^= R(x[15] + x[11], 7); x[7] ^= R(x[3] + x[15], 9);
    x[11] ^= R(x[7] + x[3], 13); x[15] ^= R(x[11] + x[7], 18);
    x[1] ^= R(x[0] + x[3], 7); x[2] ^= R(x[1] + x[0], 9);
    x[3] ^= R(x[2] + x[1], 13); x[0] ^= R(x[3] + x[2], 18);
    x[6] ^= R(x[5] + x[4], 7); x[7] ^= R(x[6] + x[5], 9);
    x[4] ^= R(x[7] + x[6], 13); x[5] ^= R(x[4] + x[7], 18);
    x[11] ^= R(x[10] + x[9], 7); x[8] ^= R(x[11] + x[10], 9);
    x[9] ^= R(x[8] + x[11], 13); x[10] ^= R(x[9] + x[8], 18);
    x[12] ^= R(x[15] + x[14], 7); x[13] ^= R(x[12] + x[15], 9);
    x[14] ^= R(x[13] + x[12], 13); x[15] ^= R(x[14] + x[13], 18);
  }
  for (let i = 0; i < 16; i += 1) B[i] = (B[i] + x[i]) | 0;
}

function blockMix(B, Y, r, X, scratch) {
  // B, Y: Uint32Array(32 * r)
  X.set(B.subarray((2 * r - 1) * 16, 2 * r * 16));
  for (let i = 0; i < 2 * r; i += 1) {
    for (let k = 0; k < 16; k += 1) X[k] ^= B[i * 16 + k];
    salsa208(X, scratch);
    const dst = (i % 2 === 0 ? i / 2 : r + (i - 1) / 2) * 16;
    Y.set(X, dst);
  }
}

function scryptRaw(pw, salt, N, r, p, dklen) {
  const algo = KDF_ALGOS.sha256;
  const B = pbkdf2Raw(algo, pw, salt, 1, p * 128 * r);
  const words = 32 * r;
  const X = new Uint32Array(words);
  const Y = new Uint32Array(words);
  const V = new Uint32Array(words * N);
  const T = new Uint32Array(16);
  const scratch = new Uint32Array(16);
  const Bw = new Uint32Array(p * words);
  for (let i = 0; i < p * words; i += 1) {
    Bw[i] = B[4 * i] | (B[4 * i + 1] << 8) | (B[4 * i + 2] << 16) | (B[4 * i + 3] << 24);
  }
  for (let q = 0; q < p; q += 1) {
    X.set(Bw.subarray(q * words, (q + 1) * words));
    for (let i = 0; i < N; i += 1) {
      V.set(X, i * words);
      blockMix(X, Y, r, T, scratch);
      X.set(Y);
    }
    for (let i = 0; i < N; i += 1) {
      const j = X[(2 * r - 1) * 16] & (N - 1);
      for (let k = 0; k < words; k += 1) X[k] ^= V[j * words + k];
      blockMix(X, Y, r, T, scratch);
      X.set(Y);
    }
    Bw.set(X, q * words);
  }
  const Bb = new Uint8Array(p * words * 4);
  for (let i = 0; i < p * words; i += 1) {
    const w = Bw[i];
    Bb[4 * i] = w & 255; Bb[4 * i + 1] = (w >>> 8) & 255; Bb[4 * i + 2] = (w >>> 16) & 255; Bb[4 * i + 3] = w >>> 24;
  }
  return pbkdf2Raw(algo, pw, Bb, 1, dklen);
}
