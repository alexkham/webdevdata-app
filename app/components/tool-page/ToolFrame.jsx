// ToolFrame.jsx
// ─────────────────────────────────────────────────────────────
// Parent orchestrator. Picks a layout child based on `layout`
// and passes every other prop through untouched.
//
// Owns nothing visual — no CSS, no state, no observers. Layouts
// are self-contained; each one handles its own chrome, chevron,
// tooltips, and scroll behavior.
//
// The frame is a component. It does NOT emit <Head>, does NOT
// know about routes, does NOT emit JSON-LD. Page templates handle
// those concerns.
//
// Pages import ONLY this file:
//   import ToolFrame from '@/components/frames/ToolFrame';
//
//   <ToolFrame layout="classic" title="…" siblings={…} sections={…}>
//     <MyTool />
//   </ToolFrame>
//
// ── Shared props (understood by every layout) ─────────────────
//   layout          'classic' | 'workspace' | 'editorial'   default 'classic'
//   theme           'light'   | 'terminal'                  default 'light'
//   initialSidebar  'folded'  | 'expanded'                  default 'folded'
//
//   slug            string           — used to generate the head icon
//   category        string           — used for grouping + icon fallback
//   title           string
//   subtitle        string
//   symbol          string  optional — overrides the generated head icon
//
//   NOTE: ClassicLayout no longer accepts slug / category / title /
//   subtitle / symbol / breadcrumb. The page authors its own breadcrumb,
//   <h1>, and subtitle directly in its JSX (SEO belongs to the page).
//   The props above still apply to Workspace and Editorial layouts.
//
//   breadcrumb      [{ href, label }]
//   siblings        [{ slug, title, blurb, href, active, category }]
//   siblingGroups   [{ heading, items: [...siblings] }]  optional grouping
//   callout         { text, jumpTo, jumpLabel }
//   sections        [{ id, title, kind, content }]    below-fold, optional
//
//   children        the tool itself — the frame wraps it, observes it,
//                   and reads its DOM position, but never touches its
//                   internal state or URL.
//
// ── Layout-specific extras ────────────────────────────────────
//   ClassicLayout    referencePanel — optional ReactNode rendered
//                    beside the tool (C4-style side reference).
//   WorkspaceLayout  operations     — [{ id, label, group, symbol }]
//                                     tab-strip content; frame owns
//                                     active-tab state.
//   EditorialLayout  siblings       — used for both the pill strip
//                                     above the fold and the floating
//                                     rail that appears on scroll.
// ─────────────────────────────────────────────────────────────

import ClassicLayout   from './ClassicLayout';
import WorkspaceLayout from './WorkspaceLayout';
import EditorialLayout from './EditorialLayout';

export default function ToolFrame(props) {
  const { layout = 'classic', ...rest } = props;

  if (layout === 'workspace') return <WorkspaceLayout {...rest} />;
  if (layout === 'editorial') return <EditorialLayout {...rest} />;
  return <ClassicLayout {...rest} />;
}