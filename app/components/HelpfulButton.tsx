'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Props = {
  reviewId: string
  initialCount: number
}

// テスターフィードバック対応（2026-10-25）：レビューへの「参考になった（いいね）」ボタン
export default function HelpfulButton({ reviewId, initialCount }: Props) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (!uid) return
      const { data: vote } = await supabase
        .from('helpful_votes')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', uid)
        .maybeSingle()
      setVoted(!!vote)
    })
  }, [reviewId])

  const toggle = async () => {
    if (busy) return
    if (!userId) { router.push('/login'); return }
    setBusy(true)
    if (voted) {
      const { error } = await supabase.from('helpful_votes').delete().eq('review_id', reviewId).eq('user_id', userId)
      if (!error) { setVoted(false); setCount(c => Math.max(0, c - 1)) }
    } else {
      const { error } = await supabase.from('helpful_votes').insert({ review_id: reviewId, user_id: userId })
      if (!error) { setVoted(true); setCount(c => c + 1) }
    }
    setBusy(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition disabled:opacity-50 ${
        voted ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'
      }`}
    >
      <span>{voted ? '👍' : '👍🏻'}</span>
      <span>参考になった</span>
      <span className="font-bold">{count}</span>
    </button>
  )
}
