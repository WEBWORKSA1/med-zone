---
title: Pack-Year Calculator and Lung Screening Check
calc: packyears
category: Everyday health
order: 13
description: Calculate smoking pack-years and check whether you meet the USPSTF 2021 criteria for yearly lung cancer screening.
cta: insurance
updated: 2026-11-11
related: [map, sleep, bmi]
inputs:
  - {id: cpd, label: Cigarettes per day, type: number, unit: per day, min: 1, max: 100, step: 1, ph: "20"}
  - {id: years, label: Years smoked, type: number, unit: years, min: 1, max: 80, step: 1, ph: "25"}
  - {id: age, label: Current age, type: number, unit: years, min: 18, max: 110, step: 1, ph: "58"}
  - id: status
    label: Smoking status
    type: select
    options:
      - {v: current, t: "I smoke now"}
      - {v: former, t: "I have quit"}
  - {id: quit, label: Years since quitting, type: number, unit: years, min: 0, max: 80, step: 1, opt: true, ph: "5"}
refs:
  - {t: "U.S. Preventive Services Task Force: Lung cancer screening recommendation (2021)", u: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"}
  - {t: "National Cancer Institute: Pack year definition", u: "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/pack-year"}
---
## What a pack-year is

One pack-year equals smoking 20 cigarettes (one pack) a day for one year. <span class="formula">Pack-years = (cigarettes per day / 20) × years smoked</span>. Ten cigarettes a day for 30 years is 15 pack-years.

## Who should be screened

The U.S. Preventive Services Task Force (2021) recommends a yearly low-dose CT scan for adults who:

1. are aged 50 to 80,
2. have a history of at least 20 pack-years, and
3. smoke now or quit within the past 15 years.

Screening finds lung cancer earlier, when treatment works better. It also has harms, including false alarms and follow-up procedures, so the decision should be shared with a clinician.

## Quitting helps at any age

Risk of heart attack starts to fall within a year of quitting, and lung cancer risk keeps dropping over the following years. Counselling plus medication roughly doubles quit rates compared with willpower alone. In the U.S., call 1-800-QUIT-NOW for free support; most countries have a national quitline.
