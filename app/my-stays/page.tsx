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
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('reviews')
        .select('*, facilities(name, prefecture_name, category), review_photos(storage_url)')
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '削除') return
    setDeleting(true)
    setDeleteError('')
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) throw new Error('認証情報の取得に失敗しました')
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '削除に失敗しました')
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : '削除に失敗しました。もう一度お試しください。')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-700 mb-1">🌸 マイ記録</h1>
      <p className="text-gray-500 text-sm mb-6">あなたが見つけた「いいとこ」を、いつでも振り返れます</p>
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📝</div>
          <p>まだ「いいとこ」の記録がありません</p>
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
              {r.review_photos?.[0]?.storage_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.review_photos[0].storage_url}
                  alt="ベストショット"
                  className="w-full max-h-60 object-cover rounded-xl mb-2"
                />
              )}
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

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setDeleteOpen((v) => !v)}
          className="text-gray-400 hover:text-red-500 text-xs transition"
        >
          ⚠️ アカウントを削除する
        </button>
        {deleteOpen && (
          <div className="mt-3 bg-white border border-red-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">
              アカウントを削除すると、プロフィール・投稿したレビュー・写真・参考になった履歴・施設オーナー登録等、あなたのすべてのデータが削除されます。<strong className="text-red-500">この操作は取り消せません。</strong>
            </p>
            <p className="text-xs text-gray-400 mb-3">削除を実行するには「削除」と入力してください。</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="削除"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:border-red-400"
            />
            {deleteError && <p className="text-red-500 text-xs mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== '削除' || deleting}
                className="bg-red-500 hover:bg-red-400 disabled:bg-gray-300 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
              >
                {deleting ? '削除中...' : 'アカウントを完全に削除する'}
              </button>
              <button
                type="button"
                onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteError('') }}
                className="text-gray-500 hover:text-gray-700 text-sm transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
