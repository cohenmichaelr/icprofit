# ICProfit

Marketing site for ICProfit, a CPA-led accounting firm serving law firms.
Static HTML, CSS and JavaScript. **No build step** — what is in the repo is
what is served.

## Never push without being asked

**Pushing publishes.** A push to `master` deploys to www.icprofit.com within a
minute, so there is no staging step and no undo before the public sees it.

Do not run `git push` unless the user explicitly asks — "publish", "push it",
"make it live". Their asking for a change is not permission to publish it.

Making changes locally and committing them is fine. Stop before the push, say
plainly that the work is local and not yet live, and wait.

When work is finished but unpublished, say so clearly rather than describing it
as done — "verified locally, not yet live" is the honest phrasing.

## Deploying

- Live at **https://www.icprofit.com**
- **Pushing to GitHub deploys it.** Cloudflare is connected to
  `cohenmichaelr/icprofit` and rebuilds on every push to `master`. Usually live
  within a minute.
- The Cloudflare project is a **Worker** (`icprofit`), not Pages, so custom
  domains live under the worker's Domains & Routes, not a Pages project.
- Do not edit files in the Cloudflare dashboard — a deploy overwrites them.
- The local folder is `icprofit-redesign`; the GitHub repo is `icprofit`.
  Same thing, different names.

Note the contrast with cohenmr.com, which does **not** auto-deploy and needs
`netlify deploy --prod` as a separate step. Don't assume one behaves like the other.

## Verifying after a deploy

Check the live URL, not just localhost. Cloudflare takes a minute and it is easy
to report something as done when only the local copy changed.

Use `curl` for checks. Cloudflare's bot protection returns **403** to Python's
`urllib` and similar default user agents, which looks like a broken page but
isn't.

Local preview: `.claude/launch.json` config `icprofit-redesign`, port 4180.

## Content rules

- **Do not take content from `Projects\ICProfit`.** It is a mirror of the old
  live site and is off limits as a source. `Projects\ICProfit-Ledger`,
  `NEW_IC_PROFIT` and `icprofit-original` are likewise not sources.
- Pricing figures on `pricing.html` are **placeholders**, not real rates.
- Real contact details: `info@icprofit.com`, (561) 404-0060, 1489 W. Palmetto
  Park Rd., Suite 500-200, Boca Raton, FL 33486.

## Contact and booking

`contactus.html` is just a hero: the "Contact us directly" box (with a
Schedule a Consultation button) on the left and the office photo
(`assets/office.jpg`) on the right. There is no form; the FormSubmit form was
removed and lives in git history if it is ever wanted back.

- Consultations are booked through **Microsoft Bookings**. Every "Schedule a
  Consultation" button links straight to it and opens in a new tab. The URL appears on every page and in
  `tools/gen-areas.py`, so change it everywhere at once.
- "Contact Us" in the header, "Request a Quote", "Get Your Flat Quote" and
  "Ask a Question" go to `contactus.html`.
- `schedule.html` is a noindex forwarder to `contactus.html` for old links.

## CSS conventions (`css/style.css`)

- **Keep it readable and commented. Do not minify.** It goes over the wire at
  roughly 10KB brotli against 42KB raw, so minifying saves about 3.8KB and costs
  the comments explaining the non-obvious fixes.
- Dark mode overrides **semantic tokens only** (`--bg`, `--surface`, `--text`,
  `--heading`, `--border`, `--strip-*`). `--charcoal` stays fixed because it is
  the text colour on gold and coral chips, which stay light in both themes.
- The dark palette is **deliberately duplicated** across the
  `prefers-color-scheme` media query and the `[data-theme="dark"]` rule. Plain
  CSS cannot share a declaration block across that boundary. Edit both together.
- `.theme-switching` suppresses transitions for one frame during a theme flip.
  Chrome does not re-resolve a transitioned property when the custom property
  behind it changes, which strands text at the previous colour. Don't remove it.
- Grid children carry `min-width: 0`. Without it a wide child (a nowrap table)
  inflates its whole track past the container and the page scrolls sideways.
- Copy on ledger paper sits on white `.panel` surfaces so the ruling never runs
  behind text.

## Service area pages

`areas/<city>/index.html`, one directory per city, so the URLs resolve without a
`.html` extension (`/areas/boca-raton-fl`).

Copy is written **per city** rather than templated with the name swapped — near
identical city pages get discounted by search engines. Each carries its own
title, meta description, canonical URL and `AccountingService` structured data.

Adding a city means adding an entry to `CITIES` in `tools/gen-areas.py`,
running it, adding the URL to `sitemap.xml`, and adding a card to the index.
The generator rewrites every page under `areas/` wholly, so edit the script
rather than the pages.

These pages are reached from the footer and from `areas/index.html`, not from
the header. Putting them in the About Us drop-down was tried and undone.

`areas/nationwide/` is the same furniture without a city: it covers remote
work for firms in any state, and its middle section is about state-by-state
trust rules rather than a local practice mix.

## Open items

- The old site is still public at `cohenmichaelr.github.io/icprofit-original`,
  including its own `/areas/` pages, and competes with this one in search.
- Pricing figures still need replacing with real rates.
