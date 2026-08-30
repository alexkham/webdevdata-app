// Emulator for Python dict.items() — a dict_items view of (key, value)
// pairs.
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
export default function dictItems(d) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('items() argument must be dict');
  }
  const pairs = Object.entries(d).map(([k, v]) => '(' + q(k) + ', ' + q(v) + ')');
  return { __pyRaw: 'dict_items([' + pairs.join(', ') + '])' };
}
