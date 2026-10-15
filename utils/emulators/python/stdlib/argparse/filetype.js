// utils/emulators/python/stdlib/argparse/filetype.js
//
// Emulator for the argparse.FileType demos, on the CPython port in
// _argparse.js. FileType opens files through the open() port in
// _pyopen.js, in a demo folder holding only the files the template wrote;
// names resolve as on Linux, and the few whose outcome differs between
// Linux and macOS or depends on the machine stop with a DemoLimit there.

import { ArgumentParser, FileType, SystemExit, files, sys, getattr } from './_argparse.js';
import { freshState, exitTuple, raw } from './_cli.js';
import { pyRepr, PyTuple, pySplitlines, shlexSplit, StringIO } from './_pyvalue.js';

// for name, text in [('notes.txt', 'milk\neggs\n'), ('todo.txt', 'call Ada\n')]:
//     with open(name, 'w', encoding='utf-8') as f:
//         f.write(text)
// parser = argparse.ArgumentParser(prog='app')
// parser.add_argument('files', nargs='+', type=argparse.FileType('r', encoding='utf-8'), help=...)
// ... args = parser.parse_args(shlex.split(cmdline)) with COLUMNS=60, stdout+stderr captured
// result = [(f.name, f.read().splitlines()) for each file, closing it;
//           (f.name, 'standard input: not read here') for sys.stdin]
function read(cmdline) {
  const out = freshState('60');
  files.set('notes.txt', 'milk\neggs\n');
  files.set('todo.txt', 'call Ada\n');
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('files', { nargs: '+', type: new FileType('r', -1n, 'utf-8'), help: 'files to read, - for standard input' });
  const argv = shlexSplit(cmdline);
  try {
    const args = parser.parse_args(argv);
    const result = [];
    for (const f of getattr(args, 'files')) {
      if (f === sys.stdin) result.push(new PyTuple([f.name, 'standard input: not read here']));
      else {
        result.push(new PyTuple([f.name, pySplitlines(f.read())]));
        f.close();
      }
    }
    return raw(pyRepr(result));
  } catch (e) {
    if (e instanceof SystemExit) return raw(exitTuple(e, out));
    throw e;
  }
}

// with open('notes.txt', 'w', encoding='utf-8') as f: f.write('milk\neggs\n')
// parser.add_argument('file', type=argparse.FileType(mode))
// parse ['notes.txt'] with stderr captured →
//   (type(f).__name__, f.mode), closing f — or (exit status, last stderr line)
function mode(m) {
  freshState();
  files.set('notes.txt', 'milk\neggs\n');
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('file', { type: new FileType(m) });
  const err = new StringIO();
  sys.stderr = err;
  try {
    const f = getattr(parser.parse_args(['notes.txt']), 'file');
    const result = new PyTuple([f.pyTypeName, f.mode]);
    f.close();
    return result;
  } catch (e) {
    if (e instanceof SystemExit) return new PyTuple([e.code, pySplitlines(err.getvalue()).at(-1)]);
    throw e;
  }
}

export default {
  read,
  mode: (m) => raw(pyRepr(mode(m))),
};
