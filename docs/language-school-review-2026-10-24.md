# Language-school refinement — local review

Status: **approved for publication by the owner on 24 October 2026**. Deployment outcomes are reported in the accompanying chat.

Preview: http://127.0.0.1:4182/ (local server must be running).

Review branch: `review/language-school-refinement`, based on the latest fetched repository state (`99b50ea`). The reviewed changes are now approved for release.

## Changes to review

- **Home:** language-school positioning in the hero, the existing Welcome to LIA introduction followed by a native four-language section, and qualified LCA academic cooperation copy in an Admission-style banner and panel beside the retained school photo. The Home browser-tab title remains Home · LIA Language School. The original opening, hero photo, service banner, values, mission, highlights, and calls to action remain.
- **Admission:** Pathway A explains English, Thai, Korean, and Chinese; Pathway B distinguishes local LIA learning support from official LCA enrollment and academic responsibilities. Existing FAQ and contact links remain.
- **About:** identifies LIA Language School as the legal full name and Logos International Academy as the academy name, following the owner’s clarification. Mission, vision, founding story, and values remain unchanged.
- **Serve:** one consistency edit adds language learning and local academic support; the service sections remain.
- **Inquire:** adds the six requested inquiry categories, with General Inquiry selected initially. Existing field names, required fields, Netlify form identity, contact information, and privacy text remain. The form’s backend target is restored to the available original Netlify `/request-info/` handler; its public page remains `/inquire/`. Contact-name wording welcomes both learners and parents/guardians.
- **Metadata:** reflects the language programs and the current `thealanlu.github.io/lia` origin. Five main page URLs and the legacy inquiry redirect remain.
- **Footer:** retains its existing design and contact details; the unverified Ministry registration statement is replaced with the owner-supplied legal and academy names.

Thin, content-aligned dividers have also been added between sections that share the paper background. Existing color bands, card boundaries, and section spacing remain.

## Institutional wording

The owner confirmed that no cooperation agreement or registration documents are available for this review. The draft therefore makes no government registration, LIA accreditation, international-school, or independent diploma-authority claim. Existing blanket dual-enrollment wording and general grades 1–12 eligibility wording have been removed.

LCA’s public description was checked against its [official page](https://aceschooloftomorrow.com/lca). That supports the A.C.E. distance-learning description and LCA’s responsibility for academic records and graduation requirements. It does **not** verify a specific LIA cooperation agreement or LIA’s eligibility for LCA’s formal school dual-enrollment program. The draft uses conditional wording and directs eligibility and local arrangements to the LIA Office.

## Verification

- All five pages checked at 1280, 885, 390, and 320 px: no horizontal overflow, one main heading per page, and no broken loaded images.
- Mobile popup: centered, blurred backdrop, keyboard focus wrapping, Escape, and outside-tap dismissal checked.
- Admission FAQ open/close checked.
- Inquiry category options, default selection, and conditional phone requirement checked.
- Local form submission confirms the preview message without sending a production inquiry.
- Reduced-motion banner and legacy `/request-info/` redirect checked.
- School photo paths/order, opening markup, About mission/vision/story/values, JavaScript interactions, existing form identity/fields, and school contact details compared with the baseline. JavaScript changes restore the working Netlify endpoint, use normal form POSTs from GitHub Pages and ChatGPT Site to avoid cross-origin response restrictions, and include the chosen category in the existing message field for compatibility with the registered form schema.
- Read-only HTTP checks found Netlify `/inquire/` returns 404 and `/request-info/` returns 200. The local draft now targets the available handler. A GET/HEAD response does not verify POST collection or email delivery.
- Source validation, JavaScript syntax, GitHub Pages packaging, and whitespace checks passed.

Screenshots: `output/playwright/language-review-2026-10-24/` (local review artifacts; not part of the website).

## Publication checklist

1. Keep the reviewed conditional LCA wording. Obtain school-specific documentation before adding formal partnership, dual-enrollment, or registration claims.
2. The Netlify connection repeatedly requested authentication during publication, so a new schema deployment could not be confirmed. The chosen category is included in the existing `message` payload and the unregistered category field is omitted from submission. A later Netlify deployment can register a dedicated category column. Production collection and email delivery have not been tested.
3. Verify the existing Netlify handler and its confirmation route before a production delivery test. No production form submission or deployment was performed in this review.
4. Publish the approved website through GitHub Pages and the existing ChatGPT Site workflow, preserving the current audience. Preserve the reviewed source and check each deployment result.
