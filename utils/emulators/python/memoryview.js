// utils/emulators/python/memoryview.js
//
// Emulator for Python memoryview. Takes comma-separated ints as the
// source buffer and an optional slice, returns a display showing the
// view's length and .tobytes() form.

function renderByte(b) {
  if (b >= 0x20 && b < 0x7f && b !== 0x5c && b !== 0x27) return String.fromCharCode(b);
  if (b === 0x5c) return '\\\\';
  if (b === 0x27) return "\\'";
  if (b === 0x09) return '\\t';
  if (b === 0x0a) return '\\n';
  if (b === 0x0d) return '\\r';
  return '\\x' + b.toString(16).padStart(2, '0');
}

function parseSlice(spec, len) {
  if (!spec || spec.trim() === '') return [0, len];
  const parts = spec.split(':');
  const start = parts[0] === '' ? 0 : parseInt(parts[0], 10);
  const stop  = parts[1] === undefined || parts[1] === '' ? len : parseInt(parts[1], 10);
  return [
    Math.max(0, Math.min(start < 0 ? len + start : start, len)),
    Math.max(0, Math.min(stop  < 0 ? len + stop  : stop,  len)),
  ];
}

export default function pyMemoryView(source, sliceSpec) {
  const src = String(source == null ? '' : source).trim();
  if (src === '') {
    return "<memory at 0x...>\n# .tobytes() = b''\n# len = 0";
  }

  const bytes = src.split(',').map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n));
  const [start, stop] = parseSlice(sliceSpec, bytes.length);
  const view = bytes.slice(start, stop);

  const rendered = "b'" + view.map(renderByte).join('') + "'";
  const sliceNote = sliceSpec && sliceSpec.trim() ? `\n# sliced [${start}:${stop}] — zero-copy view` : '';
  return `<memory at 0x...>${sliceNote}\n# .tobytes() = ${rendered}\n# len = ${view.length}`;
}