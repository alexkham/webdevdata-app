// content/reference/python/stdlib/secrets/token_hex.js

export const meta = {
  slug:        'token_hex',
  name:        'secrets.token_hex',
  signature:   'secrets.token_hex(nbytes=None)',
  blurb:       'A random hexadecimal string carrying nbytes bytes of randomness: 2 × nbytes characters from 0-9 and a-f. The usual choice for API keys, secret keys and IDs stored as text.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.token_hex token_hex python random hex string generate api key python secure random string hex token length 32 characters 64 characters secret key generator django secret key token_hex vs uuid4',
};

export const method = {
  slug:      'token_hex',
  name:      'secrets.token_hex',
  signature: 'secrets.token_hex(nbytes=None)',
  returns:   { type: 'str', desc: 'A lowercase hex string of 2 × nbytes characters (64 for the default), different on every call.' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'nbytes counts bytes of randomness, not characters: every byte becomes two hex digits, so token_hex(16) is 32 characters long and token_hex() is 64. The result is plain ASCII, safe in URLs, file names, headers and databases.',

  covers: ['token_hex'],

  cheat: {
    commonCall: 'secrets.token_hex(16)',
    returns:    "a 32-character str such as 'f9bf78b9a18ce6d46a0cd2b0b86df9da' (different every time)",
    replaces:   'os.urandom(n).hex(), binascii.hexlify(os.urandom(n)), uuid4().hex for secrets',
    watchOut:   'The argument is bytes: token_hex(32) is 64 characters long',
  },

  parameters: [
    { name: 'nbytes', type: 'int | None', required: false, default: 'None', desc: 'Bytes of randomness; the string is twice as long. None (or no argument) uses secrets.DEFAULT_ENTROPY, 32 in CPython 3.13. Negative raises ValueError; a float raises TypeError.' },
  ],

  modes: [
    {
      id: 'length',
      label: 'length and alphabet',
      blurb: 'The token changes on every run; its length and alphabet do not. Leave nbytes empty for None.',
      params: [{ name: 'nbytes', type: 'int | None', hint: 'bytes of randomness', input: 'number-or-none' }],
      template: "import secrets\nt = secrets.token_hex({$nbytes})\n(len(t), set(t) <= set('0123456789abcdef'))",
      cases: [
        { id: 'sixteen', label: '16',   values: { nbytes: '16' } },
        { id: 'default', label: 'None', values: { nbytes: '' } },
        { id: 'four',    label: '4',    values: { nbytes: '4' } },
        { id: 'zero',    label: '0',    values: { nbytes: '0' } },
        { id: 'neg',     label: '-1',   values: { nbytes: '-1' } },
      ],
    },
    {
      id: 'bits',
      label: 'characters, bits, bytes',
      blurb: 'Each hex character carries 4 bits. bytes.fromhex turns the text back into the nbytes random bytes.',
      params: [{ name: 'nbytes', type: 'int', hint: 'bytes of randomness', input: 'number' }],
      template: 'import secrets\nt = secrets.token_hex({$nbytes})\n(len(t), len(t) * 4, len(bytes.fromhex(t)))',
      cases: [
        { id: 'eight',   label: '8',  values: { nbytes: '8' } },
        { id: 'sixteen', label: '16', values: { nbytes: '16' } },
        { id: 'big',     label: '32', values: { nbytes: '32' } },
      ],
    },
  ],
  demoExplainer: 'token_hex(16) is 32 characters carrying 128 bits; None means DEFAULT_ENTROPY, 32 bytes, so 64 characters and 256 bits. Zero gives the empty string, and a negative count raises ValueError: negative argument not allowed (the message comes from os.urandom). Only the digits 0-9 and the lowercase letters a-f ever appear.',

  patterns: [
    {
      name: 'API key with a recognisable prefix',
      desc: 'A prefix tells humans and secret scanners what the key is for.',
      code: "import secrets\napi_key = 'sk_live_' + secrets.token_hex(24)",
    },
    {
      name: 'Secret key for a web framework',
      desc: 'Generate once, store in the environment, never in the repository.',
      code: '# shell:\n# python -c "import secrets; print(secrets.token_hex(32))"',
    },
    {
      name: 'Unguessable file name for an upload',
      desc: 'Keep the extension, replace the user-supplied name.',
      code: "import secrets\nfrom pathlib import Path\nstored_name = secrets.token_hex(16) + Path(upload_name).suffix.lower()",
    },
    {
      name: 'Hex secret as bytes again',
      desc: 'Read a hex key from config and use it as an HMAC key.',
      code: "import hashlib, hmac, os\nkey = bytes.fromhex(os.environ['SIGNING_KEY'])\nsig = hmac.new(key, payload, hashlib.sha256).hexdigest()",
    },
  ],

  examples: [
    { title: 'Two hex digits per byte',        code: 'import secrets\nlen(secrets.token_hex(16))', returns: '32' },
    { title: 'Default: 32 bytes, 64 digits',   code: 'import secrets\nlen(secrets.token_hex())', returns: '64' },
    { title: 'Only 0-9 and a-f',               code: "import secrets\nset(secrets.token_hex(64)) <= set('0123456789abcdef')", returns: 'True' },
    { title: 'Back to the random bytes',       code: 'import secrets\nlen(bytes.fromhex(secrets.token_hex(16)))', returns: '16' },
    { title: 'As a number: below 2**64',       code: 'import secrets\nint(secrets.token_hex(8), 16) < 2**64', returns: 'True' },
    { title: 'Zero bytes, empty string',       code: 'import secrets\nsecrets.token_hex(0)', returns: "''" },
    { title: 'A prefixed API key',             code: "import secrets\nkey = 'sk_' + secrets.token_hex(24)\nlen(key)", returns: '51' },
  ],

  pitfalls: [
    {
      name: 'Passing the number of characters',
      desc: 'nbytes is the amount of randomness; the text is twice as long. For a 32-character key ask for 16 bytes.',
      wrong: { label: 'token_hex(32) for 32 chars', code: 'import secrets\nlen(secrets.token_hex(32))', output: '64' },
      fix:   { label: 'token_hex(16)',              code: 'import secrets\nlen(secrets.token_hex(16))', output: '32' },
    },
    {
      name: 'Building hex tokens with random',
      desc: 'random is a seeded Mersenne Twister: the same seed (or enough observed outputs) reproduces every "token". token_hex reads the operating system\'s secure source and cannot be replayed.',
      wrong: { label: 'random.Random(7)', code: "import random\na = '%016x' % random.Random(7).getrandbits(64)\nb = '%016x' % random.Random(7).getrandbits(64)\na == b", output: 'True' },
      fix:   { label: 'secrets.token_hex', code: 'import secrets\nsecrets.token_hex(8) == secrets.token_hex(8)', output: 'False' },
    },
  ],

  when: {
    use: [
      'API keys, secret keys and IDs stored or sent as text',
      'Unguessable file names, cache-busting keys, nonces in text protocols',
      'Anywhere a case-insensitive or very restricted alphabet is required',
    ],
    avoid: [
      'Shorter text for the same randomness → token_urlsafe (about 1.33 characters per byte instead of 2)',
      'Raw key material for hashlib / hmac → token_bytes',
      'IDs that only need to be unique, not secret → uuid.uuid4()',
    ],
  },

  notes: {
    cpython:   'return token_bytes(nbytes).hex() — Lib/secrets.py; the bytes come from os.urandom via SystemRandom.randbytes',
    'Length':  'Always exactly 2 × nbytes lowercase characters, so the length itself reveals nothing',
    'Entropy': '4 bits per character: 16 bytes = 32 characters = 128 bits',
  },

  related: [
    { name: 'secrets.token_urlsafe',  slug: 'token_urlsafe',  when: 'Same randomness, shorter text' },
    { name: 'secrets.token_bytes',    slug: 'token_bytes',    when: 'Same randomness as raw bytes' },
    { name: 'secrets.compare_digest', slug: 'compare_digest', when: 'Check a submitted key' },
    { name: 'bytes.hex()',            slug: 'bytes-hex',      when: 'What token_hex does to the random bytes', category: 'functions' },
    { name: 'bytes.fromhex()',        slug: 'bytes-fromhex',  when: 'Turn a hex key back into bytes',           category: 'functions' },
    { name: 'uuid.uuid4',             slug: 'uuid4',          when: 'Random IDs with a fixed format',           category: 'stdlib/uuid' },
  ],

  faq: [
    {
      q: 'How long is secrets.token_hex(16)?',
      a: '32 characters: each of the 16 random bytes becomes two hex digits. token_hex() with no argument uses 32 bytes and returns 64 characters.',
    },
    {
      q: 'How do I generate a random API key in Python?',
      a: "secrets.token_hex(32) (64 hex characters) or secrets.token_urlsafe(32) (43 characters). Add a prefix such as 'sk_live_' so the key is recognisable, store only a hash of it on the server, and check submitted keys with secrets.compare_digest.",
    },
    {
      q: 'Should I use token_hex or uuid4().hex?',
      a: 'uuid4().hex is also 32 hex characters, but 6 of its 128 bits are fixed version and variant bits, so it carries 122 random bits; its purpose is uniqueness. token_hex(16) carries 128 random bits and states that the value is a secret. Both read os.urandom in CPython.',
    },
    {
      q: 'Is secrets.token_hex cryptographically secure?',
      a: 'Yes. It hex-encodes bytes from os.urandom, the operating system\'s cryptographically secure generator, and has no seed that could be guessed or reused.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.token_hex',
    meta:  'secrets.token_hex',
  },

};
