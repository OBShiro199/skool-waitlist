// Run: npm test. Pure functions only; no network.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crc } from '../lib/leads/crc'
import { clean, daysAgoMonths, list, toTypesense, asksForMobiles } from '../lib/leads/filters'

test('crc32 matches the Python loader (zlib.crc32(v.encode()) & 0x7fffffff)', () => {
  const python: Record<string, number> = {
    'c-level': 1086891232, vp: 1757003187, '51 to 200': 1910951064, 'United Kingdom': 1166897165,
    'United States': 80572487, VALID: 2069100367, CATCH_ALL: 325368384, '+44': 1372026705, '+4479': 1662706574,
    '$1M to <$10M': 200864576, '10001+': 1633955566, 'Information Technology & Engineering': 513594458,
    'Zürich': 1393273150, '': 0,
  }
  for (const [v, h] of Object.entries(python)) assert.equal(crc(v), h, v)
})

test('sanitising caps values and strips operator characters', () => {
  assert.equal(clean('a:b [c] (d) | e & f ! g = h < i > j * k "l" \\m - n'), 'a b c d e f g h i j k l m n')
  assert.equal(clean('x'.repeat(200)).length, 80)
  assert.equal(list({ titles: Array.from({ length: 80 }, (_, i) => `t${i}`) }, 'titles').length, 50)
  assert.deepEqual(list({ titles: ['ok', '', '  ', 3, null] }, 'titles'), ['ok'])
  assert.deepEqual(list({ titles: 'nope' }, 'titles'), [])
})

test('filters map to Typesense exactly', () => {
  const p = toTypesense({
    titles: ['CEO', 'Head of Sales'],
    seniorities: ['c-level'],
    industries: ['Retail'],
    industriesNot: ['Construction'],
    sizes: ['51 to 200'],
    employeesMin: 10.4,
    hasMobile: true,
    openToWork: false,
    mobileCodes: ['+44', '44', '+12345', '+1 OR 1'],
    foundedMax: 1999,
  })
  const f = p.filter_by
  assert.ok(f.includes('current_title:[CEO*, `Head of Sales`]'))
  assert.ok(f.includes(`seniority_h:=[${crc('c-level')}]`))
  assert.ok(f.includes(`(main_industry_h:=[${crc('Retail')}] || company_industry_h:=[${crc('Retail')}])`))
  assert.ok(f.includes(`main_industry_h:!=[${crc('Construction')}] && company_industry_h:!=[${crc('Construction')}]`))
  assert.ok(f.includes(`size_h:=[${crc('51 to 200')}]`))
  assert.ok(f.includes('employees:>=10'))
  assert.ok(f.includes('has_mobile:=true'))
  assert.ok(f.includes('open_to_work:=false'))
  assert.ok(f.includes(`mobile_codes_h:=[${crc('+44')}]`), 'only valid codes kept')
  assert.ok(!f.includes(String(crc('44'))))
  assert.ok(f.includes('founded:<=1999'))
  assert.equal(p.q, '*')
  assert.equal(p.query_by, '')
  assert.equal(p.sort_by, 'rank:asc')
})

test('free text and exclusions', () => {
  const a = toTypesense({ q: 'acme', titlesNot: ['intern', 'office manager'] })
  assert.equal(a.q, 'acme -intern -"office manager"')
  assert.equal(a.query_by, 'full_name,current_title,company')
  assert.equal(a.sort_by, '_text_match:desc,rank:asc')
  const b = toTypesense({ titlesNot: ['intern'], companiesNot: ['Globex'] })
  assert.equal(b.q, '* -intern -Globex')
  assert.equal(b.query_by, 'current_title,company')
})

test('tenure months are UTC calendar months, across month ends', () => {
  const now = new Date(Date.UTC(2026, 2, 31)) // 31 March 2026
  const days = (y: number, m: number, d: number) => Math.floor(Date.UTC(y, m, d) / 86_400_000)
  assert.equal(daysAgoMonths(0, now), days(2026, 2, 31))
  assert.equal(daysAgoMonths(12, now), days(2025, 2, 31))
  assert.equal(daysAgoMonths(1, now), days(2026, 2, 3)) // 31 Feb rolls over, as setUTCMonth does
  const p = toTypesense({ tenureMin: 6, tenureMax: 36 }, now)
  assert.ok(p.filter_by.includes(`role_start:<=${daysAgoMonths(6, now)}`))
  assert.ok(p.filter_by.includes(`role_start:>=${daysAgoMonths(36, now)}`))
})

test('mobile filters are detected for the US no-mobiles rule', () => {
  assert.equal(asksForMobiles({ hasMobile: true }), true)
  assert.equal(asksForMobiles({ mobileCodes: ['+44'] }), true)
  assert.equal(asksForMobiles({ hasMobile: false }), false)
  assert.equal(asksForMobiles({}), false)
})
