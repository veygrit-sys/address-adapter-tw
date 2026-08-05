# Source register

No provider data is bundled. The following official materials only define the
candidate-response boundary and source policy.

| Source | Intended use | Data copied | Review status |
| --- | --- | --- | --- |
| [Chunghwa Post 3+3 postal-code lookup](https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=208) | Postal lookup availability and its stated mailing-reference limitation | None | Interface reviewed on 2026-08-05; a production connector requires current approval, credential, terms, rate-limit, retention, and attribution review |
| [3+3 postal-code interface specification](https://www.post.gov.tw/post/download/3%2B3%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E7%B3%BB%E7%B5%B1%E4%BB%8B%E9%9D%A2%E8%A6%8F%E6%A0%BC%E6%9B%B8_20210804.pdf) | Documented `GetZipAddress` response shape | None | Used only for response field names; no service calls or data included |
| [Taiwan Government Open Data 3+3 postal-code dataset](https://data.gov.tw/en/datasets/150689) | Future source-licence review candidate | None | Catalogue reports Open Government Data License 1.0; verify current resource terms before importing any record |

## Explicit exclusions

- No Chunghwa Post address record, postal dataset, API credential, or provider
  response is copied into this repository.
- No recipient, telephone, e-mail, or building-unit detail is accepted by the
  request builder.
- No AFMT or other third-party address profile is redistributed.

## Refresh policy

Before any production integration, re-check the official source and the
dataset's current licence. If a source cannot be used for the intended purpose,
disable the connector and retain only the local, user-reviewed form workflow.
