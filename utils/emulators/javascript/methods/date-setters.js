// Emulator for the Date setters.
//
// Uses setUTCMonth so the result is the same for every reader, and returns
// the ISO string because the interesting behaviour is the OVERFLOW rollover
// (Feb 31 becomes March 3), not the numeric return value.
export default function dateSetters(iso, month) {
  const d = new Date(iso);
  d.setUTCMonth(month);
  return d.toISOString();
}
