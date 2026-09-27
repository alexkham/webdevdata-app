// Emulator for the Annex B __defineGetter__, representative of the four
// legacy accessor methods.
//
// Returns the key list too, because the interesting contrast with
// defineProperty is that this one creates an ENUMERABLE property.
export default function objectDefineGetter(value) {
  const o = {};
  o.__defineGetter__('a', () => value);
  return [Object.keys(o), o.a];
}
