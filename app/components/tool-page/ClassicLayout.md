# ClassicLayout

Detailed reference for the `ClassicLayout` component (v5).

---

## What it is

`ClassicLayout` is one of three sibling layout components dispatched by `ToolFrame` (alongside `WorkspaceLayout` and `EditorialLayout`). It renders the "classic" tool-page shell: an optional left sibling rail, a main column with the tool region and an optional reference panel above the fold, and a TOC plus documentation sections below the fold.

`ClassicLayout` is a pure layout host. It:

- provides slots and arranges them on a grid
- owns its own presentational state (sidebar folded/expanded, active section, tooltip position)
- knows nothing about routing, SEO, tool internals, or data fetching

Concerns like the `<Head>` tag, page `<h1>`, breadcrumb, JSON-LD schema, and `getStaticProps` belong to the page that composes `ClassicLayout`.

---

## Import

**Via ToolFrame (recommended):**

```jsx
import ToolFrame from '@/app/components/tool-page/ToolFrame';

<ToolFrame layout="classic" {...props}>
  <MyTool />
</ToolFrame>
```

`ToolFrame` forwards every prop to `ClassicLayout` when `layout="classic"` (which is also the default).

**Direct:**

```jsx
import ClassicLayout from '@/app/components/tool-page/ClassicLayout';

<ClassicLayout {...props}>
  <MyTool />
</ClassicLayout>
```

Both are equivalent. Prefer `ToolFrame` in production so future layout switches are one-prop changes.

---

## Anatomy

The DOM structure `ClassicLayout` produces:

- **Root grid** — one column by default, two columns (`auto 1fr`) when siblings are provided
- **Skip link** — visually hidden until focused, jumps to the tool region
- **Left rail** — sticky, foldable, appears only when siblings are provided
  - Toggle row with chevron button
  - One or more sibling groups with items
- **Main column**
  - **Callout** — optional info banner at the top
  - **Above-fold area**
    - Tool region (contains `children`)
    - Reference panel on the side (when `referencePanel` is passed and `expandTool` is false)
  - **Reference panel below** — full-width block (when `referencePanel` is passed and `expandTool` is true)
  - **Below-fold area** — appears only when `sections` is non-empty
    - TOC rail (sticky, left of docs)
    - Doc body (contains one `<section>` per entry in `sections`)
- **Fixed tooltip layer** — appears on rail-item hover, positioned via `position: fixed`

---

## Props reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light'` \| `'terminal'` | `'light'` | Colour palette. `terminal` is a dark cold-blue variant. Purely repaints — no structural change. |
| `initialSidebar` | `'folded'` \| `'expanded'` | `'folded'` | Starting state of the left rail on first render. Auto-fold on scroll still overrides this unless the user clicks the chevron. |
| `expandTool` | `boolean` | `false` | Geometry switch. `false` = above-fold is 2-column, `referencePanel` sits to the right of the tool. `true` = tool takes full width, `referencePanel` (if passed) relocates to a full-width block between the tool and the below-fold sections. |
| `siblings` | `Array<SiblingItem>` | `[]` | Flat list of related-tool links for the left rail. Ignored if `siblingGroups` is passed. Empty = no rail rendered. |
| `siblingGroups` | `Array<SiblingGroup>` | `undefined` | Grouped version of `siblings` for section headings inside the rail. Takes precedence over `siblings` when present. |
| `callout` | `Callout` | `undefined` | Blue info banner above the tool. Omit to hide entirely. |
| `sections` | `Array<Section>` | `[]` | Below-fold content blocks. Each becomes a `<section>` with an `<h2>` and body. Empty = no below-fold at all. |
| `referencePanel` | `ReactNode` | `null` | Whatever you want in the reference slot — a card, a list, a dynamic component. Position is controlled by `expandTool`. `null` = slot not rendered in either position. |
| `children` | `ReactNode` | required | The tool itself. Rendered inside the bordered `.tool-region` container. The layout never touches its state or DOM. |

---

## Data shapes

### `SiblingItem`

