# いいとこどり — 宿泊レビューアプリ 設計書（初版）

> 良かったことだけを共有しよう。旅の幸せを、みんなでシェア。

---

## なぜ「いいとこどり」なのか

### エピソード①　新婚旅行の赤ワイン事件

新婚旅行で訪れた宿の夕食。ウェイターが運んでくれた赤ワインを、うっかりこちらのシャツにこぼしてしまった。

何年経ってもその記憶はちゃんと残っている。でも——それ以上に、温泉の湯けむり越しに見た山の稜線、朝食に並んだ地元の味噌汁、部屋に戻ったら浴衣が畳まれていた気遣い、そういう「いいとこ」の記憶の方がずっと多く残っている。だから今では笑い話になる。

**粗相の一件が記憶から消えたわけではない。でも、いいとこが勝っている。**

### エピソード②　マイナス評価ひとつの罪

旅行の宿を選ぶとき、口コミサイトを開く。星4.5の宿に「料理が物足りなかった」という投稿をひとつ見てしまうと、それが頭にこびりつく。実際に泊まってみれば最高の宿だったとしても、食事のたびに「どうかな…」と先入観がよぎる。

せっかくいいとこがいっぱいある宿なのに、それを存分に楽しめない。旅の記憶がもったいない。

---

### このアプリが解こうとしていること

- **投稿する側**：良かったことを書き残したい。でも批判は書きたくない。
- **読む側**：これから行く旅への期待を膨らませたい。不安を植え付けられたくない。
- **施設側**：ネガティブ口コミに怯えず、喜ばれた点を積み上げたい。

「いいとこどり」は、**良かったことだけ**を受け付けるレビューアプリ。マイナス評価は存在しない。旅の幸せをシェアするためだけの場所。

---

## 現在の状況（2026年5月時点）

| 項目 | 内容 |
|------|------|
| URL | https://iitokodori.hana.trickster.biz |
| 状態 | 本番稼働中 |
| フェーズ | Phase3完了（施設オーナー機能まで実装済み） |
| 連携アプリ | 旅コンプリ（tabi-compuri.hana.trickster.biz） |

---

## 技術スタック

| 分類 | 技術 |
|------|------|
| フロントエンド | Next.js App Router（TypeScript） |
| スタイリング | Tailwind CSS |
| バックエンド / DB | Supabase（PostgreSQL + Auth + RLS） |
| ホスティング | Vercel |
| 認証 | Supabase Auth（メール/パスワード） |

---

## ページ構成

| パス | 種別 | 内容 |
|------|------|------|
| `/` | Server | トップ：ヒーロー・3つの約束・人気施設・最新レビュー |
| `/search` | Client | 施設検索（キーワード・都道府県・カテゴリ） |
| `/facility/[id]` | Server | 施設詳細：タグ集計・レビュー一覧・オーナー返信 |
| `/review/new/[facilityId]` | Client | いいとこ投稿フォーム（マイナスワード検知付き） |
| `/ranking` | Server | いいとこランキングTOP20 |
| `/my-stays` | Client | マイ記録（自分の投稿一覧・削除） |
| `/login` | Client | ログイン・新規登録 |
| `/owner` | Client | 施設オーナー登録申請 |
| `/owner/dashboard` | Client | オーナーダッシュボード（口コミへの返信） |

---

## データベース設計

### `facilities`（施設マスタ）
| カラム | 型 | 説明 |
|--------|----|------|
| id | uuid | PK |
| name | text | 施設名 |
| category | text | hotel / ryokan / pension / hostel / other |
| prefecture_code | text | 都道府県コード（01〜47） |
| prefecture_name | text | 都道府県名 |
| city | text? | 市区町村 |
| address | text? | 住所 |
| official_url | text? | 公式サイトURL |
| thumbnail_url | text? | サムネイル画像URL |
| review_count | int | いいとこ件数（集計キャッシュ） |
| created_at | timestamptz | |

### `reviews`（レビュー）
| カラム | 型 | 説明 |
|--------|----|------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| facility_id | uuid | FK → facilities |
| title | text | 一言タイトル（必須）|
| good_tags | text[] | 良かったポイントタグ配列 |
| comment | text? | 詳細コメント（任意） |
| visited_date | date? | 宿泊日（任意） |
| helpful_count | int | 「参考になった」数（将来用） |
| created_at | timestamptz | |

