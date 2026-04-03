# Webサーバー WebAPI 仕様書

## 共通仕様

### ベースURL
```
http://localhost:<PORT>/api
```

### 認証
管理者操作が必要なエンドポイントはリクエストヘッダーまたはクエリパラメータにトークンを付与する。

```
Authorization: Bearer <token>
# または
?token=<token>
```

トークンが不正または未指定の場合は `401 Unauthorized` を返す。  
管理者権限が必要な操作に一般ユーザーがアクセスした場合は `403 Forbidden` を返す。

### レスポンス形式

**成功時**
```json
{
  "data": { ... }
}
```

**エラー時**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

### 共通エラーコード

| ステータス | コード | 説明 |
|-----------|--------|------|
| 400 | `VALIDATION_ERROR` | リクエストパラメータ不正 |
| 401 | `UNAUTHORIZED` | 認証トークン不正 |
| 403 | `FORBIDDEN` | 権限不足 |
| 404 | `NOT_FOUND` | リソースが存在しない |
| 409 | `CONFLICT` | 状態が操作を許可しない（例: 締め切り後の賭け） |
| 500 | `INTERNAL_ERROR` | サーバー内部エラー |

---

## エンドポイント一覧

画面ID は Webアプリ_画面設計書.md の W-01〜W-06 に対応。コマンド名は DiscordBot_コマンド仕様書.md に対応。

| CRUD | メソッド | パス | 説明 | 管理者トークン | 使用画面 / コマンド |
|------|---------|------|------|--------------|-------------------|
| R | GET | `/api/auth/verify` | トークン検証 | 不要 | Webアプリ共通（全画面初期化時） |
| R | GET | `/api/events` | イベント一覧取得 | 不要 | W-01 |
| R | GET | `/api/events/:id` | イベント詳細取得 | 不要 | W-02（編集時の初期データ読み込み） |
| C | POST | `/api/events` | イベント作成 | **必須** | W-02（新規保存） |
| U | PUT | `/api/events/:id` | イベント更新 | **必須** | W-02（編集保存） |
| D | DELETE | `/api/events/:id` | イベント削除 | **必須** | W-01（削除ボタン） |
| U | PATCH | `/api/events/:id/activate` | 開催中切り替え | **必須** | W-01（開催中切替ボタン） |
| R | GET | `/api/events/:eventId/games` | ゲーム一覧取得 | 不要（任意付与で非公開も取得可） | W-03 |
| R | GET | `/api/games/:id` | ゲーム詳細取得 | 不要 | W-04（編集時の初期データ読み込み）、W-05、`/post-game` |
| C | POST | `/api/events/:eventId/games` | ゲーム作成 | **必須** | W-04（新規保存） |
| U | PUT | `/api/games/:id` | ゲーム更新 | **必須** | W-04（編集保存） |
| D | DELETE | `/api/games/:id` | ゲーム削除 | **必須** | W-03（削除ボタン） |
| U | PATCH | `/api/games/:id/publish` | 公開・非公開切り替え | **必須** | W-03（公開切替ボタン） |
| U | PATCH | `/api/games/:id/result` | 結果確定・修正 | **必須** | W-05（結果確定フォーム） |
| R | GET | `/api/games/:gameId/bets` | 賭け状況取得 | 不要（任意付与で確定前も全表示） | W-05、`/mybet` |
| C/U | PUT | `/api/games/:gameId/bets` | 賭け作成・上書き | 不要 | `/bet` |
| R | GET | `/api/users` | ユーザー一覧取得 | 不要（任意付与で `debt` フィールド追加） | W-06（ポイントランキング） |
| R | GET | `/api/users/:id` | ユーザー詳細取得 | 不要（任意付与で `debt` フィールド追加） | 内部利用（他APIからの参照） |
| R | GET | `/api/users/discord/:discordId` | ユーザー取得（Discord ID） | 不要 | `/bet`、`/mybet`、`/mybets`（Discord IDからユーザー特定） |
| R | GET | `/api/users/:id/point-history` | ポイント履歴取得 | 不要 | 将来拡張（現時点で使用画面なし） |
| R | GET | `/api/users/:id/event-bets/:eventId` | イベント内賭け一覧取得 | 不要 | `/mybets` |
| R | GET | `/api/users/:id/event-results/:eventId` | イベント別賭け結果取得 | 条件付き必須（`resultsPublic=false` の場合） | W-06（ゲーム別ポイント推移） |

