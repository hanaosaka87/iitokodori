'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-512.png" alt="" className="w-8 h-8 rounded-lg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-text.png" alt="いいとこどり" className="h-5 w-auto" />
          <span className="text-xs text-amber-500 hidden sm:block">宿泊施設の良かったことだけ</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/search" className="text-gray-600 hover:text-amber-700">施設を探す</Link>
          <Link href="/ranking" className="text-gray-600 hover:text-amber-700">ランキング</Link>
          <Link href="/howto" className="text-gray-600 hover:text-amber-700 hidden sm:block">使い方</Link>
          {user ? (
            <>
              <Link href="/my-stays" className="text-gray-600 hover:text-amber-700">マイ記録</Link>
              <Link href="/owner/dashboard" className="text-gray-600 hover:text-amber-700 hidden sm:block">オーナー</Link>
              <button onClick={signOut} className="text-gray-400 hover:text-gray-600 text-xs">ログアウト</button>
            </>
          ) : (
            <Link href="/login" className="bg-amber-500 text-white px-3 py-1.5 rounded-full hover:bg-amber-600 transition">
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
