// utils/emulators/python/stdlib/io/unsupportedoperation.js
//
// Emulator for the io.UnsupportedOperation demo: open()'s mode resolution
// from _pyio.js, then read() / write(empty) on an empty existing file with
// the refusal message of the class open() returned.

import { openFile, PyBytes } from './_pyio.js';

export default {
  mode: (mode) => {
    // open('demo.txt', 'w').close() ran first: the file exists and is empty.
    // A text stream's .mode is the mode as given (never contains 'b'); a
    // binary one reports FileIO's mode, which always does — so `empty` is
    // '' for text and b'' for binary, matching what each accepts.
    const f = openFile('demo.txt', mode, -1n, true);
    const text = f.cls === 'TextIOWrapper';
    const attempts = [];
    if (f.readable) attempts.push(text ? '' : new PyBytes([]));
    else attempts.push(`UnsupportedOperation: ${text ? 'not readable' : 'read'}`);
    if (f.writable) attempts.push(0n);
    else attempts.push(`UnsupportedOperation: ${text ? 'not writable' : 'write'}`);
    return attempts;
  },
};
