# WebDevData ToolFrame — System Documentation

Reference for the ToolFrame component system. Covers mental model, all props, layout selection, and how the seven demo patterns from the design phase map to the current API.

---

## 1. Mental model

The ToolFrame system is a **component**, not a page template. Everything visual — layout, styling, chevron state, sidebar behavior, TOC highlighting — lives inside the component. Everything meta — `<Head>`, JSON-LD, OG images, sitemap entries, routes, deep-link state — lives at the page level and never touches the frame.

### File shape

The system has four files. Only one of them is ever imported by pages.

```
components/frames/
├── ToolFrame.jsx         ← THE ONLY FILE PAGES IMPORT
├── ClassicLayout.jsx     ← internal
├── WorkspaceLayout.jsx   ← internal
└── EditorialLayout.jsx   ← internal
```

`ToolFrame` is the orchestration parent. It reads the `layout` prop and picks one of three children. Pages never touch the children directly.

### The three layouts

- **ClassicLayout** — the workhorse. Header, left rail with sibling tools, main column with breadcrumb, page head, callout, tool, optional side reference panel, and below-fold TOC + sections. Covers most tool pages. Also handles the terminal (dark) theme.
- **WorkspaceLayout** — the tabs pattern. Dark icon dock on the left with siblings, tab strip on top with operations, tool in the middle, docs strip below. Frame owns tab state. For tools with an obvious multi-operation shape like JSON Workspace.
- **EditorialLayout** — the article pattern. No left rail above the fold. Centered column with serif type, warm palette, horizontal sibling pill strip, and a floating rail that slides in from the left when you scroll past the tool. For pages that should read as content rather than as an app.

### The seven demo patterns

The design phase produced seven distinct visual/content patterns (B1, B2, B3, C1, C2, C3, C4). These consolidate into the three layouts via props:

| Demo | Layout          | Distinguishing prop or content |
| :--: | --------------- | ------------------------------ |
|  B1  | ClassicLayout   | Standard siblings + `referencePanel` used for cross-pillar links |
|  B2  | ClassicLayout   | `siblingGroups` populated for palette-style left rail, `referencePanel` used for docs TOC + language chips |
|  B3  | ClassicLayout   | Standard siblings + `referencePanel` used for "Convert to…" grid; `sections` written with numbered spec-style content |
|  C1  | EditorialLayout | Just use the layout — its own visual identity is the pattern |
|  C2  | WorkspaceLayout | `operations` populated for the tab strip |
|  C3  | ClassicLayout   | `theme="terminal"` |
|  C4  | ClassicLayout   | `referencePanel` populated with cards visible beside the tool |

Everything else is content, not architecture.

---

## 2. Quick start

The minimum viable ToolFrame usage:

```jsx
import ToolFrame from '@/components/frames/ToolFrame';

export default function JsonFormatterPage() {
  return (
    <ToolFrame
      slug="json-formatter"
      category="json"
      title="JSON Formatter"
      subtitle="Parse, validate, and pretty-print JSON."
    >
      <YourActualTool />
    </ToolFrame>
  );
}
```

That renders the default (Classic) layout with a page head, no callout, no siblings, no below-fold content. The tool takes the whole main column. Add siblings, a callout, and sections progressively as your content grows.

---

## 3. Shared props (every layout accepts these)

### Identity

- **`slug`** — string. Used to generate the head icon and (elsewhere in the site) for deep-linkable state. Never displayed as-is.
- **`category`** — string like `"json"`, `"encoder"`, `"formatter"`. Used for icon fallback when the slug alone doesn&apos;t give one, and shown in the rail-title mini-label.
- **`title`** — string. The H1.
- **`subtitle`** — string. Below the H1. Optional.
- **`symbol`** — string. Optional. Overrides the auto-generated head icon. Use when the generator picks something wrong for your tool.

### Chrome & structure

- **`breadcrumb`** — array of `{ href, label }`. The last item usually omits `href` (current page).
- **`callout`** — `{ text, jumpTo, jumpLabel }`. `text` is a React node. `jumpTo` is a section id in your `sections` array; it becomes a `#anchor` link labelled by `jumpLabel` (defaults per layout).
- **`sections`** — array of `{ id, title, kind, content }`. Below-fold docs. `content` is a React node. `kind` reserved for future renderers (`prose` is the default). Omit or pass `[]` to skip the below-fold entirely.

