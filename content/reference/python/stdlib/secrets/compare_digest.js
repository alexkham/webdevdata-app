// content/reference/python/stdlib/secrets/compare_digest.js

export const meta = {
  slug:        'compare_digest',
  name:        'secrets.compare_digest',
  signature:   'secrets.compare_digest(a, b)',
  blurb:       'Constant-time equality check for secrets — tokens, API keys, HMAC signatures, password hashes — so response timing does not reveal how much of a guess was right.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.compare_digest compare_digest hmac.compare_digest python constant time comparison timing attack verify hmac signature webhook signature verification compare tokens securely comparing strings with non-ASCII characters is not supported a bytes-like object is required',
};

export const method = {
  slug:      'compare_digest',
  name:      'secrets.compare_digest',
  signature: 'secrets.compare_digest(a, b)',
  returns:   { type: 'bool', desc: 'a == b, computed without an early exit.' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'Same answer as ==, different timing: == may stop at the first character that differs, so a fast "no" leaks that the start of a guess was wrong. compare_digest takes the same time wherever the difference is. Both arguments must be the same kind: two ASCII-only str, or two bytes-like objects.',

  covers: ['compare_digest'],

  cheat: {
    commonCall: 'secrets.compare_digest(received_signature, expected_signature)',
    returns:    'True or False, like ==',
    replaces:   '== on tokens, signatures, API keys and password hashes',
    watchOut:   'str must be ASCII-only; never mix str and bytes',
  },

  parameters: [
    { name: 'a', type: 'str | bytes-like', required: true, default: null, desc: 'The value you expect (or the one received — order does not matter for the result). A str must contain only ASCII characters.' },
    { name: 'b', type: 'str | bytes-like', required: true, default: null, desc: 'The value to check, of the same kind as a: str with str, bytes / bytearray / memoryview with bytes-like.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'compare text',
      blurb: 'Two str values: the result is the same as ==, but only ASCII text is accepted.',
      params: [
        { name: 'a', type: 'str', hint: 'expected', input: 'text' },
        { name: 'b', type: 'str', hint: 'received', input: 'text' },
      ],
      template: 'import secrets\nsecrets.compare_digest({$a}, {$b})',
      cases: [
        { id: 'same',  label: 'equal',            values: { a: 'f9bf78b9a18ce6d4', b: 'f9bf78b9a18ce6d4' } },
        { id: 'last',  label: 'last char differs', values: { a: 'f9bf78b9a18ce6d4', b: 'f9bf78b9a18ce6d5' } },
        { id: 'short', label: 'shorter',          values: { a: 'f9bf78b9a18ce6d4', b: 'f9bf' } },
        { id: 'empty', label: 'both empty',       values: { a: '', b: '' } },
        { id: 'utf8',  label: 'non-ASCII',        values: { a: 'Zoë', b: 'Zoë' } },
      ],
    },
    {
      id: 'hmac',
      label: 'verify a signature',
      blurb: 'A webhook-style check: recompute HMAC-SHA256 of the message with the shared key and compare it with the signature that arrived.',
      params: [
        { name: 'message',   type: 'str', hint: 'request body',        input: 'text' },
        { name: 'signature', type: 'str', hint: 'signature received', input: 'text' },
      ],
      template: "import hashlib, hmac, secrets\nexpected = hmac.new(b'server-key', {$message}.encode(), hashlib.sha256).hexdigest()\nsecrets.compare_digest(expected, {$signature})",
      cases: [
        { id: 'valid',    label: 'valid',            values: { message: 'order=42&amount=19.99', signature: 'f7d2c645a30754e4f8fd7778413269497fe88a50dadd6f730383620a333a465c' } },
        { id: 'tampered', label: 'amount changed',   values: { message: 'order=42&amount=0.01', signature: 'f7d2c645a30754e4f8fd7778413269497fe88a50dadd6f730383620a333a465c' } },
        { id: 'upper',    label: 'uppercase hex',    values: { message: 'order=42&amount=19.99', signature: 'F7D2C645A30754E4F8FD7778413269497FE88A50DADD6F730383620A333A465C' } },
      ],
    },
    {
      id: 'bytes',
      label: 'compare bytes',
      blurb: 'Encode both sides first and any text works, non-ASCII included.',
      params: [
        { name: 'a', type: 'str', hint: 'expected', input: 'text' },
        { name: 'b', type: 'str', hint: 'received', input: 'text' },
      ],
      template: 'import secrets\nsecrets.compare_digest({$a}.encode(), {$b}.encode())',
      cases: [
        { id: 'same', label: 'Zoë / Zoë', values: { a: 'Zoë', b: 'Zoë' } },
        { id: 'diff', label: 'Zoë / Zoe', values: { a: 'Zoë', b: 'Zoe' } },
      ],
    },
  ],
  demoExplainer: 'compare_digest answers exactly what == would. It refuses str with non-ASCII characters (TypeError: comparing strings with non-ASCII characters is not supported), while the same text encoded to UTF-8 bytes compares fine. In the signature tab the valid signature matches; changing the amount in the message, or sending the hex digest in uppercase, makes the check fail — normalise case before comparing if a sender uses uppercase hex.',

  patterns: [
    {
      name: 'Verify a webhook signature',
      desc: "Many providers send 'sha256=' + hex HMAC of the raw body in a header.",
      code: "import hashlib, hmac, secrets\nexpected = 'sha256=' + hmac.new(WEBHOOK_SECRET, raw_body, hashlib.sha256).hexdigest()\nif not secrets.compare_digest(expected, request.headers.get('X-Signature', '')):\n    raise PermissionError('bad signature')",
    },
    {
      name: 'Check an API key',
      desc: 'Store a hash of the key; hash what arrives and compare the digests.',
      code: "import hashlib, secrets\nok = secrets.compare_digest(hashlib.sha256(submitted.encode()).digest(), stored_key_hash)",
    },
    {
      name: 'Check a password',
      desc: 'Re-derive with the stored salt and iteration count, compare the derived keys.',
      code: "import hashlib, secrets\nattempt = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, iterations)\nok = secrets.compare_digest(attempt, stored_key)",
    },
  ],

  examples: [
    { title: 'Equal tokens',                  code: "import secrets\nsecrets.compare_digest('token-1', 'token-1')", returns: 'True' },
    { title: 'Different lengths',             code: "import secrets\nsecrets.compare_digest('abc', 'abcd')", returns: 'False' },
    { title: 'bytes work too',                code: "import secrets\nsecrets.compare_digest(b'\\x00\\x01', bytearray(b'\\x00\\x01'))", returns: 'True' },
    { title: 'Same function as hmac.compare_digest', code: 'import hmac, secrets\nsecrets.compare_digest is hmac.compare_digest', returns: 'True' },
    { title: 'Verify an HMAC-SHA256 signature', code: "import hashlib, hmac, secrets\nsig = 'a91933a1513544fc71f013698d45da97a057f071ed6241c3d01ea1371bb67c9b'\nsecrets.compare_digest(hmac.new(b'server-key', b'order=42', hashlib.sha256).hexdigest(), sig)", returns: 'True' },
    { title: 'Non-ASCII str is refused',      code: "import secrets\nsecrets.compare_digest('café', 'café')", returns: 'TypeError: comparing strings with non-ASCII characters is not supported' },
    { title: 'str and bytes do not mix',      code: "import secrets\nsecrets.compare_digest('abc', b'abc')", returns: "TypeError: a bytes-like object is required, not 'str'" },
    { title: 'Not for numbers',               code: 'import secrets\nsecrets.compare_digest(1, 1)', returns: "TypeError: unsupported operand types(s) or combination of types: 'int' and 'int'" },
  ],

  pitfalls: [
    {
      name: 'Mixing a hex str with bytes',
      desc: 'hexdigest() returns str, digest() returns bytes, and a header value is str. Compare like with like.',
      wrong: { label: 'str vs bytes', code: "import hashlib, hmac, secrets\nexpected = hmac.new(b'k', b'msg', hashlib.sha256).hexdigest()\nsecrets.compare_digest(expected, expected.encode())", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'str vs str',   code: "import hashlib, hmac, secrets\nexpected = hmac.new(b'k', b'msg', hashlib.sha256).hexdigest()\nsecrets.compare_digest(expected, expected.encode().decode())", output: 'True' },
    },
    {
      name: 'Comparing non-ASCII text',
      desc: 'str arguments must be pure ASCII. Encode both sides to bytes.',
      wrong: { label: 'str', code: "import secrets\nsecrets.compare_digest('Zoë', 'Zoë')", output: 'TypeError: comparing strings with non-ASCII characters is not supported' },
      fix:   { label: 'bytes', code: "import secrets\nsecrets.compare_digest('Zoë'.encode(), 'Zoë'.encode())", output: 'True' },
    },
    {
      name: 'Checking secrets with ==',
      desc: 'The result is the same, so the bug is invisible in tests. The difference is timing: == can return as soon as one character differs, which lets an attacker guess a token one character at a time.',
      wrong: { label: '==',             code: "stored = 'f9bf78b9a18ce6d4'\nstored == 'f9bf78b9a18ce6d5'", output: 'False' },
      fix:   { label: 'compare_digest', code: "import secrets\nstored = 'f9bf78b9a18ce6d4'\nsecrets.compare_digest(stored, 'f9bf78b9a18ce6d5')", output: 'False' },
    },
  ],

  when: {
    use: [
      'Checking tokens, API keys, session IDs, reset codes',
      'Verifying HMAC signatures: webhooks, signed cookies, HS256 tokens',
      'Comparing password hashes from pbkdf2_hmac or scrypt',
    ],
    avoid: [
      'Non-secret data — == is clearer and just as correct',
      'Raw passwords — derive a key (pbkdf2_hmac / scrypt) and compare the keys',
      'Ordering or sorting — it only answers equality',
    ],
  },

  notes: {
    cpython:     'secrets.py does from hmac import compare_digest, so secrets.compare_digest is hmac.compare_digest. hmac.py takes it from _hashlib (the OpenSSL module) when that is available, otherwise from the C module _operator (_compare_digest); both follow the same rules',
    'Timing':    'The docs: with different lengths, or on an error, a timing attack could in theory learn the types and lengths of a and b — but not their values',
    'Types':     'Two str (ASCII only) or two objects supporting the buffer protocol (bytes, bytearray, memoryview). Anything else raises TypeError',
    'Versions':  'hmac.compare_digest since 3.3; the secrets alias since 3.6',
  },

  related: [
    { name: 'secrets.token_urlsafe', slug: 'token_urlsafe', when: 'Generate the token you will check' },
    { name: 'secrets.token_hex',     slug: 'token_hex',     when: 'API keys to check' },
    { name: 'hashlib.pbkdf2_hmac',   slug: 'pbkdf2_hmac',   when: 'Derive keys to compare at login', category: 'stdlib/hashlib' },
    { name: 'hashlib.sha256',        slug: 'sha256',        when: 'The hash inside HMAC-SHA256',     category: 'stdlib/hashlib' },
    { name: 'hashlib.blake2b',       slug: 'blake2b-blake2s', when: 'Keyed hashing without hmac',    category: 'stdlib/hashlib' },
    { name: 'TypeError',             slug: 'typeerror',     when: 'Mixed or non-ASCII arguments',    category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why use compare_digest instead of ==?',
      a: '== on str or bytes can stop at the first differing character, so a wrong guess that shares a longer prefix with the secret takes measurably longer to reject. Repeated over many requests, that lets an attacker recover a token one character at a time. compare_digest takes the same time wherever the difference is.',
    },
    {
      q: 'How do I verify an HMAC signature in Python?',
      a: 'Recompute it — hmac.new(key, raw_body, hashlib.sha256).hexdigest() — and compare with the received value using secrets.compare_digest (or hmac.compare_digest). Use the exact raw bytes that were signed, not re-serialised JSON.',
    },
    {
      q: 'What does "TypeError: comparing strings with non-ASCII characters is not supported" mean?',
      a: 'compare_digest accepts str only if both strings are pure ASCII. Encode both to bytes (a.encode(), b.encode()) and compare those.',
    },
    {
      q: 'Is secrets.compare_digest the same as hmac.compare_digest?',
      a: 'Yes, it is the same function object: secrets imports it from hmac. Use whichever module you already import.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.compare_digest',
    meta:  'secrets.compare_digest',
  },

};
