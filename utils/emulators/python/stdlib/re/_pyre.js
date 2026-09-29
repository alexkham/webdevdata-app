// utils/emulators/python/stdlib/re/_pyre.js
//
// Port of CPython 3.13's regular expression engine for the re demos —
// shared by the re module hub and member emulators. Not a content page
// (leading underscore), so the catalog generator never maps it.
//
//   parser    Lib/re/_parser.py, line by line: same parse tree, same
//             re.PatternError messages and positions
//   compiler  Lib/re/_compiler.py: same opcodes, same case-folding and
//             charset rules (charset bitmaps kept as side tables)
//   matcher   Modules/_sre/sre_lib.h SRE(match) / SRE(search): the same
//             backtracking machine, contexts, mark save/restore and
//             zero-width-repeat protection, driven by an explicit stack
//             (generators) instead of recursion
//   _sre.c    search / match / fullmatch / findall / finditer / split /
//             sub / subn / scanner, Match and Pattern objects and reprs
//
// It is NOT a translation to JS RegExp: sre semantics (Unicode \w \d \s,
// case folding, empty-match rules, capture marks after backtracking)
// differ from ECMAScript. Verified against CPython 3.13 by fuzzing: ~205,000
// random (pattern, strings, flags, template, count, pos, endpos) cases,
// ~6.4 million compared results (compile errors, search / match /
// fullmatch with and without pos/endpos, findall, finditer, split, subn,
// expand, Pattern/Match reprs) — 0 mismatches. The Unicode tables below
// were compared for all 0x110000 code points.
//
// str patterns only (no bytes). Not supported: \N{name} escapes (needs the
// Unicode name database) — they raise an emulator error. A match that needs
// more than MAX_STEPS machine steps (catastrophic backtracking) is stopped
// with an emulator error instead of hanging the page.
//
// Python value model for demo output: str → string, int → number,
// None → null, tuple → { __pyTuple }, list → Array; Pattern and Match
// objects render their exact repr through a __pyRaw getter.

import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

// generated from CPython 3.13 (Unicode 15.1): str.isalnum() or "_", str.isdecimal(),
// _sre.unicode_tolower, first code point of str.upper()
const T_WORD = '30.9,8.19,5.0,2.19,30.0,8.1,2.0,4.1,2.2,2.16,2.1e,2.1c9,5.b,f.4,8.0,2.0,82.4,2.1,3.3,2.0,7.0,2.2,2.0,2.13,2.52,2.8a,9.a5,2.25,3.0,7.28,48.1a,5.3,2e.2a,16.9,5.1,2.62,2.0,10.1,8.e,3.0,11.0,2.1d,1e.58,c.0,f.2a,a.1,5.0,6.15,5.0,a.0,4.0,18.18,8.a,6.17,2.5,12.29,3b.35,4.0,13.0,8.9,5.9,2.f,5.7,3.1,3.15,2.6,2.0,4.3,4.0,11.0,e.1,2.2,5.b,3.5,3.0,9.5,5.1,3.15,2.6,2.1,2.1,2.1,20.3,2.0,8.9,3.2,11.8,2.2,2.15,2.6,2.1,2.4,4.0,13.0,10.1,5.9,a.0,c.7,3.1,3.15,2.6,2.1,2.4,4.0,1f.1,2.2,5.9,2.6,c.0,2.5,4.2,2.3,4.1,2.0,2.1,4.1,4.2,4.b,17.0,16.c,13.7,2.2,2.16,2.f,4.0,1b.2,3.0,3.1,5.9,9.6,2.0,5.7,2.2,2.16,2.9,2.4,4.0,20.1,2.1,5.9,2.1,12.8,2.2,2.28,3.0,11.0,6.2,2.9,5.12,2.5,6.11,4.17,2.8,2.0,3.6,20.9,12.2f,2.1,d.6,a.9,28.1,2.0,2.4,2.17,2.0,2.9,2.1,a.0,3.4,2.0,a.9,3.3,21.0,20.13,d.7,2.23,1c.4,74.2a,15.a,7.5,5.3,4.0,4.1,8.2,5.c,d.0,2.9,7.25,2.0,6.0,3.2a,2.14c,2.3,3.6,2.0,2.3,3.28,2.3,3.20,2.3,3.6,2.0,2.3,3.e,2.38,2.3,3.42,f.13,4.f,11.55,3.5,4.26b,3.10,2.19,6.4a,4.a,8.11,e.12,f.11,f.c,2.2,10.33,24.0,5.0,4.9,7.9,17.9,7.58,8.4,3.21,2.0,6.45,b.1e,28.27,3.4,c.2b,5.19,7.a,26.16,a.34,2c.9,7.9,e.0,5e.2e,12.7,4.9,2a.1d,e.37,1b.23,1d.9,4.30,3.8,8.2a,3.2,2a.3,2.5,2.1,4.0,6.bf,41.115,3.5,3.25,3.5,3.7,2.0,2.0,2.0,2.1e,3.34,2.6,2.0,4.2,2.6,4.3,3.5,5.c,6.2,2.6,74.1,3.5,6.a,7.c,66.0,5.0,3.9,2.0,4.4,7.0,2.0,2.0,2.3,2.a,3.3,6.4,5.0,2.39,2d7.3b,4f.15,277.1d,46d.e4,7.3,4.1,a.0,3.25,2.0,6.0,3.37,8.0,11.16,a.6,2.6,2.6,2.6,2.6,2.6,2.6,2.6,51.0,1d6.2,1a.8,8.4,3.4,5.55,7.2,2.59,2.3,6.2a,2.5d,4.3,b.1f,31.f,21.9,1f.7,2.e,21.9,28.e,141.19bf,41.568c,44.2d,3.10c,4.1b,15.2e,11.1e,3.4f,28.8,3.66,3.3f,6.1,2.0,2.4,19.f,2.2,2.3,2.16,e.5,b.33,f.31,1d.9,19.5,4.0,2.1,2.25,b.16,1a.1c,8.2e,1d.a,7.4,2.18,2.28,18.2,2.7,5.9,7.16,4.0,4.31,2.0,4.1,3.4,3.0,2.0,19.2,3.a,8.2,d.5,3.5,3.5,a.6,2.6,2.2a,2.d,7.72,e.9,7.2ba3,d.16,5.30,2105.16d,3.69,27.6,d.4,6.0,2.9,2.c,2.4,2.0,2.1,2.1,2.6b,22.16a,13.3f,3.35,29.b,75.4,2.86,14.9,8.19,7.19,c.58,4.5,3.5,3.5,3.2,24.b,2.19,2.12,2.1,2.e,3.d,23.7a,d.2c,d.38,12.1,f5.1c,4.30,11.1a,5.23,a.1d,6.25,b.1d,3.23,5.7,2.4,2b.9d,3.9,7.23,5.23,5.27,9.33,d.a,2.e,2.6,2.1,2.a,2.e,2.6,2.1,44.136,a.15,b.7,19.5,2.29,2.8,46.5,3.0,2.2b,2.1,4.0,3.16,3.1e,3.25,9.8,31.12,2.1,6.20,5.19,47.37,5.13,3.2e,10.3,2.2,2.1c,b.8,18.1e,2.1f,21.7,2.1b,7.4,11.35,b.15,3.1a,6.19,18.6,51.48,38.32,e.32,8.29,d.9,127.1e,2.29,7.1,4f.27,9.15,c.3,1c.11,2f.1b,15.16,d.34,1b.1d,2.1,3.0,e.2c,21.18,8.9,a.23,10.9,5.0,3.0,9.22,4.0,d.2f,f.3,c.a,2.0,5.13,c.11,2.18,14.1,40.6,2.0,2.3,2.e,2.9,8.2e,12.9,c.7,3.1,3.15,2.6,2.1,2.4,4.0,13.0,d.4,9f.34,13.3,6.9,6.2,1f.2f,15.1,2.0,9.9,a7.2e,2a.3,25.2f,15.0,c.9,27.2a,e.0,8.9,37.1a,16.b,5.6,ba.2b,75.52,d.7,3.0,3.7,2.1,2.17,10.0,2.0,f.9,47.7,3.26,11.0,2.0,1d.0,b.27,8.0,16.0,c.2d,14.0,13.48,108.8,2.24,12.0,10.1c,6.1d,71.6,2.1,2.25,16.0,a.9,7.5,2.1,2.1f,f.0,8.9,137.12,10.0,2.c,2.21,1d.9,57.0,10.14,2c.399,67.6e,12.c3,a4d.60,10.42f,12.5,fba.246,21ba.238,8.1e,2.9,7.4e,2.9,7.1d,13.2f,11.3,d.9,2.6,2.14,6.12,2b1.56,6a.4a,6.0,43.c,41.1,2.0,1d.17f7,9.4d5,2b.8,22e8.3,2.6,2.1,2.122,10.0,1e.2,3.0,f.3,9.18b,905.6a,6.c,4.8,8.9,1627.13,d.13,6d.18,88.54,2.46,2.1,3.0,3.1,3.3,2.b,2.0,2.6,2.40,2.3,3.7,2.6,2.1b,2.3,2.4,2.0,4.6,2.153,3.18,2.18,2.1e,2.18,2.1e,2.18,2.1e,2.18,2.1e,2.18,2.7,3.31,701.1e,7.5,106.3d,93.2c,b.6,3.9,5.0,142.1d,13.2b,5.9,1d7.1b,5.9,2e7.6,2.3,2.1,2.e,2.c4,3.8,31.43,8.0,5.9,318.3a,2.2,2.3,4d.2c,2.e,c3.3,2.1a,2.1,2.0,3.0,2.9,2.3,2.0,2.0,7.0,5.0,2.0,2.0,2.2,2.1,2.0,3.0,2.0,2.0,2.0,2.0,2.1,2.0,3.3,2.6,2.3,2.3,2.0,2.9,2.10,6.2,2.4,2.10,245.c,ae4.9,407.a6df,21.1039,7.dd,3.1681,f.1d30,10.26d,9a3.21d,5e3.134a,6.105f';
const T_DEC = '30.9,627.9,87.9,c7.9,19d.9,77.9,77.9,77.9,77.9,77.9,77.9,77.9,77.9,77.9,61.9,77.9,47.9,117.9,47.9,747.9,27.9,12d.9,81.9,a7.9,7.9,b7.9,57.9,87.9,7.9,89c7.9,2a7.9,27.9,c7.9,17.9,57.9,197.9,5317.9,587.9,887.9,32d.9,81.9,3d.9,91.9,117.9,157.9,77.9,177.9,67.9,67.9,1a7.9,67.9,2f7.9,f7.9,47.9,1a7.9,4b07.9,57.9,87.9,6c75.31,941.9,1a7.9,1f7.9,457.9,1297.9';
const T_LOWER = '41.1a.1.32,7f.17.1.32,18.7.1.32,28.18.2.1,30.1.1.-199,2.3.2.1,7.8.2.1,11.17.2.1,2e.1.1.-121,1.3.2.1,8.1.1.210,1.2.2.1,4.1.1.206,1.1.1.1,2.2.1.205,2.1.1.1,3.1.1.79,1.1.1.202,1.1.1.203,1.1.1.1,2.1.1.205,1.1.1.207,2.1.1.211,1.1.1.209,1.1.1.1,4.1.1.211,1.1.1.213,2.1.1.214,1.3.2.1,6.1.1.218,1.1.1.1,2.1.1.218,3.1.1.1,2.1.1.218,1.1.1.1,2.2.1.217,2.2.2.1,4.1.1.219,1.1.1.1,4.1.1.1,8.1.1.2,1.1.1.1,2.1.1.2,1.1.1.1,2.1.1.2,1.9.2.1,13.9.2.1,13.1.1.2,1.2.2.1,4.1.1.-97,1.1.1.-56,1.14.2.1,28.1.1.-130,2.9.2.1,18.1.1.10795,1.1.1.1,2.1.1.-163,1.1.1.10792,3.1.1.1,2.1.1.-195,1.1.1.69,1.1.1.71,1.5.2.1,12a.2.2.1,6.1.1.1,9.1.1.116,7.1.1.38,2.3.1.37,4.1.1.64,2.2.1.63,3.11.1.32,12.9.1.32,2c.1.1.8,9.c.2.1,1c.1.1.-60,3.1.1.1,2.1.1.-7,1.1.1.1,3.3.1.-130,3.10.1.80,10.20.1.32,50.11.2.1,2a.1b.2.1,36.1.1.15,1.7.2.1,f.30.2.1,61.26.1.48,b6f.26.1.7264,27.1.1.7264,6.1.1.7264,2d3.50.1.38864,50.6.1.8,8a0.2b.1.-3008,2d.3.1.-3008,143.4b.2.1,9e.1.1.-7615,2.30.2.1,68.8.1.-8,10.6.1.-8,10.8.1.-8,10.8.1.-8,10.6.1.-8,11.4.2.-8,f.8.1.-8,20.8.1.-8,10.8.1.-8,10.8.1.-8,10.2.1.-8,2.2.1.-74,2.1.1.-9,c.4.1.-86,4.1.1.-9,c.2.1.-8,2.2.1.-100,e.2.1.-8,2.2.1.-112,2.1.1.-7,c.2.1.-128,2.2.1.-126,2.1.1.-9,12a.1.1.-7517,4.1.1.-8383,1.1.1.-8262,7.1.1.28,2e.10.1.16,23.1.1.1,333.1a.1.26,74a.30.1.48,60.1.1.1,2.1.1.-10743,1.1.1.-3814,1.1.1.-10727,3.3.2.1,6.1.1.-10780,1.1.1.-10749,1.1.1.-10783,1.1.1.-10782,2.1.1.1,3.1.1.1,9.2.1.-10815,2.32.2.1,6b.2.2.1,7.1.1.1,794e.17.2.1,40.e.2.1,a2.7.2.1,10.1f.2.1,47.2.2.1,4.1.1.-35332,1.5.2.1,d.1.1.1,2.1.1.-42280,3.2.2.1,6.a.2.1,14.1.1.-42308,1.1.1.-42319,1.1.1.-42315,1.1.1.-42305,1.1.1.-42308,2.1.1.-42258,1.1.1.-42282,1.1.1.-42261,1.1.1.928,1.8.2.1,10.1.1.-48,1.1.1.-42307,1.1.1.-35384,1.2.2.1,9.1.1.1,6.2.2.1,1f.1.1.1,572c.1a.1.32,4df.28.1.40,b0.24.1.40,c0.b.1.39,c.f.1.39,10.7.1.39,8.2.1.39,6ec.33.1.64,c20.20.1.32,55a0.20.1.32,7ac0.22.1.34';
const T_UPPER = '61.1a.1.-32,54.1.1.743,2a.1.1.-140,1.17.1.-32,18.7.1.-32,7.1.1.121,2.18.2.-1,30.1.1.-232,2.3.2.-1,7.8.2.-1,f.1.1.371,2.17.2.-1,2f.3.2.-1,5.1.1.-300,1.1.1.195,3.2.2.-1,5.1.1.-1,4.1.1.-1,6.1.1.-1,3.1.1.97,4.1.1.-1,1.1.1.163,4.1.1.130,3.3.2.-1,7.1.1.-1,5.1.1.-1,3.1.1.-1,4.2.2.-1,5.1.1.-1,4.1.1.-1,2.1.1.56,6.1.1.-1,1.1.1.-2,2.1.1.-1,1.1.1.-2,2.1.1.-1,1.1.1.-2,2.8.2.-1,f.1.1.-79,2.9.2.-1,11.1.1.-422,2.1.1.-1,1.1.1.-2,2.1.1.-1,4.14.2.-1,2a.9.2.-1,19.1.1.-1,3.2.1.10815,3.1.1.-1,5.5.2.-1,9.1.1.10783,1.1.1.10780,1.1.1.10782,1.1.1.-210,1.1.1.-206,2.2.1.-205,3.1.1.-202,2.1.1.-203,1.1.1.42319,4.1.1.-205,1.1.1.42315,2.1.1.-207,2.1.1.42280,1.1.1.42308,2.1.1.-209,1.1.1.-211,1.1.1.42308,1.1.1.10743,1.1.1.42305,3.1.1.-211,2.1.1.10749,1.1.1.-213,3.1.1.-214,8.1.1.10727,3.1.1.-218,2.1.1.42307,1.1.1.-218,4.1.1.42282,1.1.1.-218,1.1.1.-69,1.2.1.-217,2.1.1.-71,6.1.1.-219,b.1.1.42261,1.1.1.42258,a7.1.1.84,2c.2.2.-1,6.1.1.-1,4.3.1.130,15.1.1.9,1c.1.1.-38,1.3.1.-37,3.1.1.-11,1.11.1.-32,11.1.1.-31,1.9.1.-32,9.1.1.-64,1.2.1.-63,3.1.1.-62,1.1.1.-57,4.1.1.-47,1.1.1.-54,1.1.1.-8,2.c.2.-1,17.1.1.-86,1.1.1.-80,1.1.1.7,1.1.1.-116,2.1.1.-96,3.1.1.-1,3.1.1.-1,35.20.1.-32,20.10.1.-80,11.11.2.-1,2a.1b.2.-1,37.7.2.-1,d.1.1.-15,2.30.2.-1,90.26.1.-48,26.1.1.-82,b49.2b.1.3008,2d.3.1.3008,2fb.6.1.-8,888.1.1.-6254,1.1.1.-6253,1.1.1.-6244,1.2.1.-6242,2.1.1.-6243,1.1.1.-6236,1.1.1.-6181,1.1.1.35266,f1.1.1.35332,4.1.1.3814,11.1.1.35384,73.4b.2.-1,95.1.1.-7758,1.1.1.-7747,1.1.1.-7745,1.1.1.-7744,1.1.1.-7769,1.1.1.-59,6.30.2.-1,5f.8.1.8,10.6.1.8,10.8.1.8,10.8.1.8,10.6.1.8,10.1.1.-7083,1.1.1.8,1.1.1.-7085,1.1.1.8,1.1.1.-7087,1.1.1.8,1.1.1.-7089,1.1.1.8,9.8.1.8,10.2.1.74,2.4.1.86,4.2.1.100,2.2.1.128,2.2.1.112,2.2.1.126,4.8.1.-120,8.8.1.-128,8.8.1.-104,8.8.1.-112,8.8.1.-56,8.8.1.-64,8.3.1.8,3.1.1.-7202,1.1.1.-7214,2.1.1.-7205,1.1.1.-7206,5.1.1.-7211,2.1.1.-7205,4.1.1.8,1.1.1.-7212,1.1.1.-7227,2.1.1.-7215,1.1.1.-7216,5.1.1.-7221,4.2.1.8,2.1.1.-7225,1.1.1.-7226,3.1.1.-7229,1.1.1.-7230,9.2.1.8,2.1.1.-7229,1.1.1.-7230,1.1.1.-7235,1.1.1.7,1.1.1.-7233,1.1.1.-7234,b.1.1.8,1.1.1.-7242,1.1.1.-7269,2.1.1.-7245,1.1.1.-7246,5.1.1.-7251,152.1.1.-28,22.10.1.-16,14.1.1.-1,34c.1a.1.-26,760.30.1.-48,31.1.1.-1,4.1.1.-10795,1.1.1.-10792,2.3.2.-1,b.1.1.-1,3.1.1.-1,b.32.2.-1,6b.2.2.-1,7.1.1.-1,d.26.1.-7264,27.1.1.-7264,6.1.1.-7264,7914.17.2.-1,40.e.2.-1,a2.7.2.-1,10.1f.2.-1,47.2.2.-1,5.5.2.-1,d.1.1.-1,5.2.2.-1,3.1.1.48,3.a.2.-1,1e.8.2.-1,13.2.2.-1,9.1.1.-1,6.2.2.-1,1f.1.1.-1,35d.1.1.-928,1d.50.1.-38864,4f90.1.1.-64186,1.1.1.-64187,1.1.1.-64188,1.1.1.-64189,1.1.1.-64190,1.1.1.-64178,1.1.1.-64179,d.1.1.-62927,1.1.1.-62928,1.1.1.-62929,1.1.1.-62920,1.1.1.-62931,42a.1a.1.-32,4e7.28.1.-40,b0.24.1.-40,bf.b.1.-39,c.f.1.-39,10.7.1.-39,8.2.1.-39,705.33.1.-64,c00.20.1.-32,55a0.20.1.-32,7ac2.22.1.-34';

