// content/reference/python/stdlib/xml-etree-elementtree/register_namespace.js — register_namespace

export const meta = {
  slug:        'register_namespace',
  name:        'xml.etree.ElementTree.register_namespace',
  signature:   'xml.etree.ElementTree.register_namespace(prefix, uri)',
  blurb:       'Tell the serializer which prefix to use for a namespace URI — atom:feed instead of ns0:feed. The registry is global: it affects every later tostring() and write() in the process.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'xml.etree.ElementTree.register_namespace ET.register_namespace register namespace prefix python elementtree ns0 prefix remove ns0 change namespace prefix xmlns output default namespace global registry _namespace_map Prefix format reserved for internal use',
};

export const method = {
  slug:      'register_namespace',
  name:      'xml.etree.ElementTree.register_namespace',
  signature: 'xml.etree.ElementTree.register_namespace(prefix, uri)',
  returns:   { type: 'None', desc: 'Changes the module-wide prefix registry.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'When ElementTree writes a {uri}local name it looks the URI up in a module-level registry; a URI it does not know gets an invented prefix ns0, ns1 ... register_namespace() adds or replaces an entry so your documents keep their usual prefixes. Any existing mapping for the same prefix or the same URI is removed first.',

  covers: ['register_namespace'],

  cheat: {
    commonCall: "ET.register_namespace('atom', 'http://www.w3.org/2005/Atom')",
    returns:    'None — later serializations use atom: for that URI',
    replaces:   'post-processing ns0: prefixes out of the output',
    watchOut:   'Process-wide and permanent: it changes output for all code in the program',
  },

  parameters: [
    { name: 'prefix', type: 'str', required: true, default: null, desc: 'The prefix to write. "ns" followed by digits raises ValueError (reserved for generated prefixes); nothing else is validated.' },
    { name: 'uri',    type: 'str', required: true, default: null, desc: 'The namespace URI the prefix stands for.' },
  ],

  modes: [
    {
      id: 'register',
      label: 'before / after',
      blurb: 'Serialize a two-element document in your namespace before and after registering a prefix for it. The demo restores the global registry afterwards.',
      params: [
        { name: 'prefix', type: 'str', hint: 'prefix to register', input: 'text' },
        { name: 'uri',    type: 'str', hint: 'namespace URI',      input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nuri = {$uri}\nroot = ET.Element(ET.QName(uri, 'feed'))\nET.SubElement(root, ET.QName(uri, 'entry'))\nbefore = ET.tostring(root, encoding='unicode')\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace({$prefix}, uri)\n    after = ET.tostring(root, encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\n(before, after)",
      cases: [
        { id: 'atom',     label: 'Atom',            values: { prefix: 'atom', uri: 'http://www.w3.org/2005/Atom' } },
        { id: 'known',    label: 'well-known URI',  values: { prefix: 'h', uri: 'http://www.w3.org/1999/xhtml' } },
        { id: 'reserved', label: 'reserved prefix', values: { prefix: 'ns1', uri: 'urn:shop' } },
        { id: 'default',  label: 'empty prefix',    values: { prefix: '', uri: 'urn:shop' } },
      ],
    },
  ],
  demoExplainer: 'Before registering, the Atom URI is unknown and gets ns0. The XHTML URI is already registered as html, so "h" replaces that entry. "ns" plus digits is refused with ValueError: Prefix format reserved for internal use. An empty prefix makes the URI the default namespace (xmlns="urn:shop") — see the pitfalls for why that is risky. The demo saves and restores ET._namespace_map, the module dict that register_namespace() changes, because the change would otherwise last for the rest of the program.',

  patterns: [
    {
      name: 'Register once at start-up',
      desc: 'Do it at import time of your module, for the namespaces your documents use.',
      code: "import xml.etree.ElementTree as ET\nNAMESPACES = {\n    'atom': 'http://www.w3.org/2005/Atom',\n    'media': 'http://search.yahoo.com/mrss/',\n}\nfor prefix, uri in NAMESPACES.items():\n    ET.register_namespace(prefix, uri)",
    },
    {
      name: 'Keep the prefixes of a document you edit',
      desc: 'Register what the input declares (start-ns events) before writing it back.',
      code: "import xml.etree.ElementTree as ET\nfor event, (prefix, uri) in ET.iterparse('in.xml', events=('start-ns',)):\n    ET.register_namespace(prefix, uri)\ntree = ET.parse('in.xml')\ntree.write('out.xml', encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'One default namespace without global state',
      desc: 'default_namespace= affects only this call (every name must then be qualified).',
      code: "import xml.etree.ElementTree as ET\nET.tostring(root, encoding='unicode', default_namespace='http://www.w3.org/2005/Atom')",
    },
  ],

  examples: [
    { title: 'Unknown namespaces get ns0, ns1 ...', code: "import xml.etree.ElementTree as ET\nfeed = ET.Element('{http://www.w3.org/2005/Atom}feed')\nET.tostring(feed, encoding='unicode')", returns: "'<ns0:feed xmlns:ns0=\"http://www.w3.org/2005/Atom\" />'" },
    { title: 'Registering a prefix (and restoring the registry)', code: "import xml.etree.ElementTree as ET\nATOM = 'http://www.w3.org/2005/Atom'\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('atom', ATOM)\n    feed = ET.Element(ET.QName(ATOM, 'feed'))\n    ET.SubElement(feed, ET.QName(ATOM, 'entry'))\n    out = ET.tostring(feed, encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\nout", returns: "'<atom:feed xmlns:atom=\"http://www.w3.org/2005/Atom\"><atom:entry /></atom:feed>'" },
    { title: 'ns + digits is reserved', code: "import xml.etree.ElementTree as ET\nET.register_namespace('ns1', 'urn:x')", returns: 'ValueError: Prefix format reserved for internal use' },
    { title: 'Re-registering a well-known URI', code: "import xml.etree.ElementTree as ET\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('x', 'http://www.w3.org/1999/xhtml')\n    out = ET.tostring(ET.Element('{http://www.w3.org/1999/xhtml}p'), encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\n(out, ET._namespace_map['http://www.w3.org/1999/xhtml'])", returns: "('<x:p xmlns:x=\"http://www.w3.org/1999/xhtml\" />', 'html')" },
    { title: 'Taking a prefix away from another URI', code: "import xml.etree.ElementTree as ET\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('xs', 'urn:mine')\n    out = (ET._namespace_map.get('http://www.w3.org/2001/XMLSchema'), ET._namespace_map['urn:mine'])\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\nout", returns: "(None, 'xs')" },
    { title: 'The per-call alternative: default_namespace', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('{urn:x}a'), encoding='unicode', default_namespace='urn:x')", returns: "'<a xmlns=\"urn:x\" />'" },
  ],

  pitfalls: [
    {
      name: 'Registering "" as a default namespace',
      desc: 'With an empty prefix the URI becomes xmlns="...". Children without a namespace are then written unprefixed inside it — and read back in the wrong namespace. default_namespace= in tostring() would raise an error instead.',
      wrong: { label: "register_namespace('', uri)", code: "import xml.etree.ElementTree as ET\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('', 'urn:x')\n    root = ET.Element('{urn:x}a')\n    ET.SubElement(root, 'plain')\n    out = ET.tostring(root, encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\n(out, ET.fromstring(out)[0].tag)", output: "('<a xmlns=\"urn:x\"><plain /></a>', '{urn:x}plain')" },
      fix:   { label: 'a real prefix', code: "import xml.etree.ElementTree as ET\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('x', 'urn:x')\n    root = ET.Element('{urn:x}a')\n    ET.SubElement(root, 'plain')\n    out = ET.tostring(root, encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\n(out, ET.fromstring(out)[0].tag)", output: "('<x:a xmlns:x=\"urn:x\"><plain /></x:a>', 'plain')" },
    },
    {
      name: 'An invalid prefix',
      desc: 'Only the reserved ns + digits form is checked. A prefix with a space is accepted and produces XML that cannot be parsed.',
      wrong: { label: "prefix 'a b'", code: "import xml.etree.ElementTree as ET\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('a b', 'urn:x')\n    out = ET.tostring(ET.Element('{urn:x}r'), encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\nout", output: "'<a b:r xmlns:a b=\"urn:x\" />'" },
      fix:   { label: "prefix 'ab'", code: "import xml.etree.ElementTree as ET\nsaved = dict(ET._namespace_map)\ntry:\n    ET.register_namespace('ab', 'urn:x')\n    out = ET.tostring(ET.Element('{urn:x}r'), encoding='unicode')\nfinally:\n    ET._namespace_map.clear()\n    ET._namespace_map.update(saved)\nout", output: "'<ab:r xmlns:ab=\"urn:x\" />'" },
    },
  ],

  when: {
    use: [
      'Writing well-known vocabularies (Atom, SVG, KML, Office formats) with their customary prefixes',
      'Editing a namespaced document and writing it back with readable prefixes',
      'Application start-up code that owns all XML output of the process',
    ],
    avoid: [
      'Library code — the change leaks into every other user of ElementTree in the program',
      'A single default namespace for one document → tostring(..., default_namespace=uri)',
      'Choosing prefixes while parsing — prefixes are discarded on input; tags are {uri}local',
    ],
  },

  notes: {
    cpython:     'register_namespace(prefix, uri) raises ValueError if re.match(r"ns\\d+$", prefix); otherwise it deletes every entry of the module dict _namespace_map whose URI or prefix matches, then sets _namespace_map[uri] = prefix',
    'Defaults':  'Before any registration the registry holds 7 URIs: xml, html (XHTML), rdf, wsdl, xs (XML Schema), xsi (XML Schema instance) and dc (Dublin Core elements)',
    'Scope':     'The registry is global (the docs say so). It is read when ElementTree has to pick a prefix for a namespace URI on output — tostring(), tostringlist(), ElementTree.write(), dump(); parsing never uses it',
  },

  related: [
    { name: 'tostring',  slug: 'tostring',  when: 'default_namespace and the generated ns0 prefixes' },
    { name: 'QName',     slug: 'qname',     when: 'Namespaced names as attribute values' },
    { name: 'iterparse', slug: 'iterparse', when: 'start-ns events tell you the prefixes a document used' },
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'Writing files with the registered prefixes' },
  ],

  faq: [
    {
      q: 'How do I get rid of ns0: prefixes in ElementTree output?',
      a: "Register the prefix you want before serializing: ET.register_namespace('atom', 'http://www.w3.org/2005/Atom'). For a single default namespace you can instead pass default_namespace=uri to tostring() or write(), as long as every element is in that namespace.",
    },
    {
      q: 'Is register_namespace global?',
      a: 'Yes. It changes a module-level dict, so it affects every later serialization in the process, in any module. That is fine in an application; libraries should prefer default_namespace= or leave the choice to the caller.',
    },
    {
      q: 'Why does register_namespace raise "Prefix format reserved for internal use"?',
      a: 'Prefixes made of "ns" and digits (ns0, ns1, ...) are the ones ElementTree generates itself, so registering them is refused. Pick another name.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.register_namespace',
    meta:  'xml.etree.ElementTree.register_namespace',
  },
};
