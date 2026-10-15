// utils/emulators/python/stdlib/time/_pytime.js
//
// Port of CPython 3.13's time module for the time demos — shared by the
// module hub and every member emulator. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// Sources: Modules/timemodule.c (gettmarg, checktm, time_strftime with its
// 3.13 ASCII-chunk loop and doubling buffer, _asctime, get_clock_info),
// Python/pytime.c (_PyTime_ObjectToTime_t, the sleep() conversion),
// Objects/structseq.c (struct_time construction and repr) and
// Lib/calendar.py (timegm). Two engines are REUSED BY IMPORT from the
// datetime port, never copied: cStrftime (glibc strftime in the C locale)
// and strptimeTuple (Lib/_strptime.py).
//
// time is a thin layer over the platform C library, so CPython's output
// differs between operating systems. These demos follow Linux (glibc),
// like the datetime port:
//   - gmtime(): any time_t whose year fits a C int; beyond that
//     OSError: [Errno 75] Value too large for defined data type.
//     (Windows only accepts -43200 .. 32536850399 and raises
//     OSError: [Errno 22] Invalid argument outside that range.)
//   - time tuples: C long is 64 bits, so 2**31 in a field gives
//     "signed integer is greater than maximum" (Windows: "Python int too
//     large to convert to C long"); strftime has no year range check
//     (Windows: year in [1; 9999], and %y needs a year >= 1900); glibc
//     flags and widths work (Windows: ValueError: Invalid format string).
//   - a struct_time argument passes tm_zone / tm_gmtoff on to the C struct
//     (Linux has those fields; Windows ignores them).
// Anything that needs a clock or the machine's time zone (time(),
// localtime(), mktime(), ctime(), %z / %Z, tzname, ...) throws
// EmulatorLimit — the demo templates never reach it.
//
// Value model (JS side):
//   int → bigint (or { int }) · float → PyFloat (or { float }) · str →
//   string · None → null · bool → boolean · tuple → { __pyTuple: [...] } ·
//   list → array · struct_time → StructTime (11 slots: the 9 visible
//   fields, then tm_zone and tm_gmtoff).
// pyrepr(value) renders repr() exactly; asPy(value) wraps it for
// pyReprExact.

import { cStrftime, strptimeTuple, divmod, ord2ymd, ymd2ord, date as dtDate, PyFloat, pyv } from '../datetime/_pydatetime.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

export const raise = (type, msg) => { throw new PyException(type, msg); };
export const limit = (msg) => { throw new PyException('EmulatorLimit', msg); };

// A demo argument as Python sees it: a number is the literal text shown in
// the code ('16' → int, '2.5' / '1e+21' → float, 'inf' → NameError), any
// other input stays a str.
export const arg = (v) => (typeof v === 'number' ? fromLiteral(v) : v);

const INT_MIN = -2147483648;
const INT_MAX = 2147483647;
const LONG_MIN = -(2n ** 63n);
const LONG_MAX = 2n ** 63n - 1n;
const TWO63 = 2 ** 63; // exact as a double

// ─── values ─────────────────────────────────────────────────
export class StructTime {
  // items: 11 Python values (9 visible fields, tm_zone, tm_gmtoff)
  constructor(items) { this.items = items; }
}
export const FIELDS = ['tm_year', 'tm_mon', 'tm_mday', 'tm_hour', 'tm_min', 'tm_sec', 'tm_wday', 'tm_yday', 'tm_isdst', 'tm_zone', 'tm_gmtoff'];

// Python number of an engine value: { int: bigint } | { float } | null
export function asNum(v) {
  if (typeof v === 'bigint') return { int: v };
  if (typeof v === 'boolean') return { int: v ? 1n : 0n };
  if (typeof v === 'number') return Number.isInteger(v) ? { int: BigInt(v) } : { float: v };
  if (v instanceof PyFloat) return { float: v.v };
  if (v && typeof v === 'object' && v.int !== undefined) return { int: BigInt(v.int) };
  if (v && typeof v === 'object' && v.float !== undefined) return { float: v.float };
  return null;
}