// ─── Unicode predicates (exactly _sre's, from the tables above) ──────
function decodeRanges(src) {
  const out = [];
  let prev = 0;
  for (const part of src.split(',')) {
    const [gap, len] = part.split('.').map((x) => parseInt(x, 16));
    const a = prev + gap;
    out.push(a, a + len);
    prev = a + len;
  }
  return out; // flat [lo0, hi0, lo1, hi1, …]
}
function decodeRuns(src) {
  const m = new Map();
  let prev = 0;
  for (const part of src.split(',')) {
    const [gap, n, step, delta] = part.split('.');
    const c0 = prev + parseInt(gap, 16);
    const count = parseInt(n, 16);
    const st = Number(step);
    const d = Number(delta);
    for (let i = 0; i < count; i++) m.set(c0 + i * st, c0 + i * st + d);
    prev = c0;
  }
  return m;
}
function inRanges(r, c) {
  let lo = 0;
  let hi = r.length / 2 - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (c < r[2 * mid]) hi = mid - 1;
    else if (c > r[2 * mid + 1]) lo = mid + 1;
    else return true;
  }
  return false;
}
const WORD_R = decodeRanges(T_WORD);
const DEC_R = decodeRanges(T_DEC);
const LOWER_M = decodeRuns(T_LOWER);
const UPPER_M = decodeRuns(T_UPPER);
// str.isspace(): bidirectional WS/B/S or category Zs
const SPACE_R = [9, 13, 28, 32, 133, 133, 160, 160, 5760, 5760, 8192, 8202, 8232, 8233, 8239, 8239, 8287, 8287, 12288, 12288];

const uniIsWord = (c) => inRanges(WORD_R, c);
const uniIsDigit = (c) => inRanges(DEC_R, c);
const uniIsSpace = (c) => inRanges(SPACE_R, c);
const uniLower = (c) => (LOWER_M.has(c) ? LOWER_M.get(c) : c);
const uniUpper = (c) => (UPPER_M.has(c) ? UPPER_M.get(c) : c);
const uniIsCased = (c) => uniLower(c) !== c || uniUpper(c) !== c;

