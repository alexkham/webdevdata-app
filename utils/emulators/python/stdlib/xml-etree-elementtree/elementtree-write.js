// utils/emulators/python/stdlib/xml-etree-elementtree/elementtree-write.js
//
// Emulator for the ElementTree.write demo tabs: the write() port in
// _pyet.js into an io.BytesIO / io.StringIO, output byte-exact.

import { fromstring, ElementTree, writeToStream, outPy } from './_pyet.js';

export default {
  // out = io.BytesIO(); tree.write(out, encoding=encoding, xml_declaration=True); out.getvalue()
  bytesio: (xml, encoding) => {
    const tree = new ElementTree(fromstring(xml));
    return outPy(writeToStream(tree, { encoding, xmlDeclaration: true }, false));
  },

  // out = io.StringIO(); tree.write(out, encoding='unicode', method=method); out.getvalue()
  stringio: (xml, method) => {
    const tree = new ElementTree(fromstring(xml));
    return writeToStream(tree, { encoding: 'unicode', method }, true);
  },
};
