// utils/emulators/python/set-clear.js
//
// Emulator for Python set.clear(). Returns an empty array so the demo
// has something to display — Python actually returns None and mutates
// the set in place (demoExplainer says so). The shared-reference
// behavior is documented in the content file but is not testable in
// the demo shell.

export default function setClear(set) {
  // Best-effort argument validation — the demo passes CSV-parsed arrays,
  // strings, or empty; nothing to do beyond returning the empty state.
  void set;
  return [];
}