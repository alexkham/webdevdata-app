// Emulator for Python str.casefold() — aggressive lowercasing for
// caseless matching: ß → ss, and Greek sigma always folds to σ.
export default function strCasefold(s) {
  if (typeof s !== 'string') throw new TypeError('casefold() argument must be str');
  return s.toLowerCase().replace(/ς/g, 'σ').replace(/ß/g, 'ss');
}
