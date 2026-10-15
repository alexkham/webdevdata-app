// content/reference/python/stdlib/xml-etree-elementtree/element-tag.js — Element.tag, Element.text, Element.tail

export const meta = {
  slug:        'element-tag',
  name:        'Element.tag',
  signature:   'Element.tag / Element.text / Element.tail',
  blurb:       'The three data attributes of an element: its name (tag), the text before its first child (text) and the text after its end tag (tail).',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'Element.tag Element.text Element.tail elementtree text tail python xml element text value tail text mixed content rename tag change element name namespace tag {uri} get text of element none',
};

export const method = {
  slug:      'element-tag',
  name:      'Element.tag',
  signature: 'Element.tag / Element.text / Element.tail',
  returns:   { type: 'str (tag); str | None (text, tail)', desc: 'Plain read/write attributes. Parsed documents give str values or None.' },

  category:    'xml.etree.ElementTree attribute',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'ElementTree stores text in two places. elem.text is what comes right after the start tag (up to the first child); elem.tail is what comes after the element\'s end tag, before the next sibling. A missing piece is None, not an empty string.',

  covers: ['Element.tag', 'Element.text', 'Element.tail'],

  cheat: {
    commonCall: "title = elem.find('title').text",
    returns:    "'Dune' — or None when there is no text",
    replaces:   'DOM text nodes (there are none here)',
    watchOut:   'text can be None; tostring(elem) also writes elem.tail',
  },

  parameters: [
    { name: 'tag',  type: 'str',        required: true,  default: null,   desc: 'The element name; {uri}local for namespaced elements. Assign to rename. Comments and PIs have the Comment / PI factory function as tag.' },
    { name: 'text', type: 'str | None', required: false, default: 'None', desc: 'Text between the start tag and the first child (or the end tag).' },
    { name: 'tail', type: 'str | None', required: false, default: 'None', desc: 'Text between this element\'s end tag and the next tag. It belongs to this element, not to the parent.' },
  ],

  modes: [
    {
      id: 'parts',
      label: 'text vs tail',
      blurb: 'Every element with its tag, text and tail — the example from the Python docs to start with.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\n[(e.tag, e.text, e.tail) for e in ET.fromstring({$xml}).iter()]',
      cases: [
        { id: 'docs',  label: 'docs example', values: { xml: '<a><b>1<c>2<d/>3</c></b>4</a>' } },
        { id: 'para',  label: 'paragraph',    values: { xml: '<p>Some <b>bold</b> and <i>italic</i> text.</p>' } },
        { id: 'empty', label: 'empty vs space', values: { xml: '<r><x/><y></y><z> </z></r>' } },
        { id: 'ns',    label: 'namespace',    values: { xml: '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>' } },
      ],
    },
    {
      id: 'build',
      label: 'set text/tail',
      blurb: 'Build <p><b/></p> and fill p.text, b.text and b.tail — then see where each lands.',
      params: [
        { name: 'text',  type: 'str', hint: 'p.text', input: 'text' },
        { name: 'inner', type: 'str', hint: 'b.text', input: 'text' },
        { name: 'tail',  type: 'str', hint: 'b.tail', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.Element('p')\nb = ET.SubElement(root, 'b')\nroot.text = {$text}\nb.text = {$inner}\nb.tail = {$tail}\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'basic',  label: 'sentence',   values: { text: 'Hello ', inner: 'big', tail: ' world' } },
        { id: 'escape', label: 'escaping',   values: { text: 'a < b ', inner: 'Tom & Jerry', tail: ' "quoted" >' } },
        { id: 'empty',  label: 'empty text', values: { text: '', inner: '', tail: '' } },
      ],
    },
    {
      id: 'rename',
      label: 'rename tags',
      blurb: 'Assign to e.tag for every element with the old tag.',
      params: [
        { name: 'xml', type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'old', type: 'str', hint: 'tag to find',     input: 'text' },
        { name: 'new', type: 'str', hint: 'new tag',         input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nfor e in root.iter({$old}):\n    e.tag = {$new}\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'li',  label: 'li → item',     values: { xml: '<ul><li>a</li><li>b</li></ul>', old: 'li', new: 'item' } },
        { id: 'ns',  label: 'into namespace', values: { xml: '<ul><li>a</li><li>b</li></ul>', old: 'li', new: '{urn:list}li' } },
      ],
    },
  ],
  demoExplainer: 'In the docs example b has text "1" and tail "4": the 4 comes after </b>, so it is stored on b, not on a. <x/>, <y></y> and <z> </z> parse to text None, None and " " — an empty element never gets "". On output tostring() escapes & < > in text and tail, and writes <b /> when b has no children and empty text. Renaming into a namespace makes the serializer invent a prefix (ns0) and declare it on the root.',

  patterns: [
    {
      name: 'Text with a fallback',
      desc: 'text is None for empty elements — guard before string methods.',
      code: "import xml.etree.ElementTree as ET\nname = (elem.findtext('name') or '').strip()",
    },
    {
      name: 'Serialize one element without its tail',
      desc: 'tostring() writes the tail too; clear it temporarily.',
      code: "import xml.etree.ElementTree as ET\ntail, elem.tail = elem.tail, None\nmarkup = ET.tostring(elem, encoding='unicode')\nelem.tail = tail",
    },
    {
      name: 'Unwrap an element, keep its content',
      desc: 'Setting tag to None makes the serializer write only its text and children.',
      code: "import xml.etree.ElementTree as ET\nfor span in root.iter('span'):\n    span.tag = None",
    },
    {
      name: 'Split a namespaced tag',
      desc: 'Parsed tags have the form {uri}local.',
      code: "import xml.etree.ElementTree as ET\nuri, _, local = elem.tag[1:].partition('}') if elem.tag.startswith('{') else ('', '', elem.tag)",
    },
  ],

  examples: [
    { title: 'text and tail from the docs example', code: "import xml.etree.ElementTree as ET\n[(e.tag, e.text, e.tail) for e in ET.fromstring('<a><b>1<c>2<d/>3</c></b>4</a>').iter()]", returns: "[('a', None, None), ('b', '1', '4'), ('c', '2', None), ('d', None, '3')]" },
    { title: 'Empty text is None', code: "import xml.etree.ElementTree as ET\n(ET.fromstring('<a></a>').text, ET.fromstring('<a/>').text, ET.fromstring('<a> </a>').text)", returns: "(None, None, ' ')" },
    { title: 'Namespaced tags', code: "import xml.etree.ElementTree as ET\nET.fromstring('<svg xmlns=\"http://www.w3.org/2000/svg\"><rect/></svg>')[0].tag", returns: "'{http://www.w3.org/2000/svg}rect'" },
    { title: 'Rename by assigning', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<ul><li>a</li></ul>')\nroot[0].tag = 'item'\nET.tostring(root, encoding='unicode')", returns: "'<ul><item>a</item></ul>'" },
    { title: 'tag = None unwraps on output', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<p>x<span>y</span>z</p>')\nroot.find('span').tag = None\nET.tostring(root, encoding='unicode')", returns: "'<p>xyz</p>'" },
    { title: 'Text and tail survive a round trip (escaped on output)', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('p')\nb = ET.SubElement(root, 'b')\nb.text = 'Tom & Jerry'\nb.tail = ' <3'\nback = ET.fromstring(ET.tostring(root))\n(back.find('b').text, back.find('b').tail)", returns: "('Tom & Jerry', ' <3')" },
  ],

  pitfalls: [
    {
      name: 'Calling str methods on a missing text',
      desc: 'An element without text has text None.',
      wrong: { label: '.text.strip()', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a><b/></a>').find('b').text.strip()", output: "AttributeError: 'NoneType' object has no attribute 'strip'" },
      fix:   { label: "(text or '').strip()", code: "import xml.etree.ElementTree as ET\n(ET.fromstring('<a><b/></a>').find('b').text or '').strip()", output: "''" },
    },
    {
      name: 'tostring() of a child includes its tail',
      desc: 'The text after the child belongs to the child, so it is serialized with it.',
      wrong: { label: 'tostring(b)', code: "import xml.etree.ElementTree as ET\np = ET.fromstring('<p>Some <b>bold</b> text</p>')\nET.tostring(p.find('b'), encoding='unicode')", output: "'<b>bold</b> text'" },
      fix:   { label: 'tail = None first', code: "import xml.etree.ElementTree as ET\np = ET.fromstring('<p>Some <b>bold</b> text</p>')\nb = p.find('b')\nb.tail = None\nET.tostring(b, encoding='unicode')", output: "'<b>bold</b>'" },
    },
    {
      name: 'Storing numbers in text',
      desc: 'Any object can be assigned, but only str can be serialized.',
      wrong: { label: 'text = 9.5', code: "import xml.etree.ElementTree as ET\ne = ET.Element('price')\ne.text = 9.5\nET.tostring(e)", output: 'TypeError: cannot serialize 9.5 (type float)' },
      fix:   { label: 'text = str(9.5)', code: "import xml.etree.ElementTree as ET\ne = ET.Element('price')\ne.text = str(9.5)\nET.tostring(e)", output: "b'<price>9.5</price>'" },
    },
  ],

  when: {
    use: [
      'Reading the value of a leaf element: elem.text',
      'Mixed content (text interleaved with markup): text plus each child\'s tail',
      'Renaming elements by assigning to tag',
    ],
    avoid: [
      'All text of a subtree → "".join(elem.itertext())',
      'Text of a child with a fallback → findtext(path, default)',
      'Attributes → get() / attrib',
    ],
  },

  notes: {
    cpython:     'In the C Element, text and tail are stored internally (joined lazily when the parser delivered the text in pieces); reading them returns a str or None',
    'Parsing':   'Character data is delivered with references expanded and line ends normalized to \\n; CDATA sections become ordinary text',
    'Comments':  'For comment and PI elements, tag is ET.Comment / ET.ProcessingInstruction and text holds the comment text or "target data"',
  },

  related: [
    { name: 'Element.itertext', slug: 'element-iter',   when: 'All text below an element' },
    { name: 'Element.findtext', slug: 'element-find',   when: 'A child\'s text with a default' },
    { name: 'Element.get',      slug: 'element-get',    when: 'Attributes instead of text' },
    { name: 'Element.remove',   slug: 'element-append', when: 'Removing a child removes its tail' },
    { name: 'indent',           slug: 'indent',         when: 'Rewrites whitespace-only text and tails' },
  ],

  faq: [
    {
      q: 'What is the difference between text and tail in ElementTree?',
      a: 'text is the text inside the element before its first child; tail is the text after the element\'s closing tag, up to the next tag. In <p>Hi <b>you</b> there</p>, p.text is "Hi ", b.text is "you" and b.tail is " there".',
    },
    {
      q: 'Why is element.text None?',
      a: 'The element has no text before its first child — it is empty (<a/>, <a></a>) or starts directly with a child element. Use elem.text or "" or findtext() with a default.',
    },
    {
      q: 'How do I change the tag name of an element?',
      a: "Assign it: elem.tag = 'new'. For a namespaced name use '{uri}local'; tostring() declares a prefix for it.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.text',
    meta:  'Element.tag / text / tail',
  },
};
