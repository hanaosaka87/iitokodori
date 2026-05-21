-- =============================================
-- いいとこどり 宿泊レビューアプリ Supabase設定
-- =============================================

-- 1. 施設マスター
CREATE TABLE facilities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  category        text NOT NULL CHECK (category IN ('hotel','ryokan','pension','hostel','other')),
  prefecture_code text NOT NULL,
  prefecture_name text NOT NULL,
  city            text,
  address         text,
  official_url    text,
  thumbnail_url   text,
  review_count    int DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- 2. いいとこレビュー
CREATE TABLE reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_id   uuid REFERENCES facilities(id) ON DELETE CASCADE,
  title         text NOT NULL,
  good_tags     text[] NOT NULL DEFAULT '{}',
  comment       text,
  visited_date  date,
  helpful_count int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- 3. レビュー写真
CREATE TABLE review_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   uuid REFERENCES reviews(id) ON DELETE CASCADE,
  storage_url text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- 4. 参考になった いいね
CREATE TABLE helpful_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id   uuid REFERENCES reviews(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- 5. ユーザープロフィール
CREATE TABLE profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- RLS（Row Level Security）設定
-- =============================================

ALTER TABLE facilities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpful_votes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;

-- facilities: 全員閲覧可・管理者のみ追加
CREATE POLICY "facilities_select" ON facilities FOR SELECT USING (true);

-- reviews: 全員閲覧可・ログイン済みのみ投稿・自分のみ削除
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- review_photos: 全員閲覧可・ログイン済みのみ追加
CREATE POLICY "photos_select" ON review_photos FOR SELECT USING (true);
CREATE POLICY "photos_insert" ON review_photos FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM reviews WHERE id = review_id)
);

-- helpful_votes: 全員閲覧可・ログイン済みのみ投票
CREATE POLICY "votes_select" ON helpful_votes FOR SELECT USING (true);
CREATE POLICY "votes_insert" ON helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_delete" ON helpful_votes FOR DELETE USING (auth.uid() = user_id);

-- profiles: 全員閲覧可・自分のみ更新
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- トリガー：レビュー投稿時にreview_countを更新
-- =============================================

CREATE OR REPLACE FUNCTION update_review_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE facilities SET review_count = review_count + 1 WHERE id = NEW.facility_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE facilities SET review_count = review_count - 1 WHERE id = OLD.facility_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_review_count();

-- =============================================
-- トリガー：ユーザー登録時にprofile自動作成
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Storage バケット（Supabaseダッシュボードで作成）
-- =============================================
-- バケット名: review-images（public）

-- =============================================
-- 施設データ初期投入サンプル（都道府県別）
-- =============================================

INSERT INTO facilities (name, category, prefecture_code, prefecture_name, city) VALUES
  ('サンプルホテル大阪', 'hotel', '27', '大阪府', '大阪市'),
  ('サンプル旅館京都', 'ryokan', '26', '京都府', '京都市'),
  ('サンプルホテル東京', 'hotel', '13', '東京都', '新宿区');
