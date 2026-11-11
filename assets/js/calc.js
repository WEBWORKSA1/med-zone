/* Med.Zone calculator engine. Each tool page has a form[data-calc=KEY]; the formula for KEY lives in C below.
   Results are estimates for education. Every formula cites its source on the tool page. */
(function () {
  'use strict';
  var MZ = window.MZ || {};
  var esc = MZ.esc || function (s) { return String(s); };
  var KG_LB = 2.20462, IN_CM = 2.54, DAY = 864e5;

  function fx(n, d) {
    if (!isFinite(n)) return '-';
    return Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function band(x, list) {
    for (var i = 0; i < list.length; i++) if (x < list[i][0]) return { t: list[i][1], f: list[i][2] };
    var l = list[list.length - 1];
    return { t: l[1], f: l[2] };
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function log10(x) { return Math.log(x) / Math.LN10; }
  function sod(d) { var x = new Date(d.getTime()); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function fd(d) { return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }); }
  function hm(d) { return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }

  function Reader(form) {
    function el(n) { return form.elements[n]; }
    function raw(n) {
      var e = el(n);
      if (!e) return '';
      if (e.type === 'checkbox') return e.checked ? e.value : '';
      return e.value == null ? '' : e.value;
    }
    function num(n) { var v = raw(n); if (v === '' || v == null) return NaN; return parseFloat(String(v).replace(',', '.')); }
    function units() { var u = form.querySelector('[name=units]:checked'); return u ? u.value : 'metric'; }
    var r = {
      units: units,
      imperial: function () { return units() === 'imperial'; },
      num: num, str: raw,
      checked: function (n) { var e = el(n); return !!(e && e.checked); },
      pts: function (n) { var e = el(n); return e && e.checked ? (parseFloat(e.value) || 0) : 0; },
      sex: function () { return raw('sex'); },
      height: function () {
        if (units() === 'imperial') { var ft = num('h_ft'), inch = num('h_in'); if (!isFinite(ft)) return NaN; return (ft * 12 + (isFinite(inch) ? inch : 0)) * IN_CM; }
        return num('h_cm');
      },
      weight: function () { return units() === 'imperial' ? num('w_lb') / KG_LB : num('w_kg'); },
      len: function (id) { return units() === 'imperial' ? num(id + '_in') * IN_CM : num(id + '_cm'); },
      date: function (n) { var v = raw(n); if (!v) return null; var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
      wfmt: function (kg) { return units() === 'imperial' ? fx(kg * KG_LB, 1) + ' lb' : fx(kg, 1) + ' kg'; },
      lfmt: function (cm) { return units() === 'imperial' ? fx(cm / IN_CM, 1) + ' in' : fx(cm, 1) + ' cm'; }
    };
    return r;
  }

  var C = {};

  C.bmi = function (v) {
    var h = v.height() / 100, w = v.weight(), x = w / (h * h);
    var b = band(x, [[18.5, 'Underweight', 'warn'], [25, 'Healthy weight', 'ok'], [30, 'Overweight', 'warn'], [35, 'Obesity, class 1', 'high'], [40, 'Obesity, class 2', 'high'], [1e9, 'Obesity, class 3', 'high']]);
    var lo = 18.5 * h * h, hi = 24.9 * h * h;
    var change = x > 24.9 ? v.wfmt(w - hi) + ' to lose' : x < 18.5 ? v.wfmt(lo - w) + ' to gain' : 'You are already in range';
    return {
      label: 'Your body mass index', value: fx(x, 1), unit: 'kg/m²', band: b.t, flag: b.f,
      scale: { min: 14, max: 44, v: x, bands: [[18.5, 'warn'], [25, 'ok'], [30, 'warn'], [44, 'high']], ticks: [18.5, 25, 30, 35, 40] },
      rows: [['Healthy-weight range for your height', v.wfmt(lo) + ' to ' + v.wfmt(hi)], ['Distance to the healthy range', change], ['BMI prime (BMI divided by 25)', fx(x / 25, 2)]],
      note: 'Adult categories (age 20 and older). BMI does not measure body fat directly: it can overestimate fat in muscular people and underestimate it in older adults. Children and teens need age- and sex-specific BMI percentiles.'
    };
  };

  function mifflin(v) { var m = v.sex() === 'male'; return 10 * v.weight() + 6.25 * v.height() - 5 * v.num('age') + (m ? 5 : -161); }
  var LEVELS = [['Sedentary (little or no exercise)', 1.2], ['Lightly active (1 to 3 days a week)', 1.375], ['Moderately active (3 to 5 days a week)', 1.55], ['Very active (6 to 7 days a week)', 1.725], ['Extra active (physical job plus training)', 1.9]];

  C.bmr = function (v) {
    var b = mifflin(v);
    return {
      label: 'Basal metabolic rate (Mifflin-St Jeor)', value: fx(b, 0), unit: 'kcal/day', band: 'Energy your body uses at complete rest', flag: 'info',
      rows: LEVELS.map(function (l) { return [l[0], fx(b * l[1], 0) + ' kcal/day']; }),
      note: 'The rows show total daily energy needs: BMR multiplied by a standard activity factor. Two people with identical numbers can differ by about 10%.'
    };
  };

  C.calories = function (v) {
    var b = mifflin(v), act = v.num('activity') || 1.2, tdee = b * act, g = v.num('goal') || 0, t = tdee + g;
    var m = v.sex() === 'male', floor = m ? 1500 : 1200, w = v.weight();
    var perWeek = Math.abs(g) * 7;
    var rate = v.imperial() ? fx(perWeek / 3500, 1) + ' lb' : fx(perWeek / 7700, 2) + ' kg';
    var bandText = g < 0 ? 'About ' + rate + ' loss per week' : g > 0 ? 'About ' + rate + ' gain per week' : 'Maintenance (your TDEE)';
    return {
      label: g === 0 ? 'Calories to maintain your weight' : 'Your daily calorie target', value: fx(t, 0), unit: 'kcal/day', band: bandText, flag: t < floor ? 'warn' : 'ok',
      rows: [['Basal metabolic rate', fx(b, 0) + ' kcal'], ['Maintenance (TDEE)', fx(tdee, 0) + ' kcal'], ['Mild loss (250 kcal deficit)', fx(tdee - 250, 0) + ' kcal'], ['Loss (500 kcal deficit)', fx(tdee - 500, 0) + ' kcal'], ['Gain (250 kcal surplus)', fx(tdee + 250, 0) + ' kcal'], ['Protein at the RDA (0.8 g/kg)', fx(0.8 * w, 0) + ' g/day']],
      note: t < floor ? 'This target is below ' + floor + ' kcal/day. Intakes this low should only be used with medical supervision.' : 'Based on the Mifflin-St Jeor equation. Weigh yourself for 2 to 3 weeks; if the trend does not match your goal, adjust by 100 to 200 kcal.'
    };
  };

  C.bodyfat = function (v) {
    var m = v.sex() === 'male';
    var H = v.height() / IN_CM, N = v.len('neck') / IN_CM, W = v.len('waist') / IN_CM, Hp = v.len('hip') / IN_CM;
    if (!m && !(Hp > 0)) throw 'Enter your hip measurement. The Navy formula for women uses it.';
    if (!(W > N)) throw 'Your waist measurement must be larger than your neck measurement.';
    var bf = m ? 86.010 * log10(W - N) - 70.041 * log10(H) + 36.76 : 163.205 * log10(W + Hp - N) - 97.684 * log10(H) - 78.387;
    bf = clamp(bf, 2, 70);
    var cats = m ? [[6, 'Essential fat level', 'warn'], [14, 'Athletic', 'ok'], [18, 'Fitness', 'ok'], [25, 'Average', 'ok'], [1e9, 'Obesity range', 'high']]
      : [[14, 'Essential fat level', 'warn'], [21, 'Athletic', 'ok'], [25, 'Fitness', 'ok'], [32, 'Average', 'ok'], [1e9, 'Obesity range', 'high']];
    var b = band(bf, cats), rows = [], w = v.weight();
    if (w > 0) { rows.push(['Fat mass', v.wfmt(w * bf / 100)]); rows.push(['Lean mass', v.wfmt(w * (1 - bf / 100))]); }
    rows.push(['Method', 'U.S. Navy circumference equation']);
    return {
      label: 'Estimated body fat', value: fx(bf, 1), unit: '%', band: b.t, flag: b.f, rows: rows,
      scale: m ? { min: 2, max: 40, v: bf, bands: [[6, 'warn'], [25, 'ok'], [40, 'high']], ticks: [6, 14, 18, 25] } : { min: 10, max: 48, v: bf, bands: [[14, 'warn'], [32, 'ok'], [48, 'high']], ticks: [14, 21, 25, 32] },
      note: 'Tape-measure estimates are usually within 3 to 4 percentage points of lab methods. Measure at the same time of day, with the tape snug but not compressing the skin.'
    };
  };

  C.idealweight = function (v) {
    var m = v.sex() === 'male', cm = v.height(), over = cm / IN_CM - 60, h = cm / 100;
    var dev = (m ? 50 : 45.5) + 2.3 * over, rob = (m ? 52 : 49) + (m ? 1.9 : 1.7) * over, mil = (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * over, ham = (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * over;
    var avg = (dev + rob + mil + ham) / 4;
    var shown = v.imperial() ? fx(avg * KG_LB, 0) : fx(avg, 1);
    return {
      label: 'Ideal body weight (average of four formulas)', value: shown, unit: v.imperial() ? 'lb' : 'kg', band: 'Healthy-BMI range: ' + v.wfmt(18.5 * h * h) + ' to ' + v.wfmt(24.9 * h * h), flag: 'info',
      rows: [['Devine (1974)', v.wfmt(dev)], ['Robinson (1983)', v.wfmt(rob)], ['Miller (1983)', v.wfmt(mil)], ['Hamwi (1964)', v.wfmt(ham)]],
      note: (cm < 152.4 ? 'These formulas were built for adults taller than 5 ft (152 cm), so results below that height are less reliable. ' : '') + 'Ideal-weight formulas come from drug-dosing practice, not from health outcomes. The healthy-BMI range is a better everyday target.'
    };
  };

  C.water = function (v) {
    var w = v.weight(), mins = v.num('exercise') || 0, hot = v.str('climate') === 'hot', st = v.str('status'), m = v.sex() === 'male';
    var base = w * 0.033, ex = mins * 0.01, add = (hot ? 0.5 : 0) + (st === 'pregnant' ? 0.3 : st === 'breastfeeding' ? 0.7 : 0);
    var total = base + ex + add;
    var ai = st === 'pregnant' ? '3.0 L/day' : st === 'breastfeeding' ? '3.8 L/day' : m ? '3.7 L/day' : '2.7 L/day';
    return {
      label: 'Estimated daily fluid from drinks', value: fx(total, 1), unit: 'litres', band: fx(total / 0.2366, 0) + ' US cups or ' + fx(total / 0.25, 0) + ' glasses of 250 mL', flag: 'info',
      rows: [['Baseline from body weight (33 mL/kg)', fx(base, 2) + ' L'], ['Exercise (about 0.6 L per hour)', fx(ex, 2) + ' L'], ['Heat and life stage', fx(add, 2) + ' L'], ['Adequate intake of total water (food and drinks, NASEM)', ai]],
      note: 'Thirst and pale-yellow urine are reliable everyday guides. People with heart failure, kidney disease or a prescribed fluid limit should follow their clinician\'s target instead.'
    };
  };

  C.hrzones = function (v) {
    var a = v.num('age'), r = v.num('rest'), max = 208 - 0.7 * a, hasR = r > 0;
    if (hasR && r >= max) throw 'Resting heart rate must be lower than your maximum heart rate.';
    var f = function (p) { return hasR ? r + (max - r) * p / 100 : max * p / 100; };
    var zones = [[50, 60, 'Zone 1: recovery'], [60, 70, 'Zone 2: endurance'], [70, 80, 'Zone 3: tempo'], [80, 90, 'Zone 4: threshold'], [90, 100, 'Zone 5: maximum']];
    var rows = zones.map(function (z) { return [z[2] + ' (' + z[0] + ' to ' + z[1] + '%)', Math.round(f(z[0])) + ' to ' + Math.round(f(z[1])) + ' bpm']; });
    if (hasR) rows.unshift(['Heart rate reserve', Math.round(max - r) + ' bpm']);
    rows.push(['Moderate-intensity range (AHA)', Math.round(f(50)) + ' to ' + Math.round(f(70)) + ' bpm']);
    rows.push(['Maximum by the older 220 minus age rule', Math.round(220 - a) + ' bpm']);
    return {
      label: 'Estimated maximum heart rate (Tanaka)', value: Math.round(max), unit: 'bpm', band: hasR ? 'Zones use your heart-rate reserve (Karvonen)' : 'Zones use percent of maximum heart rate', flag: 'info', rows: rows,
      note: 'Beta-blockers and some other medicines lower heart rate, so zones may not apply. If you have heart disease or symptoms during exercise, ask your clinician for a personal target.'
    };
  };

  C.whtr = function (v) {
    var h = v.height(), w = v.len('waist'), r = w / h;
    var b = band(r, [[0.4, 'Below the usual range', 'info'], [0.5, 'Healthy range', 'ok'], [0.6, 'Increased health risk', 'warn'], [1e9, 'High health risk', 'high']]);
    return {
      label: 'Waist-to-height ratio', value: fx(r, 2), unit: '', band: b.t, flag: b.f,
      scale: { min: 0.3, max: 0.8, v: r, bands: [[0.4, 'info'], [0.5, 'ok'], [0.6, 'warn'], [0.8, 'high']], ticks: [0.4, 0.5, 0.6] },
      rows: [['Waist at half your height', v.lfmt(h / 2)], ['Your waist', v.lfmt(w)]],
      note: 'Keep your waist to less than half your height. Measure midway between the lowest rib and the top of the hip bone after breathing out normally.'
    };
  };

  C.sleep = function (v) {
    var mode = v.str('mode'), t = v.str('time'), lat = 15, start;
    if (mode === 'wake') {
      if (!t) throw 'Enter the time you want to wake up.';
      var p = t.split(':'), wake = new Date(); wake.setHours(+p[0], +p[1], 0, 0);
      var rows = [6, 5, 4].map(function (c) { return [c + ' cycles (' + fx(c * 1.5, 1) + ' h of sleep)', 'In bed by ' + hm(new Date(wake.getTime() - (c * 90 + lat) * 60000))]; });
      return { label: 'Best bedtime to wake at ' + hm(wake), value: hm(new Date(wake.getTime() - (5 * 90 + lat) * 60000)), unit: '', band: '5 sleep cycles, 7.5 hours asleep', flag: 'ok', rows: rows,
        note: 'Times allow about 15 minutes to fall asleep. Sleep cycles average around 90 minutes but vary from about 70 to 120. Adults need at least 7 hours a night.' };
    }
    if (t) { var q = t.split(':'); start = new Date(); start.setHours(+q[0], +q[1], 0, 0); } else start = new Date();
    var rows2 = [4, 5, 6].map(function (c) { return [c + ' cycles (' + fx(c * 1.5, 1) + ' h of sleep)', 'Wake at ' + hm(new Date(start.getTime() + (c * 90 + lat) * 60000))]; });
    return { label: 'Best wake-up time if you go to bed at ' + hm(start), value: hm(new Date(start.getTime() + (5 * 90 + lat) * 60000)), unit: '', band: '5 sleep cycles, 7.5 hours asleep', flag: 'ok', rows: rows2,
      note: 'Waking at the end of a cycle usually feels easier than waking from deep sleep. Shift workers: keep the bedroom dark and cool, and protect the same sleep window on work days.' };
  };

  C.packyears = function (v) {
    var cpd = v.num('cpd'), yrs = v.num('years'), age = v.num('age'), st = v.str('status'), q = v.num('quit');
    var py = cpd / 20 * yrs;
    var recent = st === 'current' || (isFinite(q) && q <= 15);
    var ok = age >= 50 && age <= 80 && py >= 20 && recent;
    var yn = function (b) { return b ? 'Yes' : 'No'; };
    return {
      label: 'Smoking history', value: fx(py, 1), unit: 'pack-years', band: ok ? 'Meets USPSTF 2021 criteria for yearly lung cancer screening' : 'Does not meet USPSTF 2021 screening criteria', flag: ok ? 'warn' : 'info',
      rows: [['Packs per day', fx(cpd / 20, 2)], ['Age 50 to 80', yn(age >= 50 && age <= 80)], ['20 or more pack-years', yn(py >= 20)], ['Smokes now or quit within 15 years', st === 'former' && !isFinite(q) ? 'Enter years since quitting' : yn(recent)]],
      note: 'Screening uses a yearly low-dose CT scan; discuss benefits and harms with a clinician. Quitting at any age lowers risk. In the U.S., free help is available at 1-800-QUIT-NOW.'
    };
  };

  C.duedate = function (v) {
    var lmp = v.date('lmp');
    if (!lmp) throw 'Enter the first day of your last period.';
    var cyc = v.num('cycle') || 28;
    if (cyc < 20 || cyc > 45) throw 'Cycle length should be between 20 and 45 days.';
    var adj = cyc - 28, edd = addDays(lmp, 280 + adj), today = sod(new Date());
    var ga = Math.floor((today - addDays(lmp, adj)) / DAY);
    if (ga < 0) throw 'That date is in the future. Check the date you entered.';
    if (ga > 300) throw 'That date is more than 42 weeks ago. Check the year.';
    var wk = Math.floor(ga / 7), d = ga % 7, tri = wk < 14 ? 'First trimester' : wk < 28 ? 'Second trimester' : 'Third trimester';
    return {
      label: 'Estimated due date', value: fd(edd), unit: '', band: wk + ' weeks, ' + d + ' days pregnant today (' + tri.toLowerCase() + ')', flag: 'ok',
      rows: [['Likely conception date', fd(addDays(lmp, cyc - 14))], ['First trimester ends', fd(addDays(lmp, adj + 97))], ['Full term begins (39 weeks)', fd(addDays(lmp, adj + 273))], ['Days to go', String(Math.max(0, Math.round((edd - today) / DAY)))]],
      note: 'Due dates from the last period are estimates; an early ultrasound dates a pregnancy more accurately. Most babies arrive within about two weeks either side of the due date.'
    };
  };

  C.ovulation = function (v) {
    var lmp = v.date('lmp');
    if (!lmp) throw 'Enter the first day of your last period.';
    var cyc = v.num('cycle') || 28;
    if (cyc < 20 || cyc > 45) throw 'Cycle length should be between 20 and 45 days.';
    var today = sod(new Date()), k = 0;
    var ovOf = function (i) { return addDays(lmp, i * cyc + cyc - 14); };
    while (addDays(ovOf(k), 1) < today && k < 40) k++;
    var rows = [];
    for (var i = k; i < k + 3; i++) { var o = ovOf(i); rows.push(['Cycle starting ' + fd(addDays(lmp, i * cyc)), 'Fertile ' + fd(addDays(o, -5)) + ' to ' + fd(addDays(o, 1))]); }
    rows.push(['Next period expected', fd(addDays(lmp, (k + 1) * cyc))]);
    var ov = ovOf(k);
    return { label: 'Next estimated ovulation', value: fd(ov), unit: '', band: 'Most fertile days: ' + fd(addDays(ov, -2)) + ' to ' + fd(ov), flag: 'ok', rows: rows,
      note: 'Calendar estimates assume ovulation about 14 days before the next period. Real cycles vary, so ovulation tests or temperature tracking narrow the window. This is not a reliable method of contraception.' };
  };

  C.pregweight = function (v) {
    var h = v.height() / 100, w = v.weight(), wk = v.num('week'), twins = v.checked('twins'), bmi = w / (h * h), lb = v.imperial();
    var cat = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3;
    var names = ['underweight', 'healthy weight', 'overweight', 'obesity'];
    var kg = twins ? [null, [17, 25], [14, 23], [11, 19]][cat] : [[12.5, 18], [11.5, 16], [7, 11.5], [5, 9]][cat];
    var lbs = twins ? [null, [37, 54], [31, 50], [25, 42]][cat] : [[28, 40], [25, 35], [15, 25], [11, 20]][cat];
    if (!kg) throw 'There is not enough evidence for a twin-pregnancy range when pre-pregnancy BMI is under 18.5. Ask your prenatal care team for a personal target.';
    var rate = [[0.44, 0.58], [0.35, 0.50], [0.23, 0.33], [0.17, 0.27]][cat];
    var rows = [['Pre-pregnancy BMI', fx(bmi, 1) + ' (' + names[cat] + ')']];
    if (!twins && wk > 0) {
      var lo = wk <= 13 ? 0.5 * wk / 13 : 0.5 + (wk - 13) * rate[0], hi = wk <= 13 ? 2 * wk / 13 : 2 + (wk - 13) * rate[1];
      rows.push(['Typical gain so far at week ' + wk, v.wfmt(lo) + ' to ' + v.wfmt(hi)]);
      rows.push(['Weekly gain in the 2nd and 3rd trimesters', lb ? fx(rate[0] * KG_LB, 1) + ' to ' + fx(rate[1] * KG_LB, 1) + ' lb' : fx(rate[0], 2) + ' to ' + fx(rate[1], 2) + ' kg']);
    }
    return { label: 'Recommended total gain' + (twins ? ' (twins)' : ''), value: lb ? lbs[0] + ' to ' + lbs[1] : kg[0] + ' to ' + kg[1], unit: lb ? 'lb' : 'kg', band: 'Based on a pre-pregnancy BMI in the ' + names[cat] + ' range', flag: 'ok', rows: rows,
      note: 'Ranges are the Institute of Medicine (2009) guidelines that most prenatal care follows. Your care team may set a different target based on your health.' };
  };

  function scrMg(v) { var s = v.num('scr'); return v.str('scr_unit') === 'umol' ? s / 88.4 : s; }

  C.egfr = function (v) {
    var a = v.num('age'), f = v.sex() === 'female', s = scrMg(v);
    if (a < 18) throw 'CKD-EPI 2021 is validated for adults aged 18 and older.';
    var k = f ? 0.7 : 0.9, al = f ? -0.241 : -0.302;
    var e = 142 * Math.pow(Math.min(s / k, 1), al) * Math.pow(Math.max(s / k, 1), -1.2) * Math.pow(0.9938, a) * (f ? 1.012 : 1);
    var b = band(e, [[15, 'G5: kidney failure range', 'high'], [30, 'G4: severely decreased', 'high'], [45, 'G3b: moderately to severely decreased', 'warn'], [60, 'G3a: mildly to moderately decreased', 'warn'], [90, 'G2: mildly decreased', 'info'], [1e9, 'G1: normal or high', 'ok']]);
    return {
      label: 'Estimated GFR (CKD-EPI 2021)', value: fx(e, 0), unit: 'mL/min/1.73 m²', band: b.t, flag: b.f,
      scale: { min: 0, max: 120, v: Math.min(e, 120), bands: [[15, 'high'], [30, 'high'], [60, 'warn'], [90, 'info'], [120, 'ok']], ticks: [15, 30, 45, 60, 90] },
      rows: [['Creatinine used', fx(s, 2) + ' mg/dL (' + fx(s * 88.4, 0) + ' µmol/L)'], ['Equation', 'CKD-EPI 2021, race-free']],
      note: 'G1 and G2 only indicate chronic kidney disease when other kidney damage markers (such as albumin in the urine) persist for 3 months or more. eGFR is unreliable during sudden illness, in pregnancy and with very high or low muscle mass.'
    };
  };

  C.crcl = function (v) {
    var a = v.num('age'), f = v.sex() === 'female', w = v.weight(), s = scrMg(v), cm = v.height();
    var cg = function (wt) { return (140 - a) * wt / (72 * s) * (f ? 0.85 : 1); };
    var c = cg(w);
    var b = band(c, [[15, 'Below 15 mL/min', 'high'], [30, '15 to 29 mL/min', 'high'], [60, '30 to 59 mL/min', 'warn'], [90, '60 to 89 mL/min', 'info'], [1e9, '90 mL/min or more', 'ok']]);
    var rows = [['Creatinine used', fx(s, 2) + ' mg/dL']];
    if (cm > 0) {
      var ibw = (f ? 45.5 : 50) + 2.3 * (cm / IN_CM - 60), abw = ibw + 0.4 * (w - ibw);
      rows.push(['Ideal body weight', v.wfmt(ibw)]);
      rows.push(['CrCl with ideal body weight', fx(cg(ibw), 0) + ' mL/min']);
      if (w > ibw * 1.2) rows.push(['CrCl with adjusted body weight', fx(cg(abw), 0) + ' mL/min']);
    }
    return { label: 'Creatinine clearance (Cockcroft-Gault, actual weight)', value: fx(c, 0), unit: 'mL/min', band: b.t, flag: b.f, rows: rows,
      note: 'Many drug labels still use Cockcroft-Gault for dose adjustment. Which weight to use (actual, ideal or adjusted) depends on the drug and the patient; check the label or ask a pharmacist.' };
  };

  C.map = function (v) {
    var s = v.num('sbp'), d = v.num('dbp');
    if (!(d < s)) throw 'Diastolic pressure must be lower than systolic pressure.';
    var m = d + (s - d) / 3, pp = s - d;
    var cat = s > 180 || d > 120 ? 'Hypertensive crisis range: seek care now if you have symptoms' : s >= 140 || d >= 90 ? 'Stage 2 hypertension range' : s >= 130 || d >= 80 ? 'Stage 1 hypertension range' : s >= 120 ? 'Elevated' : 'Normal';
    var b = band(m, [[60, 'Low: organs may be under-perfused', 'high'], [65, 'Below the 65 mmHg goal used in critical care', 'warn'], [100.5, 'Within the typical range', 'ok'], [1e9, 'Above the typical range', 'warn']]);
    return { label: 'Mean arterial pressure', value: fx(m, 0), unit: 'mmHg', band: b.t, flag: b.f,
      rows: [['Blood pressure category (ACC/AHA 2017)', cat], ['Pulse pressure', fx(pp, 0) + ' mmHg'], ['Formula', 'DBP + (SBP - DBP) / 3']],
      note: 'One reading is not a diagnosis. High blood pressure is confirmed with repeated readings on separate days, ideally including home measurements.' };
  };

  C.bsa = function (v) {
    var h = v.height(), w = v.weight();
    var mo = Math.sqrt(h * w / 3600), du = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725), ha = 0.024265 * Math.pow(w, 0.5378) * Math.pow(h, 0.3964), ge = 0.0235 * Math.pow(w, 0.51456) * Math.pow(h, 0.42246);
    return { label: 'Body surface area (Mosteller)', value: fx(mo, 2), unit: 'm²', band: 'Typical adult range is about 1.6 to 2.0 m²', flag: 'info',
      rows: [['Du Bois', fx(du, 2) + ' m²'], ['Haycock', fx(ha, 2) + ' m²'], ['Gehan and George', fx(ge, 2) + ' m²']],
      note: 'BSA-based doses (for example chemotherapy) always follow the treating team\'s protocol, which may specify the formula and any dose caps.' };
  };

  C.qtc = function (v) {
    var qt = v.num('qt'), hr = v.num('hr'), f = v.sex() === 'female', rr = 60 / hr;
    var baz = qt / Math.sqrt(rr), fri = qt / Math.cbrt(rr), fra = qt + 154 * (1 - rr), hod = qt + 1.75 * (hr - 60);
    var lim = f ? 460 : 450;
    var b = fri >= 500 ? { t: 'Markedly prolonged (500 ms or more)', f: 'high' } : fri > lim ? { t: 'Prolonged (above ' + lim + ' ms)', f: 'warn' } : fri < 350 ? { t: 'Short (below 350 ms)', f: 'warn' } : { t: 'Within the normal range', f: 'ok' };
    return { label: 'Corrected QT (Fridericia)', value: fx(fri, 0), unit: 'ms', band: b.t, flag: b.f,
      rows: [['Bazett', fx(baz, 0) + ' ms'], ['Framingham', fx(fra, 0) + ' ms'], ['Hodges', fx(hod, 0) + ' ms'], ['RR interval', fx(rr * 1000, 0) + ' ms']],
      note: 'Bazett over-corrects at fast heart rates and under-corrects at slow ones, so Fridericia is preferred in drug-safety work. A QTc of 500 ms or more, or a rise of more than 60 ms from baseline, increases the risk of dangerous arrhythmias.' };
  };

  C.calcium = function (v) {
    var ca = v.num('ca'), mmol = v.str('ca_unit') === 'mmol', al = v.num('alb'), gl = v.str('alb_unit') === 'gl';
    var caMg = mmol ? ca * 4.008 : ca, albG = gl ? al / 10 : al, cor = caMg + 0.8 * (4 - albG);
    var b = band(cor, [[8.5, 'Below the usual range (8.5 to 10.5 mg/dL)', 'warn'], [10.51, 'Within the usual range', 'ok'], [1e9, 'Above the usual range', 'high']]);
    return { label: 'Albumin-corrected calcium', value: mmol ? fx(cor / 4.008, 2) : fx(cor, 1), unit: mmol ? 'mmol/L' : 'mg/dL', band: b.t, flag: b.f,
      rows: [['In the other unit', mmol ? fx(cor, 1) + ' mg/dL' : fx(cor / 4.008, 2) + ' mmol/L'], ['Albumin used', fx(albG, 1) + ' g/dL'], ['Formula', 'Ca + 0.8 × (4.0 - albumin)']],
      note: 'Correction formulas are approximate. When albumin is abnormal or the result changes treatment (kidney disease, critical illness), an ionized calcium test is more reliable.' };
  };

  C.aniongap = function (v) {
    var na = v.num('na'), cl = v.num('cl'), hco = v.num('hco3'), k = v.num('k'), alb = v.num('alb');
    var ag = na - (cl + hco), rows = [['Anion gap without potassium', fx(ag, 1) + ' mmol/L']];
    if (k > 0) rows.push(['Anion gap with potassium', fx(ag + k, 1) + ' mmol/L']);
    var use = ag;
    if (alb > 0) { use = ag + 2.5 * (4 - alb); rows.push(['Albumin-corrected anion gap', fx(use, 1) + ' mmol/L']); }
    var b = band(use, [[4, 'Low', 'warn'], [12.01, 'Within the usual range (about 4 to 12)', 'ok'], [1e9, 'High anion gap', 'high']]);
    return { label: alb > 0 ? 'Albumin-corrected anion gap' : 'Anion gap', value: fx(use, 1), unit: 'mmol/L', band: b.t, flag: b.f, rows: rows,
      note: 'Reference ranges depend on the laboratory analyzer, so compare with your lab\'s range. A high gap points toward added acids such as lactate, ketones, toxins or kidney failure; interpretation needs a blood gas and the clinical picture.' };
  };

  C.a1c = function (v) {
    var a = v.num('a1c');
    if (a < 3 || a > 20) throw 'Enter an A1C between 3% and 20%.';
    var mg = 28.7 * a - 46.7, mm = 1.59 * a - 2.59, ifcc = (a - 2.15) * 10.929;
    var b = band(a, [[5.7, 'Below the prediabetes range', 'ok'], [6.5, 'Prediabetes range (5.7 to 6.4%)', 'warn'], [1e9, 'Diabetes range (6.5% or higher)', 'high']]);
    return { label: 'Estimated average glucose', value: fx(mg, 0), unit: 'mg/dL', band: b.t, flag: b.f,
      scale: { min: 4, max: 14, v: clamp(a, 4, 14), bands: [[5.7, 'ok'], [6.5, 'warn'], [14, 'high']], ticks: [5.7, 6.5, 7, 9, 11] },
      rows: [['Estimated average glucose', fx(mm, 1) + ' mmol/L'], ['A1C in IFCC units', fx(ifcc, 0) + ' mmol/mol'], ['Common goal for many adults with diabetes', 'Below 7% (set individually)']],
      note: 'A diagnosis needs confirmation with a repeat or second test. A1C can read falsely high or low with anemia, recent blood loss or transfusion, some hemoglobin variants, pregnancy and advanced kidney disease.' };
  };

  C.glucose = function (v) {
    var x = v.num('value'), fromMmol = v.str('from') === 'mmol', ctx = v.str('context');
    var mg = fromMmol ? x * 18.016 : x, mm = mg / 18.016;
    var b;
    if (mg < 54) b = { t: 'Level 2 low blood sugar (below 54 mg/dL): treat now', f: 'high' };
    else if (mg < 70) b = { t: 'Low blood sugar (below 70 mg/dL)', f: 'high' };
    else if (ctx === 'fasting') b = band(mg, [[100, 'Normal fasting level', 'ok'], [126, 'Prediabetes range (100 to 125)', 'warn'], [1e9, 'Diabetes range (126 or higher)', 'high']]);
    else if (ctx === 'ogtt') b = band(mg, [[140, 'Normal 2-hour result', 'ok'], [200, 'Prediabetes range (140 to 199)', 'warn'], [1e9, 'Diabetes range (200 or higher)', 'high']]);
    else if (ctx === 'random') b = band(mg, [[140, 'Typical non-fasting level', 'ok'], [200, 'Above the typical range', 'warn'], [1e9, 'Diabetes range if you also have symptoms', 'high']]);
    else b = { t: 'Unit conversion only', f: 'info' };
    return { label: fromMmol ? 'Glucose in mg/dL' : 'Glucose in mmol/L', value: fromMmol ? fx(mg, 0) : fx(mm, 1), unit: fromMmol ? 'mg/dL' : 'mmol/L', band: b.t, flag: b.f,
      rows: [['mg/dL', fx(mg, 0)], ['mmol/L', fx(mm, 1)], ['Conversion factor', '1 mmol/L = 18.016 mg/dL']],
      note: 'Diagnosis of diabetes requires lab testing and, usually, confirmation. If you use insulin or sulfonylureas and see a low reading, follow your hypoglycemia plan.' };
  };

  C.chadsvasc = function (v) {
    var ageS = v.str('agegrp'), ap = ageS === '75' ? 2 : ageS === '65' ? 1 : 0, f = v.sex() === 'female';
    var s = v.pts('chf') + v.pts('htn') + ap + v.pts('dm') + v.pts('stroke') + v.pts('vasc') + (f ? 1 : 0), va = s - (f ? 1 : 0);
    var b = (f ? s >= 3 : s >= 2) ? { t: 'Anticoagulation is generally recommended', f: 'high' } : (f ? s === 2 : s === 1) ? { t: 'Anticoagulation is reasonable to consider', f: 'warn' } : { t: 'Low stroke risk', f: 'ok' };
    return { label: 'CHA₂DS₂-VASc score', value: s, unit: 'of 9', band: b.t, flag: b.f,
      rows: [['Age points', String(ap)], ['Sex category point', f ? '1' : '0'], ['CHA₂DS₂-VA (ESC 2024, sex removed)', String(va)], ['ESC 2024 reading of CHA₂DS₂-VA', va >= 2 ? 'Oral anticoagulation recommended' : va === 1 ? 'Oral anticoagulation should be considered' : 'Not indicated for stroke prevention']],
      note: 'Stroke-risk scores are one input. Bleeding risk, kidney function, other medicines and personal preference also shape the decision. Never start or stop a blood thinner without your clinician.' };
  };

  C.gcs = function (v) {
    var e = v.num('eye'), vb = v.num('verbal'), m = v.num('motor'), t = e + vb + m;
    var b = band(t, [[9, 'Severe (3 to 8)', 'high'], [13, 'Moderate (9 to 12)', 'warn'], [16, 'Mild (13 to 15)', 'ok']]);
    return { label: 'Glasgow Coma Scale', value: t, unit: 'of 15', band: b.t, flag: b.f,
      rows: [['Recorded as', 'E' + e + ' V' + vb + ' M' + m], ['Eye opening', e + ' of 4'], ['Verbal response', vb + ' of 5'], ['Motor response', m + ' of 6']],
      note: 'Report the three components, not only the total. If a component cannot be tested (for example, verbal response when intubated), record it as not testable rather than scoring it 1.' };
  };

  C.ivdrip = function (v) {
    var vol = v.num('volume'), tm = (v.num('hours') || 0) * 60 + (v.num('minutes') || 0), df = v.num('drop');
    if (!(tm > 0)) throw 'Enter how long the infusion should run.';
    var gtt = vol * df / tm, mlh = vol / (tm / 60);
    return { label: 'Drip rate', value: Math.round(gtt), unit: 'gtt/min', band: 'Pump setting: ' + fx(mlh, 1) + ' mL/h', flag: 'info',
      rows: [['Exact drip rate', fx(gtt, 1) + ' gtt/min'], ['Drops every 15 seconds', fx(gtt / 4, 1)], ['Flow rate', fx(mlh, 1) + ' mL/h'], ['Total time', Math.floor(tm / 60) + ' h ' + Math.round(tm % 60) + ' min']],
      note: 'Always check against the order and your facility policy. With a 60 gtt/mL microdrip set, drops per minute equal mL per hour.' };
  };

  C.dose = function (v) {
    var w = v.weight(), d = v.num('mgkg'), fr = v.num('freq') || 1, conc = v.num('conc'), mx = v.num('max');
    var single = w * d, capped = false;
    if (mx > 0 && single > mx) { single = mx; capped = true; }
    var rows = [['Weight used', fx(w, 1) + ' kg'], ['Doses per day', String(fr)], ['Total per day', fx(single * fr, 1) + ' mg']];
    if (conc > 0) rows.push(['Volume per dose', fx(single / conc, 2) + ' mL']);
    return { label: 'Dose per administration', value: fx(single, single < 10 ? 2 : 1), unit: 'mg', band: capped ? 'Capped at the maximum single dose you entered' : 'Weight-based dose', flag: capped ? 'warn' : 'info', rows: rows,
      note: 'An educational double-check only. Verify every dose against the prescription, the product label and your facility protocol, especially for children.' };
  };

  /* ---------- engine ---------- */
  var TRACE = '<svg class="trace" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46 H150 L160 46 L170 14 L182 64 L194 30 L202 46 H282 L292 40 L302 46 H400"/></svg>';

  function scaleHtml(s) {
    var span = s.max - s.min, prev = s.min, segs = '';
    s.bands.forEach(function (b) { var to = Math.min(b[0], s.max); segs += '<i class="' + b[1] + '" style="width:' + ((to - prev) / span * 100).toFixed(2) + '%"></i>'; prev = to; });
    var pos = clamp((s.v - s.min) / span * 100, 0, 100);
    var ticks = (s.ticks || []).map(function (t) { return '<span style="position:absolute;left:' + ((t - s.min) / span * 100).toFixed(2) + '%;transform:translateX(-50%)">' + t + '</span>'; }).join('');
    return '<div class="scale" aria-hidden="true"><div class="scale-bar">' + segs + '</div><div class="scale-mark"><b style="left:' + pos.toFixed(2) + '%"></b></div><div class="scale-ticks" style="position:relative;height:1.3em">' + ticks + '</div></div>';
  }

  function render(box, r) {
    var h = '<div class="strip ecg">' + TRACE + '<p class="r-label">' + esc(r.label) + '</p><p class="r-value"><span>' + esc(r.value) + '</span>' + (r.unit ? ' <small>' + esc(r.unit) + '</small>' : '') + '</p>' + (r.band ? '<p class="r-band flag-' + (r.flag || 'info') + '">' + esc(r.band) + '</p>' : '') + '</div>';
    if (r.scale) h += scaleHtml(r.scale);
    if (r.rows && r.rows.length) h += '<table class="r-rows"><tbody>' + r.rows.map(function (x) { return '<tr><th scope="row">' + esc(x[0]) + '</th><td>' + esc(x[1]) + '</td></tr>'; }).join('') + '</tbody></table>';
    if (r.note) h += '<p class="r-note">' + esc(r.note) + '</p>';
    h += '<div class="r-actions"><button class="btn btn-sm" type="button" data-act="copy">Copy result</button><button class="btn btn-sm" type="button" data-act="link">Copy link with my inputs</button><button class="btn btn-sm" type="button" data-act="print">Print</button></div>';
    box.innerHTML = h;
    box.hidden = false;
  }

  function visible(e) { var g = e.closest('[data-group]'); return !(g && g.hidden); }

  function validate(form) {
    var fields = form.querySelectorAll('input[type=number],input[type=date],input[type=time],select');
    for (var i = 0; i < fields.length; i++) {
      var e = fields[i];
      if (!visible(e) || e.hasAttribute('data-opt') || e.type === 'hidden') continue;
      var lab = form.querySelector('label[for="' + e.id + '"]');
      var name = (e.getAttribute('aria-label') || (lab ? lab.textContent : e.name)).replace(/\(optional\)/, '').trim();
      if (e.value === '') return { el: e, msg: 'Enter ' + name.toLowerCase() + '.' };
      if (e.type === 'number') {
        var n = parseFloat(e.value);
        if (!isFinite(n)) return { el: e, msg: 'Enter a number for ' + name.toLowerCase() + '.' };
        if (e.min !== '' && n < parseFloat(e.min)) return { el: e, msg: name + ' must be at least ' + e.min + '.' };
        if (e.max !== '' && n > parseFloat(e.max)) return { el: e, msg: name + ' must be ' + e.max + ' or less.' };
      }
    }
    var sex = form.querySelectorAll('[name=sex]');
    if (sex.length && !form.querySelector('[name=sex]:checked')) return { el: sex[0], msg: 'Choose the sex used by this formula.' };
    return null;
  }

  function syncUnits(form) {
    var u = form.querySelector('[name=units]:checked'); if (!u) return;
    form.querySelectorAll('[data-group]').forEach(function (g) { g.hidden = g.getAttribute('data-group') !== u.value; });
  }

  function resultText(r, url) {
    var t = r.label + ': ' + r.value + (r.unit ? ' ' + r.unit : '') + (r.band ? ' (' + r.band + ')' : '');
    (r.rows || []).forEach(function (x) { t += '\n' + x[0] + ': ' + x[1]; });
    return t + '\n' + url;
  }

  function linkWithInputs(form) {
    var p = new URLSearchParams();
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name || e.type === 'submit' || e.type === 'reset') return;
      if ((e.type === 'radio' || e.type === 'checkbox') && !e.checked) return;
      if (e.value !== '') p.set(e.name, e.value);
    });
    return location.origin + location.pathname + '?' + p.toString();
  }

  function prefill(form) {
    var p = new URLSearchParams(location.search), any = false;
    p.forEach(function (val, key) {
      var e = form.elements[key]; if (!e) return;
      if (e.length && e[0] && (e[0].type === 'radio')) { for (var i = 0; i < e.length; i++) e[i].checked = e[i].value === val; any = true; }
      else if (e.type === 'checkbox') { e.checked = true; any = true; }
      else if (e.tagName) { e.value = val; any = true; }
    });
    return any;
  }

  function setup(form) {
    var key = form.getAttribute('data-calc'), fn = C[key];
    if (!fn) return;
    var box = document.querySelector(form.getAttribute('data-result') || '#calc-result');
    var err = form.querySelector('.calc-error');
    var last = null, ran = false;
    function run(quiet) {
      var bad = validate(form);
      if (bad) { if (!quiet) { err.textContent = bad.msg; err.hidden = false; bad.el.focus(); } return; }
      try {
        var r = fn(Reader(form));
        if (r == null || r.value === undefined || (typeof r.value === 'number' && !isFinite(r.value)) || r.value === '-' || /NaN/.test(String(r.value))) throw 'Check the values you entered.';
        err.hidden = true; last = r; ran = true;
        render(box, r);
        if (!quiet && box.getBoundingClientRect().top > window.innerHeight * 0.7) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (x) {
        if (!quiet) { err.textContent = typeof x === 'string' ? x : 'Check the values you entered.'; err.hidden = false; }
      }
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(false); });
    form.addEventListener('change', function (e) { if (e.target.name === 'units') syncUnits(form); if (ran) run(true); });
    form.addEventListener('input', function () { if (ran) run(true); });
    form.addEventListener('reset', function () { setTimeout(function () { syncUnits(form); box.hidden = true; err.hidden = true; ran = false; }, 0); });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || !last) return;
      var act = b.getAttribute('data-act');
      if (act === 'print') window.print();
      else if (act === 'copy') (MZ.copy || function () {})(resultText(last, location.origin + location.pathname), b);
      else if (act === 'link') (MZ.copy || function () {})(linkWithInputs(form), b);
    });
    if (prefill(form)) { syncUnits(form); run(true); }
    syncUnits(form);
  }

  window.MZCalc = C;
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () { document.querySelectorAll('form[data-calc]').forEach(setup); });
  if (typeof module !== 'undefined') module.exports = { C: C, Reader: Reader };
})();
