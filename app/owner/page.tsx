'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Facility } from '@/lib/types'

type OwnerStatus = 'pending' | 'approved' | 'rejected'

export default function OwnerPage() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<Facility[]>([])
  const [myFacilities, setMyFacilities] = useState<Map<string, OwnerStatus>>(new Map())
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
      supabase
        .from('facility_owners')
        .select('facility_id, status')
        .eq('user_id', data.user.id)
        .then(({ data: owned }) => {
          if (owned) setMyFacilities(new Map((owned as { facility_id: string; status: OwnerStatus }[]).map(o => [o.facility_id, o.status])))
        })
    })
  }, [router])

  const search = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    const { data } = await supabase
      .from('facilities')
      .select('*')
      .ilike('name', `%${keyword}%`)
      .order('review_count', { ascending: false })
      .limit(20)
    setResults(data ?? [])
    setLoading(false)
  }

  const apply = async (facilityId: string) => {
    if (!userId) return
    setApplying(facilityId)
    const { error } = await supabase
      .from('facility_owners')
      .insert({ facility_id: facilityId, user_id: userId })
    if (!error) {
      setMyFacilities(prev => new Map(prev).set(facilityId, 'pending'))
    }
    setApplying(null)
  }

  const remove = async (facilityId: string) => {
    if (!userId || !confirm('このオーナー登録（申請）を取り下げますか？')) return
    setRemoving(facilityId)
    const { error } = await supabase
      .from('facility_owners')
      .delete()
      .eq('facility_id', facilityId)
      .eq('user_id', userId)
    if (!error) {
      setMyFacilities(prev => { const n = new Map(prev); n.delete(facilityId); return n })
    }
    setRemoving(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-700 mb-1">🏨 施設オーナー登録</h1>
        <p className="text-gray-500 text-sm">
          自施設を登録して、お客様からの「また泊まりたい」の声に返信できます。
        </p>
        <p className="text-gray-400 text-xs mt-1">
          ※申請後、運営者の確認（承認）を経てから返信機能が使えるようになります。
        </p>
      </div>

      {(() => {
        const approvedCount = [...myFacilities.values()].filter(s => s === 'approved').length
        const pendingCount = [...myFacilities.values()].filter(s => s === 'pending').length
        if (approvedCount === 0 && pendingCount === 0) return null
        return (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
            <div>
              {approvedCount > 0 && <p className="text-sm font-medium text-emerald-700">✅ {approvedCount}件の施設が承認済み</p>}
              {pendingCount > 0 && <p className="text-xs text-amber-600 mt-0.5">⏳ {pendingCount}件が運営者の承認待ちです</p>}
            </div>
            {approvedCount > 0 && (
              <Link href="/owner/dashboard"
                className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-emerald-600 transition">
                ダッシュボードへ →
              </Link>
            )}
          </div>
        )
      })()}

      {/* 施設検索 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <p className="text-sm font-bold text-gray-700 mb-3">施設名で検索</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="例：加賀屋、草津温泉..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button onClick={search}
            className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition text-sm">
            検索
          </button>
        </div>
      </div>

      {/* 検索結果 */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">検索中...</div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map(f => (
            <div key={f.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{f.name}</p>
                <p className="text-sm text-gray-500">
                  {f.prefecture_name}{f.city && ` · ${f.city}`}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">💬 {f.review_count}件の口コミ</p>
              </div>
              {myFacilities.has(f.id) ? (
                myFacilities.get(f.id) === 'approved' ? (
                  <button
                    onClick={() => remove(f.id)}
                    disabled={removing === f.id}
                    className="text-gray-400 text-xs border border-gray-200 px-3 py-1.5 rounded-xl hover:border-red-300 hover:text-red-400 transition disabled:opacity-50 shrink-0"
                  >
                    {removing === f.id ? '解除中...' : '✅ 登録済み（解除）'}
                  </button>
                ) : myFacilities.get(f.id) === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-amber-600 font-bold whitespace-nowrap">⏳ 承認待ち</span>
                    <button
                      onClick={() => remove(f.id)}
                      disabled={removing === f.id}
                      className="text-gray-400 text-xs border border-gray-200 px-2 py-1.5 rounded-xl hover:border-red-300 hover:text-red-400 transition disabled:opacity-50"
                    >
                      {removing === f.id ? '取消中...' : '取り下げ'}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-red-400 shrink-0">却下されました</span>
                )
              ) : (
                <button
                  onClick={() => apply(f.id)}
                  disabled={applying === f.id}
                  className="bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition disabled:opacity-50 shrink-0"
                >
                  {applying === f.id ? '登録中...' : 'オーナー登録'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : keyword && !loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">🔍</div>
          <p>施設が見つかりませんでした</p>
        </div>
      ) : null}
    </div>
  )
}
