# Deployment Troubleshooting Guide

## Current Situation

You've successfully added the `JWT_SECRET` to Cloudflare via the dashboard, but the deployment is failing. Here's how to diagnose and fix the issue.

## Why the Deployment is Failing

Based on the Cloudflare deployment logs (Comment #1 in PR), the deployment failed. The most likely causes are:

### 1. **JWT_SECRET Not Available During Deployment**

When Cloudflare builds your Worker, it needs access to the `JWT_SECRET` environment variable. Since we removed it from `wrangler.json` (for security), you need to ensure it's configured in the Cloudflare dashboard.

### 2. **Verify JWT_SECRET in Cloudflare Dashboard**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** > **cc3-storefront-vite-react**
3. Go to **Settings** > **Variables and Secrets**
4. Verify that `JWT_SECRET` is listed under **Environment Variables** or **Secrets**
5. Make sure it's set for the **Production** environment

### 3. **Check Build Logs**

Click the "View logs" link in the PR comment to see the detailed error:
```text
https://dash.cloudflare.com/?to=/<account-id>/workers/services/view/cc3-storefront-vite-react/production/builds/<build-id>
```

Common errors:
- **"JWT_SECRET environment variable is not configured"** - Secret not set or not available
- **Build timeout** - Build taking too long (unlikely)
- **Syntax errors** - Code issues (but local build works fine)

## Solution Steps

### Option 1: Verify Secret Configuration (Recommended)

1. **Check if JWT_SECRET exists:**
   - Dashboard > Workers & Pages > cc3-storefront-vite-react > Settings > Variables
   - Look for `JWT_SECRET` under either "Environment Variables" or "Secrets"

2. **If it doesn't exist or is under wrong section:**
   - Delete any existing `JWT_SECRET` entry
   - Add it as an **encrypted secret** (not a plain environment variable)
   - Click "Encrypt" next to the variable name
   - Paste your secret value
   - Save

3. **Trigger a new deployment:**
   ```bash
   # Make a small change to trigger rebuild
   git commit --allow-empty -m "Trigger Cloudflare rebuild"
   git push
   ```

### Option 2: Use Wrangler to Deploy (Alternative)

If the Git-based deployment keeps failing, deploy directly with Wrangler:

```bash
# 1. Build locally
npm run build

# 2. Deploy to Cloudflare
npx wrangler deploy

# 3. Verify the secret is set
npx wrangler secret list
```

### Option 3: Re-add JWT_SECRET Temporarily (Last Resort)

If you need to deploy urgently and can't troubleshoot:

1. Temporarily add JWT_SECRET back to `wrangler.json`:
   ```json
   "vars": {
     "JWT_SECRET": "temporary-value-for-emergency-deploy"
   }
   ```

2. Deploy

3. **Immediately remove it** and add as a secret:
   ```bash
   # Remove from wrangler.json
   git restore wrangler.json

   # Add as encrypted secret
   npx wrangler secret put JWT_SECRET

   # Deploy again
   git commit -am "Remove temporary JWT_SECRET"
   git push
   ```

## Verification

After deploying, test the authentication:

```bash
# Test login endpoint
curl -X POST https://cc3-storefront-vite-react.<your-subdomain>.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Should return:
# {"user":{"id":"1","email":"demo@example.com","firstName":"Demo","lastName":"User"},"token":"..."}
```

## Common Issues

### Issue: "Invalid token" errors after deployment

**Cause:** JWT_SECRET was changed, invalidating all existing tokens

**Solution:** Users need to log in again to get new tokens

### Issue: CORS errors in browser

**Cause:** Authorization header blocked by CORS

**Solution:** Already fixed in latest code (src/worker/index.ts includes Authorization in allowHeaders)

### Issue: .dev.vars in dist folder

**This is normal and not a problem.** Cloudflare Workers ignores `.dev.vars` during deployment. The file is copied by the Vite plugin but not used in production.

## Contact

If issues persist after trying these steps:
1. Check the full build logs in the Cloudflare dashboard
2. Look for specific error messages
3. Share the error message for more specific troubleshooting
