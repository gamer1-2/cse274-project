# Veritas AI - Enterprise Fake Review Detection Platform

Veritas AI is a production-grade, microservices-based SaaS platform designed to detect fraudulent product reviews using state-of-the-art NLP models.

## 🏗️ System Architecture (Microservices)

The platform follows a layered microservices architecture:

1. **Frontend (React + Vite, simulating Next.js App Router)**
   - **Stack**: React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
   - **State**: Zustand (Auth/User state), TanStack Query (Data fetching)
   - **Visuals**: Recharts (Dashboard)

2. **Backend API (Node.js/Express)**
   - **Stack**: Express.js, TypeScript, Zod, JWT
   - **Architecture**: Layered (Routes → Controllers → Services → Repositories)
   - **Role**: Coordinates authentication, stores historical data, handles rate limiting.

3. **AI/ML Service (Python/FastAPI)**
   - **Stack**: FastAPI, Scikit-Learn / Transformers
   - **Role**: Runs NLP models (TF-IDF + Logistic Regression / BERT) to generate predictions and extract suspicious keywords.

4. **Databases**
   - **Primary Database**: PostgreSQL (Users, Reviews, Predictions)
   - **Cache/Rate Limiting**: Redis

## 📁 Monorepo Folder Structure

```
veritas-ai/
├── apps/
│   ├── web/                 # Frontend (Next.js / Vite React)
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI (shadcn)
│   │   │   ├── pages/       # Next.js Pages / React Router views
│   │   │   ├── store/       # Zustand stores
│   │   │   └── lib/         # Utility functions
│   │   └── package.json
│   │
│   ├── api/                 # Node.js Express Backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ml-service/          # Python FastAPI ML Service
│       ├── app/
│       │   ├── main.py
│       │   ├── models.py
│       │   └── Predictor.py
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/                # Shared internal packages
│   ├── ui/                  # Shared UI components
│   └── config/              # ESLint, TypeScript configs
│
├── docker-compose.yml
└── README.md
```

## 🗄️ Database Schema (PostgreSQL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    text TEXT NOT NULL,
    prediction VARCHAR(20) NOT NULL, -- 'real' or 'fake'
    confidence DECIMAL(5,4) NOT NULL,
    explanation TEXT,
    suspicious_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_prediction ON reviews(prediction);
```

## 🐳 Docker Setup

### docker-compose.yml
```yaml
version: '3.8'
services:
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://api:8080

  api:
    build: ./apps/api
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/veritas
      - ML_SERVICE_URL=http://ml-service:5000
    depends_on:
      - db
      - redis

  ml-service:
    build: ./apps/ml-service
    ports:
      - "5000:5000"

  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: veritas
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:alpine

volumes:
  pgdata:
```

## 🚀 CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Linter & Tests
        run: |
          npm run lint
          npm run test
          
      - name: Build Web App
        run: npm run build --workspace=apps/web
```

## 🌩️ Deployment Steps

1. **Frontend**: Connect Vercel to the GitHub repository, pointing the Root Directory to `apps/web`. Vercel will automatically detect Next.js/Vite and apply optimal build settings.
2. **Backend**: Provision an AWS EC2 instance or Render Web Service. Deploy `apps/api` using Docker or standard Node runtime. Ensure environment variables (DB URLs, JWT Secrets) are securely stored in a Secret Manager.
3. **ML Service**: Build the FastAPI Docker container and push it to AWS ECR. Deploy to AWS ECS or a dedicated EC2 instance with sufficient memory for transformer blocks.
4. **Database**: Provision a managed PostgreSQL instance using AWS RDS or Supabase for high availability and automated backups. Attach Redis via AWS ElastiCache for rate-limiting.
