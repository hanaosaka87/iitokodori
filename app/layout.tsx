import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import AuthHashHandler from './components/AuthHashHandler'

export const metadata: Metadata = {
  title: 'いいとこどり | 宿泊施設の良かったことだけ集まるレビューアプリ',
  description: 'ホテル・旅館のいいところだけを集めたレビューサイト。マイナス評価なし。旅の良い思い出を共有しよう。',
  openGraph: {
    title: 'いいとこどり',
    description: 'ホテル・旅館のいいところだけを集めたレビューサイト',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-amber-50 text-gray-800">
        <AuthHashHandler />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
