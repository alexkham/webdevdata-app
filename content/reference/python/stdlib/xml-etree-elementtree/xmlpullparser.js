// content/reference/python/stdlib/xml-etree-elementtree/xmlpullparser.js — XMLPullParser

export const meta = {
  slug:        'xmlpullparser',
  name:        'xml.etree.ElementTree.XMLPullParser',
  signature:   'xml.etree.ElementTree.XMLPullParser(events=None)',
  blurb:       'A non-blocking parser: feed() it XML whenever data arrives and call read_events() for the (event, element) pairs parsed so far — for sockets, async code and streams you do not control.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+ (comment / pi events 3.8, flush() 3.13)',
  searchTerms: 'xml.etree.ElementTree.XMLPullParser ET.XMLPullParser XMLPullParser feed read_events flush close non-blocking xml parser python incremental xml parsing asyncio socket stream xml events reparse deferral expat',
};

export const method = {
  slug:      'xmlpullparser',
  name:      'xml.etree.ElementTree.XMLPullParser',
  signature: 'xml.etree.ElementTree.XMLPullParser(events=None)',
  returns:   { type: 'XMLPullParser', desc: 'A parser with feed(data), read_events(), flush() and close().' },

  category:    'xml.etree.ElementTree class',
  version:     'Python 3.4+ (comment / pi events 3.8, flush() 3.13)',
  hasLiveDemo: true,

  subtitle: 'XMLPullParser never reads anything itself. You push text (or bytes) in with feed(), the parser builds the tree as far as the data allows and queues events; read_events() hands them out. close() ends the stream and reports a document that was cut short.',

  covers: ['XMLPullParser'],

  cheat: {
    commonCall: "parser = ET.XMLPullParser(['start', 'end'])",
    returns:    'a parser: feed(data), then for event, elem in parser.read_events()',
    replaces:   'collecting the whole document before parsing it',
    watchOut:   'feed() never raises a ParseError — read_events() does',
  },

  parameters: [
    { name: 'events', type: 'sequence of str', required: false, default: 'None', desc: 'Events to queue: "start", "end", "start-ns", "end-ns", "comment", "pi". None means ("end",); an unknown name raises ValueError.' },
  ],

  modes: [
    {
      id: 'feed',
      label: 'feed in two parts',
      blurb: 'Feed two pieces of a document. Events become available as soon as expat has parsed them; close() ends the stream.',
      params: [
        { name: 'part1', type: 'str', hint: 'first chunk',  input: 'text' },
        { name: 'part2', type: 'str', hint: 'second chunk', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['start', 'end'])\nparser.feed({$part1})\nafter1 = [(event, elem.tag) for event, elem in parser.read_events()]\nparser.feed({$part2})\nafter2 = [(event, elem.tag) for event, elem in parser.read_events()]\nparser.close()\nrest = [(event, elem.tag) for event, elem in parser.read_events()]\n(after1, after2, rest)",
      cases: [
        { id: 'text',  label: 'split in text',   values: { part1: '<log><e>first</e><e>sec', part2: 'ond</e></log>' } },
        { id: 'tag',   label: 'split in a tag',  values: { part1: '<root><it', part2: 'em/></root>' } },
        { id: 'defer', label: 'deferred chunk',  values: { part1: '<roo', part2: 't/>' } },
        { id: 'bad',   label: 'mismatched tag',  values: { part1: '<list><a>', part2: '</b></list>' } },
        { id: 'short', label: 'unfinished',      values: { part1: '<list><a/>', part2: '<b/>' } },
      ],
    },
    {
      id: 'ns',
      label: 'namespace events',
      blurb: 'All six kinds of event for one document: start-ns gives (prefix, uri), end-ns gives None, comment and pi give the comment / PI element (shown by its text).',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['start-ns', 'start', 'end', 'end-ns', 'comment', 'pi'])\nparser.feed({$xml})\nparser.close()\n[(event, item.tag if event in ('start', 'end') else item.text if event in ('comment', 'pi') else item) for event, item in parser.read_events()]",
      cases: [
        { id: 'atom',    label: 'default namespace', values: { xml: '<feed xmlns="http://www.w3.org/2005/Atom"><title>Hi</title></feed>' } },
        { id: 'prefix',  label: 'prefixes',          values: { xml: '<r xmlns:a="urn:a"><a:x/><b xmlns:b="urn:b"/></r>' } },
        { id: 'comment', label: 'comment + pi',      values: { xml: '<!-- top --><r><?go now?></r>' } },
      ],
    },
    {
      id: 'flush',
      label: 'flush() (3.13)',
      blurb: 'Two feeds that leave expat waiting, then flush(): it parses whatever is buffered at once.',
      params: [
        { name: 'part1', type: 'str', hint: 'first chunk',  input: 'text' },
        { name: 'part2', type: 'str', hint: 'second chunk', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['start'])\nparser.feed({$part1})\nparser.feed({$part2})\nbefore = [elem.tag for event, elem in parser.read_events()]\nparser.flush()\nafter = [elem.tag for event, elem in parser.read_events()]\n(before, after)",
      cases: [
        { id: 'doc',   label: '<doc + >',   values: { part1: '<doc', part2: '>' } },
        { id: 'attr',  label: 'long attribute', values: { part1: '<item name="lamp', part2: '" sku="1">' } },
        { id: 'ready', label: 'nothing waiting', values: { part1: '<a>', part2: '<b>' } },
      ],
    },
  ],
  demoExplainer: 'After "<log><e>first</e><e>sec" the second e has started but not ended, so its end event comes with the next chunk. In "deferred chunk" nothing appears until close(): the first feed was an incomplete tag, so expat (2.6.0 and newer) parsed nothing; the second brought the buffer to only 7 bytes, less than twice the 4 it already had, so expat waited for more ("reparse deferral"). A broken document is reported by read_events(), not by feed(); an unfinished one by close() ("no element found"). flush() switches the deferral off for one parse of the buffered data.',

  patterns: [
    {
      name: 'Parse data as it arrives',
      desc: 'Feed each network chunk and handle complete elements right away.',
      code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['end'])\nfor chunk in receive_chunks():\n    parser.feed(chunk)\n    for event, elem in parser.read_events():\n        if elem.tag == 'message':\n            handle(elem)\nparser.close()",
    },
    {
      name: 'In asyncio',
      desc: 'The parser does no I/O, so it fits any event loop.',
      code: "import xml.etree.ElementTree as ET\n\nasync def read_xml(reader):\n    parser = ET.XMLPullParser(['end'])\n    while data := await reader.read(4096):\n        parser.feed(data)\n        for event, elem in parser.read_events():\n            yield elem\n    parser.close()",
    },
    {
      name: 'Do not wait for more data (3.13+)',
      desc: 'flush() exists only on newer releases (and some security backports) — check with hasattr.',
      code: "import xml.etree.ElementTree as ET\nparser.feed(chunk)\nif hasattr(parser, 'flush'):\n    parser.flush()\nevents = list(parser.read_events())",
    },
  ],

  examples: [
    { title: 'The example from the docs', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['start', 'end'])\nparser.feed('<mytag>sometext')\nfirst = [(event, elem.tag) for event, elem in parser.read_events()]\nparser.feed(' more text</mytag>')\nsecond = [(event, elem.tag, elem.text) for event, elem in parser.read_events()]\n(first, second)", returns: "([('start', 'mytag')], [('end', 'mytag', 'sometext more text')])" },
    { title: 'Default events: "end" only', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a><b/><c/></a>')\n[(event, elem.tag) for event, elem in parser.read_events()]", returns: "[('end', 'b'), ('end', 'c'), ('end', 'a')]" },
    { title: 'Handle records chunk by chunk', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['end'])\nfor chunk in ['<log><e>1</e>', '<e>2</e>', '</log>']:\n    parser.feed(chunk)\n    for event, elem in parser.read_events():\n        print(chunk, '->', elem.tag, elem.text)\nparser.close()", returns: '<log><e>1</e> -> e 1\n<e>2</e> -> e 2\n</log> -> log None' },
    { title: 'Errors are raised by read_events()', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a></b>')\nprint('feed() did not raise')\nlist(parser.read_events())", returns: 'feed() did not raise\nxml.etree.ElementTree.ParseError: mismatched tag: line 1, column 5' },
    { title: 'close() reports an unfinished document', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a>')\nparser.close()", returns: 'xml.etree.ElementTree.ParseError: no element found: line 1, column 3' },
    { title: 'Bytes are fine too', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['end'])\nparser.feed(b'<a>\\xc3\\xa9</a>')\nparser.close()\n[(event, elem.text) for event, elem in parser.read_events()]", returns: "[('end', 'é')]" },
    { title: 'Events are read only once', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['end'])\nparser.feed('<a/>')\nfirst = [elem.tag for event, elem in parser.read_events()]\n(first, list(parser.read_events()))", returns: "(['a'], [])" },
    { title: 'flush() parses a held-back chunk (3.13)', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser(['start'])\nparser.feed('<doc')\nparser.feed('>')\nbefore = list(parser.read_events())\nparser.flush()\nafter = [(event, elem.tag) for event, elem in parser.read_events()]\n(before, after)", returns: "([], [('start', 'doc')])" },
  ],

  pitfalls: [
    {
      name: 'Wrapping feed() in try/except',
      desc: 'feed() queues a ParseError behind the events before it; the exception surfaces when you iterate read_events().',
      wrong: { label: 'except around feed()', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\ntry:\n    parser.feed('<a></b>')\nexcept ET.ParseError:\n    print('caught')\n[elem.tag for event, elem in parser.read_events()]", output: 'xml.etree.ElementTree.ParseError: mismatched tag: line 1, column 5' },
      fix:   { label: 'except around read_events()', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a></b>')\ntry:\n    tags = [elem.tag for event, elem in parser.read_events()]\nexcept ET.ParseError as e:\n    print('caught:', e)", output: 'caught: mismatched tag: line 1, column 5' },
    },
    {
      name: 'Feeding after close()',
      desc: 'close() ends the stream for good; create a new parser for the next document.',
      wrong: { label: 'feed after close', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a/>')\nparser.close()\nparser.feed('<b/>')", output: 'ValueError: feed() called after end of stream' },
      fix:   { label: 'one parser per document', code: "import xml.etree.ElementTree as ET\ntags = []\nfor doc in ['<a/>', '<b/>']:\n    parser = ET.XMLPullParser()\n    parser.feed(doc)\n    parser.close()\n    tags += [elem.tag for event, elem in parser.read_events()]\ntags", output: "['a', 'b']" },
    },
    {
      name: 'Expecting close() to return the root',
      desc: 'Unlike XMLParser.close(), XMLPullParser.close() always returns None. Keep the element from the last "end" event (or the first "start").',
      wrong: { label: 'root = close()', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a><b/></a>')\nroot = parser.close()\nroot is None", output: 'True' },
      fix:   { label: 'last end event', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLPullParser()\nparser.feed('<a><b/></a>')\nparser.close()\nroot = None\nfor event, elem in parser.read_events():\n    root = elem\nroot.tag", output: "'a'" },
    },
  ],

  when: {
    use: [
      'XML that arrives in pieces: sockets, HTTP streaming, message queues',
      'asyncio and other event loops — the parser never blocks on I/O',
      'Showing progress or reacting to elements before the document is complete',
    ],
    avoid: [
      'Reading a file you can read yourself → iterparse() does the reading loop for you',
      'Small complete documents → fromstring()',
      'Custom callbacks per tag without building Elements → XMLParser with your own target',
    ],
  },

  notes: {
    cpython:     'XMLPullParser wraps XMLParser(target=TreeBuilder()) and registers its event queue with the C parser (_setevents). feed() catches the SyntaxError (ParseError) of XMLParser.feed and appends it to the queue; read_events() pops events and raises a queued exception when it reaches it',
    'Reparse deferral': 'Expat 2.6.0 and newer (check pyexpat.EXPAT_VERSION) may hold back a chunk: after a feed that parsed nothing because it ended inside a token, the next feeds are parsed only once the buffer has grown enough. flush() (3.13, also backported to some earlier releases as a security fix) parses at once; the docs warn that disabling deferral has security consequences (see xml.parsers.expat SetReparseDeferralEnabled)',
    'Start events': 'As with iterparse, a "start" event only guarantees the start tag: text, tail and children may still be missing. Use "end" events for complete elements',
    'Errors': 'flush() raises a ParseError directly (it is not queued); close() raises one for an unfinished document',
  },

  related: [
    { name: 'iterparse',    slug: 'iterparse',  when: 'The blocking version that reads a file for you' },
    { name: 'XMLParser',    slug: 'xmlparser',  when: 'The push parser with custom callbacks' },
    { name: 'TreeBuilder',  slug: 'treebuilder', when: 'What builds the Elements behind the events' },
    { name: 'ParseError',   slug: 'parseerror', when: 'What read_events() and close() raise' },
    { name: 'json module',  slug: 'json',       when: 'For JSON streams, json has raw_decode instead', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I parse XML incrementally from a socket in Python?',
      a: "Create parser = ET.XMLPullParser(['end']), call parser.feed(chunk) for each piece you receive, and after each feed loop over parser.read_events() to handle finished elements. Call parser.close() when the stream ends.",
    },
    {
      q: 'Why does read_events() return nothing after feed()?',
      a: 'Either the data does not complete an event yet (an "end" event needs the end tag), or expat 2.6+ deferred the chunk because the previous feed ended inside a token and too little data followed. More data, close(), or flush() (3.13) makes the events appear.',
    },
    {
      q: 'What is the difference between XMLPullParser and XMLParser?',
      a: 'XMLParser calls methods on a target object (push style) and close() returns the target\'s result — by default the root element. XMLPullParser builds Elements for you and queues (event, element) pairs that you pull with read_events(); its close() returns None.',
    },
    {
      q: 'Does feed() accept bytes?',
      a: 'Yes — str or bytes. Bytes are decoded by expat using the XML declaration\'s encoding (UTF-8 if there is none); a str is passed to expat as UTF-8.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.XMLPullParser',
    meta:  'xml.etree.ElementTree.XMLPullParser',
  },
};
