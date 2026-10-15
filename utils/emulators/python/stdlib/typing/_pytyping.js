// utils/emulators/python/stdlib/typing/_pytyping.js
//
// Port of what CPython 3.13 does when a type hint is evaluated at run time
// — shared by the typing hub and its member emulators. Not a content page
// (leading underscore), so the catalog generator never maps it.
//
// Verified against CPython 3.13.3 by differential fuzzing (random hint
// text from a grammar of typing/builtin names, ints, strings, |, [ ], ( ),
// list displays, typos and invalid syntax; plus random 'auto' inputs):
// ~100,000 cases through every demo template, 0 mismatches. Text outside
// the model raises EmulatorLimit instead of a guessed result.
//
// Sources (v3.13.3):
//   Lib/typing.py — _type_convert, _type_check, _type_repr, _tp_cache,
//     _SpecialForm.__getitem__ and every form body (Union, Optional,
//     Literal, Annotated, ClassVar, Final, TypeGuard, TypeIs, Required,
//     NotRequired, ReadOnly, Concatenate, Never, NoReturn, Self,
//     LiteralString, TypeAlias), _SpecialGenericAlias (+ _CallableType,
//     _TupleType), _GenericAlias with _UnionGenericAlias,
//     _LiteralGenericAlias, _AnnotatedAlias, _CallableGenericAlias and
//     _ConcatenateGenericAlias (repr, ==, copy_with, __getitem__ and
//     type-variable substitution), _generic_class_getitem,
//     _collect_type_parameters, ForwardRef, _eval_type, get_type_hints,
//     _strip_annotations, get_origin, get_args.
//   Objects/genericaliasobject.c — types.GenericAlias (list[int]): repr,
//     ==, __parameters__, substitution.
//   Objects/unionobject.c — types.UnionType (int | None): | merging,
//     repr, ==, substitution.
//   Objects/typevarobject.c — TypeVar repr, |, __typing_prepare_subst__.
//   Objects/abstract.c — binary | dispatch (left slot, then reflected).
//   Lib/traceback.py + Python/suggestions.c — NameError "Did you mean"
//     (the Levenshtein port is imported from ../math/_pymath.js).
//
// The typing caches are part of the model: _tp_cache keys compare with ==,
// so within one run Optional[Union[str, int]] after Optional[Union[int,
// str]] returns the FIRST object (typing.Union[int, str, NoneType]) and
// Optional[True] after Optional[1] shows typing.Optional[1]. Each emulator
// call is a fresh interpreter, i.e. a script run from the top.
//
// The hint text is read by a recognizer for Python's expression grammar
// restricted to names, decimal ints, plain / r / u / b strings, ...,
// [ ] ( ) , | - and attribute / call syntax. Text it can prove is not an
// expression raises the SyntaxError ForwardRef raises; anything outside
// the model raises EmulatorLimit (never a guessed Python result): other
// operators, floats, escapes, keywords, attribute access, calls, list
// displays outside Callable[[...], R], Unpack, and names whose value
// would print with a memory address (functions such as cast).

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr, pyFloatRepr, pyReprExact } from '../../../../demo-coerce.js';
import { suggest } from '../math/_pymath.js';

export const limit = (msg) => { throw new PyException('EmulatorLimit', msg); };
const raise = (type, msg) => { throw new PyException(type, msg); };
const typeError = (msg) => raise('TypeError', msg);

// ── Values ───────────────────────────────────────────────────

export class PyInt { constructor(v) { this.v = BigInt(v); } }
export class PyBool { constructor(v) { this.v = v; } }
export const TRUE = new PyBool(true);
export const FALSE = new PyBool(false);
export class PyStr { constructor(v) { this.v = v; } }
export class PyBytes { constructor(v) { this.v = v; } }
export class PyTuple { constructor(items) { this.items = items; } }
export class PyList { constructor(items) { this.items = items; } }
class Singleton { constructor(kind) { this.kind = kind; } }
export const NONE = new Singleton('None');
export const ELLIPSIS = new Singleton('Ellipsis');
export const NODEFAULT = new Singleton('NoDefault');

// A class object. meta: name of its metaclass; tpName: what
// "type '...' is not subscriptable" prints; getitem: 'ga' (builtin
// __class_getitem__ → types.GenericAlias), 'generic' (Generic subclass →
// _generic_class_getitem) or null; params: __parameters__ of a Generic.
export class PyClass {
  constructor(name, { module = 'builtins', qualname = name, meta = 'type', tpName = null, getitem = null, params = [], reprStr = null } = {}) {
    this.name = name;
    this.module = module;
    this.qualname = qualname;
    this.meta = meta;
    this.tpName = tpName || name;
    this.getitem = getitem;
    this.params = params;
    this.reprStr = reprStr;
  }
}
// typing._SpecialForm (typed: _TypedCacheSpecialForm — Literal, Annotated)
export class SpecialForm { constructor(name, typed = false) { this.name = name; this.typed = typed; } }
// typing._SpecialGenericAlias (flavor: 'plain' | 'callable' | 'tuple' | 'deprecated')
export class SGA {
  constructor(name, origin, nparams, { inst = true, defaults = [], flavor = 'plain' } = {}) {
    this.name = name;
    this.origin = origin;
    this.nparams = nparams;
    this.inst = inst;
    this.defaults = defaults;
    this.flavor = flavor;
  }
}
// typing._GenericAlias; kind: 'generic' | 'union' | 'literal' | 'annotated'
// | 'callable' | 'concatenate'. For 'annotated', args is [origin].
export class TGA {
  constructor(kind, origin, args, { name = null, inst = true, metadata = null } = {}) {
    this.kind = kind;
    this.origin = origin;
    this.args = args;
    this.name = name;
    this.inst = inst;
    this.metadata = metadata;
    this.params = collectTypeParameters(args);
  }
}
// types.GenericAlias
export class GA { constructor(origin, args) { this.origin = origin; this.args = args; this.paramsCache = null; } }
// types.UnionType
export class UnionT { constructor(args) { this.args = args; this.paramsCache = null; } }
export class TypeVarObj { constructor(name, prefix = '~') { this.name = name; this.prefix = prefix; } }
// a name whose value the model does not represent
class Opaque { constructor(why) { this.why = why; } }

const isIntLike = (v) => v instanceof PyInt || v instanceof PyBool;
const bigOf = (v) => (v instanceof PyBool ? (v.v ? 1n : 0n) : v.v);

// ── Classes ──────────────────────────────────────────────────

const BUILTIN_CLASS_NAMES = [
  'bool', 'memoryview', 'bytearray', 'bytes', 'classmethod', 'complex', 'dict', 'enumerate', 'filter', 'float',
  'frozenset', 'property', 'int', 'list', 'map', 'object', 'range', 'reversed', 'set', 'slice', 'staticmethod', 'str',
  'super', 'tuple', 'type', 'zip', 'BaseException', 'BaseExceptionGroup', 'Exception', 'GeneratorExit',
  'KeyboardInterrupt', 'SystemExit', 'ArithmeticError', 'AssertionError', 'AttributeError', 'BufferError',
  'EOFError', 'ImportError', 'LookupError', 'MemoryError', 'NameError', 'OSError', 'ReferenceError', 'RuntimeError',
  'StopAsyncIteration', 'StopIteration', 'SyntaxError', 'SystemError', 'TypeError', 'ValueError', 'Warning',
  'FloatingPointError', 'OverflowError', 'ZeroDivisionError', 'BytesWarning', 'DeprecationWarning',
  'EncodingWarning', 'FutureWarning', 'ImportWarning', 'PendingDeprecationWarning', 'ResourceWarning',
  'RuntimeWarning', 'SyntaxWarning', 'UnicodeWarning', 'UserWarning', 'BlockingIOError', 'ChildProcessError',
  'ConnectionError', 'FileExistsError', 'FileNotFoundError', 'InterruptedError', 'IsADirectoryError',
  'NotADirectoryError', 'PermissionError', 'ProcessLookupError', 'TimeoutError', 'IndentationError', 'IndexError',
  'KeyError', 'ModuleNotFoundError', 'NotImplementedError', 'PythonFinalizationError', 'RecursionError',
  'UnboundLocalError', 'UnicodeError', 'BrokenPipeError', 'ConnectionAbortedError', 'ConnectionRefusedError',
  'ConnectionResetError', 'TabError', 'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeTranslateError',
  'ExceptionGroup',
];
// builtin classes with __class_getitem__ (type[...] is special-cased in C)
const SUBSCRIPTABLE = new Set(['dict', 'enumerate', 'frozenset', 'list', 'set', 'tuple', 'type', 'BaseExceptionGroup', 'ExceptionGroup']);
const B = {};
for (const n of BUILTIN_CLASS_NAMES) B[n] = new PyClass(n, { getitem: SUBSCRIPTABLE.has(n) ? 'ga' : null });
export const NoneType = new PyClass('NoneType');
export const UnionType = new PyClass('UnionType', { module: 'types' });
export const BUILTIN_CLASSES = B;

