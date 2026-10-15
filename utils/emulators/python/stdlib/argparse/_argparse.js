// utils/emulators/python/stdlib/argparse/_argparse.js
//
// A line-by-line port of CPython 3.13's Lib/argparse.py (3.13.3): the
// parser (_parse_known_args and friends, every action class, groups,
// subparsers, intermixed parsing, fromfile arguments), the help/usage
// formatters (HelpFormatter and its four subclasses), Namespace and the
// error machinery — so the live demos print exactly what CPython prints.
// Fuzzed against CPython on generated parsers and command lines.
//
// Python API mapping:
//   ArgumentParser(prog='app')            → new ArgumentParser({ prog: 'app' })
//   p.add_argument('-n', '--count', type=int, default=1)
//                                         → p.add_argument('-n', '--count', { type: INT, default: 1n })
//   p.parse_args(['x'])                   → p.parse_args(['x'])
// Keyword arguments are a trailing plain object; a key that is present
// (even with value null = None) counts as passed, like **kwargs.
// Output goes to sys.stdout / sys.stderr below (StringIO objects the
// emulator swaps in, like contextlib.redirect_stdout); the terminal width
// comes from env.COLUMNS like shutil.get_terminal_size().

import {
  PyException, raise, PyFloat, PyTuple, PyDict, PyRange, PyCallable, SUPPRESS,
  pyRepr, pyStr, pyEq, pyIter, pyContains, pyTypeName, pyPercent, pyIntFromStr, pyFloatFromStr,
  pyStrip, pyLstrip, pySplitlines, textwrapWrap, textwrapFill, plen, cps, StringIO, decimalValue,
} from './_pyvalue.js';
import { files, pyOpen, stdin, bufferOf } from './_pyopen.js';

export { SUPPRESS, files };
export const OPTIONAL = '?';
export const ZERO_OR_MORE = '*';
export const ONE_OR_MORE = '+';
export const PARSER = 'A...';
export const REMAINDER = '...';
const UNRECOGNIZED_ARGS_ATTR = '_unrecognized_args';

// ── process state the module reads: sys.stdin/stdout/stderr, $COLUMNS,
// and the demo folder's files (_pyopen.js: fromfile_prefix_chars, FileType) ──
export const sys = { stdin, stdout: new StringIO(), stderr: new StringIO() };
export const env = { COLUMNS: undefined, terminalColumns: 80 };
export function resetState() {
  sys.stdout = new StringIO();
  sys.stderr = new StringIO();
  env.COLUMNS = undefined;
  files.clear();
}

// shutil.get_terminal_size().columns
function terminalColumns() {
  let columns = 0;
  if (env.COLUMNS !== undefined) {
    try { columns = Number(pyIntFromStr(String(env.COLUMNS))); } catch (e) { columns = 0; }
  }
  if (columns <= 0) columns = env.terminalColumns;
  return columns;
}

// sys.exit(status): sys.exit(None) raises SystemExit with no args, so its
// str() is '' (raise SystemExit(None) would show 'None')
export class SystemExit extends PyException {
  constructor(code = null) {
    super('SystemExit', code === null ? '' : pyStr(code));
    this.code = code;
  }
}

// ', '.join(names) where a name may be None (an argument with
// dest=SUPPRESS and no metavar or option strings)
function joinNames(sep, names) {
  names.forEach((n, i) => {
    if (typeof n !== 'string') raise('TypeError', `sequence item ${i}: expected str instance, ${pyTypeName(n)} found`);
  });
  return names.join(sep);
}
const sysExit = (status) => { throw new SystemExit(status); };

// built-in callables usable as type=
export const INT = new PyCallable('int', (s) => {
  if (typeof s !== 'string') raise('TypeError', 'int() argument must be a string');
  return pyIntFromStr(s);
}, { isClass: true });
export const FLOAT = new PyCallable('float', (s) => pyFloatFromStr(s), { isClass: true });
export const STR = new PyCallable('str', (s) => pyStr(s), { isClass: true });
export const BOOL = new PyCallable('bool', (s) => (typeof s === 'string' ? s !== '' : Boolean(s)), { isClass: true });
export const pyFunction = (name, fn) => new PyCallable(name, fn);
// the registered type for type=None: the value itself (SUPPRESS keeps its identity)
const IDENTITY = new PyCallable('identity', (s) => s);

// callable(): PyCallable functions and types, JS classes (Python classes),
// and instances with __call__ (FileType)
const isCallable = (f) => f instanceof PyCallable || typeof f === 'function' || Boolean(f && typeof f.__call__ === 'function');
const callFn = (f, ...args) => {
  if (f instanceof PyCallable) return f.call(...args);
  if (typeof f === 'function') return new f(...args);
  return f.__call__(...args);
};
const hasName = (v) => v instanceof PyCallable || (typeof v === 'function' && v.pyName);
const nameOf = (v) => (v instanceof PyCallable ? v.__name__ : v.pyName);

// ── Namespace ────────────────────────────────────────────────
const isIdentifier = (s) => /^[\p{XID_Start}_][\p{XID_Continue}]*$/u.test(s);

function attributeHolderRepr(typeName, args, kwargs) {
  const argStrings = args.map(pyRepr);
  const star = new PyDict();
  for (const [name, value] of kwargs) {
    if (isIdentifier(name)) argStrings.push(`${name}=${pyRepr(value)}`);
    else star.set(name, value);
  }
  if (star.map.size) argStrings.push('**' + pyRepr(star));
  return `${typeName}(${argStrings.join(', ')})`;
}

export class Namespace {
  constructor(kwargs = {}) {
    this.__dict__ = new Map();
    for (const [k, v] of Object.entries(kwargs)) this.__dict__.set(k, v);
  }
  get pyTypeName() { return 'Namespace'; }
  __repr__() { return attributeHolderRepr('Namespace', [], [...this.__dict__.entries()]); }
  __eq__(other) {
    if (!(other instanceof Namespace)) return false;
    if (other.__dict__.size !== this.__dict__.size) return false;
    for (const [k, v] of this.__dict__) {
      if (!other.__dict__.has(k)) return false;
      const w = other.__dict__.get(k);
      if (!(v === w || pyEq(v, w))) return false;
    }
    return true;
  }
  __contains__(key) { return this.__dict__.has(key); }
}
// attribute names are str: dest=SUPPRESS stores under '==SUPPRESS=='
const attrName = (k) => (k === SUPPRESS ? '==SUPPRESS==' : k);
export const hasattr = (ns, k) => ns.__dict__.has(attrName(k));
export const getattr = (ns, k, dflt) => (ns.__dict__.has(attrName(k)) ? ns.__dict__.get(attrName(k)) : dflt);
export const setattr = (ns, k, v) => { ns.__dict__.set(attrName(k), v); };
const delattr = (ns, k) => { ns.__dict__.delete(attrName(k)); };
export const vars = (ns) => ns.__dict__;

// _copy_items(items) followed by items.append / items.extend: only a list
// has those methods (copy.copy of anything else returns a non-list)
function copyItems(items, method) {
  if (items === null || items === undefined) return [];
  if (Array.isArray(items)) return items.slice();
  raise('AttributeError', `'${pyTypeName(items)}' object has no attribute '${method}'`);
}

// ── Exceptions ───────────────────────────────────────────────
function getActionName(argument) {
  if (argument === null || argument === undefined) return null;
  if (argument.option_strings.length) return argument.option_strings.join('/');
  const metavar = argument.metavar;
  if (!(metavar === null || metavar === SUPPRESS || metavar === '==SUPPRESS==')) {
    if (!(metavar instanceof PyTuple)) return metavar;
    if (argument.nargs === ZERO_OR_MORE && metavar.items.length === 2) return pyPercent('%s[, %s]', metavar);
    if (argument.nargs === ONE_OR_MORE) return pyPercent('%s[, %s]', metavar);
    return metavar.items.map(pyStr).join(', ');
  }
  if (!(argument.dest === null || argument.dest === SUPPRESS || argument.dest === '==SUPPRESS==')) return argument.dest;
  if (argument.choices !== null && truthy(argument.choices)) return '{' + pyIter(argument.choices).map(pyStr).join(',') + '}';
  return null;
}

function truthy(v) {
  if (v === null || v === false || v === 0n || v === '') return false;
  if (v instanceof PyFloat) return v.v !== 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof PyTuple) return v.items.length > 0;
  if (v instanceof PyDict) return v.map.size > 0;
  if (v instanceof PyRange) return v.items().length > 0;
  return true;
}

export class ArgumentError extends PyException {
  constructor(argument, message) {
    super('argparse.ArgumentError', '');
    this.argument_name = getActionName(argument);
    this.pyMessage = message;
    this.message = this.__str__();
  }
  __str__() {
    if (this.argument_name === null) return pyStr(this.pyMessage);
    return `argument ${pyStr(this.argument_name)}: ${pyStr(this.pyMessage)}`;
  }
}

export class ArgumentTypeError extends PyException {
  constructor(message = '') { super('argparse.ArgumentTypeError', message); }
}

// except (TypeError, ValueError) — and their subclasses. (decimal's
// InvalidOperation is an ArithmeticError: it propagates uncaught.)
const VALUE_OR_TYPE_ERRORS = new Set(['ValueError', 'TypeError', 'UnicodeError', 'UnicodeDecodeError',
  'UnicodeEncodeError', 'UnicodeTranslateError', 'json.decoder.JSONDecodeError', 'binascii.Error']);

