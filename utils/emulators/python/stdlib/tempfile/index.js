// utils/emulators/python/stdlib/tempfile/index.js
//
// Emulator for the tempfile hub demo tabs, on the Lib/tempfile.py port in
// _pytempfile.js (random names, TemporaryDirectory, SpooledTemporaryFile).

import { TemporaryDirectory, SpooledTemporaryFile, tempName, checkAffix } from './_pytempfile.js';
import { utf8Encode, tuple, pyNum } from '../io/_pyio.js';

// with TemporaryDirectory(dir='.') as d: write each file; inside = sorted(os.listdir(d))
export function scratch(files) {
  const d = new TemporaryDirectory();
  for (const name of files) d.writeFile(name, 'data');
  const inside = d.listdir();
  d.cleanup();
  return tuple(inside, d.exists);
}

// SpooledTemporaryFile(max_size=...): write each chunk, note whether it is still a BytesIO
export function spool(maxSize, chunks) {
  const f = new SpooledTemporaryFile(pyNum(maxSize));
  f.enter();
  try {
    const inMemory = [];
    for (const chunk of chunks) {
      f.write(utf8Encode(chunk));
      inMemory.push(f.inMemory);
    }
    f.seek(0n);
    const data = f.read();
    return tuple(inMemory, data);
  } finally {
    f.exit();
  }
}

// NamedTemporaryFile(prefix=..., suffix=...): what the name is made of
export function names(prefix, suffix) {
  checkAffix(prefix, 'prefix');
  checkAffix(suffix, 'suffix');
  const name = tempName(prefix, suffix);
  const shape = tuple(name.startsWith(prefix), name.endsWith(suffix), BigInt(name.length - prefix.length - suffix.length));
  // delete=True: the file is removed when the with block closes it
  return tuple(shape, false);
}

export default { scratch, spool, names };
