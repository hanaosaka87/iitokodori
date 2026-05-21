export type Category = 'hotel' | 'ryokan' | 'pension' | 'hostel' | 'other'

export const CATEGORY_LABEL: Record<Category, string> = {
  hotel:   'ホテル',
  ryokan:  '旅館',
  pension: 'ペンション',
  hostel:  'ゲストハウス',
  other:   'その他',
}

export const GOOD_TAGS = [
  { id: 'view',      label: '景色が最高',    emoji: '🏔️' },
  { id: 'food',      label: '料理が美味しい', emoji: '🍽️' },
  { id: 'staff',     label: 'スタッフが親切', emoji: '😊' },
  { id: 'clean',     label: '清潔感がある',   emoji: '✨' },
  { id: 'onsen',     label: '温泉が最高',     emoji: '♨️' },
  { id: 'value',     label: 'コスパ最高',     emoji: '💰' },
  { id: 'location',  label: '立地が便利',     emoji: '📍' },
  { id: 'room',      label: '部屋が広い',     emoji: '🛏️' },
  { id: 'amenity',   label: 'アメニティ充実', emoji: '🧴' },
  { id: 'quiet',     label: '静かで落ち着く', emoji: '🌿' },
  { id: 'design',    label: 'デザインが素敵', emoji: '🎨' },
  { id: 'breakfast', label: '朝食が最高',     emoji: '🌅' },
]

export const PREFECTURE_LIST = [
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

export interface Facility {
  id: string
  name: string
  category: Category
  prefecture_code: string
  prefecture_name: string
  city: string | null
  address: string | null
  official_url: string | null
  thumbnail_url: string | null
  review_count: number
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  facility_id: string
  title: string
  good_tags: string[]
  comment: string | null
  visited_date: string | null
  helpful_count: number
  created_at: string
  profiles?: { display_name: string | null }
  helpful_votes?: { id: string }[]
}
