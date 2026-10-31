// utils/emulators/python/stdlib/tomllib/load.js
//
// Emulator for the tomllib.load demo tabs. The file the snippet writes is
// kept as bytes; load() is the CPython code path: fp.read() → bytes →
// bytes.decode() (strict UTF-8, with CPython's exact UnicodeDecodeError
// ranges and reasons) → loads(). str.encode() for the encodings the demo
// offers follows CPython's encoders and error messages.

import { loads, asPy, joinLines, TEXT_MODE_ERROR } from './_pytomllib.js';
import { PyException } from '../../../../py-exceptions.js';

const limit = (msg) => { throw new PyException('DemoLimit', msg); };

// '\xe9', '€', '\U0001f600' — how codec errors show one character
const charEsc = (cp) => {
  if (cp < 0x100) return '\\x' + cp.toString(16).padStart(2, '0');
  if (cp < 0x10000) return '\\u' + cp.toString(16).padStart(4, '0');
  return '\\U' + cp.toString(16).padStart(8, '0');
};

function encodeError(codec, cps, start, end, reason) {
  const what = end - start === 1
    ? `character '${charEsc(cps[start])}' in position ${start}`
    : `characters in position ${start}-${end - 1}`;
  throw new PyException('UnicodeEncodeError', `'${codec}' codec can't encode ${what}: ${reason}`);
}

const isSurrogate = (cp) => cp >= 0xd800 && cp <= 0xdfff;

function utf8Bytes(cps, codec) {
  const out = [];
  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i];
    if (isSurrogate(cp)) {
      let j = i + 1;
      while (j < cps.length && isSurrogate(cps[j])) j += 1;
      encodeError(codec, cps, i, j, 'surrogates not allowed');
    }
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
  }
  return out;
}

function singleByte(cps, codec, max) {
  const out = [];
  for (let i = 0; i < cps.length; i++) {
    if (cps[i] >= max) {
      let j = i + 1;
      while (j < cps.length && cps[j] >= max) j += 1;
      encodeError(codec, cps, i, j, `ordinal not in range(${max})`);
    }
    out.push(cps[i]);
  }
  return out;
}

function utf16Bytes(cps) {
  const out = [0xff, 0xfe]; // BOM, little-endian (x86 and ARM byte order)
  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i];
    // (unlike the utf-8 encoder, utf-16 reports one surrogate at a time)
    if (isSurrogate(cp)) encodeError('utf-16', cps, i, i + 1, 'surrogates not allowed');
    if (cp < 0x10000) out.push(cp & 255, cp >> 8);
    else {
      const v = cp - 0x10000;
      const hi = 0xd800 + (v >> 10);
      const lo = 0xdc00 + (v & 1023);
      out.push(hi & 255, hi >> 8, lo & 255, lo >> 8);
    }
  }
  return out;
}

// str.encode(encoding) for the encodings the demo offers
const CODECS = {
  'utf-8': 'utf-8', utf8: 'utf-8', 'utf-8-sig': 'utf-8-sig', 'utf8-sig': 'utf-8-sig',
  'latin-1': 'latin-1', latin1: 'latin-1', 'iso-8859-1': 'latin-1', 'iso8859-1': 'latin-1', l1: 'latin-1',
  ascii: 'ascii', 'us-ascii': 'ascii', 'utf-16': 'utf-16', utf16: 'utf-16',
};
export function encode(text, encoding) {
  const name = CODECS[String(encoding).toLowerCase().replace(/_/g, '-')];
  if (!name) limit(`The browser demo encodes with utf-8, utf-8-sig, utf-16, latin-1 or ascii only (not ${JSON.stringify(encoding)}).`);
  const cps = Array.from(text, (c) => c.codePointAt(0));
  if (name === 'utf-8') return utf8Bytes(cps, 'utf-8');
  if (name === 'utf-8-sig') return [0xef, 0xbb, 0xbf, ...utf8Bytes(cps, 'utf-8')];
  if (name === 'latin-1') return singleByte(cps, 'latin-1', 256);
  if (name === 'ascii') return singleByte(cps, 'ascii', 128);
  return utf16Bytes(cps);
}

