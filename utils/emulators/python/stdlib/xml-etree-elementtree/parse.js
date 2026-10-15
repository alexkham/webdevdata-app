// utils/emulators/python/stdlib/xml-etree-elementtree/parse.js
//
// Emulator for the ET.parse / ElementTree.parse demo tabs. A file — or an
// io.StringIO read by the default parser — reaches expat as the UTF-8
// bytes of its text (parseFile in _pyet.js).

import { parseFile, attribPy, tagPy } from './_pyet.js';

export default {
  // tree = ET.parse(io.StringIO(xml)); root = tree.getroot()
  // (root.tag, [c.tag for c in root])
  stringio: (xml) => {
    const root = parseFile(xml);
    return { __pyTuple: [tagPy(root.tag), root.children.map((c) => tagPy(c.tag))] };
  },

  // write xml to data.xml (UTF-8), then ET.parse('data.xml').getroot()
  // (root.tag, root.attrib)
  file: (xml) => {
    const root = parseFile(xml);
    return { __pyTuple: [tagPy(root.tag), attribPy(root)] };
  },

  // tree = ET.ElementTree(); root = tree.parse(io.StringIO(xml))
  // (root is tree.getroot(), root.tag)
  method: (xml) => {
    const root = parseFile(xml);
    return { __pyTuple: [true, tagPy(root.tag)] };
  },
};
