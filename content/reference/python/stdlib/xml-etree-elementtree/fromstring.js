// content/reference/python/stdlib/xml-etree-elementtree/fromstring.js — fromstring, XML, fromstringlist

export const meta = {
  slug:        'fromstring',
  name:        'xml.etree.ElementTree.fromstring',
  signature:   'xml.etree.ElementTree.fromstring(text, parser=None)',
  blurb:       'Parse an XML string (or bytes) and get its root Element. XML() is the same function; fromstringlist() parses a sequence of fragments.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+ (fromstringlist 3.2+)',
  searchTerms: 'xml.etree.ElementTree.fromstring ET.fromstring ET.XML XML fromstringlist parse xml string python string to xml element root element bytes parseerror junk after document element undefined entity nbsp',
};

export const method = {
  slug:      'fromstring',
  name:      'xml.etree.ElementTree.fromstring',
  signature: 'xml.etree.ElementTree.fromstring(text, parser=None)',
  returns:   { type: 'Element', desc: 'The root element of the parsed document.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+ (fromstringlist 3.2+)',
  hasLiveDemo: true,

  subtitle: 'The quickest way from XML text to a tree: fromstring(text) feeds the text to an expat-based XMLParser and returns the root Element. ET.XML is the very same function, and fromstringlist() feeds several fragments in turn.',

  covers: ['fromstring', 'XML', 'fromstringlist'],

  cheat: {
    commonCall: "root = ET.fromstring('<a><b>1</b></a>')",
    returns:    'the root Element — not an ElementTree',
    replaces:   'regular expressions over XML text',
    watchOut:   'Pass the XML itself; a file name is parsed as text (ParseError: syntax error)',
  },

  parameters: [
    { name: 'text',   type: 'str | bytes', required: true,  default: null,   desc: 'The XML document. A str is parsed as UTF-8 text whatever its XML declaration says; bytes are decoded by expat (UTF-8 by default, or the declared encoding).' },
    { name: 'parser', type: 'XMLParser',   required: false, default: 'None', desc: 'A parser to use instead of a fresh XMLParser(target=TreeBuilder()) — e.g. one whose TreeBuilder keeps comments.' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'fromstring()',
      blurb: 'Parse your XML and look at the root: its tag, its attributes and the tags of its children.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n(root.tag, root.attrib, [child.tag for child in root])',
      cases: [
        { id: 'attrs',  label: 'attributes',      values: { xml: '<user id="7" role="admin"><name>Ada</name><email/></user>' } },
        { id: 'ns',     label: 'namespaces',      values: { xml: '<x:doc xmlns:x="urn:x"><x:p/></x:doc>' } },
        { id: 'decl',   label: 'XML declaration', values: { xml: '<?xml version="1.0" encoding="UTF-8"?><a>é</a>' } },
        { id: 'two',    label: 'two roots',       values: { xml: '<a/><b/>' } },
        { id: 'nbsp',   label: '&nbsp;',          values: { xml: '<p>&nbsp;</p>' } },
        { id: 'empty',  label: 'empty string',    values: { xml: '' } },
        { id: 'quotes', label: 'unquoted value',  values: { xml: '<a b=1/>' } },
      ],
    },
    {
      id: 'text',
      label: 'text and tail',
      blurb: 'Every element of the parsed tree with its text (before the first child) and tail (after its end tag).',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\n[(e.tag, e.text, e.tail) for e in ET.fromstring({$xml}).iter()]',
      cases: [
        { id: 'mixed',  label: 'mixed content', values: { xml: '<p>Hello <b>bold</b> world</p>' } },
        { id: 'refs',   label: 'references',    values: { xml: '<a>&lt;tag&gt; &amp; &#169; &#x263A;</a>' } },
        { id: 'cdata',  label: 'CDATA',         values: { xml: '<code><![CDATA[if a < b && c]]></code>' } },
        { id: 'space',  label: 'whitespace',    values: { xml: '<a>  <b> x </b>  </a>' } },
      ],
    },
    {
      id: 'list',
      label: 'fromstringlist()',
      blurb: 'Two fragments fed one after the other — they can split a tag or a word anywhere.',
      params: [
        { name: 'part1', type: 'str', hint: 'first fragment',  input: 'text' },
        { name: 'part2', type: 'str', hint: 'second fragment', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstringlist([{$part1}, {$part2}])\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'tag',   label: 'split in a tag',  values: { part1: '<root><it', part2: 'em>1</item></root>' } },
        { id: 'word',  label: 'split in text',   values: { part1: '<root>He', part2: 'llo</root>' } },
        { id: 'wrong', label: 'mismatched tag',  values: { part1: '<root>', part2: '</rot>' } },
      ],
    },
  ],
  demoExplainer: 'Positions in a ParseError count lines from 1 and columns from 0, in characters: "two roots" fails at column 4, where the second element starts, with "junk after document element". nbsp is an HTML entity, not one of the five XML ones (lt, gt, amp, quot, apos), so expat reports "undefined entity" at the ampersand. The declared encoding="UTF-8" plays no role for a str — the text is already decoded.',

  patterns: [
    {
      name: 'Parse and walk',
      desc: 'The root is an Element; iterate it for the children.',
      code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring(xml_text)\nfor child in root:\n    print(child.tag, child.attrib)",
    },
    {
      name: 'Parse bytes from the network',
      desc: 'Hand the raw bytes to fromstring so expat honours the XML declaration\'s encoding.',
      code: "import xml.etree.ElementTree as ET\nimport urllib.request\nwith urllib.request.urlopen(url) as resp:\n    root = ET.fromstring(resp.read())",
    },
    {
      name: 'Keep comments while parsing',
      desc: 'Pass a parser whose TreeBuilder inserts comments and processing instructions.',
      code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))\nroot = ET.fromstring(xml_text, parser=parser)",
    },
  ],

  examples: [
    { title: 'Root element and a child', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a><b>1</b></a>').find('b').text", returns: "'1'" },
    { title: 'XML is fromstring', code: 'import xml.etree.ElementTree as ET\nET.XML is ET.fromstring', returns: 'True' },
    { title: 'Whitespace text is kept', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a>\\n  <b/>\\n</a>').text", returns: "'\\n  '" },
    { title: 'Character references are decoded', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a>&#60;&#65;&#38;</a>').text", returns: "'<A&'" },
    { title: 'Bytes use the declared encoding', code: "import xml.etree.ElementTree as ET\nET.fromstring(b'<?xml version=\"1.0\" encoding=\"latin-1\"?><a>\\xe9</a>').text", returns: "'é'" },
    { title: 'fromstringlist joins fragments', code: "import xml.etree.ElementTree as ET\nET.fromstringlist(['<a>', 'x', '</a>']).text", returns: "'x'" },
    { title: 'A second root element is an error', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a/><b/>')", returns: 'xml.etree.ElementTree.ParseError: junk after document element: line 1, column 4' },
  ],

  pitfalls: [
    {
      name: 'Passing a file name',
      desc: 'fromstring parses the string you give it. A path is text that is not XML.',
      wrong: { label: 'fromstring(path)', code: "import xml.etree.ElementTree as ET\nET.fromstring('data.xml')", output: 'xml.etree.ElementTree.ParseError: syntax error: line 1, column 0' },
      fix:   { label: 'parse(path)', code: "import xml.etree.ElementTree as ET\nwith open('data.xml', 'w', encoding='utf-8') as f:\n    f.write('<a><b/></a>')\nET.parse('data.xml').getroot().tag", output: "'a'" },
    },
    {
      name: 'HTML entities in XML',
      desc: 'XML defines only &lt; &gt; &amp; &quot; &apos;. Use a character reference such as &#160; (or the character itself).',
      wrong: { label: '&nbsp;', code: "import xml.etree.ElementTree as ET\nET.fromstring('<p>&nbsp;</p>')", output: 'xml.etree.ElementTree.ParseError: undefined entity: line 1, column 3' },
      fix:   { label: '&#160;', code: "import xml.etree.ElementTree as ET\nET.fromstring('<p>&#160;</p>').text", output: "'\\xa0'" },
    },
    {
      name: 'Several top-level elements',
      desc: 'A document has exactly one root. Wrap fragments in a container element before parsing.',
      wrong: { label: 'two roots', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a/><b/>')", output: 'xml.etree.ElementTree.ParseError: junk after document element: line 1, column 4' },
      fix:   { label: 'wrap them', code: "import xml.etree.ElementTree as ET\n[e.tag for e in ET.fromstring('<list>' + '<a/><b/>' + '</list>')]", output: "['a', 'b']" },
    },
  ],

  when: {
    use: [
      'XML you already have in memory: an HTTP response body, a database column, a test fixture',
      'Bytes with an XML declaration — expat decodes them for you',
      'Data that arrives in pieces you already hold in a list → fromstringlist()',
    ],
    avoid: [
      'Files → ET.parse(path), which reads and parses in one step',
      'Huge documents → ET.iterparse() to process them element by element',
      'Untrusted input on a server — the docs point to "XML vulnerabilities" and defusedxml',
    ],
  },

  notes: {
    cpython:     'XML(text, parser=None) creates XMLParser(target=TreeBuilder()) unless a parser is given, calls parser.feed(text) then returns parser.close(); fromstring = XML. fromstringlist() calls feed() once per item',
    'str vs bytes': 'For a str, the C XMLParser tells expat the data is UTF-8, so an encoding= in the XML declaration is not used; bytes are decoded by expat itself',
    'Errors':    'ParseError (a SyntaxError subclass) with expat\'s message and position; str(e) looks like "mismatched tag: line 1, column 8"',
  },

  related: [
    { name: 'parse',          slug: 'parse',       when: 'Parse a file instead of a string' },
    { name: 'ParseError',     slug: 'parseerror',  when: 'What malformed text raises' },
    { name: 'Element',        slug: 'element',     when: 'What you get back' },
    { name: 'tostring',       slug: 'tostring',    when: 'The reverse: tree → text' },
    { name: 'XMLParser',      slug: 'xmlparser',   when: 'The parser fromstring uses' },
    { name: 'json.loads',     slug: 'loads',       when: 'The JSON counterpart', category: 'stdlib/json' },
  ],

  faq: [
    {
      q: 'What is the difference between ET.fromstring and ET.parse?',
      a: 'fromstring takes the XML text itself and returns the root Element. parse takes a file name or file object and returns an ElementTree; call getroot() on it for the root Element.',
    },
    {
      q: 'What is the difference between ET.XML and ET.fromstring?',
      a: 'None — fromstring is defined as an alias of XML (ET.XML is ET.fromstring is True). XML reads nicely when you embed an XML literal in code.',
    },
    {
      q: 'Why do I get "ParseError: undefined entity"?',
      a: 'The text uses an entity that XML does not define, typically an HTML one such as nbsp, copy or eacute. Replace it with a numeric character reference (&#160;) or the character itself.',
    },
    {
      q: 'Should I pass str or bytes to fromstring?',
      a: 'Both work. Bytes let expat decode the document using its XML declaration (UTF-8 if there is none); a str is already decoded, so the declared encoding is ignored.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.fromstring',
    meta:  'xml.etree.ElementTree.fromstring',
  },
};
