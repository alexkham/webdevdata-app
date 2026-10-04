// utils/emulators/python/stdlib/html/escape.js
//
// Emulator for the html.escape demo tabs, on the CPython port in _pyhtml.js.

import { escape } from './_pyhtml.js';

export default {
  // html.escape(text)
  escape: (text) => escape(text),

  // html.escape(text, quote=False)
  noquote: (text) => escape(text, false),

  // v = html.escape(value); f'<input value="{v}">'
  attr: (value) => `<input value="${escape(value)}">`,
};
