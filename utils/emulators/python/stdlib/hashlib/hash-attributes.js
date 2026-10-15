// utils/emulators/python/stdlib/hashlib/hash-attributes.js
//
// Emulator for the name / digest_size / block_size demo tabs, on the
// CPython port in _pyhashlib.js.

import { hashNew, blake2, numArg } from './_pyhashlib.js';

const info = (h) => ({ __pyTuple: [h.name, h.digest_size, h.block_size] });

export default {
  // [(h.name, h.digest_size, h.block_size) for h in (hashlib.new(n) for n in names)]
  table: (names) => names.map((n) => info(hashNew(n))),

  // h = hashlib.blake2b(digest_size=size); (name, digest_size, block_size, len(hexdigest()))
  blake: (size) => {
    const h = blake2('blake2b', undefined, { digestSize: numArg(size) });
    return { __pyTuple: [h.name, h.digest_size, h.block_size, h.hexdigest().length] };
  },
};
