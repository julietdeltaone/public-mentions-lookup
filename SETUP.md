# Public Mentions Lookup — quick pass

Replace Code.gs and Index.html in the existing Apps Script project. Keep the existing GEMINI_API_KEY and GEMINI_MODEL=gemini-3.8-flash Script properties. Existing connection-test files may remain.

Deploy > Manage deployments > Edit (pencil) > New version > Deploy. Reload the existing /exec dashboard URL. A GitHub update alone does not update the Apps Script deployment.

## Behavior

One generateContent request with Google Search grounding, LOW thinking, and a short answer. No separate extraction call, no application retries or follow-up research. The prompt requests one narrow query; Google controls actual search tool execution. Up to six citation-linked facts. Possible identity matches stay distinct from source-supported AI matches; neither is independent human verification.

Target 25 seconds, with the browser stopping its wait at 30 seconds. Late results are discarded. Apps Script URL Fetch does not expose a cancellable timeout: a running Google request can finish and incur costs after the UI stops. Overlapping requests are rejected by a script lock. This is not a guaranteed API execution deadline. Browser timers also depend on the page being active; expiry is rechecked on return.

School buttons: Clarkson, SUNY Potsdam, SUNY Canton, St. Lawrence. Other schools can be typed. City is free text. NY defaults first, followed by bordering states VT, MA, CT, NJ, PA, then NH, RI, ME. This is a regional convenience order, not measured driving distance. Default NY without a city does not count as identity evidence.

## Meter

Reported tokens include thinking. No live token stream is available. Cost range estimates token charges plus zero to $0.014 per reported search query. Search allowance is shared across the account/project; query metadata may not equal billable query counts, so this is not an upper bound or Google balance.

Gemini 3.8 Flash rates used: $0.75/M input and $3.75/M output through Dec 31, 2026; $1.50/$7.50 beginning Jan 1, 2027. Sources: https://aistudio.google.com/docs/pricing and https://aistudio.google.com/docs/models/gemini-3.8-flash . Review rates if Google changes pricing.

The script ledger MENTIONS_USAGE_V2 starts with this version and excludes previous tests, other apps and taxes. Unknown-cost failures are flagged. Late responses update the ledger even when their facts are discarded. The $5 tracker baseline is editable and stored in this browser; totals are shared across this script project. Check AI Studio for actual usage and remaining credit.

## Validation

Mocked tests passed for one API call, citation filtering, UTF-8 citation offsets, possible status, input validation, expired-request skip, thinking-inclusive cost and rate date change, and ledger updates. UI logic tests cover 30-second cutoff, late/stale result suppression and late usage updates. Syntax checked.

Not yet live-tested with the user's key or deployed. Browser preview was unavailable: exact 1024 x 600 layout, DPR=2 and touch behavior still require visual verification. In-car acceptance requires JD's confirmation. Layout uses CSS, no canvas, six cards and a separate internally scrolling detail panel.

## Name variants and dark card revision

Gemini generates up to two plausible first-name variants in the same request, with surname unchanged. School is the primary context when supplied; hometown corroborates but is not required in every result. Variant names stay POSSIBLE unless a source explicitly connects the names. No extra fields or API calls. Match evidence identifies the actual name found.

Visual update: near-black surfaces, restrained cyan/amber accents, uppercase category labels, separate status badges, larger fact text and quieter date metadata. Same form and results workflow. Logic and syntax checks passed again; visual and in-car verification remain pending.
