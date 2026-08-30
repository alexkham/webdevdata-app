// Emulator for Python dict.keys() — a dict_keys view of the keys.
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
export default function dictKeys(d) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('keys() argument must be dict');
  }
  return { __pyRaw: 'dict_keys([' + Object.keys(d).map(q).join(', ') + '])' };
}
