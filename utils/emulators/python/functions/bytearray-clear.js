// Emulator for Python bytearray.clear() — empties the buffer in place,
// keeping the same object. The demo shows the resulting empty buffer.

export default function bytearrayClear(s) {
  if (typeof s !== 'string') throw new TypeError('clear() demo source must be str');
  return { __pyRaw: "bytearray(b'')" };
}
