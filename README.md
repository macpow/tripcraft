# TripCraft — PWA Deployment

Deploy these five files together to get a fully installable web app:

```
index.html      ← the app itself
manifest.json   ← PWA metadata
sw.js           ← service worker (offline support)
icon-192.png    ← app icon (home screen, small)
icon-512.png    ← app icon (splash screen, large)
```

---

## Option A — Netlify (easiest, ~2 minutes)

1. Go to [netlify.com](https://netlify.com) and sign up for free
2. On the dashboard, find the **"Deploy manually"** box at the bottom
3. **Drag this entire folder** onto that box
4. Netlify gives you a URL like `https://random-name.netlify.app`
5. Visit that URL on your phone → tap the browser menu → **Add to Home Screen**

To update the app later: drag the folder again, Netlify deploys the new version.

You can also set a custom subdomain (e.g. `tripcraft.netlify.app`) for free in site settings.

---

## Option B — GitHub Pages (~5 minutes)

1. Create a free account at [github.com](https://github.com)
2. Create a new repository (call it `tripcraft` or anything you like)
3. Upload all five files to the repository
4. Go to **Settings → Pages → Source** and select `main` branch, `/ (root)`
5. GitHub gives you a URL like `https://yourusername.github.io/tripcraft`
6. Visit that URL on your phone → **Add to Home Screen**

To update: replace `index.html` in the repository. Changes deploy in ~30 seconds.

---

## Option C — Cloudflare Pages (~5 minutes)

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create a new project → **Direct Upload**
3. Upload all five files
4. You get a URL like `https://tripcraft.pages.dev`

Cloudflare Pages is very fast and has generous free limits.

---

## Installing on your phone

Once deployed to any HTTPS URL:

**Android (Chrome):**
1. Visit the URL in Chrome
2. Tap the **⋮** menu (top right)
3. Tap **Add to Home screen**
4. Confirm — TripCraft appears on your home screen

**iPhone (Safari):**
1. Visit the URL in **Safari** (must be Safari, not Chrome, for iOS PWA install)
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Confirm

---

## After installing

- The app launches in its own window, no browser chrome
- Works offline after first load (service worker caches everything)
- Trip data is stored in your browser's localStorage — it persists between sessions
- To back up your trip: use Save Trip (⬇) to download a JSON file

## AI features (optional)

The app works fully without AI. To enable AI features:

1. Open the app → tap ☰ menu → **⚙ AI settings**
2. Enter either:
   - An **Anthropic API key** (get one at console.anthropic.com)
   - An **Ollama URL** — `http://localhost:11434` for local, or `https://ollama.com` + API key for Ollama Cloud

API keys are stored only in your browser's localStorage and never sent anywhere except the AI provider.
