// utils/emulators/python/stdlib/shutil/get_archive_formats.js
//
// Emulator for the archive-format registry demo: the registry of the
// shutil port in _pyshutil.js (a fresh copy per run, like a fresh
// process), with the snippet's report() archiver as a JS function.

import { Shutil } from './_pyshutil.js';
import { pySorted } from '../os/_vfs.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

// def report(base_name, base_dir, **kwargs):
//     return f'{base_name}.txt from {base_dir!r}, kwargs {sorted(kwargs)}'
const report = (baseName, baseDir, kwargs) => {
  const keys = pySorted(Object.keys(kwargs)).map(pyStrRepr).join(', ');
  return `${baseName}.txt from ${pyStrRepr(baseDir)}, kwargs [${keys}]`;
};

export default {
  // register, then (sorted names, description, make_archive('out', name)); unregister
  register: (name, desc) => {
    const sh = new Shutil();
    sh.registerArchiveFormat(name, desc, report);
    try {
      const formats = new Map(sh.getArchiveFormats().map((t) => t.__pyTuple));
      return { __pyTuple: [pySorted([...formats.keys()]), formats.get(name), sh.makeArchive('out', name)] };
    } finally {
      sh.unregisterArchiveFormat(name);
    }
  },

  // dict(shutil.get_archive_formats()).get(name, 'not registered')
  lookup: (name) => {
    const formats = new Map(new Shutil().getArchiveFormats().map((t) => t.__pyTuple));
    if (!formats.has(name)) return 'not registered';
    return formats.get(name);
  },
};
