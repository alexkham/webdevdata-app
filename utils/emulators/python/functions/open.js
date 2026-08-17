// utils/emulators/python/open.js
//
// Emulator for Python open(). File I/O has no meaningful single-input
// output — the demo picks a MODE and describes what open() does for
// that mode, so users understand the semantics before they run it.

const SAMPLES = {
  'r': [
    '# open(path, "r", encoding="utf-8")',
    '# read-only, text mode',
    '# file MUST exist — FileNotFoundError otherwise',
    '# returns a TextIOWrapper — .read() gives str',
    '',
    'with open("data.txt", "r", encoding="utf-8") as f:',
    '    text = f.read()',
  ].join('\n'),

  'w': [
    '# open(path, "w", encoding="utf-8")',
    '# write-only, text mode',
    '# ⚠ TRUNCATES the file immediately on open',
    '# file created if missing',
    '',
    'with open("out.txt", "w", encoding="utf-8") as f:',
    '    f.write("hello\\n")',
  ].join('\n'),

  'a': [
    '# open(path, "a", encoding="utf-8")',
    '# append-only, text mode',
    '# seeks to END on open — writes never overwrite existing data',
    '# file created if missing',
    '',
    'with open("log.txt", "a", encoding="utf-8") as f:',
    '    f.write("new line\\n")',
  ].join('\n'),

  'rb': [
    '# open(path, "rb")',
    '# read-only, BINARY mode',
    '# returns bytes, not str',
    '# no encoding, no newline translation',
    '',
    'with open("photo.jpg", "rb") as f:',
    '    data = f.read()   # bytes',
  ].join('\n'),

  'r+': [
    '# open(path, "r+", encoding="utf-8")',
    '# READ and WRITE, text mode',
    '# file MUST exist (unlike "w+", which truncates)',
    '# seek anywhere; writes overwrite in place',
    '',
    'with open("data.txt", "r+", encoding="utf-8") as f:',
    '    text = f.read()',
    '    f.seek(0)',
    '    f.write("prefix: " + text)',
  ].join('\n'),

  'x': [
    '# open(path, "x", encoding="utf-8")',
    '# CREATE EXCLUSIVE, write mode',
    '# fails with FileExistsError if the file already exists',
    '# useful when you must NOT overwrite',
    '',
    'with open("new.txt", "x", encoding="utf-8") as f:',
    '    f.write("first version")',
  ].join('\n'),
};

export default function pyOpen(mode) {
  const m = String(mode == null ? '' : mode).trim() || 'r';
  return SAMPLES[m] !== undefined ? SAMPLES[m] : SAMPLES['r'];
}