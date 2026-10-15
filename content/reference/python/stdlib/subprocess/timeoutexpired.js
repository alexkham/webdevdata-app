// content/reference/python/stdlib/subprocess/timeoutexpired.js

export const meta = {
  slug:        'timeoutexpired',
  name:        'subprocess.TimeoutExpired',
  signature:   'subprocess.TimeoutExpired(cmd, timeout, output=None, stderr=None)',
  blurb:       'Raised when a timeout= runs out: run() and the older helpers kill the child first, Popen.wait() and communicate() leave it running.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+ (stdout, stderr attributes 3.5+)',
  searchTerms: 'subprocess.TimeoutExpired TimeoutExpired timeoutexpired TimeoutExpired.stdout timed out after seconds timeout subprocess run timeout kill process after timeout communicate timeout wait timeout partial output python',
};

export const method = {
  slug:      'timeoutexpired',
  name:      'subprocess.TimeoutExpired',
  signature: 'subprocess.TimeoutExpired(cmd, timeout, output=None, stderr=None)',

  category:    'subprocess exception',
  version:     'Python 3.3+ (stdout, stderr attributes 3.5+)',
  hasLiveDemo: true,

  subtitle: 'What timeout= raises. With run(), call(), check_call() and check_output() the child is already dead when you catch it; with Popen.wait() and Popen.communicate() it is still running, and stopping it is your job.',

  covers: ['TimeoutExpired', 'TimeoutExpired.stdout'],

  chain: ['BaseException', 'Exception', 'SubprocessError', 'TimeoutExpired'],

  cheat: {
    raisedBy: 'run / call / check_call / check_output (timeout=), Popen.wait(timeout), Popen.communicate(timeout=)',
    message:  "Command '['sleep', '60']' timed out after 5 seconds",
    quickFix: 'Popen: kill(), then communicate() to collect the rest and reap the child',
    watchOut: 'Not a subclass of the built-in TimeoutError',
  },

  parameters: [
    { name: 'cmd',     type: 'list | str', required: true,  default: null,   desc: 'The command that timed out.' },
    { name: 'timeout', type: 'float',      required: true,  default: null,   desc: 'The timeout of the call that expired, in seconds.' },
    { name: 'output',  type: 'bytes | None', required: false, default: 'None', desc: 'Output captured before the deadline (also .stdout).' },
    { name: 'stderr',  type: 'bytes | None', required: false, default: 'None', desc: 'Error output captured before the deadline.' },
  ],

  modes: [
    {
      id: 'message',
      label: 'Message',
      blurb: 'Raise it with a command and a timeout, uncaught. The timeout is printed with str(), as given.',
      params: [
        { name: 'cmd',     type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'timeout', type: 'int | float', hint: 'seconds',                   input: 'auto' },
      ],
      template: 'import subprocess\nraise subprocess.TimeoutExpired({$cmd}, {$timeout})',
      cases: [
        { id: 'int',   label: '5 seconds',   values: { cmd: 'sleep,60', timeout: '5' } },
        { id: 'float', label: '0.5 seconds', values: { cmd: 'curl,https://example.com', timeout: '0.5' } },
        { id: 'tiny',  label: '1e-05',       values: { cmd: 'job', timeout: '0.00001' } },
      ],
    },
    {
      id: 'attributes',
      label: 'Attributes',
      blurb: 'Captured output arrives as bytes (here: your text encoded as UTF-8); stdout is the same value as output.',
      params: [
        { name: 'cmd',     type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'timeout', type: 'int | float', hint: 'seconds',                   input: 'auto' },
        { name: 'out',     type: 'str',       hint: 'output before the deadline',  input: 'text' },
      ],
      template: 'import subprocess\ne = subprocess.TimeoutExpired({$cmd}, {$timeout}, output={$out}.encode())\n(e.timeout, e.stdout, str(e))',
      cases: [
        { id: 'partial', label: 'partial output', values: { cmd: 'backup.sh', timeout: '30', out: 'copied 120 of 500 files' } },
        { id: 'utf8',    label: 'non-ASCII',      values: { cmd: 'convert', timeout: '2.5', out: 'Zoë → done?' } },
        { id: 'empty',   label: 'nothing yet',    values: { cmd: 'sleep,60', timeout: '1', out: '' } },
      ],
    },
  ],
  demoExplainer: 'The message uses str() of the timeout, so 5 stays 5, 0.5 stays 0.5 and a very small float prints in exponent form (1e-05). Output is bytes because that is how the pipes deliver it: the snippet encodes your text as UTF-8, and non-ASCII characters show up as \\x escapes in the bytes repr.',

  attributes: [
    { name: 'cmd',     type: 'list | str', meaning: 'The command that timed out.' },
    { name: 'timeout', type: 'float', meaning: 'The timeout of the call that raised it.' },
    { name: 'output',  type: 'bytes | str | None', meaning: 'Output read before the deadline, or None.' },
    { name: 'stdout',  type: 'bytes | str | None', meaning: 'Alias of output (a property).' },
    { name: 'stderr',  type: 'bytes | str | None', meaning: 'Error output read before the deadline, or None.' },
  ],

  patterns: [
    {
      name: 'Popen: kill, then finish communicating',
      desc: 'The documented recipe. communicate() after kill() collects the remaining output and reaps the child.',
      code: "import subprocess\nproc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)\ntry:\n    outs, errs = proc.communicate(timeout=15)\nexcept subprocess.TimeoutExpired:\n    proc.kill()\n    outs, errs = proc.communicate()",
    },
    {
      name: 'Partial output, whatever its type',
      desc: 'Depending on platform and text mode the captured output may be bytes, str or None.',
      code: "import subprocess\ntry:\n    subprocess.run(cmd, capture_output=True, text=True, timeout=10)\nexcept subprocess.TimeoutExpired as e:\n    partial = e.stdout.decode() if isinstance(e.stdout, bytes) else (e.stdout or '')",
    },
    {
      name: 'Poll with a short wait',
      desc: 'wait(timeout) can be retried; nothing is lost when it expires.',
      code: "import subprocess\nproc = subprocess.Popen(cmd)\nwhile True:\n    try:\n        proc.wait(timeout=1)\n        break\n    except subprocess.TimeoutExpired:\n        print('still working...')",
    },
  ],

  examples: [
    { title: 'From run(timeout=...)',          code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import time; time.sleep(10)'], capture_output=True, timeout=0.5)\nexcept subprocess.TimeoutExpired as e:\n    result = (type(e).__name__, e.timeout)\nresult", returns: "('TimeoutExpired', 0.5)" },
    { title: 'Partial output survives',        code: "import subprocess, sys\nchild = 'import time; print(\"started\", flush=True); time.sleep(10)'\ntry:\n    subprocess.run([sys.executable, '-c', child], capture_output=True, text=True, timeout=1)\nexcept subprocess.TimeoutExpired as e:\n    partial = e.stdout.decode() if isinstance(e.stdout, bytes) else (e.stdout or '')\npartial", returns: "'started\\n'" },
    { title: 'From Popen.wait(timeout)',       code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])\ntry:\n    p.wait(timeout=0.5)\nexcept subprocess.TimeoutExpired as e:\n    result = (type(e).__name__, e.timeout)\nfinally:\n    p.kill()\n    p.wait()\nresult", returns: "('TimeoutExpired', 0.5)" },
    { title: 'communicate: kill, then collect', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'], stdout=subprocess.PIPE, text=True)\ntry:\n    p.communicate(timeout=0.5)\nexcept subprocess.TimeoutExpired:\n    p.kill()\n    out, err = p.communicate()\n(out, err, p.returncode != 0)", returns: "('', None, True)" },
    { title: 'The message',                    code: "import subprocess\nstr(subprocess.TimeoutExpired(['sleep', '60'], 5))", returns: "\"Command '['sleep', '60']' timed out after 5 seconds\"" },
    { title: 'Constructed attributes',         code: "import subprocess\ne = subprocess.TimeoutExpired(['x'], 5)\n(e.cmd, e.timeout, e.output, e.stderr, e.args)", returns: "(['x'], 5, None, None, (['x'], 5))" },
    { title: 'Not a built-in TimeoutError',    code: 'import subprocess\nissubclass(subprocess.TimeoutExpired, TimeoutError)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Catching the built-in TimeoutError',
      desc: 'TimeoutExpired derives from SubprocessError, not from TimeoutError (an OSError), so except TimeoutError lets it through.',
      wrong: { label: 'except TimeoutError', code: "import subprocess\ntry:\n    raise subprocess.TimeoutExpired(['sleep', '60'], 5)\nexcept TimeoutError:\n    result = 'handled'\nresult", output: "subprocess.TimeoutExpired: Command '['sleep', '60']' timed out after 5 seconds" },
      fix:   { label: 'except TimeoutExpired', code: "import subprocess\ntry:\n    raise subprocess.TimeoutExpired(['sleep', '60'], 5)\nexcept subprocess.TimeoutExpired as e:\n    result = f'gave up after {e.timeout} s'\nresult", output: "'gave up after 5 s'" },
    },
    {
      name: 'Assuming Popen stopped the child',
      desc: 'Only run() and the older helpers kill on timeout. After Popen.communicate(timeout=...) expires the child keeps running until you kill it.',
      wrong: { label: 'just catch it', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'], stdout=subprocess.PIPE)\ntry:\n    p.communicate(timeout=0.3)\nexcept subprocess.TimeoutExpired:\n    pass\nresult = 'still running' if p.poll() is None else 'stopped'\np.kill()\np.communicate()\nresult", output: "'still running'" },
      fix:   { label: 'kill + communicate', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'], stdout=subprocess.PIPE)\ntry:\n    p.communicate(timeout=0.3)\nexcept subprocess.TimeoutExpired:\n    p.kill()\n    p.communicate()\n'still running' if p.poll() is None else 'stopped'", output: "'stopped'" },
    },
  ],

  when: {
    use: [
      'Bounding how long an external command may take (run(..., timeout=))',
      'Polling a long-running Popen child without blocking forever',
    ],
    avoid: [
      'Expecting it from Popen() itself — starting a process has no timeout',
      'Treating it as a generic timeout: asyncio and sockets raise TimeoutError instead',
    ],
  },

  notes: {
    cpython:         'Lib/subprocess.py — class TimeoutExpired(SubprocessError); __str__ is "Command \'%s\' timed out after %s seconds"; stdout is a property over output',
    'Output type':   'The docs say output is bytes even with text=True. Observed with run(capture_output=True, text=True): bytes on Linux (3.12), but str on Windows (3.13), where run() re-reads the pipes after kill(). Without text=True and with nothing printed, Linux gave None and Windows b\'\'',
    'timeout value': 'It is the timeout of the call that expired. run() without captured output passes the remaining time on to wait(), so e.timeout can be slightly below the value you gave',
  },

  related: [
    { name: 'subprocess.run', slug: 'run', when: 'timeout= kills and re-raises' },
    { name: 'Popen.communicate', slug: 'communicate', when: 'timeout= without killing' },
    { name: 'Popen.wait', slug: 'wait', when: 'wait(timeout) can be retried' },
    { name: 'Popen.kill', slug: 'kill', when: 'Stop the child after a timeout' },
    { name: 'SubprocessError', slug: 'subprocesserror', when: 'Its base class' },
    { name: 'TimeoutError', slug: 'timeouterror', when: 'The unrelated built-in', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I set a timeout on a subprocess in Python?',
      a: 'subprocess.run(cmd, timeout=10) — after 10 seconds the child is killed, waited for, and TimeoutExpired is raised. With Popen, use proc.communicate(timeout=10) or proc.wait(timeout=10) and kill the process yourself when it expires.',
    },
    {
      q: 'Does TimeoutExpired kill the process?',
      a: 'The exception does nothing by itself. run(), call(), check_call() and check_output() kill the child before re-raising it; Popen.wait() and Popen.communicate() do not, so call proc.kill() and then proc.communicate().',
    },
    {
      q: 'Can I get the output produced before the timeout?',
      a: 'Yes, if it was captured: e.stdout and e.stderr hold what was read so far. Expect bytes, str or None depending on platform and text mode, and normalise before using it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.TimeoutExpired',
    meta:  'subprocess.TimeoutExpired',
  },

};
