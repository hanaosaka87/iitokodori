-- いいとこどり 施設初期データ（実在施設サンプル）
INSERT INTO facilities (name, category, prefecture_code, prefecture_name, city, address, official_url) VALUES

-- 北海道
('定山渓温泉 章月グランドホテル', 'ryokan', '01', '北海道', '札幌市', '北海道札幌市南区定山渓温泉西4', 'https://www.shogetu.com'),
('ニセコグランドホテル', 'hotel', '01', '北海道', '虻田郡ニセコ町', '北海道虻田郡ニセコ町字湯本342', 'https://www.nisekogrand.com'),

-- 青森
('古牧温泉 渋川温泉旅館', 'ryokan', '02', '青森県', '三沢市', '青森県三沢市古間木山56', null),
('青森屋', 'ryokan', '02', '青森県', '三沢市', '青森県三沢市古間木山56', 'https://www.hoshinoresorts.com/resortsandhotels/aomoriya'),

-- 岩手
('つなぎ温泉 ホテル紫苑', 'ryokan', '03', '岩手県', '盛岡市', '岩手県盛岡市繋字湯の館', null),

-- 宮城
('仙台国際ホテル', 'hotel', '04', '宮城県', '仙台市', '宮城県仙台市青葉区中央4-6-1', 'https://www.sih.co.jp'),
('鳴子温泉 旅館すがわら', 'ryokan', '04', '宮城県', '大崎市', '宮城県大崎市鳴子温泉湯元', null),

-- 秋田
('乳頭温泉郷 鶴の湯温泉', 'ryokan', '05', '秋田県', '仙北市', '秋田県仙北市田沢湖田沢字先達沢国有林', 'https://www.tsurunoyu.com'),

-- 山形
('蔵王温泉 深山荘高見屋', 'ryokan', '06', '山形県', '山形市', '山形県山形市蔵王温泉54', 'https://www.takamiya.co.jp'),

-- 福島
('磐梯熱海温泉 ホテル華の湯', 'ryokan', '07', '福島県', '郡山市', '福島県郡山市熱海町熱海5', 'https://www.hananoyuhotel.com'),

-- 茨城
('袋田温泉 思い出浪漫館', 'ryokan', '08', '茨城県', '久慈郡大子町', '茨城県久慈郡大子町大字袋田835', null),

-- 栃木
('日光金谷ホテル', 'hotel', '09', '栃木県', '日光市', '栃木県日光市上鉢石町1300', 'https://www.kanayahotel.co.jp/nkk'),
('奥日光湯本温泉 ゆの森', 'ryokan', '09', '栃木県', '日光市', '栃木県日光市湯元2549-3', 'https://www.yunomori.jp'),

-- 群馬
('草津温泉 ホテル一井', 'hotel', '10', '群馬県', '吾妻郡草津町', '群馬県吾妻郡草津町草津396', 'https://www.hotel-ichii.co.jp'),
('伊香保温泉 石段の湯', 'ryokan', '10', '群馬県', '渋川市', '群馬県渋川市伊香保町伊香保', null),

-- 埼玉
('ラビスタ大宮', 'hotel', '11', '埼玉県', 'さいたま市', '埼玉県さいたま市中央区新都心2-4', 'https://www.hotespa.net/hotels/omiya'),

-- 千葉
('ホテル三日月 龍宮城スパ木更津', 'hotel', '12', '千葉県', '木更津市', '千葉県木更津市潮見2-2', 'https://www.mikazuki.co.jp/kisarazu'),
('鴨川シーワールドホテル', 'hotel', '12', '千葉県', '鴨川市', '千葉県鴨川市東町1464-18', 'https://www.kamogawa-seaworld.jp/hotel'),

-- 東京
('ホテルニューオータニ東京', 'hotel', '13', '東京都', '千代田区', '東京都千代田区紀尾井町4-1', 'https://www.newotani.co.jp/tokyo'),
('帝国ホテル東京', 'hotel', '13', '東京都', '千代田区', '東京都千代田区内幸町1-1-1', 'https://www.imperialhotel.co.jp/j/tokyo'),
('ザ・リッツ・カールトン東京', 'hotel', '13', '東京都', '港区', '東京都港区赤坂9-7-1', 'https://www.ritzcarlton.com/jp/hotels/tokyo'),

-- 神奈川
('箱根強羅 白檀', 'ryokan', '14', '神奈川県', '足柄下郡箱根町', '神奈川県足柄下郡箱根町強羅1320-862', 'https://www.hakone-hakudan.com'),
('横浜ロイヤルパークホテル', 'hotel', '14', '神奈川県', '横浜市', '神奈川県横浜市西区みなとみらい2-2-1-3', 'https://www.yrph.com'),

