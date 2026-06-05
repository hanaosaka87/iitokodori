// 楽天トラベルAPI 施設データ一括取得・投入スクリプト
// 実行前に .env.local に以下を追加してください:
//   RAKUTEN_APP_ID=706a0ea6-e945-4bcc-864c-5882a98d8aa0
//   SUPABASE_SERVICE_ROLE_KEY=（SupabaseダッシュボードのSettings→API→service_role key）
//
// 実行方法: node scripts/fetch-rakuten-facilities.js
// テスト実行: node scripts/fetch-rakuten-facilities.js --test

const https = require('https')
const fs = require('fs')
const path = require('path')

// ===== 設定 =====
const RAKUTEN_APP_ID = '706a0ea6-e945-4bcc-864c-5882a98d8aa0'
const HITS_PER_PAGE = 30   // 楽天API最大30件/ページ
const MAX_PAGES = 10       // 1都道府県あたり最大ページ数（最大300件）
const SLEEP_MS = 500       // APIレート制限対策（0.5秒待機）
const IS_TEST = process.argv.includes('--test')

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
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      env[key] = val
    }
  } catch {}
  return env
}

const env = loadEnv()
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ===== 都道府県マッピング（楽天コード → prefecture_code） =====
const PREFECTURES = [
  { code: '01', name: '北海道',   rakuten: 'hokkaido' },
  { code: '02', name: '青森県',   rakuten: 'aomori' },
  { code: '03', name: '岩手県',   rakuten: 'iwate' },
  { code: '04', name: '宮城県',   rakuten: 'miyagi' },
  { code: '05', name: '秋田県',   rakuten: 'akita' },
  { code: '06', name: '山形県',   rakuten: 'yamagata' },
  { code: '07', name: '福島県',   rakuten: 'fukushima' },
  { code: '08', name: '茨城県',   rakuten: 'ibaraki' },
  { code: '09', name: '栃木県',   rakuten: 'tochigi' },
  { code: '10', name: '群馬県',   rakuten: 'gunma' },
  { code: '11', name: '埼玉県',   rakuten: 'saitama' },
  { code: '12', name: '千葉県',   rakuten: 'chiba' },
  { code: '13', name: '東京都',   rakuten: 'tokyo' },
  { code: '14', name: '神奈川県', rakuten: 'kanagawa' },
  { code: '15', name: '新潟県',   rakuten: 'niigata' },
  { code: '16', name: '富山県',   rakuten: 'toyama' },
  { code: '17', name: '石川県',   rakuten: 'ishikawa' },
  { code: '18', name: '福井県',   rakuten: 'fukui' },
  { code: '19', name: '山梨県',   rakuten: 'yamanashi' },
  { code: '20', name: '長野県',   rakuten: 'nagano' },
  { code: '21', name: '岐阜県',   rakuten: 'gifu' },
  { code: '22', name: '静岡県',   rakuten: 'shizuoka' },
  { code: '23', name: '愛知県',   rakuten: 'aichi' },
  { code: '24', name: '三重県',   rakuten: 'mie' },
  { code: '25', name: '滋賀県',   rakuten: 'shiga' },
  { code: '26', name: '京都府',   rakuten: 'kyoto' },
  { code: '27', name: '大阪府',   rakuten: 'osaka' },
  { code: '28', name: '兵庫県',   rakuten: 'hyogo' },
  { code: '29', name: '奈良県',   rakuten: 'nara' },
  { code: '30', name: '和歌山県', rakuten: 'wakayama' },
  { code: '31', name: '鳥取県',   rakuten: 'tottori' },
  { code: '32', name: '島根県',   rakuten: 'shimane' },
  { code: '33', name: '岡山県',   rakuten: 'okayama' },
  { code: '34', name: '広島県',   rakuten: 'hiroshima' },
  { code: '35', name: '山口県',   rakuten: 'yamaguchi' },
  { code: '36', name: '徳島県',   rakuten: 'tokushima' },
  { code: '37', name: '香川県',   rakuten: 'kagawa' },
  { code: '38', name: '愛媛県',   rakuten: 'ehime' },
  { code: '39', name: '高知県',   rakuten: 'kochi' },
  { code: '40', name: '福岡県',   rakuten: 'fukuoka' },
  { code: '41', name: '佐賀県',   rakuten: 'saga' },
  { code: '42', name: '長崎県',   rakuten: 'nagasaki' },
  { code: '43', name: '熊本県',   rakuten: 'kumamoto' },
  { code: '44', name: '大分県',   rakuten: 'oita' },
  { code: '45', name: '宮崎県',   rakuten: 'miyazaki' },
  { code: '46', name: '鹿児島県', rakuten: 'kagoshima' },
  { code: '47', name: '沖縄県',   rakuten: 'okinawa' },
]

