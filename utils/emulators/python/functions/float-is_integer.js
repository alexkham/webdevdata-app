// Emulator for Python float.is_integer() — whole-number test on the VALUE.
// inf and nan answer False rather than raising, unlike the x == int(x) idiom.
export default function floatIsInteger(n) {
  if (typeof n !== 'number') throw new TypeError('is_integer() demo argument must be float');
  return Number.isFinite(n) && Math.floor(n) === n;
}
