// utils/emulators/python/stdlib/xml-etree-elementtree/xmlid.js
//
// Emulator for the ET.XMLID demo tabs, on the CPython/expat port in _pyet.js.

import { XMLID, tagPy, attribPy } from './_pyet.js';
import { pyReprExact, pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  // root, ids = ET.XMLID(xml); {key: (elem.tag, elem.text) for key, elem in ids.items()}
  // (a Map keeps dict order; built as a raw repr so numeric-looking keys keep it too)
  ids: (xml) => {
    const { ids } = XMLID(xml);
    const items = [...ids].map(([key, elem]) => `${pyStrRepr(key)}: ${pyReprExact({ __pyTuple: [tagPy(elem.tag), elem.text] })}`);
    return { __pyRaw: `{${items.join(', ')}}` };
  },

  // root, ids = ET.XMLID(xml); elem = ids[key]; (elem.tag, elem.attrib)
  lookup: (xml, key) => {
    const { ids } = XMLID(xml);
    if (!ids.has(key)) throw new PyException('KeyError', pyStrRepr(key));
    const elem = ids.get(key);
    return { __pyTuple: [tagPy(elem.tag), attribPy(elem)] };
  },
};
