---
title: IV Drip Rate Calculator
calc: ivdrip
category: Nursing & clinical
order: 24
description: Calculate IV drip rate in drops per minute and flow rate in mL/h from volume, time and the administration set's drop factor.
cta: careers
updated: 2026-11-11
related: [dose, gcs, bsa]
inputs:
  - {id: volume, label: Volume to infuse, type: number, unit: mL, min: 1, max: 10000, step: any, ph: "1000"}
  - {id: hours, label: Time (hours), type: number, unit: h, min: 0, max: 72, step: 1, ph: "8"}
  - {id: minutes, label: Time (extra minutes), type: number, unit: min, min: 0, max: 59, step: 1, ph: "0", opt: true}
  - id: drop
    label: Drop factor of the set
    type: select
    value: "20"
    options:
      - {v: "10", t: "10 gtt/mL (macrodrip)"}
      - {v: "15", t: "15 gtt/mL (macrodrip)"}
      - {v: "20", t: "20 gtt/mL (macrodrip)"}
      - {v: "60", t: "60 gtt/mL (microdrip)"}
refs:
  - {t: "NCBI Bookshelf: search StatPearls on intravenous fluid administration and dosage calculations", u: "https://www.ncbi.nlm.nih.gov/books/?term=statpearls+dosage+calculation+intravenous"}
  - {t: "ISMP: Institute for Safe Medication Practices", u: "https://www.ismp.org/"}
---
## Formulas

- <span class="formula">Drops per minute = volume (mL) × drop factor (gtt/mL) / time (minutes)</span>
- <span class="formula">Flow rate (mL/h) = volume (mL) / time (hours)</span>

Example: 1,000 mL over 8 hours with a 20 gtt/mL set is 1,000 × 20 / 480 = 41.7, so about 42 drops per minute, or 125 mL/h on a pump.

## Drop factors

The drop factor is printed on the administration set packaging. Macrodrip sets (10, 15 or 20 gtt/mL) suit routine adult fluids. Microdrip sets (60 gtt/mL) deliver small, precise volumes for children and potent medications; with a microdrip, drops per minute equal mL per hour.

## Counting drops

Count drops in the drip chamber for 15 seconds and multiply by 4, or use the "drops every 15 seconds" figure in the result. Recheck regularly, because gravity flow changes with patient position, cannula patency and bag height.

## Safety

Use an infusion pump for high-alert medications, and follow your facility's double-check policy. This calculator supports, and never replaces, the prescriber's order and local protocols.
