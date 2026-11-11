---
title: BMR Calculator
calc: bmr
category: Body & weight
order: 2
description: Estimate your basal metabolic rate with the Mifflin-St Jeor equation and see your total daily calorie needs at five activity levels.
cta: insurance
updated: 2026-11-11
related: [calories, bmi, bodyfat]
inputs:
  - {type: units}
  - {type: sex}
  - {id: age, label: Age, type: number, unit: years, min: 15, max: 100, step: 1, ph: "35"}
  - {type: height}
  - {type: weight}
refs:
  - {t: "Mifflin MD, St Jeor ST et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr 1990", u: "https://pubmed.ncbi.nlm.nih.gov/2305711/"}
  - {t: "PubMed: Comparison of predictive equations for resting metabolic rate", u: "https://pubmed.ncbi.nlm.nih.gov/?term=comparison+predictive+equations+resting+metabolic+rate+Mifflin"}
---
## What basal metabolic rate means

Your basal metabolic rate (BMR) is the energy your body burns at complete rest to keep you alive: breathing, circulating blood, maintaining body temperature and repairing cells. For most adults it accounts for 60 to 70 percent of the calories they burn each day.

## How it's calculated

Med.Zone uses the Mifflin-St Jeor equation, which studies have found to be the most accurate of the common equations for adults who are not severely ill:

- Men: <span class="formula">10 × weight (kg) + 6.25 × height (cm) - 5 × age + 5</span>
- Women: <span class="formula">10 × weight (kg) + 6.25 × height (cm) - 5 × age - 161</span>

Total daily energy expenditure (TDEE) is BMR multiplied by an activity factor from 1.2 (sedentary) to 1.9 (very hard physical work plus training).

## Using the number

Treat BMR as a floor rather than a target. Eating below your BMR for long periods tends to cost muscle and slow progress. To plan weight change, use the [calorie calculator](../calorie-calculator/), which starts from this BMR and applies a deficit or surplus.

## Limits

Equations predict the average for people like you. Muscle mass, thyroid function, some medicines and genetics move real BMR up or down by around 10 percent. Lab measurement (indirect calorimetry) is the only way to know yours exactly.