// ── Formatters ───────────────────────────────────────────────
class Section {
  constructor(formatter, parent, heading = null) {
    this.formatter = formatter;
    this.parent = parent;
    this.heading = heading;
    this.items = [];
  }
  format_help() {
    const f = this.formatter;
    if (this.parent !== null) f._indent();
    const itemHelp = f._join_parts(this.items.map((fn) => fn()));
    if (this.parent !== null) f._dedent();
    if (!itemHelp) return '';
    let heading = '';
    if (this.heading !== SUPPRESS && this.heading !== null) {
      heading = ' '.repeat(f._current_indent) + pyStr(this.heading) + ':\n';
    }
    return f._join_parts(['\n', heading, itemHelp, '\n']);
  }
}

// '%s' % metavar-tuple, with Python's argument-count errors
function fmtTuple(fmt, tup) { return pyPercent(fmt, new PyTuple(tup)); }

export class HelpFormatter {
  constructor(prog, { indent_increment = 2n, max_help_position = 24n, width = null } = {}) {
    let w = width;
    if (w === null) w = terminalColumns() - 2;
    w = Number(w);
    this._prog = prog;
    this._indent_increment = Number(indent_increment);
    this._max_help_position = Math.min(Number(max_help_position), Math.max(w - 20, this._indent_increment * 2));
    this._width = w;
    this._current_indent = 0;
    this._level = 0;
    this._action_max_length = 0;
    this._root_section = new Section(this, null);
    this._current_section = this._root_section;
  }

  _indent() { this._current_indent += this._indent_increment; this._level += 1; }
  _dedent() { this._current_indent -= this._indent_increment; this._level -= 1; }
  _add_item(fn) { this._current_section.items.push(fn); }

  start_section(heading) {
    this._indent();
    const section = new Section(this, this._current_section, heading);
    this._add_item(() => section.format_help());
    this._current_section = section;
  }
  end_section() { this._current_section = this._current_section.parent; this._dedent(); }
  add_text(text) {
    if (text !== SUPPRESS && text !== null && text !== undefined) this._add_item(() => this._format_text(text));
  }
  add_usage(usage, actions, groups, prefix = null) {
    if (usage !== SUPPRESS) this._add_item(() => this._format_usage(usage, actions, groups, prefix));
  }
  add_argument(action) {
    if (action.help !== SUPPRESS) {
      const lengths = [plen(this._format_action_invocation(action)) + this._current_indent];
      this._iter_indented_subactions(action, (sub) => {
        lengths.push(plen(this._format_action_invocation(sub)) + this._current_indent);
      });
      const actionLength = Math.max(...lengths);
      this._action_max_length = Math.max(this._action_max_length, actionLength);
      this._add_item(() => this._format_action(action));
    }
  }
  add_arguments(actions) { for (const a of actions) this.add_argument(a); }

  format_help() {
    let help = this._root_section.format_help();
    if (help) {
      help = help.replace(/\n\n\n+/g, '\n\n');
      help = pyStrip(help, '\n') + '\n';
    }
    return help;
  }

  _join_parts(parts) { return parts.filter((p) => p && p !== SUPPRESS).join(''); }

  _format_usage(usage, actions, groups, prefix) {
    if (prefix === null) prefix = 'usage: ';
    if (usage !== null) {
      usage = pyPercent(usage, new PyDict([['prog', this._prog]]));
    } else if (usage === null && actions.length === 0) {
      usage = pyStr(this._prog);
    } else {
      const prog = pyStr(this._prog);
      const optionals = [];
      const positionals = [];
      for (const a of actions) (a.option_strings.length ? optionals : positionals).push(a);
      const actionUsage = this._format_actions_usage([...optionals, ...positionals], groups);
      usage = [prog, actionUsage].filter((s) => s).join(' ');
      const textWidth = this._width - this._current_indent;
      if (plen(prefix) + plen(usage) > textWidth) {
        const optParts = this._get_actions_usage_parts(optionals, groups);
        const posParts = this._get_actions_usage_parts(positionals, groups);
        const getLines = (parts, indent, pfx = null) => {
          const lines = [];
          let line = [];
          const indentLength = plen(indent);
          let lineLen = pfx !== null ? plen(pfx) - 1 : indentLength - 1;
          for (const part of parts) {
            if (lineLen + 1 + plen(part) > textWidth && line.length) {
              lines.push(indent + line.join(' '));
              line = [];
              lineLen = indentLength - 1;
            }
            line.push(part);
            lineLen += plen(part) + 1;
          }
          if (line.length) lines.push(indent + line.join(' '));
          if (pfx !== null) lines[0] = cps(lines[0]).slice(indentLength).join('');
          return lines;
        };
        let lines;
        if (plen(prefix) + plen(prog) <= 0.75 * textWidth) {
          const indent = ' '.repeat(plen(prefix) + plen(prog) + 1);
          if (optParts.length) {
            lines = getLines([prog, ...optParts], indent, prefix);
            lines.push(...getLines(posParts, indent));
          } else if (posParts.length) {
            lines = getLines([prog, ...posParts], indent, prefix);
          } else lines = [prog];
        } else {
          const indent = ' '.repeat(plen(prefix));
          const parts = [...optParts, ...posParts];
          lines = getLines(parts, indent);
          if (lines.length > 1) {
            lines = [];
            lines.push(...getLines(optParts, indent));
            lines.push(...getLines(posParts, indent));
          }
          lines = [prog, ...lines];
        }
        usage = lines.join('\n');
      }
    }
    return `${prefix}${usage}\n\n`;
  }

  _format_actions_usage(actions, groups) { return this._get_actions_usage_parts(actions, groups).join(' '); }

  _get_actions_usage_parts(actions, groups) {
    const groupActions = new Set();
    const inserts = new Map(); // 'start,end' → group
    for (const group of groups) {
      if (!group._group_actions.length) raise('ValueError', `empty group ${pyRepr(group)}`);
      if (group._group_actions.every((a) => a.help === SUPPRESS)) continue;
      const start = actions.indexOf(group._group_actions[0]);
      if (start === -1) continue;
      const end = start + group._group_actions.length;
      const slice = actions.slice(start, end);
      if (slice.length === group._group_actions.length && slice.every((a, i) => a === group._group_actions[i])) {
        group._group_actions.forEach((a) => groupActions.add(a));
        inserts.set(`${start},${end}`, group);
      }
    }
    const parts = [];
    for (const action of actions) {
      let part;
      if (action.help === SUPPRESS) part = null;
      else if (!action.option_strings.length) {
        const dflt = this._get_default_metavar_for_positional(action);
        part = this._format_args(action, dflt);
        if (groupActions.has(action)) {
          const pa = cps(part);
          if (!pa.length) raise('IndexError', 'string index out of range');
          if (pa[0] === '[' && pa[pa.length - 1] === ']') part = pa.slice(1, -1).join('');
        }
      } else {
        const optionString = action.option_strings[0];
        if (isZero(action.nargs)) part = action.format_usage();
        else {
          const dflt = this._get_default_metavar_for_optional(action);
          part = `${optionString} ${this._format_args(action, dflt)}`;
        }
        if (!truthy(action.required) && !groupActions.has(action)) part = `[${part}]`;
      }
      parts.push(part);
    }
    const insertedSeparators = new Set();
    const keys = [...inserts.keys()].map((k) => k.split(',').map(Number))
      .sort((a, b) => (b[0] - a[0]) || (b[1] - a[1]));
    for (const [start, end] of keys) {
      const group = inserts.get(`${start},${end}`);
      const groupParts = parts.slice(start, end).filter((p) => p !== null);
      const groupSize = groupParts.length;
      let open; let close;
      if (truthy(group.required)) [open, close] = groupSize > 1 ? ['(', ')'] : ['', ''];
      else [open, close] = ['[', ']'];
      groupParts[0] = open + groupParts[0];
      groupParts[groupParts.length - 1] = groupParts[groupParts.length - 1] + close;
      groupParts.slice(0, -1).forEach((part, k) => {
        const i = start + k;
        if (!insertedSeparators.has(i)) {
          parts[i] = part + ' |';
          insertedSeparators.add(i);
        }
      });
      parts[start + groupSize - 1] = groupParts[groupParts.length - 1];
      for (let i = start + groupSize; i < end; i += 1) parts[i] = null;
    }
    return parts.filter((p) => p !== null);
  }

  _format_text(text) {
    if (typeof text === 'string' && text.includes('%(prog)')) text = pyPercent(text, new PyDict([['prog', this._prog]]));
    const textWidth = Math.max(this._width - this._current_indent, 11);
    const indent = ' '.repeat(this._current_indent);
    return this._fill_text(text, textWidth, indent) + '\n\n';
  }

  _format_action(action) {
    const helpPosition = Math.min(this._action_max_length + 2, this._max_help_position);
    const helpWidth = Math.max(this._width - helpPosition, 11);
    const actionWidth = helpPosition - this._current_indent - 2;
    let header = this._format_action_invocation(action);
    let indentFirst;
    const pad = ' '.repeat(this._current_indent);
    if (!truthy(action.help)) header = `${pad}${header}\n`;
    else if (plen(header) <= actionWidth) {
      header = pad + header + ' '.repeat(actionWidth - plen(header)) + '  ';
      indentFirst = 0;
    } else {
      header = `${pad}${header}\n`;
      indentFirst = helpPosition;
    }
    const parts = [header];
    if (truthy(action.help) && pyStrip(pyStr(action.help))) {
      const helpText = this._expand_help(action);
      if (helpText) {
        const helpLines = this._split_lines(helpText, helpWidth);
        if (!helpLines.length) raise('IndexError', 'list index out of range');
        parts.push(' '.repeat(indentFirst) + helpLines[0] + '\n');
        for (const line of helpLines.slice(1)) parts.push(' '.repeat(helpPosition) + line + '\n');
      }
    } else if (!header.endsWith('\n')) parts.push('\n');
    this._iter_indented_subactions(action, (sub) => { parts.push(this._format_action(sub)); });
    return this._join_parts(parts);
  }

