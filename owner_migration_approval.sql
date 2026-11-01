-- いいとこどり セキュリティ対応：施設オーナー登録を運営者手動承認制に変更
-- 背景：facility_owners への insert は「ログイン済み」であることしか検証しておらず、
--       誰でも任意の実在施設に「オーナーです」と自己申告するだけで
--       口コミへの公開返信権限を得られる状態だった（verified列もデフォルトtrue）。

-- 1. 承認状態カラムを追加
alter table facility_owners
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'approved', 'rejected'));

-- 2. 既存の verified=true 行は approved 扱いに移行（互換のため verified 列自体は残す）
update facility_owners set status = 'approved' where verified = true;

-- 3. 早い者勝ち締め出しを解消：1施設1オーナーの制約を、1施設内で複数人が申請できる制約に変更
alter table facility_owners drop constraint if exists facility_owners_facility_id_key;
alter table facility_owners add constraint facility_owners_facility_id_user_id_key unique (facility_id, user_id);

-- 4. owner_replies のINSERTポリシーに「承認済みであること」を追加
drop policy if exists "オーナーが自施設の返信を投稿できる" on owner_replies;
create policy "承認済みオーナーが自施設の返信を投稿できる"
  on owner_replies for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from facility_owners
      where facility_id = owner_replies.facility_id
        and user_id = auth.uid()
        and status = 'approved'
    )
  );

-- 確認クエリ（実行後、facility_ownersのstatus列・制約を確認）
select column_name, column_default
from information_schema.columns
where table_name = 'facility_owners' and column_name = 'status';

select conname, contype
from pg_constraint
where conrelid = 'facility_owners'::regclass;
