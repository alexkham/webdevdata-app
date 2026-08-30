// Emulator for Python dict.values() — a dict_values view of the values.
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
export default function dictValues(d) {
  if (d === null || typeof d !== 'object' || Array.isArray(d)) {
    throw new TypeError('values() argument must be dict');
  }
  return { __pyRaw: 'dict_values([' + Object.values(d).map(q).join(', ') + '])' };
}