  _format_action_invocation(action) {
    if (!action.option_strings.length) {
      const dflt = this._get_default_metavar_for_positional(action);
      return this._metavar_formatter(action, dflt)(1).map(pyStr).join(' ');
    }
    if (isZero(action.nargs)) return action.option_strings.join(', ');
    const dflt = this._get_default_metavar_for_optional(action);
    return action.option_strings.join(', ') + ' ' + this._format_args(action, dflt);
  }

  _metavar_formatter(action, defaultMetavar) {
    let result;
    if (action.metavar !== null) result = action.metavar;
    else if (action.choices !== null) result = '{' + pyIter(action.choices).map(pyStr).join(',') + '}';
    else result = defaultMetavar;
    return (n) => (result instanceof PyTuple ? result.items : Array(n).fill(result));
  }

  _format_args(action, defaultMetavar) {
    const getMetavar = this._metavar_formatter(action, defaultMetavar);
    const nargs = action.nargs;
    if (nargs === null) return fmtTuple('%s', getMetavar(1));
    if (nargs === OPTIONAL) return fmtTuple('[%s]', getMetavar(1));
    if (nargs === ZERO_OR_MORE) {
      const m = getMetavar(1);
      return m.length === 2 ? fmtTuple('[%s [%s ...]]', m) : fmtTuple('[%s ...]', m);
    }
    if (nargs === ONE_OR_MORE) return fmtTuple('%s [%s ...]', getMetavar(2));
    if (nargs === REMAINDER) return '...';
    if (nargs === PARSER) return fmtTuple('%s ...', getMetavar(1));
    if (nargs === SUPPRESS) return '';
    if (typeof nargs !== 'bigint' && typeof nargs !== 'boolean') raise('ValueError', 'invalid nargs value');
    const n = Number(nargs === true ? 1n : nargs === false ? 0n : nargs);
    const formats = Array(Math.max(n, 0)).fill('%s');
    return fmtTuple(formats.join(' '), getMetavar(Math.max(n, 0)));
  }

  _expand_help(action) {
    const params = new PyDict([...action.varsEntries(), ['prog', this._prog]]);
    for (const name of params.keys()) if (params.get(name) === SUPPRESS) params.map.delete(name);
    for (const name of params.keys()) {
      const v = params.get(name);
      if (hasName(v)) params.set(name, nameOf(v));
    }
    if (params.has('choices') && params.get('choices') !== null) {
      params.set('choices', pyIter(params.get('choices')).map(pyStr).join(', '));
    }
    return pyPercent(this._get_help_string(action), params);
  }

  _iter_indented_subactions(action, fn) {
    if (typeof action._get_subactions === 'function') {
      this._indent();
      for (const sub of action._get_subactions()) fn(sub);
      this._dedent();
    }
  }

  _split_lines(text, width) {
    text = pyStrip(text.replace(/[ \t\n\r\f\v]+/g, ' '));
    return textwrapWrap(text, width);
  }

  _fill_text(text, width, indent) {
    text = pyStrip(pyStr(text).replace(/[ \t\n\r\f\v]+/g, ' '));
    return textwrapFill(text, width, { initialIndent: indent, subsequentIndent: indent });
  }

  _get_help_string(action) { return action.help; }
  // action.dest.upper() — SUPPRESS is the str '==SUPPRESS==' in Python
  _get_default_metavar_for_optional(action) {
    const dest = action.dest === SUPPRESS ? '==SUPPRESS==' : action.dest;
    if (typeof dest !== 'string') raise('AttributeError', `'${pyTypeName(dest)}' object has no attribute 'upper'`);
    return dest.toUpperCase();
  }
  _get_default_metavar_for_positional(action) { return action.dest; }
}
HelpFormatter.pyName = 'HelpFormatter';
HelpFormatter.pyModule = 'argparse';

export class RawDescriptionHelpFormatter extends HelpFormatter {
  _fill_text(text, width, indent) {
    return pySplitlines(text, true).map((line) => indent + line).join('');
  }
}
RawDescriptionHelpFormatter.pyName = 'RawDescriptionHelpFormatter';

export class RawTextHelpFormatter extends RawDescriptionHelpFormatter {
  _split_lines(text) { return pySplitlines(text); }
}
RawTextHelpFormatter.pyName = 'RawTextHelpFormatter';

export class ArgumentDefaultsHelpFormatter extends HelpFormatter {
  _get_help_string(action) {
    let help = action.help;
    if (help === null) help = '';
    if (!help.includes('%(default)')) {
      if (action.default !== SUPPRESS) {
        if (action.option_strings.length || [OPTIONAL, ZERO_OR_MORE].includes(action.nargs)) help += ' (default: %(default)s)';
      }
    }
    return help;
  }
}
ArgumentDefaultsHelpFormatter.pyName = 'ArgumentDefaultsHelpFormatter';

export class MetavarTypeHelpFormatter extends HelpFormatter {
  _get_default_metavar_for_optional(action) { return typeName(action.type); }
  _get_default_metavar_for_positional(action) { return typeName(action.type); }
}
MetavarTypeHelpFormatter.pyName = 'MetavarTypeHelpFormatter';
function typeName(t) {
  if (hasName(t)) return nameOf(t);
  raise('AttributeError', `'${pyTypeName(t)}' object has no attribute '__name__'`);
}
[RawDescriptionHelpFormatter, RawTextHelpFormatter, ArgumentDefaultsHelpFormatter, MetavarTypeHelpFormatter]
  .forEach((c) => { c.pyModule = 'argparse'; });

// ── Actions ──────────────────────────────────────────────────
const DEPRECATED_DEFAULT = Symbol('deprecated_default');

