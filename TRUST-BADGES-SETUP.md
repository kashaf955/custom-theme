# Trust Bar & Policy Pages — What Was Added & What You Still Need To Do

Based on the competitor review (4statetrucks.com, Raneystruckparts.com, Bigrigchromeshop.com),
chromeworldtrucks.com had one line of promo text ("Unbeatable prices - guaranteed! We also
price match.") and nothing else in the header — no visible returns policy, no order tracking
link, no security signal. Competitors show 4-5 of these before a visitor even scrolls.

## What's now live in the theme

A new dark bar sits directly under the phone/email strip, above the logo row, on every page:

`[ Best Price Guarantee ]  [ Easy 30-Day Returns ]  [ Track Your Order ]  [ Secure Checkout ]`

They're also linked as plain text in the very top strip (same row as "Contact Us" / "About Us"),
so there are now two places in the header pointing to each page — the icon badge below, and a
plain text link above.

Files touched:
- `templates/components/halothemes/header/cwt-trust-bar.html` (new)
- `templates/components/halothemes/header/header-layout-2.html` (includes it)
- `templates/components/common/navigation-2.html` (added "Price Match Guarantee" and
  "Easy Returns" text links next to Contact Us / About Us)
- `assets/scss/_chrome-world.scss` (`.cwt-trust-bar` + `.cwt-policy*` styles, matching the
  site's existing black/gold system)

Two of the four badges only needed theme code and are done:
- **Track Your Order** → links to the existing BigCommerce order-history page. No setup needed.
- **Secure Checkout** → a static (non-clickable) trust signal. No setup needed.

I deliberately **left out Financing and Loyalty Program badges** (both appear on
4statetrucks.com) since you confirmed neither exists yet for Chrome World Trucks. Publishing
badges for programs that don't exist would hurt trust more than it helps, and Google penalizes
unverifiable claims. Worth revisiting if you ever add either later.

## Correction: "Easy 30-Day Returns" already exists — I checked the live site

I originally assumed this page didn't exist and drafted placeholder policy text. That was
wrong — **`chromeworldtrucks.com/easy-returns/` is already live** with a real policy (30-day
refund window, store credit after that with no expiration, a "Start My Return" button, etc.).

So for returns, there's nothing to create — the header links now point straight to
`/easy-returns/`. What's left is **restyling the existing page** so it matches the rest of the
site instead of whatever default formatting it has now.

**[`policy-pages/return-policy.html`](policy-pages/return-policy.html)** is a full rewrite using
your actual current policy (I pulled the exact wording from the live page — 30-day refund
window, disassembly/packaging conditions, the store-credit-vs-refund choice, the custom-order
exclusion, the exchange policy, all of it) redesigned with icon step cards, a conditions
checklist, and two "Start My Return" callouts, matching the site's black/gold brand.

**To apply it:** go to **BigCommerce Admin → Storefront → Web Pages**, open the existing
"Easy Returns" page, switch the content editor to **source/HTML code view** (the `<>` icon —
pasting into the visual editor directly tends to strip the CSS classes), replace the existing
content with the full contents of `policy-pages/return-policy.html`, and save. Don't add your
own `<h1>` — the theme already renders the page title above the content automatically.

## Price Match Guarantee still needs to be created — I checked, it's a genuine 404

Unlike the returns page, `/price-match-guarantee/` and a couple of likely alternate URLs don't
exist on the live site. This one's still a placeholder draft (7-day match window, "authorized
retailer only," clearance exclusions) since you don't have a written policy for this yet —
same as before.

**[`policy-pages/price-match-guarantee.html`](policy-pages/price-match-guarantee.html)** is
ready to paste.

### Steps to publish it

1. **BigCommerce Admin → Storefront → Web Pages → Create a Web Page**, name it
   "Price Match Guarantee."
2. Switch to source/HTML code view, paste the full contents of
   `policy-pages/price-match-guarantee.html`, save.
3. Check the URL BigCommerce assigns. If it isn't exactly `/price-match-guarantee/`, update the
   two places that link to it — `templates/components/halothemes/header/cwt-trust-bar.html` and
   `templates/components/common/navigation-2.html` — or tell me the real URL and I'll fix them.

### What to double-check before it goes live

The draft uses conservative, industry-standard placeholders, not your actual policy: a 7-day
window to request a match, "authorized retailer only" (excludes marketplace resellers/auctions),
and exclusions for clearance/closeout items. Reasonable defaults so the page reads correctly
today — but yours to adjust before you treat it as an enforceable policy.

## Why this matters for Google Ads specifically

Google's Quality Score looks at landing page experience — including whether the page backs up
what the ad promises. A visible, linked, real returns/guarantee policy is one of the concrete,
checkable trust signals competitors already have. Fixing the returns page's styling and filling
in the price-match page closes that gap without claiming anything that isn't true.
