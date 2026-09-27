// Emulator for the static Object.getOwnPropertyNames.
//
// Arrays are the demonstrable case: 'length' is a real own property that is
// non-enumerable, so it appears here and never in Object.keys.
export default function objectGetOwnPropertyNames(json) {
  return Object.getOwnPropertyNames(JSON.parse(json));
}
