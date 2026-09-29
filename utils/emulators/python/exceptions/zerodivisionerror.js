// utils/emulators/python/exceptions/zerodivisionerror.js
//
// Emulator for the ZeroDivisionError demo modes.
//
// Trigger: operator.truediv / floordiv / mod on two number inputs. The
// inputs are shown via repr(): an int literal below 1e21 (its exact value
// is the printed digits, so ints are handled as BigInt), a float literal
// from 1e21 up. Int and float paths follow CPython's long_* / float_*
// implementations, including their per-operation ZeroDivisionError text.
//
// Handle: float total / int count with a 0.0 fallback.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

// Python float repr (shortest round-trip digits, exponent outside 1e-4..1e16)
function floatRepr(x) {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x > 0 ? 'inf' : '-inf';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const [mant, e] = x.toExponential().split('e');
  const exp = Number(e);
  if (exp < -4 || exp >= 16) return `${mant}e${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`;
  const neg = mant[0] === '-';
  const digits = mant.replace('-', '').replace('.', '');
  let s;
  if (exp < 0) s = '0.' + '0'.repeat(-exp - 1) + digits;
  else if (digits.length > exp + 1) s = digits.slice(0, exp + 1) + '.' + digits.slice(exp + 1);
  else s = digits + '0'.repeat(exp + 1 - digits.length) + '.0';
  return (neg ? '-' : '') + s;
}
const pyFloat = (x) => ({ __pyRaw: floatRepr(x) });

// The Python value a number-input literal denotes.
const literal = (n) => (Math.abs(n) >= 1e21 ? { float: n } : { int: BigInt(String(n)) });

const bitLength = (n) => (n === 0n ? 0 : n.toString(2).length);
const TWO53 = 2n ** 53n;

// int / int, correctly rounded (long_true_divide)
function intTrueDiv(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'division by zero');
  const abs = (x) => (x < 0n ? -x : x);
  if (abs(a) <= TWO53 && abs(b) <= TWO53) return Number(a) / Number(b);
  const neg = (a < 0n) !== (b < 0n);
  const A = abs(a);
  const B = abs(b);
  // scale so the quotient has >= 55 bits, then fold the remainder into a
  // sticky bit; Number(BigInt) rounds half-to-even like CPython
  const k = Math.max(0, 55 + bitLength(B) - bitLength(A));
  let q = (A << BigInt(k)) / B;
  if ((A << BigInt(k)) % B !== 0n) q |= 1n;
  const r = Number(q) / 2 ** k;
  return neg ? -r : r;
}

// int // int and int % int: floor semantics (long_div / long_mod)
function intFloorDiv(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
  const q = a / b;
  return (a % b !== 0n && (a < 0n) !== (b < 0n)) ? q - 1n : q;
}
function intMod(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'integer modulo by zero');
  const r = a % b;
  return (r !== 0n && (r < 0n) !== (b < 0n)) ? r + b : r;
}

// float paths (Objects/floatobject.c)
function floatTrueDiv(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float division by zero');
  return vx / wx;
}
function floatFloorDiv(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float floor division by zero');
  let mod = vx % wx; // C fmod
  let div = (vx - mod) / wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) {
      mod += wx;
      div -= 1.0;
    }
  }
  if (div) {
    let floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1.0;
    return floordiv;
  }
  return (vx / wx < 0 || Object.is(vx / wx, -0)) ? -0 : 0;
}
function floatMod(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float modulo by zero');
  let mod = vx % wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) mod += wx;
  } else {
    mod = (wx < 0 || Object.is(wx, -0)) ? -0 : 0;
  }
  return mod;
}

const toFloat = (v) => (v.float !== undefined ? v.float : Number(v.int));

const OPS = {
  '/':  { int: intTrueDiv,  float: floatTrueDiv },
  '//': { int: intFloorDiv, float: floatFloorDiv },
  '%':  { int: intMod,      float: floatMod },
};

function trigger(op, a, b) {
  if (!Object.prototype.hasOwnProperty.call(OPS, op)) raise('KeyError', pyRepr(op));
  const x = literal(a);
  const y = literal(b);
  if (x.int !== undefined && y.int !== undefined) {
    const r = OPS[op].int(x.int, y.int);
    return typeof r === 'number' ? pyFloat(r) : r;
  }
  return pyFloat(OPS[op].float(toFloat(x), toFloat(y)));
}

function handle(total, count) {
  // the float input is shown via its Python repr (argLiteral); inf is not a
  // Python literal (line 1 runs before any name is bound, so the
  // traceback's closest match for 'inf' among the builtins is always 'int')
  if (!Number.isFinite(total)) raise('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
  const t = total; // -0 is shown and evaluated as -0.0
  const c = Math.abs(count) >= 1e21 ? count : Number(BigInt(String(count)));
  if (c === 0) return pyFloat(0.0);
  return pyFloat(t / c);
}

export default {
  trigger: (op, a, b) => trigger(op, a, b),
  handle: (total, count) => handle(total, count),
};
