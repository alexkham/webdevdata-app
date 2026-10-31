// content/reference/python/stdlib/difflib/htmldiff.js — HtmlDiff, make_file, make_table

export const meta = {
  slug:        'htmldiff',
  name:        'difflib.HtmlDiff',
  signature:   'difflib.HtmlDiff(tabsize=8, wrapcolumn=None, linejunk=None, charjunk=IS_CHARACTER_JUNK) · make_file(...) · make_table(...)',
  blurb:       'Side-by-side HTML comparison of two lists of lines, with changed, added and deleted text highlighted: make_table returns the <table>, make_file a complete HTML page around it.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 2.4+',
  searchTerms: 'difflib HtmlDiff HtmlDiff.make_file HtmlDiff.make_table make_file make_table html diff side by side comparison python diff to html report highlight changes diff_add diff_chg diff_sub wrapcolumn tabsize context numlines charset',
};

export const method = {
  slug:      'htmldiff',
  name:      'difflib.HtmlDiff',
  signature: 'difflib.HtmlDiff(tabsize=8, wrapcolumn=None, linejunk=None, charjunk=IS_CHARACTER_JUNK)',
  returns:   { type: 'HtmlDiff', desc: 'An object whose make_table() returns an HTML <table> string and make_file() a complete HTML document string.' },

  category:    'difflib class',
  version:     'Python 2.4+',
  hasLiveDemo: false,

  subtitle: 'Two columns of numbered lines, with ndiff\'s intraline analysis turned into <span class="diff_add">, "diff_sub" and "diff_chg" highlights and "next change" links in between. The output is long HTML (in Python 3.13, comparing the single line "a" with the single line "b" already gives a table of 683 characters, and make_file turns that into a page of 2,159), so this page shows only small, verified fragments of it.',

  covers: ['HtmlDiff', 'HtmlDiff.make_file', 'HtmlDiff.make_table'],

  cheat: {
    commonCall: "difflib.HtmlDiff().make_file(a_lines, b_lines, 'old', 'new')",
    returns:    'a str with a full HTML page',
    replaces:   'pasting two versions into an online diff tool',
    watchOut:   'a missing final newline is not shown as a difference',
  },

  parameters: [
    { name: 'tabsize',    type: 'int',             required: false, default: '8',    desc: 'Tab stops used to expand tabs (shown as non-breaking spaces).' },
    { name: 'wrapcolumn', type: 'int | None',      required: false, default: 'None', desc: 'Wrap lines longer than this many characters onto continuation rows; None never wraps.' },
    { name: 'linejunk',   type: 'callable | None', required: false, default: 'None', desc: 'Passed to the ndiff-style comparison of lines.' },
    { name: 'charjunk',   type: 'callable | None', required: false, default: 'IS_CHARACTER_JUNK', desc: 'Passed to the comparison of characters within similar lines.' },
  ],

  attributes: [
    { name: 'make_table(fromlines, tolines, fromdesc=\'\', todesc=\'\', context=False, numlines=5)', type: 'method', meaning: 'Return the <table> only. fromdesc / todesc become column headers; context=True shows only changed regions with numlines lines around them (otherwise numlines sets how far ahead the "next" links jump).' },
    { name: "make_file(fromlines, tolines, fromdesc='', todesc='', context=False, numlines=5, *, charset='utf-8')", type: 'method', meaning: 'Return a complete HTML document: the table plus a <style> block and a legend. charset (3.5+) sets the declared encoding; characters it cannot encode become &#...; references.' },
  ],

  patterns: [
    {
      name: 'Write a side-by-side report',
      desc: 'make_file returns a str; write it with the same encoding it declares.',
      code: "import difflib\nhtml = difflib.HtmlDiff(wrapcolumn=80).make_file(old_lines, new_lines, 'old.txt', 'new.txt', context=True)\nwith open('diff.html', 'w', encoding='utf-8') as f:\n    f.write(html)",
    },
    {
      name: 'Embed the table in your own page',
      desc: 'make_table returns only the table; copy the CSS classes diff_add, diff_chg, diff_sub, diff_header and diff_next into your stylesheet.',
      code: "import difflib\ntable = difflib.HtmlDiff().make_table(old_lines, new_lines, 'Before', 'After', context=True, numlines=3)",
    },
    {
      name: 'Only the changed regions',
      desc: 'context=True with numlines lines of context around each change.',
      code: 'import difflib\ntable = difflib.HtmlDiff().make_table(a, b, context=True, numlines=2)',
    },
  ],

  examples: [
    { title: 'Changed characters are wrapped in spans', code: "import difflib, re\ntable = difflib.HtmlDiff().make_table(['abcdefgh\\n'], ['abcXefgh\\n'])\nre.findall(r'<span class=\"diff_\\w+\">[^<]*</span>', table)", returns: '[\'<span class="diff_chg">d</span>\', \'<span class="diff_chg">X</span>\']' },
    { title: 'Text is escaped; unescaped again, spaces are no-break spaces', code: "import difflib, html, re\ntable = difflib.HtmlDiff().make_table(['a < b & c\\n'], ['a > b & c\\n'])\ncells = re.findall(r'<td nowrap=\"nowrap\">.*?</td>', table)\n[html.unescape(re.sub(r'<[^>]+>', '', cell)) for cell in cells]", returns: "['a\\xa0<\\xa0b\\xa0&\\xa0c', 'a\\xa0>\\xa0b\\xa0&\\xa0c']" },
    { title: 'An added line', code: "import difflib, re\ntable = difflib.HtmlDiff().make_table(['x\\n'], ['x\\n', 'y\\n'])\nre.findall(r'<td nowrap=\"nowrap\">.*?</td>', table)", returns: '[\'<td nowrap="nowrap">x</td>\', \'<td nowrap="nowrap">x</td>\', \'<td nowrap="nowrap"></td>\', \'<td nowrap="nowrap"><span class="diff_add">y</span></td>\']' },
    { title: 'Column headers from fromdesc / todesc', code: "import difflib, re\ntable = difflib.HtmlDiff().make_table(['spam\\n', 'eggs\\n'], ['spam\\n', 'ham\\n'], 'before', 'after')\nre.findall(r'<th[^>]*>[^<]*</th>', table)", returns: '[\'<th colspan="2" class="diff_header">before</th>\', \'<th colspan="2" class="diff_header">after</th>\']' },
    { title: 'context=True keeps only the changed region', code: "import difflib\nold = [f'{i}\\n' for i in range(20)]\nnew = old[:10] + ['ten\\n'] + old[11:]\nd = difflib.HtmlDiff()\n(d.make_table(old, new).count('<tr>'), d.make_table(old, new, context=True, numlines=2).count('<tr>'))", returns: '(20, 5)' },
    { title: 'wrapcolumn splits long lines', code: "import difflib, re\ntable = difflib.HtmlDiff(wrapcolumn=5).make_table(['abcdefghij\\n'], ['abcdefghiX\\n'])\nre.findall(r'<td nowrap=\"nowrap\">.*?</td>', table)", returns: '[\'<td nowrap="nowrap">abcde</td>\', \'<td nowrap="nowrap">abcde</td>\', \'<td nowrap="nowrap">fghi<span class="diff_chg">j</span></td>\', \'<td nowrap="nowrap">fghi<span class="diff_chg">X</span></td>\']' },
    { title: 'make_file returns a whole document', code: "import difflib\npage = difflib.HtmlDiff().make_file(['a\\n'], ['b\\n'])\n(page.lstrip().startswith('<!DOCTYPE html'), page.rstrip().endswith('</html>'), 'Legends' in page)", returns: '(True, True, True)' },
  ],

  pitfalls: [
    {
      name: 'Expecting identical HTML for identical input',
      desc: 'Every make_table call takes new anchor ids (from0_, to0_, then from1_, …) from a counter shared by all HtmlDiff objects in the process, so two tables of the same input differ. Compare the rendered text, or strip the ids.',
      wrong: { label: 'compare HTML', code: "import difflib\nd = difflib.HtmlDiff()\nd.make_table(['a\\n'], ['b\\n']) == d.make_table(['a\\n'], ['b\\n'])", output: 'False' },
      fix:   { label: 'without ids',  code: "import difflib, re\nd = difflib.HtmlDiff()\nstrip = lambda html: re.sub(r'(from|to)\\d+_', '', html)\nstrip(d.make_table(['a\\n'], ['b\\n'])) == strip(d.make_table(['a\\n'], ['b\\n']))", output: 'True' },
    },
    {
      name: 'A missing final newline is not shown',
      desc: 'HtmlDiff removes trailing newlines before comparing, so "a\\n" and "a" look identical in the table — the docs warn that the result can be incomplete. Use unified_diff when line endings matter.',
      wrong: { label: 'HtmlDiff',     code: "import difflib, re\ntable = difflib.HtmlDiff().make_table(['a\\n'], ['a'])\nre.findall(r'<td nowrap=\"nowrap\">.*?</td>', table)", output: '[\'<td nowrap="nowrap">a</td>\', \'<td nowrap="nowrap">a</td>\']' },
      fix:   { label: 'unified_diff', code: "import difflib\nlist(difflib.unified_diff(['a\\n'], ['a']))[-2:]", output: "['-a\\n', '+a']" },
    },
  ],

  when: {
    use: [
      'Reports for people: code review attachments, config change notifications, test artifacts',
      'A quick standalone HTML page comparing two versions (make_file)',
    ],
    avoid: [
      'Large files without context=True — every line becomes a table row',
      'Machine-readable output → unified_diff',
      'Exact byte or line-ending differences — trailing newlines are dropped before comparing',
    ],
  },

  notes: {
    cpython:      'Lib/difflib.py: make_table expands tabs, strips newlines, runs the internal _mdiff (built on ndiff with linejunk / charjunk), wraps lines at wrapcolumn, escapes &, < and > and formats one <tr> per line pair',
    'Headers':    'fromdesc and todesc are inserted as HTML without escaping (fromdesc="<b>x</b>" gives a bold header), so escape them with html.escape when they come from untrusted input — the docs say the same',
    'Anchors':    'Ids come from HtmlDiff._default_prefix, a class-level counter incremented by every make_table (and so every make_file) call in the process',
    'Template':   'The page template is version-specific: 3.13 emits an XHTML 1.0 Transitional doctype, 3.14 added dark-mode CSS, 3.15 switched to <!DOCTYPE html>. make_file\'s charset argument was added in 3.5, when the default changed from ISO-8859-1 to utf-8',
  },

  related: [
    { name: 'difflib.ndiff',   slug: 'ndiff',        when: 'The line/character analysis behind the highlights' },
    { name: 'difflib.unified_diff', slug: 'unified_diff', when: 'Plain-text alternative' },
    { name: 'IS_CHARACTER_JUNK', slug: 'is_line_junk', when: 'The default charjunk' },
    { name: 'html.escape',     slug: 'escape', when: 'Escaping text for your own HTML diff', category: 'stdlib/html' },
  ],

  faq: [
    {
      q: 'Why is there no live demo of HtmlDiff on this page?',
      a: 'Its output is too long and too unstable to show usefully: in Python 3.13 comparing the single line "a" with the single line "b" already gives a 683-character table or a 2,159-character page, the anchor ids depend on how many tables the process has made before, and the page template differs between Python versions (3.14 added dark-mode CSS, 3.15 changed the doctype). The examples above show short fragments of the table instead, each verified with CPython 3.13.',
    },
    {
      q: 'How do I create an HTML diff of two files in Python?',
      a: "Read both files into lists of lines and call difflib.HtmlDiff().make_file(a_lines, b_lines, 'a.txt', 'b.txt'); write the returned string to an .html file with encoding='utf-8'. Pass context=True to show only the changed regions and wrapcolumn=80 to wrap long lines.",
    },
    {
      q: 'What is the difference between make_file and make_table?',
      a: 'make_table returns only the <table> element, for embedding in your own page with your own CSS. make_file wraps that table in a complete HTML document with the default styles and a legend explaining the colors and links.',
    },
    {
      q: 'Why are the ids in the HtmlDiff output different every time?',
      a: 'So that several tables can live on one page: each make_table call takes the next number from a counter shared by all HtmlDiff instances (from0_/to0_, from1_/to1_, …). The numbers therefore depend on how many tables were generated before in the same process.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.HtmlDiff',
    meta:  'difflib.HtmlDiff',
  },
};