// tp_name, as CPython error messages show it
export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof StructTime) return 'time.struct_time';
  if (Array.isArray(v)) return 'list';
  if (v.__pyTuple) return 'tuple';
  if (v.int !== undefined) return 'int';
  if (v.float !== undefined) return 'float';
  return 'object';
}
// PyArg "U"/"s" converters: "must be str, not None" for None, else tp_name
const argTypeName = (v) => (v === null || v === undefined ? 'None' : typeName(v));

const notInteger = (v) => raise('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);

// ─── repr ───────────────────────────────────────────────────
export function pyrepr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : pyFloatRepr(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (v instanceof StructTime) {
    return `time.struct_time(${FIELDS.slice(0, 9).map((k, i) => `${k}=${pyrepr(v.items[i])}`).join(', ')})`;
  }
  if (v instanceof ClockInfo) return limit('implementation and resolution depend on the operating system');
  if (Array.isArray(v)) return '[' + v.map(pyrepr).join(', ') + ']';
  if (v.__pyTuple) {
    const items = v.__pyTuple.map(pyrepr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  if (v.int !== undefined) return String(v.int);
  if (v.float !== undefined) return pyFloatRepr(v.float);
  return pyv(v);
}
export const asPy = (v) => ({ __pyRaw: pyrepr(v) });
export const tuple = (...items) => ({ __pyTuple: items });

// ─── struct_time ────────────────────────────────────────────
// struct_time(sequence, dict={}) — structseq_new (dict=None is a TypeError)
export function structTime(seq, dict) {
  let items;
  if (Array.isArray(seq)) items = seq.slice();
  else if (seq && seq.__pyTuple) items = seq.__pyTuple.slice();
  else if (seq instanceof StructTime) items = seq.items.slice(0, 9);
  else if (typeof seq === 'string') items = [...seq];
  else raise('TypeError', 'constructor requires a sequence');
  if (dict !== undefined && dict !== null && !(dict instanceof Map)) {
    raise('TypeError', 'time.struct_time() takes a dict as second arg, if any');
  }
  if (dict === null) raise('TypeError', 'time.struct_time() takes a dict as second arg, if any');
  const len = items.length;
  if (len < 9) raise('TypeError', `time.struct_time() takes an at least 9-sequence (${len}-sequence given)`);
  if (len > 11) raise('TypeError', `time.struct_time() takes an at most 11-sequence (${len}-sequence given)`);
  let found = 0;
  for (let i = len; i < 11; i++) {
    if (dict && dict.has(FIELDS[i])) { items.push(dict.get(FIELDS[i])); found += 1; } else items.push(null);
  }
  if (dict && dict.size > found) raise('TypeError', 'time.struct_time() got duplicate or unexpected field name(s)');
  return new StructTime(items);
}
// st.tm_xxx / st[i] / st[a:b] / len(st)
export function attr(st, name) {
  const i = FIELDS.indexOf(name);
  if (i < 0) raise('AttributeError', `'time.struct_time' object has no attribute '${name}'`);
  return st.items[i];
}
export function index(st, i) {
  const k = i < 0 ? i + 9 : i;
  if (k < 0 || k >= 9) raise('IndexError', 'tuple index out of range');
  return st.items[k];
}
export const visible = (st) => st.items.slice(0, 9);

// ─── seconds → time_t (Python/pytime.c) ─────────────────────
// _PyTime_ROUND_FLOOR / CEILING / HALF_EVEN / UP on a double
function pyRound(x, mode) {
  if (mode === 'floor') return Math.floor(x);
  if (mode === 'ceiling') return Math.ceil(x);
  if (mode === 'up') return x >= 0 ? Math.ceil(x) : Math.floor(x);
  // half-even: C round() is half away from zero
  const t = Math.trunc(x);
  const d = x - t;
  let r = d >= 0.5 ? t + 1 : d <= -0.5 ? t - 1 : t;
  if (Math.abs(x - r) === 0.5) {
    const h = x / 2;
    const th = Math.trunc(h);
    const dh = h - th;
    r = 2 * (dh >= 0.5 ? th + 1 : dh <= -0.5 ? th - 1 : th);
  }
  return r;
}
// _PyTime_ObjectToTime_t (time_t is 64-bit on both Linux and Windows)
export function objectToTimeT(obj, round = 'floor') {
  const n = asNum(obj);
  if (n === null) return notInteger(obj);
  if (n.float !== undefined) {
    const d = n.float;
    if (Number.isNaN(d)) raise('ValueError', 'Invalid value NaN (not a number)');
    const ip = Math.trunc(pyRound(d, round));
    if (!(-TWO63 <= ip && ip < TWO63)) raise('OverflowError', 'timestamp out of range for platform time_t');
    return BigInt(ip);
  }
  if (n.int < LONG_MIN || n.int > LONG_MAX) raise('OverflowError', 'timestamp out of range for platform time_t');
  return n.int;
}

// ─── gmtime (glibc __offtime) ───────────────────────────────
const EPOCH_DAYS = 719162n; // days from 0001-01-01 to 1970-01-01
// broken-down UTC time of a time_t; year as a JS number (fits: |year| < 2**32)
export function gmtimeTm(t) {
  const [days, rem] = divmod(t, 86400n);
  const [n400, r400] = divmod(days + EPOCH_DAYS, 146097n);
  const [y400, mon, mday] = ord2ymd(Number(r400) + 1); // year 1..400 of the cycle
  const year = n400 * 400n + BigInt(y400);
  if (year - 1900n < BigInt(INT_MIN) || year - 1900n > BigInt(INT_MAX)) {
    raise('OSError', '[Errno 75] Value too large for defined data type');
  }
  const s = Number(rem);
  const wdaySun = Number(divmod(days + 4n, 7n)[1]); // 1970-01-01 was a Thursday
  return {
    year: Number(year), mon, mday,
    hour: Math.floor(s / 3600), min: Math.floor((s % 3600) / 60), sec: s % 60,
    wday: (wdaySun + 6) % 7, yday: ymd2ord(y400, mon, mday) - ymd2ord(y400, 1, 1) + 1,
  };
}
// time.gmtime([secs])
export function gmtime(secs) {
  if (secs === undefined || secs === null) limit('gmtime() without an argument reads the current time');
  const tm = gmtimeTm(objectToTimeT(secs, 'floor'));
  // tm_zone: glibc's gmtime_r says 'GMT' (Windows and macOS: 'UTC')
  return new StructTime([tm.year, tm.mon, tm.mday, tm.hour, tm.min, tm.sec, tm.wday, tm.yday, 0, 'GMT', 0].map((x) => (typeof x === 'number' ? BigInt(x) : x)));
}

// localtime / ctime / mktime: checked like CPython, then refused
export function localtime(secs) {
  if (secs === undefined || secs === null) limit('localtime() without an argument reads the current time');
  objectToTimeT(secs, 'floor');
  return limit('localtime() converts with the time zone of the machine running Python');
}
export function ctime(secs) {
  if (secs === undefined || secs === null) limit('ctime() without an argument reads the current time');
  objectToTimeT(secs, 'floor');
  return limit('ctime() converts with the time zone of the machine running Python');
}
export function mktime(t) {
  gettmarg(t, 'mktime');
  return limit('mktime() converts with the time zone of the machine running Python');
}

// ─── time tuples (gettmarg / checktm) ───────────────────────
// PyArg "i" on Linux (64-bit C long)
function cIntArg(v) {
  if (v instanceof PyFloat || (typeof v === 'number' && !Number.isInteger(v)) || (v && typeof v === 'object' && v.float !== undefined)) {
    raise('TypeError', "'float' object cannot be interpreted as an integer");
  }
  const n = asNum(v);
  if (n === null) return notInteger(v);
  if (n.int < LONG_MIN || n.int > LONG_MAX) raise('OverflowError', 'Python int too large to convert to C long');
  if (n.int > BigInt(INT_MAX)) raise('OverflowError', 'signed integer is greater than maximum');
  if (n.int < BigInt(INT_MIN)) raise('OverflowError', 'signed integer is less than minimum');
  return Number(n.int);
}
// PyLong_AsLong (tm_gmtoff of a struct_time argument)
function cLong(v) {
  if (v instanceof PyFloat || (v && typeof v === 'object' && v.float !== undefined)) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const n = asNum(v);
  if (n === null) return notInteger(v);
  if (n.int < LONG_MIN || n.int > LONG_MAX) raise('OverflowError', 'Python int too large to convert to C long');
  return n.int;
}
const wrap32 = (x) => x | 0; // C int arithmetic overflow wraps (two's complement)

// gettmarg(): a struct tm from a 9-tuple or struct_time
export function gettmarg(v, fn) {
  let items;
  const isStruct = v instanceof StructTime;
  if (isStruct) items = v.items.slice(0, 9);
  else if (v && v.__pyTuple) items = v.__pyTuple;
  else raise('TypeError', 'Tuple or struct_time argument required');
  if (items.length !== 9) raise('TypeError', `${fn}(): illegal time tuple argument`);
  const a = items.map(cIntArg);
  if (a[0] < INT_MIN + 1900) raise('OverflowError', 'year out of range');
  const tm = {
    year: a[0] - 1900, mon: wrap32(a[1] - 1), mday: a[2], hour: a[3], min: a[4], sec: a[5],
    wday: wrap32(a[6] + 1) % 7, yday: wrap32(a[7] - 1), isdst: a[8], zone: null, gmtoff: 0n,
  };
  if (isStruct) {
    const zone = v.items[9];
    if (zone !== null && zone !== undefined) {
      if (typeof zone !== 'string') raise('TypeError', 'bad argument type for built-in operation');
      if (/[\uD800-\uDFFF]/u.test(zone)) limit('a tm_zone with surrogate characters cannot be encoded');
      tm.zone = zone;
    }
    const off = v.items[10];
    if (off !== null && off !== undefined) tm.gmtoff = cLong(off);
  }
  return tm;
}
// checktm(): range checks, with 0 accepted for month, day and day of year
export function checktm(tm) {
  if (tm.mon === -1) tm.mon = 0;
  else if (tm.mon < 0 || tm.mon > 11) raise('ValueError', 'month out of range');
  if (tm.mday === 0) tm.mday = 1;
  else if (tm.mday < 0 || tm.mday > 31) raise('ValueError', 'day of month out of range');
  if (tm.hour < 0 || tm.hour > 23) raise('ValueError', 'hour out of range');
  if (tm.min < 0 || tm.min > 59) raise('ValueError', 'minute out of range');
  if (tm.sec < 0 || tm.sec > 61) raise('ValueError', 'seconds out of range');
  if (tm.wday < 0) raise('ValueError', 'day of week out of range');
  if (tm.yday === -1) tm.yday = 0;
  else if (tm.yday < 0 || tm.yday > 365) raise('ValueError', 'day of year out of range');
  return tm;
}

// ─── asctime ────────────────────────────────────────────────
const WDAY_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const p2 = (n) => String(n).padStart(2, '0');
// "%s %s%3d %.2d:%.2d:%.2d %d"
const asctimeTm = (tm) => `${WDAY_SUN[tm.wday]} ${MON[tm.mon]}${String(tm.mday).padStart(3, ' ')} ${p2(tm.hour)}:${p2(tm.min)}:${p2(tm.sec)} ${tm.year + 1900}`;
export function asctime(t) {
  if (t === undefined) limit('asctime() without an argument formats the current local time');
  return asctimeTm(checktm(gettmarg(t, 'asctime')));
}

// ─── strftime ───────────────────────────────────────────────
// The conversions glibc would perform in a chunk, as { mod, conv } — the
// same grammar cStrftime parses (flags _-0^#, width, E/O, conversion).
const GLIBC_OK = {
  '': 'abcdeghjklmnprstuwxyzABCDFGHIMPRSTUVWXYZ%',
  E: 'cnprstuxyzCPRTXYZ%',
  O: 'bdeghjklmnprstuwyzBCGHIMPRSTUVWZ%',
};
function directives(chunk) {
  const out = [];
  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i] !== '%') continue;
    const start = i;
    let flags = '';
    while (chunk[i + 1] !== undefined && '_-0^#'.includes(chunk[i + 1])) { flags += chunk[i + 1]; i += 1; }
    let width = -1;
    if (chunk[i + 1] >= '0' && chunk[i + 1] <= '9') {
      width = 0;
      while (chunk[i + 1] >= '0' && chunk[i + 1] <= '9') { width = Math.min(width * 10 + Number(chunk[i + 1]), 1e9); i += 1; }
    }
    let mod = '';
    if (chunk[i + 1] === 'E' || chunk[i + 1] === 'O') { mod = chunk[i + 1]; i += 1; }
    const conv = chunk[i + 1];
    if (conv === undefined) break;
    i += 1;
    out.push({ start, end: i + 1, flags, width, mod, conv, valid: GLIBC_OK[mod].includes(conv) });
  }
  return out;
}
// glibc sets "upper case" for %#b / %#h BEFORE it rejects the E modifier,
// so the copied directive comes out upper-cased ('%#Eb' → '%#EB'); the
// shared cStrftime copies it unchanged, so those are rendered here
const glibcBadEbh = (d) => d.mod === 'E' && (d.conv === 'b' || d.conv === 'h') && d.flags.includes('#');
function renderBadEbh(chunk, d) {
  const text = chunk.slice(d.start, d.end).toUpperCase();
  const pad = [...d.flags].reverse().find((c) => '_-0'.includes(c));
  const delta = d.width - text.length;
  if (delta > 1e6) throw Object.assign(new Error('too long'), { tooLong: true });
  return (delta > 0 ? (pad === '0' ? '0' : ' ').repeat(delta) : '') + text;
}
// time_strftime1(): the C buffer starts at 1024 characters and doubles while
// strftime() returns 0, up to 256 * len(chunk); it then gives up with ''.
// bufsize carries over from one chunk to the next.
function strftime1(state, chunk, f) {
  const fmtlen = chunk.length;
  const dirs = directives(chunk);
  for (const { conv, valid } of dirs) {
    if (!valid) continue;
    if (conv === 'z' || conv === 'Z') {
      limit(`%${conv} comes from the C library and the machine's time zone: Linux reads the struct's tm_gmtoff/tm_zone, Windows prints the local zone`);
    }
    if ((conv === 'G' || conv === 'g') && f[0] >= INT_MAX) limit('the ISO year overflows a C int here');
  }
  let res;
  let n;
  try {
    // ordinary runs go to cStrftime; the few directives it copies
    // differently from glibc are rendered by renderBadEbh
    res = '';
    let from = 0;
    for (const d of dirs) {
      if (!glibcBadEbh(d)) continue;
      if (d.start > from) res += cStrftime(chunk.slice(from, d.start), f);
      res += renderBadEbh(chunk, d);
      from = d.end;
    }
    if (from < chunk.length) res += cStrftime(chunk.slice(from), f);
    n = [...res].length;
  } catch (e) {
    if (!(e && e.tooLong)) throw e;
    n = Infinity;
  }
  for (;;) {
    if (n > 0 && n < state.bufsize) return res;
    if (state.bufsize < 256 * fmtlen) { state.bufsize += state.bufsize; continue; }
    if (n === Infinity && state.bufsize > 1e6) limit('an output of more than a million characters is not emulated');
    return '';
  }
}
// time.strftime(format[, t])
export function strftime(fmt, t) {
  if (typeof fmt !== 'string') raise('TypeError', `strftime() argument 1 must be str, not ${argTypeName(fmt)}`);
  if (t === undefined) limit('strftime() without a tuple formats the current local time');
  const tm = checktm(gettmarg(t, 'strftime'));
  if (tm.isdst < -1) tm.isdst = -1;
  else if (tm.isdst > 1) tm.isdst = 1;
  // the struct as cStrftime takes it: [year, month 1-12, mday, H, M, S,
  // weekday (Monday = 0), day of year (1-based), isdst]
  const f = [tm.year + 1900, tm.mon + 1, tm.mday, tm.hour, tm.min, tm.sec, (tm.wday + 6) % 7, tm.yday + 1, tm.isdst];
  // 3.13: runs of ASCII characters other than NUL go to the C strftime one
  // chunk at a time; everything from a non-ASCII or NUL character up to
  // the next '%' is copied as it is
  const cps = [...fmt];
  const state = { bufsize: 1024 };
  let out = '';
  let i = 0;
  while (i < cps.length) {
    let chunk = '';
    for (; i < cps.length; i++) {
      const c = cps[i].codePointAt(0);
      if (c === 0 || c > 127) break;
      chunk += cps[i];
    }
    if (chunk) out += strftime1(state, chunk, f);
    for (; i < cps.length; i++) {
      if (cps[i] === '%') break;
      out += cps[i];
    }
  }
  return out;
}

