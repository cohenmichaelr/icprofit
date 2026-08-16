"""Generate the ICProfit service-area pages.

    python tools/gen-areas.py

Writes areas/index.html and areas/<slug>/index.html for every city in CITIES
below. A directory per city is what makes the URLs resolve without a .html
extension, e.g. /areas/boca-raton-fl.

Rewrites those files wholly, so edit this script rather than the generated
pages — hand edits are lost on the next run.

To add a city: add an entry to CITIES, run this, then add the URL to
sitemap.xml. Write its copy fresh rather than copying another city's with the
name swapped; near-identical pages get discounted by search engines.
"""
import os
import sys

# Run from the project root regardless of where it was invoked from.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
if not os.path.isfile("index.html"):
    sys.exit("expected to run against the site root; index.html not found in %s" % ROOT)

CITIES = [
    dict(slug="boca-raton-fl", city="Boca Raton", county="Palm Beach County",
         lede="Our office is on West Palmetto Park Road, so Boca Raton firms have the shortest line to us of anyone we serve. Bookkeeping, trust compliance and CFO support for practices from solo to multi-partner.",
         local="Boca Raton runs on estate planning, real estate and family work, much of it flat-fee alongside hourly matters. That mix makes per-matter economics easy to lose track of and trust balances easy to misstate.",
         areas=[("Estate Planning and Probate", "Flat-fee plans beside hourly probate work that touches estate funds."),
                ("Real Estate Law", "Closing-driven volume with escrow moving constantly."),
                ("Family Law", "Retainers held in trust, replenished often, collected with difficulty."),
                ("Tax Law", "High rates that only become profit once realization is under control.")]),
    dict(slug="delray-beach-fl", city="Delray Beach", county="Palm Beach County",
         lede="A short drive north of our Boca Raton office. Delray Beach practices are typically solo or small, and that is exactly where clean books and a compliant trust account matter most.",
         local="Smaller firms rarely carry a bookkeeper, so the work lands on the attorney. We take it off your desk without you having to hire anyone.",
         areas=[("Family Law", "Evergreen retainers that need monitoring, not just recording."),
                ("Real Estate Law", "Escrow and closing funds reconciled every month."),
                ("Criminal Defense", "Flat fees, and the earned-versus-unearned line that protects your licence."),
                ("Estate Planning", "Package pricing that should be measured for margin, not guessed at.")]),
    dict(slug="fort-lauderdale-fl", city="Fort Lauderdale", county="Broward County",
         lede="Broward's county seat and the centre of its litigation bar. Trust accounting, bookkeeping and fractional CFO support for Fort Lauderdale firms.",
         local="Contingency and litigation practices carry advanced case costs for months or years before a recovery lands. Tracking those by matter is the difference between knowing your position and hoping.",
         areas=[("Personal Injury", "Case costs advanced per matter, settlements disbursed through trust."),
                ("Maritime and Admiralty", "International clients and multi-currency retainers."),
                ("Civil Litigation", "Work-in-progress and receivables that build long before revenue."),
                ("Employment Law", "Blended hourly and contingency work, measured separately.")]),
    dict(slug="west-palm-beach-fl", city="West Palm Beach", county="Palm Beach County",
         lede="Home of the Palm Beach County courthouse. We keep West Palm Beach firms compliant with the Bar and clear on where their profit comes from.",
         local="Probate and guardianship practices handle funds that belong to someone else, often for years. That is trust accounting at its most consequential.",
         areas=[("Probate and Guardianship", "Estate and ward funds held and reported with care."),
                ("Civil Litigation", "Realization tracked between hours worked, billed and collected."),
                ("Family Law", "Trust retainers and the collections that follow them."),
                ("Criminal Defense", "Flat-fee recognition under Florida Bar rules.")]),
    dict(slug="miami-fl", city="Miami", county="Miami-Dade County",
         lede="Miami practices work across borders and currencies. We give them books that hold up and trust accounts that satisfy the Bar.",
         local="International clients, wire transfers and payment plans make for complicated ledgers. Volume practices in particular live or die on per-case profitability.",
         areas=[("Immigration Law", "High volume, flat fees and payment-plan receivables."),
                ("International Business", "Cross-border retainers and multi-entity reporting."),
                ("Commercial Litigation", "Matter-level profitability across long engagements."),
                ("Real Estate Law", "Escrow reconciliation on a closing-driven calendar.")]),
    dict(slug="coral-gables-fl", city="Coral Gables", county="Miami-Dade County",
         lede="Coral Gables is boutique territory: smaller firms, sophisticated clients, premium rates. We make sure those rates turn into margin.",
         local="Premium billing does not guarantee profit. Where the work is transactional and the clients are institutional, realization and pricing decide the year.",
         areas=[("Corporate and Transactional", "Engagement-level profitability on project fees."),
                ("Intellectual Property", "Flat-fee prosecution and hourly litigation, tracked apart."),
                ("International Tax", "Multi-entity records built for scrutiny."),
                ("Estate Planning", "Plan pricing measured against the work it actually takes.")]),
]

