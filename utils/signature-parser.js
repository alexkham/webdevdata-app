// utils/signature-parser.js
//
// Tokenizes a method signature string into segments MethodHero can render
// with hover explainers on each parameter.
//
//   parseSignature('str.replace(old, new, count=-1)', parameters)
//     → [
//         { kind: 'prefix', text: 'str.' },
//         { kind: 'name',   text: 'replace' },
//         { kind: 'paren',  text: '(' },
//         { kind: 'param',  text: 'old',   hint: {...} },
//         { kind: 'sep',    text: ', ' },
//         { kind: 'param',  text: 'new',   hint: {...} },
//         { kind: 'sep',    text: ', ' },
//         { kind: 'param',  text: 'count', hint: {...} },
//         { kind: 'default', text: '=-1' },
//         { kind: 'paren',  text: ')' },
//       ]
//
// `parameters` is the method.parameters array; each param token gets a
// `hint` object { desc, type, required, default } when a matching entry
// exists, so the component needs no further lookups.

export function parseSignature(signature, parameters = []) {
  const byName = new Map(parameters.map((p) => [p.name, p]));
  const tokens = [];

  const openIdx = signature.indexOf('(');
  if (openIdx === -1) {
    return [{ kind: 'name', text: signature }];
  }

  // Everything before '(' — split a dotted receiver prefix from the name.
  const head = signature.slice(0, openIdx);
  const lastDot = head.lastIndexOf('.');
  if (lastDot !== -1) {
    tokens.push({ kind: 'prefix', text: head.slice(0, lastDot + 1) });
    tokens.push({ kind: 'name', text: head.slice(lastDot + 1) });
  } else {
    tokens.push({ kind: 'name', text: head });
  }

  tokens.push({ kind: 'paren', text: '(' });

  const closeIdx = signature.lastIndexOf(')');
  const inner = signature.slice(openIdx + 1, closeIdx === -1 ? signature.length : closeIdx);

  const parts = inner.split(',');
  parts.forEach((part, i) => {
    if (i > 0) tokens.push({ kind: 'sep', text: ', ' });

    const trimmed = part.trim();
    if (trimmed === '') return;

    const eqIdx = trimmed.indexOf('=');
    const pname = (eqIdx === -1 ? trimmed : trimmed.slice(0, eqIdx)).trim();
    const p = byName.get(pname.replace(/^[*]+/, ''));

    tokens.push({
      kind: 'param',
      text: pname,
      hint: p
        ? { desc: p.desc, type: p.type, required: p.required, default: p.default }
        : null,
    });
    if (eqIdx !== -1) {
      tokens.push({ kind: 'default', text: `=${trimmed.slice(eqIdx + 1).trim()}` });
    }
  });

  if (closeIdx !== -1) tokens.push({ kind: 'paren', text: ')' });

  return tokens;
}
