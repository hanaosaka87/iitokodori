'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS } from '@/lib/types'
import AppFeedbackButtons from '@/app/components/AppFeedbackButtons'

export default function MyStaysPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('reviews')
        .select('*, facilities(name, prefecture_name, category)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setReviews(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  const deleteReview = async (id: string) => {
    if (!confirm('この投稿を削除しますか？')) return
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-700 mb-6">🌸 マイ記録</h1>
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📝</div>
          <p>まだ投稿がありません</p>
          <Link href="/search" className="mt-4 inline-block bg-amber-500 text-white px-6 py-2 rounded-full">
            施設を探して投稿する
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <div className="font-bold text-amber-700">「{r.title}」</div>
                  <Link href={`/facility/${r.facility_id}`}
                    className="text-sm text-gray-600 hover:underline">{r.facilities?.name}</Link>
                </div>
                <button onClick={() => deleteReview(r.id)}
                  className="text-xs text-gray-300 hover:text-red-400 transition shrink-0">削除</button>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {(r.good_tags ?? []).map((tag: string) => {
                  const t = GOOD_TAGS.find(g => g.id === tag)
                  return t ? (
                    <span key={tag} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                      {t.emoji} {t.label}
                    </span>
                  ) : null
                })}
              </div>
              {r.comment && <p className="text-sm text-gray-600 mb-2">{r.comment}</p>}
              <div className="text-xs text-gray-400">
                {r.visited_date && `宿泊日: ${r.visited_date} · `}
                {new Date(r.created_at).toLocaleDateString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 border-t border-amber-100 mt-4">
        <AppFeedbackButtons appName="iitokodori" />
      </div>
    </div>
  )
}
