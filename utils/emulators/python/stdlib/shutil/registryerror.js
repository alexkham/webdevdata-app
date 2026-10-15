// utils/emulators/python/stdlib/shutil/registryerror.js
//
// Emulator for the shutil.RegistryError demo: register_unpack_format's
// extension check (_check_unpack_options) on a fresh copy of the registry.

import { Shutil, typeName, isinst } from './_pyshutil.js';

export default {
  // register 'mine' for extensions (uncaught), unregister, 'registered and removed'
  trigger: (extensions) => {
    const sh = new Shutil();
    sh.registerUnpackFormat('mine', extensions, '', () => null);
    sh.unregisterUnpackFormat('mine');
    return 'registered and removed';
  },

  // (type(e).__name__, isinstance(e, OSError), str(e)) or 'registered'
  catch: (extensions) => {
    const sh = new Shutil();
    try {
      sh.registerUnpackFormat('mine', extensions, '', () => null);
    } catch (e) {
      if (isinst(e, 'Exception')) return { __pyTuple: [typeName(e), isinst(e, 'OSError'), e.message] };
      throw e;
    }
    sh.unregisterUnpackFormat('mine');
    return 'registered';
  },
};
