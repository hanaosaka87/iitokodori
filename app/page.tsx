import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { GOOD_TAGS, CATEGORY_LABEL, type Category } from '@/lib/types'
import AppFeedbackButtons from './components/AppFeedbackButtons'

async function getRecentReviews() {
  const { data } = await supabase
    .from('reviews')
    .select('*, facilities(name, prefecture_name, category)')
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

async function getTopFacilities() {
  const { data } = await supabase
    .from('facilities')
    .select('*')
    .order('review_count', { ascending: false })
    .limit(4)
  return data ?? []
}

export default async function TopPage() {
  const [recentReviews, topFacilities] = await Promise.all([
    getRecentReviews(),
    getTopFacilities(),
  ])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 from-0% via-orange-400 via-35% to-yellow-300 to-100% text-white py-14 sm:py-20 px-4">
        {/* 装飾グロー */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-10 sm:gap-12">
          {/* アートワーク */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-white/30 rounded-[2.5rem] blur-2xl scale-95" />
            <Image
              src="/hero-iitokodori.png"
              alt="いいとこどり 温泉旅情"
              width={640}
              height={640}
              priority
              className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-[2rem] shadow-2xl ring-4 ring-white/40"
            />
          </div>

          {/* テキスト */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-snug">
              「いいとこ」「良かった！」<br />「また泊まりたい！」が集まる場所。
            </h1>
            <p className="text-pink-50 text-lg mb-8">
              ホテル・旅館・宿泊施設の魅力だけをシェアするレビューアプリ。<br />
              読むたびに旅したくなる、新しい口コミ体験。マイナス評価一切なし。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start mb-4">
              <Link href="/search"
                className="bg-white text-rose-600 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition shadow-lg">
                施設を探す 🔍
              </Link>
              <Link href="/search"
                className="bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold px-8 py-3 rounded-full hover:from-pink-700 hover:to-orange-600 transition shadow-lg border border-white/30">
                レビューを書く ✏️
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Link href="/my-stays"
                className="bg-white/15 text-white border border-white/40 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-white/25 transition">
                🌸 マイページ（マイ記録）
              </Link>
              <Link href="/howto"
                className="bg-white/15 text-white border border-white/40 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-white/25 transition">
                📖 使い方
              </Link>
              <Link href="/owner"
                className="bg-white/15 text-white border border-white/40 px-5 py-1.5 rounded-full text-sm font-medium hover:bg-white/25 transition">
                🏨 オーナー様
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* コンセプト */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-amber-700 mb-8">いいとこどりの3つの約束</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: '😊', title: 'マイナスなし', desc: '批判・クレームは一切なし。「いいとこ」だけが集まります' },
            { emoji: '🏨', title: '施設も喜ぶ', desc: 'ネガティブ口コミに怯えず、「また泊まりたい」の声だけが積み上がります' },
            { emoji: '✈️', title: '旅したくなる', desc: '読むたびに行きたくなる口コミだけ。次の旅の背中を押してくれます' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-lg text-amber-700 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 人気の施設 */}
      {topFacilities.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-amber-700">🏆 「また泊まりたい」が多い施設</h2>
            <Link href="/search" className="text-amber-600 text-sm hover:underline">もっと見る →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topFacilities.map((f: any) => (
              <Link key={f.id} href={`/facility/${f.id}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-2">🏨</div>
                <div className="font-bold text-sm mb-1 line-clamp-2">{f.name}</div>
                <div className="text-xs text-gray-500">
                  {f.prefecture_name} · {CATEGORY_LABEL[f.category as Category] ?? f.category}
                </div>
                <div className="text-xs text-amber-600 mt-2">💬 {f.review_count}件のいいとこ</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 連携バナー */}
      <section className="max-w-5xl mx-auto px-4 pb-8 flex flex-col gap-3">
        <a
          href="https://tabi-compuri.hana.trickster.biz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 hover:border-emerald-400 transition shadow-sm"
        >
          <span className="text-3xl flex-shrink-0">🗾</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-700">旅コンプリで旅行を「制覇」しよう</p>
            <p className="text-gray-500 text-xs mt-0.5">全国の温泉・お城・道の駅など9,000件以上のスポットを制覇するゲーム感覚の旅行アプリ</p>
          </div>
          <span className="text-gray-400 text-sm flex-shrink-0">›</span>
        </a>
        <a
          href="https://hanabimaturi.hana.trickster.biz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 hover:border-orange-400 transition shadow-sm"
        >
          <span className="text-3xl flex-shrink-0">🎆</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-orange-700">はなびまつりで花火大会・お祭りを探そう</p>
            <p className="text-gray-500 text-xs mt-0.5">全国763件の花火大会・152件のお祭り。みどころ・穴場スポット・近くのトイレも1画面で</p>
          </div>
          <span className="text-gray-400 text-sm flex-shrink-0">›</span>
        </a>
      </section>

      {/* 最新レビュー */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-amber-700">✨ 読むたびに旅したくなる、最新のいいとこ</h2>
        </div>
        {recentReviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🌱</div>
            <p>まだ「いいとこ」がありません。最初の一言を投稿してみましょう！</p>
            <Link href="/search" className="mt-4 inline-block bg-amber-500 text-white px-6 py-2 rounded-full">
              最初に投稿する
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentReviews.map((r: any) => (
              <Link key={r.id} href={`/facility/${r.facility_id}`}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <div className="font-bold text-amber-700 mb-1 line-clamp-1">「{r.title}」</div>
                <div className="text-sm text-gray-700 mb-3 line-clamp-2">{r.facilities?.name}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(r.good_tags ?? []).slice(0, 3).map((tag: string) => {
                    const t = GOOD_TAGS.find(g => g.id === tag)
                    return t ? (
                      <span key={tag} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                        {t.emoji} {t.label}
                      </span>
                    ) : null
                  })}
                </div>
                <div className="text-xs text-gray-400">{'匿名'} · {r.facilities?.prefecture_name}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* フッター */}
      <footer className="text-center text-gray-400 text-sm py-8 border-t border-amber-100 space-y-3 bg-white">
        <div className="flex items-center justify-center gap-4">
          <a href="https://hana.trickster.biz/privacy-policy.html" className="hover:text-gray-600 transition">プライバシーポリシー</a>
        </div>
        <AppFeedbackButtons appName="iitokodori" />
        <p>© 2026 いいとこどり by 株式会社華</p>
      </footer>
    </div>
  )
}
