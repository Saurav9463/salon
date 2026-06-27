# Beeba Boys Barbershop Website

## Local Setup
1. Clone the repo
2. cd into artifacts/beeba-boys
3. Copy .env.example to .env and fill in your Supabase credentials
4. Run: npm install
5. Run: npm run dev

## Vercel Deployment
1. Push repo to GitHub
2. Go to vercel.com → New Project → Import repo
3. Set Root Directory to: artifacts/beeba-boys
4. Framework Preset: Vite
5. Build Command: npm run build
6. Output Directory: dist
7. Add Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
8. Click Deploy
