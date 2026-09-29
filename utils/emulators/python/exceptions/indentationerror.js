// utils/emulators/python/exceptions/indentationerror.js
//
// Emulator for the IndentationError / TabError demo modes. Both compile a
// three-line program
//
//   for i in range(3):
//   <indent 2>n += 1
//   <indent 3>n += 10
//
// and the emulator reimplements CPython 3.13's indentation bookkeeping
// for it (Parser/lexer/lexer.c):
//   - every line gets two widths: col (tab → next multiple of 8) and
//     altcol (tab = 1 column). The indent stack stores both.
//   - same col but different altcol, an indent whose altcol does not grow,
//     or a dedent whose altcol does not match → TabError
//   - a dedent to a col that is not on the stack → "unindent does not
//     match any outer indentation level" (tokenizer)
//   - line 2 not indented → the parser's "expected an indented block
//     after 'for' statement on line 1"; line 3 indented deeper than line
//     2 → the parser's "unexpected indent"

import { raise } from '../../../py-exceptions.js';

const TABSIZE = 8;

// widths of an indentation made of n tabs or n spaces (computed, not
// built — the input box allows huge counts); negative n → '' in Python
const spaces = (n) => ({ col: Math.max(n, 0), altcol: Math.max(n, 0) });
const tabs = (n) => ({ col: Math.max(n, 0) * TABSIZE, altcol: Math.max(n, 0) });

// compile() of the three-line program; returns normally when it compiles,
// otherwise throws { name, message, lineno }
function check(l2, l3) {
  const fail = (type, msg, lineno) => {
    try {
      raise(type, msg);
    } catch (e) {
      e.lineno = lineno;
      throw e;
    }
  };
  // line 2: the loop body must be indented (altcol grows with col here)
  if (l2.col === 0) fail('IndentationError', "expected an indented block after 'for' statement on line 1", 2);
  // stack is now [0, l2]
  if (l3.col === l2.col) {
    if (l3.altcol !== l2.altcol) fail('TabError', 'inconsistent use of tabs and spaces in indentation', 3);
    return 'inside';
  }
  if (l3.col > l2.col) {
    if (l3.altcol <= l2.altcol) fail('TabError', 'inconsistent use of tabs and spaces in indentation', 3);
    fail('IndentationError', 'unexpected indent', 3);
  }
  // dedent: pop back to column 0, the only outer level
  if (l3.col !== 0) fail('IndentationError', 'unindent does not match any outer indentation level', 3);
  return 'after';
}

export default {
  // n = 0; exec(src); n
  trigger: (first, second) => {
    const where = check(spaces(first), spaces(second));
    // n += 1 runs 3 times; n += 10 runs 3 times inside the loop, once after
    return where === 'inside' ? 33 : 13;
  },

  // try: compile(...) except IndentationError as e: (type name, msg, lineno)
  handle: (tabCount, spaceCount) => {
    try {
      check(tabs(tabCount), spaces(spaceCount));
      return 'compiles';
    } catch (e) {
      return { __pyTuple: [e.name, e.message, e.lineno] };
    }
  },
};
