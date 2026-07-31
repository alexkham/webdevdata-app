// app/components/reference/method/FAQ.jsx
//
// Expandable Q&A. Expand/collapse state lives here; first item starts open.

import { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function FAQ({ faq = [] }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (faq.length === 0) return null;
  return (
    <div>
      {faq.map((item, i) => {
        const open = openIdx === i;
        return (
          <div className={`faq ${open ? 'open' : ''}`} key={item.q}>
            <button
              type="button"
              className="faq-q"
              onClick={() => setOpenIdx(open ? -1 : i)}
              aria-expanded={open}
            >
              {item.q} <span className="chev">▾</span>
            </button>
            {open && (
              <div className="faq-a">
                <p>{item.a}</p>
                {item.code && <CodeBlock code={item.code} />}
              </div>
            )}
          </div>
        );
      })}
      <style jsx>{`
        .faq { border: 1px solid #e4e4e7; border-radius: 6px; margin-bottom: 8px; overflow: hidden; }
        .faq-q { width: 100%; text-align: left; padding: 12px 16px; background: #ffffff; cursor: pointer; font-size: 13.5px; font-weight: 700; color: #0f172a; display: flex; align-items: center; justify-content: space-between; border: none; }
        .faq-q:hover { background: #f8fafd; }
        .faq.open .faq-q { background: #f2f6fd; }
        .chev { color: #64748b; }
        .faq-a { padding: 12px 16px 16px; border-top: 1px solid #f1f5f9; background: #f8fafd; font-size: 13px; color: #334155; }
        .faq-a p { margin: 0 0 8px; }
        .faq-a p:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  );
}
