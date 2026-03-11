# 🐇 Rabbitt AI — Sales Insight Automator

> Upload a quarterly sales CSV/Excel file → AI generates an executive summary → Delivered to your inbox instantly.

Built as part of the Rabbitt AI — AI Cloud DevOps Engineer assessment.

---

## 🚀 Live URLs

| Service | URL |
|---------|-----|
| Frontend | https://your-app.netlify.app |
| Backend API | https://your-api.onrender.com |
| Swagger Docs | https://your-api.onrender.com/docs |

---

## 🏃 Run Locally with Docker Compose

### 1. Clone the repo
\```bash
git clone https://github.com/YOUR_USERNAME/sales-insight-automator.git
cd sales-insight-automator
\```

### 2. Set up environment variables
\```bash
cp .env.example .env
# Fill in your real API keys in .env
\```

### 3. Start the full stack
\```bash
docker-compose up --build
\```

| Service | Local URL |
|---------|-----------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/docs |

### 4. Stop the stack
\```bash
docker-compose down
\```

---

## 🔐 Security Overview

| Layer | Implementation |
|-------|---------------|
| **Helmet.js** | Sets secure HTTP headers — XSS, clickjacking, MIME sniffing protection |
| **CORS** | Restricted to frontend origin only — no wildcard |
| **Rate Limiting** | 20 requests per IP per 15 minutes via express-rate-limit |
| **API Key Auth** | All /api routes require x-api-key header |
| **File Validation** | Extension whitelist (CSV/XLSX only), 5MB max size |
| **Email Validation** | Regex validation before any processing |
| **Non-root Docker** | Backend runs as unprivileged appuser |
| **Multi-stage Docker** | No dev dependencies in production image |
| **Secrets via ENV** | All keys injected via environment variables |

---

## 🗂️ Project Structure

```
sales-insight-automator/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── upload.js        # POST /api/upload endpoint
│   │   ├── services/
│   │   │   ├── groq.js          # Groq LLM summary generation
│   │   │   ├── mailer.js        # Resend email delivery
│   │   │   └── parser.js        # CSV/XLSX file parser
│   │   └── index.js             # Express app entry point
│   ├── .eslintrc.json
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main SPA component
│   │   └── index.js             # React entry point
│   ├── public/
│   │   └── index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18 |
| Backend | Node.js + Express |
| AI | Groq (Llama 3.3 70B) |
| Email | Resend |
| Docs | Swagger / OpenAPI 3.0 |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Netlify (frontend) + Render (backend) |

---

## 🔧 Environment Variables

\```env
GROQ_API_KEY=           # Groq API key
RESEND_API_KEY=         # Resend email service key
FROM_EMAIL=             # Sender email address
FRONTEND_URL=           # Allowed CORS origin
BACKEND_URL=            # Backend public URL
API_SECRET_KEY=         # API key for endpoint protection
PORT=                   # Backend port (default 5000)
\```

---

## 📧 How It Works

1. User uploads a CSV or XLSX sales file on the frontend
2. Backend validates the file and email address
3. File is parsed into structured text
4. Groq LLM generates a professional executive summary
5. Resend delivers the summary to the recipient inbox
6. User sees success confirmation with summary preview

---

## 👨‍💻 Author
Built with ❤️ for Rabbitt AI Engineering Assessment
```

---

## Final folder structure after adding all 4 files:
```
sales-insight-automator/
├── .github/
│   └── workflows/
│       └── ci.yml        ← new
├── backend/              ✅
├── frontend/             ✅
├── .env.example          ← new
├── .gitignore            ← new
├── docker-compose.yml    ✅
└── README.md             ← new
