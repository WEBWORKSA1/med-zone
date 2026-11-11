/* Med.Zone live data: openFDA drug labels and recalls, NLM Clinical Tables (conditions, ICD-10, RxTerms),
   ClinicalTrials.gov API v2, PubMed E-utilities, and the auto-updated news and video feeds. */
(function () {
  'use strict';
  var MZ = window.MZ, $ = MZ.$, $$ = MZ.$$, esc = MZ.esc;
  var CT = 'https://clinicaltables.nlm.nih.gov/api/';

  function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '...' : s; }
  function one(a) { return Array.isArray(a) ? a[0] : a; }
  function ymd(s) { s = String(s || ''); if (!/^\d{8}$/.test(s)) return s; return MZ.fmtDate(new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8))); }
  function busy(box, msg) { box.innerHTML = '<p class="loading">' + esc(msg || 'Loading live data...') + '</p>'; }
  function fail(box, msg, link, text) { box.innerHTML = '<div class="empty">' + esc(msg) + (link ? ' <a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(text) + '</a>' : '') + '</div>'; }
  function qParam() { return new URLSearchParams(location.search).get('q') || ''; }

  /* Autocomplete backed by NLM Clinical Tables */
  function autocomplete(input, urlFn, pick) {
    var wrap = input.parentNode, ul = document.createElement('ul'), t, items = [], sel = -1;
    wrap.classList.add('suggest');
    ul.className = 'suggest-list'; ul.hidden = true; ul.setAttribute('role', 'listbox');
    wrap.appendChild(ul);
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', function () {
      clearTimeout(t);
      var q = input.value.trim();
      if (q.length < 2) { ul.hidden = true; return; }
      t = setTimeout(function () {
        MZ.getJSON(urlFn(q), 8000).then(function (j) {
          items = (j[3] || []).map(function (r) { return Array.isArray(r) ? r.filter(Boolean).join(' - ') : r; }).slice(0, 8);
          sel = -1;
          if (!items.length) { ul.hidden = true; return; }
          ul.innerHTML = items.map(function (x, i) { return '<li role="option" data-i="' + i + '">' + esc(x) + '</li>'; }).join('');
          ul.hidden = false;
        }).catch(function () { ul.hidden = true; });
      }, 220);
    });
    ul.addEventListener('mousedown', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      e.preventDefault(); input.value = items[+li.getAttribute('data-i')]; ul.hidden = true; pick(input.value);
    });
    input.addEventListener('keydown', function (e) {
      if (ul.hidden) return;
      var lis = $$('li', ul);
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, lis.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); }
      else if (e.key === 'Enter' && sel >= 0) { e.preventDefault(); input.value = items[sel]; ul.hidden = true; pick(input.value); return; }
      else if (e.key === 'Escape') { ul.hidden = true; return; }
      else return;
      lis.forEach(function (li, i) { li.setAttribute('aria-selected', i === sel ? 'true' : 'false'); });
    });
    input.addEventListener('blur', function () { setTimeout(function () { ul.hidden = true; }, 150); });
  }

  /* ---------- Drug labels (openFDA) ---------- */
  var SECTIONS = [
    ['Uses', ['indications_and_usage', 'purpose']],
    ['Dosage and administration', ['dosage_and_administration', 'directions']],
    ['Do not use (contraindications)', ['contraindications', 'do_not_use']],
    ['Warnings and precautions', ['warnings_and_cautions', 'warnings', 'precautions']],
    ['Side effects', ['adverse_reactions']],
    ['Drug interactions', ['drug_interactions']],
    ['Pregnancy and breastfeeding', ['pregnancy', 'lactation', 'pregnancy_or_breast_feeding', 'use_in_specific_populations']],
    ['Overdose', ['overdosage']],
    ['Ingredients', ['active_ingredient', 'inactive_ingredient', 'description']],
    ['Storage', ['storage_and_handling', 'how_supplied']]
  ];
  function labelCard(r) {
    var o = r.openfda || {};
    var brand = one(o.brand_name) || one(o.generic_name) || 'Drug label';
    var gen = one(o.generic_name);
    var meta = [one(o.manufacturer_name), (o.route || []).join(', '), one(o.product_type)].filter(Boolean).join('. ');
    var h = '<article class="result"><h3>' + esc(brand) + (gen && gen.toLowerCase() !== brand.toLowerCase() ? ' <small>(' + esc(gen.toLowerCase()) + ')</small>' : '') + '</h3>';
    h += '<p class="meta">' + esc(meta) + (r.effective_time ? '. Label version ' + esc(ymd(r.effective_time)) : '') + '</p>';
    if (r.boxed_warning) h += '<div class="boxed"><strong>Boxed warning:</strong> ' + esc(clip(r.boxed_warning.join(' '), 700)) + '</div>';
    SECTIONS.forEach(function (s) {
      var txt = '';
      s[1].forEach(function (k) { if (r[k]) txt += (txt ? '\n\n' : '') + r[k].join('\n'); });
      if (txt) h += '<details><summary>' + esc(s[0]) + '</summary><div class="label-text">' + esc(clip(txt, 6000)) + '</div></details>';
    });
    if (r.set_id) h += '<p><a href="https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=' + encodeURIComponent(r.set_id) + '" target="_blank" rel="noopener">Open the full label on DailyMed</a></p>';
    return h + '</article>';
  }
  function searchLabels(q, box) {
    var term = q.replace(/\(.*?\)/g, '').replace(/["\\]/g, '').trim();
    if (!term) return;
    busy(box, 'Searching FDA drug labels for "' + term + '"...');
    var enc = encodeURIComponent('"' + term + '"');
    var url = 'https://api.fda.gov/drug/label.json?search=openfda.brand_name:' + enc + '+openfda.generic_name:' + enc + '+openfda.substance_name:' + enc + '&limit=6';
    MZ.getJSON(url).then(function (j) {
      var res = j.results || [];
      if (!res.length) throw new Error('none');
      box.innerHTML = '<p class="fine">' + res.length + ' of ' + ((j.meta && j.meta.results && j.meta.results.total) || res.length) + ' FDA label(s). Text comes straight from manufacturer labeling submitted to the FDA.</p>' + res.map(labelCard).join('');
    }).catch(function (e) {
      fail(box, /404|none/.test(String(e && e.message)) ? 'No FDA label matched "' + term + '". Try the generic name (for example "atorvastatin" instead of a brand).' : 'The FDA service did not respond. Try again in a moment, or search', 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=' + encodeURIComponent(term), 'DailyMed directly');
    });
  }

  /* ---------- Recalls (openFDA enforcement) ---------- */
  function loadRecalls(box) {
    var kind = box.getAttribute('data-kind') || 'drug', limit = box.getAttribute('data-limit') || 8;
    busy(box, 'Loading the latest FDA recalls...');
    MZ.getJSON('https://api.fda.gov/' + kind + '/enforcement.json?sort=report_date:desc&limit=' + limit).then(function (j) {
      var res = j.results || [];
      box.innerHTML = '<ul class="feed">' + res.map(function (r) {
        var cls = r.classification === 'Class I' ? 'high' : r.classification === 'Class II' ? 'warn' : 'info';
        return '<li><span class="pill ' + cls + '">' + esc(r.classification || 'Recall') + '</span><strong>' + esc(clip(r.product_description, 140)) + '</strong><span class="meta">' + esc(clip(r.reason_for_recall, 180)) + '</span><span class="meta">' + esc(r.recalling_firm || '') + '. Reported ' + esc(ymd(r.report_date)) + '. Status: ' + esc(r.status || 'n/a') + '</span></li>';
      }).join('') + '</ul>';
    }).catch(function () { fail(box, 'Recall data is temporarily unavailable. See the', 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts', 'FDA recalls page'); });
  }

  /* ---------- Conditions and ICD-10 (NLM Clinical Tables) ---------- */
  function links(x) {
    var out = [], flat = [];
    (function walk(v) { if (Array.isArray(v)) v.forEach(walk); else if (v != null) flat.push(String(v)); })(x);
    flat.forEach(function (s, i) {
      s.split(/,(?=https?:)/).forEach(function (part) {
        if (/^https?:/.test(part)) out.push({ u: part, t: (flat[i + 1] && !/^https?:/.test(flat[i + 1])) ? flat[i + 1] : 'MedlinePlus' });
      });
    });
    return out.slice(0, 3);
  }
  function searchConditions(q, box) {
    busy(box, 'Searching conditions...');
    var url = CT + 'conditions/v3/search?terms=' + encodeURIComponent(q) + '&maxList=15&df=primary_name,consumer_name&ef=info_link_data,icd10cm_codes';
    MZ.getJSON(url).then(function (j) {
      var disp = j[3] || [], ex = j[2] || {};
      if (!disp.length) throw new Error('none');
      box.innerHTML = disp.map(function (d, i) {
        var lk = links((ex.info_link_data || [])[i]);
        var codes = (ex.icd10cm_codes || [])[i];
        codes = Array.isArray(codes) ? codes.join(', ') : (codes || '');
        return '<article class="result"><h3>' + esc(d[0]) + '</h3>' + (d[1] && d[1] !== d[0] ? '<p class="meta">Also called: ' + esc(d[1]) + '</p>' : '') +
          (codes ? '<p><span class="pill info">ICD-10-CM</span>' + esc(clip(codes, 160)) + '</p>' : '') +
          (lk.length ? '<p>' + lk.map(function (l) { return '<a href="' + esc(l.u) + '" target="_blank" rel="noopener">' + esc(l.t) + ' (MedlinePlus)</a>'; }).join(' | ') + '</p>' : '<p><a href="https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&query=' + encodeURIComponent(d[0]) + '" target="_blank" rel="noopener">Read about ' + esc(d[0]) + ' on MedlinePlus</a></p>') +
          '<p class="fine"><a href="' + MZ.url('/trials/') + '?q=' + encodeURIComponent(d[0]) + '">Find clinical trials</a> | <a href="' + MZ.url('/research/') + '?q=' + encodeURIComponent(d[0]) + '">Latest research</a></p></article>';
      }).join('');
    }).catch(function () { fail(box, 'No condition matched "' + q + '". Try a simpler term, or search', 'https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&query=' + encodeURIComponent(q), 'MedlinePlus'); });
  }
  function searchICD(q, box) {
    busy(box, 'Searching ICD-10-CM...');
    MZ.getJSON(CT + 'icd10cm/v3/search?sf=code,name&terms=' + encodeURIComponent(q) + '&maxList=30').then(function (j) {
      var rows = j[3] || [];
      if (!rows.length) throw new Error('none');
      box.innerHTML = '<div class="table-scroll"><table class="data-table"><thead><tr><th>Code</th><th>Description</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td><strong>' + esc(r[0]) + '</strong></td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div><p class="fine">Showing ' + rows.length + ' of ' + j[0] + ' matches. ICD-10-CM is the U.S. clinical modification; codes are for reference, not billing advice.</p>';
    }).catch(function () { fail(box, 'No ICD-10-CM code matched "' + q + '".'); });
  }

  /* ---------- Clinical trials (ClinicalTrials.gov API v2) ---------- */
  function trialCard(s) {
    var p = s.protocolSection || {}, id = p.identificationModule || {}, st = p.statusModule || {}, d = p.designModule || {}, c = p.conditionsModule || {}, loc = (p.contactsLocationsModule || {}).locations || [], desc = p.descriptionModule || {};
    var status = (st.overallStatus || '').replace(/_/g, ' ').toLowerCase();
    var places = loc.slice(0, 4).map(function (l) { return [l.city, l.country].filter(Boolean).join(', '); }).filter(Boolean);
    return '<article class="result"><h3><a href="https://clinicaltrials.gov/study/' + esc(id.nctId) + '" target="_blank" rel="noopener">' + esc(id.briefTitle || id.nctId) + '</a></h3>' +
      '<p class="meta"><span class="pill ' + (/recruiting/.test(status) && !/not/.test(status) ? 'ok' : 'info') + '">' + esc(status || 'status n/a') + '</span>' + esc(id.nctId) + (d.phases ? '. ' + esc(d.phases.join(', ').replace(/_/g, ' ')) : '') + (c.conditions ? '. ' + esc(clip(c.conditions.join(', '), 120)) : '') + '</p>' +
      (desc.briefSummary ? '<p>' + esc(clip(desc.briefSummary, 320)) + '</p>' : '') +
      (places.length ? '<p class="fine">Sites include: ' + esc(places.join('; ')) + (loc.length > 4 ? ' and ' + (loc.length - 4) + ' more' : '') + '</p>' : '') + '</article>';
  }
  function searchTrials(form, box, token) {
    var cond = form.elements.cond.value.trim(), locn = form.elements.locn.value.trim(), status = form.elements.status.value;
    if (!cond) return;
    if (!token) busy(box, 'Searching ClinicalTrials.gov...');
    var url = 'https://clinicaltrials.gov/api/v2/studies?format=json&countTotal=true&pageSize=10&query.cond=' + encodeURIComponent(cond) + (locn ? '&query.locn=' + encodeURIComponent(locn) : '') + (status ? '&filter.overallStatus=' + status : '') + (token ? '&pageToken=' + encodeURIComponent(token) : '');
    var ext = 'https://clinicaltrials.gov/search?cond=' + encodeURIComponent(cond) + (locn ? '&locStr=' + encodeURIComponent(locn) : '');
    MZ.getJSON(url).then(function (j) {
      var studies = j.studies || [];
      if (!studies.length && !token) throw new Error('none');
      var more = $('.load-more', box); if (more) more.remove();
      var html = studies.map(trialCard).join('');
      if (!token) {
        html = '<p class="fine">' + (j.totalCount != null ? j.totalCount.toLocaleString() + ' studies found. ' : '') + 'Data from ClinicalTrials.gov, run by the U.S. National Library of Medicine.</p><div class="lead-cta"><h2 class="side-title">Want help finding a trial you qualify for?</h2><p>Share your condition area and region. A trial-recruitment partner can check eligibility with you, free.</p><a class="btn btn-signal" href="' + MZ.url('/connect/') + '?intent=trials&amp;condition=' + encodeURIComponent(cond) + '">Check trials for me</a></div>' + html;
        box.innerHTML = html;
      } else box.insertAdjacentHTML('beforeend', html);
      if (j.nextPageToken) {
        var b = document.createElement('button');
        b.className = 'btn load-more'; b.type = 'button'; b.textContent = 'Load more studies';
        b.addEventListener('click', function () { b.disabled = true; b.textContent = 'Loading...'; searchTrials(form, box, j.nextPageToken); });
        box.appendChild(b);
      }
    }).catch(function (e) {
      fail(box, /none/.test(String(e && e.message)) ? 'No studies matched. Try a broader condition or remove the location.' : 'ClinicalTrials.gov could not be reached from your browser. Open the same search', ext, 'on ClinicalTrials.gov');
    });
  }

  /* ---------- Research (PubMed E-utilities) ---------- */
  function searchPubMed(q, filter, box) {
    busy(box, 'Searching PubMed...');
    var term = q + (filter ? ' AND ' + filter : '');
    var eu = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
    MZ.getJSON(eu + 'esearch.fcgi?db=pubmed&retmode=json&retmax=12&sort=pub_date&tool=medzone&term=' + encodeURIComponent(term)).then(function (j) {
      var ids = (j.esearchresult || {}).idlist || [];
      if (!ids.length) throw new Error('none');
      return MZ.getJSON(eu + 'esummary.fcgi?db=pubmed&retmode=json&tool=medzone&id=' + ids.join(',')).then(function (s) {
        var r = s.result || {}, uids = r.uids || ids;
        box.innerHTML = '<ul class="feed">' + uids.map(function (u) {
          var a = r[u] || {}, au = (a.authors || []).slice(0, 3).map(function (x) { return x.name; }).join(', ') + ((a.authors || []).length > 3 ? ' et al.' : '');
          return '<li><a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(u) + '/" target="_blank" rel="noopener">' + esc(a.title || ('PMID ' + u)) + '</a><span class="meta">' + esc(au) + (au ? '. ' : '') + '<em>' + esc(a.fulljournalname || a.source || '') + '</em>. ' + esc(a.pubdate || '') + '. PMID ' + esc(u) + '</span></li>';
        }).join('') + '</ul><p class="fine">' + Number((j.esearchresult || {}).count || 0).toLocaleString() + ' results on PubMed. <a href="https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(term) + '&sort=date" target="_blank" rel="noopener">See all on PubMed</a></p>';
      });
    }).catch(function () { fail(box, 'No recent PubMed results, or PubMed is busy. Try', 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(term), 'the search on PubMed'); });
  }

  /* ---------- Auto-updated feeds ---------- */
  function loadNews(box) {
    var limit = +(box.getAttribute('data-limit') || 50);
    MZ.getJSON(MZ.url('/assets/data/news.json') + '?v=' + (MZ.v || '')).then(function (j) {
      var items = (j.items || []).slice(0, limit);
      var stamp = $('[data-news-updated]'); if (stamp && j.updated) stamp.textContent = MZ.fmtDate(j.updated);
      function draw(list) {
        box.innerHTML = list.length ? '<ul class="feed">' + list.map(function (n) {
          return '<li><span class="tag">' + esc(n.source) + '</span><a href="' + esc(n.link) + '" target="_blank" rel="noopener">' + esc(n.title) + '</a><span class="meta">' + esc(MZ.fmtDate(n.date)) + (n.summary ? '. ' + esc(clip(n.summary, 200)) : '') + '</span></li>';
        }).join('') + '</ul>' : '<div class="empty">No stories match that filter.</div>';
      }
      draw(items);
      var filt = $('[data-news-filter]');
      if (filt) {
        var sources = []; items.forEach(function (n) { if (sources.indexOf(n.source) < 0) sources.push(n.source); });
        filt.innerHTML = '<option value="">All sources</option>' + sources.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
        var qbox = $('[data-news-q]');
        var apply = function () { var s = filt.value, q = (qbox ? qbox.value : '').toLowerCase(); draw(items.filter(function (n) { return (!s || n.source === s) && (!q || (n.title + ' ' + (n.summary || '')).toLowerCase().indexOf(q) >= 0); })); };
        filt.addEventListener('change', apply); if (qbox) qbox.addEventListener('input', apply);
      }
    }).catch(function () { fail(box, 'News is refreshing. Check back shortly.'); });
  }
  function loadLatestVideos(box) {
    MZ.getJSON(MZ.url('/assets/data/videos-latest.json') + '?v=' + (MZ.v || '')).then(function (j) {
      var items = (j.items || []).slice(0, +(box.getAttribute('data-limit') || 9));
      if (!items.length) { var sec = box.closest('[data-hide-empty]'); if (sec) sec.hidden = true; return; }
      box.innerHTML = items.map(function (v) {
        return '<div class="video-card"><button class="yt" type="button" data-yt="' + esc(v.id) + '" aria-label="Play: ' + esc(v.title) + '" style="background-image:url(https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg)"></button><h3>' + esc(v.title) + '</h3><p>' + esc(v.channel) + '. ' + esc(MZ.fmtDate(v.date)) + '</p></div>';
      }).join('');
    }).catch(function () { var sec = box.closest('[data-hide-empty]'); if (sec) sec.hidden = true; });
  }

  function bind(formSel, fn) {
    var f = $(formSel); if (!f) return null;
    f.addEventListener('submit', function (e) { e.preventDefault(); fn(f); });
    return f;
  }

  function init() {
    $$('[data-live=recalls]').forEach(loadRecalls);
    $$('[data-live=news]').forEach(loadNews);
    $$('[data-live=videos]').forEach(loadLatestVideos);
    var kindSel = $('[data-recall-kind]');
    if (kindSel) kindSel.addEventListener('change', function () { var b = $('#recalls'); b.setAttribute('data-kind', kindSel.value); loadRecalls(b); });

    var q = qParam();
    var df = bind('#drug-form', function (f) { searchLabels(f.elements.q.value, $('#drug-results')); });
    if (df) {
      autocomplete(df.elements.q, function (s) { return CT + 'rxterms/v3/search?maxList=8&terms=' + encodeURIComponent(s); }, function (v) { searchLabels(v, $('#drug-results')); });
      if (q) { df.elements.q.value = q; searchLabels(q, $('#drug-results')); }
    }
    var cf = bind('#cond-form', function (f) { searchConditions(f.elements.q.value.trim(), $('#cond-results')); });
    if (cf) {
      autocomplete(cf.elements.q, function (s) { return CT + 'conditions/v3/search?maxList=8&terms=' + encodeURIComponent(s); }, function (v) { searchConditions(v, $('#cond-results')); });
      if (q) { cf.elements.q.value = q; searchConditions(q, $('#cond-results')); }
    }
    bind('#icd-form', function (f) { searchICD(f.elements.q.value.trim(), $('#icd-results')); });
    var tf = bind('#trial-form', function (f) { searchTrials(f, $('#trial-results')); });
    if (tf && q) { tf.elements.cond.value = q; searchTrials(tf, $('#trial-results')); }
    var rf = bind('#research-form', function (f) { searchPubMed(f.elements.q.value.trim(), f.elements.filter.value, $('#research-results')); });
    if (rf) {
      rf.elements.q.value = q || rf.elements.q.value || 'hypertension';
      searchPubMed(rf.elements.q.value, rf.elements.filter.value, $('#research-results'));
    }
    $$('[data-fill]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = $(b.getAttribute('data-target')); if (!f) return;
        var input = f.elements.q || f.elements.cond; input.value = b.getAttribute('data-fill');
        f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    });
  }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
