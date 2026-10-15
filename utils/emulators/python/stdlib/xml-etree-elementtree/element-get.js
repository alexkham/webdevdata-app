// utils/emulators/python/stdlib/xml-etree-elementtree/element-get.js
//
// Emulator for the Element.get / set / keys / items / attrib demo tabs, on
// _pyet.js (the C Element: keys() and items() return lists).

import { fromstring, Element, tostring, attribPy } from './_pyet.js';

const itemsPy = (e) => e.items().map(([k, v]) => ({ __pyTuple: [k, v] }));

export default {
  // elem = ET.fromstring(xml); (elem.get(key), elem.get(key, 'n/a'), elem.attrib)
  read: (xml, key) => {
    const elem = fromstring(xml);
    return { __pyTuple: [elem.get(key), elem.get(key, 'n/a'), attribPy(elem)] };
  },

  // elem = ET.Element('user', id='7'); elem.set(key, value)
  // (elem.items(), ET.tostring(elem, encoding='unicode'))
  set: (key, value) => {
    const elem = new Element('user', [['id', '7']]);
    elem.set(key, value);
    return { __pyTuple: [itemsPy(elem), tostring(elem, { encoding: 'unicode' })] };
  },

  // elem = ET.fromstring(xml); (elem.keys(), elem.items())
  list: (xml) => {
    const elem = fromstring(xml);
    return { __pyTuple: [elem.keys(), itemsPy(elem)] };
  },
};
