// content/reference/python/stdlib/xml-etree-elementtree/parse.js — parse, ElementTree.parse

export const meta = {
  slug:        'parse',
  name:        'xml.etree.ElementTree.parse',
  signature:   'xml.etree.ElementTree.parse(source, parser=None)',
  blurb:       'Read and parse an XML file — by name or as an open file object — into an ElementTree. ElementTree.parse() does the same into an existing tree and returns the root.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.parse ET.parse ElementTree.parse read xml file python parse xml file getroot file object stringio bytesio encoding declaration filenotfounderror parse xml from file',
};

export const method = {
  slug:      'parse',
  name:      'xml.etree.ElementTree.parse',
  signature: 'xml.etree.ElementTree.parse(source, parser=None)',
  returns:   { type: 'ElementTree', desc: 'The parsed document; getroot() gives the root Element. (ElementTree.parse returns the root Element itself.)' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'parse(source) opens source in binary mode if it is a file name (or reads the file object you pass), lets expat decode the bytes according to the XML declaration, and returns an ElementTree. tree.parse(source) on an existing ElementTree loads into it and returns the root.',

  covers: ['parse', 'ElementTree.parse'],

  cheat: {
    commonCall: "root = ET.parse('data.xml').getroot()",
    returns:    'an ElementTree — call getroot() for the root Element',
    replaces:   "open(...).read() followed by ET.fromstring()",
    watchOut:   'Give it a file name or file object — XML text belongs in fromstring()',
  },

  parameters: [
    { name: 'source', type: 'str | path | file object', required: true,  default: null,   desc: 'A file name (opened with "rb" and closed afterwards) or an object with read(), returning bytes or str.' },
    { name: 'parser', type: 'XMLParser',                required: false, default: 'None', desc: 'A custom parser (e.g. one that keeps comments). Default: a new XMLParser.' },
  ],

  modes: [
    {
      id: 'file',
      label: 'parse(filename)',
      blurb: 'Write your text to data.xml as UTF-8, then parse the file by name.',
      params: [{ name: 'xml', type: 'str', hint: 'file content', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nwith open('data.xml', 'w', encoding='utf-8') as f:\n    f.write({$xml})\nroot = ET.parse('data.xml').getroot()\n(root.tag, root.attrib)",
      cases: [
        { id: 'ok',      label: 'with declaration', values: { xml: '<?xml version="1.0" encoding="UTF-8"?><settings theme="dark"><font size="12"/></settings>' } },
        { id: 'bom',     label: 'leading BOM',      values: { xml: '\ufeff<settings/>' } },
        { id: 'late',    label: 'declaration late', values: { xml: ' <?xml version="1.0"?><settings/>' } },
        { id: 'broken',  label: 'malformed',        values: { xml: '<settings><font></settings>' } },
      ],
    },
    {
      id: 'stringio',
      label: 'file object',
      blurb: 'Any object with read() works; io.StringIO wraps a str.',
      params: [{ name: 'xml', type: 'str', hint: 'file content', input: 'text' }],
      template: 'import io\nimport xml.etree.ElementTree as ET\ntree = ET.parse(io.StringIO({$xml}))\nroot = tree.getroot()\n(root.tag, [c.tag for c in root])',
      cases: [
        { id: 'ok',    label: 'valid',          values: { xml: '<users><user/><user/></users>' } },
        { id: 'empty', label: 'empty file',     values: { xml: '' } },
        { id: 'junk',  label: 'text after root', values: { xml: '<users/>junk' } },
      ],
    },
    {
      id: 'method',
      label: 'tree.parse()',
      blurb: 'The method form loads into an existing ElementTree and returns the new root.',
      params: [{ name: 'xml', type: 'str', hint: 'file content', input: 'text' }],
      template: 'import io\nimport xml.etree.ElementTree as ET\ntree = ET.ElementTree()\nroot = tree.parse(io.StringIO({$xml}))\n(root is tree.getroot(), root.tag)',
      cases: [
        { id: 'ok',  label: 'valid',     values: { xml: '<catalog/>' } },
        { id: 'bad', label: 'malformed', values: { xml: '<catalog>' } },
      ],
    },
  ],
  demoExplainer: 'A leading byte order mark is fine: expat recognizes it before the declaration. An XML declaration anywhere but at the very first position is an error ("XML or text declaration not at start of entity"). An empty file fails with "no element found: line 1, column 0" — a common symptom of reading a file that was never written.',

  patterns: [
    {
      name: 'Parse a file',
      desc: 'Let parse() open the file in binary mode so expat honours the encoding declaration.',
      code: "import xml.etree.ElementTree as ET\ntree = ET.parse('catalog.xml')\nroot = tree.getroot()\nfor book in root.iter('book'):\n    print(book.get('id'), book.findtext('title'))",
    },
    {
      name: 'Parse an open binary file',
      desc: 'For files from archives, sockets or HTTP responses.',
      code: "import zipfile\nimport xml.etree.ElementTree as ET\nwith zipfile.ZipFile('book.epub') as z, z.open('META-INF/container.xml') as f:\n    root = ET.parse(f).getroot()",
    },
    {
      name: 'Handle missing and broken files',
      desc: 'Two different errors.',
      code: "import xml.etree.ElementTree as ET\ntry:\n    tree = ET.parse(path)\nexcept FileNotFoundError:\n    tree = None\nexcept ET.ParseError as e:\n    raise SystemExit(f'{path}: {e}')",
    },
  ],

  examples: [
    { title: 'Parse a file by name', code: "import xml.etree.ElementTree as ET\nwith open('d.xml', 'w', encoding='utf-8') as f:\n    f.write('<a><b>x</b></a>')\nET.parse('d.xml').getroot().find('b').text", returns: "'x'" },
    { title: 'The declared encoding is used', code: "import xml.etree.ElementTree as ET\nwith open('latin.xml', 'wb') as f:\n    f.write('<?xml version=\"1.0\" encoding=\"latin-1\"?><name>José</name>'.encode('latin-1'))\nET.parse('latin.xml').getroot().text", returns: "'José'" },
    { title: 'A binary file object', code: "import io\nimport xml.etree.ElementTree as ET\nET.parse(io.BytesIO(b'<a x=\"1\"/>')).getroot().attrib", returns: "{'x': '1'}" },
    { title: 'ElementTree.parse returns the root', code: "import io\nimport xml.etree.ElementTree as ET\ntree = ET.ElementTree()\nroot = tree.parse(io.StringIO('<a><b/></a>'))\n(root is tree.getroot(), root.tag)", returns: "(True, 'a')" },
    { title: 'Missing file', code: "import xml.etree.ElementTree as ET\nET.parse('missing.xml')", returns: "FileNotFoundError: [Errno 2] No such file or directory: 'missing.xml'" },
    { title: 'Empty file', code: "import xml.etree.ElementTree as ET\nopen('empty.xml', 'w').close()\nET.parse('empty.xml')", returns: 'xml.etree.ElementTree.ParseError: no element found: line 1, column 0' },
  ],

  pitfalls: [
    {
      name: 'A text-mode file with the wrong encoding',
      desc: 'Opening the file yourself in text mode decodes it before expat sees the declaration. Pass the file name (or open with "rb").',
      wrong: { label: "open(..., encoding='utf-8')", code: "import xml.etree.ElementTree as ET\nwith open('latin.xml', 'wb') as f:\n    f.write('<?xml version=\"1.0\" encoding=\"latin-1\"?><name>José</name>'.encode('latin-1'))\nwith open('latin.xml', encoding='utf-8') as f:\n    root = ET.parse(f).getroot()", output: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 49: invalid continuation byte" },
      fix:   { label: "ET.parse('latin.xml')", code: "import xml.etree.ElementTree as ET\nwith open('latin.xml', 'wb') as f:\n    f.write('<?xml version=\"1.0\" encoding=\"latin-1\"?><name>José</name>'.encode('latin-1'))\nET.parse('latin.xml').getroot().text", output: "'José'" },
    },
    {
      name: 'A str in StringIO with a non-UTF-8 declaration',
      desc: 'The default parser re-encodes the text it reads to UTF-8 and lets expat follow the declaration — decoding it a second time. For text you already hold, use fromstring(), which ignores the declared encoding.',
      wrong: { label: 'parse(StringIO)', code: "import io\nimport xml.etree.ElementTree as ET\nET.parse(io.StringIO('<?xml version=\"1.0\" encoding=\"latin-1\"?><a>é</a>')).getroot().text", output: "'Ã©'" },
      fix:   { label: 'fromstring(text)', code: "import xml.etree.ElementTree as ET\nET.fromstring('<?xml version=\"1.0\" encoding=\"latin-1\"?><a>é</a>').text", output: "'é'" },
    },
  ],

  when: {
    use: [
      'XML files on disk — pass the path',
      'Binary streams: zip members, HTTP responses, sockets',
    ],
    avoid: [
      'XML text already in a variable → fromstring()',
      'Files too big for memory → iterparse()',
      'Untrusted files on a server — the docs point to "XML vulnerabilities" and defusedxml',
    ],
  },

  notes: {
    cpython:     'parse() creates ElementTree() and calls its parse(); with the default parser the C XMLParser._parse_whole() reads 64 KiB at a time (str chunks are encoded to UTF-8 bytes) and returns the root',
    'File names': 'A path is opened with open(source, "rb") and closed afterwards; a file object is left open',
    'Errors':    'OSError subclasses (FileNotFoundError, PermissionError) for the file, ParseError for its content',
  },

  related: [
    { name: 'fromstring',        slug: 'fromstring',        when: 'Parse text you already have' },
    { name: 'iterparse',         slug: 'iterparse',         when: 'Parse incrementally with events' },
    { name: 'ElementTree',       slug: 'elementtree',       when: 'What parse() returns' },
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'Save the tree again' },
    { name: 'ParseError',        slug: 'parseerror',        when: 'Malformed content' },
    { name: 'open()',            slug: 'open',              when: 'Opening files yourself', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I read an XML file in Python?',
      a: "tree = ET.parse('file.xml') and root = tree.getroot(). Then iterate root, or use root.find(), root.findall() and root.iter() to get at the data.",
    },
    {
      q: 'Why does ET.parse("<root>…</root>") fail?',
      a: 'parse() expects a file name or file object, so it tries to open a file with that name: on Linux and macOS that is FileNotFoundError, on Windows the < and > in the name give OSError: [Errno 22] Invalid argument. Use ET.fromstring() for XML text.',
    },
    {
      q: 'Should I open the XML file myself before parse()?',
      a: 'Usually not. Passing the path lets parse() open it in binary mode, so expat reads the encoding declaration. If you do open it, use "rb" — a text-mode file is decoded with your encoding first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.parse',
    meta:  'xml.etree.ElementTree.parse',
  },
};
