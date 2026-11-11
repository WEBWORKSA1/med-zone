---
title: CHA2DS2-VASc Score Calculator
calc: chadsvasc
category: Heart & circulation
order: 11
description: Calculate the CHA2DS2-VASc stroke-risk score for atrial fibrillation, with the 2024 ESC CHA2DS2-VA version alongside.
cta: trials
updated: 2026-11-11
related: [map, qtc, egfr]
inputs:
  - {type: sex}
  - id: agegrp
    label: Age
    type: select
    options:
      - {v: "0", t: "Under 65"}
      - {v: "65", t: "65 to 74 (1 point)"}
      - {v: "75", t: "75 or older (2 points)"}
  - {id: chf, type: check, points: 1, label: "Congestive heart failure or left-ventricular dysfunction"}
  - {id: htn, type: check, points: 1, label: "Hypertension"}
  - {id: dm, type: check, points: 1, label: "Diabetes mellitus"}
  - {id: stroke, type: check, points: 2, label: "Prior stroke, TIA or thromboembolism"}
  - {id: vasc, type: check, points: 1, label: "Vascular disease (prior heart attack, peripheral artery disease or aortic plaque)"}
refs:
  - {t: "PubMed: Lip GY et al. Refining clinical risk stratification for predicting stroke in atrial fibrillation (CHA2DS2-VASc), Chest 2010", u: "https://pubmed.ncbi.nlm.nih.gov/?term=Lip+refining+clinical+risk+stratification+predicting+stroke+thromboembolism+atrial+fibrillation+Chest+2010"}
  - {t: "PubMed: 2023 ACC/AHA/ACCP/HRS guideline for atrial fibrillation", u: "https://pubmed.ncbi.nlm.nih.gov/?term=2023+ACC%2FAHA%2FACCP%2FHRS+guideline+diagnosis+management+atrial+fibrillation"}
  - {t: "PubMed: 2024 ESC guidelines for the management of atrial fibrillation", u: "https://pubmed.ncbi.nlm.nih.gov/?term=2024+ESC+guidelines+management+atrial+fibrillation"}
---
## What the score is for

CHA2DS2-VASc estimates the yearly risk of stroke in people with atrial fibrillation (AF) who don't have a mechanical heart valve or moderate-to-severe mitral stenosis. It helps clinicians and patients decide whether the benefit of an anticoagulant outweighs its bleeding risk.

## Scoring

| Factor | Points |
|---|---|
| Congestive heart failure | 1 |
| Hypertension | 1 |
| Age 75 or older | 2 |
| Diabetes | 1 |
| Stroke, TIA or thromboembolism | 2 |
| Vascular disease | 1 |
| Age 65 to 74 | 1 |
| Sex category: female | 1 |

## How guidelines use it

The 2023 American guideline recommends anticoagulation at a score of 2 or more in men and 3 or more in women, and says it is reasonable to consider at 1 (men) or 2 (women). In 2024 the European Society of Cardiology moved to **CHA2DS2-VA**, which drops the sex point: 2 or more favours anticoagulation and 1 means it should be considered.

## Beyond the score

Bleeding risk, kidney function, falls, drug interactions and personal values all shape the final decision. This calculator supports that conversation; it does not replace it.
