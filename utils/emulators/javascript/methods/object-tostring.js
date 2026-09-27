// Emulator for Object.prototype.toString.
//
// Called with .call() because that is the only way it is ever used in
// practice — as the old reliable type check.
export default function objectToString(json) {
  return Object.prototype.toString.call(JSON.parse(json));
}
