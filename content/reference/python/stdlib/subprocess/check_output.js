// content/reference/python/stdlib/subprocess/check_output.js

export const meta = {
  slug:        'check_output',
  name:        'subprocess.check_output',
  signature:   'subprocess.check_output(args, *, stdin=None, stderr=None, shell=False, cwd=None, encoding=None, errors=None, universal_newlines=None, timeout=None, text=None, **other_popen_kwargs) · check_call(args, ...) · call(args, ...)',
  blurb:       'The pre-3.5 trio: call() returns the exit code, check_call() raises on failure, check_output() returns stdout and raises on failure. Each is a one-line wrapper you can write with run().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (check_output 3.1+, input= 3.4+)',
  searchTerms: 'subprocess.check_output check_output subprocess.check_call check_call subprocess.call call get output of command returns bytes exit code raise CalledProcessError older api python 2 run equivalent stdout argument not allowed',
};

export const method = {
  slug:      'check_output',
  name:      'subprocess.check_output',
  signature: 'subprocess.check_output(args, *, stdin=None, stderr=None, shell=False, cwd=None, encoding=None, errors=None, universal_newlines=None, timeout=None, text=None, **other_popen_kwargs) · check_call(args, ...) · call(args, ...)',
  returns:   { type: 'bytes | str · int · int', desc: 'check_output: the captured stdout. check_call: 0 (or raises). call: the exit code, never raises for a failure.' },

  category:    'subprocess function',
  version:     'Python 3 (check_output 3.1+, input= 3.4+)',
  hasLiveDemo: false,

  subtitle: 'Still everywhere in existing code. check_output(...) is run(..., stdout=PIPE, check=True).stdout; check_call(...) is run(..., check=True) returning 0; call(...) is run(...).returncode. New code can use run() directly and choose exactly what to capture.',

  covers: ['check_output', 'check_call', 'call'],

  cheat: {
    commonCall: "version = subprocess.check_output(['git', 'describe'], text=True).strip()",
    returns:    'check_output → stdout · check_call → 0 · call → exit code',
    replaces:   'Python 2 era os.popen / commands.getoutput',
    watchOut:   'check_output returns bytes unless text=True',
  },

  parameters: [
    { name: 'args',    type: 'list | str', required: true,  default: null,   desc: 'The command, exactly as for run() and Popen.' },
    { name: 'stdin',   type: 'None | PIPE | DEVNULL | int | file', required: false, default: 'None', desc: 'All three accept the Popen stream arguments.' },
    { name: 'stdout',  type: 'None | DEVNULL | file', required: false, default: 'None', desc: 'call / check_call only. check_output refuses stdout= (it sets it to PIPE itself).' },
    { name: 'stderr',  type: 'None | PIPE | STDOUT | DEVNULL | file', required: false, default: 'None', desc: 'stderr=STDOUT makes check_output return stdout and stderr together.' },
    { name: 'input',   type: 'bytes | str', required: false, default: 'None', desc: 'check_output only: data for stdin. Passing input=None explicitly means empty input (unlike run(), where it means your stdin); leaving input out keeps your stdin.' },
    { name: 'text / encoding / errors', type: 'bool / str', required: false, default: 'None', desc: 'check_output: decode the output to str.' },
    { name: 'timeout', type: 'float', required: false, default: 'None', desc: 'Kill the child and raise TimeoutExpired after this many seconds.' },
    { name: 'check',   type: '—', required: false, default: null, desc: 'check_output refuses check= (it always checks).' },
  ],

  patterns: [
    {
      name: 'One value from a command',
      desc: 'The classic check_output idiom.',
      code: "import subprocess\ncommit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], text=True).strip()",
    },
    {
      name: 'The same with run()',
      desc: 'Identical behaviour, and stderr is captured too.',
      code: "import subprocess\nr = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True, check=True)\ncommit = r.stdout.strip()",
    },
    {
      name: 'call() as a status check',
      desc: 'Exit code only, output silenced.',
      code: "import subprocess\nhas_git = subprocess.call(['git', '--version'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) == 0",
    },
  ],

  examples: [
    { title: 'check_output returns bytes',     code: "import subprocess, sys\nsubprocess.check_output([sys.executable, '-c', 'import sys; sys.stdout.write(\"ok\")'])", returns: "b'ok'" },
    { title: '… or str with text=True',        code: "import subprocess, sys\nsubprocess.check_output([sys.executable, '-c', 'print(\"v1.2.3\")'], text=True).strip()", returns: "'v1.2.3'" },
    { title: 'Failure raises, output is kept', code: "import subprocess, sys\ntry:\n    subprocess.check_output([sys.executable, '-c', 'import sys; print(\"partial\"); sys.exit(1)'], text=True)\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.output)\nresult", returns: "(1, 'partial\\n')" },
    { title: 'stderr=STDOUT adds the errors',  code: "import subprocess, sys\nchild = 'import sys; print(\"out\", flush=True); print(\"err\", file=sys.stderr)'\nsubprocess.check_output([sys.executable, '-c', child], stderr=subprocess.STDOUT, text=True)", returns: "'out\\nerr\\n'" },
    { title: 'input= feeds stdin',             code: "import subprocess, sys\nsubprocess.check_output([sys.executable, '-c', 'import sys; print(len(sys.stdin.read()))'], input='hello', text=True)", returns: "'5\\n'" },
    { title: 'check_call returns 0 on success', code: "import subprocess, sys\nsubprocess.check_call([sys.executable, '-c', 'pass'])", returns: '0' },
    { title: 'call returns the exit code',     code: "import subprocess, sys\nsubprocess.call([sys.executable, '-c', 'import sys; sys.exit(4)'])", returns: '4' },
    { title: 'input=None means empty input',   code: "import subprocess, sys\nsubprocess.check_output([sys.executable, '-c', 'import sys; print(repr(sys.stdin.read()))'], input=None, text=True)", returns: "\"''\\n\"" },
  ],

  pitfalls: [
    {
      name: 'Passing stdout= to check_output',
      desc: 'check_output needs stdout for itself. To get stderr as well, merge it with stderr=STDOUT.',
      wrong: { label: 'stdout=PIPE', code: "import subprocess, sys\nsubprocess.check_output([sys.executable, '-c', 'print(1)'], stdout=subprocess.PIPE)", output: 'ValueError: stdout argument not allowed, it will be overridden.' },
      fix:   { label: 'stderr=STDOUT', code: "import subprocess, sys\nsubprocess.check_output([sys.executable, '-c', 'print(1)'], stderr=subprocess.STDOUT, text=True)", output: "'1\\n'" },
    },
    {
      name: 'Expecting output from check_call',
      desc: 'check_call captures nothing, so the exception has no output either. Use check_output (or run with capture_output).',
      wrong: { label: 'check_call', code: "import subprocess, sys\ntry:\n    subprocess.check_call([sys.executable, '-c', 'import sys; sys.exit(5)'])\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.output)\nresult", output: '(5, None)' },
      fix:   { label: 'check_output', code: "import subprocess, sys\ntry:\n    subprocess.check_output([sys.executable, '-c', 'import sys; print(\"partial\"); sys.exit(5)'], text=True)\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.output)\nresult", output: "(5, 'partial\\n')" },
    },
    {
      name: 'Treating call() like check_call()',
      desc: 'call() never raises for a failing command; the code comes back as the return value and is easy to ignore.',
      wrong: { label: 'call()', code: "import subprocess, sys\nsubprocess.call([sys.executable, '-c', 'import sys; sys.exit(1)'])\n'migrated!'", output: "'migrated!'" },
      fix:   { label: 'check_call()', code: "import subprocess, sys\ntry:\n    subprocess.check_call([sys.executable, '-c', 'import sys; sys.exit(1)'])\n    result = 'migrated!'\nexcept subprocess.CalledProcessError as e:\n    result = f'migration failed ({e.returncode})'\nresult", output: "'migration failed (1)'" },
    },
  ],

  when: {
    use: [
      'Reading or maintaining code written before Python 3.5',
      'check_output: one-liner to grab a command\'s output when you do not need stderr',
    ],
    avoid: [
      'New code that needs the exit code AND output → run()',
      'stdout=PIPE or stderr=PIPE with call() / check_call() — nothing reads them and the child can block',
    ],
  },

  notes: {
    cpython:          'call: with Popen(...) as p: return p.wait(timeout=timeout) (killing the child on any exception). check_call: call() then CalledProcessError(retcode, cmd). check_output: run(..., stdout=PIPE, timeout=timeout, check=True).stdout',
    'Refused arguments': 'check_output raises ValueError for stdout= and for check= ("... argument not allowed, it will be overridden.")',
    'Windows (3.12+)': 'All three use the new %COMSPEC% lookup when shell=True',
  },

  related: [
    { name: 'subprocess.run', slug: 'run', when: 'The modern equivalent of all three' },
    { name: 'CalledProcessError', slug: 'calledprocesserror', when: 'Raised by check_call / check_output' },
    { name: 'getoutput', slug: 'getoutput', when: 'Through the shell, never raises' },
    { name: 'PIPE / STDOUT / DEVNULL', slug: 'pipe', when: 'stderr=STDOUT, stdout=DEVNULL' },
    { name: 'os.system', slug: 'system', when: 'What call() replaced', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'All three functions start a real program, and a browser cannot start processes. The examples below run a child Python (sys.executable -c ...) that prints fixed text, so their outputs are the same on every system.',
    },
    {
      q: 'What is the difference between subprocess.call, check_call and check_output?',
      a: 'call returns the exit code and never raises for a failure. check_call raises CalledProcessError when the code is not 0 (and returns 0 otherwise). check_output also raises on failure, and returns the captured stdout. None of them returns stderr: check_output can merge it into its result with stderr=STDOUT, or keep it for the exception (e.stderr) with stderr=PIPE.',
    },
    {
      q: 'Why does check_output return bytes?',
      a: 'Output arrives from the pipe as bytes and the encoding depends on the program. Pass text=True (locale encoding) or encoding="utf-8" to get str, or decode yourself.',
    },
    {
      q: 'Should I still use check_output?',
      a: 'It is not deprecated and works fine. run() is recommended for new code because one function covers every case — exit code, stdout, stderr, check or not.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.check_output',
    meta:  'subprocess.check_output / check_call / call',
  },

};
