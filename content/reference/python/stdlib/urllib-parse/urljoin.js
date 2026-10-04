// content/reference/python/stdlib/urllib-parse/urljoin.js

export const meta = {
  slug:        'urljoin',
  name:        'urllib.parse.urljoin',
  signature:   'urllib.parse.urljoin(base, url, allow_fragments=True)',
  blurb:       'Resolve a link against the URL of the page it appears on, like a browser does: relative paths, ../, /absolute paths, //host and full URLs.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'urllib parse urljoin python join url base url relative url resolve link trailing slash replaces last segment api base url path dropped ../ dot segments rfc 3986 absolute url scheme relative //host new URL(rel, base) python equivalent',
};

export const method = {
  slug:      'urljoin',
  name:      'urllib.parse.urljoin',
  signature: 'urllib.parse.urljoin(base, url, allow_fragments=True)',
  returns:   { type: 'str | bytes', desc: 'The absolute URL that url refers to when found on the page at base.' },

  category:    'urllib.parse function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "urljoin is link resolution (RFC 3986), not string concatenation. The last path segment of base is a file name unless base ends with '/': urljoin('https://x/api/v1', 'users') drops v1. An absolute path or a full URL replaces the base path altogether.",

  covers: ['urljoin'],

  cheat: {
    commonCall: "urljoin('https://example.com/docs/', 'intro')",
    returns:    "'https://example.com/docs/intro'",
    replaces:   "base + '/' + path — and its doubled or missing slashes",
    watchOut:   "Without a trailing '/', the base's last segment is replaced",
  },

  parameters: [
    { name: 'base',            type: 'str | bytes', required: true,  default: null,   desc: 'The URL of the document containing the link. If empty, url is returned unchanged.' },
    { name: 'url',             type: 'str | bytes', required: true,  default: null,   desc: 'The link: relative path, ../path, /path, ?query, #fragment, //host/path or a full URL. If empty, base is returned unchanged.' },
    { name: 'allow_fragments', type: 'bool',        required: false, default: 'True', desc: 'Passed to urlparse for both URLs: False keeps #... inside the path or query.' },
  ],

  modes: [
    {
      id: 'join',
      label: 'urljoin',
      blurb: 'Resolve a link against a base, the way a browser resolves an <a href>.',
      params: [
        { name: 'base', type: 'str', hint: 'the page URL', input: 'text' },
        { name: 'url',  type: 'str', hint: 'the link',     input: 'text' },
      ],
      template: 'from urllib.parse import urljoin\nurljoin({$base}, {$url})',
      cases: [
        { id: 'sib',   label: 'sibling file',    values: { base: 'https://example.com/docs/guide.html', url: 'intro.html' } },
        { id: 'up',    label: '../',             values: { base: 'https://example.com/docs/guide/', url: '../api/' } },
        { id: 'root',  label: '/absolute path',  values: { base: 'https://example.com/docs/guide/', url: '/login' } },
        { id: 'host',  label: '//other host',    values: { base: 'https://example.com/docs/', url: '//cdn.example.net/app.js' } },
        { id: 'query', label: 'only a query',    values: { base: 'https://example.com/list?page=1', url: '?page=2' } },
        { id: 'abs',   label: 'full URL',        values: { base: 'https://example.com/docs/', url: 'mailto:help@example.com' } },
      ],
    },
    {
      id: 'slash',
      label: 'trailing slash',
      blurb: "The same link joined to the base as typed and to the base with a trailing '/'.",
      params: [
        { name: 'base', type: 'str', hint: 'an API base URL', input: 'text' },
        { name: 'url',  type: 'str', hint: 'a relative path', input: 'text' },
      ],
      template: "from urllib.parse import urljoin\n(urljoin({$base}, {$url}), urljoin({$base}.rstrip('/') + '/', {$url}))",
      cases: [
        { id: 'api',   label: 'API version',     values: { base: 'https://example.com/api/v1', url: 'users' } },
        { id: 'lead',  label: 'leading slash',   values: { base: 'https://example.com/api/v1/', url: '/users' } },
        { id: 'dots',  label: 'too many ../',    values: { base: 'https://example.com/a/', url: '../../../c' } },
      ],
    },
  ],
  demoExplainer: "Relative links are resolved against the base's directory: everything after the last '/' of the base path is dropped first. That is why 'https://example.com/api/v1' + 'users' gives /api/users, and why a link starting with '/' goes back to the host root. Extra ../ segments cannot climb above the root — they are ignored (RFC 3986, Python 3.5+).",

  patterns: [
    {
      name: 'Absolute links from scraped HTML',
      desc: 'Resolve every href against the URL the page was fetched from.',
      code: "from urllib.parse import urljoin\nlinks = [urljoin(page_url, a['href']) for a in anchors]",
    },
    {
      name: 'An API base URL',
      desc: "Keep the base ending in '/' and the endpoint without a leading '/'.",
      code: "from urllib.parse import urljoin\nAPI = 'https://api.example.com/v2/'\nurljoin(API, 'users/42')",
    },
    {
      name: 'Follow a redirect',
      desc: 'A Location header may be relative to the request URL.',
      code: "from urllib.parse import urljoin\nnext_url = urljoin(request_url, response.headers['Location'])",
    },
  ],

  examples: [
    { title: 'Base without a trailing slash', code: "from urllib.parse import urljoin\nurljoin('https://example.com/docs/guide', 'intro')",  returns: "'https://example.com/docs/intro'" },
    { title: 'Base with a trailing slash',    code: "from urllib.parse import urljoin\nurljoin('https://example.com/docs/guide/', 'intro')", returns: "'https://example.com/docs/guide/intro'" },
    { title: 'A leading slash resets the path', code: "from urllib.parse import urljoin\nurljoin('https://example.com/docs/guide/', '/intro')", returns: "'https://example.com/intro'" },
    { title: '../ goes up one level',         code: "from urllib.parse import urljoin\nurljoin('https://example.com/docs/guide/', '../api')", returns: "'https://example.com/docs/api'" },
    { title: '//host keeps only the scheme',  code: "from urllib.parse import urljoin\nurljoin('https://example.com/docs/', '//cdn.example.net/x.js')", returns: "'https://cdn.example.net/x.js'" },
    { title: 'A query replaces the query',    code: "from urllib.parse import urljoin\nurljoin('https://example.com/a/b?x=1', '?y=2')",      returns: "'https://example.com/a/b?y=2'" },
    { title: 'A fragment keeps the query',    code: "from urllib.parse import urljoin\nurljoin('https://example.com/a/b?x=1', '#frag')",     returns: "'https://example.com/a/b?x=1#frag'" },
    { title: 'str and bytes do not mix',      code: "from urllib.parse import urljoin\nurljoin(b'https://example.com/a/', 'b')",              returns: 'TypeError: Cannot mix str and non-str arguments' },
  ],

  pitfalls: [
    {
      name: 'An API base without a trailing slash',
      desc: "The last segment of the base is treated as a file name and replaced — v1 disappears from the URL.",
      wrong: { label: "'.../v1'",  code: "from urllib.parse import urljoin\nurljoin('https://example.com/api/v1', 'users')",  output: "'https://example.com/api/users'" },
      fix:   { label: "'.../v1/'", code: "from urllib.parse import urljoin\nurljoin('https://example.com/api/v1/', 'users')", output: "'https://example.com/api/v1/users'" },
    },
    {
      name: 'A leading slash on the endpoint',
      desc: 'A path that starts with / is absolute: it replaces the whole base path, trailing slash or not.',
      wrong: { label: "'/users'", code: "from urllib.parse import urljoin\nurljoin('https://example.com/api/v1/', '/users')", output: "'https://example.com/users'" },
      fix:   { label: "'users'",  code: "from urllib.parse import urljoin\nurljoin('https://example.com/api/v1/', 'users')",  output: "'https://example.com/api/v1/users'" },
    },
    {
      name: 'Trusting urljoin to keep you on your host',
      desc: 'A user-supplied link that is a full URL or starts with // replaces the host. Check the result before fetching or redirecting.',
      wrong: { label: 'user input',    code: "from urllib.parse import urljoin\nurljoin('https://example.com/app/', '//evil.example/x')", output: "'https://evil.example/x'" },
      fix:   { label: 'check netloc',  code: "from urllib.parse import urljoin, urlsplit\ntarget = urljoin('https://example.com/app/', '//evil.example/x')\nurlsplit(target).netloc == 'example.com'", output: 'False' },
    },
  ],

  when: {
    use: [
      'Turning links found in a page into absolute URLs',
      'Endpoint paths under an API base URL (base ending in /)',
      'Relative redirects (Location headers)',
    ],
    avoid: [
      'Joining file-system paths → os.path.join or pathlib',
      'Appending a query string → urlencode + _replace(query=...)',
      'Keeping user input on your own host without checking the result',
    ],
  },

  notes: {
    cpython:      'urljoin parses both URLs with urlparse, returns url unchanged if its scheme differs or is not in uses_relative, takes a netloc from url if present, and otherwise merges the paths and removes . and .. segments',
    'RFC 3986':   'Behaviour updated to match RFC 3986 in Python 3.5; surplus ../ segments are dropped',
    'Schemes':    "Only schemes in urllib.parse.uses_relative (http, https, ftp, file, ws, wss, …) are resolved; for others such as mailto: the link is returned as is",
  },

  related: [
    { name: 'urllib.parse.urlsplit', slug: 'urlsplit', when: 'Inspect the joined result' },
    { name: 'urllib.parse.urlparse', slug: 'urlparse', when: 'What urljoin uses to split both URLs' },
    { name: 'urllib.parse module',   slug: 'urllib-parse', when: 'Every URL tool at a glance', category: 'stdlib' },
    { name: 'os.path.join',          slug: 'join', when: 'Joining file paths, not URLs', category: 'stdlib/os-path' },
  ],

  faq: [
    {
      q: 'Why does urljoin drop the last part of my base URL?',
      a: "Because without a trailing '/', the last segment is a file name: urljoin('https://x.com/api/v1', 'users') resolves 'users' next to 'v1' and gives 'https://x.com/api/users'. End the base with '/' to keep it.",
    },
    {
      q: 'Why does urljoin ignore my base path when the second argument starts with /?',
      a: "A path starting with '/' is absolute: it keeps the scheme and host of the base and replaces the entire path. Remove the leading slash to join under the base path.",
    },
    {
      q: 'How do I join URL parts in Python?',
      a: "For resolving a link use urljoin(base, link). To combine a base and an endpoint, make the base end in '/' and the endpoint not start with '/'. For path segments from user data, quote each one with quote(segment, safe='').",
    },
    {
      q: 'What is the Python equivalent of JavaScript new URL(relative, base)?',
      a: 'urljoin(base, relative). Both resolve relative references by RFC 3986 rules, though urljoin does not validate or normalise the URL the way the WHATWG URL parser does.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urljoin',
    meta:  'urllib.parse.urljoin',
  },

};
