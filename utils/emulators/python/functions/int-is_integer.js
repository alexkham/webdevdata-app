// Emulator for Python int.is_integer() — constant True.
// Every int is a whole number, so no input returns False. The method
// exists only so int and float share the same interface.
export default function intIsInteger(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('is_integer() demo argument must be int');
  }
  return true;
}