const asciiIsDigit = (c) => c >= 48 && c <= 57;
const asciiIsAlpha = (c) => (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
const asciiIsWord = (c) => c < 128 && (asciiIsDigit(c) || asciiIsAlpha(c) || c === 95);
const asciiIsSpace = (c) => (c >= 9 && c <= 13) || c === 32;
const asciiLower = (c) => (c >= 65 && c <= 90 ? c + 32 : c);
const asciiIsCased = (c) => c < 128 && asciiIsAlpha(c);

// Lib/re/_casefix.py: lowercased code → other lowercased codes with the
// same uppercase
const EXTRA_CASES = new Map([
  [0x0069, [0x0131]], [0x0073, [0x017f]], [0x00b5, [0x03bc]], [0x0131, [0x0069]],
  [0x017f, [0x0073]], [0x0345, [0x03b9, 0x1fbe]], [0x0390, [0x1fd3]], [0x03b0, [0x1fe3]],
  [0x03b2, [0x03d0]], [0x03b5, [0x03f5]], [0x03b8, [0x03d1]], [0x03b9, [0x0345, 0x1fbe]],
  [0x03ba, [0x03f0]], [0x03bc, [0x00b5]], [0x03c0, [0x03d6]], [0x03c1, [0x03f1]],
  [0x03c2, [0x03c3]], [0x03c3, [0x03c2]], [0x03c6, [0x03d5]], [0x03d0, [0x03b2]],
  [0x03d1, [0x03b8]], [0x03d5, [0x03c6]], [0x03d6, [0x03c0]], [0x03f0, [0x03ba]],
  [0x03f1, [0x03c1]], [0x03f5, [0x03b5]], [0x0432, [0x1c80]], [0x0434, [0x1c81]],
  [0x043e, [0x1c82]], [0x0441, [0x1c83]], [0x0442, [0x1c84, 0x1c85]], [0x044a, [0x1c86]],
  [0x0463, [0x1c87]], [0x1c80, [0x0432]], [0x1c81, [0x0434]], [0x1c82, [0x043e]],
  [0x1c83, [0x0441]], [0x1c84, [0x0442, 0x1c85]], [0x1c85, [0x0442, 0x1c84]], [0x1c86, [0x044a]],
  [0x1c87, [0x0463]], [0x1c88, [0xa64b]], [0x1e61, [0x1e9b]], [0x1e9b, [0x1e61]],
  [0x1fbe, [0x0345, 0x03b9]], [0x1fd3, [0x0390]], [0x1fe3, [0x03b0]], [0xa64b, [0x1c88]],
  [0xfb05, [0xfb06]], [0xfb06, [0xfb05]],
]);

// ─── constants (Lib/re/_constants.py) ────────────────────────────────
const FAILURE = 0, SUCCESS = 1, ANY = 2, ANY_ALL = 3, ASSERT = 4, ASSERT_NOT = 5, AT = 6,
  BRANCH = 7, CATEGORY = 8, CHARSET = 9, BIGCHARSET = 10, GROUPREF = 11, GROUPREF_EXISTS = 12,
  IN = 13, INFO = 14, JUMP = 15, LITERAL = 16, MARK = 17, MAX_UNTIL = 18, MIN_UNTIL = 19,
  NOT_LITERAL = 20, NEGATE = 21, RANGE = 22, REPEAT = 23, REPEAT_ONE = 24, SUBPATTERN = 25,
  MIN_REPEAT_ONE = 26, ATOMIC_GROUP = 27, POSSESSIVE_REPEAT = 28, POSSESSIVE_REPEAT_ONE = 29,
  GROUPREF_IGNORE = 30, IN_IGNORE = 31, LITERAL_IGNORE = 32, NOT_LITERAL_IGNORE = 33,
  GROUPREF_UNI_IGNORE = 38, IN_UNI_IGNORE = 39, LITERAL_UNI_IGNORE = 40,
  NOT_LITERAL_UNI_IGNORE = 41, RANGE_UNI_IGNORE = 42,
  MIN_REPEAT = 43, MAX_REPEAT = 44; // parser-only

const AT_BEGINNING = 0, AT_BEGINNING_LINE = 1, AT_BEGINNING_STRING = 2, AT_BOUNDARY = 3,
  AT_NON_BOUNDARY = 4, AT_END = 5, AT_END_LINE = 6, AT_END_STRING = 7,
  AT_UNI_BOUNDARY = 10, AT_UNI_NON_BOUNDARY = 11;

const CATEGORY_DIGIT = 0, CATEGORY_NOT_DIGIT = 1, CATEGORY_SPACE = 2, CATEGORY_NOT_SPACE = 3,
  CATEGORY_WORD = 4, CATEGORY_NOT_WORD = 5, CATEGORY_LINEBREAK = 6, CATEGORY_NOT_LINEBREAK = 7,
  CATEGORY_UNI_DIGIT = 10, CATEGORY_UNI_NOT_DIGIT = 11, CATEGORY_UNI_SPACE = 12,
  CATEGORY_UNI_NOT_SPACE = 13, CATEGORY_UNI_WORD = 14, CATEGORY_UNI_NOT_WORD = 15,
  CATEGORY_UNI_LINEBREAK = 16, CATEGORY_UNI_NOT_LINEBREAK = 17;

const OP_IGNORE = { [LITERAL]: LITERAL_IGNORE, [NOT_LITERAL]: NOT_LITERAL_IGNORE };
const OP_UNICODE_IGNORE = { [LITERAL]: LITERAL_UNI_IGNORE, [NOT_LITERAL]: NOT_LITERAL_UNI_IGNORE };
const AT_MULTILINE = { [AT_BEGINNING]: AT_BEGINNING_LINE, [AT_END]: AT_END_LINE };
const AT_UNICODE = { [AT_BOUNDARY]: AT_UNI_BOUNDARY, [AT_NON_BOUNDARY]: AT_UNI_NON_BOUNDARY };
const CH_UNICODE = {
  [CATEGORY_DIGIT]: CATEGORY_UNI_DIGIT, [CATEGORY_NOT_DIGIT]: CATEGORY_UNI_NOT_DIGIT,
  [CATEGORY_SPACE]: CATEGORY_UNI_SPACE, [CATEGORY_NOT_SPACE]: CATEGORY_UNI_NOT_SPACE,
  [CATEGORY_WORD]: CATEGORY_UNI_WORD, [CATEGORY_NOT_WORD]: CATEGORY_UNI_NOT_WORD,
  [CATEGORY_LINEBREAK]: CATEGORY_UNI_LINEBREAK, [CATEGORY_NOT_LINEBREAK]: CATEGORY_UNI_NOT_LINEBREAK,
};

export const SRE_FLAG_IGNORECASE = 2;
export const SRE_FLAG_LOCALE = 4;
export const SRE_FLAG_MULTILINE = 8;
export const SRE_FLAG_DOTALL = 16;
export const SRE_FLAG_UNICODE = 32;
export const SRE_FLAG_VERBOSE = 64;
export const SRE_FLAG_DEBUG = 128;
export const SRE_FLAG_ASCII = 256;

export const MAXREPEAT = 4294967295;
const MAXGROUPS = 1073741823n;
const MAXCODE = 4294967295n;
const MAXWIDTH = 1n << 64n;
const MAX_STEPS = 10000000;

// ─── exceptions ──────────────────────────────────────────────────────
const cps = (s) => Array.from(s);
const cpLen = (s) => cps(s).length;

// re.PatternError (re.error): "msg at position N" plus "(line L, column C)"
// when the pattern contains a newline — _constants.PatternError.__init__
export class PatternError extends PyException {
  constructor(msg, pattern = null, pos = null) {
    let text = msg;
    let lineno = null;
    let colno = null;
    if (pattern !== null && pos !== null) {
      text = `${msg} at position ${pos}`;
      const chars = cps(pattern);
      let nl = 0;
      let last = -1;
      for (let i = 0; i < pos && i < chars.length; i++) {
        if (chars[i] === '\n') { nl += 1; last = i; }
      }
      lineno = nl + 1;
      colno = pos - last;
      if (chars.includes('\n')) text = `${text} (line ${lineno}, column ${colno})`;
    }
    super('re.PatternError', text);
    Object.assign(this, { msg, pattern, pos, lineno, colno });
  }
}
const pyErr = (type, msg) => new PyException(type, msg);

// emulator-only stop (catastrophic backtracking); not a Python exception
export class BacktrackLimit extends Error {
  constructor() {
    super(`more than ${MAX_STEPS.toLocaleString('en-US')} matching steps; this pattern backtracks too much to finish in the browser (catastrophic backtracking)`);
    this.name = 'Emulator stopped';
  }
}

// ─── tokenizer (_parser.Tokenizer) ───────────────────────────────────
const SPECIAL_CHARS = '.\\[{()*+?^$|';
const REPEAT_CHARS = '*+?{';
const DIGITS = new Set('0123456789');
const OCTDIGITS = new Set('01234567');
const HEXDIGITS = new Set('0123456789abcdefABCDEF');
const ASCIILETTERS = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const WHITESPACE = new Set(' \t\n\r\v\f');
const ord = (ch) => ch.codePointAt(0);

class Tokenizer {
  constructor(string) {
    this.string = string;
    this.chars = cps(string);
    this.index = 0;
    this.next = null;
    this._next();
  }
  _next() {
    let index = this.index;
    if (index >= this.chars.length) {
      this.next = null;
      return;
    }
    let ch = this.chars[index];
    if (ch === '\\') {
      index += 1;
      if (index >= this.chars.length) {
        throw new PatternError('bad escape (end of pattern)', this.string, this.chars.length - 1);
      }
      ch += this.chars[index];
    }
    this.index = index + 1;
    this.next = ch;
  }
  match(ch) {
    if (ch === this.next) {
      this._next();
      return true;
    }
    return false;
  }
  get() {
    const t = this.next;
    this._next();
    return t;
  }
  getwhile(n, charset) {
    let result = '';
    for (let i = 0; i < n; i++) {
      const c = this.next;
      if (c === null || !charset.has(c)) break;
      result += c;
      this._next();
    }
    return result;
  }
  getuntil(terminator, name) {
    let result = '';
    for (;;) {
      const c = this.next;
      this._next();
      if (c === null) {
        if (!result) throw this.error('missing ' + name);
        throw this.error(`missing ${terminator}, unterminated name`, cpLen(result));
      }
      if (c === terminator) {
        if (!result) throw this.error('missing ' + name, 1);
        break;
      }
      result += c;
    }
    return result;
  }
  tell() {
    return this.index - (this.next === null ? 0 : cpLen(this.next));
  }
  seek(index) {
    this.index = index;
    this._next();
  }
  error(msg, offset = 0) {
    return new PatternError(msg, this.string, this.tell() - offset);
  }
  checkgroupname(name, offset) {
    if (!isIdentifier(name)) {
      throw this.error(`bad character in group name ${pyStrRepr(name)}`, cpLen(name) + offset);
    }
  }
}

// str.isidentifier() (JS Unicode tables; may differ for characters newer
// than Unicode 15.1)
const isIdentifier = (s) => /^[\p{XID_Start}_]\p{XID_Continue}*$/u.test(s);
const isAlpha = (s) => /^\p{L}+$/u.test(s);
const isAsciiDecimal = (s) => /^[0-9]+$/.test(s);

// ─── parse tree (_parser.State / SubPattern) ─────────────────────────
class State {
  constructor() {
    this.flags = 0;
    this.groupdict = new Map();
    this.groupwidths = [null];
    this.lookbehindgroups = null;
    this.grouprefpos = new Map();
  }
  get groups() { return this.groupwidths.length; }
  opengroup(name = null) {
    const gid = this.groups;
    this.groupwidths.push(null);
    if (BigInt(this.groups) > MAXGROUPS) throw new PatternError('too many groups');
    if (name !== null) {
      if (this.groupdict.has(name)) {
        throw new PatternError(`redefinition of group name ${pyStrRepr(name)} as group ${gid}; was group ${this.groupdict.get(name)}`);
      }
      this.groupdict.set(name, gid);
    }
    return gid;
  }
  closegroup(gid, p) { this.groupwidths[gid] = p.getwidth(); }
  checkgroup(gid) { return gid < this.groups && this.groupwidths[gid] !== null; }
  checklookbehindgroup(gid, source) {
    if (this.lookbehindgroups !== null) {
      if (!this.checkgroup(gid)) throw source.error('cannot refer to an open group');
      if (gid >= this.lookbehindgroups) throw source.error('cannot refer to group defined in the same lookbehind subpattern');
    }
  }
}

const REPEATCODES = new Set([MIN_REPEAT, MAX_REPEAT, POSSESSIVE_REPEAT]);
const UNITCODES = new Set([ANY, RANGE, IN, LITERAL, NOT_LITERAL, CATEGORY]);
const bmin = (a, b) => (a < b ? a : b);
const bmax = (a, b) => (a > b ? a : b);

class SubPattern {
  constructor(state, data = null) {
    this.state = state;
    this.data = data || [];
    this.width = null;
  }
  get length() { return this.data.length; }
  getwidth() {
    if (this.width !== null) return this.width;
    let lo = 0n;
    let hi = 0n;
    for (const [op, av] of this.data) {
      if (op === BRANCH) {
        let i = MAXWIDTH;
        let j = 0n;
        for (const a of av[1]) {
          const [l, h] = a.getwidth();
          i = bmin(i, l);
          j = bmax(j, h);
        }
        lo += i;
        hi += j;
      } else if (op === ATOMIC_GROUP) {
        const [i, j] = av.getwidth();
        lo += i;
        hi += j;
      } else if (op === SUBPATTERN) {
        const [i, j] = av[3].getwidth();
        lo += i;
        hi += j;
      } else if (REPEATCODES.has(op)) {
        const [i, j] = av[2].getwidth();
        lo += i * BigInt(av[0]);
        if (av[1] === MAXREPEAT && j) hi = MAXWIDTH;
        else hi += j * BigInt(av[1]);
      } else if (UNITCODES.has(op)) {
        lo += 1n;
        hi += 1n;
      } else if (op === GROUPREF) {
        const [i, j] = this.state.groupwidths[av];
        lo += i;
        hi += j;
      } else if (op === GROUPREF_EXISTS) {
        let [i, j] = av[1].getwidth();
        if (av[2] !== null) {
          const [l, h] = av[2].getwidth();
          i = bmin(i, l);
          j = bmax(j, h);
        } else {
          i = 0n;
        }
        lo += i;
        hi += j;
      } else if (op === SUCCESS) {
        break;
      }
    }
    this.width = [bmin(lo, MAXWIDTH), bmin(hi, MAXWIDTH)];
    return this.width;
  }
}

// Python == on parse items: tuples/lists/ints by value, SubPattern by identity
function itemEq(a, b) {
  if (a === b) return true;
  if (a instanceof SubPattern || b instanceof SubPattern) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!itemEq(a[i], b[i])) return false;
    return true;
  }
  return false;
}
const itemKey = (it) => JSON.stringify(it);
function uniq(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const k = itemKey(it);
    if (!seen.has(k)) { seen.add(k); out.push(it); }
  }
  return out;
}

// ─── escapes ─────────────────────────────────────────────────────────
const ESCAPES = {
  '\\a': [LITERAL, 7], '\\b': [LITERAL, 8], '\\f': [LITERAL, 12], '\\n': [LITERAL, 10],
  '\\r': [LITERAL, 13], '\\t': [LITERAL, 9], '\\v': [LITERAL, 11], '\\\\': [LITERAL, 92],
};
const CATEGORIES = {
  '\\A': [AT, AT_BEGINNING_STRING],
  '\\b': [AT, AT_BOUNDARY],
  '\\B': [AT, AT_NON_BOUNDARY],
  '\\d': [IN, [[CATEGORY, CATEGORY_DIGIT]]],
  '\\D': [IN, [[CATEGORY, CATEGORY_NOT_DIGIT]]],
  '\\s': [IN, [[CATEGORY, CATEGORY_SPACE]]],
  '\\S': [IN, [[CATEGORY, CATEGORY_NOT_SPACE]]],
  '\\w': [IN, [[CATEGORY, CATEGORY_WORD]]],
  '\\W': [IN, [[CATEGORY, CATEGORY_NOT_WORD]]],
  '\\Z': [AT, AT_END_STRING],
};
const FLAGS = { i: SRE_FLAG_IGNORECASE, L: SRE_FLAG_LOCALE, m: SRE_FLAG_MULTILINE, s: SRE_FLAG_DOTALL, x: SRE_FLAG_VERBOSE, a: SRE_FLAG_ASCII, u: SRE_FLAG_UNICODE };
const hasFlag = (c) => c !== null && Object.prototype.hasOwnProperty.call(FLAGS, c);
const TYPE_FLAGS = SRE_FLAG_ASCII | SRE_FLAG_LOCALE | SRE_FLAG_UNICODE;
const GLOBAL_FLAGS = SRE_FLAG_DEBUG;

class Unsupported extends Error {
  constructor(what) {
    super(`${what} is not supported by this in-browser emulator`);
    this.name = 'Emulator limitation';
  }
}

// shared by _class_escape and _escape for \x \u \U; null = not handled
function hexEscape(source, escape, c) {
  if (c === 'x') {
    escape += source.getwhile(2, HEXDIGITS);
    if (cpLen(escape) !== 4) throw source.error(`incomplete escape ${escape}`, cpLen(escape));
    return [LITERAL, parseInt(escape.slice(2), 16)];
  }
  if (c === 'u') {
    escape += source.getwhile(4, HEXDIGITS);
    if (cpLen(escape) !== 6) throw source.error(`incomplete escape ${escape}`, cpLen(escape));
    return [LITERAL, parseInt(escape.slice(2), 16)];
  }
  if (c === 'U') {
    escape += source.getwhile(8, HEXDIGITS);
    if (cpLen(escape) !== 10) throw source.error(`incomplete escape ${escape}`, cpLen(escape));
    const v = parseInt(escape.slice(2), 16);
    if (v > 0x10ffff) throw source.error(`bad escape ${escape}`, cpLen(escape)); // chr() ValueError
    return [LITERAL, v];
  }
  if (c === 'N') throw new Unsupported('\\N{...} (named Unicode character)');
  return null;
}

