// utils/emulators/python/stdlib/calendar/_pycalendar.js
//
// Port of CPython 3.13's Lib/calendar.py for the calendar demos — shared by
// the module hub and every member emulator (bundled once per module map).
// Not a content page (leading underscore), so the catalog generator never
// maps it.
//
// Line-by-line port: Calendar (iterweekdays, the itermonth* generators, the
// month*/year* calendars), TextCalendar (formatday … formatyear, the pr*
// printers), HTMLCalendar (every format* method, the CSS class attributes,
// formatyearpage), the module-level interface (the shared TextCalendar
// instance behind firstweekday / setfirstweekday / monthcalendar / month /
// calendar / weekheader / prmonth / prcal), isleap, leapdays, weekday,
// monthrange, timegm, the Day and Month enums and the two exceptions with
// their exact messages. The small part of datetime.date it needs (argument
// conversion, range checks, toordinal, weekday, repr) is ported here too,
// instead of importing the much larger datetime engine.
//
// Month and day names are the C locale's (what CPython uses unless the
// program calls locale.setlocale). Where CPython's result depends on the
// platform, the port follows Linux (64-bit C long), like the datetime and
// time ports: a date field outside the C int range raises
//   OverflowError: signed integer is greater than maximum / less than minimum
// (Windows: "Python int too large to convert to C long"). Demo cases never
// use such values.
//
// Value model (JS side):
//   int → bigint · float → PyFloat · bool → boolean · str → string ·
//   None → null · tuple → { __pyTuple: [...] } · list → array ·
//   Day / Month members → EnumMember · datetime.date → PyDate ·
//   bytes → PyBytes (array of byte values).
// asPy(value) turns a result into what pyReprExact prints exactly.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

export const raise = (type, msg) => { throw new PyException(type, msg); };
// output the browser deliberately does not build (CPython would)
const limit = (msg) => { throw new PyException('DemoLimit', msg); };

// ─── values ──────────────────────────────────────────────────────────

export class PyFloat {
  constructor(v) { this.v = v; }
}

export class EnumMember {
  constructor(cls, name, value) { this.cls = cls; this.name = name; this.value = value; }
}

export class PyDate {
  constructor(y, m, d) { this.y = y; this.m = m; this.d = d; }
}

export class PyBytes {
  constructor(bytes) { this.bytes = bytes; }
}

const DAY_NAMES = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MONTH_NAMES = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY',
  'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

export const Day = DAY_NAMES.map((n, i) => new EnumMember('Day', n, BigInt(i)));
export const Month = MONTH_NAMES.map((n, i) => new EnumMember('Month', n, BigInt(i + 1)));
export const MONDAY = 0n;
export const SUNDAY = 6n;
export const JANUARY = 1n;
export const FEBRUARY = 2n;

// A demo argument as Python sees it: a number is the literal text shown in
// the code ('16' → int, '1e+21' → float, 'inf' → NameError); any other
// input (str, None, list) stays as it is.
export function arg(v) {
  if (typeof v !== 'number') return v;
  const p = fromLiteral(v);
  return p.int !== undefined ? p.int : new PyFloat(p.float);
}

export const isInt = (x) => typeof x === 'bigint' || typeof x === 'boolean' || x instanceof EnumMember;
const isFloat = (x) => x instanceof PyFloat;
const isNum = (x) => isInt(x) || isFloat(x);

// int value of an int-like (bool and IntEnum members are ints)
function iv(x) {
  if (typeof x === 'bigint') return x;
  if (typeof x === 'boolean') return x ? 1n : 0n;
  return x.value;
}
// float(x) for an int is correctly rounded — Number(bigint) rounds to nearest-even
const fv = (x) => (isFloat(x) ? x.v : Number(iv(x)));

export function typeName(x) {
  if (x === null || x === undefined) return 'NoneType';
  if (typeof x === 'boolean') return 'bool';
  if (typeof x === 'bigint') return 'int';
  if (x instanceof PyFloat) return 'float';
  if (typeof x === 'string') return 'str';
  if (x instanceof EnumMember) return x.cls;
  if (x instanceof PyDate) return 'datetime.date';
  if (Array.isArray(x)) return 'list';
  if (x && x.__pyTuple) return 'tuple';
  return 'object';
}