// bind **kwargs to an __init__ signature: [[name, default], ...] (no
// default = required). Unknown names raise TypeError like CPython.
function bind(clsName, kwargs, spec) {
  const out = {};
  const known = new Set(spec.map(([n]) => n));
  for (const k of Object.keys(kwargs)) {
    if (!known.has(k)) raise('TypeError', `${clsName}.__init__() got an unexpected keyword argument '${k}'`);
  }
  const missing = [];
  for (const [n, ...d] of spec) {
    if (n in kwargs) out[n] = kwargs[n];
    else if (d.length) out[n] = d[0];
    else missing.push(n);
  }
  if (missing.length) {
    const names = missing.map((n) => `'${n}'`);
    const list = names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} and ${names[1]}` : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
    raise('TypeError', `${clsName}.__init__() missing ${missing.length} required positional argument${missing.length > 1 ? 's' : ''}: ${list}`);
  }
  return out;
}

const ACTION_SPEC = [['option_strings'], ['dest'], ['nargs', null], ['const', null], ['default', null], ['type', null],
  ['choices', null], ['required', false], ['help', null], ['metavar', null], ['deprecated', false]];

export class Action {
  constructor(kwargs) {
    this._init(bind(this.constructor.pyName, kwargs, ACTION_SPEC));
  }
  _init(k) {
    this._extra = [];
    this.option_strings = k.option_strings;
    this.dest = k.dest;
    this.nargs = k.nargs;
    this.const = k.const;
    this.default = k.default;
    this.type = k.type;
    this.choices = k.choices;
    this.required = k.required;
    this.help = k.help;
    this.metavar = k.metavar;
    this.deprecated = k.deprecated;
    this.container = undefined;
  }
  // vars(action), in attribute-assignment order
  varsEntries() {
    const names = ['option_strings', 'dest', 'nargs', 'const', 'default', 'type', 'choices', 'required', 'help', 'metavar', 'deprecated'];
    const out = names.map((n) => [n, this[n]]);
    if (this.container !== undefined) out.push(['container', this.container]);
    for (const n of this._extra) out.push([n, this[n]]);
    return out;
  }
  _get_kwargs() {
    return ['option_strings', 'dest', 'nargs', 'const', 'default', 'type', 'choices', 'required', 'help', 'metavar', 'deprecated']
      .map((n) => [n, this[n]]);
  }
  __repr__() { return attributeHolderRepr(this.constructor.pyName, [], this._get_kwargs()); }
  format_usage() { return this.option_strings[0]; }
  call() { raise('NotImplementedError', '.__call__() not defined'); }
}
Action.pyName = 'Action';
Action.pyModule = 'argparse';

export class BooleanOptionalAction extends Action {
  constructor(kwargs) {
    const k = bind('BooleanOptionalAction', kwargs, [['option_strings'], ['dest'], ['default', null],
      ['type', DEPRECATED_DEFAULT], ['choices', DEPRECATED_DEFAULT], ['required', false], ['help', null],
      ['metavar', DEPRECATED_DEFAULT], ['deprecated', false]]);
    const opts = [];
    for (let s of k.option_strings) {
      opts.push(s);
      if (s.startsWith('--')) { s = '--no-' + cps(s).slice(2).join(''); opts.push(s); }
    }
    super({
      option_strings: opts, dest: k.dest, nargs: 0n, default: k.default,
      type: k.type === DEPRECATED_DEFAULT ? null : k.type,
      choices: k.choices === DEPRECATED_DEFAULT ? null : k.choices,
      required: k.required, help: k.help,
      metavar: k.metavar === DEPRECATED_DEFAULT ? null : k.metavar,
      deprecated: k.deprecated,
    });
  }
  call(parser, namespace, values, optionString = null) {
    if (this.option_strings.includes(optionString)) setattr(namespace, this.dest, !optionString.startsWith('--no-'));
  }
  format_usage() { return this.option_strings.join(' | '); }
}
BooleanOptionalAction.pyName = 'BooleanOptionalAction';
BooleanOptionalAction.pyModule = 'argparse';

const isZero = (n) => n === 0n || n === false || (n instanceof PyFloat && n.v === 0);

class StoreAction extends Action {
  constructor(kwargs) {
    const k = bind('_StoreAction', kwargs, ACTION_SPEC);
    if (isZero(k.nargs)) raise('ValueError', 'nargs for store actions must be != 0; if you have nothing to store, actions such as store true or store const may be more appropriate');
    if (k.const !== null && k.nargs !== OPTIONAL) raise('ValueError', "nargs must be '?' to supply const");
    super(k);
  }
  call(parser, namespace, values) { setattr(namespace, this.dest, values); }
}
StoreAction.pyName = '_StoreAction';

class StoreConstAction extends Action {
  constructor(kwargs, name = '_StoreConstAction') {
    const k = bind(name, kwargs, [['option_strings'], ['dest'], ['const', null], ['default', null],
      ['required', false], ['help', null], ['metavar', null], ['deprecated', false]]);
    super({ option_strings: k.option_strings, dest: k.dest, nargs: 0n, const: k.const, default: k.default,
      required: k.required, help: k.help, deprecated: k.deprecated });
  }
  call(parser, namespace) { setattr(namespace, this.dest, this.const); }
}
StoreConstAction.pyName = '_StoreConstAction';

class StoreTrueAction extends StoreConstAction {
  constructor(kwargs) {
    const k = bind('_StoreTrueAction', kwargs, [['option_strings'], ['dest'], ['default', false], ['required', false], ['help', null], ['deprecated', false]]);
    super({ option_strings: k.option_strings, dest: k.dest, const: true, deprecated: k.deprecated, required: k.required, help: k.help, default: k.default });
  }
}
StoreTrueAction.pyName = '_StoreTrueAction';

class StoreFalseAction extends StoreConstAction {
  constructor(kwargs) {
    const k = bind('_StoreFalseAction', kwargs, [['option_strings'], ['dest'], ['default', true], ['required', false], ['help', null], ['deprecated', false]]);
    super({ option_strings: k.option_strings, dest: k.dest, const: false, default: k.default, required: k.required, help: k.help, deprecated: k.deprecated });
  }
}
StoreFalseAction.pyName = '_StoreFalseAction';

class AppendAction extends Action {
  constructor(kwargs) {
    const k = bind(new.target.pyName, kwargs, ACTION_SPEC);
    if (isZero(k.nargs)) raise('ValueError', 'nargs for append actions must be != 0; if arg strings are not supplying the value to append, the append const action may be more appropriate');
    if (k.const !== null && k.nargs !== OPTIONAL) raise('ValueError', "nargs must be '?' to supply const");
    super(k);
  }
  call(parser, namespace, values) {
    const items = copyItems(getattr(namespace, this.dest, null), 'append');
    items.push(values);
    setattr(namespace, this.dest, items);
  }
}
AppendAction.pyName = '_AppendAction';

class AppendConstAction extends Action {
  constructor(kwargs) {
    const k = bind('_AppendConstAction', kwargs, [['option_strings'], ['dest'], ['const', null], ['default', null],
      ['required', false], ['help', null], ['metavar', null], ['deprecated', false]]);
    super({ option_strings: k.option_strings, dest: k.dest, nargs: 0n, const: k.const, default: k.default,
      required: k.required, help: k.help, metavar: k.metavar, deprecated: k.deprecated });
  }
  call(parser, namespace) {
    const items = copyItems(getattr(namespace, this.dest, null), 'append');
    items.push(this.const);
    setattr(namespace, this.dest, items);
  }
}
AppendConstAction.pyName = '_AppendConstAction';

function pyAddOne(count) {
  if (typeof count === 'bigint') return count + 1n;
  if (typeof count === 'boolean') return (count ? 1n : 0n) + 1n;
  if (count instanceof PyFloat) return new PyFloat(count.v + 1);
  for (const t of ['str', 'list', 'tuple']) {
    if (pyTypeName(count) === t) raise('TypeError', `can only concatenate ${t} (not "int") to ${t}`);
  }
  raise('TypeError', `unsupported operand type(s) for +: '${pyTypeName(count)}' and 'int'`);
}

class CountAction extends Action {
  constructor(kwargs) {
    const k = bind('_CountAction', kwargs, [['option_strings'], ['dest'], ['default', null], ['required', false], ['help', null], ['deprecated', false]]);
    super({ option_strings: k.option_strings, dest: k.dest, nargs: 0n, default: k.default, required: k.required, help: k.help, deprecated: k.deprecated });
  }
  call(parser, namespace) {
    let count = getattr(namespace, this.dest, null);
    if (count === null) count = 0n;
    setattr(namespace, this.dest, pyAddOne(count));
  }
}
CountAction.pyName = '_CountAction';

class HelpAction extends Action {
  constructor(kwargs) {
    const k = bind('_HelpAction', kwargs, [['option_strings'], ['dest', SUPPRESS], ['default', SUPPRESS], ['help', null], ['deprecated', false]]);
    super({ option_strings: k.option_strings, dest: k.dest, default: k.default, nargs: 0n, help: k.help, deprecated: k.deprecated });
  }
  call(parser) { parser.print_help(); parser.exit(); }
}
HelpAction.pyName = '_HelpAction';

class VersionAction extends Action {
  constructor(kwargs) {
    const k = bind('_VersionAction', kwargs, [['option_strings'], ['version', null], ['dest', SUPPRESS], ['default', SUPPRESS], ['help', null], ['deprecated', false]]);
    let help = k.help;
    if (help === null) help = "show program's version number and exit";
    super({ option_strings: k.option_strings, dest: k.dest, default: k.default, nargs: 0n, help });
    this.version = k.version;
    this._extra.push('version');
  }
  call(parser) {
    let version = this.version;
    if (version === null) {
      // ArgumentParser has no version attribute unless you set one
      if (parser.version === undefined) raise('AttributeError', `'${pyTypeName(parser)}' object has no attribute 'version'`);
      version = parser.version;
    }
    const formatter = parser._get_formatter();
    formatter.add_text(version);
    parser._print_message(formatter.format_help(), sys.stdout);
    parser.exit();
  }
}
VersionAction.pyName = '_VersionAction';

class ChoicesPseudoAction extends Action {
  constructor(name, aliases, help) {
    let metavar = name;
    const dest = name;
    if (aliases.length) metavar += ` (${aliases.join(', ')})`;
    super({ option_strings: [], dest, help, metavar });
  }
}
ChoicesPseudoAction.pyName = '_ChoicesPseudoAction';

class SubParsersAction extends Action {
  constructor(kwargs) {
    const k = bind('_SubParsersAction', kwargs, [['option_strings'], ['prog'], ['parser_class'], ['dest', SUPPRESS],
      ['required', false], ['help', null], ['metavar', null]]);
    const nameParserMap = new PyDict();
    super({ option_strings: k.option_strings, dest: k.dest, nargs: PARSER, choices: nameParserMap,
      required: k.required, help: k.help, metavar: k.metavar });
    this._prog_prefix = k.prog;
    this._parser_class = k.parser_class;
    this._name_parser_map = nameParserMap;
    this._choices_actions = [];
    this._deprecated = new Set();
    this._extra.push('_prog_prefix', '_parser_class', '_name_parser_map', '_choices_actions', '_deprecated');
  }
  varsEntries() {
    // these five are assigned before Action.__init__ runs
    const base = super.varsEntries().filter(([n]) => !this._extra.includes(n));
    return [...this._extra.map((n) => [n, this[n]]), ...base];
  }
  add_parser(name, kwargs = {}) {
    kwargs = { ...kwargs };
    const deprecated = 'deprecated' in kwargs ? kwargs.deprecated : false;
    delete kwargs.deprecated;
    if (kwargs.prog === undefined || kwargs.prog === null) kwargs.prog = `${pyStr(this._prog_prefix)} ${pyStr(name)}`;
    const aliases = 'aliases' in kwargs ? pyIter(kwargs.aliases) : [];
    delete kwargs.aliases;
    if (this._name_parser_map.has(name)) throw new ArgumentError(this, `conflicting subparser: ${pyStr(name)}`);
    for (const alias of aliases) {
      if (this._name_parser_map.has(alias)) throw new ArgumentError(this, `conflicting subparser alias: ${pyStr(alias)}`);
    }
    if ('help' in kwargs) {
      const help = kwargs.help;
      delete kwargs.help;
      this._choices_actions.push(new ChoicesPseudoAction(name, aliases, help));
    }
    const parser = new this._parser_class(kwargs);
    this._name_parser_map.set(name, parser);
    for (const alias of aliases) this._name_parser_map.set(alias, parser);
    if (truthy(deprecated)) { this._deprecated.add(name); aliases.forEach((a) => this._deprecated.add(a)); }
    return parser;
  }
  _get_subactions() { return this._choices_actions; }
  call(parser, namespace, values) {
    const parserName = values[0];
    let argStrings = values.slice(1);
    if (this.dest !== SUPPRESS) setattr(namespace, this.dest, parserName);
    if (!this._name_parser_map.has(parserName)) {
      const msg = `unknown parser ${pyRepr(parserName)} (choices: ${this._name_parser_map.keys().join(', ')})`;
      throw new ArgumentError(this, msg);
    }
    const subparser = this._name_parser_map.get(parserName);
    if (this._deprecated.has(parserName)) parser._warning(`command '${pyStr(parserName)}' is deprecated`);
    let subnamespace;
    [subnamespace, argStrings] = subparser.parse_known_args(argStrings, null);
    for (const [key, value] of subnamespace.__dict__) setattr(namespace, key, value);
    if (argStrings.length) {
      if (!hasattr(namespace, UNRECOGNIZED_ARGS_ATTR)) setattr(namespace, UNRECOGNIZED_ARGS_ATTR, []);
      getattr(namespace, UNRECOGNIZED_ARGS_ATTR).push(...argStrings);
    }
  }
}
SubParsersAction.pyName = '_SubParsersAction';

class ExtendAction extends AppendAction {
  call(parser, namespace, values) {
    const items = copyItems(getattr(namespace, this.dest, null), 'extend');
    items.push(...pyIter(values));
    setattr(namespace, this.dest, items);
  }
}
ExtendAction.pyName = '_ExtendAction';

// ── FileType ─────────────────────────────────────────────────
// Opens files in the demo folder through the open() port in _pyopen.js;
// '-' is sys.stdin / sys.stdout (or their .buffer for binary modes).
const OS_ERRORS = new Set(['OSError', 'FileNotFoundError', 'FileExistsError', 'PermissionError', 'IsADirectoryError', 'NotADirectoryError']);

export class FileType {
  constructor(mode = 'r', bufsize = -1n, encoding = null, errors = null) {
    this._mode = mode; this._bufsize = bufsize; this._encoding = encoding; this._errors = errors;
  }
  get pyTypeName() { return 'FileType'; }
  __call__(string) {
    // the special argument "-" means sys.std{in,out}
    if (string === '-') {
      const has = (c) => pyContains(this._mode, c);
      if (has('r')) return has('b') ? bufferOf(sys.stdin) : sys.stdin;
      if (['w', 'a', 'x'].some(has)) return has('b') ? bufferOf(sys.stdout) : sys.stdout;
      raise('ValueError', `argument "-" with mode ${pyRepr(this._mode)}`);
    }
    // all other arguments are used as file names
    try {
      return pyOpen(string, this._mode, this._bufsize, this._encoding, this._errors);
    } catch (e) {
      if (e instanceof PyException && OS_ERRORS.has(e.name)) throw new ArgumentTypeError(`can't open '${pyStr(string)}': ${e.message}`);
      throw e;
    }
  }
  __repr__() {
    const args = [this._mode, this._bufsize].filter((a) => !pyEq(a, -1n)).map(pyRepr);
    const kw = [['encoding', this._encoding], ['errors', this._errors]].filter(([, v]) => v !== null).map(([k, v]) => `${k}=${pyRepr(v)}`);
    return `FileType(${[...args, ...kw].join(', ')})`;
  }
}

