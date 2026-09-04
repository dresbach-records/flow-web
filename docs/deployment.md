# Deploy

O frontend usa `pnpm build` e está configurado para Vercel como aplicação Vite SPA. O backend possui build TypeScript próprio e requer `DATABASE_URL`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET` e `CORS_ORIGIN`; consulte `backend/.env.example`.
