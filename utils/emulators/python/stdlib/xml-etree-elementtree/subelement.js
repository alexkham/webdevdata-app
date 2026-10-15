// utils/emulators/python/stdlib/xml-etree-elementtree/subelement.js
//
// Emulator for the ET.SubElement demo tabs, on _pyet.js.

import { Element, SubElement, tostring, attribPy } from './_pyet.js';

const str = (e) => tostring(e, { encoding: 'unicode' });

export default {
  // root = ET.Element('ul'); for text in items: ET.SubElement(root, 'li').text = text
  list: (items) => {
    const root = new Element('ul');
    for (const text of items) SubElement(root, 'li').text = text;
    return str(root);
  },

  // child = ET.SubElement(root, tag, {'id': id}, lang='en')
  // (child.attrib, ET.tostring(root, encoding='unicode'))
  attrs: (tag, id) => {
    const root = new Element('doc');
    const child = SubElement(root, tag, [['id', id]]);
    child.set('lang', 'en');
    return { __pyTuple: [attribPy(child), str(root)] };
  },
};
