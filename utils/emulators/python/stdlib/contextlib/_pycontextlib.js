// utils/emulators/python/stdlib/contextlib/_pycontextlib.js
//
// Port of CPython 3.13's Lib/contextlib.py for the contextlib demos —
// shared by the module hub and the member emulators. Not a content page
// (leading underscore), so the catalog generator never maps it.
//
// contextlib works on Python objects (generators, exceptions, the with
// statement), so this file carries the small slice of the Python runtime
// those need, written to follow CPython:
//
//   PyExc             exceptions as objects with identity, args, str(),
//                     __context__ / __cause__ and the built-in hierarchy
//                     (isinstance / issubclass by class name)
//   PyGenerator       a Python generator over a JS generator: next / send /
//                     throw / close with CPython's states, StopIteration on
//                     exhaustion, PEP 479 (StopIteration escaping the frame
//                     becomes RuntimeError) and "generator ignored
//                     GeneratorExit"; async generators the same with their
//                     own messages (anext / athrow / aclose)
//   withStmt          the with statement: __enter__, body, __exit__ with
//                     (type, value, tb) or (None, None, None); a true exit
//                     result suppresses the exception
//
// and then contextlib.py line by line: AbstractContextManager,
// ContextDecorator, _GeneratorContextManager (contextmanager),
// _AsyncGeneratorContextManager (asynccontextmanager), closing, aclosing,
// redirect_stdout / redirect_stderr (with a sys.stdout / sys.stderr model,
// print() and io.StringIO), suppress (exception groups included),
// ExitStack / AsyncExitStack (LIFO callbacks, push, enter_context,
// callback, pop_all, close, exception chaining), nullcontext.
//
// Async: the demos' coroutines never suspend (no sleeps, no I/O), so an
// await is a direct call and asyncio.run(main()) is main() run to the end;
// the event loop cannot change their order. Async generators are JS
// generators driven through the async messages and StopAsyncIteration.
//
// Value model: str → string, int → bigint (or a py-num value turned into
// a printable by toPy), None → null, bool → boolean, list → Array,
// tuple → { __pyTuple }.

import { PyException, excStr } from '../../../../py-exceptions.js';
import { pyReprExact } from '../../../../demo-coerce.js';

// ─── exceptions ──────────────────────────────────────────────────────

// built-in classes the demos can meet: name → base (MRO is a chain here;
// ExceptionGroup's second base BaseExceptionGroup is handled in isSub)
const PARENT = {
  BaseException: null,
  BaseExceptionGroup: 'BaseException',
  GeneratorExit: 'BaseException',
  KeyboardInterrupt: 'BaseException',
  SystemExit: 'BaseException',
  Exception: 'BaseException',
  ArithmeticError: 'Exception',
  FloatingPointError: 'ArithmeticError',
  OverflowError: 'ArithmeticError',
  ZeroDivisionError: 'ArithmeticError',
  AssertionError: 'Exception',
  AttributeError: 'Exception',
  ExceptionGroup: 'Exception',
  LookupError: 'Exception',
  IndexError: 'LookupError',
  KeyError: 'LookupError',
  NameError: 'Exception',
  OSError: 'Exception',
  FileExistsError: 'OSError',
  FileNotFoundError: 'OSError',
  IsADirectoryError: 'OSError',
  NotADirectoryError: 'OSError',
  PermissionError: 'OSError',
  RuntimeError: 'Exception',
  NotImplementedError: 'RuntimeError',
  RecursionError: 'RuntimeError',
  StopAsyncIteration: 'Exception',
  StopIteration: 'Exception',
  TypeError: 'Exception',
  ValueError: 'Exception',
  UnicodeError: 'ValueError',
};

