/* Med.Zone learning tools: quiz, flashcards, table filters and the visit-prep question builder. */
(function () {
  'use strict';
  var MZ = window.MZ, $ = MZ.$, $$ = MZ.$$, esc = MZ.esc;
  function data(id) { var el = document.getElementById(id); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* Quiz */
  function initQuiz() {
    var box = $('#quiz'), all = data('quiz-data');
    if (!box || !all) return;
    var size = +(box.getAttribute('data-size') || 10), qs, i, score, answered;
    function start() { qs = shuffle(all).slice(0, size); i = 0; score = 0; show(); }
    function show() {
      answered = false;
      var q = qs[i], order = shuffle(q.a.map(function (t, k) { return { t: t, k: k }; }));
      box.innerHTML = '<div class="quiz-top"><span>Question ' + (i + 1) + ' of ' + qs.length + '</span><span>Score ' + score + '</span></div>' +
        '<p class="quiz-q">' + esc(q.q) + '</p><div class="quiz-opts">' + order.map(function (o) { return '<button type="button" data-k="' + o.k + '">' + esc(o.t) + '</button>'; }).join('') + '</div><div class="quiz-after"></div>';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-k') && !answered) {
        answered = true;
        var q = qs[i], k = +b.getAttribute('data-k'), right = k === q.c;
        if (right) score++;
        $$('.quiz-opts button', box).forEach(function (x) { var kk = +x.getAttribute('data-k'); if (kk === q.c) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); x.disabled = true; });
        $('.quiz-after', box).innerHTML = '<p class="quiz-why"><strong>' + (right ? 'Correct.' : 'Not quite.') + '</strong> ' + esc(q.why) + '</p><button class="btn btn-ink" type="button" data-next>' + (i + 1 < qs.length ? 'Next question' : 'See my score') + '</button>';
        $('[data-next]', box).focus();
      } else if (b.hasAttribute('data-next')) {
        i++;
        if (i < qs.length) show(); else end();
      } else if (b.hasAttribute('data-restart')) start();
    });
    function end() {
      var best = Math.max(score, +(MZ.store.get('mz-quiz-best') || 0));
      MZ.store.set('mz-quiz-best', String(best));
      var pct = Math.round(score / qs.length * 100);
      box.innerHTML = '<p class="quiz-q">You scored ' + score + ' of ' + qs.length + ' (' + pct + '%).</p><p>Your best this device: ' + best + ' of ' + qs.length + '. ' + (pct >= 80 ? 'Excellent work.' : pct >= 50 ? 'Solid. Review the explanations and go again.' : 'Every round sharpens your knowledge. Try again.') + '</p>' +
        '<div class="r-actions"><button class="btn btn-ink" type="button" data-restart>New round</button><a class="btn btn-signal" href="' + MZ.url('/contests/') + '?score=' + score + '&amp;of=' + qs.length + '#enter">Enter this month\'s contest with this score</a><button class="btn" type="button" data-share-score>Share my score</button></div>';
      $('[data-share-score]', box).addEventListener('click', function (e) {
        var text = 'I scored ' + score + '/' + qs.length + ' on the Med.Zone health quiz. Can you beat it?';
        if (navigator.share) navigator.share({ title: 'Med.Zone quiz', text: text, url: location.href }).catch(function () {});
        else MZ.copy(text + ' ' + location.href, e.target);
      });
    }
    start();
  }

  /* Flashcards */
  function initFlash() {
    var stage = $('#flash'), decks = data('flash-data');
    if (!stage || !decks) return;
    var sel = $('#flash-deck'), card = $('.flash', stage), front = $('.front', stage), back = $('.back', stage), count = $('#flash-count');
    var deck = [], i = 0, known = 0;
    Object.keys(decks).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = decks[k].name; sel.appendChild(o); });
    function load() { deck = shuffle(decks[sel.value].cards); i = 0; known = 0; draw(); }
    function draw() { card.classList.remove('flipped'); var c = deck[i]; front.textContent = c[0]; back.textContent = c[1]; count.textContent = 'Card ' + (i + 1) + ' of ' + deck.length + '. Known: ' + known; }
    card.addEventListener('click', function () { card.classList.toggle('flipped'); });
    $('[data-flash=prev]').addEventListener('click', function () { i = (i - 1 + deck.length) % deck.length; draw(); });
    $('[data-flash=next]').addEventListener('click', function () { i = (i + 1) % deck.length; draw(); });
    $('[data-flash=known]').addEventListener('click', function () { known++; i = (i + 1) % deck.length; draw(); });
    $('[data-flash=shuffle]').addEventListener('click', load);
    sel.addEventListener('change', load);
    document.addEventListener('keydown', function (e) {
      if (/input|select|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { i = (i + 1) % deck.length; draw(); }
      else if (e.key === 'ArrowLeft') { i = (i - 1 + deck.length) % deck.length; draw(); }
    });
    load();
  }

  /* Table filters */
  function initFilters() {
    $$('[data-filter-table]').forEach(function (input) {
      var table = $(input.getAttribute('data-filter-table')); if (!table) return;
      var rows = $$('tbody tr', table), out = $(input.getAttribute('data-filter-count') || 'x-none');
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase(), n = 0;
        rows.forEach(function (r) { var hit = !q || r.textContent.toLowerCase().indexOf(q) >= 0; r.hidden = !hit; if (hit) n++; });
        if (out) out.textContent = n + ' shown';
      });
    });
  }

  /* Visit-prep question builder */
  function initPrep() {
    var f = $('#prep'), out = $('#prep-output'); if (!f || !out) return;
    function build() {
      var parts = [];
      var g = function (n) { var e = f.elements[n]; return e ? e.value.trim() : ''; };
      if (g('reason')) parts.push(['Main reason for my visit', g('reason')]);
      if (g('since')) parts.push(['When it started and how it has changed', g('since')]);
      if (g('meds')) parts.push(['Medicines and supplements I take', g('meds')]);
      if (g('allergies')) parts.push(['Allergies', g('allergies')]);
      var qs = $$('input[name=q]:checked', f).map(function (c) { return c.value; });
      if (g('own')) qs = qs.concat(g('own').split(/\n+/).filter(Boolean));
      var h = '<h3>My visit notes</h3>' + parts.map(function (p) { return '<p><strong>' + esc(p[0]) + ':</strong> ' + esc(p[1]) + '</p>'; }).join('');
      if (qs.length) h += '<p><strong>Questions to ask:</strong></p><ol>' + qs.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>';
      out.innerHTML = parts.length || qs.length ? h : '<p class="fine">Your notes will appear here as you fill in the form.</p>';
    }
    f.addEventListener('input', build); f.addEventListener('change', build);
    var pb = $('[data-prep-print]'); if (pb) pb.addEventListener('click', function () { window.print(); });
    var cb = $('[data-prep-copy]'); if (cb) cb.addEventListener('click', function () { MZ.copy(out.innerText, cb); });
    build();
  }

  function init() { initQuiz(); initFlash(); initFilters(); initPrep(); }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
