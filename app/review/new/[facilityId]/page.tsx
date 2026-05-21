'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS } from '@/lib/types'

export default function NewReviewPage() {
  const router = useRouter()
  const params = useParams()
  const facilityId = params.facilityId as string

  const [facility, setFacility] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [visitedDate, setVisitedDate] = useState('')
  const [checking, setChecking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tabiUrl, setTabiUrl] = useState('')
  const [error, setError] = useState('')
  const [negativeWarning, setNegativeWarning] = useState(false)

  useEffect(() => {
    supabase.from('facilities').select('*').eq('id', facilityId).single()
      .then(({ data }) => setFacility(data))
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
    })
  }, [facilityId, router])

  const toggleTag = (id: string) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const checkAndSubmit = async () => {
    if (!title.trim()) { setError('一言タイトルを入力してください'); return }
    if (selectedTags.length === 0) { setError('良かった点を1つ以上選んでください'); return }
    setError('')
    setNegativeWarning(false)

    // マイナスワード検知
    if (comment.trim()) {
      setChecking(true)
      try {
        const res = await fetch('/api/check-negative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: comment }),
        })
        const { isNegative } = await res.json()
        if (isNegative) {
          setNegativeWarning(true)
          setChecking(false)
          return
        }
      } catch { /* ネットワークエラー時はそのまま続行 */ }
      setChecking(false)
    }

    await submit()
  }

  const submit = async () => {
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('reviews').insert({
      user_id: user?.id,
      facility_id: facilityId,
      title: title.trim(),
      good_tags: selectedTags,
      comment: comment.trim() || null,
      visited_date: visitedDate || null,
    })
    if (err) { setError('投稿に失敗しました。もう一度お試しください。'); setSubmitting(false); return }
    const { data: { session } } = await supabase.auth.getSession()
    const base = `https://tabi-compuri.hana.trickster.biz/spots?pref=${parseInt(facility?.prefecture_code ?? '0', 10)}`
    setTabiUrl(session
      ? `${base}#access_token=${session.access_token}&refresh_token=${session.refresh_token}&token_type=bearer`
      : base
    )
    setSubmitting(false)
    setSubmitted(true)
  }

  if (!facility) return <div className="text-center py-20 text-gray-400">読み込み中...</div>

  if (submitted) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🌸</div>
      <h1 className="text-2xl font-bold text-amber-700 mb-2">投稿ありがとうございます！</h1>
      <p className="text-gray-500 text-sm mb-8">
        「{facility.name}」のいいとこが届きました。<br />
        あなたの口コミが次の旅行者の役に立ちます。
      </p>

      <a
        href={tabiUrl || `https://tabi-compuri.hana.trickster.biz/spots?pref=${parseInt(facility.prefecture_code, 10)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-emerald-600 transition mb-4"
      >
        🗾 旅コンプリで{facility.prefecture_name}のスポットを制覇しよう
      </a>

      <Link href={`/facility/${facilityId}`}
        className="block text-amber-600 hover:underline text-sm">
        施設ページに戻る →
      </Link>
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
              このアプリでは、旅の素敵な思い出だけをシェアしています。
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={checkAndSubmit} disabled={checking || submitting}
          className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition disabled:opacity-50">
          {checking ? '確認中...' : submitting ? '投稿中...' : '🌸 いいとこを投稿する'}
        </button>
      </div>
    </div>
  )
}
