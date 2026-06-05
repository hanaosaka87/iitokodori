// OpenStreetMap（Overpass API）で日本全国の宿泊施設を取得してSupabaseに投入
// 認証不要・完全無料
// 実行: node scripts/fetch-osm-facilities.js
// テスト: node scripts/fetch-osm-facilities.js --test

const https = require('https')
const fs = require('fs')
const path = require('path')

const IS_TEST = process.argv.includes('--test')
const SLEEP_MS = 2000  // Overpass APIは負荷をかけないよう2秒待機

// ===== .env.local読み込み =====
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const env = {}
  try {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 0) continue
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    }
  } catch {}
  return env
}

const env = loadEnv()
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ===== 都道府県リスト（日本語名 → OSM relation ID） =====
const PREFECTURES = [
  { code: '01', name: '北海道',   osmId: 'area["name"="北海道"]["admin_level"="4"]' },
  { code: '02', name: '青森県',   osmId: 'area["name"="青森県"]["admin_level"="4"]' },
  { code: '03', name: '岩手県',   osmId: 'area["name"="岩手県"]["admin_level"="4"]' },
  { code: '04', name: '宮城県',   osmId: 'area["name"="宮城県"]["admin_level"="4"]' },
  { code: '05', name: '秋田県',   osmId: 'area["name"="秋田県"]["admin_level"="4"]' },
  { code: '06', name: '山形県',   osmId: 'area["name"="山形県"]["admin_level"="4"]' },
  { code: '07', name: '福島県',   osmId: 'area["name"="福島県"]["admin_level"="4"]' },
  { code: '08', name: '茨城県',   osmId: 'area["name"="茨城県"]["admin_level"="4"]' },
  { code: '09', name: '栃木県',   osmId: 'area["name"="栃木県"]["admin_level"="4"]' },
  { code: '10', name: '群馬県',   osmId: 'area["name"="群馬県"]["admin_level"="4"]' },
  { code: '11', name: '埼玉県',   osmId: 'area["name"="埼玉県"]["admin_level"="4"]' },
  { code: '12', name: '千葉県',   osmId: 'area["name"="千葉県"]["admin_level"="4"]' },
  { code: '13', name: '東京都',   osmId: 'area["name"="東京都"]["admin_level"="4"]' },
  { code: '14', name: '神奈川県', osmId: 'area["name"="神奈川県"]["admin_level"="4"]' },
  { code: '15', name: '新潟県',   osmId: 'area["name"="新潟県"]["admin_level"="4"]' },
  { code: '16', name: '富山県',   osmId: 'area["name"="富山県"]["admin_level"="4"]' },
  { code: '17', name: '石川県',   osmId: 'area["name"="石川県"]["admin_level"="4"]' },
  { code: '18', name: '福井県',   osmId: 'area["name"="福井県"]["admin_level"="4"]' },
  { code: '19', name: '山梨県',   osmId: 'area["name"="山梨県"]["admin_level"="4"]' },
  { code: '20', name: '長野県',   osmId: 'area["name"="長野県"]["admin_level"="4"]' },
  { code: '21', name: '岐阜県',   osmId: 'area["name"="岐阜県"]["admin_level"="4"]' },
  { code: '22', name: '静岡県',   osmId: 'area["name"="静岡県"]["admin_level"="4"]' },
  { code: '23', name: '愛知県',   osmId: 'area["name"="愛知県"]["admin_level"="4"]' },
  { code: '24', name: '三重県',   osmId: 'area["name"="三重県"]["admin_level"="4"]' },
  { code: '25', name: '滋賀県',   osmId: 'area["name"="滋賀県"]["admin_level"="4"]' },
  { code: '26', name: '京都府',   osmId: 'area["name"="京都府"]["admin_level"="4"]' },
  { code: '27', name: '大阪府',   osmId: 'area["name"="大阪府"]["admin_level"="4"]' },
  { code: '28', name: '兵庫県',   osmId: 'area["name"="兵庫県"]["admin_level"="4"]' },
  { code: '29', name: '奈良県',   osmId: 'area["name"="奈良県"]["admin_level"="4"]' },
  { code: '30', name: '和歌山県', osmId: 'area["name"="和歌山県"]["admin_level"="4"]' },
  { code: '31', name: '鳥取県',   osmId: 'area["name"="鳥取県"]["admin_level"="4"]' },
  { code: '32', name: '島根県',   osmId: 'area["name"="島根県"]["admin_level"="4"]' },
  { code: '33', name: '岡山県',   osmId: 'area["name"="岡山県"]["admin_level"="4"]' },
  { code: '34', name: '広島県',   osmId: 'area["name"="広島県"]["admin_level"="4"]' },
  { code: '35', name: '山口県',   osmId: 'area["name"="山口県"]["admin_level"="4"]' },
  { code: '36', name: '徳島県',   osmId: 'area["name"="徳島県"]["admin_level"="4"]' },
  { code: '37', name: '香川県',   osmId: 'area["name"="香川県"]["admin_level"="4"]' },
  { code: '38', name: '愛媛県',   osmId: 'area["name"="愛媛県"]["admin_level"="4"]' },
  { code: '39', name: '高知県',   osmId: 'area["name"="高知県"]["admin_level"="4"]' },
  { code: '40', name: '福岡県',   osmId: 'area["name"="福岡県"]["admin_level"="4"]' },
  { code: '41', name: '佐賀県',   osmId: 'area["name"="佐賀県"]["admin_level"="4"]' },
  { code: '42', name: '長崎県',   osmId: 'area["name"="長崎県"]["admin_level"="4"]' },
  { code: '43', name: '熊本県',   osmId: 'area["name"="熊本県"]["admin_level"="4"]' },
  { code: '44', name: '大分県',   osmId: 'area["name"="大分県"]["admin_level"="4"]' },
  { code: '45', name: '宮崎県',   osmId: 'area["name"="宮崎県"]["admin_level"="4"]' },
  { code: '46', name: '鹿児島県', osmId: 'area["name"="鹿児島県"]["admin_level"="4"]' },
  { code: '47', name: '沖縄県',   osmId: 'area["name"="沖縄県"]["admin_level"="4"]' },
]