// ===== ホテル種別判定 =====
function detectCategory(name) {
  if (/旅館|温泉旅館|湯宿|湯の宿/.test(name)) return 'ryokan'
  if (/ペンション|民宿/.test(name)) return 'pension'
  if (/ゲストハウス|ホステル|ドミトリー|backpacker/i.test(name)) return 'hostel'
  if (/ホテル|hotel/i.test(name)) return 'hotel'
  if (/温泉|の宿|旅籠/.test(name)) return 'ryokan'
  return 'hotel'
}

// ===== 市区町村を住所から抽出 =====
function extractCity(address2) {
  if (!address2) return null
  const m = address2.match(/^([^0-9０-９ 　]+[市区町村郡])/)
  return m ? m[1] : address2.slice(0, 10)
}

// ===== HTTPSリクエスト =====
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Referer': 'https://iitokodori.vercel.app',
        'User-Agent': 'Mozilla/5.0 iitokodori/1.0',
      }
    }
    https.get(url, options, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// ===== 楽天API取得 =====
async function fetchPrefecture(pref, page = 1) {
  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    format: 'json',
    largeClassCode: 'japan',
    middleClassCode: pref.rakuten,
    page: String(page),
    hits: String(HITS_PER_PAGE),
  })
  const url = `https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426?${params}`
  return fetchJson(url)
}

// ===== Supabase INSERT =====
async function insertFacilities(rows) {
  const body = JSON.stringify(rows)
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/facilities`)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
      },
      hostname: url.hostname,
      path: url.pathname,
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, count: rows.length })
        } else {
          resolve({ ok: false, error: data })
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

// ===== メイン =====
async function main() {
  console.log('=== いいとこどり 楽天トラベル施設データ取得スクリプト ===')

  if (!SUPABASE_URL) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL が .env.local にありません')
    process.exit(1)
  }
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY が .env.local にありません')
    console.error('Supabaseダッシュボード → Settings → API → service_role key をコピーして追加してください')
    process.exit(1)
  }

  const targets = IS_TEST ? PREFECTURES.slice(0, 2) : PREFECTURES
  console.log(IS_TEST ? `テストモード: ${targets.map(p=>p.name).join('・')} のみ取得\n` : `全47都道府県を取得します\n`)

  let totalInserted = 0
  let totalFetched = 0

  for (const pref of targets) {
    console.log(`\n[${pref.code}] ${pref.name} 取得中...`)
    let prefInserted = 0
    let prefFetched = 0

    for (let page = 1; page <= (IS_TEST ? 1 : MAX_PAGES); page++) {
      await sleep(SLEEP_MS)

      let result
      try {
        result = await fetchPrefecture(pref, page)
      } catch (e) {
        console.error(`  ページ${page} 取得エラー:`, e.message)
        break
      }

      if (result.error) {
        console.error(`  APIエラー:`, result.error)
        break
      }

      const hotels = result.hotels ?? []
      if (hotels.length === 0) break

      const rows = hotels.map(h => {
        const info = h.hotel?.[0]?.hotelBasicInfo
        if (!info) return null
        return {
          name: info.hotelName,
          category: detectCategory(info.hotelName),
          prefecture_code: pref.code,
          prefecture_name: pref.name,
          city: extractCity(info.address2),
          address: info.address2 ? info.address2.slice(0, 100) : null,
          official_url: info.hotelInformationUrl ?? null,
          thumbnail_url: info.hotelThumbnailUrl ?? null,
        }
      }).filter(Boolean)

      prefFetched += rows.length
      totalFetched += rows.length

      // 50件ずつInsert
      const CHUNK = 50
      for (let i = 0; i < rows.length; i += CHUNK) {
        const chunk = rows.slice(i, i + CHUNK)
        const res = await insertFacilities(chunk)
        if (res.ok) {
          prefInserted += chunk.length
          totalInserted += chunk.length
        } else {
          console.error(`  INSERT失敗:`, res.error?.slice(0, 200))
        }
      }

      const paging = result.pagingInfo
      process.stdout.write(`  ページ${page}/${paging?.pageCount ?? '?'}: ${rows.length}件取得, 累計${prefInserted}件投入\r`)

      if (!paging || page >= paging.pageCount || page >= MAX_PAGES) break
    }

    console.log(`  ${pref.name} 完了: ${prefFetched}件取得 / ${prefInserted}件投入`)
  }

  console.log(`\n=== 完了 ===`)
  console.log(`取得件数: ${totalFetched}件`)
  console.log(`投入件数: ${totalInserted}件`)
  console.log(`\n次のコマンドでSupabase上の件数を確認できます:`)
  console.log(`（Supabase SQL Editor）SELECT COUNT(*) FROM facilities;`)
}

main().catch(console.error)
