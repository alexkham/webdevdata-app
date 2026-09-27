// Emulator for the static Map.groupBy.
//
// Spread to pairs so the grouping is visible; the real Map return value is
// what makes this preferable to Object.groupBy when keys are not strings.
export default function mapGroupBy(items) {
  return [...Map.groupBy(items, (n) => (n % 2 ? 'odd' : 'even'))];
}
