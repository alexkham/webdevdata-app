// // // // // Base64Tool.jsx
// // // // // ─────────────────────────────────────────────────────────────
// // // // // Base64 encoder / decoder. Client-side only.
// // // // //
// // // // // UTF-8 safe: native btoa/atob only handle Latin-1, which fails
// // // // // on any character above 0xFF (emoji, Cyrillic, CJK, etc.).
// // // // // This tool wraps them with TextEncoder/TextDecoder so any
// // // // // Unicode string round-trips correctly.
// // // // //
// // // // // Owns its own state (input, mode, copied). No props from the
// // // // // page. Fits inside the layout's tool-region container — the
// // // // // bordered card, rounded corners, and shadow come from the
// // // // // layout, not from here.
// // // // // ─────────────────────────────────────────────────────────────

// // // // import { useState } from 'react';

// // // // function encode(str) {
// // // //   const bytes = new TextEncoder().encode(str);
// // // //   let binary = '';
// // // //   bytes.forEach((b) => { binary += String.fromCharCode(b); });
// // // //   return btoa(binary);
// // // // }

// // // // function decode(b64) {
// // // //   const binary = atob(b64.trim());
// // // //   const bytes = new Uint8Array(binary.length);
// // // //   for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
// // // //   return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
// // // // }

// // // // export default function Base64Tool() {
// // // //   const [mode,   setMode]   = useState('encode');
// // // //   const [input,  setInput]  = useState('');
// // // //   const [copied, setCopied] = useState(false);

// // // //   let output = '';
// // // //   let error  = null;

// // // //   if (input) {
// // // //     try {
// // // //       output = mode === 'encode' ? encode(input) : decode(input);
// // // //     } catch (err) {
// // // //       error = mode === 'encode'
// // // //         ? 'Failed to encode this input.'
// // // //         : 'Not valid Base64 (or not valid UTF-8 after decoding).';
// // // //     }
// // // //   }

// // // //   const handleCopy = async () => {
// // // //     if (!output) return;
// // // //     try {
// // // //       await navigator.clipboard.writeText(output);
// // // //       setCopied(true);
// // // //       setTimeout(() => setCopied(false), 1500);
// // // //     } catch {
// // // //       /* clipboard denied — silent no-op */
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div style={S.wrap}>

// // // //       <div style={S.header}>
// // // //         <div style={S.tabs}>
// // // //           <button
// // // //             type="button"
// // // //             onClick={() => setMode('encode')}
// // // //             style={mode === 'encode' ? { ...S.tab, ...S.tabActive } : S.tab}
// // // //           >Encode</button>
// // // //           <button
// // // //             type="button"
// // // //             onClick={() => setMode('decode')}
// // // //             style={mode === 'decode' ? { ...S.tab, ...S.tabActive } : S.tab}
// // // //           >Decode</button>
// // // //         </div>
// // // //         <div style={S.headerHint}>
// // // //           {mode === 'encode' ? 'Text \u2192 Base64' : 'Base64 \u2192 Text'}
// // // //         </div>
// // // //       </div>

