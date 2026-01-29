# Secrets Setup Guide

## JWT_SECRET Configuration

The JWT_SECRET is used to sign and verify JSON Web Tokens for authentication. This sensitive value must be stored securely and should never be committed to version control.

## Local Development

For local development, the JWT_SECRET is stored in the `.dev.vars` file:

```bash
# .dev.vars (already created and gitignored)
JWT_SECRET=dev-secret-change-for-your-local-testing
```

**Important:** The `.dev.vars` file is automatically ignored by git (see `.gitignore`). Never commit this file.

## Production Deployment

For production, use Wrangler's encrypted secrets feature:

### Step 1: Set the Production Secret

```bash
npx wrangler secret put JWT_SECRET
```

When prompted, enter a strong, randomly generated secret. Example using OpenSSL:

```bash
# Generate a secure random secret
openssl rand -base64 32

# Then set it
npx wrangler secret put JWT_SECRET
# Paste the generated secret when prompted
```

### Step 2: Verify the Secret

You can list secrets (but not view their values) with:

```bash
npx wrangler secret list
```

### Environment-Specific Secrets

If you use Wrangler environments (staging, production), set secrets per environment:

```bash
# Production environment
npx wrangler secret put JWT_SECRET --env production

# Staging environment
npx wrangler secret put JWT_SECRET --env staging
```

## How It Works

- **Local Development:** Wrangler automatically loads `.dev.vars` when running `wrangler dev`
- **Production:** Secrets are encrypted and stored securely in Cloudflare's infrastructure
- **Access in Code:** Both local and production secrets are accessed via `c.env.JWT_SECRET`

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use different secrets** for development, staging, and production
3. **Rotate secrets regularly** (every 90 days recommended)
4. **Use strong, random values** (at least 32 characters, base64 encoded)
5. **Limit access** to production secrets to authorized team members only

## Troubleshooting

### Error: "JWT_SECRET environment variable is not configured"

This means the worker cannot find the JWT_SECRET. Check:

1. **Local dev:** Ensure `.dev.vars` exists with `JWT_SECRET=...`
2. **Production:** Run `wrangler secret put JWT_SECRET` to set it

### Error: "Invalid token" after deployment

This usually means tokens were signed with a different secret. Either:

1. The JWT_SECRET was changed/rotated
2. Users need to log in again to get new tokens

## Additional Resources

- [Cloudflare Workers Secrets Documentation](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Wrangler Environments](https://developers.cloudflare.com/workers/wrangler/environments/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
