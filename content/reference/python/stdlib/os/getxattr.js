// content/reference/python/stdlib/os/getxattr.js

export const meta = {
  slug:        'getxattr',
  name:        'os.getxattr',
  signature:   'os.getxattr(path, attribute, *, follow_symlinks=True) / setxattr / listxattr / removexattr',
  blurb:       'Read, write, list and delete Linux extended attributes - small named byte values stored with a file (user.*, security.*, trusted.*, system.*).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'os.getxattr getxattr os.setxattr setxattr os.listxattr listxattr os.removexattr removexattr os.XATTR_CREATE XATTR_CREATE os.XATTR_REPLACE XATTR_REPLACE os.XATTR_SIZE_MAX XATTR_SIZE_MAX extended attributes python linux xattr user namespace file metadata tags ENODATA',
};

export const method = {
  slug:      'getxattr',
  name:      'os.getxattr',
  signature: 'os.getxattr(path, attribute, *, follow_symlinks=True) / setxattr / listxattr / removexattr',
  returns:   { type: 'bytes | list[str] | None', desc: 'getxattr returns the value as bytes, listxattr a list of attribute names as str; setxattr and removexattr return None.' },

  category:    'os function',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: "Linux only - these functions and constants do not exist on Windows or macOS. Names carry a namespace prefix (unprivileged code uses 'user.'), values are bytes up to XATTR_SIZE_MAX (64 KiB on Linux), and the filesystem must support them.",

  covers: ['getxattr', 'setxattr', 'listxattr', 'removexattr', 'XATTR_CREATE', 'XATTR_REPLACE', 'XATTR_SIZE_MAX'],

  cheat: {
    commonCall: "os.setxattr(path, 'user.tag', b'blue')",
    returns:    "os.getxattr(path, 'user.tag') → b'blue'",
    replaces:   'getfattr / setfattr command-line calls',
    watchOut:   "Values must be bytes; names need a namespace like 'user.'",
  },

  parameters: [
    { name: 'path',            type: 'str | bytes | PathLike | int', required: true,  default: null,   desc: 'The file (or an open file descriptor). listxattr: None examines the current directory.' },
    { name: 'attribute',       type: 'str | bytes | PathLike', required: true, default: null, desc: "Attribute name including its namespace, e.g. 'user.tag'. str is encoded with the filesystem encoding." },
    { name: 'value',           type: 'bytes-like', required: true, default: null, desc: 'setxattr: the new value; a str raises TypeError.' },
    { name: 'flags',           type: 'int',  required: false, default: '0',    desc: 'setxattr: 0 (create or replace), XATTR_CREATE (must not exist yet) or XATTR_REPLACE (must already exist).' },
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True', desc: 'False reads/writes the attributes of a symlink itself.' },
  ],

  patterns: [
    {
      name: 'Tag a file (Linux)',
      desc: 'Store, read back, list and remove a user attribute.',
      code: "import os\nos.setxattr('photo.jpg', 'user.rating', b'5')\nos.getxattr('photo.jpg', 'user.rating')   # b'5'\nos.listxattr('photo.jpg')                   # ['user.rating']\nos.removexattr('photo.jpg', 'user.rating')",
    },
    {
      name: 'Create only if absent',
      desc: 'XATTR_CREATE raises FileExistsError instead of overwriting.',
      code: "import os\ntry:\n    os.setxattr(path, 'user.origin', b'import', os.XATTR_CREATE)\nexcept FileExistsError:\n    pass",
    },
    {
      name: 'Optional metadata, portable',
      desc: 'Fall back cleanly where xattrs do not exist, are not supported, or are absent.',
      code: "import os\ndef get_tag(path):\n    if not hasattr(os, 'getxattr'):\n        return None\n    try:\n        return os.getxattr(path, 'user.tag').decode()\n    except OSError:\n        return None",
    },
  ],

  examples: [
    { title: 'A guarded reader works everywhere', code: "import os\ndef get_tag(path):\n    if not hasattr(os, 'getxattr'):\n        return None\n    try:\n        return os.getxattr(path, 'user.tag')\n    except OSError:\n        return None\nopen('f.txt', 'w').close()\nget_tag('f.txt') is None", returns: 'True' },
    { title: 'Names have a namespace',            code: "'user.comment'.partition('.')", returns: "('user', '.', 'comment')" },
    { title: 'str names become bytes',            code: "import os\nos.fsencode('user.tag')", returns: "b'user.tag'" },
    { title: 'Values are bytes',                  code: "import json\nvalue = json.dumps({'rating': 5}).encode()\n(value, len(value) <= 65536)", returns: "(b'{\"rating\": 5}', True)" },
    { title: 'What XATTR_CREATE raises',          code: "import errno\ntype(OSError(errno.EEXIST, 'File exists')).__name__", returns: "'FileExistsError'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting the namespace',
      desc: "A bare name such as 'tag' is rejected by Linux (OSError, errno EOPNOTSUPP). Ordinary users can only write the 'user.' namespace.",
      wrong: { label: "'tag'",      code: "name = 'tag'\nname.split('.', 1)[0] in ('user', 'trusted', 'security', 'system')",      output: 'False' },
      fix:   { label: "'user.tag'", code: "name = 'user.tag'\nname.split('.', 1)[0] in ('user', 'trusted', 'security', 'system')", output: 'True' },
    },
    {
      name: 'Storing a value larger than the limit',
      desc: 'On Linux a value over XATTR_SIZE_MAX (65536 bytes) fails with OSError (errno E2BIG). Check the size, or store a reference instead.',
      wrong: { label: '70000 bytes', code: "value = b'x' * 70000\nlen(value) <= 65536", output: 'False' },
      fix:   { label: 'small value', code: "import hashlib\nvalue = hashlib.sha256(b'x' * 70000).hexdigest().encode()\nlen(value) <= 65536", output: 'True' },
    },
  ],

  when: {
    use: [
      'Small per-file metadata on Linux: tags, checksums, origin markers',
      'Reading security labels and ACL data (the security.* and system.* namespaces)',
    ],
    avoid: [
      'Portable metadata → a sidecar file or a database',
      'Data that must survive copies to other filesystems, zip files or cloud storage - attributes are often dropped',
      'macOS extended attributes → not exposed by os (third-party packages)',
    ],
  },

  notes: {
    cpython:        'getxattr/lgetxattr/fgetxattr and the matching set/list/remove calls in Modules/posixmodule.c, chosen by follow_symlinks and whether path is an fd',
    'Availability': 'Linux only (the docs: "These functions are all available on Linux only"), added in 3.3. None of these names exist on Windows (verified)',
    'Values':       'XATTR_CREATE = 1, XATTR_REPLACE = 2, XATTR_SIZE_MAX = 65536 (CPython 3.12 on Linux)',
    'Errors (Linux)': 'getxattr of a missing name and setxattr with XATTR_REPLACE on a missing name: OSError errno 61 (ENODATA). XATTR_CREATE on an existing name: FileExistsError. Name without namespace: OSError errno 95. Value over 64 KiB: OSError errno 7 (verified on an ext4-type filesystem)',
  },

  related: [
    { name: 'os.stat', slug: 'stat', when: 'The standard metadata (size, times, mode)' },
    { name: 'os.chmod', slug: 'chmod', when: 'Permission bits instead of attributes' },
    { name: 'OSError', slug: 'oserror', when: 'What unsupported or missing attributes raise', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why is os.getxattr missing on my machine?',
      a: 'The extended-attribute functions are Linux only - Windows and macOS builds of Python do not define them. The examples therefore show the naming and value rules and a hasattr-guarded reader instead of calling them.',
    },
    {
      q: 'How do I set an extended attribute in Python?',
      a: "os.setxattr(path, 'user.name', b'value') on Linux. The value must be bytes (a str raises TypeError) and the name needs a namespace prefix; unprivileged code uses 'user.'.",
    },
    {
      q: 'What does "OSError: [Errno 61] No data available" mean?',
      a: 'The attribute does not exist on that file (ENODATA). getxattr raises it for missing names, and setxattr does with XATTR_REPLACE when there is nothing to replace.',
    },
    {
      q: 'What is the difference between XATTR_CREATE and XATTR_REPLACE?',
      a: 'XATTR_CREATE fails (FileExistsError) if the attribute already exists; XATTR_REPLACE fails (ENODATA) if it does not. The default flags=0 creates or replaces.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.getxattr',
    meta:  'Linux extended attributes',
  },
};
