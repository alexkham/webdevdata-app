// utils/emulators/python/stdlib/xml-etree-elementtree/qname.js
//
// Emulator for the ET.QName demo tabs, on the serializer port in _pyet.js.

import { Element, QName, tostring, valueRepr } from './_pyet.js';

const XSI = 'http://www.w3.org/2001/XMLSchema-instance';
const XS = 'http://www.w3.org/2001/XMLSchema';

export default {
  // value = ET.Element('value'); value.set(ET.QName(XSI, 'type'), ET.QName(XS, type))
  // value.text = text; ET.tostring(value, encoding='unicode')
  xsi: (type, text) => {
    const value = new Element('value');
    value.set(new QName(XSI, 'type'), new QName(XS, type));
    value.text = text;
    return tostring(value, { encoding: 'unicode' });
  },

  // q = ET.QName(uri, local); (q, ET.tostring(ET.Element(q), encoding='unicode'))
  tag: (uri, local) => {
    const q = new QName(uri, local);
    return { __pyTuple: [{ __pyRaw: valueRepr(q) }, tostring(new Element(q), { encoding: 'unicode' })] };
  },
};
