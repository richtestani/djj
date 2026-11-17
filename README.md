# DJJ

Built from the Lodestar starter.

## Develop

```
npm install
npm run dev
```

Edit files in **src/config/** to change content, pages, and the home page (`site.js` for brand/contact, `nav.js`, `footer.js`, `home.js`, `pages/<slug>.js` for other pages).
Switch the look by changing `theme` in **src/config/site.js** (north, fresh, pulse, harvest, press); colors, type and fonts all follow. Per-site tweaks like an accent color go in **src/themes/overrides.css**. Drop images into **src/assets/images/**.

To add a docs section later, put a Markdown file in **src/content/docs/**; it becomes /docs/<file-name> and /docs appears automatically.

## Build & deploy

```
npm run build   # outputs to /public
```

Upload /public to your host. For SPA routing, copy **deploy/.htaccess** (Apache/Bluehost) into the web root, or use the Nginx rule in **deploy/nginx.conf.txt** (Forge/Vultr).

The build also writes **robots.txt**, **sitemap.xml**, and a fully-rendered `index.html` per page (so search engines see real content, not an empty shell) — no extra step needed. If the domain changes, update `VITE_SITE_URL` in **.env.production**.
