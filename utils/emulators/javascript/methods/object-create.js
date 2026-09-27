// Emulator for the static Object.create.
//
// Returns [ownKeys, inheritedValue] because the whole point of create is
// that the new object has NO own properties while still reading through to
// the prototype — one value alone cannot show that.
export default function objectCreate(json) {
  const o = Object.create(JSON.parse(json));
  return [Object.keys(o), o.x];
}