export function isSub(cls, base) {
  if (cls === base) return true;
  if (cls === 'ExceptionGroup' && base === 'BaseExceptionGroup') return true;
  let c = PARENT[cls];
  while (c) {
    if (c === base) return true;
    if (c === 'ExceptionGroup' && base === 'BaseExceptionGroup') return true;
    c = PARENT[c];
  }
  return false;
}
// issubclass(cls, classes) with a class name or a tuple (array) of names
export const isSubAny = (cls, classes) => (Array.isArray(classes) ? classes : [classes]).some((b) => isSub(cls, b));

export class PyExc extends PyException {
  constructor(type, ...args) {
    if (!(type in PARENT)) throw new Error(`emulator: unknown exception class ${type}`);
    super(type, excStr(args, { keyError: type === 'KeyError' }));
    this.type = type;
    this.args = args;
    this.__context__ = null;
    this.__cause__ = null;
    this.__suppress_context__ = false;
  }
  get value() { return this.args.length ? this.args[0] : null; } // StopIteration.value
  get __pyRaw() { return `${this.type}(${this.args.map(pyReprExact).join(', ')})`; }
}
// Any PyException counts as a Python exception — also those raised by the
// shared helpers (py-num's NameError, try.js's ZeroDivisionError …), whose
// class name is their .name. Other JS errors (DemoLimit, bugs) are not.
export const isPyExc = (e) => e instanceof PyException;
export const typeOf = (e) => e.type || e.name;
export const isinstance = (e, classes) => isPyExc(e) && isSubAny(typeOf(e), classes);
export const exc = (type, ...args) => new PyExc(type, ...args);
export const raise = (type, ...args) => { throw new PyExc(type, ...args); };

// raise X from Y
export function raiseFrom(x, cause) {
  x.__cause__ = cause;
  x.__suppress_context__ = true;
  throw x;
}

// Implicit chaining: an exception raised while `handled` is being handled
// gets __context__ = handled (unless that would make a cycle).
export function chainContext(raised, handled) {
  if (!isPyExc(raised) || !handled || raised === handled) return raised;
  if (raised.__context__ === null) {
    let c = handled;
    while (c) {
      if (c === raised) return raised;
      c = c.__context__;
    }
    raised.__context__ = handled;
  }
  return raised;
}

// BaseExceptionGroup / ExceptionGroup (Objects/exceptions.c): str() is
// "msg (N sub-exception[s])"; split() keeps the nesting and derives new
// groups with the same message.
export class PyExcGroup extends PyExc {
  constructor(message, exceptions) {
    const type = exceptions.every((e) => isSub(e.type, 'Exception')) ? 'ExceptionGroup' : 'BaseExceptionGroup';
    super(type, message, exceptions);
    this.egMessage = message; // the group's .message attribute
    this.exceptions = exceptions;
    const n = exceptions.length;
    // str(group) — what the traceback's last line shows after "Name: "
    this.message = `${message} (${n} sub-exception${n > 1 ? 's' : ''})`;
  }
  derive(excs) { return new PyExcGroup(this.egMessage, excs); }
  // returns [match, rest] — each a group or null
  split(classes) {
    if (isSubAny(this.type, classes)) return [this, null];
    const match = [];
    const rest = [];
    for (const e of this.exceptions) {
      if (e instanceof PyExcGroup) {
        const [m, r] = e.split(classes);
        if (m) match.push(m);
        if (r) rest.push(r);
      } else if (isSubAny(e.type, classes)) match.push(e);
      else rest.push(e);
    }
    const mk = (list) => {
      if (list.length === 0) return null;
      const g = this.derive(list);
      g.__cause__ = this.__cause__;
      g.__context__ = this.__context__;
      return g;
    };
    return [mk(match), mk(rest)];
  }
}
export const exceptionGroup = (message, exceptions) => new PyExcGroup(message, exceptions);

// Python truthiness of the values the demos produce
export function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === 0 || v === 0n || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  if (v && v.__pyTuple) return v.__pyTuple.length > 0;
  return true;
}

// ─── generators ──────────────────────────────────────────────────────