function classEscape(source, escape) {
  if (ESCAPES[escape]) return ESCAPES[escape];
  const cat = CATEGORIES[escape];
  if (cat && cat[0] === IN) return cat;
  const c = cps(escape)[1];
  const hx = hexEscape(source, escape, c);
  if (hx) return hx;
  if (OCTDIGITS.has(c)) {
    escape += source.getwhile(2, OCTDIGITS);
    const v = parseInt(escape.slice(1), 8);
    if (v > 0o377) throw source.error(`octal escape value ${escape} outside of range 0-0o377`, cpLen(escape));
    return [LITERAL, v];
  }
  if (!DIGITS.has(c) && cpLen(escape) === 2) {
    if (ASCIILETTERS.has(c)) throw source.error(`bad escape ${escape}`, cpLen(escape));
    return [LITERAL, ord(c)];
  }
  throw source.error(`bad escape ${escape}`, cpLen(escape));
}

function escapeCode(source, escape, state) {
  if (CATEGORIES[escape]) return CATEGORIES[escape];
  if (ESCAPES[escape]) return ESCAPES[escape];
  const c = cps(escape)[1];
  const hx = hexEscape(source, escape, c);
  if (hx) return hx;
  if (c === '0') {
    escape += source.getwhile(2, OCTDIGITS);
    return [LITERAL, parseInt(escape.slice(1), 8)];
  }
  if (DIGITS.has(c)) {
    if (source.next !== null && DIGITS.has(source.next)) {
      escape += source.get();
      const e = cps(escape);
      if (OCTDIGITS.has(e[1]) && OCTDIGITS.has(e[2]) && source.next !== null && OCTDIGITS.has(source.next)) {
        escape += source.get();
        const v = parseInt(escape.slice(1), 8);
        if (v > 0o377) throw source.error(`octal escape value ${escape} outside of range 0-0o377`, cpLen(escape));
        return [LITERAL, v];
      }
    }
    const group = parseInt(escape.slice(1), 10);
    if (group < state.groups) {
      if (!state.checkgroup(group)) throw source.error('cannot refer to an open group', cpLen(escape));
      state.checklookbehindgroup(group, source);
      return [GROUPREF, group];
    }
    throw source.error(`invalid group reference ${group}`, cpLen(escape) - 1);
  }
  if (cpLen(escape) === 2) {
    if (ASCIILETTERS.has(c)) throw source.error(`bad escape ${escape}`, cpLen(escape));
    return [LITERAL, ord(c)];
  }
  throw source.error(`bad escape ${escape}`, cpLen(escape));
}

// ─── parser (_parse_sub / _parse / _parse_flags) ─────────────────────
function parseSub(source, state, verbose, nested) {
  const items = [];
  for (;;) {
    items.push(parse1(source, state, verbose, nested + 1, !nested && items.length === 0));
    if (!source.match('|')) break;
    if (!nested) verbose = state.flags & SRE_FLAG_VERBOSE;
  }
  if (items.length === 1) return items[0];

  const subpattern = new SubPattern(state);
  // common prefix
  for (;;) {
    let prefix = null;
    let all = true;
    for (const item of items) {
      if (item.length === 0) { all = false; break; }
      if (prefix === null) prefix = item.data[0];
      else if (!itemEq(item.data[0], prefix)) { all = false; break; }
    }
    if (!all) break;
    for (const item of items) item.data.splice(0, 1);
    subpattern.data.push(prefix);
  }
  // a branch of single literals / sets → one set
  const set = [];
  let ok = true;
  for (const item of items) {
    if (item.length !== 1) { ok = false; break; }
    const [op, av] = item.data[0];
    if (op === LITERAL) set.push([op, av]);
    else if (op === IN && av[0][0] !== NEGATE) set.push(...av);
    else { ok = false; break; }
  }
  if (ok) {
    subpattern.data.push([IN, uniq(set)]);
    return subpattern;
  }
  subpattern.data.push([BRANCH, [null, items]]);
  return subpattern;
}

function parse1(source, state, verbose, nested, first = false) {
  const subpattern = new SubPattern(state);
  const sp = subpattern.data;

  for (;;) {
    let t = source.next;
    if (t === null) break;
    if (t === '|' || t === ')') break;
    source.get();

    if (verbose) {
      if (WHITESPACE.has(t)) continue;
      if (t === '#') {
        for (;;) {
          t = source.get();
          if (t === null || t === '\n') break;
        }
        continue;
      }
    }

    if (t[0] === '\\') {
      sp.push(escapeCode(source, t, state));
    } else if (!(cpLen(t) === 1 && SPECIAL_CHARS.includes(t))) {
      sp.push([LITERAL, ord(t)]);
    } else if (t === '[') {
      const here = source.tell() - 1;
      let set = [];
      const negate = source.match('^');
      for (;;) {
        t = source.get();
        if (t === null) throw source.error('unterminated character set', source.tell() - here);
        if (t === ']' && set.length) break;
        let code1;
        if (t[0] === '\\') code1 = classEscape(source, t);
        else code1 = [LITERAL, ord(t)];
        if (source.match('-')) {
          const that = source.get();
          if (that === null) throw source.error('unterminated character set', source.tell() - here);
          if (that === ']') {
            if (code1[0] === IN) code1 = code1[1][0];
            set.push(code1);
            set.push([LITERAL, 45]);
            break;
          }
          let code2;
          if (that[0] === '\\') code2 = classEscape(source, that);
          else code2 = [LITERAL, ord(that)];
          if (code1[0] !== LITERAL || code2[0] !== LITERAL) {
            throw source.error(`bad character range ${t}-${that}`, cpLen(t) + 1 + cpLen(that));
          }
          const lo = code1[1];
          const hi = code2[1];
          if (hi < lo) throw source.error(`bad character range ${t}-${that}`, cpLen(t) + 1 + cpLen(that));
          set.push([RANGE, [lo, hi]]);
        } else {
          if (code1[0] === IN) code1 = code1[1][0];
          set.push(code1);
        }
      }
      set = uniq(set);
      if (set.length === 1 && set[0][0] === LITERAL) {
        if (negate) sp.push([NOT_LITERAL, set[0][1]]);
        else sp.push(set[0]);
      } else {
        if (negate) set.unshift([NEGATE, null]);
        sp.push([IN, set]);
      }
    } else if (REPEAT_CHARS.includes(t)) {
      const here = source.tell();
      let min;
      let max;
      if (t === '?') { min = 0; max = 1; }
      else if (t === '*') { min = 0; max = MAXREPEAT; }
      else if (t === '+') { min = 1; max = MAXREPEAT; }
      else {
        // '{'
        if (source.next === '}') {
          sp.push([LITERAL, ord(t)]);
          continue;
        }
        min = 0;
        max = MAXREPEAT;
        let lo = '';
        let hi = '';
        while (source.next !== null && DIGITS.has(source.next)) lo += source.get();
        if (source.match(',')) {
          while (source.next !== null && DIGITS.has(source.next)) hi += source.get();
        } else {
          hi = lo;
        }
        if (!source.match('}')) {
          sp.push([LITERAL, ord(t)]);
          source.seek(here);
          continue;
        }
        if (lo) {
          if (BigInt(lo) >= BigInt(MAXREPEAT)) throw pyErr('OverflowError', 'the repetition number is too large');
          min = Number(lo);
        }
        if (hi) {
          if (BigInt(hi) >= BigInt(MAXREPEAT)) throw pyErr('OverflowError', 'the repetition number is too large');
          max = Number(hi);
          if (max < min) throw source.error('min repeat greater than max repeat', source.tell() - here);
        }
      }
      let item = sp.length ? new SubPattern(state, sp.slice(-1)) : null;
      if (!item || item.length === 0 || item.data[0][0] === AT) {
        throw source.error('nothing to repeat', source.tell() - here + cpLen(t));
      }
      if (REPEATCODES.has(item.data[0][0])) {
        throw source.error('multiple repeat', source.tell() - here + cpLen(t));
      }
      if (item.data[0][0] === SUBPATTERN) {
        const [group, addFlags, delFlags, p] = item.data[0][1];
        if (group === null && !addFlags && !delFlags) item = p;
      }
      if (source.match('?')) sp[sp.length - 1] = [MIN_REPEAT, [min, max, item]];
      else if (source.match('+')) sp[sp.length - 1] = [POSSESSIVE_REPEAT, [min, max, item]];
      else sp[sp.length - 1] = [MAX_REPEAT, [min, max, item]];
    } else if (t === '.') {
      sp.push([ANY, null]);
    } else if (t === '(') {
      const start = source.tell() - 1;
      let capture = true;
      let atomic = false;
      let name = null;
      let addFlags = 0;
      let delFlags = 0;
      if (source.match('?')) {
        let ch = source.get();
        if (ch === null) throw source.error('unexpected end of pattern');
        if (ch === 'P') {
          if (source.match('<')) {
            name = source.getuntil('>', 'group name');
            source.checkgroupname(name, 1);
          } else if (source.match('=')) {
            name = source.getuntil(')', 'group name');
            source.checkgroupname(name, 1);
            const gid = state.groupdict.has(name) ? state.groupdict.get(name) : null;
            if (gid === null) throw source.error(`unknown group name ${pyStrRepr(name)}`, cpLen(name) + 1);
            if (!state.checkgroup(gid)) throw source.error('cannot refer to an open group', cpLen(name) + 1);
            state.checklookbehindgroup(gid, source);
            sp.push([GROUPREF, gid]);
            continue;
          } else {
            ch = source.get();
            if (ch === null) throw source.error('unexpected end of pattern');
            throw source.error('unknown extension ?P' + ch, cpLen(ch) + 2);
          }
        } else if (ch === ':') {
          capture = false;
        } else if (ch === '#') {
          for (;;) {
            if (source.next === null) throw source.error('missing ), unterminated comment', source.tell() - start);
            if (source.get() === ')') break;
          }
          continue;
        } else if (ch === '=' || ch === '!' || ch === '<') {
          let dir = 1;
          let lookbehindgroups;
          if (ch === '<') {
            ch = source.get();
            if (ch === null) throw source.error('unexpected end of pattern');
            if (ch !== '=' && ch !== '!') throw source.error('unknown extension ?<' + ch, cpLen(ch) + 2);
            dir = -1;
            lookbehindgroups = state.lookbehindgroups;
            if (lookbehindgroups === null) state.lookbehindgroups = state.groups;
          }
          const p = parseSub(source, state, verbose, nested + 1);
          if (dir < 0) {
            if (lookbehindgroups === null) state.lookbehindgroups = null;
          }
          if (!source.match(')')) throw source.error('missing ), unterminated subpattern', source.tell() - start);
          if (ch === '=') sp.push([ASSERT, [dir, p]]);
          else if (p.length) sp.push([ASSERT_NOT, [dir, p]]);
          else sp.push([FAILURE, []]);
          continue;
        } else if (ch === '(') {
          const condname = source.getuntil(')', 'group name');
          let condgroup;
          if (!isAsciiDecimal(condname)) {
            source.checkgroupname(condname, 1);
            condgroup = state.groupdict.has(condname) ? state.groupdict.get(condname) : null;
            if (condgroup === null) throw source.error(`unknown group name ${pyStrRepr(condname)}`, cpLen(condname) + 1);
          } else {
            const big = BigInt(condname);
            if (big === 0n) throw source.error('bad group number', cpLen(condname) + 1);
            if (big >= MAXGROUPS) throw source.error(`invalid group reference ${big}`, cpLen(condname) + 1);
            condgroup = Number(big);
            if (!state.grouprefpos.has(condgroup)) state.grouprefpos.set(condgroup, source.tell() - cpLen(condname) - 1);
          }
          state.checklookbehindgroup(condgroup, source);
          const itemYes = parse1(source, state, verbose, nested + 1);
          let itemNo = null;
          if (source.match('|')) {
            itemNo = parse1(source, state, verbose, nested + 1);
            if (source.next === '|') throw source.error('conditional backref with more than two branches');
          }
          if (!source.match(')')) throw source.error('missing ), unterminated subpattern', source.tell() - start);
          sp.push([GROUPREF_EXISTS, [condgroup, itemYes, itemNo]]);
          continue;
        } else if (ch === '>') {
          capture = false;
          atomic = true;
        } else if (hasFlag(ch) || ch === '-') {
          const flags = parseFlags(source, state, ch);
          if (flags === null) {
            if (!first || sp.length) {
              throw source.error('global flags not at the start of the expression', source.tell() - start);
            }
            verbose = state.flags & SRE_FLAG_VERBOSE;
            continue;
          }
          [addFlags, delFlags] = flags;
          capture = false;
        } else {
          throw source.error('unknown extension ?' + ch, cpLen(ch) + 1);
        }
      }
      let group = null;
      if (capture) {
        try {
          group = state.opengroup(name);
        } catch (err) {
          if (err instanceof PatternError) throw source.error(err.msg, cpLen(name) + 1);
          throw err;
        }
      }
      const subVerbose = (verbose || (addFlags & SRE_FLAG_VERBOSE)) && !(delFlags & SRE_FLAG_VERBOSE);
      const p = parseSub(source, state, subVerbose, nested + 1);
      if (!source.match(')')) throw source.error('missing ), unterminated subpattern', source.tell() - start);
      if (group !== null) state.closegroup(group, p);
      if (atomic) sp.push([ATOMIC_GROUP, p]);
      else sp.push([SUBPATTERN, [group, addFlags, delFlags, p]]);
    } else if (t === '^') {
      sp.push([AT, AT_BEGINNING]);
    } else if (t === '$') {
      sp.push([AT, AT_END]);
    }
  }

  // unpack non-capturing groups
  for (let i = sp.length - 1; i >= 0; i--) {
    const [op, av] = sp[i];
    if (op === SUBPATTERN) {
      const [group, addFlags, delFlags, p] = av;
      if (group === null && !addFlags && !delFlags) sp.splice(i, 1, ...p.data);
    }
  }
  return subpattern;
}

