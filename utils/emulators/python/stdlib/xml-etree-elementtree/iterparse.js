// utils/emulators/python/stdlib/xml-etree-elementtree/iterparse.js
//
// Emulator for the ET.iterparse demo tabs, on the CPython/expat port in
// _pyet.js (iterparse over io.StringIO: 16 KiB reads fed to an
// XMLPullParser, with expat's reparse deferral).

import { iterparse, tostring, tagPy } from './_pyet.js';

// how the template shows one event's value
const shown = (event, item) => {
  if (event === 'start' || event === 'end') return tagPy(item.tag);
  if (event === 'comment' || event === 'pi') return item.text;
  return item; // start-ns: (prefix, uri) tuple; end-ns: None
};

export default {
  // for event, item in ET.iterparse(io.StringIO(xml), events=events): ...
  events: (xml, events) => iterparse(xml, events).events.map(([event, item]) => ({ __pyTuple: [event, shown(event, item)] })),

  // it = ET.iterparse(io.StringIO(xml)); on 'end' of tag: names.append(elem.get('name')); elem.clear()
  // (names, ET.tostring(it.root, encoding='unicode'))
  clear: (xml, tag) => {
    const names = [];
    const { root } = iterparse(xml, null, ([, elem]) => {
      if (elem.tag === tag) {
        names.push(elem.get('name'));
        elem.clear();
      }
    });
    return { __pyTuple: [names, tostring(root, { encoding: 'unicode' })] };
  },
};
