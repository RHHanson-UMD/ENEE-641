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

## November 24, 2026 — GPU/TPU/NPU figure-specific visual audit

The actual PowerPoint **GPUS and TPUs 24Nov2026.pptx** was downloaded through the course Drive, rendered to images and visually inspected (slides 1–13), not just text-indexed.

- **Slide 3**: instructor's photographed four-block matmul: X, Y, Z arranged in 2×2 subblocks A/B/C/D; exact four block equations are implemented and independently oracle-tested. The original photograph is not copied.
- **Slide 4**: idealized n=1000 tile comparison b=500 vs b=100, with approximately 500× versus 100× reductions in fetched input elements, given the lecture's capacity assumptions. The pre-existing tiling engine remains separate; its physical cache-capacity caveat is retained.
- **Slide 6**: historical 90nm energy figures (RISC 125 pJ, load/store 150 pJ, single-precision 15–20 pJ, 32-bit add 7 pJ, 8-bit add 0.2–0.5 pJ). Original numeric comparison only; source cites Qadeer et al. (2015) / licensed Elsevier artwork. Not a modern NPU speed or energy benchmark.
- **Slides 8–9**: licensed Elsevier Figure 7.13, six fixed weights in a 2×3 MAC structure, three staggered x inputs, two dot-product outputs. The new original illustrative four-tick weight-stationary model is mathematically consistent with this configuration but **not asserted to replicate exact commercial TPU wiring or cycle timing**. No textbook image reused.
- **Slides 10–13**: GPU assembly / PTX / TileLang / vendor discussion and AI-generated text; not treated as independently verified numerical hardware figures or republished as such.

The separate `parallel algorithms first classes2026.ppt` source may be treated in a separate PR; this figure-focused update does not imply that parallel-algorithms content or all slides were actually covered in ENEE 641. All instructional-coverage claims remain conditional pending course verification.

## November 24 parallel algorithms and NPU supplemental work

The complete original source deck `parallel algorithms first classes2026.ppt` was opened. Its introduction expressly says only selected material will be used in ENEE 641. Original interactive preview modules introduce PRAM/EREW-CREW-CRCW, parallel summation and work–depth W,T,p bounds, balanced-tree prefix-sums, and order-preserving compaction (course-source slides 28–45). The scan implementation uses a distinct Blelloch two-pass schedule; it is **not** a literal diagram or pseudocode transcription of the slide algorithm. The output-stationary systolic array is separately labeled independent architectural practice, contrasting with the actual weight-stationary matrix–vector figures in GPU/TPU slides 8–9. Neither lesson is claimed to cover the entire source deck or a confirmed Exam 2 syllabus topic. Independent engine tests and responsive keyboard-accessible original controls accompany both lessons.
