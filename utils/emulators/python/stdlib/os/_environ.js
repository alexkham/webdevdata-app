// utils/emulators/python/stdlib/os/_environ.js
//
// os.environ inside `mock.patch.dict(os.environ, {...}, clear=True)` for
// the os demos: a str → str mapping with os._Environ's checks (Lib/os.py:
// encodekey / encodevalue raise TypeError "str expected, not <type>").
// Keys are case-sensitive, as on Linux and macOS (on Windows os.environ
// upper-cases keys — the demos only use upper-case names, where both agree).

import { PyException } from '../../../../py-exceptions.js';
import { pyReprExact } from '../../../../demo-coerce.js';

export function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (Array.isArray(v)) return 'list';
  return 'object';
}

function checkStr(v) {
  if (typeof v !== 'string') throw new PyException('TypeError', `str expected, not ${pyTypeName(v)}`);
  return v;
}

export function makeEnviron(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    set(k, v) {
      checkStr(k);
      checkStr(v);
      // posix.putenv (Linux): NUL anywhere, '=' in the name, then setenv()
      // itself rejects an empty name with EINVAL
      if (k.includes('\0') || v.includes('\0')) throw new PyException('ValueError', 'embedded null byte');
      if (k.includes('=')) throw new PyException('ValueError', 'illegal environment variable name');
      if (k === '') throw new PyException('OSError', '[Errno 22] Invalid argument');
      data.set(k, v);
    },
    item(k) {
      checkStr(k);
      if (!data.has(k)) throw new PyException('KeyError', pyReprExact(k));
      return data.get(k);
    },
    get(k, dflt = null) {
      checkStr(k);
      return data.has(k) ? data.get(k) : dflt;
    },
    pop(k, ...dflt) {
      checkStr(k);
      if (data.has(k)) {
        const v = data.get(k);
        data.delete(k);
        return v;
      }
      if (dflt.length) return dflt[0];
      throw new PyException('KeyError', pyReprExact(k));
    },
    has(k) {
      return typeof k === 'string' && data.has(k);
    },
  };
}