// A Python generator (or async generator) driving a JS generator object.
export class PyGenerator {
  constructor(jsGen, { isAsync = false } = {}) {
    this.g = jsGen;
    this.isAsync = isAsync;
    this.state = 'created'; // created | suspended | running | closed
  }
  get _stop() { return this.isAsync ? 'StopAsyncIteration' : 'StopIteration'; }
  _resume(step) {
    if (this.state === 'running') raise('ValueError', `${this.isAsync ? 'anext(): asynchronous generator' : 'generator'} is already running`);
    this.state = 'running';
    let r;
    try {
      r = step();
    } catch (e) {
      this.state = 'closed';
      // PEP 479: StopIteration (and, for async generators,
      // StopAsyncIteration) escaping the frame becomes RuntimeError
      if (isinstance(e, 'StopIteration') || (this.isAsync && isinstance(e, 'StopAsyncIteration'))) {
        const what = this.isAsync ? 'async generator' : 'generator';
        const re = exc('RuntimeError', `${what} raised ${typeOf(e)}`);
        re.__cause__ = e;
        re.__context__ = e;
        throw re;
      }
      throw e;
    }
    if (r.done) {
      this.state = 'closed';
      // a generator's return value travels in StopIteration.value; an
      // async generator cannot return a value
      if (this.isAsync || r.value === undefined || r.value === null) raise(this._stop);
      raise(this._stop, r.value);
    }
    this.state = 'suspended';
    return r.value === undefined ? null : r.value;
  }
  // next(gen) / gen.send(v) — anext(agen) for async generators
  next(v = null) {
    if (this.state === 'closed') raise(this._stop);
    return this._resume(() => this.g.next(v));
  }
  // gen.throw(exc) — agen.athrow(exc)
  throw(e) {
    if (this.state === 'closed') throw e;
    if (this.state === 'created') {
      // nothing ran yet: the exception is raised at the start of the frame
      this.state = 'closed';
      this.g.return();
      throw e;
    }
    return this._resume(() => this.g.throw(e));
  }
  // gen.close() — agen.aclose()
  close() {
    if (this.state === 'created' || this.state === 'closed') {
      this.state = 'closed';
      this.g.return();
      return null;
    }
    try {
      this._resume(() => this.g.throw(exc('GeneratorExit')));
    } catch (e) {
      if (isinstance(e, 'GeneratorExit')) return null;
      // 3.13: close() returns the generator's return value
      if (isinstance(e, this._stop)) return this.isAsync ? null : e.value;
      throw e;
    }
    raise('RuntimeError', `${this.isAsync ? 'async generator' : 'generator'} ignored GeneratorExit`);
  }
}

// An `async def` function: awaiting its call runs the body; a
// StopIteration escaping the body becomes RuntimeError (PEP 479 for
// coroutines — StopAsyncIteration is NOT converted).
export function coroutine(fn) {
  return function asyncDef(...args) {
    try {
      return fn.apply(this, args);
    } catch (e) {
      if (isinstance(e, 'StopIteration')) {
        const re = exc('RuntimeError', 'coroutine raised StopIteration');
        re.__cause__ = e;
        re.__context__ = e;
        throw re;
      }
      throw e;
    }
  };
}

// ─── the with statement ──────────────────────────────────────────────

const typeName = (o) => (o === null || o === undefined ? 'NoneType' : (o.__typename || (typeof o === 'string' ? 'str' : typeof o === 'bigint' ? 'int' : typeof o === 'boolean' ? 'bool' : 'object')));

// with cm as value: body(value)
// Returns { suppressed, value } where value is body's return value.
export function withStmt(cm, body) {
  if (!cm || typeof cm.__enter__ !== 'function') {
    raise('TypeError', `'${typeName(cm)}' object does not support the context manager protocol`);
  }
  if (typeof cm.__exit__ !== 'function') {
    raise('TypeError', `'${typeName(cm)}' object does not support the context manager protocol (missed __exit__ method)`);
  }
  const value = cm.__enter__();
  let result;
  try {
    result = body(value);
  } catch (e) {
    if (!isPyExc(e)) throw e; // emulator limits are not Python exceptions
    let suppress;
    try {
      suppress = cm.__exit__(typeOf(e), e, null);
    } catch (x) {
      throw chainContext(x, e);
    }
    if (!truthy(suppress)) throw e;
    return { suppressed: true, value: undefined };
  }
  cm.__exit__(null, null, null);
  return { suppressed: false, value: result };
}

