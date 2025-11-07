# Maintenance & Operations Guide

Ongoing maintenance procedures and operational guidelines for the Spec-Driven Consulting website.

## Regular Maintenance Schedule

### Daily (Automated)
- [x] Cloudflare CDN cache updates
- [x] SSL certificate validation
- [x] Uptime monitoring checks
- [x] Security header validation

### Weekly
- [ ] Review Cloudflare Web Analytics
- [ ] Check Web3Forms submission quota
- [ ] Monitor Calendly integration
- [ ] Review GitHub Actions build status
- [ ] Check for security alerts

### Monthly
- [ ] Update npm dependencies
- [ ] Run full accessibility audit
- [ ] Performance testing and optimization
- [ ] Review and rotate API keys
- [ ] Backup configuration files
- [ ] Test disaster recovery procedures

### Quarterly
- [ ] Comprehensive security audit
- [ ] Content review and updates
- [ ] Performance benchmark comparison
- [ ] Third-party integration review
- [ ] Cost optimization review

## Operational Procedures

### Content Updates

#### Text Content Changes
1. **Edit source files** in `src/components/` or `src/pages/`
2. **Test locally**:
   ```bash
   npm run dev
   # Verify changes at http://localhost:4321
   ```
3. **Create pull request** with changes
4. **Review and merge** to main branch
5. **Verify deployment** at https://specdriven.app

#### Adding New Sections
1. **Create component** in `src/components/sections/`
2. **Import and use** in `src/pages/index.astro`
3. **Update navigation** if needed
4. **Test responsiveness** on mobile/tablet
5. **Run accessibility tests**
6. **Deploy and verify**

### Environment Variable Management

#### Adding New Variables
1. **Update `.env.example`** with new variable
2. **Add to Cloudflare Pages** environment settings
3. **Update documentation** in README.md
4. **Test in both preview and production**

#### Rotating API Keys
1. **Generate new key** from service provider
2. **Update in Cloudflare Pages** settings
3. **Test functionality** with new key
4. **Remove old key** from service provider
5. **Document change** in changelog

### Dependency Management

#### Monthly Updates
```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Test after updates
npm run build
npm run test
```

#### Major Version Updates
1. **Read changelog** for breaking changes
2. **Update in feature branch**
3. **Test thoroughly** locally
4. **Run full test suite**
5. **Deploy to preview** environment
6. **Merge after verification**

### Performance Monitoring

#### Key Metrics to Track
- **Lighthouse Performance Score**: Target ≥90 mobile, ≥95 desktop
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): ≤3.0s
  - FID (First Input Delay): ≤100ms
  - CLS (Cumulative Layout Shift): ≤0.1
- **Page Load Time**: ≤3 seconds on 4G
- **Time to Interactive**: ≤5 seconds

#### Monthly Performance Review
```bash
# Run Lighthouse audit
npm run lighthouse

# Check bundle size
npm run build -- --analyze

# Review Cloudflare Analytics
# - Page views and unique visitors
# - Performance metrics
# - Geographic distribution
# - Device/browser breakdown
```

### Security Maintenance

#### Weekly Security Checks
- [ ] Review Cloudflare Security Events
- [ ] Check for SSL certificate expiration
- [ ] Verify security headers are present
- [ ] Monitor for unusual traffic patterns
- [ ] Review form submission logs for spam

#### Security Header Validation
```bash
# Test security headers
curl -I https://specdriven.app

# Expected headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Referrer-Policy: strict-origin-when-cross-origin
# Content-Security-Policy: [policy]
```

#### Incident Response
1. **Identify** the security issue
2. **Assess** impact and severity
3. **Contain** the issue (block traffic if needed)
4. **Fix** the vulnerability
5. **Test** the fix thoroughly
6. **Deploy** and monitor
7. **Document** lessons learned

### Backup & Recovery

#### What to Backup
- [ ] **Source code**: GitHub repository (primary backup)
- [ ] **Environment variables**: Cloudflare Pages settings
- [ ] **Configuration files**: _headers, _redirects, etc.
- [ ] **DNS settings**: Cloudflare DNS configuration
- [ ] **SSL certificates**: Automatically managed by Cloudflare

#### Recovery Procedures

**Full Site Recovery**:
1. **Restore from GitHub** repository
2. **Recreate Cloudflare Pages** project
3. **Configure environment variables**
4. **Set up custom domain**
5. **Test all functionality**