function parseFlags(source, state, ch) {
  let addFlags = 0;
  let delFlags = 0;
  if (ch !== '-') {
    for (;;) {
      const flag = FLAGS[ch];
      if (ch === 'L') throw source.error("bad inline flags: cannot use 'L' flag with a str pattern");
      addFlags |= flag;
      if ((flag & TYPE_FLAGS) && (addFlags & TYPE_FLAGS) !== flag) {
        throw source.error("bad inline flags: flags 'a', 'u' and 'L' are incompatible");
      }
      ch = source.get();
      if (ch === null) throw source.error('missing -, : or )');
      if (ch === ')' || ch === '-' || ch === ':') break;
      if (!hasFlag(ch)) {
        throw source.error(isAlpha(ch) ? 'unknown flag' : 'missing -, : or )', cpLen(ch));
      }
    }
  }
  if (ch === ')') {
    state.flags |= addFlags;
    return null;
  }
  if (addFlags & GLOBAL_FLAGS) throw source.error('bad inline flags: cannot turn on global flag', 1);
  if (ch === '-') {
    ch = source.get();
    if (ch === null) throw source.error('missing flag');
    if (!hasFlag(ch)) throw source.error(isAlpha(ch) ? 'unknown flag' : 'missing flag', cpLen(ch));
    for (;;) {
      const flag = FLAGS[ch];
      if (flag & TYPE_FLAGS) throw source.error("bad inline flags: cannot turn off flags 'a', 'u' and 'L'");
      delFlags |= flag;
      ch = source.get();
      if (ch === null) throw source.error('missing :');
      if (ch === ':') break;
      if (!hasFlag(ch)) throw source.error(isAlpha(ch) ? 'unknown flag' : 'missing :', cpLen(ch));
    }
  }
  if (delFlags & GLOBAL_FLAGS) throw source.error('bad inline flags: cannot turn off global flag', 1);
  if (addFlags & delFlags) throw source.error('bad inline flags: flag turned on and off', 1);
  return [addFlags, delFlags];
}

function fixFlags(flags) {
  if (flags & SRE_FLAG_LOCALE) throw pyErr('ValueError', 'cannot use LOCALE flag with a str pattern');
  if (!(flags & SRE_FLAG_ASCII)) flags |= SRE_FLAG_UNICODE;
  else if (flags & SRE_FLAG_UNICODE) throw pyErr('ValueError', 'ASCII and UNICODE flags are incompatible');
  return flags;
}

function parse(str, flags) {
  const source = new Tokenizer(str);
  const state = new State();
  state.flags = flags;
  const p = parseSub(source, state, flags & SRE_FLAG_VERBOSE, 0);
  p.state.flags = fixFlags(p.state.flags);
  if (source.next !== null) throw source.error('unbalanced parenthesis');
  for (const [g, pos] of p.state.grouprefpos) {
    if (g >= p.state.groups) throw new PatternError(`invalid group reference ${g}`, str, pos);
  }
  return p;
}

// ─── replacement templates (_parser.parse_template) ──────────────────
// → [literal0, group1, literal1, group2, …] (strings and group indexes)
function parseTemplate(source, pattern) {
  const s = new Tokenizer(source);
  const result = [];
  let literal = [];
  const addliteral = () => {
    result.push(literal.join(''));
    literal = [];
  };
  const addgroup = (index, pos) => {
    if (index > pattern.groups) throw s.error(`invalid group reference ${index}`, pos);
    addliteral();
    result.push(index);
  };
  for (;;) {
    let t = s.get();
    if (t === null) break;
    if (t[0] === '\\') {
      const c = cps(t)[1];
      if (c === 'g') {
        if (!s.match('<')) throw s.error('missing <');
        const name = s.getuntil('>', 'group name');
        let index;
        if (!isAsciiDecimal(name)) {
          s.checkgroupname(name, 1);
          if (!pattern.groupindexMap.has(name)) throw pyErr('IndexError', `unknown group name ${pyStrRepr(name)}`);
          index = pattern.groupindexMap.get(name);
        } else {
          const big = BigInt(name);
          if (big >= MAXGROUPS) throw s.error(`invalid group reference ${big}`, cpLen(name) + 1);
          index = Number(big);
        }
        addgroup(index, cpLen(name) + 1);
      } else if (c === '0') {
        if (s.next !== null && OCTDIGITS.has(s.next)) {
          t += s.get();
          if (s.next !== null && OCTDIGITS.has(s.next)) t += s.get();
        }
        literal.push(String.fromCodePoint(parseInt(t.slice(1), 8) & 0xff));
      } else if (DIGITS.has(c)) {
        let isoctal = false;
        if (s.next !== null && DIGITS.has(s.next)) {
          t += s.get();
          if (OCTDIGITS.has(c) && OCTDIGITS.has(t[2]) && s.next !== null && OCTDIGITS.has(s.next)) {
            t += s.get();
            isoctal = true;
            const v = parseInt(t.slice(1), 8);
            if (v > 0o377) throw s.error(`octal escape value ${t} outside of range 0-0o377`, cpLen(t));
            literal.push(String.fromCodePoint(v));
          }
        }
        if (!isoctal) addgroup(parseInt(t.slice(1), 10), cpLen(t) - 1);
      } else {
        if (ESCAPES[t]) t = String.fromCodePoint(ESCAPES[t][1]);
        else if (ASCIILETTERS.has(c)) throw s.error(`bad escape ${t}`, cpLen(t));
        literal.push(t);
      }
    } else {
      literal.push(t);
    }
  }
  addliteral();
  return result;
}

// ─── compiler (_compiler.py) ─────────────────────────────────────────
const combineFlags = (flags, add, del) => ((add & TYPE_FLAGS ? flags & ~TYPE_FLAGS : flags) | add) & ~del;

function caseFns(flags) {
  if ((flags & SRE_FLAG_IGNORECASE) && !(flags & SRE_FLAG_LOCALE)) {
    if (flags & SRE_FLAG_UNICODE) return { iscased: uniIsCased, tolower: uniLower, fixes: EXTRA_CASES };
    return { iscased: asciiIsCased, tolower: asciiLower, fixes: null };
  }
  return { iscased: null, tolower: null, fixes: null };
}

function simple(p) {
  if (p.length !== 1) return false;
  const [op, av] = p.data[0];
  if (op === SUBPATTERN) return av[0] === null && simple(av[3]);
  return op === LITERAL || op === NOT_LITERAL || op === ANY || op === IN;
}

class IndexErr extends Error {}

function optimizeCharset(charset, iscased, fixup, fixes, maps) {
  const out = [];
  const tail = [];
  let charmap = new Uint8Array(256);
  let hascased = false;
  const setc = (i) => {
    if (i >= charmap.length) throw new IndexErr();
    charmap[i] = 1;
  };
  for (let [op, av] of charset) {
    for (;;) {
      try {
        if (op === LITERAL) {
          if (fixup) {
            av = fixup(av);
            setc(av);
            if (fixes && fixes.has(av)) for (const k of fixes.get(av)) setc(k);
            if (!hascased && iscased(av)) hascased = true;
          } else {
            setc(av);
          }
        } else if (op === RANGE) {
          const [a, b] = av;
          if (fixup) {
            for (let c = a; c <= b; c++) {
              const i = fixup(c);
              setc(i);
              if (fixes && fixes.has(i)) for (const k of fixes.get(i)) setc(k);
            }
            if (!hascased) {
              for (let c = a; c <= b; c++) if (iscased(c)) { hascased = true; break; }
            }
          } else {
            for (let c = a; c <= b; c++) setc(c);
          }
        } else if (op === NEGATE) {
          out.push([op, av]);
        } else {
          tail.push([op, av]);
        }
      } catch (e) {
        if (!(e instanceof IndexErr)) throw e;
        if (charmap.length === 256) {
          const big = new Uint8Array(65536);
          big.set(charmap);
          charmap = big;
          continue;
        }
        if (fixup) {
          if (op === RANGE) {
            if (fixes) op = RANGE_UNI_IGNORE;
            hascased = true;
          } else if (!hascased && iscased(av)) {
            hascased = true;
          }
        }
        tail.push([op, av]);
      }
      break;
    }
  }
  // compress the character map
  let runs = [];
  let q = 0;
  for (;;) {
    const p = charmap.indexOf(1, q);
    if (p < 0) break;
    if (runs.length >= 2) { runs = null; break; }
    q = charmap.indexOf(0, p);
    if (q < 0) { runs.push([p, charmap.length]); break; }
    runs.push([p, q]);
  }
  if (runs !== null) {
    for (const [p, qq] of runs) {
      if (qq - p === 1) out.push([LITERAL, p]);
      else out.push([RANGE, [p, qq - 1]]);
    }
    out.push(...tail);
    if (hascased || out.length < charset.length) return [out, hascased];
    return [charset, hascased];
  }
  maps.push(charmap);
  out.push([charmap.length === 256 ? CHARSET : BIGCHARSET, maps.length - 1]);
  out.push(...tail);
  return [out, hascased];
}

function compileCharset(charset, flags, code) {
  for (const [op, av] of charset) {
    code.push(op);
    if (op === NEGATE) { /* nothing */ } else if (op === LITERAL) code.push(av);
    else if (op === RANGE || op === RANGE_UNI_IGNORE) code.push(av[0], av[1]);
    else if (op === CHARSET || op === BIGCHARSET) code.push(av);
    else if (op === CATEGORY) code.push(flags & SRE_FLAG_UNICODE ? CH_UNICODE[av] : av);
    else throw new Error(`internal: unsupported set operator ${op}`);
  }
  code.push(FAILURE);
}

const REPEATING = {
  [MIN_REPEAT]: [REPEAT, MIN_UNTIL, MIN_REPEAT_ONE],
  [MAX_REPEAT]: [REPEAT, MAX_UNTIL, REPEAT_ONE],
  [POSSESSIVE_REPEAT]: [POSSESSIVE_REPEAT, SUCCESS, POSSESSIVE_REPEAT_ONE],
};

function compileInto(code, data, flags, maps) {
  const { iscased, tolower, fixes } = caseFns(flags);
  for (const [op, av] of data) {
    if (op === LITERAL || op === NOT_LITERAL) {
      if (!(flags & SRE_FLAG_IGNORECASE) || !iscased(av)) {
        code.push(op, av);
      } else {
        const lo = tolower(av);
        if (!fixes) code.push(OP_IGNORE[op], lo);
        else if (!fixes.has(lo)) code.push(OP_UNICODE_IGNORE[op], lo);
        else {
          code.push(IN_UNI_IGNORE);
          const skip = code.length;
          code.push(0);
          if (op === NOT_LITERAL) code.push(NEGATE);
          for (const k of [lo, ...fixes.get(lo)]) code.push(LITERAL, k);
          code.push(FAILURE);
          code[skip] = code.length - skip;
        }
      }
    } else if (op === IN) {
      const [charset, hascased] = optimizeCharset(av, iscased, tolower, fixes, maps);
      if (!hascased) code.push(IN);
      else if (!fixes) code.push(IN_IGNORE);
      else code.push(IN_UNI_IGNORE);
      const skip = code.length;
      code.push(0);
      compileCharset(charset, flags, code);
      code[skip] = code.length - skip;
    } else if (op === ANY) {
      code.push(flags & SRE_FLAG_DOTALL ? ANY_ALL : ANY);
    } else if (REPEATING[op]) {
      const codes = REPEATING[op];
      if (simple(av[2])) {
        code.push(codes[2]);
        const skip = code.length;
        code.push(0, av[0], av[1]);
        compileInto(code, av[2].data, flags, maps);
        code.push(SUCCESS);
        code[skip] = code.length - skip;
      } else {
        code.push(codes[0]);
        const skip = code.length;
        code.push(0, av[0], av[1]);
        compileInto(code, av[2].data, flags, maps);
        code[skip] = code.length - skip;
        code.push(codes[1]);
      }
    } else if (op === SUBPATTERN) {
      const [group, add, del, p] = av;
      if (group) code.push(MARK, (group - 1) * 2);
      compileInto(code, p.data, combineFlags(flags, add, del), maps);
      if (group) code.push(MARK, (group - 1) * 2 + 1);
    } else if (op === ATOMIC_GROUP) {
      code.push(ATOMIC_GROUP);
      const skip = code.length;
      code.push(0);
      compileInto(code, av.data, flags, maps);
      code.push(SUCCESS);
      code[skip] = code.length - skip;
    } else if (op === SUCCESS || op === FAILURE) {
      code.push(op);
    } else if (op === ASSERT || op === ASSERT_NOT) {
      code.push(op);
      const skip = code.length;
      code.push(0);
      if (av[0] >= 0) {
        code.push(0);
      } else {
        const [lo, hi] = av[1].getwidth();
        if (lo > MAXCODE) throw new PatternError('looks too much behind');
        if (lo !== hi) throw new PatternError('look-behind requires fixed-width pattern');
        code.push(Number(lo));
      }
      compileInto(code, av[1].data, flags, maps);
      code.push(SUCCESS);
      code[skip] = code.length - skip;
    } else if (op === AT) {
      let a = av;
      if (flags & SRE_FLAG_MULTILINE && AT_MULTILINE[a] !== undefined) a = AT_MULTILINE[a];
      if (flags & SRE_FLAG_UNICODE && AT_UNICODE[a] !== undefined) a = AT_UNICODE[a];
      code.push(AT, a);
    } else if (op === BRANCH) {
      code.push(BRANCH);
      const tails = [];
      for (const alt of av[1]) {
        const skip = code.length;
        code.push(0);
        compileInto(code, alt.data, flags, maps);
        code.push(JUMP);
        tails.push(code.length);
        code.push(0);
        code[skip] = code.length - skip;
      }
      code.push(FAILURE);
      for (const t of tails) code[t] = code.length - t;
    } else if (op === CATEGORY) {
      code.push(CATEGORY, flags & SRE_FLAG_UNICODE ? CH_UNICODE[av] : av);
    } else if (op === GROUPREF) {
      if (!(flags & SRE_FLAG_IGNORECASE)) code.push(GROUPREF);
      else if (!fixes) code.push(GROUPREF_IGNORE);
      else code.push(GROUPREF_UNI_IGNORE);
      code.push(av - 1);
    } else if (op === GROUPREF_EXISTS) {
      code.push(GROUPREF_EXISTS, av[0] - 1);
      const skipyes = code.length;
      code.push(0);
      compileInto(code, av[1].data, flags, maps);
      if (av[2]) {
        code.push(JUMP);
        const skipno = code.length;
        code.push(0);
        code[skipyes] = code.length - skipyes + 1;
        compileInto(code, av[2].data, flags, maps);
        code[skipno] = code.length - skipno;
      } else {
        code[skipyes] = code.length - skipyes + 1;
      }
    } else {
      throw new Error(`internal: unsupported operand type ${op}`);
    }
  }
}

