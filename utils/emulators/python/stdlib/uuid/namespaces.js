// utils/emulators/python/stdlib/uuid/namespaces.js
//
// Emulator for the NAMESPACE_* demo tabs.

import { uuid5, NAMESPACE_DNS, NAMESPACE_URL, NAMESPACE_OID, NAMESPACE_X500 } from './_pyuuid.js';
import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

const SHORT = { '@dns': NAMESPACE_DNS, '@url': NAMESPACE_URL, '@oid': NAMESPACE_OID, '@x500': NAMESPACE_X500 };

export default {
  // ns = {'@dns': NAMESPACE_DNS, ...}[name]; (str(ns), ns.version)
  lookup: (name) => {
    if (!Object.prototype.hasOwnProperty.call(SHORT, name)) throw new PyException('KeyError', pyStrRepr(name));
    const ns = SHORT[name];
    return { __pyTuple: [ns.str(), ns.version] };
  },
  // uuid.uuid5(uuid.NAMESPACE_URL, url)
  url: (url) => uuid5(NAMESPACE_URL, url).toPy(),
};
