// utils/emulators/python/slice.js
//
// Emulator for Python slice(). Renders the slice object in Python's
// canonical form (slice(start, stop, step)) and applies it to a demo
// list so users can see the effect concretely.

function parseArg(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Math.trunc(Number(v));
  return Number.isFinite(n) ? n : null;
}

function fmt(v) {
  return v === null ? 'None' : String(v);
}

export default function pySlice(start, stop, step) {
  const a = parseArg(start);
  const b = parseArg(stop);
  const s = parseArg(step);

  const sliceRepr = `slice(${fmt(a)}, ${fmt(b)}, ${fmt(s)})`;

  // Apply to a demo list to show the effect.
  const demo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const step_ = s === null ? 1 : s;
  if (step_ === 0) return `${sliceRepr}\n# applied to [0..9]: ValueError: slice step cannot be zero`;

  // Compute concrete start/stop for demo.
  const len = demo.length;
  let start_, stop_;
  if (step_ > 0) {
    start_ = a === null ? 0 : (a < 0 ? Math.max(0, len + a) : Math.min(a, len));
    stop_  = b === null ? len : (b < 0 ? Math.max(0, len + b) : Math.min(b, len));
  } else {
    start_ = a === null ? len - 1 : (a < 0 ? Math.max(-1, len + a) : Math.min(a, len - 1));
    stop_  = b === null ? -1 : (b < 0 ? Math.max(-1, len + b) : Math.min(b, len - 1));
  }

  const result = [];
  if (step_ > 0) {
    for (let i = start_; i < stop_; i += step_) result.push(demo[i]);
  } else {
    for (let i = start_; i > stop_; i += step_) result.push(demo[i]);
  }

  return `${sliceRepr}\n# applied to [0..9]: ${JSON.stringify(result)}`;
}