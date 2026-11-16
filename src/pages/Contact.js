import { html, useState } from '../lib/core.js';
import { api } from '../lib/api.js';
import { Head, Wrap } from '../components/ui.js';

const RELATIONS = ['Teacher', 'Friend', 'User', 'Internship host'];
const BLANK = { name: '', relation: 'Friend', body: '' };

export function Contact({ d }) {
    const p = d.profile;
    const [f, setF] = useState(BLANK);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // Link text comes from the URLs set in the admin profile, so it always matches what was saved.
    const links = [
        ['Email', 'mailto:' + p.email, p.email],
        ['GitHub', p.github, p.github],
        ['Instagram', p.instagram, p.instagram],
        ['LinkedIn', p.linkedin, p.linkedin],
        ['Behance', p.behance, p.behance],
    ]
        .filter(([, u]) => u && u !== '#')
        .map(([k, u, t]) => [k, u, t === p.email ? t : t.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')]);

    const send = async (e) => {
        e.preventDefault();
        if (!f.name.trim() || !f.body.trim() || busy) return;
        setBusy(true);
        setError('');
        setSent(false);
        try {
            await api('/messages', { method: 'POST', body: f });
            setF(BLANK);
            setSent(true);
        } catch (x) {
            setError(Object.values(x.errors)[0]?.[0] || x.message);
        } finally {
            setBusy(false);
        }
    };

    return html`<${Wrap}><${Head} l="Contact" t="Let’s build something together."/><div class="grid md:grid-cols-2 gap-8"><div class="grid gap-3 content-start">${links.map(([k, u, t]) => html`<a key=${k} href=${u} class="card p-5 flex justify-between gap-4 hover:-translate-y-1 transition-transform"><span class="lbl shrink-0">${k}</span><span class="sand text-sm truncate text-right" title=${t}>${t} ↗</span></a>`)}</div>
<form onSubmit=${send} class="card p-6 grid gap-3"><div class="lbl">[ Impressions & message ]</div><input class="inp" placeholder="Your name" maxLength="100" value=${f.name} onChange=${(e) => setF({ ...f, name: e.target.value })}/><select class="inp" value=${f.relation} onChange=${(e) => setF({ ...f, relation: e.target.value })}>${RELATIONS.map((x) => html`<option key=${x} style=${{ color: '#000' }}>${x}</option>`)}</select><textarea class="inp" rows="4" maxLength="2000" placeholder="Share your impressions and message" value=${f.body} onChange=${(e) => setF({ ...f, body: e.target.value })}></textarea><button class="btn justify-center" disabled=${busy}>${busy ? 'Sending…' : 'Send message'}</button>${sent && html`<p class="sand text-sm">Thank you, your message has been sent.</p>`}${error && html`<p class="text-sm sand">${error}</p>`}</form></div><//>`;
}