const abc = (n) => new PyClass(n, { module: 'collections.abc' });
const ABC = {};
for (const n of ['Hashable', 'Awaitable', 'Coroutine', 'AsyncIterable', 'AsyncIterator', 'Iterable', 'Iterator',
  'Reversible', 'Sized', 'Container', 'Collection', 'Callable', 'Set', 'MutableSet', 'Mapping', 'MutableMapping',
  'Sequence', 'MutableSequence', 'ByteString', 'MappingView', 'KeysView', 'ItemsView', 'ValuesView', 'Generator',
  'AsyncGenerator']) ABC[n] = abc(n);
const coll = (n) => new PyClass(n, { module: 'collections' });

// ── typing's own objects ─────────────────────────────────────

const sf = (n, typed) => new SpecialForm(n, typed);
export const AnyStr = new TypeVarObj('AnyStr');
const T_ABS = new TypeVarObj('T', ''); // class SupportsAbs[T]: PEP 695 parameter (infer_variance → repr 'T')
const T_ROUND = new TypeVarObj('T', '');
const typingClass = (n, opts = {}) => new PyClass(n, { module: 'typing', tpName: n, ...opts });
const cTypingClass = (n) => new PyClass(n, { module: 'typing', tpName: `typing.${n}` });
const Generic = new PyClass('Generic', { module: 'typing', tpName: 'typing.Generic', getitem: 'generic' });
const Protocol = new PyClass('Protocol', { module: 'typing', meta: '_ProtocolMeta', getitem: 'generic' });
const proto = (n, params = []) => typingClass(n, { meta: '_ProtocolMeta', getitem: 'generic', params });
const boolOrNone = () => new UnionT([B.bool, NoneType]);
const alias = (name, origin, nparams, opts) => new SGA(name, origin, nparams, opts);

const SF = {};
for (const n of ['ClassVar', 'Concatenate', 'Final', 'Optional', 'Union', 'Never', 'NoReturn', 'Self', 'LiteralString',
  'TypeAlias', 'TypeGuard', 'TypeIs', 'Required', 'NotRequired', 'ReadOnly', 'Unpack']) SF[n] = sf(n, false);
SF.Literal = sf('Literal', true);
SF.Annotated = sf('Annotated', true);

const opaque = (what) => new Opaque(what);
const FUNCTIONS = ['assert_type', 'assert_never', 'cast', 'clear_overloads', 'dataclass_transform', 'final', 'get_args',
  'get_origin', 'get_overloads', 'get_protocol_members', 'get_type_hints', 'is_protocol', 'is_typeddict',
  'no_type_check', 'no_type_check_decorator', 'overload', 'override', 'reveal_type', 'runtime_checkable',
  'NamedTuple', 'TypedDict'];

export const TYPING = {
  ...SF,
  Any: typingClass('Any', { meta: '_AnyMeta', reprStr: 'typing.Any' }),
  Callable: alias('Callable', ABC.Callable, 2, { flavor: 'callable' }),
  ForwardRef: typingClass('ForwardRef'),
  Generic,
  ParamSpec: cTypingClass('ParamSpec'),
  Protocol,
  Tuple: alias('Tuple', B.tuple, -1, { inst: false, flavor: 'tuple' }),
  Type: alias('Type', B.type, 1, { inst: false }),
  TypeVar: cTypingClass('TypeVar'),
  TypeVarTuple: cTypingClass('TypeVarTuple'),
  AbstractSet: alias('AbstractSet', ABC.Set, 1),
  ByteString: alias('ByteString', ABC.ByteString, 0, { flavor: 'deprecated' }),
  Container: alias('Container', ABC.Container, 1),
  ContextManager: alias('ContextManager', new PyClass('AbstractContextManager', { module: 'contextlib' }), 2, { defaults: [boolOrNone()] }),
  Hashable: alias('Hashable', ABC.Hashable, 0),
  ItemsView: alias('ItemsView', ABC.ItemsView, 2),
  Iterable: alias('Iterable', ABC.Iterable, 1),
  Iterator: alias('Iterator', ABC.Iterator, 1),
  KeysView: alias('KeysView', ABC.KeysView, 1),
  Mapping: alias('Mapping', ABC.Mapping, 2),
  MappingView: alias('MappingView', ABC.MappingView, 1),
  MutableMapping: alias('MutableMapping', ABC.MutableMapping, 2),
  MutableSequence: alias('MutableSequence', ABC.MutableSequence, 1),
  MutableSet: alias('MutableSet', ABC.MutableSet, 1),
  Sequence: alias('Sequence', ABC.Sequence, 1),
  Sized: alias('Sized', ABC.Sized, 0),
  ValuesView: alias('ValuesView', ABC.ValuesView, 1),
  Awaitable: alias('Awaitable', ABC.Awaitable, 1),
  AsyncIterator: alias('AsyncIterator', ABC.AsyncIterator, 1),
  AsyncIterable: alias('AsyncIterable', ABC.AsyncIterable, 1),
  Coroutine: alias('Coroutine', ABC.Coroutine, 3),
  Collection: alias('Collection', ABC.Collection, 1),
  AsyncGenerator: alias('AsyncGenerator', ABC.AsyncGenerator, 2, { defaults: [NoneType] }),
  AsyncContextManager: alias('AsyncContextManager', new PyClass('AbstractAsyncContextManager', { module: 'contextlib' }), 2, { defaults: [boolOrNone()] }),
  Reversible: alias('Reversible', ABC.Reversible, 1),
  SupportsAbs: proto('SupportsAbs', [T_ABS]),
  SupportsBytes: proto('SupportsBytes'),
  SupportsComplex: proto('SupportsComplex'),
  SupportsFloat: proto('SupportsFloat'),
  SupportsIndex: proto('SupportsIndex'),
  SupportsInt: proto('SupportsInt'),
  SupportsRound: proto('SupportsRound', [T_ROUND]),
  ChainMap: alias('ChainMap', coll('ChainMap'), 2),
  Counter: alias('Counter', coll('Counter'), 1),
  Deque: alias('Deque', coll('deque'), 1),
  Dict: alias('Dict', B.dict, 2, { inst: false }),
  DefaultDict: alias('DefaultDict', coll('defaultdict'), 2),
  List: alias('List', B.list, 1, { inst: false }),
  OrderedDict: alias('OrderedDict', coll('OrderedDict'), 2),
  Set: alias('Set', B.set, 1, { inst: false }),
  FrozenSet: alias('FrozenSet', B.frozenset, 1, { inst: false }),
  Generator: alias('Generator', ABC.Generator, 3, { defaults: [NoneType, NoneType] }),
  BinaryIO: typingClass('BinaryIO', { getitem: 'generic' }),
  IO: typingClass('IO', { getitem: 'generic', params: [AnyStr] }),
  Match: alias('Match', new PyClass('Match', { module: 're' }), 1),
  Pattern: alias('Pattern', new PyClass('Pattern', { module: 're' }), 1),
  TextIO: typingClass('TextIO', { getitem: 'generic' }),
  AnyStr,
  NewType: typingClass('NewType'),
  NoDefault: NODEFAULT,
  ParamSpecArgs: cTypingClass('ParamSpecArgs'),
  ParamSpecKwargs: cTypingClass('ParamSpecKwargs'),
  Text: B.str,
  TYPE_CHECKING: FALSE,
  TypeAliasType: cTypingClass('TypeAliasType'),
};
for (const n of FUNCTIONS) TYPING[n] = opaque(`typing.${n} is a function — its repr contains a memory address`);
const ABC_CALLABLE = ABC.Callable;

// typing.__all__ in source order = the order `from typing import *` binds
export const TYPING_ALL = [
  'Annotated', 'Any', 'Callable', 'ClassVar', 'Concatenate', 'Final', 'ForwardRef', 'Generic', 'Literal', 'Optional',
  'ParamSpec', 'Protocol', 'Tuple', 'Type', 'TypeVar', 'TypeVarTuple', 'Union', 'AbstractSet', 'ByteString',
  'Container', 'ContextManager', 'Hashable', 'ItemsView', 'Iterable', 'Iterator', 'KeysView', 'Mapping',
  'MappingView', 'MutableMapping', 'MutableSequence', 'MutableSet', 'Sequence', 'Sized', 'ValuesView', 'Awaitable',
  'AsyncIterator', 'AsyncIterable', 'Coroutine', 'Collection', 'AsyncGenerator', 'AsyncContextManager', 'Reversible',
  'SupportsAbs', 'SupportsBytes', 'SupportsComplex', 'SupportsFloat', 'SupportsIndex', 'SupportsInt',
  'SupportsRound', 'ChainMap', 'Counter', 'Deque', 'Dict', 'DefaultDict', 'List', 'OrderedDict', 'Set', 'FrozenSet',
  'NamedTuple', 'TypedDict', 'Generator', 'BinaryIO', 'IO', 'Match', 'Pattern', 'TextIO', 'AnyStr', 'assert_type',
  'assert_never', 'cast', 'clear_overloads', 'dataclass_transform', 'final', 'get_args', 'get_origin',
  'get_overloads', 'get_protocol_members', 'get_type_hints', 'is_protocol', 'is_typeddict', 'LiteralString', 'Never',
  'NewType', 'no_type_check', 'no_type_check_decorator', 'NoDefault', 'NoReturn', 'NotRequired', 'overload',
  'override', 'ParamSpecArgs', 'ParamSpecKwargs', 'ReadOnly', 'Required', 'reveal_type', 'runtime_checkable', 'Self',
  'Text', 'TYPE_CHECKING', 'TypeAlias', 'TypeGuard', 'TypeIs', 'TypeAliasType', 'Unpack',
];

