---
title: A1C to Average Glucose Calculator
calc: a1c
category: Kidney, labs & diabetes
order: 19
featured: true
description: Convert a hemoglobin A1C result to estimated average glucose (eAG) in mg/dL and mmol/L, plus IFCC units and the ADA diagnostic range.
cta: trials
updated: 2026-11-11
related: [glucose, bmi, egfr]
inputs:
  - {id: a1c, label: Hemoglobin A1C, type: number, unit: "%", min: 3, max: 20, step: 0.1, ph: "6.2"}
refs:
  - {t: "Nathan DM et al. Translating the A1C assay into estimated average glucose values. Diabetes Care 2008", u: "https://pubmed.ncbi.nlm.nih.gov/18540046/"}
  - {t: "American Diabetes Association: Understanding A1C", u: "https://diabetes.org/about-diabetes/a1c"}
---
## What A1C measures

Glucose in your blood sticks to hemoglobin in red blood cells. Since those cells live about three months, the A1C test shows your average blood sugar over the past two to three months, weighted toward recent weeks.

## Converting A1C to average glucose

The A1C-Derived Average Glucose (ADAG) study linked A1C to continuous glucose readings:

- <span class="formula">eAG (mg/dL) = 28.7 × A1C - 46.7</span>
- <span class="formula">eAG (mmol/L) = 1.59 × A1C - 2.59</span>

| A1C | Average glucose |
|---|---|
| 5% | 97 mg/dL (5.4 mmol/L) |
| 6% | 126 mg/dL (7.0 mmol/L) |
| 7% | 154 mg/dL (8.6 mmol/L) |
| 8% | 183 mg/dL (10.1 mmol/L) |
| 9% | 212 mg/dL (11.8 mmol/L) |
| 10% | 240 mg/dL (13.4 mmol/L) |

## Diagnostic ranges (ADA)

Below 5.7% is normal, 5.7 to 6.4% is prediabetes, and 6.5% or higher on two tests indicates diabetes. Many adults with diabetes aim for below 7%, but targets are set individually.

## When A1C can mislead

Anemia, recent blood loss or transfusion, some hemoglobin variants (such as sickle-cell trait), pregnancy and advanced kidney disease can shift A1C away from true average glucose. Fingerstick or continuous glucose data then give a clearer picture.
