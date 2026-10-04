// utils/emulators/python/stdlib/os/environ.js
//
// Emulator for the os.environ demo tabs: a temporary environment
// (mock.patch.dict(..., clear=True)) modelled by _environ.js.

import { makeEnviron } from './_environ.js';
import { pySorted } from './_vfs.js';
import { PyException } from '../../../../py-exceptions.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // item = os.environ[name] (or 'KeyError: ' + str(e)); getenv(name); getenv(name, 'default')
  read: (name) => {
    const env = makeEnviron({ HOME: '/home/ada', LANG: 'C.UTF-8' });
    let item;
    try {
      item = env.item(name);
    } catch (e) {
      if (!(e instanceof PyException && e.name === 'KeyError')) throw e;
      item = `KeyError: ${e.message}`;
    }
    return tuple(item, env.get(name), env.get(name, 'default'));
  },

  // os.environ['LOG_LEVEL'] = value; (value, 'LOG_LEVEL' in os.environ, len(os.environ))
  write: (value) => {
    const env = makeEnviron();
    env.set('LOG_LEVEL', value);
    return tuple(env.item('LOG_LEVEL'), env.has('LOG_LEVEL'), env.data.size);
  },

  // removed = os.environ.pop(name, None); (removed, sorted(os.environ))
  pop: (name) => {
    const env = makeEnviron({ TOKEN: 'abc', HOME: '/home/ada' });
    const removed = env.pop(name, null);
    return tuple(removed, pySorted([...env.data.keys()]));
  },
};
