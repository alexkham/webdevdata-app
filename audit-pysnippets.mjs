// audit-pysnippets.mjs
//
// QA helper — NOT part of the build. Runs Python snippets through real
// CPython and returns what a reader would see, so audits can compare it
// with the output recorded in content (or produced by an emulator).
//
// Output of one snippet = the non-empty parts, joined by "\n":
//   1. captured stdout (trailing newline trimmed)
//   2. repr() of the final statement, when it is an expression
//        mode 'demo':    always (the demo box shows None too)
//        mode 'snippet': only when not None (REPL rule — print() as the
//                        last line must not add a stray "None")
//   3. an uncaught exception, rendered as the LAST line(s) of its
//      traceback (traceback.format_exception_only), e.g. "KeyError: 'c'",
//      bare "StopIteration" for an empty message, notes included.
//
// Every snippet runs in a fresh namespace, in a fresh empty temp dir as
// cwd (so file examples like open('missing.txt') are deterministic).
//
// Usage: const out = runPythonSnippets([{ id, code, mode }]) → Map id → text

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const RUNNER = `
import ast, contextlib, io, json, os, sys, tempfile, traceback

def last_lines(e):
    # With the traceback attached, so NameError gets its "Did you mean"
    # suggestion exactly as the interpreter prints it.
    te = traceback.TracebackException(type(e), e, e.__traceback__)
    lines = ''.join(te.format_exception_only()).rstrip('\\n').split('\\n')
    name = type(e).__name__
    for i, line in enumerate(lines):
        if line.startswith(name) or line.startswith(type(e).__module__ + '.' + name):
            return '\\n'.join(lines[i:])
    return lines[-1]

def run(code, mode):
    out = io.StringIO()
    parts = []
    with tempfile.TemporaryDirectory() as tmp:
        prev = os.getcwd()
        os.chdir(tmp)
        try:
            try:
                tree = ast.parse(code, '<demo>', 'exec')
                last = None
                if tree.body and isinstance(tree.body[-1], ast.Expr):
                    last = ast.Expression(tree.body.pop().value)
                ns = {'__name__': '__main__'}
                with contextlib.redirect_stdout(out):
                    exec(compile(tree, '<demo>', 'exec'), ns)
                    has_val = last is not None
                    val = eval(compile(last, '<demo>', 'eval'), ns) if has_val else None
                s = out.getvalue().rstrip('\\n')
                if s: parts.append(s)
                if has_val and (mode == 'demo' or val is not None):
                    parts.append(repr(val))
            except BaseException as e:
                s = out.getvalue().rstrip('\\n')
                if s: parts.append(s)
                parts.append(last_lines(e))
        finally:
            os.chdir(prev)
    return '\\n'.join(parts)

with open(sys.argv[1], encoding='utf-8') as f:
    items = json.load(f)
res = [{'id': it['id'], 'out': run(it['code'], it.get('mode', 'snippet'))} for it in items]
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    json.dump(res, f)
`;

export function runPythonSnippets(items) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pysnip-'));
  try {
    const inFile = path.join(dir, 'in.json');
    const outFile = path.join(dir, 'out.json');
    const runFile = path.join(dir, 'run.py');
    fs.writeFileSync(inFile, JSON.stringify(items));
    fs.writeFileSync(runFile, RUNNER);
    execFileSync('python', [runFile, inFile, outFile], { stdio: 'inherit' });
    return new Map(JSON.parse(fs.readFileSync(outFile, 'utf8')).map((r) => [r.id, r.out]));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
