// content/reference/python/stdlib/xml-etree-elementtree/iselement.js — iselement

export const meta = {
  slug:        'iselement',
  name:        'xml.etree.ElementTree.iselement',
  signature:   'xml.etree.ElementTree.iselement(element)',
  blurb:       'Return True if an object looks like an element — in Python 3.13 that simply means it has a tag attribute. An ElementTree is not an element.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.iselement ET.iselement iselement check if object is xml element python isinstance Element ElementTree duck typing tag attribute',
};

export const method = {
  slug:      'iselement',
  name:      'xml.etree.ElementTree.iselement',
  signature: 'xml.etree.ElementTree.iselement(element)',
  returns:   { type: 'bool', desc: 'hasattr(element, "tag").' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+',
  hasLiveDemo: false,

  subtitle: 'iselement() is a duck-typing check: any object with a tag attribute counts, including comment and PI nodes and elements of other ElementTree-like libraries. It answers "can I treat this as an element?", not "is this exactly ET.Element?".',

  covers: ['iselement'],

  cheat: {
    commonCall: 'ET.iselement(obj)',
    returns:    'True when obj has a tag attribute',
    replaces:   'isinstance(obj, ET.Element) when other element types should pass too',
    watchOut:   'An ElementTree has no tag — iselement(tree) is False',
  },

  parameters: [
    { name: 'element', type: 'object', required: true, default: null, desc: 'Any object.' },
  ],

  patterns: [
    {
      name: 'Accept an Element or an ElementTree',
      desc: 'Normalise the argument of your own helper.',
      code: "import xml.etree.ElementTree as ET\n\ndef root_of(obj):\n    if isinstance(obj, ET.ElementTree):\n        return obj.getroot()\n    if ET.iselement(obj):\n        return obj\n    raise TypeError(f'expected an element, got {type(obj).__name__}')",
    },
    {
      name: 'Check a find() result',
      desc: 'find() returns an Element or None; "is not None" says the same thing more directly.',
      code: "import xml.etree.ElementTree as ET\nnode = root.find('config')\nif node is not None:\n    print(node.attrib)",
    },
  ],

  examples: [
    { title: 'Elements and a missing find() result', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\n(ET.iselement(root), ET.iselement(root.find('b')), ET.iselement(root.find('c')))", returns: '(True, True, False)' },
    { title: 'An ElementTree is not an element', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.Element('a'))\n(ET.iselement(tree), ET.iselement(tree.getroot()))", returns: '(False, True)' },
    { title: 'Text, comments and QNames', code: "import xml.etree.ElementTree as ET\n(ET.iselement('<a/>'), ET.iselement(ET.Comment('x')), ET.iselement(ET.QName('a')))", returns: '(False, True, False)' },
    { title: 'Anything with a tag attribute passes', code: "import xml.etree.ElementTree as ET\nclass Node:\n    tag = 'x'\nET.iselement(Node())", returns: 'True' },
    { title: 'Telling elements and trees apart', code: "import xml.etree.ElementTree as ET\ndef describe(x):\n    if ET.iselement(x):\n        return 'element ' + str(x.tag)\n    if isinstance(x, ET.ElementTree):\n        return 'tree of ' + x.getroot().tag\n    return type(x).__name__\n[describe(x) for x in (ET.Element('a'), ET.ElementTree(ET.Element('b')), '<c/>')]", returns: "['element a', 'tree of b', 'str']" },
  ],

  pitfalls: [
    {
      name: 'Using iselement() on an ElementTree',
      desc: 'parse() returns an ElementTree, which has no tag. Ask for its root.',
      wrong: { label: 'iselement(tree)', code: "import xml.etree.ElementTree as ET\nwith open('a.xml', 'w', encoding='utf-8') as f:\n    f.write('<a/>')\nET.iselement(ET.parse('a.xml'))", output: 'False' },
      fix:   { label: 'iselement(tree.getroot())', code: "import xml.etree.ElementTree as ET\nwith open('a.xml', 'w', encoding='utf-8') as f:\n    f.write('<a/>')\nET.iselement(ET.parse('a.xml').getroot())", output: 'True' },
    },
    {
      name: 'Expecting it to reject look-alikes',
      desc: 'Duck typing: an unrelated object with a tag attribute passes. Use isinstance when only real ET elements are acceptable.',
      wrong: { label: 'iselement(obj)', code: "import xml.etree.ElementTree as ET\nclass Html:\n    tag = 'div'\nET.iselement(Html())", output: 'True' },
      fix:   { label: 'isinstance(obj, ET.Element)', code: "import xml.etree.ElementTree as ET\nclass Html:\n    tag = 'div'\nisinstance(Html(), ET.Element)", output: 'False' },
    },
  ],

  when: {
    use: [
      'Helpers that accept elements from ElementTree or compatible libraries',
      'Validating arguments before you call element methods on them',
    ],
    avoid: [
      'Checking a find() result → "is not None" is clearer',
      'Requiring the exact ET.Element type → isinstance(obj, ET.Element)',
    ],
  },

  notes: {
    cpython:     'def iselement(element): return hasattr(element, "tag") — in Lib/xml/etree/ElementTree.py, unchanged by the C accelerator',
    'Docs':      'The documentation describes it as checking whether an object "appears to be a valid element object"',
  },

  related: [
    { name: 'Element',     slug: 'element',     when: 'The real element class' },
    { name: 'ElementTree', slug: 'elementtree', when: 'Wraps an element; getroot() returns it' },
    { name: 'Element.find', slug: 'element-find', when: 'Returns an Element or None' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Strict type checks', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I check if an object is an XML element in Python?',
      a: 'ET.iselement(obj) returns True for any object with a tag attribute (elements, comments, PIs, elements of compatible libraries). For the exact class use isinstance(obj, ET.Element).',
    },
    {
      q: 'Why is iselement(tree) False after ET.parse()?',
      a: 'parse() returns an ElementTree — a document wrapper without a tag. Call tree.getroot() to get the root Element.',
    },
    {
      q: 'Is iselement() the same as isinstance(x, ET.Element)?',
      a: 'No. iselement() only checks for a tag attribute, so objects of other classes can pass. isinstance(x, ET.Element) accepts only ET.Element and its subclasses.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.iselement',
    meta:  'xml.etree.ElementTree.iselement',
  },
};