// ─── strptime ───────────────────────────────────────────────
// time.strptime(string, format='%a %b %d %H:%M:%S %Y') → struct_time of the
// first 11 items of _strptime()'s tuple
export function strptime(s, fmt = '%a %b %d %H:%M:%S %Y') {
  let tt;
  try {
    ({ tt } = strptimeTuple(s, fmt));
  } catch (e) {
    if (e instanceof PyException && typeof fmt === 'string') {
      // %Z matches 'utc', 'gmt' and the zone names in time.tzname of the
      // machine running Python (the port models a machine in UTC), so
      // whether the text matches depends on that machine
      const zoneDirective = [...fmt.matchAll(/%(O?.)/gu)].some((m) => m[1] === 'Z');
      if (zoneDirective && /^(time data |unconverted data remains)/u.test(e.message)) {
        limit("%Z also accepts the local time zone names of the machine running Python, so whether this text matches depends on that machine");
      }
      // the traceback's last line loses a trailing newline of the message
      // ('unconverted data remains: \n' shows as 'unconverted data remains: ')
      if (/\n$/u.test(e.message)) throw new PyException(e.name, e.message.replace(/\n+$/u, ''));
    }
    throw e;
  }
  return new StructTime(tt.map((x) => (typeof x === 'number' ? BigInt(x) : x)));
}

