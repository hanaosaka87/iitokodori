'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="text-gray-500 hover:text-amber-700 transition text-sm mb-3 inline-flex items-center gap-1"
    >
      ← 戻る
    </button>
  )
}
