import { Fragment, html, useEffect, useRef, useState } from '../lib/core.js';
import { api } from '../lib/api.js';
import { Head, Rv, Wrap } from '../components/ui.js';

const BLANK = { name: '', label: 'Friend', quote: '', website: '' };
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// "Rina Putri" -> "RP"
const initials = (name) => {
    const w = name.replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/).filter(Boolean);
    return ((w[0]?.[0] || '?') + (w[1]?.[0] || '')).toUpperCase();
};

// Where the little window sits next to a pin (flips so it never leaves the canvas).
const place = (x, y) => ({
    ...(x > 55 ? { right: 100 - x + '%', marginRight: '14px' } : { left: x + '%', marginLeft: '14px' }),
    ...(y > 52 ? { bottom: 100 - y + '%', marginBottom: '6px' } : { top: y + '%', marginTop: '6px' }),
});

export function Testimonials({ d }) {
    const list = d.testimonials;
    const [mode, setMode] = useState('view'); // 'view' | 'comment'
    const [open, setOpen] = useState(null);   // id of the pin whose comment is showing
    const [draft, setDraft] = useState(null); // { x, y } (in %) of the pin being placed
    const [f, setF] = useState(BLANK);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const canvas = useRef();

    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            setOpen(null);
            setDraft(null);
            setMode('view');
        };
        addEventListener('keydown', onKey);
        return () => removeEventListener('keydown', onKey);
    }, []);

    const choose = (m) => {
        setMode(m);
        setDraft(null);
        setOpen(null);
        setError('');
        setSent(false);
    };

    const onCanvas = (e) => {
        if (e.target.closest('[data-keep]')) return; // clicks on a pin or a little window are theirs
        setOpen(null);
        if (mode !== 'comment') return;
        const r = canvas.current.getBoundingClientRect();
        setDraft({
            x: clamp(((e.clientX - r.left) / r.width) * 100, 4, 96),
            y: clamp(((e.clientY - r.top) / r.height) * 100, 12, 96),
        });
    };

    const showPin = (id) => {
        setMode('view');
        setDraft(null);
        setOpen(id);
        canvas.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (busy || !draft) return;
        setBusy(true);
        setError('');
        try {
            await api('/testimonials', { method: 'POST', body: { ...f, pos_x: draft.x, pos_y: draft.y } });
            setDraft(null);
            setMode('view');
            setF(BLANK);
            setSent(true);
        } catch (x) {
            setError(Object.values(x.errors)[0]?.[0] || x.message);
        } finally {
            setBusy(false);
        }
    };

    const current = list.find((t) => t.id === open);
    const pos = (t) => [Number(t.pos_x ?? 50), Number(t.pos_y ?? 50)];
    const chip = (on) => 'cursor-pointer text-[.7rem] font-medium px-3 py-1.5 rounded-full border transition-colors ' + (on ? 'sand' : 'mut');

    return html`<${Wrap}><${Head} l="Testimonials" t="Leave a comment on my work."/>
<p class="mut text-sm -mt-6 mb-8 max-w-xl leading-relaxed">Friends, classmates and teachers: press <b class="sand">Add comment</b>, drop a pin anywhere on the frame and tell me what it is like to work with me. Comments show up here once I approve them.</p>
<${Rv}><div class="rounded-2xl overflow-hidden" style=${{ border: '1px solid var(--line)', background: 'linear-gradient(160deg,var(--bg2),transparent 70%)' }}>
<div class="flex flex-wrap items-center gap-3 px-5 py-3" style=${{ borderBottom: '1px solid var(--line)' }}><span class="flex gap-1.5">${[0, 1, 2].map((i) => html`<i key=${i} class="block w-2.5 h-2.5 rounded-full" style=${{ background: 'var(--line)' }}></i>`)}</span><span class="lbl">syahid-mubarak / testimonials · ${list.length} ${list.length === 1 ? 'comment' : 'comments'}</span>
<div class="flex gap-2 md:ml-auto"><button class=${chip(mode === 'view')} style=${{ borderColor: mode === 'view' ? 'var(--sand)' : 'var(--line)' }} onClick=${() => choose('view')}>View</button><button class=${chip(mode === 'comment')} style=${{ borderColor: mode === 'comment' ? 'var(--sand)' : 'var(--line)' }} onClick=${() => choose('comment')}>+ Add comment</button></div></div>
<div ref=${canvas} class=${'canvas relative h-[480px] md:h-auto md:aspect-[16/9] ' + (mode === 'comment' ? 'is-comment' : '')} onClick=${onCanvas}>
<span class="lbl absolute left-[7%] top-[4%] pointer-events-none">[ Frame 1 · Portfolio v2 ]</span>
<div class="absolute inset-x-[7%] top-[13%] bottom-[8%] rounded-lg p-4 md:p-6 pointer-events-none" style=${{ border: '1px solid var(--line)', background: 'rgba(216,201,163,.03)' }}>
<div class="flex items-center gap-2 mb-5"><i class="block w-2 h-2 rounded-full" style=${{ background: 'var(--line)' }}></i><i class="block w-2 h-2 rounded-full" style=${{ background: 'var(--line)' }}></i><i class="block w-2 h-2 rounded-full" style=${{ background: 'var(--line)' }}></i><i class="block h-1.5 w-24 rounded-full ml-auto" style=${{ background: 'var(--line)' }}></i></div>
<i class="block h-5 w-3/5 rounded-md" style=${{ background: 'var(--line)' }}></i><i class="block h-5 w-2/5 rounded-md mt-2" style=${{ background: 'var(--line)' }}></i><i class="block h-2 w-1/2 rounded-full mt-5" style=${{ background: 'var(--line)' }}></i>
<div class="grid grid-cols-3 gap-3 mt-6">${[0, 1, 2].map((i) => html`<i key=${i} class="block h-16 md:h-24 rounded-md" style=${{ border: '1px solid var(--line)' }}></i>`)}</div></div>
${!list.length && mode !== 'comment' && html`<p class="absolute inset-x-0 top-1/2 text-center text-sm mut pointer-events-none">No comments yet. Be the first to leave one.</p>`}
${mode === 'comment' && !draft && html`<span class="lbl card px-3 py-2 absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">Click anywhere on the frame to drop a pin</span>`}
${list.map((t, i) => { const [x, y] = pos(t); return html`<button key=${t.id} data-keep class=${'pin' + (open === t.id ? ' on' : '')} style=${{ left: x + '%', top: y + '%', animationDelay: i * 90 + 'ms' }} aria-label=${'Comment by ' + t.name} onClick=${(e) => { e.stopPropagation(); setDraft(null); setOpen(open === t.id ? null : t.id); }}>${initials(t.name)}</button>`; })}
${current && html`<div data-keep class="pop" style=${place(...pos(current))} role="dialog" aria-label=${'Comment by ' + current.name}><div class="flex items-center gap-3"><span class="av">${initials(current.name)}</span><div class="min-w-0"><div class="text-sm font-semibold sand truncate">${current.name}</div><div class="lbl">${current.label}</div></div><button class="ml-auto mut text-xl leading-none px-1" aria-label="Close comment" onClick=${() => setOpen(null)}>×</button></div><p class="text-sm leading-relaxed mt-3">${current.quote}</p></div>`}
${draft && html`<${DraftPin} draft=${draft} f=${f} setF=${setF} relations=${d.relations} busy=${busy} error=${error} submit=${submit} cancel=${() => choose('view')}/>`}
</div></div><//>
${sent && html`<p class="sand text-sm mt-4">Thank you! Your comment was sent. It will appear here once Syahid approves it.</p>`}
${list.length > 0 && html`<div class="lbl mt-12 mb-5">[ All comments · ${list.length} ]</div><div class="grid md:grid-cols-2 gap-4">${list.map((t, i) => html`<${Rv} key=${t.id} d=${i * 60}><button class="card p-5 text-left w-full h-full flex gap-4 items-start hover:-translate-y-1 transition-transform" onClick=${() => showPin(t.id)}><span class="av">${initials(t.name)}</span><span class="min-w-0"><span class="block text-sm leading-relaxed">“${t.quote}”</span><span class="block sand text-sm font-semibold mt-3">${t.name}</span><span class="block lbl mt-1">${t.label}</span></span></button><//>`)}</div>`}<//>`;
}

