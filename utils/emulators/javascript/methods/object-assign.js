// Emulator for the static Object.assign.
export default function objectAssign(targetJson, sourceJson) {
  return Object.assign(JSON.parse(targetJson), JSON.parse(sourceJson));
}