// list(builtins.__dict__) of CPython 3.13 on Windows; Linux has the same
// keys in the same order without 'WindowsError'.
export const BUILTIN_KEYS = [
  '__name__', '__doc__', '__package__', '__loader__', '__spec__', '__build_class__', '__import__', 'abs', 'all',
  'any', 'ascii', 'bin', 'breakpoint', 'callable', 'chr', 'compile', 'delattr', 'dir', 'divmod', 'eval', 'exec',
  'format', 'getattr', 'globals', 'hasattr', 'hash', 'hex', 'id', 'input', 'isinstance', 'issubclass', 'iter',
  'aiter', 'len', 'locals', 'max', 'min', 'next', 'anext', 'oct', 'ord', 'pow', 'print', 'repr', 'round', 'setattr',
  'sorted', 'sum', 'vars', 'None', 'Ellipsis', 'NotImplemented', 'False', 'True', 'bool', 'memoryview', 'bytearray',
  'bytes', 'classmethod', 'complex', 'dict', 'enumerate', 'filter', 'float', 'frozenset', 'property', 'int', 'list',
  'map', 'object', 'range', 'reversed', 'set', 'slice', 'staticmethod', 'str', 'super', 'tuple', 'type', 'zip',
  '__debug__', 'BaseException', 'BaseExceptionGroup', 'Exception', 'GeneratorExit', 'KeyboardInterrupt',
  'SystemExit', 'ArithmeticError', 'AssertionError', 'AttributeError', 'BufferError', 'EOFError', 'ImportError',
  'LookupError', 'MemoryError', 'NameError', 'OSError', 'ReferenceError', 'RuntimeError', 'StopAsyncIteration',
  'StopIteration', 'SyntaxError', 'SystemError', 'TypeError', 'ValueError', 'Warning', 'FloatingPointError',
  'OverflowError', 'ZeroDivisionError', 'BytesWarning', 'DeprecationWarning', 'EncodingWarning', 'FutureWarning',
  'ImportWarning', 'PendingDeprecationWarning', 'ResourceWarning', 'RuntimeWarning', 'SyntaxWarning',
  'UnicodeWarning', 'UserWarning', 'BlockingIOError', 'ChildProcessError', 'ConnectionError', 'FileExistsError',
  'FileNotFoundError', 'InterruptedError', 'IsADirectoryError', 'NotADirectoryError', 'PermissionError',
  'ProcessLookupError', 'TimeoutError', 'IndentationError', '_IncompleteInputError', 'IndexError', 'KeyError',
  'ModuleNotFoundError', 'NotImplementedError', 'PythonFinalizationError', 'RecursionError', 'UnboundLocalError',
  'UnicodeError', 'BrokenPipeError', 'ConnectionAbortedError', 'ConnectionRefusedError', 'ConnectionResetError',
  'TabError', 'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeTranslateError', 'ExceptionGroup',
  'EnvironmentError', 'IOError', 'WindowsError', 'open', 'quit', 'exit', 'copyright', 'credits', 'license', 'help',
];
const BUILTIN_KEYS_LINUX = BUILTIN_KEYS.filter((k) => k !== 'WindowsError');
const BUILTINS = new Map();
for (const k of BUILTIN_KEYS) {
  if (B[k]) BUILTINS.set(k, B[k]);
  else if (k === 'EnvironmentError' || k === 'IOError') BUILTINS.set(k, B.OSError);
  else if (k === 'Ellipsis') BUILTINS.set(k, ELLIPSIS);
  else if (k === 'None') BUILTINS.set(k, NONE);
  else if (k === 'True') BUILTINS.set(k, TRUE);
  else if (k === 'False') BUILTINS.set(k, FALSE);
  else if (k === 'WindowsError') BUILTINS.set(k, opaque('WindowsError exists only on Windows'));
  else BUILTINS.set(k, opaque(`${k} is not a class this demo models (its repr is not a type)`));
}

// sys.stdlib_module_names of 3.13 (names without a leading underscore)
const STDLIB = new Set(['abc', 'antigravity', 'argparse', 'array', 'ast', 'asyncio', 'atexit', 'base64', 'bdb',
  'binascii', 'bisect', 'builtins', 'bz2', 'cProfile', 'calendar', 'cmath', 'cmd', 'code', 'codecs', 'codeop',
  'collections', 'colorsys', 'compileall', 'concurrent', 'configparser', 'contextlib', 'contextvars', 'copy',
  'copyreg', 'csv', 'ctypes', 'curses', 'dataclasses', 'datetime', 'dbm', 'decimal', 'difflib', 'dis', 'doctest',
  'email', 'encodings', 'ensurepip', 'enum', 'errno', 'faulthandler', 'fcntl', 'filecmp', 'fileinput', 'fnmatch',
  'fractions', 'ftplib', 'functools', 'gc', 'genericpath', 'getopt', 'getpass', 'gettext', 'glob', 'graphlib', 'grp',
  'gzip', 'hashlib', 'heapq', 'hmac', 'html', 'http', 'idlelib', 'imaplib', 'importlib', 'inspect', 'io', 'ipaddress',
  'itertools', 'json', 'keyword', 'linecache', 'locale', 'logging', 'lzma', 'mailbox', 'marshal', 'math', 'mimetypes',
  'mmap', 'modulefinder', 'msvcrt', 'multiprocessing', 'netrc', 'nt', 'ntpath', 'nturl2path', 'numbers', 'opcode',
  'operator', 'optparse', 'os', 'pathlib', 'pdb', 'pickle', 'pickletools', 'pkgutil', 'platform', 'plistlib', 'poplib',
  'posix', 'posixpath', 'pprint', 'profile', 'pstats', 'pty', 'pwd', 'py_compile', 'pyclbr', 'pydoc', 'pydoc_data',
  'pyexpat', 'queue', 'quopri', 'random', 're', 'readline', 'reprlib', 'resource', 'rlcompleter', 'runpy', 'sched',
  'secrets', 'select', 'selectors', 'shelve', 'shlex', 'shutil', 'signal', 'site', 'smtplib', 'socket',
  'socketserver', 'sqlite3', 'sre_compile', 'sre_constants', 'sre_parse', 'ssl', 'stat', 'statistics', 'string',
  'stringprep', 'struct', 'subprocess', 'symtable', 'sys', 'sysconfig', 'syslog', 'tabnanny', 'tarfile', 'tempfile',
  'termios', 'textwrap', 'this', 'threading', 'time', 'timeit', 'tkinter', 'token', 'tokenize', 'tomllib', 'trace',
  'traceback', 'tracemalloc', 'tty', 'turtle', 'turtledemo', 'types', 'typing', 'unicodedata', 'unittest', 'urllib',
  'uuid', 'venv', 'warnings', 'wave', 'weakref', 'webbrowser', 'winreg', 'winsound', 'wsgiref', 'xml', 'xmlrpc',
  'zipapp', 'zipfile', 'zipimport', 'zlib', 'zoneinfo']);

// ── repr ─────────────────────────────────────────────────────

function bytesRepr(s) {
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = '';
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (ch === q) out += '\\' + q;
    else if (c < 0x20 || c >= 0x7f) out += '\\x' + c.toString(16).padStart(2, '0');
    else out += ch;
  }
  return 'b' + q + out + q;
}
const classPath = (c) => (c.module === 'builtins' ? c.qualname : `${c.module}.${c.qualname}`);

export function repr(v) {
  if (v instanceof PyInt) return v.v.toString();
  if (v instanceof PyBool) return v.v ? 'True' : 'False';
  if (v instanceof PyStr) return pyStrRepr(v.v);
  if (v instanceof PyBytes) return bytesRepr(v.v);
  if (v === NONE) return 'None';
  if (v === ELLIPSIS) return 'Ellipsis';
  if (v === NODEFAULT) return 'typing.NoDefault';
  if (v instanceof PyTuple) {
    const r = v.items.map(repr);
    return '(' + r.join(', ') + (r.length === 1 ? ',' : '') + ')';
  }
  if (v instanceof PyList) return '[' + v.items.map(repr).join(', ') + ']';
  if (v instanceof PyClass) return v.reprStr || `<class '${classPath(v)}'>`;
  if (v instanceof SpecialForm || v instanceof SGA) return 'typing.' + v.name;
  if (v instanceof TGA) return tgaRepr(v);
  if (v instanceof GA) return gaRepr(v);
  if (v instanceof UnionT) return v.args.map(unionReprItem).join(' | ');
  if (v instanceof FwdRef) return `ForwardRef(${pyStrRepr(v.arg)}${v.module !== null ? `, module=${pyStrRepr(v.module)}` : ''})`;
  if (v instanceof TypeVarObj) return v.prefix + v.name;
  return limit('a value this demo cannot print');
}

