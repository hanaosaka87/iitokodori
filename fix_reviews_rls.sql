-- reviewsテーブルのRLSポリシーを確実に再設定
-- 既存ポリシーがあっても安全に実行可能

DROP POLICY IF EXISTS "reviews_select" ON reviews;
DROP POLICY IF EXISTS "reviews_insert" ON reviews;
DROP POLICY IF EXISTS "reviews_delete" ON reviews;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- トリガーも再設定
DROP TRIGGER IF EXISTS on_review_change ON reviews;

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