// async with cm as value: body(value)   (coroutines that never suspend)
export function asyncWithStmt(cm, body) {
  if (!cm || typeof cm.__aenter__ !== 'function') {
    raise('TypeError', `'${typeName(cm)}' object does not support the asynchronous context manager protocol`);
  }
  if (typeof cm.__aexit__ !== 'function') {
    raise('TypeError', `'${typeName(cm)}' object does not support the asynchronous context manager protocol (missed __aexit__ method)`);
  }
  const value = cm.__aenter__();
  let result;
  try {
    result = body(value);
  } catch (e) {
    if (!isPyExc(e)) throw e;
    let suppress;
    try {
      suppress = cm.__aexit__(typeOf(e), e, null);
    } catch (x) {
      throw chainContext(x, e);
    }
    if (!truthy(suppress)) throw e;
    return { suppressed: true, value: undefined };
  }
  cm.__aexit__(null, null, null);
  return { suppressed: false, value: result };
}

// try: body() except <classes> as e: handler(e)
export function tryExcept(body, classes, handler) {
  try {
    return body();
  } catch (e) {
    if (!isinstance(e, classes)) throw e;
    return handler(e);
  }
}

// ─── contextlib.py ───────────────────────────────────────────────────

export class AbstractContextManager {
  get __typename() { return this.constructor.pyName || this.constructor.name; }
  __enter__() { return this; }
}

export class AbstractAsyncContextManager {
  get __typename() { return this.constructor.pyName || this.constructor.name; }
  __aenter__() { return this; }
}

// ContextDecorator.__call__: the decorated function runs inside
// `with self._recreate_cm():`
// (a suppressed exception makes the call return None)
export function contextDecorate(cm, func) {
  return (...args) => withStmt(cm._recreate_cm(), () => func(...args)).value ?? null;
}
// AsyncContextDecorator.__call__: `async def inner` around
// `async with self._recreate_cm(): return await func(...)`
export function asyncContextDecorate(cm, func) {
  return coroutine((...args) => asyncWithStmt(cm._recreate_cm(), () => func(...args)).value ?? null);
}

class GeneratorContextManagerBase {
  constructor(func, args, isAsync) {
    this.gen = new PyGenerator(func(...args), { isAsync });
    this.func = func;
    this.args = args;
  }
  _recreate_cm() {
    return new this.constructor(this.func, this.args);
  }
}

// _GeneratorContextManager — what @contextmanager functions return
export class GeneratorContextManager extends GeneratorContextManagerBase {
  constructor(func, args) { super(func, args, false); }
  get __typename() { return '_GeneratorContextManager'; }
  __enter__() {
    // do not keep args and kwds alive unnecessarily
    delete this.args;
    delete this.func;
    try {
      return this.gen.next();
    } catch (e) {
      if (isinstance(e, 'StopIteration')) raiseFrom(exc('RuntimeError', "generator didn't yield"), null);
      throw e;
    }
  }
  __exit__(typ, value) {
    if (typ === null) {
      try {
        this.gen.next();
      } catch (e) {
        if (isinstance(e, 'StopIteration')) return false;
        throw e;
      }
      try {
        raise('RuntimeError', "generator didn't stop");
      } finally {
        this.gen.close();
      }
    } else {
      if (value === null) value = exc(typ); // force instantiation
      try {
        this.gen.throw(value);
      } catch (e) {
        if (isinstance(e, 'StopIteration')) {
          // Suppress StopIteration *unless* it's the same exception that
          // was passed to throw().
          return e !== value;
        }
        if (isinstance(e, 'RuntimeError')) {
          // Don't re-raise the passed in exception. (issue27122)
          if (e === value) return false;
          // A StopIteration passed to throw() and wrapped into a
          // RuntimeError by PEP 479 is not re-raised either
          if (isinstance(value, 'StopIteration') && e.__cause__ === value) return false;
          throw e;
        }
        if (isPyExc(e)) {
          // only re-raise if it's *not* the exception that was passed
          // to throw()
          if (e !== value) throw e;
          return false;
        }
        throw e;
      }
      try {
        throw chainContext(exc('RuntimeError', "generator didn't stop after throw()"), value);
      } finally {
        this.gen.close();
      }
    }
    return false;
  }
  // ContextDecorator: @cm_function(...) on a function
  call(func) { return contextDecorate(this, func); }
}

