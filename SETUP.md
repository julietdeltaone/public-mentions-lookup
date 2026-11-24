# Public Mentions Lookup

Google Apps Script web app. Dark glass interface designed for a 1024 x 600 CSS-pixel Tesla browser pane. Three inputs: full name, school, hometown. Returns up to six new source-supported facts, with evidence and source links.

## Install
1. Create a project at https://script.google.com/home.
2. Replace Code.gs with this repository's Code.gs.
3. Add an HTML file named Index and paste Index.html.
4. Get a Gemini API key at https://aistudio.google.com/apikey.
5. Project Settings > Script properties: add GEMINI_API_KEY with the key as its value. Never put it in HTML or GitHub.
6. Optionally set GEMINI_MODEL. Default: gemini-2.5-flash. The model must support generateContent, Google Search grounding and JSON structured output (used in separate calls). If Google retires the model, set an available compatible model.
7. Deploy > New deployment > Web app. Execute as Me. Who has access: Only myself. Authorize and open the /exec URL. The Tesla browser must be signed into that same Google account; in-car sign-in compatibility is not yet verified. Do not switch to anonymous access to bypass sign-in: that would let other people spend your API quota.
8. After edits: Deploy > Manage deployments > Edit > New version > Deploy. Keep the same URL.

Google API quota/billing applies. Each successful search uses one grounded research request and one extraction request. No spreadsheet, external hosting, history storage or key entry on the page is needed. Searches are sent to Google. Only one search can run at a time per script.

## Evidence
Only citation-linked passages are passed into extraction. Returned evidence IDs and exact supporting excerpts are checked on the server; source URLs come from API grounding metadata, not extraction output. Ambiguous identities and supplied anchors are excluded by model instructions, not deterministic proof. AI interpretation can still be wrong. Results are labeled source-supported, not independently confirmed. No source text is independently fetched or verified. Empty results mean insufficient evidence in this run, not proof of absence. Google Search suggestions appear in a sandboxed panel.

## Touch layout
At 1024 x 600: normal-flow header, fixed left form, 2-by-3 result grid, tap for full detail, previous/next buttons and horizontal swipes across the detail surface. Long evidence scrolls internally. No canvas or external frameworks/fonts. Compact layouts and mobile fallback included.

## Verification status
Passed local JavaScript syntax and mocked backend checks: validation, citation-linked result acceptance, invalid evidence rejection, lock release and empty results without citations. Browser rendering could not run because the environment blocks Chromium startup. Thus 1024 x 600 / DPR 1 and 2 visual verification remains pending. Live Gemini, Apps Script authorization/deployment and Tesla checks remain pending. This code is prepared, not live or accepted in-car.

Test in the car while parked: all three inputs and Search visible, six cards above footer, touch keyboard behavior, source links, long evidence, swipe navigation, error and empty-result states. Apps Script's own banner or browser keyboard can reduce usable height.
