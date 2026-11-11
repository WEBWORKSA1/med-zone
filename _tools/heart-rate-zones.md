---
title: Heart Rate Zone Calculator
calc: hrzones
category: Heart & circulation
order: 8
featured: true
description: Calculate your maximum heart rate and five training zones, using the Karvonen heart-rate-reserve method when you know your resting pulse.
cta: trials
updated: 2026-11-11
related: [calories, map, bmi]
inputs:
  - {id: age, label: Age, type: number, unit: years, min: 10, max: 100, step: 1, ph: "40"}
  - {id: rest, label: Resting heart rate, type: number, unit: bpm, min: 30, max: 120, step: 1, ph: "62", opt: true, hint: "Count your pulse for 60 seconds before getting out of bed."}
refs:
  - {t: "American Heart Association: Target heart rates chart", u: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates"}
  - {t: "Tanaka H, Monahan KD, Seals DR. Age-predicted maximal heart rate revisited. J Am Coll Cardiol 2001", u: "https://pubmed.ncbi.nlm.nih.gov/11153730/"}
---
## Maximum heart rate

The calculator estimates maximum heart rate with the Tanaka formula, <span class="formula">208 - 0.7 × age</span>, which fit real-world data better than the older <span class="formula">220 - age</span> rule, especially after 40. Both are averages: an individual's true maximum can differ by 10 beats or more.

## The five zones

| Zone | Effort | What it builds |
|---|---|---|
| 1: 50 to 60% | Very easy | Recovery, warm-up |
| 2: 60 to 70% | Easy, conversational | Aerobic base, fat use |
| 3: 70 to 80% | Moderate | Aerobic capacity |
| 4: 80 to 90% | Hard | Lactate threshold |
| 5: 90 to 100% | Maximal | Speed and power |

The American Heart Association describes moderate exercise as 50 to 70 percent of maximum heart rate and vigorous exercise as 70 to 85 percent. Adults should aim for 150 minutes of moderate or 75 minutes of vigorous activity a week.

## Karvonen method

If you enter a resting heart rate, zones use your **heart-rate reserve** (maximum minus resting). <span class="formula">Target = resting + (max - resting) × intensity</span>. This tailors the zones to your fitness.

## Safety

Some medicines, especially beta-blockers, blunt heart-rate response. If you have heart disease, chest pain, fainting or unusual breathlessness on exertion, ask your clinician for a personal plan, ideally based on an exercise test.
