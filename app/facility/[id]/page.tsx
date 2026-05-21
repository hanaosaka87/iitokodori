import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS, CATEGORY_LABEL, type Category } from '@/lib/types'
import TabiCompuriBanner from '@/app/components/TabiCompuriBanner'

export default async function FacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: facility }, { data: reviews }] = await Promise.all([
    supabase.from('facilities').select('*').eq('id', id).single(),
    supabase.from('reviews')
      .select('*, profiles(display_name), owner_replies(reply_text, created_at)')
      .eq('facility_id', id)
      .order('created_at', { ascending: false }),
  ])

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
      {/* 施設情報 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
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
          </div>
          <div className="text-center shrink-0">
            <div className="text-3xl font-bold text-amber-500">{facility.review_count}</div>
            <div className="text-xs text-gray-400">いいとこ</div>
          </div>
        </div>

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

      {/* レビュー一覧 */}
      <h2 className="text-lg font-bold text-amber-700 mb-4">
        💬 みんなのいいとこ（{reviews?.length ?? 0}件）
      </h2>
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl text-gray-400">
          <div className="text-4xl mb-3">🌱</div>
          <p>まだレビューがありません。最初に投稿してみましょう！</p>
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
              <div className="text-xs text-gray-400 flex gap-3">
                <span>👤 {r.profiles?.display_name ?? '匿名'}</span>
                {r.visited_date && <span>📅 {r.visited_date}</span>}
                <span>{new Date(r.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              {/* オーナー返信 */}
              {r.owner_replies?.[0] && (
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                  <span className="text-base shrink-0">🏨</span>
                  <div>
                    <p className="text-xs font-bold text-amber-700 mb-1">施設からの返信</p>
                    <p className="text-sm text-gray-700">{r.owner_replies[0].reply_text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(r.owner_replies[0].created_at).toLocaleDateString('ja-JP')}
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
