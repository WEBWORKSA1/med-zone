---
title: Weight-Based Dose Calculator
calc: dose
category: Nursing & clinical
order: 25
description: Double-check a weight-based medication dose in mg/kg, the daily total, an optional maximum-dose cap and the volume to draw up.
cta: careers
updated: 2026-11-11
related: [ivdrip, bsa, crcl]
inputs:
  - {type: units}
  - {type: weight}
  - {id: mgkg, label: Ordered dose, type: number, unit: mg/kg, min: 0.001, max: 1000, step: any, ph: "15"}
  - id: freq
    label: Doses per day
    type: select
    value: "1"
    options:
      - {v: "1", t: "Once daily"}
      - {v: "2", t: "Twice daily (every 12 h)"}
      - {v: "3", t: "Three times daily (every 8 h)"}
      - {v: "4", t: "Four times daily (every 6 h)"}
      - {v: "6", t: "Every 4 hours"}
  - {id: conc, label: Concentration, type: number, unit: mg/mL, min: 0.001, max: 10000, step: any, ph: "32", opt: true}
  - {id: max, label: Maximum single dose, type: number, unit: mg, min: 0.001, max: 100000, step: any, ph: "1000", opt: true}
refs:
  - {t: "ISMP: Institute for Safe Medication Practices", u: "https://www.ismp.org/"}
  - {t: "PubMed: Weight-based dosing errors in pediatrics", u: "https://pubmed.ncbi.nlm.nih.gov/?term=weight-based+dosing+errors+pediatric+medication+safety"}
---
## How it works

<span class="formula">Single dose (mg) = weight (kg) × dose (mg/kg)</span>. If you enter a maximum single dose, the result is capped at that amount. With a concentration, the volume to give is <span class="formula">dose (mg) / concentration (mg/mL)</span>.

Example: a 20 kg child prescribed 15 mg/kg receives 300 mg per dose. With an oral suspension of 32 mg/mL, that is 9.4 mL.

## Avoiding common errors

- **Weigh in kilograms.** Mixing up pounds and kilograms is one of the most common sources of serious pediatric dosing errors, because it changes the dose by a factor of 2.2.
- **Check "per dose" versus "per day".** Some orders give mg/kg/day to be divided into several doses.
- **Respect adult maximums.** Weight-based doses for heavier children can exceed the usual adult dose.
- **Use an oral syringe**, never a kitchen spoon, for liquid medicines.

## Important

This tool is for education and independent double-checking by students and clinicians. It does not know the drug, the indication or the patient. Always confirm doses with the prescription, the product label and a pharmacist.
