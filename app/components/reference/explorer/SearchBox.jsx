// app/components/reference/explorer/SearchBox.jsx
//
// Explorer search input. Controlled — parent owns the value. Global "/"
// keyboard shortcut focuses the input.

import { useEffect, useRef } from 'react';

export default function SearchBox({ value, onChange, placeholder }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        if (inputRef.current) inputRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="search">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <style jsx>{`
        .search { flex: 1; min-width: 240px; position: relative; }
        .search input { width: 100%; padding: 8px 12px 8px 34px; font-size: 13px; font-family: ui-monospace, Menlo, monospace; background: #ffffff; color: #0f172a; border: 1px solid #a3b0c6; border-radius: 5px; outline: none; }
        .search input:focus { border-color: #1B50EE; box-shadow: 0 0 0 3px rgba(27, 80, 238, 0.12); }
        .search::before { content: '/'; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-family: ui-monospace, Menlo, monospace; font-size: 14px; font-weight: 700; }
        @media (max-width: 720px) {
          .search { min-width: 100%; }
        }
      `}</style>
    </div>
  );
}