SERVICES = [
    ("Monthly Bookkeeping", "var(--red)",
     "Transactions coded, bank and credit cards reconciled, and bank-ready statements every month on a legal-specific chart of accounts."),
    ("Trust Account Compliance", "var(--coral)",
     "Three-way reconciliation of your IOLTA and client trust accounts, documented the way your state bar expects to see it."),
    ("Tax-Ready Records", "var(--gold)",
     "Books that stay current all year, so your CPA gets clean financials in January instead of a shoebox."),
    ("Fractional CFO", "var(--sage-dark)",
     "Senior financial leadership at a part-time price: projections, pricing, hiring and growth decisions grounded in your numbers."),
    ("Catch-Up Bookkeeping", "var(--red)",
     "Months or years behind? We reconstruct and reconcile the missing periods, correct misclassifications and rebuild client trust ledgers, so you start current."),
]

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://www.icprofit.com/{canon}">
  <link rel="icon" href="{r}logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@600&display=swap" rel="stylesheet">
  <script>(function(){{try{{var t=localStorage.getItem("icprofit-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}}catch(e){{}}}})();</script>
  <link rel="stylesheet" href="{r}css/style.css">
{extra}</head>
<body>

<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="{r}index.html">
      <img class="brand-mark brand-mark--light" src="{r}logo.png" alt="ICProfit - Accounting for Law Firms">
      <img class="brand-mark brand-mark--dark" src="{r}logo-dark.png" alt="" aria-hidden="true">
    </a>
    <nav class="site-nav" id="siteNav">
      <a href="{r}index.html">Home</a>
      <div class="nav-item">
        <a href="{r}about.html">About Us</a>
        <div class="sub-nav">
          <a href="{r}about.html#our-story">Our Story</a>
          <a href="{r}about.html#the-founder">The Founder</a>
          <a href="{r}about.html#how-we-work">How We Work</a>
        </div>
      </div>
      <a href="{r}services.html">Services</a>
      <a href="{r}practice-areas.html">Practice Areas</a>
      <a href="{r}faq.html">FAQ</a>
      <a href="{r}pricing.html">Pricing</a>
      <a class="btn btn-primary" href="{r}schedule.html">Schedule a Consultation</a>
    </nav>
    <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>
  </div>
</header>
"""

FOOTER = """
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-wordmark">ICPROFIT</div>
        <p>An accounting firm serving law firms nationwide. Bookkeeping, trust accounting, advisory, and fractional CFO services.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="{r}about.html">About Us</a></li>
          <li><a href="{r}practice-areas.html">Practice Areas</a></li>
          <li><a href="{r}areas/">Service Areas</a></li>
          <li><a href="{r}faq.html">FAQ</a></li>
          <li><a href="{r}pricing.html">Pricing</a></li>
        </ul>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="{r}services.html#trust-compliance">Trust Compliance</a></li>
          <li><a href="{r}services.html#bookkeeping-accounting">Bookkeeping and Accounting</a></li>
          <li><a href="{r}services.html#advisory-cfo">Advisory and Fractional CFO</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:info@icprofit.com">info@icprofit.com</a></li>
          <li><a href="tel:+15614040060">(561) 404-0060</a></li>
          <li>1489 W. Palmetto Park Rd.<br>Suite 500-200<br>Boca Raton, FL 33486</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 ICProfit. All rights reserved.</span>
      <span>Not legal, tax, or accounting advice.</span>
      <button class="theme-toggle" type="button" id="themeToggle"
              aria-label="Switch to dark theme" title="Toggle dark mode"><span class="icon-moon" aria-hidden="true">&#9790;</span><span class="icon-sun" aria-hidden="true">&#9728;</span></button>
    </div>
  </div>
</footer>

<script src="{r}js/main.js"></script>
</body>
</html>
"""


def jsonld(city, county, slug):
    return (
        '  <script type="application/ld+json">\n'
        '  {\n'
        '    "@context": "https://schema.org",\n'
        '    "@type": "AccountingService",\n'
        '    "name": "ICProfit",\n'
        f'    "description": "Bookkeeping, trust accounting and fractional CFO services for {city} law firms.",\n'
        f'    "url": "https://www.icprofit.com/areas/{slug}",\n'
        '    "telephone": "+1-561-404-0060",\n'
        '    "email": "info@icprofit.com",\n'
        '    "address": {\n'
        '      "@type": "PostalAddress",\n'
        '      "streetAddress": "1489 W. Palmetto Park Rd., Suite 500-200",\n'
        '      "addressLocality": "Boca Raton",\n'
        '      "addressRegion": "FL",\n'
        '      "postalCode": "33486",\n'
        '      "addressCountry": "US"\n'
        '    },\n'
        f'    "areaServed": {{ "@type": "City", "name": "{city}", "containedInPlace": "{county}, Florida" }}\n'
        '  }\n'
        '  </script>\n'
    )


R2 = "../../"
R1 = "../"
os.makedirs("areas", exist_ok=True)

for c in CITIES:
    os.makedirs(os.path.join("areas", c["slug"]), exist_ok=True)
    svc = "\n".join(
        '      <div class="service-card" style="--tier: %s;">\n        <h3>%s</h3>\n        <p>%s</p>\n      </div>'
        % (col, name, body) for name, col, body in SERVICES)
    areas = "\n".join(
        '      <div class="practice-card">\n        <h3>%s</h3>\n        <p>%s</p>\n      </div>'
        % (n, b) for n, b in c["areas"])

    body = """
<section class="page-hero ledger">
  <div class="container">
    <p class="kicker">Service Areas</p>
    <h1>Bookkeeping &amp; CFO Services for <span class="accent">{city}</span> Law Firms</h1>
    <p class="lede">{lede}</p>
    <div class="stripe-rule" aria-hidden="true">
      <span class="s-red"></span><span class="s-coral"></span><span class="s-gold"></span><span class="s-sage"></span>
    </div>
  </div>
</section>

<section class="section ledger">
  <div class="container">
    <div class="section-head centered">
      <p class="kicker">This Is Where We Work</p>
      <h2>What we handle for {city} firms</h2>
    </div>
    <div class="service-grid">
{svc}
    </div>
  </div>
</section>

<section class="section ledger ledger--deep">
  <div class="container">
    <div class="section-head centered">
      <p class="kicker">{county}</p>
      <h2>{city} practice areas we serve</h2>
      <p class="lede">{local}</p>
    </div>
    <div class="practice-grid">
{areas}
    </div>
    <p class="center mt-3"><a href="{r}areas/">See all service areas &rarr;</a></p>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>The next step: talk to Ivy</h2>
    <p>A free, no-obligation conversation about where your {city} practice stands today &mdash; your billing, your trust accounts, and what is not working.</p>
    <a class="btn btn-light" href="{r}schedule.html">Schedule a Consultation</a>
  </div>
</section>
""".format(city=c["city"], lede=c["lede"], local=c["local"],
           county=c["county"], svc=svc, areas=areas, r=R2)

    html = (HEAD.format(
        title="%s, FL Law Firm Bookkeeping &amp; CFO Services | ICProfit" % c["city"],
        desc="Bookkeeping, trust account compliance and fractional CFO services for %s, Florida law firms. CPA-led, serving %s." % (c["city"], c["county"]),
        canon="areas/%s" % c["slug"], r=R2,
        extra=jsonld(c["city"], c["county"], c["slug"]))
        + body + FOOTER.format(r=R2))
    with open(os.path.join("areas", c["slug"], "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

cards = "\n".join(
    '      <div class="practice-card">\n'
    '        <h3><a href="%s/">%s, FL</a></h3>\n'
    '        <p>%s</p>\n'
    '        <p class="focus"><strong>%s</strong><a href="%s/">Bookkeeping &amp; CFO services in %s &rarr;</a></p>\n'
    '      </div>' % (c["slug"], c["city"], c["lede"], c["county"], c["slug"], c["city"])
    for c in CITIES)

idx_body = """
<section class="page-hero ledger">
  <div class="container">
    <p class="kicker">Service Areas</p>
    <h1>Serving <span class="accent">South Florida</span> law firms</h1>
    <p class="lede">Based in Boca Raton, working with law firms and attorneys across the United States. These are the South Florida markets we know best &mdash; the courts, the practice mixes, and the way each one bills.</p>
    <div class="stripe-rule" aria-hidden="true">
      <span class="s-red"></span><span class="s-coral"></span><span class="s-gold"></span><span class="s-sage"></span>
    </div>
  </div>
</section>

<section class="section ledger">
  <div class="container">
    <div class="practice-grid">
{cards}
    </div>
    <div class="note-box mt-3">
      <p><strong>Not in South Florida?</strong> All of our work runs remotely through secure cloud accounting, so distance is not an obstacle. Trust rules vary by state, and we shape the reconciliation work to your state bar's requirements.</p>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="container">
    <h2>Let's talk about your practice</h2>
    <p>Tell us where you are and how you bill. We'll tell you plainly what your books should look like.</p>
    <a class="btn btn-light" href="{r}schedule.html">Schedule a Consultation</a>
  </div>
</section>
""".format(cards=cards, r=R1)

with open(os.path.join("areas", "index.html"), "w", encoding="utf-8") as f:
    f.write(HEAD.format(
        title="Service Areas | ICProfit - Law Firm Accounting in South Florida",
        desc="ICProfit serves law firms in Boca Raton, Delray Beach, Fort Lauderdale, West Palm Beach, Miami and Coral Gables, and nationwide.",
        canon="areas/", r=R1, extra="") + idx_body + FOOTER.format(r=R1))

print("created:")
for root, _dirs, files in os.walk("areas"):
    for fn in sorted(files):
        p = os.path.join(root, fn).replace("\\", "/")
        print("  %-42s %7d bytes" % (p, os.path.getsize(p)))
