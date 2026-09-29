// content/reference/python/stdlib/pathlib/parts.js

export const meta = {
  slug:        'parts',
  name:        'PurePath.parts',
  signature:   'PurePath.parts / .parent / .parents / .anchor / .drive / .root',
  blurb:       'Take a path apart: the tuple of components, the containing folder, every ancestor, and the drive/root prefix.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'PurePath.parts parts parent parents anchor drive root PurePath.parent PurePath.parents PurePath.anchor PurePath.drive PurePath.root split path into components parent directory python dirname ancestors',
};

export const method = {
  slug:      'parts',
  name:      'PurePath.parts',
  signature: 'PurePath.parts / .parent / .parents / .anchor / .drive / .root',
  returns:   { type: 'tuple[str, ...] | PurePath | Sequence[PurePath] | str', desc: 'parts is a tuple, parent a path, parents a sequence of paths, anchor/drive/root strings.' },

  category:    'pathlib attribute',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'parts splits a path into its components (the anchor counts as one). parent drops the last component, parents lists every ancestor up to the anchor, and anchor = drive + root tells you whether the path is rooted.',

  covers: ['PurePath.parts', 'PurePath.parent', 'PurePath.parents', 'PurePath.anchor', 'PurePath.drive', 'PurePath.root'],

  cheat: {
    commonCall: "p.parent, p.parts",
    returns:    "PurePosixPath('/usr/local'), ('/', 'usr', 'local', 'bin')",
    replaces:   'os.path.dirname and path.split("/")',
    watchOut:   "parent of '.' is '.', parent of '/' is '/': it never raises",
  },

  parameters: [],

  modes: [
    {
      id: 'parts',
      label: 'parts',
      blurb: 'The anchor (here the root "/") is its own first part.',
      params: [{ name: 'path', type: 'str', hint: 'a path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).parts',
      cases: [
        { id: 'abs',  label: 'absolute', values: { path: '/usr/local/bin' } },
        { id: 'rel',  label: 'relative', values: { path: 'src/pkg/mod.py' } },
        { id: 'dd',   label: 'with ..',  values: { path: '../shared/lib' } },
        { id: 'dot',  label: '.',        values: { path: '.' } },
      ],
    },
    {
      id: 'parents',
      label: 'parent / parents',
      blurb: 'parent is one level up; list(parents) walks all the way up.',
      params: [{ name: 'path', type: 'str', hint: 'a path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.parent, list(p.parents))',
      cases: [
        { id: 'abs',  label: 'absolute', values: { path: '/home/ada/notes.txt' } },
        { id: 'rel',  label: 'relative', values: { path: 'a/b/c' } },
        { id: 'one',  label: 'one part', values: { path: 'file.txt' } },
        { id: 'root', label: 'root',     values: { path: '/' } },
      ],
    },
    {
      id: 'anchor',
      label: 'drive / root / anchor',
      blurb: 'On POSIX the drive is always empty; the root is "/" (or "//" for exactly two leading slashes).',
      params: [{ name: 'path', type: 'str', hint: 'a path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.drive, p.root, p.anchor)',
      cases: [
        { id: 'abs', label: 'absolute',      values: { path: '/etc/hosts' } },
        { id: 'rel', label: 'relative',      values: { path: 'etc/hosts' } },
        { id: 'two', label: 'two slashes',   values: { path: '//host/share' } },
      ],
    },
  ],
  demoExplainer: "parents stops at the anchor: for an absolute path the last parent is '/', for a relative one it is '.'. A single-part relative path has '.' as its parent, and the root is its own parent — parent never raises, so a loop 'while p != p.parent' always ends. POSIX paths never have a drive; see PureWindowsPath for 'C:' and UNC shares.",

  patterns: [
    {
      name: 'Walk up to find a project root',
      desc: 'Check the path and each ancestor for a marker file.',
      code: "from pathlib import Path\ndef find_root(start, marker='pyproject.toml'):\n    for folder in (start, *start.parents):\n        if (folder / marker).exists():\n            return folder\n    return None",
    },
    {
      name: 'Grandparent folder',
      desc: 'parents[1] is two levels up (parents[0] is parent).',
      code: 'from pathlib import Path\nrepo = Path(__file__).resolve().parents[1]',
    },
    {
      name: 'First folder of a relative path',
      desc: 'parts[0] is the top-level directory.',
      code: "from pathlib import PurePosixPath\ntop = PurePosixPath('src/pkg/mod.py').parts[0]  # 'src'",
    },
  ],

  examples: [
    { title: 'Components as a tuple',          code: "from pathlib import PurePosixPath\nPurePosixPath('/usr/bin/python3').parts", returns: "('/', 'usr', 'bin', 'python3')" },
    { title: 'The containing folder',          code: "from pathlib import PurePosixPath\nPurePosixPath('/usr/bin/python3').parent", returns: "PurePosixPath('/usr/bin')" },
    { title: 'Index into parents',             code: "from pathlib import PurePosixPath\np = PurePosixPath('/a/b/c/d')\n(p.parents[0], p.parents[2])", returns: "(PurePosixPath('/a/b/c'), PurePosixPath('/a'))" },
    { title: 'Negative indexes and slices (3.10+)', code: "from pathlib import PurePosixPath\np = PurePosixPath('/a/b/c')\n(p.parents[-1], p.parents[:2])", returns: "(PurePosixPath('/'), (PurePosixPath('/a/b'), PurePosixPath('/a')))" },
    { title: 'Parent of a bare name',          code: "from pathlib import PurePosixPath\nPurePosixPath('notes.txt').parent", returns: "PurePosixPath('.')" },
    { title: 'Anchor tells rooted from relative', code: "from pathlib import PurePosixPath\n(PurePosixPath('/etc').anchor, PurePosixPath('etc').anchor)", returns: "('/', '')" },
    { title: 'Windows drive and root',         code: "from pathlib import PureWindowsPath\np = PureWindowsPath('D:/games/save.dat')\n(p.drive, p.root, p.parts)", returns: "('D:', '\\\\', ('D:\\\\', 'games', 'save.dat'))" },
    { title: 'Out of range',                   code: "from pathlib import PurePosixPath\nPurePosixPath('a/b').parents[2]", returns: 'IndexError: 2' },
  ],

  pitfalls: [
    {
      name: 'Expecting parent to resolve ".."',
      desc: "parent is lexical: it removes the last component, even when that component is '..'.",
      wrong: { label: "parent of '..'", code: "from pathlib import PurePosixPath\nPurePosixPath('../x').parent.parent", output: "PurePosixPath('.')" },
      fix:   { label: 'resolve() first', code: "from pathlib import Path\nPath('x').mkdir()\nPath('x/..').resolve() == Path.cwd().resolve()", output: 'True' },
    },
    {
      name: 'Printing parents directly',
      desc: 'parents is a lazy sequence object; its repr is not the list of paths. Convert it with list() or tuple().',
      wrong: { label: 'repr(parents)', code: "from pathlib import PurePosixPath\nPurePosixPath('/a/b').parents", output: '<PurePosixPath.parents>' },
      fix:   { label: 'list(parents)', code: "from pathlib import PurePosixPath\nlist(PurePosixPath('/a/b').parents)", output: "[PurePosixPath('/a'), PurePosixPath('/')]" },
    },
    {
      name: 'Splitting str(path) on "/"',
      desc: "String splitting keeps empty pieces and breaks on Windows separators; parts is already split and normalised.",
      wrong: { label: "str.split('/')", code: "'/usr//local/'.split('/')", output: "['', 'usr', '', 'local', '']" },
      fix:   { label: '.parts', code: "from pathlib import PurePosixPath\nPurePosixPath('/usr//local/').parts", output: "('/', 'usr', 'local')" },
    },
  ],

  when: {
    use: [
      'Folder of a file (parent) and walking upwards (parents)',
      'Inspecting the top-level folder of a relative path (parts[0])',
      'Checking whether a path is rooted (anchor)',
    ],
    avoid: [
      'Resolving ".." or symlinks → Path.resolve()',
      'Relative path between two locations → relative_to()',
    ],
  },

  notes: {
    cpython:     'Lib/pathlib/_local.py: parts = (drive + root,) + tail when anchored; parents is a _PathParents sequence built from the parsed tail',
    'drive':     "Always '' for POSIX; 'C:' or '\\\\server\\share' for Windows",
    'root':      "'/' or '' on POSIX ('//' for exactly two leading slashes); '\\' or '' on Windows",
    'Changed in 3.10': 'parents supports slices and negative indexes',
  },

  related: [
    { name: 'name / stem / suffix', slug: 'name',        when: 'The last component in detail' },
    { name: 'relative_to',          slug: 'relative_to', when: 'The path from one folder to another' },
    { name: 'is_absolute',          slug: 'is_absolute', when: 'Anchored and absolute are not the same on Windows' },
    { name: 'IndexError', slug: 'indexerror', when: 'parents[i] out of range', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I get the parent directory of a file in Python?',
      a: "Path(p).parent. For two levels up use p.parent.parent or p.parents[1]. Call resolve() first if the path may contain '..' or be relative.",
    },
    {
      q: 'How do I split a path into its folders?',
      a: "p.parts returns a tuple: PurePosixPath('/usr/bin/env').parts is ('/', 'usr', 'bin', 'env'). The anchor is the first item for absolute paths.",
    },
    {
      q: 'What is the difference between parent and parents?',
      a: 'parent is a single path one level up. parents is a sequence of all ancestors, nearest first: parents[0] == parent, and the last item is the anchor (or "." for relative paths).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.parts',
    meta:  'PurePath.parts / parent / parents / anchor / drive / root',
  },
};
