/* Med.Zone lead engine: three-step form with intent-specific questions. Submission is handled by core.js. */
(function () {
  'use strict';
  var MZ = window.MZ, $ = MZ.$, $$ = MZ.$$;
  function init() {
    var f = $('#lead-form'); if (!f) return;
    var step = 1, last = 3;
    var panels = $$('.step-panel', f), dots = $$('.steps li', f);
    var back = $('[data-back]', f), next = $('[data-nextstep]', f), submit = $('[type=submit]', f), label = $('#step-label');
    function intent() { var r = f.querySelector('[name=intent]:checked'); return r ? r.value : ''; }
    function applyIntent() {
      var it = intent(), r = f.querySelector('[name=intent]:checked');
      $$('[data-for]', f).forEach(function (el) {
        var on = el.getAttribute('data-for').split(' ').indexOf(it) >= 0;
        el.hidden = !on;
        $$('input,select,textarea', el).forEach(function (i) { i.disabled = !on; });
      });
      $$('.tile', f).forEach(function (t) { t.classList.toggle('on', !!t.querySelector('input:checked')); });
      f.elements.intent_label.value = r ? r.getAttribute('data-label') : '';
    }
    function show(n) {
      step = n;
      panels.forEach(function (p) { p.hidden = +p.getAttribute('data-step') !== n; });
      dots.forEach(function (d, i) { d.classList.toggle('done', i < n); });
      back.hidden = n === 1; next.hidden = n === last; submit.hidden = n !== last;
      label.textContent = 'Step ' + n + ' of ' + last;
      var h = panels[n - 1].querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function valid(n) {
      var p = panels[n - 1];
      if (n === 1 && !intent()) { setMsg('Choose what you need help with.'); return false; }
      var bad = $$('input,select,textarea', p).filter(function (i) { return !i.disabled && !i.closest('[hidden]') && !i.checkValidity(); })[0];
      if (bad) { bad.reportValidity(); return false; }
      setMsg('');
      return true;
    }
    function setMsg(t) { var s = $('.form-status', f); s.hidden = !t; s.className = 'form-status err'; s.textContent = t; }
    next.addEventListener('click', function () { if (valid(step)) show(step + 1); });
    back.addEventListener('click', function () { show(step - 1); });
    f.addEventListener('change', function (e) { if (e.target.name === 'intent') { applyIntent(); setTimeout(function () { if (step === 1) show(2); }, 180); } });
    f.mzValidate = function () {
      if (step < last) { if (valid(step)) show(step + 1); return false; }
      return valid(last);
    };
    applyIntent();
    if (intent()) show(2); else show(1);
    window.scrollTo(0, 0);
  }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
