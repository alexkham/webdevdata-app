// Emulator for the Date local-time part getters.
//
// Returns [year, month, date, day] so the 0-indexed month can be compared
// against the 1-indexed date in one glance — that mismatch is the single
// most common Date bug.
export default function dateGetters(iso) {
  const d = new Date(iso);
  return [d.getFullYear(), d.getMonth(), d.getDate(), d.getDay()];
}
