// utils/emulators/python/stdlib/logging/_demo.js
//
// Small helpers shared by the logging page emulators: turn a demo input
// into the Python value the snippet's code holds, and the recurring
// "logger + StringIO handler" set-up of the snippets.

import { fromLiteral } from '../../../../py-num.js';
import { LoggingModule, StringIO, PyFloat } from './_pylogging.js';
import { splitlines, pyRepr } from './_pyfmt.js';

// The Python value of a coerced demo argument, as the filled-in code
// spells it: text → str, a number → int or float by its literal (inf is a
// NameError, exactly as in CPython), null → None.
export function py(v) {
  if (typeof v === 'number') {
    const n = fromLiteral(v);
    return n.int !== undefined ? n.int : new PyFloat(n.float);
  }
  if (Array.isArray(v)) return v.map(py);
  return v === undefined ? null : v;
}

// The demo output of any engine value: its exact Python repr
export const show = (v) => ({ __pyRaw: pyRepr(v) });

// A fresh logging module (one interpreter's worth of state)
export const fresh = () => new LoggingModule();

// handler = logging.StreamHandler(io.StringIO()) with an optional
// Formatter(fmt) — returns [handler, stream]
export function stringHandler(L, fmt = undefined, opts = {}) {
  const stream = new StringIO();
  const handler = L.StreamHandler(stream);
  if (fmt !== undefined) handler.setFormatter(L.Formatter(fmt, opts.datefmt ?? null, opts.style ?? '%', opts.validate ?? true, opts.defaults ? { defaults: opts.defaults } : {}));
  return [handler, stream];
}

// The usual snippet set-up:
//   log = logging.getLogger(name); log.setLevel(level); log.propagate = False
//   stream = io.StringIO(); handler = logging.StreamHandler(stream)
//   [handler.setFormatter(logging.Formatter(fmt))]; log.addHandler(handler)
// then body(log, handler, stream) in try / finally: log.removeHandler(handler)
export function withLogger(L, name, level, fmt, body) {
  const log = L.getLogger(name);
  log.setLevel(level);
  log.propagate = false;
  const [handler, stream] = stringHandler(L, fmt);
  log.addHandler(handler);
  try {
    body(log, handler, stream);
  } finally {
    log.removeHandler(handler);
  }
  return stream;
}

// with contextlib.redirect_stderr(err): body() — returns err
export function redirectStderr(L, body) {
  const saved = L.stderr;
  const err = new StringIO();
  L.stderr = err;
  try {
    body();
  } finally {
    L.stderr = saved;
  }
  return err;
}

// [line for line in text.splitlines() if not line.startswith(' ')]
export const unindented = (text) => splitlines(text).filter((line) => !line.startsWith(' '));

export { splitlines };