// repr() / str() of numbers and the other values the port produces
export function repr(x) {
  if (x === null || x === undefined) return 'None';
  if (typeof x === 'boolean') return x ? 'True' : 'False';
  if (typeof x === 'bigint') return String(x);
  if (x instanceof PyFloat) return pyFloatRepr(x.v);
  if (typeof x === 'string') return pyStrRepr(x);
  if (x instanceof EnumMember) return `calendar.${x.name}`;
  if (x instanceof PyDate) return `datetime.date(${x.y}, ${x.m}, ${x.d})`;
  if (x instanceof PyBytes) return bytesRepr(x.bytes);
  if (Array.isArray(x)) return '[' + x.map(repr).join(', ') + ']';
  if (x && x.__pyTuple) {
    const items = x.__pyTuple.map(repr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  return String(x);
}
// str(): an IntEnum member prints as its int value (3.11+ ReprEnum)
export function str(x) {
  if (typeof x === 'string') return x;
  if (x instanceof EnumMember) return String(x.value);
  if (x instanceof PyDate) return `${pad4(x.y)}-${pad2(x.m)}-${pad2(x.d)}`;
  return repr(x);
}
const pad2 = (n) => String(n).padStart(2, '0');
const pad4 = (n) => String(n).padStart(4, '0');

// value → what pyReprExact prints
export function asPy(x) {
  if (typeof x === 'string' || typeof x === 'boolean' || typeof x === 'bigint' || x === null) return x;
  if (Array.isArray(x)) return x.map(asPy);
  if (x && x.__pyTuple) return { __pyTuple: x.__pyTuple.map(asPy) };
  return { __pyRaw: repr(x) };
}

// ─── Python arithmetic on int / float ────────────────────────────────

// Python's float % (Objects/floatobject.c float_rem)
function floatMod(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float modulo by zero');
  let mod = vx % wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) mod += wx;
  } else {
    mod = Math.sign(1 / wx) < 0 ? -0 : 0;
  }
  return mod;
}
// Python's float // (_float_div_mod)
function floatFloorDiv(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float floor division by zero');
  let mod = vx % wx;
  let div = (vx - mod) / wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) { mod += wx; div -= 1.0; }
  }
  let floordiv;
  if (div) {
    floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1.0;
  } else {
    floordiv = (vx / wx < 0 || Object.is(vx / wx, -0)) ? -0 : 0;
  }
  return floordiv;
}

// both operands must be numbers; str and list have operators of their own
// (concatenation, % formatting, repetition) that the port does not build
function numbers(a, b, op) {
  if (isNum(a) && isNum(b)) return;
  if (typeof a === 'string' || typeof b === 'string' || Array.isArray(a) || Array.isArray(b)) {
    limit(`${typeName(a)} ${op} ${typeName(b)} is not reproduced in the browser demo.`);
  }
  raise('TypeError', `unsupported operand type(s) for ${op}: '${typeName(a)}' and '${typeName(b)}'`);
}

