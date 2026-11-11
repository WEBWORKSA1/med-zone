---
title: Anion Gap Calculator
calc: aniongap
category: Kidney, labs & diabetes
order: 22
description: Calculate the serum anion gap from sodium, chloride and bicarbonate, with optional potassium and albumin correction.
cta: careers
updated: 2026-11-11
related: [calcium, glucose, egfr]
inputs:
  - {id: na, label: Sodium (Na⁺), type: number, unit: mmol/L, min: 90, max: 200, step: any, ph: "140"}
  - {id: cl, label: Chloride (Cl⁻), type: number, unit: mmol/L, min: 50, max: 160, step: any, ph: "104"}
  - {id: hco3, label: Bicarbonate (HCO₃⁻), type: number, unit: mmol/L, min: 1, max: 60, step: any, ph: "24"}
  - {id: k, label: Potassium (K⁺), type: number, unit: mmol/L, min: 1, max: 10, step: any, ph: "4.0", opt: true}
  - {id: alb, label: Albumin, type: number, unit: g/dL, min: 0.5, max: 7, step: any, ph: "4.0", opt: true}
refs:
  - {t: "NCBI Bookshelf: search StatPearls on the anion gap", u: "https://www.ncbi.nlm.nih.gov/books/?term=anion+gap+statpearls"}
  - {t: "PubMed: Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Kraut+Madias+serum+anion+gap+uses+and+limitations"}
---
## What the anion gap shows

Blood is electrically neutral. Routine tests measure the main positive ion (sodium) and the main negative ions (chloride and bicarbonate). The "gap" between them represents unmeasured negative ions, mostly albumin. When an acid such as lactate or ketones builds up, bicarbonate falls and the gap widens.

## Formulas

- <span class="formula">AG = Na - (Cl + HCO3)</span>
- With potassium: <span class="formula">AG = Na + K - (Cl + HCO3)</span>
- Albumin-corrected: <span class="formula">AG + 2.5 × (4.0 - albumin in g/dL)</span>

Modern analyzers give a usual range of roughly 4 to 12 mmol/L without potassium, but ranges differ between laboratories.

## Interpreting a high gap

Common causes of a high anion gap metabolic acidosis include lactic acidosis, diabetic or alcoholic ketoacidosis, kidney failure and toxic ingestions (methanol, ethylene glycol, salicylates). A normal gap with acidosis points instead to bicarbonate loss, such as diarrhea or renal tubular acidosis.

## Why correct for albumin?

Low albumin shrinks the gap and can hide a real acidosis. Correcting for albumin is especially important in critically ill patients.