// INFO block (_compile_info): min/max width, plus the "pattern starts with
// a character from this set" prefix. The literal-prefix search is
// behaviour-neutral, so only its presence is computed; the charset prefix
// is not: it is compiled with the TOP-LEVEL flags, so a category inside
// (?a:…) / (?u:…) is tested with the outer flavour — CPython's search
// skips positions accordingly, and so does this port.
const SRE_INFO_CHARSET = 4;
const getIscased = (flags) => (!(flags & SRE_FLAG_IGNORECASE) ? null : flags & SRE_FLAG_UNICODE ? uniIsCased : asciiIsCased);

function hasLiteralPrefix(pattern, flags) {
  // _get_literal_prefix → (prefix non-empty, got_all)
  let n = 0;
  const iscased = getIscased(flags);
  for (const [op, av] of pattern.data) {
    if (op === LITERAL) {
      if (iscased && iscased(av)) return [n > 0, false];
      n += 1;
    } else if (op === SUBPATTERN) {
      const flags1 = combineFlags(flags, av[1], av[2]);
      if (flags1 & SRE_FLAG_IGNORECASE && flags1 & SRE_FLAG_LOCALE) return [n > 0, false];
      const [has1, gotAll] = hasLiteralPrefix(av[3], flags1);
      if (has1) n += 1;
      if (!gotAll) return [n > 0, false];
    } else {
      return [n > 0, false];
    }
  }
  return [n > 0, true];
}

function getCharsetPrefix(pattern, flags) {
  let op;
  let av;
  for (;;) {
    if (!pattern.data.length) return null;
    [op, av] = pattern.data[0];
    if (op !== SUBPATTERN) break;
    flags = combineFlags(flags, av[1], av[2]);
    pattern = av[3];
    if (flags & SRE_FLAG_IGNORECASE && flags & SRE_FLAG_LOCALE) return null;
  }
  const iscased = getIscased(flags);
  if (op === LITERAL) {
    if (iscased && iscased(av)) return null;
    return [[op, av]];
  }
  if (op === BRANCH) {
    const charset = [];
    for (const alt of av[1]) {
      if (!alt.length) return null;
      const [op1, av1] = alt.data[0];
      if (op1 === LITERAL && !(iscased && iscased(av1))) charset.push([op1, av1]);
      else return null;
    }
    return charset;
  }
  if (op === IN) {
    if (iscased) {
      for (const [op1, av1] of av) {
        if (op1 === LITERAL) {
          if (iscased(av1)) return null;
        } else if (op1 === RANGE) {
          if (av1[1] > 0xffff) return null;
          for (let c = av1[0]; c <= av1[1]; c++) if (iscased(c)) return null;
        }
      }
    }
    return av;
  }
  return null;
}

function compileInfo(p, flags, maps) {
  const [lo, hi] = p.getwidth();
  const code = [INFO, 4, 0, Number(bmin(lo, MAXCODE)), Number(bmin(hi, MAXCODE))];
  if (lo === 0n) return code;
  if (!(flags & SRE_FLAG_IGNORECASE && flags & SRE_FLAG_LOCALE)) {
    const [hasPrefix] = hasLiteralPrefix(p, flags);
    if (!hasPrefix) {
      const charset = getCharsetPrefix(p, flags);
      if (charset) {
        code[2] = SRE_INFO_CHARSET;
        const [cs] = optimizeCharset(charset, null, null, null, maps);
        compileCharset(cs, flags, code);
        code[1] = code.length - 1;
      }
    }
  }
  return code;
}

// ─── matcher (Modules/_sre/sre_lib.h) ────────────────────────────────
function category(ch, c) {
  switch (ch) {
    case CATEGORY_DIGIT: return c < 128 && asciiIsDigit(c);
    case CATEGORY_NOT_DIGIT: return !(c < 128 && asciiIsDigit(c));
    case CATEGORY_SPACE: return asciiIsSpace(c);
    case CATEGORY_NOT_SPACE: return !asciiIsSpace(c);
    case CATEGORY_WORD: return asciiIsWord(c);
    case CATEGORY_NOT_WORD: return !asciiIsWord(c);
    case CATEGORY_LINEBREAK: return c === 10;
    case CATEGORY_NOT_LINEBREAK: return c !== 10;
    case CATEGORY_UNI_DIGIT: return uniIsDigit(c);
    case CATEGORY_UNI_NOT_DIGIT: return !uniIsDigit(c);
    case CATEGORY_UNI_SPACE: return uniIsSpace(c);
    case CATEGORY_UNI_NOT_SPACE: return !uniIsSpace(c);
    case CATEGORY_UNI_WORD: return uniIsWord(c);
    case CATEGORY_UNI_NOT_WORD: return !uniIsWord(c);
    // Py_UNICODE_ISLINEBREAK — never produced by the parser for str patterns
    case CATEGORY_UNI_LINEBREAK: return [10, 11, 12, 13, 28, 29, 30, 133, 8232, 8233].includes(c);
    case CATEGORY_UNI_NOT_LINEBREAK: return ![10, 11, 12, 13, 28, 29, 30, 133, 8232, 8233].includes(c);
    default: return false;
  }
}

function inCharset(st, pc, ch) {
  const code = st.code;
  let ok = true;
  for (;;) {
    switch (code[pc++]) {
      case FAILURE: return !ok;
      case LITERAL:
        if (ch === code[pc]) return ok;
        pc += 1;
        break;
      case CATEGORY:
        if (category(code[pc], ch)) return ok;
        pc += 1;
        break;
      case CHARSET:
      case BIGCHARSET: {
        const m = st.maps[code[pc]];
        if (ch < m.length && m[ch]) return ok;
        pc += 1;
        break;
      }
      case RANGE:
        if (code[pc] <= ch && ch <= code[pc + 1]) return ok;
        pc += 2;
        break;
      case RANGE_UNI_IGNORE: {
        if (code[pc] <= ch && ch <= code[pc + 1]) return ok;
        const u = uniUpper(ch);
        if (code[pc] <= u && u <= code[pc + 1]) return ok;
        pc += 2;
        break;
      }
      case NEGATE:
        ok = !ok;
        break;
      default:
        throw new Error('internal: bad charset');
    }
  }
}

function at(st, ptr, a) {
  const s = st.str;
  const end = st.end;
  switch (a) {
    case AT_BEGINNING:
    case AT_BEGINNING_STRING:
      return ptr === 0;
    case AT_BEGINNING_LINE:
      return ptr === 0 || s[ptr - 1] === 10;
    case AT_END:
      return (end - ptr === 1 && s[ptr] === 10) || ptr === end;
    case AT_END_LINE:
      return ptr === end || s[ptr] === 10;
    case AT_END_STRING:
      return ptr === end;
    case AT_BOUNDARY:
    case AT_NON_BOUNDARY:
    case AT_UNI_BOUNDARY:
    case AT_UNI_NON_BOUNDARY: {
      if (end === 0) return false; // state->beginning == state->end
      const isw = a === AT_BOUNDARY || a === AT_NON_BOUNDARY ? asciiIsWord : uniIsWord;
      const thatp = ptr > 0 ? isw(s[ptr - 1]) : false;
      const thisp = ptr < end ? isw(s[ptr]) : false;
      return a === AT_BOUNDARY || a === AT_UNI_BOUNDARY ? thisp !== thatp : thisp === thatp;
    }
    default:
      return false;
  }
}

// one-character item test (the item of a *_REPEAT_ONE, as SRE(count) sees it)
function matchOne(st, pc, ch) {
  const code = st.code;
  switch (code[pc]) {
    case ANY: return ch !== 10;
    case ANY_ALL: return true;
    case IN: return inCharset(st, pc + 2, ch);
    case IN_IGNORE: return inCharset(st, pc + 2, asciiLower(ch));
    case IN_UNI_IGNORE: return inCharset(st, pc + 2, uniLower(ch));
    case LITERAL: return ch === code[pc + 1];
    case LITERAL_IGNORE: return asciiLower(ch) === code[pc + 1];
    case LITERAL_UNI_IGNORE: return uniLower(ch) === code[pc + 1];
    case NOT_LITERAL: return ch !== code[pc + 1];
    case NOT_LITERAL_IGNORE: return asciiLower(ch) !== code[pc + 1];
    case NOT_LITERAL_UNI_IGNORE: return uniLower(ch) !== code[pc + 1];
    case CATEGORY: return category(code[pc + 1], ch);
    default: throw new Error('internal: bad repeat item');
  }
}

function sreCount(st, pc, maxcount) {
  let ptr = st.ptr;
  let end = st.end;
  if (maxcount < end - ptr && maxcount !== MAXREPEAT) end = ptr + maxcount;
  const s = st.str;
  const start = ptr;
  while (ptr < end && matchOne(st, pc, s[ptr])) ptr++;
  st.steps += ptr - start;
  return ptr - start;
}

// mark stack (MARK_PUSH / MARK_POP / MARK_POP_KEEP / MARK_POP_DISCARD)
function markPush(st, lastmark) {
  if (lastmark >= 0) st.data.push(st.mark.slice(0, lastmark + 1));
}
function markPop(st, lastmark, keep = false) {
  if (lastmark >= 0) {
    const saved = keep ? st.data[st.data.length - 1] : st.data.pop();
    for (let i = 0; i <= lastmark; i++) st.mark[i] = saved[i];
  }
}
function markDiscard(st, lastmark) {
  if (lastmark >= 0) st.data.pop();
}

function tick(st, n = 1) {
  st.steps += n;
  if (st.steps > MAX_STEPS) throw new BacktrackLimit();
}

