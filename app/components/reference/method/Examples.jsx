// app/components/reference/method/Examples.jsx
//
// Numbered examples — { title, code, returns } list, code left / result
// right. Pure render apart from the self-contained copy button.

import { useState } from 'react';
import { highlightPython } from '@/utils/code-highlight';

// Inline copy button — example-local helper, not exported.
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button type="button" className="copy" onClick={copy}>
      {copied ? 'Copied!' : 'Copy'}
      <style jsx>{`
        .copy { padding: 2px 8px; font-size: 10px; font-weight: 700; color: #1B50EE; background: #ffffff; border: 1px solid #C8D4F6; border-radius: 4px; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; }
        .copy:hover { background: #E8EEFB; }
      `}</style>
    </button>
  );
}

export default function Examples({ examples = [] }) {
  if (examples.length === 0) return null;
  return (
    <div>
      {examples.map((ex, i) => (
        <div className="example" key={ex.title}>
          <div className="example-hdr">
            <span>{i + 1}. {ex.title}</span>
            <CopyButton text={ex.code} />
          </div>
          <div className="example-body">
            <div className="example-code">
              {highlightPython(ex.code).map((t, j) =>
                t.cls ? <span key={j} className={t.cls}>{t.text}</span> : <span key={j}>{t.text}</span>
              )}
            </div>
            <div className="example-out">
              <div className="example-out-lbl">Returns</div>
              {ex.returns}
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .example { border: 1px solid #e4e4e7; border-radius: 6px; margin-bottom: 12px; overflow: hidden; }
        .example-hdr { padding: 10px 14px; background: #f8fafd; border-bottom: 1px solid #e4e4e7; font-size: 13px; font-weight: 700; color: #0f172a; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .example-body { display: grid; grid-template-columns: 1fr 1fr; }
        .example-code, .example-out { padding: 12px 14px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; line-height: 1.6; }
        .example-code { border-right: 1px solid #f1f5f9; white-space: pre-wrap; word-break: break-all; }
        .example-code :global(.kw) { color: #1B50EE; font-weight: 700; }
        .example-code :global(.str) { color: #4D74FF; }
        .example-code :global(.fn), .example-code :global(.bltn) { color: #f0abfc; }
        .example-code :global(.num) { color: #d97706; }
        .example-code :global(.com) { color: #94a3b8; }
        .example-out { background: #f8fafd; color: #16a34a; white-space: pre-wrap; }
        .example-out-lbl { font-size: 9.5px; font-weight: 800; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
        @media (max-width: 700px) {
          .example-body { grid-template-columns: 1fr; }
          .example-code { border-right: none; border-bottom: 1px solid #f1f5f9; }
        }
      `}</style>
    </div>
  );
}
