---
title: QTc Calculator
calc: qtc
category: Heart & circulation
order: 10
description: Correct the QT interval for heart rate with the Fridericia, Bazett, Framingham and Hodges formulas and flag prolonged values.
cta: careers
updated: 2026-11-11
related: [map, chadsvasc, aniongap]
inputs:
  - {type: sex}
  - {id: qt, label: Measured QT interval, type: number, unit: ms, min: 200, max: 700, step: 1, ph: "400"}
  - {id: hr, label: Heart rate, type: number, unit: bpm, min: 30, max: 220, step: 1, ph: "72"}
refs:
  - {t: "PubMed: Comparison of QT correction formulas (Fridericia, Bazett, Framingham, Hodges)", u: "https://pubmed.ncbi.nlm.nih.gov/?term=comparison+QT+correction+formulae+Fridericia+Bazett+Framingham+Hodges"}
  - {t: "PubMed: AHA/ACCF/HRS recommendations for standardization of ECG interpretation, QT interval", u: "https://pubmed.ncbi.nlm.nih.gov/?term=AHA+ACCF+HRS+recommendations+standardization+interpretation+electrocardiogram+QT+interval"}
---
## Why the QT interval needs correcting

The QT interval, from the start of the QRS complex to the end of the T wave, shortens as heart rate rises. Correcting it to a standard rate of 60 bpm lets clinicians compare tracings and spot drug- or electrolyte-related prolongation that raises the risk of torsades de pointes.

## Formulas (RR in seconds = 60 / heart rate)

- Fridericia: <span class="formula">QT / RR^(1/3)</span>
- Bazett: <span class="formula">QT / RR^(1/2)</span>
- Framingham: <span class="formula">QT + 154 × (1 - RR)</span>
- Hodges: <span class="formula">QT + 1.75 × (HR - 60)</span>

## Interpreting QTc

| QTc | Interpretation |
|---|---|
| Below 350 ms | Short; consider congenital short-QT or hypercalcemia |
| Up to 450 ms (men) or 460 ms (women) | Normal |
| Above those limits | Prolonged |
| 500 ms or more | Markedly prolonged, higher arrhythmia risk |

## Practical points

Measure QT in lead II or V5 using the tangent method, average several beats, and be cautious with atrial fibrillation or a wide QRS. Review the drug list and check potassium, magnesium and calcium when QTc is prolonged.