// bytes.decode() — strict UTF-8 as CPython reports it
export function decodeUtf8(bytes) {
  let s = '';
  const fail = (start, end, reason) => {
    const what = end - start === 1
      ? `byte 0x${bytes[start].toString(16).padStart(2, '0')} in position ${start}`
      : `bytes in position ${start}-${end - 1}`;
    throw new PyException('UnicodeDecodeError', `'utf-8' codec can't decode ${what}: ${reason}`);
  };
  const cont = (b) => b !== undefined && b >= 0x80 && b <= 0xbf;
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    if (b < 0x80) { s += String.fromCharCode(b); i += 1; continue; }
    let need;
    let lo2 = 0x80;
    let hi2 = 0xbf;
    if (b >= 0xc2 && b <= 0xdf) need = 1;
    else if (b >= 0xe0 && b <= 0xef) {
      need = 2;
      if (b === 0xe0) lo2 = 0xa0;
      if (b === 0xed) hi2 = 0x9f;
    } else if (b >= 0xf0 && b <= 0xf4) {
      need = 3;
      if (b === 0xf0) lo2 = 0x90;
      if (b === 0xf4) hi2 = 0x8f;
    } else fail(i, i + 1, 'invalid start byte');
    // second byte has its own range; the rest are plain continuation bytes
    let j = i + 1;
    if (j >= bytes.length) fail(i, j, 'unexpected end of data');
    if (!(bytes[j] >= lo2 && bytes[j] <= hi2)) fail(i, i + 1, 'invalid continuation byte');
    j += 1;
    for (let k = 1; k < need; k++) {
      if (j >= bytes.length) fail(i, j, 'unexpected end of data');
      if (!cont(bytes[j])) fail(i, j, 'invalid continuation byte');
      j += 1;
    }
    let cp = b & (need === 1 ? 0x1f : need === 2 ? 0x0f : 0x07);
    for (let k = i + 1; k < j; k++) cp = (cp << 6) | (bytes[k] & 0x3f);
    s += String.fromCodePoint(cp);
    i = j;
  }
  return s;
}

// open(path, mode) → what fp.read() returns for the modes the demo knows
function readAs(bytes, mode) {
  const m = String(mode);
  if (m === 'rb' || m === 'br') return { bytes };
  if (m === 'r' || m === 'rt' || m === 'tr') {
    // text mode decodes with the locale encoding (machine-dependent) and
    // translates newlines; ASCII content reads the same everywhere
    if (bytes.some((b) => b > 127)) limit('Text mode decodes with the locale encoding, which depends on the machine — the browser demo reproduces text mode for ASCII files only.');
    return { text: String.fromCharCode(...bytes).replace(/\r\n?/g, '\n') };
  }
  limit(`The browser demo reproduces the read modes 'rb' and 'r' only (not ${JSON.stringify(m)}).`);
  return null;
}

function load(fp) {
  if (fp.text !== undefined) throw new PyException('TypeError', TEXT_MODE_ERROR);
  return loads(decodeUtf8(fp.bytes));
}

export default {
  // Path('app.toml').write_bytes(doc.encode('utf-8'))
  // with open('app.toml', 'rb') as f: config = tomllib.load(f)
  file: (l1, l2, l3) => asPy(load(readAs(encode(joinLines(l1, l2, l3), 'utf-8'), 'rb'))),

  // Path('app.toml').write_bytes(b'debug = true\n'); with open('app.toml', mode) as f: …
  mode: (mode) => asPy(load(readAs(encode('debug = true\n', 'utf-8'), mode))),

  // Path('app.toml').write_bytes(text.encode(encoding)); load with 'rb'
  encoding: (text, encoding) => asPy(load(readAs(encode(text, encoding), 'rb'))),
};
