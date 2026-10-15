// utils/emulators/python/stdlib/subprocess/run.js
//
// Emulator for the subprocess.run demo tabs, on _subprocess.js.
//   check   — the last lines of run(): CalledProcessError when check=True
//             meets a non-zero exit code, else the CompletedProcess
//   streams — where a FIXED child's stdout/stderr lines end up for each
//             PIPE / STDOUT / DEVNULL / None choice (no process is started)

import { num, truthy, calledProcessError, completedProcessRepr, routeStreams } from './_subprocess.js';

export default {
  // args, returncode, stdout = ...
  // if returncode: raise CalledProcessError(returncode, args, output=stdout)
  // CompletedProcess(args, returncode, stdout)
  check: (args, code, out) => {
    num(code);
    if (truthy(code)) throw calledProcessError(code, args);
    return { __pyRaw: completedProcessRepr(args, code, out) };
  },

  // r = subprocess.run([...child...], stdout=streams[a], stderr=streams[b], text=True)
  // (r.returncode, r.stdout, r.stderr)
  streams: (stdout, stderr) => {
    const r = routeStreams(stdout, stderr);
    return { __pyTuple: [r.returncode, r.stdout, r.stderr] };
  },
};
