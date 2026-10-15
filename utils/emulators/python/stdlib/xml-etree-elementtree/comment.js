// utils/emulators/python/stdlib/xml-etree-elementtree/comment.js
//
// Emulator for the ET.Comment / ET.PI demo tabs, on _pyet.js.

import {
  Element, Comment, ProcessingInstruction, COMMENT, PI, TreeBuilder, XMLParser, fromstring, tostring, tagPy,
} from './_pyet.js';

export default {
  // root.append(ET.Comment(comment)); root.append(ET.PI(target, data))
  // ET.tostring(root, encoding='unicode')
  build: (comment, target, data) => {
    const root = new Element('root');
    root.children.push(Comment(comment));
    root.children.push(ProcessingInstruction(target, data));
    return tostring(root, { encoding: 'unicode' });
  },

  // parsed with TreeBuilder(insert_comments=True, insert_pis=True):
  // [('Comment' / 'PI' / tag, e.text) for e in root.iter()]
  inspect: (xml) => {
    const parser = new XMLParser({ target: new TreeBuilder({ insertComments: true, insertPis: true }) });
    const root = fromstring(xml, parser);
    return [...root.iter()].map((e) => {
      let name;
      if (e.tag === COMMENT) name = 'Comment';
      else if (e.tag === PI) name = 'PI';
      else name = tagPy(e.tag);
      return { __pyTuple: [name, e.text] };
    });
  },
};
