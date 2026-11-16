// Alamat backend (Laravel). Diisi lewat environment variable saat build:
//   VITE_API_URL=https://api.domain-anda.com
// Tanpa garis miring di akhir. Saat `npm run dev`, bawaannya http://localhost:8000.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
