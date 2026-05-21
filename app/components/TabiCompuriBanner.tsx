'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  prefectureCode: string
  prefectureName: string
}

export default function TabiCompuriBanner({ prefectureCode, prefectureName }: Props) {
  const prefNum = parseInt(prefectureCode, 10)
  const base = `https://tabi-compuri.hana.trickster.biz/spots?pref=${prefNum}`
  const [href, setHref] = useState(base)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      setHref(`${base}#access_token=${session.access_token}&refresh_token=${session.refresh_token}&token_type=bearer`)
    })
  }, [base])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 hover:border-emerald-400 transition"
    >
      <span className="text-2xl">🗾</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-emerald-700">旅コンプリで{prefectureName}を制覇しよう</p>
        <p className="text-gray-500 text-xs">観光スポット・温泉・ダムなど制覇マップ</p>
      </div>
      <span className="text-gray-400 text-sm">›</span>
    </a>
  )
}
