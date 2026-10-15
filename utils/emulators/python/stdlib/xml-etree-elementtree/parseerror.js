// utils/emulators/python/stdlib/xml-etree-elementtree/parseerror.js
//
// Emulator for the ET.ParseError demo tabs, on the expat port in _pyet.js
// (codes, messages and positions are expat's).

import { fromstring, ParseError, tagPy, pySplitlines } from './_pyet.js';
import { PyException } from '../../../../py-exceptions.js';

// run fn; a ParseError → onError(e), success → onOk()
const attempt = (fn, onError, onOk) => {
  try {
    fn();
  } catch (e) {
    if (e instanceof ParseError) return onError(e);
    throw e;
  }
  return onOk();
};

export default {
  // ET.fromstring(xml).tag, uncaught
  trigger: (xml) => tagPy(fromstring(xml).tag),

  // except ET.ParseError as e: (e.code, e.position)
  attributes: (xml) => attempt(
    () => fromstring(xml),
    (e) => ({ __pyTuple: [e.code, { __pyTuple: e.position }] }),
    () => 'parsed fine',
  ),

  // xml = line1 + '\n' + line2 … (line, column, xml.splitlines()[line - 1][column:])
  lines: (line1, line2) => {
    const xml = `${line1}\n${line2}`;
    return attempt(
      () => fromstring(xml),
      (e) => {
        const [line, column] = e.position;
        const lines = pySplitlines(xml);
        if (line - 1 >= lines.length) throw new PyException('IndexError', 'list index out of range');
        return { __pyTuple: [line, column, [...lines[line - 1]].slice(column).join('')] };
      },
      () => 'parsed fine',
    );
  },

  // except SyntaxError as e: (type(e).__name__, isinstance(e, ET.ParseError))
  catch: (xml) => attempt(
    () => fromstring(xml),
    () => ({ __pyTuple: ['ParseError', true] }),
    () => 'parsed fine',
  ),
};
