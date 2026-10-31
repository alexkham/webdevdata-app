// utils/emulators/python/stdlib/struct/pack_into.js
//
// Emulator for the struct.pack_into demo tabs, on the Modules/_struct.c port
// in _pystruct.js. A failing value leaves the earlier ones written (the
// port writes into the same buffer, as _struct.c does).

import { literalEval } from '../pickle/_pyliteral.js';
import { packInto, starArgs, show, numArg, bytearrayOf, ByteArray } from './_pystruct.js';
import { PyException } from '../../../../py-exceptions.js';
import { limit } from '../pickle/_pypickle.js';

// bytearray(b'\xff' * n)
function filled(n) {
  if (typeof n !== 'bigint') throw new PyException('TypeError', "can't multiply sequence by non-int of type 'float'");
  if (n > 65536n) limit('the demo makes buffers of up to 65536 bytes');
  return new ByteArray(new Uint8Array(n > 0n ? Number(n) : 0).fill(0xff));
}

export default {
  // buf = bytearray(size)
  // struct.pack_into(fmt, buf, offset, *ast.literal_eval(values)); buf
  into: (size, fmt, offset, values) => {
    const buf = bytearrayOf(numArg(size));
    packInto(fmt, buf, numArg(offset), starArgs(literalEval(values)));
    return show(buf);
  },

  // buf = bytearray(b'\xff' * size)
  // try: pack_into(fmt, buf, 0, *values); status = 'ok'
  // except struct.error as e: status = str(e)
  // (status, buf)
  partial: (size, fmt, values) => {
    const buf = filled(numArg(size));
    let status = 'ok';
    try {
      packInto(fmt, buf, 0n, starArgs(literalEval(values)));
    } catch (e) {
      if (e.name !== 'struct.error') throw e;
      status = e.message;
    }
    return { __pyTuple: [status, show(buf)] };
  },
};
