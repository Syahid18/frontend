import { createPortal, html, useEffect, useRef, useState } from '../lib/core.js';

export function useIn(){const r=useRef(),[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){s(true);o.disconnect()}},{threshold:.15});o.observe(r.current);return()=>o.disconnect()},[]);return[r,v]}
export function Rv({children,d=0,cls=''}){const[r,v]=useIn();return html`<div ref=${r} class=${'rv '+(v?'in ':'')+cls} style=${{transitionDelay:d+'ms'}}>${children}</div>`}
export function Words({t,cls}){const[r,v]=useIn();return html`<p ref=${r} class=${(v?'in ':'')+cls}>${t.split(' ').map((w,i)=>html`<span key=${i} class="wd" style=${{transitionDelay:i*45+'ms'}}>${w} </span>`)}</p>`}
export function Bar({n,v}){const[r,s]=useIn();return html`<div ref=${r} class="mb-5"><div class="flex justify-between text-sm mb-2"><span>${n}</span><span class="sand font-semibold">${v}%</span></div><div class="bar"><i style=${{width:s?v+'%':0}}></i></div></div>`}
export const Head=({l,t})=>html`<div class="mb-10 md:mb-14"><${Rv}><div class="lbl mb-4">[ ${l} ]</div><h1 class="h2 max-w-4xl">${t}</h1><//></div>`;
export const Wrap=({children})=>html`<section class="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-24">${children}</section>`;

export function Cover({it}){return html`<div class="cover">${it.image_url?html`<img src=${it.image_url} alt=${it.name}/>`:html`<div class="w-4/5 grid gap-2 opacity-70"><i class="block h-3 w-1/3 rounded-sm bg-[color:var(--sand)]"></i><i class="block h-14 rounded-sm border" style=${{borderColor:'var(--line)'}}></i><div class="grid grid-cols-3 gap-2"><i class="block h-8 rounded-sm border" style=${{borderColor:'var(--line)'}}></i><i class="block h-8 rounded-sm border" style=${{borderColor:'var(--line)'}}></i><i class="block h-8 rounded-sm border" style=${{borderColor:'var(--line)'}}></i></div></div>`}</div>`}

export function Bt({cls='',hi,d=0,children}){const mv=e=>{const t=e.currentTarget,r=t.getBoundingClientRect();t.style.setProperty('--mx',e.clientX-r.left+'px');t.style.setProperty('--my',e.clientY-r.top+'px')};return html`<${Rv} d=${d} cls=${'h-full '+cls}><div class=${'bt h-full '+(hi?'hi':'')} onMouseMove=${mv}>${children}</div><//>`}

/**
 * Pop-up window. It is drawn straight into <body>, so it always sits above the navbar and fills
 * the real screen, and it scrolls on its own: tall content can always be scrolled from top to bottom.
 * Closes with the Escape key or a click on the dark area.
 */
export function Modal({ onClose, label, wide = 'max-w-3xl', children }) {
    useEffect(() => {
        const root = document.documentElement;
        const prevOverflow = root.style.overflow;
        const prevPadding = document.body.style.paddingRight;
        const scrollbar = innerWidth - root.clientWidth;

        root.style.overflow = 'hidden'; // freeze the page behind the window
        if (scrollbar > 0) document.body.style.paddingRight = scrollbar + 'px'; // no sideways jump

        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        addEventListener('keydown', onKey);

        return () => {
            root.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPadding;
            removeEventListener('keydown', onKey);
        };
    }, []);

    return createPortal(
        html`<div class="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label=${label} onClick=${onClose}>
<div class="min-h-full flex items-start justify-center px-4 md:px-8" style=${{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 1.5rem)', paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 1.5rem)' }}>
<div class=${'w-full ' + wide} onClick=${(e) => e.stopPropagation()}>${children}</div></div></div>`,
        document.body,
    );
}
