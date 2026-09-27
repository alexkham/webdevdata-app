// content/reference/javascript/methods/set-delete.js
//
// clear is consolidated here, matching the map-delete page.

export const meta = {
  slug:        'set-delete',
  name:        'Set.prototype.delete',
  signature:   'set.delete(value)',
  blurb:       'Removes a member and reports whether it was there.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Set delete remove clear member boolean return size WeakSet memory leak es2015 javascript',
};

export const method = {
  slug:      'set-delete',
  name:      'Set.prototype.delete',
  signature: 'set.delete(value)',
  returns:   { type: 'boolean', desc: 'True if a member was removed, false if it was not there. clear() removes everything and returns undefined.' },

  category:    'Set method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The mirror of add, with a useful return value — it doubles as a has() check, so you rarely need both.',

  cheat: {
    commonCall: 'set.delete(value)',
    returns:    'boolean — was it actually there?',
    replaces:   'splice after indexOf on an array',
    watchOut:   'a Set holds members strongly — use WeakSet for objects',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'The member to remove, matched by SameValueZero. A missing value is not an error — it returns false.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON array, e.g. [1,2]', input: 'text' },
    { name: 'v',    type: 'number', hint: 'value to delete',        input: 'number' },
  ],
  demoTemplate: '(s => [s.delete({v}), s.size])(new Set(JSON.parse({json})))',
  cases: [
    { id: 'hit',   label: 'present → true',   values: { json: '[1,2,3]', v: 2 } },
    { id: 'miss',  label: 'absent → false',   values: { json: '[1,2,3]', v: 9 } },
    { id: 'last',  label: 'the only member',  values: { json: '[1]', v: 1 } },
    { id: 'empty', label: 'from an empty Set',values: { json: '[]', v: 1 } },
  ],
  demoExplainer: "The pair is [did it delete, how many remain]. That boolean makes delete self-checking: calling it and acting on the result is one hash lookup where has-then-delete would be two. Removing something absent is harmless — false, and nothing changes — so delete is safe to call unconditionally.",

  patterns: [
    {
      name: 'Toggle membership',
      desc: 'delete returns false when it was not there, so add.',
      code: 'if (!selected.delete(id)) selected.add(id);',
    },
    {
      name: 'Delete and react',
      desc: 'The boolean saves a separate check.',
      code: 'if (queue.delete(job)) log("cancelled", job);',
    },
    {
      name: 'Let objects be collected',
      desc: 'WeakSet does not hold its members alive.',
      code: 'const processed = new WeakSet();\nprocessed.add(node);',
    },
  ],

  examples: [
    { title: 'Present',      code: 'new Set([1]).delete(1)', returns: 'true' },
    { title: 'Absent',       code: 'new Set().delete(1)',    returns: 'false' },
    { title: 'Twice',        code: 'const s = new Set([1]);\n[s.delete(1), s.delete(1)]', returns: '[true, false]' },
    { title: 'clear returns undefined', code: 'new Set([1]).clear()', returns: 'undefined' },
    { title: 'Size after clear', code: 'const s = new Set([1]);\ns.clear();\ns.size', returns: '0' },
    { title: 'Objects need the reference', code: 'new Set([{}]).delete({})', returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'A Set holds its members strongly',
      desc: 'Tracking DOM nodes or component instances in a long-lived Set keeps every one alive, even after the rest of the app has forgotten them. WeakSet exists for exactly this, at the cost of not being iterable and having no size.',
      wrong: { label: 'Never collected', code: 'const seen = new Set();\nseen.add(node);', output: 'node stays alive' },
      fix:   { label: 'WeakSet',         code: 'const seen = new WeakSet();\nseen.add(node);', output: 'collectable' },
    },
    {
      name: 'Object members need the original reference',
      desc: 'delete matches by identity like everything else on a Set. An equal-looking object will not remove the stored one, and the false return is the only clue.',
      wrong: { label: 'Not removed', code: 'const s = new Set([{id: 1}]);\ns.delete({id: 1});\ns.size', output: '1' },
      fix:   { label: 'Same reference', code: 'const o = {id: 1};\nconst s = new Set([o]);\ns.delete(o);\ns.size', output: '0' },
    },
    {
      name: 'clear returns undefined, not a count',
      desc: 'Read size first if you need to know how many members were discarded.',
      wrong: { label: 'No information', code: 'const n = set.clear();', output: 'undefined' },
      fix:   { label: 'Count first',    code: 'const n = set.size;\nset.clear();', output: 'the old size' },
    },
    {
      name: 'Deleting during iteration skips members',
      desc: 'The iterator honours live changes, so removing a member you have not reached means it is never visited. Iterate a spread snapshot when you intend to modify.',
      wrong: { label: 'Skips', code: 'for (const x of s) s.delete(other);', output: 'other never visited' },
      fix:   { label: 'Snapshot', code: 'for (const x of [...s]) s.delete(x);', output: 'visits everything' },
    },
  ],

  when: {
    use: [
      'Removing one member, especially when you want to know it existed',
      'Toggling membership, using the boolean',
      'clear() to reset without reallocating',
    ],
    avoid: [
      'Object members that should be garbage collected → WeakSet',
      'Removing many members by a predicate → rebuild from a filtered spread',
      'You want the removed value → you already have it; delete returns a boolean',
    ],
  },

  notes: {
    complexity: 'O(1) average for delete; O(n) for clear',
    return:     'A boolean from delete, undefined from clear',
    cpython:    'V8: Builtins-set-delete',
    memory:     'Frees the member; the backing store may not shrink immediately',
    threadSafe: 'Single-threaded; deletion during iteration is defined but easy to misread',
  },

  related: [
    { name: 'Set.prototype.add',    slug: 'set-add',       when: 'Adding members back' },
    { name: 'Set.prototype.has',    slug: 'set-has',       when: 'Testing without removing' },
    { name: 'Set.size',             slug: 'set-size',      when: 'Checking what is left' },
    { name: 'Set.prototype.difference', slug: 'set-difference', when: 'Removing many members at once' },
  ],

  faq: [
    {
      q: 'How do I toggle a value?',
      a: 'Use the return value — delete tells you whether it was there, so a failed delete means it should be added. One lookup instead of two.',
      code: 'if (!s.delete(v)) s.add(v);',
    },
    {
      q: 'When should I use WeakSet?',
      a: 'When the members are objects whose lifetime you do not control, and you only ever need has, add and delete. It cannot be iterated and has no size, precisely because members can vanish when collected.',
    },
    {
      q: 'How do I remove everything matching a condition?',
      a: 'There is no filter on Set. Rebuild from a filtered spread, or — for removing the contents of another Set — use difference, which is clearer and does it in one call.',
      code: 'const kept = new Set([...s].filter(x => x > 0));\nconst kept2 = s.difference(unwanted);',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Set added with delete and clear, along with WeakSet.' },
    { version: 'ES2025', note: 'difference added, giving a declarative way to remove many members.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete',
    meta:  'Set.prototype.delete',
  },

  tryInTool: [],
};