---

## 認証 API

### トークン検証
```
GET /api/auth/verify
```

**クエリパラメータ**

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| token | ○ | 管理者トークン |

**レスポンス**
```json
{
  "data": {
    "isAdmin": true
  }
}
```

---

## イベント API

### イベント一覧取得
```
GET /api/events
```

**レスポンス**
```json
{
  "data": [
    {
      "id": 1,
      "name": "〇〇大会",
      "isActive": true,
      "initialPoints": 10000,
      "resultsPublic": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### イベント詳細取得
```
GET /api/events/:id
```

**パスパラメータ**

| パラメータ | 説明 |
|-----------|------|
| id | イベントID |

**レスポンス**
```json
{
  "data": {
    "id": 1,
    "name": "〇〇大会",
    "isActive": true,
    "initialPoints": 10000,
    "resultsPublic": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### イベント作成
```
POST /api/events
```
**権限**: 管理者のみ

**リクエストボディ**
```json
{
  "name": "〇〇大会",
  "initialPoints": 10000,
  "resultsPublic": false
}
```

| フィールド | 型 | 必須 | バリデーション |
|-----------|-----|------|--------------|
| name | string | ○ | 1〜100文字 |
| initialPoints | number | - | 1以上の整数（省略時: 10000） |
| resultsPublic | boolean | - | 省略時: `false` |

**レスポンス**: `201 Created`
```json
{
  "data": {
    "id": 2,
    "name": "〇〇大会",
    "isActive": false,
    "initialPoints": 10000,
    "resultsPublic": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### イベント更新
```
PUT /api/events/:id
```
**権限**: 管理者のみ

**リクエストボディ**
```json
{
  "name": "〇〇大会（改）",
  "initialPoints": 5000,
  "resultsPublic": true
}
```

**レスポンス**: `200 OK` (イベント詳細と同形式)

---

### イベント削除
```
DELETE /api/events/:id
```
**権限**: 管理者のみ

**レスポンス**: `204 No Content`

---

### 開催中イベント切り替え
```
PATCH /api/events/:id/activate
```
**権限**: 管理者のみ

指定したイベントを開催中にし、他のイベントはすべて非開催にする。  
開催中イベントの1件制限は API サーバー側のトランザクション内で制御する（DB制約なし）。

処理内容:
1. `UPDATE events SET is_active = FALSE WHERE is_active = TRUE`
2. `UPDATE events SET is_active = TRUE WHERE id = :id`

**レスポンス**: `200 OK` (イベント詳細と同形式)

---

## ゲーム API

### ゲーム一覧取得
```
GET /api/events/:eventId/games
```

**クエリパラメータ**

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| includeUnpublished | - | `true` で非公開も含む（管理者のみ有効） |

**レスポンス**
```json
{
  "data": [
    {
      "id": 1,
      "eventId": 1,
      "title": "第1試合",
      "description": "...",
      "deadline": "2024-01-01T12:00:00Z",
      "isPublished": true,
      "status": "open",
      "betType": "single",
      "requiredSelections": null,
      "resultSymbols": null,
      "betOptions": [
        { "id": 1, "symbol": "A", "label": "チームA", "order": 1 },
        { "id": 2, "symbol": "B", "label": "チームB", "order": 2 }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

`status` の値:

| 値 | 説明 |
|----|------|
| `open` | 賭け受付中 |
| `closed` | 締め切り済み（結果未確定） |
| `finished` | 結果確定済み |

---

### ゲーム詳細取得
```
GET /api/games/:id
```

**レスポンス**: ゲーム一覧の各要素と同形式

---

### ゲーム作成
```
POST /api/events/:eventId/games
```
**権限**: 管理者のみ

**リクエストボディ**
```json
{
  "title": "第1試合",
  "description": "説明文",
  "deadline": "2024-01-01T12:00:00Z",
  "betType": "single",
  "requiredSelections": null,
  "betOptions": [
    { "symbol": "A", "label": "チームA" },
    { "symbol": "B", "label": "チームB" }
  ]
}
```

| フィールド | 型 | 必須 | バリデーション |
|-----------|-----|------|--------------|
| title | string | ○ | 1〜100文字 |
| description | string | - | 最大500文字 |
| deadline | ISO8601 | ○ | 現在時刻より未来 |
| betType | string | - | `single` / `multi_unordered` / `multi_ordered` / `multi_ordered_dup`（省略時: `single`） |
| requiredSelections | number | 条件付き | `betType` が `single` 以外の場合に必須。2以上の整数。`single` 時は省略または `null` |
| betOptions | object[] | ○ | 2要素以上。`betType` が複数方式の場合は `requiredSelections` 以上の要素数が必要 |
| betOptions[].symbol | string | ○ | 半角英字(A〜Z)または半角数字(1〜9)、同一リスト内で一意 |
| betOptions[].label | string | ○ | 1〜50文字 |

**レスポンス**: `201 Created` (ゲーム詳細と同形式)

---

### ゲーム更新
```
PUT /api/games/:id
```
**権限**: 管理者のみ

**制約**:

| 状態 | 変更可能フィールド |
|------|------------------|
| 非公開（`is_published = false`） | すべてのフィールド |
| 公開済み（`is_published = true`） | `title`、`description`、`betOptions[].label` のみ |

公開済みゲームで上記以外のフィールド（`deadline`、`betType`、`requiredSelections`、`betOptions` の追加・削除、`betOptions[].symbol`）を変更しようとした場合は `409 CONFLICT` を返す。

**リクエストボディ**: ゲーム作成と同形式（公開済み時は制約外フィールドを無視するか `409` を返す）

**レスポンス**: `200 OK` (ゲーム詳細と同形式)

---

### ゲーム削除
```
DELETE /api/games/:id
```
**権限**: 管理者のみ

**レスポンス**: `204 No Content`

---

### 公開・非公開切り替え
```
PATCH /api/games/:id/publish
```
**権限**: 管理者のみ

**リクエストボディ**
```json
{
  "isPublished": true
}
```

**レスポンス**: `200 OK` (ゲーム詳細と同形式)

---

### 結果確定・修正
```
PATCH /api/games/:id/result
```
**権限**: 管理者のみ  
**制約**: `status` が `closed` のゲームのみ（修正時は `finished` も可）

**リクエストボディ**
```json
{
  "resultSymbols": "BDE"
}
```

| フィールド | 型 | 必須 | バリデーション |
|-----------|-----|------|--------------|
| resultSymbols | string | ○ | 各文字がゲームの `bet_options.symbol` に存在すること。`betType` に応じた制約を適用 |

**`betType` ごとのバリデーション**:
- `single`: 1文字のみ
- `multi_unordered`: `requiredSelections` 文字、重複なし。API側でソートして正規化
- `multi_ordered`: `requiredSelections` 文字、重複なし。入力順を保持
- `multi_ordered_dup`: `requiredSelections` 文字、重複あり。入力順を保持

処理内容:
1. `resultSymbols` を正規化（`multi_unordered` はソート）
2. `games.result_symbols` を更新
3. `games.status` を `finished` に更新
4. `DELETE FROM point_history WHERE game_id = ? AND reason = 'game_result'`（結果修正時の冪等性確保）
5. `bets.selected_symbols = games.result_symbols` の一致判定で当選者を特定
6. 当選した賭けごとに獲得ポイントを計算し `point_history` に INSERT（`reason = 'game_result'`）

**備考**: 結果を修正する場合は同エンドポイントを再度呼び出す。手順4の DELETE により旧レコードが除去され、新結果で再計算される。`debt_history` は変更不要。

**レスポンス**: `200 OK` (ゲーム詳細と同形式)

---

## 賭け状況 API

### ゲームの賭け状況取得
```
GET /api/games/:gameId/bets
```

**倍率計算（パリミュチュエル方式）**

集計単位は `bets.selected_symbols` の組み合わせ文字列。`single` / 複数方式を問わず同一ロジックで計算する。

```
組み合わせの倍率 = 総賭けポイント合計 ÷ その組み合わせへの賭けポイント合計
当選時獲得ポイント = 賭けたポイント × 倍率（小数点以下切り捨て）
```

人気（賭けが多い）組み合わせほど倍率が低く、不人気組み合わせほど倍率が高くなる。

**レスポンス**
```json
{
  "data": {
    "betType": "multi_ordered",
    "requiredSelections": 3,
    "totalPoints": 1000,
    "combinations": [
      {
        "selectedSymbols": "BDE",
        "selectedLabels": ["チームB", "チームD", "チームE"],
        "totalPoints": 600,
        "betCount": 3,
        "odds": 1.67
      },
      {
        "selectedSymbols": "BED",
        "selectedLabels": ["チームB", "チームE", "チームD"],
        "totalPoints": 400,
        "betCount": 2,
        "odds": 2.5
      }
    ],
    "bets": [
      {
        "userId": 1,
        "userName": "User A",
        "selectedSymbols": "BDE",
        "selectedLabels": ["チームB", "チームD", "チームE"],
        "amount": 100,
        "isDebt": false,
        "result": "win",
        "pointChange": 167
      }
    ]
  }
}
```

`result` の値: `win` / `lose` / `null`（結果未確定）  
`pointChange`: 結果確定後のみ含まれる（`賭けたポイント × 確定時の倍率`、小数点以下切り捨て）  
`betType = 'single'` 時は `combinations[].selectedSymbols` が1文字、`selectedLabels` が1要素になる（`requiredSelections: null`）

---

### 賭け作成・上書き（upsert）
```
PUT /api/games/:gameId/bets
```

同一ゲームへの賭けが既にある場合は上書きする。

**リクエストボディ**
```json
{
  "discordId": "123456789012345678",
  "selectedSymbols": "BDE",
  "amount": 50,
  "allowDebt": false
}
```

| フィールド | 型 | 必須 | バリデーション |
|-----------|-----|------|--------------|
| discordId | string | ○ | Discord ユーザーID |
| selectedSymbols | string | ○ | 選択する記号の結合文字列。`betType` に応じたバリデーションを適用 |
| amount | number | ○ | 1以上の整数 |
| allowDebt | boolean | - | 借金を許可するか（省略時: `false`） |

**`betType` ごとの `selectedSymbols` バリデーション**:

| 条件 | `single` | `multi_unordered` | `multi_ordered` | `multi_ordered_dup` |
|------|----------|-------------------|-----------------|---------------------|
| 文字数 = `requiredSelections` | ○（1文字） | ○ | ○ | ○ |
| 各文字が `bet_options.symbol` に存在する | ○ | ○ | ○ | ○ |
| 重複文字なし | ○ | ○ | ○ | 不要 |
| 正規化（昇順ソート） | - | ○（API側で実施） | - | - |

**制約**:
- ゲームの `status` が `open` であること
- 締め切り前であること
- `allowDebt = false` の場合、`amount` が所持ポイント以下であること

**処理内容（新規・`allowDebt = false`）**:
1. 集計ポイント（`events.initial_points + SUM(point_history WHERE user_id=? AND event_id=?)`）が `amount` 以上か確認
2. `bets` にレコードを挿入（`is_debt = false`）
3. `point_history` に INSERT（`change_amount = -amount`, `reason = 'bet_placed'`）

**処理内容（新規・`allowDebt = true`）**:
1. `bets` にレコードを挿入（`is_debt = true`）
2. `debt_history` に INSERT（`change_amount = +amount`, `reason = 'bet_placed'`）

**処理内容（上書き時）**:
1. 旧賭けの種別に応じた返却レコードを挿入
   - 旧 `is_debt = false` → `point_history` に INSERT（`change_amount = +旧amount`, `reason = 'bet_refunded'`）
   - 旧 `is_debt = true` → `debt_history` に INSERT（`change_amount = -旧amount`, `reason = 'bet_refunded'`）
2. 賭けレコードを更新（`selected_symbols`, `amount`, `is_debt`, `updated_at`）
3. 新賭けの種別に応じた消費レコードを挿入（新規時と同様）

**処理内容（結果確定時・当選）**:
- `point_history` に INSERT（`change_amount = +獲得ポイント`, `reason = 'game_result'`）（借金との自動相殺なし）

**レスポンス**: `200 OK`（新規作成時も上書き時も同じ）
```json
{
  "data": {
    "id": 1,
    "gameId": 1,
    "userId": 1,
    "selectedSymbols": "BDE",
    "selectedLabels": ["チームB", "チームD", "チームE"],
    "amount": 50,
    "isDebt": false,
    "debtAmount": 0,
    "isUpdated": false,
    "createdAt": "2024-01-01T11:00:00Z",
    "updatedAt": "2024-01-01T11:00:00Z"
  }
}
```

| フィールド | 説明 |
|-----------|------|
| `selectedSymbols` | 登録済みの記号文字列（`multi_unordered` はソート済み） |
| `selectedLabels` | 記号に対応する項目名の配列（記号の順序と一致） |
| `isDebt` | この賭けが借金かどうか |
| `debtAmount` | この賭けで増加した借金額（借金でない場合は `0`） |
| `isUpdated` | 新規作成時 `false`、上書き時 `true` |

---

## ユーザー API

### ユーザー一覧取得
```
GET /api/users
```

`points` および `debt` はキャッシュ値ではなく、クエリパラメータ `eventId` で指定したイベントの履歴テーブルから集計した値を返す。`debt` フィールドは管理者トークンが付与されている場合のみレスポンスに含まれる。

**クエリパラメータ**

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| eventId | ○ | 集計対象のイベントID |

**レスポンス（一般）**
```json
{
  "data": [
    {
      "id": 1,
      "discordId": "123456789012345678",
      "discordName": "User A",
      "points": 1500
    }
  ]
}
```

**レスポンス（管理者）**
```json
{
  "data": [
    {
      "id": 1,
      "discordId": "123456789012345678",
      "discordName": "User A",
      "points": 1500,
      "debt": 3000
    }
  ]
}
```

---

### ユーザー詳細取得
```
GET /api/users/:id
```

`points` / `debt` はイベント単位の集計値。`eventId` を省略した場合は開催中イベント（`is_active = TRUE`）を使用する。  
`debt` フィールドは管理者トークンが付与されている場合のみレスポンスに含まれる。

**クエリパラメータ**

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| eventId | - | 集計対象のイベントID。省略時は開催中イベント |

**レスポンス（一般）**
```json
{
  "data": {
    "id": 1,
    "discordId": "123456789012345678",
    "discordName": "User A",
    "points": 1500,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**レスポンス（管理者）**
```json
{
  "data": {
    "id": 1,
    "discordId": "123456789012345678",
    "discordName": "User A",
    "points": 1500,
    "debt": 3000,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### ユーザー取得（Discord ID 指定）
```
GET /api/users/discord/:discordId
```

クエリパラメータ・レスポンス形式はユーザー詳細取得（`GET /api/users/:id`）と同形式。

---

### ポイント履歴取得
```
GET /api/users/:id/point-history
```

**レスポンス**
```json
{
  "data": [
    {
      "id": 1,
      "gameId": 1,
      "gameTitle": "第1試合",
      "changeAmount": 70,
      "reason": "game_result",
      "createdAt": "2024-01-01T12:30:00Z"
    }
  ]
}
```

---

### ユーザーのイベント内賭け一覧取得
```
GET /api/users/:id/event-bets/:eventId
```

管理者トークン不要。Discord Bot の `/mybets` コマンドから使用する。

**パスパラメータ**

| パラメータ | 説明 |
|-----------|------|
| id | ユーザーID（内部） |
| eventId | イベントID |

**レスポンス**
```json
{
  "data": {
    "eventId": 1,
    "eventName": "〇〇大会",
    "currentPoints": 9720,
    "bets": [
      {
        "gameId": 1,
        "gameTitle": "第1試合",
        "gameStatus": "finished",
        "betType": "single",
        "requiredSelections": null,
        "deadline": "2024-01-01T12:00:00Z",
        "selectedSymbols": "A",
        "selectedLabels": ["チームA"],
        "amount": 50,
        "isDebt": false,
        "odds": null,
        "estimatedPayout": null,
        "result": "win",
        "pointChange": 70
      },
      {
        "gameId": 3,
        "gameTitle": "第3試合",
        "gameStatus": "open",
        "betType": "multi_ordered",
        "requiredSelections": 3,
        "deadline": "2024-01-02T12:00:00Z",
        "selectedSymbols": "BDE",
        "selectedLabels": ["チームB", "チームD", "チームE"],
        "amount": 200,
        "isDebt": false,
        "odds": 1.8,
        "estimatedPayout": 160,
        "result": null,
        "pointChange": null
      }
    ]
  }
}
```

| フィールド | 説明 |
|-----------|------|
| `currentPoints` | 現時点での所持ポイント（`events.initial_points + SUM(point_history)`） |
| `betType` | 賭け方式（`single` / `multi_unordered` / `multi_ordered` / `multi_ordered_dup`） |
| `requiredSelections` | 選択必要数（`single` 時は `null`） |
| `selectedSymbols` | 登録済みの記号文字列（`multi_unordered` はソート済み） |
| `selectedLabels` | 記号に対応する項目名の配列（記号の順序と一致） |
| `gameStatus` | `open`（受付中）/ `closed`（締切済）/ `finished`（結果確定） |
| `odds` | 組み合わせのパリミュチュエル倍率（`finished` 時は `null`） |
| `estimatedPayout` | 現在倍率での当選時獲得ポイント予定（`finished` 時は `null`） |
| `result` | `win` / `lose` / `null`（未確定） |
| `pointChange` | ゲーム確定後のポイント増減（`finished` 時のみ。`win` は正値、`loss` は `0`） |

---

### ユーザーのイベント別賭け結果取得
```
GET /api/users/:id/event-results/:eventId
```

**レスポンス**
```json
{
  "data": {
    "userId": 1,
    "eventId": 1,
    "totalPointChange": 500,
    "totalDebt": 80,
    "totalAssets": 10420,
    "totalAssetsChange": -580,
    "wins": 3,
    "losses": 1,
    "games": [
      {
        "gameId": 1,
        "gameTitle": "第1試合",
        "betType": "single",
        "requiredSelections": null,
        "selectedSymbols": "A",
        "selectedLabels": ["チームA"],
        "amount": 50,
        "isDebt": false,
        "debtChange": 0,
        "pointChange": 70,
        "result": "win"
      }
    ]
  }
}
```

| フィールド | 説明 |
|-----------|------|
| `totalPointChange` | イベント中のポイント増減合計 |
| `totalDebt` | イベント内の借金総額（`SUM(debt_history.change_amount) WHERE user_id=? AND event_id=?`） |
| `totalAssets` | `最終所持ポイント - totalDebt` |
| `totalAssetsChange` | `totalAssets - events.initial_points` |
| `selectedSymbols` | 登録済みの記号文字列（`multi_unordered` はソート済み） |
| `selectedLabels` | 記号に対応する項目名の配列 |
| `debtChange` | そのゲームで増加した借金額（借金賭けなし時は `0`） |