### `facility_owners`（施設オーナー紐付け）
| カラム | 型 | 説明 |
|--------|----|------|
| id | uuid | PK |
| facility_id | uuid | FK → facilities |
| user_id | uuid | FK → auth.users |
| created_at | timestamptz | |

### `owner_replies`（施設からの返信）
| カラム | 型 | 説明 |
|--------|----|------|
| id | uuid | PK |
| facility_id | uuid | FK → facilities |
| review_id | uuid | FK → reviews |
| user_id | uuid | FK → auth.users |
| reply_text | text | 返信内容 |
| created_at | timestamptz | |

---

## いいとこタグ一覧

| ID | ラベル | 絵文字 |
|----|--------|--------|
| view | 景色が最高 | 🏔️ |
| food | 料理が美味しい | 🍽️ |
| staff | スタッフが親切 | 😊 |
| clean | 清潔感がある | ✨ |
| onsen | 温泉が最高 | ♨️ |
| value | コスパ最高 | 💰 |
| location | 立地が便利 | 📍 |
| room | 部屋が広い | 🛏️ |
| amenity | アメニティ充実 | 🧴 |
| quiet | 静かで落ち着く | 🌿 |
| design | デザインが素敵 | 🎨 |
| breakfast | 朝食が最高 | 🌅 |

---

## 主要な設計方針

### マイナスワード検知（`/api/check-negative`）
投稿コメントをAIでチェックし、ネガティブな内容が含まれる場合は警告を表示。投稿をブロックせず「良かったことだけ書いてください」と促す。投稿者に意図を再確認させるワンクッション。

### 匿名投稿
`reviews` テーブルに `user_id` は保持するが、表示は「匿名」固定。`profiles.display_name` は現在のPostgREST FK構成上表示不可（将来的にFK追加で復活予定）。

### 施設オーナー機能
オーナー認証は現状セルフ申請（無審査）。施設名で検索→登録→ダッシュボードから口コミに返信できる。将来的にメール確認・審査フローを追加予定。

---

## 旅コンプリとの連動（Phase2）

旅コンプリ（観光スポットスタンプラリーアプリ）といいとこどりを相互送客で連動。

| 方向 | 内容 |
|------|------|
| 旅コンプリ → いいとこどり | スポット詳細ページから `/search?q=施設名&pref=XX` で自動検索 |
| いいとこどり → 旅コンプリ | 施設詳細ページに「旅コンプリで〇〇を探す」バナーを表示 |
| レビュー投稿完了後 | 旅コンプリへのCTAボタンを表示 |
| 共通ログイン | URLハッシュ（`#access_token=...`）でSupabaseセッションをクロスドメイン引き継ぎ |

---

## 実装フェーズ

| フェーズ | 内容 | 状態 |
|----------|------|------|
| Phase1 | 基本機能（検索・投稿・施設詳細・ランキング・マイ記録） | ✅ 完了 |
| Phase2 | 旅コンプリ連動・共通ログイン | ✅ 完了（2026-05-21） |
| Phase3 | 施設オーナー機能（申請・返信ダッシュボード） | ✅ 完了（2026-05-21） |
| Phase4 | AI口コミ分析・施設情報編集・認証強化 | 検討中 |

---

## Phase4 候補（今後の展望）

- **AI活用**：口コミのいいとこ傾向を分析し、施設への改善提案を生成（Claude API連携）
- **施設情報編集**：オーナーが自施設の写真・説明を編集できる機能
- **オーナー認証強化**：メール確認・審査フロー導入
- **いいとこ分析ページ**：「この宿でよく褒められるポイントはXX」をビジュアル表示
- **旅行記機能**：宿泊いいとこをまとめた「旅行記」を作成・シェア
- **「参考になった」機能**：レビューへのリアクション（`helpful_count` 列は既存）

---

## ローカル開発

```bash
cd iitokodori
cp .env.local.template .env.local
# .env.local に Supabase URL・anon key を記入
npm install
npm run dev
# http://localhost:3000
```

---

## デプロイ

```bash
# Vercel（本番）
vercel --prod

# カスタムドメイン
# iitokodori.hana.trickster.biz → Vercel エイリアス設定済み
# DNS: Xserver にて CNAME 設定済み（76.76.21.21）
```