```js
{
  slug:     string,   // React key, also used for icon selection
  title:    string,   // label + tooltip heading
  blurb:    string,   // tooltip body (optional but recommended)
  href:     string,   // link target
  active:   boolean,  // true = current tool (blue highlight + left bar)
  category: string,   // icon-selection fallback ('json', 'encoder', ...)
}
```

### `SiblingGroup`

```js
{
  heading: string | null,        // small-caps label above the group; hidden when rail folded
  items:   Array<SiblingItem>,
}
```

### `Callout`

```js
{
  text:      ReactNode,   // the main message
  jumpTo:    string,      // section id to anchor-link to (optional)
  jumpLabel: string,      // link text (optional; defaults to 'How to use ↓')
}
```

### `Section`

```js
{
  id:      string,      // unique, used for anchor + TOC + scroll-spy
  title:   string,      // rendered as <h2>, also shown in TOC
  kind:    string,      // appended as 'doc-{kind}' class for custom styling hooks (optional)
  content: ReactNode,   // section body
}
```

---

## Slots

`ClassicLayout` exposes two open slots (nothing else takes ReactNode content):

**`children` — the tool.** Wrapped in a bordered `.tool-region` container with rounded corners and a soft shadow. The layout observes its DOM position for the auto-fold behavior but never reads or mutates its state. Any tool must fit within this frame; the frame provides no internal padding — the tool is responsible for its own inner spacing.

**`referencePanel` — the reference content.** Whatever ReactNode is passed appears either to the right of the tool (default) or as a full-width block between the tool and the below-fold sections (when `expandTool` is `true`). Common contents: quick-reference cards, spec links, related-function lists. Static in most cases. For dynamic content that reacts to the tool state, own that state above `ClassicLayout` (in a parent component that composes it) — see the future notes at the bottom.

---

## Behavior

### Sibling rail — auto-fold on scroll

On mount, the rail respects `initialSidebar`. During scroll, a plain scroll listener checks the top position of the below-fold docs relative to the viewport:

- Docs above the midpoint of the viewport → rail folds
- Docs below the midpoint → rail expands

The chevron button in the toggle row lets the user override this. Once clicked, the auto-fold logic is disabled for the rest of the session (a ref, `manuallyToggled`, gates the effect).

### TOC — scroll-spy on sections

An `IntersectionObserver` watches each section element. When a section crosses the observer's threshold, its `id` becomes the active one, and the TOC anchor for that section receives the `.active` class (blue text, blue left border, filled background).

The observer uses `rootMargin: '-80px 0px -60% 0px'` so the "active" state fires when a section is comfortably in view, not the moment its top edge crosses the fold.

### Rail-item tooltips

Tooltips appear on hover and on keyboard focus of any rail item. A single tooltip element is rendered at the layout root using `position: fixed`, positioned via viewport coordinates captured on `mouseenter` / `focus`. This escapes both the rail item's own `overflow` behavior and the rail's scroll container.

- Touch devices (`hover: none`) skip tooltip rendering entirely to prevent flashing during scroll-taps.
- Tooltips auto-clear on scroll (the anchor rect moves; a lingering tooltip would appear detached).
- Tooltips have `pointer-events: none` — they don't interfere with mouse interactions.

### Responsive collapse

- Below **1160px**: side reference panel drops to a single column (stacks under the tool). Left rail remains.
- Below **900px**: below-fold collapses to a single column. TOC is hidden.
- Below **780px**: left rail is hidden entirely. Root becomes single-column.

---

## Usage patterns

### 1. Minimum — just a tool

No siblings, no docs, no reference. The layout renders only the tool region and the callout (if provided).

```jsx
<ToolFrame layout="classic">
  <MyTool />
</ToolFrame>
```

### 2. Standard — tool with siblings, callout, docs, and static reference

The common case for most tools.

```jsx
<ToolFrame
  layout="classic"
  siblings={JSON_SIBLINGS}
  callout={{
    text: <><strong>Paste JSON on the left.</strong> Output appears on the right.</>,
    jumpTo: 'how',
    jumpLabel: 'How to use ↓',
  }}
  sections={SECTIONS}
  referencePanel={<ReferenceCard />}
>
  <JsonFormatter />
</ToolFrame>
```

