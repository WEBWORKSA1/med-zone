# Med.Zone

Free medical calculators, live FDA drug labels and recalls, clinical-trial and PubMed finders, lab-value references, study tools and plain-language health guides — built as a static Jekyll site that GitHub Pages builds and hosts for free from the `main` branch.

## How the site is built

GitHub Pages runs Jekyll on every push to `main`. There is no build step to run yourself.

| Folder / file | What it holds |
|---|---|
| `_config.yml` | Site settings, AdSense client ID, donation links, contest settings |
| `_layouts/`, `_includes/` | Page shells: header (with the interest banner), footer, forms, ads |
| `_tools/` | One Markdown file per calculator. Front matter defines the inputs; `assets/js/calc.js` holds the formula |
| `_guides/` | Long-form health guides (Markdown). Drop in a new `.md` file to publish a guide |
| `_data/` | Navigation, videos, quiz, flashcards, abbreviations, lab values, open roles |
| `assets/js/` | `core.js` (UI, search, forms, consent), `calc.js` (calculator engine), `live.js` (FDA / NLM / ClinicalTrials.gov / PubMed), `learn.js` (quiz, flashcards, filters) |
| `assets/data/` | `news.json` and `videos-latest.json`, refreshed automatically |
| `scripts/update-feeds.mjs` + `.github/workflows/update-feeds.yml` | Daily job that refreshes health news, latest videos and the sitemap date stamps |

## Add a calculator

1. Copy any file in `_tools/` and change the front matter (`title`, `calc`, `inputs`, `refs`).
2. Add a function with the same `calc` key to `assets/js/calc.js`.
3. Commit. Pages rebuilds and the calculator appears in the directory, search and sitemap.

## One-time setup checklist

1. **Publish:** Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
2. **Forms:** submit any form once on the live site, then click *Activate* in the FormSubmit email that arrives in the owner inbox. All forms (leads, contact, careers, contest, pledges, newsletter) then deliver automatically.
3. **AdSense:** add the site in AdSense, keep `ads.txt` at the domain root, and enable the Google-certified consent message (Privacy & messaging) for EEA/UK visitors.
4. **Custom domain (optional):** point DNS for `med.zone` to GitHub Pages, then add the domain under Settings → Pages. Jekyll picks up the new base URL automatically.
5. **Donations:** paste PayPal / Stripe / Buy Me a Coffee / Ko-fi links into `donate_links` in `_config.yml`; the Support page shows a button for each link you fill in.

## Trademark & copyright

Med.Zone is an independent website. It is not affiliated with any company, product or service that uses a similar name. See `/legal/trademark/` on the site for the full disclosure.
