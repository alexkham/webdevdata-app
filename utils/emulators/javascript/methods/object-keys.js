// Emulator for the static Object.keys.
//
// The demo parses a JSON literal so real object shapes can be typed in —
// and so the expression shown on the page is exactly what runs here.
export default function objectKeys(json) {
  return Object.keys(JSON.parse(json));
}
