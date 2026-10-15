// utils/emulators/python/stdlib/subprocess/_subprocess.js
//
// The PURE parts of CPython's Lib/subprocess.py (3.13), ported exactly, for
// the subprocess snippet demos. A browser cannot start processes, so nothing
// here pretends to: it covers what subprocess computes without a child —
//   list2cmdline            the Windows argv → command-line quoting
//   CompletedProcess        __repr__, check_returncode
//   CalledProcessError      __str__ (exit status / signal name)
//   TimeoutExpired          __str__
//   PIPE / STDOUT / DEVNULL routing: where a FIXED child's two lines end up
// plus shlex.quote / shlex.join (Lib/shlex.py), used by the shell=True page.
//
// Values are demo values: str (JS string), int (JS integer number or
// BigInt), float, None (null), list (JS array). A JS number stands for the
// Python literal its demo text shows (fromLiteral: '1e+21' is a float).
//
// Signal names: CalledProcessError.__str__ looks up signal.Signals(-code),
// whose members differ per platform. SIGNALS.linux is what Linux CPython
// has (checked in WSL, 3.12); SIGNALS.windows is Windows CPython 3.13. The
// demos use the Linux table (negative exit codes only come from POSIX).

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { fromLiteral } from '../../../../py-num.js';
import { PyException, raise } from '../../../../py-exceptions.js';

// ── Python value helpers ─────────────────────────────────────

// A demo number as a Python number: { int: bigint } | { float: number }.
// fromLiteral raises NameError for inf (the code shows `inf`).
export function num(v) {
  if (typeof v === 'bigint') return { int: v };
  return fromLiteral(v);
}

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return num(v).int !== undefined ? 'int' : 'float';
  if (Array.isArray(v)) return 'list';
  if (v && v.__pyBytes !== undefined) return 'bytes';
  if (v && v.__pyTuple !== undefined) return 'tuple';
  return 'object';
}

// repr() of a demo value
export function repr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'string') return pyStrRepr(v);
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'number') {
    const n = num(v);
    return n.int !== undefined ? String(n.int) : pyFloatRepr(n.float);
  }
  if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
  if (v.__pyBytes !== undefined) return bytesRepr(v.__pyBytes);
  if (v.__pyTuple !== undefined) {
    const items = v.__pyTuple.map(repr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  throw new Error('repr: unsupported value');
}

// str() of a demo value: a str is itself, everything else is its repr
export const str = (v) => (typeof v === 'string' ? v : repr(v));

// Python truth value of a number / None / str / list
export function truthy(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string' || Array.isArray(v)) return v.length > 0;
  if (typeof v === 'boolean') return v;
  const n = num(v);
  return n.int !== undefined ? n.int !== 0n : n.float !== 0;
}

// '%d' % v — ints as they are, floats truncated (int(v), exact for any
// finite double), anything else is a TypeError.
export function formatD(v) {
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'bigint' || typeof v === 'number') {
    const n = num(v);
    if (n.int !== undefined) return String(n.int);
    return String(BigInt(Math.trunc(n.float)));
  }
  raise('TypeError', `%d format: a real number is required, not ${typeName(v)}`);
}

const isNegative = (v) => {
  if (typeof v === 'boolean' || v === null || typeof v === 'string' || Array.isArray(v)) return false;
  const n = num(v);
  return n.int !== undefined ? n.int < 0n : n.float < 0;
};

// bytes repr: b'...' with CPython's quote choice and escapes
export function bytesRepr(bytes) {
  let hasSingle = false;
  let hasDouble = false;
  for (const b of bytes) {
    if (b === 0x27) hasSingle = true;
    if (b === 0x22) hasDouble = true;
  }
  const q = hasSingle && !hasDouble ? '"' : "'";
  let out = 'b' + q;
  for (const b of bytes) {
    if (b === 0x5c) out += '\\\\';
    else if (b === q.charCodeAt(0)) out += '\\' + q;
    else if (b === 0x09) out += '\\t';
    else if (b === 0x0a) out += '\\n';
    else if (b === 0x0d) out += '\\r';
    else if (b < 0x20 || b >= 0x7f) out += '\\x' + b.toString(16).padStart(2, '0');
    else out += String.fromCharCode(b);
  }
  return out + q;
}