-- 新潟
('越後湯沢温泉 HATAGO井仙', 'ryokan', '15', '新潟県', '南魚沼郡湯沢町', '新潟県南魚沼郡湯沢町湯沢2455', 'https://www.isen.co.jp'),

-- 富山
('富山エクセルホテル東急', 'hotel', '16', '富山県', '富山市', '富山県富山市桜町1-2-3', 'https://www.toyama-e.tokyuhotels.jp'),

-- 石川
('加賀屋', 'ryokan', '17', '石川県', '七尾市', '石川県七尾市和倉町ヨ部80', 'https://www.kagaya.co.jp'),
('金沢白鳥路 ホテル山楽', 'hotel', '17', '石川県', '金沢市', '石川県金沢市本多町3-1-35', 'https://www.shiratoroji.com'),

-- 福井
('あわら温泉 まつや千千', 'ryokan', '18', '福井県', 'あわら市', '福井県あわら市温泉3-601', 'https://www.matsuya-senzen.com'),

-- 山梨
('河口湖温泉 富士レークホテル', 'hotel', '19', '山梨県', '富士河口湖町', '山梨県南都留郡富士河口湖町浅川70', 'https://www.fujilakehotel.com'),

-- 長野
('湯田中渋温泉郷 よろづや', 'ryokan', '20', '長野県', '下高井郡山ノ内町', '長野県下高井郡山ノ内町平穏2563', 'https://yoroduya.com'),
('星野リゾート 界 松本', 'ryokan', '20', '長野県', '松本市', '長野県松本市浅間温泉3-27-7', 'https://www.hoshinoresorts.com/resortsandhotels/kaimatsumoto'),

-- 岐阜
('下呂温泉 湯之島館', 'ryokan', '21', '岐阜県', '下呂市', '岐阜県下呂市湯之島645', 'https://www.yunoshimakan.co.jp'),

-- 静岡
('熱海温泉 ホテルニューアカオ', 'hotel', '22', '静岡県', '熱海市', '静岡県熱海市熱海1993-250', 'https://www.newakao.co.jp'),
('修善寺温泉 あさば', 'ryokan', '22', '静岡県', '伊豆市', '静岡県伊豆市修善寺3450-1', 'https://www.asaba-ryokan.com'),

-- 愛知
('名古屋マリオットアソシアホテル', 'hotel', '23', '愛知県', '名古屋市', '愛知県名古屋市中村区名駅1-1-4', 'https://www.associahotels.com/marriott'),

-- 三重
('賢島宝生苑', 'ryokan', '24', '三重県', '志摩市', '三重県志摩市阿児町神明731-1', 'https://www.houshouen.co.jp'),
('湯元 榊原舘', 'ryokan', '24', '三重県', '津市', '三重県津市榊原町5357', null),

-- 滋賀
('琵琶湖ホテル', 'hotel', '25', '滋賀県', '大津市', '滋賀県大津市浜町2-40', 'https://www.biwako-hotel.co.jp'),

-- 京都
('俵屋旅館', 'ryokan', '26', '京都府', '京都市', '京都府京都市中京区麩屋町通御池上ル', 'https://www.tawaraya-kyoto.com'),
('ザ・リッツ・カールトン京都', 'hotel', '26', '京都府', '京都市', '京都府京都市中京区鴨川二条大橋畔', 'https://www.ritzcarlton.com/jp/hotels/kyoto'),
('星野リゾート 界 京都', 'ryokan', '26', '京都府', '京都市', '京都府京都市西京区大原野南春日町1102-4', 'https://www.hoshinoresorts.com/resortsandhotels/kaikyoto'),

-- 大阪
('大阪マリオット都ホテル', 'hotel', '27', '大阪府', '大阪市', '大阪府大阪市阿倍野区阿倍野筋1-1-43', 'https://www.osakamarriottmiyakohotel.com'),
('ホテルニューオータニ大阪', 'hotel', '27', '大阪府', '大阪市', '大阪府大阪市中央区城見1-4-1', 'https://www.newotani.co.jp/osaka'),
('コンラッド大阪', 'hotel', '27', '大阪府', '大阪市', '大阪府大阪市北区中之島5-3-60', 'https://www.hilton.com/ja/hotels/osacdci-conrad-osaka'),

-- 兵庫
('有馬温泉 御所坊', 'ryokan', '28', '兵庫県', '神戸市', '兵庫県神戸市北区有馬町858', 'https://www.goshobo.co.jp'),
('城崎温泉 三木屋', 'ryokan', '28', '兵庫県', '豊岡市', '兵庫県豊岡市城崎町湯島108', 'https://www.mikiya.jp'),

-- 奈良
('奈良ホテル', 'hotel', '29', '奈良県', '奈良市', '奈良県奈良市高畑町1096', 'https://www.narahotel.co.jp'),

