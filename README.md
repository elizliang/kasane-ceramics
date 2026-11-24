# KASANE ceramics storefront

KASANE is a static, single-page Japanese luxury ceramics concept. It needs a modern browser with JavaScript enabled. There is no package install, build step, server, API key, or account required to preview it.

## Run locally

1. Keep these five files together in one folder: `index.html`, `styles.css`, `membership-config.js`, `app.js`, and `memberships.js`.
2. Open `index.html` in a browser. Double-clicking it works; on macOS you can also run `open index.html` from this folder.
3. Use the Shop and Memberships links in the header. All sections live in `index.html`.

The core site runs from `file://`. Google Fonts are requested for Cormorant Garamond and Manrope; if you are offline or the request is blocked, the page uses system font fallbacks. The Instagram link is a placeholder external link.

## What works in the preview

- Filter the 12 sample products, open their details, and add available pieces to the cart. The cart saves quantities in this browser's `localStorage` when storage is available.
- Create a browser-local member profile, sign up for one of three sample service shifts, and mark it completed. Recorded hours appear in the member balance.
- Apply recorded hours at $15 per hour to either a ceramics cart or a monthly membership estimate. The credit is capped at the order or plan price. Click **Simulate checkout** to see the amount due and unused hours. This preview never charges a payment method or deducts hours.
- Enter an email in the newsletter form to see validation feedback. No address is collected or sent.

For example, one completed two-hour shift gives $30 of sample credit, making the $80 Open Studio membership estimate $50. The alternative reward of extra studio time is described on the page but is not redeemable in this preview. All sample terms require studio confirmation, and recorded shifts are self-reported here.

## Edit the concept

- **Brand, currency, and free-shipping threshold:** edit `STORE` at the top of `app.js`. KASANE is a placeholder name; the current sample threshold is $200.
- **Products and glazes:** edit `PRODUCTS` and `GLAZES` near the top of `app.js`. Product names, prices, stock, sizes, descriptions, and artwork are illustrative. `stock: 0` marks an item sold out.
- **Photos:** add files under an `images/` folder and set a product's `image` field to a relative path such as `images/tea-cup.jpg`. Without a photo, the site draws a local SVG vessel.
- **Membership plans, rates, and shifts:** edit `MEMBERSHIP` in `membership-config.js`. The store cart and membership estimates share this configuration.
- **Story, policies, and other page copy:** edit `index.html`.
- **Colors, type, and layout:** edit `styles.css`. Design tokens are at the top of the file.

## Before taking real orders

`STORE.checkoutUrl` is empty by default, so the cart button only runs a simulation. You can set it to a hosted payment link for a fixed offer, but that link will **not** receive the cart's exact products, quantities, or service-hour credit. When credit is selected, the preview does not redirect to that link.

Real cart checkout needs a payment backend or commerce platform that receives the actual order. Real service credit also needs member accounts, approved shifts, a durable hours ledger, and a checkout endpoint that validates and consumes credit once. The newsletter needs an email provider. Product details, shipping and care policies, and membership terms should be replaced with confirmed information before launch.

## Publishing

Upload the five runtime files together, plus any images you add, to a static hosting service. Keep their relative paths unchanged. `README.md` and `AGENTS.md` document the project but are not needed by the browser.
