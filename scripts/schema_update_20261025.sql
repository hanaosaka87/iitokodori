-- =============================================
-- いいとこどり 2026-10-25 テスターフィードバック7件 対応マイグレーション
-- Supabaseダッシュボード > SQL Editor で実行してください（社長作業）
-- =============================================

-- 1. 施設の基本情報「アピールポイント」列を追加
--    （official_url・thumbnail_url は既存列をそのまま使用）
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS appeal_points text;

-- 2. オーナー（承認済みのみ）が自施設の基本情報を編集できるようにする
CREATE POLICY "facilities_update_by_approved_owner" ON facilities
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM facility_owners
      WHERE facility_id = facilities.id AND user_id = auth.uid() AND status = 'approved'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM facility_owners
      WHERE facility_id = facilities.id AND user_id = auth.uid() AND status = 'approved'
    )
  );

-- 3. ダミーデータ（投入済み/今後投入分）を実データと区別するフラグ
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_seed_data boolean NOT NULL DEFAULT false;

-- 3.5 【既存バグ修正】review_count自動更新トリガーがRLSでブロックされていた問題を修正
--     facilitiesにはSELECTポリシーしか無く、update_review_count()もSECURITY DEFINERではなかったため、
--     authenticatedロール（通常のクライアント投稿）からのUPDATEが0件適用のまま無視され続けていた可能性が高い。
--     レビュー投稿・削除時のreview_count自動加減算を実際に機能させるため、SECURITY DEFINERに変更する。
ALTER FUNCTION update_review_count() SECURITY DEFINER;

-- 4. 「参考になった（いいね）」の件数をhelpful_votesの増減に合わせて自動更新
--    reviewsテーブルにUPDATEポリシーが存在しないため、SECURITY DEFINERでRLSをバイパスして更新する
--    （件数カウンタの加減算のみを行う固定ロジックで、攻撃者が任意の値を書き込める余地はない）
CREATE OR REPLACE FUNCTION update_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_helpful_vote_change
  AFTER INSERT OR DELETE ON helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_helpful_count();

-- =============================================
-- 5. ダミーレビュー500件の投入（アプリの賑わい表示用。is_seed_data=trueで実データと区別）
--    既存の201件の施設にランダムに割り振る。user_idはNULL（実在しないユーザーを装わない）
-- =============================================
DO $$
DECLARE
  titles text[] := ARRAY[
    '景色が最高でした！','お料理が絶品で感動しました','スタッフの対応がとても丁寧',
    '清潔で気持ちよく過ごせました','温泉にゆっくり浸かれました','コスパが素晴らしいです',
    '駅から近くて便利でした','部屋がとても広々していました','アメニティが充実していました',
    '静かでリラックスできました','内装のデザインが素敵でした','朝食が美味しすぎました',
    '記念日にぴったりの宿でした','また泊まりたいと思いました','家族旅行に最適でした',
    '夜景がとても綺麗でした','接客が丁寧で癒されました','お風呂が広くて快適でした'
  ];
  comments text[] := ARRAY[
    '次回も利用したいです。','友人にもおすすめしたいと思います。','大満足の滞在になりました。',
    'スタッフの方の気配りが嬉しかったです。','景色を見ながらゆっくり過ごせました。',
    '料理のボリュームも丁度よかったです。','また家族を連れて来たいです。',
    NULL, NULL, NULL
  ];
  tag_pool text[] := ARRAY['view','food','staff','clean','onsen','value','location','room','amenity','quiet','design','breakfast'];
  fid uuid;
  i int;
  ntags int;
  chosen text[];
BEGIN
  FOR i IN 1..500 LOOP
    SELECT id INTO fid FROM facilities ORDER BY random() LIMIT 1;
    ntags := 1 + floor(random() * 3)::int;
    SELECT array_agg(t) INTO chosen FROM (SELECT t FROM unnest(tag_pool) t ORDER BY random() LIMIT ntags) s;

    INSERT INTO reviews (facility_id, title, good_tags, comment, visited_date, is_seed_data, created_at)
    VALUES (
      fid,
      titles[1 + floor(random() * array_length(titles, 1))::int],
      chosen,
      comments[1 + floor(random() * array_length(comments, 1))::int],
      (current_date - (floor(random() * 365))::int),
      true,
      now() - (floor(random() * 180))::int * interval '1 day'
    );
  END LOOP;
END $$;

-- =============================================
-- 6. review_countの実数再計算（上記3.5のバグによる過去の累積ズレを一括補正）
-- =============================================
UPDATE facilities f
SET review_count = (SELECT count(*) FROM reviews r WHERE r.facility_id = f.id);
