// Emulator for the static Object.defineProperty.
//
// Shows the key list alongside the value, because the default
// enumerable:false is invisible any other way — the property is readable
// but absent from Object.keys.
export default function objectDefineProperty(value, enumerable) {
  const o = Object.defineProperty({}, 'a', { value, enumerable: Boolean(enumerable) });
  return [Object.keys(o), o.a];
}