// _AsyncGeneratorContextManager — what @asynccontextmanager functions return
export class AsyncGeneratorContextManager extends GeneratorContextManagerBase {
  constructor(func, args) { super(func, args, true); }
  get __typename() { return '_AsyncGeneratorContextManager'; }
  __aenter__() {
    delete this.args;
    delete this.func;
    try {
      return this.gen.next();
    } catch (e) {
      if (isinstance(e, 'StopAsyncIteration')) raiseFrom(exc('RuntimeError', "generator didn't yield"), null);
      throw e;
    }
  }
  __aexit__(typ, value) {
    if (typ === null) {
      try {
        this.gen.next();
      } catch (e) {
        if (isinstance(e, 'StopAsyncIteration')) return false;
        throw e;
      }
      try {
        raise('RuntimeError', "generator didn't stop");
      } finally {
        this.gen.close();
      }
    } else {
      if (value === null) value = exc(typ);
      try {
        this.gen.throw(value);
      } catch (e) {
        if (isinstance(e, 'StopAsyncIteration')) return e !== value;
        if (isinstance(e, 'RuntimeError')) {
          if (e === value) return false;
          if (isinstance(value, ['StopIteration', 'StopAsyncIteration']) && e.__cause__ === value) return false;
          throw e;
        }
        if (isPyExc(e)) {
          if (e !== value) throw e;
          return false;
        }
        throw e;
      }
      try {
        throw chainContext(exc('RuntimeError', "generator didn't stop after athrow()"), value);
      } finally {
        this.gen.close();
      }
    }
    return false;
  }
  call(func) { return asyncContextDecorate(this, func); }
}
// async def __aenter__ / __aexit__
for (const m of ['__aenter__', '__aexit__']) {
  AsyncGeneratorContextManager.prototype[m] = coroutine(AsyncGeneratorContextManager.prototype[m]);
}

// @contextmanager: genFn is a JS generator function standing for the
// decorated Python generator function
export const contextmanager = (genFn) => (...args) => new GeneratorContextManager(genFn, args);
export const asynccontextmanager = (genFn) => (...args) => new AsyncGeneratorContextManager(genFn, args);

export class closing extends AbstractContextManager {
  constructor(thing) {
    super();
    this.thing = thing;
  }
  __enter__() { return this.thing; }
  __exit__() { this.thing.close(); return null; }
}

export class aclosing extends AbstractAsyncContextManager {
  constructor(thing) {
    super();
    this.thing = thing;
  }
  __aenter__() { return this.thing; }
  __aexit__() { this.thing.aclose(); return null; }
}
aclosing.prototype.__aexit__ = coroutine(aclosing.prototype.__aexit__);

// ─── sys.stdout / sys.stderr, print(), io.StringIO ───────────────────

export class StringIO {
  constructor(initial = '') {
    this.buf = initial;
    this.pos = 0;
    this.closed = false;
  }
  get __typename() { return '_io.StringIO'; }
  write(s) {
    if (this.closed) raise('ValueError', 'I/O operation on closed file');
    this.buf = this.buf.slice(0, this.pos) + s + this.buf.slice(this.pos + s.length);
    this.pos += s.length;
    return BigInt([...s].length);
  }
  read() {
    if (this.closed) raise('ValueError', 'I/O operation on closed file');
    const out = this.buf.slice(this.pos);
    this.pos = this.buf.length;
    return out;
  }
  getvalue() {
    if (this.closed) raise('ValueError', 'I/O operation on closed file');
    return this.buf;
  }
  close() { this.closed = true; return null; }
}

