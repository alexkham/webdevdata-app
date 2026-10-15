// utils/emulators/python/stdlib/xml-etree-elementtree/fromstring.js
//
// Emulator for the ET.fromstring / XML / fromstringlist demo tabs, on the
// CPython/expat port in _pyet.js.

import { fromstring, fromstringlist, tostring, attribPy, tagPy } from './_pyet.js';

export default {
  // root = ET.fromstring(xml); (root.tag, root.attrib, [child.tag for child in root])
  parse: (xml) => {
    const root = fromstring(xml);
    return { __pyTuple: [tagPy(root.tag), attribPy(root), root.children.map((c) => tagPy(c.tag))] };
  },

  // [(e.tag, e.text, e.tail) for e in ET.fromstring(xml).iter()]
  text: (xml) => [...fromstring(xml).iter()].map((e) => ({ __pyTuple: [tagPy(e.tag), e.text, e.tail] })),

  // root = ET.fromstringlist([part1, part2]); ET.tostring(root, encoding='unicode')
  list: (part1, part2) => tostring(fromstringlist([part1, part2]), { encoding: 'unicode' }),
};
