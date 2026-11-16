import { API_URL } from './config.js';

// Pembungkus fetch ke backend Laravel. Backend dan frontend beda domain, jadi:
//  - tidak ada cookie / CSRF (route API di backend stateless),
//  - header dibuat minimal supaya preflight CORS tetap sederhana.

/**
 * @param {string} path  mis. '/messages' (awalan /api ditambahkan di sini)
 * @param {{method?: string, body?: object}} [options]
 */
export async function api(path, { method = 'GET', body } = {}) {
    const headers = { Accept: 'application/json' };
    let payload;
    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        payload = JSON.stringify(body);
    }

    let res;
    try {
        res = await fetch(`${API_URL}/api${path}`, { method, headers, body: payload });
    } catch (e) {
        const error = new Error('Cannot reach the server. Please check your connection and try again.');
        error.status = 0;
        error.errors = {};
        throw error;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            res.status === 429
                ? 'Too many attempts. Please wait a minute and try again.'
                : data?.message || 'Something went wrong. Please try again.';
        const error = new Error(message);
        error.status = res.status;
        error.errors = data?.errors || {};
        throw error;
    }

    return data;
}

/** Semua isi website (profil, proyek, skill, dst.) dalam satu permintaan. */
export const loadPortfolio = () => api('/portfolio');
