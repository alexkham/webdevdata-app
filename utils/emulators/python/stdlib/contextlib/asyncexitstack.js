// utils/emulators/python/stdlib/contextlib/asyncexitstack.js
//
// Emulator for the contextlib.AsyncExitStack demo tabs, on the port in
// _pycontextlib.js. The coroutines never suspend, so asyncio.run(main()) is
// main() run to the end and each await is a direct call.

import { AsyncExitStack, asyncWithStmt, coroutine, contextmanager, asynccontextmanager } from './_pycontextlib.js';

export default {
  // async def release(name): log release
  // async def main(): async with AsyncExitStack() as stack:
  //     for name in names: log acquire; stack.push_async_callback(release, name)
  //     log work
  callbacks: (names) => {
    const log = [];
    const release = coroutine((name) => { log.push('release ' + name); return null; });
    const main = coroutine(() => {
      asyncWithStmt(new AsyncExitStack(), (stack) => {
        for (const name of names) {
          log.push('acquire ' + name);
          stack.push_async_callback(release, name);
        }
        log.push('work');
      });
      return null;
    });
    main();
    return log;
  },

  // @contextmanager lock(name) and @asynccontextmanager connect(name)
  // async def main(): async with AsyncExitStack() as stack:
  //     for name in names: stack.enter_context(lock(name))
  //                        await stack.enter_async_context(connect(name))
  //     log work
  mixed: (names) => {
    const log = [];
    const lock = contextmanager(function* lock(name) {
      log.push('lock ' + name);
      yield;
      log.push('unlock ' + name);
    });
    const connect = asynccontextmanager(function* connect(name) {
      log.push('connect ' + name);
      yield name;
      log.push('disconnect ' + name);
    });
    const main = coroutine(() => {
      asyncWithStmt(new AsyncExitStack(), (stack) => {
        for (const name of names) {
          stack.enter_context(lock(name));
          stack.enter_async_context(connect(name));
        }
        log.push('work');
      });
      return null;
    });
    main();
    return log;
  },
};
