---
title: Creatinine Clearance Calculator (Cockcroft-Gault)
calc: crcl
category: Kidney, labs & diabetes
order: 18
description: Calculate creatinine clearance with the Cockcroft-Gault equation using actual, ideal and adjusted body weight for renal drug dosing.
cta: careers
updated: 2026-11-11
related: [egfr, idealweight, dose]
inputs:
  - {type: units}
  - {type: sex}
  - {id: age, label: Age, type: number, unit: years, min: 18, max: 110, step: 1, ph: "65"}
  - {type: weight}
  - {type: height, opt: true, hint: "Optional: adds ideal and adjusted body weight results."}
  - {id: scr, label: Serum creatinine, type: number, min: 0.1, max: 2000, step: any, ph: "1.1"}
  - id: scr_unit
    label: Creatinine unit
    type: select
    options:
      - {v: mg, t: "mg/dL (US)"}
      - {v: umol, t: "µmol/L (SI)"}
refs:
  - {t: "Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron 1976", u: "https://pubmed.ncbi.nlm.nih.gov/1244564/"}
  - {t: "PubMed: Choice of body weight in the Cockcroft-Gault equation for drug dosing", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Cockcroft-Gault+body+weight+selection+obesity+drug+dosing"}
---
## Why Cockcroft-Gault is still used

Most drug labels with kidney dose adjustments were written using creatinine clearance (CrCl) from the 1976 Cockcroft-Gault equation, so pharmacists still use it for dosing even though labs now report eGFR.

<span class="formula">CrCl = (140 - age) × weight (kg) / (72 × serum creatinine in mg/dL) × 0.85 [if female]</span>

## Which weight?

- **Actual body weight** for most adults near their ideal weight.
- **Ideal body weight (Devine)** when actual weight is lower than ideal weight, or in some protocols for all patients.
- **Adjusted body weight** (<span class="formula">IBW + 0.4 × (actual - IBW)</span>) often used in obesity, typically when actual weight exceeds 120 percent of ideal.

Add a height to see all three. Follow the product label or your institution's protocol when they specify a method.

## Limits

The equation assumes stable kidney function. It is unreliable in acute kidney injury, in people with very low muscle mass (amputation, frailty, malnutrition), and it tends to overestimate clearance when creatinine is very low; some protocols round low creatinine values up for older adults.