// SRE(match) as a generator: `yield [pc, toplevel]` is DO_JUMP (the driver
// runs the child context and sends back its result).
function* sreMatch(st, pc, toplevel) {
  const code = st.code;
  const s = st.str;
  const end = st.end;
  let ptr = st.ptr;

  if (code[pc] === INFO) {
    const min = code[pc + 3];
    if (min && end - ptr >= 0 && end - ptr < min) return 0;
    pc += code[pc + 1] + 1;
  }

  for (;;) {
    tick(st);
    const op = code[pc++];
    switch (op) {
      case MARK: {
        const i = code[pc];
        if (i & 1) st.lastindex = (i >> 1) + 1;
        if (i > st.lastmark) {
          let j = st.lastmark + 1;
          while (j < i) st.mark[j++] = null;
          st.lastmark = i;
        }
        st.mark[i] = ptr;
        pc += 1;
        break;
      }
      case LITERAL:
        if (ptr >= end || s[ptr] !== code[pc]) return 0;
        pc += 1; ptr += 1;
        break;
      case NOT_LITERAL:
        if (ptr >= end || s[ptr] === code[pc]) return 0;
        pc += 1; ptr += 1;
        break;
      case SUCCESS:
        if (toplevel && ((st.matchAll && ptr !== st.end) || (st.mustAdvance && ptr === st.start))) return 0;
        st.ptr = ptr;
        return 1;
      case AT:
        if (!at(st, ptr, code[pc])) return 0;
        pc += 1;
        break;
      case CATEGORY:
        if (ptr >= end || !category(code[pc], s[ptr])) return 0;
        pc += 1; ptr += 1;
        break;
      case ANY:
        if (ptr >= end || s[ptr] === 10) return 0;
        ptr += 1;
        break;
      case ANY_ALL:
        if (ptr >= end) return 0;
        ptr += 1;
        break;
      case IN:
        if (ptr >= end || !inCharset(st, pc + 1, s[ptr])) return 0;
        pc += code[pc]; ptr += 1;
        break;
      case LITERAL_IGNORE:
        if (ptr >= end || asciiLower(s[ptr]) !== code[pc]) return 0;
        pc += 1; ptr += 1;
        break;
      case LITERAL_UNI_IGNORE:
        if (ptr >= end || uniLower(s[ptr]) !== code[pc]) return 0;
        pc += 1; ptr += 1;
        break;
      case NOT_LITERAL_IGNORE:
        if (ptr >= end || asciiLower(s[ptr]) === code[pc]) return 0;
        pc += 1; ptr += 1;
        break;
      case NOT_LITERAL_UNI_IGNORE:
        if (ptr >= end || uniLower(s[ptr]) === code[pc]) return 0;
        pc += 1; ptr += 1;
        break;
      case IN_IGNORE:
        if (ptr >= end || !inCharset(st, pc + 1, asciiLower(s[ptr]))) return 0;
        pc += code[pc]; ptr += 1;
        break;
      case IN_UNI_IGNORE:
        if (ptr >= end || !inCharset(st, pc + 1, uniLower(s[ptr]))) return 0;
        pc += code[pc]; ptr += 1;
        break;
      case JUMP:
      case INFO:
        pc += code[pc];
        break;
      case BRANCH: {
        const lastmark = st.lastmark;
        const lastindex = st.lastindex;
        const rp = st.repeat !== null;
        if (rp) markPush(st, lastmark);
        for (; code[pc]; pc += code[pc]) {
          if (code[pc + 1] === LITERAL && (ptr >= end || s[ptr] !== code[pc + 2])) continue;
          if (code[pc + 1] === IN && (ptr >= end || !inCharset(st, pc + 3, s[ptr]))) continue;
          st.ptr = ptr;
          const ret = yield [pc + 1, toplevel];
          if (ret) {
            if (rp) markDiscard(st, lastmark);
            return 1;
          }
          if (rp) markPop(st, lastmark, true);
          st.lastmark = lastmark;
          st.lastindex = lastindex;
        }
        if (rp) markDiscard(st, lastmark);
        return 0;
      }
      case REPEAT_ONE: {
        const min = code[pc + 1];
        if (min > end - ptr) return 0;
        st.ptr = ptr;
        let count = sreCount(st, pc + 3, code[pc + 2]);
        ptr += count;
        if (count < min) return 0;
        const next = pc + code[pc];
        const lastmark = st.lastmark;
        const lastindex = st.lastindex;
        const rp = st.repeat !== null;
        if (rp) markPush(st, lastmark);
        if (code[next] === LITERAL) {
          const chr = code[next + 1];
          for (;;) {
            while (count >= min && (ptr >= end || s[ptr] !== chr)) { ptr--; count--; }
            if (count < min) break;
            st.ptr = ptr;
            const ret = yield [next, toplevel];
            if (ret) {
              if (rp) markDiscard(st, lastmark);
              return 1;
            }
            if (rp) markPop(st, lastmark, true);
            st.lastmark = lastmark;
            st.lastindex = lastindex;
            ptr--; count--;
            tick(st);
          }
        } else {
          while (count >= min) {
            st.ptr = ptr;
            const ret = yield [next, toplevel];
            if (ret) {
              if (rp) markDiscard(st, lastmark);
              return 1;
            }
            if (rp) markPop(st, lastmark, true);
            st.lastmark = lastmark;
            st.lastindex = lastindex;
            ptr--; count--;
            tick(st);
          }
        }
        if (rp) markDiscard(st, lastmark);
        return 0;
      }
      case MIN_REPEAT_ONE: {
        const min = code[pc + 1];
        const max = code[pc + 2];
        if (min > end - ptr) return 0;
        st.ptr = ptr;
        let count;
        if (min === 0) {
          count = 0;
        } else {
          const r = sreCount(st, pc + 3, min);
          if (r < min) return 0;
          count = r;
          ptr += count;
        }
        const next = pc + code[pc];
        const lastmark = st.lastmark;
        const lastindex = st.lastindex;
        const rp = st.repeat !== null;
        if (rp) markPush(st, lastmark);
        while (max === MAXREPEAT || count <= max) {
          st.ptr = ptr;
          const ret = yield [next, toplevel];
          if (ret) {
            if (rp) markDiscard(st, lastmark);
            return 1;
          }
          if (rp) markPop(st, lastmark, true);
          st.lastmark = lastmark;
          st.lastindex = lastindex;
          st.ptr = ptr;
          const r = sreCount(st, pc + 3, 1);
          if (r === 0) break;
          ptr++; count++;
          tick(st);
        }
        if (rp) markDiscard(st, lastmark);
        return 0;
      }
      case POSSESSIVE_REPEAT_ONE: {
        const min = code[pc + 1];
        if (min > end - ptr) return 0;
        st.ptr = ptr;
        const count = sreCount(st, pc + 3, code[pc + 2]);
        ptr += count;
        if (count < min) return 0;
        pc += code[pc];
        break;
      }
      case REPEAT: {
        const rep = { count: -1, pc, prev: st.repeat, lastPtr: -1 };
        st.repeat = rep;
        st.ptr = ptr;
        const ret = yield [pc + code[pc], toplevel];
        st.repeat = rep.prev;
        return ret ? 1 : 0;
      }
      case MAX_UNTIL: {
        const rep = st.repeat;
        if (!rep) throw new Error('internal: MAX_UNTIL without REPEAT');
        st.ptr = ptr;
        const count = rep.count + 1;
        const min = code[rep.pc + 1];
        const max = code[rep.pc + 2];
        if (count < min) {
          rep.count = count;
          const ret = yield [rep.pc + 3, toplevel];
          if (ret) return 1;
          rep.count = count - 1;
          st.ptr = ptr;
          return 0;
        }
        if ((count < max || max === MAXREPEAT) && st.ptr !== rep.lastPtr) {
          rep.count = count;
          const lastmark = st.lastmark;
          const lastindex = st.lastindex;
          markPush(st, lastmark);
          const savedLast = rep.lastPtr;
          rep.lastPtr = st.ptr;
          const ret = yield [rep.pc + 3, toplevel];
          rep.lastPtr = savedLast;
          if (ret) {
            markDiscard(st, lastmark);
            return 1;
          }
          markPop(st, lastmark);
          st.lastmark = lastmark;
          st.lastindex = lastindex;
          rep.count = count - 1;
          st.ptr = ptr;
        }
        st.repeat = rep.prev;
        const ret = yield [pc, toplevel];
        st.repeat = rep;
        if (ret) return 1;
        st.ptr = ptr;
        return 0;
      }
      case MIN_UNTIL: {
        const rep = st.repeat;
        if (!rep) throw new Error('internal: MIN_UNTIL without REPEAT');
        st.ptr = ptr;
        const count = rep.count + 1;
        const min = code[rep.pc + 1];
        const max = code[rep.pc + 2];
        if (count < min) {
          rep.count = count;
          const ret = yield [rep.pc + 3, toplevel];
          if (ret) return 1;
          rep.count = count - 1;
          st.ptr = ptr;
          return 0;
        }
        st.repeat = rep.prev;
        const lastmark = st.lastmark;
        const lastindex = st.lastindex;
        const rp = st.repeat !== null;
        if (rp) markPush(st, lastmark);
        let ret = yield [pc, toplevel];
        st.repeat = rep;
        if (ret) {
          if (rp) markDiscard(st, lastmark);
          return 1;
        }
        if (rp) markPop(st, lastmark);
        st.lastmark = lastmark;
        st.lastindex = lastindex;
        st.ptr = ptr;
        if ((count >= max && max !== MAXREPEAT) || st.ptr === rep.lastPtr) return 0;
        rep.count = count;
        const savedLast = rep.lastPtr;
        rep.lastPtr = st.ptr;
        ret = yield [rep.pc + 3, toplevel];
        rep.lastPtr = savedLast;
        if (ret) return 1;
        rep.count = count - 1;
        st.ptr = ptr;
        return 0;
      }
      case POSSESSIVE_REPEAT: {
        st.ptr = ptr;
        const rep = { count: -1, pc: null, prev: st.repeat, lastPtr: -1 };
        st.repeat = rep;
        let count = 0;
        const min = code[pc + 1];
        const max = code[pc + 2];
        while (count < min) {
          const ret = yield [pc + 3, 0];
          if (ret) count++;
          else {
            st.ptr = ptr;
            st.repeat = rep.prev;
            return 0;
          }
        }
        let cptr = -1;
        while ((count < max || max === MAXREPEAT) && st.ptr !== cptr) {
          const lastmark = st.lastmark;
          const lastindex = st.lastindex;
          markPush(st, lastmark);
          cptr = st.ptr;
          const ret = yield [pc + 3, 0];
          if (ret) {
            markDiscard(st, lastmark);
            count++;
          } else {
            markPop(st, lastmark);
            st.lastmark = lastmark;
            st.lastindex = lastindex;
            st.ptr = cptr;
            break;
          }
        }
        st.repeat = rep.prev;
        pc += code[pc] + 1;
        ptr = st.ptr;
        break;
      }
      case ATOMIC_GROUP: {
        st.ptr = ptr;
        const ret = yield [pc + 1, 0];
        if (!ret) {
          st.ptr = ptr;
          return 0;
        }
        pc += code[pc];
        ptr = st.ptr;
        break;
      }
      case GROUPREF:
      case GROUPREF_IGNORE:
      case GROUPREF_UNI_IGNORE: {
        const g = code[pc] * 2;
        if (g >= st.lastmark) return 0;
        let p = st.mark[g];
        const e = st.mark[g + 1];
        if (p === null || p === undefined || e === null || e === undefined || e < p) return 0;
        const fold = op === GROUPREF ? null : op === GROUPREF_IGNORE ? asciiLower : uniLower;
        while (p < e) {
          if (ptr >= end) return 0;
          if (fold ? fold(s[ptr]) !== fold(s[p]) : s[ptr] !== s[p]) return 0;
          p++; ptr++;
        }
        pc += 1;
        break;
      }
      case GROUPREF_EXISTS: {
        const g = code[pc] * 2;
        if (g >= st.lastmark) { pc += code[pc + 1]; break; }
        const p = st.mark[g];
        const e = st.mark[g + 1];
        if (p === null || p === undefined || e === null || e === undefined || e < p) { pc += code[pc + 1]; break; }
        pc += 2;
        break;
      }
      case ASSERT: {
        const back = code[pc + 1];
        if (ptr < back) return 0;
        st.ptr = ptr - back;
        const ret = yield [pc + 2, 0];
        if (!ret) return 0;
        pc += code[pc];
        break;
      }
      case ASSERT_NOT: {
        const back = code[pc + 1];
        if (ptr >= back) {
          st.ptr = ptr - back;
          const lastmark = st.lastmark;
          const lastindex = st.lastindex;
          const rp = st.repeat !== null;
          if (rp) markPush(st, lastmark);
          const ret = yield [pc + 2, 0];
          if (ret) {
            if (rp) markDiscard(st, lastmark);
            return 0;
          }
          if (rp) markPop(st, lastmark);
          st.lastmark = lastmark;
          st.lastindex = lastindex;
        }
        pc += code[pc];
        break;
      }
      case FAILURE:
        return 0;
      default:
        throw new Error(`internal: unknown opcode ${op}`);
    }
  }
}

// trampoline: runs nested contexts on an explicit stack (no JS recursion)
function runMatch(st, pc, toplevel) {
  const stack = [sreMatch(st, pc, toplevel)];
  let res = stack[0].next();
  for (;;) {
    if (res.done) {
      stack.pop();
      if (stack.length === 0) return res.value;
      res = stack[stack.length - 1].next(res.value);
    } else {
      const [npc, ntl] = res.value;
      const g = sreMatch(st, npc, ntl);
      stack.push(g);
      res = g.next();
    }
  }
}

function stateReset(st) {
  st.lastmark = -1;
  st.lastindex = -1;
  st.repeat = null;
  st.data = [];
}

function sreSearch(st) {
  let ptr = st.start;
  let end = st.end;
  if (ptr > end) return 0;
  const min = st.code[3];
  if (min && end - ptr < min) return 0;
  if (min > 1) {
    end -= min - 1;
    if (end <= ptr) end = ptr;
  }
  if (st.code[2] & SRE_INFO_CHARSET) {
    // pattern starts with a character from a known set
    end = st.end;
    st.mustAdvance = false;
    for (;;) {
      while (ptr < end && !inCharset(st, 5, st.str[ptr])) ptr++;
      if (ptr >= end) return 0;
      st.start = st.ptr = ptr;
      const status = runMatch(st, 0, 0);
      if (status !== 0) return status;
      ptr++;
      st.lastmark = -1;
      st.lastindex = -1;
    }
  }
  st.start = st.ptr = ptr;
  let status = runMatch(st, 0, 1);
  st.mustAdvance = false;
  while (status === 0 && ptr < end) {
    ptr++;
    st.lastmark = -1;
    st.lastindex = -1;
    st.start = st.ptr = ptr;
    status = runMatch(st, 0, 0);
  }
  return status;
}

function sreMatchTop(st) {
  return runMatch(st, 0, 1);
}

// ─── Pattern / Match objects (_sre.c) ────────────────────────────────
const toCodes = (str) => Array.from(str, (c) => c.codePointAt(0));
const fromCodes = (codes, a, b) => {
  let out = '';
  for (let i = a; i < b; i++) out += String.fromCodePoint(codes[i]);
  return out;
};
// %.NR: repr() cut to N code points
const reprCut = (s, n) => cps(pyStrRepr(s)).slice(0, n).join('');

const FLAG_NAMES = [
  ['re.IGNORECASE', SRE_FLAG_IGNORECASE], ['re.LOCALE', SRE_FLAG_LOCALE], ['re.MULTILINE', SRE_FLAG_MULTILINE],
  ['re.DOTALL', SRE_FLAG_DOTALL], ['re.UNICODE', SRE_FLAG_UNICODE], ['re.VERBOSE', SRE_FLAG_VERBOSE],
  ['re.DEBUG', SRE_FLAG_DEBUG], ['re.ASCII', SRE_FLAG_ASCII],
];


