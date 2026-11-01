-- いいとこどり 施設データ修正（2026-07-20）
-- ホテル松竜園 海星：名称・住所（郵便番号込み）を正しい情報に修正
UPDATE facilities
SET name = 'ホテル松竜園 海星',
    address = '〒869-3602 熊本県上天草市大矢野町上6494'
WHERE official_url = 'http://www.kaisei.tv';
