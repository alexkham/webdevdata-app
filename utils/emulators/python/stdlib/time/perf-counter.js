// utils/emulators/python/stdlib/time/perf-counter.js
//
// Emulator for the clock-functions demo (perf_counter, monotonic,
// process_time, thread_time and their _ns twins), on _pytime.js. The
// readings themselves are machine-dependent; the demo shows only what is
// fixed: the type a clock returns and that a second reading is never
// smaller than the first.
//
// getattr(time, name) follows Linux (dir(time) of CPython on glibc): a
// missing name raises AttributeError with the traceback's "Did you mean"
// suggestion, a constant is "not callable", a function that needs
// arguments raises its TypeError. Anything whose result depends on the
// real clock (time(), gmtime(), ctime() ...) or whose 3.13 message could
// not be verified on Linux (clock_gettime and friends) is refused.

import * as T from './_pytime.js';
import { suggest } from '../math/_pymath.js';

// sorted(dir(time)) on Linux (CPython 3.12 and 3.13 on glibc)
const LINUX_DIR = [
  'CLOCK_BOOTTIME', 'CLOCK_MONOTONIC', 'CLOCK_MONOTONIC_RAW', 'CLOCK_PROCESS_CPUTIME_ID', 'CLOCK_REALTIME', 'CLOCK_TAI',
  'CLOCK_THREAD_CPUTIME_ID', '_STRUCT_TM_ITEMS', '__doc__', '__loader__', '__name__', '__package__', '__spec__', 'altzone',
  'asctime', 'clock_getres', 'clock_gettime', 'clock_gettime_ns', 'clock_settime', 'clock_settime_ns', 'ctime', 'daylight',
  'get_clock_info', 'gmtime', 'localtime', 'mktime', 'monotonic', 'monotonic_ns', 'perf_counter', 'perf_counter_ns',
  'process_time', 'process_time_ns', 'pthread_getcpuclockid', 'sleep', 'strftime', 'strptime', 'struct_time', 'thread_time',
  'thread_time_ns', 'time', 'time_ns', 'timezone', 'tzname', 'tzset',
];
// attributes every module object has from its type (dir(type(time)) minus dir(time))
const MODULE_TYPE_ATTRS = [
  '__annotations__', '__class__', '__delattr__', '__dict__', '__dir__', '__eq__', '__format__', '__ge__', '__getattribute__',
  '__getstate__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__ne__', '__new__', '__reduce__',
  '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__',
];
// name → type of a value that is not callable
const NOT_CALLABLE = {
  CLOCK_BOOTTIME: 'int', CLOCK_MONOTONIC: 'int', CLOCK_MONOTONIC_RAW: 'int', CLOCK_PROCESS_CPUTIME_ID: 'int',
  CLOCK_REALTIME: 'int', CLOCK_TAI: 'int', CLOCK_THREAD_CPUTIME_ID: 'int', _STRUCT_TM_ITEMS: 'int',
  altzone: 'int', daylight: 'int', timezone: 'int', tzname: 'tuple',
  __doc__: 'str', __name__: 'str', __package__: 'str', __spec__: 'ModuleSpec', __dict__: 'dict',
};
// clock() with no arguments
const CALL_ERRORS = {
  sleep: 'time.sleep() takes exactly one argument (0 given)',
  mktime: 'time.mktime() takes exactly one argument (0 given)',
  get_clock_info: 'get_clock_info() takes exactly 1 argument (0 given)',
  strftime: 'strftime() takes at least 1 argument (0 given)',
  strptime: "_strptime_time() missing 1 required positional argument: 'data_string'",
  struct_time: "structseq() missing required argument 'sequence' (pos 1)",
  __class__: "module() missing required argument 'name' (pos 1)",
};
// a() and b() succeed, then b >= a fails
const UNORDERABLE = { tzset: 'NoneType', __loader__: 'BuiltinImporter' };
const READS_CLOCK = ['time', 'time_ns', 'gmtime', 'localtime', 'asctime', 'ctime'];
const LINUX_ONLY = ['clock_getres', 'clock_gettime', 'clock_gettime_ns', 'clock_settime', 'clock_settime_ns', 'pthread_getcpuclockid'];

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export default {
  // clock = getattr(time, name)
  // a = clock()
  // b = clock()
  // (type(a).__name__, b >= a)
  clock: (name) => {
    if (has(T.CLOCK_FUNCTIONS, name)) return T.asPy(T.tuple(T.CLOCK_FUNCTIONS[name], true));
    if (name === 'time' || name === 'time_ns') {
      return T.limit(`time.${name}() follows the system clock, which can be set back between two calls - b >= a is usually True but not guaranteed`);
    }
    if (READS_CLOCK.includes(name)) return T.limit(`time.${name}() reads the current time, so the result is not fixed`);
    if (LINUX_ONLY.includes(name)) return T.limit(`time.${name} exists only on Unix; its error message for a call without arguments is not emulated`);
    if (has(NOT_CALLABLE, name)) return T.raise('TypeError', `'${NOT_CALLABLE[name]}' object is not callable`);
    if (has(CALL_ERRORS, name)) return T.raise('TypeError', CALL_ERRORS[name]);
    if (has(UNORDERABLE, name)) {
      const t = UNORDERABLE[name];
      return T.raise('TypeError', `'>=' not supported between instances of '${t}' and '${t}'`);
    }
    if (MODULE_TYPE_ATTRS.includes(name)) return T.limit(`time.${name} is an attribute every module object has; calling it is not emulated`);
    // AttributeError, with the suggestion traceback adds (underscore names
    // are only offered for a name that starts with an underscore)
    if (/[\uD800-\uDFFF]/u.test(name)) return T.limit('a name with surrogate characters is not emulated');
    const candidates = name.startsWith('_') ? LINUX_DIR : LINUX_DIR.filter((n) => !n.startsWith('_'));
    const s = suggest(name, candidates);
    return T.raise('AttributeError', `module 'time' has no attribute '${name}'${s ? `. Did you mean: '${s}'?` : ''}`);
  },
};
