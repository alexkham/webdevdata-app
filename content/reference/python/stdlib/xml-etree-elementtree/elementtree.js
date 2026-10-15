// content/reference/python/stdlib/xml-etree-elementtree/elementtree.js — ElementTree, ElementTree.getroot

export const meta = {
  slug:        'elementtree',
  name:        'xml.etree.ElementTree.ElementTree',
  signature:   'xml.etree.ElementTree.ElementTree(element=None, file=None)',
  blurb:       'A whole XML document: a wrapper around the root Element that reads from and writes to files. getroot() returns the root element.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.ElementTree ET.ElementTree elementtree class getroot root element document wrapper tree.getroot() parse file write file element vs elementtree _setroot',
};

export const method = {
  slug:      'elementtree',
  name:      'xml.etree.ElementTree.ElementTree',
  signature: 'xml.etree.ElementTree.ElementTree(element=None, file=None)',
  returns:   { type: 'ElementTree', desc: 'A tree whose root is element, or the parsed content of file.' },

  category:    'xml.etree.ElementTree class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The module has two classes: Element for one node, ElementTree for the document. You mostly meet ElementTree as the result of ET.parse(); call getroot() to get the root Element, and use write() to save. Its find methods and iter() simply start at the root.',

  covers: ['ElementTree', 'ElementTree.getroot'],

  cheat: {
    commonCall: "root = ET.parse('data.xml').getroot()",
    returns:    'an ElementTree; getroot() → the root Element (None for an empty tree)',
    replaces:   'keeping a file name next to a root element',
    watchOut:   'tostring() and Element methods need the root, not the tree',
  },

  parameters: [
    { name: 'element', type: 'Element | None',    required: false, default: 'None', desc: 'The root element of the new tree.' },
    { name: 'file',    type: 'str | file object', required: false, default: 'None', desc: 'If given, the tree is initialized by parsing this file (same as calling parse() on it).' },
  ],

  modes: [
    {
      id: 'wrap',
      label: 'wrap a root',
      blurb: 'Wrap a parsed root in an ElementTree: getroot() gives it back, findtext() and iter() start from it.',
      params: [
        { name: 'xml',  type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'path', type: 'str', hint: 'ElementPath',     input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.fromstring({$xml}))\n(tree.getroot().tag, tree.findtext({$path}), [e.tag for e in tree.iter()])',
      cases: [
        { id: 'basic', label: 'findtext',     values: { xml: '<config><name>demo</name><port>8080</port></config>', path: 'port' } },
        { id: 'miss',  label: 'missing path', values: { xml: '<config><name>demo</name></config>', path: 'port' } },
        { id: 'slash', label: 'leading /',    values: { xml: '<config><name>demo</name></config>', path: '/config/name' } },
      ],
    },
    {
      id: 'file',
      label: 'file=',
      blurb: 'Build the tree from a file object — an io.StringIO stands in for an open file here.',
      params: [{ name: 'xml', type: 'str', hint: 'file content', input: 'text' }],
      template: 'import io\nimport xml.etree.ElementTree as ET\ntree = ET.ElementTree(file=io.StringIO({$xml}))\n(tree.getroot().tag, len(tree.getroot()))',
      cases: [
        { id: 'ok',     label: 'valid',     values: { xml: '<?xml version="1.0"?><users><user/><user/></users>' } },
        { id: 'broken', label: 'malformed', values: { xml: '<users><user></users>' } },
      ],
    },
  ],
  demoExplainer: 'tree.findtext(\'/config/name\') does not raise like Element.findtext would: ElementTree turns a leading / into ./ (with a FutureWarning on stderr), so the path is ./config/name — a config child of the root, which does not exist, hence None. With file=, parsing errors surface as ParseError from the constructor itself.',

  patterns: [
    {
      name: 'Read, modify, write back',
      desc: 'parse() gives the tree; edit through the root; write() saves.',
      code: "import xml.etree.ElementTree as ET\ntree = ET.parse('settings.xml')\nroot = tree.getroot()\nroot.find('debug').text = 'false'\ntree.write('settings.xml', encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'Wrap a built root for saving',
      desc: 'write() lives on ElementTree.',
      code: "import xml.etree.ElementTree as ET\nroot = ET.Element('data')\nET.SubElement(root, 'item').text = '1'\nET.ElementTree(root).write('data.xml', encoding='utf-8')",
    },
    {
      name: 'Replace the whole document',
      desc: '_setroot() swaps the root element of an existing tree.',
      code: "import xml.etree.ElementTree as ET\ntree._setroot(ET.Element('empty'))",
    },
  ],

  examples: [
    { title: 'getroot() returns the wrapped element', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nET.ElementTree(root).getroot() is root", returns: 'True' },
    { title: 'An empty tree has no root', code: 'import xml.etree.ElementTree as ET\nprint(ET.ElementTree().getroot())', returns: 'None' },
    { title: 'parse() returns an ElementTree', code: "import io\nimport xml.etree.ElementTree as ET\ntype(ET.parse(io.StringIO('<a/>'))).__name__", returns: "'ElementTree'" },
    { title: 'file= parses immediately', code: "import io\nimport xml.etree.ElementTree as ET\ntree = ET.ElementTree(file=io.StringIO('<a><b>x</b></a>'))\n(tree.getroot().tag, tree.findtext('b'))", returns: "('a', 'x')" },
    { title: 'iter() covers the whole document', code: "import io\nimport xml.etree.ElementTree as ET\n[e.tag for e in ET.parse(io.StringIO('<a><b/></a>')).iter()]", returns: "['a', 'b']" },
    { title: '_setroot() replaces the root', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.Element('a'))\ntree._setroot(ET.Element('b'))\ntree.getroot().tag", returns: "'b'" },
  ],

  pitfalls: [
    {
      name: 'Calling Element methods on the tree',
      desc: 'ElementTree only has the find family, iter, getroot, parse and write. Attributes, text and children belong to the root.',
      wrong: { label: "tree.get('version')", code: "import io\nimport xml.etree.ElementTree as ET\ntree = ET.parse(io.StringIO('<doc version=\"2\"/>'))\ntree.get('version')", output: "AttributeError: 'ElementTree' object has no attribute 'get'" },
      fix:   { label: "tree.getroot().get('version')", code: "import io\nimport xml.etree.ElementTree as ET\ntree = ET.parse(io.StringIO('<doc version=\"2\"/>'))\ntree.getroot().get('version')", output: "'2'" },
    },
    {
      name: 'Searching an empty tree',
      desc: 'ElementTree() without arguments has no root; its find methods fail.',
      wrong: { label: 'ElementTree().find', code: "import xml.etree.ElementTree as ET\nET.ElementTree().find('a')", output: "AttributeError: 'NoneType' object has no attribute 'find'" },
      fix:   { label: 'give it a root', code: "import xml.etree.ElementTree as ET\nprint(ET.ElementTree(ET.Element('r')).find('a'))", output: 'None' },
    },
  ],

  when: {
    use: [
      'Reading a file: ET.parse() returns one',
      'Writing a file: ElementTree(root).write(path, ...)',
      'Keeping "the document" around while you work on its root',
    ],
    avoid: [
      'Data already in a string → ET.fromstring() returns the root Element directly',
      'Serializing to a str → ET.tostring(tree.getroot(), encoding="unicode")',
    ],
  },

  notes: {
    cpython:     'A small pure-Python class in Lib/xml/etree/ElementTree.py holding _root; find/findall/findtext/iterfind/iter delegate to the root, adding "." to a path that starts with "/" (with a FutureWarning)',
    'Methods':   'getroot, _setroot, parse, iter, find, findall, findtext, iterfind, write, write_c14n',
    'Removed':   'getiterator() was removed in Python 3.9 — use iter()',
  },

  related: [
    { name: 'parse',             slug: 'parse',             when: 'Create one from a file' },
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'Save it' },
    { name: 'Element',           slug: 'element',           when: 'What getroot() returns' },
    { name: 'Element.find',      slug: 'element-find',      when: 'The search methods it delegates' },
    { name: 'fromstring',        slug: 'fromstring',        when: 'Root element straight from a string' },
  ],

  faq: [
    {
      q: 'What is the difference between Element and ElementTree?',
      a: 'An Element is one node (tag, attributes, text, children). An ElementTree wraps a root Element and represents the whole document, mainly for parsing from and writing to files. ET.parse() returns an ElementTree; ET.fromstring() returns an Element.',
    },
    {
      q: 'How do I get the root element from ET.parse()?',
      a: "Call getroot() on the result: root = ET.parse('file.xml').getroot().",
    },
    {
      q: "Why do I get \"'ElementTree' object has no attribute ...\"?",
      a: 'You are calling an Element method (get, text, append, tostring arguments…) on the tree. Use tree.getroot() first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.ElementTree',
    meta:  'xml.etree.ElementTree.ElementTree',
  },
};