// ── Containers ───────────────────────────────────────────────
// re.compile(r'^-\d+$|^-\d*\.\d+$').match — \d is any Unicode decimal
// digit for a str pattern, and $ also matches before a final newline
const isDigit = (c) => decimalValue(c) >= 0;
const NEGATIVE_NUMBER = {
  test(s) {
    let a = cps(s);
    if (a[a.length - 1] === '\n') a = a.slice(0, -1);
    if (a[0] !== '-') return false;
    const rest = a.slice(1);
    if (rest.length && rest.every(isDigit)) return true;
    const dot = rest.indexOf('.');
    if (dot === -1) return false;
    const before = rest.slice(0, dot);
    const after = rest.slice(dot + 1);
    return before.every(isDigit) && after.length > 0 && after.every(isDigit);
  },
};

class ActionsContainer {
  constructor({ description, prefix_chars, argument_default, conflict_handler }) {
    this.description = description;
    this.argument_default = argument_default;
    this.prefix_chars = prefix_chars;
    this.conflict_handler = conflict_handler;
    this._registries = new Map();
    this.register('action', null, StoreAction);
    this.register('action', 'store', StoreAction);
    this.register('action', 'store_const', StoreConstAction);
    this.register('action', 'store_true', StoreTrueAction);
    this.register('action', 'store_false', StoreFalseAction);
    this.register('action', 'append', AppendAction);
    this.register('action', 'append_const', AppendConstAction);
    this.register('action', 'count', CountAction);
    this.register('action', 'help', HelpAction);
    this.register('action', 'version', VersionAction);
    this.register('action', 'parsers', SubParsersAction);
    this.register('action', 'extend', ExtendAction);
    this._get_handler();
    this._actions = [];
    this._option_string_actions = new Map();
    this._action_groups = [];
    this._mutually_exclusive_groups = [];
    this._defaults = new Map();
    this._has_negative_number_optionals = [];
  }

  register(registryName, value, object) {
    if (!this._registries.has(registryName)) this._registries.set(registryName, new Map());
    this._registries.get(registryName).set(value, object);
  }
  _registry_get(registryName, value, dflt = null) {
    const reg = this._registries.get(registryName);
    return reg.has(value) ? reg.get(value) : dflt;
  }

  set_defaults(kwargs) {
    for (const [k, v] of Object.entries(kwargs)) this._defaults.set(k, v);
    for (const action of this._actions) if (action.dest in kwargs) action.default = kwargs[action.dest];
  }
  get_default(dest) {
    for (const action of this._actions) if (action.dest === dest && action.default !== null) return action.default;
    return this._defaults.has(dest) ? this._defaults.get(dest) : null;
  }

  // add_argument('-n', '--count', { type: INT }) — the trailing plain object is **kwargs
  add_argument(...args) {
    let kwargs = {};
    if (args.length && args[args.length - 1] && typeof args[args.length - 1] === 'object' && !Array.isArray(args[args.length - 1])) {
      kwargs = { ...args.pop() };
    }
    const chars = this.prefix_chars;
    if (!args.length || (args.length === 1 && !chars.includes(cps(args[0])[0] ?? raise('IndexError', 'string index out of range')))) {
      if (args.length && 'dest' in kwargs) raise('ValueError', 'dest supplied twice for positional argument');
      kwargs = this._get_positional_kwargs(args, kwargs);
    } else kwargs = this._get_optional_kwargs(args, kwargs);
    if (!('default' in kwargs)) {
      const dest = kwargs.dest;
      if (this._defaults.has(dest)) kwargs.default = this._defaults.get(dest);
      else if (this.argument_default !== null) kwargs.default = this.argument_default;
    }
    const actionClass = this._pop_action_class(kwargs);
    if (typeof actionClass !== 'function') raise('ValueError', `unknown action "${pyStr(actionClass)}"`);
    const action = new actionClass(kwargs);
    const typeFunc = this._registry_get('type', action.type, action.type);
    if (!isCallable(typeFunc)) raise('ValueError', `${pyRepr(typeFunc)} is not callable`);
    if (typeFunc === FileType) raise('ValueError', "<class 'argparse.FileType'> is a FileType class object, instance of it must be passed");
    if (typeof this._get_formatter === 'function') {
      try {
        this._get_formatter()._format_args(action, null);
      } catch (e) {
        if (e.name === 'TypeError') raise('ValueError', 'length of metavar tuple does not match nargs');
        throw e;
      }
    }
    return this._add_action(action);
  }

  add_argument_group(kwargs = {}) {
    const group = new ArgumentGroup(this, kwargs);
    this._action_groups.push(group);
    return group;
  }
  add_mutually_exclusive_group(kwargs = {}) {
    const group = new MutuallyExclusiveGroup(this, kwargs);
    this._mutually_exclusive_groups.push(group);
    return group;
  }

  _add_action(action) {
    this._check_conflict(action);
    this._actions.push(action);
    action.container = this;
    for (const s of action.option_strings) this._option_string_actions.set(s, action);
    for (const s of action.option_strings) {
      if (NEGATIVE_NUMBER.test(s) && !this._has_negative_number_optionals.length) this._has_negative_number_optionals.push(true);
    }
    return action;
  }
  _remove_action(action) {
    const i = this._actions.indexOf(action);
    if (i === -1) raise('ValueError', 'list.remove(x): x not in list');
    this._actions.splice(i, 1);
  }

  _add_container_actions(container) {
    const titleGroupMap = new Map();
    for (const group of this._action_groups) {
      if (titleGroupMap.has(group.title)) raise('ValueError', `cannot merge actions - two groups are named ${pyRepr(group.title)}`);
      titleGroupMap.set(group.title, group);
    }
    const groupMap = new Map();
    for (const group of container._action_groups) {
      if (!titleGroupMap.has(group.title)) {
        titleGroupMap.set(group.title, this.add_argument_group({ title: group.title, description: group.description, conflict_handler: group.conflict_handler }));
      }
      for (const action of group._group_actions) groupMap.set(action, titleGroupMap.get(group.title));
    }
    for (const group of container._mutually_exclusive_groups) {
      const cont = group._container === container ? this : titleGroupMap.get(group._container.title);
      const mutex = cont.add_mutually_exclusive_group({ required: group.required });
      for (const action of group._group_actions) groupMap.set(action, mutex);
    }
    for (const action of container._actions) (groupMap.get(action) || this)._add_action(action);
  }

  // _get_positional_kwargs(self, dest, **kwargs): dest may also arrive as a keyword
  _get_positional_kwargs(args, kwargs) {
    const rest = { ...kwargs };
    let dest;
    if (args.length) dest = args[0];
    else if ('dest' in rest) dest = rest.dest;
    else raise('TypeError', "_ActionsContainer._get_positional_kwargs() missing 1 required positional argument: 'dest'");
    delete rest.dest;
    if ('required' in rest) raise('TypeError', "'required' is an invalid argument for positionals");
    const nargs = 'nargs' in rest ? rest.nargs : null;
    if (![OPTIONAL, ZERO_OR_MORE, REMAINDER, SUPPRESS].includes(nargs) && !isZero(nargs)) rest.required = true;
    delete rest.option_strings;
    return { ...rest, dest, option_strings: [] };
  }