### 3. Expanded tool — reference relocates below

For tools that need horizontal space (side-by-side editors, wide visualizers, etc). The reference panel still renders — just as a full-width block between the tool and the below-fold sections.

```jsx
<ToolFrame
  layout="classic"
  expandTool={true}
  siblings={SIBLINGS}
  callout={CALLOUT}
  sections={SECTIONS}
  referencePanel={<ReferenceCard />}
>
  <WideTool />
</ToolFrame>
```

To hide the reference entirely, omit `referencePanel` (or pass `null`).

### 4. Grouped siblings

Use `siblingGroups` instead of `siblings` for section headings within the rail.

```jsx
<ToolFrame
  layout="classic"
  siblingGroups={[
    { heading: 'JSON tools',   items: JSON_TOOLS },
    { heading: 'Formatters',   items: FORMATTERS },
    { heading: 'Encoders',     items: ENCODERS },
  ]}
  sections={SECTIONS}
>
  <MyTool />
</ToolFrame>
```

Group headings are hidden when the rail is folded — icons remain, separated by a thin rule between groups.

### 5. Terminal theme

```jsx
<ToolFrame layout="classic" theme="terminal" {...props}>
  <MyTool />
</ToolFrame>
```

Only the palette changes. All layout, behavior, and prop semantics are identical.

### 6. Static vs dynamic reference panel

**Static:** pass a rendered ReactNode. The layout drops it into the slot as-is.

```jsx
referencePanel={<ReferenceCard />}
```

**Dynamic — reacts to tool state:** own the state above ClassicLayout, in a wrapping component. `ClassicLayout` itself has no coordination API and shouldn't grow one — its job is to render slots, not to broker state between them.

```jsx
function MyToolPage() {
  const [toolState, setToolState] = useState({});
  return (
    <ToolFrame
      layout="classic"
      referencePanel={<LiveExplanation state={toolState} />}
      {...props}
    >
      <MyTool onStateChange={setToolState} />
    </ToolFrame>
  );
}
```

Because pages are typically static (SSG + `getStaticProps`), this wrapping component usually lives outside `/pages` and is imported by the page. The page passes only static data; the wrapper adds the reactivity.

---

## What ClassicLayout does not do

Explicit non-responsibilities, to keep the boundary clean:

- **No `<Head>` or SEO tags.** The page emits its own meta title, meta description, canonical URL, and JSON-LD.
- **No page `<h1>` or subtitle.** The page authors these directly above `ToolFrame`. This keeps the SEO surface on the page where it belongs.
- **No breadcrumb.** Pages that want a breadcrumb render it above `ToolFrame`.
- **No tool state.** The layout does not read, control, or intercept anything the tool does internally.
- **No routing.** The layout does not know current URL, query params, or navigation events.
- **No data fetching.** All content passed to the layout is static ReactNode or plain data shapes.

---

## Sizing constants

Defined as CSS custom properties in the theme block:

| Variable | Light | Terminal | Purpose |
|---|---|---|---|
| `--site-header-h` | 52px | 40px | Sticky offset for rail and TOC |
| `--rail-w-open` | 240px | 240px | Rail width when expanded |
| `--rail-w-closed` | 56px | 52px | Rail width when folded |
| `--ref-w` | 340px | 340px | Reference panel column width |

Root `max-width` is `1700px`. Main column `padding` is `28px 40px 64px`.

---

## Accessibility notes

- **Skip link** at the top of the DOM, jumps to `#tool-region`. Visible only on focus.
- **Landmark regions** — `<aside aria-label="Related tools">` (rail), `<aside aria-label="Quick reference">` (ref panel), `<aside aria-label="On this page">` (TOC), `<main>` (content), `<nav>` (rail items list, TOC list).
- **Chevron button** has `aria-label` and `aria-expanded` states.
- **Tooltips** use `role="tooltip"`, are informational (not interactive), and `pointer-events: none`.
- **Section anchors** are usable as deep-link targets. `scroll-margin-top` accounts for the sticky header.
- **Focus-visible** outlines on the chevron and rail items respect keyboard navigation.

---

## Internal state