### Sibling navigation

- **`siblings`** — flat array of `{ slug, title, blurb, href, active, category }`. `blurb` shows in the tooltip when the rail is folded. `active` marks the current page.
- **`siblingGroups`** — optional grouping wrapper: `[{ heading, items: [...siblings] }]`. If provided, overrides `siblings`. Use for cross-family palette-style rails.

### Theme & behavior

- **`layout`** — `"classic" | "workspace" | "editorial"`. Default `"classic"`.
- **`theme`** — `"light" | "terminal"`. Default `"light"`. Terminal is honored by ClassicLayout; other layouts accept the prop but keep their own palette.
- **`initialSidebar`** — `"folded" | "expanded"`. Default `"folded"`. Meaning varies by layout — see per-layout section below.

### The tool itself

- **`children`** — the actual tool component. The frame wraps it, observes it for scroll-position (for auto-collapse and TOC highlight), and never touches its state or URL.

  **WorkspaceLayout accepts a render-function child** for tab-driven tools: `children={({ activeOp }) => <MyTool op={activeOp} />}`. Plain children also work.

---

## 4. Layout-specific props

### ClassicLayout extras

- **`referencePanel`** — a React node. When provided, renders as a right-side panel next to the tool region (C4 pattern). Also used by B1 and B3 to hold cross-pillar links, convert-to grids, and other side content. At viewports below 1160 px it stacks below the tool. Omit to give the tool full column width.

### WorkspaceLayout extras

- **`operations`** — array of `{ id, label, group, symbol }`. Populates the tab strip. `group` names a divider label like `"Read"`, `"Transform"`, `"Convert to"`. Order of items determines display order.
- **`activeOp`** — string. If provided (with `onOpChange`), the frame is controlled. Otherwise uncontrolled.
- **`defaultOp`** — string. Initial op in uncontrolled mode. Defaults to the first operation.
- **`onOpChange`** — `(opId) => void`. Called when a tab is clicked.

### EditorialLayout extras

None specific — it uses the shared `siblings` prop for both the horizontal pill strip above the tool and the floating rail that appears on scroll. `initialSidebar` on this layout controls the floating rail&apos;s expanded state (icons vs. icons + labels), not its visibility. Visibility is scroll-driven.

---

## 5. Behavior — details worth knowing

### Chevron & auto-collapse

Every layout has a manual chevron button that toggles the rail. Every layout also has an IntersectionObserver on the tool region.

- Rail starts in the state chosen by `initialSidebar` (default folded).
- When the tool leaves the viewport, the rail auto-folds.
- When the tool comes back, the rail auto-expands (or restores its `initialSidebar` default).
- **Once the user clicks the chevron, the auto-observer is disabled for the rest of the session.** Their explicit choice wins.
- The chevron is the same DOM element across states — it rotates via `transform: scaleX(-1)`. Keyboard focus survives toggling.

### Tooltips

- Rendered only inside the folded rail.
- Only visible at viewports ≥ 900 px.
- Below 900 px the rail hides entirely; nothing to tooltip.
- Content comes from each sibling&apos;s `blurb` field. Passing no `blurb` = no tooltip on that item.

### Icon generation

Icons are derived from `category` + `slug` by a pure function inside each layout file (`generateIcon(category, slug)`). Nothing is stored in data.

- Current fallback is text glyphs (`{ }`, `%`, `→`, etc.). Replace the function&apos;s internals with SVG components later without touching any props or data.
- Override for a specific page: pass the `symbol` prop.
- Override for a specific sibling: (not yet supported — add a `symbolOverride` field to sibling items if needed).

### TOC active-section highlighting

A second IntersectionObserver watches each `sections[]` entry. As sections cross the top of the viewport, the corresponding TOC link gains an `active` class. Works in every layout that has a below-fold TOC (all three).

Threshold values: `0.1` intersection ratio, `rootMargin: '-80px 0px -60% 0px'`. This makes a section &quot;active&quot; when its top has passed the sticky header and it hasn&apos;t yet scrolled two-thirds off the bottom.

### Terminal theme

- Applied by adding `theme-terminal` class on the ClassicLayout root.
- All colors are CSS custom properties. Terminal swaps them; the DOM structure is identical.
- WorkspaceLayout&apos;s dock is dark by design regardless of theme. EditorialLayout ignores theme (warm palette is its identity).

