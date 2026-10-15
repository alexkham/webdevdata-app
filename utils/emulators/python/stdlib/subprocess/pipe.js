// utils/emulators/python/stdlib/subprocess/pipe.js
//
// Emulator for the PIPE / STDOUT / DEVNULL demo: where a FIXED child's
// stdout and stderr lines end up for each choice (_subprocess.js
// routeStreams). No process is started — only the routing is computed.

import { routeStreams } from './_subprocess.js';

export default {
  // r = subprocess.run([...child...], stdout=streams[a], stderr=streams[b], text=True)
  // (r.stdout, r.stderr)
  streams: (stdout, stderr) => {
    const r = routeStreams(stdout, stderr);
    return { __pyTuple: [r.stdout, r.stderr] };
  },
};
