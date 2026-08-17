// utils/emulators/python/operators/in.js
//
// Emulator for Python `item in container`. For a list: membership by
// equality. For a string: SUBSTRING test — both semantics covered.

export default function pyIn(item, container) {
  if (Array.isArray(container)) return container.includes(item);
  if (typeof container === 'string') {
    if (typeof item !== 'string') {
      throw new TypeError("'in <string>' requires string as left operand");
    }
    return container.includes(item);
  }
  if (container !== null && typeof container === 'object') {
    return Object.prototype.hasOwnProperty.call(container, item); // dict → keys
  }
  throw new TypeError('argument is not iterable');
}
