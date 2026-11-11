---
title: Glasgow Coma Scale (GCS) Calculator
calc: gcs
category: Nursing & clinical
order: 23
description: Score eye, verbal and motor responses on the Glasgow Coma Scale and classify brain injury as mild, moderate or severe.
cta: careers
updated: 2026-11-11
related: [map, ivdrip, dose]
inputs:
  - id: eye
    label: Eye opening (E)
    type: select
    value: "4"
    options:
      - {v: "4", t: "4: Spontaneous"}
      - {v: "3", t: "3: To sound"}
      - {v: "2", t: "2: To pressure"}
      - {v: "1", t: "1: None"}
  - id: verbal
    label: Verbal response (V)
    type: select
    value: "5"
    options:
      - {v: "5", t: "5: Oriented"}
      - {v: "4", t: "4: Confused"}
      - {v: "3", t: "3: Words"}
      - {v: "2", t: "2: Sounds"}
      - {v: "1", t: "1: None"}
  - id: motor
    label: Motor response (M)
    type: select
    value: "6"
    options:
      - {v: "6", t: "6: Obeys commands"}
      - {v: "5", t: "5: Localising"}
      - {v: "4", t: "4: Normal flexion"}
      - {v: "3", t: "3: Abnormal flexion"}
      - {v: "2", t: "2: Extension"}
      - {v: "1", t: "1: None"}
refs:
  - {t: "Glasgow Coma Scale: official structured approach", u: "https://www.glasgowcomascale.org/"}
  - {t: "PubMed: Teasdale G, Jennett B. Assessment of coma and impaired consciousness, Lancet 1974", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Teasdale+Jennett+assessment+of+coma+and+impaired+consciousness"}
---
## About the scale

The Glasgow Coma Scale, published by Graham Teasdale and Bryan Jennett in 1974, is the most widely used tool for describing level of consciousness after head injury and in other acute illness. It is repeated over time so that teams can spot deterioration early.

## The three components

- **Eye opening (1 to 4):** spontaneous, to sound, to pressure, or none.
- **Verbal response (1 to 5):** oriented, confused, words, sounds, or none.
- **Motor response (1 to 6):** obeys commands, localising, normal flexion, abnormal flexion, extension, or none.

## Severity

| Total | Classification |
|---|---|
| 13 to 15 | Mild |
| 9 to 12 | Moderate |
| 3 to 8 | Severe; airway protection is usually considered |

## Good practice

Always communicate the components (for example E3 V4 M6) as well as the total, because the same total can describe very different patients. Use a standard stimulus (fingertip, trapezius or supraorbital pressure), record "not testable" when a response cannot be assessed, and record the best response observed.