// // // //       <div style={S.panes}>
// // // //         <div style={S.pane}>
// // // //           <div style={S.paneLabel}>
// // // //             <span>Input</span>
// // // //           </div>
// // // //           <textarea
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             placeholder={mode === 'encode'
// // // //               ? 'Enter text to encode...'
// // // //               : 'Paste Base64 to decode...'}
// // // //             style={S.textarea}
// // // //             spellCheck={false}
// // // //           />
// // // //         </div>
// // // //         <div style={S.pane}>
// // // //           <div style={S.paneLabel}>
// // // //             <span>Output</span>
// // // //             {output && !error && (
// // // //               <button type="button" onClick={handleCopy} style={S.copyBtn}>
// // // //                 {copied ? 'Copied' : 'Copy'}
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //           <pre style={{ ...S.output, color: error ? '#b91c1c' : '#0f172a' }}>
// // // //             {error || output}
// // // //           </pre>
// // // //         </div>
// // // //       </div>

// // // //     </div>
// // // //   );
// // // // }

// // // // const S = {
// // // //   wrap: {
// // // //     display:       'flex',
// // // //     flexDirection: 'column',
// // // //     minHeight:     550,
// // // //   },
// // // //   header: {
// // // //     padding:      '10px 14px',
// // // //     background:   '#fafbfc',
// // // //     borderBottom: '1px solid #e4e4e7',
// // // //     display:      'flex',
// // // //     alignItems:   'center',
// // // //     justifyContent: 'space-between',
// // // //     gap:          16,
// // // //   },
// // // //   tabs: {
// // // //     display:      'flex',
// // // //     gap:          4,
// // // //     background:   '#e2e8f0',
// // // //     padding:      3,
// // // //     borderRadius: 6,
// // // //   },
// // // //   tab: {
// // // //     padding:       '5px 14px',
// // // //     fontSize:      12.5,
// // // //     fontWeight:    600,
// // // //     border:        'none',
// // // //     background:    'transparent',
// // // //     color:         '#475569',
// // // //     borderRadius:  4,
// // // //     cursor:        'pointer',
// // // //     transition:    'background 0.15s, color 0.15s',
// // // //   },
// // // //   tabActive: {
// // // //     background:    '#ffffff',
// // // //     color:         '#1B50EE',
// // // //     boxShadow:     '0 1px 2px rgba(15,23,42,0.08)',
// // // //   },
// // // //   headerHint: {
// // // //     fontFamily:    'ui-monospace, Menlo, monospace',
// // // //     fontSize:      11.5,
// // // //     color:         '#64748b',
// // // //     letterSpacing: '0.03em',
// // // //   },
// // // //   panes: {
// // // //     display:            'grid',
// // // //     gridTemplateColumns:'1fr 1fr',
// // // //     gap:                1,
// // // //     background:         '#e4e4e7',
// // // //     flex:               1,
// // // //     minHeight:          360,
// // // //   },
// // // //   pane: {
// // // //     display:       'flex',
// // // //     flexDirection: 'column',
// // // //     background:    '#ffffff',
// // // //     minHeight:     0,
// // // //   },
// // // //   paneLabel: {
// // // //     fontSize:       11,
// // // //     fontWeight:     700,
// // // //     color:          '#71717a',
// // // //     letterSpacing:  '0.09em',
// // // //     textTransform:  'uppercase',
// // // //     padding:        '10px 16px',
// // // //     borderBottom:   '1px solid #f1f5f9',
// // // //     background:     '#fafafa',
// // // //     display:        'flex',
// // // //     alignItems:     'center',
// // // //     justifyContent: 'space-between',
// // // //     minHeight:      20,
// // // //   },
// // // //   copyBtn: {
// // // //     padding:       '3px 10px',
// // // //     fontSize:      10.5,
// // // //     fontWeight:    700,
// // // //     background:    '#ffffff',
// // // //     color:         '#1B50EE',
// // // //     border:        '1px solid #C8D4F6',
// // // //     borderRadius:  4,
// // // //     cursor:        'pointer',
// // // //     letterSpacing: '0.06em',
// // // //     textTransform: 'uppercase',
// // // //   },
// // // //   textarea: {
// // // //     flex:       1,
// // // //     resize:     'none',
// // // //     border:     'none',
// // // //     outline:    'none',
// // // //     padding:    '14px 16px',
// // // //     fontFamily: 'ui-monospace, Menlo, monospace',
// // // //     fontSize:   13,
// // // //     lineHeight: 1.6,
// // // //     background: 'transparent',
// // // //     color:      '#0f172a',
// // // //   },
// // // //   output: {
// // // //     flex:       1,
// // // //     margin:     0,
// // // //     padding:    '14px 16px',
// // // //     fontFamily: 'ui-monospace, Menlo, monospace',
// // // //     fontSize:   13,
// // // //     lineHeight: 1.6,
// // // //     overflow:   'auto',
// // // //     whiteSpace: 'pre-wrap',
// // // //     wordBreak:  'break-all',
// // // //   },
// // // // };


// // // // Base64Tool.jsx
// // // // ─────────────────────────────────────────────────────────────
// // // // Base64 encoder / decoder tool component.
// // // //
// // // // Applies every rule we agreed on:
// // // //   • 550px min-height (top-level wrap)
// // // //   • Reset button always present
// // // //   • Explanations box — opt-in via prop, right-side slot
// // // //   • Stronger visual weight on pane headers and control panels
// // // //   • Theme support — 'light' | 'terminal' via prop
// // // //   • Text encoding selector — UTF-8, UTF-16 LE/BE, Latin-1
// // // //   • Orientation toggle — horizontal/vertical, opt-in via prop
// // // //   • Tooltips on non-obvious controls
// // // //
// // // // Props
// // // //   theme                  'light' | 'terminal'         default 'light'
// // // //   showExplanations       boolean                       default false
// // // //   showOrientationToggle  boolean                       default true
// // // //   initialOrientation     'horizontal' | 'vertical'     default 'horizontal'
// // // //   explanations           { encode?, decode? } | null   default null
// // // //     Each value can be a string (rendered via dangerouslySetInnerHTML
// // // //     as a placeholder for future processContent integration) or a
// // // //     ReactNode (rendered directly). Missing keys fall back to the
// // // //     built-in defaults per key.
// // // //
// // // // The tool component does not paint its own outer border / radius /
// // // // shadow — those come from the layout's tool-region container.
// // // // ─────────────────────────────────────────────────────────────

// // // import { useState, useEffect, useRef } from 'react';

// // // // ─── Helpers ────────────────────────────────────────────────

// // // function textToBytes(str, cs) {
// // //   if (cs === 'utf-8') return new TextEncoder().encode(str);
// // //   if (cs === 'utf-16le' || cs === 'utf-16be') {
// // //     const be = cs === 'utf-16be';
// // //     const bytes = new Uint8Array(str.length * 2);
// // //     for (let i = 0; i < str.length; i++) {
// // //       const c = str.charCodeAt(i);
// // //       bytes[i * 2]     = be ? (c >> 8) & 0xff : c & 0xff;
// // //       bytes[i * 2 + 1] = be ? c & 0xff : (c >> 8) & 0xff;
// // //     }
// // //     return bytes;
// // //   }
// // //   if (cs === 'latin-1') {
// // //     const bytes = new Uint8Array(str.length);
// // //     for (let i = 0; i < str.length; i++) {
// // //       const c = str.charCodeAt(i);
// // //       if (c > 255) {
// // //         throw new Error(
// // //           'Character U+' + c.toString(16).padStart(4, '0') + ' cannot be represented in Latin-1.'
// // //         );
// // //       }
// // //       bytes[i] = c;
// // //     }
// // //     return bytes;
// // //   }
// // //   throw new Error('Unknown encoding: ' + cs);
// // // }

// // // function bytesToText(bytes, cs) {
// // //   const label = cs === 'latin-1' ? 'iso-8859-1' : cs;
// // //   return new TextDecoder(label, { fatal: true }).decode(bytes);
// // // }

// // // function bytesToBase64(bytes, opts) {
// // //   let bin = '';
// // //   for (const b of bytes) bin += String.fromCharCode(b);
// // //   let out = btoa(bin);
// // //   if (opts.urlSafe)  out = out.replace(/\+/g, '-').replace(/\//g, '_');
// // //   if (opts.stripPad) out = out.replace(/=+$/, '');
// // //   if (opts.wrap)     out = out.match(/.{1,76}/g).join('\n');
// // //   return out;
// // // }

// // // function base64ToBytes(s) {
// // //   let c = s.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
// // //   while (c.length % 4) c += '=';
// // //   const bin = atob(c);
// // //   const bytes = new Uint8Array(bin.length);
// // //   for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
// // //   return bytes;
// // // }

// // // // ─── Constants ──────────────────────────────────────────────

// // // const DEFAULT_EXPLANATIONS = {
// // //   encode: (
// // //     <>
// // //       <p><b>Encode</b> converts text into a Base64 string. Under the hood, the tool first turns your text into bytes using the selected text encoding (UTF-8 by default), then represents those bytes with 64 safe characters: <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, <code>/</code>.</p>
// // //       <p>Common uses: embedding binary data in JSON, cookies, or email headers, and building data URIs.</p>
// // //     </>
// // //   ),
// // //   decode: (
// // //     <>
// // //       <p><b>Decode</b> reverses the process: it converts a Base64 string back into raw bytes, then interprets those bytes as text using the selected encoding. Whitespace and padding (<code>=</code>) are handled automatically.</p>
// // //       <p>If the input isn&apos;t valid Base64 or the resulting bytes aren&apos;t valid for the selected encoding, an error is shown.</p>
// // //     </>
// // //   ),
// // // };

// // // const SAMPLES = {
// // //   hello:   { mode: 'encode', text: 'Hello, world!',                              tip: 'Simple ASCII text' },
// // //   unicode: { mode: 'encode', text: 'Café — 中文 — 🚀 emoji test',               tip: 'Text with emoji and international characters' },
// // //   jwt:     { mode: 'decode', text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',       tip: 'URL-safe fragment from a JWT header' },
// // //   dataUri: { mode: 'decode', text: 'SGVsbG8sIHdvcmxkIQ==',                       tip: 'Base64 string ready to decode' },
// // // };

// // // // ─── Component ──────────────────────────────────────────────

// // // export default function Base64Tool({
// // //   theme                 = 'light',
// // //   showExplanations      = false,
// // //   showOrientationToggle = true,
// // //   initialOrientation    = 'horizontal',
// // //   explanations          = null,
// // // }) {
// // //   const [mode,        setMode]        = useState('encode');
// // //   const [input,       setInput]       = useState('');
// // //   const [output,      setOutput]      = useState('');
// // //   const [error,       setError]       = useState(null);
// // //   const [inputSize,   setInputSize]   = useState(0);
// // //   const [urlSafe,     setUrlSafe]     = useState(false);
// // //   const [stripPad,    setStripPad]    = useState(false);
// // //   const [wrap,        setWrap]        = useState(false);
// // //   const [charset,     setCharset]     = useState('utf-8');
// // //   const [orientation, setOrientation] = useState(initialOrientation);
// // //   const [copied,      setCopied]      = useState(false);
// // //   const [fileMode,    setFileMode]    = useState(false);

// // //   const fileInputRef = useRef(null);

// // //   // Derive output whenever input or options change (unless in file mode).
// // //   useEffect(() => {
// // //     if (fileMode) return;
// // //     if (!input) {
// // //       setOutput('');
// // //       setError(null);
// // //       setInputSize(0);
// // //       return;
// // //     }
// // //     try {
// // //       if (mode === 'encode') {
// // //         const bytes  = textToBytes(input, charset);
// // //         const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
// // //         setOutput(result);
// // //         setInputSize(bytes.length);
// // //         setError(null);
// // //       } else {
// // //         const bytes  = base64ToBytes(input);
// // //         const result = bytesToText(bytes, charset);
// // //         setOutput(result);
// // //         setInputSize(input.replace(/\s/g, '').length);
// // //         setError(null);
// // //       }
// // //     } catch (err) {
// // //       setOutput('');
// // //       setError((mode === 'encode' ? 'Failed to encode: ' : 'Failed to decode: ') + err.message);
// // //       setInputSize(0);
// // //     }
// // //   }, [input, mode, charset, urlSafe, stripPad, wrap, fileMode]);

// // //   // ── Handlers ──────────────────────────────────────────────

// // //   const handleInputChange = (e) => {
// // //     if (fileMode) setFileMode(false);
// // //     setInput(e.target.value);
// // //   };

// // //   const handleSample = (key) => {
// // //     const s = SAMPLES[key];
// // //     setFileMode(false);
// // //     setMode(s.mode);
// // //     setInput(s.text);
// // //   };

// // //   const handleReset = () => {
// // //     setMode('encode');
// // //     setInput('');
// // //     setOutput('');
// // //     setError(null);
// // //     setInputSize(0);
// // //     setUrlSafe(false);
// // //     setStripPad(false);
// // //     setWrap(false);
// // //     setCharset('utf-8');
// // //     setFileMode(false);
// // //   };

// // //   const handleCopy = () => {
// // //     if (!output || error) return;
// // //     navigator.clipboard.writeText(output).then(() => {
// // //       setCopied(true);
// // //       setTimeout(() => setCopied(false), 1500);
// // //     });
// // //   };

// // //   const handleDownload = () => {
// // //     if (!output || error) return;
// // //     const blob = new Blob([output], { type: 'text/plain' });
// // //     const url  = URL.createObjectURL(blob);
// // //     const a    = document.createElement('a');
// // //     a.href     = url;
// // //     a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
// // //     a.click();
// // //     URL.revokeObjectURL(url);
// // //   };

// // //   const handleFile = (file) => {
// // //     setMode('encode');
// // //     setFileMode(true);
// // //     const reader = new FileReader();
// // //     reader.onload = () => {
// // //       const bytes  = new Uint8Array(reader.result);
// // //       const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
// // //       setInput(`[File: ${file.name}, ${file.size} bytes]`);
// // //       setOutput(result);
// // //       setInputSize(file.size);
// // //       setError(null);
// // //     };
// // //     reader.readAsArrayBuffer(file);
// // //   };

// // //   const [dragOver, setDragOver] = useState(false);
// // //   const handleDrop = (e) => {
// // //     e.preventDefault();
// // //     setDragOver(false);
// // //     const file = e.dataTransfer.files[0];
// // //     if (file) handleFile(file);
// // //   };

// // //   // ── Derived ────────────────────────────────────────────────

// // //   const hint    = mode === 'encode' ? 'Text \u2192 Base64' : 'Base64 \u2192 Text';
// // //   const outLen  = output ? output.length : 0;
// // //   const ratio   = inputSize ? (outLen / inputSize).toFixed(2) + 'x' : '\u2014';
// // //   const inChars = input.length;

// // //   // Explanation content per mode: page override wins per key, defaults fill gaps.
// // //   const expContent = (() => {
// // //     const override = explanations && explanations[mode];
// // //     if (override) {
// // //       if (typeof override === 'string') {
// // //         return <div dangerouslySetInnerHTML={{ __html: override }} />;
// // //       }
// // //       return override; // Already a ReactNode
// // //     }
// // //     return DEFAULT_EXPLANATIONS[mode];
// // //   })();

// // //   // ── Render ─────────────────────────────────────────────────

// // //   return (
// // //     <div className="tool" data-theme={theme}>

// // //       {/* Top bar */}
// // //       <div className="top-bar">
// // //         <div className="tabs">
// // //           <button
// // //             type="button"
// // //             className={`tab ${mode === 'encode' ? 'on' : ''}`}
// // //             onClick={() => setMode('encode')}
// // //             data-tt="Convert text to Base64"
// // //           >Encode</button>
// // //           <button
// // //             type="button"
// // //             className={`tab ${mode === 'decode' ? 'on' : ''}`}
// // //             onClick={() => setMode('decode')}
// // //             data-tt="Convert Base64 to text"
// // //           >Decode</button>
// // //         </div>
// // //         <div className="hint">{hint}</div>
// // //         <div className="top-actions">
// // //           {showOrientationToggle && (
// // //             <div className="seg-toggle" role="group" aria-label="Layout orientation">
// // //               <button
// // //                 type="button"
// // //                 className={`seg-btn ${orientation === 'horizontal' ? 'on' : ''}`}
// // //                 onClick={() => setOrientation('horizontal')}
// // //                 data-tt="Panes side by side"
// // //                 aria-label="Side by side"
// // //               >
// // //                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
// // //                   <rect x="1.5" y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
// // //                   <rect x="9"   y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
// // //                 </svg>
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 className={`seg-btn ${orientation === 'vertical' ? 'on' : ''}`}
// // //                 onClick={() => setOrientation('vertical')}
// // //                 data-tt="Panes stacked"
// // //                 aria-label="Stacked"
// // //               >
// // //                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
// // //                   <rect x="3" y="1.5" width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
// // //                   <rect x="3" y="9"   width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
// // //                 </svg>
// // //               </button>
// // //             </div>
// // //           )}
// // //           <button
// // //             type="button"
// // //             className="btn-reset"
// // //             onClick={handleReset}
// // //             data-tt="Clear input, output, and reset all options"
// // //           >Reset</button>
// // //         </div>
// // //       </div>

// // //       {/* Options row */}
// // //       <div className="opts">
// // //         <label className="opt" data-tt="Use - and _ instead of + and /">
// // //           <input type="checkbox" checked={urlSafe}  onChange={(e) => setUrlSafe(e.target.checked)}  />
// // //           URL-safe <span className="opt-note">(- _ instead of + /)</span>
// // //         </label>
// // //         <label className="opt" data-tt="Remove trailing = characters">
// // //           <input type="checkbox" checked={stripPad} onChange={(e) => setStripPad(e.target.checked)} />
// // //           Strip padding <span className="opt-note">(no =)</span>
// // //         </label>
// // //         <label className="opt" data-tt="Wrap output at 76 characters per line (MIME format)">
// // //           <input type="checkbox" checked={wrap}     onChange={(e) => setWrap(e.target.checked)}     />
// // //           Line-wrap 76 <span className="opt-note">(MIME)</span>
// // //         </label>
// // //         <div className="opt-select" data-tt="How text is converted to bytes before encoding">
// // //           <span className="opt-select-lbl">Text encoding:</span>
// // //           <select value={charset} onChange={(e) => setCharset(e.target.value)}>
// // //             <option value="utf-8">UTF-8</option>
// // //             <option value="utf-16le">UTF-16 LE</option>
// // //             <option value="utf-16be">UTF-16 BE</option>
// // //             <option value="latin-1">Latin-1</option>
// // //           </select>
// // //         </div>
// // //       </div>

// // //       {/* Samples row */}
// // //       <div className="samples">
// // //         <span className="samples-lbl">Samples:</span>
// // //         {Object.entries(SAMPLES).map(([key, s]) => (
// // //           <button
// // //             key={key}
// // //             type="button"
// // //             className="sample"
// // //             onClick={() => handleSample(key)}
// // //             data-tt={s.tip}
// // //           >{key === 'hello' ? 'Hello text' : key === 'unicode' ? 'Unicode + emoji' : key === 'jwt' ? 'JWT payload' : 'Data URI'}</button>
// // //         ))}
// // //       </div>

// // //       {/* File drop */}
// // //       <div
// // //         className={`drop ${dragOver ? 'dragover' : ''}`}
// // //         onClick={() => fileInputRef.current && fileInputRef.current.click()}
// // //         onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
// // //         onDragLeave={() => setDragOver(false)}
// // //         onDrop={handleDrop}
// // //         data-tt="Drop any file to encode it as Base64"
// // //       >
// // //         Drop a file here to encode as Base64, or click to browse
// // //       </div>
// // //       <input
// // //         ref={fileInputRef}
// // //         type="file"
// // //         style={{ display: 'none' }}
// // //         onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
// // //       />

// // //       {/* Body: panes + optional explanations */}
// // //       <div className={`body ${showExplanations ? 'with-exp' : ''}`}>

// // //         <div className={`panes ${orientation}`}>
// // //           <div className="pane">
// // //             <div className="lbl"><span>Input</span></div>
// // //             <textarea
// // //               value={input}
// // //               onChange={handleInputChange}
// // //               placeholder={mode === 'encode' ? 'Enter text...' : 'Paste Base64...'}
// // //               spellCheck={false}
// // //             />
// // //           </div>
// // //           <div className="pane">
// // //             <div className="lbl">
// // //               <span>Output</span>
// // //               <div className="lbl-actions">
// // //                 <button
// // //                   type="button"
// // //                   className="btn-in-lbl"
// // //                   onClick={handleCopy}
// // //                   disabled={!output || !!error}
// // //                   data-tt="Copy output to clipboard"
// // //                   data-tt-pos="above"
// // //                 >{copied ? 'Copied' : 'Copy'}</button>
// // //                 <button
// // //                   type="button"
// // //                   className="btn-in-lbl muted"
// // //                   onClick={handleDownload}
// // //                   disabled={!output || !!error}
// // //                   data-tt="Save output as text file"
// // //                   data-tt-pos="above"
// // //                 >Download</button>
// // //               </div>
// // //             </div>
// // //             <pre className={`out ${error ? 'err' : ''}`}>{error || output}</pre>
// // //           </div>
// // //         </div>

// // //         {showExplanations && (
// // //           <div className="exp">
// // //             <div className="exp-hdr">{mode === 'encode' ? 'Encode' : 'Decode'}</div>
// // //             <div className="exp-body">{expContent}</div>
// // //           </div>
// // //         )}

// // //       </div>

// // //       {/* Stats footer */}
// // //       <div className="stats">
// // //         <span>Input: <b>{inChars}</b> chars, <b>{inputSize}</b> bytes</span>
// // //         <span>Output: <b>{outLen}</b> chars</span>
// // //         <span>Ratio: <b>{ratio}</b></span>
// // //       </div>

// // //       <style jsx>{`
// // //         .tool {
// // //           --bg: #ffffff;
// // //           --surface: #ffffff;
// // //           --surface-alt: #f5f7fb;
// // //           --surface-code: #eff2f8;
// // //           --hdr-bg: #eef2f7;
// // //           --hdr-bg-subtle: #f2f6fd;
// // //           --text: #0f172a;
// // //           --text-muted: #475569;
// // //           --text-subtle: #64748b;
// // //           --text-label: #334155;
// // //           --text-input-placeholder: #94a3b8;
// // //           --border: #cfd6e0;
// // //           --border-strong: #a3b0c6;
// // //           --border-subtle: #e4e4e7;
// // //           --border-thin: #f1f5f9;
// // //           --primary: #1B50EE;
// // //           --primary-hover: #133EBF;
// // //           --primary-bg: #E8EEFB;
// // //           --primary-bg-hover: #d5e0f9;
// // //           --primary-border: #C8D4F6;
// // //           --error: #b91c1c;
// // //           --error-bg: #fef2f2;
// // //           --stats-bg: #eef2f7;

// // //           background: var(--surface);
// // //           color: var(--text);
// // //           min-height: 550px;
// // //           display: flex;
// // //           flex-direction: column;
// // //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
// // //         }
// // //         .tool[data-theme="terminal"] {
// // //           --bg: #0A0D14;
// // //           --surface: #101623;
// // //           --surface-alt: #141b2b;
// // //           --surface-code: #0a0e18;
// // //           --hdr-bg: #182236;
// // //           --hdr-bg-subtle: rgba(77,116,255,0.08);
// // //           --text: #d4dae5;
// // //           --text-muted: #97a3b8;
// // //           --text-subtle: #6b7891;
// // //           --text-label: #c1cad9;
// // //           --text-input-placeholder: #4b5875;
// // //           --border: #1e2637;
// // //           --border-strong: #2d3a52;
// // //           --border-subtle: #1e2637;
// // //           --border-thin: #131a28;
// // //           --primary: #4D74FF;
// // //           --primary-hover: #6A8BFF;
// // //           --primary-bg: rgba(77,116,255,0.14);
// // //           --primary-bg-hover: rgba(77,116,255,0.22);
// // //           --primary-border: rgba(77,116,255,0.35);
// // //           --error: #f87171;
// // //           --error-bg: rgba(248,113,113,0.1);
// // //           --stats-bg: #131a28;
// // //           background: var(--bg);
// // //         }

// // //         /* ── Top bar ────────────────────────────────────────── */
// // //         .top-bar {
// // //           padding: 12px 16px;
// // //           background: var(--hdr-bg);
// // //           border-bottom: 1px solid var(--border);
// // //           display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
// // //         }
// // //         .tabs {
// // //           display: flex; gap: 4px; padding: 3px;
// // //           background: var(--surface);
// // //           border: 1px solid var(--border);
// // //           border-radius: 6px;
// // //         }
// // //         .tab {
// // //           padding: 6px 16px;
// // //           font-size: 12.5px; font-weight: 700;
// // //           color: var(--text-muted);
// // //           background: transparent; border: none; border-radius: 4px;
// // //           cursor: pointer; letter-spacing: 0.02em;
// // //         }
// // //         .tab.on {
// // //           background: var(--primary); color: #ffffff;
// // //           box-shadow: 0 1px 2px rgba(15,23,42,0.12);
// // //         }
// // //         .hint {
// // //           font-family: ui-monospace, Menlo, monospace;
// // //           font-size: 12px; color: var(--text-label);
// // //           font-weight: 600; letter-spacing: 0.02em;
// // //         }
// // //         .top-actions {
// // //           margin-left: auto;
// // //           display: flex; gap: 8px; align-items: center;
// // //         }
// // //         .seg-toggle {
// // //           display: flex; gap: 2px; padding: 2px;
// // //           background: var(--surface);
// // //           border: 1px solid var(--border-strong);
// // //           border-radius: 5px;
// // //         }
// // //         .seg-btn {
// // //           width: 26px; height: 26px;
// // //           display: flex; align-items: center; justify-content: center;
// // //           background: transparent; border: none; border-radius: 3px;
// // //           cursor: pointer; color: var(--text-muted);
// // //         }
// // //         .seg-btn.on { background: var(--primary); color: #ffffff; }
// // //         .btn-reset {
// // //           padding: 5px 12px;
// // //           font-size: 11.5px; font-weight: 700;
// // //           color: var(--text-muted);
// // //           background: var(--surface);
// // //           border: 1px solid var(--border-strong);
// // //           border-radius: 5px;
// // //           cursor: pointer;
// // //           letter-spacing: 0.06em; text-transform: uppercase;
// // //         }
// // //         .btn-reset:hover { color: var(--error); border-color: var(--error); }

// // //         /* ── Options row ────────────────────────────────────── */
// // //         .opts {
// // //           padding: 10px 16px;
// // //           background: var(--hdr-bg-subtle);
// // //           border-bottom: 1px solid var(--border-subtle);
// // //           border-left: 3px solid var(--primary);
// // //           display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
// // //         }
// // //         .opt {
// // //           display: flex; align-items: center; gap: 6px;
// // //           font-size: 12.5px; color: var(--text-label);
// // //           font-weight: 600; cursor: pointer; user-select: none;
// // //         }
// // //         .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
// // //         .opt-note { color: var(--text-subtle); font-size: 11px; font-weight: 400; margin-left: 4px; }
// // //         .opt-select { display: flex; align-items: center; gap: 8px; margin-left: auto; }
// // //         .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
// // //         .opt-select select {
// // //           padding: 4px 8px;
// // //           font-size: 12px; font-family: ui-monospace, Menlo, monospace;
// // //           background: var(--surface); color: var(--text);
// // //           border: 1px solid var(--border-strong); border-radius: 4px;
// // //           cursor: pointer;
// // //         }

// // //         /* ── Samples row ────────────────────────────────────── */
// // //         .samples {
// // //           padding: 10px 16px;
// // //           background: var(--surface);
// // //           border-bottom: 1px solid var(--border-subtle);
// // //           display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
// // //         }
// // //         .samples-lbl {
// // //           font-size: 11px; font-weight: 700;
// // //           color: var(--text-subtle);
// // //           letter-spacing: 0.08em; text-transform: uppercase;
// // //         }
// // //         .sample {
// // //           padding: 5px 12px;
// // //           font-size: 12px; font-weight: 500;
// // //           color: var(--primary);
// // //           background: var(--primary-bg);
// // //           border: 1px solid var(--primary-border); border-radius: 5px;
// // //           cursor: pointer;
// // //         }
// // //         .sample:hover { background: var(--primary-bg-hover); }

// // //         /* ── File drop ──────────────────────────────────────── */
// // //         .drop {
// // //           border: 2px dashed var(--border-strong);
// // //           background: var(--surface-alt);
// // //           margin: 12px 16px 0;
// // //           border-radius: 8px;
// // //           padding: 14px;
// // //           text-align: center;
// // //           color: var(--text-muted); font-size: 13px; font-weight: 500;
// // //           cursor: pointer;
// // //           transition: all 0.15s;
// // //         }
// // //         .drop:hover, .drop.dragover {
// // //           border-color: var(--primary);
// // //           background: var(--primary-bg);
// // //           color: var(--primary);
// // //         }

// // //         /* ── Body ───────────────────────────────────────────── */
// // //         .body {
// // //           display: grid;
// // //           flex: 1;
// // //           min-height: 0;
// // //           margin-top: 12px;
// // //           grid-template-columns: 1fr;
// // //         }
// // //         .body.with-exp {
// // //           grid-template-columns: minmax(0, 1fr) 300px;
// // //         }

// // //         .panes {
// // //           display: grid;
// // //           gap: 1px;
// // //           background: var(--border);
// // //           min-height: 340px;
// // //         }
// // //         .panes.horizontal { grid-template-columns: 1fr 1fr; }
// // //         .panes.vertical   { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

// // //         .pane {
// // //           background: var(--surface);
// // //           display: flex; flex-direction: column; min-height: 0;
// // //         }
// // //         .lbl {
// // //           font-size: 11.5px; font-weight: 800;
// // //           color: var(--text-label);
// // //           letter-spacing: 0.08em; text-transform: uppercase;
// // //           padding: 10px 16px 10px 13px;
// // //           border-bottom: 1px solid var(--border-subtle);
// // //           background: var(--hdr-bg-subtle);
// // //           border-left: 3px solid var(--primary);
// // //           display: flex; align-items: center; justify-content: space-between; gap: 8px;
// // //           min-height: 40px;
// // //         }
// // //         .lbl-actions { display: flex; gap: 6px; }
// // //         .btn-in-lbl {
// // //           padding: 3px 10px;
// // //           font-size: 10.5px; font-weight: 700;
// // //           background: var(--surface); color: var(--primary);
// // //           border: 1px solid var(--primary-border); border-radius: 4px;
// // //           letter-spacing: 0.06em; text-transform: uppercase;
// // //           cursor: pointer;
// // //         }
// // //         .btn-in-lbl:disabled { opacity: 0.4; cursor: not-allowed; }
// // //         .btn-in-lbl.muted { color: var(--text-muted); border-color: var(--border); }

// // //         textarea, .out {
// // //           flex: 1;
// // //           border: none; outline: none;
// // //           padding: 14px 16px;
// // //           font-family: ui-monospace, Menlo, monospace;
// // //           font-size: 13px; line-height: 1.6;
// // //           color: var(--text);
// // //           background: transparent;
// // //           resize: none;
// // //           white-space: pre-wrap;
// // //           word-break: break-all;
// // //           overflow-y: auto;
// // //           margin: 0;
// // //           min-height: 200px;
// // //         }
// // //         textarea::placeholder { color: var(--text-input-placeholder); }
// // //         .out.err { color: var(--error); background: var(--error-bg); }

// // //         /* ── Explanations box ───────────────────────────────── */
// // //         .exp {
// // //           border-left: 1px solid var(--border);
// // //           background: var(--surface-alt);
// // //           display: flex; flex-direction: column;
// // //         }
// // //         .exp-hdr {
// // //           font-size: 11.5px; font-weight: 800;
// // //           color: var(--text-label);
// // //           letter-spacing: 0.08em; text-transform: uppercase;
// // //           padding: 10px 16px 10px 13px;
// // //           border-bottom: 1px solid var(--border-subtle);
// // //           background: var(--hdr-bg-subtle);
// // //           border-left: 3px solid var(--primary);
// // //           min-height: 40px;
// // //           display: flex; align-items: center;
// // //         }
// // //         .exp-body {
// // //           padding: 16px;
// // //           font-size: 13px; line-height: 1.6;
// // //           color: var(--text-muted);
// // //           flex: 1;
// // //         }
// // //         .exp-body :global(p) { margin: 0 0 12px; }
// // //         .exp-body :global(p:last-child) { margin-bottom: 0; }
// // //         .exp-body :global(a) {
// // //           color: var(--primary); font-weight: 600;
// // //           text-decoration: none;
// // //           border-bottom: 1px solid var(--primary-border);
// // //         }
// // //         .exp-body :global(a:hover) { border-bottom-color: var(--primary); }
// // //         .exp-body :global(code) {
// // //           background: var(--surface-code);
// // //           padding: 1px 6px;
// // //           border-radius: 4px;
// // //           font-family: ui-monospace, Menlo, monospace;
// // //           font-size: 12px; color: var(--primary);
// // //           border: 1px solid var(--border);
// // //         }

// // //         /* ── Stats footer ───────────────────────────────────── */
// // //         .stats {
// // //           padding: 10px 16px;
// // //           background: var(--stats-bg);
// // //           border-top: 1px solid var(--border);
// // //           display: flex; gap: 24px;
// // //           font-family: ui-monospace, Menlo, monospace;
// // //           font-size: 11.5px; color: var(--text-muted);
// // //           flex-wrap: wrap;
// // //         }
// // //         .stats b { color: var(--primary); font-weight: 700; }

// // //         /* ── Tooltips ───────────────────────────────────────── */
// // //         :global([data-tt]) { position: relative; }
// // //         :global([data-tt]::after) {
// // //           content: attr(data-tt);
// // //           position: absolute;
// // //           top: calc(100% + 8px); left: 50%;
// // //           transform: translateX(-50%);
// // //           background: #0f172a; color: #ffffff;
// // //           padding: 5px 10px; border-radius: 5px;
// // //           font-size: 11px; font-weight: 500;
// // //           font-family: -apple-system, system-ui, sans-serif;
// // //           letter-spacing: 0.01em;
// // //           white-space: nowrap; z-index: 100;
// // //           pointer-events: none; opacity: 0;
// // //           transition: opacity 0.12s ease 0.35s;
// // //           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
// // //         }
// // //         :global([data-tt]::before) {
// // //           content: '';
// // //           position: absolute;
// // //           top: 100%; left: 50%;
// // //           transform: translateX(-50%);
// // //           border: 4px solid transparent;
// // //           border-bottom-color: #0f172a;
// // //           z-index: 100; pointer-events: none; opacity: 0;
// // //           transition: opacity 0.12s ease 0.35s;
// // //         }
// // //         :global([data-tt]:hover::after), :global([data-tt]:hover::before) { opacity: 1; }
// // //         :global([data-tt-pos="above"]::after) { top: auto; bottom: calc(100% + 8px); }
// // //         :global([data-tt-pos="above"]::before) {
// // //           top: auto; bottom: 100%;
// // //           border-bottom-color: transparent;
// // //           border-top-color: #0f172a;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }


// // // Base64Tool.jsx  ── v3
// // // ─────────────────────────────────────────────────────────────
// // // Change vs v2: tool-level theme toggle.
// // //
// // // The `theme` prop now seeds the initial theme; the tool owns
// // // its current theme via internal state. A sun / moon segmented
// // // toggle in the top-actions area lets the user switch at will.
// // // The prop is still respected as the starting value and re-syncs
// // // if the parent changes it (useEffect on theme).
// // //
// // // Trade-off: the tool's theme can now differ from the frame's
// // // theme around it, which will look mismatched. That's expected
// // // per the "try tool-level and see" direction.
// // // ─────────────────────────────────────────────────────────────

// // import { useState, useEffect, useRef } from 'react';

// // // ─── Helpers ────────────────────────────────────────────────

// // function textToBytes(str, cs) {
// //   if (cs === 'utf-8') return new TextEncoder().encode(str);
// //   if (cs === 'utf-16le' || cs === 'utf-16be') {
// //     const be = cs === 'utf-16be';
// //     const bytes = new Uint8Array(str.length * 2);
// //     for (let i = 0; i < str.length; i++) {
// //       const c = str.charCodeAt(i);
// //       bytes[i * 2]     = be ? (c >> 8) & 0xff : c & 0xff;
// //       bytes[i * 2 + 1] = be ? c & 0xff : (c >> 8) & 0xff;
// //     }
// //     return bytes;
// //   }
// //   if (cs === 'latin-1') {
// //     const bytes = new Uint8Array(str.length);
// //     for (let i = 0; i < str.length; i++) {
// //       const c = str.charCodeAt(i);
// //       if (c > 255) {
// //         throw new Error(
// //           'Character U+' + c.toString(16).padStart(4, '0') + ' cannot be represented in Latin-1.'
// //         );
// //       }
// //       bytes[i] = c;
// //     }
// //     return bytes;
// //   }
// //   throw new Error('Unknown encoding: ' + cs);
// // }

// // function bytesToText(bytes, cs) {
// //   const label = cs === 'latin-1' ? 'iso-8859-1' : cs;
// //   return new TextDecoder(label, { fatal: true }).decode(bytes);
// // }

// // function bytesToBase64(bytes, opts) {
// //   let bin = '';
// //   for (const b of bytes) bin += String.fromCharCode(b);
// //   let out = btoa(bin);
// //   if (opts.urlSafe)  out = out.replace(/\+/g, '-').replace(/\//g, '_');
// //   if (opts.stripPad) out = out.replace(/=+$/, '');
// //   if (opts.wrap)     out = out.match(/.{1,76}/g).join('\n');
// //   return out;
// // }

// // function base64ToBytes(s) {
// //   let c = s.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
// //   while (c.length % 4) c += '=';
// //   const bin = atob(c);
// //   const bytes = new Uint8Array(bin.length);
// //   for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
// //   return bytes;
// // }

// // // ─── Constants ──────────────────────────────────────────────

// // const DEFAULT_EXPLANATIONS = {
// //   encode: (
// //     <>
// //       <p><b>Encode</b> converts text into a Base64 string. Under the hood, the tool first turns your text into bytes using the selected text encoding (UTF-8 by default), then represents those bytes with 64 safe characters: <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, <code>/</code>.</p>
// //       <p>Common uses: embedding binary data in JSON, cookies, or email headers, and building data URIs.</p>
// //     </>
// //   ),
// //   decode: (
// //     <>
// //       <p><b>Decode</b> reverses the process: it converts a Base64 string back into raw bytes, then interprets those bytes as text using the selected encoding. Whitespace and padding (<code>=</code>) are handled automatically.</p>
// //       <p>If the input isn&apos;t valid Base64 or the resulting bytes aren&apos;t valid for the selected encoding, an error is shown.</p>
// //     </>
// //   ),
// // };

// // const SAMPLES = {
// //   hello:   { mode: 'encode', text: 'Hello, world!',                              tip: 'Simple ASCII text',                              label: 'Hello text' },
// //   unicode: { mode: 'encode', text: 'Café — 中文 — 🚀 emoji test',               tip: 'Text with emoji and international characters',   label: 'Unicode + emoji' },
// //   jwt:     { mode: 'decode', text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',       tip: 'URL-safe fragment from a JWT header',             label: 'JWT payload' },
// //   dataUri: { mode: 'decode', text: 'SGVsbG8sIHdvcmxkIQ==',                       tip: 'Base64 string ready to decode',                   label: 'Data URI' },
// // };

// // // ─── Component ──────────────────────────────────────────────

// // export default function Base64Tool({
// //   theme                 = 'light',
// //   showExplanations      = false,
// //   showOrientationToggle = true,
// //   initialOrientation    = 'horizontal',
// //   explanations          = null,
// // }) {
// //   const [currentTheme, setCurrentTheme] = useState(theme);
// //   const [mode,         setMode]         = useState('encode');
// //   const [input,        setInput]        = useState('');
// //   const [output,       setOutput]       = useState('');
// //   const [error,        setError]        = useState(null);
// //   const [inputSize,    setInputSize]    = useState(0);
// //   const [urlSafe,      setUrlSafe]      = useState(false);
// //   const [stripPad,     setStripPad]     = useState(false);
// //   const [wrap,         setWrap]         = useState(false);
// //   const [charset,      setCharset]      = useState('utf-8');
// //   const [orientation,  setOrientation]  = useState(initialOrientation);
// //   const [copied,       setCopied]       = useState(false);
// //   const [fileMode,     setFileMode]     = useState(false);
// //   const [dragOver,     setDragOver]     = useState(false);

// //   const fileInputRef = useRef(null);

// //   // Re-sync current theme if the parent's theme prop changes.
// //   useEffect(() => { setCurrentTheme(theme); }, [theme]);

// //   // Derive output whenever input or options change (unless in file mode).
// //   useEffect(() => {
// //     if (fileMode) return;
// //     if (!input) {
// //       setOutput('');
// //       setError(null);
// //       setInputSize(0);
// //       return;
// //     }
// //     try {
// //       if (mode === 'encode') {
// //         const bytes  = textToBytes(input, charset);
// //         const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
// //         setOutput(result);
// //         setInputSize(bytes.length);
// //         setError(null);
// //       } else {
// //         const bytes  = base64ToBytes(input);
// //         const result = bytesToText(bytes, charset);
// //         setOutput(result);
// //         setInputSize(input.replace(/\s/g, '').length);
// //         setError(null);
// //       }
// //     } catch (err) {
// //       setOutput('');
// //       setError((mode === 'encode' ? 'Failed to encode: ' : 'Failed to decode: ') + err.message);
// //       setInputSize(0);
// //     }
// //   }, [input, mode, charset, urlSafe, stripPad, wrap, fileMode]);

// //   // ── Handlers ──────────────────────────────────────────────

// //   const handleInputChange = (e) => {
// //     if (fileMode) setFileMode(false);
// //     setInput(e.target.value);
// //   };

// //   const handleSample = (key) => {
// //     const s = SAMPLES[key];
// //     setFileMode(false);
// //     setMode(s.mode);
// //     setInput(s.text);
// //   };

// //   const handleReset = () => {
// //     setMode('encode');
// //     setInput('');
// //     setOutput('');
// //     setError(null);
// //     setInputSize(0);
// //     setUrlSafe(false);
// //     setStripPad(false);
// //     setWrap(false);
// //     setCharset('utf-8');
// //     setFileMode(false);
// //   };

// //   const handleCopy = () => {
// //     if (!output || error) return;
// //     navigator.clipboard.writeText(output).then(() => {
// //       setCopied(true);
// //       setTimeout(() => setCopied(false), 1500);
// //     });
// //   };

// //   const handleDownload = () => {
// //     if (!output || error) return;
// //     const blob = new Blob([output], { type: 'text/plain' });
// //     const url  = URL.createObjectURL(blob);
// //     const a    = document.createElement('a');
// //     a.href     = url;
// //     a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   const handleFile = (file) => {
// //     setMode('encode');
// //     setFileMode(true);
// //     const reader = new FileReader();
// //     reader.onload = () => {
// //       const bytes  = new Uint8Array(reader.result);
// //       const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
// //       setInput(`[File: ${file.name}, ${file.size} bytes]`);
// //       setOutput(result);
// //       setInputSize(file.size);
// //       setError(null);
// //     };
// //     reader.readAsArrayBuffer(file);
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     setDragOver(false);
// //     const file = e.dataTransfer.files[0];
// //     if (file) handleFile(file);
// //   };

// //   // ── Derived ────────────────────────────────────────────────

// //   const hint    = mode === 'encode' ? 'Text \u2192 Base64' : 'Base64 \u2192 Text';
// //   const outLen  = output ? output.length : 0;
// //   const ratio   = inputSize ? (outLen / inputSize).toFixed(2) + 'x' : '\u2014';
// //   const inChars = input.length;

// //   const expContent = (() => {
// //     const override = explanations && explanations[mode];
// //     if (override) {
// //       if (typeof override === 'string') {
// //         return <div dangerouslySetInnerHTML={{ __html: override }} />;
// //       }
// //       return override;
// //     }
// //     return DEFAULT_EXPLANATIONS[mode];
// //   })();

// //   // ── Render ─────────────────────────────────────────────────

// //   return (
// //     <div className="tool" data-theme={currentTheme}>

// //       {/* Top bar */}
// //       <div className="top-bar">
// //         <div className="tabs">
// //           <button
// //             type="button"
// //             className={`tab ${mode === 'encode' ? 'on' : ''}`}
// //             onClick={() => setMode('encode')}
// //             data-tt="Convert text to Base64"
// //           >Encode</button>
// //           <button
// //             type="button"
// //             className={`tab ${mode === 'decode' ? 'on' : ''}`}
// //             onClick={() => setMode('decode')}
// //             data-tt="Convert Base64 to text"
// //           >Decode</button>
// //         </div>
// //         <div className="hint">{hint}</div>
// //         <div className="top-actions">
// //           {showOrientationToggle && (
// //             <div className="seg-toggle" role="group" aria-label="Layout orientation">
// //               <button
// //                 type="button"
// //                 className={`seg-btn ${orientation === 'horizontal' ? 'on' : ''}`}
// //                 onClick={() => setOrientation('horizontal')}
// //                 data-tt="Panes side by side"
// //                 aria-label="Side by side"
// //               >
// //                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
// //                   <rect x="1.5" y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
// //                   <rect x="9"   y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
// //                 </svg>
// //               </button>
// //               <button
// //                 type="button"
// //                 className={`seg-btn ${orientation === 'vertical' ? 'on' : ''}`}
// //                 onClick={() => setOrientation('vertical')}
// //                 data-tt="Panes stacked"
// //                 aria-label="Stacked"
// //               >
// //                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
// //                   <rect x="3" y="1.5" width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
// //                   <rect x="3" y="9"   width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
// //                 </svg>
// //               </button>
// //             </div>
// //           )}
// //           <div className="seg-toggle" role="group" aria-label="Theme">
// //             <button
// //               type="button"
// //               className={`seg-btn ${currentTheme === 'light' ? 'on' : ''}`}
// //               onClick={() => setCurrentTheme('light')}
// //               data-tt="Light theme"
// //               aria-label="Light theme"
// //             >
// //               <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
// //                 <circle cx="8" cy="8" r="3" />
// //                 <line x1="8" y1="1.5" x2="8" y2="3" />
// //                 <line x1="8" y1="13" x2="8" y2="14.5" />
// //                 <line x1="1.5" y1="8" x2="3" y2="8" />
// //                 <line x1="13" y1="8" x2="14.5" y2="8" />
// //                 <line x1="3.2" y1="3.2" x2="4.3" y2="4.3" />
// //                 <line x1="11.7" y1="11.7" x2="12.8" y2="12.8" />
// //                 <line x1="3.2" y1="12.8" x2="4.3" y2="11.7" />
// //                 <line x1="11.7" y1="4.3" x2="12.8" y2="3.2" />
// //               </svg>
// //             </button>
// //             <button
// //               type="button"
// //               className={`seg-btn ${currentTheme === 'terminal' ? 'on' : ''}`}
// //               onClick={() => setCurrentTheme('terminal')}
// //               data-tt="Terminal (dark) theme"
// //               aria-label="Terminal theme"
// //             >
// //               <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
// //                 <path d="M13.5 10.3C12.6 11 11.4 11.4 10.2 11.4C7.1 11.4 4.6 8.9 4.6 5.8C4.6 4.6 5 3.5 5.7 2.5C3.4 3.4 1.7 5.6 1.7 8.3C1.7 11.7 4.5 14.5 7.9 14.5C10.6 14.5 12.9 12.8 13.7 10.4C13.6 10.4 13.6 10.3 13.5 10.3Z" />
// //               </svg>
// //             </button>
// //           </div>
// //           <button
// //             type="button"
// //             className="btn-reset"
// //             onClick={handleReset}
// //             data-tt="Clear input, output, and reset all options"
// //           >Reset</button>
// //         </div>
// //       </div>

// //       {/* Options row */}
// //       <div className="opts">
// //         <label className="opt" data-tt="Use - and _ instead of + and /">
// //           <input type="checkbox" checked={urlSafe}  onChange={(e) => setUrlSafe(e.target.checked)}  />
// //           URL-safe <span className="opt-note">(- _ instead of + /)</span>
// //         </label>
// //         <label className="opt" data-tt="Remove trailing = characters">
// //           <input type="checkbox" checked={stripPad} onChange={(e) => setStripPad(e.target.checked)} />
// //           Strip padding <span className="opt-note">(no =)</span>
// //         </label>
// //         <label className="opt" data-tt="Wrap output at 76 characters per line (MIME format)">
// //           <input type="checkbox" checked={wrap}     onChange={(e) => setWrap(e.target.checked)}     />
// //           Line-wrap 76 <span className="opt-note">(MIME)</span>
// //         </label>
// //         <div className="opt-select" data-tt="How text is converted to bytes before encoding">
// //           <span className="opt-select-lbl">Text encoding:</span>
// //           <select value={charset} onChange={(e) => setCharset(e.target.value)}>
// //             <option value="utf-8">UTF-8</option>
// //             <option value="utf-16le">UTF-16 LE</option>
// //             <option value="utf-16be">UTF-16 BE</option>
// //             <option value="latin-1">Latin-1</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Samples row */}
// //       <div className="samples">
// //         <span className="samples-lbl">Samples:</span>
// //         {Object.entries(SAMPLES).map(([key, s]) => (
// //           <button
// //             key={key}
// //             type="button"
// //             className="sample"
// //             onClick={() => handleSample(key)}
// //             data-tt={s.tip}
// //           >{s.label}</button>
// //         ))}
// //       </div>

// //       {/* File drop */}
// //       <div
// //         className={`drop ${dragOver ? 'dragover' : ''}`}
// //         onClick={() => fileInputRef.current && fileInputRef.current.click()}
// //         onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
// //         onDragLeave={() => setDragOver(false)}
// //         onDrop={handleDrop}
// //         data-tt="Drop any file to encode it as Base64"
// //       >
// //         Drop a file here to encode as Base64, or click to browse
// //       </div>
// //       <input
// //         ref={fileInputRef}
// //         type="file"
// //         style={{ display: 'none' }}
// //         onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
// //       />

// //       {/* Body: panes + optional explanations */}
// //       <div className={`body ${showExplanations ? 'with-exp' : ''}`}>

// //         <div className={`panes ${orientation}`}>
// //           <div className="pane">
// //             <div className="lbl"><span>Input</span></div>
// //             <textarea
// //               value={input}
// //               onChange={handleInputChange}
// //               placeholder={mode === 'encode' ? 'Enter text...' : 'Paste Base64...'}
// //               spellCheck={false}
// //             />
// //           </div>
// //           <div className="pane">
// //             <div className="lbl">
// //               <span>Output</span>
// //               <div className="lbl-actions">
// //                 <button
// //                   type="button"
// //                   className="btn-in-lbl"
// //                   onClick={handleCopy}
// //                   disabled={!output || !!error}
// //                   data-tt="Copy output to clipboard"
// //                   data-tt-pos="above"
// //                 >{copied ? 'Copied' : 'Copy'}</button>
// //                 <button
// //                   type="button"
// //                   className="btn-in-lbl muted"
// //                   onClick={handleDownload}
// //                   disabled={!output || !!error}
// //                   data-tt="Save output as text file"
// //                   data-tt-pos="above"
// //                 >Download</button>
// //               </div>
// //             </div>
// //             <pre className={`out ${error ? 'err' : ''}`}>{error || output}</pre>
// //           </div>
// //         </div>

// //         {showExplanations && (
// //           <div className="exp">
// //             <div className="exp-hdr">{mode === 'encode' ? 'Encode' : 'Decode'}</div>
// //             <div className="exp-body">{expContent}</div>
// //           </div>
// //         )}

// //       </div>

// //       {/* Stats footer */}
// //       <div className="stats">
// //         <span>Input: <b>{inChars}</b> chars, <b>{inputSize}</b> bytes</span>
// //         <span>Output: <b>{outLen}</b> chars</span>
// //         <span>Ratio: <b>{ratio}</b></span>
// //       </div>

// //       <style jsx>{`
// //         .tool {
// //           --bg: #ffffff;
// //           --surface: #ffffff;
// //           --surface-alt: #f5f7fb;
// //           --surface-code: #eff2f8;
// //           --hdr-bg: #eef2f7;
// //           --hdr-bg-subtle: #f2f6fd;
// //           --text: #0f172a;
// //           --text-muted: #475569;
// //           --text-subtle: #64748b;
// //           --text-label: #334155;
// //           --text-input-placeholder: #94a3b8;
// //           --border: #cfd6e0;
// //           --border-strong: #a3b0c6;
// //           --border-subtle: #e4e4e7;
// //           --border-thin: #f1f5f9;
// //           --primary: #1B50EE;
// //           --primary-hover: #133EBF;
// //           --primary-bg: #E8EEFB;
// //           --primary-bg-hover: #d5e0f9;
// //           --primary-border: #C8D4F6;
// //           --error: #b91c1c;
// //           --error-bg: #fef2f2;
// //           --stats-bg: #eef2f7;

// //           background: var(--surface);
// //           color: var(--text);
// //           min-height: 550px;
// //           display: flex;
// //           flex-direction: column;
// //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
// //         }
// //         .tool[data-theme="terminal"] {
// //           --bg: #0A0D14;
// //           --surface: #101623;
// //           --surface-alt: #141b2b;
// //           --surface-code: #0a0e18;
// //           --hdr-bg: #182236;
// //           --hdr-bg-subtle: rgba(77,116,255,0.08);
// //           --text: #d4dae5;
// //           --text-muted: #97a3b8;
// //           --text-subtle: #6b7891;
// //           --text-label: #c1cad9;
// //           --text-input-placeholder: #4b5875;
// //           --border: #1e2637;
// //           --border-strong: #2d3a52;
// //           --border-subtle: #1e2637;
// //           --border-thin: #131a28;
// //           --primary: #4D74FF;
// //           --primary-hover: #6A8BFF;
// //           --primary-bg: rgba(77,116,255,0.14);
// //           --primary-bg-hover: rgba(77,116,255,0.22);
// //           --primary-border: rgba(77,116,255,0.35);
// //           --error: #f87171;
// //           --error-bg: rgba(248,113,113,0.1);
// //           --stats-bg: #131a28;
// //           background: var(--bg);
// //         }

// //         /* ── Top bar ────────────────────────────────────────── */
// //         .top-bar {
// //           padding: 12px 16px;
// //           background: var(--hdr-bg);
// //           border-bottom: 1px solid var(--border);
// //           display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
// //         }
// //         .tabs {
// //           display: flex; gap: 4px; padding: 3px;
// //           background: var(--surface);
// //           border: 1px solid var(--border);
// //           border-radius: 6px;
// //         }
// //         .tab {
// //           padding: 6px 16px;
// //           font-size: 12.5px; font-weight: 700;
// //           color: var(--text-muted);
// //           background: transparent; border: none; border-radius: 4px;
// //           cursor: pointer; letter-spacing: 0.02em;
// //         }
// //         .tab.on {
// //           background: var(--primary); color: #ffffff;
// //           box-shadow: 0 1px 2px rgba(15,23,42,0.12);
// //         }
// //         .hint {
// //           font-family: ui-monospace, Menlo, monospace;
// //           font-size: 12px; color: var(--text-label);
// //           font-weight: 600; letter-spacing: 0.02em;
// //         }
// //         .top-actions {
// //           margin-left: auto;
// //           display: flex; gap: 8px; align-items: center;
// //         }
// //         .seg-toggle {
// //           display: flex; gap: 2px; padding: 2px;
// //           background: var(--surface);
// //           border: 1px solid var(--border-strong);
// //           border-radius: 5px;
// //         }
// //         .seg-btn {
// //           width: 26px; height: 26px;
// //           display: flex; align-items: center; justify-content: center;
// //           background: transparent; border: none; border-radius: 3px;
// //           cursor: pointer; color: var(--text-muted);
// //         }
// //         .seg-btn.on { background: var(--primary); color: #ffffff; }
// //         .btn-reset {
// //           padding: 5px 12px;
// //           font-size: 11.5px; font-weight: 700;
// //           color: var(--text-muted);
// //           background: var(--surface);
// //           border: 1px solid var(--border-strong);
// //           border-radius: 5px;
// //           cursor: pointer;
// //           letter-spacing: 0.06em; text-transform: uppercase;
// //         }
// //         .btn-reset:hover { color: var(--error); border-color: var(--error); }

// //         /* ── Options row ────────────────────────────────────── */
// //         .opts {
// //           padding: 10px 16px;
// //           background: var(--hdr-bg-subtle);
// //           border-bottom: 1px solid var(--border-subtle);
// //           border-left: 3px solid var(--primary);
// //           display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
// //         }
// //         .opt {
// //           display: flex; align-items: center; gap: 6px;
// //           font-size: 12.5px; color: var(--text-label);
// //           font-weight: 600; cursor: pointer; user-select: none;
// //         }
// //         .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
// //         .opt-note { color: var(--text-subtle); font-size: 11px; font-weight: 400; margin-left: 4px; }
// //         .opt-select { display: flex; align-items: center; gap: 8px; margin-left: auto; }
// //         .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
// //         .opt-select select {
// //           padding: 4px 8px;
// //           font-size: 12px; font-family: ui-monospace, Menlo, monospace;
// //           background: var(--surface); color: var(--text);
// //           border: 1px solid var(--border-strong); border-radius: 4px;
// //           cursor: pointer;
// //         }

// //         /* ── Samples row ────────────────────────────────────── */
// //         .samples {
// //           padding: 10px 16px;
// //           background: var(--surface);
// //           border-bottom: 1px solid var(--border-subtle);
// //           display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
// //         }
// //         .samples-lbl {
// //           font-size: 11px; font-weight: 700;
// //           color: var(--text-subtle);
// //           letter-spacing: 0.08em; text-transform: uppercase;
// //         }
// //         .sample {
// //           padding: 5px 12px;
// //           font-size: 12px; font-weight: 500;
// //           color: var(--primary);
// //           background: var(--primary-bg);
// //           border: 1px solid var(--primary-border); border-radius: 5px;
// //           cursor: pointer;
// //         }
// //         .sample:hover { background: var(--primary-bg-hover); }

// //         /* ── File drop ──────────────────────────────────────── */
// //         .drop {
// //           border: 2px dashed var(--border-strong);
// //           background: var(--surface-alt);
// //           margin: 12px 16px 0;
// //           border-radius: 8px;
// //           padding: 14px;
// //           text-align: center;
// //           color: var(--text-muted); font-size: 13px; font-weight: 500;
// //           cursor: pointer;
// //           transition: all 0.15s;
// //         }
// //         .drop:hover, .drop.dragover {
// //           border-color: var(--primary);
// //           background: var(--primary-bg);
// //           color: var(--primary);
// //         }

// //         /* ── Body ───────────────────────────────────────────── */
// //         .body {
// //           display: grid;
// //           flex: 1;
// //           min-height: 0;
// //           margin-top: 12px;
// //           grid-template-columns: 1fr;
// //         }
// //         .body.with-exp {
// //           grid-template-columns: minmax(0, 1fr) 300px;
// //         }

// //         .panes {
// //           display: grid;
// //           gap: 1px;
// //           background: var(--border);
// //           min-height: 340px;
// //         }
// //         .panes.horizontal { grid-template-columns: 1fr 1fr; }
// //         .panes.vertical   { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

// //         .pane {
// //           background: var(--surface);
// //           display: flex; flex-direction: column; min-height: 0;
// //         }
// //         .lbl {
// //           font-size: 11.5px; font-weight: 800;
// //           color: var(--text-label);
// //           letter-spacing: 0.08em; text-transform: uppercase;
// //           padding: 10px 16px 10px 13px;
// //           border-bottom: 1px solid var(--border-subtle);
// //           background: var(--hdr-bg-subtle);
// //           border-left: 3px solid var(--primary);
// //           display: flex; align-items: center; justify-content: space-between; gap: 8px;
// //           min-height: 40px;
// //         }
// //         .lbl-actions { display: flex; gap: 6px; }
// //         .btn-in-lbl {
// //           padding: 3px 10px;
// //           font-size: 10.5px; font-weight: 700;
// //           background: var(--surface); color: var(--primary);
// //           border: 1px solid var(--primary-border); border-radius: 4px;
// //           letter-spacing: 0.06em; text-transform: uppercase;
// //           cursor: pointer;
// //         }
// //         .btn-in-lbl:disabled { opacity: 0.4; cursor: not-allowed; }
// //         .btn-in-lbl.muted { color: var(--text-muted); border-color: var(--border); }

// //         textarea, .out {
// //           flex: 1;
// //           border: none; outline: none;
// //           padding: 14px 16px;
// //           font-family: ui-monospace, Menlo, monospace;
// //           font-size: 13px; line-height: 1.6;
// //           color: var(--text);
// //           background: transparent;
// //           resize: none;
// //           white-space: pre-wrap;
// //           word-break: break-all;
// //           overflow-y: auto;
// //           margin: 0;
// //           min-height: 200px;
// //         }
// //         textarea::placeholder { color: var(--text-input-placeholder); }
// //         .out.err { color: var(--error); background: var(--error-bg); }

// //         /* ── Explanations box ───────────────────────────────── */
// //         .exp {
// //           border-left: 1px solid var(--border);
// //           background: var(--surface-alt);
// //           display: flex; flex-direction: column;
// //         }
// //         .exp-hdr {
// //           font-size: 11.5px; font-weight: 800;
// //           color: var(--text-label);
// //           letter-spacing: 0.08em; text-transform: uppercase;
// //           padding: 10px 16px 10px 13px;
// //           border-bottom: 1px solid var(--border-subtle);
// //           background: var(--hdr-bg-subtle);
// //           border-left: 3px solid var(--primary);
// //           min-height: 40px;
// //           display: flex; align-items: center;
// //         }
// //         .exp-body {
// //           padding: 16px;
// //           font-size: 13px; line-height: 1.6;
// //           color: var(--text-muted);
// //           flex: 1;
// //         }
// //         .exp-body :global(p) { margin: 0 0 12px; }
// //         .exp-body :global(p:last-child) { margin-bottom: 0; }
// //         .exp-body :global(a) {
// //           color: var(--primary); font-weight: 600;
// //           text-decoration: none;
// //           border-bottom: 1px solid var(--primary-border);
// //         }
// //         .exp-body :global(a:hover) { border-bottom-color: var(--primary); }
// //         .exp-body :global(code) {
// //           background: var(--surface-code);
// //           padding: 1px 6px;
// //           border-radius: 4px;
// //           font-family: ui-monospace, Menlo, monospace;
// //           font-size: 12px; color: var(--primary);
// //           border: 1px solid var(--border);
// //         }

// //         /* ── Stats footer ───────────────────────────────────── */
// //         .stats {
// //           padding: 10px 16px;
// //           background: var(--stats-bg);
// //           border-top: 1px solid var(--border);
// //           display: flex; gap: 24px;
// //           font-family: ui-monospace, Menlo, monospace;
// //           font-size: 11.5px; color: var(--text-muted);
// //           flex-wrap: wrap;
// //         }
// //         .stats b { color: var(--primary); font-weight: 700; }

// //         /* ── Tooltips ───────────────────────────────────────── */
// //         :global([data-tt]) { position: relative; }
// //         :global([data-tt]::after) {
// //           content: attr(data-tt);
// //           position: absolute;
// //           top: calc(100% + 8px); left: 50%;
// //           transform: translateX(-50%);
// //           background: #0f172a; color: #ffffff;
// //           padding: 5px 10px; border-radius: 5px;
// //           font-size: 11px; font-weight: 500;
// //           font-family: -apple-system, system-ui, sans-serif;
// //           letter-spacing: 0.01em;
// //           white-space: nowrap; z-index: 100;
// //           pointer-events: none; opacity: 0;
// //           transition: opacity 0.12s ease 0.35s;
// //           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
// //         }
// //         :global([data-tt]::before) {
// //           content: '';
// //           position: absolute;
// //           top: 100%; left: 50%;
// //           transform: translateX(-50%);
// //           border: 4px solid transparent;
// //           border-bottom-color: #0f172a;
// //           z-index: 100; pointer-events: none; opacity: 0;
// //           transition: opacity 0.12s ease 0.35s;
// //         }
// //         :global([data-tt]:hover::after), :global([data-tt]:hover::before) { opacity: 1; }
// //         :global([data-tt-pos="above"]::after) { top: auto; bottom: calc(100% + 8px); }
// //         :global([data-tt-pos="above"]::before) {
// //           top: auto; bottom: 100%;
// //           border-bottom-color: transparent;
// //           border-top-color: #0f172a;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }


// // Base64Tool.jsx  ── v4
// // ─────────────────────────────────────────────────────────────
// // Change vs v3: theme toggle is now opt-in via a prop.
// //
// // New prop:
// //   showThemeToggle   boolean   default false
// //
// // When false (default), the tool renders no theme toggle. The
// // theme comes entirely from the `theme` prop and can only be
// // changed by re-rendering with a new prop value.
// //
// // When true, the sun / moon segmented toggle appears in the
// // top-actions area and the user can switch between light and
// // terminal at runtime.
// //
// // This feature is asleep for now. When site-level theme is
// // wired (probably via _app.jsx + localStorage + prop drilling
// // or context), the toggle stays available for edge cases where
// // per-tool override is desired.
// // ─────────────────────────────────────────────────────────────

// import { useState, useEffect, useRef } from 'react';

// // ─── Helpers ────────────────────────────────────────────────

// function textToBytes(str, cs) {
//   if (cs === 'utf-8') return new TextEncoder().encode(str);
//   if (cs === 'utf-16le' || cs === 'utf-16be') {
//     const be = cs === 'utf-16be';
//     const bytes = new Uint8Array(str.length * 2);
//     for (let i = 0; i < str.length; i++) {
//       const c = str.charCodeAt(i);
//       bytes[i * 2]     = be ? (c >> 8) & 0xff : c & 0xff;
//       bytes[i * 2 + 1] = be ? c & 0xff : (c >> 8) & 0xff;
//     }
//     return bytes;
//   }
//   if (cs === 'latin-1') {
//     const bytes = new Uint8Array(str.length);
//     for (let i = 0; i < str.length; i++) {
//       const c = str.charCodeAt(i);
//       if (c > 255) {
//         throw new Error(
//           'Character U+' + c.toString(16).padStart(4, '0') + ' cannot be represented in Latin-1.'
//         );
//       }
//       bytes[i] = c;
//     }
//     return bytes;
//   }
//   throw new Error('Unknown encoding: ' + cs);
// }

// function bytesToText(bytes, cs) {
//   const label = cs === 'latin-1' ? 'iso-8859-1' : cs;
//   return new TextDecoder(label, { fatal: true }).decode(bytes);
// }

// function bytesToBase64(bytes, opts) {
//   let bin = '';
//   for (const b of bytes) bin += String.fromCharCode(b);
//   let out = btoa(bin);
//   if (opts.urlSafe)  out = out.replace(/\+/g, '-').replace(/\//g, '_');
//   if (opts.stripPad) out = out.replace(/=+$/, '');
//   if (opts.wrap)     out = out.match(/.{1,76}/g).join('\n');
//   return out;
// }

// function base64ToBytes(s) {
//   let c = s.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
//   while (c.length % 4) c += '=';
//   const bin = atob(c);
//   const bytes = new Uint8Array(bin.length);
//   for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
//   return bytes;
// }

// // ─── Constants ──────────────────────────────────────────────

// const DEFAULT_EXPLANATIONS = {
//   encode: (
//     <>
//       <p><b>Encode</b> converts text into a Base64 string. Under the hood, the tool first turns your text into bytes using the selected text encoding (UTF-8 by default), then represents those bytes with 64 safe characters: <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, <code>/</code>.</p>
//       <p>Common uses: embedding binary data in JSON, cookies, or email headers, and building data URIs.</p>
//     </>
//   ),
//   decode: (
//     <>
//       <p><b>Decode</b> reverses the process: it converts a Base64 string back into raw bytes, then interprets those bytes as text using the selected encoding. Whitespace and padding (<code>=</code>) are handled automatically.</p>
//       <p>If the input isn&apos;t valid Base64 or the resulting bytes aren&apos;t valid for the selected encoding, an error is shown.</p>
//     </>
//   ),
// };

// const SAMPLES = {
//   hello:   { mode: 'encode', text: 'Hello, world!',                              tip: 'Simple ASCII text',                              label: 'Hello text' },
//   unicode: { mode: 'encode', text: 'Café — 中文 — 🚀 emoji test',               tip: 'Text with emoji and international characters',   label: 'Unicode + emoji' },
//   jwt:     { mode: 'decode', text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',       tip: 'URL-safe fragment from a JWT header',             label: 'JWT payload' },
//   dataUri: { mode: 'decode', text: 'SGVsbG8sIHdvcmxkIQ==',                       tip: 'Base64 string ready to decode',                   label: 'Data URI' },
// };

// // ─── Component ──────────────────────────────────────────────

// export default function Base64Tool({
//   theme                 = 'light',
//   showThemeToggle       = false,
//   showExplanations      = false,
//   showOrientationToggle = true,
//   initialOrientation    = 'horizontal',
//   explanations          = null,
// }) {
//   const [currentTheme, setCurrentTheme] = useState(theme);
//   const [mode,         setMode]         = useState('encode');
//   const [input,        setInput]        = useState('');
//   const [output,       setOutput]       = useState('');
//   const [error,        setError]        = useState(null);
//   const [inputSize,    setInputSize]    = useState(0);
//   const [urlSafe,      setUrlSafe]      = useState(false);
//   const [stripPad,     setStripPad]     = useState(false);
//   const [wrap,         setWrap]         = useState(false);
//   const [charset,      setCharset]      = useState('utf-8');
//   const [orientation,  setOrientation]  = useState(initialOrientation);
//   const [copied,       setCopied]       = useState(false);
//   const [fileMode,     setFileMode]     = useState(false);
//   const [dragOver,     setDragOver]     = useState(false);

//   const fileInputRef = useRef(null);

//   // Re-sync current theme if the parent's theme prop changes.
//   useEffect(() => { setCurrentTheme(theme); }, [theme]);

//   // Derive output whenever input or options change (unless in file mode).
//   useEffect(() => {
//     if (fileMode) return;
//     if (!input) {
//       setOutput('');
//       setError(null);
//       setInputSize(0);
//       return;
//     }
//     try {
//       if (mode === 'encode') {
//         const bytes  = textToBytes(input, charset);
//         const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
//         setOutput(result);
//         setInputSize(bytes.length);
//         setError(null);
//       } else {
//         const bytes  = base64ToBytes(input);
//         const result = bytesToText(bytes, charset);
//         setOutput(result);
//         setInputSize(input.replace(/\s/g, '').length);
//         setError(null);
//       }
//     } catch (err) {
//       setOutput('');
//       setError((mode === 'encode' ? 'Failed to encode: ' : 'Failed to decode: ') + err.message);
//       setInputSize(0);
//     }
//   }, [input, mode, charset, urlSafe, stripPad, wrap, fileMode]);

//   // ── Handlers ──────────────────────────────────────────────

//   const handleInputChange = (e) => {
//     if (fileMode) setFileMode(false);
//     setInput(e.target.value);
//   };

//   const handleSample = (key) => {
//     const s = SAMPLES[key];
//     setFileMode(false);
//     setMode(s.mode);
//     setInput(s.text);
//   };

//   const handleReset = () => {
//     setMode('encode');
//     setInput('');
//     setOutput('');
//     setError(null);
//     setInputSize(0);
//     setUrlSafe(false);
//     setStripPad(false);
//     setWrap(false);
//     setCharset('utf-8');
//     setFileMode(false);
//   };

//   const handleCopy = () => {
//     if (!output || error) return;
//     navigator.clipboard.writeText(output).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     });
//   };

//   const handleDownload = () => {
//     if (!output || error) return;
//     const blob = new Blob([output], { type: 'text/plain' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href     = url;
//     a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleFile = (file) => {
//     setMode('encode');
//     setFileMode(true);
//     const reader = new FileReader();
//     reader.onload = () => {
//       const bytes  = new Uint8Array(reader.result);
//       const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
//       setInput(`[File: ${file.name}, ${file.size} bytes]`);
//       setOutput(result);
//       setInputSize(file.size);
//       setError(null);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files[0];
//     if (file) handleFile(file);
//   };

//   // ── Derived ────────────────────────────────────────────────

//   const hint    = mode === 'encode' ? 'Text \u2192 Base64' : 'Base64 \u2192 Text';
//   const outLen  = output ? output.length : 0;
//   const ratio   = inputSize ? (outLen / inputSize).toFixed(2) + 'x' : '\u2014';
//   const inChars = input.length;

//   const expContent = (() => {
//     const override = explanations && explanations[mode];
//     if (override) {
//       if (typeof override === 'string') {
//         return <div dangerouslySetInnerHTML={{ __html: override }} />;
//       }
//       return override;
//     }
//     return DEFAULT_EXPLANATIONS[mode];
//   })();

//   // ── Render ─────────────────────────────────────────────────

//   return (
//     <div className="tool" data-theme={currentTheme}>

//       {/* Top bar */}
//       <div className="top-bar">
//         <div className="tabs">
//           <button
//             type="button"
//             className={`tab ${mode === 'encode' ? 'on' : ''}`}
//             onClick={() => setMode('encode')}
//             data-tt="Convert text to Base64"
//           >Encode</button>
//           <button
//             type="button"
//             className={`tab ${mode === 'decode' ? 'on' : ''}`}
//             onClick={() => setMode('decode')}
//             data-tt="Convert Base64 to text"
//           >Decode</button>
//         </div>
//         <div className="hint">{hint}</div>
//         <div className="top-actions">
//           {showOrientationToggle && (
//             <div className="seg-toggle" role="group" aria-label="Layout orientation">
//               <button
//                 type="button"
//                 className={`seg-btn ${orientation === 'horizontal' ? 'on' : ''}`}
//                 onClick={() => setOrientation('horizontal')}
//                 data-tt="Panes side by side"
//                 aria-label="Side by side"
//               >
//                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//                   <rect x="1.5" y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
//                   <rect x="9"   y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
//                 </svg>
//               </button>
//               <button
//                 type="button"
//                 className={`seg-btn ${orientation === 'vertical' ? 'on' : ''}`}
//                 onClick={() => setOrientation('vertical')}
//                 data-tt="Panes stacked"
//                 aria-label="Stacked"
//               >
//                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//                   <rect x="3" y="1.5" width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
//                   <rect x="3" y="9"   width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
//                 </svg>
//               </button>
//             </div>
//           )}
//           {showThemeToggle && (
//             <div className="seg-toggle" role="group" aria-label="Theme">
//               <button
//                 type="button"
//                 className={`seg-btn ${currentTheme === 'light' ? 'on' : ''}`}
//                 onClick={() => setCurrentTheme('light')}
//                 data-tt="Light theme"
//                 aria-label="Light theme"
//               >
//                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
//                   <circle cx="8" cy="8" r="3" />
//                   <line x1="8" y1="1.5" x2="8" y2="3" />
//                   <line x1="8" y1="13" x2="8" y2="14.5" />
//                   <line x1="1.5" y1="8" x2="3" y2="8" />
//                   <line x1="13" y1="8" x2="14.5" y2="8" />
//                   <line x1="3.2" y1="3.2" x2="4.3" y2="4.3" />
//                   <line x1="11.7" y1="11.7" x2="12.8" y2="12.8" />
//                   <line x1="3.2" y1="12.8" x2="4.3" y2="11.7" />
//                   <line x1="11.7" y1="4.3" x2="12.8" y2="3.2" />
//                 </svg>
//               </button>
//               <button
//                 type="button"
//                 className={`seg-btn ${currentTheme === 'terminal' ? 'on' : ''}`}
//                 onClick={() => setCurrentTheme('terminal')}
//                 data-tt="Terminal (dark) theme"
//                 aria-label="Terminal theme"
//               >
//                 <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
//                   <path d="M13.5 10.3C12.6 11 11.4 11.4 10.2 11.4C7.1 11.4 4.6 8.9 4.6 5.8C4.6 4.6 5 3.5 5.7 2.5C3.4 3.4 1.7 5.6 1.7 8.3C1.7 11.7 4.5 14.5 7.9 14.5C10.6 14.5 12.9 12.8 13.7 10.4C13.6 10.4 13.6 10.3 13.5 10.3Z" />
//                 </svg>
//               </button>
//             </div>
//           )}
//           <button
//             type="button"
//             className="btn-reset"
//             onClick={handleReset}
//             data-tt="Clear input, output, and reset all options"
//           >Reset</button>
//         </div>
//       </div>

//       {/* Options row */}
//       <div className="opts">
//         <label className="opt" data-tt="Use - and _ instead of + and /">
//           <input type="checkbox" checked={urlSafe}  onChange={(e) => setUrlSafe(e.target.checked)}  />
//           URL-safe <span className="opt-note">(- _ instead of + /)</span>
//         </label>
//         <label className="opt" data-tt="Remove trailing = characters">
//           <input type="checkbox" checked={stripPad} onChange={(e) => setStripPad(e.target.checked)} />
//           Strip padding <span className="opt-note">(no =)</span>
//         </label>
//         <label className="opt" data-tt="Wrap output at 76 characters per line (MIME format)">
//           <input type="checkbox" checked={wrap}     onChange={(e) => setWrap(e.target.checked)}     />
//           Line-wrap 76 <span className="opt-note">(MIME)</span>
//         </label>
//         <div className="opt-select" data-tt="How text is converted to bytes before encoding">
//           <span className="opt-select-lbl">Text encoding:</span>
//           <select value={charset} onChange={(e) => setCharset(e.target.value)}>
//             <option value="utf-8">UTF-8</option>
//             <option value="utf-16le">UTF-16 LE</option>
//             <option value="utf-16be">UTF-16 BE</option>
//             <option value="latin-1">Latin-1</option>
//           </select>
//         </div>
//       </div>

//       {/* Samples row */}
//       <div className="samples">
//         <span className="samples-lbl">Samples:</span>
//         {Object.entries(SAMPLES).map(([key, s]) => (
//           <button
//             key={key}
//             type="button"
//             className="sample"
//             onClick={() => handleSample(key)}
//             data-tt={s.tip}
//           >{s.label}</button>
//         ))}
//       </div>

//       {/* File drop */}
//       <div
//         className={`drop ${dragOver ? 'dragover' : ''}`}
//         onClick={() => fileInputRef.current && fileInputRef.current.click()}
//         onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={handleDrop}
//         data-tt="Drop any file to encode it as Base64"
//       >
//         Drop a file here to encode as Base64, or click to browse
//       </div>
//       <input
//         ref={fileInputRef}
//         type="file"
//         style={{ display: 'none' }}
//         onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
//       />

//       {/* Body: panes + optional explanations */}
//       <div className={`body ${showExplanations ? 'with-exp' : ''}`}>

//         <div className={`panes ${orientation}`}>
//           <div className="pane">
//             <div className="lbl"><span>Input</span></div>
//             <textarea
//               value={input}
//               onChange={handleInputChange}
//               placeholder={mode === 'encode' ? 'Enter text...' : 'Paste Base64...'}
//               spellCheck={false}
//             />
//           </div>
//           <div className="pane">
//             <div className="lbl">
//               <span>Output</span>
//               <div className="lbl-actions">
//                 <button
//                   type="button"
//                   className="btn-in-lbl"
//                   onClick={handleCopy}
//                   disabled={!output || !!error}
//                   data-tt="Copy output to clipboard"
//                   data-tt-pos="above"
//                 >{copied ? 'Copied' : 'Copy'}</button>
//                 <button
//                   type="button"
//                   className="btn-in-lbl muted"
//                   onClick={handleDownload}
//                   disabled={!output || !!error}
//                   data-tt="Save output as text file"
//                   data-tt-pos="above"
//                 >Download</button>
//               </div>
//             </div>
//             <pre className={`out ${error ? 'err' : ''}`}>{error || output}</pre>
//           </div>
//         </div>

//         {showExplanations && (
//           <div className="exp">
//             <div className="exp-hdr">{mode === 'encode' ? 'Encode' : 'Decode'}</div>
//             <div className="exp-body">{expContent}</div>
//           </div>
//         )}

//       </div>

//       {/* Stats footer */}
//       <div className="stats">
//         <span>Input: <b>{inChars}</b> chars, <b>{inputSize}</b> bytes</span>
//         <span>Output: <b>{outLen}</b> chars</span>
//         <span>Ratio: <b>{ratio}</b></span>
//       </div>

//       <style jsx>{`
//         .tool {
//           --bg: #ffffff;
//           --surface: #ffffff;
//           --surface-alt: #f5f7fb;
//           --surface-code: #eff2f8;
//           --hdr-bg: #eef2f7;
//           --hdr-bg-subtle: #f2f6fd;
//           --text: #0f172a;
//           --text-muted: #475569;
//           --text-subtle: #64748b;
//           --text-label: #334155;
//           --text-input-placeholder: #94a3b8;
//           --border: #cfd6e0;
//           --border-strong: #a3b0c6;
//           --border-subtle: #e4e4e7;
//           --border-thin: #f1f5f9;
//           --primary: #1B50EE;
//           --primary-hover: #133EBF;
//           --primary-bg: #E8EEFB;
//           --primary-bg-hover: #d5e0f9;
//           --primary-border: #C8D4F6;
//           --error: #b91c1c;
//           --error-bg: #fef2f2;
//           --stats-bg: #eef2f7;

//           background: var(--surface);
//           color: var(--text);
//           min-height: 550px;
//           display: flex;
//           flex-direction: column;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
//         }
//         .tool[data-theme="terminal"] {
//           --bg: #0A0D14;
//           --surface: #101623;
//           --surface-alt: #141b2b;
//           --surface-code: #0a0e18;
//           --hdr-bg: #182236;
//           --hdr-bg-subtle: rgba(77,116,255,0.08);
//           --text: #d4dae5;
//           --text-muted: #97a3b8;
//           --text-subtle: #6b7891;
//           --text-label: #c1cad9;
//           --text-input-placeholder: #4b5875;
//           --border: #1e2637;
//           --border-strong: #2d3a52;
//           --border-subtle: #1e2637;
//           --border-thin: #131a28;
//           --primary: #4D74FF;
//           --primary-hover: #6A8BFF;
//           --primary-bg: rgba(77,116,255,0.14);
//           --primary-bg-hover: rgba(77,116,255,0.22);
//           --primary-border: rgba(77,116,255,0.35);
//           --error: #f87171;
//           --error-bg: rgba(248,113,113,0.1);
//           --stats-bg: #131a28;
//           background: var(--bg);
//         }

//         /* ── Top bar ────────────────────────────────────────── */
//         .top-bar {
//           padding: 12px 16px;
//           background: var(--hdr-bg);
//           border-bottom: 1px solid var(--border);
//           display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
//         }
//         .tabs {
//           display: flex; gap: 4px; padding: 3px;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: 6px;
//         }
//         .tab {
//           padding: 6px 16px;
//           font-size: 12.5px; font-weight: 700;
//           color: var(--text-muted);
//           background: transparent; border: none; border-radius: 4px;
//           cursor: pointer; letter-spacing: 0.02em;
//         }
//         .tab.on {
//           background: var(--primary); color: #ffffff;
//           box-shadow: 0 1px 2px rgba(15,23,42,0.12);
//         }
//         .hint {
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 12px; color: var(--text-label);
//           font-weight: 600; letter-spacing: 0.02em;
//         }
//         .top-actions {
//           margin-left: auto;
//           display: flex; gap: 8px; align-items: center;
//         }
//         .seg-toggle {
//           display: flex; gap: 2px; padding: 2px;
//           background: var(--surface);
//           border: 1px solid var(--border-strong);
//           border-radius: 5px;
//         }
//         .seg-btn {
//           width: 26px; height: 26px;
//           display: flex; align-items: center; justify-content: center;
//           background: transparent; border: none; border-radius: 3px;
//           cursor: pointer; color: var(--text-muted);
//         }
//         .seg-btn.on { background: var(--primary); color: #ffffff; }
//         .btn-reset {
//           padding: 5px 12px;
//           font-size: 11.5px; font-weight: 700;
//           color: var(--text-muted);
//           background: var(--surface);
//           border: 1px solid var(--border-strong);
//           border-radius: 5px;
//           cursor: pointer;
//           letter-spacing: 0.06em; text-transform: uppercase;
//         }
//         .btn-reset:hover { color: var(--error); border-color: var(--error); }

//         /* ── Options row ────────────────────────────────────── */
//         .opts {
//           padding: 10px 16px;
//           background: var(--hdr-bg-subtle);
//           border-bottom: 1px solid var(--border-subtle);
//           border-left: 3px solid var(--primary);
//           display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
//         }
//         .opt {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 12.5px; color: var(--text-label);
//           font-weight: 600; cursor: pointer; user-select: none;
//         }
//         .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
//         .opt-note { color: var(--text-subtle); font-size: 11px; font-weight: 400; margin-left: 4px; }
//         .opt-select { display: flex; align-items: center; gap: 8px; margin-left: auto; }
//         .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
//         .opt-select select {
//           padding: 4px 8px;
//           font-size: 12px; font-family: ui-monospace, Menlo, monospace;
//           background: var(--surface); color: var(--text);
//           border: 1px solid var(--border-strong); border-radius: 4px;
//           cursor: pointer;
//         }

//         /* ── Samples row ────────────────────────────────────── */
//         .samples {
//           padding: 10px 16px;
//           background: var(--surface);
//           border-bottom: 1px solid var(--border-subtle);
//           display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
//         }
//         .samples-lbl {
//           font-size: 11px; font-weight: 700;
//           color: var(--text-subtle);
//           letter-spacing: 0.08em; text-transform: uppercase;
//         }
//         .sample {
//           padding: 5px 12px;
//           font-size: 12px; font-weight: 500;
//           color: var(--primary);
//           background: var(--primary-bg);
//           border: 1px solid var(--primary-border); border-radius: 5px;
//           cursor: pointer;
//         }
//         .sample:hover { background: var(--primary-bg-hover); }

//         /* ── File drop ──────────────────────────────────────── */
//         .drop {
//           border: 2px dashed var(--border-strong);
//           background: var(--surface-alt);
//           margin: 12px 16px 0;
//           border-radius: 8px;
//           padding: 14px;
//           text-align: center;
//           color: var(--text-muted); font-size: 13px; font-weight: 500;
//           cursor: pointer;
//           transition: all 0.15s;
//         }
//         .drop:hover, .drop.dragover {
//           border-color: var(--primary);
//           background: var(--primary-bg);
//           color: var(--primary);
//         }

//         /* ── Body ───────────────────────────────────────────── */
//         .body {
//           display: grid;
//           flex: 1;
//           min-height: 0;
//           margin-top: 12px;
//           grid-template-columns: 1fr;
//         }
//         .body.with-exp {
//           grid-template-columns: minmax(0, 1fr) 300px;
//         }

//         .panes {
//           display: grid;
//           gap: 1px;
//           background: var(--border);
//           min-height: 340px;
//         }
//         .panes.horizontal { grid-template-columns: 1fr 1fr; }
//         .panes.vertical   { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

//         .pane {
//           background: var(--surface);
//           display: flex; flex-direction: column; min-height: 0;
//         }
//         .lbl {
//           font-size: 11.5px; font-weight: 800;
//           color: var(--text-label);
//           letter-spacing: 0.08em; text-transform: uppercase;
//           padding: 10px 16px 10px 13px;
//           border-bottom: 1px solid var(--border-subtle);
//           background: var(--hdr-bg-subtle);
//           border-left: 3px solid var(--primary);
//           display: flex; align-items: center; justify-content: space-between; gap: 8px;
//           min-height: 40px;
//         }
//         .lbl-actions { display: flex; gap: 6px; }
//         .btn-in-lbl {
//           padding: 3px 10px;
//           font-size: 10.5px; font-weight: 700;
//           background: var(--surface); color: var(--primary);
//           border: 1px solid var(--primary-border); border-radius: 4px;
//           letter-spacing: 0.06em; text-transform: uppercase;
//           cursor: pointer;
//         }
//         .btn-in-lbl:disabled { opacity: 0.4; cursor: not-allowed; }
//         .btn-in-lbl.muted { color: var(--text-muted); border-color: var(--border); }

//         textarea, .out {
//           flex: 1;
//           border: none; outline: none;
//           padding: 14px 16px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 13px; line-height: 1.6;
//           color: var(--text);
//           background: transparent;
//           resize: none;
//           white-space: pre-wrap;
//           word-break: break-all;
//           overflow-y: auto;
//           margin: 0;
//           min-height: 200px;
//         }
//         textarea::placeholder { color: var(--text-input-placeholder); }
//         .out.err { color: var(--error); background: var(--error-bg); }

//         /* ── Explanations box ───────────────────────────────── */
//         .exp {
//           border-left: 1px solid var(--border);
//           background: var(--surface-alt);
//           display: flex; flex-direction: column;
//         }
//         .exp-hdr {
//           font-size: 11.5px; font-weight: 800;
//           color: var(--text-label);
//           letter-spacing: 0.08em; text-transform: uppercase;
//           padding: 10px 16px 10px 13px;
//           border-bottom: 1px solid var(--border-subtle);
//           background: var(--hdr-bg-subtle);
//           border-left: 3px solid var(--primary);
//           min-height: 40px;
//           display: flex; align-items: center;
//         }
//         .exp-body {
//           padding: 16px;
//           font-size: 13px; line-height: 1.6;
//           color: var(--text-muted);
//           flex: 1;
//         }
//         .exp-body :global(p) { margin: 0 0 12px; }
//         .exp-body :global(p:last-child) { margin-bottom: 0; }
//         .exp-body :global(a) {
//           color: var(--primary); font-weight: 600;
//           text-decoration: none;
//           border-bottom: 1px solid var(--primary-border);
//         }
//         .exp-body :global(a:hover) { border-bottom-color: var(--primary); }
//         .exp-body :global(code) {
//           background: var(--surface-code);
//           padding: 1px 6px;
//           border-radius: 4px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 12px; color: var(--primary);
//           border: 1px solid var(--border);
//         }

//         /* ── Stats footer ───────────────────────────────────── */
//         .stats {
//           padding: 10px 16px;
//           background: var(--stats-bg);
//           border-top: 1px solid var(--border);
//           display: flex; gap: 24px;
//           font-family: ui-monospace, Menlo, monospace;
//           font-size: 11.5px; color: var(--text-muted);
//           flex-wrap: wrap;
//         }
//         .stats b { color: var(--primary); font-weight: 700; }

//         /* ── Tooltips ───────────────────────────────────────── */
//         :global([data-tt]) { position: relative; }
//         :global([data-tt]::after) {
//           content: attr(data-tt);
//           position: absolute;
//           top: calc(100% + 8px); left: 50%;
//           transform: translateX(-50%);
//           background: #0f172a; color: #ffffff;
//           padding: 5px 10px; border-radius: 5px;
//           font-size: 11px; font-weight: 500;
//           font-family: -apple-system, system-ui, sans-serif;
//           letter-spacing: 0.01em;
//           white-space: nowrap; z-index: 100;
//           pointer-events: none; opacity: 0;
//           transition: opacity 0.12s ease 0.35s;
//           box-shadow: 0 6px 20px rgba(0,0,0,0.18);
//         }
//         :global([data-tt]::before) {
//           content: '';
//           position: absolute;
//           top: 100%; left: 50%;
//           transform: translateX(-50%);
//           border: 4px solid transparent;
//           border-bottom-color: #0f172a;
//           z-index: 100; pointer-events: none; opacity: 0;
//           transition: opacity 0.12s ease 0.35s;
//         }
//         :global([data-tt]:hover::after), :global([data-tt]:hover::before) { opacity: 1; }
//         :global([data-tt-pos="above"]::after) { top: auto; bottom: calc(100% + 8px); }
//         :global([data-tt-pos="above"]::before) {
//           top: auto; bottom: 100%;
//           border-bottom-color: transparent;
//           border-top-color: #0f172a;
//         }
//       `}</style>
//     </div>
//   );
// }


// Base64Tool.jsx  ── v5
// ─────────────────────────────────────────────────────────────
// Change vs v4: keyboard shortcuts wired up.
//
// Three shortcuts, active while the tool is mounted:
//   Cmd/Ctrl + K       Focus the input textarea
//   Cmd/Ctrl + Enter   Copy output to clipboard (when output exists)
//   Cmd/Ctrl + /       Toggle between Encode and Decode
//
// Implementation details:
//   • Single window keydown listener installed on mount.
//   • Uses metaKey on Mac, ctrlKey elsewhere.
//   • preventDefault called only when a shortcut matches, so
//     other browser shortcuts continue to work.
//   • Handler reads live output/error via refs so it doesn't
//     need to re-subscribe on every state change.
//   • Copy tooltip and Encode/Decode tab tooltips now mention
//     their shortcuts, making them discoverable from the UI.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';

// ─── Helpers ────────────────────────────────────────────────

function textToBytes(str, cs) {
  if (cs === 'utf-8') return new TextEncoder().encode(str);
  if (cs === 'utf-16le' || cs === 'utf-16be') {
    const be = cs === 'utf-16be';
    const bytes = new Uint8Array(str.length * 2);
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      bytes[i * 2]     = be ? (c >> 8) & 0xff : c & 0xff;
      bytes[i * 2 + 1] = be ? c & 0xff : (c >> 8) & 0xff;
    }
    return bytes;
  }
  if (cs === 'latin-1') {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c > 255) {
        throw new Error(
          'Character U+' + c.toString(16).padStart(4, '0') + ' cannot be represented in Latin-1.'
        );
      }
      bytes[i] = c;
    }
    return bytes;
  }
  throw new Error('Unknown encoding: ' + cs);
}