  _get_optional_kwargs(args, kwargs) {
    const optionStrings = [];
    const longOptionStrings = [];
    let last;
    for (const optionString of args) {
      const oc = cps(optionString);
      if (!oc.length) raise('IndexError', 'string index out of range');
      if (!this.prefix_chars.includes(oc[0])) {
        raise('ValueError', `invalid option string ${pyRepr(optionString)}: must start with a character ${pyRepr(this.prefix_chars)}`);
      }
      optionStrings.push(optionString);
      if (oc.length > 1 && this.prefix_chars.includes(oc[1])) longOptionStrings.push(optionString);
      last = optionString;
    }
    let dest = 'dest' in kwargs ? kwargs.dest : null;
    const rest = { ...kwargs };
    delete rest.dest;
    if (dest === null) {
      const destOptionString = longOptionStrings.length ? longOptionStrings[0] : optionStrings[0];
      dest = pyLstrip(destOptionString, this.prefix_chars);
      if (!dest) raise('ValueError', `dest= is required for options like ${pyRepr(last)}`);
      dest = dest.replace(/-/g, '_');
    }
    delete rest.option_strings;
    return { ...rest, dest, option_strings: optionStrings };
  }

  _pop_action_class(kwargs, dflt = null) {
    const action = 'action' in kwargs ? kwargs.action : dflt;
    delete kwargs.action;
    return this._registry_get('action', action, action);
  }

  _get_handler() {
    if (this.conflict_handler === 'error') return (a, c) => this._handle_conflict_error(a, c);
    if (this.conflict_handler === 'resolve') return (a, c) => this._handle_conflict_resolve(a, c);
    raise('ValueError', `invalid conflict_resolution value: ${pyRepr(this.conflict_handler)}`);
  }

  _check_conflict(action) {
    const confl = [];
    for (const s of action.option_strings) {
      if (this._option_string_actions.has(s)) confl.push([s, this._option_string_actions.get(s)]);
    }
    if (confl.length) this._get_handler()(action, confl);
  }

  _handle_conflict_error(action, conflicting) {
    const message = conflicting.length === 1 ? 'conflicting option string: %s' : 'conflicting option strings: %s';
    throw new ArgumentError(action, message.replace('%s', conflicting.map(([s]) => s).join(', ')));
  }

  _handle_conflict_resolve(action, conflicting) {
    for (const [s, a] of conflicting) {
      const i = a.option_strings.indexOf(s);
      if (i === -1) raise('ValueError', 'list.remove(x): x not in list');
      a.option_strings.splice(i, 1);
      this._option_string_actions.delete(s);
      if (!a.option_strings.length) a.container._remove_action(a);
    }
  }
}

class ArgumentGroup extends ActionsContainer {
  constructor(container, kwargs = {}) {
    const k = { ...kwargs };
    const title = 'title' in k ? k.title : null;
    const description = 'description' in k ? k.description : null;
    delete k.title; delete k.description;
    if (!('conflict_handler' in k)) k.conflict_handler = container.conflict_handler;
    if (!('prefix_chars' in k)) k.prefix_chars = container.prefix_chars;
    if (!('argument_default' in k)) k.argument_default = container.argument_default;
    for (const n of Object.keys(k)) {
      if (!['conflict_handler', 'prefix_chars', 'argument_default'].includes(n)) {
        raise('TypeError', `_ActionsContainer.__init__() got an unexpected keyword argument '${n}'`);
      }
    }
    super({ description, ...k });
    this.title = title;
    this._group_actions = [];
    this._registries = container._registries;
    this._actions = container._actions;
    this._option_string_actions = container._option_string_actions;
    this._defaults = container._defaults;
    this._has_negative_number_optionals = container._has_negative_number_optionals;
    this._mutually_exclusive_groups = container._mutually_exclusive_groups;
  }
  get pyTypeName() { return '_ArgumentGroup'; }
  _add_action(action) {
    action = super._add_action(action);
    this._group_actions.push(action);
    return action;
  }
  _remove_action(action) {
    super._remove_action(action);
    this._group_actions.splice(this._group_actions.indexOf(action), 1);
  }
}

class MutuallyExclusiveGroup extends ArgumentGroup {
  constructor(container, kwargs = {}) {
    for (const n of Object.keys(kwargs)) {
      if (n !== 'required') raise('TypeError', `_MutuallyExclusiveGroup.__init__() got an unexpected keyword argument '${n}'`);
    }
    super(container);
    this.required = 'required' in kwargs ? kwargs.required : false;
    this._container = container;
  }
  get pyTypeName() { return '_MutuallyExclusiveGroup'; }
  _add_action(action) {
    if (truthy(action.required)) raise('ValueError', 'mutually exclusive arguments must be optional');
    action = this._container._add_action(action);
    this._group_actions.push(action);
    return action;
  }
  _remove_action(action) {
    this._container._remove_action(action);
    this._group_actions.splice(this._group_actions.indexOf(action), 1);
  }
}

// ── ArgumentParser ───────────────────────────────────────────
const PARSER_SPEC = [['prog', null], ['usage', null], ['description', null], ['epilog', null], ['parents', []],
  ['formatter_class', HelpFormatter], ['prefix_chars', '-'], ['fromfile_prefix_chars', null],
  ['argument_default', null], ['conflict_handler', 'error'], ['add_help', true], ['allow_abbrev', true],
  ['exit_on_error', true]];

export class ArgumentParser extends ActionsContainer {
  constructor(kwargs = {}) {
    const k = bind(new.target.pyName || 'ArgumentParser', kwargs, PARSER_SPEC);
    super({ description: k.description, prefix_chars: k.prefix_chars, argument_default: k.argument_default, conflict_handler: k.conflict_handler });
    let prog = k.prog;
    if (prog === null) prog = 'app'; // os.path.basename(sys.argv[0]); demos always pass prog=
    this.prog = prog;
    this.usage = k.usage;
    this.epilog = k.epilog;
    this.formatter_class = k.formatter_class;
    this.fromfile_prefix_chars = k.fromfile_prefix_chars;
    this.add_help = k.add_help;
    this.allow_abbrev = k.allow_abbrev;
    this.exit_on_error = k.exit_on_error;
    this._positionals = this.add_argument_group({ title: 'positional arguments' });
    this._optionals = this.add_argument_group({ title: 'options' });
    this._subparsers = null;
    this.register('type', null, IDENTITY);
    const defaultPrefix = this.prefix_chars.includes('-') ? '-' : cps(this.prefix_chars)[0];
    if (truthy(this.add_help)) {
      this.add_argument(defaultPrefix + 'h', defaultPrefix + defaultPrefix + 'help',
        { action: 'help', default: SUPPRESS, help: 'show this help message and exit' });
    }
    for (const parent of k.parents) {
      if (!(parent instanceof ArgumentParser)) raise('TypeError', 'parents must be a list of ArgumentParser');
      this._add_container_actions(parent);
      for (const [dk, dv] of parent._defaults) this._defaults.set(dk, dv);
    }
  }
  get pyTypeName() { return this.constructor.pyName || 'ArgumentParser'; }

  _get_kwargs() {
    return ['prog', 'usage', 'description', 'formatter_class', 'conflict_handler', 'add_help'].map((n) => [n, this[n]]);
  }
  __repr__() { return attributeHolderRepr(this.constructor.pyName || 'ArgumentParser', [], this._get_kwargs()); }

  add_subparsers(kwargs = {}) {
    if (this._subparsers !== null) throw new ArgumentError(null, 'cannot have multiple subparser arguments');
    kwargs = { ...kwargs };
    if (!('parser_class' in kwargs)) kwargs.parser_class = this.constructor;
    if ('title' in kwargs || 'description' in kwargs) {
      const title = 'title' in kwargs ? kwargs.title : 'subcommands';
      const description = 'description' in kwargs ? kwargs.description : null;
      delete kwargs.title; delete kwargs.description;
      this._subparsers = this.add_argument_group({ title, description });
    } else this._subparsers = this._positionals;
    if (kwargs.prog === undefined || kwargs.prog === null) {
      const formatter = this._get_formatter();
      const positionals = this._get_positional_actions();
      const groups = this._mutually_exclusive_groups;
      formatter.add_usage(this.usage, positionals, groups, '');
      kwargs.prog = pyStrip(formatter.format_help());
    }
    const parsersClass = this._pop_action_class(kwargs, 'parsers');
    const action = new parsersClass({ option_strings: [], ...kwargs });
    this._subparsers._add_action(action);
    return action;
  }

  _add_action(action) {
    if (action.option_strings.length) this._optionals._add_action(action);
    else this._positionals._add_action(action);
    return action;
  }
  _get_optional_actions() { return this._actions.filter((a) => a.option_strings.length); }
  _get_positional_actions() { return this._actions.filter((a) => !a.option_strings.length); }

  parse_args(args = null, namespace = null) {
    const [ns, argv] = this.parse_known_args(args, namespace);
    if (argv.length) {
      const msg = `unrecognized arguments: ${argv.join(' ')}`;
      if (truthy(this.exit_on_error)) this.error(msg);
      else throw new ArgumentError(null, msg);
    }
    return ns;
  }

  parse_known_args(args = null, namespace = null) { return this._parse_known_args2(args, namespace, false); }

