// content/reference/python/stdlib/xml-etree-elementtree/subelement.js

export const meta = {
  slug:        'subelement',
  name:        'xml.etree.ElementTree.SubElement',
  signature:   'xml.etree.ElementTree.SubElement(parent, tag, attrib={}, **extra)',
  blurb:       'Create a new element and append it to parent in one call — the usual way to build XML in code.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.SubElement ET.SubElement subelement create child element python build xml add child element nested elements generate xml attributes',
};

export const method = {
  slug:      'subelement',
  name:      'xml.etree.ElementTree.SubElement',
  signature: 'xml.etree.ElementTree.SubElement(parent, tag, attrib={}, **extra)',
  returns:   { type: 'Element', desc: 'The new child, already appended to parent — keep it to set its text or add its own children.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'SubElement(parent, tag) is Element(tag) plus parent.append() — and it returns the new child, so you can set .text on it or nest further SubElements under it.',

  covers: ['SubElement'],

  cheat: {
    commonCall: "ET.SubElement(root, 'item', id='1').text = 'Desk'",
    returns:    'the new child Element (already in parent)',
    replaces:   'child = ET.Element(tag); parent.append(child)',
    watchOut:   'text= as a keyword creates an attribute named text — set .text afterwards',
  },

  parameters: [
    { name: 'parent',  type: 'Element', required: true,  default: null, desc: 'The element that receives the new child (at the end of its children).' },
    { name: 'tag',     type: 'str',     required: true,  default: null, desc: 'The child\'s tag; {uri}local for a namespaced element.' },
    { name: 'attrib',  type: 'dict',    required: false, default: '{}', desc: 'Attributes as a dict — needed for names like class or data-id that are not valid keyword arguments.' },
    { name: '**extra', type: 'str',     required: false, default: null, desc: 'More attributes as keyword arguments, merged after attrib.' },
  ],

  modes: [
    {
      id: 'list',
      label: 'build a list',
      blurb: 'One <li> per comma-separated item, each with its text.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: "import xml.etree.ElementTree as ET\nroot = ET.Element('ul')\nfor text in {$items}:\n    ET.SubElement(root, 'li').text = text\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'three',  label: 'three items',  values: { items: 'apples, pears, plums' } },
        { id: 'escape', label: 'special chars', values: { items: 'R&D, <none>, "quotes"' } },
        { id: 'none',   label: 'empty list',   values: { items: '' } },
      ],
    },
    {
      id: 'attrs',
      label: 'attributes',
      blurb: 'A dict and a keyword attribute; the call returns the child itself.',
      params: [
        { name: 'tag', type: 'str', hint: 'child tag', input: 'text' },
        { name: 'id',  type: 'str', hint: 'id value',  input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.Element('doc')\nchild = ET.SubElement(root, {$tag}, {'id': {$id}}, lang='en')\n(child.attrib, ET.tostring(root, encoding='unicode'))",
      cases: [
        { id: 'plain', label: 'plain',    values: { tag: 'section', id: 'intro' } },
        { id: 'ns',    label: '{uri}tag', values: { tag: '{http://www.w3.org/1999/xhtml}p', id: 'p1' } },
      ],
    },
  ],
  demoExplainer: 'The csv input becomes a Python list of str; an empty list leaves <ul /> self-closed. Text is escaped on output (& and < become the amp and lt entity references; double quotes stay as they are in text). The XHTML namespace is one ElementTree knows, so it is written with the prefix html: rather than a generated ns0.',

  patterns: [
    {
      name: 'Build a document from data',
      desc: 'SubElement returns the child, so text and nesting chain naturally.',
      code: "import xml.etree.ElementTree as ET\nroot = ET.Element('users')\nfor user in users:\n    u = ET.SubElement(root, 'user', id=str(user['id']))\n    ET.SubElement(u, 'name').text = user['name']",
    },
    {
      name: 'Attribute names that are keywords',
      desc: 'class, for and names with - must go in the dict.',
      code: "import xml.etree.ElementTree as ET\nET.SubElement(form, 'label', {'for': 'email', 'class': 'req'})",
    },
    {
      name: 'Nest in one expression',
      desc: 'Each call returns the new element.',
      code: "import xml.etree.ElementTree as ET\nET.SubElement(ET.SubElement(root, 'meta'), 'title').text = 'Report'",
    },
  ],

  examples: [
    { title: 'The example from the docs', code: "import xml.etree.ElementTree as ET\na = ET.Element('a')\nb = ET.SubElement(a, 'b')\nc = ET.SubElement(a, 'c')\nd = ET.SubElement(c, 'd')\nET.tostring(a, encoding='unicode')", returns: "'<a><b /><c><d /></c></a>'" },
    { title: 'Set text on the returned child', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nET.SubElement(root, 'b').text = 'hi'\nET.tostring(root, encoding='unicode')", returns: "'<a><b>hi</b></a>'" },
    { title: 'attrib dict and keywords', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nchild = ET.SubElement(root, 'b', {'id': '1'}, lang='en')\n(child.attrib, root[0] is child)", returns: "({'id': '1', 'lang': 'en'}, True)" },
    { title: 'Keyword-unfriendly names', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nET.SubElement(root, 'b', {'class': 'x'})\nET.tostring(root, encoding='unicode')", returns: "'<a><b class=\"x\" /></a>'" },
    { title: 'parent must be an Element', code: "import xml.etree.ElementTree as ET\nET.SubElement('a', 'b')", returns: 'TypeError: SubElement() argument 1 must be xml.etree.ElementTree.Element, not str' },
  ],

  pitfalls: [
    {
      name: 'Passing the text as a keyword',
      desc: 'Every keyword argument becomes an attribute — text= included.',
      wrong: { label: "text='hi'", code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nET.SubElement(root, 'b', text='hi')\nET.tostring(root, encoding='unicode')", output: "'<a><b text=\"hi\" /></a>'" },
      fix:   { label: ".text = 'hi'", code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nET.SubElement(root, 'b').text = 'hi'\nET.tostring(root, encoding='unicode')", output: "'<a><b>hi</b></a>'" },
    },
    {
      name: 'Creating with Element() and forgetting append()',
      desc: 'ET.Element() makes a detached element; it is not part of any tree until appended.',
      wrong: { label: "ET.Element('b')", code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nchild = ET.Element('b')\nET.tostring(root, encoding='unicode')", output: "'<a />'" },
      fix:   { label: "ET.SubElement(root, 'b')", code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nchild = ET.SubElement(root, 'b')\nET.tostring(root, encoding='unicode')", output: "'<a><b /></a>'" },
    },
  ],

  when: {
    use: [
      'Building XML from data, child by child',
      'Adding a child to a parsed tree',
    ],
    avoid: [
      'Inserting at a position other than the end → Element() + parent.insert(i, child)',
      'Moving an existing element → parent.remove(child) + other.append(child)',
    ],
  },

  notes: {
    cpython:    'Implemented in C (subelement in Modules/_elementtree.c); the pure-Python version is attrib = {**attrib, **extra}; element = parent.makeelement(tag, attrib); parent.append(element)',
    'Order':    'Children appear in the order they were created; attributes in the order of attrib, then the keywords',
  },

  related: [
    { name: 'Element',        slug: 'element',        when: 'Create a root or a detached element' },
    { name: 'Element.append', slug: 'element-append', when: 'insert, extend, remove' },
    { name: 'tostring',       slug: 'tostring',       when: 'Serialize what you built' },
    { name: 'indent',         slug: 'indent',         when: 'Pretty-print it' },
  ],

  faq: [
    {
      q: 'What is the difference between Element and SubElement?',
      a: 'Element(tag) creates a standalone element. SubElement(parent, tag) creates one and appends it to parent, returning the new child — so it is the usual tool for building nested XML.',
    },
    {
      q: 'How do I set the text of a SubElement?',
      a: "Assign to the returned element: ET.SubElement(parent, 'name').text = 'Ada'. A text= keyword argument would create an attribute called text.",
    },
    {
      q: 'How do I add an attribute called class with SubElement?',
      a: "class is a Python keyword, so pass it in the dict: ET.SubElement(parent, 'div', {'class': 'box'}). The same goes for names containing - or :.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.SubElement',
    meta:  'xml.etree.ElementTree.SubElement',
  },
};
