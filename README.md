# ZipSchedules purchase flow — front-end handoff (v11: v7 flow + Plum POS hardware)

## What changed in v11 — Plum POS hardware
- **Products** gains a **Plum POS hardware** section with Plum's product photos (`assets/img/hardware/`):
  POS Terminal, Handheld, PAX A35 Payment Terminal, Self-Service Kiosk, Receipt Printer, Cash Drawer, Scanner,
  Zip Tunes Player, plus KDS and Time Clock (illustrations until photos are supplied).
- **Filters:** a **Hardware** tab and type chips with counts (All, Counter & POS, Payments, Mobile & self-order,
  Kitchen, Accessories, Guest experience, Time & attendance). Search covers apps and hardware.
- **Quantity:** **Add** becomes a − / qty / + stepper (1–99, typed values allowed, − at 1 removes); also in the
  order summary. Adding hardware uses the same email prompt as apps.
- **Billing:** apps monthly, hardware one-time. Total due today = apps + hardware − discount, shown on products,
  the registration "Your order" panel, the checkout order panel, the **Review and pay** amount summary and the
  **Pay** button. The success message lists the hardware order.
- **Data:** `HARDWARE` / `HARDWARE_GROUPS` in `app.js`; cart stores `{ id: qty }` under `hardware`;
  `api.submitPayment` receives `hardware`.
- **Before launch:** hardware prices are placeholders with an "Est." tag (set real prices, then
  `HARDWARE_PRICES_FINAL = true`); confirm the Zip Tunes Player copy; add KDS and Time Clock photos;
  hardware shipping/tax aren't calculated yet.


## What changed in v7

- **Registration page restyled to the approved mockup.** Altametrics logo lockup; left-aligned headline with
  "get started." in light blue; "Your order" panel with an icon per app and a bold Due today total; restaurant
  POS photo; deeper navy gradient with soft arcs. On the right: larger form card, bold navy labels, amber
  start-of-week note, "Back to cart" as a blue link and **Continue →** as the primary button.
- **New local assets** in `assets/img/`: `registration-staff.jpg` and `altametrics-mark.png`, both cropped from the
  mockup. Replace them with the high-resolution originals (and the logo SVG) before launch.


## What changed in v6

- **Real Altametrics imagery, no placeholders.** Every image now loads from altametrics.com:

  | Page | Image | Source page |
  |------|-------|-------------|
  | Landing hero | Altametrics dashboard + "AI Schedule Optimized" card | altametrics.com |
  | Landing, Labor Forecasting card | AI forecasting visual | altametrics.com |
  | Landing, Comply with labor laws | Precision workforce management | altametrics.com |
  | Landing, Mobile app | Scheduling app on a phone | restaurant-inventory.html |
  | Landing, Testimonials | Steve Cale, Kevin Coveney, Steven Floar portraits + quote excerpts | altametrics.com, workforce-scheduling.html, restaurant-forecasting-software.html |
  | Products, Order summary | Nadia Lynn testimonial + customer logos | restaurant-inventory.html, altametrics.com |
  | Registration brand panel | Enterprise multi-location reporting | altametrics.com |
  | Checkout | Customer logo trust panel | altametrics.com |
  | Manage | "Get more from Altametrics" cards: AI Forecasting, Food Safety & Checklists, Enterprise Reporting | altametrics.com |

  If an image can't load, `app.js` swaps in a branded panel showing the image's description,
  so a layout never shows a broken-image icon.
- **Palette** follows current Altametrics product screens: vivid blue `#1554d1` for actions,
  navy `#0b1d3a` for app chrome and dark sections, violet `#7b5cff` reserved as the AI accent.
  Tokens are at the end of `style.css` (`v6` section) and override the earlier values.
- **Resolution.** Checked with no horizontal scroll on every page at 320, 375, 414, 768, 1024, 1280, 1366,
  1440, 1920 and 2560 px. Containers widen to 1400 px at ≥1600 and 1560 px at ≥2200.
- **Testimonials** are short excerpts of quotes published on altametrics.com (the placeholder "John Doe"
  quotes and star ratings are gone). Confirm you're cleared to use them on ZipSchedules pages.
- **Before launch:** copy the images to your own CDN rather than hot-linking altametrics.com.


## What changed in v2 (UI pass, aligned with altametrics.com)

- **One brand system.** A single primary blue (`#00457f`, the Altametrics app-bar blue) across every page;
  amber only for "Popular"; green only for the final Pay action and success states. The three competing blues are gone.
- **Checkout header with progress.** Products, registration and checkout share a focused header: wordmark,
  a 4-step progress tracker (Choose apps, Create account, Verify email, Payment, modelled on the numbered steps on
  altametrics.com/restaurant-pricing) and the support line (800) 676-1281. Marketing nav is removed inside the funnel.
- **Landing.** Buy Now in the header, reassurance line under the hero CTAs, and an "Altametrics suite" trust strip
  using customer logos hosted on altametrics.com.
- **Products.** Compact app cards (icon, category, description, price, Add), a Popular badge, segmented filters,
  an "Added" state, and an order summary with app icons and a secure-checkout note.
- **Registration.** Order recap in the brand panel, a titled form card, the start-of-week note as an info callout,
  "Back to cart" as a quiet text link, and the email address shown on the verify step. The language selector no longer
  overlaps the form.
- **Checkout.** Verified-account card, payment method as a selectable tile, order summary with an Edit link.
- **Payment dialogs.** "Step x of 3" progress, accepted-card chips that highlight the detected brand, a brand tag
  inside the card field, a CVV hint, a "Secured by CSG Forte" note, and "Pay $xx.xx" on the final button.
  On phones the dialogs open as bottom sheets.
