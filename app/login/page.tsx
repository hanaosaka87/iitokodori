'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setMessage('')
    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      setMessage('確認メールを送信しました。メールを確認してください。')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError('メールアドレスまたはパスワードが間違っています'); setLoading(false); return }
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌸</div>
          <h1 className="text-xl font-bold text-amber-700">
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">いいとこどり</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="メールアドレス" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="パスワード（6文字以上）" required minLength={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition disabled:opacity-50">
            {loading ? '処理中...' : isSignUp ? 'アカウントを作成' : 'ログイン'}
          </button>
        </form>
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
          className="w-full mt-4 text-sm text-amber-600 hover:underline">
          {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : '新規登録はこちら'}
        </button>
      </div>
    </div>
  )
}
