// utils/emulators/python/stdlib/xml-etree-elementtree/element-find.js
//
// Emulator for the Element.find / findall / findtext / iterfind demo tabs:
// a port of Lib/xml/etree/ElementPath.py plus the C fast path for plain
// tag names (_pyet.js).

import { fromstring, attribPy, tagPy } from './_pyet.js';

const tagAttrib = (e) => ({ __pyTuple: [tagPy(e.tag), attribPy(e)] });

export default {
  // root = ET.fromstring(xml); [(e.tag, e.attrib) for e in root.findall(path)]
  findall: (xml, path) => fromstring(xml).findall(path).map(tagAttrib),

  // (root.find(path) is not None, root.findtext(path), root.findtext(path, default='-'))
  find: (xml, path) => {
    const root = fromstring(xml);
    return { __pyTuple: [root.find(path) !== null, root.findtext(path), root.findtext(path, '-')] };
  },

  // [e.tag for e in root.findall(path, namespaces={prefix: uri})]
  ns: (xml, path, prefix, uri) => {
    const root = fromstring(xml);
    return root.findall(path, new Map([[prefix, uri]])).map((e) => tagPy(e.tag));
  },
};
