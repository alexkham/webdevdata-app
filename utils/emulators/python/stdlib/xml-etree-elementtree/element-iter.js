// utils/emulators/python/stdlib/xml-etree-elementtree/element-iter.js
//
// Emulator for the Element.iter / itertext demo tabs, on _pyet.js (the C
// Element's iterators: depth-first document order; itertext yields the
// non-empty text and tails below the element, not its own tail).

import { fromstring, tagPy } from './_pyet.js';

export default {
  // root = ET.fromstring(xml); [e.tag for e in root.iter(tag)]
  iter: (xml, tag) => [...fromstring(xml).iter(tag)].map((e) => tagPy(e.tag)),

  // root = ET.fromstring(xml); (list(root.itertext()), ''.join(root.itertext()))
  itertext: (xml) => {
    const parts = [...fromstring(xml).itertext()];
    return { __pyTuple: [parts, parts.join('')] };
  },

  // child = ET.fromstring(xml).find(tag); (child.text, child.tail, list(child.itertext()))
  child: (xml, tag) => {
    const child = fromstring(xml).find(tag);
    if (child === null) {
      const e = new Error("'NoneType' object has no attribute 'text'");
      e.name = 'AttributeError';
      throw e;
    }
    return { __pyTuple: [child.text, child.tail, [...child.itertext()]] };
  },
};
