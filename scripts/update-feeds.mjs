// Refreshes assets/data/news.json and assets/data/videos-latest.json from public RSS/Atom feeds.
// Runs in GitHub Actions (Node 20+, built-in fetch). No dependencies.
import fs from 'node:fs/promises';

const NEWS_FEEDS = [
  { source: 'NIH', url: 'https://www.nih.gov/news-releases/feed.xml' },
  { source: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/health_medicine.xml' },
  { source: 'FDA', url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml' },
  { source: 'Medical Xpress', url: 'https://medicalxpress.com/rss-feed/' },
  { source: 'CDC', url: 'https://tools.cdc.gov/api/v2/resources/media/132608.rss' },
  { source: 'WHO', url: 'https://www.who.int/rss-feeds/news-english.xml' }
];
const MAX_AGE_DAYS = 90, MAX_ITEMS = 80, PER_SOURCE = 20;

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…' };
export function decode(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
const strip = (s) => decode(decode(s).replace(/<[^>]+>/g, ' ')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const tag = (xml, name) => { const m = xml.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i')); return m ? m[1] : ''; };
const clip = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '...' : s);

export function parseFeed(xml, source) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map((b) => {
    let link = strip(tag(b, 'link'));
    if (!link) { const m = b.match(/<link[^>]*href="([^"]+)"/i); link = m ? m[1] : ''; }
    if (!link) link = strip(tag(b, 'guid'));
    const dateRaw = strip(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date'));
    const d = new Date(dateRaw);
    return {
      title: strip(tag(b, 'title')),
      link,
      source,
      date: isNaN(d) ? null : d.toISOString(),
      summary: clip(strip(tag(b, 'description') || tag(b, 'summary') || tag(b, 'content')), 240)
    };
  }).filter((i) => i.title && /^https?:\/\//.test(i.link));
}

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Med.Zone feed refresher (+https://med.zone)' }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.text();
}

async function refreshNews() {
  const cutoff = Date.now() - MAX_AGE_DAYS * 864e5;
  let all = [];
  for (const f of NEWS_FEEDS) {
    try {
      const items = parseFeed(await get(f.url), f.source)
        .filter((i) => i.date && Date.parse(i.date) > cutoff && Date.parse(i.date) <= Date.now() + 864e5)
        .slice(0, PER_SOURCE);
      console.log(`${f.source}: ${items.length} items`);
      all = all.concat(items);
    } catch (e) { console.log(`${f.source}: skipped (${e.message})`); }
  }
  const seen = new Set();
  all = all.filter((i) => (seen.has(i.link) ? false : seen.add(i.link)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, MAX_ITEMS);
  if (all.length < 5) { console.log('Too few news items; keeping the existing file.'); return; }
  await write('assets/data/news.json', { updated: new Date().toISOString(), items: all });
}

async function refreshVideos() {
  const yml = await fs.readFile('_data/videos.yml', 'utf8');
  const chans = [...yml.matchAll(/name:\s*"([^"]+)",\s*list:\s*"UU([^"]+)"/g)].map((m) => ({ name: m[1], id: 'UC' + m[2] }));
  let vids = [];
  for (const c of chans) {
    try {
      const xml = await get('https://www.youtube.com/feeds/videos.xml?channel_id=' + c.id);
      const entries = (xml.match(/<entry>[\s\S]*?<\/entry>/g) || []).slice(0, 3).map((e) => ({
        id: strip(tag(e, 'yt:videoId')), title: strip(tag(e, 'title')), channel: c.name, date: strip(tag(e, 'published'))
      })).filter((v) => /^[\w-]{11}$/.test(v.id));
      console.log(`${c.name}: ${entries.length} videos`);
      vids = vids.concat(entries);
    } catch (e) { console.log(`${c.name}: skipped (${e.message})`); }
  }
  vids.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  if (!vids.length) { console.log('No videos fetched; keeping the existing file.'); return; }
  await write('assets/data/videos-latest.json', { updated: new Date().toISOString(), items: vids.slice(0, 12) });
}

async function write(file, obj) {
  let old = '';
  try { old = await fs.readFile(file, 'utf8'); } catch {}
  const strip = (t) => { try { const o = JSON.parse(t); delete o.updated; return JSON.stringify(o); } catch { return ''; } };
  const next = JSON.stringify(obj, null, 1) + '\n';
  if (strip(old) === strip(next)) { console.log(file + ': unchanged'); return; }
  await fs.writeFile(file, next);
  console.log(file + ': updated');
}

if (process.argv[1] && process.argv[1].endsWith('update-feeds.mjs')) {
  await refreshNews();
  await refreshVideos();
}
