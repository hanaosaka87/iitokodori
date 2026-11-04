import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function isReady() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const path = url.split('/photos/')[1]
  return path || null
}

// POST /api/account/delete  header: Authorization: Bearer <access_token>
// ユーザー本人がマイ記録ページから起動するアカウント削除。Apple Guideline 5.1.1(v)対応。
// reviews/helpful_votes/profiles/facility_owners/owner_replies はすべてauth.usersへの
// on delete cascadeがDB側に設定済みのため、auth.admin.deleteUser()を呼べば自動的に削除される。
// ストレージ上の写真だけはDBカスケードの対象外のため、削除前に収集して個別に消す。
//
// 注意：いいとこどりは旅コンプリ（tabi-compuri.hana.trickster.biz）と同一Supabaseプロジェクト
// （同一auth.users）に同居しているため、同じメールアドレスで両アプリを使っているユーザーは
// 同一アカウント。旅コンプリ側のgroups/group_membersはauth.usersへのFKがon delete cascadeでは
// ないため、ここで削除しないとauth.admin.deleteUser()がFK違反で失敗する。visits/city_visits/
// spot_visits/diariesはFK制約はないが、削除しないと孤立データとして残ってしまうため明示的に消す。
// ※ premium機能（Stripe）は現状いいとこどり側に実装がなく、本APIはStripeサブスクの解約は行わない
//   （旅コンプリのpremiumは現状NEXT_PUBLIC_PREMIUM_ENABLED=falseで非公開のため実害なし。
//   将来旅コンプリのpremiumを有効化する場合はこのAPIにもStripe解約処理の追加を検討すること）。
export async function POST(req: NextRequest) {
  if (!isReady()) return NextResponse.json({ error: '設定エラー' }, { status: 500 })

  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })

  const admin = getAdminClient()

  const { data: userData, error: userErr } = await admin.auth.getUser(token)
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
  }
  const userId = userData.user.id

  try {
    // 1. 本人のレビュー・旅日記に紐づく写真のストレージパスを先に集める（'photos'バケットを共用）
    const { data: reviews } = await admin.from('reviews').select('id').eq('user_id', userId)
    const reviewIds = (reviews ?? []).map((r) => r.id)
    const { data: reviewPhotos } = reviewIds.length > 0
      ? await admin.from('review_photos').select('storage_url').in('review_id', reviewIds)
      : { data: [] as { storage_url: string | null }[] }
    const { data: diaries } = await admin.from('diaries').select('photo_url').eq('user_id', userId)
    const storagePaths = [
      ...(reviewPhotos ?? []).map((p) => storagePathFromUrl(p.storage_url)),
      ...(diaries ?? []).map((d) => storagePathFromUrl(d.photo_url)),
    ].filter((p): p is string => !!p)
    if (storagePaths.length > 0) {
      await admin.storage.from('photos').remove(storagePaths)
    }

    // 1b. 旅コンプリ側のデータも削除（同一Supabaseプロジェクトのため）
    await admin.from('group_members').delete().eq('user_id', userId)
    await admin.from('groups').delete().eq('created_by', userId)
    await admin.from('diaries').delete().eq('user_id', userId)
    await admin.from('visits').delete().eq('user_id', userId)
    await admin.from('city_visits').delete().eq('user_id', userId)
    await admin.from('spot_visits').delete().eq('user_id', userId)

    // 2. auth.usersを削除。reviews/review_photos/helpful_votes/profiles/facility_owners/owner_repliesは
    //    すべてauth.usersへのon delete cascadeがDBに設定済みのため自動的に削除される
    const { error: delUserErr } = await admin.auth.admin.deleteUser(userId)
    if (delUserErr) throw delUserErr

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('account delete failed', e)
    return NextResponse.json({ error: '削除に失敗しました。時間をおいて再度お試しいただくか、お問い合わせください。' }, { status: 500 })
  }
}
