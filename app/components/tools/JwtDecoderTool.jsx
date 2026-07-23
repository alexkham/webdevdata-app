// JwtDecoderTool.jsx — v1
// JWT decoder + optional HS256/384/512 verification.
// Zero deps: base64url + JSON.parse + Web Crypto for HMAC.

import { useState, useEffect, useRef, useCallback } from 'react';

const OP = 'decode';

const DEFAULT_EXPLANATIONS = {
  decode: (
    <>
      <p><b>JWT Decoder</b> splits the token on <code>.</code>, base64url-decodes each part, and pretty-prints the header and payload JSON.</p>
      <p>Optionally verifies the signature for HS256/384/512 using a shared secret. RS*/ES*/PS* require a public key — not supported in this tool.</p>
    </>
  ),
};

// Sample tokens generated on jwt.io examples. Secret for verification is "your-256-bit-secret".
const SAMPLES = [
  {
    label: 'HS256 example',
    tt: 'HS256 token — try verifying with secret: your-256-bit-secret',
    text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  {
    label: 'With expiration',
    tt: 'Token with exp claim in the past — check the expired badge.',
    text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAwMzYwfQ.f0Rf5R8oOWiN91xShhwyLibvR9EdIrWnH1YMDXvY-w4',
  },
  {
    label: 'Complex payload',
    tt: 'Nested claims: roles, custom scopes, issuer.',
    text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleS0xIn0.eyJzdWIiOiJ1c2VyLTEyMyIsIm5hbWUiOiJBbGljZSBTbWl0aCIsInJvbGVzIjpbImFkbWluIiwiZWRpdG9yIl0sImlzcyI6Imh0dHBzOi8vd2ViZGV2ZGF0YS5uZXQiLCJhdWQiOlsid2ViIiwibW9iaWxlIl0sInNjb3BlIjoicmVhZDp1c2VycyB3cml0ZTpwb3N0cyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzk5OTk5OTk5fQ.6JzYqK3wLu-fKMdOL7Xr2qFhE0kZa4RhrIovNXwPtIA',
  },
  {
    label: 'RS256 (no verify)',
    tt: 'RS256 token — decoded but not verified in this tool.',
    text: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.POstGetfAytaZS82wHcjoTyoqhMyxXiWdR7Nn7A29DNSl0EiXLdwJ6xC6AfgZWF1bOsS_TuYI3OG85AmiExREkrS6tDfTQ2B3WXlrr-wp5AokiRbz3_oB4OxG-W9KcEEbDRcZc0nH3L7LzYptiy1PtAylQGxHTWZXtGz4ht0bAecBgmpc1BkJsuZRSD5eJZ5S9NHb4l0Aa2fcHwlxCoI5G3l90CtxfBRR9-U8bMr3rjOZLj-jJ-6HDlEuC4EEV1F0aTQz7HGXZ_5N_8V_5C-8s3vLR9F4ULP99lLHrPtCVA',
  },
];

// ---------- base64url helpers ----------
function base64UrlDecodeToString(input) {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + (4 - (input.length % 4)) % 4, '=');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function base64UrlDecodeToBytes(input) {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + (4 - (input.length % 4)) % 4, '=');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------- JWT decode ----------
function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error(`Expected 3 parts (header.payload.signature), got ${parts.length}`);
  }
  const [rawHeader, rawPayload, rawSignature] = parts;

  let header;
  try {
    header = JSON.parse(base64UrlDecodeToString(rawHeader));
  } catch (e) {
    throw new Error('Invalid header — not valid base64url JSON: ' + e.message);
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecodeToString(rawPayload));
  } catch (e) {
    throw new Error('Invalid payload — not valid base64url JSON: ' + e.message);
  }

  const signatureBytes = base64UrlDecodeToBytes(rawSignature);

  return {
    header,
    payload,
    signature: {
      base64url: rawSignature,
      hex: bytesToHex(signatureBytes),
      bytes: signatureBytes,
    },
    signingInput: `${rawHeader}.${rawPayload}`,
    algorithm: header.alg,
  };
}