// str.encode() (UTF-8, strict): lone surrogates raise like CPython
export function encodeUtf8(s) {
  const cps = [...s];
  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i].codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      // CPython reports the whole run of consecutive surrogates
      let j = i;
      while (j + 1 < cps.length && cps[j + 1].codePointAt(0) >= 0xd800 && cps[j + 1].codePointAt(0) <= 0xdfff) j += 1;
      const ch = '\\u' + cp.toString(16).padStart(4, '0');
      const where = j === i ? `character '${ch}' in position ${i}` : `characters in position ${i}-${j}`;
      raise('UnicodeEncodeError', `'utf-8' codec can't encode ${where}: surrogates not allowed`);
    }
  }
  return { __pyBytes: [...new TextEncoder().encode(s)] };
}

// ── list2cmdline (Lib/subprocess.py) ─────────────────────────
// MS C runtime rules: quote an argument that contains a space or tab or is
// empty; double the backslashes that precede a double quote (and the ones
// before the closing quote); escape the quote itself as \".
export function list2cmdline(seq) {
  // iterating a str yields its characters — each becomes an argument
  const items = typeof seq === 'string' ? [...seq] : seq;
  if (!Array.isArray(items)) raise('TypeError', `'${typeName(seq)}' object is not iterable`);
  const result = [];
  for (const arg of items) {
    if (typeof arg !== 'string') {
      // os.fsdecode → os.fspath
      raise('TypeError', `expected str, bytes or os.PathLike object, not ${typeName(arg)}`);
    }
    let bs = 0;
    if (result.length > 0) result.push(' ');
    const needquote = arg.includes(' ') || arg.includes('\t') || arg === '';
    if (needquote) result.push('"');
    for (const c of arg) {
      if (c === '\\') {
        bs += 1;
      } else if (c === '"') {
        result.push('\\'.repeat(bs * 2));
        bs = 0;
        result.push('\\"');
      } else {
        if (bs) {
          result.push('\\'.repeat(bs));
          bs = 0;
        }
        result.push(c);
      }
    }
    if (bs) result.push('\\'.repeat(bs));
    if (needquote) {
      result.push('\\'.repeat(bs));
      result.push('"');
    }
  }
  return result.join('');
}

// ── shlex.quote / shlex.join (Lib/shlex.py) ──────────────────
// _find_unsafe = re.compile(r'[^\w@%+=:,./-]', re.ASCII).search
const UNSAFE = /[^A-Za-z0-9_@%+=:,./-]/;
export function shlexQuote(s) {
  if (typeof s === 'string' && s === '') return "''";
  if (typeof s !== 'string') {
    if (!truthy(s)) return "''";
    raise('TypeError', `expected string or bytes-like object, got '${typeName(s)}'`);
  }
  if (!UNSAFE.test(s)) return s;
  return "'" + s.split("'").join("'\"'\"'") + "'";
}
export const shlexJoin = (args) => (typeof args === 'string' ? [...args] : args).map(shlexQuote).join(' ');

// ── Signals ──────────────────────────────────────────────────
const LINUX = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGKILL', 'SIGUSR1',
  'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGALRM', 'SIGTERM', 'SIGSTKFLT', 'SIGCHLD', 'SIGCONT', 'SIGSTOP',
  'SIGTSTP', 'SIGTTIN', 'SIGTTOU', 'SIGURG', 'SIGXCPU', 'SIGXFSZ', 'SIGVTALRM', 'SIGPROF', 'SIGWINCH',
  'SIGIO', 'SIGPWR', 'SIGSYS',
];
export const SIGNALS = {
  linux: new Map([...LINUX.map((n, i) => [i + 1, n]), [34, 'SIGRTMIN'], [64, 'SIGRTMAX']]),
  windows: new Map([
    [0, 'CTRL_C_EVENT'], [1, 'CTRL_BREAK_EVENT'], [2, 'SIGINT'], [4, 'SIGILL'], [8, 'SIGFPE'],
    [11, 'SIGSEGV'], [15, 'SIGTERM'], [21, 'SIGBREAK'], [22, 'SIGABRT'],
  ]),
};

