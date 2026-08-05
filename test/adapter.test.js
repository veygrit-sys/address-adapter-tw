import assert from "node:assert/strict";
import test from "node:test";

import {
  COUNTRY_CODE,
  buildTaiwanPostalLookupRequest,
  createTaiwanPostalCandidates,
} from "../src/index.js";

test("describes a redacted caller-owned Taiwan postal lookup", () => {
  const request = buildTaiwanPostalLookupRequest({ address: "Example City Example District Example Road 1" });

  assert.equal(request.countryCode, "TW");
  assert.equal(request.purpose, "postal-candidate-lookup");
  assert.equal(request.input.address, "Example City Example District Example Road 1");
  assert.deepEqual(request.privacy.doNotSend, [
    "recipientName",
    "phone",
    "email",
    "unitUnlessRequired",
  ]);
});

test("maps a synthetic provider response into an advisory candidate", () => {
  const candidates = createTaiwanPostalCandidates(
    { Address: "Example City Example District Example Road 1", ZipCode: "000000" },
    { observedAt: "2026-08-05T00:00:00.000Z" },
  );

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].countryCode, COUNTRY_CODE);
  assert.equal(candidates[0].status, "candidate");
  assert.equal(candidates[0].manualReviewRequired, true);
  assert.equal(candidates[0].fields.postalCode.value, "000000");
});

test("requires a meaningful record and observation time", () => {
  assert.throws(() => createTaiwanPostalCandidates({}, { observedAt: "2026-08-05T00:00:00.000Z" }));
  assert.throws(() => createTaiwanPostalCandidates({ Address: "Example Road" }, {}));
});
