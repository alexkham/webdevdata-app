// utils/emulators/python/compile.js
//
// Emulator for Python compile(). Real compile returns a code object;
// the demo describes the outcome. Key teaching points: mode "eval"
// rejects statements; mode "exec" accepts them; wrong-mode / syntax
// errors produce a SyntaxError.

class SyntaxErrorLike extends Error {
  constructor(message) { super(message); this.name = 'SyntaxError'; }
}

function looksLikeStatement(s) {
  const t = s.trim();
  return (
    /^\s*(def|class|import|from|if|for|while|try|with|return|raise|del|pass|global|nonlocal)\b/.test(t) ||
    /^[a-zA-Z_][a-zA-Z_0-9]*\s*=\s*[^=]/.test(t) ||
    /\n/.test(t)
  );
}

function looksLikeIncomplete(s) {
  const t = s.trim();
  return /=$/.test(t) || /^\s*def\s/.test(t) && !/:/.test(t);
}

export default function pyCompile(source, mode) {
  const src = String(source == null ? '' : source);
  const m = String(mode == null ? '' : mode).trim() || 'exec';

  if (src.trim() === '') {
    throw new SyntaxErrorLike('unexpected EOF while parsing');
  }

  if (looksLikeIncomplete(src)) {
    throw new SyntaxErrorLike('invalid syntax');
  }

  if (m === 'eval' && looksLikeStatement(src)) {
    throw new SyntaxErrorLike('invalid syntax  # mode "eval" requires an expression');
  }

  const label = m === 'eval' ? 'expression' : m === 'single' ? 'single statement' : 'statements';
  return `<code object at 0x... mode="${m}">\n# compiled ${label}; run with ${m === 'eval' ? 'eval()' : 'exec()'}`;
}