// Emulator for the Number constants page.
//
// Demonstrates where integer precision actually breaks: past
// MAX_SAFE_INTEGER a number compares equal to itself plus one.
export default function numberSafeBoundary(n) {
  return [Number.isSafeInteger(n), n === n + 1];
}
