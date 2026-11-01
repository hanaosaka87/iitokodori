import Link from 'next/link'
import { notFound } from 'next/navigation'
import iconv from 'iconv-lite'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS, CATEGORY_LABEL, type Category } from '@/lib/types'
import TabiCompuriBanner from '@/app/components/TabiCompuriBanner'
import BackButton from '@/app/components/BackButton'
import HelpfulButton from '@/app/components/HelpfulButton'

// じゃらんはShift-JISエンコードが必要
function encodeShiftJIS(str: string): string {
  const buf = iconv.encode(str, 'Shift_JIS')
  return Array.from(buf).map(b => `%${b.toString(16).toUpperCase().padStart(2, '0')}`).join('')
}

// ===== アフィリエイト予約リンク（施設名キーワード検索） =====
const BOOKING_SITES = [
  {
    name: 'じゃらんnet',
    icon: '🏮',
    color: 'text-orange-600',
    bg: 'bg-orange-50 hover:bg-orange-100',
    border: 'border-orange-200',
    getUrl: (name: string) =>
      `https://px.a8.net/svt/ejp?a8mat=4B3VRA+DOZOY+14CS+6C9LD&a8ejpredirect=${encodeURIComponent(`https://www.jalan.net/uw/uwp2011/uww2011init.do?keyword=${encodeShiftJIS(name)}&isMobileApp=false&isApp=0`)}`,
  },
  {
    name: '楽天トラベル',
    icon: '🦅',
    color: 'text-red-600',
    bg: 'bg-red-50 hover:bg-red-100',
    border: 'border-red-200',
    getUrl: (name: string) =>
      `https://rpx.a8.net/svt/ejp?a8mat=4B3VR9+GC8AGI+2HOM+6I9N5&rakuten=y&a8ejpredirect=${encodeURIComponent(`https://kw.travel.rakuten.co.jp/keyword/Search.do?charset=utf-8&f_query=${encodeURIComponent(name)}&isApp=0`)}`,
  },
  {
    name: 'JTB',
    icon: '✈️',
    color: 'text-blue-600',
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200',
    getUrl: (name: string) =>
      `https://px.a8.net/svt/ejp?a8mat=4B3VRA+RDYLU+15A4+1TIJEP&a8ejpredirect=${encodeURIComponent(`https://www.jtb.co.jp/kokunai-hotel/list/?keyword=${encodeURIComponent(name)}&isApp=0`)}`,
  },
  {
    name: '一休.com',
    icon: '🎎',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 hover:bg-yellow-100',
    border: 'border-yellow-200',
    getUrl: (name: string) =>
      `https://px.a8.net/svt/ejp?a8mat=4B3VRA+UD4MQ+1OK+669JL&a8ejpredirect=${encodeURIComponent(`https://www.ikyu.com/search?discsort=1&kwd=${encodeURIComponent(name)}&ppc=2&rc=1&isApp=0`)}`,
  },
  {
    name: 'Yahoo!トラベル',
    icon: '🔴',
    color: 'text-purple-600',
    bg: 'bg-purple-50 hover:bg-purple-100',
    border: 'border-purple-200',
    getUrl: (name: string) =>
      `https://px.a8.net/svt/ejp?a8mat=4B3VRA+XCANM+4ZCO+60OXE&a8ejpredirect=${encodeURIComponent(`https://travel.yahoo.co.jp/search?discsort=1&kwd=${encodeURIComponent(name)}&ppc=2&rc=1&isApp=0`)}`,
  },
  {
    name: 'Agoda',
    icon: '🌏',
    color: 'text-teal-600',
    bg: 'bg-teal-50 hover:bg-teal-100',
    border: 'border-teal-200',
    getUrl: (name: string) =>
      `https://px.a8.net/svt/ejp?a8mat=4B3YVC+2KA7JM+4X1W+5YRHE&a8ejpredirect=${encodeURIComponent(`https://www.agoda.com/search?q=${encodeURIComponent(name)}&lang=ja-jp&nomobileredirect=1`)}`,
  },
  {
    name: 'ゆこゆこネット',
    icon: '♨️',
    color: 'text-green-600',
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-200',
    getUrl: (name: string) =>
      `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3771667&pid=892622765&vc_url=${encodeURIComponent(`https://www.yukoyuko.net/search/?keyword=${encodeURIComponent(name)}&isApp=0`)}`,
  },
  {
    name: '日本旅行',
    icon: '🗾',
    color: 'text-red-600',
    bg: 'bg-red-50 hover:bg-red-100',
    border: 'border-red-200',
    getUrl: (_name: string) =>
      `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3771667&pid=892622766&vc_url=${encodeURIComponent('https://www.nta.co.jp/yado/ranking/?SITE_ID=44080001&isApp=0')}`,
  },
]

