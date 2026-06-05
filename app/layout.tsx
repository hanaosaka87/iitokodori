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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9871252905587015"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-amber-50 text-gray-800 flex flex-col">
        <AuthHashHandler />
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-amber-100 border-t border-amber-200 text-center text-xs text-amber-600 py-2 px-4 flex gap-4 justify-center flex-wrap">
          <a href="/about" className="hover:text-amber-800">このアプリについて</a>
          <a href="https://hana.trickster.biz/privacy-policy.html" className="hover:text-amber-800">プライバシーポリシー</a>
          <a href="https://hana.trickster.biz/tokushoho.html" className="hover:text-amber-800">特定商取引法</a>
          <span>© 株式会社華</span>
        </footer>
      </body>
    </html>
  )
}
