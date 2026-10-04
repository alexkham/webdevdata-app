// content/reference/python/stdlib/uuid/main.js — uuid.main / python -m uuid

export const meta = {
  slug:        'main',
  name:        'uuid.main',
  signature:   'python -m uuid [-h] [-u {uuid1,uuid3,uuid4,uuid5}] [-n NAMESPACE] [-N NAME]',
  blurb:       'The command-line interface: python -m uuid prints a new UUID (uuid4 by default), or a name-based one with -u uuid5 -n @dns -N name.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.12+',
  searchTerms: 'python -m uuid uuid command line generate uuid terminal uuid cli uuid.main uuidgen python uuid5 command line -u uuid5 -n @dns -N name @url @oid @x500',
};

export const method = {
  slug:      'main',
  name:      'uuid.main',
  signature: 'python -m uuid [-h] [-u {uuid1,uuid3,uuid4,uuid5}] [-n NAMESPACE] [-N NAME]',
  returns:   { type: 'None', desc: 'Prints one UUID to stdout; argument errors exit with status 2.' },

  category:    'uuid function',
  version:     'Python 3.12+',
  hasLiveDemo: false,

  subtitle: 'A uuidgen that ships with Python. Random output has nothing to demo live, so the examples call uuid.main() with a patched sys.argv to show the deterministic uuid3/uuid5 forms. -n takes a UUID or one of @dns, @url, @oid, @x500.',

  covers: ['main'],

  cheat: {
    commonCall: 'python -m uuid',
    returns:    'a new uuid4 printed as text',
    replaces:   'uuidgen, or python -c "import uuid; print(uuid.uuid4())"',
    watchOut:   'uuid3/uuid5 need both -n and -N, or it exits with an error',
  },

  parameters: [
    { name: '-u, --uuid',      type: 'uuid1 | uuid3 | uuid4 | uuid5', required: false, default: 'uuid4', desc: 'Which function to call. 3.14 adds uuid6, uuid7 and uuid8.' },
    { name: '-n, --namespace', type: 'str', required: false, default: 'None', desc: 'For uuid3/uuid5: a UUID string or @dns, @url, @oid, @x500.' },
    { name: '-N, --name',      type: 'str', required: false, default: 'None', desc: 'For uuid3/uuid5: the name to hash.' },
  ],

  examples: [
    { title: 'uuid5 from the command line', code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid5', '-n', '@dns', '-N', 'python.org']):\n    uuid.main()", returns: '886313e1-3b8a-5372-9b90-0c9aee199e5d' },
    { title: 'uuid3 with @url',              code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid3', '-n', '@url', '-N', 'https://example.com/']):\n    uuid.main()", returns: 'b9dcdff8-af4a-365d-8043-0f8361942709' },
    { title: 'A namespace given as a UUID', code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid5', '-n', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', '-N', 'python.org']):\n    uuid.main()", returns: '886313e1-3b8a-5372-9b90-0c9aee199e5d' },
    { title: 'Same as calling uuid5',        code: "import uuid\nprint(uuid.uuid5(uuid.NAMESPACE_DNS, 'python.org'))", returns: '886313e1-3b8a-5372-9b90-0c9aee199e5d' },
    { title: 'Default output: one uuid4 line', code: "import io, sys, uuid\nfrom contextlib import redirect_stdout\nfrom unittest import mock\nbuf = io.StringIO()\nwith mock.patch.object(sys, 'argv', ['uuid']), redirect_stdout(buf):\n    uuid.main()\nuuid.UUID(buf.getvalue().strip()).version", returns: '4' },
  ],

  pitfalls: [
    {
      name: 'Forgetting -N (or -n) for uuid5',
      desc: 'Without both, argparse prints "uuid5 requires a namespace and a name" to stderr and exits with status 2.',
      wrong: { label: 'no name', code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid5', '-n', '@dns']), mock.patch.object(sys, 'stderr'):\n    try:\n        uuid.main()\n    except SystemExit as e:\n        print('exit status', e.code)", output: 'exit status 2' },
      fix:   { label: 'with -N', code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid5', '-n', '@dns', '-N', 'python.org']):\n    uuid.main()", output: '886313e1-3b8a-5372-9b90-0c9aee199e5d' },
    },
    {
      name: 'Unknown namespace shortcut',
      desc: 'Only @dns, @url, @oid and @x500 are shortcuts; anything else is parsed as a UUID string.',
      wrong: { label: '-n @email', code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid5', '-n', '@email', '-N', 'ada']):\n    uuid.main()", output: 'ValueError: badly formed hexadecimal UUID string' },
      fix:   { label: '-n @url', code: "import sys, uuid\nfrom unittest import mock\nwith mock.patch.object(sys, 'argv', ['uuid', '-u', 'uuid5', '-n', '@url', '-N', 'mailto:ada@example.com']):\n    uuid.main()", output: '3d21f9ee-d85e-5a10-bda2-dff7da80567a' },
    },
  ],

  patterns: [
    {
      name: 'Random UUID in a shell',
      desc: 'uuid4 is the default.',
      code: '# shell:\n# python -m uuid',
    },
    {
      name: 'Name-based UUID in a shell',
      desc: 'Same result as uuid.uuid5(uuid.NAMESPACE_URL, "example.com").',
      code: '# shell:\n# python -m uuid -u uuid5 -n @url -N example.com',
    },
    {
      name: 'Several UUIDs (3.14: -C)',
      desc: 'Before 3.14, loop in the shell or in Python.',
      code: '# shell, 3.14+:\n# python -m uuid -C 5\nimport uuid\nfor _ in range(5):\n    print(uuid.uuid4())',
    },
  ],

  when: {
    use: [
      'Generating an ID by hand in a terminal, CI script or Makefile',
      'Computing a uuid5/uuid3 for a name without writing code',
    ],
    avoid: [
      'Inside Python programs → call uuid.uuid4() / uuid.uuid5() directly',
      'Python 3.11 and older → python -c "import uuid; print(uuid.uuid4())"',
    ],
  },

  notes: {
    cpython:   'def main() in Lib/uuid.py builds an argparse parser; with uuid3/uuid5 it maps @dns/@url/@oid/@x500 to the NAMESPACE_* constants, else calls UUID(namespace), and prints the result',
    'Version': 'Command-line usage was added in 3.12. 3.14 adds -C/--count and the uuid6, uuid7, uuid8 choices (docs.python.org 3.14)',
    'Errors':  'Missing -n/-N for uuid3/uuid5 → parser.error, exit status 2; an invalid namespace string → ValueError traceback',
  },

  related: [
    { name: 'uuid.uuid4', slug: 'uuid4', when: 'What the default prints' },
    { name: 'uuid3 / uuid5', slug: 'uuid3-uuid5', when: 'What -u uuid3 / uuid5 call' },
    { name: 'NAMESPACE_DNS / URL / OID / X500', slug: 'namespaces', when: 'What @dns, @url, @oid, @x500 stand for' },
    { name: 'SystemExit', slug: 'systemexit', when: 'How argument errors end the program', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I generate a UUID from the command line with Python?',
      a: 'python -m uuid prints a random uuid4 (Python 3.12+). For a name-based one: python -m uuid -u uuid5 -n @dns -N example.com.',
    },
    {
      q: 'Why does python -m uuid fail on my Python?',
      a: 'The command-line interface was added in 3.12. On older versions use python -c "import uuid; print(uuid.uuid4())".',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid-cli',
    meta:  'Command-Line Usage',
  },
};