// ---------- HS* verification ----------
async function verifyHmac(algorithm, secret, signingInput, signatureBytes) {
  const hashName = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' }[algorithm];
  if (!hashName) return { supported: false };

  const keyBytes = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: hashName },
    false,
    ['sign']
  );
  const dataBytes = new TextEncoder().encode(signingInput);
  const sig = await crypto.subtle.sign('HMAC', key, dataBytes);
  const computed = new Uint8Array(sig);

  if (computed.length !== signatureBytes.length) return { supported: true, valid: false };
  let equal = true;
  for (let i = 0; i < computed.length; i++) {
    if (computed[i] !== signatureBytes[i]) { equal = false; break; }
  }
  return { supported: true, valid: equal };
}

// ---------- Time helpers ----------
function fmtUnixTime(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null;
  try {
    const d = new Date(seconds * 1000);
    return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
  } catch {
    return null;
  }
}

function relativeTime(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null;
  const nowSec = Math.floor(Date.now() / 1000);
  const diff = seconds - nowSec;
  const abs = Math.abs(diff);
  let unit, value;
  if (abs < 60) { value = abs; unit = 'sec'; }
  else if (abs < 3600) { value = Math.round(abs / 60); unit = 'min'; }
  else if (abs < 86400) { value = Math.round(abs / 3600); unit = 'hr'; }
  else { value = Math.round(abs / 86400); unit = 'day'; }
  return diff < 0 ? `${value} ${unit}${value === 1 ? '' : 's'} ago` : `in ${value} ${unit}${value === 1 ? '' : 's'}`;
}

