// utils/emulators/python/stdlib/contextlib/asynccontextmanager.js
//
// Emulator for the contextlib.asynccontextmanager demo tabs, on the port of
// _AsyncGeneratorContextManager in _pycontextlib.js. The snippets' coroutines
// never suspend (no sleeps, no I/O), so asyncio.run(main()) is main() run to
// the end and every await is a direct call; the async generator is driven
// with anext / athrow / aclose semantics (StopAsyncIteration, the async
// messages, PEP 479 for coroutines).

import { asynccontextmanager, asyncWithStmt, coroutine, tryExcept } from './_pycontextlib.js';
import { floorDivLit, rangeBound, str } from './_demo.js';

export default {
  // @asynccontextmanager async def session(name): open / try: yield / finally: close
  // async def main(): async with session(name) as s: log use, log 100 // n
  // try: asyncio.run(main()) except ZeroDivisionError as e: log error
  trace: (name, n) => {
    const log = [];
    const session = asynccontextmanager(function* session(nm) {
      log.push('open ' + nm);
      try {
        yield nm;
      } finally {
        log.push('close ' + nm);
      }
    });
    const main = coroutine(() => {
      asyncWithStmt(session(name), (s) => {
        log.push('use ' + s);
        log.push(floorDivLit(n));
      });
      return null;
    });
    tryExcept(main, 'ZeroDivisionError', (e) => log.push(`error: ${str(e)}`));
    return log;
  },

  // @asynccontextmanager async def resource(): for i in range(count): yield i
  // async def main(): async with resource() as value: return value
  // asyncio.run(main())
  yields: (count) => {
    const resource = asynccontextmanager(function* resource() {
      const stop = rangeBound(count);
      for (let i = 0n; i < stop; i++) yield i;
    });
    const main = coroutine(() => asyncWithStmt(resource(), (value) => value).value ?? null);
    return main();
  },
};
