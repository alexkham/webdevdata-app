// utils/emulators/python/exceptions/eoferror.js
//
// Emulator for the EOFError demo modes. sys.stdin is replaced by an
// io.StringIO holding '\n'.join(lines); input() reads one line with
// readline(), strips the trailing '\n', and raises EOFError when
// readline() returns '' (end of data, nothing read).

import { raise } from '../../../py-exceptions.js';

function makeStdin(lines) {
  const text = lines.join('\n');
  let pos = 0;
  return () => {
    if (pos >= text.length) raise('EOFError', 'EOF when reading a line');
    const nl = text.indexOf('\n', pos);
    const end = nl === -1 ? text.length : nl;
    const line = text.slice(pos, end);
    pos = nl === -1 ? text.length : nl + 1;
    return line;
  };
}

// {$n} is substituted as a Python literal: from 1e21 up JS writes exponent
// form (a Python float, which range() rejects); non-finite renders as inf.
function checkCount(n) {
  if (!Number.isFinite(n)) raise('NameError', "name 'inf' is not defined");
  if (Math.abs(n) >= 1e21) raise('TypeError', "'float' object cannot be interpreted as an integer");
}

export default {
  trigger: (lines, n) => {
    const input = makeStdin(lines);
    checkCount(n);
    const answers = [];
    for (let i = 0; i < n; i += 1) answers.push(input());
    return answers;
  },

  handle: (lines) => {
    const input = makeStdin(lines);
    const answers = [];
    try {
      for (;;) answers.push(input());
    } catch (e) {
      if (e.name !== 'EOFError') throw e;
    }
    return answers;
  },
};
