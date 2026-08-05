export const COUNTRY_CODE = "TW";
export const CHUNGHWA_POST_POSTAL_REFERENCE_URL = "https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=208";

const SOURCE = Object.freeze({
  id: "taiwan-chunghwa-post-33-postal-code-interface",
  url: CHUNGHWA_POST_POSTAL_REFERENCE_URL,
  kind: "official-postal-lookup-interface",
});

function cleanText(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

function providerField(value, providerKey) {
  const cleanValue = cleanText(value);
  return cleanValue
    ? {
        value: cleanValue,
        evidence: { providerKey, source: SOURCE.id },
        confidence: "provider-reported",
        manualReviewRequired: true,
      }
    : null;
}

/**
 * Shapes a consent-gated request for a connector whose credentials and use
 * approval remain with the caller. It intentionally accepts no secret.
 */
export function buildTaiwanPostalLookupRequest({ address } = {}) {
  const normalizedAddress = cleanText(address);
  if (!normalizedAddress) throw new TypeError("address is required");

  return Object.freeze({
    countryCode: COUNTRY_CODE,
    purpose: "postal-candidate-lookup",
    requiredSecret: "caller-managed approved provider credential, if required",
    input: Object.freeze({ address: normalizedAddress }),
    privacy: Object.freeze({
      sendOnlyAfterConsent: true,
      doNotSend: ["recipientName", "phone", "email", "unitUnlessRequired"],
    }),
  });
}

/**
 * Maps a `GetZipAddress`-style object. The caller supplies observedAt and is
 * responsible for confirming that the result matches the user's input.
 */
export function candidateFromTaiwanPostalRecord(record, { observedAt } = {}) {
  if (!record || typeof record !== "object") throw new TypeError("record must be an object");
  const observed = cleanText(observedAt);
  if (!observed) throw new TypeError("observedAt is required");

  const address = cleanText(record.Address ?? record.address);
  const postalCode = cleanText(record.ZipCode ?? record.zipCode ?? record.postalCode);
  if (!address && !postalCode) {
    throw new TypeError("record must contain an address or postal code candidate");
  }

  const fields = Object.fromEntries(
    Object.entries({
      address: providerField(address, "Address"),
      postalCode: providerField(postalCode, "ZipCode"),
    }).filter(([, value]) => value !== null),
  );

  return Object.freeze({
    countryCode: COUNTRY_CODE,
    status: "candidate",
    source: Object.freeze({ ...SOURCE, observedAt: observed }),
    fields: Object.freeze(fields),
    confidence: "provider-reported",
    manualReviewRequired: true,
    limitations: Object.freeze([
      "A postal lookup result is not proof of address existence, delivery, recipient, or legal service.",
      "The adapter does not infer administrative subdivisions or a building unit from a postal code.",
      "The caller must check current source terms, consent, rate limits, and result freshness.",
    ]),
  });
}

export function createTaiwanPostalCandidates(payload, options) {
  const records = Array.isArray(payload) ? payload : [payload];
  return records
    .filter((record) => record && typeof record === "object")
    .map((record) => candidateFromTaiwanPostalRecord(record, options));
}
