// utils/emulators/python/stdlib/html/_pyhtml.js
//
// Line-by-line port of CPython 3.13's Lib/html/__init__.py — escape() and
// unescape() — shared by the html module hub and member emulators. Not a
// content page (leading underscore), so the catalog generator never maps it.
//
// unescape() uses the full WHATWG named-reference table (html.entities.html5,
// generated into _entities.js), the numeric-reference rules of the HTML5
// tokenizer (Windows-1252 remapping of &#128;-&#159;, U+FFFD for 0, for
// surrogates and for anything above 0x10FFFF, '' for noncharacters and most
// controls) and Python's int() digit limit for huge decimal references.

import { NAMED, LEGACY } from './_entities.js';
import { PyException } from '../../../../py-exceptions.js';

export function escape(s, quote = true) {
  s = s.replaceAll('&', '&amp;'); // must be done first
  s = s.replaceAll('<', '&lt;');
  s = s.replaceAll('>', '&gt;');
  if (quote) {
    s = s.replaceAll('"', '&quot;');
    s = s.replaceAll("'", '&#x27;');
  }
  return s;
}

// html._invalid_charrefs — numeric references the HTML5 spec remaps
const INVALID_CHARREFS = new Map([
  [0x00, 0xfffd], [0x0d, 0x0d], [0x80, 0x20ac], [0x81, 0x81], [0x82, 0x201a],
  [0x83, 0x0192], [0x84, 0x201e], [0x85, 0x2026], [0x86, 0x2020], [0x87, 0x2021],
  [0x88, 0x02c6], [0x89, 0x2030], [0x8a, 0x0160], [0x8b, 0x2039], [0x8c, 0x0152],
  [0x8d, 0x8d], [0x8e, 0x017d], [0x8f, 0x8f], [0x90, 0x90], [0x91, 0x2018],
  [0x92, 0x2019], [0x93, 0x201c], [0x94, 0x201d], [0x95, 0x2022], [0x96, 0x2013],
  [0x97, 0x2014], [0x98, 0x02dc], [0x99, 0x2122], [0x9a, 0x0161], [0x9b, 0x203a],
  [0x9c, 0x0153], [0x9d, 0x9d], [0x9e, 0x017e], [0x9f, 0x0178],
]);

// html._invalid_codepoints — references to these produce ''
function isInvalidCodepoint(n) {
  return (
    (n >= 0x1 && n <= 0x8) ||
    n === 0xb ||
    (n >= 0xe && n <= 0x1f) ||
    (n >= 0x7f && n <= 0x9f) ||
    (n >= 0xfdd0 && n <= 0xfdef) ||
    (n <= 0x10ffff && (n & 0xfffe) === 0xfffe)
  );
}

// sys.get_int_max_str_digits() default: int('<more than 4300 digits>') fails
const INT_MAX_STR_DIGITS = 4300;

function replaceCharref(s) {
  if (s[0] === '#') {
    // numeric charref
    let num;
    if (s[1] === 'x' || s[1] === 'X') {
      num = BigInt('0x' + s.slice(2).replace(/;+$/, ''));
    } else {
      const digits = s.slice(1).replace(/;+$/, '');
      if (digits.length > INT_MAX_STR_DIGITS) {
        throw new PyException(
          'ValueError',
          `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${digits.length} digits; use sys.set_int_max_str_digits() to increase the limit`,
        );
      }
      num = BigInt(digits);
    }
    if (num <= 0x9fn && INVALID_CHARREFS.has(Number(num))) {
      return String.fromCodePoint(INVALID_CHARREFS.get(Number(num)));
    }
    if ((num >= 0xd800n && num <= 0xdfffn) || num > 0x10ffffn) return '�';
    const n = Number(num);
    if (isInvalidCodepoint(n)) return '';
    return String.fromCodePoint(n);
  }
  // named charref
  const cps = Array.from(s);
  if (lookup(s) !== undefined) return lookup(s);
  // find the longest matching name (as defined by the standard)
  for (let x = cps.length - 1; x > 1; x--) {
    const prefix = cps.slice(0, x).join('');
    const v = lookup(prefix);
    if (v !== undefined) return v + cps.slice(x).join('');
  }
  return '&' + s;
}

// html5[name] — name with its ';' if it has one
function lookup(name) {
  if (name.endsWith(';')) {
    const k = name.slice(0, -1);
    return Object.prototype.hasOwnProperty.call(NAMED, k) ? NAMED[k] : undefined;
  }
  return LEGACY.has(name) ? NAMED[name] : undefined;
}

const CHARREF = /&(#[0-9]+;?|#[xX][0-9a-fA-F]+;?|[^\t\n\f <&#;]{1,32};?)/gu;

export function unescape(s) {
  if (!s.includes('&')) return s;
  return s.replace(CHARREF, (whole, ref) => replaceCharref(ref));
}

// names of html.entities.html5 (with their ';' where they have one) — for demos
export function html5Has(name) {
  return lookup(name) !== undefined;
}