// typing._type_repr
function typeRepr(v) {
  if (v instanceof PyClass) return classPath(v);
  if (v === ELLIPSIS) return '...';
  if (v instanceof PyTuple) return '[' + v.items.map(typeRepr).join(', ') + ']';
  return repr(v);
}
const isParamExpr = (a) => a === ELLIPSIS || a instanceof PyTuple || a instanceof PyList || (a instanceof TGA && a.kind === 'concatenate');

function tgaRepr(v) {
  const args = v.args;
  if (v.kind === 'union' && args.length === 2) {
    if (args[0] === NoneType) return `typing.Optional[${typeRepr(args[1])}]`;
    if (args[1] === NoneType) return `typing.Optional[${typeRepr(args[0])}]`;
  }
  if (v.kind === 'callable' && !(args.length === 2 && isParamExpr(args[0]))) {
    return `typing.Callable[[${args.slice(0, -1).map(typeRepr).join(', ')}], ${typeRepr(args[args.length - 1])}]`;
  }
  if (v.kind === 'annotated') return `typing.Annotated[${typeRepr(v.origin)}, ${v.metadata.map(repr).join(', ')}]`;
  const name = v.name ? 'typing.' + v.name : typeRepr(v.origin);
  return `${name}[${args.length ? args.map(typeRepr).join(', ') : '()'}]`;
}

// the __qualname__ / __module__ an object exposes (ga_repr_item / union_repr_item)
function qualModule(p) {
  if (p instanceof PyClass) return [p.qualname, p.module];
  if (p instanceof SGA || p instanceof SpecialForm) return [p.name, 'typing'];
  return null;
}
const hasOriginAndArgs = (p) => p instanceof TGA || p instanceof GA;
function reprItem(p) {
  if (hasOriginAndArgs(p)) return repr(p);
  const qm = qualModule(p);
  if (!qm) return repr(p);
  return qm[1] === 'builtins' ? qm[0] : `${qm[1]}.${qm[0]}`;
}
const gaReprItem = (p) => (p === ELLIPSIS ? '...' : reprItem(p));
const unionReprItem = (p) => (p === NoneType ? 'None' : reprItem(p));
function gaRepr(v) {
  const parts = v.args.map((p) => (p instanceof PyList ? '[' + p.items.map(gaReprItem).join(', ') + ']' : gaReprItem(p)));
  return `${gaReprItem(v.origin)}[${parts.join(', ')}${v.args.length === 0 ? '()' : ''}]`;
}

// Python type name, as messages print it (tp_name)
export function typeName(v) {
  if (v instanceof PyInt) return 'int';
  if (v instanceof PyBool) return 'bool';
  if (v instanceof PyStr) return 'str';
  if (v instanceof PyBytes) return 'bytes';
  if (v instanceof PyTuple) return 'tuple';
  if (v instanceof PyList) return 'list';
  if (v === NONE) return 'NoneType';
  if (v === ELLIPSIS) return 'ellipsis';
  if (v === NODEFAULT) return 'NoDefaultType';
  if (v instanceof PyClass) return v.meta;
  if (v instanceof SpecialForm) return v.typed ? '_TypedCacheSpecialForm' : '_SpecialForm';
  if (v instanceof SGA) return { plain: '_SpecialGenericAlias', callable: '_CallableType', tuple: '_TupleType', deprecated: '_DeprecatedGenericAlias' }[v.flavor];
  if (v instanceof TGA) return { generic: '_GenericAlias', union: '_UnionGenericAlias', literal: '_LiteralGenericAlias', annotated: '_AnnotatedAlias', callable: '_CallableGenericAlias', concatenate: '_ConcatenateGenericAlias' }[v.kind];
  if (v instanceof GA) return 'types.GenericAlias';
  if (v instanceof UnionT) return 'types.UnionType';
  if (v instanceof TypeVarObj) return 'typing.TypeVar';
  if (v instanceof FwdRef) return 'ForwardRef';
  return 'object';
}
// identity of type(v) (typed caches, Literal's (value, type) pairs)
const typeToken = (v) => (v instanceof PyClass ? 'meta:' + v.meta : typeName(v));

// ── == and hashing ───────────────────────────────────────────

const NI = Symbol('NotImplemented');
const seqEq = (xs, ys) => xs.length === ys.length && xs.every((x, i) => sameOrEq(x, ys[i]));
// set(xs) == set(ys) for hashable items
function setEq(xs, ys) {
  const a = dedupe(xs);
  const b = dedupe(ys);
  return a.length === b.length && a.every((x) => b.some((y) => sameOrEq(y, x)));
}
function eqImpl(a, b) {
  if (isIntLike(a)) return isIntLike(b) ? bigOf(a) === bigOf(b) : NI;
  if (a instanceof PyStr) return b instanceof PyStr ? a.v === b.v : NI;
  if (a instanceof PyBytes) return b instanceof PyBytes ? a.v === b.v : NI;
  if (a instanceof PyTuple) return b instanceof PyTuple ? seqEq(a.items, b.items) : NI;
  if (a instanceof PyList) return b instanceof PyList ? seqEq(a.items, b.items) : NI;
  if (a instanceof TGA) {
    if (a.kind === 'union') return (b instanceof TGA && b.kind === 'union') || b instanceof UnionT ? setEq(a.args, b.args) : NI;
    if (a.kind === 'literal') {
      if (!(b instanceof TGA && b.kind === 'literal')) return NI;
      const pairs = (xs) => xs.map((x) => new PyTuple([x, typeToken(x)]));
      return setEq(pairs(a.args), pairs(b.args));
    }
    if (a.kind === 'annotated') return b instanceof TGA && b.kind === 'annotated' ? eq(a.origin, b.origin) && seqEq(a.metadata, b.metadata) : NI;
    return b instanceof TGA ? eq(a.origin, b.origin) && seqEq(a.args, b.args) : NI;
  }
  if (a instanceof GA) return b instanceof GA ? eq(a.origin, b.origin) && seqEq(a.args, b.args) : NI;
  if (a instanceof UnionT) return b instanceof UnionT ? setEq(a.args, b.args) : NI;
  if (a instanceof FwdRef) {
    if (!(b instanceof FwdRef)) return NI;
    if (a.evaluated && b.evaluated) return a.arg === b.arg && eq(a.value, b.value);
    return a.arg === b.arg && a.module === b.module;
  }
  return a === b ? true : NI; // object.__eq__
}
// Python a == b
export function eq(a, b) {
  // (Literal pairs hold a type token string in the second slot)
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  let r = eqImpl(a, b);
  if (r !== NI) return r;
  r = eqImpl(b, a);
  if (r !== NI) return r;
  return a === b;
}
// PyObject_RichCompareBool: identity first
const sameOrEq = (a, b) => a === b || eq(a, b);
const containsEq = (list, x) => list.some((y) => sameOrEq(y, x));
function dedupe(items, same = sameOrEq) {
  const out = [];
  for (const x of items) if (!out.some((y) => same(y, x))) out.push(x);
  return out;
}
function isHashable(v) {
  if (v instanceof PyList) return false;
  if (v instanceof PyTuple) return v.items.every(isHashable);
  if (v instanceof TGA) return v.kind === 'annotated' ? isHashable(v.origin) && v.metadata.every(isHashable) : v.args.every(isHashable);
  if (v instanceof GA) return v.args.every(isHashable);
  if (v instanceof UnionT) return v.args.every(isHashable);
  return true;
}
function containsList(v) {
  if (v instanceof PyList) return true;
  if (v instanceof PyTuple) return v.items.some(containsList);
  return false;
}
const noLists = (v) => {
  if (containsList(v)) limit('a list display [...] is only modeled as the argument list of Callable[[...], R]');
};

// ── __parameters__ ───────────────────────────────────────────

function paramsOf(t) {
  if (t instanceof TGA) return t.params;
  if (t instanceof GA) {
    if (!t.paramsCache) t.paramsCache = makeParameters(t.args);
    return t.paramsCache;
  }
  if (t instanceof UnionT) {
    if (!t.paramsCache) t.paramsCache = makeParameters(t.args);
    return t.paramsCache;
  }
  return [];
}
// _Py_make_parameters (C; identity, no recursion into tuples in 3.13.3)
function makeParameters(args) {
  const out = [];
  for (const t of args) {
    if (t instanceof PyClass) continue;
    if (t instanceof TypeVarObj) { if (!out.includes(t)) out.push(t); continue; }
    for (const x of paramsOf(t)) if (!out.includes(x)) out.push(x);
  }
  return out;
}
// typing._collect_type_parameters
function collectTypeParameters(args) {
  const params = [];
  for (const t of args) {
    if (t instanceof PyClass) continue;
    if (t instanceof PyTuple) {
      for (const x of t.items) for (const c of collectTypeParameters([x])) if (!containsEq(params, c)) params.push(c);
    } else if (t instanceof TypeVarObj) {
      if (!containsEq(params, t)) params.push(t);
    } else {
      for (const x of paramsOf(t)) if (!containsEq(params, x)) params.push(x);
    }
  }
  return params;
}
function aliasParams(alias) {
  if (alias instanceof PyClass) return alias.params;
  return paramsOf(alias);
}

// ── The interpreter: caches, namespaces ──────────────────────

