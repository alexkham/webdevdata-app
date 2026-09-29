// content/reference/python/exceptions/timeouterror.js

export const meta = {
  slug:        'timeouterror',
  name:        'TimeoutError',
  signature:   'TimeoutError(*args)',
  blurb:       'Raised when an operation exceeds its time limit — system calls (ETIMEDOUT), sockets, asyncio and concurrent.futures.',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'timeouterror timeout error timed out etimedout socket.timeout asyncio.timeouterror asyncio wait_for concurrent.futures future result deadline retry subprocess timeoutexpired',
};

export const method = {
  slug:      'timeouterror',
  name:      'TimeoutError',
  signature: 'TimeoutError(*args)',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'One class for every "took too long": socket.timeout (3.10), asyncio.TimeoutError and concurrent.futures.TimeoutError (3.11) are now all aliases of it.',

  chain: ['BaseException', 'Exception', 'OSError', 'TimeoutError'],

  cheat: {
    raisedBy: 'socket ops with settimeout(), asyncio.wait_for / asyncio.timeout, Future.result(timeout=…)',
    message:  "'timed out' from sockets; often empty from asyncio / futures",
    quickFix: 'retry with backoff, or raise the limit',
    watchOut: 'not a ConnectionError; subprocess.TimeoutExpired is not one either',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: "Usually a message ('timed out' for sockets). With (errno, strerror) it behaves like any OSError." },
  ],

  modes: [
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise it with a message. An empty message gives the bare class name — what asyncio and concurrent.futures produce.',
      params: [{ name: 'message', type: 'str', hint: 'message', input: 'text' }],
      template: 'raise TimeoutError({$message})',
      cases: [
        { id: 'msg',    label: 'with message', values: { message: 'no reply from api.example.com after 5s' } },
        { id: 'socket', label: 'socket style', values: { message: 'timed out' } },
        { id: 'empty',  label: 'empty',        values: { message: '' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'A simulated request that times out on the first `failures` attempts. Three attempts, then give up.',
      params: [{ name: 'failures', type: 'int', hint: 'attempts that time out', input: 'number' }],
      template: "failures = {$failures}\ndef fetch(attempt):\n    if attempt < failures:\n        raise TimeoutError(f'attempt {attempt + 1} timed out')\n    return f'ok on attempt {attempt + 1}'\nfor attempt in range(3):\n    try:\n        result = fetch(attempt)\n        break\n    except TimeoutError as e:\n        result = f'gave up: {e}'\nresult",
      cases: [
        { id: 'none', label: 'no timeouts',   values: { failures: '0' } },
        { id: 'two',  label: '2 timeouts',    values: { failures: '2' } },
        { id: 'all',  label: 'always timeout', values: { failures: '5' } },
      ],
    },
  ],
  demoExplainer: "With an empty message the traceback line is just TimeoutError — that is what you see from asyncio.wait_for() and Future.result(timeout=…), so an empty message does not mean the error is broken. In Handle, a timeout is treated as transient: the loop retries and only reports the last error when every attempt timed out.",

  attributes: [
    { name: 'args',     type: 'tuple',      meaning: "The message, e.g. ('timed out',) for sockets; empty for asyncio/futures timeouts." },
    { name: 'errno',    type: 'int | None', meaning: 'errno.ETIMEDOUT when the OS reported the timeout (e.g. a TCP connect that never got an answer); None otherwise.' },
    { name: 'strerror', type: 'str | None', meaning: "The OS text for ETIMEDOUT when set ('Connection timed out' on Linux)." },
  ],

  patterns: [
    {
      name: 'Socket timeout',
      desc: 'settimeout() makes blocking calls raise TimeoutError instead of hanging forever.',
      code: "import socket\ns = socket.create_connection(('example.com', 80), timeout=5)\ntry:\n    data = s.recv(1024)\nexcept TimeoutError:\n    data = b''",
    },
    {
      name: 'asyncio deadline',
      desc: 'asyncio.timeout() (3.11+) or wait_for() cancel the work and raise TimeoutError.',
      code: "import asyncio\nasync def main():\n    try:\n        async with asyncio.timeout(10):\n            await fetch_all()\n    except TimeoutError:\n        print('took longer than 10s')",
    },
    {
      name: 'Retry with exponential backoff',
      desc: 'Timeouts are often transient. Retry a few times, waiting longer each time, then re-raise.',
      code: "import time\nfor attempt in range(5):\n    try:\n        resp = call_api()\n        break\n    except (TimeoutError, ConnectionError):\n        if attempt == 4:\n            raise\n        time.sleep(2 ** attempt)",
    },
  ],

  examples: [
    { title: 'Raise with a message',             code: "raise TimeoutError('no reply after 5s')", returns: 'TimeoutError: no reply after 5s' },
    { title: 'The old names are aliases',        code: 'import socket, asyncio, concurrent.futures\n(socket.timeout is TimeoutError, asyncio.TimeoutError is TimeoutError, concurrent.futures.TimeoutError is TimeoutError)', returns: '(True, True, True)' },
    { title: 'Future.result(timeout=…)',         code: 'from concurrent.futures import Future\nFuture().result(timeout=0)', returns: 'TimeoutError' },
    { title: 'asyncio.wait_for()',               code: 'import asyncio\nasync def main():\n    await asyncio.wait_for(asyncio.Event().wait(), timeout=0)\nasyncio.run(main())', returns: 'TimeoutError' },
    { title: 'errno ETIMEDOUT maps to it',       code: "import errno\ntype(OSError(errno.ETIMEDOUT, 'Connection timed out')).__name__", returns: "'TimeoutError'" },
    { title: 'It is an OSError, not a ConnectionError', code: '(issubclass(TimeoutError, OSError), issubclass(TimeoutError, ConnectionError))', returns: '(True, False)' },
    { title: 'subprocess.TimeoutExpired is separate', code: 'import subprocess\nissubclass(subprocess.TimeoutExpired, TimeoutError)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'except ConnectionError misses timeouts',
      desc: 'TimeoutError and ConnectionError are siblings under OSError. Network retry code usually needs both.',
      wrong: { label: 'ConnectionError only', code: "try:\n    raise TimeoutError('timed out')\nexcept ConnectionError:\n    r = 'retry'\nr", output: 'TimeoutError: timed out' },
      fix:   { label: 'Both classes',         code: "try:\n    raise TimeoutError('timed out')\nexcept (ConnectionError, TimeoutError):\n    r = 'retry'\nr", output: "'retry'" },
    },
    {
      name: 'subprocess timeouts are not TimeoutError',
      desc: 'subprocess.run(..., timeout=…) raises subprocess.TimeoutExpired, a SubprocessError. except TimeoutError lets it through.',
      wrong: { label: 'except TimeoutError', code: "import subprocess\ntry:\n    raise subprocess.TimeoutExpired(['backup.sh'], 5)\nexcept TimeoutError:\n    r = 'timed out'\nr", output: "subprocess.TimeoutExpired: Command '['backup.sh']' timed out after 5 seconds" },
      fix:   { label: 'except TimeoutExpired', code: "import subprocess\ntry:\n    raise subprocess.TimeoutExpired(['backup.sh'], 5)\nexcept subprocess.TimeoutExpired as e:\n    r = f'{e.cmd} timed out after {e.timeout}s'\nr", output: "\"['backup.sh'] timed out after 5s\"" },
    },
    {
      name: 'except OSError before except TimeoutError',
      desc: 'TimeoutError is an OSError subclass, so a preceding except OSError takes it and the timeout branch never runs.',
      wrong: { label: 'OSError first', code: "try:\n    raise TimeoutError('timed out')\nexcept OSError:\n    r = 'I/O failure'\nexcept TimeoutError:\n    r = 'retry later'\nr", output: "'I/O failure'" },
      fix:   { label: 'TimeoutError first', code: "try:\n    raise TimeoutError('timed out')\nexcept TimeoutError:\n    r = 'retry later'\nexcept OSError:\n    r = 'I/O failure'\nr", output: "'retry later'" },
    },
  ],

  when: {
    use: [
      'Catching socket, asyncio and futures timeouts with one except clause',
      'Raising it from your own code when a deadline passes',
      'Retrying transient network slowness with backoff',
    ],
    avoid: [
      'subprocess.run(timeout=…) → catch subprocess.TimeoutExpired',
      'requests / httpx timeouts → their own exception classes (see the FAQ)',
      'queue.get(timeout=…) → raises queue.Empty, not TimeoutError',
    ],
  },

  notes: {
    cpython:     'Objects/exceptions.c — OSError(ETIMEDOUT, …) returns TimeoutError',
    'Aliases':   'socket.timeout (3.10), asyncio.TimeoutError and concurrent.futures.TimeoutError (3.11) are all TimeoutError',
    'Catch via': 'except OSError — but not except ConnectionError',
  },

  related: [
    { name: 'ConnectionError', slug: 'connectionerror', when: 'The sibling for refused / reset / broken connections' },
    { name: 'OSError',         slug: 'oserror',         when: 'Base class' },
    { name: 'BaseException',   slug: 'baseexception',   when: 'The root of the hierarchy' },
    { name: 'issubclass()',    slug: 'issubclass',      when: 'Check how the classes relate', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between TimeoutError and socket.timeout?',
      a: 'Since Python 3.10 there is none: socket.timeout is a deprecated alias, socket.timeout is TimeoutError is True. Before 3.10 socket.timeout was a separate OSError subclass, so code for older versions caught socket.timeout explicitly. New code should catch TimeoutError.',
    },
    {
      q: 'Is asyncio.TimeoutError the same as TimeoutError?',
      a: 'Yes, since Python 3.11 asyncio.TimeoutError and concurrent.futures.TimeoutError are aliases of the built-in TimeoutError. On 3.10 and earlier they were different classes, so except TimeoutError did not catch an asyncio.wait_for() timeout.',
    },
    {
      q: 'Why does requests raise its own Timeout instead of TimeoutError?',
      a: 'requests wraps low-level errors in its own hierarchy: requests.exceptions.Timeout (ConnectTimeout, ReadTimeout), based on requests.exceptions.RequestException. Catch those when using requests; the built-in TimeoutError is what the socket layer raises underneath.',
    },
    {
      q: 'Why is the TimeoutError message empty?',
      a: 'asyncio.wait_for(), asyncio.timeout() and Future.result(timeout=…) raise TimeoutError without a message, so the traceback line is just TimeoutError. Add context yourself when re-raising, e.g. raise TimeoutError(f"{url} took over 10s") from None.',
    },
  ],

  history: [
    { version: '3.3',  note: 'Added, together with the other OSError subclasses (PEP 3151).' },
    { version: '3.10', note: 'socket.timeout made an alias of TimeoutError.' },
    { version: '3.11', note: 'asyncio.TimeoutError and concurrent.futures.TimeoutError made aliases of TimeoutError.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#TimeoutError',
    meta:  'Built-in exceptions',
  },
};
