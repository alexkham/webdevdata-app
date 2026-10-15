// content/reference/python/stdlib/xml-etree-elementtree/xmlparser.js — XMLParser

export const meta = {
  slug:        'xmlparser',
  name:        'xml.etree.ElementTree.XMLParser',
  signature:   'xml.etree.ElementTree.XMLParser(*, target=None, encoding=None)',
  blurb:       'The expat-based push parser behind fromstring() and parse(): feed() it data and it calls start / end / data / comment / pi methods on a target object — a TreeBuilder by default, or your own class.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+ (keyword-only arguments 3.8, flush() 3.13)',
  searchTerms: 'xml.etree.ElementTree.XMLParser ET.XMLParser XMLParser target feed close flush encoding entity version custom target start end data comment pi start_ns end_ns sax-like callbacks expat python xml parser class',
};

export const method = {
  slug:      'xmlparser',
  name:      'xml.etree.ElementTree.XMLParser',
  signature: 'xml.etree.ElementTree.XMLParser(*, target=None, encoding=None)',
  returns:   { type: 'XMLParser', desc: 'A parser with feed(data), flush() and close(); close() returns whatever target.close() returns.' },

  category:    'xml.etree.ElementTree class',
  version:     'Python 2.5+ (keyword-only arguments 3.8, flush() 3.13)',
  hasLiveDemo: true,

  subtitle: 'XMLParser turns expat\'s callbacks into method calls on a target. With the default TreeBuilder target you get Elements (that is all fromstring() does); with your own target class you can count, filter or convert a document without building a tree at all.',

  covers: ['XMLParser'],

  cheat: {
    commonCall: 'parser = ET.XMLParser(target=MyTarget())',
    returns:    'a parser — feed(data) any number of times, then close()',
    replaces:   'xml.sax handlers for simple event processing',
    watchOut:   'Arguments are keyword-only (3.8+); one parser parses one document',
  },

  parameters: [
    { name: 'target',   type: 'object', required: false, default: 'None', desc: 'Receives the callbacks: start(tag, attrib), end(tag), data(text), and optionally comment(text), pi(target, text), start_ns(prefix, uri), end_ns(prefix), close(). Missing methods are simply not called. None means TreeBuilder().' },
    { name: 'encoding', type: 'str',    required: false, default: 'None', desc: 'Overrides the encoding declared in the document (for bytes input).' },
  ],

  modes: [
    {
      id: 'target',
      label: 'custom target',
      blurb: 'The MaxDepth target from the Python docs: count how deeply your XML nests without building a tree. close() returns the target\'s result.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nclass MaxDepth:\n    maxDepth = 0\n    depth = 0\n    def start(self, tag, attrib):\n        self.depth += 1\n        if self.depth > self.maxDepth:\n            self.maxDepth = self.depth\n    def end(self, tag):\n        self.depth -= 1\n    def data(self, data):\n        pass\n    def close(self):\n        return self.maxDepth\nparser = ET.XMLParser(target=MaxDepth())\nparser.feed({$xml})\nparser.close()",
      cases: [
        { id: 'docs',  label: 'docs example', values: { xml: '<a><b></b><b><c><d></d></c></b></a>' } },
        { id: 'flat',  label: 'flat',         values: { xml: '<list><i/><i/><i/></list>' } },
        { id: 'one',   label: 'one element',  values: { xml: '<a/>' } },
        { id: 'error', label: 'broken XML',   values: { xml: '<a><b></a>' } },
      ],
    },
    {
      id: 'calls',
      label: 'every callback',
      blurb: 'A target that records each call it receives, in order — exactly what XMLParser tells any target.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nclass Recorder:\n    def __init__(self):\n        self.calls = []\n    def start(self, tag, attrib):\n        self.calls.append(('start', tag, attrib))\n    def end(self, tag):\n        self.calls.append(('end', tag))\n    def data(self, data):\n        self.calls.append(('data', data))\n    def comment(self, text):\n        self.calls.append(('comment', text))\n    def pi(self, target, data):\n        self.calls.append(('pi', target, data))\n    def start_ns(self, prefix, uri):\n        self.calls.append(('start_ns', prefix, uri))\n    def end_ns(self, prefix):\n        self.calls.append(('end_ns', prefix))\n    def close(self):\n        return self.calls\nparser = ET.XMLParser(target=Recorder())\nparser.feed({$xml})\nparser.close()",
      cases: [
        { id: 'basic',  label: 'elements + text',  values: { xml: '<p class="x">Hi <b>you</b>!</p>' } },
        { id: 'refs',   label: 'references',       values: { xml: '<p>a&#38;b&#xA;c</p>' } },
        { id: 'ns',     label: 'namespaces',       values: { xml: '<x:doc xmlns:x="urn:x"><x:p/></x:doc>' } },
        { id: 'misc',   label: 'comment + PI',     values: { xml: '<?style a?><doc><!-- n --><?go?></doc>' } },
      ],
    },
  ],
  demoExplainer: 'MaxDepth only counts start and end calls, so the docs example gives 4 (a > b > c > d). The recorder shows what any target receives: data arrives in pieces — expat calls data() separately for text runs, for each line break and for each reference (&#38; arrives as "&" on its own) — which is why TreeBuilder joins them. Namespace declarations reach start_ns() before the start() of the element that declares them; tags come in {uri}local form. Comments and PIs are reported even outside the root element.',

  patterns: [
    {
      name: 'Collect data without building a tree',
      desc: 'A target with start/end/data/close is all you need.',
      code: "import xml.etree.ElementTree as ET\n\nclass Titles:\n    def __init__(self):\n        self.titles, self.inside, self.buf = [], False, []\n    def start(self, tag, attrib):\n        self.inside = tag == 'title'\n    def data(self, text):\n        if self.inside:\n            self.buf.append(text)\n    def end(self, tag):\n        if tag == 'title':\n            self.titles.append(''.join(self.buf))\n            self.buf, self.inside = [], False\n    def close(self):\n        return self.titles\n\nparser = ET.XMLParser(target=Titles())\nparser.feed(xml_text)\ntitles = parser.close()",
    },
    {
      name: 'Keep comments in the tree',
      desc: 'Give the parser a TreeBuilder that inserts them.',
      code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True, insert_pis=True))\nroot = ET.fromstring(xml_text, parser=parser)",
    },
    {
      name: 'Feed a file in chunks',
      desc: 'Any chunk size works; close() returns the root.',
      code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser()\nwith open('data.xml', 'rb') as f:\n    while chunk := f.read(65536):\n        parser.feed(chunk)\nroot = parser.close()",
    },
  ],

  examples: [
    { title: 'Counting depth with a target (docs)', code: "import xml.etree.ElementTree as ET\nclass MaxDepth:\n    maxDepth = 0\n    depth = 0\n    def start(self, tag, attrib):\n        self.depth += 1\n        if self.depth > self.maxDepth:\n            self.maxDepth = self.depth\n    def end(self, tag):\n        self.depth -= 1\n    def data(self, data):\n        pass\n    def close(self):\n        return self.maxDepth\nparser = ET.XMLParser(target=MaxDepth())\nparser.feed('<a><b></b><b><c><d></d></c></b></a>')\nparser.close()", returns: '4' },
    { title: 'The default target builds Elements', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser()\nparser.feed('<a><b>1</b>')\nparser.feed('<b>2</b></a>')\nroot = parser.close()\n[b.text for b in root]", returns: "['1', '2']" },
    { title: 'A target needs only the methods it uses', code: "import xml.etree.ElementTree as ET\nclass Tags:\n    def __init__(self):\n        self.seen = []\n    def start(self, tag, attrib):\n        self.seen.append(tag)\n    def close(self):\n        return self.seen\nparser = ET.XMLParser(target=Tags())\nparser.feed('<a><b/><c/></a>')\nparser.close()", returns: "['a', 'b', 'c']" },
    { title: 'Text reaches data() in pieces', code: "import xml.etree.ElementTree as ET\nclass Pieces:\n    def __init__(self):\n        self.calls = []\n    def data(self, data):\n        self.calls.append(data)\n    def close(self):\n        return self.calls\nparser = ET.XMLParser(target=Pieces())\nparser.feed('<p>Tom &#38; Jerry\\n<b/>!</p>')\nparser.close()", returns: "['Tom ', '&', ' Jerry', '\\n', '!']" },
    { title: 'encoding= overrides the declaration', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(encoding='utf-8')\nparser.feed(b'<?xml version=\"1.0\" encoding=\"latin-1\"?><a>\\xc3\\xa9</a>')\nparser.close().text", returns: "'é'" },
    { title: 'close() reports an unfinished document', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser()\nparser.feed('<a>')\nparser.close()", returns: 'xml.etree.ElementTree.ParseError: no element found: line 1, column 3' },
    { title: 'Its public attributes', code: "import xml.etree.ElementTree as ET\n[n for n in dir(ET.XMLParser()) if not n.startswith('_')]", returns: "['close', 'entity', 'feed', 'flush', 'target', 'version']" },
  ],

  pitfalls: [
    {
      name: 'Passing the target positionally',
      desc: 'Since 3.8 every XMLParser argument is keyword-only (the old html argument is gone).',
      wrong: { label: 'XMLParser(builder)', code: "import xml.etree.ElementTree as ET\nET.XMLParser(ET.TreeBuilder())", output: 'TypeError: XMLParser() takes no positional arguments' },
      fix:   { label: 'target=builder', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder())\nparser.feed('<a/>')\nparser.close().tag", output: "'a'" },
    },
    {
      name: 'Reusing a parser for a second document',
      desc: 'After close() the expat parser is finished; feeding again raises ParseError: parsing finished.',
      wrong: { label: 'feed after close', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser()\nparser.feed('<a/>')\nparser.close()\nparser.feed('<b/>')", output: 'xml.etree.ElementTree.ParseError: parsing finished: line 1, column 4' },
      fix:   { label: 'a new parser each time', code: "import xml.etree.ElementTree as ET\nroots = []\nfor doc in ['<a/>', '<b/>']:\n    parser = ET.XMLParser()\n    parser.feed(doc)\n    roots.append(parser.close().tag)\nroots", output: "['a', 'b']" },
    },
    {
      name: 'HTML entities from an external DTD',
      desc: 'A document that declares an external DTD (XHTML, for example) may use entities such as &nbsp; that expat cannot resolve, because it never loads the DTD. Supply their values in parser.entity.',
      wrong: { label: 'default parser', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser()\nparser.feed('<!DOCTYPE p SYSTEM \"about:legacy\"><p>x&nbsp;y</p>')\nparser.close().text", output: 'xml.etree.ElementTree.ParseError: undefined entity &nbsp;: line 1, column 38' },
      fix:   { label: "parser.entity['nbsp']", code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser()\nparser.entity['nbsp'] = '\\xa0'\nparser.feed('<!DOCTYPE p SYSTEM \"about:legacy\"><p>x&nbsp;y</p>')\nparser.close().text", output: "'x\\xa0y'" },
    },
  ],

  when: {
    use: [
      'Event-style processing (counting, filtering, converting) without building Elements',
      'Feeding a document in chunks and getting the root back from close()',
      'Customising the tree: a TreeBuilder that keeps comments and PIs, or a builder of your own',
    ],
    avoid: [
      'You want Elements with events you pull yourself → XMLPullParser or iterparse()',
      'A complete string or file → fromstring() / parse() create the parser for you',
      'Untrusted input on a server — the docs point to "XML vulnerabilities" and defusedxml',
    ],
  },

  notes: {
    cpython:     'The C class from Modules/_elementtree.c; it creates an expat parser with "}" as namespace separator, so tags arrive as {uri}local. With the default TreeBuilder it calls the builder directly; for any other target it looks up start, end, data, comment, pi, start_ns, end_ns, doctype and close once and calls those that exist. start() always gets a dict (empty when there are no attributes)',
    'Entities':  'parser.entity is a dict consulted for entity references expat leaves unresolved — that happens for documents with an external DTD reference. Documents without a DTD only know the five predefined entities; anything else is a ParseError (undefined entity)',
    'Versions':  'Arguments are keyword-only and the html argument was removed in 3.8. flush() is 3.13 (backported to some earlier releases as a security fix). parser.version holds the expat version string, which depends on your Python build',
    'Security':  'The docs: the module is not secure against maliciously constructed data; external entities are not expanded (an entity reference to one raises ParseError)',
  },

  related: [
    { name: 'TreeBuilder',   slug: 'treebuilder',   when: 'The default target, and how to customise it' },
    { name: 'XMLPullParser', slug: 'xmlpullparser', when: 'Pull (event, element) pairs instead of callbacks' },
    { name: 'fromstring',    slug: 'fromstring',    when: 'feed() + close() in one call' },
    { name: 'C14NWriterTarget', slug: 'canonicalize', when: 'A target that writes canonical XML' },
    { name: 'ParseError',    slug: 'parseerror',    when: 'What feed() and close() raise' },
  ],

  faq: [
    {
      q: 'How do I process XML with callbacks like SAX using ElementTree?',
      a: 'Write a class with start(tag, attrib), end(tag), data(text) and close() methods and pass an instance as ET.XMLParser(target=...). Call feed() with the XML (all at once or in chunks), then close(), which returns whatever your close() returns.',
    },
    {
      q: 'Why does my data() method get the text in several pieces?',
      a: 'expat reports character data as it scans it: separate calls for a text run, each line break, each entity or character reference, and wherever a feed() chunk ended. Collect the pieces in a list and join them in end() — TreeBuilder does exactly that.',
    },
    {
      q: 'How do I keep comments when parsing?',
      a: "Use ET.XMLParser(target=ET.TreeBuilder(insert_comments=True)) and pass it to fromstring(text, parser=...) or parse(source, parser=...). Comments inside the root become Comment elements.",
    },
    {
      q: 'What does XMLParser(encoding=...) do?',
      a: 'It overrides the encoding named in the XML declaration when you feed bytes — useful when a document lies about its encoding. A str is always passed to expat as UTF-8.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.XMLParser',
    meta:  'xml.etree.ElementTree.XMLParser',
  },
};
