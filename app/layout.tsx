import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from './components/Header'
import AuthHashHandler from './components/AuthHashHandler'
import AdsenseLoader from './components/AdsenseLoader'
import GA4Loader from './components/GA4Loader'
import ServiceWorkerLoader from './components/ServiceWorkerLoader'
import IOSInstallBanner from './components/IOSInstallBanner'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'いいとこどり | 宿泊施設の良かったことだけ集まるレビューアプリ',
  description: '「いいとこ」「良かった！」「また泊まりたい！」が集まる場所。ホテル・旅館・宿泊施設の魅力だけをシェアする、読むたびに旅したくなる新しい口コミ体験。マイナス評価一切なし。',
  openGraph: {
    title: 'いいとこどり',
    description: '読むたびに旅したくなる、新しい口コミ体験。マイナス評価一切なし。',
    locale: 'ja_JP',
    type: 'website',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon-32.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'いいとこどり',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-amber-50 text-gray-800 flex flex-col">
        <ServiceWorkerLoader />
        <AdsenseLoader />
        <GA4Loader />
        <AuthHashHandler />
        <IOSInstallBanner />
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
