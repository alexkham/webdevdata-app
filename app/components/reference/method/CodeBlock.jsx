// app/components/reference/method/CodeBlock.jsx
//
// Dark Python code block with lightweight syntax highlighting.
// Reused by Patterns, Examples, Pitfalls and MethodDemo.

import { highlightPython } from '@/utils/code-highlight';

export default function CodeBlock({ code }) {
  const tokens = highlightPython(code);
  return (
    <pre className="code-block">
      {tokens.map((t, i) =>
        t.cls ? (
          <span key={i} className={t.cls}>{t.text}</span>
        ) : (
          <span key={i}>{t.text}</span>
        )
      )}
      <style jsx>{`
        .code-block { background: #0f172a; color: #d4dae5; border-radius: 5px; padding: 12px 14px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; line-height: 1.6; overflow-x: auto; margin: 0; white-space: pre; }
        .code-block :global(.kw) { color: #4D74FF; font-weight: 700; }
        .code-block :global(.str) { color: #86efac; }
        .code-block :global(.fn) { color: #f0abfc; }
        .code-block :global(.bltn) { color: #f0abfc; }
        .code-block :global(.com) { color: #94a3b8; }
        .code-block :global(.num) { color: #fde68a; }
      `}</style>
    </pre>
  );
}
