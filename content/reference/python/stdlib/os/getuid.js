// content/reference/python/stdlib/os/getuid.js

export const meta = {
  slug:        'getuid',
  name:        'os.getuid',
  signature:   'os.getuid() / os.geteuid() / os.getgid() / os.getegid() / os.getgroups() / os.setuid(uid, /) / ...',
  blurb:       'Unix user and group ids of the process: real, effective and saved uid/gid, supplementary groups, and the set* calls that drop privileges. Plus os.getlogin() (Unix and Windows).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (getresuid/setresuid/initgroups 3.2+, getgrouplist 3.3+)',
  searchTerms: 'os.getuid getuid user id uid python os.geteuid geteuid effective uid am i root os.getgid getgid os.getegid getegid os.getgroups getgroups os.getgrouplist getgrouplist os.getresuid getresuid os.getresgid getresgid os.setuid setuid os.seteuid seteuid os.setgid setgid os.setegid setegid os.setgroups setgroups os.setreuid setreuid os.setregid setregid os.setresuid setresuid os.setresgid setresgid os.initgroups initgroups os.getlogin getlogin os.NGROUPS_MAX NGROUPS_MAX drop privileges run as root pwd getpwuid getpass getuser',
};

export const method = {
  slug:      'getuid',
  name:      'os.getuid',
  signature: 'os.getuid() / os.geteuid() / os.getgid() / os.getegid() / os.getgroups() / os.setuid(uid, /) / ...',
  returns:   { type: 'int', desc: 'get*id: a numeric id; getgroups / getgrouplist: list of ints; getresuid / getresgid: (real, effective, saved); getlogin: str. The set* calls return None.' },

  category:    'os function',
  version:     'Python 3.0+ (getresuid/setresuid/initgroups 3.2+, getgrouplist 3.3+)',
  hasLiveDemo: false,

  subtitle: 'The real uid is who started the process; the effective uid decides permissions (it differs in setuid programs); the saved uid lets a program switch back. All of these are Unix only. os.getlogin() also exists on Windows, but getpass.getuser() is usually the better way to get a user name.',

  covers: ['getuid', 'geteuid', 'getgid', 'getegid', 'getgroups', 'getgrouplist', 'getresuid', 'getresgid', 'setuid', 'seteuid', 'setgid', 'setegid', 'setgroups', 'setreuid', 'setregid', 'setresuid', 'setresgid', 'initgroups', 'getlogin', 'NGROUPS_MAX'],

  cheat: {
    commonCall: 'os.geteuid() == 0',
    returns:    'True when running with root privileges',
    replaces:   'parsing the output of the id command',
    watchOut:   'Unix only: guard with hasattr or os.name on cross-platform code',
  },

  parameters: [
    { name: 'uid / gid', type: 'int', required: true, default: null, desc: 'setuid / seteuid / setgid / setegid: the new id.' },
    { name: 'ruid, euid (, suid)', type: 'int', required: true, default: null, desc: 'setreuid / setresuid (and the gid twins): real, effective (and saved) ids; -1 leaves one unchanged.' },
    { name: 'groups', type: 'sequence of int', required: true, default: null, desc: 'setgroups only: the new supplementary group list (normally needs root).' },
    { name: 'user, group', type: 'str, int', required: true, default: null, desc: 'getgrouplist(user, group) / initgroups(username, gid): a user name and its primary group id.' },
  ],

  patterns: [
    {
      name: 'Am I root? (Unix)',
      desc: 'Permissions follow the effective uid.',
      code: "import os\nis_root = hasattr(os, 'geteuid') and os.geteuid() == 0",
    },
    {
      name: 'Drop root privileges for good',
      desc: 'Groups first, then gid, then uid last: once the uid is gone you can no longer change groups.',
      code: "import os, pwd\nuser = pwd.getpwnam('www-data')\nos.setgroups([])\nos.setgid(user.pw_gid)\nos.setuid(user.pw_uid)",
    },
    {
      name: 'User name, portably',
      desc: 'getpass checks LOGNAME, USER, LNAME and USERNAME, then the password database.',
      code: 'import getpass\nname = getpass.getuser()',
    },
    {
      name: 'Run a child as another user',
      desc: 'subprocess switches the child to that user and group before running it (Unix, needs privileges).',
      code: "import subprocess\nsubprocess.run(['id'], user='nobody', group='nogroup', extra_groups=[])",
    },
  ],

  examples: [
    { title: 'Unix only',                       code: "import os\nall(hasattr(os, n) == (os.name == 'posix') for n in ('getuid', 'geteuid', 'getgid', 'getegid', 'getgroups', 'setuid'))", returns: 'True' },
    { title: 'getlogin exists on Unix and Windows', code: "import os\nhasattr(os, 'getlogin')", returns: 'True' },
    { title: 'getpass.getuser() returns a str',  code: 'import getpass\nisinstance(getpass.getuser(), str)', returns: 'True' },
    { title: 'Root is uid 0: the effective id decides', code: 'ruid, euid = 1000, 0  # a setuid-root program started by user 1000\n(ruid == 0, euid == 0)', returns: '(False, True)' },
    { title: 'EPERM: what an unprivileged set* call fails with', code: 'import errno\n(errno.EPERM, errno.errorcode[errno.EPERM])', returns: "(1, 'EPERM')" },
  ],

  pitfalls: [
    {
      name: 'Dropping the uid before the gid',
      desc: 'Changing the gid needs privileges. After setuid(1000) the process is no longer root, so the following setgid fails and the process keeps the root group. This model applies the kernel rule; on Linux the real call raises the same PermissionError.',
      wrong: { label: 'setuid, then setgid', code: "ids = {'uid': 0, 'gid': 0}\ndef setuid(uid):\n    ids['uid'] = uid\ndef setgid(gid):\n    if ids['uid'] != 0:\n        raise PermissionError('[Errno 1] Operation not permitted')\n    ids['gid'] = gid\nsetuid(1000)\nsetgid(1000)", output: 'PermissionError: [Errno 1] Operation not permitted' },
      fix:   { label: 'setgid, then setuid', code: "ids = {'uid': 0, 'gid': 0}\ndef setuid(uid):\n    ids['uid'] = uid\ndef setgid(gid):\n    if ids['uid'] != 0:\n        raise PermissionError('[Errno 1] Operation not permitted')\n    ids['gid'] = gid\nsetgid(1000)\nsetuid(1000)\nids", output: "{'uid': 1000, 'gid': 1000}" },
    },
    {
      name: 'Checking the real uid for root',
      desc: 'A setuid-root program has real uid = the caller and effective uid = 0. File permissions use the effective id, so test geteuid().',
      wrong: { label: 'getuid() == 0', code: 'ruid, euid = 1000, 0\nruid == 0', output: 'False' },
      fix:   { label: 'geteuid() == 0', code: 'ruid, euid = 1000, 0\neuid == 0', output: 'True' },
    },
    {
      name: 'Calling os.getuid() on Windows',
      desc: 'It does not exist there. Guard the call, or use getpass.getuser() when all you need is a name.',
      wrong: { label: 'unguarded', code: "import os\nos.name == 'posix' or not hasattr(os, 'getuid')  # on Windows os.getuid() raises AttributeError", output: 'True' },
      fix:   { label: 'guarded', code: "import os\nuid = os.getuid() if hasattr(os, 'getuid') else None\nuid is None or isinstance(uid, int)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Refusing to run as root, or requiring root',
      'Servers that start as root to bind a port, then drop to an unprivileged user',
      'Checking group membership with getgroups()',
    ],
    avoid: [
      'Getting the user name → getpass.getuser() (works on Windows too)',
      'Mapping ids to names → pwd.getpwuid(uid).pw_name / grp.getgrgid(gid).gr_name',
      'Running a child as another user → subprocess user= / group= / extra_groups=',
    ],
  },

  notes: {
    cpython:        'Direct wrappers of the getuid(2) / setuid(2) family; errors become OSError subclasses (PermissionError for EPERM)',
    'Availability': 'Unix only for everything except getlogin (Unix, Windows). getresuid / getresgid / setresuid / setresgid: not macOS, not iOS. setuid / seteuid / setgid / setegid / setreuid / setregid / initgroups: not Android',
    'getlogin':     'Returns the user logged in on the controlling terminal; on Linux it raises OSError when there is none (cron, services, our WSL check: errno 25). getpass.getuser() reads LOGNAME / USER / LNAME / USERNAME, then falls back to the password database',
    'NGROUPS_MAX':  'Maximum number of supplementary groups (65536 on our Linux test system, the same as sysconf("SC_NGROUPS_MAX")); not defined on Windows',
    'macOS getgroups': 'May return the group access list of the effective user rather than the list set with setgroups(), and is not limited to 16 entries on modern builds',
  },

  related: [
    { name: 'os.getpid', slug: 'getpid', when: 'Process, group and session ids' },
    { name: 'os.chmod', slug: 'chmod', when: 'Permissions that the uid/gid are checked against' },
    { name: 'os.access', slug: 'access', when: 'Test access with the real uid' },
    { name: 'os.environ', slug: 'environ', when: 'USER / LOGNAME / USERNAME variables' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'What an unprivileged set* call raises', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why do the examples avoid calling getuid?',
      a: 'These functions are Unix only (docs: Availability: Unix), the ids differ per machine, and the set* calls change the identity of the whole process. The examples show availability, the id arithmetic and a model of the drop-privileges order instead.',
    },
    {
      q: 'How do I check if a Python script is running as root?',
      a: "os.geteuid() == 0 on Unix. Guard it with hasattr(os, 'geteuid') for Windows, where the closest check is ctypes.windll.shell32.IsUserAnAdmin().",
    },
    {
      q: 'Why does os.getlogin() raise OSError?',
      a: 'It asks for the user of the controlling terminal. Under cron, systemd, Docker or other processes without a terminal there is none. Use getpass.getuser() or pwd.getpwuid(os.getuid()).pw_name.',
    },
    {
      q: 'What is the difference between getuid and geteuid?',
      a: 'getuid is the real user (who started the process); geteuid is the effective user, which the kernel uses for permission checks. They differ in setuid programs and after seteuid().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.getuid',
    meta:  'os.getuid and the user/group id family',
  },
};
