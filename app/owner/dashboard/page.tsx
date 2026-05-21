'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS, CATEGORY_LABEL, type Category } from '@/lib/types'

type OwnedFacility = {
  id: string
  name: string
  category: Category
  prefecture_name: string
  review_count: number
}

type Review = {
  id: string
  title: string
  good_tags: string[]
  comment: string | null
  visited_date: string | null
  created_at: string
  profiles: { display_name: string | null } | null
  owner_replies: { id: string; reply_text: string; created_at: string }[]
}

export default function OwnerDashboardPage() {
  const router = useRouter()
  const [userId, setUserId]               = useState<string | null>(null)
  const [facilities, setFacilities]       = useState<OwnedFacility[]>([])
  const [selectedId, setSelectedId]       = useState<string | null>(null)
  const [reviews, setReviews]             = useState<Review[]>([])
  const [replyText, setReplyText]         = useState<Record<string, string>>({})
  const [submitting, setSubmitting]       = useState<string | null>(null)
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)

      const { data: owned } = await supabase
        .from('facility_owners')
        .select('facility_id, facilities(id, name, category, prefecture_name, review_count)')
        .eq('user_id', data.user.id)

      if (owned && owned.length > 0) {
        const list = owned.map((o: any) => o.facilities).filter(Boolean)
        setFacilities(list)
        setSelectedId(list[0]?.id ?? null)
      }
    })
  }, [router])

  useEffect(() => {
    if (!selectedId) return
    const load = async () => {
      setLoadingReviews(true)
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles(display_name), owner_replies(id, reply_text, created_at)')
        .eq('facility_id', selectedId)
        .order('created_at', { ascending: false })
      setReviews((data as Review[]) ?? [])
      setLoadingReviews(false)
    }
    load()
  }, [selectedId])

  const submitReply = async (reviewId: string) => {
    if (!userId || !selectedId) return
    const text = replyText[reviewId]?.trim()
    if (!text) return
    setSubmitting(reviewId)
    const { error } = await supabase.from('owner_replies').insert({
      review_id: reviewId,
      facility_id: selectedId,
      user_id: userId,
      reply_text: text,
    })
    if (!error) {
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, owner_replies: [{ id: crypto.randomUUID(), reply_text: text, created_at: new Date().toISOString() }] }
          : r
      ))
      setReplyText(prev => { const n = { ...prev }; delete n[reviewId]; return n })
    }
    setSubmitting(null)
  }

  const deleteReply = async (reviewId: string, replyId: string) => {
    if (!confirm('返信を削除しますか？')) return
    await supabase.from('owner_replies').delete().eq('id', replyId)
    setReviews(prev => prev.map(r =>
      r.id === reviewId ? { ...r, owner_replies: [] } : r
    ))
  }

  const selectedFacility = facilities.find(f => f.id === selectedId)

  if (!userId) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  if (facilities.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🏨</div>
      <h1 className="text-xl font-bold text-gray-700 mb-2">施設が登録されていません</h1>
      <p className="text-gray-500 text-sm mb-6">まずオーナー登録から始めてください。</p>
      <Link href="/owner"
        className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition">
        オーナー登録へ →
      </Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-amber-700">🏨 オーナーダッシュボード</h1>
        <Link href="/owner" className="text-sm text-amber-600 hover:underline">+ 施設を追加</Link>
      </div>

      {/* 施設切り替えタブ */}
      {facilities.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {facilities.map(f => (
            <button key={f.id} onClick={() => setSelectedId(f.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition border ${
                selectedId === f.id
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
              }`}>
              {f.name}
            </button>
          ))}
        </div>
      )}

      {/* 施設サマリー */}
      {selectedFacility && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-amber-600 mb-1">
                {CATEGORY_LABEL[selectedFacility.category as Category] ?? selectedFacility.category}
                {' · '}{selectedFacility.prefecture_name}
              </p>
              <h2 className="text-xl font-bold text-gray-800">{selectedFacility.name}</h2>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">{selectedFacility.review_count}</div>
              <div className="text-xs text-gray-500">いいとこ</div>
            </div>
          </div>
          <Link href={`/facility/${selectedFacility.id}`}
            className="mt-3 inline-block text-xs text-amber-600 hover:underline">
            施設ページを見る →
          </Link>
        </div>
      )}

      {/* 口コミ一覧 */}
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        💬 口コミ一覧（{reviews.length}件）
      </h2>

      {loadingReviews ? (
        <div className="text-center py-12 text-gray-400">読み込み中...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🌱</div>
          <p>まだ口コミがありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* 口コミ本文 */}
              <div className="p-5">
                <div className="font-bold text-amber-700 text-lg mb-2">「{r.title}」</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(r.good_tags ?? []).map(tag => {
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
              </div>

              {/* オーナー返信エリア */}
              <div className="border-t border-gray-100 bg-amber-50/60 p-4">
                {r.owner_replies?.length > 0 ? (
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">🏨</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-amber-700 mb-1">施設からの返信</p>
                        <p className="text-sm text-gray-700">{r.owner_replies[0].reply_text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(r.owner_replies[0].created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteReply(r.id, r.owner_replies[0].id)}
                        className="text-xs text-gray-300 hover:text-red-400 transition shrink-0">
                        削除
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">🏨 この口コミに返信する</p>
                    <textarea
                      value={replyText[r.id] ?? ''}
                      onChange={e => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))}
                      placeholder="感謝の気持ちや補足情報を伝えましょう（最大1000文字）"
                      rows={3}
                      maxLength={1000}
                      className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none bg-white"
                    />
                    <button
                      onClick={() => submitReply(r.id)}
                      disabled={!replyText[r.id]?.trim() || submitting === r.id}
                      className="mt-2 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition disabled:opacity-40"
                    >
                      {submitting === r.id ? '送信中...' : '返信を投稿する'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