// ─── sleep / clocks ─────────────────────────────────────────
// time.sleep(secs): _PyTime_FromSecondsObject with _PyTime_ROUND_TIMEOUT
// (= round away from zero), then the sign check. The demo never waits.
export function sleep(secs) {
  const n = asNum(secs);
  if (n === null) return notInteger(secs);
  let ns;
  if (n.float !== undefined) {
    if (Number.isNaN(n.float)) raise('ValueError', 'Invalid value NaN (not a number)');
    const d = pyRound(n.float * 1e9, 'up');
    if (!(-TWO63 <= d && d < TWO63)) raise('OverflowError', 'timestamp out of range for platform time_t');
    ns = BigInt(d);
  } else {
    const tooBig = () => raise('OverflowError', 'timestamp too large to convert to C PyTime_t');
    if (n.int < LONG_MIN || n.int > LONG_MAX) tooBig();
    ns = n.int * 1000000000n;
    if (ns < LONG_MIN || ns > LONG_MAX) tooBig();
  }
  if (ns < 0n) raise('ValueError', 'sleep length must be non-negative');
  return null;
}

export class ClockInfo {
  constructor(name, monotonic, adjustable) { Object.assign(this, { name, monotonic, adjustable }); }
}
// the flags are the same on Linux, macOS and Windows; implementation and
// resolution are not (pyrepr refuses them)
const CLOCKS = {
  time: [false, true],
  monotonic: [true, false],
  perf_counter: [true, false],
  process_time: [true, false],
  thread_time: [true, false],
};
export function getClockInfo(name) {
  if (typeof name !== 'string') raise('TypeError', `get_clock_info() argument 1 must be str, not ${argTypeName(name)}`);
  // PyArg "s": UTF-8 encode first, then reject NUL
  [...name].forEach((ch, i) => {
    const cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      raise('UnicodeEncodeError', `'utf-8' codec can't encode character '\\u${cp.toString(16)}' in position ${i}: surrogates not allowed`);
    }
  });
  if (name.includes('\0')) raise('ValueError', 'embedded null character');
  if (!Object.prototype.hasOwnProperty.call(CLOCKS, name)) raise('ValueError', 'unknown clock');
  const [monotonic, adjustable] = CLOCKS[name];
  return new ClockInfo(name, monotonic, adjustable);
}
// the clock functions: what calling one returns, as far as it is knowable
export const CLOCK_FUNCTIONS = {
  monotonic: 'float', monotonic_ns: 'int',
  perf_counter: 'float', perf_counter_ns: 'int',
  process_time: 'float', process_time_ns: 'int',
  thread_time: 'float', thread_time_ns: 'int',
};
// every public name of the time module on Windows, Linux or macOS
export const TIME_NAMES = [
  'altzone', 'asctime', 'ctime', 'daylight', 'get_clock_info', 'gmtime', 'localtime', 'mktime',
  'monotonic', 'monotonic_ns', 'perf_counter', 'perf_counter_ns', 'process_time', 'process_time_ns',
  'sleep', 'strftime', 'strptime', 'struct_time', 'thread_time', 'thread_time_ns', 'time', 'time_ns',
  'timezone', 'tzname', 'tzset', 'clock_getres', 'clock_gettime', 'clock_gettime_ns', 'clock_settime',
  'clock_settime_ns', 'pthread_getcpuclockid', 'CLOCK_BOOTTIME', 'CLOCK_HIGHRES', 'CLOCK_MONOTONIC',
  'CLOCK_MONOTONIC_RAW', 'CLOCK_MONOTONIC_RAW_APPROX', 'CLOCK_PROCESS_CPUTIME_ID', 'CLOCK_PROF',
  'CLOCK_REALTIME', 'CLOCK_TAI', 'CLOCK_THREAD_CPUTIME_ID', 'CLOCK_UPTIME', 'CLOCK_UPTIME_RAW',
  'CLOCK_UPTIME_RAW_APPROX',
];

