// utils/emulators/python/print.js
//
// Emulator for Python print(*objects, sep=' ', end='\n', ...). The demo
// takes a comma-separated list of objects plus optional sep and end.
// Returns the exact text that would appear on stdout.
//
// Since the demo cannot ACTUALLY write to stdout, we return the string
// wrapped in quotes so the user sees exactly what print would emit
// (including the trailing newline as a literal \n).

function formatValue(v) {
  const s = typeof v === 'string' ? v : String(v);
  // Recognize a few Python-style literals typed as text.
  if (s === 'None') return 'None';
  if (s === 'True') return 'True';
  if (s === 'False') return 'False';
  return s;
}

function processEscapes(s) {
  return s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
}

export default function pyPrint(objects, sep, end) {
  const arr = objects === null || objects === undefined
    ? []
    : Array.isArray(objects)
      ? objects
      : typeof objects === 'string'
        ? objects.split(',').map(s => s.trim()).filter(s => s !== '')
        : [objects];

  // The demo cannot send Python's None, so we treat empty end as an
  // explicit "no ending" (Python end=''). For the "defaults" case, the
  // demo passes sep=" " and end="\\n" explicitly.
  const sepStr = sep === null || sep === undefined ? '' : processEscapes(String(sep));
  const endStr = end === null || end === undefined ? '' : processEscapes(String(end));

  const body = arr.map(formatValue).join(sepStr);
  // Represent the output with visible escapes so the user can see the trailing newline.
  const visible = (body + endStr).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  return '"' + visible + '"';
}