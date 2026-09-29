// app/components/reference/module/sections.jsx
//
// Section lists for stdlib pages (the `sections` prop of ReferenceFrame):
// memberSections for a member page, hubSections for a module hub. Only the
// sections a page's content provides are included.

import SnippetDemo from '@/app/components/reference/snippet/SnippetDemo';
import Attributes from '@/app/components/reference/exception/Attributes';
import MemberGrid from '@/app/components/reference/module/MemberGrid';
import Parameters from '@/app/components/reference/method/Parameters';
import Patterns from '@/app/components/reference/method/Patterns';
import Examples from '@/app/components/reference/method/Examples';
import Pitfalls from '@/app/components/reference/method/Pitfalls';
import WhenToUse from '@/app/components/reference/method/WhenToUse';
import Notes from '@/app/components/reference/method/Notes';
import Related from '@/app/components/reference/method/Related';
import FAQ from '@/app/components/reference/method/FAQ';
import History from '@/app/components/reference/method/History';

function shared(method) {
  const out = [];
  if (method.patterns && method.patterns.length > 0) out.push({ id: 'patterns', label: 'Common patterns', count: null, content: <Patterns patterns={method.patterns} /> });
  if (method.examples && method.examples.length > 0) out.push({ id: 'examples', label: 'Examples', count: method.examples.length, content: <Examples examples={method.examples} /> });
  if (method.pitfalls && method.pitfalls.length > 0) out.push({ id: 'pitfalls', label: 'Pitfalls', count: method.pitfalls.length, content: <Pitfalls pitfalls={method.pitfalls} /> });
  if (method.when) out.push({ id: 'when', label: 'When to use', count: null, content: <WhenToUse when={method.when} /> });
  if (method.notes) out.push({ id: 'notes', label: 'Notes', count: null, content: <Notes notes={method.notes} /> });
  if (method.related && method.related.length > 0) out.push({ id: 'related', label: 'Related', count: null, content: <Related related={method.related} /> });
  if (method.faq && method.faq.length > 0) out.push({ id: 'faq', label: 'FAQ', count: method.faq.length, content: <FAQ faq={method.faq} /> });
  if (method.history && method.history.length > 0) out.push({ id: 'history', label: 'History', count: null, content: <History history={method.history} /> });
  return out;
}

export function memberSections(meta, method, emulator) {
  const out = [];
  if (meta.hasLiveDemo && emulator) {
    out.push({ id: 'demo', label: 'Demo', count: null, content: <SnippetDemo modes={method.modes} emulator={emulator} explainer={method.demoExplainer} /> });
  }
  if (method.parameters && method.parameters.length > 0) {
    out.push({ id: 'params', label: 'Parameters', count: null, content: <Parameters parameters={method.parameters} returns={method.returns} /> });
  }
  if (method.attributes && method.attributes.length > 0) {
    out.push({ id: 'attributes', label: 'Attributes', count: null, content: <Attributes attributes={method.attributes} /> });
  }
  return [...out, ...shared(method)];
}

export function hubSections(meta, method, emulator, groups) {
  const out = [];
  if (meta.hasLiveDemo && emulator) {
    out.push({ id: 'demo', label: 'Demo', count: null, content: <SnippetDemo modes={method.modes} emulator={emulator} explainer={method.demoExplainer} /> });
  }
  const n = groups.reduce((k, g) => k + g.items.length, 0);
  if (n > 0) out.push({ id: 'members', label: 'Members', count: n, content: <MemberGrid groups={groups} /> });
  return [...out, ...shared(method)];
}
