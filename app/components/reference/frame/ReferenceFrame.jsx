// app/components/reference/frame/ReferenceFrame.jsx
//
// Thin frame router for reference pages — analog of ToolFrame.
// Reads the `layout` prop and delegates everything to a layout component.
//
//   layout    'sidebar' (default) → ClassicReferenceLayout — one long page,
//             "On this page" anchor rail with scrollspy.
//             'tabs' → TabbedReferenceLayout — sticky tab bar, one section
//             visible at a time, sibling rail on the left.
//
//   siblings       [{ slug, title, href, active }] — sibling method links
//   siblingsTitle  heading for the sibling list (e.g. "String methods")
//   sections       [{ id, label, count, content }] — the page sections
//   rail           { tryInTool: [{name, href, meta}], officialDocs: {label, href, meta} }
//   children       hero content, always visible above the sections

import ClassicReferenceLayout from './ClassicReferenceLayout';
import TabbedReferenceLayout from './TabbedReferenceLayout';

export default function ReferenceFrame({
  layout = 'sidebar',
  siblings = [],
  siblingsTitle = 'Related pages',
  sections = [],
  rail = null,
  children,
}) {
  const Layout = layout === 'tabs' ? TabbedReferenceLayout : ClassicReferenceLayout;
  return (
    <Layout siblings={siblings} siblingsTitle={siblingsTitle} sections={sections} rail={rail}>
      {children}
    </Layout>
  );
}
