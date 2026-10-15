// utils/emulators/python/stdlib/xml-etree-elementtree/element.js
//
// Emulator for the ET.Element class demo tabs, on _pyet.js.

import { fromstring, Element, tostring, attribPy, tagPy } from './_pyet.js';

export default {
  // e = ET.Element(tag, {key: value}, version='1')
  // (e.tag, e.attrib, len(e), ET.tostring(e, encoding='unicode'))
  create: (tag, key, value) => {
    const e = new Element(tag, [[key, value]]);
    e.set('version', '1'); // **extra updates the dict: an existing key keeps its place
    return { __pyTuple: [tagPy(e.tag), attribPy(e), e.length, tostring(e, { encoding: 'unicode' })] };
  },

  // root = ET.fromstring(xml); (len(root), root[index].tag, [c.tag for c in root[1:]])
  sequence: (xml, index) => {
    const root = fromstring(xml);
    return { __pyTuple: [root.length, tagPy(root.child(index).tag), root.children.slice(1).map((c) => tagPy(c.tag))] };
  },
};
