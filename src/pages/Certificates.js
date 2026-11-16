import { html, useState } from '../lib/core.js';
import { Cover, Head, Modal, Rv, Wrap } from '../components/ui.js';

export function Certificates({d}){const[o,so]=useState(null);return html`<${Wrap}><${Head} l="Certificates & achievements" t="Proof of learning, and the results that came with it."/><div class="grid sm:grid-cols-2 gap-5">${d.certificates.map((c,i)=>html`<${Rv} key=${c.id} d=${i*80}><div class="card p-3 cursor-pointer" onClick=${()=>c.image_url&&so(c.image_url)}><${Cover} it=${c}/><div class="p-3"><h3 class="font-semibold sand">${c.name}</h3><p class="text-sm mut mt-1">${c.description}</p></div></div><//>`)}</div>${o&&html`<${Modal} label="Certificate" wide="max-w-4xl" onClose=${()=>so(null)}><img src=${o} alt="" class="w-full rounded-lg"/><//>`}<//>`}
