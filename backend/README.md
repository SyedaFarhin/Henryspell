# Backend

Copy `.env.example` to `.env` and fill in real values.

Important env vars:
- MONGO_URI
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- FRONTEND_URL

Run locally:

npm install
npm run dev

Docker (local):

cd ..\infra
docker-compose up --build
