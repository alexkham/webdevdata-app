// utils/emulators/python/stdlib/hashlib/file_digest.js
//
// Emulator for the hashlib.file_digest demo tabs, on the CPython port in
// _pyhashlib.js. The file is modelled by its bytes: both tabs hash the
// whole content (a BytesIO buffer, or a file freshly opened at offset 0).

import { fileDigest, utf8 } from './_pyhashlib.js';

export default {
  // hashlib.file_digest(io.BytesIO(text.encode()), algo).hexdigest()
  bytesio: (text, algo) => fileDigest(utf8(text), algo).hexdigest(),

  // write text.encode() to upload.bin, file_digest(f, 'sha256')
  // (file size, digest.hexdigest()[:16])
  file: (text) => {
    const data = utf8(text);
    return { __pyTuple: [data.length, fileDigest(data, 'sha256').hexdigest().slice(0, 16)] };
  },
};
