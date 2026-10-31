// utils/emulators/python/stdlib/configparser/configparser.js
//
// Emulator for the configparser.ConfigParser demo tabs, on the CPython port
// in _pyconfigparser.js.

import { ConfigParser, asPy, joinLines, sectionsDict, pyv, tuple } from './_pyconfigparser.js';
import { PyException } from '../../../../py-exceptions.js';

// presets = {...} in the template → constructor keyword arguments
const PRESETS = {
  default: {},
  allow_no_value: { allowNoValue: true },
  'inline comments': { inlineCommentPrefixes: ['#', ';'] },
  'strict=False': { strict: false },
  'interpolation=None': { interpolation: null },
  'empty_lines_in_values=False': { emptyLinesInValues: false },
  'delimiters=("=",)': { delimiters: ['='] },
};

export default {
  // config = configparser.ConfigParser(**presets[preset]); config.read_string(...)
  // {name: dict(config[name]) for name in config.sections()}
  options: (preset, ...lines) => {
    if (!Object.prototype.hasOwnProperty.call(PRESETS, preset)) throw new PyException('KeyError', pyv(preset));
    const config = new ConfigParser(PRESETS[preset]);
    config.read_string(joinLines(...lines));
    return asPy(sectionsDict(config));
  },

  // (config.sections(), list(config), len(config), 'DEFAULT' in config)
  mapping: (...lines) => {
    const config = new ConfigParser();
    config.read_string(joinLines(...lines));
    return asPy(tuple(config.sections(), config.keys(), BigInt(config.len()), config.contains('DEFAULT')));
  },
};
