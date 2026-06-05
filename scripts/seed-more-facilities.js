// 施設データ追加スクリプト
// 実行方法: node scripts/seed-more-facilities.js
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const env = {}
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
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が .env.local にありません')
  process.exit(1)
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('警告: SUPABASE_SERVICE_ROLE_KEY がないため ANON KEY を使用します。RLS設定によっては失敗することがあります。')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const facilities = [
  // ===== 北海道 =====
  { name: 'ザ・ウィンザーホテル洞爺リゾート&スパ', category: 'hotel',   prefecture_code: '01', prefecture_name: '北海道', city: '洞爺湖町' },
  { name: '北こぶし知床 ホテル&リゾート',           category: 'hotel',   prefecture_code: '01', prefecture_name: '北海道', city: '斜里町' },
  { name: '星野リゾート トマム ザ・タワー',         category: 'hotel',   prefecture_code: '01', prefecture_name: '北海道', city: '占冠村' },
  { name: '阿寒鶴雅リゾート',                       category: 'ryokan',  prefecture_code: '01', prefecture_name: '北海道', city: '釧路市' },
  { name: '定山渓鶴雅リゾートスパ 森の謌',          category: 'ryokan',  prefecture_code: '01', prefecture_name: '北海道', city: '札幌市' },
  { name: '湯の川プリンスホテル渚亭',               category: 'hotel',   prefecture_code: '01', prefecture_name: '北海道', city: '函館市' },
  { name: '十勝川温泉 第一ホテル豊洲亭',            category: 'ryokan',  prefecture_code: '01', prefecture_name: '北海道', city: '音更町' },
  { name: 'ニセコ昆布温泉 甘露の森',                category: 'ryokan',  prefecture_code: '01', prefecture_name: '北海道', city: 'ニセコ町' },
  { name: '層雲峡温泉 朝陽リゾートホテル',          category: 'hotel',   prefecture_code: '01', prefecture_name: '北海道', city: '上川郡' },
  { name: '旭川グランドホテル',                     category: 'hotel',   prefecture_code: '01', prefecture_name: '北海道', city: '旭川市' },

  // ===== 青森 =====
  { name: '奥入瀬渓流ホテル',             category: 'hotel',   prefecture_code: '02', prefecture_name: '青森県', city: '十和田市' },
  { name: '界 津軽',                      category: 'ryokan',  prefecture_code: '02', prefecture_name: '青森県', city: '弘前市' },
  { name: '青荷温泉 ランプの宿',          category: 'ryokan',  prefecture_code: '02', prefecture_name: '青森県', city: '黒石市' },
  { name: '古牧温泉 渋川温泉旅館',        category: 'ryokan',  prefecture_code: '02', prefecture_name: '青森県', city: '三沢市' },
  { name: '浅虫温泉 旅館 南部屋・海扇閣', category: 'ryokan',  prefecture_code: '02', prefecture_name: '青森県', city: '青森市' },
  { name: '八甲田ホテル',                 category: 'hotel',   prefecture_code: '02', prefecture_name: '青森県', city: '青森市' },

  // ===== 岩手 =====
  { name: 'つなぎ温泉 四季亭',              category: 'ryokan',  prefecture_code: '03', prefecture_name: '岩手県', city: '盛岡市' },
  { name: '大沢温泉 山水閣',               category: 'ryokan',  prefecture_code: '03', prefecture_name: '岩手県', city: '花巻市' },
  { name: '鶯宿温泉 ホテル加賀助',         category: 'ryokan',  prefecture_code: '03', prefecture_name: '岩手県', city: '岩手郡' },
  { name: '浄土ヶ浜パークホテル',          category: 'hotel',   prefecture_code: '03', prefecture_name: '岩手県', city: '宮古市' },
  { name: '厳美渓温泉 いつくし園',         category: 'ryokan',  prefecture_code: '03', prefecture_name: '岩手県', city: '一関市' },
  { name: '夏油高原温泉 夏油温泉元湯',     category: 'ryokan',  prefecture_code: '03', prefecture_name: '岩手県', city: '北上市' },

  // ===== 宮城 =====
  { name: '秋保温泉 ホテル瑞鳳',    category: 'ryokan',  prefecture_code: '04', prefecture_name: '宮城県', city: '仙台市' },
  { name: '鳴子温泉 東多賀の湯',    category: 'ryokan',  prefecture_code: '04', prefecture_name: '宮城県', city: '大崎市' },
  { name: '松島温泉 松島一の坊',    category: 'ryokan',  prefecture_code: '04', prefecture_name: '宮城県', city: '宮城郡' },
  { name: '作並温泉 鶴巻亭元湯',    category: 'ryokan',  prefecture_code: '04', prefecture_name: '宮城県', city: '仙台市' },
  { name: '仙台国際ホテル',         category: 'hotel',   prefecture_code: '04', prefecture_name: '宮城県', city: '仙台市' },
  { name: '気仙沼プラザホテル',     category: 'hotel',   prefecture_code: '04', prefecture_name: '宮城県', city: '気仙沼市' },

  // ===== 秋田 =====
  { name: '乳頭温泉郷 鶴の湯',         category: 'ryokan',  prefecture_code: '05', prefecture_name: '秋田県', city: '仙北市' },
  { name: '玉川温泉 新玉川温泉',        category: 'ryokan',  prefecture_code: '05', prefecture_name: '秋田県', city: '仙北市' },
  { name: '角館温泉 花葉館',           category: 'ryokan',  prefecture_code: '05', prefecture_name: '秋田県', city: '仙北市' },
  { name: '大湯温泉 阿部旅館',         category: 'ryokan',  prefecture_code: '05', prefecture_name: '秋田県', city: '鹿角市' },
  { name: 'ルートイングランティア秋田', category: 'hotel',   prefecture_code: '05', prefecture_name: '秋田県', city: '秋田市' },

  // ===== 山形 =====
  { name: '銀山温泉 藤屋',             category: 'ryokan',  prefecture_code: '06', prefecture_name: '山形県', city: '尾花沢市' },
  { name: '蔵王温泉 蔵王四季のホテル', category: 'hotel',   prefecture_code: '06', prefecture_name: '山形県', city: '山形市' },
  { name: '赤湯温泉 御殿守',           category: 'ryokan',  prefecture_code: '06', prefecture_name: '山形県', city: '南陽市' },
  { name: '四万温泉 積善館',           category: 'ryokan',  prefecture_code: '06', prefecture_name: '山形県', city: '最上郡' },
  { name: '山形グランドホテル',         category: 'hotel',   prefecture_code: '06', prefecture_name: '山形県', city: '山形市' },

  // ===== 福島 =====
  { name: '東山温泉 向瀧',          category: 'ryokan',  prefecture_code: '07', prefecture_name: '福島県', city: '会津若松市' },
  { name: '高湯温泉 玉子湯',        category: 'ryokan',  prefecture_code: '07', prefecture_name: '福島県', city: '福島市' },
  { name: '芦ノ牧温泉 大川荘',      category: 'ryokan',  prefecture_code: '07', prefecture_name: '福島県', city: '会津若松市' },
  { name: '裏磐梯高原ホテル',       category: 'hotel',   prefecture_code: '07', prefecture_name: '福島県', city: '耶麻郡' },
  { name: '磐梯熱海温泉 山形屋',    category: 'ryokan',  prefecture_code: '07', prefecture_name: '福島県', city: '郡山市' },
  { name: 'いわきリゾートホテル',   category: 'hotel',   prefecture_code: '07', prefecture_name: '福島県', city: 'いわき市' },

  // ===== 茨城 =====
  { name: '大洗シーサイドホテル',       category: 'hotel',   prefecture_code: '08', prefecture_name: '茨城県', city: '東茨城郡' },
  { name: '袋田温泉 思い出浪漫館',      category: 'ryokan',  prefecture_code: '08', prefecture_name: '茨城県', city: '久慈郡' },
  { name: '水郷筑波国定公園 水郷の宿',  category: 'ryokan',  prefecture_code: '08', prefecture_name: '茨城県', city: '潮来市' },
  { name: 'ホテルテラス ザ ガーデン水戸', category: 'hotel', prefecture_code: '08', prefecture_name: '茨城県', city: '水戸市' },
  { name: '犬吠埼温泉 犬吠埼ホテル',    category: 'hotel',   prefecture_code: '08', prefecture_name: '茨城県', city: '神栖市' },

  // ===== 栃木 =====
  { name: '日光金谷ホテル',               category: 'hotel',   prefecture_code: '09', prefecture_name: '栃木県', city: '日光市' },
  { name: '鬼怒川温泉 鬼怒川パークホテルズ', category: 'hotel', prefecture_code: '09', prefecture_name: '栃木県', city: '日光市' },
  { name: '湯西川温泉 伴久ホテル',        category: 'ryokan',  prefecture_code: '09', prefecture_name: '栃木県', city: '日光市' },
  { name: '塩原温泉 明賀屋本館',          category: 'ryokan',  prefecture_code: '09', prefecture_name: '栃木県', city: '那須塩原市' },
  { name: '那須高原 旅館 松島屋',         category: 'ryokan',  prefecture_code: '09', prefecture_name: '栃木県', city: '那須郡' },
  { name: 'ホテルエピナール那須',          category: 'hotel',   prefecture_code: '09', prefecture_name: '栃木県', city: '那須郡' },

  // ===== 群馬 =====
  { name: '草津温泉 ホテル一井',      category: 'hotel',   prefecture_code: '10', prefecture_name: '群馬県', city: '吾妻郡' },
  { name: '伊香保温泉 千明仁泉亭',    category: 'ryokan',  prefecture_code: '10', prefecture_name: '群馬県', city: '渋川市' },
  { name: '水上温泉 松乃井',          category: 'ryokan',  prefecture_code: '10', prefecture_name: '群馬県', city: '利根郡' },
  { name: '四万温泉 積善館',          category: 'ryokan',  prefecture_code: '10', prefecture_name: '群馬県', city: '吾妻郡' },
  { name: '万座温泉 万座ホテル聚楽',  category: 'hotel',   prefecture_code: '10', prefecture_name: '群馬県', city: '吾妻郡' },
  { name: '老神温泉 吟松亭あわしま荘', category: 'ryokan', prefecture_code: '10', prefecture_name: '群馬県', city: '沼田市' },

  // ===== 埼玉 =====
  { name: '長瀞温泉 大陽館',           category: 'ryokan',  prefecture_code: '11', prefecture_name: '埼玉県', city: '秩父郡' },
  { name: '秩父温泉 満願の湯',         category: 'hotel',   prefecture_code: '11', prefecture_name: '埼玉県', city: '秩父市' },
  { name: 'さいたまスーパーアリーナ ホテルブリランテ武蔵野', category: 'hotel', prefecture_code: '11', prefecture_name: '埼玉県', city: 'さいたま市' },
  { name: '武甲温泉 旅館武甲',         category: 'ryokan',  prefecture_code: '11', prefecture_name: '埼玉県', city: '秩父郡' },
  { name: '奥秩父温泉 大滝温泉 遊湯館', category: 'ryokan', prefecture_code: '11', prefecture_name: '埼玉県', city: '秩父市' },

  // ===== 千葉 =====
  { name: 'ホテル三日月 龍宮スパタワー', category: 'hotel',  prefecture_code: '12', prefecture_name: '千葉県', city: '木更津市' },
  { name: '鴨川シーワールドホテル',      category: 'hotel',  prefecture_code: '12', prefecture_name: '千葉県', city: '鴨川市' },
  { name: '安房小湊温泉 ホテル吉夢',    category: 'hotel',  prefecture_code: '12', prefecture_name: '千葉県', city: '鴨川市' },
  { name: '犬吠埼温泉 犬吠埼ホテル',    category: 'hotel',  prefecture_code: '12', prefecture_name: '千葉県', city: '銚子市' },
  { name: '千倉温泉 旅館 泉屋',        category: 'ryokan', prefecture_code: '12', prefecture_name: '千葉県', city: '南房総市' },
  { name: '館山シーサイドホテル',       category: 'hotel',  prefecture_code: '12', prefecture_name: '千葉県', city: '館山市' },

  // ===== 東京 =====
  { name: 'ザ・ペニンシュラ東京',       category: 'hotel',  prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },
  { name: '帝国ホテル東京',             category: 'hotel',  prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },
  { name: 'パークハイアット東京',       category: 'hotel',  prefecture_code: '13', prefecture_name: '東京都', city: '新宿区' },
  { name: 'マンダリン オリエンタル 東京', category: 'hotel', prefecture_code: '13', prefecture_name: '東京都', city: '中央区' },
  { name: 'ホテルニューオータニ東京',    category: 'hotel',  prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },
  { name: 'アマン東京',                 category: 'hotel',  prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },

  // ===== 神奈川 =====
  { name: '富士屋ホテル',            category: 'hotel',   prefecture_code: '14', prefecture_name: '神奈川県', city: '足柄下郡' },
  { name: '強羅花壇',               category: 'ryokan',  prefecture_code: '14', prefecture_name: '神奈川県', city: '足柄下郡' },
  { name: '箱根強羅 白檀',          category: 'ryokan',  prefecture_code: '14', prefecture_name: '神奈川県', city: '足柄下郡' },
  { name: 'ホテルニューグランド横浜', category: 'hotel',  prefecture_code: '14', prefecture_name: '神奈川県', city: '横浜市' },
  { name: '横浜ベイホテル東急',      category: 'hotel',   prefecture_code: '14', prefecture_name: '神奈川県', city: '横浜市' },
  { name: '江ノ島アイランドスパ',    category: 'hotel',   prefecture_code: '14', prefecture_name: '神奈川県', city: '藤沢市' },

  // ===== 新潟 =====
  { name: '月岡温泉 華鳳',           category: 'ryokan',  prefecture_code: '15', prefecture_name: '新潟県', city: '新発田市' },
  { name: '瀬波温泉 汐美荘',         category: 'ryokan',  prefecture_code: '15', prefecture_name: '新潟県', city: '村上市' },
  { name: '松之山温泉 ひなの宿 千歳', category: 'ryokan', prefecture_code: '15', prefecture_name: '新潟県', city: '十日町市' },
  { name: '越後湯沢温泉 湯澤荘',     category: 'ryokan',  prefecture_code: '15', prefecture_name: '新潟県', city: '南魚沼郡' },
  { name: 'ニューオータニ長岡',       category: 'hotel',  prefecture_code: '15', prefecture_name: '新潟県', city: '長岡市' },

  // ===== 富山 =====
  { name: '宇奈月国際ホテル',     category: 'hotel',   prefecture_code: '16', prefecture_name: '富山県', city: '黒部市' },
  { name: '黒部峡谷 欅平温泉 猿飛荘', category: 'ryokan', prefecture_code: '16', prefecture_name: '富山県', city: '黒部市' },
  { name: '庄川峡 長崎屋',        category: 'ryokan',  prefecture_code: '16', prefecture_name: '富山県', city: '砺波市' },
  { name: '富山エクセルホテル東急', category: 'hotel',  prefecture_code: '16', prefecture_name: '富山県', city: '富山市' },
  { name: '天然温泉かみのたいら遊雲の里ホテル', category: 'hotel', prefecture_code: '16', prefecture_name: '富山県', city: '南砺市' },

  // ===== 石川 =====
  { name: '加賀屋',                 category: 'ryokan',  prefecture_code: '17', prefecture_name: '石川県', city: '七尾市' },
  { name: '金沢全日空ホテル',       category: 'hotel',   prefecture_code: '17', prefecture_name: '石川県', city: '金沢市' },
  { name: '粟津温泉 法師',          category: 'ryokan',  prefecture_code: '17', prefecture_name: '石川県', city: '小松市' },
  { name: '山代温泉 加賀観光ホテル', category: 'hotel',  prefecture_code: '17', prefecture_name: '石川県', city: '加賀市' },
  { name: '片山津温泉 佳水郷',      category: 'ryokan',  prefecture_code: '17', prefecture_name: '石川県', city: '加賀市' },
  { name: '和倉温泉 多田屋',        category: 'ryokan',  prefecture_code: '17', prefecture_name: '石川県', city: '七尾市' },

  // ===== 福井 =====
  { name: '芦原温泉 美松',          category: 'ryokan',  prefecture_code: '18', prefecture_name: '福井県', city: 'あわら市' },
  { name: '三方五湖温泉 水月花',    category: 'ryokan',  prefecture_code: '18', prefecture_name: '福井県', city: '三方上中郡' },
  { name: '東尋坊温泉 亀の井ホテル', category: 'hotel',  prefecture_code: '18', prefecture_name: '福井県', city: '坂井市' },
  { name: '越前漁港の宿 かに座',    category: 'ryokan',  prefecture_code: '18', prefecture_name: '福井県', city: '越前市' },
  { name: '福井エクセルホテル東急',  category: 'hotel',  prefecture_code: '18', prefecture_name: '福井県', city: '福井市' },

  // ===== 山梨 =====
  { name: '富士山温泉 ホテル鐘山苑', category: 'ryokan', prefecture_code: '19', prefecture_name: '山梨県', city: '富士吉田市' },
  { name: '石和温泉 ホテルニュー石和', category: 'hotel', prefecture_code: '19', prefecture_name: '山梨県', city: '笛吹市' },
  { name: '湯村温泉 常磐ホテル',     category: 'hotel',  prefecture_code: '19', prefecture_name: '山梨県', city: '甲府市' },
  { name: '下部温泉 元湯 蓬莱館',    category: 'ryokan', prefecture_code: '19', prefecture_name: '山梨県', city: '南巨摩郡' },
  { name: '山中湖温泉 紅富士の湯',   category: 'ryokan', prefecture_code: '19', prefecture_name: '山梨県', city: '南都留郡' },

  // ===== 長野 =====
  { name: '白馬グランドホテル',           category: 'hotel',  prefecture_code: '20', prefecture_name: '長野県', city: '北安曇郡' },
  { name: '地獄谷野猿公苑 後楽館',       category: 'ryokan', prefecture_code: '20', prefecture_name: '長野県', city: '下高井郡' },
  { name: '別所温泉 かしわや本店',        category: 'ryokan', prefecture_code: '20', prefecture_name: '長野県', city: '上田市' },
  { name: '上諏訪温泉 しんゆ',           category: 'ryokan', prefecture_code: '20', prefecture_name: '長野県', city: '諏訪市' },
  { name: '野沢温泉 野沢温泉ホテル',      category: 'hotel',  prefecture_code: '20', prefecture_name: '長野県', city: '下高井郡' },
  { name: '戸倉上山田温泉 笹屋ホテルどんぐり', category: 'hotel', prefecture_code: '20', prefecture_name: '長野県', city: '千曲市' },

  // ===== 岐阜 =====
  { name: '下呂温泉 水明館',          category: 'ryokan', prefecture_code: '21', prefecture_name: '岐阜県', city: '下呂市' },
  { name: '奥飛騨温泉郷 深山桜庵',    category: 'ryokan', prefecture_code: '21', prefecture_name: '岐阜県', city: '高山市' },
  { name: '飛騨高山温泉 旅館 花扇',   category: 'ryokan', prefecture_code: '21', prefecture_name: '岐阜県', city: '高山市' },
  { name: '長良川温泉 十八楼',        category: 'ryokan', prefecture_code: '21', prefecture_name: '岐阜県', city: '岐阜市' },
  { name: '郡上八幡城下町プラザホテル', category: 'hotel', prefecture_code: '21', prefecture_name: '岐阜県', city: '郡上市' },

  // ===== 静岡 =====
  { name: '熱海温泉 ホテルニューアカオ', category: 'hotel',  prefecture_code: '22', prefecture_name: '静岡県', city: '熱海市' },
  { name: '修善寺温泉 新井旅館',        category: 'ryokan', prefecture_code: '22', prefecture_name: '静岡県', city: '伊豆市' },
  { name: '伊東温泉 ホテル聚楽',        category: 'hotel',  prefecture_code: '22', prefecture_name: '静岡県', city: '伊東市' },
  { name: '寸又峡温泉 翠紅苑',         category: 'ryokan', prefecture_code: '22', prefecture_name: '静岡県', city: '榛原郡' },
  { name: '浜名湖ロイヤルホテル',       category: 'hotel',  prefecture_code: '22', prefecture_name: '静岡県', city: '浜松市' },
  { name: '西伊豆 堂ヶ島温泉ホテル',   category: 'hotel',  prefecture_code: '22', prefecture_name: '静岡県', city: '賀茂郡' },

  // ===== 愛知 =====
  { name: 'ナゴヤキャッスルホテル',          category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '名古屋市' },
  { name: 'ANAクラウンプラザホテル名古屋',   category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '名古屋市' },
  { name: '蒲郡クラシックホテル',            category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '蒲郡市' },
  { name: '三谷温泉 ひがきホテル',          category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '蒲郡市' },
  { name: '名古屋東急ホテル',               category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '名古屋市' },
  { name: '渥美半島 伊良湖ビューホテル',    category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '田原市' },

  // ===== 三重 =====
  { name: '志摩観光ホテル ザ・クラシック', category: 'hotel',  prefecture_code: '24', prefecture_name: '三重県', city: '志摩市' },
  { name: '鳥羽国際ホテル',               category: 'hotel',  prefecture_code: '24', prefecture_name: '三重県', city: '鳥羽市' },
  { name: '湯の山温泉 希望荘',            category: 'ryokan', prefecture_code: '24', prefecture_name: '三重県', city: '菰野町' },
  { name: '伊勢志摩温泉 旅館 大橋',       category: 'ryokan', prefecture_code: '24', prefecture_name: '三重県', city: '松阪市' },
  { name: '賢島宝生苑',                   category: 'ryokan', prefecture_code: '24', prefecture_name: '三重県', city: '志摩市' },

  // ===== 滋賀 =====
  { name: '琵琶湖ホテル',           category: 'hotel',  prefecture_code: '25', prefecture_name: '滋賀県', city: '大津市' },
  { name: '琵琶湖マリオットホテル',  category: 'hotel',  prefecture_code: '25', prefecture_name: '滋賀県', city: '守山市' },
  { name: '雄琴温泉 湖畔の宿 紅鮎',  category: 'ryokan', prefecture_code: '25', prefecture_name: '滋賀県', city: '大津市' },
  { name: '彦根キャッスルリゾート&スパ', category: 'hotel', prefecture_code: '25', prefecture_name: '滋賀県', city: '彦根市' },
  { name: '長浜ロイヤルホテル',      category: 'hotel',  prefecture_code: '25', prefecture_name: '滋賀県', city: '長浜市' },

  // ===== 京都 =====
  { name: '俵屋旅館',              category: 'ryokan', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: '柊家旅館',              category: 'ryokan', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: '炭屋旅館',              category: 'ryokan', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: '京都ホテルオークラ',     category: 'hotel',  prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: 'ザ・リッツ・カールトン京都', category: 'hotel', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: 'アマン京都',            category: 'hotel',  prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: '天橋立温泉 橋立浪花荘', category: 'ryokan', prefecture_code: '26', prefecture_name: '京都府', city: '宮津市' },

  // ===== 大阪 =====
  { name: 'コンラッド大阪',           category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'セントレジス大阪',         category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'ヒルトン大阪',             category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: '帝国ホテル大阪',           category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'ホテルニューオータニ大阪',  category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'ザ・ルーフトップ大阪',     category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },

  // ===== 兵庫 =====
  { name: '有馬温泉 陶泉 御所坊',    category: 'ryokan', prefecture_code: '28', prefecture_name: '兵庫県', city: '神戸市' },
  { name: '城崎温泉 西村屋本館',      category: 'ryokan', prefecture_code: '28', prefecture_name: '兵庫県', city: '豊岡市' },
  { name: '淡路島温泉 淡路夢泉景',    category: 'ryokan', prefecture_code: '28', prefecture_name: '兵庫県', city: '淡路市' },
  { name: '神戸ポートピアホテル',     category: 'hotel',  prefecture_code: '28', prefecture_name: '兵庫県', city: '神戸市' },
  { name: 'ホテルオークラ神戸',       category: 'hotel',  prefecture_code: '28', prefecture_name: '兵庫県', city: '神戸市' },
  { name: '南あわじ温泉郷 渚の交わり 灘温泉', category: 'ryokan', prefecture_code: '28', prefecture_name: '兵庫県', city: '南あわじ市' },

  // ===== 奈良 =====
  { name: '奈良ホテル',              category: 'hotel',  prefecture_code: '29', prefecture_name: '奈良県', city: '奈良市' },
  { name: '洞川温泉 旅館 星乃川',   category: 'ryokan', prefecture_code: '29', prefecture_name: '奈良県', city: '吉野郡' },
  { name: '十津川温泉 旅館 昴の郷', category: 'ryokan', prefecture_code: '29', prefecture_name: '奈良県', city: '吉野郡' },
  { name: 'ホテルフジタ奈良',        category: 'hotel',  prefecture_code: '29', prefecture_name: '奈良県', city: '奈良市' },
  { name: '橿原ロイヤルホテル',      category: 'hotel',  prefecture_code: '29', prefecture_name: '奈良県', city: '橿原市' },

  // ===== 和歌山 =====
  { name: '南紀白浜温泉 ホテル川久',       category: 'hotel',  prefecture_code: '30', prefecture_name: '和歌山県', city: '西牟婁郡' },
  { name: '勝浦温泉 ホテル浦島',           category: 'hotel',  prefecture_code: '30', prefecture_name: '和歌山県', city: '東牟婁郡' },
  { name: '龍神温泉 上御殿',              category: 'ryokan', prefecture_code: '30', prefecture_name: '和歌山県', city: '田辺市' },
  { name: '那智勝浦温泉 ホテル中の島',     category: 'hotel',  prefecture_code: '30', prefecture_name: '和歌山県', city: '東牟婁郡' },
  { name: '白浜温泉 旅館 むさし',         category: 'ryokan', prefecture_code: '30', prefecture_name: '和歌山県', city: '西牟婁郡' },

  // ===== 鳥取 =====
  { name: '皆生温泉 東光園',    category: 'ryokan', prefecture_code: '31', prefecture_name: '鳥取県', city: '米子市' },
  { name: '三朝温泉 株湯',      category: 'ryokan', prefecture_code: '31', prefecture_name: '鳥取県', city: '東伯郡' },
  { name: '岩井温泉 岩井屋',    category: 'ryokan', prefecture_code: '31', prefecture_name: '鳥取県', city: '岩美郡' },
  { name: '鳥取砂丘コナン空港温泉 空港ホテル', category: 'hotel', prefecture_code: '31', prefecture_name: '鳥取県', city: '鳥取市' },
  { name: '浜村温泉 旅館 美好荘', category: 'ryokan', prefecture_code: '31', prefecture_name: '鳥取県', city: '鳥取市' },

  // ===== 島根 =====
  { name: '玉造温泉 旅館 白石',    category: 'ryokan', prefecture_code: '32', prefecture_name: '島根県', city: '松江市' },
  { name: '温泉津温泉 旅館 陶山',  category: 'ryokan', prefecture_code: '32', prefecture_name: '島根県', city: '大田市' },
  { name: '松江しんじ湖温泉 ホテル一畑', category: 'hotel', prefecture_code: '32', prefecture_name: '島根県', city: '松江市' },
  { name: '湯の川温泉 湯宿 草菴',  category: 'ryokan', prefecture_code: '32', prefecture_name: '島根県', city: '出雲市' },
  { name: '隠岐の島温泉 シーサイドホテル海心', category: 'hotel', prefecture_code: '32', prefecture_name: '島根県', city: '隠岐郡' },

  // ===== 岡山 =====
  { name: '奥津温泉 奥津荘',       category: 'ryokan', prefecture_code: '33', prefecture_name: '岡山県', city: '苫田郡' },
  { name: '湯郷温泉 美春閣',       category: 'ryokan', prefecture_code: '33', prefecture_name: '岡山県', city: '美作市' },
  { name: '岡山全日空ホテル',       category: 'hotel',  prefecture_code: '33', prefecture_name: '岡山県', city: '岡山市' },
  { name: '鷲羽山ハイランドホテル', category: 'hotel',  prefecture_code: '33', prefecture_name: '岡山県', city: '倉敷市' },
  { name: '蒜山温泉 休暇村 蒜山高原', category: 'hotel', prefecture_code: '33', prefecture_name: '岡山県', city: '真庭市' },

  // ===== 広島 =====
  { name: '宮島 錦水館',             category: 'ryokan', prefecture_code: '34', prefecture_name: '広島県', city: '廿日市市' },
  { name: '広島グランドプリンスホテル', category: 'hotel', prefecture_code: '34', prefecture_name: '広島県', city: '広島市' },
  { name: '湯来温泉 湯来ロッジ',     category: 'ryokan', prefecture_code: '34', prefecture_name: '広島県', city: '広島市' },
  { name: '尾道温泉 西山別館',       category: 'ryokan', prefecture_code: '34', prefecture_name: '広島県', city: '尾道市' },
  { name: '鞆の浦温泉 鞆の浦 さんすいホテル', category: 'hotel', prefecture_code: '34', prefecture_name: '広島県', city: '福山市' },

  // ===== 山口 =====
  { name: '湯田温泉 西の雅 常盤',    category: 'ryokan', prefecture_code: '35', prefecture_name: '山口県', city: '山口市' },
  { name: '長門湯本温泉 大谷山荘',   category: 'ryokan', prefecture_code: '35', prefecture_name: '山口県', city: '長門市' },
  { name: '萩温泉郷 萩小町',         category: 'ryokan', prefecture_code: '35', prefecture_name: '山口県', city: '萩市' },
  { name: '下関グランドホテル',       category: 'hotel',  prefecture_code: '35', prefecture_name: '山口県', city: '下関市' },
  { name: '俵山温泉 旅館 山田屋',    category: 'ryokan', prefecture_code: '35', prefecture_name: '山口県', city: '長門市' },

  // ===== 徳島 =====
  { name: 'ホテルかずら橋',           category: 'hotel',  prefecture_code: '36', prefecture_name: '徳島県', city: '三好市' },
  { name: 'アオアヲ ナルト リゾート', category: 'hotel',  prefecture_code: '36', prefecture_name: '徳島県', city: '鳴門市' },
  { name: '祖谷温泉 ホテル祖谷温泉',  category: 'hotel',  prefecture_code: '36', prefecture_name: '徳島県', city: '三好市' },
  { name: '徳島グランドホテル 偕楽園', category: 'hotel', prefecture_code: '36', prefecture_name: '徳島県', city: '徳島市' },
  { name: '脇町温泉 うだつの湯',      category: 'ryokan', prefecture_code: '36', prefecture_name: '徳島県', city: '美馬市' },

  // ===== 香川 =====
  { name: '琴弾廻廊',              category: 'ryokan', prefecture_code: '37', prefecture_name: '香川県', city: '観音寺市' },
  { name: 'ベネッセハウス',        category: 'hotel',  prefecture_code: '37', prefecture_name: '香川県', city: '香川郡' },
  { name: '屋島温泉 花万ホテル',   category: 'hotel',  prefecture_code: '37', prefecture_name: '香川県', city: '高松市' },
  { name: '高松国際ホテル',        category: 'hotel',  prefecture_code: '37', prefecture_name: '香川県', city: '高松市' },
  { name: '小豆島温泉 小豆島国際ホテル', category: 'hotel', prefecture_code: '37', prefecture_name: '香川県', city: '小豆郡' },

  // ===== 愛媛 =====
  { name: '道後温泉 大和屋別荘',    category: 'ryokan', prefecture_code: '38', prefecture_name: '愛媛県', city: '松山市' },
  { name: '道後プリンスホテル',     category: 'hotel',  prefecture_code: '38', prefecture_name: '愛媛県', city: '松山市' },
  { name: '奥道後温泉 壱湯の守',   category: 'ryokan', prefecture_code: '38', prefecture_name: '愛媛県', city: '松山市' },
  { name: '今治国際ホテル',         category: 'hotel',  prefecture_code: '38', prefecture_name: '愛媛県', city: '今治市' },
  { name: '黒潮リゾートホテル四国',  category: 'hotel',  prefecture_code: '38', prefecture_name: '愛媛県', city: '宇和島市' },

  // ===== 高知 =====
  { name: '黒潮本陣',                    category: 'ryokan', prefecture_code: '39', prefecture_name: '高知県', city: '幡多郡' },
  { name: '足摺温泉 ホテル足摺園',       category: 'hotel',  prefecture_code: '39', prefecture_name: '高知県', city: '土佐清水市' },
  { name: '土佐御苑',                    category: 'ryokan', prefecture_code: '39', prefecture_name: '高知県', city: '高知市' },
  { name: '四万十川温泉 四万十の宿',     category: 'ryokan', prefecture_code: '39', prefecture_name: '高知県', city: '四万十市' },
  { name: 'ANAクラウンプラザホテル高知', category: 'hotel',  prefecture_code: '39', prefecture_name: '高知県', city: '高知市' },

  // ===== 福岡 =====
  { name: 'ヒルトン福岡シーホーク',      category: 'hotel',  prefecture_code: '40', prefecture_name: '福岡県', city: '福岡市' },
  { name: '原鶴温泉 泰泉閣',            category: 'ryokan', prefecture_code: '40', prefecture_name: '福岡県', city: '朝倉市' },
  { name: '二日市温泉 大丸別荘',         category: 'ryokan', prefecture_code: '40', prefecture_name: '福岡県', city: '筑紫野市' },
  { name: '門司港ホテル',               category: 'hotel',  prefecture_code: '40', prefecture_name: '福岡県', city: '北九州市' },
  { name: 'グランドハイアット福岡',       category: 'hotel',  prefecture_code: '40', prefecture_name: '福岡県', city: '福岡市' },
  { name: '博多グランドホテル',          category: 'hotel',  prefecture_code: '40', prefecture_name: '福岡県', city: '福岡市' },

  // ===== 佐賀 =====
  { name: '嬉野温泉 和多屋別荘',   category: 'ryokan', prefecture_code: '41', prefecture_name: '佐賀県', city: '嬉野市' },
  { name: '武雄温泉 旅館 八楽',    category: 'ryokan', prefecture_code: '41', prefecture_name: '佐賀県', city: '武雄市' },
  { name: '古湯温泉 ONCRI',        category: 'ryokan', prefecture_code: '41', prefecture_name: '佐賀県', city: '佐賀市' },
  { name: 'ホテルマリターレ創世佐賀', category: 'hotel', prefecture_code: '41', prefecture_name: '佐賀県', city: '佐賀市' },
  { name: '呼子温泉 旅館 いろは',  category: 'ryokan', prefecture_code: '41', prefecture_name: '佐賀県', city: '唐津市' },

  // ===== 長崎 =====
  { name: '雲仙温泉 九州ホテル',      category: 'hotel',  prefecture_code: '42', prefecture_name: '長崎県', city: '雲仙市' },
  { name: '小浜温泉 旅館 西洋',       category: 'ryokan', prefecture_code: '42', prefecture_name: '長崎県', city: '雲仙市' },
  { name: '平戸温泉 旗松亭',          category: 'ryokan', prefecture_code: '42', prefecture_name: '長崎県', city: '平戸市' },
  { name: 'ホテルニュー長崎',          category: 'hotel',  prefecture_code: '42', prefecture_name: '長崎県', city: '長崎市' },
  { name: '長崎ホテル清風',            category: 'hotel',  prefecture_code: '42', prefecture_name: '長崎県', city: '長崎市' },
  { name: '五島列島リゾートホテル マルゲリータ', category: 'hotel', prefecture_code: '42', prefecture_name: '長崎県', city: '五島市' },

  // ===== 熊本 =====
  { name: '黒川温泉 旅館 山みず木',   category: 'ryokan', prefecture_code: '43', prefecture_name: '熊本県', city: '阿蘇郡' },
  { name: '阿蘇プラザホテル',         category: 'hotel',  prefecture_code: '43', prefecture_name: '熊本県', city: '阿蘇市' },
  { name: '人吉温泉 相良路の宿 おおが', category: 'ryokan', prefecture_code: '43', prefecture_name: '熊本県', city: '人吉市' },
  { name: '熊本ホテルキャッスル',      category: 'hotel',  prefecture_code: '43', prefecture_name: '熊本県', city: '熊本市' },
  { name: '菊池温泉 旅館 錦泉楼',     category: 'ryokan', prefecture_code: '43', prefecture_name: '熊本県', city: '菊池市' },

  // ===== 大分 =====
  { name: '由布院温泉 玉の湯',          category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '由布市' },
  { name: '別府温泉 杉乃井ホテル',      category: 'hotel',  prefecture_code: '44', prefecture_name: '大分県', city: '別府市' },
  { name: '鉄輪温泉 こころね',          category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '別府市' },
  { name: '長湯温泉 御前湯',           category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '竹田市' },
  { name: '日田温泉 亀山亭ホテル',      category: 'hotel',  prefecture_code: '44', prefecture_name: '大分県', city: '日田市' },
  { name: '湯布院温泉 山荘 無量塔',    category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '由布市' },

  // ===== 宮崎 =====
  { name: '青島グランドホテル',      category: 'hotel',  prefecture_code: '45', prefecture_name: '宮崎県', city: '宮崎市' },
  { name: '高千穂温泉 高千穂旅館',   category: 'ryokan', prefecture_code: '45', prefecture_name: '宮崎県', city: '西臼杵郡' },
  { name: '宮崎観光ホテル',          category: 'hotel',  prefecture_code: '45', prefecture_name: '宮崎県', city: '宮崎市' },
  { name: '日南温泉 日南海岸観光ホテル', category: 'hotel', prefecture_code: '45', prefecture_name: '宮崎県', city: '日南市' },
  { name: 'シェラトン・グランデ・オーシャンリゾート', category: 'hotel', prefecture_code: '45', prefecture_name: '宮崎県', city: '宮崎市' },

  // ===== 鹿児島 =====
  { name: '指宿温泉 白水館',          category: 'ryokan', prefecture_code: '46', prefecture_name: '鹿児島県', city: '指宿市' },
  { name: '霧島温泉郷 霧島ホテル',    category: 'hotel',  prefecture_code: '46', prefecture_name: '鹿児島県', city: '霧島市' },
  { name: '桜島温泉 ホテル レインボー', category: 'hotel', prefecture_code: '46', prefecture_name: '鹿児島県', city: '鹿児島市' },
  { name: '種子島温泉 グリーンパーク種子島', category: 'hotel', prefecture_code: '46', prefecture_name: '鹿児島県', city: '西之表市' },
  { name: '鹿児島サンロイヤルホテル',  category: 'hotel',  prefecture_code: '46', prefecture_name: '鹿児島県', city: '鹿児島市' },
  { name: '屋久島温泉 縄文の宿 まんてん', category: 'ryokan', prefecture_code: '46', prefecture_name: '鹿児島県', city: '熊毛郡' },

  // ===== 沖縄 =====
  { name: 'ザ・ブセナテラス',                     category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '名護市' },
  { name: 'ANAインターコンチネンタル万座ビーチリゾート', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '恩納村' },
  { name: 'ルネッサンス リゾート オキナワ',        category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '恩納村' },
  { name: '沖縄残波岬ロイヤルホテル',             category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '中頭郡' },
  { name: '琉球温泉 瀬長島ウミカジテラス ホテル  龍神の湯', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '豊見城市' },
  { name: 'ハレクラニ沖縄',                       category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '恩納村' },
  { name: 'ニライカナイ 石垣島温泉 フサキビーチリゾート', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '石垣市' },
]

async function main() {
  console.log(`\n=== いいとこどり 施設データ追加スクリプト ===`)
  console.log(`追加予定: ${facilities.length}件`)
  console.log(`Supabase URL: ${supabaseUrl}\n`)

  const CHUNK = 50
  let total = 0

  for (let i = 0; i < facilities.length; i += CHUNK) {
    const chunk = facilities.slice(i, i + CHUNK)
    const { data, error } = await supabase.from('facilities').insert(chunk).select('id')
    if (error) {
      console.error(`エラー (${i}〜${i + chunk.length}件目):`, error.message)
    } else {
      total += data.length
      console.log(`✅ ${i + 1}〜${i + chunk.length}件目 投入完了 (${data.length}件)`)
    }
  }

  console.log(`\n=== 完了: ${total}件 追加しました ===\n`)
}

main().catch(console.error)
