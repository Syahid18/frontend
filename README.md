# Portfolio — Frontend (React + Vite + Tailwind)

Website publik (SPA, navigasi lewat `#hash`). Seluruh isi diambil dari backend: `GET {VITE_API_URL}/api/portfolio`.
Foto hero ada di `public/images/` (aset statis).

## Lokal

```bash
npm install
cp .env.example .env     # VITE_API_URL = alamat backend (bawaan http://localhost:8000)
npm run dev              # http://localhost:5173
```

Di `.env` backend, set `FRONTEND_URL=http://localhost:5173` agar CORS mengizinkan.

## Deploy ke Cloudflare Pages

1. Dashboard Cloudflare → **Workers & Pages** → **Create** → **Pages** → hubungkan repo Git.
2. Pengaturan build:
   - **Root directory**: `frontend` (jika repo berisi frontend dan backend sekaligus)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Settings → Variables and Secrets** (Production dan Preview): `VITE_API_URL=https://api.domain-anda.com`
   (tanpa `/` di akhir). Variabel ini ditanam saat build, jadi ubah nilainya = deploy ulang.
4. Setelah mendapat alamat (mis. `https://portfolio.pages.dev` atau domain sendiri), isi `FRONTEND_URL` di `.env` backend dengan alamat itu.

Alternatif tanpa Git: `npm run build && npx wrangler pages deploy dist`.

Karena memakai hash-routing (`#projects`, dst.), tidak perlu aturan SPA fallback/redirect.
