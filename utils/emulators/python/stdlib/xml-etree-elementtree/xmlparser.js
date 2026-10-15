// utils/emulators/python/stdlib/xml-etree-elementtree/xmlparser.js
//
// Emulator for the ET.XMLParser demo tabs: the template's target classes
// written as JS objects with the same methods, driven by the C XMLParser
// port in _pyet.js (which calls only the methods a target defines).

import { XMLParser, dictPy } from './_pyet.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // class MaxDepth (the docs example); parser.feed(xml); parser.close()
  target: (xml) => {
    const t = {
      maxDepth: 0,
      depth: 0,
      start() {
        this.depth += 1;
        if (this.depth > this.maxDepth) this.maxDepth = this.depth;
      },
      end() { this.depth -= 1; },
      data() {},
      close() { return this.maxDepth; },
    };
    const parser = new XMLParser({ target: t });
    parser.feed(xml);
    return parser.close();
  },

  // class Recorder: every callback appended to calls; close() returns them
  calls: (xml) => {
    const calls = [];
    const t = {
      start: (tag, attrib) => calls.push(tuple('start', tag, dictPy([...attrib]))),
      end: (tag) => calls.push(tuple('end', tag)),
      data: (data) => calls.push(tuple('data', data)),
      comment: (text) => calls.push(tuple('comment', text)),
      pi: (target, data) => calls.push(tuple('pi', target, data)),
      start_ns: (prefix, uri) => calls.push(tuple('start_ns', prefix, uri)),
      end_ns: (prefix) => calls.push(tuple('end_ns', prefix)),
      close: () => calls,
    };
    const parser = new XMLParser({ target: t });
    parser.feed(xml);
    return parser.close();
  },
};
