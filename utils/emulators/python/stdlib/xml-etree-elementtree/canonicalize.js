// utils/emulators/python/stdlib/xml-etree-elementtree/canonicalize.js
//
// Emulator for the ET.canonicalize / C14NWriterTarget demo tabs, on the
// C14N 2.0 writer port in _pyet.js.

import { canonicalize, C14NWriterTarget, XMLParser } from './_pyet.js';

export default {
  // ET.canonicalize(xml)
  canon: (xml) => canonicalize(xml),

  // ET.canonicalize(a, strip_text=True) == ET.canonicalize(b, strip_text=True)
  compare: (a, b) => canonicalize(a, { stripText: true }) === canonicalize(b, { stripText: true }),

  // ET.canonicalize(xml, exclude_tags=tags, exclude_attrs=attrs)
  exclude: (xml, tags, attrs) => canonicalize(xml, { excludeTags: tags, excludeAttrs: attrs }),

  // parser = ET.XMLParser(target=ET.C14NWriterTarget(chunks.append)); feed; close; chunks
  writer: (xml) => {
    const chunks = [];
    const parser = new XMLParser({ target: new C14NWriterTarget((s) => chunks.push(s)) });
    parser.feed(xml);
    parser.close();
    return chunks;
  },
};
