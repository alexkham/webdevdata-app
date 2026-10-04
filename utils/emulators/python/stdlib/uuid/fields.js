// utils/emulators/python/stdlib/uuid/fields.js
//
// Emulator for the UUID.fields / time_* / clock_seq / node demo tabs.

import { fromStr, pyHex } from './_pyuuid.js';

// repr of datetime(1582, 10, 15) + timedelta(microseconds=micro): the
// fields that are zero at the end are left out, like datetime.__repr__
const GREGORIAN_MS = Date.UTC(1582, 9, 15);
function datetimeRepr(micro) {
  const d = new Date(GREGORIAN_MS + Number(micro / 1000n));
  const us = Number(micro % 1000000n);
  const parts = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes()];
  const s = d.getUTCSeconds();
  if (us) parts.push(s, us);
  else if (s) parts.push(s);
  return { __pyRaw: `datetime.datetime(${parts.join(', ')})` };
}

export default {
  // uuid.UUID(text).fields
  fields: (text) => ({ __pyTuple: fromStr(text).fields }),
  // (u.time, u.clock_seq, hex(u.node))
  derived: (text) => {
    const u = fromStr(text);
    return { __pyTuple: [u.time, u.clock_seq, pyHex(u.node)] };
  },
  // datetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)
  when: (text) => datetimeRepr(fromStr(text).time / 10n),
};
