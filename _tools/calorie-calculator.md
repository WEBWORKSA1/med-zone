---
title: Calorie Calculator (TDEE)
calc: calories
category: Body & weight
order: 3
featured: true
description: Find how many calories you need per day to maintain, lose or gain weight, based on the Mifflin-St Jeor equation and your activity level.
cta: insurance
updated: 2026-11-11
related: [bmr, bmi, water, hrzones]
inputs:
  - {type: units}
  - {type: sex}
  - {id: age, label: Age, type: number, unit: years, min: 15, max: 100, step: 1, ph: "35"}
  - {type: height}
  - {type: weight}
  - id: activity
    label: Activity level
    type: select
    value: "1.375"
    options:
      - {v: "1.2", t: "Sedentary: little or no exercise"}
      - {v: "1.375", t: "Light: exercise 1 to 3 days a week"}
      - {v: "1.55", t: "Moderate: exercise 3 to 5 days a week"}
      - {v: "1.725", t: "Very active: 6 to 7 days a week"}
      - {v: "1.9", t: "Extra active: physical job plus training"}
  - id: goal
    label: Goal
    type: select
    value: "0"
    options:
      - {v: "0", t: "Maintain my weight"}
      - {v: "-250", t: "Lose slowly (250 kcal deficit)"}
      - {v: "-500", t: "Lose (500 kcal deficit)"}
      - {v: "250", t: "Gain slowly (250 kcal surplus)"}
      - {v: "500", t: "Gain (500 kcal surplus)"}
refs:
  - {t: "Mifflin MD, St Jeor ST et al. Am J Clin Nutr 1990", u: "https://pubmed.ncbi.nlm.nih.gov/2305711/"}
  - {t: "NIDDK Body Weight Planner", u: "https://www.niddk.nih.gov/bwp"}
  - {t: "Dietary Guidelines for Americans", u: "https://www.dietaryguidelines.gov/"}
---
## How the target is built

1. **Basal metabolic rate** from the Mifflin-St Jeor equation (see the [BMR calculator](../bmr-calculator/)).
2. **Total daily energy expenditure (TDEE)**: BMR multiplied by your activity factor.
3. **Goal adjustment**: a deficit of 250 to 500 kcal a day for gradual loss, or a surplus for gain.

A 500 kcal daily deficit has traditionally been linked to about 0.5 kg (1 lb) of loss per week. In practice, loss slows over time as the body adapts, which is why the NIH Body Weight Planner models change dynamically.

## Practical tips

- Weigh yourself at the same time of day several times a week and look at the 2 to 3 week trend, not single days.
- If the trend doesn't match your goal, change intake by 100 to 200 kcal and reassess.
- Protein, fiber and regular meals make a deficit easier to sustain.

## Safety

The calculator flags targets below 1,200 kcal (women) or 1,500 kcal (men). Very-low-calorie diets can cause nutrient gaps and gallstones and should be medically supervised. During pregnancy, breastfeeding, or with diabetes treated with insulin, plan intake changes with your care team.
