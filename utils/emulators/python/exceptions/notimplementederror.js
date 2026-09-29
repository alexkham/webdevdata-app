// utils/emulators/python/exceptions/notimplementederror.js
//
// Emulator for the NotImplementedError demo modes. The trigger snippet
// has a base class whose export() raises NotImplementedError and two
// subclasses — one overrides it, one does not — picked from a dict.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { raise } from '../../../py-exceptions.js';

class Exporter {
  export() {
    raise('NotImplementedError', 'subclasses must implement export()');
  }
}
class CsvExporter extends Exporter {
  export(data) {
    return data.join(',');
  }
}
class JsonExporter extends Exporter {}

const exporters = new Map([['csv', new CsvExporter()], ['json', new JsonExporter()]]);

export default {
  trigger: (fmt) => {
    if (!exporters.has(fmt)) raise('KeyError', pyRepr(fmt));
    return exporters.get(fmt).export(['a', 'b']);
  },

  // str(NotImplementedError(msg)) is msg; an empty message leaves the
  // bare class name on the traceback line.
  raise: (msg) => raise('NotImplementedError', msg),
};