All internal, all reset on unmount. No global stores, no context, no imperative APIs.

| State | Purpose |
|---|---|
| `folded` | Whether the rail is currently folded. Driven by `initialSidebar`, then by the auto-fold scroll effect or manual chevron. |
| `activeSection` | The currently in-view below-fold section id. Driven by the `IntersectionObserver`. |
| `hoverTip` | `{ title, blurb, top, left }` for the currently hovered rail item's tooltip, or `null`. |
| `manuallyToggled` (ref) | Once true, disables auto-fold for the rest of the session. |

---

## Icon generation for the rail

The `generateIcon(category, slug)` helper produces short text glyphs for the rail (currently text like `{ }`, `%`, `#`, or arrows and Unicode symbols). Priority is:

1. Match specific patterns in the slug (`tree`, `sort`, `diff`, `base64`, `jwt`, `regex`, `timestamp`, etc.).
2. Fall back to a category-level default (`json`, `encoder`, `formatter`, `generator`, `converter`).
3. Fall back to a neutral middle-dot.

This is placeholder logic. When swapping to SVG icons later, replace this function and the `.sym` styling — no other changes required.

---

## Future steps

Not planned for immediate work. Documented so the next iteration has a starting point.

### 1. Layout variations within the Classic family

Small structural tweaks, not new components. Candidates:

- `tocSide = 'left' | 'right'` — flip the below-fold TOC to the right of the docs.
- `refSide = 'right' | 'left'` — flip the above-fold reference panel to the left of the tool.
- `calloutStyle = 'banner' | 'inline'` — inline reduces the callout to a thin line above the tool.

Each is one prop, a grid-column-order flip, and a small CSS block. Ships without changing any existing pages (all defaults preserved).

Larger structural changes (top sibling nav instead of left rail; reference merged into the tool region as tabs; hero layout with no sibling nav at all) are better handled as separate layout components dispatched by `ToolFrame` (`layout="classic-topnav"`, etc.) — not as props on `ClassicLayout`. Squeezing radically different DOMs into one component turns into conditional soup.

### 2. Color theme support beyond `light` and `terminal`

Currently the palette is chosen by a single `theme` prop with two values. To open this up:

- Extract the theme block into a data structure (`themes = { light: {...}, terminal: {...}, ... }`).
- Accept either a named theme (`theme="solar"`) or a full theme object (`theme={{ primary: '#...', border: '#...', ... }}`).
- Document the required set of CSS variable overrides.

Constraints to preserve:

- Every theme must define the same set of variables (fail loudly if incomplete).
- Contrast ratios for text on all surfaces must remain accessible.
- No hard-coded colors anywhere in the layout — all colors flow through `--*` CSS variables.

Non-goals for the theme system:

- Runtime user-chosen themes at the individual visitor level — that's a `data-theme` attribute on `<html>`, not a `ClassicLayout` prop.
- Full custom typography per theme — the layout uses one font family throughout by design.

### 3. Chrome / styling variants

Considered and parked (see `variant="v1" | "v2" | "v3"` discussion). Not worth building preemptively — one variant is what ships. If future tool families genuinely want visually distinct chrome (flat editorial vs framed app-like), revisit as a variant prop that swaps CSS variables. All variants would share the same JSX, same behavior, and same props; only the visual language changes.

---

## Companion documents

- `ToolFrame.jsx` — the dispatcher that picks between ClassicLayout, WorkspaceLayout, EditorialLayout.
- `WorkspaceLayout.jsx` — sibling layout for workspace-style tools with operation tabs.
- `EditorialLayout.jsx` — sibling layout for editorial / long-form tool pages.

---

## Version history

- **v5** — Added `expandTool` prop. When true, the tool takes full width and the reference panel relocates to a full-width block above the below-fold sections.
- **v4** — Tooltip fix. Rewrote per-item tooltip spans as a single fixed-position element at the layout root to escape overflow clipping in both folded and expanded rail states.
- **v3** — Cold-blue palette, stronger borders, rail-item hover translation. Root grid mirrors `CalculatorFrame` (no extra shell wrapper, explicit box-sizing, 1700px max-width).