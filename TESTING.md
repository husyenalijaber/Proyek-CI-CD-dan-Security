# Forum API - CI/CD & Security

## 📦 Repository
https://github.com/dzakwanalifi/Proyek-CI-CD-dan-Security

## 🌐 Live API
**Base URL (HTTPS)**: `https://dicoding-aws-backend.tek.web.id`

**Alternative (HTTP)**: `http://43.157.243.10`

## 🧪 Testing dengan Postman

1. Import Postman Collection: `Forum API V2`
2. Set base URL: `https://dicoding-aws-backend.tek.web.id`
3. **PENTING**: Set **Delay** minimal **2000ms (2 detik)** saat menjalankan Collection Runner.
   - Karena rate limiting diset ke 30 request/menit (1 request per 2 detik).
   - Jika tanpa delay, test akan gagal karena terkena rate limit (HTTP 503).
4. Run collection secara berurutan

## ✅ Fitur
- User Registration & Authentication
- Thread Management
- Comment & Reply
- Like/Unlike Comment
- Rate Limiting (30 req/min)
- CI/CD with GitHub Actions
- **HTTPS with Cloudflare Tunnel**