const MAXSIZE = 128; // functools.lru_cache default used by _tp_cache
class Interp {
  constructor(ns) {
    this.caches = new Map();
    this.ns = ns; // { lookup(name), candidates() }
  }
  cached(name, typed, key, compute) {
    if (!key.every(isHashable)) return compute();
    if (!this.caches.has(name)) this.caches.set(name, []);
    const entries = this.caches.get(name);
    for (const e of entries) {
      if (e.key.length === key.length && e.key.every((k, i) => sameOrEq(k, key[i]) && (!typed || typeToken(k) === typeToken(key[i])))) return e.value;
    }
    const value = compute();
    entries.push({ key, value });
    if (entries.length > MAXSIZE) limit('more than 128 distinct subscriptions of one kind (CPython would start evicting its cache)');
    return value;
  }
}

// ── _type_convert / _type_check ──────────────────────────────

function typeConvert(I, arg, module = null, allowSpecialForms = false) {
  if (arg === NONE) return NoneType;
  if (arg instanceof PyStr) return new FwdRef(arg.v, { module, isClass: allowSpecialForms });
  return arg;
}
const trunc100 = (s) => [...s].slice(0, 100).join('');
function typeCheck(I, arg, msg, isArgument = true, module = null, allowSpecialForms = false) {
  const invalid = [Generic, Protocol];
  if (!allowSpecialForms) {
    invalid.push(SF.ClassVar);
    if (isArgument) invalid.push(SF.Final);
  }
  arg = typeConvert(I, arg, module, allowSpecialForms);
  if (arg instanceof TGA && containsEq(invalid, arg.origin)) typeError(`${repr(arg)} is not valid as type argument`);
  if (containsEq([TYPING.Any, SF.LiteralString, SF.NoReturn, SF.Never, SF.Self, SF.TypeAlias], arg)) return arg;
  if (allowSpecialForms && containsEq([SF.ClassVar, SF.Final], arg)) return arg;
  if (arg instanceof SpecialForm || containsEq([Generic, Protocol], arg)) typeError(`Plain ${repr(arg)} is not valid as type argument`);
  if (arg instanceof PyTuple) typeError(`${msg} Got ${trunc100(repr(arg))}.`);
  return arg;
}
const isEmptyTuple = (v) => v instanceof PyTuple && v.items.length === 0;
const asItems = (v) => (v instanceof PyTuple ? v.items.slice() : [v]);

// ── Subscription ─────────────────────────────────────────────

export function getitem(I, target, index) {
  if (target instanceof SGA && target.flavor === 'callable') return callableGetitem(I, target, index);
  if (target instanceof PyClass) {
    noLists(index);
    if (target.getitem === 'ga') return new GA(target, asItems(index));
    if (target.getitem === 'generic') return I.cached('_generic_class_getitem', false, [target, index], () => genericClassGetitem(I, target, index));
    return typeError(`type '${target.tpName}' is not subscriptable`);
  }
  if (target instanceof SpecialForm) {
    noLists(index);
    if (target.typed) {
      const params = asItems(index);
      return I.cached(target.name, true, [target, ...params], () => (target.name === 'Literal' ? literalBody(target, params) : annotatedBody(I, target, params)));
    }
    return I.cached('_SpecialForm.__getitem__', false, [target, index], () => specialBody(I, target, index));
  }
  if (target instanceof SGA) {
    noLists(index);
    if (target.flavor === 'tuple') return I.cached('_TupleType.__getitem__', false, [target, index], () => tupleGetitem(I, target, index));
    return I.cached('_SpecialGenericAlias.__getitem__', false, [target, index], () => sgaGetitem(I, target, index));
  }
  if (target instanceof TGA) {
    noLists(index);
    return I.cached('_GenericAlias.__getitem__', false, [target, index], () => tgaGetitem(I, target, index));
  }
  if (target instanceof GA) { noLists(index); return gaGetitem(I, target, index); }
  if (target instanceof UnionT) { noLists(index); return unionGetitem(I, target, index); }
  if (target instanceof TypeVarObj || target === NONE || target === ELLIPSIS || target === NODEFAULT || isIntLike(target)) {
    return typeError(`'${typeName(target)}' object is not subscriptable`);
  }
  return limit(`indexing a ${typeName(target)} value is outside this demo`);
}

function specialBody(I, self, parameters) {
  const name = self.name;
  if (name === 'Union') {
    if (isEmptyTuple(parameters)) typeError('Cannot take a Union of no types.');
    let params = asItems(parameters).map((p) => typeCheck(I, p, 'Union[arg, ...]: each arg must be a type.'));
    params = removeDupsFlatten(params);
    if (params.length === 1) return params[0];
    if (params.length === 2 && containsEq(params, NoneType)) return new TGA('union', self, params, { name: 'Optional' });
    return new TGA('union', self, params);
  }
  if (name === 'Optional') {
    const arg = typeCheck(I, parameters, `${repr(self)} requires a single type.`);
    return getitem(I, SF.Union, new PyTuple([arg, NoneType]));
  }
  if (name === 'ClassVar' || name === 'Final') {
    return new TGA('generic', self, [typeCheck(I, parameters, `${repr(self)} accepts only single type.`, true, null, true)]);
  }
  if (name === 'TypeGuard' || name === 'TypeIs') {
    return new TGA('generic', self, [typeCheck(I, parameters, `${repr(self)} accepts only single type.`)]);
  }
  if (name === 'Required' || name === 'NotRequired' || name === 'ReadOnly') {
    return new TGA('generic', self, [typeCheck(I, parameters, `${name} accepts only a single type.`)]);
  }
  if (['Never', 'NoReturn', 'Self', 'LiteralString', 'TypeAlias'].includes(name)) return typeError(`${repr(self)} is not subscriptable`);
  if (name === 'Concatenate') {
    if (isEmptyTuple(parameters)) typeError('Cannot take a Concatenate of no types.');
    const ps = asItems(parameters);
    const last = ps[ps.length - 1];
    if (last !== ELLIPSIS) typeError('The last parameter to Concatenate should be a ParamSpec variable or ellipsis.');
    const msg = 'Concatenate[arg, ...]: each arg must be a type.';
    return new TGA('concatenate', self, [...ps.slice(0, -1).map((p) => typeCheck(I, p, msg)), last]);
  }
  return limit(`${repr(self)}[...] is outside this demo`); // Unpack
}

// _remove_dups_flatten
function removeDupsFlatten(parameters) {
  const params = [];
  for (const p of parameters) {
    if ((p instanceof TGA && p.kind === 'union') || p instanceof UnionT) params.push(...p.args);
    else params.push(p);
  }
  return dedupe(params);
}

function literalBody(self, params) {
  const flat = [];
  for (const p of params) {
    if (p instanceof TGA && p.kind === 'literal') flat.push(...p.args);
    else flat.push(p);
  }
  // _deduplicate over (value, type(value)) pairs; unhashable → unchanged
  const out = flat.every(isHashable) ? dedupe(flat, (a, b) => sameOrEq(a, b) && typeToken(a) === typeToken(b)) : flat;
  return new TGA('literal', self, out);
}

function newAnnotated(origin, metadata) {
  if (origin instanceof TGA && origin.kind === 'annotated') {
    metadata = origin.metadata.concat(metadata);
    origin = origin.origin;
  }
  return new TGA('annotated', origin, [origin], { name: 'Annotated', metadata });
}
function annotatedBody(I, self, params) {
  if (params.length < 2) typeError('Annotated[...] should be used with at least two arguments (a type and an annotation).');
  const origin = typeCheck(I, params[0], 'Annotated[t, ...]: t must be a type.', true, null, true);
  return newAnnotated(origin, params.slice(1));
}

function sgaGetitem(I, self, index) {
  let params = asItems(index).map((p) => typeCheck(I, p, 'Parameters to generic types must be types.'));
  const { nparams, defaults } = self;
  if (defaults.length && params.length < nparams && params.length + defaults.length >= nparams) {
    params = [...params, ...defaults.slice(params.length - nparams)];
  }
  const actual = params.length;
  if (actual !== nparams) {
    const expected = defaults.length ? `at least ${nparams - defaults.length}` : String(nparams);
    if (!nparams) typeError(`${repr(self)} is not a generic class`);
    typeError(`Too ${actual > nparams ? 'many' : 'few'} arguments for ${repr(self)}; actual ${actual}, expected ${expected}`);
  }
  return new TGA('generic', self.origin, params, { name: self.name, inst: self.inst });
}

function tupleGetitem(I, self, index) {
  const params = asItems(index);
  if (params.length >= 2 && params[params.length - 1] === ELLIPSIS) {
    const ps = params.slice(0, -1).map((p) => typeCheck(I, p, 'Tuple[t, ...]: t must be a type.'));
    return new TGA('generic', self.origin, [...ps, ELLIPSIS], { name: self.name, inst: self.inst });
  }
  return new TGA('generic', self.origin, params.map((p) => typeCheck(I, p, 'Tuple[t0, t1, ...]: each t must be a type.')), { name: self.name, inst: self.inst });
}

