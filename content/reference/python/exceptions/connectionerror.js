// content/reference/python/exceptions/connectionerror.js

export const meta = {
  slug:        'connectionerror',
  name:        'ConnectionError',
  signature:   'ConnectionError(*args)',
  blurb:       'Base class for connection failures: broken pipes, aborted, refused and reset connections.',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'connectionerror connection error brokenpipeerror broken pipe connectionabortederror connection aborted connectionrefusederror connection refused connectionreseterror connection reset by peer epipe econnrefused econnreset econnaborted eshutdown socket network winerror 10061 10054',
};

export const method = {
  slug:      'connectionerror',
  name:      'ConnectionError',
  signature: 'ConnectionError(*args)',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'The OSError branch for sockets and pipes. Four subclasses tell you what happened: nobody listening (refused), the peer hung up (reset / broken pipe), or the connection was dropped locally (aborted).',

  chain: ['BaseException', 'Exception', 'OSError', 'ConnectionError'],

  cheat: {
    raisedBy: 'socket connect/send/recv, http.client, urllib, asyncio streams, writing to a closed pipe',
    message:  '[Errno N] Connection refused / Connection reset by peer / Broken pipe',
    quickFix: 'except ConnectionError: retry with backoff',
    watchOut: 'TimeoutError is NOT a ConnectionError',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'A message, or (errno, strerror) like any OSError. Subclasses are usually raised by the socket layer, not constructed by hand.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'The socket layer raises OSError with an errno; the constructor turns each connection errno into its subclass. Pick one: pipe, aborted, refused, reset.',
      params: [{ name: 'kind', type: 'str', hint: 'pipe / aborted / refused / reset', input: 'text' }],
      template: "import errno\ncodes = {'pipe': errno.EPIPE, 'aborted': errno.ECONNABORTED,\n         'refused': errno.ECONNREFUSED, 'reset': errno.ECONNRESET}\ne = OSError(codes[{$kind}], 'simulated')\n(type(e).__name__, isinstance(e, ConnectionError))",
      cases: [
        { id: 'refused', label: 'refused', values: { kind: 'refused' } },
        { id: 'reset',   label: 'reset',   values: { kind: 'reset' } },
        { id: 'pipe',    label: 'pipe',    values: { kind: 'pipe' } },
        { id: 'aborted', label: 'aborted', values: { kind: 'aborted' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'One except ConnectionError clause covers all four subclasses. Try timeout too.',
      params: [{ name: 'kind', type: 'str', hint: 'reset / refused / aborted / pipe / timeout', input: 'text' }],
      template: "kinds = {'reset': ConnectionResetError, 'refused': ConnectionRefusedError,\n         'aborted': ConnectionAbortedError, 'pipe': BrokenPipeError,\n         'timeout': TimeoutError}\ntry:\n    raise kinds[{$kind}]('simulated')\nexcept ConnectionError as e:\n    outcome = f'reconnect after {type(e).__name__}'\noutcome",
      cases: [
        { id: 'reset',   label: 'reset',   values: { kind: 'reset' } },
        { id: 'pipe',    label: 'pipe',    values: { kind: 'pipe' } },
        { id: 'timeout', label: 'timeout', values: { kind: 'timeout' } },
      ],
    },
  ],
  demoExplainer: "Trigger never names a subclass, yet every result is a specific one — errno picked it. The codes use the errno.NAME constants because the numbers differ by OS (ECONNREFUSED is 111 on Linux, 61 on macOS, 10061 on Windows). In Handle, timeout escapes the except ConnectionError clause: TimeoutError is a sibling, not a child.",

  attributes: [
    { name: 'errno',    type: 'int | None', meaning: 'errno.EPIPE / ESHUTDOWN, ECONNABORTED, ECONNREFUSED or ECONNRESET when raised by the OS. Compare with the errno constants, not numbers.' },
    { name: 'strerror', type: 'str | None', meaning: "OS text, e.g. 'Connection refused' on Linux; Windows uses its own wording ('No connection could be made because the target machine actively refused it')." },
    { name: 'winerror', type: 'int', meaning: 'Windows only: 10061 (refused), 10054 (reset), 10053 (aborted) …' },
  ],

  patterns: [
    {
      name: 'Retry transient network failures',
      desc: 'Refused and reset connections are often temporary (server restarting). Retry with backoff; include TimeoutError.',
      code: "import time\nfor attempt in range(5):\n    try:\n        conn = connect()\n        break\n    except (ConnectionError, TimeoutError):\n        if attempt == 4:\n            raise\n        time.sleep(2 ** attempt)",
    },
    {
      name: 'Quiet exit when stdout is closed',
      desc: 'python script.py | head closes the pipe early; the next print raises BrokenPipeError. Exit quietly instead of printing a traceback.',
      code: "import os, sys\ntry:\n    for line in lines:\n        print(line)\n    sys.stdout.flush()\nexcept BrokenPipeError:\n    devnull = os.open(os.devnull, os.O_WRONLY)\n    os.dup2(devnull, sys.stdout.fileno())\n    sys.exit(1)",
    },
    {
      name: 'Server: ignore clients that vanish',
      desc: 'A client closing mid-response is normal for a server; log it and move on.',
      code: "try:\n    conn.sendall(payload)\nexcept (BrokenPipeError, ConnectionResetError):\n    log.info('client went away')",
    },
  ],

  examples: [
    { title: 'EPIPE becomes BrokenPipeError',        code: "import errno\nraise OSError(errno.EPIPE, 'Broken pipe')", returns: 'BrokenPipeError: [Errno 32] Broken pipe' },
    { title: 'Each errno has its subclass',          code: "import errno\n[type(OSError(c, 'x')).__name__ for c in (errno.ECONNABORTED, errno.ECONNREFUSED, errno.ECONNRESET)]", returns: "['ConnectionAbortedError', 'ConnectionRefusedError', 'ConnectionResetError']" },
    { title: 'ESHUTDOWN is a broken pipe too',       code: "import errno\ntype(OSError(errno.ESHUTDOWN, 'Cannot send after transport endpoint shutdown')).__name__", returns: "'BrokenPipeError'" },
    { title: 'All four are ConnectionErrors',        code: '[issubclass(c, ConnectionError) for c in (BrokenPipeError, ConnectionAbortedError, ConnectionRefusedError, ConnectionResetError)]', returns: '[True, True, True, True]' },
    { title: 'TimeoutError is not one',              code: '(issubclass(TimeoutError, ConnectionError), issubclass(TimeoutError, OSError))', returns: '(False, True)' },
    { title: 'Check the errno by name',              code: "import errno\ne = OSError(errno.ECONNRESET, 'Connection reset by peer')\n(type(e).__name__, e.errno == errno.ECONNRESET)", returns: "('ConnectionResetError', True)" },
    { title: 'Raise one yourself',                   code: "raise ConnectionRefusedError('db:5432 is not accepting connections')", returns: 'ConnectionRefusedError: db:5432 is not accepting connections' },
  ],

  pitfalls: [
    {
      name: 'Retrying only on refused',
      desc: 'A server that restarts can refuse new connections AND reset existing ones. Catching one subclass lets the other crash the client.',
      wrong: { label: 'except ConnectionRefusedError', code: "try:\n    raise ConnectionResetError('peer closed the connection')\nexcept ConnectionRefusedError:\n    r = 'retry'\nr", output: 'ConnectionResetError: peer closed the connection' },
      fix:   { label: 'except ConnectionError', code: "try:\n    raise ConnectionResetError('peer closed the connection')\nexcept ConnectionError:\n    r = 'retry'\nr", output: "'retry'" },
    },
    {
      name: 'Assuming ConnectionError covers timeouts',
      desc: 'A slow server raises TimeoutError, which sits next to ConnectionError under OSError. Network retry code needs both.',
      wrong: { label: 'ConnectionError only', code: "def call():\n    raise TimeoutError('timed out')\ntry:\n    call()\nexcept ConnectionError:\n    r = 'retry'\nr", output: 'TimeoutError: timed out' },
      fix:   { label: '(ConnectionError, TimeoutError)', code: "def call():\n    raise TimeoutError('timed out')\ntry:\n    call()\nexcept (ConnectionError, TimeoutError):\n    r = 'retry'\nr", output: "'retry'" },
    },
  ],

  when: {
    use: [
      'Retry logic around sockets, HTTP clients built on the stdlib, database drivers that surface OSErrors',
      'Handling clients that disconnect mid-request on a server',
      'Raising it from your own client code when the remote end misbehaves',
    ],
    avoid: [
      'Timeouts → also catch TimeoutError',
      'requests / httpx → catch their own ConnectionError classes (not the built-in one)',
      'DNS failures → socket.gaierror (an OSError, not a ConnectionError)',
    ],
  },

  notes: {
    cpython:          'Objects/exceptions.c — EPIPE and ESHUTDOWN → BrokenPipeError, ECONNABORTED → ConnectionAbortedError, ECONNREFUSED → ConnectionRefusedError, ECONNRESET → ConnectionResetError',
    'Catch via':      'except ConnectionError for all four; except OSError also catches TimeoutError and the rest',
    'errno numbers':  'Connection errnos differ per OS (ECONNRESET: 104 Linux, 54 macOS, 10054 Windows) — always compare with errno.ECONNRESET',
  },

  related: [
    { name: 'TimeoutError', slug: 'timeouterror', when: 'The sibling for slow or silent peers' },
    { name: 'OSError',      slug: 'oserror',      when: 'Base class; errno / strerror live there' },
    { name: 'BaseException', slug: 'baseexception', when: 'The root of the hierarchy' },
    { name: 'issubclass()', slug: 'issubclass',   when: 'Check how the classes relate', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does ConnectionRefusedError: [Errno 111] Connection refused mean?',
      a: 'The target host answered, but nothing is listening on that port: the server is not running, listens on another port or interface (127.0.0.1 vs 0.0.0.0), or a firewall rejects the connection. Windows shows it as [WinError 10061] No connection could be made because the target machine actively refused it; macOS as [Errno 61].',
    },
    {
      q: 'What is ConnectionResetError: [Errno 104] Connection reset by peer?',
      a: 'The other side closed the connection abruptly (a TCP RST) while you were using it — the server crashed or restarted, a proxy or load balancer dropped an idle connection, or the peer rejected your protocol (e.g. plain HTTP to an HTTPS port). Retrying on a fresh connection usually works. Windows reports it as [WinError 10054].',
    },
    {
      q: 'What causes BrokenPipeError: [Errno 32] Broken pipe?',
      a: 'Writing to a pipe or socket whose reading end has already been closed. The classic case is python script.py | head: head exits after ten lines and the next print fails. Servers see it when a client disconnects before the response is sent. It also covers ESHUTDOWN (writing after the socket was shut down for writing).',
    },
    {
      q: 'When is ConnectionAbortedError raised?',
      a: 'When the connection was aborted — errno ECONNABORTED. On Windows this is common: [WinError 10053] An established connection was aborted by the software in your host machine, typically when the local side (or antivirus/firewall) tears down a connection the peer already closed. On Linux it mostly appears from accept() when a client aborts before being accepted.',
    },
    {
      q: 'Is requests.exceptions.ConnectionError the built-in ConnectionError?',
      a: 'No. requests defines its own ConnectionError (a subclass of requests.exceptions.RequestException) and wraps the socket-level errors in it. except ConnectionError with the built-in name does not catch it; catch requests.exceptions.ConnectionError or RequestException.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added with BrokenPipeError, ConnectionAbortedError, ConnectionRefusedError and ConnectionResetError (PEP 3151).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ConnectionError',
    meta:  'Built-in exceptions',
  },
};