export default function JwtDecoderTool({
  theme = 'light',
  showThemeToggle = false,
  showOrientationToggle = true,
  initialOrientation = 'horizontal',
  showExplanations = false,
  explanations = null,
}) {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [verifyOn, setVerifyOn] = useState(false);
  const [secret, setSecret] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const [currentTheme, setCurrentTheme] = useState(theme);
  const [orientation, setOrientation] = useState(initialOrientation);

  const inputRef = useRef(null);
  const decodedRef = useRef(null);
  const errorRef = useRef('');

  useEffect(() => { setCurrentTheme(theme); }, [theme]);
  useEffect(() => { decodedRef.current = decoded; }, [decoded]);
  useEffect(() => { errorRef.current = error; }, [error]);

  // Decode
  useEffect(() => {
    if (!input.trim()) {
      setDecoded(null);
      setError('');
      setVerifyResult(null);
      return;
    }
    try {
      const d = decodeJwt(input);
      setDecoded(d);
      setError('');
    } catch (e) {
      setDecoded(null);
      setError(e.message || String(e));
      setVerifyResult(null);
    }
  }, [input]);

  // Verify
  useEffect(() => {
    if (!verifyOn || !decoded || error) {
      setVerifyResult(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await verifyHmac(decoded.algorithm, secret, decoded.signingInput, decoded.signature.bytes);
        if (!cancelled) setVerifyResult(res);
      } catch (e) {
        if (!cancelled) setVerifyResult({ supported: true, valid: false, error: e.message });
      }
    })();
    return () => { cancelled = true; };
  }, [verifyOn, secret, decoded, error]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const d = decodedRef.current;
        if (d && !errorRef.current) {
          const text = JSON.stringify({ header: d.header, payload: d.payload }, null, 2);
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleReset = useCallback(() => {
    setInput('');
    setDecoded(null);
    setError('');
    setVerifyOn(false);
    setSecret('');
    setVerifyResult(null);
  }, []);

  const copyText = decoded && !error
    ? JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2)
    : '';

  const handleCopy = useCallback(() => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [copyText]);

  const handleDownload = useCallback(() => {
    if (!copyText) return;
    const blob = new Blob([copyText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jwt-decoded.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [copyText]);

  const loadSample = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const expContent = (() => {
    const override = explanations && explanations[OP];
    if (override) {
      if (typeof override === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: override }} />;
      }
      return override;
    }
    return DEFAULT_EXPLANATIONS[OP];
  })();

  // Expiration status
  let expStatus = null;
  if (decoded && decoded.payload) {
    const { exp, nbf } = decoded.payload;
    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof exp === 'number') {
      if (exp < nowSec) expStatus = { kind: 'expired', label: 'Expired', detail: `exp ${relativeTime(exp)}` };
      else expStatus = { kind: 'valid', label: 'Not expired', detail: `expires ${relativeTime(exp)}` };
    }
    if (typeof nbf === 'number' && nbf > nowSec) {
      expStatus = { kind: 'expired', label: 'Not yet valid', detail: `valid ${relativeTime(nbf)}` };
    }
  }

  const inBytes = new Blob([input]).size;

  return (
    <div className="tool" data-theme={currentTheme}>
      <div className="top-bar">
        <span className="hint">Paste a JWT — get decoded header, payload, and signature.</span>

        <div className="top-actions">
          {showOrientationToggle && (
            <div className="seg-toggle" role="group">
              <button
                className={'seg-btn' + (orientation === 'horizontal' ? ' on' : '')}
                onClick={() => setOrientation('horizontal')}
                data-tt="Side-by-side panes"
                aria-label="Horizontal layout"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="8" y="2" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button
                className={'seg-btn' + (orientation === 'vertical' ? ' on' : '')}
                onClick={() => setOrientation('vertical')}
                data-tt="Stacked panes"
                aria-label="Vertical layout"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="2" y="8" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          )}

          {showThemeToggle && (
            <div className="seg-toggle" role="group">
              <button
                className={'seg-btn' + (currentTheme === 'light' ? ' on' : '')}
                onClick={() => setCurrentTheme('light')}
                data-tt="Light theme"
                aria-label="Light theme"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="7" cy="7" r="3"/>
                  <path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.5 2.5l.7.7M10.8 10.8l.7.7M2.5 11.5l.7-.7M10.8 3.2l.7-.7"/>
                </svg>
              </button>
              <button
                className={'seg-btn' + (currentTheme === 'terminal' ? ' on' : '')}
                onClick={() => setCurrentTheme('terminal')}
                data-tt="Terminal theme"
                aria-label="Terminal theme"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 8a5 5 0 1 1-5-5 4 4 0 0 0 5 5z"/>
                </svg>
              </button>
            </div>
          )}

          <button
            className="btn-reset"
            onClick={handleReset}
            data-tt="Clear input and reset"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="opts">
        <label className="opt" data-tt="Verify HS256/384/512 signature using a shared secret">
          <input
            type="checkbox"
            checked={verifyOn}
            onChange={(e) => setVerifyOn(e.target.checked)}
          />
          Verify signature
        </label>

        {verifyOn && (
          <span className="opt-text" data-tt="Shared HMAC secret (utf-8)">
            <span className="opt-select-lbl">Secret:</span>
            <input
              type="text"
              className="opt-text-input"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="HMAC secret"
              spellCheck={false}
            />
          </span>
        )}

        {verifyOn && verifyResult && (
          <span className={'verify-badge ' + (verifyResult.valid ? 'ok' : (verifyResult.supported === false ? 'warn' : 'bad'))}>
            {verifyResult.supported === false && `Verification not supported for ${decoded?.algorithm || 'this algorithm'}`}
            {verifyResult.supported !== false && (verifyResult.valid ? '✓ Signature valid' : '✗ Signature invalid')}
          </span>
        )}
      </div>

      <div className="samples">
        <span className="samples-lbl">Samples:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            className="sample"
            onClick={() => loadSample(s.text)}
            data-tt={s.tt}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={'body' + (showExplanations ? ' with-exp' : '')}>
        <div className={'panes ' + orientation}>
          <div className="pane">
            <div className="lbl">
              <span>JWT Input</span>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a JWT here — three base64url segments joined with dots"
              spellCheck={false}
            />
          </div>
          <div className="pane">
            <div className="lbl">
              <span>Decoded</span>
              <div className="lbl-actions">
                <button
                  className="btn-in-lbl"
                  onClick={handleCopy}
                  disabled={!copyText || !!error}
                  data-tt="Copy decoded header + payload as JSON"
                  data-tt-pos="above"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  className="btn-in-lbl muted"
                  onClick={handleDownload}
                  disabled={!copyText || !!error}
                  data-tt="Save as jwt-decoded.json"
                  data-tt-pos="above"
                >
                  Download
                </button>
              </div>
            </div>
            <div className={'out' + (error ? ' err' : '')}>
              {error && <div>{error}</div>}

              {!error && !decoded && (
                <span style={{ color: 'var(--text-input-placeholder)' }}>Decoded parts will appear here.</span>
              )}

              {!error && decoded && (
                <>
                  <div className="jwt-section header-sec">
                    <div className="jwt-hdr">Header</div>
                    <pre className="jwt-json">{JSON.stringify(decoded.header, null, 2)}</pre>
                  </div>

                  <div className="jwt-section payload-sec">
                    <div className="jwt-hdr">
                      Payload
                      {expStatus && (
                        <span className={'exp-badge ' + (expStatus.kind === 'expired' ? 'bad' : 'ok')}>
                          {expStatus.label} &middot; {expStatus.detail}
                        </span>
                      )}
                    </div>
                    <pre className="jwt-json">{JSON.stringify(decoded.payload, null, 2)}</pre>
                    {decoded.payload && (typeof decoded.payload.iat === 'number' || typeof decoded.payload.exp === 'number' || typeof decoded.payload.nbf === 'number') && (
                      <div className="claim-times">
                        {typeof decoded.payload.iat === 'number' && (
                          <div><span className="claim-key">iat</span> {fmtUnixTime(decoded.payload.iat)} <span className="claim-rel">({relativeTime(decoded.payload.iat)})</span></div>
                        )}
                        {typeof decoded.payload.nbf === 'number' && (
                          <div><span className="claim-key">nbf</span> {fmtUnixTime(decoded.payload.nbf)} <span className="claim-rel">({relativeTime(decoded.payload.nbf)})</span></div>
                        )}
                        {typeof decoded.payload.exp === 'number' && (
                          <div><span className="claim-key">exp</span> {fmtUnixTime(decoded.payload.exp)} <span className="claim-rel">({relativeTime(decoded.payload.exp)})</span></div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="jwt-section signature-sec">
                    <div className="jwt-hdr">Signature ({decoded.algorithm || 'unknown'})</div>
                    <div className="sig-line"><span className="sig-lbl">base64url</span> {decoded.signature.base64url}</div>
                    <div className="sig-line"><span className="sig-lbl">hex</span> {decoded.signature.hex}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {showExplanations && (
          <div className="exp">
            <div className="exp-hdr">About this tool</div>
            <div className="exp-body">{expContent}</div>
          </div>
        )}
      </div>

      <div className="stats">
        <span>Input: <b>{inBytes}</b> bytes</span>
        {decoded && <span>Algorithm: <b>{decoded.algorithm || 'unknown'}</b></span>}
        {decoded && <span>Claims: <b>{Object.keys(decoded.payload || {}).length}</b></span>}
        {error && <span style={{ color: 'var(--error)' }}>Error</span>}
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
          --header-accent: #ef4444;
          --payload-accent: #a855f7;
          --sig-accent: #0891b2;
          --ok-bg: #dcfce7;
          --ok-fg: #15803d;
          --bad-bg: #fee2e2;
          --bad-fg: #b91c1c;
          --warn-bg: #fef3c7;
          --warn-fg: #a16207;

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
          --header-accent: #f87171;
          --payload-accent: #c084fc;
          --sig-accent: #22d3ee;
          --ok-bg: rgba(34,197,94,0.15);
          --ok-fg: #4ade80;
          --bad-bg: rgba(248,113,113,0.15);
          --bad-fg: #f87171;
          --warn-bg: rgba(250,204,21,0.15);
          --warn-fg: #facc15;
          background: var(--bg);
        }

        .top-bar {
          padding: 12px 16px;
          background: var(--hdr-bg);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
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
          min-height: 40px;
        }
        .opt {
          display: flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: var(--text-label);
          font-weight: 600; cursor: pointer; user-select: none;
        }
        .opt input { margin: 0; accent-color: var(--primary); width: 14px; height: 14px; }
        .opt-text { display: inline-flex; align-items: center; gap: 8px; flex: 1; max-width: 400px; }
        .opt-select-lbl { font-size: 12px; color: var(--text-label); font-weight: 600; }
        .opt-text-input {
          flex: 1;
          padding: 5px 10px;
          font-size: 12.5px;
          font-family: ui-monospace, Menlo, monospace;
          color: var(--text);
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 4px;
          outline: none;
        }
        .opt-text-input:focus { border-color: var(--primary); }
        .verify-badge {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11.5px;
          font-weight: 700;
          font-family: ui-monospace, Menlo, monospace;
        }
        .verify-badge.ok { background: var(--ok-bg); color: var(--ok-fg); }
        .verify-badge.bad { background: var(--bad-bg); color: var(--bad-fg); }
        .verify-badge.warn { background: var(--warn-bg); color: var(--warn-fg); }

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

        .body {
          display: grid;
          flex: 1;
          min-height: 0;
          margin-top: 12px;
          grid-template-columns: 1fr;
        }
        .body.with-exp { grid-template-columns: minmax(0, 1fr) 300px; }

        .panes {
          display: grid;
          gap: 1px;
          background: var(--border);
          min-height: 400px;
        }
        .panes.horizontal { grid-template-columns: 1fr 1fr; }
        .panes.vertical { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }

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

        .jwt-section {
          border-left: 3px solid;
          padding: 10px 12px;
          margin-bottom: 12px;
          background: var(--surface-alt);
          border-radius: 0 4px 4px 0;
        }
        .jwt-section.header-sec { border-left-color: var(--header-accent); }
        .jwt-section.payload-sec { border-left-color: var(--payload-accent); }
        .jwt-section.signature-sec { border-left-color: var(--sig-accent); }
        .jwt-hdr {
          font-size: 10.5px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text-label);
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .jwt-json {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12.5px;
          line-height: 1.55;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          color: var(--text);
        }
        .exp-badge {
          font-family: ui-monospace, Menlo, monospace;
          font-weight: 600;
          font-size: 10.5px;
          padding: 2px 8px;
          border-radius: 3px;
          text-transform: none;
          letter-spacing: 0;
        }
        .exp-badge.ok { background: var(--ok-bg); color: var(--ok-fg); }
        .exp-badge.bad { background: var(--bad-bg); color: var(--bad-fg); }
        .claim-times {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed var(--border);
          font-family: ui-monospace, Menlo, monospace;
          font-size: 11.5px;
          color: var(--text-muted);
          line-height: 1.7;
        }
        .claim-key {
          color: var(--payload-accent);
          font-weight: 700;
          margin-right: 8px;
        }
        .claim-rel {
          color: var(--text-subtle);
          font-style: italic;
        }
        .sig-line {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
          word-break: break-all;
        }
        .sig-lbl {
          display: inline-block;
          width: 70px;
          color: var(--sig-accent);
          font-weight: 700;
          font-size: 10.5px;
          text-transform: uppercase;
        }

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
      `}</style>

      <style jsx global>{`
        [data-tt] { position: relative; }
        [data-tt]::after {
          content: attr(data-tt);
          position: absolute;
          top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          background: #0f172a; color: #ffffff;
          padding: 5px 10px; border-radius: 5px;
          font-size: 11px; font-weight: 500;
          font-family: -apple-system, "Segoe UI", system-ui, sans-serif;
          letter-spacing: 0.01em;
          white-space: nowrap; z-index: 100;
          pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease 0.35s;
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }
        [data-tt]::before {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-bottom-color: #0f172a;
          z-index: 100; pointer-events: none; opacity: 0;
          transition: opacity 0.12s ease 0.35s;
        }
        [data-tt]:hover::after, [data-tt]:hover::before { opacity: 1; }
        [data-tt-pos="above"]::after { top: auto; bottom: calc(100% + 8px); }
        [data-tt-pos="above"]::before {
          top: auto; bottom: 100%;
          border-bottom-color: transparent;
          border-top-color: #0f172a;
        }
      `}</style>
    </div>
  );
}