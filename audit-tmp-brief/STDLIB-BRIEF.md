# Python standard-library pages — writer brief

Repo: `D:\next js\my projects\webdevdata-app-recovered` (Next.js 14 pages router). Python 3.13 is `python`, Node 22 is `node`.

## ABSOLUTE RULES
1. **Never run any git write command.**
2. **Only create/edit your assigned files** (listed in your assignment). Never touch shared components, utils (except files your assignment names), audits, generators, other pages.
3. **Never state an output, error message, position or version fact you have not verified** by running real `python` or reading docs.python.org. This includes PROSE: demoExplainer, FAQ answers, notes, subtitles. The audits check code outputs but not prose — the lead already caught one wrong column number in an explainer. Every number, message or position you mention in prose must be one you saw CPython produce.
4. Do not start dev servers or run `npm run build`.

## Layout
- Module folder: `content/reference/python/stdlib/<module>/` — `index.js` is the module hub, every other `<slug>.js` is a member page. Emulators mirror it: `utils/emulators/python/stdlib/<module>/<slug>.js`.
- Member `meta.category` is the member KIND: `'functions' | 'classes' | 'exceptions' | 'constants'` (drives the hub's grid and the sibling rail). `meta.type`: `'function' | 'class' | 'exception' | 'constant'`. `meta.name` is dotted: `'json.dumps'`, `'json.JSONDecodeError'`. Slug = lowercase name without the module (`dumps`, `jsondecodeerror`).
- **`method.covers`**: the exact public names (from `module.__all__`) the page documents. Every name in `__all__` must be claimed by exactly one member page — audited.
- Exception members also need `method.chain` (real MRO names, e.g. `['BaseException', 'Exception', 'ValueError', 'JSONDecodeError']`) — audited — and get the ExceptionHero automatically.
- Function/class members render with MethodHero: `signature` (hover-explained against `parameters`), `cheat` { commonCall, returns, replaces, watchOut }, `returns` { type, desc }.
- `related`: bare slug = same module; `category: 'stdlib'` + module name = a module hub; `category: 'stdlib/<module>'` = another module's member; `category: 'functions' | 'exceptions' | 'keywords' | 'operators'` for other sections. Verify every target file exists.

## What "complete" means for a module (audited)
- Every name in `module.__all__` (else its public non-module names), PLUS every public name each class listed in the hub's `method.coverClasses` defines ITSELF (`vars(cls)`, not inherited) — written `'Class.name'` in `covers` (e.g. `'datetime.strftime'`, `'Path.read_text'`, `'Match.group'`). Each claimed by exactly one member page.
- Consolidate genuine families on one page, as the other sections do: e.g. `date.year/month/day` → one "date attributes" page; `Path.is_file/is_dir/exists/…` → one page. A family page's `covers` lists every name it documents. Consolidated names must also appear in that page's `searchTerms` (spaces between words; dotted names fine).
- Method/attribute member pages use `meta.category: 'methods'`, `meta.type: 'method'` (or 'attribute'), `meta.name` as written in code (`'datetime.strftime'`, `'Path.read_text'`, `'Counter.most_common'`, `'Match.group'`).
- Platform-specific names (Windows-only / Unix-only) still need a page (can be a doc-only family page); explain availability.

## Platform determinism (the audit runs on WINDOWS; readers are mostly Linux/macOS)
- `pathlib.Path(...)` is `WindowsPath` on the audit machine: its repr and `str()` use backslashes. In verified snippets use `PurePosixPath` for path arithmetic, and for filesystem demos show only platform-neutral values (`.name`, `.suffix`, `.read_text()`, `.as_posix()`, booleans). Explain the Path → PosixPath / WindowsPath rule in prose.
- `time.strftime` / `datetime.strftime` directives that depend on the C library or locale (`%c`, `%x`, `%X`, `%p` in some locales, `%-d`, `%e`, `%G` on some platforms …) must not appear in verified output; verify the portable ones on this machine AND say in prose which are platform-dependent. Never depend on the local timezone or the current time: always construct fixed datetimes; use `timezone.utc` / fixed offsets.

## Batch 2 additions (os, os.path, sys, math, random, itertools, functools)
- **Module folder vs import name**: the folder for `os.path` is `os-path`; the hub's `meta.name` is the real import name (`'os.path'`) and the audit imports by it. Member slugs stay simple (`join`, `splitext`).
- **Route files and emulator maps already exist** for every assigned module (`pages/reference/python/stdlib/<folder>/`, `utils/emulators-maps/python-stdlib-<folder>.js` is generated). Do not touch them.
- **Platform-dependent surfaces** (`os`, `sys`): the audit computes `__all__` on Windows. Get the Linux list from WSL — `MSYS_NO_PATHCONV=1 wsl -e python3 -c "import os; print(sorted(os.__all__))"` (that is CPython 3.12 on Linux; note 3.13 additions from the docs) — and put every public name that exists on Linux but not on Windows in the hub's `method.platformNames` (they then count toward coverage). Windows-only names are already in the Windows list. Availability ("Unix only", "Windows only") must be stated on the page, taken from docs.python.org's "Availability:" lines.
- **WSL Python 3.12 is available** for verifying Linux-side claims; mention the 3.12-vs-3.13 caveat if a result could differ.
- **Floating point (math, random, statistics-like code)**: CPython's math functions call the platform C library — results can differ in the last digit between Windows (MSVC) and Linux (glibc), and JS `Math.*` can differ from both. For every live float result, verify the emulator against Windows CPython AND WSL CPython; where JS `Math` is not bit-identical, implement the computation exactly (e.g. correctly-rounded algorithms, BigInt arithmetic, ports of CPython's own C code such as math.fsum, math.comb/perm/isqrt/gcd/lcm, math.factorial, math.prod) or choose demo inputs whose results are exact — and say in prose which functions are platform-libm dependent. Never let a demo show a float that differs from what the reader's CPython prints.
- **random**: port MT19937 and CPython's Lib/random.py algorithms exactly (seed() for int/str/bytes — version 2 str seeding uses SHA-512 —, getrandbits, _randbelow, random, randint/randrange, choice, choices with weights/cum_weights, shuffle, sample, uniform, triangular, gauss/normalvariate, binomialvariate 3.12+…) so seeded demos reproduce CPython exactly. Unseeded results are non-deterministic: demos must seed.
- **sys / os**: anything that depends on the machine (paths, environment, pid, versions, platform, argv, memory sizes) is doc-only for that part or shown with values computed in the snippet itself; state that the real value varies.

