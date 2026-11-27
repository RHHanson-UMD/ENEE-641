# Midterm II interactive review — protected integration checkpoint

**Date:** 2026-11-27 · **Status:** ready for protected-repository PR; **not published**

## Scope and security decision

The owner supplied a standalone interactive study review with its own integration README. This repository is currently **public**, and its deploy workflow publishes all of `site/` as public GitHub Pages content. The supplied review includes adapted material derived from nonpublic course assessments. Its README expressly requires protected hosting and warns that a private source repository alone is insufficient. Therefore **the review page is not added to this public GitHub repository, any branch or its GitHub Pages output**.

The detailed review is staged locally in the conversation as an owner-downloadable protected package; it is **not** committed, attached to this issue or transmitted to public CI.

## Proposed private application route

- Authenticated route: `reviews/midterm-2/index.html`
- Protected course index label: **Midterm II — Interactive Exam Review**
- Public landing page: no new detailed review content and no change to its current links
- Keep all route assets same-origin and behind the Access authentication policy
- Store readiness/problem mastery locally in browser; scratch answers remain in memory
- No analytics, remote progress synchronization, or login bypass code

## Local validation summary (staged package, not public CI)

- JavaScript syntax and duplicate DOM ID checks: PASS
- No external runtime dependencies, private links, source files or credentials embedded: PASS
- Independent mathematical expected outcomes: Dijkstra, Kruskal, DFS articulation/bridges, Floyd–Warshall, metric TSP and exact vertex-cover optimum: PASS
- Playwright Chromium DOM interaction tests at 1280px and 390px: PASS (readiness/reset, light/dark toggle, graph/shortest-path controls, reductions, vertex-cover edge controls, TSP stages, problem hints/solutions, mastery and no horizontal overflow)
- 12 distinct practice problems and source/notation checks: PASS
- **Blocked:** real-origin localStorage persistence across browser reload (administrator blocked file/localhost browser navigation); needs authenticated staging environment
- **Blocked:** anonymous HTML/assets denial, production and preview hostname protections and live deployment verification; no protected app origin configured in connected GitHub repository
- **Blocked:** review of rights to share historically adapted assessment material with approved users; source availability alone does not authorize redistribution

## Protected-host acceptance gates

1. Verify **private** application repository and the exact reviewed source-branch destination.
2. Confirm Access policies gate custom domain, production `pages.dev`, and all preview/alternate URLs, with user approval and revocation.
3. Import staged page only into that private repository, then open a **private** review PR there. Preserve README acceptance requirements.
4. Run unit and browser integration checks under authenticated staging; verify progress after hard reload and exact independent numeric results.
5. From an unapproved browser, GET HTML and any associated JS/CSS, including direct guessed paths; all must be denied or redirected without payload.
6. Only after protected deploy verify served commit and completion timestamp, then update [PM issue #46](https://github.com/RHHanson-UMD/ENEE-641/issues/46) with source-versus-protected deployment separately.

## Safety and ownership

No other course repositories modified. No instructor documents, restricted homework or exams, user scratch answers, credentials or personal data included in this public document. The semi-private architecture migration is coordinated in its dedicated infrastructure chat; no attempt is made here to change access policy or repo visibility.
