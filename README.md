# Veygrit Taiwan address-candidate adapter

`@veygrit/address-adapter-tw` maps a caller-obtained Taiwan postal lookup
response into advisory address candidates. It is not an address-verification,
delivery, recipient, or legal-service system.

The package has no network client and stores no authentication material. A
production connector needs a separately approved Chunghwa Post integration,
explicit user consent, current terms review, and rate limits before it sends
address text outside the device or service boundary.

## Install

```bash
npm install @veygrit/address-adapter-tw
```

## Use

```js
import { createTaiwanPostalCandidates } from "@veygrit/address-adapter-tw";

const candidates = createTaiwanPostalCandidates(providerJson, {
  observedAt: new Date().toISOString(),
});

// Candidate values require user confirmation before a save.
console.log(candidates[0].manualReviewRequired); // true
```

## Contract

The official 3+3 postal-code interface documents a request-to-address lookup
flow and response fields for address and postal code. This package only maps
such a response to a source-tagged candidate; it does not make requests and
does not bundle the postal dataset.

Every candidate has source metadata, `observedAt`, field-level evidence, a
non-numeric confidence class, and `manualReviewRequired: true`.

It never declares an address valid, deliverable, current, owned, or suitable
for legal service. It never infers a recipient, building unit, floor, or room.

## Data and licence boundary

Fixtures are synthetic. No Chunghwa Post address record, AFMT profile, or
personal address is distributed here. The government open-data catalogue lists
a 3+3 postal-code dataset under Taiwan's Open Government Data License 1.0, but
this package does not copy that data. See [SOURCES.md](./SOURCES.md) before
adding any dataset or live connector.

## Development

```bash
npm test
```

## Licence

Apache-2.0. See [LICENSE](./LICENSE).
