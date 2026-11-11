---
title: Blood Glucose Unit Converter
calc: glucose
category: Kidney, labs & diabetes
order: 20
description: Convert blood sugar between mg/dL and mmol/L and see how the value compares with fasting, 2-hour and random diagnostic ranges.
cta: trials
updated: 2026-11-11
related: [a1c, bmi, egfr]
inputs:
  - {id: value, label: Glucose reading, type: number, min: 0.5, max: 2000, step: any, ph: "5.6"}
  - id: from
    label: Unit of this reading
    type: select
    options:
      - {v: mmol, t: "mmol/L (convert to mg/dL)"}
      - {v: mg, t: "mg/dL (convert to mmol/L)"}
  - id: context
    label: When was it taken?
    type: select
    options:
      - {v: none, t: "Just convert"}
      - {v: fasting, t: "Fasting (8+ hours without food)"}
      - {v: ogtt, t: "2 hours after a 75 g glucose drink"}
      - {v: random, t: "Any time (random)"}
refs:
  - {t: "PubMed: ADA Standards of Care in Diabetes, Diagnosis and Classification", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Standards+of+Care+in+Diabetes+Diagnosis+and+Classification+of+Diabetes"}
  - {t: "PubMed: International Hypoglycaemia Study Group, glucose level 2 hypoglycemia", u: "https://pubmed.ncbi.nlm.nih.gov/?term=International+Hypoglycaemia+Study+Group+glucose+concentrations+of+less+than+3.0+mmol"}
---
## Converting between units

The U.S. reports glucose in milligrams per decilitre (mg/dL); most other countries use millimoles per litre (mmol/L).

- <span class="formula">mmol/L = mg/dL / 18.016</span>
- <span class="formula">mg/dL = mmol/L × 18.016</span>

## Diagnostic thresholds

| Test | Normal | Prediabetes | Diabetes range |
|---|---|---|---|
| Fasting glucose | Below 100 mg/dL (5.6) | 100 to 125 (5.6 to 6.9) | 126 or higher (7.0) |
| 2 hours after 75 g glucose | Below 140 (7.8) | 140 to 199 (7.8 to 11.0) | 200 or higher (11.1) |
| Random, with symptoms | | | 200 or higher (11.1) |

## Low blood sugar

Below 70 mg/dL (3.9 mmol/L) is low (level 1); below 54 mg/dL (3.0 mmol/L) is clinically significant (level 2) and needs treatment right away, usually 15 g of fast-acting carbohydrate, rechecked after 15 minutes. Severe lows with confusion or unconsciousness are an emergency.

## A single reading isn't a diagnosis

Home meters are less precise than lab tests, and illness, stress and some medicines raise glucose temporarily. Diagnosis uses lab testing, usually repeated.
