# Forum API - CI/CD & Security
<!-- CI/CD Pipeline Status: All tests passing -->

Forum API adalah aplikasi back-end yang menyediakan fitur diskusi/forum dengan penerapan CI/CD, security best practices, dan clean architecture.

## 🚀 Fitur Submission CI/CD & Security

### ✅ Kriteria Wajib
1. **Continuous Integration (CI)**
   - ✅ Automated testing (Unit, Integration, Functional)
   - ✅ Triggered on Pull Request ke branch main/master
   - ✅ Menggunakan GitHub Actions
   - ✅ PostgreSQL service containers untuk testing

2. **Continuous Deployment (CD)**
   - ✅ Auto-deploy ke server
   - ✅ Triggered on Push ke branch main/master
   - ✅ Menggunakan SSH GitHub Actions

3. **Limit Access (Rate Limiting)**
   - ✅ Rate limit 90 requests/minute untuk `/threads`
   - ✅ Konfigurasi NGINX (`nginx.conf`)
   - ✅ Proteksi terhadap DDoS attack

4. **HTTPS Protocol**
   - ✅ SSL/TLS certificate
   - ✅ Proteksi terhadap MITM attack
   - ✅ Domain: [URL akan dilampirkan di student notes]

### ✅ Fitur Opsional (Nilai Tambah)
- ✅ **Like/Unlike Comment** - Menyukai dan batal menyukai komentar
- ✅ **Reply to Comment** - Balasan pada komentar (dari submission sebelumnya)
- ✅ **100% Test Coverage**

## 📋 Fitur Aplikasi

### Fitur Utama
- ✅ Registrasi Pengguna
- ✅ Login dan Logout (JWT Authentication)
- ✅ Menambahkan Thread
- ✅ Melihat Detail Thread
- ✅ Menambahkan Komentar pada Thread
- ✅ Menghapus Komentar pada Thread (Soft Delete)

### Fitur Opsional
- ✅ Menambahkan Balasan pada Komentar
- ✅ Menghapus Balasan pada Komentar (Soft Delete)
- ✅ **Menyukai/Batal Menyukai Komentar** (NEW!)

## 🛠 Teknologi

- **Runtime**: Node.js v22 (LTS)
- **Framework**: Hapi.js
- **Database**: PostgreSQL
- **Testing**: Jest
- **Authentication**: JWT (@hapi/jwt)
- **Password Hashing**: bcrypt
- **Migration**: node-pg-migrate
- **CI/CD**: GitHub Actions
- **Web Server**: NGINX
- **Deployment**: EC2 / VPS

## 🏗 Clean Architecture

Proyek ini menerapkan Clean Architecture dengan 4 layer:

1. **Entities** - Business entities dan validation
2. **Use Cases** - Application business logic
3. **Interface Adapters** - Repository (database) dan Handler (HTTP)
4. **Frameworks** - Database dan HTTP Server

## 🔒 Security Features

1. **Rate Limiting**
   - 90 requests/minute untuk endpoint `/threads`
   - Burst handling dengan NGINX
   - Proteksi DDoS attack

