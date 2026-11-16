import { html } from '../lib/core.js';
import { Bar, Head, Rv, Wrap } from '../components/ui.js';

export function Skills({ d }) {
    const G = ({ t, a }) => html`<${Rv}><div class="card p-6 md:p-8"><div class="lbl mb-6">[ ${t} ]</div>${a.map((s) => html`<${Bar} key=${s.id} n=${s.name} v=${s.level}/>`)}</div><//>`;
    return html`<${Wrap}><${Head} l="Skills" t="The tools I use, and the habits behind them."/><div class="grid md:grid-cols-2 gap-5"><${G} t="Hard skills" a=${d.skills.hard}/><${G} t="Soft skills" a=${d.skills.soft}/></div><//>`;
}
