// utils/emulators/python/stdlib/xml-etree-elementtree/xmlpullparser.js
//
// Emulator for the ET.XMLPullParser demo tabs, on the CPython/expat port in
// _pyet.js — including expat 2.6+ reparse deferral, which decides after
// which feed() an event becomes available.

import { XMLPullParser, tagPy } from './_pyet.js';

// [(event, elem.tag) for event, elem in parser.read_events()]
const tags = (parser) => [...parser.readEvents()].map(([event, elem]) => ({ __pyTuple: [event, tagPy(elem.tag)] }));

export default {
  // feed part1, read; feed part2, read; close, read → (after1, after2, rest)
  feed: (part1, part2) => {
    const parser = new XMLPullParser(['start', 'end']);
    parser.feed(part1);
    const after1 = tags(parser);
    parser.feed(part2);
    const after2 = tags(parser);
    parser.close();
    const rest = tags(parser);
    return { __pyTuple: [after1, after2, rest] };
  },

  // all six events for one document; elements by tag, comment / pi by text
  ns: (xml) => {
    const parser = new XMLPullParser(['start-ns', 'start', 'end', 'end-ns', 'comment', 'pi']);
    parser.feed(xml);
    parser.close();
    return [...parser.readEvents()].map(([event, item]) => {
      let shown = item;
      if (event === 'start' || event === 'end') shown = tagPy(item.tag);
      else if (event === 'comment' || event === 'pi') shown = item.text;
      return { __pyTuple: [event, shown] };
    });
  },

  // feed part1, feed part2, read; flush(), read → (before, after)
  flush: (part1, part2) => {
    const parser = new XMLPullParser(['start']);
    parser.feed(part1);
    parser.feed(part2);
    const before = [...parser.readEvents()].map(([, elem]) => tagPy(elem.tag));
    parser.flush();
    const after = [...parser.readEvents()].map(([, elem]) => tagPy(elem.tag));
    return { __pyTuple: [before, after] };
  },
};
