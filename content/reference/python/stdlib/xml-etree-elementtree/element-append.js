// content/reference/python/stdlib/xml-etree-elementtree/element-append.js — Element.append, extend, insert, remove, clear, makeelement

export const meta = {
  slug:        'element-append',
  name:        'Element.append',
  signature:   'Element.append(subelement) / extend(elements) / insert(index, subelement) / remove(subelement) / clear() / makeelement(tag, attrib)',
  blurb:       'Change an element\'s children: append, extend and insert add Elements, remove takes one out (by identity), clear empties the element, makeelement creates an unattached element.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+ (extend 2.7+ / 3.2+)',
  searchTerms: 'Element.append Element.extend Element.insert Element.remove Element.clear Element.makeelement elementtree add child element python xml remove element delete node insert child move element clear element list.remove(x): x not in list',
};

export const method = {
  slug:      'element-append',
  name:      'Element.append',
  signature: 'Element.append(subelement) / extend(elements) / insert(index, subelement) / remove(subelement) / clear() / makeelement(tag, attrib)',
  returns:   { type: 'None (makeelement: Element)', desc: 'They change the element in place; makeelement returns the new, unattached element.' },

  category:    'xml.etree.ElementTree method',
  version:     'Python 2.5+ (extend 2.7+ / 3.2+)',
  hasLiveDemo: true,

  subtitle: 'An Element is also a list of its children, and these are its list operations: append/extend/insert take Element objects only, remove() finds the child by identity (not by tag or content), and clear() resets everything but the tag — children, attributes, text and tail.',

  covers: ['Element.append', 'Element.extend', 'Element.insert', 'Element.remove', 'Element.clear', 'Element.makeelement'],

  cheat: {
    commonCall: 'parent.append(ET.Element("item"))',
    returns:    'None — the parent is modified in place',
    replaces:   'string concatenation of XML fragments',
    watchOut:   'remove() works on direct children only, and takes the child\'s tail text with it',
  },

  parameters: [
    { name: 'subelement', type: 'Element',          required: true, default: null, desc: 'append / insert / remove: the child. Anything but an Element raises TypeError for append and insert.' },
    { name: 'elements',   type: 'iterable of Element', required: true, default: null, desc: 'extend: the children to add, in order.' },
    { name: 'index',      type: 'int',              required: true, default: null, desc: 'insert: position like list.insert — negative counts from the end, out of range is clamped.' },
    { name: 'tag, attrib', type: 'str, dict',       required: true, default: null, desc: 'makeelement: the new element\'s tag and attributes (the dict is copied). The element is not added anywhere.' },
  ],

  modes: [
    {
      id: 'build',
      label: 'append + insert',
      blurb: 'Append an element with your tag, then insert <new/> at your index.',
      params: [
        { name: 'xml',   type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'tag',   type: 'str', hint: 'tag to append',   input: 'text' },
        { name: 'index', type: 'int', hint: 'insert position', input: 'number' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nroot.append(ET.Element({$tag}))\nroot.insert({$index}, ET.Element('new'))\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'front', label: 'index 0',  values: { xml: '<list><item>a</item><item>b</item></list>', tag: 'last', index: '0' } },
        { id: 'mid',   label: 'index 1',  values: { xml: '<list><item>a</item><item>b</item></list>', tag: 'last', index: '1' } },
        { id: 'neg',   label: 'index -1', values: { xml: '<list><item>a</item><item>b</item></list>', tag: 'last', index: '-1' } },
        { id: 'big',   label: 'index 99', values: { xml: '<list><item>a</item><item>b</item></list>', tag: 'last', index: '99' } },
      ],
    },
    {
      id: 'remove',
      label: 'remove()',
      blurb: 'Remove every element your path finds from root — fine for children, ValueError for anything deeper.',
      params: [
        { name: 'xml',  type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'path', type: 'str', hint: 'ElementPath',     input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nfor child in root.findall({$path}):\n    root.remove(child)\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'kids',  label: 'children',       values: { xml: '<a><b/><c><b/></c><b/></a>', path: 'b' } },
        { id: 'deep',  label: './/b (nested)',  values: { xml: '<a><b/><c><b/></c><b/></a>', path: './/b' } },
        { id: 'tail',  label: 'tail goes too',  values: { xml: '<p>Keep <i>this</i> and this</p>', path: 'i' } },
      ],
    },
    {
      id: 'clear',
      label: 'clear()',
      blurb: 'clear() keeps only the tag: children, attributes, text and tail are gone.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nroot.clear()\n(root.tag, root.attrib, root.text, len(root), ET.tostring(root, encoding='unicode'))",
      cases: [
        { id: 'full', label: 'everything', values: { xml: '<a x="1">text<b/>tail</a>' } },
        { id: 'ns',   label: 'namespaced', values: { xml: '<p:a xmlns:p="urn:p" p:k="v"><p:b/></p:a>' } },
      ],
    },
  ],
  demoExplainer: 'insert() follows list.insert: -1 inserts before the last child and an index past the end appends. remove() searches the element\'s own children by identity, so the nested <b> found by .//b raises ValueError: list.remove(x): x not in list. A removed element takes its tail with it — " and this" lives in <i>.tail, so it disappears too.',

  patterns: [
    {
      name: 'Remove matching children safely',
      desc: 'findall() returns a list, so removing while looping over it is safe.',
      code: "import xml.etree.ElementTree as ET\nfor item in parent.findall('item'):\n    if item.get('status') == 'deleted':\n        parent.remove(item)",
    },
    {
      name: 'Remove anywhere in the tree',
      desc: 'remove() needs the parent — walk parents and test their children.',
      code: "import xml.etree.ElementTree as ET\nfor parent in root.iter():\n    for child in list(parent):\n        if child.tag == 'comment':\n            parent.remove(child)",
    },
    {
      name: 'Keep the tail text when removing',
      desc: 'Move the tail to the previous sibling (or the parent\'s text) first.',
      code: "import xml.etree.ElementTree as ET\ndef remove_keep_tail(parent, child):\n    i = list(parent).index(child)\n    if child.tail:\n        if i:\n            parent[i - 1].tail = (parent[i - 1].tail or '') + child.tail\n        else:\n            parent.text = (parent.text or '') + child.tail\n    parent.remove(child)",
    },
    {
      name: 'Move an element',
      desc: 'Elements do not know their parent: remove from the old one, append to the new one.',
      code: "import xml.etree.ElementTree as ET\nold_parent.remove(elem)\nnew_parent.append(elem)",
    },
  ],

  examples: [
    { title: 'append and insert', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('list')\nroot.append(ET.Element('b'))\nroot.insert(0, ET.Element('a'))\n[e.tag for e in root]", returns: "['a', 'b']" },
    { title: 'extend with several', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nroot.extend([ET.Element('b'), ET.Element('c')])\nET.tostring(root, encoding='unicode')", returns: "'<a><b /><c /></a>'" },
    { title: 'remove by identity', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/><c/></a>')\nroot.remove(root.find('b'))\n[e.tag for e in root]", returns: "['c']" },
    { title: 'clear keeps only the tag', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a x=\"1\">text<b/></a>')\nroot.clear()\nET.tostring(root, encoding='unicode')", returns: "'<a />'" },
    { title: 'makeelement does not attach', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('a')\nnew = root.makeelement('b', {'x': '1'})\n(len(root), new.tag, new.attrib)", returns: "(0, 'b', {'x': '1'})" },
    { title: 'Index, delete and slice like a list', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/><c/><d/></a>')\ndel root[0]\nroot[:] = [e for e in root if e.tag != 'c']\n[e.tag for e in root]", returns: "['d']" },
    { title: 'Only Elements can be added', code: "import xml.etree.ElementTree as ET\nET.Element('a').append('text')", returns: 'TypeError: append() argument 1 must be xml.etree.ElementTree.Element, not str' },
  ],

  pitfalls: [
    {
      name: 'Removing an equal-looking element',
      desc: 'remove() compares identity. A new Element with the same tag is a different object.',
      wrong: { label: "remove(ET.Element('b'))", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nroot.remove(ET.Element('b'))", output: 'ValueError: list.remove(x): x not in list' },
      fix:   { label: "remove(root.find('b'))", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nroot.remove(root.find('b'))\nlen(root)", output: '0' },
    },
    {
      name: 'Losing the tail text',
      desc: 'Text after an element belongs to that element (its tail) and is removed with it.',
      wrong: { label: 'remove(i)', code: "import xml.etree.ElementTree as ET\np = ET.fromstring('<p>Keep <i>this</i> and this</p>')\np.remove(p.find('i'))\nET.tostring(p, encoding='unicode')", output: "'<p>Keep </p>'" },
      fix:   { label: 'move the tail first', code: "import xml.etree.ElementTree as ET\np = ET.fromstring('<p>Keep <i>this</i> and this</p>')\ni = p.find('i')\np.text = (p.text or '') + (i.tail or '')\np.remove(i)\nET.tostring(p, encoding='unicode')", output: "'<p>Keep  and this</p>'" },
    },
    {
      name: 'Appending to a second parent',
      desc: 'Elements do not track their parent, so append() does not move one — it is now a child of both.',
      wrong: { label: 'append only', code: "import xml.etree.ElementTree as ET\na = ET.Element('a')\nb = ET.SubElement(a, 'b')\nc = ET.Element('c')\nc.append(b)\n(ET.tostring(a), ET.tostring(c))", output: "(b'<a><b /></a>', b'<c><b /></c>')" },
      fix:   { label: 'remove, then append', code: "import xml.etree.ElementTree as ET\na = ET.Element('a')\nb = ET.SubElement(a, 'b')\nc = ET.Element('c')\na.remove(b)\nc.append(b)\n(ET.tostring(a), ET.tostring(c))", output: "(b'<a />', b'<c><b /></c>')" },
    },
  ],

  when: {
    use: [
      'Building or editing trees in code: add, reorder and drop children',
      'Filtering children: parent[:] = [c for c in parent if keep(c)]',
      'clear() on elements you are done with while streaming with iterparse()',
    ],
    avoid: [
      'Creating and attaching in one step → SubElement(parent, tag)',
      'Adding text → set .text or the previous child\'s .tail; strings are not children',
      'makeelement() in your own code — the docs say to use SubElement() instead',
    ],
  },

  notes: {
    cpython:      'Modules/_elementtree.c: append/insert/extend check the type (TypeError otherwise); remove() scans the children comparing identity and raises ValueError("list.remove(x): x not in list")',
    'Sequence API': 'len(elem), elem[i], elem[i] = new, del elem[i] and slices work like a list of children',
    'clear()':    'Sets text and tail to None, drops all children and replaces the attribute dict with a new empty one',
  },

  related: [
    { name: 'SubElement',  slug: 'subelement',  when: 'Create and append in one call' },
    { name: 'Element',     slug: 'element',     when: 'The class and its list behaviour' },
    { name: 'Element.text / tail', slug: 'element-tag', when: 'Where the text between children lives' },
    { name: 'Element.iter', slug: 'element-iter', when: 'Find parents to remove from' },
    { name: 'list.remove', slug: 'list-remove', when: 'Same error message, same idea', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I remove an element from an XML tree in Python?',
      a: "Call remove() on its parent: parent.remove(child). ElementTree elements do not know their parent, so find it first — e.g. loop over root.iter() and check each element's children, or select the parent with a path such as './/item/..'.",
    },
    {
      q: 'Why does remove() raise "ValueError: list.remove(x): x not in list"?',
      a: 'The element you passed is not a direct child of the element you called remove() on: it is a grandchild, it belongs to another parent, or it is a new Element that merely looks the same (remove compares identity).',
    },
    {
      q: 'How do I add text to an element?',
      a: 'Text is not a child: set elem.text for text before the first child, or child.tail for text after a child. append() only accepts Elements.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.append',
    meta:  'Element.append / extend / insert / remove / clear / makeelement',
  },
};