function callableGetitem(I, self, index) {
  if (!(index instanceof PyTuple) || index.items.length !== 2) typeError('Callable must be used as Callable[[arg, ...], result].');
  let [args, result] = index.items;
  if (args instanceof PyList) {
    args = new PyTuple(args.items);
    noLists(args);
  } else noLists(args);
  noLists(result);
  const params = new PyTuple([args, result]);
  return I.cached('_CallableType.__getitem_inner__', false, [self, params], () => {
    const res = typeCheck(I, result, 'Callable[args, result]: result must be a type.');
    if (args === ELLIPSIS) return new TGA('callable', self.origin, [ELLIPSIS, res], { name: 'Callable', inst: self.inst });
    const a = asItems(args).map((x) => typeConvert(I, x));
    return new TGA('callable', self.origin, [...a, res], { name: 'Callable', inst: self.inst });
  });
}

function genericClassGetitem(I, cls, index) {
  let args = asItems(index).map((p) => typeConvert(I, p));
  if (cls === Generic || cls === Protocol) {
    if (!args.length) typeError(`Parameter list to ${cls.qualname}[...] cannot be empty`);
    if (!args.every((a) => a instanceof TypeVarObj)) typeError(`Parameters to ${cls.name}[...] must all be type variables or parameter specification variables.`);
    if (dedupe(args).length !== args.length) typeError(`Parameters to ${cls.name}[...] must all be unique`);
  } else {
    for (const p of cls.params) args = typevarPrepare(p, cls, args);
    // _check_generic_specialization
    const expected = cls.params.length;
    if (!expected) typeError(`${repr(cls)} is not a generic class`);
    const actual = args.length;
    if (actual !== expected) {
      const expectVal = actual < expected ? `at least ${expected}` : String(expected);
      typeError(`Too ${actual > expected ? 'many' : 'few'} arguments for ${repr(cls)}; actual ${actual}, expected ${expectVal}`);
    }
  }
  return new TGA('generic', cls, args);
}

// TypeVar.__typing_prepare_subst__ (no defaults in this model)
function typevarPrepare(tv, alias, args) {
  const params = aliasParams(alias);
  const i = params.findIndex((p) => sameOrEq(p, tv));
  if (i < args.length) return args;
  return typeError(`Too few arguments for ${repr(alias)}; actual ${args.length}, expected at least ${i + 1}`);
}
// TypeVar.__typing_subst__ → typing._typevar_subst
const typevarSubst = (I, arg) => typeCheck(I, arg, 'Parameters to generic types must be types.', true);

function tgaGetitem(I, self, index) {
  if (containsEq([Generic, Protocol], self.origin)) typeError(`Cannot subscript already-subscripted ${repr(self)}`);
  if (!self.params.length) typeError(`${repr(self)} is not a generic class`);
  let args = asItems(index).map((p) => typeConvert(I, p));
  for (const p of self.params) args = typevarPrepare(p, self, args);
  const alen = args.length;
  const plen = self.params.length;
  if (alen !== plen) typeError(`Too ${alen > plen ? 'many' : 'few'} arguments for ${repr(self)}; actual ${alen}, expected ${plen}`);
  const map = new Map(self.params.map((p, i) => [p, args[i]]));
  return copyWith(I, self, makeSubstitution(I, self, self.args, map));
}

function makeSubstitution(I, self, args, map) {
  const out = [];
  for (const old of args) {
    if (old instanceof PyClass) { out.push(old); continue; }
    let nu;
    if (old instanceof TypeVarObj) nu = typevarSubst(I, map.get(old));
    else {
      const sub = paramsOf(old);
      nu = sub.length ? getitem(I, old, new PyTuple(sub.map((x) => map.get(x)))) : old;
    }
    if (eq(self.origin, ABC_CALLABLE) && nu instanceof PyTuple) out.push(...nu.items);
    else if (old instanceof PyTuple) out.push(new PyTuple(makeSubstitution(I, self, old.items, map)));
    else out.push(nu);
  }
  return out;
}

export function copyWith(I, t, args) {
  if (t.kind === 'union') return getitem(I, SF.Union, new PyTuple(args));
  if (t.kind === 'annotated') return newAnnotated(args[0], t.metadata);
  if (t.kind === 'concatenate') {
    const last = args[args.length - 1];
    if (last instanceof PyTuple || last instanceof PyList) return new PyTuple([...args.slice(0, -1), ...last.items]);
    if (last instanceof TGA && last.kind === 'concatenate') args = [...args.slice(0, -1), ...last.args];
  }
  return new TGA(t.kind, t.origin, args, { name: t.name, inst: t.inst });
}

// _Py_subs_parameters (GenericAlias and UnionType)
function subsParameters(I, self, args, params, item) {
  if (!params.length) typeError(`${repr(self)} is not a generic class`);
  let items = asItems(item);
  for (const p of params) items = typevarPrepare(p, self, items);
  if (items.length !== params.length) typeError(`Too ${items.length > params.length ? 'many' : 'few'} arguments for ${repr(self)}; actual ${items.length}, expected ${params.length}`);
  return args.map((arg) => {
    if (arg instanceof PyClass) return arg;
    if (arg instanceof TypeVarObj) return typevarSubst(I, items[params.indexOf(arg)]);
    const sub = paramsOf(arg);
    if (!sub.length) return arg;
    return getitem(I, arg, new PyTuple(sub.map((x) => { const i = params.indexOf(x); return i >= 0 ? items[i] : x; })));
  });
}
function gaGetitem(I, ga, item) {
  return new GA(ga.origin, subsParameters(I, ga, ga.args, paramsOf(ga), item));
}
function unionGetitem(I, u, item) {
  const newargs = subsParameters(I, u, u.args, paramsOf(u), item);
  let res = newargs[0];
  for (let i = 1; i < newargs.length; i++) res = binaryOr(I, res, newargs[i]);
  return res;
}

// ── | ──────────────────────────────────────────────────────

const hasTypingOr = (v) => v instanceof SpecialForm || v instanceof SGA || v instanceof TGA || v instanceof TypeVarObj || v instanceof FwdRef;
const isUnionable = (v) => v === NONE || v instanceof PyClass || v instanceof GA || v instanceof UnionT;
// _Py_union_type_or
function unionTypeOr(self, other) {
  if (!isUnionable(self) || !isUnionable(other)) return NI;
  if (self === NONE) self = NoneType;
  if (other === NONE) other = NoneType;
  const items1 = self instanceof UnionT ? self.args : [self];
  const items2 = other instanceof UnionT ? other.args : [other];
  const isSame = (l, r) => (l instanceof GA && r instanceof GA ? eq(l, r) : l === r);
  let tuple = null;
  for (const arg of items2) {
    if (items1.some((x) => isSame(x, arg))) continue;
    if (tuple === null) tuple = items1.slice();
    tuple.push(arg);
  }
  return tuple === null ? self : new UnionT(tuple);
}
export function binaryOr(I, l, r) {
  noLists(l);
  noLists(r);
  if (isIntLike(l) && isIntLike(r)) {
    const v = bigOf(l) | bigOf(r);
    return l instanceof PyBool && r instanceof PyBool ? (v ? TRUE : FALSE) : new PyInt(v);
  }
  if (hasTypingOr(l)) return getitem(I, SF.Union, new PyTuple([l, r]));
  if (l instanceof PyClass || l instanceof GA || l instanceof UnionT) {
    const res = unionTypeOr(l, r);
    if (res !== NI) return res;
  }
  if (hasTypingOr(r)) return getitem(I, SF.Union, new PyTuple([l, r]));
  if (r instanceof PyClass || r instanceof GA || r instanceof UnionT) {
    const res = unionTypeOr(l, r);
    if (res !== NI) return res;
  }
  return typeError(`unsupported operand type(s) for |: '${typeName(l)}' and '${typeName(r)}'`);
}

// ── Parser: Python expression grammar on a token subset ─────

