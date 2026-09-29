// utils/emulators/python/keywords/async-await.js
//
// Emulator for the async / await demo tabs. It runs a miniature asyncio
// event loop: coroutines are JS generators, `yield SLEEP0` is
// `await asyncio.sleep(0)` (give control back to the loop), and the loop
// runs ready tasks first in, first out — the order CPython's asyncio uses
// (call_soon queue). gather() wraps each coroutine in a Task, scheduled in
// argument order; the awaiting task resumes when all of them are done.
// Numbers follow the Python value of the literal the code shows.

import { fromLiteral, cmp, toPy, reprOf } from '../../../py-num.js';

const SLEEP0 = { sleep0: true };
const gather = (...coros) => ({ gather: coros });

// asyncio.run(main): drive tasks until the main task finishes
function run(mainCoro) {
  const ready = [];
  const mainTask = { gen: mainCoro, done: false, result: undefined, waiters: [] };
  ready.push({ task: mainTask, send: undefined });
  while (ready.length > 0) {
    const { task, send } = ready.shift();
    const r = task.gen.next(send);
    if (r.done) {
      task.done = true;
      task.result = r.value;
      for (const w of task.waiters) w();
      continue;
    }
    const req = r.value;
    if (req === SLEEP0) {
      ready.push({ task, send: undefined }); // re-queued behind the others
    } else if (req && req.gather) {
      const children = req.gather.map((gen) => ({ gen, done: false, result: undefined, waiters: [] }));
      children.forEach((c) => ready.push({ task: c, send: undefined })); // create_task → call_soon
      if (children.length === 0) {
        ready.push({ task, send: [] });
      } else {
        let left = children.length;
        const onDone = () => {
          left -= 1;
          if (left === 0) ready.push({ task, send: children.map((c) => c.result) });
        };
        children.forEach((c) => c.waiters.push(onDone));
      }
    }
  }
  return mainTask.result;
}

// async def worker(name, items): for x in items: log.append(f'{name}{x}'); await sleep(0)
function makeWorker(log) {
  return function* worker(name, items) {
    for (const x of items) {
      log.push(`${name}${reprOf(x)}`);
      yield SLEEP0;
    }
  };
}

// main: await worker('a', xs); await worker('b', ys)
function sequential(xs, ys) {
  const a = xs.map((n) => fromLiteral(n));
  const b = ys.map((n) => fromLiteral(n));
  const log = [];
  const worker = makeWorker(log);
  run((function* main() {
    yield* worker('a', a); // awaiting a coroutine runs it inside this task
    yield* worker('b', b);
  })());
  return log;
}

// main: await asyncio.gather(worker('a', xs), worker('b', ys))
function gathered(xs, ys) {
  const a = xs.map((n) => fromLiteral(n));
  const b = ys.map((n) => fromLiteral(n));
  const log = [];
  const worker = makeWorker(log);
  run((function* main() {
    yield gather(worker('a', a), worker('b', b));
  })());
  return log;
}

// async generator ticker + [x async for x in ticker(nums) if x > 0]
function asyncFor(nums) {
  const xs = nums.map((n) => fromLiteral(n));
  const zero = { int: 0n };
  return run((function* main() {
    const out = [];
    for (const x of xs) {
      yield SLEEP0;          // await asyncio.sleep(0) inside ticker
      if (cmp(x, zero) > 0) out.push(toPy(x));
    }
    return out;
  })());
}

export default {
  await: sequential,
  gather: gathered,
  asyncfor: asyncFor,
};