// the interpreter's real streams: what the demo box shows as printed output
export function makeSys() {
  const screen = new StringIO();
  return { stdout: screen, stderr: new StringIO(), __screen: screen };
}

// print(*args, sep=' ', end='\n', file=None) for str / preformatted args
export function print(sys, args, { sep = ' ', end = '\n', file = null } = {}) {
  const f = file === null ? sys.stdout : file;
  f.write(args.map((a) => (typeof a === 'string' ? a : String(a))).join(sep) + end);
  return null;
}

class RedirectStream extends AbstractContextManager {
  constructor(sys, newTarget) {
    super();
    this._sys = sys;
    this._new_target = newTarget;
    // a list of old targets makes this CM re-entrant
    this._old_targets = [];
  }
  __enter__() {
    this._old_targets.push(this._sys[this.constructor._stream]);
    this._sys[this.constructor._stream] = this._new_target;
    return this._new_target;
  }
  __exit__() {
    this._sys[this.constructor._stream] = this._old_targets.pop();
    return null;
  }
}
export class redirect_stdout extends RedirectStream {}
redirect_stdout._stream = 'stdout';
export class redirect_stderr extends RedirectStream {}
redirect_stderr._stream = 'stderr';

// what a snippet shows: printed text (trailing newline trimmed), then the
// repr of the final expression — the audit's output rule
export function withScreen(sys, value) {
  const printed = sys.__screen.buf.replace(/\n+$/, '');
  const repr = pyReprExact(value);
  return { __pyRaw: printed ? `${printed}\n${repr}` : repr };
}

// ─── suppress ────────────────────────────────────────────────────────

export class suppress extends AbstractContextManager {
  constructor(...exceptions) {
    super();
    this._exceptions = exceptions; // class names
  }
  __enter__() { return null; }
  __exit__(exctype, excinst) {
    if (exctype === null) return null;
    if (isSubAny(exctype, this._exceptions)) return true;
    if (isSub(exctype, 'BaseExceptionGroup')) {
      const [, rest] = excinst.split(this._exceptions);
      if (rest === null) return true;
      throw rest;
    }
    return false;
  }
}

export class nullcontext extends AbstractContextManager {
  constructor(enterResult = null) {
    super();
    this.enter_result = enterResult;
  }
  __enter__() { return this.enter_result; }
  __exit__() { return null; }
  __aenter__() { return this.enter_result; }
  __aexit__() { return null; }
}

// ─── ExitStack / AsyncExitStack ──────────────────────────────────────

const qualTypeName = (o) => {
  const t = typeName(o);
  if (t.includes('.')) return t;
  if (['int', 'str', 'bool', 'NoneType', 'object'].includes(t)) return `builtins.${t}`;
  if (o && o.constructor && o.constructor.pyModule) return `${o.constructor.pyModule}.${t}`;
  return `__main__.${t}`;
};

