// utils/emulators/python/stdlib/xml-etree-elementtree/element-tag.js
//
// Emulator for the Element.tag / text / tail demo tabs, on _pyet.js.

import { fromstring, Element, SubElement, tostring, tagPy } from './_pyet.js';

const str = (e) => tostring(e, { encoding: 'unicode' });

export default {
  // [(e.tag, e.text, e.tail) for e in ET.fromstring(xml).iter()]
  parts: (xml) => [...fromstring(xml).iter()].map((e) => ({ __pyTuple: [tagPy(e.tag), e.text, e.tail] })),

  // root = ET.Element('p'); b = ET.SubElement(root, 'b')
  // root.text = text; b.text = inner; b.tail = tail; ET.tostring(root, encoding='unicode')
  build: (text, inner, tail) => {
    const root = new Element('p');
    const b = SubElement(root, 'b');
    root.text = text;
    b.text = inner;
    b.tail = tail;
    return str(root);
  },

  // for e in root.iter(old): e.tag = new
  rename: (xml, oldTag, newTag) => {
    const root = fromstring(xml);
    for (const e of root.iter(oldTag)) e.tag = newTag;
    return str(root);
  },
};