  _parse_known_args2(args, namespace, intermixed) {
    args = args === null ? [] : [...args];
    if (namespace === null) namespace = new Namespace();
    for (const action of this._actions) {
      if (action.dest !== SUPPRESS && !hasattr(namespace, action.dest) && action.default !== SUPPRESS) {
        setattr(namespace, action.dest, action.default);
      }
    }
    for (const [dest, v] of this._defaults) if (!hasattr(namespace, dest)) setattr(namespace, dest, v);
    if (truthy(this.exit_on_error)) {
      try {
        [namespace, args] = this._parse_known_args(args, namespace, intermixed);
      } catch (err) {
        if (err instanceof ArgumentError) this.error(err.__str__());
        else throw err;
      }
    } else [namespace, args] = this._parse_known_args(args, namespace, intermixed);
    if (hasattr(namespace, UNRECOGNIZED_ARGS_ATTR)) {
      args.push(...getattr(namespace, UNRECOGNIZED_ARGS_ATTR));
      delattr(namespace, UNRECOGNIZED_ARGS_ATTR);
    }
    return [namespace, args];
  }

  _parse_known_args(argStrings, namespace, intermixed) {
    if (this.fromfile_prefix_chars !== null) argStrings = this._read_args_from_files(argStrings);

    const actionConflicts = new Map();
    for (const mutex of this._mutually_exclusive_groups) {
      const ga = mutex._group_actions;
      ga.forEach((a, i) => {
        if (!actionConflicts.has(a)) actionConflicts.set(a, []);
        actionConflicts.get(a).push(...ga.slice(0, i), ...ga.slice(i + 1));
      });
    }

    const optionStringIndices = new Map();
    const patternParts = [];
    for (let i = 0; i < argStrings.length; i += 1) {
      const s = argStrings[i];
      if (s === '--') {
        patternParts.push('-');
        for (i += 1; i < argStrings.length; i += 1) patternParts.push('A');
        break;
      }
      const tuples = this._parse_optional(s);
      if (tuples === null) patternParts.push('A');
      else { optionStringIndices.set(i, tuples); patternParts.push('O'); }
    }
    let argStringsPattern = patternParts.join('');

    const seenActions = new Set();
    const seenNonDefault = new Set();
    const warned = new Set();
    let extras = [];
    let extrasPattern = [];

    const takeAction = (action, argumentStrings, optionString = null) => {
      seenActions.add(action);
      const values = this._get_values(action, argumentStrings);
      if (action.option_strings.length || argumentStrings.length) {
        seenNonDefault.add(action);
        for (const c of actionConflicts.get(action) || []) {
          if (seenNonDefault.has(c)) throw new ArgumentError(action, `not allowed with argument ${pyStr(getActionName(c))}`);
        }
      }
      if (values !== SUPPRESS) action.call(this, namespace, values, optionString);
    };

    const consumeOptional = (startIndex) => {
      const tuples = optionStringIndices.get(startIndex);
      if (tuples.length > 1) {
        const options = tuples.map((t) => t[1]).join(', ');
        throw new ArgumentError(null, `ambiguous option: ${argStrings[startIndex]} could match ${options}`);
      }
      let [action, optionString, sep, explicitArg] = tuples[0];
      const actionTuples = [];
      let stop;
      for (;;) {
        if (action === null) {
          extras.push(argStrings[startIndex]);
          extrasPattern.push('O');
          return startIndex + 1;
        }
        if (explicitArg !== null) {
          const argCount = this._match_argument(action, 'A');
          const chars = this.prefix_chars;
          if (argCount === 0 && cps(optionString).length < 2) raise('IndexError', 'string index out of range');
          if (argCount === 0 && !chars.includes(cps(optionString)[1]) && explicitArg !== '') {
            if (sep || chars.includes(cps(explicitArg)[0])) throw new ArgumentError(action, `ignored explicit argument ${pyRepr(explicitArg)}`);
            actionTuples.push([action, [], optionString]);
            const ch = cps(optionString)[0];
            optionString = ch + cps(explicitArg)[0];
            if (this._option_string_actions.has(optionString)) {
              action = this._option_string_actions.get(optionString);
              explicitArg = cps(explicitArg).slice(1).join('');
              if (!explicitArg) { sep = null; explicitArg = null; } else if (cps(explicitArg)[0] === '=') {
                sep = '='; explicitArg = cps(explicitArg).slice(1).join('');
              } else sep = '';
            } else {
              extras.push(ch + explicitArg);
              extrasPattern.push('O');
              stop = startIndex + 1;
              break;
            }
          } else if (argCount === 1) {
            stop = startIndex + 1;
            actionTuples.push([action, [explicitArg], optionString]);
            break;
          } else throw new ArgumentError(action, `ignored explicit argument ${pyRepr(explicitArg)}`);
        } else {
          const start = startIndex + 1;
          const selected = argStringsPattern.slice(start);
          const argCount = this._match_argument(action, selected);
          stop = start + argCount;
          actionTuples.push([action, argStrings.slice(start, stop), optionString]);
          break;
        }
      }
      for (const [a, args, os] of actionTuples) {
        if (truthy(a.deprecated) && !warned.has(os)) {
          this._warning(`option '${os}' is deprecated`);
          warned.add(os);
        }
        takeAction(a, args, os);
      }
      return stop;
    };

    const positionals = this._get_positional_actions();

    const consumePositionals = (startIndex) => {
      const selected = argStringsPattern.slice(startIndex);
      const argCounts = this._match_arguments_partial(positionals, selected);
      for (let k = 0; k < argCounts.length && k < positionals.length; k += 1) {
        const action = positionals[k];
        const argCount = argCounts[k];
        const args = argStrings.slice(startIndex, startIndex + argCount);
        if (action.nargs === PARSER) {
          if (argStringsPattern[startIndex] === '-') args.splice(args.indexOf('--'), 1);
        } else if (action.nargs !== REMAINDER) {
          if (argStringsPattern.slice(startIndex, startIndex + argCount).includes('-')) args.splice(args.indexOf('--'), 1);
        }
        startIndex += argCount;
        if (args.length && truthy(action.deprecated) && !warned.has(action.dest)) {
          this._warning(`argument '${pyStr(action.dest)}' is deprecated`);
          warned.add(action.dest);
        }
        takeAction(action, args);
      }
      positionals.splice(0, argCounts.length);
      return startIndex;
    };

    let startIndex = 0;
    const maxOptionStringIndex = optionStringIndices.size ? Math.max(...optionStringIndices.keys()) : -1;
    while (startIndex <= maxOptionStringIndex) {
      let next = startIndex;
      while (next <= maxOptionStringIndex) {
        if (optionStringIndices.has(next)) break;
        next += 1;
      }
      if (!intermixed && startIndex !== next) {
        const positionalsEnd = consumePositionals(startIndex);
        if (positionalsEnd > startIndex) { startIndex = positionalsEnd; continue; }
        startIndex = positionalsEnd;
      }
      if (!optionStringIndices.has(startIndex)) {
        extras.push(...argStrings.slice(startIndex, next));
        extrasPattern.push(...argStringsPattern.slice(startIndex, next));
        startIndex = next;
      }
      startIndex = consumeOptional(startIndex);
    }

    if (!intermixed) {
      const stopIndex = consumePositionals(startIndex);
      extras.push(...argStrings.slice(stopIndex));
    } else {
      extras.push(...argStrings.slice(startIndex));
      extrasPattern.push(...argStringsPattern.slice(startIndex));
      const ep = extrasPattern.join('');
      argStrings = extras.filter((s, i) => ep[i] !== 'O');
      argStringsPattern = ep.replace(/O/g, '');
      let stopIndex = consumePositionals(0);
      const marked = [...extras];
      for (let i = 0; i < ep.length; i += 1) {
        if (!stopIndex) break;
        if (ep[i] !== 'O') { stopIndex -= 1; marked[i] = null; }
      }
      extras = marked.filter((s) => s !== null);
    }

    const requiredActions = [];
    for (const action of this._actions) {
      if (!seenActions.has(action)) {
        if (truthy(action.required)) requiredActions.push(getActionName(action));
        // (SUPPRESS is the str '==SUPPRESS==': set_defaults(x=SUPPRESS) on an
        // action with a type= gets converted here too)
        else if (action.default !== null && (typeof action.default === 'string' || action.default === SUPPRESS)
          && hasattr(namespace, action.dest) && action.default === getattr(namespace, action.dest)) {
          setattr(namespace, action.dest, this._get_value(action, action.default));
        }
      }
    }
    if (requiredActions.length) {
      throw new ArgumentError(null, `the following arguments are required: ${joinNames(', ', requiredActions)}`);
    }
    for (const group of this._mutually_exclusive_groups) {
      if (truthy(group.required)) {
        if (!group._group_actions.some((a) => seenNonDefault.has(a))) {
          const names = group._group_actions.filter((a) => a.help !== SUPPRESS).map((a) => getActionName(a));
          throw new ArgumentError(null, `one of the arguments ${joinNames(' ', names)} is required`);
        }
      }
    }
    return [namespace, extras];
  }

  _read_args_from_files(argStrings) {
    const out = [];
    for (const s of argStrings) {
      if (!s || !this.fromfile_prefix_chars.includes(cps(s)[0])) out.push(s);
      else {
        // open(name, encoding=sys.getfilesystemencoding(), errors=...):
        // UTF-8 on every platform; an OSError becomes ArgumentError(None, str(err))
        const name = cps(s).slice(1).join('');
        let text;
        try {
          const f = pyOpen(name, 'r', -1n, 'utf-8', 'surrogateescape');
          text = f.read();
          f.close();
        } catch (e) {
          if (e instanceof PyException && OS_ERRORS.has(e.name)) throw new ArgumentError(null, e.message);
          throw e;
        }
        let lines = [];
        for (const line of pySplitlines(text)) {
          for (const arg of this.convert_arg_line_to_args(line)) lines.push(arg);
        }
        lines = this._read_args_from_files(lines);
        out.push(...lines);
      }
    }
    return out;
  }

