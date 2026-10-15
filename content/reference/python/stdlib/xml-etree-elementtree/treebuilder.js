// content/reference/python/stdlib/xml-etree-elementtree/treebuilder.js — TreeBuilder

export const meta = {
  slug:        'treebuilder',
  name:        'xml.etree.ElementTree.TreeBuilder',
  signature:   'xml.etree.ElementTree.TreeBuilder(element_factory=None, *, comment_factory=None, pi_factory=None, insert_comments=False, insert_pis=False)',
  blurb:       'Turns a stream of start / data / end calls into an Element tree — the default target of XMLParser, and the way to keep comments and processing instructions while parsing.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+ (comment / pi and insert_* options 3.8)',
  searchTerms: 'xml.etree.ElementTree.TreeBuilder ET.TreeBuilder treebuilder start data end close comment pi insert_comments insert_pis element_factory keep comments when parsing xml python build tree from events custom parser target',
};

export const method = {
  slug:      'treebuilder',
  name:      'xml.etree.ElementTree.TreeBuilder',
  signature: 'xml.etree.ElementTree.TreeBuilder(element_factory=None, *, comment_factory=None, pi_factory=None, insert_comments=False, insert_pis=False)',
  returns:   { type: 'TreeBuilder', desc: 'A builder with start(tag, attrs), data(text), end(tag), comment(text), pi(target, text) and close() → the root element.' },

  category:    'xml.etree.ElementTree class',
  version:     'Python 2.5+ (comment / pi and insert_* options 3.8)',
  hasLiveDemo: true,

  subtitle: 'TreeBuilder keeps a stack of open elements: start() opens one under the current element, data() collects text for it (or for the tail of the element just closed), end() closes it, and close() returns the root. XMLParser drives it for you; you can also call it yourself.',

  covers: ['TreeBuilder'],

  cheat: {
    commonCall: 'ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))',
    returns:    'a builder; close() returns the root Element',
    replaces:   'losing comments and PIs while parsing',
    watchOut:   'start() needs the attrs dict: start(tag, {})',
  },

  parameters: [
    { name: 'element_factory', type: 'callable', required: false, default: 'None',  desc: 'Called as factory(tag, attrs) to create each element; default Element.' },
    { name: 'comment_factory', type: 'callable', required: false, default: 'None',  desc: 'Creates comment nodes; default Comment.' },
    { name: 'pi_factory',      type: 'callable', required: false, default: 'None',  desc: 'Creates processing-instruction nodes; default ProcessingInstruction.' },
    { name: 'insert_comments', type: 'bool',     required: false, default: 'False', desc: 'Add comments that appear inside the root element to the tree.' },
    { name: 'insert_pis',      type: 'bool',     required: false, default: 'False', desc: 'Add processing instructions that appear inside the root element to the tree.' },
  ],

  modes: [
    {
      id: 'manual',
      label: 'start / data / end',
      blurb: 'Build a small tree by calling the builder yourself, then serialize what close() returns.',
      params: [
        { name: 'tag',  type: 'str', hint: 'child tag',       input: 'text' },
        { name: 'id',   type: 'str', hint: 'id attribute',    input: 'text' },
        { name: 'text', type: 'str', hint: 'text of the child', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('root', {})\ntb.start({$tag}, {'id': {$id}})\ntb.data({$text})\ntb.end({$tag})\ntb.end('root')\nET.tostring(tb.close(), encoding='unicode')",
      cases: [
        { id: 'item',   label: 'item',         values: { tag: 'item', id: '1', text: 'Pen' } },
        { id: 'escape', label: 'special chars', values: { tag: 'note', id: 'a"b', text: 'x < y & z' } },
        { id: 'empty',  label: 'no text',      values: { tag: 'br', id: 'n1', text: '' } },
      ],
    },
    {
      id: 'insert',
      label: 'keep comments + PIs',
      blurb: 'Parse your XML with TreeBuilder(insert_comments=True, insert_pis=True) and serialize the result.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True, insert_pis=True))\nroot = ET.fromstring({$xml}, parser=parser)\nET.tostring(root, encoding='unicode')",
      cases: [
        { id: 'inside',  label: 'inside the root',  values: { xml: '<config><!-- defaults --><?app reload?><debug>no</debug></config>' } },
        { id: 'outside', label: 'outside the root', values: { xml: '<!-- header --><?xml-stylesheet href="a.css"?><page/>' } },
        { id: 'mixed',   label: 'between text',     values: { xml: '<p>one<!-- c -->two</p>' } },
      ],
    },
  ],
  demoExplainer: 'The builder escapes nothing itself — tostring() does, so a quote in an attribute and < or & in text come out as references. Empty text leaves the element self-closing. Comments and PIs are inserted only when they appear inside the root element: before or after it there is no element to hold them, so "outside the root" gives just <page />. Text around an inserted comment is split: the part before is the parent\'s text, the part after is the comment\'s tail.',

  patterns: [
    {
      name: 'Keep comments while parsing a file',
      desc: 'Pass a parser with a configured TreeBuilder to parse().',
      code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))\ntree = ET.parse('config.xml', parser=parser)",
    },
    {
      name: 'Build a tree from another format',
      desc: 'Translate your own events into start / data / end calls.',
      code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('rows', {})\nfor row in rows:\n    tb.start('row', {'id': str(row.id)})\n    tb.data(row.name)\n    tb.end('row')\ntb.end('rows')\nroot = tb.close()",
    },
    {
      name: 'Custom element class',
      desc: 'element_factory receives (tag, attrs) for every element.',
      code: "import xml.etree.ElementTree as ET\n\nclass Node(ET.Element):\n    pass\n\nparser = ET.XMLParser(target=ET.TreeBuilder(element_factory=Node))\nroot = ET.fromstring(xml_text, parser=parser)",
    },
  ],

  examples: [
    { title: 'Building by hand', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('root', {})\ntb.start('item', {'id': '1'})\ntb.data('Pen')\ntb.end('item')\ntb.end('root')\nET.tostring(tb.close(), encoding='unicode')", returns: "'<root><item id=\"1\">Pen</item></root>'" },
    { title: 'start() and end() return the element', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\n(tb.start('a', {}).tag, tb.end('a').tag)", returns: "('a', 'a')" },
    { title: 'data() calls are joined', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\ntb.data('x')\ntb.data('y')\ntb.end('a')\ntb.close().text", returns: "'xy'" },
    { title: 'Keeping comments and PIs', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True, insert_pis=True))\nroot = ET.fromstring('<!-- outside --><a><!-- in --><?pi data?></a>', parser=parser)\nET.tostring(root, encoding='unicode')", returns: "'<a><!-- in --><?pi data?></a>'" },
    { title: 'comment() creates a node either way', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\nc = tb.comment('note')\n(c.tag is ET.Comment, c.text, len(tb.close()))", returns: "(True, 'note', 0)" },
    { title: 'end() does not check the tag name', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\ntb.start('b', {})\ntb.end('zzz')\ntb.end('a')\nET.tostring(tb.close(), encoding='unicode')", returns: "'<a><b /></a>'" },
    { title: 'A second top-level element', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\ntb.end('a')\ntb.start('b', {})", returns: 'xml.etree.ElementTree.ParseError: multiple elements on top level' },
    { title: 'element_factory', code: "import xml.etree.ElementTree as ET\ndef factory(tag, attrib):\n    return ET.Element(tag.upper(), attrib)\ntb = ET.TreeBuilder(element_factory=factory)\ntb.start('a', {'x': '1'})\ntb.end('a')\nET.tostring(tb.close(), encoding='unicode')", returns: "'<A x=\"1\" />'" },
  ],

  pitfalls: [
    {
      name: 'Leaving out the attrs argument',
      desc: 'TreeBuilder.start() takes the tag and a dict of attributes, both positional.',
      wrong: { label: "start('a')", code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a')", output: 'TypeError: start expected 2 arguments, got 1' },
      fix:   { label: "start('a', {})", code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\ntb.end('a')\ntb.close().tag", output: "'a'" },
    },
    {
      name: 'Calling end() more often than start()',
      desc: 'The builder pops its stack of open elements; an extra end() has nothing to close.',
      wrong: { label: 'unbalanced end()', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\ntb.end('a')\ntb.end('a')", output: 'IndexError: pop from empty stack' },
      fix:   { label: 'one end() per start()', code: "import xml.etree.ElementTree as ET\ntb = ET.TreeBuilder()\ntb.start('a', {})\ntb.end('a')\nET.tostring(tb.close(), encoding='unicode')", output: "'<a />'" },
    },
    {
      name: 'Expecting comments outside the root',
      desc: 'insert_comments only inserts comments that are inside the root element. A comment before the root is reported (to targets and as an iterparse event) but has no parent in the tree.',
      wrong: { label: 'comment before the root', code: "import xml.etree.ElementTree as ET\nparser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))\nroot = ET.fromstring('<!-- license --><a/>', parser=parser)\nlen(root)", output: '0' },
      fix:   { label: 'read it as an event', code: "import io\nimport xml.etree.ElementTree as ET\n[elem.text for event, elem in ET.iterparse(io.StringIO('<!-- license --><a/>'), events=('comment',))]", output: "[' license ']" },
    },
  ],

  when: {
    use: [
      'Keeping comments and processing instructions when parsing (insert_comments / insert_pis)',
      'Building Element trees from your own parser or a non-XML format',
      'Creating your own element class for every parsed element (element_factory)',
    ],
    avoid: [
      'Building a tree in ordinary code → Element and SubElement are clearer',
      'Event processing without a tree → a custom XMLParser target',
    ],
  },

  notes: {
    cpython:     'The C TreeBuilder of Modules/_elementtree.c (a pure-Python version exists in ElementTree.py). Text from data() is buffered and attached on the next start() / end() as the text of the open element or the tail of the one just closed; data() before the first start() is ignored, and close() does not flush text that arrives after the root has ended',
    'Custom builders': 'A target of your own may also define doctype(name, pubid, system), start_ns(prefix, uri) and end_ns(prefix); the default TreeBuilder has none of these methods (XMLParser handles namespace events for it internally)',
    'Errors':    'A second top-level start() raises ParseError("multiple elements on top level") without a position; an extra end() raises IndexError',
  },

  related: [
    { name: 'XMLParser',     slug: 'xmlparser',     when: 'Drives a TreeBuilder from expat' },
    { name: 'Comment / PI',  slug: 'comment',       when: 'The nodes comment() and pi() create' },
    { name: 'fromstring',    slug: 'fromstring',    when: 'Pass parser=XMLParser(target=TreeBuilder(...))' },
    { name: 'SubElement',    slug: 'subelement',    when: 'Building trees in ordinary code' },
    { name: 'iterparse',     slug: 'iterparse',     when: 'Comment events outside the root' },
  ],

  faq: [
    {
      q: 'How do I keep XML comments when parsing with ElementTree?',
      a: "Parse with a builder that inserts them: parser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True)), then ET.fromstring(text, parser=parser) or ET.parse(path, parser=parser). Use insert_pis=True for processing instructions. Only comments inside the root element are kept.",
    },
    {
      q: 'What is TreeBuilder used for?',
      a: 'It is the default target of XMLParser: the parser calls start(), data(), end() and the builder assembles Elements. You use it directly to configure that (comments, PIs, a custom element class) or to build trees from events of your own.',
    },
    {
      q: 'Why did my text end up in the tail?',
      a: 'data() after an end() belongs to the element that was just closed — as its tail — not to the parent. That mirrors XML: in <p>a<b/>c</p> the text c is the tail of b.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.TreeBuilder',
    meta:  'xml.etree.ElementTree.TreeBuilder',
  },
};
