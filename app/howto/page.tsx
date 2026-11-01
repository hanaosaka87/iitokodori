'use client'
import { useState } from 'react'
import Link from 'next/link'

type TabId = 'user' | 'owner' | 'sponsor' | 'affiliate'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'user',      label: '利用する方',       emoji: '🔍' },
  { id: 'owner',     label: '施設オーナーの方', emoji: '🏨' },
  { id: 'sponsor',   label: 'スポンサーの方',   emoji: '🤝' },
  { id: 'affiliate', label: 'アフィリエイトについて', emoji: '🔗' },
]

export default function HowtoPage() {
  const [tab, setTab] = useState<TabId>('user')

  return (
    <div className="bg-amber-50 text-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-amber-700 mb-2">📖 いいとこどりの使い方</h1>
        <p className="text-gray-500 text-sm mb-6">
          ご利用される立場に合わせて、タブを選んでご覧ください。
        </p>

        {/* タブ */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                tab === t.id ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* 利用する方（消費者） */}
        {tab === 'user' && (
          <div className="space-y-4">
            {[
              { step: '1', title: '施設を探す', desc: '「施設を探す」ページでキーワード・都道府県・カテゴリから宿泊施設を検索できます。都道府県タブからも素早く絞り込めます。' },
              { step: '2', title: '「いいとこ」を読む', desc: '施設ページでは良かった体験談だけが集まっています。写真付きの投稿やみんなが褒めているポイントも確認できます。' },
              { step: '3', title: '宿泊後にレビューを投稿', desc: 'アカウント作成後、一言タイトル・良かったポイント・コメント・ベストショット写真（1枚）を添えて投稿できます。' },
              { step: '4', title: '「参考になった」で応援', desc: '他の人の投稿が参考になったら👍ボタンで応援できます。件数は投稿カードにそのまま表示されます。' },
              { step: '5', title: 'マイ記録・ランキングを楽しむ', desc: '自分の投稿は「マイ記録」でいつでも見返せます。「ランキング」ではレビュー数の多い人気施設もチェックできます。' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 施設オーナーの方へ */}
        {tab === 'owner' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">🏨 自施設をオーナーとして登録する</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                「オーナー登録」ページで自施設を検索し、申請してください。運営者の確認（承認）が完了すると、オーナーダッシュボードが使えるようになります。
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">📝 基本情報を充実させる</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                承認後、オーナーダッシュボードの「基本情報を編集」から、ホームページURL・メイン画像・アピールポイント（最大300文字）を登録できます。お客様が施設を選ぶ際の重要な情報になります。
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">💬 口コミに返信する</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                お客様からの「いいとこ」レビューに、感謝の気持ちや補足情報を返信できます（1件につき1返信）。生の声をサービス改善にも活かせます。
              </p>
            </div>
            <div className="text-center">
              <Link href="/owner" className="inline-block bg-amber-500 text-white font-bold px-6 py-2.5 rounded-full hover:bg-amber-600 transition">
                オーナー登録へ →
              </Link>
            </div>
          </div>
        )}

        {/* スポンサーの方へ */}
        {tab === 'sponsor' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">🤝 スポンサー・広告掲載について</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                「いいとこどり」は旅行・宿泊に関心の高いユーザーが集まるポジティブなレビューアプリです。観光協会・自治体・旅行関連事業者様からの広告掲載・連携のご相談を受け付けております。
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">📩 お問い合わせ方法</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                掲載内容・条件等の詳細は個別にご案内しておりますので、株式会社華の公式サイトよりお問い合わせください。
              </p>
              <a href="https://hana.trickster.biz" target="_blank" rel="noopener noreferrer" className="text-amber-600 text-sm hover:underline inline-block mt-2">
                株式会社華 公式サイト →
              </a>
            </div>
          </div>
        )}

        {/* アフィリエイトについて */}
        {tab === 'affiliate' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">🔗 予約リンクについて</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                施設ページに設置している「じゃらんnet」「楽天トラベル」「JTB」「一休.com」「Yahoo!トラベル」「Agoda」等の予約リンク、レンタカー・アソビューのリンクは、各社とのアフィリエイト提携プログラムによるものです。
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">💰 収益の仕組み</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                これらのリンクを経由してご予約・お申し込みがあった場合、運営に紹介料（アフィリエイト報酬）が発生する場合があります。ユーザー・施設様に追加の費用が発生するものではなく、サービスを無料で提供し続けるための収益源としています。
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">✅ 中立性について</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                アフィリエイト提携の有無が、施設の掲載順位やレビュー内容に影響することはありません。レビューはあくまでユーザーの投稿に基づいています。
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 text-center text-sm pt-8">
          <Link href="/search" className="text-amber-600 hover:underline">← 施設を探す</Link>
        </div>
      </div>
    </div>
  )
}