## Study first (read fully)
- Anchor hub: `content/reference/python/stdlib/json/index.js`; anchor member: `content/reference/python/stdlib/json/loads.js` — copy shape and quality exactly.
- Anchor emulators: `utils/emulators/python/stdlib/json/index.js`, `loads.js`, and the CPython port they use: `utils/emulators/python/stdlib/json/_pyjson.js` (loads / rawDecode / dumps with every option, PyDict / PyFloat value model, `asPy` / `pyValRepr` for exact repr). It is verified exact against CPython on ~50,000 fuzzed cases — build on it, don't reimplement.
- `utils/demo-coerce.js` (input kinds; `{$param}` filling; `pyStrRepr`, `pyFloatRepr`, `pyReprExact`), `utils/py-num.js` (Python numbers from demo inputs), `utils/py-exceptions.js`, `app/components/reference/snippet/SnippetDemo.jsx`, `audit-pysnippets.mjs` (exact output rules).

## Fields, demos, snippets
Same rules as the other sections:
- `modes`: tabs, each `{ id, label, blurb, params, template, cases }`, placeholders `{$param}`, template shown AND run verbatim in CPython; the final line is an expression; no print(). Every template starts with its imports (`import json`).
- Emulator: default-export an object keyed by mode id; genuine reimplementation over the whole input space — never a lookup of the case values. Return values via `asPy(...)` when they contain json-port values.
- `examples` (5–8) and `pitfalls` (2–4) are run by the audit: exact output = stdout, then repr of a final non-None expression, then an uncaught exception's traceback last line (qualified for non-builtins: `json.decoder.JSONDecodeError: …`). Deterministic, platform-independent, no network, files only inside the temp cwd (create them in the snippet), and never mutate global state outside a context manager (all snippets share one process).
- `patterns` must compile. `faq` 3–5 real search questions. `officialDocs` → docs.python.org/3/library/<module>.html#<anchor>, label 'docs.python.org'. `tryInTool` only if relevant (JSON Formatter /tools/json-formatter and JSON Tree /tools/json-tree are relevant for json).
- Plain text, no HTML entities; JS quoting with apostrophes → double quotes/template literals; parse-check every file; never write the text `\uD800`–`\uDFFF` (backslash-u + surrogate hex) in a content string.
- Fuzz your emulators yourself against CPython in the OS temp dir (not the repo), beyond the audit cases.

## Verify — done only when clean for YOUR files
```
node generate-reference-catalogs.mjs               # regenerate so new pages/emulators are mapped
node --no-warnings audit-snippets.mjs --verbose    # EXAMPLE/PITFALL/PATTERN/CHAIN = 0 for yours; MODCOVERAGE for your module = 0
node --no-warnings audit-emulators.mjs             # MODE has none of yours
node --no-warnings audit-content.mjs               # no problems for yours
```

## Final report (short)
Pages written, live vs doc-only (reason), audit results, facts that differed from expectations, shared-code problems (report, don't fix).
