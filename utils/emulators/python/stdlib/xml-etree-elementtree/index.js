// utils/emulators/python/stdlib/xml-etree-elementtree/index.js
//
// Emulator for the xml.etree.ElementTree hub demo (query, build, indent),
// on the CPython/expat port in _pyet.js.

import {
  fromstring, Element, SubElement, tostring, indent, attribPy, tagPy, pySplitlines,
} from './_pyet.js';

export default {
  // root = ET.fromstring(xml); [(e.tag, e.attrib, e.text) for e in root.findall(path)]
  query: (xml, path) => fromstring(xml).findall(path).map((e) => ({ __pyTuple: [tagPy(e.tag), attribPy(e), e.text] })),

  // root = ET.Element('catalog'); item = ET.SubElement(root, tag, sku=sku)
  // item.text = text; ET.tostring(root, encoding='unicode')
  build: (tag, sku, text) => {
    const root = new Element('catalog');
    const item = SubElement(root, tag, [['sku', sku]]);
    item.text = text;
    return tostring(root, { encoding: 'unicode' });
  },

  // ET.indent(root, space=space); ET.tostring(root, encoding='unicode').splitlines()
  indent: (xml, space) => {
    const root = fromstring(xml);
    indent(root, space);
    return pySplitlines(tostring(root, { encoding: 'unicode' }));
  },
};
