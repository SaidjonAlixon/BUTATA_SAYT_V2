# Vercel Deployment Guide (Express + TypeScript)

This project runs **pure Express** (no Next.js) on Vercel as serverless functions.

## Architecture

- **Vercel entry**: `api/index.js` (built from `script/api-index.ts`) — handles all `/api/*` routes except standalone handlers
- **Local dev**: `server/index.ts` — runs Express with `app.listen()` on port 5000
- **Production on Vercel**: No `app.listen()` — requests go through serverless handlers

## Environment Variables (Required for Upload)

| Variable | Description |
|----------|-------------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token (Project Settings → Storage) |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Session encryption key |
| `TELEGRAM_BOT_TOKEN` | (optional) For notifications |
| `TELEGRAM_CHAT_ID` | (optional) For notifications |

## Redeploy

```bash
# Build locally
npm run build

# Deploy (Vercel CLI)
vercel --prod

# Or push to connected Git branch
git push origin main
```

## Vercel Function Logs

1. **Dashboard**: Project → Deployments → select deployment → **Functions** tab
2. **Runtime logs**: Project → Logs → filter by function `api/index`
3. **CLI**:
   ```bash
   vercel logs <deployment-url> --follow
   ```

## Debugging 500 Errors

1. **Check BLOB_READ_WRITE_TOKEN**
   - Ensure it exists in Vercel: Project → Settings → Environment Variables
   - Redeploy after adding/updating variables

2. **Check function logs**
   - Look for `[upload]` prefix messages
   - `BLOB_READ_WRITE_TOKEN is not configured` → add token and redeploy

3. **Verify Blob store**
   - Vercel Dashboard → Storage → ensure store exists and is connected

## Debugging 413 (Payload Too Large)

- **Limit**: 10MB per file (direct-to-blob)
- **Vercel Pro**: 100MB request body default
- If 413 persists:
  - Confirm file size < 10MB
  - Check Vercel plan limits
  - Ensure `Content-Type: multipart/form-data` and field name is `file`

## Upload Route Summary

- **Endpoint**: `POST /api/upload`
- **Field**: `file` (multipart/form-data)
- **Max size**: 10MB
- **Storage**: Vercel Blob (public access)
- **Response**: `{ url: string }`

<!-- deployment trigger v1.0.1 -->