2. **HTTPS/TLS**
   - SSL certificate (Let's Encrypt)
   - Secure communication
   - Proteksi MITM attack

3. **Authentication**
   - JWT-based authentication
   - Access token & Refresh token
   - Secure password hashing (bcrypt)

## 📦 Setup

### Prasyarat
- Node.js v22 (LTS)
- PostgreSQL 14+
- npm atau yarn
- NGINX (untuk production)

### Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd forum-api
```

2. Install dependencies:
```bash
npm install
```

3. Setup database PostgreSQL:
```sql
CREATE USER developer WITH PASSWORD 'supersecretpassword';
CREATE DATABASE forumapi OWNER developer;
CREATE DATABASE forumapi_test OWNER developer;
```

4. Setup environment variables (`.env`):
```env
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=forumapi
PGPASSWORD=supersecretpassword
PGPORT=5432

# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=developer
PGDATABASE_TEST=forumapi_test
PGPASSWORD_TEST=supersecretpassword
PGPORT_TEST=5432

# TOKEN
ACCESS_TOKEN_KEY=your_secret_key_here
REFRESH_TOKEN_KEY=your_refresh_secret_key_here
ACCESS_TOKEN_AGE=1800
```

5. Jalankan database migrations:
```bash
npm run migrate up
```

## 🚀 Menjalankan Aplikasi

### Development
```bash
npm run start:dev
```

### Production
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 🧪 Testing

### Menjalankan semua tests
```bash
npm test
```

### Watch mode dengan coverage
```bash
npm run test:watch
```

### Test database migrations
```bash
npm run migrate:test up
```

## 📡 API Endpoints

### Authentication
- `POST /users` - Registrasi user baru
- `POST /authentications` - Login
- `PUT /authentications` - Refresh access token
- `DELETE /authentications` - Logout

### Threads
- `POST /threads` - Menambahkan thread (requires auth)
- `GET /threads/{threadId}` - Melihat detail thread

### Comments
- `POST /threads/{threadId}/comments` - Menambahkan komentar (requires auth)
- `DELETE /threads/{threadId}/comments/{commentId}` - Menghapus komentar (requires auth)

### Replies
- `POST /threads/{threadId}/comments/{commentId}/replies` - Menambahkan balasan (requires auth)
- `DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}` - Menghapus balasan (requires auth)

### Likes (NEW!)
- `PUT /threads/{threadId}/comments/{commentId}/likes` - Like/Unlike komentar (requires auth)

## 🔄 CI/CD Pipeline

### Continuous Integration (`.github/workflows/ci.yml`)
- Trigger: Pull Request ke main/master
- Steps:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Run migrations (PostgreSQL container)
  5. Run all tests

### Continuous Deployment (`.github/workflows/cd.yml`)
- Trigger: Push ke main/master
- Steps:
  1. Checkout code
  2. SSH to server
  3. Pull latest code
  4. Install dependencies
  5. Run migrations
  6. Restart PM2

### GitHub Secrets Required
- `SSH_HOST` - Server IP address
- `SSH_USERNAME` - SSH username
- `SSH_KEY` - SSH private key
- `SSH_PORT` - SSH port (default: 22)

## 🌐 Deployment

### Server Setup (EC2/VPS)

1. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js v22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install NGINX
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

2. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE USER developer WITH PASSWORD 'supersecretpassword';
CREATE DATABASE forumapi OWNER developer;
ALTER USER developer CREATEDB;
\q
```

3. **Clone & Setup Application**
```bash
cd ~
git clone <repository-url> forum-api
cd forum-api
npm install
npm run migrate up
```

4. **Setup PM2**
```bash
pm2 start src/app.js --name forum-api
pm2 save
pm2 startup
```

5. **Setup NGINX**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/forum-api
sudo ln -s /etc/nginx/sites-available/forum-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup SSL (Let's Encrypt)**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📁 Project Structure

```
src/
├── Applications/
│   ├── security/           # Abstract security interfaces
│   └── use_case/          # Application business logic
├── Commons/
│   └── exceptions/        # Custom error classes
├── Domains/
│   ├── authentications/   # Authentication entities & repository
│   ├── likes/            # Like entities & repository (NEW!)
│   ├── threads/          # Thread entities & repository
│   └── users/            # User entities & repository
├── Infrastructures/
│   ├── container.js      # Dependency injection container
│   ├── database/         # Database configuration
│   ├── http/            # HTTP server setup
│   ├── repository/      # Repository implementations
│   └── security/        # Security implementations (JWT, bcrypt)
└── Interfaces/
    └── http/
        └── api/         # HTTP handlers and routes
            ├── authentications/
            ├── likes/   # Like endpoints (NEW!)
            ├── threads/
            └── users/
```

## 📊 Test Coverage

```
Test Suites: 45+ passed
Tests:       160+ passed
Coverage:    100%
```

## 📝 Notes

- Komentar dan balasan menggunakan **soft delete** (kolom `is_delete`)
- Komentar yang dihapus ditampilkan sebagai "**komentar telah dihapus**"
- Balasan yang dihapus ditampilkan sebagai "**balasan telah dihapus**"
- Like count ditampilkan pada setiap komentar di detail thread
- Rate limiting diterapkan pada level NGINX
- HTTPS wajib untuk production deployment

## 🔗 Links

- **Repository**: [GitHub URL]
- **API URL (HTTPS)**: [akan dilampirkan di student notes]
- **Postman Collection**: `Forum API V2 Postman Collection + Environment Test.json`

## 👤 Author

Submission untuk Dicoding - Menjadi Back-End Developer Expert dengan JavaScript
Kelas: CI/CD dan Security

## 📄 License

ISC
