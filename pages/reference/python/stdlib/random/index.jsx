// pages/reference/python/stdlib/random/index.jsx
//
// Module hub: /reference/python/stdlib/random — import forms, a composed
// live demo, the member grid and the module-level sections. Data work
// lives in utils/stdlib-static (moduleHubProps). Every module folder has
// the same file with its own MODULE constant.

import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import RefHead from '@/app/components/reference/frame/RefHead';
import ReferenceFrame from '@/app/components/reference/frame/ReferenceFrame';
import ModuleHero from '@/app/components/reference/module/ModuleHero';
import { hubSections } from '@/app/components/reference/module/sections';
import { getModuleEmulator } from '@/utils/emulators-maps/python-stdlib-random';
import { moduleHubProps } from '@/utils/stdlib-static';

const MODULE = 'random';

export async function getStaticProps() {
  return moduleHubProps(MODULE);
}

export default function RandomModulePage({ seoData, meta, method, groups, siblings, siblingsTitle, schemas }) {
  const emulator = getModuleEmulator('index');
  const sections = hubSections(meta, method, emulator, groups);
  const rail = { tryInTool: method.tryInTool || [], officialDocs: method.officialDocs || null };

  return (
    <>
      <RefHead seoData={seoData} schemas={schemas} ogType="website" />
      <div className="ref-page">
        <Breadcrumb />
        <ReferenceFrame layout="sidebar" siblings={siblings} siblingsTitle={siblingsTitle} sections={sections} rail={rail}>
          <h1 className="ref-h1">{seoData.name}</h1>
          {seoData.subtitle && <p className="ref-sub">{seoData.subtitle}</p>}
          <ModuleHero method={method} />
        </ReferenceFrame>
      </div>
      <style jsx>{`
        .ref-page { max-width: 1280px; margin: 0 auto; padding: 84px 24px 80px; }
        .ref-h1 { font-size: 30px; font-weight: 800; color: #1B50EE; letter-spacing: -0.02em; margin: 0 0 4px; font-family: ui-monospace, Menlo, monospace; }
        .ref-sub { color: #475569; font-size: 15px; margin: 0 0 14px; }
      `}</style>
    </>
  );
}