// 投稿後すぐ反映されるよう常に最新データを取得
export const dynamic = 'force-dynamic'

export default async function FacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // reviews と owner_replies を分けて取得（ジョイン失敗でも reviews が消えないように）
  const [{ data: facility }, { data: reviews }, { data: replies }] = await Promise.all([
    supabase.from('facilities').select('*').eq('id', id).single(),
    supabase.from('reviews')
      .select('*, review_photos(storage_url)')
      .eq('facility_id', id)
      .order('created_at', { ascending: false }),
    supabase.from('owner_replies')
      .select('review_id, reply_text, created_at')
      .eq('facility_id', id),
  ])

  // owner_replies を review_id でインデックス化
  const replyMap = Object.fromEntries(
    (replies ?? []).map(r => [r.review_id, r])
  )

  if (!facility) notFound()

  // タグ集計
  const tagCount: Record<string, number> = {}
  for (const r of reviews ?? []) {
    for (const tag of r.good_tags ?? []) {
      tagCount[tag] = (tagCount[tag] ?? 0) + 1
    }
  }
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 6)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BackButton />

      {/* 施設情報 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        {/* 施設の基本情報（オーナー登録画像） */}
        {facility.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={facility.thumbnail_url}
            alt={facility.name}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        )}

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mb-2 inline-block">
              {CATEGORY_LABEL[facility.category as Category] ?? facility.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-800">{facility.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {facility.prefecture_name}{facility.city && ` · ${facility.city}`}
              {facility.address && ` · ${facility.address}`}
            </p>
            {facility.official_url && (
              <a
                href={facility.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 text-sm hover:underline inline-flex items-center gap-1 mt-1"
              >
                🔗 公式サイト
              </a>
            )}
          </div>
          <div className="text-center shrink-0">
            <div className="text-3xl font-bold text-amber-500">{facility.review_count}</div>
            <div className="text-xs text-gray-400">いいとこ</div>
          </div>
        </div>

        {/* 施設からのアピールポイント */}
        {facility.appeal_points && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-amber-700 mb-1">🏨 施設からのアピールポイント</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{facility.appeal_points}</p>
          </div>
        )}

        {/* よく挙がるいいとこ */}
        {topTags.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">みんなが褒めているポイント</p>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tagId, count]) => {
                const t = GOOD_TAGS.find(g => g.id === tagId)
                return t ? (
                  <span key={tagId} className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-3 py-1 rounded-full">
                    {t.emoji} {t.label} <span className="text-amber-400 text-xs">×{count}</span>
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        <Link href={`/review/new/${id}`}
          className="mt-5 w-full block text-center bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition">
          ✏️ いいとこを投稿する
        </Link>

        {/* 旅コンプリ連携バナー */}
        <TabiCompuriBanner
          prefectureCode={facility.prefecture_code}
          prefectureName={facility.prefecture_name}
        />
      </div>

      {/* レンタカー */}
      <a
        href="https://rpx.a8.net/svt/ejp?a8mat=4B3VR9+GC8AGI+2HOM+6I9N5&rakuten=y&a8ejpredirect=https%3A%2F%2Ftravel.rakuten.co.jp%2Fcars%2F"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2 shadow-sm hover:bg-gray-50 transition"
      >
        <span className="text-2xl">🚗</span>
        <div>
          <p className="text-sm font-medium text-gray-700">楽天レンタカー</p>
          <p className="text-gray-400 text-xs">{facility.prefecture_name}のレンタカーを比較・予約</p>
        </div>
        <span className="ml-auto text-gray-400 text-sm">›</span>
      </a>
      <a
        href="https://px.a8.net/svt/ejp?a8mat=4B3YV4+FK8X0Y+2AIA+5ZU29"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-1 shadow-sm hover:bg-gray-50 transition"
      >
        <span className="text-2xl">🚗</span>
        <div>
          <p className="text-sm font-medium text-gray-700">スカイレンタカー</p>
          <p className="text-gray-400 text-xs">{facility.prefecture_name}のレンタカーを比較・予約</p>
        </div>
        <span className="ml-auto text-gray-400 text-sm">›</span>
      </a>
      <p className="text-amber-500 text-xs mb-3 text-center">
        📱 アプリが起動した場合は「ブラウザで開く」を選んでご予約ください
      </p>

      {/* アソビュー */}
      <a
        href={`https://px.a8.net/svt/ejp?a8mat=4B3Y3C+8BH22A+455G+656YP&a8ejpredirect=${encodeURIComponent('https://www.asoview.com/?isApp=0')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-1 shadow-sm hover:bg-green-100 transition"
      >
        <span className="text-2xl">🎡</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-700">アソビューでチケットを予約</p>
          <p className="text-gray-400 text-xs truncate">{facility.name}の体験・入場券を比較</p>
        </div>
        <span className="text-gray-400 text-sm flex-shrink-0">›</span>
      </a>
      <p className="text-amber-500 text-xs mb-3 text-center">
        📱 アプリが起動した場合は「ブラウザで開く」を選んでご予約ください
      </p>

      {/* 宿泊予約リンク */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-gray-500 mb-3">🏷️ この施設を予約・比較する</h2>
        <div className="grid grid-cols-3 gap-2">
          {BOOKING_SITES.map(site => (
            <a
              key={site.name}
              href={site.getUrl(facility.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-1.5 ${site.bg} border ${site.border} rounded-xl px-2 py-3 transition text-center`}
            >
              <span className="text-xl">{site.icon}</span>
              <p className={`text-xs font-bold ${site.color} leading-tight`}>{site.name}</p>
            </a>
          ))}
        </div>
        <p className="text-amber-500 text-xs mt-2 text-center">
          📱 アプリが起動した場合は「ブラウザで開く」を選んでご予約ください
        </p>
        <p className="text-gray-400 text-xs mt-1 text-center">※ 各サービスの外部サイトへ遷移します</p>
      </div>

      {/* レビュー一覧 */}
      <h2 className="text-lg font-bold text-amber-700 mb-4">
        💬 みんなのいいとこ（{reviews?.length ?? 0}件）
      </h2>
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl text-gray-400">
          <div className="text-4xl mb-3">🌱</div>
          <p>まだ「いいとこ」が届いていません。最初の一言を投稿してみましょう！</p>
          <Link href={`/review/new/${id}`}
            className="mt-4 inline-block bg-amber-500 text-white px-6 py-2 rounded-full">
            投稿する
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="font-bold text-amber-700 mb-2 text-lg">「{r.title}」</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {(r.good_tags ?? []).map((tag: string) => {
                  const t = GOOD_TAGS.find(g => g.id === tag)
                  return t ? (
                    <span key={tag} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                      {t.emoji} {t.label}
                    </span>
                  ) : null
                })}
              </div>
              {r.comment && <p className="text-sm text-gray-700 mb-3">{r.comment}</p>}
              {r.review_photos?.[0]?.storage_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.review_photos[0].storage_url}
                  alt="投稿された写真"
                  className="w-full max-h-72 object-cover rounded-xl mb-3"
                />
              )}
              <div className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                <span>👤 匿名</span>
                {r.visited_date && <span>📅 {r.visited_date}</span>}
                <span>{new Date(r.created_at).toLocaleDateString('ja-JP')}</span>
                <span className="ml-auto">
                  <HelpfulButton reviewId={r.id} initialCount={r.helpful_count ?? 0} />
                </span>
              </div>
              {/* オーナー返信 */}
              {replyMap[r.id] && (
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                  <span className="text-base shrink-0">🏨</span>
                  <div>
                    <p className="text-xs font-bold text-amber-700 mb-1">施設からの返信</p>
                    <p className="text-sm text-gray-700">{replyMap[r.id].reply_text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(replyMap[r.id].created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
