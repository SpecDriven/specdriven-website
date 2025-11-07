# Cloudflare Pages Deployment Guide

Complete step-by-step guide for deploying the Spec-Driven Consulting website to Cloudflare Pages.

## Prerequisites

Before you begin, ensure you have:
- [x] A Cloudflare account (free tier is sufficient)
- [x] A GitHub repository with your code
- [x] Domain `specdriven.app` added to Cloudflare DNS
- [x] Calendly account and scheduling URL
- [x] Web3Forms account and access key

## Step 1: GitHub Repository Setup

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Ensure required files are present:**
   - [ ] `_headers` - Security and caching headers
   - [ ] `_redirects` - URL redirections
   - [ ] `.nvmrc` - Node.js version specification
   - [ ] `.env.example` - Environment variables template
   - [ ] `.github/workflows/ci.yml` - CI/CD pipeline

## Step 2: Cloudflare Pages Project Creation

1. **Navigate to Cloudflare Dashboard:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Select your account

2. **Create Pages Project:**
   - Click **Pages** in the sidebar
   - Click **Create a project**
   - Select **Connect to Git**

3. **Connect GitHub Repository:**
   - Click **Connect to GitHub** (authorize if needed)
   - Select your repository: `specdriven`
   - Click **Begin setup**

## Step 3: Build Configuration

Configure the following settings:

### Framework Settings
- **Framework preset:** Astro
- **Production branch:** `main`
- **Build command:** `npm ci && npm run build`
- **Build output directory:** `dist`

### Advanced Settings
- **Root directory:** `/` (leave empty)
- **Environment variables:** Configure in next step

Click **Save and Deploy** to create the project.

## Step 4: Environment Variables Configuration

1. **Navigate to Environment Variables:**
   - Go to your Pages project
   - Click **Settings** tab
   - Click **Environment variables**

2. **Add Production Variables:**
   ```
   Variable Name                 | Value
   ------------------------------|------------------------------------------
   SITE_URL                     | https://specdriven.app
   VITE_CALENDLY_URL           | https://calendly.com/your-handle/assessment
   VITE_WEB3FORMS_ACCESS_KEY   | your_web3forms_access_key
   VITE_CONTACT_EMAIL          | leads@specdriven.app
   VITE_ANALYTICS              | cf
   NODE_VERSION                | 20
   ```

3. **Add Preview Variables:**
   - Use the same values for preview deployments
   - You can use a different Calendly URL for testing if needed
   - Consider using a test email for Web3Forms in preview

## Step 5: Custom Domain Configuration

### Add Custom Domain
1. **In your Pages project:**
   - Go to **Custom domains** tab
   - Click **Set up a custom domain**
   - Enter: `specdriven.app`
   - Click **Continue**

2. **Add www subdomain:**
   - Click **Set up a custom domain** again
   - Enter: `www.specdriven.app`
   - Click **Continue**

### DNS Configuration
Cloudflare will automatically create the necessary DNS records:
- `specdriven.app` → CNAME to `your-project.pages.dev`
- `www.specdriven.app` → CNAME to `your-project.pages.dev`

**Note:** This only works if your domain is already on Cloudflare DNS.

### SSL/TLS Configuration
1. **Navigate to SSL/TLS:**
   - Go to your domain in Cloudflare
   - Click **SSL/TLS** tab
   - Click **Edge Certificates**

2. **Enable security features:**
   - [x] **Always Use HTTPS**
   - [x] **Automatic HTTPS Rewrites**
   - [x] **HTTP Strict Transport Security (HSTS)** (after HTTPS is working)

## Step 6: Build Settings Optimization

1. **Set Node.js Version:**
   - Go to **Settings** → **Builds and deployments**
   - Set **Compatibility date** to latest
   - Ensure **Node.js version** is set to `20`

2. **Configure Preview Deployments:**
   - [x] Enable **Preview deployments**
   - [x] **Create preview deployments for all branches**
   - [x] **Deploy preview branch on push**

## Step 7: Analytics Setup

### Option A: Automatic Integration (Recommended)
1. **In your Pages project:**
   - Go to **Analytics** tab
   - Click **Enable Web Analytics**
   - Cloudflare will automatically inject the tracking script

### Option B: Manual Integration
1. **Get tracking code:**
   - Go to **Analytics** → **Web Analytics** in Cloudflare dashboard
   - Click **Add a site**
   - Enter your domain
   - Copy the tracking script

2. **Add to your layout:**
   - Add the script to your Astro layout `<head>` section

## Step 8: Performance Configuration

