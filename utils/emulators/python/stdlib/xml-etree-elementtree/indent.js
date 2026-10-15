// utils/emulators/python/stdlib/xml-etree-elementtree/indent.js
//
// Emulator for the ET.indent() demo tabs: Lib/xml/etree/ElementTree.py
// indent() ported in _pyet.js, then the tostring() port.

import { fromstring, indent, tostring, pySplitlines } from './_pyet.js';

const str = (e) => tostring(e, { encoding: 'unicode' });

export default {
  // ET.indent(root, space=space); ET.tostring(root, encoding='unicode').splitlines()
  space: (xml, space) => {
    const root = fromstring(xml);
    indent(root, space);
    return pySplitlines(str(root));
  },

  // ET.indent(root, level=level); ET.tostring(root, encoding='unicode')
  level: (xml, level) => {
    const root = fromstring(xml);
    indent(root, '  ', level);
    return str(root);
  },
};
