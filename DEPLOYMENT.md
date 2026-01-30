# Deployment Guide

## Cloudflare Workers Deployment

### Prerequisites

1. Cloudflare account with Workers enabled
2. Wrangler CLI installed: `npm install -g wrangler`
3. Authenticated to Cloudflare: `wrangler login`

### Required Environment Secrets

The application requires the following environment secrets to be configured in Cloudflare Workers:

#### JWT_SECRET (Required)

Used for JWT token generation and validation in authentication endpoints.

**Setup:**
```bash
# Generate a secure random secret
openssl rand -base64 32

# Set the secret via Wrangler CLI
wrangler secret put JWT_SECRET
# Paste the generated secret when prompted
```

**Or via Dashboard:**
1. Go to Cloudflare Dashboard → Workers & Pages
2. Select `cc3-storefront-vite-react`
3. Go to Settings → Variables
4. Add new environment variable:
   - Type: Secret
   - Name: `JWT_SECRET`
   - Value: [your secure random string, minimum 32 characters]

#### ALLOWED_ORIGINS (Optional)

Comma-separated list of allowed origins for CORS requests.

**Default:** `http://localhost:5173,http://localhost:4173` (development)

**Production Setup:**
```bash
wrangler secret put ALLOWED_ORIGINS
# Enter: https://yourdomain.com,https://www.yourdomain.com
```

**Or via Dashboard:**
1. Same steps as JWT_SECRET
2. Set value to your production domains (e.g., `https://casual-chic.com`)

### R2 Bucket Configuration

The application uses an R2 bucket for media storage (configured in `wrangler.json`):

- Bucket name: `cc3-media`
- Binding: `MEDIA`

**Setup:**
```bash
# Create R2 bucket (if not exists)
wrangler r2 bucket create cc3-media
```

### Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test deployment (dry-run):**
   ```bash
   npm run check
   ```

3. **Deploy to production:**
   ```bash
   npm run deploy
   ```

4. **Verify deployment:**
   - Check Cloudflare Workers dashboard for successful deployment
   - Test API endpoints: `https://your-worker.workers.dev/api/`
   - Monitor logs for any errors

### Troubleshooting

#### Deployment Fails with "JWT_SECRET not configured"

**Cause:** Missing JWT_SECRET environment variable

**Fix:**
```bash
wrangler secret put JWT_SECRET
```

#### CORS Errors in Production

**Cause:** ALLOWED_ORIGINS not configured or incorrect

**Fix:**
```bash
# Set production domains
wrangler secret put ALLOWED_ORIGINS
# Enter: https://yourdomain.com
```

#### Build Errors

**Cause:** TypeScript compilation errors or missing dependencies

**Fix:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Local Development

For local development with Wrangler:

1. Create `.dev.vars` file (not committed to git):
   ```bash
   JWT_SECRET=your-local-dev-secret-32-chars-min
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
   ```

2. Run local dev server:
   ```bash
   npm run dev
   ```

### Production Checklist

Before deploying to production:

- [ ] JWT_SECRET configured in Cloudflare Workers secrets
- [ ] ALLOWED_ORIGINS set to production domain(s)
- [ ] R2 bucket created and configured
- [ ] All tests passing: `npm test`
- [ ] Build successful: `npm run build`
- [ ] Dry-run successful: `npm run check`
- [ ] Monitor deployment logs for errors

### Support

For deployment issues:
- Check Cloudflare Workers dashboard logs
- Review Wrangler documentation: https://developers.cloudflare.com/workers/
- Check R2 documentation: https://developers.cloudflare.com/r2/
