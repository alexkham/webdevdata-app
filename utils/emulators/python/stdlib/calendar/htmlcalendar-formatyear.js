// utils/emulators/python/stdlib/calendar/htmlcalendar-formatyear.js
//
// Emulator for the HTMLCalendar.formatyear / formatyearpage demo tabs, on
// the port in _pycalendar.js (formatyearpage returns PyBytes; the UTF-8,
// ASCII and Latin-1 codecs are built, other encodings are a demo limit).

import * as C from './_pycalendar.js';

// str.count(sub) — non-overlapping occurrences
const count = (s, sub) => s.split(sub).length - 1;

export default {
  // html = calendar.HTMLCalendar().formatyear(year, width=width)
  // (html.split('<tr><td>')[0], html.count('<tr><td>'))
  year: (year, width) => {
    const html = new C.HTMLCalendar().formatyear(C.arg(year), C.arg(width));
    return { __pyTuple: [html.split('<tr><td>')[0], BigInt(count(html, '<tr><td>'))] };
  },

  // page = calendar.HTMLCalendar().formatyearpage(year, css=css); page.splitlines()[:7]
  page: (year, css) => {
    const page = new C.HTMLCalendar().formatyearpage(C.arg(year), 3n, css);
    return { __pyRaw: C.repr(C.bytesSplitlines(page).slice(0, 7)) };
  },

  // calendar.HTMLCalendar().formatyearpage(2026, css=css, encoding=encoding).splitlines()[4:6]
  encoding: (css, encoding) => {
    const page = new C.HTMLCalendar().formatyearpage(2026n, 3n, css, encoding);
    return { __pyRaw: C.repr(C.bytesSplitlines(page).slice(4, 6)) };
  },
};
