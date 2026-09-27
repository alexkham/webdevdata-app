// Emulator for the static Object.groupBy.
export default function objectGroupBy(items) {
  return Object.groupBy(items, (n) => (n % 2 ? 'odd' : 'even'));
}
