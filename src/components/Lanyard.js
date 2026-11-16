import { html, useEffect, useRef, useState } from '../lib/core.js';

/**
 * ID card on a rope. The rope is pinned to the top edge of this box, so putting the box
 * right under the hero makes the card hang from the bottom of the hero section.
 * Drag the card and let go: the rope is a small physics simulation.
 */
export function Lanyard({ photo, name, role, school, cls = '' }) {
    const box = useRef();
    const card = useRef();
    const s1 = useRef();
    const s2 = useRef();
    const [used, setUsed] = useState(false);

    useEffect(() => {
        const CW = 240; // card width
        const PV = 14;  // where the rope meets the card, measured from the card's top
        const AY = 0;   // rope anchor (top of the box)
        const o = box.current;
        const c = card.current;
        let N = 0, SEG = 24, L = 0, ax = 0, P = [], Q = [], drag = null, ang = 0, raf, last = 0, acc = 0;

        const geo = () => {
            ax = o.getBoundingClientRect().width / 2;
            if (!P.length) {
                L = o.getBoundingClientRect().width < 380 ? 130 : 160; // rope length
                N = Math.max(6, Math.min(36, Math.round(L / 22)));
                SEG = L / N;
                for (let i = 0; i <= N; i++) {
                    const p = [ax + 70 * i / N, AY + i * SEG];
                    P.push(p);
                    Q.push(p.slice());
                }
            }
        };
        const pos = (e) => {
            const r = o.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const down = (e) => {
            if (!P.length) return;
            const [x, y] = pos(e);
            drag = { ox: x - P[N][0], oy: y - P[N][1], x: P[N][0], y: P[N][1] };
            c.setPointerCapture(e.pointerId);
            c.style.cursor = 'grabbing';
            setUsed(true);
        };
        const move = (e) => {
            if (!drag) return;
            const [x, y] = pos(e);
            let tx = x - drag.ox - ax, ty = y - drag.oy - AY;
            const d = Math.hypot(tx, ty), M = L * 1.12;
            if (d > M) { tx *= M / d; ty *= M / d; }
            drag.x = ax + tx;
            drag.y = AY + ty;
        };
        const up = () => {
            drag = null;
            c.style.cursor = 'grab';
        };
        c.addEventListener('pointerdown', down);
        c.addEventListener('pointermove', move);
        c.addEventListener('pointerup', up);
        c.addEventListener('pointercancel', up);

        const sim = () => {
            for (let i = 1; i <= N; i++) {
                const p = P[i], q = Q[i];
                if (drag && i === N) { q[0] = p[0]; q[1] = p[1]; p[0] = drag.x; p[1] = drag.y; continue; }
                const vx = (p[0] - q[0]) * 0.986, vy = (p[1] - q[1]) * 0.986;
                q[0] = p[0]; q[1] = p[1];
                p[0] += vx; p[1] += vy + 0.85;
            }
            for (let k = 0; k < 12; k++) {
                P[0][0] = ax; P[0][1] = AY;
                for (let i = 0; i < N; i++) {
                    const a = P[i], q = P[i + 1];
                    const dx = q[0] - a[0], dy = q[1] - a[1], d = Math.hypot(dx, dy) || 1, f = (d - SEG) / d;
                    const wa = i ? 0.5 : 0, wb = (drag && i + 1 === N) ? 0 : (i ? 0.5 : 1), w = wa + wb;
                    a[0] += dx * f * wa / w; a[1] += dy * f * wa / w;
                    q[0] -= dx * f * wb / w; q[1] -= dy * f * wb / w;
                }
            }
        };
        const draw = () => {
            const t = P[N], pr = P[N - 3];
            const th = -Math.atan2(t[0] - pr[0], t[1] - pr[1]);
            ang += (th - ang) * 0.3;
            c.style.transform = 'translate(' + (t[0] - CW / 2) + 'px,' + (t[1] - PV) + 'px) rotate(' + ang + 'rad)';
            let d = 'M' + P[0][0] + ' ' + P[0][1];
            for (let i = 1; i < N; i++) d += ' Q' + P[i][0] + ' ' + P[i][1] + ' ' + (P[i][0] + P[i + 1][0]) / 2 + ' ' + (P[i][1] + P[i + 1][1]) / 2;
            d += ' L' + t[0] + ' ' + t[1];
            s1.current.setAttribute('d', d);
            s2.current.setAttribute('d', d);
        };
        const loop = (ts) => {
            acc += Math.min(ts - (last || ts), 64);
            last = ts;
            geo();
            if (P.length) {
                while (acc >= 16.67) { sim(); acc -= 16.67; }
                draw();
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            c.removeEventListener('pointerdown', down);
            c.removeEventListener('pointermove', move);
            c.removeEventListener('pointerup', up);
            c.removeEventListener('pointercancel', up);
        };
    }, []);

    return html`<div ref=${box} class=${'relative ' + cls} style=${{ height: '540px', pointerEvents: 'none' }}>
<span class="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full" style=${{ background: 'var(--sand)', boxShadow: '0 0 0 4px var(--bg)' }} aria-hidden="true"></span>
<svg class="absolute inset-0 w-full h-full" style=${{ overflow: 'visible' }} aria-hidden="true"><path ref=${s1} fill="none" stroke="var(--sand)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/><path ref=${s2} fill="none" stroke="var(--bg)" strokeWidth="14" strokeDasharray="1.5 9" opacity=".5"/></svg>
<div ref=${card} aria-label=${'ID card of ' + name} style=${{ position: 'absolute', left: 0, top: 0, width: '240px', height: '364px', transformOrigin: '120px 14px', touchAction: 'none', cursor: 'grab', willChange: 'transform', pointerEvents: 'auto' }}>
<div class="relative w-full h-full rounded-2xl overflow-hidden flex flex-col" style=${{ background: 'var(--sand)', color: 'var(--bg)', boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)' }}>
<div class="mx-auto mt-3 w-14 h-2.5 rounded-full flex-none" style=${{ background: 'var(--bg)' }}></div>
<div class="flex justify-between items-center px-4 pt-3 text-[.58rem] font-semibold tracking-[.16em]"><span>PORTFOLIO ID</span><i class="block w-2 h-2" style=${{ background: 'var(--bg)' }}></i></div>
<div class="mx-4 mt-3 rounded-xl overflow-hidden flex-none" style=${{ height: '184px', background: 'var(--bg)' }}><img src=${photo} alt=${name} draggable="false" class="w-full h-full object-cover object-top pointer-events-none"/></div>
<div class="px-4 pt-3 flex-1"><div class="fd text-xl font-bold leading-tight" style=${{ letterSpacing: '-.02em' }}>${name}</div><div class="text-[.72rem] font-semibold mt-1">${role}</div><div class="text-[.62rem] opacity-70 mt-0.5">${school}</div></div>
<div class="px-4 pb-4 flex justify-between items-end"><div><div class="text-[.5rem] opacity-60 tracking-widest">ID NO.</div><div class="text-[.7rem] font-semibold tabular-nums">SM-2026-UIUX</div></div><div class="h-7 w-20" style=${{ background: 'repeating-linear-gradient(90deg,var(--bg) 0 2px,transparent 2px 4px,var(--bg) 4px 5px,transparent 5px 8px,var(--bg) 8px 11px,transparent 11px 13px)' }}></div></div>
<div class="absolute inset-0 pointer-events-none" style=${{ background: 'linear-gradient(115deg,transparent 38%,rgba(255,255,255,.28) 50%,transparent 62%)' }}></div></div>
<div class="absolute left-1/2 -translate-x-1/2 w-8 h-5 rounded-md" style=${{ top: '-3px', background: 'linear-gradient(#efe9d8,#8f8873)', border: '1px solid rgba(0,0,0,.35)' }}></div></div>
<span class="absolute bottom-0 inset-x-0 text-center lbl transition-opacity duration-500" style=${{ opacity: used ? 0 : 1 }}>[ Drag the card ]</span></div>`;
}
