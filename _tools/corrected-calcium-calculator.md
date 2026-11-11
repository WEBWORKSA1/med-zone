---
title: Corrected Calcium Calculator
calc: calcium
category: Kidney, labs & diabetes
order: 21
description: Adjust total serum calcium for a low or high albumin level with the Payne formula, in mg/dL or mmol/L.
cta: careers
updated: 2026-11-11
related: [aniongap, egfr, qtc]
inputs:
  - {id: ca, label: Total serum calcium, type: number, min: 0.5, max: 25, step: any, ph: "8.4"}
  - id: ca_unit
    label: Calcium unit
    type: select
    options:
      - {v: mg, t: "mg/dL"}
      - {v: mmol, t: "mmol/L"}
  - {id: alb, label: Serum albumin, type: number, min: 0.5, max: 70, step: any, ph: "3.0"}
  - id: alb_unit
    label: Albumin unit
    type: select
    options:
      - {v: gdl, t: "g/dL"}
      - {v: gl, t: "g/L"}
refs:
  - {t: "PubMed: Payne RB et al. Interpretation of serum calcium in patients with abnormal serum proteins, BMJ 1973", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Payne+interpretation+of+serum+calcium+abnormal+serum+proteins"}
  - {t: "PubMed: Accuracy of albumin-adjusted calcium versus ionized calcium", u: "https://pubmed.ncbi.nlm.nih.gov/?term=albumin-adjusted+calcium+accuracy+ionized+calcium"}
---
## Why calcium is corrected

About 40 percent of calcium in blood is bound to albumin. When albumin is low, for example in liver disease, malnutrition or critical illness, the total calcium result falls even though the active (ionized) calcium may be normal. The correction estimates what total calcium would be at a normal albumin of 4.0 g/dL.

## Formula

<span class="formula">Corrected Ca (mg/dL) = measured Ca + 0.8 × (4.0 - albumin in g/dL)</span>

In SI units: <span class="formula">corrected Ca (mmol/L) = measured Ca + 0.02 × (40 - albumin in g/L)</span>.

## Usual adult range

About 8.5 to 10.5 mg/dL (2.12 to 2.62 mmol/L). Laboratories publish their own ranges.

## Use with caution

Studies show the correction often misclassifies patients, especially in kidney failure and intensive care. When the result will change treatment, an **ionized calcium** measurement is the better test.
