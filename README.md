# Spec-Driven Consulting Website

A modern, high-performance marketing website built with Astro and Tailwind CSS for Spec-Driven Consulting.

## 🚀 Project Structure

```
/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── sections/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ContactForm.astro
│   │   ├── Footer.astro
│   │   └── CalendlyModal.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── utm.ts
│   │   └── calendly.ts
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── tailwind.css
├── astro.config.mjs
├── tailwind.config.cjs
└── package.json
```

## 🛠️ Features

- **Static Site Generation**: Built with Astro for optimal performance
- **Tailwind CSS**: Utility-first styling with custom design system
- **Calendly Integration**: Lazy-loaded modal for scheduling calls
- **Web3Forms**: Contact form with spam protection
- **UTM Tracking**: 90-day localStorage persistence for attribution
- **Mobile-First**: Responsive design across all devices
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Lighthouse scores 95+ desktop, 90+ mobile

## 🏃‍♂️ Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values:
   - `VITE_CALENDLY_URL`: Your Calendly scheduling URL
   - `VITE_WEB3FORMS_ACCESS_KEY`: Your Web3Forms API key
   - `VITE_CONTACT_EMAIL`: Your contact email address

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:4321`

## 📝 Environment Variables

Create a `.env` file with the following variables:

```bash
# Calendly Integration
VITE_CALENDLY_URL=https://calendly.com/your-handle/assessment

# Web3Forms Contact Form
VITE_WEB3FORMS_ACCESS_KEY=YOUR_KEY_HERE

# Contact Information
VITE_CONTACT_EMAIL=leads@specdriven.app

# Site Configuration
VITE_SITE_URL=https://specdriven.app
```

## 🚀 Deployment

### Cloudflare Pages (Recommended)

1. **Connect your GitHub repository** to Cloudflare Pages
2. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 18+
3. **Set environment variables** in Cloudflare Pages settings
4. **Deploy** to your custom domain

### Other Platforms

The site can also be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider

## 🎯 Performance Targets

- **LCP**: ≤ 3.0s on mobile 4G
- **CLS**: < 0.10
- **Total JS**: ≤ 200KB compressed
- **HTML**: ≤ 70KB compressed per page
- **Lighthouse scores**: ≥95 desktop, ≥90 mobile

## 🔧 Development Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`     |
| `npm run build`        | Build your production site to `./dist/`         |
| `npm run preview`      | Preview your build locally, before deploying    |
| `npm run check`        | Run Astro's built-in diagnostics                |
| `npm run lint`         | Check code formatting with Prettier             |
| `npm run format`       | Format code with Prettier                       |

## 📊 Analytics & Monitoring

The site includes:
- **Google Analytics 4**: User behavior tracking
- **Cloudflare Web Analytics**: Privacy-friendly analytics
- **Core Web Vitals**: Performance monitoring
- **Error tracking**: JavaScript error monitoring

## 🛡️ Security & Privacy

- **No cookies**: Uses localStorage for UTM tracking only
- **Privacy-first**: Minimal data collection
- **Secure forms**: Honeypot spam protection
- **HTTPS**: Enforced via Cloudflare
- **CSP headers**: Content Security Policy configured

## 🧪 Testing Checklist

- [ ] All navigation anchors work correctly
- [ ] Calendly modal opens from all CTAs
- [ ] Contact form validates and submits
- [ ] UTM parameters are captured and persisted
- [ ] Mobile responsive layout works
- [ ] No console errors
- [ ] Lighthouse scores meet targets
- [ ] Accessibility requirements met

## 📱 Key Integrations

### Calendly
- Lazy-loaded script (only loads on user intent)
- Modal popup to keep users on site
- UTM parameter passing
- Fallback to new tab if script fails

### Web3Forms
- Secure form processing
- Honeypot spam protection
- UTM attribution inclusion
- Success/error handling

### UTM Tracking
- 90-day localStorage persistence
- First-touch attribution
- Form submission inclusion
- Privacy-compliant storage

## 🎨 Design System

Built with Tailwind CSS custom configuration:
- **Colors**: Primary blue (#2563eb) with full palette
- **Typography**: System font stack for performance
- **Spacing**: Consistent scale with section padding
- **Components**: Reusable button and card styles

## 📞 Support

For questions or support:
- Email: leads@specdriven.app
- Response time: Within 24 hours
- Available: 9 AM - 6 PM PST

## 📄 License

This project is private and proprietary to Spec-Driven Consulting.

## 🔗 Related Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Web3Forms Documentation](https://web3forms.com/docs)
- [Calendly Developer Documentation](https://developer.calendly.com)