**Rollback Deployment**:
1. Go to **Cloudflare Pages** → Deployments
2. Find **last working deployment**
3. Click **Rollback to this deployment**
4. **Verify** site functionality
5. **Investigate** and fix issue

### Monitoring & Alerting

#### Automated Monitoring
- **Uptime**: Cloudflare monitoring
- **Performance**: Lighthouse CI on PRs
- **Security**: GitHub security alerts
- **Build status**: GitHub Actions notifications

#### Manual Monitoring
- **Weekly traffic review**: Cloudflare Analytics
- **Monthly performance audit**: Lighthouse
- **Quarterly security review**: Full security audit

#### Alert Escalation
1. **Level 1**: Site down (immediate response)
2. **Level 2**: Performance degradation (4-hour response)
3. **Level 3**: Non-critical issues (next business day)

### Third-Party Service Management

#### Web3Forms
- **Quota monitoring**: 250 submissions/month (free tier)
- **Monthly review**: Check submission quality
- **Spam management**: Review honeypot effectiveness
- **Upgrade trigger**: 200+ legitimate submissions/month

#### Calendly
- **Integration testing**: Weekly modal test
- **Account management**: Keep login credentials secure
- **URL updates**: Update if scheduling link changes
- **Analytics**: Review booking conversion rates

#### Cloudflare
- **DNS management**: Monitor record changes
- **SSL certificates**: Auto-renewal verification
- **Analytics**: Weekly traffic review
- **Security**: Monitor firewall events

### Cost Optimization

#### Monthly Cost Review
- **Cloudflare Pages**: Free tier usage
- **Web3Forms**: Submission count vs quota
- **Domain registration**: Annual renewal tracking
- **Third-party tools**: Usage vs cost

#### Optimization Opportunities
- **Image optimization**: Reduce bandwidth costs
- **Caching**: Improve CDN hit rates
- **Bundle size**: Reduce data transfer
- **Third-party scripts**: Minimize external dependencies

### Documentation Maintenance

#### Keep Updated
- [ ] **README.md**: Installation and setup instructions
- [ ] **DEPLOYMENT.md**: Deployment procedures
- [ ] **TESTING.md**: Testing procedures
- [ ] **API documentation**: Environment variables and integrations
- [ ] **Changelog**: Record all significant changes

#### Version Control
- **Tag releases**: Use semantic versioning
- **Document changes**: Clear commit messages
- **Branch strategy**: Main for production, feature branches for development

## Emergency Procedures

### Site Down Emergency
1. **Check Cloudflare status**: cloudflarestatus.com
2. **Verify DNS**: Use dig or nslookup
3. **Test from multiple locations**: Various geographic regions
4. **Check GitHub Actions**: Build status
5. **Rollback if needed**: Previous working deployment
6. **Communicate status**: Notify stakeholders

### Security Incident
1. **Assess threat level**: Critical/High/Medium/Low
2. **Contain immediately**: Block traffic if necessary
3. **Document everything**: Screenshots, logs, timeline
4. **Fix vulnerability**: Deploy patch ASAP
5. **Verify fix**: Comprehensive testing
6. **Post-mortem**: Review and improve processes

### Data Breach (Form Submissions)
1. **Identify scope**: Which data was accessed
2. **Secure the breach**: Fix vulnerability
3. **Notify stakeholders**: Legal and business teams
4. **Review logs**: Understand attack vector
5. **Improve security**: Prevent future incidents

## Contact Information

### Primary Contacts
- **Technical Lead**: [Name, Email, Phone]
- **Product Owner**: [Name, Email, Phone]
- **On-call Engineer**: [Rotation schedule]

### Service Providers
- **Cloudflare Support**: support@cloudflare.com
- **Web3Forms Support**: support@web3forms.com
- **Calendly Support**: support@calendly.com
- **GitHub Support**: support@github.com

### Emergency Escalation
1. **Technical issues**: Development team
2. **Business critical**: Product owner
3. **Security incidents**: Security team + Legal
4. **24/7 emergencies**: On-call rotation

---

## Checklists

### Pre-Deployment Checklist
- [ ] All tests pass locally
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Rollback plan prepared

### Post-Deployment Checklist
- [ ] Site loads correctly
- [ ] All functionality verified
- [ ] Performance acceptable
- [ ] Analytics tracking
- [ ] Team notified

### Monthly Maintenance Checklist
- [ ] Dependencies updated
- [ ] Security audit completed
- [ ] Performance review done
- [ ] Backups verified
- [ ] Documentation current

Remember: **Prevention is better than cure** - regular maintenance prevents emergencies!