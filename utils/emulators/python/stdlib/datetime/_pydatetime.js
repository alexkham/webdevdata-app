// utils/emulators/python/stdlib/datetime/_pydatetime.js
//
// Port of CPython 3.13's datetime module for the datetime demos — shared by
// the module hub and every member emulator. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// Sources: Lib/_pydatetime.py for the algorithms, but the behaviour and the
// error messages follow the C implementation (Modules/_datetimemodule.c),
// which is what `import datetime` really runs: fromisoformat's byte-level
// parser, timedelta's accum() for float components, divide_nearest()
// rounding, the richcompare rules, "Invalid isoformat string: '...'".
// strptime is a port of Lib/_strptime.py (both implementations call it),
// with the C locale's English names.
//
// Platform choices (the only places CPython differs between OSes):
//   - strftime directives beyond the C89 set (%e, %-d, %G, %V, %u, %C, %D,
//     %F, %T, %R, %k, %l, %P, %r, flags _ - 0 ^ #, widths) follow glibc
//     (Linux) in the C locale — Windows rejects most of them with
//     "Invalid format string". %s depends on the local timezone and is
//     refused with an explanatory EmulatorLimit error.
//   - C long range for date/time constructor arguments follows Windows
//     (32-bit long: "Python int too large to convert to C long").
//   - fromtimestamp beyond year 9999 follows glibc ("year N is out of
//     range"; Windows raises OSError).
// Anything that needs the local timezone (naive astimezone(), naive
// timestamp(), fromtimestamp() without tz) throws EmulatorLimit — the demo
// templates never reach it.
//
// Value model (JS side):
//   int → bigint or safe JS integer · float → PyFloat · str → string
//   timedelta → Timedelta · date → PyDate · datetime → PyDateTime
//   time → PyTime · timezone → PyTimezone · custom fixed tzinfo → FixedTzinfo
// pyv(value) renders repr() exactly; asPy(value) wraps it for pyReprExact.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

// a demo 'number' input as the Python value of its literal text
// ({ int } or { float }; 'inf' is a NameError, as in CPython)
export const lit = (n) => fromLiteral(n);

export const raise = (type, msg) => { throw new PyException(type, msg); };
const limit = (msg) => { throw new PyException('EmulatorLimit', msg); };

export class PyFloat {
  constructor(v) { this.v = v; }
}
export const pyFloat = (v) => new PyFloat(v);

// ─── numbers ────────────────────────────────────────────────
// Python number from an engine argument: { int: bigint } | { float: number }
export function num(v) {
  if (typeof v === 'bigint') return { int: v };
  if (typeof v === 'boolean') return { int: v ? 1n : 0n };
  if (typeof v === 'number') return Number.isInteger(v) ? { int: BigInt(v) } : { float: v };
  if (v instanceof PyFloat) return { float: v.v };
  if (v && (v.int !== undefined || v.float !== undefined)) return v;
  return null;
}
export const typeName = (v) => {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (v instanceof PyFloat) return 'float';
  if (v && v.int !== undefined) return 'int';
  if (v && v.float !== undefined) return 'float';
  if (v instanceof Timedelta) return 'datetime.timedelta';
  if (v instanceof PyDateTime) return 'datetime.datetime';
  if (v instanceof PyDate) return 'datetime.date';
  if (v instanceof PyTime) return 'datetime.time';
  if (v instanceof PyTimezone) return 'datetime.timezone';
  if (v instanceof FixedTzinfo) return v.clsName;
  return 'object';
};
// bare type name as tp_name shows it for builtins ('int', 'str') and
// 'datetime.timedelta' for the datetime types
const C_LONG_MIN = -(2n ** 31n);
const C_LONG_MAX = 2n ** 31n - 1n;
const C_INT_MIN = -(2n ** 31n);
const C_INT_MAX = 2n ** 31n - 1n;

// PyArg "i" for the date/time constructor fields (Windows: long == int)
function cInt(v) {
  const n = num(v);
  if (n === null) raise('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);
  if (n.float !== undefined) raise('TypeError', "'float' object cannot be interpreted as an integer");
  if (n.int < C_LONG_MIN || n.int > C_LONG_MAX) raise('OverflowError', 'Python int too large to convert to C long');
  return Number(n.int);
}

// floor divmod on bigints (Python semantics)
export function divmod(a, b) {
  let q = a / b;
  let r = a % b;
  if (r !== 0n && (r < 0n) !== (b < 0n)) { q -= 1n; r += b; }
  return [q, r];
}
// round-half-even a/b (CPython divide_nearest / _PyLong_DivmodNear)
export function divNearest(a, b) {
  const [q, r] = divmod(a, b);
  const twice = 2n * r;
  const gt = b > 0n ? twice > b : twice < b;
  if (gt || (twice === b && (q & 1n) === 1n)) return q + 1n;
  return q;
}
const bitLength = (x) => (x === 0n ? 0 : x.toString(2).length);
// correctly rounded int / int true division (long_true_divide)
export function trueDiv(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'division by zero');
  const neg = (a < 0n) !== (b < 0n);
  let x = a < 0n ? -a : a;
  const y = b < 0n ? -b : b;
  if (x === 0n) return neg ? -0 : 0;
  const LIM = 2n ** 53n;
  let r;
  if (x <= LIM && y <= LIM) r = Number(x) / Number(y);
  else {
    const k = bitLength(x) - bitLength(y) - 60;
    let q;
    let rem;
    if (k >= 0) { q = x / (y << BigInt(k)); rem = x % (y << BigInt(k)); } else { q = (x << BigInt(-k)) / y; rem = (x << BigInt(-k)) % y; }
    q = (q << 1n) | (rem !== 0n ? 1n : 0n);
    r = Number(q) * 2 ** (k - 1);
    if (!Number.isFinite(r)) raise('OverflowError', 'integer division result too large for a float');
  }
  x = 0n;
  return neg ? -r : r;
}
// C round(): half away from zero
const cRound = (x) => {
  const t = Math.trunc(x);
  const d = x - t;
  if (d >= 0.5) return t + 1;
  if (d <= -0.5) return t - 1;
  return t;
};
// C modf
const modf = (x) => {
  const ip = Math.trunc(x);
  return [x - ip, ip];
};
const bigFromDouble = (d) => {
  if (Number.isNaN(d)) raise('ValueError', 'cannot convert float NaN to integer');
  if (!Number.isFinite(d)) raise('OverflowError', 'cannot convert float infinity to integer');
  return BigInt(d);
};
// float.as_integer_ratio
function asIntegerRatio(x) {
  if (Number.isNaN(x)) raise('ValueError', 'cannot convert NaN to integer ratio');
  if (!Number.isFinite(x)) raise('OverflowError', 'cannot convert Infinity to integer ratio');
  if (x === 0) return [0n, 1n];
  let den = 1n;
  let f = x;
  while (!Number.isInteger(f)) { f *= 2; den *= 2n; }
  return [BigInt(f), den];
}

// ─── calendar helpers (_pydatetime) ─────────────────────────
export const MINYEAR = 1;
export const MAXYEAR = 9999;
const MAXORDINAL = 3652059;
const DAYS_IN_MONTH = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS_BEFORE_MONTH = [-1];
{ let dbm = 0; for (const dim of DAYS_IN_MONTH.slice(1)) { DAYS_BEFORE_MONTH.push(dbm); dbm += dim; } }
export const isLeap = (y) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
const fdiv = (a, b) => Math.floor(a / b);
const daysBeforeYear = (y) => { const z = y - 1; return z * 365 + fdiv(z, 4) - fdiv(z, 100) + fdiv(z, 400); };
export const daysInMonth = (y, m) => (m === 2 && isLeap(y) ? 29 : DAYS_IN_MONTH[m]);
const daysBeforeMonth = (y, m) => DAYS_BEFORE_MONTH[m] + (m > 2 && isLeap(y) ? 1 : 0);
export const ymd2ord = (y, m, d) => daysBeforeYear(y) + daysBeforeMonth(y, m) + d;
const DI400Y = daysBeforeYear(401);
const DI100Y = daysBeforeYear(101);
const DI4Y = daysBeforeYear(5);
export function ord2ymd(n0) {
  let n = n0 - 1;
  const n400 = fdiv(n, DI400Y); n -= n400 * DI400Y;
  let year = n400 * 400 + 1;
  const n100 = fdiv(n, DI100Y); n -= n100 * DI100Y;
  const n4 = fdiv(n, DI4Y); n -= n4 * DI4Y;
  const n1 = fdiv(n, 365); n -= n1 * 365;
  year += n100 * 100 + n4 * 4 + n1;
  if (n1 === 4 || n100 === 4) return [year - 1, 12, 31];
  const leap = n1 === 3 && (n4 !== 24 || n100 === 3);
  let month = (n + 50) >> 5;
  let preceding = DAYS_BEFORE_MONTH[month] + (month > 2 && leap ? 1 : 0);
  if (preceding > n) { month -= 1; preceding -= DAYS_IN_MONTH[month] + (month === 2 && leap ? 1 : 0); }
  n -= preceding;
  return [year, month, n + 1];
}
const isoWeek1Monday = (year) => {
  const THURSDAY = 3;
  const firstday = ymd2ord(year, 1, 1);
  const firstweekday = (firstday + 6) % 7;
  let week1monday = firstday - firstweekday;
  if (firstweekday > THURSDAY) week1monday += 7;
  return week1monday;
};
export const MONTHNAMES = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const FULL_MONTHNAMES = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAYNAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const FULL_DAYNAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function checkDateFields(y, m, d) {
  if (y < MINYEAR || y > MAXYEAR) raise('ValueError', `year ${y} is out of range`);
  if (m < 1 || m > 12) raise('ValueError', 'month must be in 1..12');
  if (d < 1 || d > daysInMonth(y, m)) raise('ValueError', 'day is out of range for month');
}
function checkTimeFields(h, mi, s, us, fold) {
  if (h < 0 || h > 23) raise('ValueError', 'hour must be in 0..23');
  if (mi < 0 || mi > 59) raise('ValueError', 'minute must be in 0..59');
  if (s < 0 || s > 59) raise('ValueError', 'second must be in 0..59');
  if (us < 0 || us > 999999) raise('ValueError', 'microsecond must be in 0..999999');
  if (fold !== 0 && fold !== 1) raise('ValueError', 'fold must be either 0 or 1');
}
const isTzinfo = (tz) => tz instanceof PyTimezone || tz instanceof FixedTzinfo;
function checkTzinfoArg(tz) {
  if (tz !== null && tz !== undefined && !isTzinfo(tz)) {
    raise('TypeError', `tzinfo argument must be None or of a tzinfo subclass, not type '${typeName(tz)}'`);
  }
}