// signal.Signals(value) → the member's repr, or null (ValueError)
function signalRepr(value, platform) {
  const n = num(value);
  let key = null;
  if (n.int !== undefined) {
    if (n.int >= 0n && n.int <= 64n) key = Number(n.int);
  } else if (Number.isInteger(n.float) && n.float >= 0 && n.float <= 64) {
    key = n.float; // 15.0 == 15 finds the member
  }
  const name = key === null ? undefined : SIGNALS[platform].get(key);
  return name ? `<Signals.${name}: ${key}>` : null;
}

const negate = (v) => {
  const n = num(v);
  return n.int !== undefined ? -n.int : { __float: -n.float };
};

// ── Exceptions ───────────────────────────────────────────────

// CalledProcessError.__str__
export function calledProcessErrorStr(returncode, cmd, platform = 'linux') {
  if (truthy(returncode) && isNegative(returncode)) {
    const neg = negate(returncode);
    const negVal = typeof neg === 'bigint' ? neg : neg.__float;
    const sig = signalRepr(negVal, platform);
    if (sig) return `Command '${str(cmd)}' died with ${sig}.`;
    return `Command '${str(cmd)}' died with unknown signal ${formatD(negVal)}.`;
  }
  return `Command '${str(cmd)}' returned non-zero exit status ${formatD(returncode)}.`;
}

export function calledProcessError(returncode, cmd, platform = 'linux') {
  return new PyException('subprocess.CalledProcessError', calledProcessErrorStr(returncode, cmd, platform));
}

// TimeoutExpired.__str__
export const timeoutExpiredStr = (cmd, timeout) => `Command '${str(cmd)}' timed out after ${str(timeout)} seconds`;

export function timeoutExpired(cmd, timeout) {
  return new PyException('subprocess.TimeoutExpired', timeoutExpiredStr(cmd, timeout));
}

// ── CompletedProcess ─────────────────────────────────────────
export function completedProcessRepr(args, returncode, stdout = null, stderr = null) {
  const parts = [`args=${repr(args)}`, `returncode=${repr(returncode)}`];
  if (stdout !== null && stdout !== undefined) parts.push(`stdout=${repr(stdout)}`);
  if (stderr !== null && stderr !== undefined) parts.push(`stderr=${repr(stderr)}`);
  return `CompletedProcess(${parts.join(', ')})`;
}

// CompletedProcess.check_returncode(): raise if returncode is truthy
export function checkReturncode(args, returncode, platform = 'linux') {
  if (truthy(returncode)) throw calledProcessError(returncode, args, platform);
}

// ── Stream routing (PIPE / STDOUT / DEVNULL / None) ──────────
// The demo child is fixed:
//   import sys; print('out', flush=True); print('err', file=sys.stderr)
// run(..., text=True) then returns, per stream, what landed in a pipe.
export const STREAMS = { PIPE: -1, STDOUT: -2, DEVNULL: -3, None: null };

export function lookupStream(name) {
  if (typeof name !== 'string' || !Object.prototype.hasOwnProperty.call(STREAMS, name)) {
    raise('KeyError', repr(name));
  }
  return STREAMS[name];
}

// returns { returncode, stdout, stderr } as run() would, or throws
export function routeStreams(stdoutName, stderrName) {
  const out = lookupStream(stdoutName);
  const err = lookupStream(stderrName);
  // Popen.__init__: `if stdout is STDOUT`
  if (out === STREAMS.STDOUT) raise('ValueError', 'STDOUT can only be used for stderr');
  let stdout = null;
  let stderr = null;
  if (out === STREAMS.PIPE) stdout = err === STREAMS.STDOUT ? 'out\nerr\n' : 'out\n';
  if (err === STREAMS.PIPE) stderr = 'err\n';
  return { returncode: 0, stdout, stderr };
}
