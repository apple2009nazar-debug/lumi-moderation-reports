# Comments Soft Delete runnable starter

This is a minimal standalone NestJS + Prisma example (SQLite). It is not a patch against your existing repository.

PowerShell:
```powershell
Copy-Item .env.example .env
npm install
npx prisma format
npx prisma generate
npx prisma migrate dev --name init
npm run build
npm run start:dev
```

API: `GET http://localhost:3000/api/comments?trackId=track-1`. The moderation routes are examples; secure them with authentication/authorization before production use.
