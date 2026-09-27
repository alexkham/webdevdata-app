// Emulator for JavaScript Array.prototype.reduceRight.
//
// No initial value is supplied, which is deliberate: it lets the demo show
// both the right-to-left folding order AND the empty-array TypeError that
// reduce and reduceRight share.
export default function arrayReduceRight(items) {
  if (!Array.isArray(items)) throw new TypeError('reduceRight() demo source must be an array');
  return items.reduceRight((a, b) => a + b);
}