// ─── timedelta ──────────────────────────────────────────────
const US_PER_SECOND = 1000000n;
const US_PER_DAY = 86400000000n;
export class Timedelta {
  constructor(days, seconds, us) {
    this.days = days;
    this.seconds = seconds;
    this.us = us;
  }
  toUs() { return BigInt(this.days) * US_PER_DAY + BigInt(this.seconds) * US_PER_SECOND + BigInt(this.us); }
  isZero() { return this.days === 0 && this.seconds === 0 && this.us === 0; }
}
// microseconds_to_delta_ex
export function tdFromUs(total) {
  const [s, us] = divmod(total, US_PER_SECOND);
  const [d, sec] = divmod(s, 86400n);
  if (d < C_INT_MIN || d > C_INT_MAX) raise('OverflowError', 'Python int too large to convert to C int');
  if (d > 999999999n || d < -999999999n) raise('OverflowError', `days=${d}; must have magnitude <= 999999999`);
  return new Timedelta(Number(d), Number(sec), Number(us));
}
// new_delta(days, seconds, us, normalize) with small JS ints
export const td = (days = 0, seconds = 0, us = 0) => tdFromUs(BigInt(days) * US_PER_DAY + BigInt(seconds) * US_PER_SECOND + BigInt(us));

// timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0,
// hours=0, weeks=0) — C delta_new: components accumulated in the order
// us, ms, seconds, minutes, hours, days, weeks; float fractions summed in
// `leftover` and rounded half-even at the end.
const TD_FACTORS = [
  ['microseconds', 1n], ['milliseconds', 1000n], ['seconds', US_PER_SECOND],
  ['minutes', 60n * US_PER_SECOND], ['hours', 3600n * US_PER_SECOND],
  ['days', US_PER_DAY], ['weeks', 7n * US_PER_DAY],
];
export function timedelta(kw = {}) {
  let x = 0n;
  let leftover = 0;
  for (const [tag, factor] of TD_FACTORS) {
    if (!(tag in kw) || kw[tag] === undefined) continue;
    const n = num(kw[tag]);
    const tagName = tag === 'microseconds' ? 'microseconds' : tag;
    if (n === null) raise('TypeError', `unsupported type for timedelta ${tagName} component: ${typeName(kw[tag])}`);
    if (n.int !== undefined) { x += n.int * factor; continue; }
    const [frac, ip] = modf(n.float);
    x += bigFromDouble(ip) * factor;
    if (frac === 0) continue;
    const [frac2, ip2] = modf(Number(factor) * frac);
    x += bigFromDouble(ip2);
    leftover += frac2;
  }
  if (leftover !== 0) {
    let whole = cRound(leftover);
    if (Math.abs(whole - leftover) === 0.5) {
      const odd = (x & 1n) === 1n ? 1 : 0;
      whole = 2.0 * cRound((leftover + odd) * 0.5) - odd;
    }
    x += BigInt(whole);
  }
  return tdFromUs(x);
}

