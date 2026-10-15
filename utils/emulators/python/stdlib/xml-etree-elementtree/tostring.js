// utils/emulators/python/stdlib/xml-etree-elementtree/tostring.js
//
// Emulator for the ET.tostring / tostringlist demo tabs: the port of
// ElementTree.write() in _pyet.js, bytes output byte-exact (UTF-8, ASCII
// and Latin-1 with errors='xmlcharrefreplace'; other codecs → limit).

import { fromstring, Element, tostring, tostringlist, outPy } from './_pyet.js';

export default {
  // e = ET.Element('note'); e.text = text; ET.tostring(e, encoding=encoding)
  encoding: (text, encoding) => {
    const e = new Element('note');
    e.text = text;
    return outPy(tostring(e, { encoding }));
  },

  // ET.tostring(ET.fromstring(xml), encoding='unicode', method=method)
  method: (xml, method) => tostring(fromstring(xml), { encoding: 'unicode', method }),

  // ET.tostring(ET.fromstring(xml), encoding='unicode', default_namespace=uri)
  defaultns: (xml, uri) => tostring(fromstring(xml), { encoding: 'unicode', defaultNamespace: uri }),

  // ET.tostringlist(ET.fromstring(xml), encoding='unicode')
  list: (xml) => tostringlist(fromstring(xml), { encoding: 'unicode' }),
};
