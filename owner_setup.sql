-- =============================================
-- Phase 3: 施設オーナー機能
-- Supabaseのダッシュボード > SQL Editor で実行
-- =============================================

-- 施設オーナーテーブル（1施設1オーナー）
CREATE TABLE IF NOT EXISTS facility_owners (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id  uuid NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verified     boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(facility_id)
);

ALTER TABLE facility_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "全員がオーナー情報を見られる"
  ON facility_owners FOR SELECT USING (true);

CREATE POLICY "ログイン済みユーザーが申請できる"
  ON facility_owners FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "オーナー自身が削除できる"
  ON facility_owners FOR DELETE
  USING (auth.uid() = user_id);

-- オーナー返信テーブル（1レビューに1返信）
CREATE TABLE IF NOT EXISTS owner_replies (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id    uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  facility_id  uuid NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reply_text   text NOT NULL CHECK (char_length(reply_text) BETWEEN 1 AND 1000),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(review_id)
);

ALTER TABLE owner_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "全員が返信を見られる"
  ON owner_replies FOR SELECT USING (true);

CREATE POLICY "オーナーが自施設の返信を投稿できる"
  ON owner_replies FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM facility_owners
      WHERE facility_id = owner_replies.facility_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "オーナーが自分の返信を更新できる"
  ON owner_replies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "オーナーが自分の返信を削除できる"
  ON owner_replies FOR DELETE
  USING (auth.uid() = user_id);
