// utils/emulators/python/input.js
//
// Emulator for Python input(prompt). The demo cannot ACTUALLY read
// from stdin, so we take the "typed" value as a second parameter and
// show what input() would return.
//
// The trailing newline that Python strips is not something the demo
// input can send anyway — we just return the typed value as-is.

function reprString(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

export default function pyInput(prompt, typed) {
  // The prompt is written to stdout without a newline — for the demo we
  // note that visually, then show the return value.
  const p = prompt === null || prompt === undefined ? '' : String(prompt);
  const t = typed === null || typed === undefined ? '' : String(typed);

  // Return the "typed" value as a Python-style string repr, since input
  // always returns str.
  if (p) {
    return `# prompt shown: ${JSON.stringify(p)}\n${reprString(t)}`;
  }
  return reprString(t);
}