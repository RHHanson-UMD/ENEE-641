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
