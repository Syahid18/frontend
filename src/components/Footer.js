import { CV_URL, NAV, html, useEffect, useState } from '../lib/core.js';
import { Rv } from './ui.js';

export function Footer({d}){const p=d.profile;const[t,st]=useState('');
useEffect(()=>{const f=()=>{try{st(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Makassar',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()))}catch(e){}};f();const i=setInterval(f,1000);return()=>clearInterval(i)},[]);
const Col=({t,children})=>html`<div><div class="lbl mb-5">[ ${t} ]</div><ul class="grid gap-3">${children}</ul></div>`;
const L=([k,l])=>html`<li key=${k}><a class="fl" href=${'#'+k}>${l}</a></li>`;
return html`<footer class="np relative overflow-hidden mt-10" style=${{borderTop:'1px solid var(--line)'}}>
<div class="max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-24">
<${Rv}><div class="lbl mb-6">[ Next project ]</div><a href="#contact" class="group block"><h2 class="h2" style=${{fontSize:'clamp(2.4rem,7vw,6rem)'}}>Got a tangled idea?<br/>Let’s make it simple <span class="inline-block transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-2">↗</span></h2></a><//>
<div class="mt-8 flex flex-wrap gap-3"><a class="btn" href=${'mailto:'+p.email}>${p.email}</a>${p.has_cv&&html`<a class="btn2" href=${CV_URL} download>Download CV</a>`}</div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-10 mt-16 md:mt-24 pb-14">
<${Col} t="Pages">${NAV.slice(0,4).map(L)}<//>
<${Col} t="More">${NAV.slice(4).map(L)}${p.has_cv&&html`<li><a class="fl" href=${CV_URL} download>Download CV</a></li>`}<//>
<${Col} t="Elsewhere">${[['Email','mailto:'+p.email],['GitHub',p.github],['Instagram',p.instagram],['LinkedIn',p.linkedin],['Behance',p.behance]].map(([l,u])=>html`<li key=${l}><a class="fl" href=${u} target=${u.startsWith('http')?'_blank':undefined} rel="noopener">${l} ↗</a></li>`)}<//>
<div><div class="lbl mb-5">[ Local time ]</div><div class="text-3xl font-semibold sand tabular-nums"><span class="inline-block w-2 h-2 rounded-full animate-pulse mr-3 align-middle" style=${{background:'var(--sand)'}}></span>${t||'--:--:--'}</div><p class="text-sm mut mt-3 leading-relaxed">WITA · Banjarmasin,<br/>South Kalimantan</p></div></div>
<div class="flex flex-wrap justify-between items-center gap-3 py-6 text-xs mut" style=${{borderTop:'1px solid var(--line)'}}><span>© 2026 Syahid Mubarak · UI/UX Designer</span></div></div>
<${Rv}><div class="wm" aria-hidden="true">Syahid Mubarak</div><//></footer>`}
