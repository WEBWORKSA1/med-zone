/* Med.Zone core: menu, theme, search palette, forms, consent, newsletter slide-in, video embeds, sharing. */
(function () {
  'use strict';
  var MZ = window.MZ = window.MZ || {};
  var base = MZ.base || '';
  MZ.url = function (p) { return base + p; };
  MZ.$ = function (s, r) { return (r || document).querySelector(s); };
  MZ.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  MZ.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  MZ.store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  MZ.getJSON = function (url, ms) {
    var ctl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, ms || 15000);
    return fetch(url, ctl ? { signal: ctl.signal } : {}).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  };
  MZ.fmtDate = function (d) {
    var x = d instanceof Date ? d : new Date(d);
    if (isNaN(x)) return '';
    return x.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  /* Contact endpoint. The owner address is assembled only at submit time and never written into any page. */
  var K = 23, E = [96, 114, 117, 96, 120, 101, 124, 100, 118, 38, 87, 112, 122, 118, 126, 123, 57, 116, 120, 122];
  function addr() { return E.map(function (c) { return String.fromCharCode(c ^ K); }).join(''); }
  MZ.endpoint = function (ajax) { return 'https://formsubmit.co/' + (ajax ? 'ajax/' : '') + addr(); };

  /* First-touch attribution, stored for lead forms */
  function captureSource() {
    try {
      if (sessionStorage.getItem('mz-src')) return;
      var p = new URLSearchParams(location.search), src = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'ref'].forEach(function (k) { if (p.get(k)) src[k] = p.get(k); });
      src.landing_page = location.pathname;
      if (document.referrer && document.referrer.indexOf(location.host) < 0) src.referrer = document.referrer;
      sessionStorage.setItem('mz-src', JSON.stringify(src));
    } catch (e) {}
  }
  function getSource() { try { return JSON.parse(sessionStorage.getItem('mz-src') || '{}'); } catch (e) { return {}; } }

  /* Menu */
  function initMenu() {
    var btn = MZ.$('[data-menu]'), nav = MZ.$('#main-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Theme */
  function initTheme() {
    MZ.$$('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var root = document.documentElement;
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        MZ.store.set('mz-theme', next);
      });
    });
  }

  /* Search palette */
  var idx = null;
  function loadIndex() {
    if (idx) return Promise.resolve(idx);
    return MZ.getJSON(MZ.url('/search.json')).then(function (j) { idx = j; return j; });
  }
  function scoreItem(it, terms) {
    var title = (it.t || '').toLowerCase();
    var hay = (title + ' ' + (it.d || '') + ' ' + (it.k || '') + ' ' + (it.a || '')).toLowerCase();
    var s = 0;
    for (var i = 0; i < terms.length; i++) {
      if (hay.indexOf(terms[i]) < 0) return 0;
      s += title.indexOf(terms[i]) === 0 ? 5 : title.indexOf(terms[i]) > 0 ? 3 : 1;
    }
    return s;
  }
  function initPalette() {
    var dlg = MZ.$('#palette'); if (!dlg) return;
    var input = MZ.$('#palette-q'), list = MZ.$('#palette-results'), sel = 0, shown = [];
    function render() {
      var q = input.value.trim().toLowerCase();
      loadIndex().then(function (items) {
        if (!q) shown = items.filter(function (x) { return x.f; }).slice(0, 10);
        else {
          var terms = q.split(/\s+/);
          shown = items.map(function (x) { return { x: x, s: scoreItem(x, terms) }; })
            .filter(function (o) { return o.s > 0; })
            .sort(function (a, b) { return b.s - a.s; })
            .slice(0, 12).map(function (o) { return o.x; });
        }
        sel = 0;
        if (!shown.length) {
          list.innerHTML = '<li class="empty">No match on the site. Search <a href="' + MZ.url('/drugs/') + '?q=' + encodeURIComponent(q) + '">drug labels</a> or <a href="' + MZ.url('/conditions/') + '?q=' + encodeURIComponent(q) + '">conditions</a> for "' + MZ.esc(q) + '".</li>';
          return;
        }
        list.innerHTML = shown.map(function (x, i) {
          return '<li role="option"><a href="' + MZ.esc(x.u) + '"' + (i === 0 ? ' class="sel"' : '') + '>' + MZ.esc(x.t) + '<span>' + MZ.esc(x.k) + (x.d ? ': ' + MZ.esc(x.d) : '') + '</span></a></li>';
        }).join('');
      }).catch(function () { list.innerHTML = '<li class="empty">Search is unavailable offline. Browse <a href="' + MZ.url('/tools/') + '">all calculators</a>.</li>'; });
    }
    function move(d) {
      var links = MZ.$$('a', list); if (!links.length) return;
      sel = (sel + d + links.length) % links.length;
      links.forEach(function (a, i) { a.classList.toggle('sel', i === sel); });
      links[sel].scrollIntoView({ block: 'nearest' });
    }
    MZ.openSearch = function (q) {
      if (typeof dlg.showModal !== 'function') { location.href = MZ.url('/tools/'); return; }
      if (!dlg.open) dlg.showModal();
      input.value = q || '';
      render();
      setTimeout(function () { input.focus(); }, 10);
    };
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var a = MZ.$$('a', list)[sel];
        if (a) location.href = a.href;
      }
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    MZ.$$('[data-open-search]').forEach(function (b) { b.addEventListener('click', function () { MZ.openSearch(''); }); });
    document.addEventListener('keydown', function (e) {
      var typing = /input|textarea|select/i.test((e.target.tagName || '')) || e.target.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); MZ.openSearch(''); }
      else if (e.key === '/' && !typing) { e.preventDefault(); MZ.openSearch(''); }
    });
    MZ.$$('form[data-omni]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = (f.querySelector('input') || {}).value || '';
        MZ.openSearch(q);
      });
    });
  }

  /* Forms: every form with data-mz-form posts to the owner inbox via FormSubmit. */
  function setStatus(f, msg, ok, link, linkText) {
    var s = f.querySelector('.form-status');
    if (!s) { s = document.createElement('p'); s.className = 'form-status'; s.setAttribute('role', 'status'); f.appendChild(s); }
    s.hidden = false;
    s.className = 'form-status ' + (ok ? 'ok' : 'err');
    s.innerHTML = MZ.esc(msg) + (link ? '<a href="' + MZ.esc(link) + '">' + MZ.esc(linkText || link) + '</a>.' : '');
  }
  function finish(f) {
    f.dataset.busy = '';
    var btn = f.querySelector('[type=submit]'); if (btn) btn.disabled = false;
    f.dispatchEvent(new CustomEvent('mz:sent', { bubbles: true }));
    if (f.dataset.next) { location.href = MZ.url(f.dataset.next); return; }
    if (f.dataset.success !== undefined || true) {
      setStatus(f, f.dataset.success || 'Thanks. Your message was sent and we will reply soon.', true, f.dataset.successLink, f.dataset.successLinkText);
    }
    if (f.dataset.keep === undefined) f.reset();
    if (/newsletter/i.test(f.dataset.subject || '')) MZ.store.set('mz-sub', '1');
  }
  function fallbackPost(f, data) {
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = MZ.endpoint(false);
    form.style.display = 'none';
    data._next = location.origin + MZ.url('/thanks/');
    Object.keys(data).forEach(function (k) {
      var i = document.createElement('input');
      i.type = 'hidden'; i.name = k; i.value = data[k];
      form.appendChild(i);
    });
    document.body.appendChild(form);
    form.submit();
  }
  function initForms() {
    MZ.$$('form[data-mz-form]').forEach(function (f) {
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (f.dataset.busy === '1') return;
        if (typeof f.mzValidate === 'function' && !f.mzValidate()) return;
        if (!f.checkValidity()) { f.reportValidity(); return; }
        var hp = f.querySelector('[name=_honey]');
        if (hp && hp.value) return;
        var data = {};
        new FormData(f).forEach(function (v, k) {
          if (k === '_honey' || v === '') return;
          data[k] = data[k] ? data[k] + ', ' + v : String(v);
        });
        var src = getSource();
        Object.keys(src).forEach(function (k) { data['src_' + k] = src[k]; });
        data._subject = (f.dataset.subject || 'Med.Zone form') + (data.intent_label ? ': ' + data.intent_label : '');
        data._template = 'table';
        data._captcha = 'false';
        data.page = location.href;
        data.submitted_at = new Date().toISOString();
        f.dataset.busy = '1';
        var btn = f.querySelector('[type=submit]'); if (btn) btn.disabled = true;
        setStatus(f, 'Sending...', true);
        fetch(MZ.endpoint(true), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) { return r.json(); }).then(function (res) {
          if (String(res.success) === 'true' || /activat/i.test(res.message || '')) finish(f);
          else throw new Error(res.message || 'Not sent');
        }).catch(function () { fallbackPost(f, data); });
      });
    });
    /* Prefill any form field from matching URL parameters, e.g. /contact/?topic=Advertising */
    var p = new URLSearchParams(location.search);
    MZ.$$('form[data-prefill]').forEach(function (f) {
      p.forEach(function (v, k) {
        var el = f.elements[k];
        if (!el || k.charAt(0) === '_') return;
        if (el.length && el[0] && el[0].type === 'radio') {
          for (var i = 0; i < el.length; i++) if (el[i].value === v) { el[i].checked = true; el[i].dispatchEvent(new Event('change', { bubbles: true })); }
        } else if (el.tagName) { el.value = v; }
      });
    });
  }

  /* Email links that never show the address on the page */
  function initMailto() {
    MZ.$$('[data-mailto]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        location.href = 'mailto:' + addr() + '?subject=' + encodeURIComponent(a.getAttribute('data-mailto') || 'Med.Zone');
      });
    });
  }

  /* Cookie notice */
  function initConsent() {
    var box = MZ.$('#consent'); if (!box) return;
    var c = MZ.store.get('mz-consent');
    if (c === 'essential') { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; }
    if (!c) box.hidden = false;
    MZ.$$('[data-consent]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-consent');
        MZ.store.set('mz-consent', v);
        if (v === 'essential') (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
        box.hidden = true;
      });
    });
  }

  /* Newsletter slide-in: desktop only, once every 14 days, never on lead pages */
  function initSlidein() {
    var box = MZ.$('#slidein'); if (!box) return;
    if (document.body.classList.contains('no-slidein') || MZ.store.get('mz-sub')) return;
    var last = parseInt(MZ.store.get('mz-slidein') || '0', 10);
    if (Date.now() - last < 14 * 864e5) return;
    if (!window.matchMedia || !matchMedia('(min-width: 900px)').matches) return;
    var shown = false;
    function show() {
      if (shown) return; shown = true;
      box.hidden = false;
      MZ.store.set('mz-slidein', String(Date.now()));
      window.removeEventListener('scroll', onScroll);
    }
    function onScroll() {
      var h = document.documentElement;
      if ((h.scrollTop + innerHeight) / h.scrollHeight > 0.6) show();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(show, 45000);
    MZ.$('[data-slidein-close]', box).addEventListener('click', function () { box.hidden = true; });
    box.addEventListener('mz:sent', function () { setTimeout(function () { box.hidden = true; }, 4000); });
  }

  /* Lightweight YouTube: load the player only when someone presses play */
  function initVideos() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-yt],[data-yt-list]');
      if (!b) return;
      e.preventDefault();
      var src = b.hasAttribute('data-yt')
        ? 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.getAttribute('data-yt')) + '?autoplay=1&rel=0'
        : 'https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(b.getAttribute('data-yt-list')) + '&autoplay=1&rel=0';
      var f = document.createElement('iframe');
      f.src = src;
      f.title = b.getAttribute('aria-label') || 'YouTube video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      f.loading = 'lazy';
      b.innerHTML = '';
      b.appendChild(f);
      b.removeAttribute('data-yt'); b.removeAttribute('data-yt-list');
    });
  }

  /* Share and copy */
  MZ.copy = function (text, btn) {
    var done = function () { if (btn) { var t = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = t; }, 1600); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
  };
  function initShare() {
    MZ.$$('[data-share]').forEach(function (b) {
      b.addEventListener('click', function () {
        var data = { title: document.title, url: location.href };
        if (navigator.share) navigator.share(data).catch(function () {});
        else MZ.copy(location.href, b);
      });
    });
  }

  function initSW() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      window.addEventListener('load', function () { navigator.serviceWorker.register(MZ.url('/sw.js')).catch(function () {}); });
    }
  }

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    captureSource();
    initMenu(); initTheme(); initPalette(); initForms(); initMailto();
    initConsent(); initSlidein(); initVideos(); initShare(); initSW();
  });
})();
