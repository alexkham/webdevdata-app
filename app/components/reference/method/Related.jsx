// app/components/reference/method/Related.jsx
//
// Related-methods cards linking to sibling method pages. Pure render.
// `basePath` is the category URL the slugs live under.

export default function Related({ related = [], basePath = '/reference/python/functions' }) {
  if (related.length === 0) return null;
  return (
    <div className="related">
      {related.map((r) => (
        <a className="rel" key={r.slug} href={`${basePath}/${r.slug}`}>
          <div className="rel-name">{r.name}</div>
          <div className="rel-when">{r.when}</div>
        </a>
      ))}
      <style jsx>{`
        .related { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
        .rel { display: block; padding: 10px 12px; border: 1px solid #e4e4e7; border-radius: 5px; text-decoration: none; }
        .rel:hover { border-color: #C8D4F6; background: #f8fafd; }
        .rel-name { font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: #1B50EE; font-weight: 700; }
        .rel-when { font-size: 11.5px; color: #64748b; margin-top: 2px; }
        @media (max-width: 700px) {
          .related { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
