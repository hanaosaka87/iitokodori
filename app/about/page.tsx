import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'いいとこどりについて | 宿泊施設の良かったことだけ集まるレビューアプリ',
  description: 'いいとこどりは、ホテル・旅館のポジティブな体験だけを共有できる宿泊レビューアプリです。マイナス評価なし。旅の良い思い出を集めて、次の旅先選びに役立てましょう。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      <header className="bg-amber-600 shadow-sm px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-white text-sm hover:underline">← トップに戻る</Link>
        <span className="text-xl font-bold text-white">🌸 いいとこどり</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <section className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">いいとこどり</h1>
          <p className="text-gray-600 leading-relaxed">
            ホテル・旅館のポジティブな体験だけを共有するレビューアプリです。<br />
            マイナス評価なし。「ここが良かった！」だけを集めました。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-amber-500 pl-3">このアプリが生まれた理由</h2>
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              一般的な宿泊レビューサイトは、批判的なレビューも多く、読んでいるだけで旅への期待が下がってしまうことがあります。
            </p>
            <p>
              「いいとこどり」は真逆の発想から生まれました。良かったことだけを投稿する。
              それだけで、読む人の旅への期待が膨らみ、投稿する人も良い思い出を振り返れる。
              そんなポジティブな宿泊レビューコミュニティを目指しています。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-amber-500 pl-3">アプリの特徴</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: '✨',
                title: 'ポジティブなレビューだけ',
                desc: 'マイナス評価・不満の投稿はできません。良かったことだけが集まるので、旅の気分が上がります。',
              },
              {
                icon: '🏨',
                title: '201件以上の施設を収録',
                desc: 'ホテル・旅館・民宿・ゲストハウスなど、全国の宿泊施設のレビューを投稿・閲覧できます。',
              },
              {
                icon: '🔍',
                title: '施設検索・絞り込み',
                desc: '地域・施設タイプ・特徴（温泉・朝食・眺望など）で絞り込み検索できます。',
              },
              {
                icon: '⭐',
                title: 'カテゴリ別に良かった点を記録',
                desc: '料理・おもてなし・部屋・温泉・立地などカテゴリ別に「良かった点」を投稿できます。',
              },
              {
                icon: '🏆',
                title: 'ランキング機能',
                desc: 'レビュー数・評価の高い施設がランキング形式で確認できます。次の旅先選びの参考に。',
              },
              {
                icon: '📱',
                title: 'オーナー向けダッシュボード',
                desc: '施設オーナーは自施設のレビューを確認できます。お客様の生の声をサービス改善に活かせます。',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-amber-500 pl-3">使い方</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: '宿泊施設を探す', desc: '地域・施設名で検索するか、ランキングから気になる施設を見つけましょう。' },
              { step: '2', title: 'レビューを読む', desc: '「ここが良かった！」という体験談が集まっています。旅先選びの参考にどうぞ。' },
              { step: '3', title: '宿泊後にレビューを投稿', desc: 'アカウントを作成して、宿泊した感想の「良かったこと」を投稿しましょう。' },
              { step: '4', title: 'お気に入りを保存', desc: '気になる施設をお気に入りに追加して、旅行計画に役立てましょう。' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-amber-500 pl-3">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: '利用料金はかかりますか？', a: '無料でご利用いただけます。' },
              { q: 'マイナスの口コミも書きたい場合は？', a: 'このアプリはポジティブな体験のみを共有するコンセプトです。不満点の投稿はご遠慮ください。一般的なレビューサイトをご利用ください。' },
              { q: '施設を追加したい場合は？', a: '掲載されていない施設はフィードバック機能からご要望をお寄せください。順次追加いたします。' },
              { q: 'オーナーとして自施設を登録するには？', a: 'オーナー申請フォームからお問い合わせください。確認後にオーナーダッシュボードへのアクセスをご案内します。' },
              { q: '不適切な投稿があった場合は？', a: '各投稿の報告機能からご連絡ください。確認後に対応いたします。' },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-bold text-gray-800 mb-1.5">Q. {item.q}</div>
                <div className="text-sm text-gray-600 leading-relaxed">A. {item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">開発者について</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            「いいとこどり」は株式会社華が開発・運営しています。<br />
            旅行を通じた豊かな体験をポジティブに記録・共有できるプラットフォームを目指しています。
          </p>
          <a href="https://hana.trickster.biz" target="_blank" rel="noopener noreferrer" className="text-amber-600 text-sm hover:underline">
            株式会社華 公式サイト →
          </a>
        </section>

        <div className="flex flex-col gap-2 text-center text-sm pb-8">
          <Link href="/" className="text-amber-600 hover:underline">← トップに戻る</Link>
          <a href="https://hana.trickster.biz/privacy-policy.html" className="text-gray-500 hover:underline">プライバシーポリシー</a>
          <a href="https://hana.trickster.biz/tokushoho.html" className="text-gray-500 hover:underline">特定商取引法に基づく表記</a>
        </div>
      </main>
    </div>
  )
}
