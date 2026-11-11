---
title: Water Intake Calculator
calc: water
category: Everyday health
order: 7
description: Estimate how much to drink each day based on your weight, exercise, climate, pregnancy or breastfeeding.
cta: insurance
updated: 2026-11-11
related: [calories, hrzones, sleep]
inputs:
  - {type: units}
  - {type: sex}
  - {type: weight}
  - {id: exercise, label: Exercise per day, type: number, unit: min, min: 0, max: 600, step: 5, ph: "30", opt: true}
  - id: climate
    label: Climate
    type: select
    options:
      - {v: temperate, t: "Temperate or air-conditioned"}
      - {v: hot, t: "Hot or humid"}
  - id: status
    label: Life stage
    type: select
    options:
      - {v: none, t: "Not pregnant or breastfeeding"}
      - {v: pregnant, t: "Pregnant"}
      - {v: breastfeeding, t: "Breastfeeding"}
refs:
  - {t: "National Academies: Dietary Reference Intakes for Water, Potassium, Sodium, Chloride and Sulfate", u: "https://nap.nationalacademies.org/catalog/10925"}
  - {t: "PubMed: Water, hydration and health (review)", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Popkin+water+hydration+and+health+review"}
---
## How much water do you need?

There is no single number. The U.S. National Academies set an **adequate intake of total water** (from food and drinks) of about 3.7 L a day for men and 2.7 L for women, rising in pregnancy and breastfeeding. Food usually supplies about a fifth of that, so most of the target comes from drinks.

## How the estimate works

- **Baseline:** 33 mL per kilogram of body weight.
- **Exercise:** about 0.6 L per hour of activity (sweat rates range widely).
- **Heat:** an extra 0.5 L in hot or humid conditions.
- **Pregnancy and breastfeeding:** an extra 0.3 L and 0.7 L.

## Signs you're on track

Pale-yellow urine and rarely feeling thirsty are good everyday checks. Dark urine, headache and dizziness can signal you need more.

## When less is safer

People with heart failure, advanced kidney disease or certain hormone conditions may be told to limit fluids. Very large intakes in a short time, especially during endurance events, can dangerously dilute blood sodium. Follow your clinician's limit if you have one.
