# Testing & Quality Assurance Guide

Comprehensive testing checklist and troubleshooting guide for the Spec-Driven Consulting website.

## Testing Checklist

### Pre-Deployment Testing

#### ✅ Build & Development
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts development server
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` serves built site correctly
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] All environment variables are configured in `.env`

#### ✅ Core Functionality
- [ ] Homepage loads without errors
- [ ] All navigation links work correctly
- [ ] Scroll-to-section navigation functions properly
- [ ] Contact form displays all required fields
- [ ] Form validation works for required fields
- [ ] Email validation prevents invalid addresses
- [ ] Privacy consent checkbox is required
- [ ] Honeypot field is hidden but present
- [ ] Schedule Call buttons are visible and clickable
- [ ] Calendly modal opens (or fallback works)
- [ ] UTM parameters are captured and stored
- [ ] Success messages display after form submission

#### ✅ Mobile Responsiveness
- [ ] Site works on iPhone (375px width)
- [ ] Site works on iPad (768px width)
- [ ] Site works on desktop (1024px+ width)
- [ ] Navigation is accessible on mobile
- [ ] Forms are usable on touch devices
- [ ] Buttons are appropriately sized for touch
- [ ] Text is readable at all screen sizes
- [ ] Images scale appropriately

#### ✅ Performance
- [ ] Lighthouse Performance score ≥90 (mobile)
- [ ] Lighthouse Performance score ≥95 (desktop)
- [ ] First Contentful Paint ≤2 seconds
- [ ] Largest Contentful Paint ≤3 seconds
- [ ] Cumulative Layout Shift ≤0.1
- [ ] Total Blocking Time ≤300ms
- [ ] No render-blocking resources
- [ ] Images are optimized (WebP/AVIF)
- [ ] JavaScript bundle ≤200KB
- [ ] CSS is optimized and purged

#### ✅ Accessibility
- [ ] All images have appropriate alt text
- [ ] Form fields have proper labels
- [ ] Heading hierarchy is logical (h1→h2→h3)
- [ ] Color contrast meets AA standards
- [ ] Site is fully keyboard navigable
- [ ] Focus indicators are visible
- [ ] ARIA landmarks are present
- [ ] Screen reader friendly
- [ ] No accessibility violations in automated tests

#### ✅ SEO
- [ ] Page title is descriptive and unique
- [ ] Meta description is compelling and accurate
- [ ] Canonical URL is set correctly
- [ ] Structured data is valid (if implemented)
- [ ] robots.txt allows search engine crawling
- [ ] Sitemap.xml is present and valid
- [ ] Open Graph tags are configured
- [ ] Twitter Card tags are configured

#### ✅ Security
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] CSP allows required third-parties only
- [ ] No sensitive data in client-side code
- [ ] Form submissions use HTTPS
- [ ] No mixed content warnings
- [ ] XSS protection is enabled
- [ ] Clickjacking protection is enabled

### Post-Deployment Testing

#### ✅ Live Site Verification
- [ ] Site loads at production domain
- [ ] SSL certificate is valid
- [ ] All redirects work correctly
- [ ] DNS resolution is correct
- [ ] CDN is serving cached assets
- [ ] Analytics tracking is working
- [ ] Error pages display correctly (404, 500)

#### ✅ Third-Party Integrations
- [ ] Calendly modal opens and functions
- [ ] Web3Forms receives submissions
- [ ] Email notifications are sent
- [ ] Cloudflare Analytics is tracking
- [ ] All external links work
- [ ] Third-party scripts load properly

#### ✅ Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

#### ✅ Load Testing
- [ ] Site handles concurrent users
- [ ] Forms handle multiple submissions
- [ ] CDN caching is effective
- [ ] No rate limiting issues
- [ ] Database (if any) performs well

## Automated Testing

### Running Tests Locally

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run specific test suites
npm run test:e2e          # End-to-end tests
npm run test:a11y         # Accessibility tests
npm test:headed           # Run with browser visible
npm test:ui               # Interactive test runner

# Generate test report
npm run test:report
```

### Test Suites

#### End-to-End Tests
- **Homepage**: Basic functionality, navigation, content
- **Contact Form**: Validation, submission, error handling
- **Calendly Integration**: Modal behavior, fallbacks
- **Accessibility**: WCAG compliance, keyboard navigation

#### Performance Tests
```bash
# Lighthouse CI
npm run lighthouse

# Custom performance tests
npm test tests/performance/
```

#### Visual Regression Tests (Optional)
```bash
# Screenshot comparison tests
npm test tests/visual/
```

## Troubleshooting Guide

### Common Issues & Solutions

#### Build Failures

**Issue: `npm install` fails**
```
Error: Unable to resolve dependency tree
Solution:
1. Delete node_modules and package-lock.json
2. Run npm cache clean --force
3. Run npm install again
4. Check Node.js version matches .nvmrc
```

**Issue: Build fails with "Module not found"**
```
Solution:
1. Check if all dependencies are listed in package.json
2. Verify import paths are correct
3. Check for typos in component names
4. Ensure case sensitivity is correct
```

**Issue: TypeScript errors**
```
Solution:
1. Run npm run type-check for detailed errors
2. Check component prop types
3. Verify environment variable types
4. Update TypeScript configuration if needed
```

#### Development Server Issues

**Issue: Dev server won't start**
```
Solution:
1. Check if port 4321 is already in use
2. Kill existing processes: pkill -f "astro dev"
3. Try different port: astro dev --port 3000
4. Check file permissions
```

