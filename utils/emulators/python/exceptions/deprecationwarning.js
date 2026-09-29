// utils/emulators/python/exceptions/deprecationwarning.js
//
// Emulator for the DeprecationWarning demo modes.
//
//   trigger — warn_explicit(..., DeprecationWarning, module=<name>) under
//             the default warning filters of a release build (3.13):
//               default::DeprecationWarning:__main__
//               ignore::DeprecationWarning
//             The module field of the first filter is compared to the
//             module name exactly (a plain string, not a pattern), so only
//             '__main__' gets the warning shown (recorded) — everything
//             else is ignored.
//   handle  — simplefilter(action, DeprecationWarning) around a function
//             that warns with stacklevel=2; returns (result, len(caught)).

import { checkAction } from './warning.js';

const MSG = 'old_api() is deprecated; use new_api()';

export default {
  trigger: (module) => (module === '__main__' ? 1 : 0),

  handle: (action) => {
    checkAction(action);
    // 'error': warn() raises; except DeprecationWarning as e → f'caught: {e}'
    if (action === 'error') return { __pyTuple: [`caught: ${MSG}`, 0] };
    // old_api() returns 1; one warning recorded unless ignored
    return { __pyTuple: [1, action === 'ignore' ? 0 : 1] };
  },
};
