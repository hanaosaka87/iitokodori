'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PREFECTURE_LIST, CATEGORY_LABEL, type Category, type Facility } from '@/lib/types'

const PAGE_SIZE = 100

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQ    = searchParams.get('q')    ?? ''
  const initialPref = searchParams.get('pref') ?? ''

  const [facilities, setFacilities] = useState<Facility[]>([])
  const [prefecture, setPrefecture] = useState(initialPref)
  const [category, setCategory]     = useState('')
  const [keyword, setKeyword]       = useState(initialQ)
  const [loading, setLoading]       = useState(false)
  const [page, setPage]             = useState(0)
  const [total, setTotal]           = useState(0)
  const [prefCounts, setPrefCounts] = useState<Record<string, number>>({})

  // 都道府県別件数を初期ロード時に取得
  useEffect(() => {
    supabase.rpc('get_prefecture_counts').then(({ data }) => {
      if (!data) return
      const counts: Record<string, number> = {}
      ;(data as { prefecture_code: string; count: number }[]).forEach(row => {
        counts[row.prefecture_code] = Number(row.count)
      })
      setPrefCounts(counts)
    })
  }, [])

  const search = async (kw = keyword, pref = prefecture, cat = category, p = 0) => {
    setLoading(true)
    setPage(p)
    const from = p * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    let q = supabase
      .from('facilities')
      .select('*', { count: 'exact' })
      .order('review_count', { ascending: false })
      .range(from, to)
    if (pref) q = q.eq('prefecture_code', pref)
    if (cat)  q = q.eq('category', cat)
    if (kw)   q = q.ilike('name', `%${kw}%`)

    const { data, count } = await q
    setFacilities(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  useEffect(() => { search(initialQ, initialPref) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handlePrefChange = (val: string) => {
    setPrefecture(val)
    search(keyword, val, category, 0)
  }

  const handleCatChange = (val: string) => {
    setCategory(val)
    search(keyword, prefecture, val, 0)
  }

  const goPage = (p: number) => {
    search(keyword, prefecture, category, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-700 mb-6">🔍 施設を探す</h1>

      {initialQ && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700">
          🗾 旅コンプリから「<strong>{initialQ}</strong>」の口コミを検索中
        </div>
      )}

      {/* 検索フォーム */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="施設名で検索..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(keyword, prefecture, category, 0)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <select
          value={prefecture}
          onChange={e => handlePrefChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <option value="">都道府県を選択</option>
          {PREFECTURE_LIST.map(p => (
            <option key={p.code} value={p.code}>
              {p.name}{prefCounts[p.code] ? `（${prefCounts[p.code].toLocaleString()}件）` : ''}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={e => handleCatChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <option value="">カテゴリ</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          onClick={() => search(keyword, prefecture, category, 0)}
          className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 transition text-sm"
        >
          検索
        </button>
      </div>

      {/* 件数・ページ情報 */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>
            全 <strong className="text-amber-700">{total.toLocaleString()}</strong> 件
            {totalPages > 1 && (
              <span className="ml-2">
                （{page * PAGE_SIZE + 1}〜{Math.min((page + 1) * PAGE_SIZE, total)}件目を表示）
              </span>
            )}
          </span>
          {totalPages > 1 && (
            <span className="font-medium">{page + 1} / {totalPages} ページ</span>
          )}
        </div>
      )}

      {/* 結果 */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">検索中...</div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>該当する施設が見つかりませんでした</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                    {CATEGORY_LABEL[f.category as Category]}
                  </span>
                  <span className="text-xs text-amber-600">💬 {f.review_count}件</span>
                </div>
              </Link>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page === 0}
                className="px-6 py-2.5 rounded-xl border border-amber-300 text-amber-600 font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 transition"
              >
                ← 前へ
              </button>
              <span className="text-sm text-gray-500 font-medium">
                {page + 1} / {totalPages} ページ
              </span>
              <button
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-6 py-2.5 rounded-xl border border-amber-300 text-amber-600 font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 transition"
              >
                次へ →
              </button>
            </div>
          )}
        </>
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
