# Comments Soft Delete — runnable starter

Minimal NestJS + Prisma + SQLite example. It demonstrates indexed comment lists, soft-hide, restore and soft-delete while retaining text for audit purposes. This is a standalone example, not a patch merged into another repository.

## Windows PowerShell
Run these commands inside the extracted folder that contains `package.json`:

```powershell
Copy-Item .env.example .env
npm install
npx prisma format
npx prisma generate
npx prisma migrate dev --name init
npm run build
npm run start:dev
```

Open `http://localhost:3000/api/comments?trackId=track-1`.

## Endpoints
- `GET /api/comments?trackId=track-1` — active comments only
- `POST /api/comments` — JSON body `{"trackId":"track-1","authorId":"user-1","text":"Hello"}`
- `PATCH /api/comments/COMMENT_ID/hide?moderatorId=mod-1` — soft-hide
- `PATCH /api/comments/COMMENT_ID/restore` — restore hidden comment
- `DELETE /api/comments/COMMENT_ID?moderatorId=mod-1` — soft-delete

Before exposing moderation routes publicly, add authentication/authorization. For production use, configure a production database and secrets.
