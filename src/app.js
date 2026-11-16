import './app.css';
import { createRoot } from 'react-dom/client';

import { html, useEffect, useState } from './lib/core.js';
import { loadPortfolio } from './lib/api.js';
import { Site } from './Site.js';

// Isi website diambil dari backend (GET /api/portfolio) sebelum Site digambar.
function Root() {
    const [state, setState] = useState({ status: 'loading', data: null });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let alive = true;
        setState({ status: 'loading', data: null });
        loadPortfolio()
            .then((data) => alive && setState({ status: 'ready', data }))
            .catch(() => alive && setState({ status: 'error', data: null }));
        return () => { alive = false; };
    }, [attempt]);

    if (state.status === 'ready') {
        document.title = `${state.data.profile.name || 'Portfolio'} — UI/UX Designer`;
        return html`<${Site} d=${state.data}/>`;
    }

    return html`<div class="min-h-screen grid place-items-center px-6 text-center">
${state.status === 'loading'
    ? html`<div class="lbl" role="status">[ Loading portfolio… ]</div>`
    : html`<div class="grid gap-4 justify-items-center"><p class="lbl">[ Could not load the portfolio ]</p><p class="mut text-sm max-w-sm leading-relaxed">The server did not answer. Please check your connection and try again.</p><button class="btn" onClick=${() => setAttempt(attempt + 1)}>Try again</button></div>`}
</div>`;
}

createRoot(document.getElementById('root')).render(html`<${Root}/>`);
