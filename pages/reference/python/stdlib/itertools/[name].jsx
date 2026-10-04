// pages/reference/python/stdlib/itertools/[name].jsx
//
// Member pages of the itertools module: /reference/python/stdlib/itertools/<slug>.
// Data work lives in utils/stdlib-static (memberProps); this file renders
// the head, the h1/subtitle and the frame. Every module folder has the same
// file with its own MODULE constant.

import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import RefHead from '@/app/components/reference/frame/RefHead';
import ReferenceFrame from '@/app/components/reference/frame/ReferenceFrame';
import MethodHero from '@/app/components/reference/method/MethodHero';
import ExceptionHero from '@/app/components/reference/exception/ExceptionHero';
import { memberSections } from '@/app/components/reference/module/sections';
import { getModuleEmulator } from '@/utils/emulators-maps/python-stdlib-itertools';
import { memberPaths, memberProps } from '@/utils/stdlib-static';

const MODULE = 'itertools';

export async function getStaticPaths() {
  return { paths: memberPaths(MODULE), fallback: false };
}

export async function getStaticProps({ params }) {
  return memberProps(MODULE, params.name);
}

export default function ItertoolsMemberPage({ seoData, meta, method, chain, siblings, siblingsTitle, schemas }) {
  const emulator = getModuleEmulator(meta.slug);
  const sections = memberSections(meta, method, emulator);
  const rail = { tryInTool: method.tryInTool || [], officialDocs: method.officialDocs || null };

  return (
    <>
      <RefHead seoData={seoData} schemas={schemas} />
      <div className="ref-page">
        <Breadcrumb />
        <ReferenceFrame layout="sidebar" siblings={siblings} siblingsTitle={siblingsTitle} sections={sections} rail={rail}>
          <h1 className="ref-h1">{seoData.name}</h1>
          {seoData.subtitle && <p className="ref-sub">{seoData.subtitle}</p>}
          {meta.type === 'exception' ? <ExceptionHero method={method} chain={chain} /> : <MethodHero method={method} />}
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
