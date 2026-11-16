import { html, useState } from '../lib/core.js';
import { Cover, Head, Modal, Rv, Wrap } from '../components/ui.js';

// A link that turns into a disabled button when the admin left it empty or as "#".
const LinkBtn=({href,cls,children})=>href&&href.trim()!=='#'?html`<a class=${cls} href=${href} target="_blank" rel="noopener">${children}</a>`:html`<button type="button" class=${cls} disabled title="Not available yet">${children}</button>`;

export function Projects({d}){const[o,so]=useState(null);
const S=([t,v])=>v?html`<div key=${t} class="mb-5"><div class="lbl mb-2">[ ${t} ]</div><p class="text-sm leading-relaxed">${v}</p></div>`:null;
return html`<${Wrap}><${Head} l="Project gallery" t="Projects built around real problems."/>
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">${d.projects.map((x,i)=>html`<${Rv} key=${x.id} d=${i*80}><button onClick=${()=>so(x)} class="card p-3 text-left w-full block hover:-translate-y-1 transition-transform"><${Cover} it=${x}/><div class="p-3"><div class="lbl mb-2">${x.tag}</div><h3 class="text-lg font-semibold sand">${x.name}</h3><p class="text-sm mut mt-2">${x.description}</p><span class="sand text-xs font-semibold mt-4 inline-block">Preview project ↗</span></div></button><//>`)}</div>
${o&&html`<${Modal} label=${o.name} onClose=${()=>so(null)}><div class="p-6 md:p-8 rounded-2xl" style=${{background:'var(--bg)',border:'1px solid var(--line)'}}>
<div class="flex justify-between items-start gap-4 mb-5"><h2 class="h2" style=${{fontSize:'2rem'}}>${o.name}</h2><button class="btn2" onClick=${()=>so(null)}>Close</button></div><${Cover} it=${o}/><div class="mt-6">
${[['Description',o.description],['The problem',o.problem],['The goal',o.goal],['Technology',o.tech],['My role',o.role],['Features',o.features],['Process',o.process],['User feedback',o.feedback]].map(S)}
<div class="flex gap-3 mt-6"><${LinkBtn} cls="btn" href=${o.demo_url}>Live demo<//><${LinkBtn} cls="btn2" href=${o.github_url}>Source on GitHub<//></div></div></div><//>`}<//>`}
