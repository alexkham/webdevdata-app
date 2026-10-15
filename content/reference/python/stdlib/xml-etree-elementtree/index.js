// content/reference/python/stdlib/xml-etree-elementtree/index.js — the xml.etree.ElementTree module hub

export const meta = {
  slug:        'index',
  name:        'xml.etree.ElementTree',
  signature:   'import xml.etree.ElementTree as ET',
  blurb:       'Parse XML into a tree of Element objects, search it with a small XPath subset, change it, and write it back out — fromstring, parse, find, findall, tostring, indent.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree elementtree python xml parser parse xml string read xml file ET.fromstring ET.parse findall find xpath tostring write xml pretty print indent namespaces element subelement expat parseerror xml to dict',
};

export const method = {
  slug: 'index',
  name: 'xml.etree.ElementTree',

  category:    'Data formats',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  coverClasses: ['Element', 'ElementTree'],

  subtitle: 'The standard way to read and write XML in Python. fromstring() and parse() turn XML into Element objects with tag, attrib, text and children; find() and findall() locate elements by path; tostring() and ElementTree.write() serialize the tree again.',

  imports: ['import xml.etree.ElementTree as ET', 'from xml.etree.ElementTree import Element, SubElement, tostring'],
  facts: [
    { label: 'Core objects', value: 'Element (one node: tag, attrib, text, tail, children) and ElementTree (a whole document, for files)' },
    { label: 'Parser',       value: 'Expat via the C accelerator _elementtree — errors are ParseError with the expat message, line and column' },
    { label: 'Searching',    value: 'find / findall / findtext / iterfind with a limited XPath subset; iter() walks every descendant' },
    { label: 'Streaming',    value: 'iterparse() for large files, XMLPullParser for data you feed in pieces, XMLParser with your own target for callbacks' },
    { label: 'Security',     value: 'The docs: not secure against maliciously constructed data — see "XML vulnerabilities" before parsing untrusted input' },
  ],

  modes: [
    {
      id: 'query',
      label: 'parse + find',
      blurb: 'Parse the XML you type, then run findall() with your path. Each match is shown as (tag, attrib, text).',
      params: [
        { name: 'xml',  type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'path', type: 'str', hint: 'an ElementPath expression', input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n[(e.tag, e.attrib, e.text) for e in root.findall({$path})]',
      cases: [
        { id: 'child',  label: 'child tag',        values: { xml: '<shelf><book id="b1"><title>Dune</title><year>1965</year></book><book id="b2"><title>Emma</title><year>1815</year></book></shelf>', path: 'book' } },
        { id: 'deep',   label: './/title',         values: { xml: '<shelf><book id="b1"><title>Dune</title><year>1965</year></book><book id="b2"><title>Emma</title><year>1815</year></book></shelf>', path: './/title' } },
        { id: 'attr',   label: '[@id=...]',        values: { xml: '<shelf><book id="b1"><title>Dune</title><year>1965</year></book><book id="b2"><title>Emma</title><year>1815</year></book></shelf>', path: "book[@id='b2']/title" } },
        { id: 'text',   label: '[child=text]',     values: { xml: '<shelf><book id="b1"><title>Dune</title><year>1965</year></book><book id="b2"><title>Emma</title><year>1815</year></book></shelf>', path: "book[year='1965']" } },
        { id: 'ns',     label: 'default namespace', values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Hi</title></entry></feed>', path: 'entry' } },
        { id: 'nsfull', label: '{uri}tag',         values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Hi</title></entry></feed>', path: '{http://www.w3.org/2005/Atom}entry' } },
        { id: 'abs',    label: 'absolute path',    values: { xml: '<shelf><book id="b1"/></shelf>', path: '/shelf/book' } },
        { id: 'broken', label: 'broken XML',       values: { xml: '<shelf><book></shelf>', path: 'book' } },
      ],
    },
    {
      id: 'build',
      label: 'build + tostring',
      blurb: 'Create elements in code and serialize them. Special characters are escaped for you.',
      params: [
        { name: 'tag',  type: 'str', hint: 'child tag',        input: 'text' },
        { name: 'sku',  type: 'str', hint: 'attribute value',  input: 'text' },
        { name: 'text', type: 'str', hint: 'child text',       input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.Element('catalog')\nitem = ET.SubElement(root, {$tag}, sku={$sku})\nitem.text = {$text}\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'plain',  label: 'plain',          values: { tag: 'item', sku: 'A-100', text: 'Desk lamp' } },
        { id: 'escape', label: 'escaping',       values: { tag: 'item', sku: 'say "hi"', text: 'Fish & Chips <fresh>' } },
        { id: 'ns',     label: '{uri}tag',       values: { tag: '{urn:shop}item', sku: 'A-1', text: 'Crème brûlée' } },
      ],
    },
    {
      id: 'indent',
      label: 'indent()',
      blurb: 'Pretty-print: indent() rewrites whitespace-only text and tails, then tostring() serializes (shown one line per item).',
      params: [
        { name: 'xml',   type: 'str', hint: 'an XML document',     input: 'text' },
        { name: 'space', type: 'str', hint: 'one indentation step', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nET.indent(root, space={$space})\nET.tostring(root, encoding='unicode').splitlines()",
      cases: [
        { id: 'nested', label: 'nested',        values: { xml: '<config><db><host>localhost</host><port>5432</port></db><debug/></config>', space: '  ' } },
        { id: 'four',   label: '4 spaces',      values: { xml: '<a><b><c/></b></a>', space: '    ' } },
        { id: 'mixed',  label: 'mixed content', values: { xml: '<p>Hello <b>world</b>!</p>', space: '  ' } },
      ],
    },
  ],
  demoExplainer: 'In "default namespace" the plain path entry finds nothing: xmlns="..." puts every unprefixed tag in that namespace, so the real tag is {http://www.w3.org/2005/Atom}entry. A path starting with / raises SyntaxError: cannot use absolute path on element, and broken XML raises ParseError with expat\'s message, a line counted from 1 and a column counted from 0 (column 15 is where the end-tag name shelf starts). In "mixed content" indent() changes nothing: it only replaces text and tails that are empty or whitespace.',

  patterns: [
    {
      name: 'Read an XML file',
      desc: 'parse() returns an ElementTree; getroot() gives the top element.',
      code: "import xml.etree.ElementTree as ET\ntree = ET.parse('data.xml')\nroot = tree.getroot()\nfor item in root.iter('item'):\n    print(item.get('id'), item.findtext('name'))",
    },
    {
      name: 'Namespaced documents',
      desc: 'Map your own prefixes to the URIs and pass the dict to find/findall.',
      code: "import xml.etree.ElementTree as ET\nns = {'atom': 'http://www.w3.org/2005/Atom'}\nfor entry in root.findall('atom:entry', ns):\n    print(entry.findtext('atom:title', namespaces=ns))",
    },
    {
      name: 'Build and save a document',
      desc: 'SubElement creates and appends in one step; indent() pretty-prints (3.9+).',
      code: "import xml.etree.ElementTree as ET\nroot = ET.Element('users')\nET.SubElement(root, 'user', id='1').text = 'Ada'\nET.indent(root)\nET.ElementTree(root).write('users.xml', encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'Report where parsing failed',
      desc: 'ParseError carries expat\'s position as (line, column).',
      code: "import xml.etree.ElementTree as ET\ntry:\n    root = ET.fromstring(text)\nexcept ET.ParseError as e:\n    line, column = e.position\n    print(f'bad XML at line {line}, column {column}: {e}')",
    },
  ],

  examples: [
    { title: 'Tag, attributes, a child\'s text', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<user id=\"7\"><name>Ada</name></user>')\n(root.tag, root.attrib, root.find('name').text)", returns: "('user', {'id': '7'}, 'Ada')" },
    { title: 'An Element iterates over its children', code: "import xml.etree.ElementTree as ET\n[child.tag for child in ET.fromstring('<a><b/><c/></a>')]", returns: "['b', 'c']" },
    { title: 'tostring() returns bytes by default', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring('<a>é</a>'))", returns: "b'<a>&#233;</a>'" },
    { title: 'encoding="unicode" returns a str', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring('<a>é</a>'), encoding='unicode')", returns: "'<a>é</a>'" },
    { title: 'Prefixes become {uri} in tags', code: "import xml.etree.ElementTree as ET\nET.fromstring('<x:a xmlns:x=\"urn:demo\"/>').tag", returns: "'{urn:demo}a'" },
    { title: 'Comments are dropped while parsing', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring('<a><!-- note -->text</a>'), encoding='unicode')", returns: "'<a>text</a>'" },
    { title: 'findtext() with a default', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a/>').findtext('b', 'n/a')", returns: "'n/a'" },
  ],

  pitfalls: [
    {
      name: 'Testing a found element with if',
      desc: 'An Element with no children is falsy (and 3.12+ warns with DeprecationWarning). find() returning an empty element looks like "not found". Compare with None.',
      wrong: { label: 'bool(element)', code: "import xml.etree.ElementTree as ET\nbool(ET.fromstring('<a><b/></a>').find('b'))", output: 'False' },
      fix:   { label: 'is not None',   code: "import xml.etree.ElementTree as ET\nET.fromstring('<a><b/></a>').find('b') is not None", output: 'True' },
    },
    {
      name: 'Ignoring the default namespace',
      desc: 'xmlns="..." applies to every unprefixed tag, so a plain tag name matches nothing. Use {uri}tag or a namespaces dict with the "" key.',
      wrong: { label: "findall('entry')", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<feed xmlns=\"http://www.w3.org/2005/Atom\"><entry/></feed>')\nroot.findall('entry')", output: '[]' },
      fix:   { label: "namespaces={'': uri}", code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<feed xmlns=\"http://www.w3.org/2005/Atom\"><entry/></feed>')\n[e.tag for e in root.findall('entry', {'': 'http://www.w3.org/2005/Atom'})]", output: "['{http://www.w3.org/2005/Atom}entry']" },
    },
    {
      name: 'Treating tostring() output as a str',
      desc: 'Without encoding="unicode" you get bytes (US-ASCII with character references).',
      wrong: { label: 'bytes + str', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a')) + '!'", output: "TypeError: can't concat str to bytes" },
      fix:   { label: "encoding='unicode'", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a'), encoding='unicode') + '!'", output: "'<a />!'" },
    },
  ],

  when: {
    use: [
      'Reading and writing XML configuration, feeds, SVG, Office/OpenDocument parts, SOAP and other XML formats',
      'Quick searches with paths like .//item[@id="3"] without a third-party library',
      'Streaming large files with iterparse() and clearing elements you are done with',
    ],
    avoid: [
      'Untrusted XML on a server — the docs point to "XML vulnerabilities" and recommend the defusedxml package',
      'Full XPath 1.0, XSLT or schema validation → lxml (third-party)',
      'HTML from the web — it is not XML → html.parser or a dedicated HTML library',
      'Data you control end to end → json is simpler',
    ],
  },

  notes: {
    cpython:     'Lib/xml/etree/ElementTree.py (pure Python) with Element, SubElement, TreeBuilder, XMLParser and ParseError replaced by the C accelerator Modules/_elementtree.c; searching is Lib/xml/etree/ElementPath.py; parsing is expat (pyexpat)',
    'Security':  'The 3.13 docs: "not secure against maliciously constructed data". Their XML vulnerabilities table lists etree as safe from external entity expansion and DTD retrieval ("doesn\'t expand external entities and raises a ParseError when an entity occurs"), and as vulnerable to billion laughs and quadratic blowup — with the note that Expat 2.4.1 and newer is not vulnerable to those two (check pyexpat.EXPAT_VERSION)',
    'Comments':  'XMLParser skips comments and processing instructions by default; use TreeBuilder(insert_comments=True, insert_pis=True) to keep them',
    'Order':     'Attributes keep the order they were parsed or set in (since 3.8); tostring() writes them in that order',
  },

  related: [
    { name: 'json module', slug: 'json', when: 'The other common data format in the standard library', category: 'stdlib' },
    { name: 'html module', slug: 'html', when: 'html.escape for text you put into markup by hand', category: 'stdlib' },
    { name: 'open()',      slug: 'open', when: 'Files for parse() and ElementTree.write()', category: 'functions' },
    { name: 'SyntaxError', slug: 'syntaxerror', when: 'The base class of ParseError', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I parse an XML string in Python?',
      a: "root = ET.fromstring(text) returns the root Element (ET.XML is the same function). For a file use tree = ET.parse('file.xml') and root = tree.getroot(). Then read root.tag, root.attrib, root.text, and iterate over root for its children.",
    },
    {
      q: 'Why does findall() return an empty list?',
      a: 'Usually a namespace: with xmlns="uri" every tag is really {uri}tag. Search with that form or pass namespaces={"": uri}. Also, findall("tag") looks only at direct children — use ".//tag" to search the whole subtree.',
    },
    {
      q: 'How do I pretty-print XML with ElementTree?',
      a: 'Call ET.indent(root) (Python 3.9+) and then ET.tostring(root, encoding="unicode") or tree.write(...). indent() only replaces whitespace-only text, so mixed content keeps its exact text.',
    },
    {
      q: 'Is xml.etree.ElementTree safe for untrusted XML?',
      a: 'The documentation says the module is not secure against maliciously constructed data and points to the "XML vulnerabilities" section and the defusedxml package, which it recommends for server code that parses untrusted data. External entities are not expanded (an entity raises ParseError); billion laughs and quadratic blowup are not a risk with Expat 2.4.1 or newer — check pyexpat.EXPAT_VERSION.',
    },
    {
      q: 'Why are my XML comments gone after parsing?',
      a: 'The default parser drops comments and processing instructions. Build the parser yourself: ET.XMLParser(target=ET.TreeBuilder(insert_comments=True)), and pass it to fromstring() or parse().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html',
    meta:  'xml.etree.ElementTree — The ElementTree XML API',
  },

};