export function add(a, b) {
  numbers(a, b, '+');
  if (isInt(a) && isInt(b)) return iv(a) + iv(b);
  return new PyFloat(fv(a) + fv(b));
}
// op: how the subtraction is written in the source ('-' or '-=' for an
// augmented assignment), which the TypeError message repeats
export function sub(a, b, op = '-') {
  numbers(a, b, op);
  if (isInt(a) && isInt(b)) return iv(a) - iv(b);
  return new PyFloat(fv(a) - fv(b));
}
export function mul(a, b) {
  numbers(a, b, '*');
  if (isInt(a) && isInt(b)) return iv(a) * iv(b);
  return new PyFloat(fv(a) * fv(b));
}
export function mod(a, b) {
  numbers(a, b, '%');
  if (isInt(a) && isInt(b)) {
    const x = iv(a);
    const y = iv(b);
    if (y === 0n) raise('ZeroDivisionError', 'integer modulo by zero');
    let r = x % y;
    if (r !== 0n && (r < 0n) !== (y < 0n)) r += y;
    return r;
  }
  return new PyFloat(floatMod(fv(a), fv(b)));
}
export function floordiv(a, b) {
  numbers(a, b, '//');
  if (isInt(a) && isInt(b)) {
    const x = iv(a);
    const y = iv(b);
    if (y === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
    let q = x / y;
    if (x % y !== 0n && (x < 0n) !== (y < 0n)) q -= 1n;
    return q;
  }
  return new PyFloat(floatFloorDiv(fv(a), fv(b)));
}

// exact comparison (an int is never rounded to compare with a float)
export function cmp(a, b) {
  if (isInt(a) && isInt(b)) {
    const x = iv(a);
    const y = iv(b);
    return x < y ? -1 : x > y ? 1 : 0;
  }
  if (isFloat(a) && isFloat(b)) return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
  const flip = isFloat(a);
  const i = flip ? iv(b) : iv(a);
  const f = flip ? a.v : b.v;
  let r;
  if (f === Infinity) r = -1;
  else if (f === -Infinity) r = 1;
  else {
    const fl = BigInt(Math.floor(f));
    if (i < fl) r = -1;
    else if (i > fl) r = 1;
    else r = Number.isInteger(f) ? 0 : -1;
  }
  return flip ? -r : r;
}
const eq = (a, b) => isNum(a) && isNum(b) && cmp(a, b) === 0;

// max(2, w): the first argument wins a tie
const pyMax = (a, b) => (cmp(b, a) > 0 ? b : a);

// operator.index(x) — what range(), str * n, str.center accept
function index(x, msg) {
  if (isInt(x)) return iv(x);
  raise('TypeError', msg || `'${typeName(x)}' object cannot be interpreted as an integer`);
}

// ─── str helpers with CPython's exact rules ──────────────────────────

const MAX_WIDTH = 5000;   // characters in one padded field / line
const MAX_REPEAT = 1000;  // '\n' * l, ' ' * c

function bigToNum(n, cap) {
  if (n > BigInt(cap)) return cap + 1;
  if (n < -BigInt(cap)) return -cap - 1;
  return Number(n);
}

const cpLen = (s) => [...s].length;

// str.center(width) — Objects/stringlib/transmogrify.h pad()
export function center(s, width) {
  const w = index(width);
  // the width argument is a Py_ssize_t
  if (w < LONG_MIN || w > LONG_MAX) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  const len = cpLen(s);
  if (w <= BigInt(len)) return s;
  if (w > BigInt(MAX_WIDTH)) {
    limit(`A field ${w} characters wide is not built in the browser demo (the limit is ${MAX_WIDTH}); CPython pads it the same way.`);
  }
  const width2 = Number(w);
  const marg = width2 - len;
  const left = Math.floor(marg / 2) + (marg & width2 & 1);
  return ' '.repeat(left) + s + ' '.repeat(marg - left);
}

// str * n
export function strMul(s, n) {
  if (!isInt(n)) raise('TypeError', `can't multiply sequence by non-int of type '${typeName(n)}'`);
  const k = iv(n);
  // the count must fit a Py_ssize_t before anything else
  if (k < LONG_MIN || k > LONG_MAX) raise('OverflowError', "cannot fit 'int' into an index-sized integer");
  if (k <= 0n || s === '') return '';
  if (k > BigInt(MAX_REPEAT)) {
    limit(`Repeating ${k} times is not built in the browser demo (the limit is ${MAX_REPEAT}); CPython does it the same way.`);
  }
  return s.repeat(Number(k));
}

// s[:stop]
function sliceTo(s, stop) {
  if (!isInt(stop)) raise('TypeError', 'slice indices must be integers or None or have an __index__ method');
  const chars = [...s];
  return chars.slice(0, bigToNum(iv(stop), 1e9)).join('');
}

// '%2i' % day, '%d' % day — int() of a float, then decimal digits
function fmtInt(x, width = 0, conv = 'd') {
  if (!isNum(x)) raise('TypeError', `%${conv} format: a real number is required, not ${typeName(x)}`);
  let n;
  if (isFloat(x)) {
    if (!Number.isFinite(x.v)) raise(Number.isNaN(x.v) ? 'ValueError' : 'OverflowError', Number.isNaN(x.v) ? 'cannot convert float NaN to integer' : 'cannot convert float infinity to integer');
    n = BigInt(Math.trunc(x.v));
  } else n = iv(x);
  return String(n).padStart(width, ' ');
}

// str.splitlines() — the line boundaries str recognises
const LINE_BREAK = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/;
export function splitlines(s) {
  const out = [];
  let rest = s;
  while (rest.length > 0) {
    const m = LINE_BREAK.exec(rest);
    if (!m) { out.push(rest); break; }
    out.push(rest.slice(0, m.index));
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}
// str.rstrip(): Python's whitespace set (no U+FEFF, unlike JS \s)
const rstrip = (s) => s.replace(/[\t\n\x0b\x0c\r\x1c-\x1f \x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/, '');

// ─── names (C locale) ────────────────────────────────────────────────

const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_FULL = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const MONTH_ABBR = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// list[i] for an int i (negative indexes count from the end) — also what
// _localized_day / _localized_month __getitem__ does with an int index
export function listItem(list, i) {
  if (!isInt(i)) raise('TypeError', `list indices must be integers or slices, not ${typeName(i)}`);
  let k = iv(i);
  // the index must fit a Py_ssize_t (64-bit) before the range check
  if (k < LONG_MIN || k > LONG_MAX) raise('IndexError', "cannot fit 'int' into an index-sized integer");
  if (k < 0n) k += BigInt(list.length);
  if (k < 0n || k >= BigInt(list.length)) raise('IndexError', 'list index out of range');
  return list[Number(k)];
}

export const day_name = (i) => listItem(DAY_FULL, i);
export const day_abbr = (i) => listItem(DAY_ABBR, i);
export const month_name = (i) => listItem(MONTH_FULL, i);
export const month_abbr = (i) => listItem(MONTH_ABBR, i);
export const NAMES = { day_name: DAY_FULL, day_abbr: DAY_ABBR, month_name: MONTH_FULL, month_abbr: MONTH_ABBR };

// Day(n) / Month(n) — the enum constructor: a dict lookup by value, so an
// integral float such as 3.0 finds the member 3 too
function enumValue(v) {
  if (isInt(v)) return iv(v);
  if (isFloat(v) && Number.isInteger(v.v)) return BigInt(v.v);
  return null;
}
export function DayOf(v) {
  const n = enumValue(v);
  if (n !== null && n >= 0n && n <= 6n) return Day[Number(n)];
  raise('ValueError', `${repr(v)} is not a valid Day`);
}
export function MonthOf(v) {
  const n = enumValue(v);
  if (n !== null && n >= 1n && n <= 12n) return Month[Number(n) - 1];
  raise('ValueError', `${repr(v)} is not a valid Month`);
}

// ─── exceptions ──────────────────────────────────────────────────────

export function IllegalMonthError(month) {
  const e = new PyException('calendar.IllegalMonthError', `bad month number ${repr(month)}; must be 1-12`);
  e.month = month;
  e.pyClass = 'IllegalMonthError';
  return e;
}
export function IllegalWeekdayError(weekday) {
  const e = new PyException('calendar.IllegalWeekdayError', `bad weekday number ${repr(weekday)}; must be 0 (Monday) to 6 (Sunday)`);
  e.weekday = weekday;
  e.pyClass = 'IllegalWeekdayError';
  return e;
}

// ─── the part of datetime.date that calendar uses ───────────────────

const MINYEAR = 1n;
const MAXYEAR = 9999n;
const LONG_MIN = -(2n ** 63n);
const LONG_MAX = 2n ** 63n - 1n;
const INT_MIN = -(2n ** 31n);
const INT_MAX = 2n ** 31n - 1n;

// PyArg_ParseTuple 'i' on a 64-bit Linux build
function cInt(x) {
  if (!isInt(x)) raise('TypeError', `'${typeName(x)}' object cannot be interpreted as an integer`);
  const n = iv(x);
  if (n < LONG_MIN || n > LONG_MAX) raise('OverflowError', 'Python int too large to convert to C long');
  if (n > INT_MAX) raise('OverflowError', 'signed integer is greater than maximum');
  if (n < INT_MIN) raise('OverflowError', 'signed integer is less than minimum');
  return n;
}

const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS_BEFORE_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const leap = (y) => y % 4n === 0n && (y % 100n !== 0n || y % 400n === 0n);

// datetime.date(year, month, day)
export function makeDate(year, month, day) {
  const y = cInt(year);
  const m = cInt(month);
  const d = cInt(day);
  if (y < MINYEAR || y > MAXYEAR) raise('ValueError', `year ${y} is out of range`);
  if (m < 1n || m > 12n) raise('ValueError', 'month must be in 1..12');
  const dim = BigInt(DAYS_IN_MONTH[Number(m)] + (m === 2n && leap(y) ? 1 : 0));
  if (d < 1n || d > dim) raise('ValueError', 'day is out of range for month');
  return new PyDate(Number(y), Number(m), Number(d));
}

// date.toordinal(): 1 January of year 1 is day 1
export function toordinal(dt) {
  const y = dt.y - 1;
  const before = y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
  return before + DAYS_BEFORE_MONTH[dt.m] + (dt.m > 2 && leap(BigInt(dt.y)) ? 1 : 0) + dt.d;
}
const dateWeekday = (dt) => (toordinal(dt) + 6) % 7;

// date.fromordinal(n) for 1 <= n <= 3652059 — Lib/_pydatetime.py _ord2ymd
export function ord2ymd(n) {
  n -= 1;
  const n400 = Math.floor(n / 146097);
  n %= 146097;
  let year = n400 * 400 + 1;
  const n100 = Math.floor(n / 36524);
  n %= 36524;
  const n4 = Math.floor(n / 1461);
  n %= 1461;
  const n1 = Math.floor(n / 365);
  n %= 365;
  year += n100 * 100 + n4 * 4 + n1;
  if (n1 === 4 || n100 === 4) return { y: year - 1, m: 12, d: 31 };
  const isLeap = n1 === 3 && (n4 !== 24 || n100 === 3);
  let month = (n + 50) >> 5;
  let preceding = DAYS_BEFORE_MONTH[month] + (month > 2 && isLeap ? 1 : 0);
  if (preceding > n) {
    month -= 1;
    preceding -= DAYS_IN_MONTH[month] + (month === 2 && isLeap ? 1 : 0);
  }
  return { y: year, m: month, d: n - preceding + 1 };
}

// ─── module functions ────────────────────────────────────────────────

const MDAYS = [0n, 31n, 28n, 31n, 30n, 31n, 30n, 31n, 31n, 30n, 31n, 30n, 31n];

// year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
export function isleap(year) {
  if (!eq(mod(year, 4n), 0n)) return false;
  return !eq(mod(year, 100n), 0n) || eq(mod(year, 400n), 0n);
}

export function leapdays(y1, y2) {
  y1 = sub(y1, 1n, '-=');
  y2 = sub(y2, 1n, '-=');
  return add(
    sub(sub(floordiv(y2, 4n), floordiv(y1, 4n)), sub(floordiv(y2, 100n), floordiv(y1, 100n))),
    sub(floordiv(y2, 400n), floordiv(y1, 400n)),
  );
}

export function weekday(year, month, day) {
  if (!(leq(MINYEAR, year) && cmp(year, MAXYEAR) <= 0)) {
    year = add(2000n, mod(year, 400n));
  }
  return Day[dateWeekday(makeDate(year, month, day))];
}

// a <= b where a is an int-like (or a Day member, shown as 'Day') and b
// anything: a non-number b has no ordering with it
function leq(a, b, aType = 'int') {
  if (!isNum(b)) raise('TypeError', `'<=' not supported between instances of '${aType}' and '${typeName(b)}'`);
  return cmp(a, b) <= 0;
}

// 1 <= month <= 12
function validateMonth(month) {
  if (!(leq(1n, month) && cmp(month, 12n) <= 0)) throw IllegalMonthError(month);
}

// mdays[month] (+ 1 in a leap February) — month already validated
function monthlen(year, month) {
  const m = Number(iv(month));
  return MDAYS[m] + (m === 2 && isleap(year) ? 1n : 0n);
}

export function monthrange(year, month) {
  validateMonth(month);
  const day1 = weekday(year, month, 1n);
  const ndays = monthlen(year, month);
  return { __pyTuple: [day1, ndays] };
}

const prevmonth = (year, month) => (iv(month) === 1n ? [sub(year, 1n), 12n] : [year, iv(month) - 1n]);
const nextmonth = (year, month) => (iv(month) === 12n ? [add(year, 1n), 1n] : [year, iv(month) + 1n]);

// range(a, b) as bigints — both must be ints
function* range(a, b, step = 1n) {
  const s = index(step);
  if (s === 0n) raise('ValueError', 'range() arg 3 must not be zero');
  const lo = index(a);
  const hi = index(b);
  if (s > 0n) for (let i = lo; i < hi; i += s) yield i;
  else for (let i = lo; i > hi; i += s) yield i;
}

// calendar.timegm(tuple)
export function timegm(tuple) {
  const items = Array.isArray(tuple) ? tuple : tuple.__pyTuple;
  const six = items.slice(0, 6);
  if (six.length < 6) raise('ValueError', `not enough values to unpack (expected 6, got ${six.length})`);
  const [year, month, day, hour, minute, second] = six;
  const ord = toordinal(makeDate(year, month, 1n));
  // date(year, month, 1).toordinal() - _EPOCH_ORD + day - 1, left to right
  const days = sub(add(BigInt(ord - EPOCH_ORD), day), 1n);
  const hours = add(mul(days, 24n), hour);
  const minutes = add(mul(hours, 60n), minute);
  return add(mul(minutes, 60n), second);
}
const EPOCH_ORD = 719163; // date(1970, 1, 1).toordinal()

// ─── Calendar ────────────────────────────────────────────────────────

export class Calendar {
  constructor(firstweekday = 0n) {
    this._firstweekday = firstweekday;
  }

  getfirstweekday() { return mod(this._firstweekday, 7n); }

  setfirstweekday(firstweekday) { this._firstweekday = firstweekday; }

  get firstweekday() { return this.getfirstweekday(); }

  set firstweekday(v) { this.setfirstweekday(v); }

  * iterweekdays() {
    const fw = this.firstweekday;
    for (const i of range(fw, add(fw, 7n))) yield mod(i, 7n);
  }

  * itermonthdates(year, month) {
    for (const t of this.itermonthdays3(year, month)) {
      const [y, m, d] = t.__pyTuple;
      yield makeDate(y, m, d);
    }
  }

  * itermonthdays(year, month) {
    const [day1, ndays] = monthrange(year, month).__pyTuple;
    const daysBefore = mod(sub(day1, this.firstweekday), 7n);
    for (const _ of range(0n, index(daysBefore))) yield 0n; // repeat(0, days_before)
    for (let d = 1n; d <= ndays; d += 1n) yield d;
    const daysAfter = mod(sub(sub(this.firstweekday, day1), ndays), 7n);
    for (const _ of range(0n, index(daysAfter))) yield 0n;
  }

  * itermonthdays2(year, month) {
    // enumerate(..., self.firstweekday) checks its start before iterating
    let i = this.firstweekday;
    index(i);
    for (const d of this.itermonthdays(year, month)) {
      yield { __pyTuple: [d, mod(i, 7n)] };
      i = add(i, 1n);
    }
  }

  * itermonthdays3(year, month) {
    const [day1, ndays] = monthrange(year, month).__pyTuple;
    const daysBefore = mod(sub(day1, this.firstweekday), 7n);
    const daysAfter = mod(sub(sub(this.firstweekday, day1), ndays), 7n);
    let [y, m] = prevmonth(year, month);
    const end = monthlen(y, m) + 1n;
    for (const d of range(sub(end, daysBefore), end)) yield { __pyTuple: [y, m, d] };
    for (let d = 1n; d <= ndays; d += 1n) yield { __pyTuple: [year, month, d] };
    [y, m] = nextmonth(year, month);
    for (const d of range(1n, add(daysAfter, 1n))) yield { __pyTuple: [y, m, d] };
  }

  * itermonthdays4(year, month) {
    let i = 0n;
    for (const t of this.itermonthdays3(year, month)) {
      const [y, m, d] = t.__pyTuple;
      yield { __pyTuple: [y, m, d, mod(add(this.firstweekday, i), 7n)] };
      i += 1n;
    }
  }

  monthdatescalendar(year, month) { return weeks([...this.itermonthdates(year, month)]); }

  monthdays2calendar(year, month) { return weeks([...this.itermonthdays2(year, month)]); }

  monthdayscalendar(year, month) { return weeks([...this.itermonthdays(year, month)]); }

  yeardatescalendar(year, width = 3n) {
    return rows(Month.map((m) => this.monthdatescalendar(year, m)), width);
  }

  yeardays2calendar(year, width = 3n) {
    return rows(Month.map((m) => this.monthdays2calendar(year, m)), width);
  }

  yeardayscalendar(year, width = 3n) {
    return rows(Month.map((m) => this.monthdayscalendar(year, m)), width);
  }
}

// [days[i:i+7] for i in range(0, len(days), 7)]
function weeks(days) {
  const out = [];
  for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
  return out;
}
// [months[i:i+width] for i in range(0, len(months), width)]
function rows(months, width) {
  const out = [];
  for (const i of range(0n, BigInt(months.length), width)) {
    out.push(months.slice(Number(i), Number(i + bigClamp(index(width)))));
  }
  return out;
}
const bigClamp = (n) => (n > 100n ? 100n : n);

// ─── TextCalendar ────────────────────────────────────────────────────

// a stand-in for sys.stdout that the pr* methods print to
export function makeStdout() {
  return { buf: '', write(s) { this.buf += s; } };
}

export class TextCalendar extends Calendar {
  constructor(firstweekday = 0n, stdout = null) {
    super(firstweekday);
    this.stdout = stdout;
  }

  print(s) {
    if (!this.stdout) this.stdout = makeStdout();
    this.stdout.write(s);
    return null;
  }

  prweek(theweek, width) { return this.print(this.formatweek(theweek, width)); }

  formatday(day, weekday, width) {
    const s = eq(day, 0n) ? '' : fmtInt(day, 2, 'i');
    return center(s, width);
  }

  formatweek(theweek, width) {
    return theweek.map((t) => {
      const [d, wd] = unpack2(t);
      return this.formatday(d, wd, width);
    }).join(' ');
  }

  formatweekday(day, width) {
    const names = cmp(width, 9n) >= 0 ? DAY_FULL : DAY_ABBR;
    return center(sliceTo(listItem(names, day), width), width);
  }

  formatweekheader(width) {
    return [...this.iterweekdays()].map((i) => this.formatweekday(i, width)).join(' ');
  }

  formatmonthname(theyear, themonth, width, withyear = true) {
    validateMonth(themonth);
    let s = listItem(MONTH_FULL, themonth);
    if (truthy(withyear)) s = `${s} ${repr(theyear)}`;
    return center(s, width);
  }

  prmonth(theyear, themonth, w = 0n, l = 0n) { return this.print(this.formatmonth(theyear, themonth, w, l)); }

  formatmonth(theyear, themonth, w = 0n, l = 0n) {
    w = pyMax(2n, w);
    l = pyMax(1n, l);
    let s = this.formatmonthname(theyear, themonth, sub(mul(7n, add(w, 1n)), 1n));
    s = rstrip(s);
    s += strMul('\n', l);
    s += rstrip(this.formatweekheader(w));
    s += strMul('\n', l);
    for (const week of this.monthdays2calendar(theyear, themonth)) {
      s += rstrip(this.formatweek(week, w));
      s += strMul('\n', l);
    }
    return s;
  }

  formatyear(theyear, w = 2n, l = 1n, c = 6n, m = 3n) {
    w = pyMax(2n, w);
    l = pyMax(1n, l);
    c = pyMax(2n, c);
    const colwidth = sub(mul(add(w, 1n), 7n), 1n);
    const v = [];
    v.push(rstrip(center(repr(theyear), add(mul(colwidth, m), mul(c, sub(m, 1n))))));
    v.push(strMul('\n', l));
    const header = this.formatweekheader(w);
    let i = 0n;
    for (const row of this.yeardays2calendar(theyear, m)) {
      // months in this row
      const lo = add(mul(m, i), 1n);
      const hi = cmp(add(mul(m, add(i, 1n)), 1n), 13n) < 0 ? add(mul(m, add(i, 1n)), 1n) : 13n;
      const months = [...range(lo, hi)];
      v.push(strMul('\n', l));
      const names = months.map((k) => this.formatmonthname(theyear, k, colwidth, false));
      v.push(rstrip(formatstring(names, colwidth, c)));
      v.push(strMul('\n', l));
      v.push(rstrip(formatstring(months.map(() => header), colwidth, c)));
      v.push(strMul('\n', l));
      // max number of weeks for this row
      const height = Math.max(...row.map((cal) => cal.length));
      for (let j = 0; j < height; j += 1) {
        const ws = row.map((cal) => (j >= cal.length ? '' : this.formatweek(cal[j], w)));
        v.push(rstrip(formatstring(ws, colwidth, c)));
        v.push(strMul('\n', l));
      }
      i += 1n;
    }
    return v.join('');
  }

  pryear(theyear, w = 0n, l = 0n, c = 6n, m = 3n) { return this.print(this.formatyear(theyear, w, l, c, m)); }
}

// spacing.join(c.center(colwidth) for c in cols)
function formatstring(cols, colwidth, spacing) {
  const sp = strMul(' ', spacing);
  return cols.map((s) => center(s, colwidth)).join(sp);
}

function unpack2(t) {
  const items = Array.isArray(t) ? t : t && t.__pyTuple;
  if (!items) raise('TypeError', `cannot unpack non-iterable ${typeName(t)} object`);
  if (items.length < 2) raise('ValueError', `not enough values to unpack (expected 2, got ${items.length})`);
  if (items.length > 2) raise('ValueError', 'too many values to unpack (expected 2)');
  return items;
}

const truthy = (x) => !(x === false || x === null || x === '' || (isNum(x) && fv(x) === 0) || (Array.isArray(x) && x.length === 0));

// ─── HTMLCalendar ────────────────────────────────────────────────────

export class HTMLCalendar extends Calendar {
  constructor(firstweekday = 0n) {
    super(firstweekday);
    this.cssclasses = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    this.cssclasses_weekday_head = this.cssclasses;
    this.cssclass_noday = 'noday';
    this.cssclass_month_head = 'month';
    this.cssclass_month = 'month';
    this.cssclass_year_head = 'year';
    this.cssclass_year = 'year';
  }

  formatday(day, weekday) {
    if (eq(day, 0n)) return `<td class="${str(this.cssclass_noday)}">&nbsp;</td>`;
    return `<td class="${str(listItem(this.cssclasses, weekday))}">${fmtInt(day)}</td>`;
  }

  formatweek(theweek) {
    const s = theweek.map((t) => {
      const [d, wd] = unpack2(t);
      return this.formatday(d, wd);
    }).join('');
    return `<tr>${s}</tr>`;
  }

  formatweekday(day) {
    return `<th class="${str(listItem(this.cssclasses_weekday_head, day))}">${listItem(DAY_ABBR, day)}</th>`;
  }

  formatweekheader() {
    return `<tr>${[...this.iterweekdays()].map((i) => this.formatweekday(i)).join('')}</tr>`;
  }

  formatmonthname(theyear, themonth, withyear = true) {
    validateMonth(themonth);
    const s = truthy(withyear) ? `${listItem(MONTH_FULL, themonth)} ${str(theyear)}` : listItem(MONTH_FULL, themonth);
    return `<tr><th colspan="7" class="${str(this.cssclass_month_head)}">${s}</th></tr>`;
  }

  formatmonth(theyear, themonth, withyear = true) {
    const v = [];
    v.push(`<table border="0" cellpadding="0" cellspacing="0" class="${str(this.cssclass_month)}">`);
    v.push('\n');
    v.push(this.formatmonthname(theyear, themonth, withyear));
    v.push('\n');
    v.push(this.formatweekheader());
    v.push('\n');
    for (const week of this.monthdays2calendar(theyear, themonth)) {
      v.push(this.formatweek(week));
      v.push('\n');
    }
    v.push('</table>');
    v.push('\n');
    return v.join('');
  }

  formatyear(theyear, width = 3n) {
    const v = [];
    width = pyMax(width, 1n);
    v.push(`<table border="0" cellpadding="0" cellspacing="0" class="${str(this.cssclass_year)}">`);
    v.push('\n');
    v.push(`<tr><th colspan="${fmtInt(width)}" class="${str(this.cssclass_year_head)}">${str(theyear)}</th></tr>`);
    for (const i of range(JANUARY, JANUARY + 12n, width)) {
      // months in this row
      const hi = cmp(add(i, width), 13n) < 0 ? add(i, width) : 13n;
      v.push('<tr>');
      for (const m of range(i, hi)) {
        v.push('<td>');
        v.push(this.formatmonth(theyear, m, false));
        v.push('</td>');
      }
      v.push('</tr>');
    }
    v.push('</table>');
    return v.join('');
  }

  // encoding=None means sys.getdefaultencoding(), which is 'utf-8'; the
  // UTF-8, ASCII and Latin-1 codecs are built here (by any of their common
  // names), other codecs are a demo limit
  formatyearpage(theyear, width = 3n, css = 'calendar.css', encoding = null) {
    if (encoding === null) encoding = 'utf-8';
    const codec = codecOf(encoding);
    const v = [];
    v.push(`<?xml version="1.0" encoding="${encoding}"?>\n`);
    v.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n');
    v.push('<html>\n');
    v.push('<head>\n');
    v.push(`<meta http-equiv="Content-Type" content="text/html; charset=${encoding}" />\n`);
    if (css !== null) v.push(`<link rel="stylesheet" type="text/css" href="${str(css)}" />\n`);
    v.push(`<title>Calendar for ${fmtInt(theyear)}</title>\n`);
    v.push('</head>\n');
    v.push('<body>\n');
    v.push(this.formatyear(theyear, width));
    v.push('</body>\n');
    v.push('</html>\n');
    return new PyBytes(encodeXmlCharRef(v.join(''), codec));
  }
}

// the codec behind an encoding name (codecs.lookup normalises case, spaces
// and hyphens): 0x80 = ascii, 0x100 = latin-1, null = utf-8
const CODECS = {
  utf_8: null, utf8: null, u8: null, utf: null,
  ascii: 0x80, us_ascii: 0x80, '646': 0x80, us: 0x80,
  latin_1: 0x100, latin1: 0x100, latin: 0x100, l1: 0x100, iso_8859_1: 0x100, iso8859_1: 0x100, '8859': 0x100, cp819: 0x100,
};
function codecOf(encoding) {
  if (typeof encoding !== 'string') limit('Only a str encoding name is reproduced in the browser demo.');
  const key = encoding.trim().toLowerCase().replace(/[-\s]+/g, '_');
  if (!Object.prototype.hasOwnProperty.call(CODECS, key)) {
    limit(`The ${pyStrRepr(encoding)} codec is not built in the browser demo (UTF-8, ASCII and Latin-1 are).`);
  }
  return { limit: CODECS[key] };
}

// str.encode(codec, 'xmlcharrefreplace'): a character the codec cannot
// encode (and, in UTF-8, a lone surrogate) becomes &#NNNN;
function encodeXmlCharRef(s, codec = { limit: null }) {
  const out = [];
  const ref = (cp) => { for (const ch of `&#${cp};`) out.push(ch.charCodeAt(0)); };
  for (let i = 0; i < s.length; i += 1) {
    let cp = s.charCodeAt(i);
    if (cp >= 0xd800 && cp <= 0xdbff && i + 1 < s.length) {
      const lo = s.charCodeAt(i + 1);
      if (lo >= 0xdc00 && lo <= 0xdfff) {
        cp = 0x10000 + ((cp - 0xd800) << 10) + (lo - 0xdc00);
        i += 1;
      }
    }
    if (codec.limit !== null) {
      if (cp < codec.limit) out.push(cp);
      else ref(cp);
    } else if (cp >= 0xd800 && cp <= 0xdfff) {
      ref(cp);
    } else if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
  }
  return out;
}

// repr() of bytes
export function bytesRepr(bytes) {
  const hasSq = bytes.includes(0x27);
  const hasDq = bytes.includes(0x22);
  const q = hasSq && !hasDq ? '"' : "'";
  let out = 'b' + q;
  for (const b of bytes) {
    if (b === 0x5c) out += '\\\\';
    else if (b === q.charCodeAt(0)) out += '\\' + q;
    else if (b === 0x09) out += '\\t';
    else if (b === 0x0a) out += '\\n';
    else if (b === 0x0d) out += '\\r';
    else if (b < 0x20 || b >= 0x7f) out += '\\x' + b.toString(16).padStart(2, '0');
    else out += String.fromCharCode(b);
  }
  return out + q;
}

// bytes.splitlines(): only \n, \r and \r\n
export function bytesSplitlines(pb) {
  const out = [];
  let cur = [];
  const b = pb.bytes;
  for (let i = 0; i < b.length; i += 1) {
    if (b[i] === 0x0a || b[i] === 0x0d) {
      out.push(new PyBytes(cur));
      cur = [];
      if (b[i] === 0x0d && b[i + 1] === 0x0a) i += 1;
    } else cur.push(b[i]);
  }
  if (cur.length) out.push(new PyBytes(cur));
  return out;
}

// ─── the module-level interface (one shared TextCalendar) ────────────

// A fresh module state per demo run — every snippet starts with
// firstweekday() == 0, as in a new interpreter.
export function makeModule() {
  const stdout = makeStdout();
  const c = new TextCalendar(0n, stdout);
  return {
    stdout,
    c,
    firstweekday: () => c.getfirstweekday(),
    setfirstweekday(fw) {
      // MONDAY <= firstweekday <= SUNDAY (MONDAY is a Day member)
      if (!(leq(MONDAY, fw, 'Day') && cmp(fw, SUNDAY) <= 0)) throw IllegalWeekdayError(fw);
      c.firstweekday = fw;
      return null;
    },
    monthcalendar: (y, m) => c.monthdayscalendar(y, m),
    prweek: (w, width) => c.prweek(w, width),
    week: (w, width) => c.formatweek(w, width),
    weekheader: (width) => c.formatweekheader(width),
    prmonth: (y, m, w = 0n, l = 0n) => c.prmonth(y, m, w, l),
    month: (y, m, w = 0n, l = 0n) => c.formatmonth(y, m, w, l),
    calendar: (y, w = 2n, l = 1n, cc = 6n, m = 3n) => c.formatyear(y, w, l, cc, m),
    prcal: (y, w = 0n, l = 0n, cc = 6n, m = 3n) => c.pryear(y, w, l, cc, m),
  };
}

// what a snippet shows: its printed text (trailing newlines trimmed, as the
// runner does), then the repr of the final value on its own line
export function withScreen(stdout, value) {
  const printed = stdout.buf.replace(/\n+$/, '');
  const r = value === undefined ? '' : repr(value);
  if (!printed) return { __pyRaw: r };
  return { __pyRaw: r === '' ? printed : `${printed}\n${r}` };
}
