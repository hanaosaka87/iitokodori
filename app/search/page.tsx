'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PREFECTURE_LIST, CATEGORY_LABEL, type Category, type Facility } from '@/lib/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQ    = searchParams.get('q')    ?? ''
  const initialPref = searchParams.get('pref') ?? ''

  const [facilities, setFacilities] = useState<Facility[]>([])
  const [prefecture, setPrefecture] = useState(initialPref)
  const [category, setCategory]     = useState('')
  const [keyword, setKeyword]       = useState(initialQ)
  const [loading, setLoading]       = useState(false)

  const search = async (kw = keyword, pref = prefecture, cat = category) => {
    setLoading(true)
    let q = supabase.from('facilities').select('*').order('review_count', { ascending: false })
    if (pref) q = q.eq('prefecture_code', pref)
    if (cat)  q = q.eq('category', cat)
    if (kw)   q = q.ilike('name', `%${kw}%`)
    const { data } = await q.limit(50)
    setFacilities(data ?? [])
    setLoading(false)
  }

  useEffect(() => { search(initialQ, initialPref) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-700 mb-6">🔍 施設を探す</h1>

      {initialQ && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700">
          🗾 旅コンプリから「<strong>{initialQ}</strong>」の口コミを検索中
        </div>
      )}

      {/* 検索フォーム */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-8 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="施設名で検索..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(keyword, prefecture, category)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <select value={prefecture} onChange={e => setPrefecture(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
          <option value="">都道府県を選択</option>
          {PREFECTURE_LIST.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
          <option value="">カテゴリ</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={() => search(keyword, prefecture, category)}
          className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 transition text-sm">
          検索
        </button>
      </div>

      {/* 結果 */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">検索中...</div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>該当する施設が見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map(f => (
            <Link key={f.id} href={`/facility/${f.id}`}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-2">🏨</div>
              <div className="font-bold mb-1">{f.name}</div>
              <div className="text-sm text-gray-500 mb-2">
                {f.prefecture_name} {f.city && `· ${f.city}`}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {CATEGORY_LABEL[f.category]}
                </span>
                <span className="text-xs text-amber-600">💬 {f.review_count}件</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">読み込み中...</div>}>
      <SearchContent />
    </Suspense>
  )
}
