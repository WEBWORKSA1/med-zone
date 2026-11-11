---
title: Body Fat Calculator (U.S. Navy Method)
calc: bodyfat
category: Body & weight
order: 4
description: Estimate your body fat percentage with a tape measure using the U.S. Navy circumference method, plus fat mass and lean mass.
cta: insurance
updated: 2026-11-11
related: [bmi, whtr, idealweight]
inputs:
  - {type: units}
  - {type: sex}
  - {type: height}
  - {id: neck, type: length, label: Neck circumference, ph_cm: "38", ph_in: "15", hint: "Just below the larynx, tape sloping slightly down to the front."}
  - {id: waist, type: length, label: Waist circumference, ph_cm: "85", ph_in: "33.5", hint: "Men at the navel; women at the narrowest point."}
  - {id: hip, type: length, label: Hip circumference (women), opt: true, ph_cm: "98", ph_in: "38.5", hint: "Widest point of the buttocks. Needed for women only."}
  - {type: weight, opt: true, label: Weight (for fat and lean mass)}
refs:
  - {t: "PubMed: Hodgdon and Beckett, prediction of percent body fat for U.S. Navy men and women from body circumferences", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Hodgdon+Beckett+percent+body+fat+circumferences+Navy"}
  - {t: "PubMed: Validity of circumference-based body fat estimates", u: "https://pubmed.ncbi.nlm.nih.gov/?term=navy+body+fat+equation+validity+DXA"}
---
## How it works

The U.S. Navy method estimates body fat from height and a few circumferences. Fat around the waist and hips raises those measurements more than muscle does, so the equations translate them into a body-fat percentage. It is the method the U.S. military has used for decades because it needs only a tape measure.

## Formulas (measurements in inches)

- Men: <span class="formula">86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76</span>
- Women: <span class="formula">163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387</span>

## Reading your result

| Category | Women | Men |
|---|---|---|
| Essential fat | 10 to 13% | 2 to 5% |
| Athletes | 14 to 20% | 6 to 13% |
| Fitness | 21 to 24% | 14 to 17% |
| Average | 25 to 31% | 18 to 24% |
| Obesity range | 32% or more | 25% or more |

These commonly used bands come from fitness-industry practice rather than a single medical guideline.

## Measuring well

Measure in the morning before eating, on bare skin, with a flexible tape held level and snug. Take each measurement twice and use the average. Re-measure monthly rather than daily: real body-fat change is slow.
