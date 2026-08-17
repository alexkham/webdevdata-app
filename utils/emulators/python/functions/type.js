// utils/emulators/python/type.js
//
// Emulator for Python type(x). Returns a string like "<class 'str'>"
// matching how Python prints a type.
//
// The demo takes text input; we coerce common literals to infer their
// Python type. If the string parses as an int, we say int; as a float,
// float; "True"/"False" → bool; "None" → NoneType; empty → str;
// otherwise → str.

export default function pyType(x) {
  if (x === undefined) return "<class 'NoneType'>";
  if (x === null) return "<class 'NoneType'>";

  const s = String(x);

  if (s === '' ) return "<class 'str'>";
  if (s === 'None') return "<class 'NoneType'>";
  if (s === 'True' || s === 'False') return "<class 'bool'>";

  // Integer? — no decimal point, no exponent, parses cleanly.
  if (/^-?\d+$/.test(s)) return "<class 'int'>";

  // Float — has a dot or exponent, parses cleanly.
  const n = Number(s);
  if (Number.isFinite(n) && String(n) === s.trim()) {
    if (s.includes('.') || /[eE]/.test(s)) return "<class 'float'>";
  }

  return "<class 'str'>";
}