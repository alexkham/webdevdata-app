// utils/emulators/python/stdlib/xml-etree-elementtree/dump.js
//
// Emulator for the ET.dump demo tabs: what dump() prints (captured from
// sys.stdout in the template), on the serializer port in _pyet.js.

import { fromstring, indent, dumpText } from './_pyet.js';

export default {
  // with contextlib.redirect_stdout(buf): ET.dump(ET.fromstring(xml)); buf.getvalue()
  dump: (xml) => dumpText(fromstring(xml)),

  // root = ET.fromstring(xml); ET.indent(root); dump(root) captured
  pretty: (xml) => {
    const root = fromstring(xml);
    indent(root);
    return dumpText(root);
  },
};