  convert_arg_line_to_args(argLine) { return [argLine]; }

  _match_argument(action, pattern) {
    const m = new RegExp('^' + this._get_nargs_pattern(action)).exec(pattern);
    if (m === null) {
      let msg = null;
      if (action.nargs === null) msg = 'expected one argument';
      else if (action.nargs === OPTIONAL) msg = 'expected at most one argument';
      else if (action.nargs === ONE_OR_MORE) msg = 'expected at least one argument';
      if (msg === null) {
        const n = action.nargs;
        msg = `expected ${pyStr(n)} argument${pyEq(n, 1n) ? '' : 's'}`;
      }
      throw new ArgumentError(action, msg);
    }
    return m[1].length;
  }

  _match_arguments_partial(actions, pattern) {
    for (let i = actions.length; i > 0; i -= 1) {
      const p = actions.slice(0, i).map((a) => this._get_nargs_pattern(a)).join('');
      const m = new RegExp('^' + p).exec(pattern);
      if (m !== null) {
        const result = m.slice(1).map((g) => g.length);
        const end = m[0].length;
        if (end < pattern.length && pattern[end] === 'O') {
          while (result.length && !result[result.length - 1]) result.pop();
        }
        return result;
      }
    }
    return [];
  }

  _parse_optional(argString) {
    if (!argString) return null;
    const a = cps(argString);
    if (!this.prefix_chars.includes(a[0])) return null;
    if (this._option_string_actions.has(argString)) return [[this._option_string_actions.get(argString), argString, null, null]];
    if (a.length === 1) return null;
    const eq = argString.indexOf('=');
    if (eq !== -1) {
      const os = argString.slice(0, eq);
      if (this._option_string_actions.has(os)) return [[this._option_string_actions.get(os), os, '=', argString.slice(eq + 1)]];
    }
    const tuples = this._get_option_tuples(argString);
    if (tuples.length) return tuples;
    if (NEGATIVE_NUMBER.test(argString) && !this._has_negative_number_optionals.length) return null;
    if (argString.includes(' ')) return null;
    return [[null, argString, null, null]];
  }

  _get_option_tuples(optionString) {
    const result = [];
    const chars = this.prefix_chars;
    const oc = cps(optionString);
    const partition = (s) => {
      const i = s.indexOf('=');
      return i === -1 ? [s, null, null] : [s.slice(0, i), '=', s.slice(i + 1)];
    };
    if (chars.includes(oc[0]) && chars.includes(oc[1])) {
      if (truthy(this.allow_abbrev)) {
        const [prefix, sep, explicitArg] = partition(optionString);
        for (const [s, action] of this._option_string_actions) {
          if (s.startsWith(prefix)) result.push([action, s, sep, explicitArg]);
        }
      }
    } else if (chars.includes(oc[0]) && !chars.includes(oc[1])) {
      const [prefix, sep, explicitArg] = partition(optionString);
      const shortPrefix = oc.slice(0, 2).join('');
      const shortExplicit = oc.slice(2).join('');
      for (const [s, action] of this._option_string_actions) {
        if (s === shortPrefix) result.push([action, s, '', shortExplicit]);
        else if (truthy(this.allow_abbrev) && s.startsWith(prefix)) result.push([action, s, sep, explicitArg]);
      }
    } else throw new ArgumentError(null, `unexpected option string: ${optionString}`);
    return result;
  }

  _get_nargs_pattern(action) {
    const nargs = action.nargs;
    const option = action.option_strings.length > 0;
    if (nargs === null) return option ? '([A])' : '(-*A-*)';
    if (nargs === OPTIONAL) return option ? '(A?)' : '(-*A?-*)';
    if (nargs === ZERO_OR_MORE) return option ? '(A*)' : '(-*[A-]*)';
    if (nargs === ONE_OR_MORE) return option ? '(A+)' : '(-*A[A-]*)';
    if (nargs === REMAINDER) return option ? '([AO]*)' : '(.*)';
    if (nargs === PARSER) return option ? '(A[AO]*)' : '(-*A[-AO]*)';
    if (nargs === SUPPRESS) return option ? '()' : '(-*)';
    const n = Number(nargs === true ? 1n : nargs === false ? 0n : nargs);
    return option ? `([AO]{${n}})` : `((?:-*A){${n}}-*)`;
  }

  parse_intermixed_args(args = null, namespace = null) {
    const [ns, argv] = this.parse_known_intermixed_args(args, namespace);
    if (argv.length) {
      const msg = `unrecognized arguments: ${argv.join(' ')}`;
      if (truthy(this.exit_on_error)) this.error(msg);
      else throw new ArgumentError(null, msg);
    }
    return ns;
  }

  parse_known_intermixed_args(args = null, namespace = null) {
    const bad = this._get_positional_actions().filter((a) => a.nargs === PARSER || a.nargs === REMAINDER);
    if (bad.length) raise('TypeError', `parse_intermixed_args: positional arg with nargs=${pyStr(bad[0].nargs)}`);
    return this._parse_known_args2(args, namespace, true);
  }

  _get_values(action, argStrings) {
    let value;
    if (!argStrings.length && action.nargs === OPTIONAL) {
      value = action.option_strings.length ? action.const : action.default;
      if (typeof value === 'string') {
        value = this._get_value(action, value);
        this._check_value(action, value);
      }
    } else if (!argStrings.length && action.nargs === ZERO_OR_MORE && !action.option_strings.length) {
      if (action.default !== null) {
        value = action.default;
        this._check_value(action, value);
      } else value = argStrings;
    } else if (argStrings.length === 1 && (action.nargs === null || action.nargs === OPTIONAL)) {
      value = this._get_value(action, argStrings[0]);
      this._check_value(action, value);
    } else if (action.nargs === REMAINDER) {
      value = argStrings.map((v) => this._get_value(action, v));
    } else if (action.nargs === PARSER) {
      value = argStrings.map((v) => this._get_value(action, v));
      this._check_value(action, value[0]);
    } else if (action.nargs === SUPPRESS) {
      value = SUPPRESS;
    } else {
      value = argStrings.map((v) => this._get_value(action, v));
      for (const v of value) this._check_value(action, v);
    }
    return value;
  }

  _get_value(action, argString) {
    const typeFunc = this._registry_get('type', action.type, action.type);
    if (!isCallable(typeFunc)) throw new ArgumentError(action, `${pyRepr(typeFunc)} is not callable`);
    try {
      return callFn(typeFunc, argString === SUPPRESS && typeFunc !== IDENTITY ? '==SUPPRESS==' : argString);
    } catch (err) {
      if (err instanceof ArgumentTypeError) throw new ArgumentError(action, err.message);
      if (err instanceof PyException && VALUE_OR_TYPE_ERRORS.has(err.name)) {
        const name = hasName(action.type) ? nameOf(action.type) : pyRepr(action.type);
        throw new ArgumentError(action, `invalid ${name} value: ${pyRepr(argString)}`);
      }
      throw err;
    }
  }

  _check_value(action, value) {
    const choices = action.choices;
    if (choices !== null) {
      const ok = typeof choices === 'string'
        ? cps(choices).some((c) => pyEq(c, value))
        : pyContains(choices, value);
      if (!ok) {
        const msg = `invalid choice: ${pyRepr(pyStr(value))} (choose from ${pyIter(action.choices).map(pyStr).join(', ')})`;
        throw new ArgumentError(action, msg);
      }
    }
  }

  format_usage() {
    const formatter = this._get_formatter();
    formatter.add_usage(this.usage, this._actions, this._mutually_exclusive_groups);
    return formatter.format_help();
  }

  format_help() {
    const formatter = this._get_formatter();
    formatter.add_usage(this.usage, this._actions, this._mutually_exclusive_groups);
    formatter.add_text(this.description);
    for (const group of this._action_groups) {
      formatter.start_section(group.title);
      formatter.add_text(group.description);
      formatter.add_arguments(group._group_actions);
      formatter.end_section();
    }
    formatter.add_text(this.epilog);
    return formatter.format_help();
  }

  // formatter_class: a HelpFormatter subclass, or a factory function
  // (Python: formatter_class=lambda prog: HelpFormatter(prog, width=60))
  _get_formatter() {
    const fc = this.formatter_class;
    if (fc === HelpFormatter || (fc && fc.prototype instanceof HelpFormatter)) return new fc(this.prog);
    if (fc && fc.factory) return fc.factory(this.prog);
    raise('TypeError', `'${pyTypeName(fc)}' object is not callable`);
  }

  print_usage(file = null) { this._print_message(this.format_usage(), file === null ? sys.stdout : file); }
  print_help(file = null) { this._print_message(this.format_help(), file === null ? sys.stdout : file); }
  _print_message(message, file = null) {
    if (message) (file || sys.stderr).write(message);
  }

  exit(status = 0n, message = null) {
    if (message) this._print_message(message, sys.stderr);
    sysExit(status);
  }

  error(message) {
    this.print_usage(sys.stderr);
    this.exit(2n, `${pyStr(this.prog)}: error: ${pyStr(message)}\n`);
  }

  _warning(message) {
    this._print_message(`${pyStr(this.prog)}: warning: ${pyStr(message)}\n`, sys.stderr);
  }
}
ArgumentParser.pyName = 'ArgumentParser';
ArgumentParser.pyModule = 'argparse';

// formatter_class=lambda prog: Cls(prog, **opts)
export const formatterFactory = (Cls, opts) => ({ factory: (prog) => new Cls(prog, opts) });

// Python's own conversions, exported for emulators
export { pyRepr, pyStr, PyTuple, PyDict, PyRange, PyFloat, PyCallable, StringIO };
