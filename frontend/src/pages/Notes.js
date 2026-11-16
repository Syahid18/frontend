import { html } from '../lib/core.js';
import { Head, Rv, Wrap } from '../components/ui.js';

export function Notes({ d }) {
    return html`<${Wrap}><${Head} l="Blog" t="Writing on design and code."/><div class="grid md:grid-cols-2 gap-5">${d.notes.map((n, i) => html`<${Rv} key=${n.id} d=${i * 80}><article class="card p-6 h-full"><div class="lbl mb-3">${n.tag}</div><h3 class="text-xl font-semibold sand">${n.title}</h3><p class="text-sm mut mt-3 leading-relaxed">${n.body}</p></article><//>`)}</div><//>`;
}
