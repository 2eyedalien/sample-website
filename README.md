# Sample Website Backend (Full-Stack Demo)

This project demonstrates **full-stack web development** with a focus on:

- ✅ Secure **e-commerce flows** (Stripe Checkout integration)
- ✅ Optimized **load times** (gzip compression via `compression` middleware, lazy-loading images)
- ✅ **Mobile-first** responsive design (responsive layout)
- ✅ **SEO best practices** (meta tags, JSON-LD structured data, semantic HTML)

## Run locally
```bash
npm install
echo "STRIPE_SECRET_KEY=sk_test_..." > .env
npm run dev
```

Open http://localhost:3000 and test:
- Checkout -> `/api/checkout` (redirects to Stripe Checkout in test mode)
- Leads -> `/api/leads` (demo in-memory storage)

Deploy to Render/Railway/Heroku for automatic HTTPS (SSL). Keep STRIPE_SECRET_KEY private.
