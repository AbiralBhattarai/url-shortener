# URL Shortener App

A full-stack URL shortener built with **Django REST Framework** (backend) and **React + Vite** (frontend).  
Features include:  
- Shorten long URLs with a unique alias  
- Rate limiting per IP (using Redis for caching)  
- Analytics: view click counts and daily trends for each short URL  
- Responsive, modern UI

---

## Features

- **Shorten URLs:** Paste a long URL and get a short one instantly.
- **Rate Limiting:** Prevents abuse by limiting requests per IP (Redis-backed).
- **Analytics:** See click counts and a 7-day chart for each short URL.
- **Pagination:** Browse all your shortened URLs.
- **Copy to Clipboard:** Easily copy your short URL.
- **Modern UI:** Built with React, Vite, and Tailwind CSS.

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+ & npm**
- **Docker** (for Redis)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AbiralBhattarai/url-shortener.git
cd url-short
```

### 2. Start Redis with Docker

```bash
docker run --name django-redis -d -p 6379:6379 --rm redis
```

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# If requirements.txt is missing, install:
# pip install django djangorestframework django-redis django-cors-headers python-dotenv
cp .env.example .env  # Edit .env with your secrets if needed
python manage.py migrate
python manage.py runserver
```

### 4. Frontend Setup

```bash
cd ../frontend/url-short
npm install
cp .env.example .env  # Edit VITE_API_BASE_URL if needed
npm run dev
```

- The frontend runs on [http://localhost:5173](http://localhost:5173)
- The backend runs on [http://localhost:8000](http://localhost:8000)

---

## Environment Variables

### Backend (`backend/.env`)
```
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
REDIS_URL=redis://127.0.0.1:6379/0
```

### Frontend (`frontend/url-short/.env`)
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## Usage

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Paste a long URL and click "Shorten URL".
3. Copy the generated short URL and share it.
4. View analytics for each URL by clicking the analytics button in the list.

---

## Notes

- **Redis** is required for rate limiting. Make sure the Docker container is running.

---