### Caching Rules
Your `_headers` file configures:
- **HTML:** No cache (instant updates)
- **Assets:** 1-year cache (with immutable flag)
- **Static files:** 24-hour cache

### Security Headers
Automatically applied via `_headers`:
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options

## Step 9: Testing Your Deployment

### Automated Tests
GitHub Actions will run on every push:
- Build verification
- Type checking (if TypeScript)
- Lighthouse CI (on PRs)
- Accessibility tests

### Manual Testing Checklist
After deployment, verify:

#### Functionality
- [ ] Site loads at `https://specdriven.app`
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Calendly modal opens and works
- [ ] Mobile responsive design

#### Performance
- [ ] Lighthouse score ≥90 on mobile
- [ ] Page loads in <3 seconds
- [ ] No console errors
- [ ] Images load properly

#### Security
- [ ] HTTPS certificate valid
- [ ] Security headers present (check with securityheaders.com)
- [ ] CSP allows Calendly and Web3Forms
- [ ] No mixed content warnings

## Step 10: Monitoring and Maintenance

### Regular Monitoring
- **Build Status:** Check Pages dashboard for failed deployments
- **Analytics:** Monitor traffic in Cloudflare Web Analytics
- **Form Submissions:** Check Web3Forms dashboard
- **Performance:** Run periodic Lighthouse audits

### Maintenance Tasks
- **Monthly:** Update npm dependencies
- **Quarterly:** Review analytics and optimize
- **As needed:** Update content and environment variables

## Troubleshooting Common Issues

### Build Failures

**Issue:** Build fails with "Module not found"
```
Solution:
1. Check if package.json includes all dependencies
2. Verify Node.js version matches .nvmrc
3. Clear build cache in Pages settings
4. Check build logs for specific missing modules
```

**Issue:** Environment variables not working
```
Solution:
1. Verify variables are set in Pages settings
2. Check variable names match exactly (VITE_ prefix for client-side)
3. Redeploy after adding variables
4. Check build logs for undefined variables
```

### Domain Issues

**Issue:** SSL certificate not provisioning
```
Solution:
1. Ensure domain is on Cloudflare DNS
2. Wait up to 24 hours for provisioning
3. Check DNS records are pointing correctly
4. Contact Cloudflare support if persistent
```

**Issue:** www redirect not working
```
Solution:
1. Verify both apex and www domains are added
2. Check _redirects file syntax
3. Clear CDN cache
4. Test with curl: curl -I https://www.specdriven.app
```

### Performance Issues

**Issue:** Poor Lighthouse scores
```
Solution:
1. Optimize images (use WebP/AVIF)
2. Ensure Calendly loads only on interaction
3. Check JavaScript bundle size
4. Verify caching headers are applied
```

**Issue:** Slow loading times
```
Solution:
1. Enable Cloudflare caching
2. Optimize critical render path
3. Compress images
4. Remove unused CSS/JS
```

### Functionality Issues

**Issue:** Calendly modal not opening
```
Solution:
1. Check CSP headers allow assets.calendly.com
2. Verify VITE_CALENDLY_URL is correct
3. Test with browser dev tools
4. Check for JavaScript errors
```

**Issue:** Contact form not submitting
```
Solution:
1. Verify Web3Forms access key is valid
2. Check form field names match requirements
3. Test CSP allows api.web3forms.com
4. Check browser network tab for errors
```

## Advanced Configuration

### Custom Headers
To add additional headers, edit `_headers`:
```
/*
  X-Custom-Header: value
  Custom-Security-Header: value
```

### Additional Redirects
To add more redirects, edit `_redirects`:
```
/old-path    /new-path    301
/blog/*      /           302
```

### Functions (Advanced)
For server-side functionality:
1. Create `functions` directory
2. Add JavaScript/TypeScript files
3. Deploy automatically with your site

## Support Resources

- **Cloudflare Pages Docs:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Astro Deployment:** [docs.astro.build/en/guides/deploy/cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare)
- **Community Support:** [community.cloudflare.com](https://community.cloudflare.com)
- **Status Page:** [cloudflarestatus.com](https://cloudflarestatus.com)

## Emergency Procedures

### Rollback Deployment
1. Go to Pages → **Deployments**
2. Find last working deployment
3. Click **⋯** → **Rollback to this deployment**
4. Confirm rollback

### Emergency Domain Changes
1. Update DNS records in Cloudflare dashboard
2. Wait for propagation (up to 24 hours)
3. Update environment variables if needed
4. Test thoroughly

---

✅ **Deployment Complete!** Your site should now be live at `https://specdriven.app`