import { createClient } from '@supabase/supabase-js'

const APP_ID = '706a0ea6-e945-4bcc-864c-5882a98d8aa0'
const SUPABASE_URL = 'https://sdnnyvmupbhudxjkjptd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbm55dm11cGJodWR4amtqcHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Njg4NjUsImV4cCI6MjA5NDM0NDg2NX0.sa4ItlR0NzyymFjFaevu1xxTUVVkGa2n7hMGcM6NRNU'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const PREFECTURES = [
  { code: '01', name: '北海道' }, { code: '02', name: '青森県' },
  { code: '03', name: '岩手県' }, { code: '04', name: '宮城県' },
  { code: '05', name: '秋田県' }, { code: '06', name: '山形県' },
  { code: '07', name: '福島県' }, { code: '08', name: '茨城県' },
  { code: '09', name: '栃木県' }, { code: '10', name: '群馬県' },
  { code: '11', name: '埼玉県' }, { code: '12', name: '千葉県' },
  { code: '13', name: '東京都' }, { code: '14', name: '神奈川県' },
  { code: '15', name: '新潟県' }, { code: '16', name: '富山県' },
  { code: '17', name: '石川県' }, { code: '18', name: '福井県' },
  { code: '19', name: '山梨県' }, { code: '20', name: '長野県' },
  { code: '21', name: '岐阜県' }, { code: '22', name: '静岡県' },
  { code: '23', name: '愛知県' }, { code: '24', name: '三重県' },
  { code: '25', name: '滋賀県' }, { code: '26', name: '京都府' },
  { code: '27', name: '大阪府' }, { code: '28', name: '兵庫県' },
  { code: '29', name: '奈良県' }, { code: '30', name: '和歌山県' },
  { code: '31', name: '鳥取県' }, { code: '32', name: '島根県' },
  { code: '33', name: '岡山県' }, { code: '34', name: '広島県' },
  { code: '35', name: '山口県' }, { code: '36', name: '徳島県' },
  { code: '37', name: '香川県' }, { code: '38', name: '愛媛県' },
  { code: '39', name: '高知県' }, { code: '40', name: '福岡県' },
  { code: '41', name: '佐賀県' }, { code: '42', name: '長崎県' },
  { code: '43', name: '熊本県' }, { code: '44', name: '大分県' },
  { code: '45', name: '宮崎県' }, { code: '46', name: '鹿児島県' },
  { code: '47', name: '沖縄県' },
]

// 楽天のホテルタイプ → カテゴリ変換
function toCategory(hotelType) {
  if (!hotelType) return 'hotel'
  if (hotelType.includes('旅館') || hotelType.includes('温泉')) return 'ryokan'
  if (hotelType.includes('ペンション') || hotelType.includes('民宿')) return 'pension'
  if (hotelType.includes('ゲストハウス') || hotelType.includes('ホステル')) return 'hostel'
  return 'hotel'
}

async function fetchPrefecture(pref) {
  const facilities = []
  let page = 1
  const maxPages = 3 // 1都道府県あたり最大90件（30件×3ページ）

  while (page <= maxPages) {
    const url = `https://app.rakuten.co.jp/services/api/Travel/HotelSearch/20170426?applicationId=${APP_ID}&prefectureCode=${pref.code}&hits=30&page=${page}&format=json&responseType=small`

    try {
      const res = await fetch(url)
      const json = await res.json()

      if (json.error || !json.hotels || json.hotels.length === 0) break

      for (const item of json.hotels) {
        const h = item.hotel?.[0]?.hotelBasicInfo
        if (!h) continue
        facilities.push({
          name: h.hotelName,
          category: toCategory(h.hotelSpecial),
          prefecture_code: pref.code,
          prefecture_name: pref.name,
          city: h.address1 ?? null,
          address: h.address2 ? `${h.address1 ?? ''}${h.address2}` : null,
          official_url: h.hotelInformationUrl ?? null,
          thumbnail_url: h.hotelImageUrl ?? null,
        })
      }

      const totalPages = Math.ceil((json.pagingInfo?.recordCount ?? 0) / 30)
      if (page >= totalPages) break
      page++
      await new Promise(r => setTimeout(r, 300)) // レート制限対応
    } catch (e) {
      console.error(`${pref.name} page${page} エラー:`, e.message)
      break
    }
  }
  return facilities
}

async function main() {
  console.log('楽天トラベルAPIから施設データ取得開始...')
  let total = 0

  for (const pref of PREFECTURES) {
    process.stdout.write(`${pref.name} 取得中...`)
    const facilities = await fetchPrefecture(pref)

    if (facilities.length > 0) {
      // 重複を避けるため名前+都道府県で確認してupsert
      const { error } = await supabase
        .from('facilities')
        .insert(facilities)

      if (error) {
        console.log(` NG: ${error.message}`)
      } else {
        total += facilities.length
        console.log(` ${facilities.length}件 投入`)
      }
    } else {
      console.log(' 0件')
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n完了！合計 ${total} 件投入しました。`)
}

main()
