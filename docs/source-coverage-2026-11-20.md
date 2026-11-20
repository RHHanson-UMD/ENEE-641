# ENEE 641 source coverage checkpoint — 2026-11-20

This is a neutral public **metadata and implementation checkpoint**, not a copy of restricted course materials. Instructor slides are authoritative, and CLRS 3rd edition is preferred only when consistent with them. Source files, private links and copyrighted slide artwork stay off GitHub.

## Recently added source materials

| Material | Available | Source inspection | Actual ENEE 641 instruction | Learning Lab disposition |
|---|---|---|---|---|
| `ENEE 641 Lecture 2026-11-17.txt` | Yes | Opened and read (speech-to-text transcript; possible transcription errors) | Confirmed in-class Chapter 34 NP-completeness and subset-sum reduction discussion, with prospective approximation/parallelism comments | Existing Chapter 34 reductions remain; compare exact slide example against site and avoid treating proposed parallel class as completed |
| `ENEE 641 Lecture 2026-11-19.txt` | Yes | Opened and read | Confirmed Chapter 35 motivation, factor-two approximate vertex cover and triangle-inequality-based metric TSP MST preorder proof | Exam 2 review refined to distinguish taught proof from additional source-available slides |
| `Chapter35Nov17-2026.pptx` | Yes | Slide text inspected; source deck covers further set cover, TRIM and subset-sum FPTAS | Not fully confirmed taught by November 19 transcript | Keep existing interactive source-deck examples, but qualify lecture coverage |
| `GPUS and TPUs 24Nov2026.pptx` | Yes | Slides 1–4 inspected textually for block matrix multiplication; later third-party diagrams and commentary excluded from publication | **Upcoming / not confirmed taught** as of November 20 | New original tile-size explorer with independent numeric model and algorithm oracle; label as preview |
| `parallel algorithms first classes2026.ppt` | Yes | Listed in course Drive; PowerPoint binary did not provide usable text through connector; needs independent visual audit | **Not confirmed taught** | Do not invent specific parallel algorithm source examples; defer until diagram/slide verification |
| `ENEE 641 Lecture 20.pdf` | Yes | Opened; text layer supplied header only | Lecture 20 dated November 17; figures and handwriting not audited | Pending page-by-page visual inspection |
| `ENEE 641 Lecture 21.pdf` | Yes | Opened; text layer supplied header only | Lecture 21 dated November 19; figures and handwriting not audited | Pending page-by-page visual inspection |

## Past content maintained and remaining precision work

- Chapter 6/8/11/12: interactive heap, noncomparison sorting, hashing and BST modules exist; verify exact lecture figure seeds and two original comparable exercises under #14/#15.
- Chapter 13/18: red-black / 2–3 insertion and deletion engines exist; verify detailed intermediate deletion diagrams and source-specific defaults under #25.
- Chapter 22: BFS, DFS, topological sort, articulation, bridges, biconnectivity and Euler lessons exist; original examples are not necessarily the slide figures (#24).
- Chapters 23–25: MST, shortest path and Floyd–Warshall lessons exist; continue exact source figure / proof invariant audits (#14/#15).
- Chapter 34: Chapter 34 figures 34.16–34.18 source mathematical seeds have original reconstructions; further source-example and independent-practice fidelity remains #23.
- Chapter 35: source figure examples and mathematical engines exist. Maintain an explicit distinction between **source available** and **actually covered in class**, especially before the November 24 review session.
- New GPU/TPU lesson is **future content**, outside the verified Exam 2 scope, unless the instructor explicitly covers it before the exam.

## Follow-up acceptance

1. Visually inspect handwritten Lecture 20/21 PDFs and the legacy binary parallel-algorithms PPT, with neutral notes on actual algorithms and slide/page numbers.
2. Revisit the November 24 lecture/review when available; update taught vs merely available statuses, then update Exam 2 guidance.
3. Run `npm test`, source-specific oracles, and public navigation/desktop/keyboard/theme checks; confirm the actual deployment independently rather than equating CI with GitHub Pages publication.
4. Coordinate future private-source migration only through the separate semi-private migration initiative; do not change repository visibility or deployment without its authorization.

This checkpoint does not assert that a source-only upcoming deck is examinable.