// The dashed pin you just dropped, plus the little form next to it.
function DraftPin({ draft, f, setF, relations, busy, error, submit, cancel }) {
    return html`<${Fragment}><span data-keep class="pin draft" style=${{ left: draft.x + '%', top: draft.y + '%' }}>+</span>
<form data-keep class="pop grid gap-3" style=${place(draft.x, draft.y)} onSubmit=${submit}><div class="lbl">[ New comment ]</div>
<input class="inp" placeholder="Your name" maxLength="100" required value=${f.name} onChange=${(e) => setF({ ...f, name: e.target.value })}/>
<select class="inp" value=${f.label} onChange=${(e) => setF({ ...f, label: e.target.value })}>${relations.map((r) => html`<option key=${r} style=${{ color: '#000' }}>${r}</option>`)}</select>
<textarea class="inp" rows="4" maxLength="500" required placeholder="What is it like to work with Syahid?" value=${f.quote} onChange=${(e) => setF({ ...f, quote: e.target.value })}></textarea>
<input name="website" tabIndex=${-1} autoComplete="off" aria-hidden="true" class="absolute -left-[9999px] opacity-0" value=${f.website} onChange=${(e) => setF({ ...f, website: e.target.value })}/>
${error && html`<p class="text-xs sand">${error}</p>`}
<div class="flex gap-2"><button class="btn" disabled=${busy}>${busy ? 'Sending…' : 'Post comment'}</button><button type="button" class="btn2" onClick=${cancel}>Cancel</button></div></form><//>`;
}
