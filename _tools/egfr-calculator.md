---
title: eGFR Calculator (CKD-EPI 2021)
calc: egfr
category: Kidney, labs & diabetes
order: 17
featured: true
description: Estimate kidney function (eGFR) from serum creatinine, age and sex with the race-free CKD-EPI 2021 equation and see your CKD stage.
cta: trials
updated: 2026-11-11
related: [crcl, a1c, map]
inputs:
  - {type: sex}
  - {id: age, label: Age, type: number, unit: years, min: 18, max: 110, step: 1, ph: "55"}
  - {id: scr, label: Serum creatinine, type: number, min: 0.1, max: 2000, step: any, ph: "1.0"}
  - id: scr_unit
    label: Creatinine unit
    type: select
    options:
      - {v: mg, t: "mg/dL (US)"}
      - {v: umol, t: "µmol/L (SI)"}
refs:
  - {t: "Inker LA et al. New creatinine- and cystatin C-based equations to estimate GFR without race. N Engl J Med 2021", u: "https://pubmed.ncbi.nlm.nih.gov/34554658/"}
  - {t: "National Kidney Foundation: eGFR calculator and CKD-EPI 2021", u: "https://www.kidney.org/professionals/gfr_calculator"}
  - {t: "KDIGO: CKD evaluation and management guideline", u: "https://kdigo.org/guidelines/ckd-evaluation-and-management/"}
---
## What eGFR means

Glomerular filtration rate (GFR) is how much blood your kidneys filter each minute. It can't be measured easily, so labs estimate it (eGFR) from creatinine, a waste product made by muscle. A normal eGFR for young adults is about 90 to 120 mL/min/1.73 m², and it declines slowly with age.

## The CKD-EPI 2021 equation

<span class="formula">eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^age × 1.012 [if female]</span>, where κ is 0.7 for women and 0.9 for men, and α is -0.241 for women and -0.302 for men. The 2021 version removed the race coefficient used in earlier equations.

## CKD stages

| Stage | eGFR | Description |
|---|---|---|
| G1 | 90 or more | Normal or high |
| G2 | 60 to 89 | Mildly decreased |
| G3a | 45 to 59 | Mildly to moderately decreased |
| G3b | 30 to 44 | Moderately to severely decreased |
| G4 | 15 to 29 | Severely decreased |
| G5 | Below 15 | Kidney failure |

Chronic kidney disease is diagnosed when eGFR stays below 60, or when there are other signs of kidney damage such as albumin in the urine, for at least three months.

## Protecting your kidneys

Control blood pressure and blood sugar, avoid regular use of NSAID painkillers unless advised, stay hydrated, and ask about a urine albumin test if you have diabetes or hypertension.
