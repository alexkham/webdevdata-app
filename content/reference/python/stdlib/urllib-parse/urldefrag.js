// content/reference/python/stdlib/urllib-parse/urldefrag.js — urldefrag, DefragResult

export const meta = {
  slug:        'urldefrag',
  name:        'urllib.parse.urldefrag',
  signature:   'urllib.parse.urldefrag(url)',
  blurb:       'Split the #fragment off a URL: returns a DefragResult(url, fragment) whose geturl() puts them back together.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse urldefrag DefragResult DefragResult.geturl python remove fragment from url strip hash anchor #section deduplicate urls crawler',
};

export const method = {
  slug:      'urldefrag',
  name:      'urllib.parse.urldefrag',
  signature: 'urllib.parse.urldefrag(url)',
  returns:   { type: 'DefragResult', desc: "A named 2-tuple (url, fragment); fragment is '' when there is none. DefragResultBytes for bytes input." },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "One job: separate the part a browser never sends to the server. urldefrag('https://x/page#top') gives url='https://x/page' and fragment='top' — handy for de-duplicating links while crawling.",

  covers: ['urldefrag', 'DefragResult', 'DefragResult.geturl'],

  cheat: {
    commonCall: 'urldefrag(link).url',
    returns:    "'https://example.com/page' — no #fragment",
    replaces:   "link.split('#')[0]",
    watchOut:   "The url part is rebuilt with urlunparse, so an empty '?' disappears too",
  },

  parameters: [
    { name: 'url', type: 'str | bytes', required: true, default: null, desc: 'The URL. Without a #, it is returned unchanged with an empty fragment.' },
  ],

  modes: [
    {
      id: 'defrag',
      label: 'urldefrag',
      blurb: 'The URL and its fragment, separated.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urldefrag\nurldefrag({$url})',
      cases: [
        { id: 'sec',   label: 'with a fragment', values: { url: 'https://example.com/page?x=1#section-2' } },
        { id: 'none',  label: 'no fragment',     values: { url: 'https://example.com/page' } },
        { id: 'empty', label: 'empty fragment',  values: { url: 'https://example.com/page#' } },
        { id: 'two',   label: 'two #',           values: { url: 'https://example.com/#a#b' } },
      ],
    },
    {
      id: 'parts',
      label: 'url, fragment, geturl()',
      blurb: 'Read the fields and rebuild the URL with geturl().',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'from urllib.parse import urldefrag\nr = urldefrag({$url})\n(r.url, r.fragment, r.geturl())',
      cases: [
        { id: 'sec',  label: 'with a fragment', values: { url: 'https://example.com/docs#install' } },
        { id: 'q',    label: 'empty query',     values: { url: 'https://example.com/a?#top' } },
      ],
    },
  ],
  demoExplainer: "Only the first # starts the fragment, so 'a#b' is one fragment. When there is a #, the URL part is rebuilt from urlparse's pieces, which drops empty delimiters: 'https://example.com/a?#top' comes back as url 'https://example.com/a', and geturl() cannot restore the lone '?'.",

  patterns: [
    {
      name: 'De-duplicate crawled links',
      desc: 'page#a and page#b are the same document.',
      code: "from urllib.parse import urldefrag\nseen = {urldefrag(link).url for link in links}",
    },
    {
      name: 'Unpack both parts',
      desc: 'DefragResult is a tuple.',
      code: "from urllib.parse import urldefrag\nurl, fragment = urldefrag(link)",
    },
  ],

  examples: [
    { title: 'Split off the fragment',  code: "from urllib.parse import urldefrag\nurldefrag('https://example.com/page?x=1#section-2')", returns: "DefragResult(url='https://example.com/page?x=1', fragment='section-2')" },
    { title: 'No fragment',             code: "from urllib.parse import urldefrag\nurldefrag('https://example.com/page')",              returns: "DefragResult(url='https://example.com/page', fragment='')" },
    { title: 'Tuple unpacking',         code: "from urllib.parse import urldefrag\nurl, frag = urldefrag('https://example.com/page#top')\n(url, frag)", returns: "('https://example.com/page', 'top')" },
    { title: 'geturl() rebuilds it',    code: "from urllib.parse import urldefrag\nurldefrag('https://example.com/page#top').geturl()", returns: "'https://example.com/page#top'" },
    { title: 'DefragResult directly',   code: "from urllib.parse import DefragResult\nDefragResult('https://example.com/a', 'top').geturl()", returns: "'https://example.com/a#top'" },
    { title: 'bytes input',             code: "from urllib.parse import urldefrag\nurldefrag(b'https://example.com/#top')",            returns: "DefragResultBytes(url=b'https://example.com/', fragment=b'top')" },
  ],

  pitfalls: [
    {
      name: "split('#') on a URL without a fragment",
      desc: "Indexing [1] fails when there is no #; urldefrag always returns two parts.",
      wrong: { label: "split('#')[1]", code: "'https://example.com/page'.split('#')[1]",                                   output: 'IndexError: list index out of range' },
      fix:   { label: 'urldefrag',     code: "from urllib.parse import urldefrag\nurldefrag('https://example.com/page').fragment", output: "''" },
    },
    {
      name: 'Expecting the URL part byte for byte',
      desc: 'When a fragment is present, the URL part is re-assembled, which drops an empty ? (an equivalent URL, but not the same string).',
      wrong: { label: 'compare strings', code: "from urllib.parse import urldefrag\nurldefrag('https://example.com/a?#top').url == 'https://example.com/a?'", output: 'False' },
      fix:   { label: 'compare parsed',  code: "from urllib.parse import urldefrag, urlsplit\nurlsplit(urldefrag('https://example.com/a?#top').url) == urlsplit('https://example.com/a?')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Removing #anchors before comparing, caching or fetching URLs',
      'Reading the fragment of a link',
    ],
    avoid: [
      'Other URL parts → urlsplit',
      'Changing the fragment → urlsplit(url)._replace(fragment=...).geturl()',
    ],
  },

  notes: {
    cpython:         "If '#' is in the URL: urlparse it and urlunparse everything but the fragment; else return the URL unchanged with fragment ''",
    'DefragResult':  'A namedtuple (url, fragment) since 3.2; geturl() is url + "#" + fragment, or just url when the fragment is empty',
  },

  related: [
    { name: 'urllib.parse.urlsplit', slug: 'urlsplit', when: 'All five parts at once' },
    { name: 'urllib.parse.urljoin',  slug: 'urljoin',  when: 'Resolve links before de-duplicating them' },
    { name: 'DefragResultBytes',     slug: 'bytes-results', when: 'What bytes input returns' },
    { name: 'urllib.parse module',   slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I remove the fragment (#...) from a URL in Python?',
      a: "urldefrag(url).url. It returns the URL without the fragment; .fragment holds the text after the first '#'.",
    },
    {
      q: 'Is the fragment sent to the server?',
      a: 'No. Browsers and HTTP clients keep the fragment on the client side; that is why two URLs that differ only in their fragment are the same resource for a crawler.',
    },
    {
      q: 'What does urldefrag return when there is no fragment?',
      a: "DefragResult(url=<the original URL>, fragment=''). The URL is returned untouched in that case.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urldefrag',
    meta:  'urllib.parse.urldefrag',
  },

};
