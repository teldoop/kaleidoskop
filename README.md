# Aplikasi Kaleidoskop

Butuh Node 20.9+ (Next.js 16).

## 1. Supabase
1. Buat project di supabase.com.
2. **SQL Editor** → jalankan seluruh isi `supabase/schema.sql` (tabel `members` + `photos`, seed 249 anggota TIF, bucket `photos`).
3. **Authentication → Providers → Google**: aktifkan, isi Client ID/Secret dari Google Cloud Console
   (Authorized redirect URI di Google = `https://<project-ref>.supabase.co/auth/v1/callback`).
4. **Authentication → URL Configuration**: Site URL `http://localhost:3000`, tambahkan Redirect URL
   `http://localhost:3000/auth/callback` (dan URL produksi nanti).
5. **Project Settings → API Keys**: salin URL, anon/publishable key, dan service_role key.

## 2. Jalankan
```bash
cp .env.example .env.local   # isi 3 variabel
npm install
npm run dev                  # http://localhost:3000
```
Kamera hanya jalan di `localhost` atau HTTPS. `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di API route (server), jangan diberi prefix `NEXT_PUBLIC_`.
