// content/reference/python/stdlib/xml-etree-elementtree/indent.js

export const meta = {
  slug:        'indent',
  name:        'xml.etree.ElementTree.indent',
  signature:   "xml.etree.ElementTree.indent(tree, space='  ', level=0)",
  blurb:       'Pretty-print a tree in place: indent() rewrites whitespace-only text and tails so that tostring() and write() produce one element per line.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'xml.etree.ElementTree.indent ET.indent pretty print xml python elementtree format xml indentation newlines tabs space level beautify xml minidom toprettyxml alternative',
};

export const method = {
  slug:      'indent',
  name:      'xml.etree.ElementTree.indent',
  signature: "xml.etree.ElementTree.indent(tree, space='  ', level=0)",
  returns:   { type: 'None', desc: 'The tree is modified in place; serialize it afterwards.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'indent() does not produce text — it changes the tree: every text and tail that is empty or whitespace-only becomes a newline plus the right number of space strings. Text with real content is never touched, so mixed content keeps its exact spacing.',

  covers: ['indent'],

  cheat: {
    commonCall: "ET.indent(root); ET.tostring(root, encoding='unicode')",
    returns:    'None — the elements\' text and tail are rewritten',
    replaces:   'xml.dom.minidom toprettyxml() round trips',
    watchOut:   'The added whitespace stays in the data: root.text is now "\\n  "',
  },

  parameters: [
    { name: 'tree',  type: 'Element | ElementTree', required: true,  default: null,  desc: 'The element (or tree) to indent. The root\'s own tail is left alone.' },
    { name: 'space', type: 'str',                   required: false, default: "'  '", desc: 'The string added per level — "\\t" for tabs, "    " for four spaces.' },
    { name: 'level', type: 'int',                   required: false, default: '0',    desc: 'Initial indentation level, for indenting a subtree that sits inside an already indented document. Negative raises ValueError.' },
  ],

  modes: [
    {
      id: 'space',
      label: 'indent(space=)',
      blurb: 'Indent with your step string; the result is shown one line per item.',
      params: [
        { name: 'xml',   type: 'str', hint: 'an XML document',     input: 'text' },
        { name: 'space', type: 'str', hint: 'one indentation step', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nET.indent(root, space={$space})\nET.tostring(root, encoding='unicode').splitlines()",
      cases: [
        { id: 'two',    label: 'two spaces',      values: { xml: '<config><db><host>localhost</host><port>5432</port></db><debug/></config>', space: '  ' } },
        { id: 'tab',    label: 'tab',             values: { xml: '<a>   <b>x</b>      <c/></a>', space: '\t' } },
        { id: 'leaf',   label: 'whitespace leaf', values: { xml: '<a><b>  </b><c> x </c></a>', space: '  ' } },
        { id: 'mixed',  label: 'mixed content',   values: { xml: '<p>x<b>y</b>z</p>', space: '  ' } },
      ],
    },
    {
      id: 'level',
      label: 'indent(level=)',
      blurb: 'level shifts everything right, for a subtree that will be pasted into a deeper position. Shown as one str.',
      params: [
        { name: 'xml',   type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'level', type: 'int', hint: 'starting level',  input: 'number' },
      ],
      template: "import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nET.indent(root, level={$level})\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'zero', label: 'level 0',  values: { xml: '<db><host>localhost</host></db>', level: '0' } },
        { id: 'one',  label: 'level 1',  values: { xml: '<db><host>localhost</host></db>', level: '1' } },
        { id: 'neg',  label: 'level -1', values: { xml: '<db><host>localhost</host></db>', level: '-1' } },
      ],
    },
  ],
  demoExplainer: 'Only elements with children get new text: <b>  </b> has no children, so its two spaces survive, and <c> x </c> keeps its content. In "mixed content" every text and tail has non-whitespace characters, so nothing changes at all. With level=1 the children start at two steps and the closing tag at one — the root\'s start tag itself is not moved, because indentation is added to text and tails, never in front of the root.',

  patterns: [
    {
      name: 'Pretty-print to the console',
      desc: 'indent, then serialize as str.',
      code: "import xml.etree.ElementTree as ET\nET.indent(root)\nprint(ET.tostring(root, encoding='unicode'))",
    },
    {
      name: 'Pretty file output',
      desc: 'indent() accepts the ElementTree too.',
      code: "import xml.etree.ElementTree as ET\ntree = ET.parse('in.xml')\nET.indent(tree, space='\\t')\ntree.write('out.xml', encoding='utf-8', xml_declaration=True)",
    },
    {
      name: 'Keep the data clean',
      desc: 'Indent a copy when the tree is still used afterwards.',
      code: "import copy\nimport xml.etree.ElementTree as ET\npretty = copy.deepcopy(root)\nET.indent(pretty)\ntext = ET.tostring(pretty, encoding='unicode')",
    },
    {
      name: 'Re-indent a messy document',
      desc: 'Existing whitespace-only text is replaced, so old indentation does not pile up.',
      code: "import xml.etree.ElementTree as ET\nroot = ET.parse('messy.xml').getroot()\nET.indent(root, space='  ')",
    },
  ],

  examples: [
    { title: 'Nested elements, one per line', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b><c/></b></a>')\nET.indent(root)\nET.tostring(root, encoding='unicode').splitlines()", returns: "['<a>', '  <b>', '    <c />', '  </b>', '</a>']" },
    { title: 'Tabs', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nET.indent(root, space='\\t')\nET.tostring(root, encoding='unicode')", returns: "'<a>\\n\\t<b />\\n</a>'" },
    { title: 'Returns None', code: "import xml.etree.ElementTree as ET\nprint(ET.indent(ET.fromstring('<a><b/></a>')))", returns: 'None' },
    { title: 'It changes text and tail', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nET.indent(root)\n(root.text, root[0].tail)", returns: "('\\n  ', '\\n')" },
    { title: 'Mixed content is left alone', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<p>x<b>y</b>z</p>')\nET.indent(root)\nET.tostring(root, encoding='unicode')", returns: "'<p>x<b>y</b>z</p>'" },
    { title: 'Works on an ElementTree', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.fromstring('<a><b/></a>'))\nET.indent(tree)\nET.tostring(tree.getroot(), encoding='unicode')", returns: "'<a>\\n  <b />\\n</a>'" },
  ],

  pitfalls: [
    {
      name: 'Expecting indent() to return the XML',
      desc: 'It works in place and returns None.',
      wrong: { label: 'xml = ET.indent(root)', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nxml = ET.indent(root)\nprint(xml)", output: 'None' },
      fix:   { label: 'indent, then tostring', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nET.indent(root)\nxml = ET.tostring(root, encoding='unicode')\nprint(xml)", output: '<a>\n  <b />\n</a>' },
    },
    {
      name: 'Reading text after indenting',
      desc: 'The indentation is real text now. Indent a copy, or indent just before writing.',
      wrong: { label: 'indent the original', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<list><item/></list>')\nET.indent(root)\nroot.text", output: "'\\n  '" },
      fix:   { label: 'indent a deepcopy', code: "import copy\nimport xml.etree.ElementTree as ET\nroot = ET.fromstring('<list><item/></list>')\npretty = copy.deepcopy(root)\nET.indent(pretty)\nprint(root.text)", output: 'None' },
    },
  ],

  when: {
    use: [
      'Human-readable XML files and log output',
      'Normalizing the whitespace of a document before writing it back',
    ],
    avoid: [
      'Python 3.8 and older — indent() does not exist there',
      'Documents where whitespace-only text matters (xml:space="preserve", pre-formatted content)',
      'Canonical or minimal output for signatures and diffs → canonicalize() / no indentation',
    ],
  },

  notes: {
    cpython:      'Lib/xml/etree/ElementTree.py: a recursive helper sets elem.text for every element with children and child.tail for each child when they are empty or whitespace-only (not text.strip()), then sets the last child\'s tail to the parent level',
    'Strings':    'Indentation strings are "\\n" + level * space, built once per level and reused',
    'Since':      'Added in Python 3.9',
  },

  related: [
    { name: 'tostring',          slug: 'tostring',          when: 'Serialize the indented tree' },
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'Write it to a file' },
    { name: 'Element.text / tail', slug: 'element-tag',     when: 'What indent() rewrites' },
    { name: 'json.dumps indent', slug: 'dumps',             when: 'Pretty-printing JSON', category: 'stdlib/json' },
  ],

  faq: [
    {
      q: 'How do I pretty-print XML in Python?',
      a: "With ElementTree on Python 3.9+: ET.indent(root) and then ET.tostring(root, encoding='unicode') or tree.write(...). indent() changes the tree in place and returns None.",
    },
    {
      q: 'Why does indent() not indent some parts of my XML?',
      a: 'It only replaces text and tails that are empty or whitespace-only. Where an element contains real text before or between children (mixed content), changing whitespace would change the data, so it is left exactly as it is.',
    },
    {
      q: 'How do I indent with tabs or four spaces?',
      a: "Pass space: ET.indent(root, space='\\t') or ET.indent(root, space='    '). The default is two spaces.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.indent',
    meta:  'xml.etree.ElementTree.indent',
  },
};
