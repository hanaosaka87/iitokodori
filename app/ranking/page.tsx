import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { CATEGORY_LABEL, type Category } from '@/lib/types'

export default async function RankingPage() {
  const { data: facilities } = await supabase
    .from('facilities')
    .select('*')
    .order('review_count', { ascending: false })
    .gt('review_count', 0)
    .limit(500)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-700 mb-2">🏆 いいとこランキング</h1>
      <p className="text-sm text-gray-500 mb-8">「また泊まりたい！」の声が集まる施設、最大500件をご紹介</p>

      {!facilities || facilities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🌱</div>
          <p>まだランキングデータがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {facilities.map((f, i) => (
            <Link key={f.id} href={`/facility/${f.id}`}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
              <div className={`text-2xl font-bold w-10 text-center shrink-0 ${
                i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-gray-300'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{f.name}</div>
                <div className="text-xs text-gray-500">
                  {f.prefecture_name} · {CATEGORY_LABEL[f.category as Category] ?? f.category}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-amber-500">{f.review_count}</div>
                <div className="text-xs text-gray-400">いいとこ</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
