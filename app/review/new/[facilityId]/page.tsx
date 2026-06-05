'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS } from '@/lib/types'

export default function NewReviewPage() {
  const router = useRouter()
  const params = useParams()
  const facilityId = params.facilityId as string

  const [facility, setFacility]         = useState<any>(null)
  const [userId, setUserId]             = useState<string | null>(null)
  const [authChecked, setAuthChecked]   = useState(false)
  const [title, setTitle]               = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment]           = useState('')
  const [visitedDate, setVisitedDate]   = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const [error, setError]               = useState('')
  const [negativeWarning, setNegativeWarning] = useState(false)

  useEffect(() => {
    const init = async () => {
      const [{ data: fac }, { data: { user } }] = await Promise.all([
        supabase.from('facilities').select('*').eq('id', facilityId).single(),
        supabase.auth.getUser(),
      ])
      setFacility(fac)
      setUserId(user?.id ?? null)
      setAuthChecked(true)
    }
    init()
  }, [facilityId])

  const toggleTag = (id: string) =>
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])

  const handleSubmit = async () => {
    if (!title.trim())          { setError('一言タイトルを入力してください'); return }
    if (selectedTags.length === 0) { setError('良かった点を1つ以上選んでください'); return }
    if (!userId)                { setError('ログインが必要です'); return }
    setError('')
    setNegativeWarning(false)

    // マイナスワード検知（失敗しても投稿は続行）
    if (comment.trim()) {
      try {
        const res = await fetch('/api/check-negative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: comment }),
        })
        if (res.ok) {
          const { isNegative } = await res.json()
          if (isNegative) { setNegativeWarning(true); return }
        }
      } catch { /* API失敗時はそのまま続行 */ }
    }

    setSubmitting(true)
    const { error: err } = await supabase.from('reviews').insert({
      user_id:      userId,
      facility_id:  facilityId,
      title:        title.trim(),
      good_tags:    selectedTags,
      comment:      comment.trim() || null,
      visited_date: visitedDate || null,
    })

    if (err) {
      setError(`投稿エラー: ${err.message} [${err.code}]`)
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => { window.location.href = `/facility/${facilityId}` }, 3000)
  }

  // 読み込み中
  if (!authChecked || !facility) {
    return <div className="text-center py-20 text-gray-400">読み込み中...</div>
  }

  // 未ログイン
  if (!userId) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🔐</div>
      <h1 className="text-xl font-bold text-gray-700 mb-2">ログインが必要です</h1>
      <p className="text-gray-500 text-sm mb-6">
        「{facility?.name}」にいいとこを投稿するにはログインしてください。
      </p>
      <button
        onClick={() => {
          // ログイン後にこのページに戻れるようにURLを保存
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
          router.push('/login')
        }}
        className="bg-amber-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-amber-600 transition"
      >
        ログインする
      </button>
    </div>
  )

  // 投稿完了
  if (submitted) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🌸</div>
      <h1 className="text-2xl font-bold text-amber-700 mb-2">投稿ありがとうございます！</h1>
      <p className="text-gray-500 text-sm mb-8">
        「{facility.name}」のいいとこが届きました。<br />
        3秒後に施設ページへ移動します。
      </p>
      <button
        onClick={() => { window.location.href = `/facility/${facilityId}` }}
        className="block w-full text-amber-600 hover:underline text-sm"
      >
        すぐに施設ページへ →
      </button>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-700 mb-1">✏️ いいとこを投稿</h1>
      <p className="text-gray-500 text-sm mb-6">{facility.name}</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

        {/* 一言タイトル */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            一言で表すと？ <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="例：景色が最高でした！"
            maxLength={50}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {/* 良かった点タグ */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            良かったポイント <span className="text-red-400">*</span>（複数選択OK）
          </label>
          <div className="flex flex-wrap gap-2">
            {GOOD_TAGS.map(tag => (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition border ${
                  selectedTags.includes(tag.id)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                }`}>
                {tag.emoji} {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* コメント */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            もっと詳しく教えてください（任意）
          </label>
          <textarea
            value={comment}
            onChange={e => { setComment(e.target.value); setNegativeWarning(false) }}
            placeholder="良かった体験を自由に書いてください"
            rows={4}
            maxLength={500}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
          />
          {negativeWarning && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              😊 <strong>良かったことだけ</strong>を教えてください。<br />
              コメントを修正するか、コメントなしで投稿してください。
            </div>
          )}
        </div>

        {/* 宿泊日 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">宿泊日（任意）</label>
          <input type="date" value={visitedDate} onChange={e => setVisitedDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition disabled:opacity-50">
          {submitting ? '投稿中...' : '🌸 いいとこを投稿する'}
        </button>
      </div>
    </div>
  )
}
