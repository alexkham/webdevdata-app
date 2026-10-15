// content/reference/python/stdlib/xml-etree-elementtree/iterparse.js — iterparse

export const meta = {
  slug:        'iterparse',
  name:        'xml.etree.ElementTree.iterparse',
  signature:   'xml.etree.ElementTree.iterparse(source, events=None, parser=None)',
  blurb:       'Parse a file step by step and get (event, element) pairs while the tree is being built — the standard way to process XML files too large to hold in memory.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+ (comment / pi events 3.8, close() 3.13)',
  searchTerms: 'xml.etree.ElementTree.iterparse ET.iterparse iterparse python parse large xml file memory streaming xml incremental parsing events start end start-ns end-ns comment pi elem.clear() root attribute huge xml file',
};

export const method = {
  slug:      'iterparse',
  name:      'xml.etree.ElementTree.iterparse',
  signature: 'xml.etree.ElementTree.iterparse(source, events=None, parser=None)',
  returns:   { type: 'iterator of (event, value)', desc: 'An iterator of (event, value) pairs. Its root attribute is None until the iterator is exhausted, then the root element.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+ (comment / pi events 3.8, close() 3.13)',
  hasLiveDemo: true,

  subtitle: 'iterparse() reads a file in 16 KiB pieces, feeds them to an XMLPullParser and hands you its events as you loop. The tree is built as usual — so to keep memory flat, process each element on its "end" event and then clear or remove it.',

  covers: ['iterparse'],

  cheat: {
    commonCall: "for event, elem in ET.iterparse('big.xml'):",
    returns:    "(event, element) pairs — only 'end' events unless you ask for more",
    replaces:   'ET.parse() on files too big for memory',
    watchOut:   'Without clear() / remove() the whole tree still piles up in memory',
  },

  parameters: [
    { name: 'source', type: 'str | file object', required: true,  default: null,   desc: 'A file name (opened in binary mode and closed for you) or an object with a read() method, such as an open file or io.StringIO. Not the XML text itself.' },
    { name: 'events', type: 'sequence of str',   required: false, default: 'None', desc: 'Which events to report: "start", "end", "start-ns", "end-ns", "comment", "pi". None means ("end",). Any other name raises ValueError: unknown event.' },
    { name: 'parser', type: 'XMLParser',         required: false, default: 'None', desc: 'Deprecated since 3.4. Must be an XMLParser whose target is the default TreeBuilder.' },
  ],

  modes: [
    {
      id: 'events',
      label: 'events',
      blurb: 'Iterate over your XML with the events you list (comma-separated). Elements are shown by tag, comments and PIs by their text, start-ns by its (prefix, uri) tuple.',
      params: [
        { name: 'xml',    type: 'str',       hint: 'an XML document',    input: 'text' },
        { name: 'events', type: 'list[str]', hint: 'comma-separated',    input: 'csv' },
      ],
      template: "import io\nimport xml.etree.ElementTree as ET\nout = []\nfor event, item in ET.iterparse(io.StringIO({$xml}), events={$events}):\n    if event in ('start', 'end'):\n        out.append((event, item.tag))\n    elif event in ('comment', 'pi'):\n        out.append((event, item.text))\n    else:\n        out.append((event, item))\nout",
      cases: [
        { id: 'end',     label: 'end only',      values: { xml: '<shop><item>Pen</item><item>Ink</item></shop>', events: 'end' } },
        { id: 'both',    label: 'start + end',   values: { xml: '<shop><item>Pen</item><item>Ink</item></shop>', events: 'start, end' } },
        { id: 'ns',      label: 'namespaces',    values: { xml: '<feed xmlns="urn:feed" xmlns:m="urn:media"><m:img/></feed>', events: 'start-ns, start, end-ns' } },
        { id: 'comment', label: 'comment + pi',  values: { xml: '<doc><!-- draft --><?render fast?><p/></doc>', events: 'comment, pi, end' } },
        { id: 'bad',     label: 'broken XML',    values: { xml: '<shop><item>Pen</shop>', events: 'end' } },
        { id: 'unknown', label: 'unknown event', values: { xml: '<a/>', events: 'start, open' } },
      ],
    },
    {
      id: 'clear',
      label: 'process + clear',
      blurb: 'The streaming pattern: on each "end" of the tag you name, read what you need and clear() the element. The root at the end shows what is left in memory.',
      params: [
        { name: 'xml', type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'tag', type: 'str', hint: 'tag to process',  input: 'text' },
      ],
      template: "import io\nimport xml.etree.ElementTree as ET\nit = ET.iterparse(io.StringIO({$xml}))\nnames = []\nfor event, elem in it:\n    if elem.tag == {$tag}:\n        names.append(elem.get('name'))\n        elem.clear()\n(names, ET.tostring(it.root, encoding='unicode'))",
      cases: [
        { id: 'users',  label: 'users',          values: { xml: '<users><user name="ada"><email>a@x.org</email></user><user name="bob"/></users>', tag: 'user' } },
        { id: 'nested', label: 'nested records', values: { xml: '<db><t name="a"><r name="1"/><r name="2"/></t><t name="b"/></db>', tag: 'r' } },
        { id: 'none',   label: 'no match',       values: { xml: '<users><user name="ada"/></users>', tag: 'person' } },
      ],
    },
  ],
  demoExplainer: 'Each "end" event arrives after the element\'s children, so the root comes last. With xmlns="urn:feed" every unprefixed tag is in that namespace, and the start-ns event for the default namespace carries the prefix \'\'. A ParseError is raised by the loop itself, after the events before the error were handed out. In "process + clear" the cleared elements stay in the tree as empty <user /> shells — clear() empties an element, it does not detach it.',

  patterns: [
    {
      name: 'Stream a big file',
      desc: 'Handle each record when it is complete, then free it.',
      code: "import xml.etree.ElementTree as ET\nfor event, elem in ET.iterparse('orders.xml'):\n    if elem.tag == 'order':\n        handle(elem.get('id'), elem.findtext('total'))\n        elem.clear()",
    },
    {
      name: 'Keep memory flat',
      desc: 'Grab the root from the first start event and remove finished records from it.',
      code: "import xml.etree.ElementTree as ET\nit = ET.iterparse('orders.xml', events=('start', 'end'))\nevent, root = next(it)\nfor event, elem in it:\n    if event == 'end' and elem.tag == 'order':\n        handle(elem)\n        root.remove(elem)",
    },
    {
      name: 'Collect the namespace prefixes of a document',
      desc: 'start-ns events give each (prefix, uri) declaration in document order.',
      code: "import xml.etree.ElementTree as ET\nprefixes = dict(item for event, item in ET.iterparse('doc.xml', events=('start-ns',)))",
    },
  ],

  examples: [
    { title: 'Default: "end" events only', code: "import io\nimport xml.etree.ElementTree as ET\n[(event, elem.tag) for event, elem in ET.iterparse(io.StringIO('<a><b/><c/></a>'))]", returns: "[('end', 'b'), ('end', 'c'), ('end', 'a')]" },
    { title: 'start and end events', code: "import io\nimport xml.etree.ElementTree as ET\n[(event, elem.tag) for event, elem in ET.iterparse(io.StringIO('<a><b/></a>'), events=('start', 'end'))]", returns: "[('start', 'a'), ('start', 'b'), ('end', 'b'), ('end', 'a')]" },
    { title: 'root is set once the loop has finished', code: "import io\nimport xml.etree.ElementTree as ET\nit = ET.iterparse(io.StringIO('<a><b/></a>'))\nbefore = it.root\nfor event, elem in it:\n    pass\n(before, it.root.tag)", returns: "(None, 'a')" },
    { title: 'Namespace events carry (prefix, uri) and None', code: "import io\nimport xml.etree.ElementTree as ET\nlist(ET.iterparse(io.StringIO('<a xmlns:p=\"urn:p\"><p:b/></a>'), events=('start-ns', 'end-ns')))", returns: "[('start-ns', ('p', 'urn:p')), ('end-ns', None)]" },
    { title: 'A file name works too', code: "import xml.etree.ElementTree as ET\nwith open('feed.xml', 'w', encoding='utf-8') as f:\n    f.write('<feed><entry id=\"1\"/><entry id=\"2\"/></feed>')\n[elem.get('id') for event, elem in ET.iterparse('feed.xml') if elem.tag == 'entry']", returns: "['1', '2']" },
    { title: 'Comment and PI events (3.8+)', code: "import io\nimport xml.etree.ElementTree as ET\n[(event, elem.text) for event, elem in ET.iterparse(io.StringIO('<a><!-- note --><?php echo 1?></a>'), events=('comment', 'pi'))]", returns: "[('comment', ' note '), ('pi', 'php echo 1')]" },
    { title: 'Events before an error are delivered first', code: "import io\nimport xml.etree.ElementTree as ET\nseen = []\ntry:\n    for event, elem in ET.iterparse(io.StringIO('<a><b/><c></a>')):\n        seen.append(elem.tag)\nexcept ET.ParseError as e:\n    print(seen, e)", returns: "['b'] mismatched tag: line 1, column 12" },
    { title: 'Unknown event names fail at once', code: "import io\nimport xml.etree.ElementTree as ET\nET.iterparse(io.StringIO('<a/>'), events=('start', 'finish'))", returns: "ValueError: unknown event 'finish'" },
  ],

  pitfalls: [
    {
      name: 'Expecting clear() to remove elements',
      desc: 'clear() empties an element (children, attributes, text, tail) but leaves it in its parent. On a long file the root still collects one empty element per record.',
      wrong: { label: 'clear() only', code: "import io\nimport xml.etree.ElementTree as ET\nit = ET.iterparse(io.StringIO('<log>' + '<e>x</e>' * 3 + '</log>'))\nfor event, elem in it:\n    if elem.tag == 'e':\n        elem.clear()\nET.tostring(it.root, encoding='unicode')", output: "'<log><e /><e /><e /></log>'" },
      fix:   { label: 'remove from the root', code: "import io\nimport xml.etree.ElementTree as ET\nit = ET.iterparse(io.StringIO('<log>' + '<e>x</e>' * 3 + '</log>'), events=('start', 'end'))\nevent, root = next(it)\nfor event, elem in it:\n    if event == 'end' and elem.tag == 'e':\n        root.remove(elem)\nET.tostring(root, encoding='unicode')", output: "'<log />'" },
    },
    {
      name: 'Reading it.root inside the loop',
      desc: 'iterparse() sets root only after the last event. Take the root from the first "start" event instead.',
      wrong: { label: 'it.root too early', code: "import io\nimport xml.etree.ElementTree as ET\nit = ET.iterparse(io.StringIO('<a><b/></a>'))\nfor event, elem in it:\n    print(elem.tag, it.root)", output: 'b None\na None' },
      fix:   { label: 'first start event', code: "import io\nimport xml.etree.ElementTree as ET\nit = ET.iterparse(io.StringIO('<a><b/></a>'), events=('start', 'end'))\nevent, root = next(it)\nfor event, elem in it:\n    print(event, elem.tag, root.tag)", output: 'start b a\nend b a\nend a a' },
    },
    {
      name: 'Asking for "start-ns" values as elements',
      desc: 'start-ns gives a (prefix, uri) tuple and end-ns gives None, not an Element — check the event name before touching .tag.',
      wrong: { label: 'elem.tag for every event', code: "import io\nimport xml.etree.ElementTree as ET\n[elem.tag for event, elem in ET.iterparse(io.StringIO('<a xmlns=\"urn:x\"/>'), events=('start-ns', 'end'))]", output: "AttributeError: 'tuple' object has no attribute 'tag'" },
      fix:   { label: 'branch on the event', code: "import io\nimport xml.etree.ElementTree as ET\n[elem.tag if event == 'end' else elem for event, elem in ET.iterparse(io.StringIO('<a xmlns=\"urn:x\"/>'), events=('start-ns', 'end'))]", output: "[('', 'urn:x'), '{urn:x}a']" },
    },
  ],

  when: {
    use: [
      'Files too large for ET.parse(): logs, exports, sitemaps, Wikipedia-style dumps',
      'Pulling a few records out of a big document and stopping early',
      'Collecting namespace declarations (start-ns) while parsing',
    ],
    avoid: [
      'Data that arrives from a socket or callback, where blocking reads are impossible → XMLPullParser',
      'Small documents → ET.parse() or ET.fromstring() are simpler',
      'XML text already in a str → wrap it in io.StringIO, or use fromstring()',
    ],
  },

  notes: {
    cpython:  'iterparse() creates an XMLPullParser, opens a file name with open(source, "rb") (closing it at the end or on it.close()), and loops: yield the queued events, read 16 * 1024 more, feed them. At end of input it closes the parser, yields the last events and sets it.root',
    'Events': 'On a "start" event only the start tag is guaranteed to be parsed: the docs say text, tail and children are undefined at that point (with small inputs they are often already there, because a whole 16 KiB chunk was parsed first — do not rely on it). Use "end" events for complete elements',
    'Errors': 'A ParseError from a chunk is queued after the events that came before it, so the loop sees those events first, then the exception. A file name that does not exist raises FileNotFoundError at the iterparse() call',
    'Version': 'The comment and pi events are 3.8+, close() on the iterator is 3.13; the parser argument is deprecated since 3.4',
  },

  related: [
    { name: 'XMLPullParser', slug: 'xmlpullparser', when: 'The non-blocking engine behind iterparse' },
    { name: 'parse',         slug: 'parse',         when: 'Whole file into a tree in one call' },
    { name: 'Element.clear', slug: 'element-append', when: 'clear() and remove() to free memory' },
    { name: 'ParseError',    slug: 'parseerror',    when: 'What broken input raises during the loop' },
    { name: 'open()',        slug: 'open',          when: 'Open the file yourself and pass the file object', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I parse a very large XML file in Python?',
      a: 'Loop over ET.iterparse(path) and handle each record on its "end" event, then free it: elem.clear(), or better remove it from its parent (take the root from the first "start" event). Memory then stays proportional to one record instead of the whole file.',
    },
    {
      q: 'Why is elem.text None (or incomplete) on a "start" event?',
      a: 'A start event only guarantees that the start tag has been read — attributes are complete, but text, tail and children may not be parsed yet. Read them on the matching "end" event.',
    },
    {
      q: 'Can I pass an XML string to iterparse?',
      a: 'No — source is a file name or a file object. A str is treated as a file name. Wrap text in io.StringIO(text) (or io.BytesIO for bytes), or call ET.fromstring() if you do not need events.',
    },
    {
      q: 'What is the difference between iterparse and XMLPullParser?',
      a: 'iterparse reads the source itself (blocking reads) and yields events as you loop. XMLPullParser never reads anything: you feed() it data whenever it arrives and call read_events() — suitable for sockets and async code.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.iterparse',
    meta:  'xml.etree.ElementTree.iterparse',
  },
};
