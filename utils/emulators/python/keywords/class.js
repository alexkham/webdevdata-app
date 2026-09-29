// utils/emulators/python/keywords/class.js
//
// Emulator for the class-keyword demo tabs. The lookup tab reimplements
// `attr in vars(...)` over the namespaces the template builds; their key
// sets are what CPython 3.13 puts in them (a class __dict__ holds the body
// names plus __module__, __doc__, __firstlineno__, __static_attributes__,
// and — for a class whose bases are all object — __dict__ and __weakref__).

// a, b = Cart(), Cart(); a.add(item) for each; (a.own, b.own, b.shared)
function classVsInstance(items) {
  return { __pyTuple: [[...items], [], [...items]] };
}

const CLASS_KEYS = ['__module__', '__firstlineno__', '__static_attributes__', '__doc__'];
const NAMESPACES = [
  ['rex', new Set(['name'])],
  ['Dog', new Set([...CLASS_KEYS, 'sound'])],
  ['Animal', new Set([...CLASS_KEYS, 'legs', 'sound', '__dict__', '__weakref__'])],
  ['object', new Set([
    '__new__', '__repr__', '__hash__', '__str__', '__getattribute__', '__setattr__',
    '__delattr__', '__lt__', '__le__', '__eq__', '__ne__', '__gt__', '__ge__',
    '__init__', '__reduce_ex__', '__reduce__', '__getstate__', '__subclasshook__',
    '__init_subclass__', '__format__', '__sizeof__', '__dir__', '__class__', '__doc__',
  ])],
];

function lookup(attr) {
  const trace = [];
  for (const [label, ns] of NAMESPACES) {
    if (ns.has(attr)) {
      trace.push(`${label}: found`);
      return trace;
    }
    trace.push(`${label}: no`);
  }
  trace.push('AttributeError');
  return trace;
}

// vars(Dog(name, 'sit'))
function superInit(name) {
  return { name, trick: 'sit' };
}

export default {
  class: classVsInstance,
  lookup,
  super: superInit,
};
