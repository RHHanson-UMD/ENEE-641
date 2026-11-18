# ENEE 641 — Repository Agent Instructions

## Mission and scope

This independent, student-created **ENEE 641 Mathematical Foundations for Computer Engineering** interactive learning companion is not an official UMD website. Repository: `RHHanson-UMD/ENEE-641`; intended public URL: https://rhhanson-umd.github.io/ENEE-641/.

Maintain only ENEE 641 here. The central portal and the ENEE 620/630 course sites have separate repos and maintenance chats. Coordinate shared math with `learning-core` through explicit, reviewed issue/PR handoffs; do not silently copy shared code or alter other course repos.

## Evidence and issue checkpoints

Before editing, inspect live `README.md`, source/test files, `package.json`, current PRs/issues/comments and workflows. Repository code and real deployment status override historical handoff notes.

Use **#14** for complete source-covered chapter/section/figure inventory, **#15** for figure identifiers, exact source seeds and alternative examples, **#12** for browser/Pages explorer integration, **#20** for source-verified syllabus/mastery guidance, **#21** for supplemental public resources, and **#22** for these instructions. Check issue state and most recent source checkpoint before repeating an audit.

For claims about a course figure, proof, lecture or textbook section, privately **open and inspect the exact original permitted source**, including relevant PDF page/slide and actual diagram if necessary. A figure number in a draft issue, extracted text, textbook edition guess or topic name alone is not verified evidence. Confirm the book **edition**, figure number, notation, starting graph/input and covered-vs-planned status; keep a neutral public page reference without private links. If exact evidence is unavailable, label the example as independent and do not claim source fidelity.

For every interactive source-inspired figure, provide an independently drawn visualization, explicitly distinguish an accurately verified **source seed** from original alternative examples, and test default, changed-input, reset and failure/edge states. Check invariant/proof steps and the limits of every claimed reduction or algorithm.

## Public rights and private source controls

Never upload private Google Drive/ELMS PDFs or URLs, paid textbook figures, instructor photos/slides/transcripts, restricted homework solutions, professor answer keys, unreleased exam questions, student data, access tokens or other credentials into a public branch, PR, issue, comment, test fixture, build artifact or GitHub Pages. Release of a solution does **not** authorize public redistribution. Check rights independently; cite source identifiers without reproducing restricted images. General-purpose synthetic proofs, examples and original schematics are preferred.

## Architecture, mathematical tests and UI

- Static `site/` HTML/CSS/JavaScript, independent GitHub Pages; do not introduce React/Vite/backend for a minor lesson.
- `package.json` exposes `npm test` using Node's built-in `node --test`; `.github/workflows/tests.yml` runs tests on PRs/pushes.
- `.github/workflows/deploy.yml` publishes `./site` on pushes to `main`.
- Keep pure algorithm engines separate from renderers/controllers. Existing subset-sum code is course-owned and **must not** be replaced by a `learning-core` import unless a compatibility analysis, pinned vendored revision and course-owned PR are reviewed.

For mathematical changes, state inputs, indexing, graph model, tie-break rules, units if relevant, preconditions and complexity claims. Test an ordinary case, independent small-instance oracle, degenerate and invalid cases, and counterexamples where applicable (disconnected graphs, negative edges/cycles, reduction constraints, unsatisfiable input or subset-sum precision). Do not infer correctness from visually plausible animation alone. Explain why algorithms work and why a method fails outside its assumptions.

Use dark mode by default and a persistently selectable light option. Maintain keyboard-operable controls, visible focus, sufficient contrast, accessible outputs, reset and intermediate steps; retain usable narrow-screen behavior without assuming the site must be rewritten for mobile.

## Change workflow and reporting

Work in focused issue-linked PRs. Inspect differences for prohibited publication material; run `npm test` for code/math changes plus link, keyboard/theme and desktop layout checks when possible. Verify the PR's CI separately from the post-merge Pages workflow and independently open the published course URL; do not claim deployment based on merge or green tests.

At each batch report exact sources actually opened (without confidential access links), files modified, tests actually executed, PR/commit, live Pages result or unverified status, source/copyright risks, and next source section or issue checkpoint. Close #22 only after this file is reviewed and acceptance verified.
