# T Snacks and Threads — starter app

A small React storefront for snacks, drinks, and apparel, with a
2-factor-protected admin dashboard for managing inventory (including
in-browser camera capture for product photos).

## 1. Set up Supabase (free) — this is what makes admin login real

The admin login is **password + emailed one-time code**, both checked on
Supabase's servers — never inside this app's code.

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. **Authentication → Providers**: confirm "Email" is enabled.
3. **Authentication → Users → Add user**: create yourself as a user with
   your real email and a password you don't reuse elsewhere. This is your
   only admin account — there's no public sign-up in this app.
4. **Authentication → Email Templates → Magic Link**: edit the template so
   the email includes `{{ .Token }}` (this is the 6-digit code the app
   asks for in step 2 of login). Save.
5. **Project Settings → API**: copy the **Project URL** and **anon public**
   key.
6. Paste both into `src/supabaseClient.js` where marked.

The anon key is meant to be public — it can't do anything without a valid
login. Your real password only ever lives in Supabase.

## 2. Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## 3. Deploy for free

**Vercel** or **Netlify** both work the same way:

1. Push this folder to a GitHub repo.
2. On Vercel/Netlify, "Import project" from that repo.
3. Build command: `npm run build` — Output directory: `dist`
4. Deploy. You'll get a free `*.vercel.app` or `*.netlify.app` URL.

Camera capture requires HTTPS (both platforms provide this automatically)
and the visitor's browser permission — it won't work over plain `http://`.

**Custom domain:** both Vercel and Netlify let you attach a domain you buy
elsewhere for free (no extra platform fee, just the domain registrar's
price). For this name, `tsnacksandthreads.com` or, since you're UK-based,
`tsnacksandthreads.co.uk` would match — check availability with any
registrar (Namecheap, GoDaddy, IONOS, etc.) before settling on one.

## 4. Package for Google Play with Capacitor (later)

Once the web app is deployed and working:

```bash
npm install @capacitor/core @capacitor/android
npx cap init "T Snacks and Threads" "com.yourname.tsnacksandthreads"
npx cap add android
npm run build
npx cap copy android
npx cap open android
```

That opens the project in Android Studio, where you can build a signed
`.aab` to upload to the Play Console. (Play Console has a one-time $25
registration fee — that's Google's, not something this app needs.)

## What's simulated vs. real

- **Admin login** — real. Verified server-side by Supabase.
- **Checkout** — simulated. No card details are collected. Before taking
  real payments, integrate a provider like Stripe Checkout (has a free
  tier for testing and only takes a cut per real transaction).
- **Product catalog / cart** — stored in the browser's `localStorage`.
  Fine for a single-device or single-till setup; if you want the catalog
  to sync across devices, move `products` into a Supabase table instead
  of localStorage (ask for this as a follow-up).

## File structure

```
src/
  App.jsx                     top-level state + navigation
  supabaseClient.js           Supabase connection (paste your keys here)
  components/
    Storefront.jsx            browsing + category filters
    Cart.jsx                  cart view
    Checkout.jsx              simulated payment form
    AdminLogin.jsx            password + email-code login
    AdminDashboard.jsx        admin shell
    InventoryManager.jsx      camera capture + add/delete products
  data/sampleProducts.js      starter catalog
  styles.css
```

Ask for any tweak by file name — e.g. "update InventoryManager.jsx to add
a stock-count field" — and it'll come back as just that file.
