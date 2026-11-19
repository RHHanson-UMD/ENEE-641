# ENEE 641 — Repository Agent Instructions

## Mission and scope

This independent, student-created **ENEE 641 Mathematical Foundations for Computer Engineering** interactive learning companion is not an official UMD website. Repository: `RHHanson-UMD/ENEE-641`; intended public URL: https://rhhanson-umd.github.io/ENEE-641/.

Maintain only ENEE 641 here. The central portal and the ENEE 620/630 course sites have separate repos and maintenance chats. Coordinate shared math with `learning-core` through explicit, reviewed issue/PR handoffs; do not silently copy shared code or alter other course repos.

## Evidence and issue checkpoints

Before editing, inspect live `README.md`, source/test files, `package.json`, current PRs/issues/comments and workflows. Repository code and real deployment status override historical handoff notes.

Use **#14** for complete source-covered chapter/section/figure inventory, **#15** for figure identifiers, exact source seeds and alternative examples, **#12** for browser/Pages explorer integration, **#20** for source-verified syllabus/mastery guidance, **#21** for supplemental public resources, and **#22** for these instructions. Check issue state and most recent source checkpoint before repeating an audit.

For claims about a course figure, proof, lecture or textbook section, privately **open and inspect the exact original permitted source**, including relevant PDF page/slide and actual diagram if necessary. A figure number in a draft issue, extracted text, textbook edition guess or topic name alone is not verified evidence. Confirm the book **edition**, figure number, notation, starting graph/input and covered-vs-planned status; keep a neutral public page reference without private links. If exact evidence is unavailable, label the example as independent and do not claim source fidelity.

For every interactive source-inspired figure, provide an independently drawn visualization, explicitly distinguish an accurately verified **source seed** from original alternative examples, and test default, changed-input, reset and failure/edge states. Check invariant/proof steps and the limits of every claimed reduction or algorithm.

## Required source precedence and edition choice

**Instructor lecture slides are authoritative for this ENEE 641 learning companion.** For what the course teaches, follow the exact lecture deck's topics, notation, mathematical input data, graph structure, figures, theorem statements, assumptions, examples, and slide order; do not silently replace, correct, or expand them with a textbook version. If a slide is ambiguous or appears inconsistent, document the discrepancy and verify it rather than silently changing the lecture example.

**Prefer CLRS (*Introduction to Algorithms*), 3rd edition** for additional section references, conceptual context, and terminology **when consistent with the slides**. Slides sometimes come from CLRS 2nd edition, and figure numbers and details may differ by edition. In that case preserve the lecture figure and its actual slide/2nd-edition identifier, and supply a separately verified 3rd-edition cross-reference only when known. Never relabel a 2nd-edition figure as a 3rd-edition figure without inspecting the 3rd-edition source. Do not claim an unverified cross-edition correspondence.

For every source-backed lesson, record `lecture deck + slide number` as primary provenance; add `CLRS edition + verified figure/section` as secondary provenance. Original practice examples may go beyond the slides but must be explicitly labeled **independent practice**, not instructor-covered content. Do not redistribute copyrighted figures, slides, or textbook extracts.

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


## Mandatory publication and workflow security rules

These constraints apply to both human contributors and automated coding agents.
Before creating a public commit, PR, Issue, comment, artifact, or Pages deployment:

1. **No secrets:** Never paste or commit access tokens, GitHub PATs, API keys, passwords, SSH/private keys, session cookies, sensitive configuration, or credentials. Read secrets only from a dedicated secret store, and use a least-privilege short-lived credential if needed. If exposure occurs, stop publication, revoke/rotate privately, and never copy the value into a public remediation issue.
2. **No restricted academic data:** Never publish private Drive/ELMS URLs, instructor PDFs, office/lecture material, student records, answer keys, unreleased homework or copyrighted figures without documented redistribution rights. Solution release alone is insufficient. Prefer original independent examples and neutral source references.
3. **No dangerous workflows:** Keep third-party GitHub Actions pinned to verified full commit SHAs; set minimal explicit workflow permissions; do not introduce \`pull_request_target\`, \`workflow_run\`, or workflow-wide write tokens without separate security review. Deploy only from reviewed \`main\` changes.
4. **Do not bypass checks:** The publication safety gate and Gitleaks secret scan must pass before merge. Never disable, skip, weaken or add an exclusion to either tool merely to clear a failing check. A false positive requires documented maintainer review and a tested narrow fix.
5. **Pre-merge review:** Inspect the full diff for accidental publication and workflow privilege changes. Require independent approval for security-control changes when GitHub branch protections support it. Verify Pages after deploy; do not treat passing CI as proof of publication safety or licensing.
6. **New repositories:** Copy this policy, the pinned-workflow baseline, secret scanning and publication guard into every new course repo before enabling Pages.

The automated \`scripts/check_publication.py\` gate blocks common accidental disclosure paths, selected restricted file formats, private course-storage URLs, and unsafe workflow references. It cannot determine copyright ownership or detect every secret; maintain human rights/security review as a separate requirement.
