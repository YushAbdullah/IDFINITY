# IDFINITY

IDFINITY is a free app where anyone can sign up and make their own digital business card. Each card gets:

- its own link, like `your-site/card/aisyah-rahman`
- a **Save to contacts** button that downloads a `.vcf` contact file (works on iPhone and Android, includes the photo)
- Call and WhatsApp buttons
- a QR code (shown on the card and downloadable as a PNG)
- a phone wallpaper image with the person's name and QR code

It is plain HTML, CSS and JavaScript with no build step. [Supabase](https://supabase.com) (free tier) handles sign-in, the database and photo storage. Hosting is free on Netlify or Vercel.

Try the design before setting anything up: open `/card/demo` once it's deployed, or `/edit.html?preview=1` for the editor (preview mode saves nothing).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Landing page and sign-in (Google, or email and password) |
| `edit.html`, `js/edit.js` | Card editor with live preview |
| `card.html` | Public card page, served for every `/card/<name>` link |
| `js/common.js` | Card layout, contact file, QR code and wallpaper image |
| `js/config.js` | Your Supabase URL and key go here |
| `css/app.css` | Styles: mint canvas, Outfit font, white cards (from the IDFINITY design.md) |
| `img/` | Logo, favicon and home-screen icon used by the site |
| `brand/` | Logo files for use elsewhere (SVG and PNG, light and dark) |
| `supabase/schema.sql` | Database table, security rules and photo bucket |
| `vendor/` | Supabase JS 2.118.0 and qrcode-generator 1.4.4 (MIT), so the site doesn't rely on a CDN |
| `netlify.toml`, `vercel.json` | Make `/card/<name>` links work |

## Setup (about 15 minutes)

### 1. Create the Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a new project (free plan). Pick the Singapore region if most users are in Malaysia.
2. Open **SQL Editor → New query**, paste everything from `supabase/schema.sql`, and click **Run**. It creates the `cards` table, the security rules, and the `avatars` photo bucket. It's safe to run again.
3. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key into `js/config.js`. The anon key is meant to be public: the security rules make sure people can only change their own card.

### 2. Deploy the site

**Netlify:** go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**, pick this GitHub repo, leave the build command empty and the publish directory as `.`, then deploy.

**Vercel:** go to [vercel.com/new](https://vercel.com/new), import this repo, choose the "Other" framework preset with no build command, then deploy.

You can rename the free address (for example `ecard-my.netlify.app`) or add your own domain later.

### 3. Tell Supabase your site address

In Supabase, open **Authentication → URL Configuration**:

- **Site URL:** your site address, e.g. `https://ecard-my.netlify.app`
- **Redirect URLs:** add `https://ecard-my.netlify.app/**`

Without this, the sign-in email links won't bring people back to your site.

### 4. Sign-in setup (no emails needed)

People sign in with **Google** or with an **email and password**, so the app doesn't depend on Supabase's built-in email sender, which only sends a couple of emails an hour.

**Turn off email confirmation:** in Supabase, open **Authentication → Sign In / Providers → Email** and switch off **Confirm email**, then save. New accounts can then sign in straight away.

**Turn on Google:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com), create a project (for example "IDFINITY"), and open **APIs & Services → OAuth consent screen**. Choose **External**, fill in the app name and your email, and publish it.
2. Open **APIs & Services → Credentials → Create credentials → OAuth client ID**, choose **Web application**, and under **Authorized redirect URIs** add `https://<your-project>.supabase.co/auth/v1/callback`.
3. Copy the **Client ID** and **Client secret** into Supabase under **Authentication → Sign In / Providers → Google**, turn it on, and save.

`googleSignIn` in `js/config.js` shows or hides the Google button.

### 5. Other things to know

- **Password resets** need email. If many people use passwords, connect a custom email sender later (for example [Resend](https://resend.com) with your own domain) under **Authentication → Emails → SMTP Settings**.
- **Inactivity:** free Supabase projects pause after a week with no activity. Opening the dashboard wakes them up. Regular visitors keep the project active.
- **Free tier limits:** 500 MB database and 1 GB file storage. Photos are resized to 512 × 512 (about 50 KB), so that's room for thousands of cards.

## Logo

The mark is an infinity loop: the left half in mint `#6BE683`, the right half in ink `#262828` (white on dark backgrounds). The wordmark is "idfinity" in Outfit SemiBold, with the dots of the i's in mint. All text is converted to outlines, so the SVGs look the same everywhere.

| File | Use |
| --- | --- |
| `brand/logo.svg`, `brand/logo.png` | Main logo on light backgrounds |
| `brand/logo-dark.svg`, `brand/logo-dark.png` | Main logo on dark backgrounds |
| `brand/icon-dark.svg`, `brand/icon-512.png` | App icon, social profile picture |
| `brand/icon.svg`, `brand/icon-light-512.png` | App icon on a light tile |
| `brand/mark.svg` | Infinity mark alone, transparent |
| `brand/wordmark.svg` | Wordmark alone |

## Security notes

- Row level security in `supabase/schema.sql` lets anyone read **published** cards, and lets signed-in people insert, change or delete only their own row.
- Photos live in `avatars/<user id>/...`, and people can only upload or delete inside their own folder. Uploads are limited to 2 MB JPEG, PNG or WebP.
- Link names are checked in the browser and again by the database (format, length, reserved words like `admin` and `demo`, and uniqueness).
- All card text is escaped before it's shown, and links must be `http` or `https`.
