// Emulator for JavaScript Array.prototype.reduce, summing with an explicit
// initial value — the form the demo expression shows.
//
// The initial value is always supplied here, which is exactly why the demo
// cannot reproduce the "Reduce of empty array with no initial value"
// TypeError. That case is covered in the examples and pitfalls instead.
export default function arrayReduce(items, initial) {
  if (!Array.isArray(items)) throw new TypeError('reduce() demo source must be an array');
  return items.reduce((a, b) => a + b, initial);
}