function bytesToText(bytes, cs) {
  const label = cs === 'latin-1' ? 'iso-8859-1' : cs;
  return new TextDecoder(label, { fatal: true }).decode(bytes);
}

function bytesToBase64(bytes, opts) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  let out = btoa(bin);
  if (opts.urlSafe)  out = out.replace(/\+/g, '-').replace(/\//g, '_');
  if (opts.stripPad) out = out.replace(/=+$/, '');
  if (opts.wrap)     out = out.match(/.{1,76}/g).join('\n');
  return out;
}

function base64ToBytes(s) {
  let c = s.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  while (c.length % 4) c += '=';
  const bin = atob(c);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ─── Constants ──────────────────────────────────────────────

const DEFAULT_EXPLANATIONS = {
  encode: (
    <>
      <p><b>Encode</b> converts text into a Base64 string. Under the hood, the tool first turns your text into bytes using the selected text encoding (UTF-8 by default), then represents those bytes with 64 safe characters: <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, <code>/</code>.</p>
      <p>Common uses: embedding binary data in JSON, cookies, or email headers, and building data URIs.</p>
    </>
  ),
  decode: (
    <>
      <p><b>Decode</b> reverses the process: it converts a Base64 string back into raw bytes, then interprets those bytes as text using the selected encoding. Whitespace and padding (<code>=</code>) are handled automatically.</p>
      <p>If the input isn&apos;t valid Base64 or the resulting bytes aren&apos;t valid for the selected encoding, an error is shown.</p>
    </>
  ),
};

const SAMPLES = {
  hello:   { mode: 'encode', text: 'Hello, world!',                              tip: 'Simple ASCII text',                              label: 'Hello text' },
  unicode: { mode: 'encode', text: 'Café — 中文 — 🚀 emoji test',               tip: 'Text with emoji and international characters',   label: 'Unicode + emoji' },
  jwt:     { mode: 'decode', text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',       tip: 'URL-safe fragment from a JWT header',             label: 'JWT payload' },
  dataUri: { mode: 'decode', text: 'SGVsbG8sIHdvcmxkIQ==',                       tip: 'Base64 string ready to decode',                   label: 'Data URI' },
};

// ─── Component ──────────────────────────────────────────────

export default function Base64Tool({
  theme                 = 'light',
  showThemeToggle       = false,
  showExplanations      = false,
  showOrientationToggle = true,
  initialOrientation    = 'horizontal',
  explanations          = null,
}) {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [mode,         setMode]         = useState('encode');
  const [input,        setInput]        = useState('');
  const [output,       setOutput]       = useState('');
  const [error,        setError]        = useState(null);
  const [inputSize,    setInputSize]    = useState(0);
  const [urlSafe,      setUrlSafe]      = useState(false);
  const [stripPad,     setStripPad]     = useState(false);
  const [wrap,         setWrap]         = useState(false);
  const [charset,      setCharset]      = useState('utf-8');
  const [orientation,  setOrientation]  = useState(initialOrientation);
  const [copied,       setCopied]       = useState(false);
  const [fileMode,     setFileMode]     = useState(false);
  const [dragOver,     setDragOver]     = useState(false);

  const fileInputRef = useRef(null);
  const inputRef     = useRef(null);
  const outputRef    = useRef('');
  const errorRef     = useRef(null);

  // Mirror latest output/error into refs so the keydown handler
  // (installed once on mount) always reads the current values.
  outputRef.current = output;
  errorRef.current  = error;

  // Re-sync current theme if the parent's theme prop changes.
  useEffect(() => { setCurrentTheme(theme); }, [theme]);

  // Derive output whenever input or options change (unless in file mode).
  useEffect(() => {
    if (fileMode) return;
    if (!input) {
      setOutput('');
      setError(null);
      setInputSize(0);
      return;
    }
    try {
      if (mode === 'encode') {
        const bytes  = textToBytes(input, charset);
        const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
        setOutput(result);
        setInputSize(bytes.length);
        setError(null);
      } else {
        const bytes  = base64ToBytes(input);
        const result = bytesToText(bytes, charset);
        setOutput(result);
        setInputSize(input.replace(/\s/g, '').length);
        setError(null);
      }
    } catch (err) {
      setOutput('');
      setError((mode === 'encode' ? 'Failed to encode: ' : 'Failed to decode: ') + err.message);
      setInputSize(0);
    }
  }, [input, mode, charset, urlSafe, stripPad, wrap, fileMode]);

  // ── Keyboard shortcuts ────────────────────────────────────
  //   Cmd/Ctrl + K       focus input
  //   Cmd/Ctrl + Enter   copy output
  //   Cmd/Ctrl + /       toggle mode
  useEffect(() => {
    const handleKeydown = (e) => {
      const isMac = typeof navigator !== 'undefined'
        && navigator.platform.toLowerCase().includes('mac');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod || e.altKey) return;
      const k = e.key.toLowerCase();

      if (k === 'k' && !e.shiftKey) {
        e.preventDefault();
        if (inputRef.current) inputRef.current.focus();
        return;
      }
      if (k === 'enter' && !e.shiftKey) {
        e.preventDefault();
        const out = outputRef.current;
        const err = errorRef.current;
        if (out && !err) {
          navigator.clipboard.writeText(out).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }
        return;
      }
      if (k === '/' && !e.shiftKey) {
        e.preventDefault();
        setMode((prev) => prev === 'encode' ? 'decode' : 'encode');
        return;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // ── Handlers ──────────────────────────────────────────────

  const handleInputChange = (e) => {
    if (fileMode) setFileMode(false);
    setInput(e.target.value);
  };

  const handleSample = (key) => {
    const s = SAMPLES[key];
    setFileMode(false);
    setMode(s.mode);
    setInput(s.text);
  };

  const handleReset = () => {
    setMode('encode');
    setInput('');
    setOutput('');
    setError(null);
    setInputSize(0);
    setUrlSafe(false);
    setStripPad(false);
    setWrap(false);
    setCharset('utf-8');
    setFileMode(false);
  };

  const handleCopy = () => {
    if (!output || error) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    if (!output || error) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (file) => {
    setMode('encode');
    setFileMode(true);
    const reader = new FileReader();
    reader.onload = () => {
      const bytes  = new Uint8Array(reader.result);
      const result = bytesToBase64(bytes, { urlSafe, stripPad, wrap });
      setInput(`[File: ${file.name}, ${file.size} bytes]`);
      setOutput(result);
      setInputSize(file.size);
      setError(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Derived ────────────────────────────────────────────────

  const hint    = mode === 'encode' ? 'Text \u2192 Base64' : 'Base64 \u2192 Text';
  const outLen  = output ? output.length : 0;
  const ratio   = inputSize ? (outLen / inputSize).toFixed(2) + 'x' : '\u2014';
  const inChars = input.length;

  const expContent = (() => {
    const override = explanations && explanations[mode];
    if (override) {
      if (typeof override === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: override }} />;
      }
      return override;
    }
    return DEFAULT_EXPLANATIONS[mode];
  })();

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="tool" data-theme={currentTheme}>

      {/* Top bar */}
      <div className="top-bar">
        <div className="tabs">
          <button
            type="button"
            className={`tab ${mode === 'encode' ? 'on' : ''}`}
            onClick={() => setMode('encode')}
            data-tt="Convert text to Base64  (⌘/ or Ctrl+/ to toggle)"
          >Encode</button>
          <button
            type="button"
            className={`tab ${mode === 'decode' ? 'on' : ''}`}
            onClick={() => setMode('decode')}
            data-tt="Convert Base64 to text  (⌘/ or Ctrl+/ to toggle)"
          >Decode</button>
        </div>
        <div className="hint">{hint}</div>
        <div className="top-actions">
          {showOrientationToggle && (
            <div className="seg-toggle" role="group" aria-label="Layout orientation">
              <button
                type="button"
                className={`seg-btn ${orientation === 'horizontal' ? 'on' : ''}`}
                onClick={() => setOrientation('horizontal')}
                data-tt="Panes side by side"
                aria-label="Side by side"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="9"   y="3" width="5.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button
                type="button"
                className={`seg-btn ${orientation === 'vertical' ? 'on' : ''}`}
                onClick={() => setOrientation('vertical')}
                data-tt="Panes stacked"
                aria-label="Stacked"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="1.5" width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="3" y="9"   width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          )}
          {showThemeToggle && (
            <div className="seg-toggle" role="group" aria-label="Theme">
              <button
                type="button"
                className={`seg-btn ${currentTheme === 'light' ? 'on' : ''}`}
                onClick={() => setCurrentTheme('light')}
                data-tt="Light theme"
                aria-label="Light theme"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="3" />
                  <line x1="8" y1="1.5" x2="8" y2="3" />
                  <line x1="8" y1="13" x2="8" y2="14.5" />
                  <line x1="1.5" y1="8" x2="3" y2="8" />
                  <line x1="13" y1="8" x2="14.5" y2="8" />
                  <line x1="3.2" y1="3.2" x2="4.3" y2="4.3" />
                  <line x1="11.7" y1="11.7" x2="12.8" y2="12.8" />
                  <line x1="3.2" y1="12.8" x2="4.3" y2="11.7" />
                  <line x1="11.7" y1="4.3" x2="12.8" y2="3.2" />
                </svg>
              </button>
              <button
                type="button"
                className={`seg-btn ${currentTheme === 'terminal' ? 'on' : ''}`}
                onClick={() => setCurrentTheme('terminal')}
                data-tt="Terminal (dark) theme"
                aria-label="Terminal theme"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.5 10.3C12.6 11 11.4 11.4 10.2 11.4C7.1 11.4 4.6 8.9 4.6 5.8C4.6 4.6 5 3.5 5.7 2.5C3.4 3.4 1.7 5.6 1.7 8.3C1.7 11.7 4.5 14.5 7.9 14.5C10.6 14.5 12.9 12.8 13.7 10.4C13.6 10.4 13.6 10.3 13.5 10.3Z" />
                </svg>
              </button>
            </div>
          )}
          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
            data-tt="Clear input, output, and reset all options"
          >Reset</button>
        </div>
      </div>

      {/* Options row */}
      <div className="opts">
        <label className="opt" data-tt="Use - and _ instead of + and /">
          <input type="checkbox" checked={urlSafe}  onChange={(e) => setUrlSafe(e.target.checked)}  />
          URL-safe <span className="opt-note">(- _ instead of + /)</span>
        </label>
        <label className="opt" data-tt="Remove trailing = characters">
          <input type="checkbox" checked={stripPad} onChange={(e) => setStripPad(e.target.checked)} />
          Strip padding <span className="opt-note">(no =)</span>
        </label>
        <label className="opt" data-tt="Wrap output at 76 characters per line (MIME format)">
          <input type="checkbox" checked={wrap}     onChange={(e) => setWrap(e.target.checked)}     />
          Line-wrap 76 <span className="opt-note">(MIME)</span>
        </label>
        <div className="opt-select" data-tt="How text is converted to bytes before encoding">
          <span className="opt-select-lbl">Text encoding:</span>
          <select value={charset} onChange={(e) => setCharset(e.target.value)}>
            <option value="utf-8">UTF-8</option>
            <option value="utf-16le">UTF-16 LE</option>
            <option value="utf-16be">UTF-16 BE</option>
            <option value="latin-1">Latin-1</option>
          </select>
        </div>
      </div>

      {/* Samples row */}
      <div className="samples">
        <span className="samples-lbl">Samples:</span>
        {Object.entries(SAMPLES).map(([key, s]) => (
          <button
            key={key}
            type="button"
            className="sample"
            onClick={() => handleSample(key)}
            data-tt={s.tip}
          >{s.label}</button>
        ))}
      </div>

      {/* File drop */}
      <div
        className={`drop ${dragOver ? 'dragover' : ''}`}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        data-tt="Drop any file to encode it as Base64"
      >
        Drop a file here to encode as Base64, or click to browse
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />

      {/* Body: panes + optional explanations */}
      <div className={`body ${showExplanations ? 'with-exp' : ''}`}>

        <div className={`panes ${orientation}`}>
          <div className="pane">
            <div className="lbl"><span>Input</span></div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={mode === 'encode' ? 'Enter text...' : 'Paste Base64...'}
              spellCheck={false}
            />
          </div>
          <div className="pane">
            <div className="lbl">
              <span>Output</span>
              <div className="lbl-actions">
                <button
                  type="button"
                  className="btn-in-lbl"
                  onClick={handleCopy}
                  disabled={!output || !!error}
                  data-tt="Copy output to clipboard  (⌘⏎ or Ctrl+Enter)"
                  data-tt-pos="above"
                >{copied ? 'Copied' : 'Copy'}</button>
                <button
                  type="button"
                  className="btn-in-lbl muted"
                  onClick={handleDownload}
                  disabled={!output || !!error}
                  data-tt="Save output as text file"
                  data-tt-pos="above"
                >Download</button>
              </div>
            </div>
            <pre className={`out ${error ? 'err' : ''}`}>{error || output}</pre>
          </div>
        </div>

        {showExplanations && (
          <div className="exp">
            <div className="exp-hdr">{mode === 'encode' ? 'Encode' : 'Decode'}</div>
            <div className="exp-body">{expContent}</div>
          </div>
        )}

      </div>

      {/* Stats footer */}
      <div className="stats">
        <span>Input: <b>{inChars}</b> chars, <b>{inputSize}</b> bytes</span>
        <span>Output: <b>{outLen}</b> chars</span>
        <span>Ratio: <b>{ratio}</b></span>
      </div>

      <style jsx>{`
        .tool {
          --bg: #ffffff;
          --surface: #ffffff;
          --surface-alt: #f5f7fb;
          --surface-code: #eff2f8;
          --hdr-bg: #eef2f7;
          --hdr-bg-subtle: #f2f6fd;
          --text: #0f172a;
          --text-muted: #475569;
          --text-subtle: #64748b;
          --text-label: #334155;
          --text-input-placeholder: #94a3b8;
          --border: #cfd6e0;
          --border-strong: #a3b0c6;
          --border-subtle: #e4e4e7;
          --border-thin: #f1f5f9;
          --primary: #1B50EE;
          --primary-hover: #133EBF;
          --primary-bg: #E8EEFB;
          --primary-bg-hover: #d5e0f9;
          --primary-border: #C8D4F6;
          --error: #b91c1c;
          --error-bg: #fef2f2;
          --stats-bg: #eef2f7;

          background: var(--surface);
          color: var(--text);
          min-height: 550px;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        }
        .tool[data-theme="terminal"] {
          --bg: #0A0D14;
          --surface: #101623;
          --surface-alt: #141b2b;
          --surface-code: #0a0e18;
          --hdr-bg: #182236;
          --hdr-bg-subtle: rgba(77,116,255,0.08);
          --text: #d4dae5;
          --text-muted: #97a3b8;
          --text-subtle: #6b7891;
          --text-label: #c1cad9;
          --text-input-placeholder: #4b5875;
          --border: #1e2637;
          --border-strong: #2d3a52;
          --border-subtle: #1e2637;
          --border-thin: #131a28;
          --primary: #4D74FF;
          --primary-hover: #6A8BFF;
          --primary-bg: rgba(77,116,255,0.14);
          --primary-bg-hover: rgba(77,116,255,0.22);
          --primary-border: rgba(77,116,255,0.35);
          --error: #f87171;
          --error-bg: rgba(248,113,113,0.1);
          --stats-bg: #131a28;
          background: var(--bg);
        }

        .top-bar {
          padding: 12px 16px;
          background: var(--hdr-bg);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .tabs {
          display: flex; gap: 4px; padding: 3px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
        }
        .tab {
          padding: 6px 16px;
          font-size: 12.5px; font-weight: 700;
          color: var(--text-muted);
          background: transparent; border: none; border-radius: 4px;
          cursor: pointer; letter-spacing: 0.02em;
        }
        .tab.on {
          background: var(--primary); color: #ffffff;
          box-shadow: 0 1px 2px rgba(15,23,42,0.12);
        }
        .hint {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px; color: var(--text-label);
          font-weight: 600; letter-spacing: 0.02em;
        }
        .top-actions {
          margin-left: auto;
          display: flex; gap: 8px; align-items: center;
        }
        .seg-toggle {
          display: flex; gap: 2px; padding: 2px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 5px;
        }
        .seg-btn {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; border-radius: 3px;
          cursor: pointer; color: var(--text-muted);
        }
        .seg-btn.on { background: var(--primary); color: #ffffff; }
        .btn-reset {
          padding: 5px 12px;
          font-size: 11.5px; font-weight: 700;
          color: var(--text-muted);
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 5px;
          cursor: pointer;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .btn-reset:hover { color: var(--error); border-color: var(--error); }

        .opts {
          padding: 10px 16px;
          background: var(--hdr-bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
          border-left: 3px solid var(--primary);
          display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
        }
        .opt {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: var(--text-label);
          font-weight: 600; cursor: pointer; user-select: none;
        }
        .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
        .opt-note { color: var(--text-subtle); font-size: 11px; font-weight: 400; margin-left: 4px; }
        .opt-select { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
        .opt-select select {
          padding: 4px 8px;
          font-size: 12px; font-family: ui-monospace, Menlo, monospace;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border-strong); border-radius: 4px;
          cursor: pointer;
        }

        .samples {
          padding: 10px 16px;
          background: var(--surface);
          border-bottom: 1px solid var(--border-subtle);
          display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
        }
        .samples-lbl {
          font-size: 11px; font-weight: 700;
          color: var(--text-subtle);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .sample {
          padding: 5px 12px;
          font-size: 12px; font-weight: 500;
          color: var(--primary);
          background: var(--primary-bg);
          border: 1px solid var(--primary-border); border-radius: 5px;
          cursor: pointer;
        }
        .sample:hover { background: var(--primary-bg-hover); }

        .drop {
          border: 2px dashed var(--border-strong);
          background: var(--surface-alt);
          margin: 12px 16px 0;
          border-radius: 8px;
          padding: 14px;
          text-align: center;
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .drop:hover, .drop.dragover {
          border-color: var(--primary);
          background: var(--primary-bg);
          color: var(--primary);
        }

        .body {
          display: grid;
          flex: 1;
          min-height: 0;
          margin-top: 12px;
          grid-template-columns: 1fr;
        }
        .body.with-exp {
          grid-template-columns: minmax(0, 1fr) 300px;
        }

        .panes {
          display: grid;
          gap: 1px;
          background: var(--border);
          min-height: 340px;
        }
        .panes.horizontal { grid-template-columns: 1fr 1fr; }
        .panes.vertical   { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

        .pane {
          background: var(--surface);
          display: flex; flex-direction: column; min-height: 0;
        }
        .lbl {
          font-size: 11.5px; font-weight: 800;
          color: var(--text-label);
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 10px 16px 10px 13px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--hdr-bg-subtle);
          border-left: 3px solid var(--primary);
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          min-height: 40px;
        }
        .lbl-actions { display: flex; gap: 6px; }
        .btn-in-lbl {
          padding: 3px 10px;
          font-size: 10.5px; font-weight: 700;
          background: var(--surface); color: var(--primary);
          border: 1px solid var(--primary-border); border-radius: 4px;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer;
        }
        .btn-in-lbl:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-in-lbl.muted { color: var(--text-muted); border-color: var(--border); }

        textarea, .out {
          flex: 1;
          border: none; outline: none;
          padding: 14px 16px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 13px; line-height: 1.6;
          color: var(--text);
          background: transparent;
          resize: none;
          white-space: pre-wrap;
          word-break: break-all;
          overflow-y: auto;
          margin: 0;
          min-height: 200px;
        }
        textarea::placeholder { color: var(--text-input-placeholder); }
        .out.err { color: var(--error); background: var(--error-bg); }

        .exp {
          border-left: 1px solid var(--border);
          background: var(--surface-alt);
          display: flex; flex-direction: column;
        }
        .exp-hdr {
          font-size: 11.5px; font-weight: 800;
          color: var(--text-label);
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 10px 16px 10px 13px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--hdr-bg-subtle);
          border-left: 3px solid var(--primary);
          min-height: 40px;
          display: flex; align-items: center;
        }
        .exp-body {
          padding: 16px;
          font-size: 13px; line-height: 1.6;
          color: var(--text-muted);
          flex: 1;
        }
        .exp-body :global(p) { margin: 0 0 12px; }
        .exp-body :global(p:last-child) { margin-bottom: 0; }
        .exp-body :global(a) {
          color: var(--primary); font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid var(--primary-border);
        }
        .exp-body :global(a:hover) { border-bottom-color: var(--primary); }
        .exp-body :global(code) {
          background: var(--surface-code);
          padding: 1px 6px;
          border-radius: 4px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px; color: var(--primary);
          border: 1px solid var(--border);
        }

        .stats {
          padding: 10px 16px;
          background: var(--stats-bg);
          border-top: 1px solid var(--border);
          display: flex; gap: 24px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11.5px; color: var(--text-muted);
          flex-wrap: wrap;
        }
        .stats b { color: var(--primary); font-weight: 700; }

        :global([data-tt]) { position: relative; }
        :global([data-tt]::after) {
          content: attr(data-tt);
          position: absolute;
          top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          background: #0f172a; color: #ffffff;
          padding: 5px 10px; border-radius: 5px;
          font-size: 11px; font-weight: 500;
          font-family: -apple-system, system-ui, sans-serif;
          letter-spacing: 0.01em;
          white-space: nowrap; z-index: 100;
          pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease 0.35s;
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }
        :global([data-tt]::before) {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-bottom-color: #0f172a;
          z-index: 100; pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease 0.35s;
        }
        :global([data-tt]:hover::after), :global([data-tt]:hover::before) { opacity: 1; }
        :global([data-tt-pos="above"]::after) { top: auto; bottom: calc(100% + 8px); }
        :global([data-tt-pos="above"]::before) {
          top: auto; bottom: 100%;
          border-bottom-color: transparent;
          border-top-color: #0f172a;
        }
      `}</style>
    </div>
  );
}