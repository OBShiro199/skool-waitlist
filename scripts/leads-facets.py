#!/usr/bin/env python3
"""Builds lib/leads/facet-values.json: every filter option with its exact lead count.

Values come from sampling real rows through the live search API (plus the fixed sets from the PRD),
then each value is counted exactly with a zero-row search. Run it signed in as any member:

    python3 scripts/leads-facets.py --cookies jar.txt [--sample harvest.json]

jar.txt is a Netscape cookie file holding a vault_session cookie for www.buildsoftwaresolo.com.
"""
import argparse, collections, concurrent.futures as cf, datetime, http.cookiejar, json, os, sys, time, urllib.request

BASE = 'https://www.buildsoftwaresolo.com'
FACETS = {  # facet name -> (filter key, row field(s) to sample)
    'seniority': ('seniorities', ['seniority_level']),
    'department': ('departments', ['department']),
    'size': ('sizes', ['employee_count_range']),
    'revenue': ('revenues', ['revenue_range']),
    'email_status': ('emailStatus', ['email_status']),
    'country': ('countries', ['contact_country']),
    'hq_country': ('hqCountries', ['company_hq_country']),
    'mobile_code': ('mobileCodes', []),
    'industry': ('industries', ['main_industry', 'company_industry']),
    'funding': ('funding', ['last_funding_type']),
    'tag': ('tags', ['smart_tags']),
}
FIXED = {
    'seniority': ['c-level', 'vp', 'director', 'manager', 'senior', 'junior', 'unknown'],
    'size': ['1 to 10', '11 to 50', '51 to 200', '201 to 500', '501 to 1000', '1001 to 5000', '5001 to 10000', '10001+'],
    'revenue': ['<$1M', '$1M to <$10M', '$10M to <$50M', '$50M to <$100M', '$100M to <$1B', '$1B+'],
    'email_status': ['VALID', 'CATCH_ALL', 'UNKNOWN', 'INVALID'],
    'mobile_code': ['+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49',
                    '+52', '+55', '+61', '+64', '+65', '+81', '+86', '+90', '+91', '+212', '+234', '+351', '+352', '+353', '+354', '+356', '+357', '+358',
                    '+359', '+370', '+371', '+372', '+380', '+385', '+386', '+420', '+421', '+971', '+972', '+974', '+966'],
}
COUNTRIES = ['United Kingdom', 'Ireland', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'Switzerland', 'Belgium', 'Denmark', 'Norway',
             'Finland', 'Austria', 'Poland', 'Portugal', 'Czechia', 'Czech Republic', 'Greece', 'Romania', 'Hungary', 'Luxembourg', 'Bulgaria', 'Croatia',
             'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Iceland', 'Malta', 'Cyprus', 'Serbia', 'Ukraine', 'Turkey', 'Türkiye',
             'United States', 'Canada', 'Australia', 'India', 'Israel', 'United Arab Emirates', 'Singapore', 'South Africa', 'Brazil', 'Mexico',
             'China', 'Japan', 'Hong Kong', 'New Zealand', 'Saudi Arabia', 'Qatar', 'Egypt', 'Nigeria', 'Argentina', 'Chile', 'Colombia',
             'Philippines', 'Malaysia', 'Indonesia', 'Pakistan', 'South Korea', 'Taiwan', 'Vietnam', 'Thailand', 'Kenya', 'Morocco', 'Jersey',
             'Guernsey', 'Isle of Man', 'Gibraltar', 'Monaco', 'Liechtenstein', 'Bosnia and Herzegovina', 'North Macedonia', 'Albania', 'Moldova',
             'Belarus', 'Russia', 'Georgia', 'Armenia', 'Puerto Rico']
FIXED['country'] = COUNTRIES
FIXED['hq_country'] = COUNTRIES
SAMPLE_FILTERS = [{'sizes': [s]} for s in FIXED['size']] + [{'seniorities': [s]} for s in FIXED['seniority'][:6]] + [
    {'hasFunding': True}, {'foundedMin': 2020}, {'isHiring': True}, {'titles': ['nurse']}, {'titles': ['engineer']}, {'titles': ['farmer']}]


def opener(jar_path):
    jar = http.cookiejar.MozillaCookieJar(jar_path)
    jar.load(ignore_discard=True, ignore_expires=True)
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def search(op, body, tries=5):
    for i in range(tries):
        try:
            req = urllib.request.Request(BASE + '/api/leads/search', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
            return json.load(op.open(req, timeout=120))
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503, 504) and i < tries - 1:
                time.sleep(3 * (i + 1)); continue
            raise
        except Exception:
            if i < tries - 1: time.sleep(3 * (i + 1)); continue
            raise


def sample(op, dataset):
    seen = {f: collections.Counter() for f in FACETS}
    for f in SAMPLE_FILTERS:
        for off in (0, 500):
            rows = search(op, {'dataset': dataset, 'filters': f, 'offset': off, 'limit': 500}).get('rows', [])
            for r in rows:
                for facet, (_, fields) in FACETS.items():
                    for fld in fields:
                        v = r.get(fld)
                        if not v: continue
                        for part in (v.split(',') if facet == 'tag' else [v]):
                            if part.strip(): seen[facet][part.strip()] += 1
        print(f'  sampled {dataset} {f}', file=sys.stderr, flush=True)
    return seen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cookies', required=True)
    ap.add_argument('--sample', help='earlier sample (JSON: {dataset: {facet: {value: n}}}) to merge in')
    ap.add_argument('--out', default=os.path.join(os.path.dirname(__file__), '..', 'lib', 'leads', 'facet-values.json'))
    a = ap.parse_args()
    op = opener(a.cookies)
    extra = json.load(open(a.sample)) if a.sample else {}
    out = {'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'datasets': {}}
    for dataset in ('uk-eu', 'us'):
        seen = sample(op, dataset)
        for facet, vals in extra.get(dataset, {}).items():
            seen.setdefault(facet, collections.Counter()).update(vals)
        result = {}
        for facet, (key, _) in FACETS.items():
            cands = list(dict.fromkeys(FIXED.get(facet, []) + [v for v, _ in seen[facet].most_common()]))
            def count(v):
                j = search(op, {'dataset': dataset, 'filters': {key: [v]}, 'limit': 0, 'ids_only': True})
                return v, j['count']['n']
            with cf.ThreadPoolExecutor(4) as ex:
                counted = [x for x in ex.map(count, cands) if x[1] > 0]
            counted.sort(key=lambda x: (-x[1], x[0]))
            result[facet] = counted
            print(f'{dataset} {facet}: {len(counted)} of {len(cands)} values have leads', file=sys.stderr, flush=True)
        out['datasets'][dataset] = result
    with open(a.out, 'w') as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(',', ':'))
        fh.write('\n')
    print('wrote', a.out, file=sys.stderr)


if __name__ == '__main__':
    main()
