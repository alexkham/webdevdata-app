// content/reference/python/stdlib/xml-etree-elementtree/element-iter.js — Element.iter, Element.itertext, ElementTree.iter

export const meta = {
  slug:        'element-iter',
  name:        'Element.iter',
  signature:   'Element.iter(tag=None) / Element.itertext() / ElementTree.iter(tag=None)',
  blurb:       'Walk a whole subtree: iter() yields the element and every descendant in document order (optionally only one tag); itertext() yields all the text inside.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.7+ / 3.2+',
  searchTerms: 'Element.iter Element.itertext ElementTree.iter elementtree iterate all elements python xml walk tree recursively every descendant get all text inner text join itertext iter tag getiterator',
};

export const method = {
  slug:      'element-iter',
  name:      'Element.iter',
  signature: 'Element.iter(tag=None) / Element.itertext() / ElementTree.iter(tag=None)',
  returns:   { type: 'iterator', desc: 'iter: Elements (this one first, then descendants depth-first); itertext: str pieces.' },

  category:    'xml.etree.ElementTree method',
  version:     'Python 2.7+ / 3.2+',
  hasLiveDemo: true,

  subtitle: 'iter() is the recursive walk: the element itself, then its descendants depth-first, filtered by tag if you give one. itertext() walks the same way but yields text — the way to get "all the text inside" an element, nested markup included.',

  covers: ['Element.iter', 'Element.itertext', 'ElementTree.iter'],

  cheat: {
    commonCall: "for item in root.iter('item'): ...",
    returns:    'an iterator — wrap it in list() to keep or reuse the result',
    replaces:   'hand-written recursion over children; the removed getiterator()',
    watchOut:   'Removing elements while iterating skips some — iterate over list(root.iter(...))',
  },

  parameters: [
    { name: 'tag', type: 'str | None', required: false, default: 'None', desc: 'iter only: yield just the elements with this tag ({uri}local for namespaced tags). None or "*" yields every element.' },
  ],

  modes: [
    {
      id: 'iter',
      label: 'iter(tag)',
      blurb: 'Leave tag empty to pass None (every element), or type a tag name.',
      params: [
        { name: 'xml', type: 'str',        hint: 'an XML document', input: 'text' },
        { name: 'tag', type: 'str | None', hint: 'empty = None',    input: 'text-or-none' },
      ],
      template: 'import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n[e.tag for e in root.iter({$tag})]',
      cases: [
        { id: 'all',   label: 'every element', values: { xml: '<a><b><c/></b><c/></a>', tag: '' } },
        { id: 'one',   label: "iter('c')",     values: { xml: '<a><b><c/></b><c/></a>', tag: 'c' } },
        { id: 'star',  label: "iter('*')",     values: { xml: '<a><b><c/></b><c/></a>', tag: '*' } },
        { id: 'self',  label: 'includes self', values: { xml: '<a><a/></a>', tag: 'a' } },
        { id: 'ns',    label: 'prefixed tag',  values: { xml: '<x:a xmlns:x="urn:x"><x:b/></x:a>', tag: 'x:b' } },
        { id: 'nsuri', label: '{uri}tag',      values: { xml: '<x:a xmlns:x="urn:x"><x:b/></x:a>', tag: '{urn:x}b' } },
      ],
    },
    {
      id: 'itertext',
      label: 'itertext()',
      blurb: 'The text pieces in document order, and the usual "".join() of them.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n(list(root.itertext()), ''.join(root.itertext()))",
      cases: [
        { id: 'mixed', label: 'mixed content', values: { xml: '<p>Hello <b>big</b> world</p>' } },
        { id: 'deep',  label: 'nested',        values: { xml: '<doc><h>Title</h><p>One <i>two</i></p></doc>' } },
        { id: 'empty', label: 'no text',       values: { xml: '<a><b/></a>' } },
      ],
    },
    {
      id: 'child',
      label: 'a child\'s text',
      blurb: 'itertext() of one child: its text and everything inside — but not its own tail, which belongs to the parent.',
      params: [
        { name: 'xml', type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'tag', type: 'str', hint: 'child to inspect', input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\nchild = ET.fromstring({$xml}).find({$tag})\n(child.text, child.tail, list(child.itertext()))',
      cases: [
        { id: 'tail',    label: 'tail excluded', values: { xml: '<p>Hello <b>big <i>bold</i></b> world</p>', tag: 'b' } },
        { id: 'missing', label: 'no such child', values: { xml: '<p>Hello</p>', tag: 'b' } },
      ],
    },
  ],
  demoExplainer: 'iter() starts with the element itself, so iter(\'a\') on <a><a/></a> yields two elements. Tags are compared exactly: a prefix such as x:b never matches, because parsed tags are stored as {urn:x}b. itertext() skips empty strings and never yields the tail of the element it was called on; when find() returns None the attribute access fails with AttributeError.',

  patterns: [
    {
      name: 'Every element of one kind, anywhere',
      desc: 'iter(tag) needs no path syntax and is the fastest way.',
      code: "import xml.etree.ElementTree as ET\nfor link in root.iter('a'):\n    print(link.get('href'))",
    },
    {
      name: 'All text of an element',
      desc: 'text alone stops at the first child.',
      code: "import xml.etree.ElementTree as ET\nplain = ''.join(paragraph.itertext())",
    },
    {
      name: 'Remove while walking — safely',
      desc: 'Take a snapshot with list(), and remember that remove() needs the parent.',
      code: "import xml.etree.ElementTree as ET\nfor parent in list(root.iter()):\n    for child in list(parent):\n        if child.tag == 'script':\n            parent.remove(child)",
    },
    {
      name: 'Tag statistics',
      desc: 'Count every tag in a document.',
      code: "import collections\nimport xml.etree.ElementTree as ET\ncounts = collections.Counter(e.tag for e in root.iter())",
    },
  ],

  examples: [
    { title: 'Self first, then depth-first', code: "import xml.etree.ElementTree as ET\n[e.tag for e in ET.fromstring('<a><b><c/></b><c/></a>').iter()]", returns: "['a', 'b', 'c', 'c']" },
    { title: 'Only one tag, at any depth', code: "import xml.etree.ElementTree as ET\n[e.tag for e in ET.fromstring('<a><b><c/></b><c/></a>').iter('c')]", returns: "['c', 'c']" },
    { title: 'Count tags', code: "import collections\nimport xml.etree.ElementTree as ET\ncollections.Counter(e.tag for e in ET.fromstring('<a><b/><c/><b/></a>').iter())", returns: "Counter({'b': 2, 'a': 1, 'c': 1})" },
    { title: 'text vs itertext', code: "import xml.etree.ElementTree as ET\np = ET.fromstring('<p>Hello <b>big</b> world</p>')\n(p.text, ''.join(p.itertext()))", returns: "('Hello ', 'Hello big world')" },
    { title: 'Own tail not included', code: "import xml.etree.ElementTree as ET\nlist(ET.fromstring('<a><b>x</b>y</a>').find('b').itertext())", returns: "['x']" },
    { title: 'ElementTree.iter walks from the root', code: "import xml.etree.ElementTree as ET\n[e.tag for e in ET.ElementTree(ET.fromstring('<a><b/></a>')).iter()]", returns: "['a', 'b']" },
    { title: 'Inserted comments count as text', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))\nlist(ET.fromstring('<a>x<!--note-->y</a>', parser).itertext())", returns: "['x', 'note', 'y']" },
  ],

  pitfalls: [
    {
      name: 'Removing elements during iter()',
      desc: 'The iterator walks the live child list; removing shifts it and elements are skipped.',
      wrong: { label: 'live iterator', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/><b/><b/></a>')\nfor e in root.iter('b'):\n    root.remove(e)\nlen(root)", output: '1' },
      fix:   { label: 'list(...) first', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/><b/><b/></a>')\nfor e in list(root.iter('b')):\n    root.remove(e)\nlen(root)", output: '0' },
    },
    {
      name: 'Using .text for the whole content',
      desc: 'text holds only what comes before the first child element.',
      wrong: { label: '.text', code: "import xml.etree.ElementTree as ET\nET.fromstring('<p>Total: <b>42</b> items</p>').text", output: "'Total: '" },
      fix:   { label: "''.join(itertext())", code: "import xml.etree.ElementTree as ET\n''.join(ET.fromstring('<p>Total: <b>42</b> items</p>').itertext())", output: "'Total: 42 items'" },
    },
    {
      name: 'Passing a prefixed name',
      desc: 'iter() compares tags literally; parsed tags use {uri}local.',
      wrong: { label: "iter('x:b')", code: "import xml.etree.ElementTree as ET\nlist(ET.fromstring('<x:a xmlns:x=\"urn:x\"><x:b/></x:a>').iter('x:b'))", output: '[]' },
      fix:   { label: "iter('{urn:x}b')", code: "import xml.etree.ElementTree as ET\n[e.tag for e in ET.fromstring('<x:a xmlns:x=\"urn:x\"><x:b/></x:a>').iter('{urn:x}b')]", output: "['{urn:x}b']" },
    },
  ],

  when: {
    use: [
      'Visiting every element (or every element of one tag) at any depth',
      'Extracting plain text from mixed content with itertext()',
      'Transformations that touch the whole tree',
    ],
    avoid: [
      'Conditions on attributes, positions or child text → find/findall with a path',
      'Direct children only → iterate the element itself: for child in elem',
      'Very large files → iterparse() so the whole tree is never in memory',
    ],
  },

  notes: {
    cpython:      'Implemented in C (elementiter_next in Modules/_elementtree.c): an explicit stack of (parent, child index), so deep trees cannot overflow the Python stack',
    'itertext':   'The C version yields the text of comment and PI elements too when they are in the tree (insert_comments=True); the pure-Python version skips them',
    'Removed API': 'getiterator() was deprecated in 3.2 and removed in 3.9 — use iter()',
  },

  related: [
    { name: 'Element.find / findall', slug: 'element-find', when: 'Search with conditions' },
    { name: 'Element.text / tail',    slug: 'element-tag',  when: 'What itertext() collects' },
    { name: 'iterparse',              slug: 'iterparse',    when: 'Walk a file while it is being parsed' },
    { name: 'ElementTree',            slug: 'elementtree',  when: 'Its iter() starts at the root' },
    { name: 'iter()',                 slug: 'iter',         when: 'The iterator protocol behind it', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I iterate over all elements in an XML document in Python?',
      a: "for elem in root.iter(): ... visits the root and every descendant in document order. root.iter('tag') restricts it to one tag at any depth. Iterating root itself only gives the direct children.",
    },
    {
      q: 'How do I get all the text inside an element, including nested tags?',
      a: "''.join(elem.itertext()). elem.text only holds the text before the first child; each child's following text is in that child's .tail.",
    },
    {
      q: 'What replaced getiterator()?',
      a: 'iter(). getiterator() was deprecated in Python 3.2 and removed in 3.9; list(elem.iter()) gives the same list it returned.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.iter',
    meta:  'Element.iter / itertext',
  },
};