### Skip link

Every layout renders a `Skip to tool` link as the first focusable element. Visible when focused, hidden otherwise. Standard accessibility affordance; no config needed.

---

## 6. Pattern → API mapping

How to construct each of the seven demo patterns using the current API.

### B1 — Siblings + cross-pillar right rail

```jsx
<ToolFrame
  layout="classic"
  siblings={jsonFamilySiblings}
  referencePanel={<CrossPillarLinks reference={refs} learn={tutorials} />}
  sections={proseSections}
>
  <YourTool />
</ToolFrame>
```

The `referencePanel` slot holds the &quot;Reference&quot;, &quot;Learn&quot;, and &quot;Embed&quot; blocks that filled the right rail in the B1 demo. Layout stacks the panel below the tool at narrow widths.

### B2 — Palette-style left + docs TOC right

```jsx
<ToolFrame
  layout="classic"
  siblingGroups={fullToolPalette}
  referencePanel={<DocsToc sections={sections} tryInLanguages={langs} />}
  sections={proseSections}
>
  <YourTool />
</ToolFrame>
```

`siblingGroups` populates the left rail palette-style (cross-family groups). `referencePanel` holds the docs TOC + language chips.

### B3 — Siblings + convert-to right + spec-style sections

```jsx
<ToolFrame
  layout="classic"
  siblings={jsonFamilySiblings}
  referencePanel={<ConvertToGrid options={targets} />}
  sections={numberedSpecSections}
>
  <YourTool />
</ToolFrame>
```

Same left rail as B1. `referencePanel` holds the &quot;Convert this JSON to…&quot; grid. Sections are numbered (`&quot;1&quot;`, `&quot;2&quot;`, …) inside their `title` strings for the spec look.

### C1 — Editorial

```jsx
<ToolFrame
  layout="editorial"
  siblings={jsonFamilySiblings}
  callout={ledeCallout}
  sections={essaySections}
>
  <YourVerticalTool />
</ToolFrame>
```

No `referencePanel` — editorial doesn&apos;t have that slot. Siblings appear in the horizontal pill strip above the tool AND in the floating rail that slides in on scroll.

### C2 — Workspace / tabs

```jsx
<ToolFrame
  layout="workspace"
  siblings={otherToolsOnSite}
  operations={jsonOperations}
  defaultOp="format"
  sections={proseSections}
>
  {({ activeOp }) => <MyWorkspaceTool op={activeOp} />}
</ToolFrame>
```

`siblings` populates the dark icon dock. `operations` populates the tab strip. Render-function children pattern lets the tool read the active op.

### C3 — Terminal dark

```jsx
<ToolFrame
  layout="classic"
  theme="terminal"
  siblings={jsonFamilySiblings}
  sections={proseSections}
>
  <YourTerminalStyledTool />
</ToolFrame>
```

Just `theme=&quot;terminal&quot;`. The frame swaps to a dark palette; your tool component should also switch to dark styling to match.

### C4 — Docs beside tool

```jsx
<ToolFrame
  layout="classic"
  siblings={jsonFamilySiblings}
  referencePanel={<JsonReferenceCards />}
  sections={proseSections}
>
  <YourTool />
</ToolFrame>
```

Same shape as B1/B3. The distinction is *content*: C4&apos;s reference panel is dense technical reference (syntax cheatsheet, common errors, escape sequences) rather than cross-pillar navigation.

---

## 7. What the frame does NOT do

Named explicitly to avoid confusion.

- **No `<Head>` tags.** JSON-LD, `<title>`, `<meta>` — all page-level concerns.
- **No route awareness.** Frame doesn&apos;t know it&apos;s inside Next.js, doesn&apos;t call `useRouter`, doesn&apos;t import from `next/*`.
- **No URL manipulation.** Frame never mutates `window.location` or the browser history. Deep-link state is the tool&apos;s concern.
- **No JSON-LD injection.** `SoftwareApplication`, `FAQPage`, `BreadcrumbList` — all page-level.
- **No OG image generation.** Page-level.
- **No site header or site footer.** The frame renders the page content between them. `_app.jsx` or a page-level layout wrapper supplies the site chrome.
- **No sitemap awareness.** The build-time sitemap generator (`generate-sitemap.mjs` per the infrastructure doc) reads the file system, not the frame.
- **No tool state.** Input, output, options, deep-links — all owned by the `children` you pass in.

