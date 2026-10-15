// utils/emulators/python/stdlib/xml-etree-elementtree/treebuilder.js
//
// Emulator for the ET.TreeBuilder demo tabs, on the C TreeBuilder /
// XMLParser port in _pyet.js.

import { TreeBuilder, XMLParser, fromstring, tostring } from './_pyet.js';

export default {
  // tb.start('root', {}); tb.start(tag, {'id': id}); tb.data(text);
  // tb.end(tag); tb.end('root'); ET.tostring(tb.close(), encoding='unicode')
  manual: (tag, id, text) => {
    const tb = new TreeBuilder();
    tb.start('root', new Map());
    tb.start(tag, new Map([['id', id]]));
    tb.data(text);
    tb.end(tag);
    tb.end('root');
    return tostring(tb.close(), { encoding: 'unicode' });
  },

  // parser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True, insert_pis=True))
  // ET.tostring(ET.fromstring(xml, parser=parser), encoding='unicode')
  insert: (xml) => {
    const parser = new XMLParser({ target: new TreeBuilder({ insertComments: true, insertPis: true }) });
    return tostring(fromstring(xml, parser), { encoding: 'unicode' });
  },
};
