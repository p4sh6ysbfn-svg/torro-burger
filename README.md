# TORRO BURGER

Burger shop site: video intro, a "CHERRY BURGER" hero, a 76-item menu with real
dish photography, a cart, and the locations block.

**Live site:** https://cherry-crav.vercel.app

The repo is self-contained — code, every photo, the fonts and the menu data are
all in here. No API keys, no files to get from anywhere else.

## Run it

You only need `git` and `python3` (which ships with macOS and Linux):

```bash
git clone https://github.com/p4sh6ysbfn-svg/torro-burger.git
cd torro-burger
python3 -m http.server 5173
```

Opens at http://localhost:5173

No build step — it's plain HTML + CSS + JS. Any other static server works too
(`npx serve`, `php -S localhost:5173`, VS Code Live Server). Just don't open
`index.html` over `file://`: absolute links like `/menu/` break and the cart
stops persisting.

## Pages

| Route | What's there |
|---|---|
| `/` | Landing: intro video → hero → menu (76 items) → locations → footer |
| `/menu/` | Cards for six signature burgers with add-to-cart |
| `/contact/` | Contact form and addresses |
| `/spices/` | Ingredients |

## Layout

```
index.html              landing
menu/ contact/ spices/  inner pages
assets/
  css/style.css         all layout and animation
  js/cart.js            cart (localStorage, key: torro_cart)
  js/main.js            preloader, cursor, reveal animations, page transitions
  js/lenis.min.js       smooth scrolling
  fonts/                Modak + Mouse Memoirs (latin, latin-ext)
  img/                  decor and hero
  img/menu/             76 dish photos
  video/loader.mp4      intro video
```

## Rebuild it from scratch

[`PROMPT.md`](PROMPT.md) is a single self-contained prompt (written in Russian):
paste the whole thing into Claude Code or Cursor and the site gets rebuilt from
nothing — it downloads every asset and contains the full source. It also carries
the design spec, a verification checklist and deployment notes.

## Deploy

```bash
npx vercel deploy --prod --yes
```

Netlify, GitHub Pages and Cloudflare Pages work the same way — there is nothing
to build.
