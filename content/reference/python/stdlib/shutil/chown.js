// content/reference/python/stdlib/shutil/chown.js

export const meta = {
  slug:        'chown',
  name:        'shutil.chown',
  signature:   'shutil.chown(path, user=None, group=None, *, dir_fd=None, follow_symlinks=True)',
  blurb:       'Change the owner and/or group of a file, by name or by numeric id. Unix only.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+ (dir_fd, follow_symlinks 3.13+)',
  searchTerms: 'shutil chown change owner change group python chown by name user group uid gid www-data no such user lookuperror user and/or group must be set unix permissions os.chown',
};

export const method = {
  slug:      'chown',
  name:      'shutil.chown',
  signature: 'shutil.chown(path, user=None, group=None, *, dir_fd=None, follow_symlinks=True)',
  returns:   { type: 'None', desc: 'Nothing; the ownership is changed.' },

  category:    'shutil function',
  version:     'Python 3.3+ (dir_fd, follow_symlinks 3.13+)',
  hasLiveDemo: false,

  subtitle: 'os.chown with names: user and group may be names (looked up with pwd / grp) or numeric ids, and a side you leave as None stays unchanged. Changing the owner needs root; changing the group needs you to be in that group. It depends on users that exist on a real system, so this page has no live demo.',

  covers: ['chown'],

  cheat: {
    commonCall: "shutil.chown('/srv/app/data', user='www-data', group='www-data')",
    returns:    'None',
    replaces:   'os.chown(path, pwd.getpwnam(u).pw_uid, grp.getgrnam(g).gr_gid)',
    watchOut:   'Unix only; usually needs root (PermissionError otherwise)',
  },

  parameters: [
    { name: 'path',            type: 'str | PathLike', required: true,  default: null,   desc: 'The file or folder (not recursive).' },
    { name: 'user',            type: 'str | int',      required: false, default: 'None', desc: 'New owner: a user name or a uid. None keeps the current owner.' },
    { name: 'group',           type: 'str | int',      required: false, default: 'None', desc: 'New group: a group name or a gid. None keeps the current group.' },
    { name: 'dir_fd',          type: 'int',            required: false, default: 'None', desc: 'Resolve a relative path against this open folder descriptor (3.13+).' },
    { name: 'follow_symlinks', type: 'bool',           required: false, default: 'True', desc: 'False: change a symlink itself, not its target (3.13+).' },
  ],

  patterns: [
    {
      name: 'Hand a folder to the web server user',
      desc: 'chown is not recursive — walk the tree.',
      code: "import os, shutil\nfor root, dirs, files in os.walk('/srv/app/uploads'):\n    for name in dirs + files:\n        shutil.chown(os.path.join(root, name), user='www-data', group='www-data')\nshutil.chown('/srv/app/uploads', user='www-data', group='www-data')",
    },
    {
      name: 'Change only the group',
      desc: 'Leave user as None.',
      code: "import shutil\nshutil.chown('shared/report.csv', group='analysts')",
    },
    {
      name: 'Portable code',
      desc: 'Skip ownership changes on Windows.',
      code: "import os, shutil\nif os.name == 'posix':\n    shutil.chown(path, user=owner)",
    },
  ],

  examples: [
    { title: 'At least one of user / group', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.chown('a.txt')", returns: 'ValueError: user and/or group must be set' },
    { title: 'An unknown user name', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.chown('a.txt', user='no-such-user-xyz')", returns: "LookupError: no such user: 'no-such-user-xyz'" },
    { title: 'An unknown group name', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.chown('a.txt', group='no-such-group-xyz')", returns: "LookupError: no such group: 'no-such-group-xyz'" },
    { title: 'Catch both lookups as LookupError', code: "import shutil\nopen('a.txt', 'w').close()\ntry:\n    shutil.chown('a.txt', user='nobody-here-xyz', group='nobody-here-xyz')\nexcept LookupError as e:\n    result = str(e)\nresult", returns: "\"no such user: 'nobody-here-xyz'\"" },
    { title: 'Defined everywhere, works on Unix', code: "import os, shutil\n(callable(shutil.chown), hasattr(os, 'chown') == (os.name == 'posix'))", returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'Hard-coding a user that only exists on some machines',
      desc: 'Names are looked up on the machine that runs the code; containers and CI images often lack www-data, nginx or your login. Catch LookupError (or use numeric ids) and decide what to do.',
      wrong: { label: 'assume the user exists', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.chown('a.txt', user='deploy-user-xyz')", output: "LookupError: no such user: 'deploy-user-xyz'" },
      fix:   { label: 'handle LookupError', code: "import shutil\nopen('a.txt', 'w').close()\ntry:\n    shutil.chown('a.txt', user='deploy-user-xyz')\n    status = 'owner changed'\nexcept LookupError as e:\n    status = f'skipped: {e}'\nstatus", output: "\"skipped: no such user: 'deploy-user-xyz'\"" },
    },
    {
      name: 'Expecting it to recurse',
      desc: 'Like chown without -R, it changes exactly one path. Walk the tree yourself (see Patterns).',
      wrong: { label: 'one call on a folder', code: "import shutil, inspect\n'recursive' in inspect.signature(shutil.chown).parameters", output: 'False' },
      fix:   { label: 'os.walk + chown', code: "import os\nos.makedirs('d/sub')\nopen('d/sub/f.txt', 'w').close()\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('d') for n in ds + fs)", output: "['d/sub', 'd/sub/f.txt']" },
    },
  ],

  when: {
    use: [
      'Deployment and provisioning scripts running as root',
      'Giving a file to a group you belong to (group only)',
    ],
    avoid: [
      'Windows — ownership there is managed with ACLs (icacls, pywin32)',
      'Changing permission bits → os.chmod / shutil.copymode',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: names → ids via pwd.getpwnam / grp.getgrnam (LookupError if missing), None → -1 (keep), then os.chown(path, uid, gid, dir_fd=…, follow_symlinks=…)',
    'Availability': "Unix. shutil.chown is defined on Windows too, but os.chown is not, so a numeric id raises AttributeError: module 'os' has no attribute 'chown' (checked on CPython 3.13); names fail earlier with LookupError because pwd and grp are missing",
    'Permissions':  'Checked on Linux as a normal user: chown to uid 0 raised PermissionError: [Errno 1] Operation not permitted',
  },

  related: [
    { name: 'os.chown',   slug: 'chmod',  when: 'The call it makes (on the os.chmod / chown page)', category: 'stdlib/os' },
    { name: 'os.getuid',  slug: 'getuid', when: 'Your own uid and gid', category: 'stdlib/os' },
    { name: 'LookupError', slug: 'lookuperror', when: 'Unknown user or group names', category: 'exceptions' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'Not allowed to change the owner', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I change the owner of a file in Python?',
      a: "shutil.chown(path, user='name', group='group') on Linux or macOS, usually as root. For numeric ids you can also use os.chown(path, uid, gid); pass -1 (or None in shutil.chown) to keep one of them. This page has no live demo because the result depends on the users and groups of a real system and on running as root; the examples only show the errors that come before any ownership change.",
    },
    {
      q: 'Why do I get PermissionError: [Errno 1] Operation not permitted?',
      a: 'Only root (or a process with CAP_CHOWN) may give a file to another user. A normal user may only change the group, and only to a group they are a member of.',
    },
    {
      q: 'Does shutil.chown work on Windows?',
      a: 'No. It is defined, but its documented availability is Unix: user names cannot be resolved (no pwd module) and os.chown does not exist there.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.chown',
    meta:  'shutil.chown',
  },

};