class BaseExitStack {
  constructor() {
    this._exit_callbacks = []; // [isSync, callback] — a deque used as a stack
  }
  pop_all() {
    const newStack = new this.constructor();
    newStack._exit_callbacks = this._exit_callbacks;
    this._exit_callbacks = [];
    return newStack;
  }
  push(exit) {
    if (exit && typeof exit.__exit__ === 'function') this._push_cm_exit(exit, exit.__exit__);
    else this._push_exit_callback(exit);
    return exit; // Allow use as a decorator.
  }
  enter_context(cm) {
    if (!cm || typeof cm.__enter__ !== 'function' || typeof cm.__exit__ !== 'function') {
      raise('TypeError', `'${qualTypeName(cm)}' object does not support the context manager protocol`);
    }
    const result = cm.__enter__();
    this._push_cm_exit(cm, cm.__exit__);
    return result;
  }
  callback(callback, ...args) {
    const exitWrapper = () => { callback(...args); return null; };
    this._push_exit_callback(exitWrapper);
    return callback; // Allow use as a decorator
  }
  _push_cm_exit(cm, cmExit) {
    this._push_exit_callback((t, e, tb) => cmExit.call(cm, t, e, tb), true);
  }
  _push_exit_callback(callback, isSync = true) {
    this._exit_callbacks.push([isSync, callback]);
  }
  // the shared body of ExitStack.__exit__ / AsyncExitStack.__aexit__;
  // frameExc is sys.exception() in the frame that called __exit__
  _unwind(excDetails, frameExc) {
    let excv = excDetails[1];
    const receivedExc = excv !== null;
    const fixExceptionContext = (newExc, oldExc) => {
      // Context may not be correct, so find the end of the chain
      for (;;) {
        const excContext = newExc.__context__;
        if (excContext === null || excContext === oldExc) return;
        if (excContext === frameExc) break;
        newExc = excContext;
      }
      // Change the end of the chain to point to the exception
      // we expect it to reference
      newExc.__context__ = oldExc;
    };
    // Callbacks are invoked in LIFO order to match the behaviour of
    // nested context managers
    let suppressedExc = false;
    let pendingRaise = false;
    while (this._exit_callbacks.length) {
      const [, cb] = this._exit_callbacks.pop();
      try {
        const details = excv === null ? [null, null, null] : [typeOf(excv), excv, null];
        let cbResult;
        try {
          cbResult = cb(...details);
        } catch (x) {
          throw chainContext(x, excv);
        }
        if (truthy(cbResult)) {
          suppressedExc = true;
          pendingRaise = false;
          excv = null;
        }
      } catch (newExc) {
        if (!isPyExc(newExc)) throw newExc;
        // simulate the stack of exceptions by setting the context
        fixExceptionContext(newExc, excv);
        pendingRaise = true;
        excv = newExc;
      }
    }
    if (pendingRaise) throw excv;
    return receivedExc && suppressedExc;
  }
}

export class ExitStack extends BaseExitStack {
  get __typename() { return 'ExitStack'; }
  __enter__() { return this; }
  __exit__(type, value, tb, frameExc = value) { return this._unwind([type, value, tb], frameExc); }
  close() { this.__exit__(null, null, null, null); return null; }
}
ExitStack.pyModule = 'contextlib';

export class AsyncExitStack extends BaseExitStack {
  get __typename() { return 'AsyncExitStack'; }
  enter_async_context(cm) {
    if (!cm || typeof cm.__aenter__ !== 'function' || typeof cm.__aexit__ !== 'function') {
      raise('TypeError', `'${qualTypeName(cm)}' object does not support the asynchronous context manager protocol`);
    }
    const result = cm.__aenter__();
    this._push_exit_callback((t, e, tb) => cm.__aexit__(t, e, tb), false);
    return result;
  }
  push_async_exit(exit) {
    if (exit && typeof exit.__aexit__ === 'function') this._push_exit_callback((t, e, tb) => exit.__aexit__(t, e, tb), false);
    else this._push_exit_callback(exit, false);
    return exit;
  }
  push_async_callback(callback, ...args) {
    // async def _exit_wrapper(exc_type, exc, tb): await callback(*args)
    this._push_exit_callback(coroutine(() => { callback(...args); return null; }), false);
    return callback;
  }
  aclose() { this.__aexit__(null, null, null, null); return null; }
  __aenter__() { return this; }
  __aexit__(type, value, tb, frameExc = value) { return this._unwind([type, value, tb], frameExc); }
}
AsyncExitStack.pyModule = 'contextlib';
// the async def methods
for (const m of ['enter_async_context', 'aclose', '__aenter__', '__aexit__']) {
  AsyncExitStack.prototype[m] = coroutine(AsyncExitStack.prototype[m]);
}