**Issue: Hot reload not working**
```
Solution:
1. Check if files are being watched correctly
2. Restart development server
3. Clear browser cache
4. Check for file path issues on Windows
```

#### Styling Issues

**Issue: Tailwind classes not working**
```
Solution:
1. Verify Tailwind is configured in astro.config.mjs
2. Check if CSS is being purged incorrectly
3. Use safelist in tailwind.config.cjs
4. Restart development server
```

**Issue: CSS not loading in production**
```
Solution:
1. Check if CSS files are in dist folder
2. Verify CDN headers allow CSS
3. Check for MIME type issues
4. Clear CDN cache
```

#### Form Issues

**Issue: Contact form not submitting**
```
Solution:
1. Check Web3Forms access key is correct
2. Verify form field names match requirements
3. Check CSP headers allow api.web3forms.com
4. Test with browser dev tools network tab
5. Verify honeypot field is not filled
```

**Issue: Form validation not working**
```
Solution:
1. Check HTML5 validation attributes
2. Verify JavaScript validation logic
3. Test with different browsers
4. Check for console errors
```

#### Calendly Integration Issues

**Issue: Calendly modal not opening**
```
Solution:
1. Check CSP headers allow assets.calendly.com
2. Verify CALENDLY_URL environment variable
3. Test with browser dev tools
4. Check for JavaScript errors
5. Verify click event handlers
```

**Issue: Calendly script loading fails**
```
Solution:
1. Test with fallback URL
2. Check network connectivity
3. Verify CSP and CORS settings
4. Test with different browsers
```

#### Performance Issues

**Issue: Poor Lighthouse scores**
```
Solution:
1. Optimize images (use WebP/AVIF)
2. Minimize JavaScript
3. Defer non-critical scripts
4. Check for unused CSS
5. Optimize fonts
6. Enable compression
```

**Issue: Slow loading times**
```
Solution:
1. Check CDN configuration
2. Optimize image sizes
3. Minimize HTTP requests
4. Enable caching headers
5. Use performance profiling tools
```

#### Deployment Issues

**Issue: Cloudflare Pages build fails**
```
Solution:
1. Check build command is correct
2. Verify Node.js version matches .nvmrc
3. Check environment variables
4. Review build logs for specific errors
5. Test build locally first
```

**Issue: Custom domain not working**
```
Solution:
1. Verify DNS records point to Pages
2. Check SSL certificate status
3. Wait for DNS propagation (up to 24 hours)
4. Clear browser cache
5. Test with dig command
```

**Issue: Headers not applying**
```
Solution:
1. Verify _headers file is in project root
2. Check header syntax is correct
3. Test with curl or browser dev tools
4. Clear CDN cache
5. Check Cloudflare Functions logs
```

#### Security Issues

**Issue: CSP violations**
```
Solution:
1. Check browser console for specific violations
2. Add required domains to CSP
3. Test in report-only mode first
4. Update _headers file
5. Clear cache after changes
```

**Issue: Mixed content warnings**
```
Solution:
1. Ensure all resources use HTTPS
2. Update hardcoded HTTP URLs
3. Check third-party embeds
4. Use protocol-relative URLs if needed
```

### Debug Tools & Commands

#### Local Testing
```bash
# Test production build locally
npm run build && npm run preview

# Test with different devices
npx playwright test --headed --device="iPhone 12"

# Debug specific test
npx playwright test --debug tests/e2e/contact-form.spec.ts

# Generate test artifacts
npx playwright test --trace on --screenshot on
```

#### Performance Analysis
```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --output=html

# Bundle analysis
npm run build -- --analyze

# Network analysis with curl
curl -I https://specdriven.app
```

#### Security Testing
```bash
# Test security headers
curl -I https://specdriven.app

# CSP testing
# Use browser dev tools Console tab

# SSL testing
openssl s_client -connect specdriven.app:443
```

### Monitoring & Alerts

#### Performance Monitoring
- **Cloudflare Analytics**: Traffic and performance metrics
- **Lighthouse CI**: Automated performance testing
- **Real User Monitoring**: Core Web Vitals tracking

#### Error Monitoring
- **Browser Console**: Client-side errors
- **Cloudflare Logs**: Server-side issues
- **GitHub Actions**: Build failures

#### Uptime Monitoring
- **Cloudflare Status**: Service status
- **External monitors**: Third-party uptime services
- **Health checks**: Automated endpoint testing

### Quality Gates

#### Before Merging PR
- [ ] All automated tests pass
- [ ] Code review completed
- [ ] Performance benchmarks met
- [ ] Accessibility checks pass
- [ ] Security scan completed

#### Before Production Deploy
- [ ] Staging environment tested
- [ ] Third-party integrations verified
- [ ] Performance targets achieved
- [ ] Rollback plan prepared
- [ ] Team notification sent

#### Post-Deploy Verification
- [ ] Live site functionality confirmed
- [ ] Analytics tracking verified
- [ ] Performance metrics acceptable
- [ ] Error rates within limits
- [ ] User feedback monitored

---

## Support Contacts

- **Technical Issues**: Development team
- **Hosting Issues**: Cloudflare support
- **Third-party Issues**: Calendly/Web3Forms support
- **Emergency**: On-call rotation

**Remember**: Always test locally before deploying, and have a rollback plan ready!