export function tdRepr(t) {
  const args = [];
  if (t.days) args.push(`days=${t.days}`);
  if (t.seconds) args.push(`seconds=${t.seconds}`);
  if (t.us) args.push(`microseconds=${t.us}`);
  return `datetime.timedelta(${args.length ? args.join(', ') : '0'})`;
}
const pad = (n, w) => {
  const s = String(Math.abs(n)).padStart(w, '0');
  return n < 0 ? '-' + s : s;
};
export function tdStr(t) {
  const mm = Math.floor(t.seconds / 60);
  const ss = t.seconds % 60;
  const hh = Math.floor(mm / 60);
  let s = `${hh}:${pad(mm % 60, 2)}:${pad(ss, 2)}`;
  if (t.days) s = `${t.days} day${Math.abs(t.days) !== 1 ? 's' : ''}, ` + s;
  if (t.us) s += '.' + pad(t.us, 6);
  return s;
}
export const tdNeg = (a) => tdFromUs(-a.toUs());
export const tdAbs = (a) => (a.days < 0 ? tdNeg(a) : a);
export const tdAdd = (a, b) => tdFromUs(a.toUs() + b.toUs());
export const tdSub = (a, b) => tdFromUs(a.toUs() - b.toUs());
export const tdCmp = (a, b) => { const x = a.toUs(); const y = b.toUs(); return x < y ? -1 : x > y ? 1 : 0; };
export const tdTotalSeconds = (a) => pyFloat(trueDiv(a.toUs(), US_PER_SECOND));
// timedelta * int / float (and int / float * timedelta)
export function tdMul(a, k) {
  const n = num(k);
  if (n === null) raise('TypeError', `unsupported operand type(s) for *: 'datetime.timedelta' and '${typeName(k)}'`);
  if (n.int !== undefined) return tdFromUs(a.toUs() * n.int);
  const [p, q] = asIntegerRatio(n.float);
  return tdFromUs(divNearest(a.toUs() * p, q));
}
// timedelta / x  → timedelta (x int/float) or float (x timedelta)
export function tdTrueDiv(a, b) {
  if (b instanceof Timedelta) return pyFloat(trueDiv(a.toUs(), b.toUs()));
  const n = num(b);
  if (n === null) raise('TypeError', `unsupported operand type(s) for /: 'datetime.timedelta' and '${typeName(b)}'`);
  if (n.int !== undefined) {
    if (n.int === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
    return tdFromUs(divNearest(a.toUs(), n.int));
  }
  const [p, q] = asIntegerRatio(n.float);
  if (p === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
  return tdFromUs(divNearest(a.toUs() * q, p));
}
// timedelta // x → timedelta (x int) or int (x timedelta)
export function tdFloorDiv(a, b) {
  if (b instanceof Timedelta) {
    const d = b.toUs();
    if (d === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
    return divmod(a.toUs(), d)[0];
  }
  const n = num(b);
  if (n === null || n.float !== undefined) raise('TypeError', `unsupported operand type(s) for //: 'datetime.timedelta' and '${typeName(b)}'`);
  if (n.int === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
  return tdFromUs(divmod(a.toUs(), n.int)[0]);
}
export function tdMod(a, b) {
  if (!(b instanceof Timedelta)) raise('TypeError', `unsupported operand type(s) for %: 'datetime.timedelta' and '${typeName(b)}'`);
  const d = b.toUs();
  if (d === 0n) raise('ZeroDivisionError', 'integer modulo by zero');
  return tdFromUs(divmod(a.toUs(), d)[1]);
}

// ─── tzinfo ─────────────────────────────────────────────────
export class PyTimezone {
  constructor(offset, name) {
    this.offset = offset;
    this.name = name;
  }
}
export const UTC = new PyTimezone(new Timedelta(0, 0, 0), null);
const TZ_MAX_US = US_PER_DAY; // strictly between -24h and 24h
function checkOffsetRange(off, suffixRepr = true) {
  const us = off.toUs();
  if (us <= -TZ_MAX_US || us >= TZ_MAX_US) {
    raise('ValueError', `offset must be a timedelta strictly between -timedelta(hours=24) and timedelta(hours=24)${suffixRepr ? `, not ${tdRepr(off)}.` : '.'}`);
  }
}
// timezone(offset, name=<omitted>)
export function timezone(offset, name) {
  if (!(offset instanceof Timedelta)) raise('TypeError', `timezone() argument 1 must be datetime.timedelta, not ${typeName(offset)}`);
  if (name !== undefined && typeof name !== 'string') raise('TypeError', `timezone() argument 2 must be str, not ${typeName(name)}`);
  if (name === undefined && offset.isZero()) return UTC;
  checkOffsetRange(offset);
  return new PyTimezone(offset, name === undefined ? null : name);
}
export const TZ_MIN = new PyTimezone(td(0, -(23 * 3600 + 59 * 60)), null);
export const TZ_MAX = new PyTimezone(td(0, 23 * 3600 + 59 * 60), null);
// "UTC+05:30" — timezone._name_from_offset
export function nameFromOffset(delta) {
  if (delta.isZero()) return 'UTC';
  let sign = '+';
  let d = delta;
  if (d.days < 0) { sign = '-'; d = tdNeg(d); }
  const hours = Math.floor(d.seconds / 3600);
  const rest = d.seconds % 3600;
  const minutes = Math.floor(rest / 60);
  const seconds = rest % 60;
  if (d.us) return `UTC${sign}${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(d.us, 6)}`;
  if (seconds) return `UTC${sign}${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
  return `UTC${sign}${pad(hours, 2)}:${pad(minutes, 2)}`;
}
export function tzRepr(tz) {
  if (tz === UTC) return 'datetime.timezone.utc';
  if (tz instanceof PyTimezone) {
    if (tz.name === null) return `datetime.timezone(${tdRepr(tz.offset)})`;
    return `datetime.timezone(${tdRepr(tz.offset)}, ${pyStrRepr(tz.name)})`;
  }
  return tz.reprText || `<${tz.clsName} object>`;
}
export const tzStr = (tz) => (tz instanceof PyTimezone ? (tz.name !== null ? tz.name : nameFromOffset(tz.offset)) : tzRepr(tz));

// A user tzinfo subclass with a fixed utcoffset/tzname/dst (the tzinfo
// page's `class Fixed(tzinfo)` demo). offset/dst are Timedelta or null.
export class FixedTzinfo {
  constructor({ offset = null, name = null, dst = null, clsName = '__main__.Fixed', reprText = null } = {}) {
    Object.assign(this, { offset, name, dstVal: dst, clsName, reprText });
  }
}

// tzinfo method results, checked the way the C code checks them
function tzUtcoffset(tz, dt) {
  if (tz === null || tz === undefined) return null;
  if (tz instanceof PyTimezone) return tz.offset;
  const off = tz.offset;
  if (off === null) return null;
  if (!(off instanceof Timedelta)) raise('TypeError', `tzinfo.utcoffset() must return None or timedelta, not '${typeName(off)}'`);
  checkOffsetRange(off, false); // a tzinfo result: message without ", not <repr>"
  return off;
}
function tzDst(tz, dt) {
  if (tz === null || tz === undefined) return null;
  if (tz instanceof PyTimezone) return null;
  const off = tz.dstVal;
  if (off === null) return null;
  checkOffsetRange(off, false);
  return off;
}
function tzTzname(tz, dt) {
  if (tz === null || tz === undefined) return null;
  if (tz instanceof PyTimezone) return tzStr(tz);
  return tz.name;
}

// ─── date / datetime / time ─────────────────────────────────
export class PyDate {
  constructor(y, m, d) { this.y = y; this.m = m; this.d = d; }
  ord() { return ymd2ord(this.y, this.m, this.d); }
}
export class PyDateTime extends PyDate {
  constructor(y, m, d, h = 0, mi = 0, s = 0, us = 0, tz = null, fold = 0) {
    super(y, m, d);
    Object.assign(this, { h, mi, s, us, tz, fold });
  }
}
export class PyTime {
  constructor(h = 0, mi = 0, s = 0, us = 0, tz = null, fold = 0) {
    Object.assign(this, { h, mi, s, us, tz, fold });
  }
}

// constructors with CPython's argument checks
export function date(y, m, d) {
  const [Y, M, D] = [cInt(y), cInt(m), cInt(d)];
  checkDateFields(Y, M, D);
  return new PyDate(Y, M, D);
}
export function datetime(y, m, d, h = 0, mi = 0, s = 0, us = 0, tz = null, fold = 0) {
  const a = [y, m, d, h, mi, s, us].map(cInt);
  const f = cInt(fold);
  checkDateFields(a[0], a[1], a[2]);
  checkTimeFields(a[3], a[4], a[5], a[6], f);
  checkTzinfoArg(tz);
  return new PyDateTime(a[0], a[1], a[2], a[3], a[4], a[5], a[6], tz || null, f);
}
export function time(h = 0, mi = 0, s = 0, us = 0, tz = null, fold = 0) {
  const a = [h, mi, s, us].map(cInt);
  const f = cInt(fold);
  checkTimeFields(a[0], a[1], a[2], a[3], f);
  checkTzinfoArg(tz);
  return new PyTime(a[0], a[1], a[2], a[3], tz || null, f);
}

export const DATE_MIN = new PyDate(1, 1, 1);
export const DATE_MAX = new PyDate(9999, 12, 31);
export const DATETIME_MIN = new PyDateTime(1, 1, 1);
export const DATETIME_MAX = new PyDateTime(9999, 12, 31, 23, 59, 59, 999999);
export const TIME_MIN = new PyTime(0, 0, 0, 0);
export const TIME_MAX = new PyTime(23, 59, 59, 999999);
export const TIMEDELTA_MIN = new Timedelta(-999999999, 0, 0);
export const TIMEDELTA_MAX = new Timedelta(999999999, 86399, 999999);
export const RESOLUTION = new Timedelta(0, 0, 1);
export const DATE_RESOLUTION = new Timedelta(1, 0, 0);

const isDT = (x) => x instanceof PyDateTime;
const isDate = (x) => x instanceof PyDate && !(x instanceof PyDateTime);

export function dateFromOrdinal(n) {
  const v = cInt(n);
  if (v < 1) raise('ValueError', 'ordinal must be >= 1');
  const [y, m, d] = ord2ymd(v);
  checkDateFields(y, m, d);
  return new PyDate(y, m, d);
}
export const toordinal = (d) => d.ord();
export const weekday = (d) => (d.ord() + 6) % 7;
export const isoweekday = (d) => ((d.ord() + 6) % 7) + 1;

export class IsoCal {
  constructor(year, week, weekday) { Object.assign(this, { year, week, weekday }); }
}
export function isocalendar(d) {
  let year = d.y;
  let week1monday = isoWeek1Monday(year);
  const today = ymd2ord(d.y, d.m, d.d);
  let week = fdiv(today - week1monday, 7);
  let day = (today - week1monday) - week * 7;
  if (week < 0) {
    year -= 1;
    week1monday = isoWeek1Monday(year);
    week = fdiv(today - week1monday, 7);
    day = (today - week1monday) - week * 7;
  } else if (week >= 52) {
    if (today >= isoWeek1Monday(year + 1)) { year += 1; week = 0; }
  }
  return new IsoCal(year, week + 1, day + 1);
}
// C iso_to_ymd: 0 ok, -2 bad week, -3 bad day, -4 bad year
function isoToYmd(year, week, day) {
  if (year < MINYEAR || year > MAXYEAR) return { rc: -4 };
  if (week <= 0 || week >= 53) {
    let out = true;
    if (week === 53) {
      const first = (ymd2ord(year, 1, 1) + 6) % 7;
      if (first === 3 || (first === 2 && isLeap(year))) out = false;
    }
    if (out) return { rc: -2 };
  }
  if (day <= 0 || day >= 8) return { rc: -3 };
  const day1 = isoWeek1Monday(year);
  const [y, m, d] = ord2ymd(day1 + (week - 1) * 7 + day - 1);
  return { rc: 0, y, m, d };
}
export function fromisocalendar(year, week, day) {
  const [Y, W, D] = [year, week, day].map(cInt);
  const r = isoToYmd(Y, W, D);
  if (r.rc === -4) raise('ValueError', `Year is out of range: ${Y}`);
  if (r.rc === -2) raise('ValueError', `Invalid week: ${W}`);
  if (r.rc === -3) raise('ValueError', `Invalid day: ${D} (range is [1, 7])`);
  checkDateFields(r.y, r.m, r.d);
  return new PyDate(r.y, r.m, r.d);
}

// ─── repr / str / isoformat ─────────────────────────────────
export function dateRepr(d) { return `datetime.date(${d.y}, ${d.m}, ${d.d})`; }
const timeArgs = (t) => {
  let s = `${t.h}, ${t.mi}`;
  if (t.us) s += `, ${t.s}, ${t.us}`;
  else if (t.s) s += `, ${t.s}`;
  return s;
};
export function dtRepr(t) {
  let s = `datetime.datetime(${t.y}, ${t.m}, ${t.d}, ${timeArgs(t)}`;
  if (t.fold) s += ', fold=1';
  if (t.tz) s += `, tzinfo=${tzRepr(t.tz)}`;
  return s + ')';
}
export function timeRepr(t) {
  // time puts tzinfo before fold (datetime does the opposite)
  let s = `datetime.time(${timeArgs(t)}`;
  if (t.tz) s += `, tzinfo=${tzRepr(t.tz)}`;
  if (t.fold) s += ', fold=1';
  return s + ')';
}
export const dateIso = (d) => `${pad(d.y, 4)}-${pad(d.m, 2)}-${pad(d.d, 2)}`;
const TIMESPECS = ['auto', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds'];
function formatTime(h, mi, s, us, timespec) {
  if (typeof timespec !== 'string') raise('TypeError', `isoformat() argument 'timespec' must be str, not ${typeName(timespec)}`);
  if (!TIMESPECS.includes(timespec)) raise('ValueError', 'Unknown timespec value');
  let spec = timespec;
  if (spec === 'auto') spec = us ? 'microseconds' : 'seconds';
  switch (spec) {
    case 'hours': return pad(h, 2);
    case 'minutes': return `${pad(h, 2)}:${pad(mi, 2)}`;
    case 'seconds': return `${pad(h, 2)}:${pad(mi, 2)}:${pad(s, 2)}`;
    case 'milliseconds': return `${pad(h, 2)}:${pad(mi, 2)}:${pad(s, 2)}.${pad(Math.floor(us / 1000), 3)}`;
    default: return `${pad(h, 2)}:${pad(mi, 2)}:${pad(s, 2)}.${pad(us, 6)}`;
  }
}
// format_utcoffset: +HH<sep>MM[<sep>SS[.ffffff]]
export function formatOffset(off, sep = ':') {
  if (off === null) return '';
  let sign = '+';
  let o = off;
  if (o.days < 0) { sign = '-'; o = tdNeg(o); }
  const hh = Math.floor(o.seconds / 3600);
  const mm = Math.floor((o.seconds % 3600) / 60);
  const ss = o.seconds % 60;
  let s = `${sign}${pad(hh, 2)}${sep}${pad(mm, 2)}`;
  if (ss || o.us) {
    s += `${sep}${pad(ss, 2)}`;
    if (o.us) s += '.' + pad(o.us, 6);
  }
  return s;
}
export function dtIsoformat(t, sep = 'T', timespec = 'auto') {
  if (typeof sep !== 'string' || [...sep].length !== 1) {
    raise('TypeError', `isoformat() argument 1 must be a unicode character, not ${typeName(sep)}`);
  }
  return dateIso(t) + sep + formatTime(t.h, t.mi, t.s, t.us, timespec) + formatOffset(utcoffset(t));
}
export function timeIsoformat(t, timespec = 'auto') {
  return formatTime(t.h, t.mi, t.s, t.us, timespec) + formatOffset(utcoffset(t));
}
export function isoformat(x, ...args) {
  if (isDT(x)) return dtIsoformat(x, ...args);
  if (x instanceof PyDate) return dateIso(x);
  return timeIsoformat(x, ...args);
}
export function str(x) {
  if (x instanceof Timedelta) return tdStr(x);
  if (isDT(x)) return dtIsoformat(x, ' ');
  if (x instanceof PyDate) return dateIso(x);
  if (x instanceof PyTime) return timeIsoformat(x);
  if (isTzinfo(x)) return tzStr(x);
  if (x instanceof PyFloat) return pyFloatRepr(x.v);
  return String(x);
}
export function ctime(x) {
  const wd = DAYNAMES[weekday(x)];
  const [h, mi, s] = isDT(x) ? [x.h, x.mi, x.s] : [0, 0, 0];
  return `${wd} ${MONTHNAMES[x.m]} ${String(x.d).padStart(2, ' ')} ${pad(h, 2)}:${pad(mi, 2)}:${pad(s, 2)} ${pad(x.y, 4)}`;
}

// ─── utcoffset / tzname / dst ───────────────────────────────
// datetime methods pass the datetime; time methods pass None
export const utcoffset = (x) => tzUtcoffset(x.tz, isDT(x) ? x : null);
export const dst = (x) => tzDst(x.tz, isDT(x) ? x : null);
export const tzname = (x) => tzTzname(x.tz, isDT(x) ? x : null);

// ─── arithmetic ─────────────────────────────────────────────
const opName = (v) => typeName(v);
function unsupported(op, a, b) {
  raise('TypeError', `unsupported operand type(s) for ${op}: '${opName(a)}' and '${opName(b)}'`);
}
function dtFromOrdAndTime(ordinal, secs, us, tz, isDatetime) {
  // secs may exceed a day; normalise into ordinal
  const days = fdiv(secs, 86400);
  const s = secs - days * 86400;
  const o = ordinal + days;
  if (o < 1 || o > MAXORDINAL) raise('OverflowError', 'date value out of range');
  const [y, m, d] = ord2ymd(o);
  if (!isDatetime) return new PyDate(y, m, d);
  return new PyDateTime(y, m, d, Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60, us, tz, 0);
}
function addDtTd(a, t, sign = 1) {
  // exact microsecond arithmetic
  const base = BigInt(a.ord()) * US_PER_DAY + BigInt((a.h * 3600 + a.mi * 60 + a.s)) * US_PER_SECOND + BigInt(a.us);
  const total = base + BigInt(sign) * t.toUs();
  const [dayN, rest] = divmod(total, US_PER_DAY);
  if (dayN < 1n || dayN > BigInt(MAXORDINAL)) raise('OverflowError', 'date value out of range');
  const [secs, us] = divmod(rest, US_PER_SECOND);
  return dtFromOrdAndTime(Number(dayN), Number(secs), Number(us), a.tz, true);
}
function addDateTd(a, t, sign = 1) {
  const o = a.ord() + sign * t.days;
  if (o < 1 || o > MAXORDINAL) raise('OverflowError', 'date value out of range');
  const [y, m, d] = ord2ymd(o);
  return new PyDate(y, m, d);
}
export function add(a, b) {
  if (a instanceof Timedelta && b instanceof Timedelta) return tdAdd(a, b);
  if (a instanceof Timedelta && b instanceof PyDate) return add(b, a);
  if (b instanceof Timedelta) {
    if (isDT(a)) return addDtTd(a, b, 1);
    if (a instanceof PyDate) return addDateTd(a, b, 1);
  }
  return unsupported('+', a, b);
}
export function sub(a, b) {
  if (a instanceof Timedelta && b instanceof Timedelta) return tdSub(a, b);
  if (b instanceof Timedelta) {
    if (isDT(a)) return addDtTd(a, b, -1);
    if (a instanceof PyDate) return addDateTd(a, b, -1);
  }
  if (isDT(a) && isDT(b)) {
    let off1 = null;
    let off2 = null;
    if (a.tz !== b.tz) {
      off1 = utcoffset(a);
      off2 = utcoffset(b);
      if ((off1 === null) !== (off2 === null)) raise('TypeError', "can't subtract offset-naive and offset-aware datetimes");
    }
    const us = (x) => BigInt(x.ord()) * US_PER_DAY + BigInt(x.h * 3600 + x.mi * 60 + x.s) * US_PER_SECOND + BigInt(x.us);
    let r = tdFromUs(us(a) - us(b));
    if (off1 !== null && off2 !== null && tdCmp(off1, off2) !== 0) r = tdSub(r, tdSub(off1, off2));
    return r;
  }
  if (isDate(a) && isDate(b)) return td(a.ord() - b.ord());
  return unsupported('-', a, b);
}
export function mul(a, b) {
  if (a instanceof Timedelta) return tdMul(a, b);
  if (b instanceof Timedelta) return tdMul(b, a);
  return unsupported('*', a, b);
}

// ─── comparisons ────────────────────────────────────────────
const OPS = { '<': (c) => c < 0, '<=': (c) => c <= 0, '>': (c) => c > 0, '>=': (c) => c >= 0, '==': (c) => c === 0, '!=': (c) => c !== 0 };
const lex = (xs, ys) => { for (let i = 0; i < xs.length; i++) { if (xs[i] !== ys[i]) return xs[i] < ys[i] ? -1 : 1; } return 0; };
const dtFields = (x) => [x.y, x.m, x.d, x.h, x.mi, x.s, x.us];
const timeFields = (x) => [x.h, x.mi, x.s, x.us];
export function compare(a, b, op) {
  const test = OPS[op];
  const notSupported = () => raise('TypeError', `'${op}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
  if (a instanceof Timedelta && b instanceof Timedelta) return test(tdCmp(a, b));
  if (isDT(a) && isDT(b)) {
    if (a.tz === b.tz) return test(lex(dtFields(a), dtFields(b)));
    const o1 = utcoffset(a);
    const o2 = utcoffset(b);
    if ((o1 === null && o2 === null) || (o1 && o2 && tdCmp(o1, o2) === 0)) return test(lex(dtFields(a), dtFields(b)));
    if (o1 && o2) { const d = sub(a, b); return test(d.days !== 0 ? Math.sign(d.days) : (d.seconds || d.us ? 1 : 0)); }
    if (op === '==') return false;
    if (op === '!=') return true;
    return raise('TypeError', "can't compare offset-naive and offset-aware datetimes");
  }
  if (isDate(a) && isDate(b)) return test(lex([a.y, a.m, a.d], [b.y, b.m, b.d]));
  if (a instanceof PyTime && b instanceof PyTime) {
    if (a.tz === b.tz) return test(lex(timeFields(a), timeFields(b)));
    const o1 = utcoffset(a);
    const o2 = utcoffset(b);
    if ((o1 === null && o2 === null) || (o1 && o2 && tdCmp(o1, o2) === 0)) return test(lex(timeFields(a), timeFields(b)));
    if (o1 && o2) {
      const tot = (x, o) => BigInt(x.h * 3600 + x.mi * 60 + x.s) * US_PER_SECOND + BigInt(x.us) - o.toUs();
      const x = tot(a, o1); const y = tot(b, o2);
      return test(x < y ? -1 : x > y ? 1 : 0);
    }
    if (op === '==') return false;
    if (op === '!=') return true;
    return raise('TypeError', "can't compare offset-naive and offset-aware times");
  }
  if (op === '==') return false;
  if (op === '!=') return true;
  return notSupported();
}

// ─── conversions ────────────────────────────────────────────
export function replace(x, kw = {}) {
  const has = (k) => kw[k] !== undefined;
  if (x instanceof Timedelta || isTzinfo(x)) raise('AttributeError', `'${typeName(x)}' object has no attribute 'replace'`);
  if (isDT(x)) {
    const tz = 'tzinfo' in kw ? kw.tzinfo : x.tz;
    return datetime(has('year') ? kw.year : x.y, has('month') ? kw.month : x.m, has('day') ? kw.day : x.d,
      has('hour') ? kw.hour : x.h, has('minute') ? kw.minute : x.mi, has('second') ? kw.second : x.s,
      has('microsecond') ? kw.microsecond : x.us, tz, has('fold') ? kw.fold : x.fold);
  }
  if (x instanceof PyDate) return date(has('year') ? kw.year : x.y, has('month') ? kw.month : x.m, has('day') ? kw.day : x.d);
  const tz = 'tzinfo' in kw ? kw.tzinfo : x.tz;
  return time(has('hour') ? kw.hour : x.h, has('minute') ? kw.minute : x.mi, has('second') ? kw.second : x.s,
    has('microsecond') ? kw.microsecond : x.us, tz, has('fold') ? kw.fold : x.fold);
}
export function combine(d, t, tzinfo) {
  if (!(d instanceof PyDate)) raise('TypeError', `combine() argument 1 must be datetime.date, not ${typeName(d)}`);
  if (!(t instanceof PyTime)) raise('TypeError', `combine() argument 2 must be datetime.time, not ${typeName(t)}`);
  const tz = tzinfo === undefined ? t.tz : tzinfo;
  checkTzinfoArg(tz);
  return new PyDateTime(d.y, d.m, d.d, t.h, t.mi, t.s, t.us, tz || null, t.fold);
}
export const dtDate = (x) => new PyDate(x.y, x.m, x.d);
export const dtTime = (x) => new PyTime(x.h, x.mi, x.s, x.us, null, x.fold);
export const dtTimetz = (x) => new PyTime(x.h, x.mi, x.s, x.us, x.tz, x.fold);

// tzinfo.fromutc — timezone's own, or the generic tzinfo algorithm
export function fromutc(tz, dt) {
  if (!isDT(dt)) raise('TypeError', 'fromutc: argument must be a datetime');
  if (dt.tz !== tz) raise('ValueError', 'fromutc: dt.tzinfo is not self');
  if (tz instanceof PyTimezone) return addDtTd(dt, tz.offset, 1);
  const off = utcoffset(dt);
  if (off === null) raise('ValueError', 'fromutc: non-None utcoffset() result required');
  let d = dst(dt);
  if (d === null) raise('ValueError', 'fromutc: non-None dst() result required');
  const delta = tdSub(off, d);
  let res = dt;
  if (!delta.isZero()) {
    res = addDtTd(dt, delta, 1);
    d = dst(res);
    if (d === null) raise('ValueError', 'fromutc: tz.dst() gave inconsistent results; cannot convert');
  }
  return addDtTd(res, d, 1);
}
export function astimezone(x, tz) {
  if (tz === undefined || tz === null) limit('astimezone() without a tz converts to the local timezone of the machine running Python');
  if (!isTzinfo(tz)) raise('TypeError', `astimezone() argument 1 must be datetime.tzinfo, not ${typeName(tz)}`);
  if (x.tz === tz) return x;
  const off = utcoffset(x);
  if (off === null) limit('a naive datetime is taken as local time by astimezone() — depends on the machine running Python');
  const utc = addDtTd(new PyDateTime(x.y, x.m, x.d, x.h, x.mi, x.s, x.us, UTC, 0), off, -1);
  utc.tz = tz;
  return fromutc(tz, utc);
}

// struct_time
export class StructTime {
  constructor(fields) { this.f = fields; }
}
const structTime = (y, m, d, hh, mm, ss, isdst) => new StructTime([y, m, d, hh, mm, ss, (ymd2ord(y, m, d) + 6) % 7, daysBeforeMonth(y, m) + d, isdst]);
export function timetuple(x) {
  if (isDT(x)) {
    const d = dst(x);
    const flag = d === null ? -1 : d.isZero() ? 0 : 1;
    return structTime(x.y, x.m, x.d, x.h, x.mi, x.s, flag);
  }
  return structTime(x.y, x.m, x.d, 0, 0, 0, -1);
}
export function utctimetuple(x) {
  const off = utcoffset(x);
  let u = x;
  if (off !== null) u = addDtTd(x, off, -1);
  return structTime(u.y, u.m, u.d, u.h, u.mi, u.s, 0);
}

// timestamps
const EPOCH = new PyDateTime(1970, 1, 1, 0, 0, 0, 0, UTC, 0);
export function timestamp(x) {
  if (utcoffset(x) === null) limit('timestamp() of a naive datetime assumes local time — depends on the machine running Python');
  return tdTotalSeconds(sub(x, EPOCH));
}
const TIME_T_MAX = 2 ** 63;
function roundHalfEven(x) {
  let r = cRound(x);
  if (Math.abs(x - r) === 0.5) r = 2.0 * cRound(x / 2.0);
  return r;
}
// datetime.fromtimestamp(t, tz) for an explicit tz (gmtime path)
export function fromtimestamp(t, tz) {
  if (tz === undefined || tz === null) limit('fromtimestamp() without tz uses the local timezone of the machine running Python');
  checkTzinfoArg(tz);
  const n = num(t);
  if (n === null) raise('TypeError', `'${typeName(t)}' object cannot be interpreted as an integer`);
  let secs;
  let us = 0;
  if (n.int !== undefined) {
    if (n.int >= 2n ** 63n || n.int < -(2n ** 63n)) raise('OverflowError', 'timestamp out of range for platform time_t');
    secs = n.int;
  } else {
    if (Number.isNaN(n.float)) raise('ValueError', 'Invalid value NaN (not a number)');
    let [fp, ip] = modf(n.float);
    fp = roundHalfEven(fp * 1e6);
    if (fp >= 1e6) { fp -= 1e6; ip += 1; } else if (fp < 0) { fp += 1e6; ip -= 1; }
    if (!(ip >= -TIME_T_MAX && ip < TIME_T_MAX)) raise('OverflowError', 'timestamp out of range for platform time_t');
    secs = BigInt(ip);
    us = fp;
  }
  const [days, rem] = divmod(secs, 86400n);
  const ordinal = days + 719163n; // 1970-01-01
  if (ordinal < 1n || ordinal > BigInt(MAXORDINAL)) {
    // gmtime (glibc) fails with EOVERFLOW when tm_year = year - 1900
    // overflows a C int; otherwise CPython's `tm_year + 1900` is computed
    // in a C int too and wraps
    let y = yearOfDays(days);
    if (y - 1900n > C_INT_MAX || y - 1900n < C_INT_MIN) raise('OSError', '[Errno 75] Value too large for defined data type');
    if (y > C_INT_MAX) y -= 2n ** 32n;
    raise('ValueError', `year ${y} is out of range`);
  }
  const [y, m, d] = ord2ymd(Number(ordinal));
  const s = Number(rem);
  const utc = new PyDateTime(y, m, d, Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60, us, tz, 0);
  return fromutc(tz, utc);
}
// proleptic Gregorian year of a day count from 1970-01-01 (bigint), any size
function yearOfDays(days) {
  const n = days + 719162n; // days since 0001-01-01 (0-based)
  const [n400, r400] = divmod(n, 146097n);
  let year = n400 * 400n + 1n;
  const [y, , ] = ord2ymd(Number(r400) + 1);
  year += BigInt(y - 1);
  return year;
}
export function utcfromtimestamp(t) {
  const dt = fromtimestamp(t, UTC);
  dt.tz = null;
  return dt;
}

// ─── fromisoformat (C parser, byte level) ───────────────────
const utf8 = (s) => {
  // lone surrogates cannot be UTF-8 encoded → invalid string
  if (/[\uD800-\uDFFF]/u.test(s)) return null;
  return [...new TextEncoder().encode(s), 0];
};
const isDigitB = (c) => c >= 48 && c <= 57;
function parseDigits(b, p, n) {
  let v = 0;
  for (let i = 0; i < n; i++) {
    const t = b[p] - 48;
    if (!(t >= 0 && t <= 9)) return null;
    v = v * 10 + t;
    p += 1;
  }
  return { p, v };
}
// returns { rc, y, m, d }
function parseIsoDate(b, start, len) {
  let r = parseDigits(b, start, 4);
  if (!r) return { rc: -1 };
  let p = r.p;
  let year = r.v;
  const usesSep = b[p] === 45;
  if (usesSep) p += 1;
  if (b[p] === 87) { // 'W'
    p += 1;
    r = parseDigits(b, p, 2);
    if (!r) return { rc: -3 };
    p = r.p;
    const week = r.v;
    let day = 1;
    if (p - start < len) {
      if (usesSep && b[p++] !== 45) return { rc: -2 };
      r = parseDigits(b, p, 1);
      if (!r) return { rc: -4 };
      day = r.v;
    }
    const iso = isoToYmd(year, week, day);
    if (iso.rc) return { rc: -3 + iso.rc };
    return { rc: 0, y: iso.y, m: iso.m, d: iso.d };
  }
  r = parseDigits(b, p, 2);
  if (!r) return { rc: -1 };
  p = r.p;
  const month = r.v;
  if (usesSep && b[p++] !== 45) return { rc: -2 };
  r = parseDigits(b, p, 2);
  if (!r) return { rc: -1 };
  year = year + 0;
  return { rc: 0, y: year, m: month, d: r.v };
}
// parse_hh_mm_ss_ff over b[start, end)
function parseHhMmSsFf(b, start, end) {
  const vals = [0, 0, 0];
  let us = 0;
  let p = start;
  let hasSep = true;
  let broke = false;
  for (let i = 0; i < 3; i++) {
    const r = parseDigits(b, p, 2);
    if (!r) return { rc: -3 };
    p = r.p;
    vals[i] = r.v;
    const c = b[p++];
    if (i === 0) hasSep = c === 58;
    if (p >= end) return { rc: c !== 0 ? 1 : 0, h: vals[0], mi: vals[1], s: vals[2], us };
    if (hasSep && c === 58) {
      continue;
    } else if (c === 46 || c === 44) {
      broke = true;
      break;
    } else if (!hasSep) {
      p -= 1;
    } else {
      return { rc: -4 };
    }
  }
  void broke;
  const remains = end - p;
  const toParse = remains >= 6 ? 6 : remains;
  const r = parseDigits(b, p, toParse);
  if (!r) return { rc: -3 };
  p = r.p;
  us = r.v;
  const CORR = [100000, 10000, 1000, 100, 10];
  if (toParse < 6) us *= CORR[toParse - 1];
  while (isDigitB(b[p])) p += 1;
  return { rc: b[p] !== 0 ? 1 : 0, h: vals[0], mi: vals[1], s: vals[2], us, p };
}
// parse_isoformat_time over b[start, start+len)
function parseIsoTime(b, start, len) {
  const end = start + len;
  let tzpos = start;
  do {
    const c = b[tzpos];
    if (c === 90 || c === 43 || c === 45) break;
  } while (++tzpos < end);
  const t = parseHhMmSsFf(b, start, tzpos);
  if (t.rc < 0) return t;
  if (tzpos === end) {
    if (t.rc === 1) return { rc: -5 };
    return { ...t, rc: 0 };
  }
  if (b[tzpos] === 90) {
    if (b[tzpos + 1] !== 0) return { rc: -5 };
    return { ...t, rc: 1, tzoff: 0, tzus: 0 };
  }
  const sign = b[tzpos] === 45 ? -1 : 1;
  tzpos += 1;
  const z = parseHhMmSsFf(b, tzpos, end);
  if (z.rc < 0) return { rc: -5 };
  return { ...t, rc: z.rc ? -5 : 1, tzoff: sign * (z.h * 3600 + z.mi * 60 + z.s), tzus: sign * z.us };
}
function tzFromIso(rc, tzoff, tzus) {
  if (rc !== 1) return null;
  if (tzoff === 0) return UTC;
  const delta = td(0, tzoff, tzus);
  return timezone(delta);
}
const invalidIso = (s) => raise('ValueError', `Invalid isoformat string: ${pyStrRepr(s)}`);
function findSeparator(b, len) {
  if (len === 7) return 7;
  if (b[4] === 45) {
    if (b[5] === 87) {
      if (len < 8) return -1;
      if (len > 8 && b[8] === 45) {
        if (len === 9) return -1;
        if (len > 10 && isDigitB(b[10])) return 8;
        return 10;
      }
      return 8;
    }
    return 10;
  }
  if (b[4] === 87) {
    let idx = 7;
    for (; idx < len; idx++) if (!isDigitB(b[idx])) break;
    if (idx < 9) return idx;
    return idx % 2 === 0 ? 7 : 8;
  }
  return 8;
}
export function dateFromisoformat(s) {
  if (typeof s !== 'string') raise('TypeError', 'fromisoformat: argument must be str');
  const b = utf8(s);
  if (!b) return invalidIso(s);
  const len = b.length - 1;
  const r = len === 7 || len === 8 || len === 10 ? parseIsoDate(b, 0, len) : { rc: -1 };
  if (r.rc < 0) return invalidIso(s);
  return date(r.y, r.m, r.d);
}
export function timeFromisoformat(s) {
  if (typeof s !== 'string') raise('TypeError', 'fromisoformat: argument must be str');
  const b = utf8(s);
  if (!b) return invalidIso(s);
  let start = 0;
  let len = b.length - 1;
  if (b[0] === 84) { start = 1; len -= 1; }
  const t = parseIsoTime(b, start, len);
  if (t.rc < 0) return invalidIso(s);
  // (3.13 has no 24:00 special case — that arrived in 3.14)
  const tz = tzFromIso(t.rc, t.tzoff, t.tzus);
  return time(t.h, t.mi, t.s, t.us, tz);
}
export function dtFromisoformat(s) {
  if (typeof s !== 'string') raise('TypeError', 'fromisoformat: argument must be str');
  const cps = [...s];
  if (cps.length < 7) return invalidIso(s);
  // _sanitize_isoformat_str: a non-ASCII character (surrogates included) at
  // code-point position 7, 8 or 10 is the separator → replaced by 'T', so
  // any single character works as the separator (verified: é, ᛇ, emoji)
  let clean = s;
  for (const pos of [7, 8, 10]) {
    if (pos >= cps.length) break;
    if (cps[pos].codePointAt(0) > 0x7f) { const cc = [...cps]; cc[pos] = 'T'; clean = cc.join(''); break; }
  }
  const b = utf8(clean);
  if (!b) return invalidIso(s);
  const len = b.length - 1;
  const sepLoc = findSeparator(b, len);
  let r = parseIsoDate(b, 0, sepLoc);
  let t = { rc: 0, h: 0, mi: 0, s: 0, us: 0 };
  if (!r.rc && len > sepLoc) {
    t = parseIsoTime(b, sepLoc + 1, len - sepLoc - 1);
    r = { ...r, rc: t.rc };
  }
  if (r.rc < 0) return invalidIso(s);
  const tz = tzFromIso(t.rc, t.tzoff, t.tzus);
  return datetime(r.y, r.m, r.d, t.h, t.mi, t.s, t.us, tz);
}
export function fromisoformat(cls, s) {
  if (cls === 'date') return dateFromisoformat(s);
  if (cls === 'time') return timeFromisoformat(s);
  return dtFromisoformat(s);
}

// ─── strftime ───────────────────────────────────────────────
// wrap_strftime: %z %:z %Z %f are expanded by datetime itself, the rest by
// the platform's strftime (glibc here, see the header).
export function strftime(x, fmt) {
  if (typeof fmt !== 'string') raise('TypeError', `strftime() argument 1 must be str, not ${typeName(fmt)}`);
  const isTime = x instanceof PyTime;
  const cp = [...fmt];
  let out = '';
  for (let i = 0; i < cp.length; i++) {
    const ch = cp[i];
    if (ch !== '%') { out += ch; continue; }
    if (i + 1 >= cp.length) { out += '%'; continue; }
    const c = cp[++i];
    if (c === 'z') out += isDate(x) ? '' : formatOffset(utcoffset(x), '');
    else if (c === ':' && cp[i + 1] === 'z') { i += 1; out += isDate(x) ? '' : formatOffset(utcoffset(x), ':'); }
    else if (c === 'Z') {
      const n = isDate(x) ? null : tzname(x);
      if (n !== null && typeof n !== 'string') raise('TypeError', `tzinfo.tzname() must return None or a string, not '${typeName(n)}'`);
      out += n === null ? '' : n.replace(/%/g, '%%');
    } else if (c === 'f') out += pad(isDate(x) ? 0 : x.us, 6);
    else out += '%' + c;
  }
  // time.strftime(newformat, timetuple): a time object uses 1900-01-01
  const tt = isTime ? structTime(1900, 1, 1, x.h, x.mi, x.s, -1).f : timetuple(x).f;
  if (out.includes('\0')) raise('ValueError', 'embedded null character');
  // time.strftime retries with a doubling buffer (1024, 2048, ...) and
  // gives up — returning '' — once it reaches 256 * len(format)
  const fmtlen = [...out].length;
  let res;
  try { res = cStrftime(out, tt); } catch (e) { if (e === TOO_LONG) return ''; throw e; }
  const n = [...res].length;
  for (let size = 1024; ; size += size) {
    if (n > 0 && n < size) return res;
    if (size >= 256 * fmtlen) return '';
  }
}
const isoYearWeek = (y, yday0, wday) => {
  // glibc iso_week_days
  const isoWeekDays = (yd, wd) => { const BIG = 382; return yd - ((yd - wd + BIG) % 7) + 3; };
  let year = y;
  let days = isoWeekDays(yday0, wday);
  if (days < 0) {
    year -= 1;
    days = isoWeekDays(yday0 + (isLeap(year) ? 366 : 365), wday);
  } else {
    const d = isoWeekDays(yday0 - (isLeap(year) ? 366 : 365), wday);
    if (d >= 0) { year += 1; days = d; }
  }
  return { year, week: Math.floor(days / 7) + 1 };
};
// glibc __strftime_internal (strftime_l.c) in the C locale. Conversions
// valid without a modifier / after E / after O were measured on glibc 2.39
// (anything else is copied through literally, padded to the width).
const GLIBC_OK = {
  '': 'abcdeghjklmnprstuwxyzABCDFGHIMPRSTUVWXYZ%',
  E: 'cnprstuxyzCPRTXYZ%',
  O: 'bdeghjklmnprstuwyzBCGHIMPRSTUVWZ%',
};
const TOO_LONG = { tooLong: true };
export function cStrftime(fmt, f) {
  const [Y, mon, mday, H, M, S, wday0, yday] = f;
  const wdaySun = (wday0 + 1) % 7; // tm_wday: Sunday = 0
  const yday0 = yday - 1;
  const cp = [...fmt];
  let out = '';
  for (let i = 0; i < cp.length; i++) {
    if (cp[i] !== '%') { out += cp[i]; continue; }
    const start = i;
    let pad = null; // null (no flag) | '_' | '-' | '0'
    let toUpper = false;
    let changeCase = false;
    for (;;) {
      const c = cp[i + 1];
      if (c === '_' || c === '-' || c === '0') { pad = c; i += 1; } else if (c === '^') { toUpper = true; i += 1; } else if (c === '#') { changeCase = true; i += 1; } else break;
    }
    let width = -1;
    if (cp[i + 1] >= '0' && cp[i + 1] <= '9') {
      width = 0;
      while (cp[i + 1] >= '0' && cp[i + 1] <= '9') { width = Math.min(width * 10 + Number(cp[i + 1]), 1e9); i += 1; }
    }
    let mod = '';
    if (cp[i + 1] === 'E' || cp[i + 1] === 'O') { mod = cp[i + 1]; i += 1; }
    let conv = cp[i + 1];
    if (conv === undefined) conv = null; else i += 1; // % at the end: copy through
    let toLower = false;

    // add(n, text): pad to `width` with zeros (flag 0) or spaces
    const add = (s) => {
      const n = [...s].length;
      const delta = width - n;
      if (delta > 1e6) throw TOO_LONG; // far beyond any buffer time.strftime tries
      if (delta > 0) out += (pad === '0' ? '0' : ' ').repeat(delta);
      out += s;
    };
    const cpy = (s) => add(toLower ? s.toLowerCase() : toUpper ? s.toUpperCase() : s);
    const number = (d, v, spacepad = false) => {
      let p = pad;
      if (spacepad && p !== '0' && p !== '-') p = '_';
      const digits = d > width ? d : width;
      const neg = v < 0;
      let s = String(Math.abs(v));
      if (neg) s = '-' + s;
      if (p !== '-') {
        const padding = digits - s.length;
        if (padding > 1e6) throw TOO_LONG;
        if (padding > 0) {
          if (p === '_') {
            out += ' '.repeat(padding);
            width = width > padding ? width - padding : 0;
          } else {
            s = neg ? '-' + '0'.repeat(padding) + s.slice(1) : '0'.repeat(padding) + s;
            width = 0;
          }
        }
      }
      const savedPad = pad;
      pad = p;
      add(s);
      pad = savedPad;
    };
    const subformat = (sf) => {
      let s = cStrftime(sf, f);
      if (toUpper) s = s.toUpperCase();
      add(s);
    };
    const literal = () => cpy(cp.slice(start, i + 1).join(''));
    if (conv === null || !GLIBC_OK[mod].includes(conv)) { literal(); continue; }
    const iso = () => isoYearWeek(Y, yday0, wdaySun);
    switch (conv) {
      case '%': case 'n': case 't': add(conv === '%' ? '%' : conv === 'n' ? '\n' : '\t'); break;
      case 'a': case 'A': case 'b': case 'h': case 'B': {
        if (changeCase) { toUpper = true; toLower = false; }
        const s = conv === 'a' ? DAYNAMES[wday0] : conv === 'A' ? FULL_DAYNAMES[wday0] : conv === 'B' ? FULL_MONTHNAMES[mon] : MONTHNAMES[mon];
        cpy(s);
        break;
      }
      case 'P': case 'p': {
        if (conv === 'P') toLower = true;
        if (changeCase) { toUpper = false; toLower = true; }
        cpy(H >= 12 ? 'PM' : 'AM');
        break;
      }
      case 'c': subformat('%a %b %e %H:%M:%S %Y'); break;
      case 'D': case 'x': subformat('%m/%d/%y'); break;
      case 'F': subformat('%Y-%m-%d'); break;
      case 'r': subformat('%I:%M:%S %p'); break;
      case 'R': subformat('%H:%M'); break;
      case 'T': case 'X': subformat('%H:%M:%S'); break;
      case 'C': number(1, Math.floor(Y / 100)); break;
      case 'd': number(2, mday); break;
      case 'e': number(2, mday, true); break;
      case 'g': number(2, ((iso().year % 100) + 100) % 100); break;
      case 'G': number(1, iso().year); break;
      case 'H': number(2, H); break;
      case 'I': number(2, H % 12 === 0 ? 12 : H % 12); break;
      case 'j': number(3, yday); break;
      case 'k': number(2, H, true); break;
      case 'l': number(2, H % 12 === 0 ? 12 : H % 12, true); break;
      case 'm': number(2, mon); break;
      case 'M': number(2, M); break;
      case 'S': number(2, S); break;
      case 'u': number(1, wdaySun === 0 ? 7 : wdaySun); break;
      case 'U': number(2, Math.floor((yday0 - wdaySun + 7) / 7)); break;
      case 'V': number(2, iso().week); break;
      case 'w': number(1, wdaySun); break;
      case 'W': number(2, Math.floor((yday0 - ((wdaySun - 1 + 7) % 7) + 7) / 7)); break;
      case 'y': number(2, ((Y % 100) + 100) % 100); break;
      case 'Y': number(1, Y); break;
      // only reachable as %Ez / %Oz (datetime expands a plain %z itself):
      // glibc prints nothing when tm_isdst < 0, else the struct's offset,
      // which Python's struct_time leaves at 0
      case 'z': add(f[8] >= 0 ? '+0000' : ''); break;
      case 's': limit('%s depends on the local timezone of the machine running Python'); break;
      // reached as %EZ / %OZ, or when a tzname() containing "%Z" is spliced
      // in: no zone in the struct → '' if tm_isdst < 0, else the local name
      case 'Z':
        if (f[8] >= 0) limit('%Z here prints the local timezone name of the machine running Python');
        add('');
        break;
      default: literal();
    }
  }
  return out;
}

// ─── strptime (Lib/_strptime.py, C locale) ──────────────────
// The pattern is built in PYTHON regex syntax exactly as TimeRE does (so
// error positions match), then translated to a JS RegExp.
const PY_WS = '[\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000]';
const LOWER = (xs) => xs.map((s) => s.toLowerCase());
const F_WEEKDAY = LOWER(FULL_DAYNAMES);
const A_WEEKDAY = LOWER(DAYNAMES);
const F_MONTH = [''].concat(LOWER(FULL_MONTHNAMES.slice(1)));
const A_MONTH = [''].concat(LOWER(MONTHNAMES.slice(1)));
const AM_PM = ['am', 'pm'];
const TZ_NAMES = ['utc', 'gmt']; // + the machine's local zone names in real CPython
// __seqToRE: sorted(key=len, reverse=True) is stable — ties keep list order
const seq = (list, dir) => {
  const sorted = list.map((s, i) => [s, i]).sort((a, b) => b[0].length - a[0].length || a[1] - b[1]).map(([s]) => s);
  return `(?P<${dir}>${sorted.map((s) => s.replace(/[.*+?^${}()|[\]\\ ]/g, '\\$&')).join('|')})`;
};
const MAPPING = {
  d: '(?P<d>3[0-1]|[1-2]\\d|0[1-9]|[1-9]| [1-9])',
  f: '(?P<f>[0-9]{1,6})',
  H: '(?P<H>2[0-3]|[0-1]\\d|\\d)',
  I: '(?P<I>1[0-2]|0[1-9]|[1-9]| [1-9])',
  G: '(?P<G>\\d\\d\\d\\d)',
  j: '(?P<j>36[0-6]|3[0-5]\\d|[1-2]\\d\\d|0[1-9]\\d|00[1-9]|[1-9]\\d|0[1-9]|[1-9])',
  m: '(?P<m>1[0-2]|0[1-9]|[1-9])',
  M: '(?P<M>[0-5]\\d|\\d)',
  S: '(?P<S>6[0-1]|[0-5]\\d|\\d)',
  U: '(?P<U>5[0-3]|[0-4]\\d|\\d)',
  w: '(?P<w>[0-6])',
  u: '(?P<u>[1-7])',
  V: '(?P<V>5[0-3]|0[1-9]|[1-4]\\d|\\d)',
  y: '(?P<y>\\d\\d)',
  Y: '(?P<Y>\\d\\d\\d\\d)',
  z: '(?P<z>[+-]\\d\\d:?[0-5]\\d(:?[0-5]\\d(\\.\\d{1,6})?)?|(?-i:Z))',
  A: seq(F_WEEKDAY, 'A'),
  a: seq(A_WEEKDAY, 'a'),
  B: seq(F_MONTH.slice(1), 'B'),
  b: seq(A_MONTH.slice(1), 'b'),
  p: seq(AM_PM, 'p'),
  Z: seq(TZ_NAMES, 'Z'),
  '%': '%',
};
for (const d of 'dmyHIMS') MAPPING['O' + d] = `(?P<${d}>\\d\\d|\\d| \\d)`;
MAPPING.Ow = '(?P<w>\\d)';
MAPPING.W = MAPPING.U.replace('U', 'W');
class BadDirective extends Error {
  constructor(key) { super(key); this.key = key; }
}
// TimeRE.pattern(format) — Python regex syntax
function strptimePattern(format) {
  let f = format.replace(/([\\.^$*+?(){}[\]|])/g, '\\$1');
  f = f.replace(new RegExp(`${PY_WS}+`, 'gu'), '\\s+');
  f = f.replace(/'/g, "['ʼ]");
  // re.sub(r'%(O?.)', repl): '.' matches any character except \n
  f = f.replace(/%(O?[^\n])/gu, (whole, key) => {
    if (!(key in MAPPING)) throw new BadDirective(key);
    return MAPPING[key];
  });
  return f;
}
// LC_time / LC_date / LC_date_time of the C locale, for %X %x %c
MAPPING.X = strptimePattern('%H:%M:%S');
MAPPING.x = strptimePattern('%m/%d/%y');
MAPPING.c = strptimePattern('%a %b %d %H:%M:%S %Y');

// Python pattern → JS source, token by token (escapes kept as units):
// (?P<n> → (?<n>, \d → \p{Nd}, \s → Python's whitespace set, (?-i:Z) → Z.
// Duplicate group names raise re.PatternError exactly as sre_parse does.
function pyPatternToJs(py) {
  let out = '';
  let group = 0;
  const names = new Map();
  let i = 0;
  const cps = [...py];
  let pos = 0; // code-point index for error positions
  while (i < cps.length) {
    const c = cps[i];
    if (c === '\\') {
      const n = cps[i + 1];
      if (n === 'd') out += '\\p{Nd}';
      else if (n === 's') out += PY_WS;
      else if (n === ' ') out += ' ';
      else if (n === 'ʼ') out += 'ʼ';
      else out += '\\' + n;
      i += 2; pos += 2;
      continue;
    }
    if (c === '[') {
      // character class: copy through to the closing ']'
      let j = i + 1;
      let cls = '[';
      while (j < cps.length && cps[j] !== ']') {
        if (cps[j] === '\\') { cls += cps[j] + cps[j + 1]; j += 2; } else { cls += cps[j]; j += 1; }
      }
      cls += ']';
      out += cls;
      pos += j + 1 - i;
      i = j + 1;
      continue;
    }
    if (c === '(' && cps[i + 1] === '?' && cps[i + 2] === 'P' && cps[i + 3] === '<') {
      let j = i + 4;
      let name = '';
      while (cps[j] !== '>') { name += cps[j]; j += 1; }
      group += 1;
      if (names.has(name)) {
        const e = new PyException('re.PatternError', `redefinition of group name ${pyStrRepr(name)} as group ${group}; was group ${names.get(name)} at position ${pos + 4}`);
        throw e;
      }
      names.set(name, group);
      out += `(?<${name}>`;
      pos += j + 1 - i;
      i = j + 1;
      continue;
    }
    if (c === '(' && cps.slice(i, i + 7).join('') === '(?-i:Z)') {
      out += 'Z';
      i += 7; pos += 7;
      continue;
    }
    if (c === '(' && cps[i + 1] !== '?') group += 1;
    out += c;
    i += 1; pos += 1;
  }
  return out;
}

// Python int() of a string of Unicode decimal digits
const digitVal = (ch) => {
  let cp = ch.codePointAt(0);
  if (cp >= 48 && cp <= 57) return cp - 48;
  let base = cp;
  while (/\p{Nd}/u.test(String.fromCodePoint(base - 1))) base -= 1;
  return (cp - base) % 10;
};
const pyInt = (s) => { let v = 0; for (const ch of s) v = v * 10 + digitVal(ch); return v; };

function calcJulianFromUW(year, weekOfYear, dayOfWeek0, weekStartsMon) {
  let firstWeekday = weekday(new PyDate(year, 1, 1));
  let dow = dayOfWeek0;
  if (!weekStartsMon) { firstWeekday = (firstWeekday + 1) % 7; dow = (dow + 1) % 7; }
  const week0Length = (7 - firstWeekday) % 7;
  if (weekOfYear === 0) return 1 + dow - firstWeekday;
  return 1 + week0Length + 7 * (weekOfYear - 1) + dow;
}
export function strptimeTuple(data, format) {
  if (typeof data !== 'string') raise('TypeError', `strptime() argument 0 must be str, not <class '${typeName(data)}'>`);
  if (typeof format !== 'string') raise('TypeError', `strptime() argument 1 must be str, not <class '${typeName(format)}'>`);
  let src;
  try {
    src = strptimePattern(format);
  } catch (e) {
    if (!(e instanceof BadDirective)) throw e;
    const bad = e.key === '\\' ? '%' : e.key;
    return raise('ValueError', `'${bad}' is a bad directive in format '${format}'`);
  }
  const re = new RegExp('^(?:' + pyPatternToJs(src) + ')', 'iu');
  let found = re.exec(data);
  // the %z pattern's 'Z' is case-sensitive in CPython ((?-i:Z)); JS has no
  // inline modifier, so a lowercase 'z' match is rejected here
  if (found && found.groups && found.groups.z === 'z') found = null;
  if (!found) raise('ValueError', `time data ${pyStrRepr(data)} does not match format ${pyStrRepr(format)}`);
  const end = found[0].length;
  if (data.length !== end) raise('ValueError', `unconverted data remains: ${data.slice(end)}`);
  let isoYear = null;
  let year = null;
  let month = 1;
  let day = 1;
  let hour = 0;
  let minute = 0;
  let second = 0;
  let fraction = 0;
  let tz = -1;
  let gmtoff = null;
  let gmtoffFraction = 0;
  let isoWeek = null;
  let weekOfYear = null;
  let weekOfYearStart = null;
  let wd = null;
  let julian = null;
  const g = found.groups || {};
  // groupdict() order = order of the named groups in the pattern
  const keys = Object.keys(g).filter((k) => g[k] !== undefined);
  const order = [];
  const nameRe = /\(\?P<([A-Za-z])>/g;
  let mm;
  while ((mm = nameRe.exec(src)) !== null) if (!order.includes(mm[1]) && keys.includes(mm[1])) order.push(mm[1]);
  for (const k of order) {
    const v = g[k];
    switch (k) {
      case 'y': year = pyInt(v); year += year <= 68 ? 2000 : 1900; break;
      case 'Y': year = pyInt(v); break;
      case 'G': isoYear = pyInt(v); break;
      case 'm': month = pyInt(v.trim()); break;
      case 'B': month = F_MONTH.indexOf(v.toLowerCase()); break;
      case 'b': month = A_MONTH.indexOf(v.toLowerCase()); break;
      case 'd': day = pyInt(v.trim()); break;
      case 'H': hour = pyInt(v.trim()); break;
      case 'I': {
        hour = pyInt(v.trim());
        const ampm = (g.p || '').toLowerCase();
        if (ampm === '' || ampm === AM_PM[0]) { if (hour === 12) hour = 0; } else if (ampm === AM_PM[1]) { if (hour !== 12) hour += 12; }
        break;
      }
      case 'M': minute = pyInt(v.trim()); break;
      case 'S': second = pyInt(v.trim()); break;
      case 'f': fraction = pyInt(v + '0'.repeat(6 - v.length)); break;
      case 'A': wd = F_WEEKDAY.indexOf(v.toLowerCase()); break;
      case 'a': wd = A_WEEKDAY.indexOf(v.toLowerCase()); break;
      case 'w': wd = pyInt(v); wd = wd === 0 ? 6 : wd - 1; break;
      case 'u': wd = pyInt(v) - 1; break;
      case 'j': julian = pyInt(v); break;
      case 'U': case 'W': weekOfYear = pyInt(v); weekOfYearStart = k === 'U' ? 6 : 0; break;
      case 'V': isoWeek = pyInt(v); break;
      case 'z': {
        let z = v;
        if (z === 'Z') { gmtoff = 0; break; }
        const zc = [...z];
        if (zc[3] === ':') {
          zc.splice(3, 1);
          if (zc.length > 5) {
            if (zc[5] !== ':') raise('ValueError', `Inconsistent use of : in ${v}`);
            zc.splice(5, 1);
          }
        }
        z = zc.join('');
        const hrs = pyInt(zc.slice(1, 3).join(''));
        const mins = pyInt(zc.slice(3, 5).join(''));
        const secs = zc.slice(5, 7).length ? pyInt(zc.slice(5, 7).join('')) : 0;
        gmtoff = hrs * 3600 + mins * 60 + secs;
        const rem = zc.slice(8).join('');
        gmtoffFraction = pyInt(rem + '0'.repeat(6 - [...rem].length));
        if (z.startsWith('-')) { gmtoff = -gmtoff; gmtoffFraction = -gmtoffFraction; }
        break;
      }
      case 'Z': {
        const fz = v.toLowerCase();
        if (TZ_NAMES.includes(fz)) tz = 0;
        break;
      }
      default: break;
    }
  }
  if (isoYear !== null) {
    if (julian !== null) raise('ValueError', "Day of the year directive '%j' is not compatible with ISO year directive '%G'. Use '%Y' instead.");
    else if (isoWeek === null || wd === null) raise('ValueError', "ISO year directive '%G' must be used with the ISO week directive '%V' and a weekday directive ('%A', '%a', '%w', or '%u').");
  } else if (isoWeek !== null) {
    if (year === null || wd === null) raise('ValueError', "ISO week directive '%V' must be used with the ISO year directive '%G' and a weekday directive ('%A', '%a', '%w', or '%u').");
    else raise('ValueError', "ISO week directive '%V' is incompatible with the year directive '%Y'. Use the ISO year '%G' instead.");
  }
  let leapYearFix = false;
  if (year === null) {
    if (month === 2 && day === 29) { year = 1904; leapYearFix = true; } else year = 1900;
  }
  if (julian === null && wd !== null) {
    if (weekOfYear !== null) {
      julian = calcJulianFromUW(year, weekOfYear, wd, weekOfYearStart === 0);
    } else if (isoYear !== null && isoWeek !== null) {
      const r = fromisocalendar(isoYear, isoWeek, wd + 1);
      year = r.y; month = r.m; day = r.d;
    }
    if (julian !== null && julian <= 0) {
      year -= 1;
      julian += isLeap(year) ? 366 : 365;
    }
  }
  if (julian === null) {
    julian = date(year, month, day).ord() - date(year, 1, 1).ord() + 1;
  } else {
    const r = dateFromOrdinal((julian - 1) + date(year, 1, 1).ord());
    year = r.y; month = r.m; day = r.d;
  }
  if (wd === null) wd = weekday(date(year, month, day));
  const tzn = g.Z !== undefined ? g.Z : null;
  if (leapYearFix) year = 1900;
  return { tt: [year, month, day, hour, minute, second, wd, julian, tz, tzn, gmtoff], fraction, gmtoffFraction };
}
export function strptime(data, format) {
  const { tt, fraction, gmtoffFraction } = strptimeTuple(data, format);
  const [year, month, day, hour, minute, second] = tt;
  const tzn = tt[9];
  const gmtoff = tt[10];
  let tz = null;
  if (gmtoff !== null) {
    const delta = timedelta({ seconds: gmtoff, microseconds: gmtoffFraction });
    tz = tzn ? timezone(delta, tzn) : timezone(delta);
  }
  return datetime(year, month, day, hour, minute, second, fraction, tz);
}

// ─── repr of any value ──────────────────────────────────────
export function pyv(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : pyFloatRepr(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (v instanceof Timedelta) return tdRepr(v);
  if (v instanceof PyDateTime) return dtRepr(v);
  if (v instanceof PyDate) return dateRepr(v);
  if (v instanceof PyTime) return timeRepr(v);
  if (isTzinfo(v)) return tzRepr(v);
  if (v instanceof IsoCal) return `datetime.IsoCalendarDate(year=${v.year}, week=${v.week}, weekday=${v.weekday})`;
  if (v instanceof StructTime) {
    const n = ['tm_year', 'tm_mon', 'tm_mday', 'tm_hour', 'tm_min', 'tm_sec', 'tm_wday', 'tm_yday', 'tm_isdst'];
    return `time.struct_time(${n.map((k, i) => `${k}=${v.f[i]}`).join(', ')})`;
  }
  if (Array.isArray(v)) return '[' + v.map(pyv).join(', ') + ']';
  if (v.__pyTuple) {
    const items = v.__pyTuple.map(pyv);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  if (v.int !== undefined) return String(v.int);
  if (v.float !== undefined) return pyFloatRepr(v.float);
  return String(v);
}
export const asPy = (v) => ({ __pyRaw: pyv(v) });
export const tuple = (...items) => ({ __pyTuple: items });
