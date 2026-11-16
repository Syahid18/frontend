import { CV_URL, NAV, html, useEffect, useState } from './lib/core.js';
import { Footer } from './components/Footer.js';
import { About } from './pages/About.js';
import { Skills } from './pages/Skills.js';
import { Projects } from './pages/Projects.js';
import { Experience } from './pages/Experience.js';
import { Certificates } from './pages/Certificates.js';
import { Testimonials } from './pages/Testimonials.js';
import { Notes } from './pages/Notes.js';
import { Contact } from './pages/Contact.js';

const PAGES = {
    about: About,
    skills: Skills,
    projects: Projects,
    experience: Experience,
    certs: Certificates,
    testi: Testimonials,
    blog: Notes,
    contact: Contact,
};

export function Site({ d }) {
    const [route, setRoute] = useState(() => location.hash.slice(1) || 'about');
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
    const [menu, setMenu] = useState(false);
    const [nav, setNav] = useState(false);
    const [top, setTop] = useState(false);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem('sm_theme', theme); } catch (e) { /* private mode */ }
    }, [theme]);

    useEffect(() => {
        const onHash = () => {
            setRoute(location.hash.slice(1) || 'about');
            setMenu(false);
            setNav(true);
            setTimeout(() => scrollTo(0, 0), 450);
        };
        const onScroll = () => setTop(scrollY > 500);
        addEventListener('hashchange', onHash);
        addEventListener('scroll', onScroll);
        return () => {
            removeEventListener('hashchange', onHash);
            removeEventListener('scroll', onScroll);
        };
    }, []);

    const P = PAGES[route] || About;

    return html`<div><header class="np sticky z-50 backdrop-blur-md" style=${{ top: 'env(safe-area-inset-top,0px)', background: 'color-mix(in srgb,var(--bg) 82%,transparent)', borderBottom: '1px solid var(--line)' }}><div class="max-w-6xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between gap-4">
<a href="#about" aria-label=${d.profile.name + ', home'} class="group flex items-center gap-3 text-[.8rem] leading-[1.15] tracking-[.18em] sand"><span class="sq flex-none transition-transform duration-500 group-hover:rotate-90" style=${{ width: '.85rem', height: '.85rem', margin: 0 }}></span><span><b class="font-semibold">SYAHID</b><br/>MUBARAK</span></a>
<nav class="hidden lg:flex items-center gap-0.5">${NAV.map(([k, l]) => html`<a key=${k} href=${'#' + k} class=${'nl ' + (route === k ? 'on' : '')}>${l}</a>`)}</nav>
<div class="flex items-center gap-2"><button class="btn2 px-3! py-2!" aria-label="Toggle theme" onClick=${() => setTheme(theme === 'dark' ? 'light' : 'dark')}>${theme === 'dark' ? '☀' : '☾'}<span class="hidden sm:inline">${theme === 'dark' ? ' Light' : ' Dark'}</span></button>${d.profile.has_cv && html`<a class="btn px-3! py-2!" href=${CV_URL} download aria-label="Download CV"><span aria-hidden="true">↓</span><span class="hidden sm:inline">Download CV</span><span class="sm:hidden">CV</span></a>`}<button class="btn lg:hidden px-3! py-2!" onClick=${() => setMenu(!menu)}>${menu ? 'Close' : 'Menu'}</button></div></div>
${menu && html`<div class="lg:hidden grid grid-cols-2 gap-1 px-5 pb-4">${NAV.map(([k, l]) => html`<a key=${k} href=${'#' + k} class=${'nl ' + (route === k ? 'on' : '')}>${l}</a>`)}</div>`}</header>
${nav && html`<div key=${route + 'c'} class="curtain"></div>`}
<main key=${route} class="page relative"><${P} d=${d}/></main>
<${Footer} d=${d}/>
${top && html`<button aria-label="Back to top" class="btn np fixed right-4 z-50 w-11 h-11 p-0! rounded-full! justify-center shadow-lg" style=${{ bottom: 'calc(1rem + env(safe-area-inset-bottom,0px))' }} onClick=${() => scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>`}</div>`;
}
