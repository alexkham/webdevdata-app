// utils/emulators/python/stdlib/io/close-closed.js
//
// Emulator for the close / closed demo tabs, on the C io port in _pyio.js.
// The "after close" tabs call getattr(f, name)() for each name: methods run
// on the port; attributes, missing arguments and unknown names raise what
// CPython raises for a zero-argument call.

import { StringIO, BytesIO, utf8Encode, tuple, pyDict, exc, demoLimit, typeName } from './_pyio.js';
import { errorLine } from '../../../../demo-coerce.js';

const ZERO_ARG = {
  StringIO: ['close', 'detach', 'fileno', 'flush', 'getvalue', 'isatty', 'read', 'readable', 'readline', 'readlines', 'seekable', 'tell', 'truncate', 'writable'],
  BytesIO: ['close', 'detach', 'fileno', 'flush', 'getbuffer', 'getvalue', 'isatty', 'read', 'read1', 'readable', 'readline', 'readlines', 'seekable', 'tell', 'truncate', 'writable'],
};
const ATTRS = {
  StringIO: ['closed', 'encoding', 'errors', 'line_buffering', 'newlines'],
  BytesIO: ['closed'],
};
// METH_O methods called through a bound method: "<Type>.<name>() takes exactly one argument (0 given)"
const ONE_ARG = {
  StringIO: ['write', 'writelines'],
  BytesIO: ['readinto', 'readinto1', 'write', 'writelines'],
};

// getattr(f, name)() with no arguments
function callByName(f, name) {
  const cls = f.pyType;
  if (name.startsWith('_')) throw demoLimit('This demo calls the public methods only (names without a leading underscore).');
  if (ZERO_ARG[cls].includes(name)) {
    const r = f[name]();
    if (name === 'getbuffer') throw demoLimit('A live memoryview repr shows a memory address.');
    return r;
  }
  if (ATTRS[cls].includes(name)) {
    const v = f[name];
    throw exc('TypeError', `'${typeName(v)}' object is not callable`);
  }
  if (ONE_ARG[cls].includes(name)) throw exc('TypeError', `${cls}.${name}() takes exactly one argument (0 given)`);
  if (name === 'seek') throw exc('TypeError', 'seek expected at least 1 argument, got 0');
  throw exc('AttributeError', `'_io.${cls}' object has no attribute '${name}'`);
}

// f'{type(e).__name__}: {e}' — the unqualified class name
const describe = (e) => {
  const line = errorLine(e);
  return line.startsWith('io.') ? line.slice(3) : line;
};

function afterClose(f, methods) {
  f.close();
  const pairs = [];
  for (const name of methods) {
    let v;
    try {
      v = callByName(f, name);
    } catch (e) {
      if (e && (e.name === 'DemoLimit' || e.name === 'EmulatorLimit')) throw e;
      v = describe(e).includes(':') ? describe(e) : `${describe(e)}: `;
    }
    const i = pairs.findIndex(([k]) => k === name);
    if (i === -1) pairs.push([name, v]);
    else pairs[i][1] = v;
  }
  return pyDict(pairs);
}

export default {
  with: (text) => {
    const f = new StringIO();
    f.enter();
    f.write(text);
    const inside = tuple(f.closed, f.getvalue());
    f.exit();
    return tuple(inside, f.closed);
  },

  text: (text, methods) => afterClose(new StringIO(text), methods),

  bytes: (text, methods) => afterClose(new BytesIO(utf8Encode(text)), methods),
};