class SreState {
  constructor(pattern, string, pos, endpos) {
    if (typeof string !== 'string') {
      throw pyErr('TypeError', `expected string or bytes-like object, got '${pyTypeName(string)}'`);
    }
    this.string = string;
    this.str = toCodes(string);
    const len = this.str.length;
    let start = pos === undefined ? 0 : pos;
    let end = endpos === undefined ? len : endpos;
    if (start < 0) start = 0;
    else if (start > len) start = len;
    if (end < 0) end = 0;
    else if (end > len) end = len;
    this.code = pattern.code;
    this.maps = pattern.maps;
    this.pos = start;
    this.endpos = end;
    this.start = start;
    this.end = end;
    this.ptr = start;
    this.mark = [];
    this.lastmark = -1;
    this.lastindex = -1;
    this.repeat = null;
    this.data = [];
    this.mustAdvance = false;
    this.matchAll = false;
    this.steps = 0;
  }
  // state_getslice: group text, or None ('' when `empty`)
  getslice(index, empty) {
    const j = (index - 1) * 2;
    if (j >= this.lastmark || this.mark[j] == null || this.mark[j + 1] == null) return empty ? '' : null;
    const a = this.mark[j];
    const b = this.mark[j + 1];
    if (a > b) throw pyErr('SystemError', 'The span of capturing group is wrong, please report a bug for the re module.');
    return fromCodes(this.str, a, b);
  }
}

function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (typeof v === 'boolean') return 'bool';
  if (Array.isArray(v)) return 'list';
  return typeof v;
}

export class Match {
  constructor(pattern, st) {
    this.re = pattern;
    this.string = st.string;
    this.pos = st.pos;
    this.endpos = st.endpos;
    this._codes = st.str;
    // regs: [start, end] per group; -1 for groups that did not take part
    const regs = [[st.start, st.ptr]];
    for (let i = 0, j = 0; i < pattern.groups; i++, j += 2) {
      if (j + 1 <= st.lastmark && st.mark[j] != null && st.mark[j + 1] != null) {
        const a = st.mark[j];
        const b = st.mark[j + 1];
        if (a > b) throw pyErr('SystemError', 'The span of capturing group is wrong, please report a bug for the re module.');
        regs.push([a, b]);
      } else {
        regs.push([-1, -1]);
      }
    }
    this._regs = regs;
    this.lastindex = st.lastindex >= 0 ? st.lastindex : null;
    this.lastgroup = this.lastindex !== null && pattern.indexgroup[this.lastindex] ? pattern.indexgroup[this.lastindex] : null;
  }
  _index(g) {
    let i = -1;
    if (g === undefined) return 0;
    if (typeof g === 'boolean') i = g ? 1 : 0;
    else if (typeof g === 'number' && Number.isInteger(g)) i = g;
    else if (typeof g === 'string') {
      if (this.re.groupindexMap.has(g)) i = this.re.groupindexMap.get(g);
    } else {
      throw pyErr('IndexError', 'no such group');
    }
    if (i < 0 || i > this.re.groups) throw pyErr('IndexError', 'no such group');
    return i;
  }
  _slice(i, dflt = null) {
    const [a, b] = this._regs[i];
    if (a < 0) return dflt;
    return fromCodes(this._codes, a, b);
  }
  group(...args) {
    if (args.length === 0) return this._slice(0);
    if (args.length === 1) return this._slice(this._index(args[0]));
    return { __pyTuple: args.map((g) => this._slice(this._index(g))) };
  }
  getitem(g) { return this._slice(this._index(g)); }
  groups(dflt = null) {
    const out = [];
    for (let i = 1; i <= this.re.groups; i++) out.push(this._slice(i, dflt));
    return { __pyTuple: out };
  }
  groupdict(dflt = null) {
    const out = {};
    for (const [name, i] of this.re.groupindexMap) out[name] = this._slice(i, dflt);
    return out;
  }
  start(g) { return this._regs[this._index(g)][0]; }
  end(g) { return this._regs[this._index(g)][1]; }
  span(g) { return { __pyTuple: [...this._regs[this._index(g)]] }; }
  get regs() { return { __pyTuple: this._regs.map((r) => ({ __pyTuple: [...r] })) }; }
  expand(template) {
    return expandTemplate(compileTemplate(this.re, template), this);
  }
  repr() {
    const [a, b] = this._regs[0];
    return `<re.Match object; span=(${a}, ${b}), match=${reprCut(this._slice(0), 50)}>`;
  }
  get __pyRaw() { return this.repr(); }
}

function compileTemplate(pattern, repl) {
  if (typeof repl !== 'string') throw pyErr('TypeError', `expected str instance, ${pyTypeName(repl)} found`);
  return parseTemplate(repl, pattern);
}
function expandTemplate(tpl, m) {
  let out = '';
  for (const part of tpl) {
    if (typeof part === 'string') out += part;
    else out += m._slice(part, null) ?? '';
  }
  return out;
}

export class Pattern {
  constructor(pattern, flags, p) {
    const maps = [];
    const allFlags = p.state.flags | flags;
    const code = compileInfo(p, allFlags, maps);
    compileInto(code, p.data, allFlags, maps);
    code.push(SUCCESS);
    this.code = code;
    this.maps = maps;
    this.pattern = pattern;
    this.flags = flags | p.state.flags;
    this.groups = p.state.groups - 1;
    this.groupindexMap = new Map(p.state.groupdict);
    this.indexgroup = new Array(p.state.groups).fill(null);
    for (const [k, i] of p.state.groupdict) this.indexgroup[i] = k;
  }
  // a mappingproxy — or a plain empty dict when the pattern has no names
  get groupindex() {
    if (this.groupindexMap.size === 0) return { __pyRaw: '{}' };
    const inner = [...this.groupindexMap].map(([k, v]) => `${pyStrRepr(k)}: ${v}`).join(', ');
    return { __pyRaw: `mappingproxy({${inner}})` };
  }
  _state(string, pos, endpos) { return new SreState(this, string, pos, endpos); }
  _new(st, status) { return status ? new Match(this, st) : null; }
  match(string, pos, endpos) {
    const st = this._state(string, pos, endpos);
    return this._new(st, sreMatchTop(st));
  }
  fullmatch(string, pos, endpos) {
    const st = this._state(string, pos, endpos);
    st.matchAll = true;
    return this._new(st, sreMatchTop(st));
  }
  search(string, pos, endpos) {
    const st = this._state(string, pos, endpos);
    return this._new(st, sreSearch(st));
  }
  findall(string, pos, endpos) {
    const st = this._state(string, pos, endpos);
    const out = [];
    while (st.start <= st.end) {
      stateReset(st);
      st.ptr = st.start;
      if (!sreSearch(st)) break;
      let item;
      if (this.groups === 0) item = fromCodes(st.str, st.start, st.ptr);
      else if (this.groups === 1) item = st.getslice(1, true);
      else {
        const t = [];
        for (let i = 1; i <= this.groups; i++) t.push(st.getslice(i, true));
        item = { __pyTuple: t };
      }
      out.push(item);
      st.mustAdvance = st.ptr === st.start;
      st.start = st.ptr;
    }
    return out;
  }
  finditer(string, pos, endpos) {
    const sc = this.scanner(string, pos, endpos);
    const out = [];
    for (;;) {
      const m = sc.search();
      if (!m) break;
      out.push(m);
    }
    return out;
  }
  scanner(string, pos, endpos) {
    const st = this._state(string, pos, endpos);
    const self = this;
    let done = false;
    const step = (fn) => {
      if (done) return null;
      stateReset(st);
      st.ptr = st.start;
      const status = fn(st);
      const m = self._new(st, status);
      if (!status) done = true;
      else {
        st.mustAdvance = st.ptr === st.start;
        st.start = st.ptr;
      }
      return m;
    };
    return {
      pattern: this,
      match: () => step(sreMatchTop),
      search: () => step(sreSearch),
      get __pyRaw() { return '<_sre.SRE_Scanner object>'; },
    };
  }
  split(string, maxsplit = 0) {
    const st = this._state(string);
    const out = [];
    let n = 0;
    let last = st.start;
    while (!maxsplit || n < maxsplit) {
      stateReset(st);
      st.ptr = st.start;
      if (!sreSearch(st)) break;
      out.push(fromCodes(st.str, last, st.start));
      for (let i = 0; i < this.groups; i++) out.push(st.getslice(i + 1, false));
      n += 1;
      st.mustAdvance = st.ptr === st.start;
      last = st.start = st.ptr;
    }
    out.push(fromCodes(st.str, last, st.endpos));
    return out;
  }
  subn(repl, string, count = 0) {
    let filter;
    if (typeof repl === 'function') filter = repl;
    else if (typeof repl === 'string') {
      const tpl = repl.includes('\\') ? compileTemplate(this, repl) : [repl];
      filter = (m) => expandTemplate(tpl, m);
    } else throw pyErr('TypeError', `expected str instance, ${pyTypeName(repl)} found`);
    const st = this._state(string);
    let out = '';
    let n = 0;
    let i = 0;
    while (!count || n < count) {
      stateReset(st);
      st.ptr = st.start;
      if (!sreSearch(st)) break;
      const b = st.start;
      const e = st.ptr;
      if (i < b) out += fromCodes(st.str, i, b);
      const m = new Match(this, st);
      const r = filter(m);
      if (r !== null && r !== undefined) out += r;
      i = e;
      n += 1;
      st.mustAdvance = st.ptr === st.start;
      st.start = st.ptr;
    }
    if (i < st.endpos) out += fromCodes(st.str, i, st.endpos);
    return { __pyTuple: [out, n] };
  }
  sub(repl, string, count = 0) {
    return this.subn(repl, string, count).__pyTuple[0];
  }
  repr() {
    let flags = this.flags;
    if ((flags & (SRE_FLAG_LOCALE | SRE_FLAG_UNICODE | SRE_FLAG_ASCII)) === SRE_FLAG_UNICODE) flags &= ~SRE_FLAG_UNICODE;
    const items = [];
    for (const [name, v] of FLAG_NAMES) {
      if (flags & v) {
        items.push(name);
        flags &= ~v;
      }
    }
    if (flags) items.push('0x' + flags.toString(16));
    const p = reprCut(this.pattern, 200);
    return items.length ? `re.compile(${p}, ${items.join('|')})` : `re.compile(${p})`;
  }
  get __pyRaw() { return this.repr(); }
}

// ─── module functions (Lib/re/__init__.py) ───────────────────────────
const cache = new Map();

export function compile(pattern, flags = 0) {
  if (pattern instanceof Pattern) {
    if (flags) throw pyErr('ValueError', 'cannot process flags argument with a compiled pattern');
    return pattern;
  }
  if (typeof pattern !== 'string') throw pyErr('TypeError', 'first argument must be string or compiled pattern');
  const key = `${flags}\u0000${pattern}`;
  if (cache.has(key)) return cache.get(key);
  const p = new Pattern(pattern, flags, parse(pattern, flags));
  if (cache.size >= 512) cache.delete(cache.keys().next().value);
  cache.set(key, p);
  return p;
}
export const search = (pattern, string, flags = 0) => compile(pattern, flags).search(string);
export const match = (pattern, string, flags = 0) => compile(pattern, flags).match(string);
export const fullmatch = (pattern, string, flags = 0) => compile(pattern, flags).fullmatch(string);
export const findall = (pattern, string, flags = 0) => compile(pattern, flags).findall(string);
export const finditer = (pattern, string, flags = 0) => compile(pattern, flags).finditer(string);
export const split = (pattern, string, maxsplit = 0, flags = 0) => compile(pattern, flags).split(string, maxsplit);
export const sub = (pattern, repl, string, count = 0, flags = 0) => compile(pattern, flags).sub(repl, string, count);
export const subn = (pattern, repl, string, count = 0, flags = 0) => compile(pattern, flags).subn(repl, string, count);
export function purge() {
  cache.clear();
  return null;
}

const SPECIAL_ESCAPE = new Set('()[]{}?*+-|^$\\.&~# \t\n\r\v\f');
export function escape(s) {
  let out = '';
  for (const ch of s) out += SPECIAL_ESCAPE.has(ch) ? '\\' + ch : ch;
  return out;
}

// RegexFlag values and repr (enum global_flag_repr, definition order)
export const RE_FLAGS = {
  NOFLAG: 0, A: 256, ASCII: 256, I: 2, IGNORECASE: 2, L: 4, LOCALE: 4, U: 32, UNICODE: 32,
  M: 8, MULTILINE: 8, S: 16, DOTALL: 16, X: 64, VERBOSE: 64, DEBUG: 128,
};
const FLAG_ORDER = [['ASCII', 256], ['IGNORECASE', 2], ['LOCALE', 4], ['UNICODE', 32], ['MULTILINE', 8], ['DOTALL', 16], ['VERBOSE', 64], ['DEBUG', 128]];
export function flagRepr(value) {
  if (value === 0) return 're.NOFLAG';
  const names = [];
  let rest = value;
  for (const [name, v] of FLAG_ORDER) {
    if (value & v) {
      names.push('re.' + name);
      rest &= ~v;
    }
  }
  if (names.length === 0) return `re.RegexFlag(${value})`;
  if (rest) names.push('0x' + rest.toString(16));
  return names.join('|');
}
// flags spelled as in Python source ("re.I | re.M", "0") → int
export function parseFlagsExpr(text) {
  const t = String(text).trim();
  if (t === '' || t === '0') return 0;
  let v = 0;
  for (const part of t.split('|')) {
    const name = part.trim().replace(/^re\./, '');
    if (!Object.prototype.hasOwnProperty.call(RE_FLAGS, name)) {
      throw pyErr('AttributeError', `module 're' has no attribute ${pyStrRepr(name)}`);
    }
    v |= RE_FLAGS[name];
  }
  return v;
}

// for the verification harness
export const _internals = { uniIsWord, uniIsDigit, uniIsSpace, uniLower, uniUpper, uniIsCased };
