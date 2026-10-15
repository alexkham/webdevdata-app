// utils/emulators/python/stdlib/xml-etree-elementtree/elementtree.js
//
// Emulator for the ET.ElementTree class demo tabs, on _pyet.js.

import { fromstring, parseFile, ElementTree, tagPy } from './_pyet.js';

export default {
  // tree = ET.ElementTree(ET.fromstring(xml))
  // (tree.getroot().tag, tree.findtext(path), [e.tag for e in tree.iter()])
  wrap: (xml, path) => {
    const tree = new ElementTree(fromstring(xml));
    return { __pyTuple: [tagPy(tree.getroot().tag), tree.findtext(path), [...tree.iter()].map((e) => tagPy(e.tag))] };
  },

  // tree = ET.ElementTree(file=io.StringIO(xml)); (tree.getroot().tag, len(tree.getroot()))
  file: (xml) => {
    const tree = new ElementTree(parseFile(xml));
    return { __pyTuple: [tagPy(tree.getroot().tag), tree.getroot().length] };
  },
};
