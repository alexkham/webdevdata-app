// Emulator for Python slice(start, stop, step) as the demo presents it:
// named fields, so empty start/step simply mean None.
export default function pySlice(start = null, stop = null, step = null) {
  const r = (v) => (v === null || v === undefined ? 'None' : String(v));
  return { __pyRaw: 'slice(' + r(start) + ', ' + r(stop) + ', ' + r(step) + ')' };
}
