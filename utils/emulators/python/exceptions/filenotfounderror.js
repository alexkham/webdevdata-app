// utils/emulators/python/exceptions/filenotfounderror.js
//
// Emulator for the FileNotFoundError demo modes. The snippets build their
// own virtual directory (report_1..3.txt, settings_1.json) inside an empty
// working directory; any other name fails with ENOENT. open() reports the
// C-runtime errno on every platform: "[Errno 2] No such file or directory:
// repr(path)".

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

const ENOENT_MSG = 'No such file or directory';

const makeFs = (files) => (name) => {
  if (Object.prototype.hasOwnProperty.call(files, name)) return files[name];
  return raise('FileNotFoundError', `[Errno 2] ${ENOENT_MSG}: ${pyRepr(name)}`);
};

const reports = makeFs({ 'report_1.txt': 'report 1', 'report_2.txt': 'report 2', 'report_3.txt': 'report 3' });
const settings = makeFs({ 'settings_1.json': '{"theme": "dark"}' });

export default {
  trigger: (n) => reports(`report_${n}.txt`),

  // FileNotFoundError(errno, strerror, filename): filename None → no ": path"
  raise: (path) => raise(
    'FileNotFoundError',
    path === null ? `[Errno 2] ${ENOENT_MSG}` : `[Errno 2] ${ENOENT_MSG}: ${pyRepr(path)}`,
  ),

  handle: (n) => {
    const name = `settings_${n}.json`;
    try {
      return settings(name);
    } catch (e) {
      return `using defaults, ${name} not found`;
    }
  },
};
