// Emulator for the JavaScript Map size accessor.
export default function mapSize(json) {
  return new Map(JSON.parse(json)).size;
}
