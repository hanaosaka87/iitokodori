// 既存68件に追加する施設データ（都道府県ごとに追加）
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://sdnnyvmupbhudxjkjptd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbm55dm11cGJodWR4amtqcHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Njg4NjUsImV4cCI6MjA5NDM0NDg2NX0.sa4ItlR0NzyymFjFaevu1xxTUVVkGa2n7hMGcM6NRNU'
)

const facilities = [
  // 北海道
  { name: '登別温泉 第一滝本館', category: 'ryokan', prefecture_code: '01', prefecture_name: '北海道', city: '登別市' },
  { name: 'ルスツリゾートホテル&コンベンション', category: 'hotel', prefecture_code: '01', prefecture_name: '北海道', city: '虻田郡留寿都村' },
  { name: '旭川グランドホテル', category: 'hotel', prefecture_code: '01', prefecture_name: '北海道', city: '旭川市' },
  { name: '洞爺湖温泉 ザ・ウィンザーホテル洞爺', category: 'hotel', prefecture_code: '01', prefecture_name: '北海道', city: '虻田郡洞爺湖町' },
  { name: '函館湯の川温泉 花びしホテル', category: 'ryokan', prefecture_code: '01', prefecture_name: '北海道', city: '函館市' },
  { name: '知床第一ホテル', category: 'hotel', prefecture_code: '01', prefecture_name: '北海道', city: '斜里郡斜里町' },
  { name: '阿寒湖温泉 あかん遊久の里 鶴雅', category: 'ryokan', prefecture_code: '01', prefecture_name: '北海道', city: '釧路市' },
  { name: 'ノーザンアークリゾート', category: 'hotel', prefecture_code: '01', prefecture_name: '北海道', city: '上川郡比布町' },

  // 青森
  { name: '酸ケ湯温泉旅館', category: 'ryokan', prefecture_code: '02', prefecture_name: '青森県', city: '青森市' },
  { name: '奥入瀬渓流ホテル', category: 'hotel', prefecture_code: '02', prefecture_name: '青森県', city: '十和田市' },
  { name: '浅虫温泉 南部屋・海扇閣', category: 'ryokan', prefecture_code: '02', prefecture_name: '青森県', city: '青森市' },
  { name: '弘前パークホテル', category: 'hotel', prefecture_code: '02', prefecture_name: '青森県', city: '弘前市' },

  // 岩手
  { name: '花巻温泉 ホテル千秋閣', category: 'ryokan', prefecture_code: '03', prefecture_name: '岩手県', city: '花巻市' },
  { name: '松川温泉 峡雲荘', category: 'ryokan', prefecture_code: '03', prefecture_name: '岩手県', city: '八幡平市' },
  { name: '盛岡グランドホテル', category: 'hotel', prefecture_code: '03', prefecture_name: '岩手県', city: '盛岡市' },
  { name: '中尊寺温泉 しらゆり荘', category: 'ryokan', prefecture_code: '03', prefecture_name: '岩手県', city: '西磐井郡平泉町' },

  // 宮城
  { name: '秋保温泉 蘭亭', category: 'ryokan', prefecture_code: '04', prefecture_name: '宮城県', city: '仙台市' },
  { name: '松島温泉 松島一の坊', category: 'ryokan', prefecture_code: '04', prefecture_name: '宮城県', city: '宮城郡松島町' },
  { name: 'ウェスティンホテル仙台', category: 'hotel', prefecture_code: '04', prefecture_name: '宮城県', city: '仙台市' },
  { name: '作並温泉 鷹泉閣 岩松旅館', category: 'ryokan', prefecture_code: '04', prefecture_name: '宮城県', city: '仙台市' },

  // 秋田
  { name: '玉川温泉 玉川温泉旅館', category: 'ryokan', prefecture_code: '05', prefecture_name: '秋田県', city: '仙北市' },
  { name: '秋田ビューホテル', category: 'hotel', prefecture_code: '05', prefecture_name: '秋田県', city: '秋田市' },
  { name: '大曲温泉 ホテルブラックホール', category: 'hotel', prefecture_code: '05', prefecture_name: '秋田県', city: '大仙市' },

  // 山形
  { name: '銀山温泉 藤屋御料理旅館', category: 'ryokan', prefecture_code: '06', prefecture_name: '山形県', city: '尾花沢市' },
  { name: '山形グランドホテル', category: 'hotel', prefecture_code: '06', prefecture_name: '山形県', city: '山形市' },
  { name: '天童温泉 ほほえみの宿 滝の湯', category: 'ryokan', prefecture_code: '06', prefecture_name: '山形県', city: '天童市' },
  { name: '上山温泉 古窯', category: 'ryokan', prefecture_code: '06', prefecture_name: '山形県', city: '上山市' },

  // 福島
  { name: '東山温泉 向瀧', category: 'ryokan', prefecture_code: '07', prefecture_name: '福島県', city: '会津若松市' },
  { name: '裏磐梯レイクリゾート', category: 'hotel', prefecture_code: '07', prefecture_name: '福島県', city: '耶麻郡北塩原村' },
  { name: '飯坂温泉 なかむらや旅館', category: 'ryokan', prefecture_code: '07', prefecture_name: '福島県', city: '福島市' },

  // 茨城
  { name: '大洗シーサイドホテル', category: 'hotel', prefecture_code: '08', prefecture_name: '茨城県', city: '東茨城郡大洗町' },
  { name: '水戸プラザホテル', category: 'hotel', prefecture_code: '08', prefecture_name: '茨城県', city: '水戸市' },
  { name: '筑波山温泉 江戸屋', category: 'ryokan', prefecture_code: '08', prefecture_name: '茨城県', city: 'つくば市' },

  // 栃木
  { name: '那須温泉 朝日屋旅館', category: 'ryokan', prefecture_code: '09', prefecture_name: '栃木県', city: '那須郡那須町' },
  { name: '日光きぬ川スパホテル三日月', category: 'hotel', prefecture_code: '09', prefecture_name: '栃木県', city: '日光市' },
  { name: '川治温泉 柏屋旅館', category: 'ryokan', prefecture_code: '09', prefecture_name: '栃木県', city: '日光市' },

  // 群馬
  { name: '水上温泉 松乃井', category: 'ryokan', prefecture_code: '10', prefecture_name: '群馬県', city: '利根郡みなかみ町' },
  { name: '四万温泉 積善館', category: 'ryokan', prefecture_code: '10', prefecture_name: '群馬県', city: '吾妻郡中之条町' },
  { name: 'ホテル磯部ガーデン', category: 'hotel', prefecture_code: '10', prefecture_name: '群馬県', city: '安中市' },

  // 埼玉
  { name: '大宮ソニックシティホテル', category: 'hotel', prefecture_code: '11', prefecture_name: '埼玉県', city: 'さいたま市' },
  { name: '秩父温泉 満願の湯', category: 'ryokan', prefecture_code: '11', prefecture_name: '埼玉県', city: '秩父市' },
  { name: 'メッツァビレッジ', category: 'hotel', prefecture_code: '11', prefecture_name: '埼玉県', city: '飯能市' },

  // 千葉
  { name: '鴨川グランドタワー', category: 'hotel', prefecture_code: '12', prefecture_name: '千葉県', city: '鴨川市' },
  { name: '勝浦ホテル三日月', category: 'hotel', prefecture_code: '12', prefecture_name: '千葉県', city: '勝浦市' },
  { name: '南房総 白浜フラワーパーク', category: 'pension', prefecture_code: '12', prefecture_name: '千葉県', city: '南房総市' },

  // 東京
  { name: 'パレスホテル東京', category: 'hotel', prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },
  { name: 'アンダーズ東京', category: 'hotel', prefecture_code: '13', prefecture_name: '東京都', city: '港区' },
  { name: '東京ステーションホテル', category: 'hotel', prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },
  { name: 'ザ・プリンスパークタワー東京', category: 'hotel', prefecture_code: '13', prefecture_name: '東京都', city: '港区' },
  { name: 'フォーシーズンズホテル丸の内東京', category: 'hotel', prefecture_code: '13', prefecture_name: '東京都', city: '千代田区' },

  // 神奈川
  { name: '箱根湯本温泉 萬翠楼 福住', category: 'ryokan', prefecture_code: '14', prefecture_name: '神奈川県', city: '足柄下郡箱根町' },
  { name: 'ヒルトン小田原リゾート&スパ', category: 'hotel', prefecture_code: '14', prefecture_name: '神奈川県', city: '小田原市' },
  { name: '湯河原温泉 つたや旅館', category: 'ryokan', prefecture_code: '14', prefecture_name: '神奈川県', city: '足柄下郡湯河原町' },
  { name: 'ニューグランドホテル', category: 'hotel', prefecture_code: '14', prefecture_name: '神奈川県', city: '横浜市' },

  // 新潟
  { name: '苗場プリンスホテル', category: 'hotel', prefecture_code: '15', prefecture_name: '新潟県', city: '南魚沼郡湯沢町' },
  { name: '新潟グランドホテル', category: 'hotel', prefecture_code: '15', prefecture_name: '新潟県', city: '新潟市' },
  { name: '咲花温泉 佐取館', category: 'ryokan', prefecture_code: '15', prefecture_name: '新潟県', city: '五泉市' },

  // 富山
  { name: '宇奈月温泉 延楽', category: 'ryokan', prefecture_code: '16', prefecture_name: '富山県', city: '黒部市' },
  { name: 'ANAクラウンプラザホテル富山', category: 'hotel', prefecture_code: '16', prefecture_name: '富山県', city: '富山市' },

  // 石川
  { name: '山代温泉 べにや無何有', category: 'ryokan', prefecture_code: '17', prefecture_name: '石川県', city: '加賀市' },
  { name: '片山津温泉 佳水郷', category: 'ryokan', prefecture_code: '17', prefecture_name: '石川県', city: '加賀市' },
  { name: 'ANAクラウンプラザホテル金沢', category: 'hotel', prefecture_code: '17', prefecture_name: '石川県', city: '金沢市' },

  // 福井
  { name: '三国温泉 望洋楼', category: 'ryokan', prefecture_code: '18', prefecture_name: '福井県', city: '坂井市' },
  { name: 'ホテルフジタ福井', category: 'hotel', prefecture_code: '18', prefecture_name: '福井県', city: '福井市' },

  // 山梨
  { name: '富士山温泉 ホテル鐘山苑', category: 'ryokan', prefecture_code: '19', prefecture_name: '山梨県', city: '富士吉田市' },
  { name: '山中湖温泉 紅富士の湯', category: 'ryokan', prefecture_code: '19', prefecture_name: '山梨県', city: '南都留郡山中湖村' },
  { name: '石和温泉 ホテル新田', category: 'ryokan', prefecture_code: '19', prefecture_name: '山梨県', city: '笛吹市' },

  // 長野
  { name: '白馬東急ホテル', category: 'hotel', prefecture_code: '20', prefecture_name: '長野県', city: '北安曇郡白馬村' },
  { name: '上諏訪温泉 しんゆ', category: 'ryokan', prefecture_code: '20', prefecture_name: '長野県', city: '諏訪市' },
  { name: '志賀高原 ホテルサンバレー奥志賀', category: 'hotel', prefecture_code: '20', prefecture_name: '長野県', city: '下高井郡山ノ内町' },
  { name: '別所温泉 花屋', category: 'ryokan', prefecture_code: '20', prefecture_name: '長野県', city: '上田市' },

  // 岐阜
  { name: '平湯温泉 平湯館', category: 'ryokan', prefecture_code: '21', prefecture_name: '岐阜県', city: '高山市' },
  { name: '高山グリーンホテル', category: 'hotel', prefecture_code: '21', prefecture_name: '岐阜県', city: '高山市' },
  { name: '奥飛騨温泉郷 山里のいおり 草円', category: 'ryokan', prefecture_code: '21', prefecture_name: '岐阜県', city: '高山市' },

  // 静岡
  { name: '伊東温泉 東海館', category: 'ryokan', prefecture_code: '22', prefecture_name: '静岡県', city: '伊東市' },
  { name: '浜名湖ロイヤルホテル', category: 'hotel', prefecture_code: '22', prefecture_name: '静岡県', city: '浜松市' },
  { name: '堂ヶ島温泉ホテル', category: 'hotel', prefecture_code: '22', prefecture_name: '静岡県', city: '賀茂郡西伊豆町' },
  { name: 'ホテルグランビュー浜松', category: 'hotel', prefecture_code: '22', prefecture_name: '静岡県', city: '浜松市' },

  // 愛知
  { name: '名古屋観光ホテル', category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '名古屋市' },
  { name: 'ANAクラウンプラザホテルグランコート名古屋', category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '名古屋市' },
  { name: '蒲郡温泉 蒲郡クラシックホテル', category: 'hotel', prefecture_code: '23', prefecture_name: '愛知県', city: '蒲郡市' },

  // 三重
  { name: '鳥羽国際ホテル', category: 'hotel', prefecture_code: '24', prefecture_name: '三重県', city: '鳥羽市' },
  { name: '伊勢志摩温泉 鵜方浜荘', category: 'ryokan', prefecture_code: '24', prefecture_name: '三重県', city: '志摩市' },
  { name: '花の窟温泉 海ほてる熊野七里御浜', category: 'hotel', prefecture_code: '24', prefecture_name: '三重県', city: '熊野市' },

  // 滋賀
  { name: '雄琴温泉 湖里庵', category: 'ryokan', prefecture_code: '25', prefecture_name: '滋賀県', city: '大津市' },
  { name: 'ウェスティン都ホテル京都（大津）', category: 'hotel', prefecture_code: '25', prefecture_name: '滋賀県', city: '大津市' },

  // 京都
  { name: '嵐山温泉 花伝抄', category: 'ryokan', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: 'ハイアット リージェンシー 京都', category: 'hotel', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: 'ウェスティン都ホテル京都', category: 'hotel', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },
  { name: '京都 翠嵐 ラグジュアリーコレクションホテル', category: 'hotel', prefecture_code: '26', prefecture_name: '京都府', city: '京都市' },

  // 大阪
  { name: 'セントレジスホテル大阪', category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'ヒルトン大阪', category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'W大阪', category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },
  { name: 'ザ・ロイヤルパークホテル アイコニック 大阪御堂筋', category: 'hotel', prefecture_code: '27', prefecture_name: '大阪府', city: '大阪市' },

  // 兵庫
  { name: '有馬温泉 兵衛向陽閣', category: 'ryokan', prefecture_code: '28', prefecture_name: '兵庫県', city: '神戸市' },
  { name: '城崎温泉 西村屋本館', category: 'ryokan', prefecture_code: '28', prefecture_name: '兵庫県', city: '豊岡市' },
  { name: 'ANAクラウンプラザホテル神戸', category: 'hotel', prefecture_code: '28', prefecture_name: '兵庫県', city: '神戸市' },
  { name: 'オリエンタルホテル神戸', category: 'hotel', prefecture_code: '28', prefecture_name: '兵庫県', city: '神戸市' },

  // 奈良
  { name: 'ホテルフジタ奈良', category: 'hotel', prefecture_code: '29', prefecture_name: '奈良県', city: '奈良市' },
  { name: '洞川温泉 花屋徳兵衛', category: 'ryokan', prefecture_code: '29', prefecture_name: '奈良県', city: '吉野郡天川村' },

  // 和歌山
  { name: '南紀白浜温泉 ホテル&リゾーツ 和歌山 白浜', category: 'hotel', prefecture_code: '30', prefecture_name: '和歌山県', city: '西牟婁郡白浜町' },
  { name: '那智勝浦温泉 ホテル浦島', category: 'hotel', prefecture_code: '30', prefecture_name: '和歌山県', city: '東牟婁郡那智勝浦町' },

  // 鳥取
  { name: '皆生温泉 皆生つるや', category: 'ryokan', prefecture_code: '31', prefecture_name: '鳥取県', city: '米子市' },
  { name: '三朝温泉 斉木別館', category: 'ryokan', prefecture_code: '31', prefecture_name: '鳥取県', city: '東伯郡三朝町' },

  // 島根
  { name: '出雲温泉 竹野屋旅館', category: 'ryokan', prefecture_code: '32', prefecture_name: '島根県', city: '出雲市' },
  { name: '皆生温泉 ホテル大橋', category: 'hotel', prefecture_code: '32', prefecture_name: '島根県', city: '松江市' },

  // 岡山
  { name: '湯原温泉 八景', category: 'ryokan', prefecture_code: '33', prefecture_name: '岡山県', city: '真庭市' },
  { name: 'ホテルグランヴィア岡山', category: 'hotel', prefecture_code: '33', prefecture_name: '岡山県', city: '岡山市' },

  // 広島
  { name: '宮島温泉 宮島珠の浦ホテル', category: 'hotel', prefecture_code: '34', prefecture_name: '広島県', city: '廿日市市' },
  { name: 'ホテルグランヴィア広島', category: 'hotel', prefecture_code: '34', prefecture_name: '広島県', city: '広島市' },
  { name: '鞆の浦温泉 鞆シーサイドホテル', category: 'hotel', prefecture_code: '34', prefecture_name: '広島県', city: '福山市' },

  // 山口
  { name: '湯田温泉 ホテルニュータナカ', category: 'hotel', prefecture_code: '35', prefecture_name: '山口県', city: '山口市' },
  { name: '萩温泉郷 萩本陣', category: 'ryokan', prefecture_code: '35', prefecture_name: '山口県', city: '萩市' },

  // 徳島
  { name: '阿波温泉 あわじ荘', category: 'ryokan', prefecture_code: '36', prefecture_name: '徳島県', city: '徳島市' },
  { name: 'ホテルアストリアなると', category: 'hotel', prefecture_code: '36', prefecture_name: '徳島県', city: '鳴門市' },

  // 香川
  { name: '直島温泉 ベネッセハウス', category: 'hotel', prefecture_code: '37', prefecture_name: '香川県', city: '香川郡直島町' },
  { name: 'ANAクラウンプラザホテル高松', category: 'hotel', prefecture_code: '37', prefecture_name: '香川県', city: '高松市' },

  // 愛媛
  { name: '道後温泉 飛鳥乃湯泉', category: 'ryokan', prefecture_code: '38', prefecture_name: '愛媛県', city: '松山市' },
  { name: '道後温泉 ふなや', category: 'ryokan', prefecture_code: '38', prefecture_name: '愛媛県', city: '松山市' },
  { name: '道後温泉 ホテル椿館', category: 'hotel', prefecture_code: '38', prefecture_name: '愛媛県', city: '松山市' },

  // 高知
  { name: '足摺温泉 足摺テルメ', category: 'hotel', prefecture_code: '39', prefecture_name: '高知県', city: '土佐清水市' },
  { name: 'ホテル日航高知 旭ロイヤル', category: 'hotel', prefecture_code: '39', prefecture_name: '高知県', city: '高知市' },

  // 福岡
  { name: 'グランドハイアット福岡', category: 'hotel', prefecture_code: '40', prefecture_name: '福岡県', city: '福岡市' },
  { name: 'ソラリア西鉄ホテル福岡', category: 'hotel', prefecture_code: '40', prefecture_name: '福岡県', city: '福岡市' },
  { name: '二日市温泉 大丸別荘', category: 'ryokan', prefecture_code: '40', prefecture_name: '福岡県', city: '筑紫野市' },
  { name: 'ヒルトン福岡シーホーク', category: 'hotel', prefecture_code: '40', prefecture_name: '福岡県', city: '福岡市' },

  // 佐賀
  { name: '武雄温泉 京都屋旅館', category: 'ryokan', prefecture_code: '41', prefecture_name: '佐賀県', city: '武雄市' },
  { name: 'ガーデンテラス佐賀ホテル＆リゾート', category: 'hotel', prefecture_code: '41', prefecture_name: '佐賀県', city: '佐賀市' },

  // 長崎
  { name: '長崎ホテル清風', category: 'hotel', prefecture_code: '42', prefecture_name: '長崎県', city: '長崎市' },
  { name: '小浜温泉 旅館 橘屋', category: 'ryokan', prefecture_code: '42', prefecture_name: '長崎県', city: '雲仙市' },
  { name: 'ハウステンボスホテルヨーロッパ', category: 'hotel', prefecture_code: '42', prefecture_name: '長崎県', city: '佐世保市' },

  // 熊本
  { name: '阿蘇内牧温泉 はなの湯', category: 'ryokan', prefecture_code: '43', prefecture_name: '熊本県', city: '阿蘇市' },
  { name: '熊本ホテルキャッスル', category: 'hotel', prefecture_code: '43', prefecture_name: '熊本県', city: '熊本市' },
  { name: '人吉温泉 芳野旅館', category: 'ryokan', prefecture_code: '43', prefecture_name: '熊本県', city: '人吉市' },

  // 大分
  { name: '湯布院 山荘 天水', category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '由布市' },
  { name: '鉄輪温泉 陽光荘', category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '別府市' },
  { name: '由布院温泉 ゆふいん花由', category: 'ryokan', prefecture_code: '44', prefecture_name: '大分県', city: '由布市' },

  // 宮崎
  { name: '青島グランドホテル', category: 'hotel', prefecture_code: '45', prefecture_name: '宮崎県', city: '宮崎市' },
  { name: '日南温泉 ホテル海幸園', category: 'hotel', prefecture_code: '45', prefecture_name: '宮崎県', city: '日南市' },

  // 鹿児島
  { name: '霧島温泉 霧島観光ホテル', category: 'hotel', prefecture_code: '46', prefecture_name: '鹿児島県', city: '霧島市' },
  { name: '屋久島温泉 縄文の宿 まんてん', category: 'ryokan', prefecture_code: '46', prefecture_name: '鹿児島県', city: '熊毛郡屋久島町' },
  { name: 'ANAインターコンチネンタル万座ビーチリゾート', category: 'hotel', prefecture_code: '46', prefecture_name: '鹿児島県', city: '薩摩川内市' },

  // 沖縄
  { name: 'ANAインターコンチネンタル石垣リゾート', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '石垣市' },
  { name: 'ハイアット リージェンシー 瀬良垣アイランド 沖縄', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '国頭郡恩納村' },
  { name: 'ホテル日航アリビラ', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '中頭郡読谷村' },
  { name: 'ダブルツリーbyヒルトン那覇首里城', category: 'hotel', prefecture_code: '47', prefecture_name: '沖縄県', city: '那覇市' },
]

const { error } = await supabase.from('facilities').insert(facilities)
if (error) {
  console.error('エラー:', error.message)
} else {
  console.log(`${facilities.length}件 投入完了！`)
}
