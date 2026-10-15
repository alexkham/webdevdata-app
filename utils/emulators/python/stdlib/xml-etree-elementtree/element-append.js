// utils/emulators/python/stdlib/xml-etree-elementtree/element-append.js
//
// Emulator for the Element.append / insert / remove / clear demo tabs, on
// _pyet.js (the C Element: list.insert index rules, remove by identity).

import { fromstring, Element, tostring, attribPy, tagPy } from './_pyet.js';

const str = (e) => tostring(e, { encoding: 'unicode' });

export default {
  // root.append(ET.Element(tag)); root.insert(index, ET.Element('new'))
  build: (xml, tag, index) => {
    const root = fromstring(xml);
    root.append(new Element(tag));
    root.insert(index, new Element('new'));
    return str(root);
  },

  // for child in root.findall(path): root.remove(child)
  remove: (xml, path) => {
    const root = fromstring(xml);
    for (const child of root.findall(path)) root.remove(child);
    return str(root);
  },

  // root.clear(); (root.tag, root.attrib, root.text, len(root), ET.tostring(root, encoding='unicode'))
  clear: (xml) => {
    const root = fromstring(xml);
    root.clear();
    return { __pyTuple: [tagPy(root.tag), attribPy(root), root.text, root.length, str(root)] };
  },
};