If you find yourself wanting to add any of the above to the frame, they belong to the page template instead.

---

## 8. Adding & customizing

### Adding a new sibling to an existing rail

Just add an entry to the `siblings` prop. The icon is derived automatically from `category` + `slug`.

```js
const jsonFamily = [
  { slug: 'json-formatter', title: 'Formatter', /* ... */ },
  { slug: 'json-schema',    title: 'Schema Validator',
    blurb: 'Validate against a JSON Schema.',
    href: '/json-schema', category: 'json' },
];
```

### Custom icon for one page

Pass `symbol`:

```jsx
<ToolFrame symbol="✎" title="Regex Tester" ...>
```

### Custom section renderer

Pass any React node as `content`. Sections don&apos;t constrain what you render:

```jsx
sections={[{
  id: 'schema',
  title: 'Schema',
  content: <MyRichSchemaViewer schema={mySchema} />,
}]}
```

### Custom below-fold layout

If the default TOC + sections structure doesn&apos;t fit, pass empty `sections` and render your own below-fold content as part of `children` (it&apos;ll appear inside the tool region, which is fine). The frame is a layout, not a straitjacket.

---

## 9. Gotchas & FAQ

**Q: Why doesn&apos;t my rail auto-collapse anymore?**  
A: You clicked the chevron. That was a manual signal, and the auto-observer respects it for the rest of the session. Refresh to restore.

**Q: I want tooltips on desktop but they never show up.**  
A: Tooltips only render when the rail is *folded*. Expanded rail = labels visible = no tooltip. If you want tooltips visible, start with `initialSidebar=&quot;folded&quot;`.

**Q: The referencePanel prop exists but nothing renders next to the tool.**  
A: Only ClassicLayout uses `referencePanel`. WorkspaceLayout and EditorialLayout ignore it (silently — no error). Check your `layout` prop.

**Q: My workspace tabs don&apos;t update anything.**  
A: The tab strip is display + state only. Your tool child has to actually read `activeOp` and render differently. Use render-function children:  
`children={({ activeOp }) => <MyTool op={activeOp} />}`

**Q: I&apos;m getting hydration warnings.**  
A: The chevron `folded` state initializes from the `initialSidebar` prop, which is the same on server and client. If you see hydration mismatch anyway, check whether your tool child does something SSR-unsafe (accessing `window` etc.). The frame itself is SSR-safe.

**Q: Terminal theme on WorkspaceLayout doesn&apos;t look dark.**  
A: WorkspaceLayout&apos;s dock is always dark; the main area follows its own palette regardless of `theme`. If you want a fully-dark workspace, style your tool child dark and accept that the tab strip stays light. A `theme=&quot;terminal&quot;` mode for WorkspaceLayout could be added; not built yet.

**Q: Can I have both a left rail and a horizontal sibling strip?**  
A: Not with the current layouts. Classic has a left rail, editorial has a horizontal strip, they don&apos;t mix. If you need both, build a page-level component that composes ClassicLayout with a horizontal strip inside its `children` slot before the tool.

**Q: How do I detect when the user has manually toggled the chevron?**  
A: You don&apos;t — the frame owns that state internally. If you need cross-page persistence (&quot;keep the rail collapsed on every tool page&quot;), that&apos;s a page-level concern: read from localStorage in `_app.jsx` and pass down `initialSidebar` accordingly.

**Q: My below-fold TOC shows nothing highlighted.**  
A: You probably have zero sections in view. The observer fires only when a section&apos;s top passes into the &quot;middle&quot; band of the viewport. Very short pages with all sections above the fold may never trigger highlighting; that&apos;s fine.

---

## 10. File index

| File | Role | Imported by pages? |
| ---- | ---- | :---: |
| `ToolFrame.jsx`         | Orchestrator. Picks a layout child.       | ✓ |
| `ClassicLayout.jsx`     | Default layout. B1 / B3 / C3 / C4.        |   |
| `WorkspaceLayout.jsx`   | Tabs pattern. C2.                          |   |
| `EditorialLayout.jsx`   | Article pattern. C1.                       |   |

Rule of thumb: pages `import ToolFrame from '@/components/frames/ToolFrame'`. Nothing else from that folder is a public API.