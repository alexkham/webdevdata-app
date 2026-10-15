// content/reference/python/stdlib/xml-etree-elementtree/element-find.js — find, findall, findtext, iterfind (Element and ElementTree) and the ElementPath syntax

export const meta = {
  slug:        'element-find',
  name:        'Element.find',
  signature:   'Element.find(match, namespaces=None) / findall(match, namespaces=None) / findtext(match, default=None, namespaces=None) / iterfind(match, namespaces=None)',
  blurb:       'Search an element with a tag name or a small XPath subset (ElementPath): find returns the first match or None, findall a list, findtext the text, iterfind a lazy iterator.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+ (iterfind 3.2+, wildcards {*} 3.8+, != predicates 3.10+)',
  searchTerms: 'Element.find Element.findall Element.findtext Element.iterfind ElementTree.find ElementTree.findall ElementTree.findtext ElementTree.iterfind elementtree xpath python findall attribute value predicate .// descendant last() position namespaces dict wildcard {*} elementpath find by attribute find element by tag',
};

export const method = {
  slug:      'element-find',
  name:      'Element.find',
  signature: 'Element.find(match, namespaces=None) / findall(match, namespaces=None) / findtext(match, default=None, namespaces=None) / iterfind(match, namespaces=None)',
  returns:   { type: 'Element | None, list, str | None, iterator', desc: 'find: the first matching element or None; findall: all matches in document order; findtext: the first match\'s text ("" if it has none) or default; iterfind: the matches lazily.' },

  category:    'xml.etree.ElementTree method',
  version:     'Python 2.5+ (iterfind 3.2+, wildcards {*} 3.8+, != predicates 3.10+)',
  hasLiveDemo: true,

  subtitle: 'Four methods, one path language. match is a tag name or an ElementPath expression — tag, *, ., //, .., [@attr], [@attr=\'v\'], [tag], [tag=\'text\'], [n], [last()] — evaluated relative to the element. ElementTree has the same four methods, starting at its root.',

  covers: [
    'Element.find', 'Element.findall', 'Element.findtext', 'Element.iterfind',
    'ElementTree.find', 'ElementTree.findall', 'ElementTree.findtext', 'ElementTree.iterfind',
  ],

  cheat: {
    commonCall: "root.findall(\".//item[@type='book']\")",
    returns:    'a list of Elements in document order ([] when nothing matches)',
    replaces:   'nested for loops over children comparing tags',
    watchOut:   "findall('tag') only looks at direct children — use './/tag' for the whole subtree",
  },

  parameters: [
    { name: 'match',      type: 'str',            required: true,  default: null,   desc: 'A tag ({uri}local for namespaced tags) or an ElementPath expression, relative to this element. A leading / is an error on an Element.' },
    { name: 'namespaces', type: 'dict',           required: false, default: 'None', desc: 'Maps your prefixes to namespace URIs so you can write prefix:tag. The key \'\' sets a default namespace for unprefixed tags.' },
    { name: 'default',    type: 'any',            required: false, default: 'None', desc: 'findtext only: returned when no element matches.' },
  ],

  modes: [
    {
      id: 'findall',
      label: 'findall()',
      blurb: 'Try the ElementPath syntax on a small document (two countries with neighbors). Matches are shown as (tag, attrib).',
      params: [
        { name: 'xml',  type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'path', type: 'str', hint: 'ElementPath',     input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n[(e.tag, e.attrib) for e in root.findall({$path})]',
      cases: [
        { id: 'child',  label: 'tag',             values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: 'country' } },
        { id: 'grand',  label: 'tag/tag',         values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: 'country/neighbor' } },
        { id: 'attr',   label: "[@dir='W']",      values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: ".//neighbor[@dir='W']" } },
        { id: 'text',   label: "[rank='4']",      values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: "country[rank='4']" } },
        { id: 'pos',    label: '[2]',             values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: './/neighbor[2]' } },
        { id: 'last',   label: '[last()]',        values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: 'country[last()]' } },
        { id: 'parent', label: '..',              values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: ".//neighbor[@name='MY']/.." } },
        { id: 'noquote', label: 'unquoted value', values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: './/neighbor[@dir=W]' } },
        { id: 'at',     label: 'tag/@attr',       values: { xml: '<data><country name="LI"><rank>1</rank><neighbor name="AT" dir="E"/><neighbor name="CH" dir="W"/></country><country name="SG"><rank>4</rank><neighbor name="MY" dir="N"/></country></data>', path: 'country/@name' } },
      ],
    },
    {
      id: 'find',
      label: 'find / findtext',
      blurb: 'The same path three ways: does find() find something, what findtext() returns, and findtext() with a default.',
      params: [
        { name: 'xml',  type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'path', type: 'str', hint: 'ElementPath',     input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n(root.find({$path}) is not None, root.findtext({$path}), root.findtext({$path}, default='-'))",
      cases: [
        { id: 'text',    label: 'has text',      values: { xml: '<user><name>Ada</name><nick/></user>', path: 'name' } },
        { id: 'empty',   label: 'empty element', values: { xml: '<user><name>Ada</name><nick/></user>', path: 'nick' } },
        { id: 'missing', label: 'no such tag',   values: { xml: '<user><name>Ada</name><nick/></user>', path: 'email' } },
        { id: 'first',   label: 'first of many', values: { xml: '<list><v>1</v><v>2</v></list>', path: 'v' } },
      ],
    },
    {
      id: 'ns',
      label: 'namespaces=',
      blurb: 'Map a prefix of your choice to a namespace URI; the prefix in the path does not have to match the document\'s. The key \'\' sets the default namespace.',
      params: [
        { name: 'xml',    type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'path',   type: 'str', hint: 'ElementPath',     input: 'text' },
        { name: 'prefix', type: 'str', hint: 'your prefix',     input: 'text' },
        { name: 'uri',    type: 'str', hint: 'namespace URI',   input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n[e.tag for e in root.findall({$path}, namespaces={{$prefix}: {$uri}})]',
      cases: [
        { id: 'own',     label: 'own prefix',     values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry/><entry/></feed>', path: 'a:entry', prefix: 'a', uri: 'http://www.w3.org/2005/Atom' } },
        { id: 'default', label: "'' = default",   values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry/><entry/></feed>', path: 'entry', prefix: '', uri: 'http://www.w3.org/2005/Atom' } },
        { id: 'unknown', label: 'unknown prefix', values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry/></feed>', path: 'x:entry', prefix: 'a', uri: 'http://www.w3.org/2005/Atom' } },
      ],
    },
  ],
  demoExplainer: 'A predicate value needs quotes: [@dir=W] raises SyntaxError: invalid predicate. ElementPath selects elements only — an XPath-style step like @name is not supported and fails with KeyError: \'@\'. [2] and [last()] count among siblings with the same tag under the same parent, so .//neighbor[2] is the second neighbor of each country (only LI has one). With a namespaces dict, a prefix the dict does not know raises SyntaxError: prefix \'x\' not found in prefix map.',

  patterns: [
    {
      name: 'Read fields of every record',
      desc: 'findall for the records, findtext for each field (with a default).',
      code: "import xml.etree.ElementTree as ET\nfor book in root.findall('.//book'):\n    title = book.findtext('title', default='')\n    year = int(book.findtext('year', default='0'))",
    },
    {
      name: 'Pick by attribute value',
      desc: 'Quote the value; double quotes work too.',
      code: "import xml.etree.ElementTree as ET\nadmin = root.find(\".//user[@role='admin']\")\nif admin is not None:\n    print(admin.get('name'))",
    },
    {
      name: 'Namespaced documents',
      desc: 'One dict, reused for every call.',
      code: "import xml.etree.ElementTree as ET\nNS = {'atom': 'http://www.w3.org/2005/Atom'}\ntitles = [e.text for e in root.iterfind('atom:entry/atom:title', NS)]",
    },
    {
      name: 'Ignore namespaces (3.8+)',
      desc: '{*}tag matches the tag in any namespace, or none.',
      code: "import xml.etree.ElementTree as ET\nfor entry in root.iterfind('.//{*}entry'):\n    print(entry.findtext('{*}title'))",
    },
  ],

  examples: [
    { title: 'find: first match or None', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b>x</b><b>y</b></a>')\n(root.find('b').text, root.find('z'))", returns: "('x', None)" },
    { title: 'findall: direct children only', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b>1</b><c><b>2</b></c></a>')\n([e.text for e in root.findall('b')], [e.text for e in root.findall('.//b')])", returns: "(['1'], ['1', '2'])" },
    { title: 'findtext: "" for an empty element', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\n(root.findtext('b'), root.findtext('z'), root.findtext('z', default='-'))", returns: "('', None, '-')" },
    { title: 'iterfind is lazy', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b>1</b><b>2</b></a>')\nnext(root.iterfind('b')).text", returns: "'1'" },
    { title: 'Not-equal predicate (3.10+)', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b k=\"1\"/><b k=\"2\"/><b/></a>')\n[e.get('k') for e in root.findall(\"b[@k!='1']\")]", returns: "['2']" },
    { title: '{*} matches any namespace (3.8+)', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<f xmlns=\"urn:a\" xmlns:m=\"urn:m\"><item/><m:item/></f>')\n[e.tag for e in root.findall('{*}item')]", returns: "['{urn:a}item', '{urn:m}item']" },
    { title: 'ElementTree methods start at the root', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.fromstring('<a><b>x</b></a>'))\ntree.findtext('b')", returns: "'x'" },
    { title: 'The parent step ..', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><c id=\"1\"><b/></c><c id=\"2\"/></a>')\n[e.get('id') for e in root.findall('.//b/..')]", returns: "['1']" },
  ],

  pitfalls: [
    {
      name: 'Expecting findall("tag") to search the whole tree',
      desc: 'A bare tag matches direct children only. Prefix the path with .// (or use iter()).',
      wrong: { label: "findall('b')", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><c><b/></c></a>')\nroot.findall('b')", output: '[]' },
      fix:   { label: "findall('.//b')", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><c><b/></c></a>')\n[e.tag for e in root.findall('.//b')]", output: "['b']" },
    },
    {
      name: 'Selecting attributes with @ like XPath',
      desc: 'ElementPath returns elements, never attribute values. Find the elements, then call get().',
      wrong: { label: "'item/@id'", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><item id=\"1\"/><item id=\"2\"/></a>')\nroot.findall('item/@id')", output: "KeyError: '@'" },
      fix:   { label: "get('id')", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><item id=\"1\"/><item id=\"2\"/></a>')\n[e.get('id') for e in root.findall('item')]", output: "['1', '2']" },
    },
    {
      name: 'A prefix without a namespaces dict',
      desc: 'A plain tag-like match is compared as-is, so "m:item" silently matches nothing; iterfind() (and any path with / or [) raises instead. Pass the mapping.',
      wrong: { label: "findall('m:item')", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<f xmlns:m=\"urn:m\"><m:item/></f>')\nroot.findall('m:item')", output: '[]' },
      fix:   { label: "{'m': 'urn:m'}", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<f xmlns:m=\"urn:m\"><m:item/></f>')\n[e.tag for e in root.findall('m:item', {'m': 'urn:m'})]", output: "['{urn:m}item']" },
    },
    {
      name: 'Starting a path with /',
      desc: 'Element paths are relative. On an Element a leading / raises; begin with . instead.',
      wrong: { label: "'//b'", code: "import xml.etree.ElementTree as ET\nET.fromstring('<a><b/></a>').findall('//b')", output: 'SyntaxError: cannot use absolute path on element' },
      fix:   { label: "'.//b'", code: "import xml.etree.ElementTree as ET\nlen(ET.fromstring('<a><b/></a>').findall('.//b'))", output: '1' },
    },
  ],

  when: {
    use: [
      'Locating elements by tag, attribute value, child text or position',
      'findtext() for "the text of this child, or a default"',
      'iterfind() when you only need the first few matches of a big tree',
    ],
    avoid: [
      'Every element of a tag anywhere → iter(tag) is simpler and faster',
      'Attribute values, functions, axes, or/and → full XPath in lxml (third-party)',
      'Text search across mixed content → "".join(e.itertext())',
    ],
  },

  notes: {
    cpython:     'Lib/xml/etree/ElementPath.py compiles the path into a chain of generator "selectors" and caches them (the cache is emptied once it holds more than 100 paths). The C Element answers find/findtext/findall itself when match contains none of / * [ @ . outside {...} and no namespaces are given — a straight comparison of child tags',
    'Syntax':    'tag, *, ., //, .., [@attr], [@attr=\'v\'], [@attr!=\'v\'] (3.10), [tag], [tag=\'text\'], [tag!=\'text\'] (3.10), [.=\'text\'] (3.7), [.!=\'text\'] (3.10), [n], [last()], [last()-n]; {*}tag, {ns}*, {}* (3.8)',
    'Positions': '[n] counts from 1 among siblings with the same tag under the same parent; position predicates must follow a tag name',
    'ElementTree': 'ElementTree.find & co. call the root\'s methods; a path starting with / is turned into ./... with a FutureWarning',
  },

  related: [
    { name: 'Element.iter',  slug: 'element-iter', when: 'Every descendant with a tag, no path needed' },
    { name: 'Element.get',   slug: 'element-get',  when: 'Read attributes of what you found' },
    { name: 'Element.text',  slug: 'element-tag',  when: 'text and tail of a found element' },
    { name: 'ElementTree',   slug: 'elementtree',  when: 'The same four methods on a whole document' },
    { name: 'fromstring',    slug: 'fromstring',   when: 'Get a root element to search' },
    { name: 're module',     slug: 're',           when: 'Patterns in text values once you found them', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does ElementTree support XPath?',
      a: 'A limited subset ("ElementPath"): tags, *, ., //, .., attribute and child-text predicates, positions and last(). No attribute selection with @ in a step, no functions other than last(), no boolean operators. For full XPath 1.0 use lxml.',
    },
    {
      q: 'How do I find an element by attribute value?',
      a: "root.find(\".//tag[@attr='value']\") for the first, root.findall(...) for all. The value must be quoted and cannot contain quotes; [@attr!='value'] (3.10+) selects the opposite.",
    },
    {
      q: 'What is the difference between find, findall, findtext and iterfind?',
      a: 'They take the same path. find returns the first match or None, findall a list of all matches, iterfind a lazy iterator over them, and findtext the first match\'s text — "" when that element has no text, default (None) when nothing matches.',
    },
    {
      q: 'Why does findall return an empty list for a tag I can see in the file?',
      a: 'Either the element is not a direct child (use .//tag) or it is in a namespace — {uri}tag, a namespaces dict, or {*}tag (3.8+) match it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#elementtree-xpath',
    meta:  'XPath support (find, findall, findtext, iterfind)',
  },
};
