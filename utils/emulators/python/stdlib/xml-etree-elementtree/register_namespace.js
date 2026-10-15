// utils/emulators/python/stdlib/xml-etree-elementtree/register_namespace.js
//
// Emulator for the ET.register_namespace demo tab. The real function edits
// the module-wide ET._namespace_map (the demo template restores it); here
// the serializer port in _pyet.js gets a private copy of that map.

import {
  Element, SubElement, QName, tostring, namespaceMap, registerNamespace,
} from './_pyet.js';

export default {
  // root = Element(QName(uri, 'feed')); SubElement(root, QName(uri, 'entry'))
  // before = tostring(root); register_namespace(prefix, uri); after = tostring(root)
  register: (prefix, uri) => {
    const root = new Element(new QName(uri, 'feed'));
    SubElement(root, new QName(uri, 'entry'));
    const before = tostring(root, { encoding: 'unicode' });
    const map = namespaceMap();
    registerNamespace(map, prefix, uri);
    const after = tostring(root, { encoding: 'unicode', nsMap: map });
    return { __pyTuple: [before, after] };
  },
};