class SyntaxFail extends Error {}
const KEYWORDS = new Set(['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif',
  'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or',
  'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
const MAX_DEPTH = 60;

function tokenize(src) {
  for (const ch of src) {
    const cp = ch.codePointAt(0);
    if ((cp < 0x20 && ch !== '\t') || (cp >= 0xd800 && cp <= 0xdfff)) limit('control characters and lone surrogates are outside this demo');
  }
  if (src === '' || src[0] === ' ' || src[0] === '\t') throw new SyntaxFail(); // empty / "unexpected indent"
  const toks = [];
  let i = 0;
  const n = src.length;
  const readString = (q, kind) => {
    if (src.startsWith(q + q + q, i)) limit('triple-quoted strings are outside this demo');
    let j = i + 1;
    while (j < n && src[j] !== q) {
      if (src[j] === '\\') limit('backslash escapes are outside this demo');
      j++;
    }
    if (j >= n) throw new SyntaxFail(); // unterminated string literal
    const body = src.slice(i + 1, j);
    if (kind === 'bytes' && /[^\x20-\x7e]/.test(body)) limit('bytes literals with non-printable or non-ASCII characters are outside this demo');
    toks.push({ t: 'STR', v: body, bytes: kind === 'bytes' });
    i = j + 1;
  };
  while (i < n) {
    const c = src[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      if (j < n && src.charCodeAt(j) > 0x7f) limit('non-ASCII names are outside this demo');
      const word = src.slice(i, j);
      if (j < n && (src[j] === "'" || src[j] === '"')) {
        const p = word.toLowerCase();
        if (p === 'r' || p === 'u') { i = j; readString(src[j], 'str'); continue; }
        if (p === 'b' || p === 'br' || p === 'rb') { i = j; readString(src[j], 'bytes'); continue; }
        if (p === 'f' || p === 'fr' || p === 'rf') limit('f-strings are outside this demo');
      }
      if (KEYWORDS.has(word)) limit(`the keyword '${word}' is outside this demo`);
      toks.push({ t: 'NAME', v: word });
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < n && /[0-9A-Za-z_.]/.test(src[j])) j++;
      const num = src.slice(i, j);
      if (!/^(0|[1-9][0-9]*)$/.test(num)) limit(`the number ${num} is outside this demo (only decimal ints are modeled)`);
      toks.push({ t: 'INT', v: num });
      i = j;
      continue;
    }
    if (c === "'" || c === '"') { readString(c, 'str'); continue; }
    if (c === '.') {
      if (src.startsWith('...', i)) { toks.push({ t: 'OP', v: '...' }); i += 3; continue; }
      if (i + 1 < n && /[0-9]/.test(src[i + 1])) limit('float literals are outside this demo');
      toks.push({ t: 'OP', v: '.' });
      i++;
      continue;
    }
    if ('[](),|-'.includes(c)) { toks.push({ t: 'OP', v: c }); i++; continue; }
    if (c.charCodeAt(0) > 0x7f) limit('non-ASCII characters outside strings are outside this demo');
    limit(`'${c}' is outside this demo (it models names, [ ], ( ), commas, |, unary -, strings and ints)`);
  }
  let depth = 0;
  for (const t of toks) {
    if (t.t === 'OP' && t.v.length === 1 && '(['.includes(t.v)) depth++;
    if (t.t === 'OP' && t.v.length === 1 && ')]'.includes(t.v)) depth--;
    if (depth > MAX_DEPTH) limit('brackets nested this deep are outside this demo');
  }
  toks.push({ t: 'EOF' });
  return toks;
}

// recursive descent over: expressions, bitwise_or, sum (-), factor (unary -),
// primary (.name, [...], (...)), atom
export function parseExpression(src) {
  const toks = tokenize(src);
  let k = 0;
  const peek = () => toks[k];
  const isOp = (v) => toks[k].t === 'OP' && toks[k].v === v;
  const expectOp = (v) => { if (!isOp(v)) throw new SyntaxFail(); k++; };
  const startsExpr = () => {
    const t = toks[k];
    return t.t === 'NAME' || t.t === 'INT' || t.t === 'STR' || (t.t === 'OP' && ['(', '[', '-', '...'].includes(t.v));
  };
  // a, b, c [,]  → tuple when a comma appears
  const commaList = (closer) => {
    const first = expr();
    if (!isOp(',')) return first;
    const items = [first];
    while (isOp(',')) {
      k++;
      if (closer !== null ? isOp(closer) : toks[k].t === 'EOF') break;
      items.push(expr());
    }
    return { type: 'tuple', items };
  };
  function expr() {
    let left = sum();
    while (isOp('|')) { k++; left = { type: 'or', left, right: sum() }; }
    return left;
  }
  function sum() {
    let left = factor();
    while (isOp('-')) { k++; left = { type: 'sub', left, right: factor() }; }
    return left;
  }
  function factor() {
    if (isOp('-')) { k++; return { type: 'neg', operand: factor() }; }
    return primary();
  }
  function primary() {
    let node = atom();
    for (;;) {
      if (isOp('.')) {
        k++;
        if (peek().t !== 'NAME') throw new SyntaxFail();
        node = { type: 'attr', value: node, attr: toks[k++].v };
      } else if (isOp('[')) {
        k++;
        if (isOp(']')) throw new SyntaxFail();
        const index = commaList(']');
        expectOp(']');
        node = { type: 'subscript', target: node, index };
      } else if (isOp('(')) {
        k++;
        const args = [];
        while (!isOp(')')) {
          if (!startsExpr()) throw new SyntaxFail();
          args.push(expr());
          if (isOp(',')) k++;
          else if (!isOp(')')) throw new SyntaxFail();
        }
        k++;
        node = { type: 'call', func: node, args };
      } else return node;
    }
  }
  function atom() {
    const t = peek();
    if (t.t === 'NAME') {
      k++;
      if (t.v === 'None') return { type: 'const', value: () => NONE };
      if (t.v === 'True') return { type: 'const', value: () => TRUE };
      if (t.v === 'False') return { type: 'const', value: () => FALSE };
      return { type: 'name', id: t.v };
    }
    if (t.t === 'INT') { k++; return { type: 'const', value: () => new PyInt(t.v) }; }
    if (t.t === 'STR') {
      let s = '';
      const bytes = t.bytes;
      while (peek().t === 'STR') {
        if (peek().bytes !== bytes) throw new SyntaxFail(); // cannot mix bytes and nonbytes literals
        s += toks[k++].v;
      }
      return { type: 'const', value: () => (bytes ? new PyBytes(s) : new PyStr(s)) };
    }
    if (isOp('...')) { k++; return { type: 'const', value: () => ELLIPSIS }; }
    if (isOp('(')) {
      k++;
      if (isOp(')')) { k++; return { type: 'tuple', items: [] }; }
      const inner = commaList(')');
      expectOp(')');
      return inner;
    }
    if (isOp('[')) {
      k++;
      const items = [];
      while (!isOp(']')) {
        if (!startsExpr()) throw new SyntaxFail();
        items.push(expr());
        if (isOp(',')) k++;
        else if (!isOp(']')) throw new SyntaxFail();
      }
      k++;
      return { type: 'list', items };
    }
    throw new SyntaxFail();
  }
  const tree = commaList(null);
  if (peek().t !== 'EOF') throw new SyntaxFail();
  return tree;
}

// ── ForwardRef / evaluation ──────────────────────────────────

export class FwdRef {
  constructor(arg, { isArgument = true, module = null, isClass = false } = {}) {
    if (arg.startsWith('*')) limit('a forward reference starting with * is outside this demo');
    try {
      this.ast = parseExpression(arg);
    } catch (e) {
      if (e instanceof SyntaxFail) raise('SyntaxError', `Forward reference must be an expression -- got ${pyStrRepr(arg)}`);
      throw e;
    }
    this.arg = arg;
    this.evaluated = false;
    this.value = null;
    this.isArgument = isArgument;
    this.isClass = isClass;
    this.module = module;
  }
}

function evalNode(I, node) {
  switch (node.type) {
    case 'name': return I.ns.lookup(node.id);
    case 'const': return node.value();
    case 'tuple': return new PyTuple(node.items.map((x) => evalNode(I, x)));
    case 'list': return new PyList(node.items.map((x) => evalNode(I, x)));
    case 'neg': {
      const v = evalNode(I, node.operand);
      if (isIntLike(v)) return new PyInt(-bigOf(v));
      return limit(`unary minus on a ${typeName(v)} is outside this demo`);
    }
    case 'sub': {
      const l = evalNode(I, node.left);
      const r = evalNode(I, node.right);
      if (isIntLike(l) && isIntLike(r)) return new PyInt(bigOf(l) - bigOf(r));
      return limit('subtraction of anything but ints is outside this demo');
    }
    case 'or': {
      const l = evalNode(I, node.left);
      const r = evalNode(I, node.right);
      return binaryOr(I, l, r);
    }
    case 'subscript': {
      const t = evalNode(I, node.target);
      const i = evalNode(I, node.index);
      return getitem(I, t, i);
    }
    case 'attr':
      evalNode(I, node.value);
      return limit(`attribute access (.${node.attr}) is outside this demo`);
    case 'call':
      evalNode(I, node.func);
      node.args.forEach((a) => evalNode(I, a));
      return limit('calls are outside this demo');
    default:
      return limit('unsupported syntax');
  }
}

function forwardEvaluate(I, fr, guard) {
  if (guard.has(fr.arg)) return fr;
  if (!fr.evaluated || I.ns.reevaluate) {
    const value = evalNode(I, fr.ast);
    noLists(value);
    const t = typeCheck(I, value, 'Forward references must evaluate to types.', fr.isArgument, null, fr.isClass);
    fr.value = evalType(I, t, new Set([...guard, fr.arg]));
    fr.evaluated = true;
  }
  return fr.value;
}

// typing._eval_type
export function evalType(I, t, guard = new Set()) {
  if (t instanceof FwdRef) return forwardEvaluate(I, t, guard);
  if (t instanceof TGA || t instanceof GA || t instanceof UnionT) {
    if (t instanceof GA) {
      const args = t.args.map((a) => (a instanceof PyStr ? new FwdRef(a.v) : a));
      t = getitem(I, t.origin, new PyTuple(args));
    }
    const ev = t.args.map((a) => evalType(I, a, guard));
    if (seqEq(ev, t.args)) return t;
    if (t instanceof GA) return new GA(t.origin, ev);
    if (t instanceof UnionT) return ev.reduce((x, y) => binaryOr(I, x, y));
    return copyWith(I, t, ev);
  }
  return t;
}

// typing._strip_annotations
export function stripAnnotations(I, t) {
  if (t instanceof TGA && t.kind === 'annotated') return stripAnnotations(I, t.origin);
  if ((t instanceof TGA || t instanceof SGA || t instanceof GA) && containsEq([SF.Required, SF.NotRequired, SF.ReadOnly], t.origin)) {
    return stripAnnotations(I, t.args[0]);
  }
  if (t instanceof TGA || t instanceof GA || t instanceof UnionT) {
    const stripped = t.args.map((a) => stripAnnotations(I, a));
    if (seqEq(stripped, t.args)) return t;
    if (t instanceof TGA) return copyWith(I, t, stripped);
    if (t instanceof GA) return new GA(t.origin, stripped);
    return stripped.reduce((x, y) => binaryOr(I, x, y));
  }
  return t;
}

export function getOrigin(tp) {
  if (tp instanceof TGA && tp.kind === 'annotated') return SF.Annotated;
  if (tp instanceof TGA || tp instanceof SGA || tp instanceof GA) return tp.origin;
  if (tp === Generic) return Generic;
  if (tp instanceof UnionT) return UnionType;
  return NONE;
}
export function getArgs(tp) {
  if (tp instanceof TGA && tp.kind === 'annotated') return new PyTuple([tp.origin, ...tp.metadata]);
  if (tp instanceof TGA || tp instanceof GA) {
    const res = tp.args;
    const unflatten = tp.origin === ABC_CALLABLE && !(res.length === 2 && isParamExpr(res[0]));
    return unflatten ? new PyTuple([new PyList(res.slice(0, -1)), res[res.length - 1]]) : new PyTuple(res.slice());
  }
  if (tp instanceof UnionT) return new PyTuple(tp.args.slice());
  return new PyTuple([]);
}

// ── Namespaces and NameError ─────────────────────────────────

// keys a __main__ module has before the user's code runs: the audit
// harness exec()s into {'__name__': '__main__'} (+ __builtins__), a real
// script also has these dunders. Suggestions must agree for all of them.
const SCRIPT_HEAD = ['__name__', '__doc__', '__package__', '__loader__', '__spec__', '__annotations__', '__builtins__', '__file__', '__cached__'];
const SCRIPT_HEAD_NOANN = SCRIPT_HEAD.filter((k) => k !== '__annotations__');
const HARNESS_HEAD = ['__name__', '__builtins__'];
// list(vars(cls)) for a class with one annotation and no attributes (3.13)
const CLASS_VARS_KEYS = ['__module__', '__firstlineno__', '__annotations__', '__static_attributes__', '__dict__', '__weakref__', '__doc__'];

function nameErrorMessage(name, variants) {
  // variants: candidate lists (frame f_locals + f_globals + f_builtins)
  const results = new Set(variants.map((d) => (d.length >= 750 ? null : suggest(name, d))));
  if (results.size > 1) limit(`the "Did you mean" hint for '${name}' depends on the platform or on how the script is run`);
  const s = [...results][0];
  // Python/ceval.c: NAME_ERROR_MSG is "name '%.200s' is not defined" — the
  // name is cut to 200 UTF-8 bytes (names reaching here are ASCII, so 200
  // characters); the hints below still use the whole name
  let msg = `name '${name.slice(0, 200)}' is not defined`;
  if (s) msg += `. Did you mean: '${s}'?`;
  if (STDLIB.has(name)) msg += s ? ` Or did you forget to import '${name}'?` : `. Did you forget to import '${name}'?`;
  return msg;
}

// A module namespace: `body` = names bound after the head, in order,
// with their values. classLocals: evaluation happens with a class's
// vars() as locals (get_type_hints(cls, globals())).
export function moduleNamespace(body, { classLocals = false } = {}) {
  const values = new Map(body);
  const bodyKeys = body.map(([k]) => k);
  const localsKeys = (head) => (classLocals ? CLASS_VARS_KEYS : [...head, ...bodyKeys]);
  return {
    reevaluate: classLocals, // localns is not globalns
    lookup(name) {
      if (name.startsWith('_')) limit(`names starting with an underscore are outside this demo ('${name}')`);
      let v;
      if (values.has(name)) v = values.get(name);
      else if (BUILTINS.has(name)) v = BUILTINS.get(name);
      else {
        const variants = [];
        for (const head of [HARNESS_HEAD, SCRIPT_HEAD, SCRIPT_HEAD_NOANN]) {
          const globalsKeys = [...head, ...bodyKeys];
          for (const builtins of [BUILTIN_KEYS, BUILTIN_KEYS_LINUX]) variants.push([...localsKeys(head), ...globalsKeys, ...builtins]);
        }
        raise('NameError', nameErrorMessage(name, variants));
      }
      if (v instanceof Opaque) limit(v.why);
      return v;
    },
  };
}
const typingBody = () => TYPING_ALL.map((n) => [n, TYPING[n]]);

// ── get_type_hints ───────────────────────────────────────────

// from typing import *
// [extra names, e.g. T = TypeVar('T')]
// def f(<name>: '<hint>', ...): ...
// get_type_hints(f, include_extras=...)  →  [[name, value], ...]
export function functionHints(hints, { extra = [], includeExtras = false, fnName = 'f' } = {}) {
  const ns = moduleNamespace([...typingBody(), ...extra, [fnName, opaque('a function')]]);
  const I = new Interp(ns);
  const out = [];
  for (const [name, text] of hints) {
    const fr = new FwdRef(text, { isArgument: true, isClass: false });
    out.push([name, evalType(I, fr)]);
  }
  return { I, hints: includeExtras ? out : out.map(([n, t]) => [n, stripAnnotations(I, t)]) };
}

// from typing import *
// class <clsName>:
//     x: '<hint>'
// get_type_hints(<clsName>, globals(), include_extras=...)['x']
export function classHint(text, { clsName = 'Config', includeExtras = false } = {}) {
  const ns = moduleNamespace([...typingBody(), [clsName, opaque('a class defined in the snippet')]], { classLocals: true });
  const I = new Interp(ns);
  const fr = new FwdRef(text, { isArgument: false, isClass: true });
  const v = evalType(I, fr);
  return { I, hint: includeExtras ? v : stripAnnotations(I, v) };
}

export const TypeVarT = () => new TypeVarObj('T');
export const raw = (v) => ({ __pyRaw: repr(v) });

// ── 'auto' demo inputs: the Python value of the literal the template shows ──

// coerce('auto') gives a JS number or a string; fillSnippet prints a number
// with String() (or inf / -inf), so that text is what Python parses.
// body: the names bound in the snippet before the literal is evaluated
// (for NameError suggestions when the literal is inf).
export function autoValue(arg, body = []) {
  if (typeof arg === 'string') return { kind: 'str', v: arg };
  const lit = pyReprExact(arg);
  if (/^-?\d+$/.test(lit)) return { kind: 'int', v: BigInt(lit) };
  if (lit === 'inf' || lit === '-inf') {
    const ns = moduleNamespace(body.map((k) => [k, opaque('a snippet name')]));
    return ns.lookup('inf'); // raises NameError
  }
  return { kind: 'float', v: Number(lit) };
}
export function autoRepr(val) {
  if (val.kind === 'str') return pyStrRepr(val.v);
  if (val.kind === 'int') return val.v.toString();
  return pyFloatRepr(val.v);
}
// (value, type(value).__name__) for a value passed through unchanged
export const autoPair = (arg, body) => {
  const v = autoValue(arg, body);
  return { __pyRaw: `(${autoRepr(v)}, '${v.kind}')` };
};

// ── Demo templates ───────────────────────────────────────────
// Each function computes one template the content files use, verbatim:
//   evaluate     from typing import *            def f(x: {$hint}): pass
//                get_type_hints(f)['x']
//   extras       ... get_type_hints(f, include_extras=True)['x']
//   originArgs   hint = get_type_hints(f)['x'] / (get_origin(hint), get_args(hint))
//   compare      def f(a: {$a}, b: {$b}): pass / hints = get_type_hints(f)
//                hints['a'] == hints['b']
//   inClass      class Config: / x: {$hint}
//                get_type_hints(Config, globals())['x']
//   typevar      T = TypeVar('T') / def f(x: {$hint}): pass / get_type_hints(f)['x']
export const hintValue = (text, opts) => functionHints([['x', text]], opts).hints[0][1];
const originArgsOf = (v) => raw(new PyTuple([getOrigin(v), getArgs(v)]));
export const demo = {
  evaluate: (text) => raw(hintValue(text)),
  extras: (text) => raw(hintValue(text, { includeExtras: true })),
  originArgs: (text) => originArgsOf(hintValue(text)),
  originArgsExtras: (text) => originArgsOf(hintValue(text, { includeExtras: true })),
  compare: (a, b) => {
    const { hints } = functionHints([['a', a], ['b', b]]);
    return eq(hints[0][1], hints[1][1]);
  },
  inClass: (text) => raw(classHint(text).hint),
  typevar: (text) => raw(hintValue(text, { extra: [['T', new TypeVarObj('T')]] })),
};

// typing.assert_never(arg): repr(arg), cut to 100 characters + '...'
export function assertNever(repr0) {
  const cps = [...repr0];
  const value = cps.length > 100 ? cps.slice(0, 100).join('') + '...' : repr0;
  return raise('AssertionError', `Expected code to be unreachable, but got: ${value}`);
}