// ===== 種別マッピング =====
function toCategory(osmType, name = '') {
  if (osmType === 'ryokan' || /旅館|温泉旅館|湯宿/.test(name)) return 'ryokan'
  if (osmType === 'hostel' || osmType === 'backpacker'|| /ゲストハウス|ホステル/.test(name)) return 'hostel'
  if (osmType === 'guest_house' || osmType === 'motel' || /民宿|ペンション/.test(name)) return 'pension'
  return 'hotel'
}

// ===== 都市名抽出 =====
function extractCity(addr) {
  if (!addr) return null
  const m = addr.match(/([^\s,]+[市区町村郡])/)
  return m ? m[1] : addr.slice(0, 10)
}

// ===== Overpass APIクエリ =====
function buildQuery(prefName) {
  return `
[out:json][timeout:60];
${prefName}->.a;
(
  nwr["tourism"="hotel"](area.a);
  nwr["tourism"="ryokan"](area.a);
  nwr["tourism"="hostel"](area.a);
  nwr["tourism"="guest_house"](area.a);
  nwr["tourism"="motel"](area.a);
  nwr["amenity"="hotel"](area.a);
);
out center tags;
`.trim()
}

// ===== Overpass APIリクエスト =====
function fetchOverpass(query) {
  return new Promise((resolve, reject) => {
    const body = 'data=' + encodeURIComponent(query)
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'iitokodori-seeder/1.0',
      }
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error('JSON parse error: ' + data.slice(0, 200))) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

// ===== Supabase INSERT =====
function insertFacilities(rows) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(rows)
    const url = new URL(`${SUPABASE_URL}/rest/v1/facilities`)
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
      }
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, body: data })
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ===== メイン =====
async function main() {
  console.log('=== いいとこどり OSM施設データ取得スクリプト ===\n')

  if (!SUPABASE_URL) { console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL がありません'); process.exit(1) }
  const usedKey = env.SUPABASE_SERVICE_ROLE_KEY ? 'SUPABASE_SERVICE_ROLE_KEY'
    : env.SUPABASE_SECRET_KEY ? 'SUPABASE_SECRET_KEY'
    : 'ANON_KEY（権限不足）'
  console.log(`使用キー: ${usedKey}`)
  if (!env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_SECRET_KEY) {
    console.warn('警告: Secret Keyが見つかりません。RLSで弾かれる可能性があります。\n.env.local に SUPABASE_SERVICE_ROLE_KEY または SUPABASE_SECRET_KEY を追加してください。')
  }

  const targets = IS_TEST ? PREFECTURES.slice(0, 1) : PREFECTURES
  if (IS_TEST) console.log('テストモード: 北海道のみ\n')

  let totalInserted = 0

  for (const pref of targets) {
    console.log(`[${pref.code}] ${pref.name} 取得中...`)
    await sleep(SLEEP_MS)

    let result
    try {
      result = await fetchOverpass(buildQuery(pref.osmId))
    } catch (e) {
      console.error(`  取得エラー: ${e.message}`)
      continue
    }

    const elements = result.elements ?? []
    const rows = elements
      .filter(el => el.tags?.name)
      .map(el => {
        const tags = el.tags
        const addr = tags['addr:full'] || tags['addr:city'] || tags['addr:suburb'] || ''
        return {
          name: tags.name,
          category: toCategory(tags.tourism || tags.amenity, tags.name),
          prefecture_code: pref.code,
          prefecture_name: pref.name,
          city: extractCity(addr) || null,
          address: tags['addr:full'] ? tags['addr:full'].slice(0, 100) : null,
          official_url: tags.website || tags.url || null,
        }
      })

    if (rows.length === 0) {
      console.log(`  データなし`)
      continue
    }

    // 50件ずつINSERT
    let inserted = 0
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50)
      const res = await insertFacilities(chunk)
      if (res.ok) {
        inserted += chunk.length
        totalInserted += chunk.length
      } else {
        console.error(`  INSERT失敗(${res.status}):`, res.body?.slice(0, 150))
      }
    }
    console.log(`  完了: ${rows.length}件取得 / ${inserted}件投入`)
  }

  console.log(`\n=== 完了: 合計${totalInserted}件投入 ===`)
  console.log('Supabase SQL Editor で確認: SELECT COUNT(*) FROM facilities;')
}

main().catch(console.error)
