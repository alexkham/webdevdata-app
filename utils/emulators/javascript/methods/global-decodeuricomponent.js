// Emulator for the global decodeURIComponent.
//
// Returns both forms to mirror the encode page — decodeURI deliberately
// leaves reserved sequences like %26 encoded.
export default function globalDecodeUriComponent(s) {
  return [decodeURIComponent(s), decodeURI(s)];
}
