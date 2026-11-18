# ENEE-641: Mathematical Foundations for Computer Engineering

Interactive learning companion for University of Maryland ENEE-641.

- Expected site: https://rhhanson-umd.github.io/ENEE-641/
- Main learning portal: https://rhhanson-umd.github.io/

## Local preview

```sh
python -m http.server 8000 -d site
```

Open http://localhost:8000/.

## Deploy

This repo is independently deployed with GitHub Actions. In GitHub, choose
Settings > Pages > Build and deployment > Source: GitHub Actions. The workflow
publishes `site/` on pushes to `main`.

## Content rules

- Publish original explanations and independently drawn visualizations.
- Attribute textbooks and source examples; do not copy textbook figures.
- Do not publish unreleased or restricted homework.
- Even once officially released, confirm permission to republish solutions.
- Keep algorithm math tested independently of the presentation layer.

The course roadmap is illustrative, not an instructor syllabus.

## Chapter 35 approximation explorers

The Chapter 35 source-based demonstrations on this feature branch are:

- `site/visualizations/vertex-cover.html`: 2-approximate vertex cover and maximal matching, with exact small-graph comparison.
- `site/visualizations/approximation-lab.html`: metric traveling salesperson via MST preorder, greedy set covering and a trimmed SUBSET-SUM approximation scheme.

The examples and graphics are independently authored. Their lecture source is the connected ENEE 641 `Chapter35Nov17-2026.pptx` deck; copyrighted slides are not reproduced. Run `npm test` and preview with `python -m http.server 8000 -d site`. These modules are not live until their PR is reviewed and deployed.