-- 和歌山
('白良荘グランドホテル', 'hotel', '30', '和歌山県', '西牟婁郡白浜町', '和歌山県西牟婁郡白浜町864', 'https://www.shirasousou.com'),
('川湯温泉 富士屋', 'ryokan', '30', '和歌山県', '田辺市', '和歌山県田辺市本宮町川湯13', null),

-- 鳥取
('鳥取温泉 ホテルモナーク鳥取', 'hotel', '31', '鳥取県', '鳥取市', '鳥取県鳥取市永楽温泉町474', 'https://monarch-tottori.com'),

-- 島根
('玉造温泉 ホテル玉泉', 'ryokan', '32', '島根県', '松江市', '島根県松江市玉湯町玉造1237', 'https://www.gyokusen.com'),

-- 岡山
('奥津温泉 奥津荘', 'ryokan', '33', '岡山県', '苫田郡鏡野町', '岡山県苫田郡鏡野町奥津川西', null),

-- 広島
('グランドプリンスホテル広島', 'hotel', '34', '広島県', '広島市', '広島県広島市南区元宇品町23-1', 'https://www.princehotels.co.jp/grandprincehotel-hiroshima'),

-- 山口
('長門湯本温泉 大谷山荘', 'ryokan', '35', '山口県', '長門市', '山口県長門市深川湯本2208', 'https://www.otanisanso.co.jp'),

-- 徳島
('祖谷温泉 ホテル祖谷温泉', 'hotel', '36', '徳島県', '三好市', '徳島県三好市池田町松尾松本367-28', 'https://www.iyaonsen.co.jp'),

-- 香川
('琴平グランドホテル 桜の抄', 'hotel', '37', '香川県', '仲多度郡琴平町', '香川県仲多度郡琴平町685-11', 'https://www.kotohira-grand.jp/sakura'),

-- 愛媛
('道後温泉 大和屋本店', 'ryokan', '38', '愛媛県', '松山市', '愛媛県松山市道後湯之町20-8', 'https://www.yamatoya.co.jp'),

-- 高知
('土佐御苑', 'ryokan', '39', '高知県', '高知市', '高知県高知市鷹匠町1-3-35', 'https://www.tosagoen.co.jp'),

-- 福岡
('ANAインターコンチネンタルホテル福岡', 'hotel', '40', '福岡県', '福岡市', '福岡県福岡市中央区大名2-6-60', null),
('原鶴温泉 泰泉閣', 'ryokan', '40', '福岡県', '朝倉市', '福岡県朝倉市杷木古賀1786', 'https://www.taisenkan.com'),

-- 佐賀
('嬉野温泉 大正屋', 'ryokan', '41', '佐賀県', '嬉野市', '佐賀県嬉野市嬉野町大字下宿甲4224', 'https://www.taishoya.com'),

-- 長崎
('雲仙温泉 九州ホテル', 'hotel', '42', '長崎県', '雲仙市', '長崎県雲仙市小浜町雲仙320', 'https://www.kyushuhotel.co.jp'),

-- 熊本
('黒川温泉 奥の湯', 'ryokan', '43', '熊本県', '阿蘇郡南小国町', '熊本県阿蘇郡南小国町満願寺6542-3', 'https://www.okunoyu.com'),

-- 大分
('由布院温泉 亀の井別荘', 'ryokan', '44', '大分県', '由布市', '大分県由布市湯布院町川上2633-1', 'https://www.kamenoi-bessou.jp'),
('別府温泉 杉乃井ホテル', 'hotel', '44', '大分県', '別府市', '大分県別府市観海寺1', 'https://www.suginoi-hotel.com'),

-- 宮崎
('フェニックス・シーガイア・リゾート', 'hotel', '45', '宮崎県', '宮崎市', '宮崎県宮崎市山崎町浜山', 'https://www.seagaia.co.jp'),

-- 鹿児島
('指宿温泉 指宿白水館', 'ryokan', '46', '鹿児島県', '指宿市', '鹿児島県指宿市東方12126-12', 'https://www.hakusuikan.co.jp'),

-- 沖縄
('ザ・ブセナテラス', 'hotel', '47', '沖縄県', '名護市', '沖縄県名護市喜瀬1808', 'https://www.terrace.co.jp/busena'),
('星野リゾート リゾナーレ小浜島', 'hotel', '47', '沖縄県', '八重山郡竹富町', '沖縄県八重山郡竹富町小浜東表2954', 'https://www.hoshinoresorts.com/resortsandhotels/risonarekohama'),
('沖縄残波岬ロイヤルホテル', 'hotel', '47', '沖縄県', '中頭郡読谷村', '沖縄県中頭郡読谷村字宇座1575', 'https://www.zanpa.co.jp');