- **Result and manage.** A real success state (icon, the apps purchased, order number, receipt email) and a
  subscription card with status. Unsubscribe now uses a designed confirmation dialog instead of `window.confirm`.
- **Footers** link to the real Altametrics Terms of Use, Privacy Policy and Sales and Refunds pages.


Static HTML/CSS/JS for the full flow in `Flow.docx`. No framework, no build step.
Open `index.html` in a browser (or serve the folder) and click **Buy Now** to walk the whole flow.

## Flow

| # | Page | What happens | Next |
|---|------|--------------|------|
| 1 | `index.html` | Landing page. **Buy Now** (hero + CTA) opens the email dialog. | Email saved, ZipSchedules added to cart → `products.html` |
| 2 | `products.html` | Catalog + **Order Summary**. **Add** puts an app in the cart; ✕ removes it. | **Continue to Checkout** → `registration.html` (or `checkout.html` if already verified) |
| 3 | `registration.html` | Step 1 account details → **Next** sends a code. Step 2 six-digit verification. | **Verify** → `checkout.html` |
| 4 | `checkout.html` | Payment method, discount code, order total. **Place Order** opens: Payment Details → Billing Information → Review (Altametrics LLC) → **Pay** → Payment Message. | **Ok** → `manage.html?app=<id>` |
| 5 | `manage.html` | Manage subscription (plan card, Unsubscribe). | — |

Preview the checkout on its own with `checkout.html?demo=1` (seeds a two-item cart).

## Files

```
index.html            landing page + email dialog
products.html         catalog + order summary (+ mobile cart bar)
registration.html     account details + email verification
checkout.html         checkout + payment / billing / review / message dialogs
manage.html           manage subscription
assets/css/style.css  all styles; tokens at the top, one section per page
assets/js/app.js      state, catalog, validation, dialogs, API stubs
```

## Where to connect the backend

Everything is in `assets/js/app.js`:

- **`CATALOG`** — product ids, names, prices, images, categories. Replace with an API response.
- **`api.*`** — every network call, currently stubs that resolve success:
  `saveEmail`, `registerAccount`, `sendVerificationCode`, `verifyCode`, `applyDiscount`,
  `tokenizeCard`, `submitPayment`, `unsubscribe`.
- **`store`** — flow state in `sessionStorage` (`zs_flow_v1`): email, cart, account, verified,
  billing, payment token + brand/last4/expiry, purchased. **Card numbers and CVV are never stored.**
- `window.ZipFlow` exposes `{ api, store, catalog }` for debugging.

### Payments (important)
The Payment Details dialog is built as plain inputs so the UI is complete. In production, card
data must be captured by **CSG Forte's hosted fields / Forte Checkout**, not posted to your own
servers — otherwise the site falls into PCI DSS SAQ D scope. Swap the three card inputs for Forte's
fields and have `api.tokenizeCard` return Forte's token. The Review dialog only uses brand, last 4
and expiry.

### Third-party placeholders
- reCAPTCHA (registration) — replace `.captcha-ph` with the real widget; send the token in `registerAccount`.
- Accepted-card logos (payment dialog) — `.card-brands__ph`.
- Logos: the header, registration panel and manage app bar use a text wordmark (`.wordmark`). Swap in the official SVG logo.
- Customer logos and page imagery load from altametrics.com; app icons from `agcdn.altametrics.com`.
  Move them to your CDN before launch.

## Open questions from the design (need a decision)

0. **Copy changed in v2** — success/unsubscribe messages, page titles ("Add apps to your plan",
   "Create your account"), button labels ("Continue", "Go to My Apps") and the completed product descriptions
   in `CATALOG`. Review with marketing.
1. **Landing page copy** — the landing screenshot is 240 px wide, so body copy (feature cards,
   5 Ways, testimonials) was transcribed as closely as it could be read. Verify against the source.
2. **Testimonials** — now real excerpts from altametrics.com; confirm usage rights for ZipSchedules.
3. **Recurring vs one-time authorization** — Review says "one-time electronic payment", but every
   item is a monthly subscription. Confirm wording with legal/Forte.
4. **Accepted cards** — chips show Visa, Mastercard, Amex, Discover. Match them to your Forte account.
5. **Manage page** — shows the purchased app and its price; the plan name "Professional" is still static.
6. **Total Due Today vs monthly** — the cart shows the first month as due today. Confirm proration rules.
7. **Category tabs** — Recommended / Food / Workforce mapping is illustrative (`category` in `CATALOG`).
8. **Zip Tunes image** — the design uses the ZipSchedules icon for Zip Tunes.
9. **"Option 2"** in the catalog header nav is a placeholder label.
10. **Free mobile apps** — the hero says "Free iPhone and Android apps" (from altametrics.com pricing). Confirm for ZipSchedules.
11. **Sample personal data** — the billing/review screenshots contain a real-looking name, phone and
    email; these were replaced with neutral placeholders.

## Behaviour added where the design was silent
- Inline validation messages on every form (Luhn check, expiry, CVV length, ZIP, email).
- Loading states on async buttons; resend code throttled to 30 s.
- "Added" state on catalog cards; empty-cart message and disabled checkout when the cart is empty.
- Mobile/tablet: hamburger menus, and a bottom cart bar on the catalog (per DESIGN.md "sidebars reflow
  into bottom-anchored sheets").

## Breakpoints
1440 / 1280 desktop, 1024 tablet-landscape, 768 tablet, 375 mobile. Respects `prefers-reduced-motion`.
