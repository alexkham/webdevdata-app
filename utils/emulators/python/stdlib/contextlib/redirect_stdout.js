// utils/emulators/python/stdlib/contextlib/redirect_stdout.js
//
// Emulator for the redirect_stdout / redirect_stderr demo tabs, on the port
// in _pycontextlib.js: sys.stdout / sys.stderr are attributes of a small sys
// model, print() writes to whatever sys.stdout is at call time, and the text
// printed to the real stdout is shown before the final value, as CPython
// shows it.

import { redirect_stdout, redirect_stderr, StringIO, withStmt, makeSys, print, withScreen } from './_pycontextlib.js';

export default {
  // buf = io.StringIO()
  // with redirect_stdout(buf): print(text); print('second line')
  // print('back on screen')
  // buf.getvalue()
  capture: (text) => {
    const sys = makeSys();
    const buf = new StringIO();
    withStmt(new redirect_stdout(sys, buf), () => {
      print(sys, [text]);
      print(sys, ['second line']);
    });
    print(sys, ['back on screen']);
    return withScreen(sys, buf.getvalue());
  },

  // err = io.StringIO()
  // with redirect_stderr(err): print(text, file=sys.stderr)
  // err.getvalue()
  stderr: (text) => {
    const sys = makeSys();
    const err = new StringIO();
    withStmt(new redirect_stderr(sys, err), () => {
      print(sys, [text], { file: sys.stderr });
    });
    return withScreen(sys, err.getvalue());
  },
};
