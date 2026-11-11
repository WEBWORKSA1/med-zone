---
title: Body Surface Area (BSA) Calculator
calc: bsa
category: Nursing & clinical
order: 26
description: Calculate body surface area with the Mosteller formula and compare Du Bois, Haycock and Gehan and George results.
cta: careers
updated: 2026-11-11
related: [dose, ivdrip, idealweight]
inputs:
  - {type: units}
  - {type: height}
  - {type: weight}
refs:
  - {t: "Mosteller RD. Simplified calculation of body-surface area. N Engl J Med 1987", u: "https://pubmed.ncbi.nlm.nih.gov/3657876/"}
  - {t: "PubMed: Comparison of body surface area formulas (Du Bois, Haycock, Gehan and George)", u: "https://pubmed.ncbi.nlm.nih.gov/?term=comparison+body+surface+area+formulas+DuBois+Mosteller+Haycock"}
---
## What BSA is used for

Body surface area scales some drug doses (many chemotherapy agents), cardiac index (cardiac output divided by BSA) and some kidney measurements. It tracks metabolic size better than weight alone.

## Formulas (height in cm, weight in kg)

| Formula | Equation |
|---|---|
| Mosteller | √(height × weight / 3600) |
| Du Bois | 0.007184 × weight^0.425 × height^0.725 |
| Haycock | 0.024265 × weight^0.5378 × height^0.3964 |
| Gehan and George | 0.0235 × weight^0.51456 × height^0.42246 |

Mosteller is the most widely used because it is simple and agrees closely with the others for most adults. Haycock was validated in infants and children.

## Typical values

Average adult BSA is about 1.7 m² for women and 1.9 m² for men. Newborns are around 0.25 m².

## In practice

When BSA drives a dose, the protocol decides the formula, whether to use actual or adjusted weight, and any dose cap. Recalculate after significant weight change.
