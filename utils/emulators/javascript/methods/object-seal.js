// Emulator for the static Object.seal.
//
// Shows both predicates, because the difference between sealed and frozen
// is the whole point: a sealed object still allows writes.
export default function objectSeal(json) {
  const o = Object.seal(JSON.parse(json));
  return [Object.isSealed(o), Object.isFrozen(o)];
}
