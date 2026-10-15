// content/reference/python/stdlib/subprocess/completedprocess.js

export const meta = {
  slug:        'completedprocess',
  name:        'subprocess.CompletedProcess',
  signature:   'subprocess.CompletedProcess(args, returncode, stdout=None, stderr=None)',
  blurb:       'What run() returns: the args you passed, the exit code, and stdout / stderr when they were captured. check_returncode() raises CalledProcessError for a non-zero code.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'subprocess.CompletedProcess CompletedProcess completedprocess CompletedProcess.check_returncode check_returncode returncode stdout stderr args run result python process result exit code repr',
};

export const method = {
  slug:      'completedprocess',
  name:      'subprocess.CompletedProcess',
  signature: 'subprocess.CompletedProcess(args, returncode, stdout=None, stderr=None)',
  returns:   { type: 'CompletedProcess', desc: 'A plain record of a finished process; nothing in it talks to the process any more.' },

  category:    'subprocess class',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'A small record of a finished process — four attributes and one method. stdout and stderr are None unless run() captured them, and the object is always truthy, so test returncode, not the object.',

  covers: ['CompletedProcess', 'CompletedProcess.check_returncode'],

  cheat: {
    commonCall: 'result = subprocess.run(cmd, capture_output=True, text=True); result.check_returncode()',
    returns:    'check_returncode(): None, or raises CalledProcessError',
    replaces:   'Separate call() / check_output() calls for the code and the output',
    watchOut:   '`if result:` is always true — compare result.returncode with 0',
  },

  parameters: [
    { name: 'args',       type: 'list | str', required: true,  default: null,   desc: 'The command exactly as it was passed to run() — a list stays a list.' },
    { name: 'returncode', type: 'int',        required: true,  default: null,   desc: 'Exit status. 0 usually means success; -N means killed by signal N (POSIX only).' },
    { name: 'stdout',     type: 'bytes | str | None', required: false, default: 'None', desc: 'Captured standard output: bytes, or str in text mode. Holds stderr too when run with stderr=STDOUT.' },
    { name: 'stderr',     type: 'bytes | str | None', required: false, default: 'None', desc: 'Captured standard error; None when not captured (or merged into stdout).' },
  ],

  attributes: [
    { name: 'args',       type: 'list | str', meaning: 'The arguments used to launch the process.' },
    { name: 'returncode', type: 'int',        meaning: 'Exit status of the child; negative values are signals (POSIX).' },
    { name: 'stdout',     type: 'bytes | str | None', meaning: 'Captured output, or None.' },
    { name: 'stderr',     type: 'bytes | str | None', meaning: 'Captured error output, or None.' },
  ],

  modes: [
    {
      id: 'repr',
      label: 'repr',
      blurb: 'Build a CompletedProcess the way run() does. Leave stdout or stderr empty for None (not captured).',
      params: [
        { name: 'args', type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'code', type: 'int',       hint: 'exit code',                    input: 'number' },
        { name: 'out',  type: 'str | None', hint: 'stdout (empty: None)',         input: 'text-or-none' },
        { name: 'err',  type: 'str | None', hint: 'stderr (empty: None)',         input: 'text-or-none' },
      ],
      template: 'import subprocess\nsubprocess.CompletedProcess({$args}, {$code}, {$out}, {$err})',
      cases: [
        { id: 'plain',  label: 'nothing captured', values: { args: 'ls,-l', code: '0', out: '', err: '' } },
        { id: 'out',    label: 'stdout only',      values: { args: 'git,status', code: '0', out: 'On branch main', err: '' } },
        { id: 'err',    label: 'stderr only',      values: { args: 'git,status', code: '128', out: '', err: 'fatal: not a git repository' } },
        { id: 'both',   label: 'both',             values: { args: 'pytest', code: '1', out: '1 failed', err: 'warning: slow test' } },
      ],
    },
    {
      id: 'check',
      label: 'check_returncode()',
      blurb: 'Call check_returncode() and catch what it raises: a CalledProcessError that carries every field of the result.',
      params: [
        { name: 'args', type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'code', type: 'int',       hint: 'exit code',                    input: 'number' },
        { name: 'out',  type: 'str | None', hint: 'stdout (empty: None)',         input: 'text-or-none' },
        { name: 'err',  type: 'str | None', hint: 'stderr (empty: None)',         input: 'text-or-none' },
      ],
      template: "import subprocess\ndone = subprocess.CompletedProcess({$args}, {$code}, {$out}, {$err})\ntry:\n    done.check_returncode()\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.cmd, e.stdout, e.stderr)\nelse:\n    result = 'returncode is 0: nothing raised'\nresult",
      cases: [
        { id: 'ok',     label: 'exit 0',   values: { args: 'make', code: '0', out: 'done', err: '' } },
        { id: 'fail',   label: 'exit 2',   values: { args: 'make', code: '2', out: '', err: 'make: *** No targets.' } },
        { id: 'killed', label: 'killed (-9)', values: { args: 'worker', code: '-9', out: 'partial', err: '' } },
      ],
    },
  ],
  demoExplainer: 'The repr always shows args and returncode and adds stdout= and stderr= only when they are not None — so a repr without them means nothing was captured, not that the program printed nothing (captured silence is the empty string). check_returncode() does nothing for 0 and raises for every other value, negative ones included; the exception gets returncode, args (as cmd), stdout and stderr.',

  patterns: [
    {
      name: 'Check later, after logging',
      desc: 'Keep the result, record the output, then raise if it failed.',
      code: "import subprocess\nresult = subprocess.run(cmd, capture_output=True, text=True)\nlog.write(result.stdout)\nresult.check_returncode()",
    },
    {
      name: 'Branch on the exit code',
      desc: 'Some tools use codes as answers: grep exits 1 for "no match", 2 for an error.',
      code: "import subprocess\nr = subprocess.run(['grep', '-q', 'TODO', 'notes.txt'])\nif r.returncode == 0:\n    print('found')\nelif r.returncode == 1:\n    print('not found')\nelse:\n    r.check_returncode()",
    },
    {
      name: 'Type hints for the output type',
      desc: 'CompletedProcess is generic in the type of stdout/stderr.',
      code: "import subprocess\ndef git(*args: str) -> subprocess.CompletedProcess[str]:\n    return subprocess.run(['git', *args], capture_output=True, text=True)",
    },
  ],

  examples: [
    { title: 'What run() returns',            code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'print(1)'], capture_output=True, text=True)\n(type(r).__name__, r.stdout, r.stderr)", returns: "('CompletedProcess', '1\\n', '')" },
    { title: 'repr without captured output',  code: "import subprocess\nsubprocess.CompletedProcess(['ls', '-l'], 0)", returns: "CompletedProcess(args=['ls', '-l'], returncode=0)" },
    { title: 'repr with both streams',        code: "import subprocess\nsubprocess.CompletedProcess(['git', 'status'], 128, stdout='', stderr='fatal: not a git repository\\n')", returns: "CompletedProcess(args=['git', 'status'], returncode=128, stdout='', stderr='fatal: not a git repository\\n')" },
    { title: 'check_returncode() on success returns None', code: "import subprocess\nprint(subprocess.CompletedProcess(['true'], 0).check_returncode())", returns: 'None' },
    { title: 'check_returncode() on failure', code: "import subprocess\nsubprocess.CompletedProcess(['false'], 1).check_returncode()", returns: "subprocess.CalledProcessError: Command '['false']' returned non-zero exit status 1." },
    { title: 'The exception keeps the output', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; print(\"partial\"); sys.exit(4)'], capture_output=True, text=True)\ntry:\n    r.check_returncode()\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.stdout)\nresult", returns: "(4, 'partial\\n')" },
    { title: 'A signal shows up as a negative code', code: "import subprocess\nsubprocess.CompletedProcess(['server'], -15).check_returncode()", returns: "subprocess.CalledProcessError: Command '['server']' died with <Signals.SIGTERM: 15>." },
    { title: 'Generic in the output type',    code: 'import subprocess\nsubprocess.CompletedProcess[str]', returns: 'subprocess.CompletedProcess[str]' },
  ],

  pitfalls: [
    {
      name: 'Testing the result object for success',
      desc: 'CompletedProcess defines no __bool__, so every instance is truthy — even for a failed command.',
      wrong: { label: 'if r', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'])\n'ok' if r else 'failed'", output: "'ok'" },
      fix:   { label: 'r.returncode == 0', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'])\n'ok' if r.returncode == 0 else 'failed'", output: "'failed'" },
    },
    {
      name: 'Chaining after check_returncode()',
      desc: 'check_returncode() returns None, not the result. Use check=True in run() and read .stdout from what run() returns.',
      wrong: { label: '.check_returncode().stdout', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'print(\"hi\")'], capture_output=True, text=True).check_returncode().stdout", output: "AttributeError: 'NoneType' object has no attribute 'stdout'" },
      fix:   { label: 'check=True', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'print(\"hi\")'], capture_output=True, text=True, check=True).stdout", output: "'hi\\n'" },
    },
    {
      name: 'Comparing two results',
      desc: 'There is no __eq__ either: two results with identical fields are different objects. Compare the fields you care about.',
      wrong: { label: 'a == b', code: "import subprocess\nsubprocess.CompletedProcess(['ls'], 0) == subprocess.CompletedProcess(['ls'], 0)", output: 'False' },
      fix:   { label: 'compare fields', code: "import subprocess\na = subprocess.CompletedProcess(['ls'], 0)\nb = subprocess.CompletedProcess(['ls'], 0)\n(a.args, a.returncode) == (b.args, b.returncode)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reading the outcome of run(): returncode, stdout, stderr',
      'Deferring the success check: log first, then check_returncode()',
      'Faking results in tests of code that calls run()',
    ],
    avoid: [
      'Talking to a process that is still running → Popen',
      'Raising immediately on failure → run(..., check=True)',
    ],
  },

  notes: {
    cpython:      'A plain Python class in Lib/subprocess.py: __init__ stores the four attributes, __repr__ skips stdout/stderr when None, check_returncode raises CalledProcessError(returncode, args, stdout, stderr) when returncode is truthy',
    'Mutable':    'The attributes are ordinary instance attributes; you can reassign them (handy in tests)',
    'Generic':    'CompletedProcess[str] / CompletedProcess[bytes] work through __class_getitem__ = classmethod(types.GenericAlias)',
  },

  related: [
    { name: 'subprocess.run', slug: 'run', when: 'Where it comes from' },
    { name: 'CalledProcessError', slug: 'calledprocesserror', when: 'What check_returncode() raises' },
    { name: 'Popen', slug: 'popen', when: 'The live process object' },
    { name: 'subprocess module', slug: 'subprocess', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if subprocess.run succeeded?',
      a: 'Compare result.returncode with 0, or call result.check_returncode(), which raises CalledProcessError for any non-zero code. Testing `if result:` does not work: the object is always truthy.',
    },
    {
      q: 'Why is CompletedProcess.stdout None?',
      a: 'stdout was not captured. run() only fills it when you pass capture_output=True or stdout=subprocess.PIPE; with stderr=subprocess.STDOUT the error output is merged into stdout and stderr stays None.',
    },
    {
      q: 'What is the difference between check=True and check_returncode()?',
      a: 'Nothing in the result: with check=True run() raises the same CalledProcessError (returncode, args, stdout, stderr) right away. check_returncode() lets you look at the result first and decide when to raise.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.CompletedProcess',
    meta:  'subprocess.CompletedProcess',
  },

};
