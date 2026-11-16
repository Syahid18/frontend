import { html } from '../lib/core.js';
import { Head, Rv, Wrap } from '../components/ui.js';

export function Experience({ d }) {
    return html`<${Wrap}><${Head} l="Experience" t="Where I’ve worked, competed and contributed."/><div class="border-l ml-2" style=${{ borderColor: 'var(--line)' }}>${d.experiences.map((x, i) => html`<${Rv} key=${x.id} d=${i * 80}><div class="relative pl-8 pb-10"><span class="sq absolute -left-[6px] top-1" style=${{ width: '11px', height: '11px' }}></span><div class="lbl mb-1">${x.kind}${x.period ? ' · ' + x.period : ''}</div><h3 class="text-xl font-semibold sand">${x.title}</h3><p class="text-sm mut mt-2 max-w-xl">${x.description}</p></div><//>`)}</div><//>`;
}