// ─── calendar.timegm (Lib/calendar.py) ──────────────────────
const EPOCH_ORD = 719163; // datetime.date(1970, 1, 1).toordinal()
// timegm(tuple): year, month, day, hour, minute, second = tuple[:6]
export function timegm(t) {
  let items;
  if (t instanceof StructTime) items = t.items.slice(0, 9);
  else if (Array.isArray(t)) items = t;
  else if (t && t.__pyTuple) items = t.__pyTuple;
  else return limit('timegm() of something that is not a tuple or struct_time');
  const six = items.slice(0, 6);
  if (six.length < 6) raise('ValueError', `not enough values to unpack (expected 6, got ${six.length})`);
  const [year, month, day, hour, minute, second] = six.map(asNum);
  if (![year, month, day, hour, minute, second].every((x) => x && x.int !== undefined)) {
    return limit('timegm() of non-integer fields');
  }
  // datetime.date(year, month, 1): the "i" converter first (Linux), then the range checks
  for (const x of [year, month]) {
    if (x.int > LONG_MAX || x.int < LONG_MIN) raise('OverflowError', 'Python int too large to convert to C long');
    if (x.int > BigInt(INT_MAX)) raise('OverflowError', 'signed integer is greater than maximum');
    if (x.int < BigInt(INT_MIN)) raise('OverflowError', 'signed integer is less than minimum');
  }
  const ord = dtDate(year.int, month.int, 1n).ord();
  const days = BigInt(ord - EPOCH_ORD) + day.int - 1n;
  return ((days * 24n + hour.int) * 60n + minute.int) * 60n + second.int;
}
