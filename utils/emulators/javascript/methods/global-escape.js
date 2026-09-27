// Emulator for the deprecated global escape.
//
// Shown next to encodeURIComponent because the contrast IS the lesson:
// escape emits Latin-1 percent codes and mangles anything above U+00FF,
// while encodeURIComponent emits correct UTF-8.
export default function globalEscape(s) {
  return [escape(s), encodeURIComponent(s)];
}
