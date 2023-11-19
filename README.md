# FavoriteShopMemo

Udemyで新たに学習したTypeScript、Git、Dockerのアウトプットとして、ポートフォリオ2作品目を作成  
[FavoriteShopMemoApp](http://favorite-shop-memo.com) (公開停止中)

## コンセプト

- 情報集約メモアプリ

## 制作きっかけ

- これまで標準的なメモアプリを使用する際には、文章やURLリンク等のテキスト情報を書き留めていたが、後に見返す際には情報が不十分だと感じてしまい、結局Webで再検索して情報を取得していた。
- そこで、テキスト情報だけでなく地図情報等も集約できるアプリを作成してみた。

## 重視した点

- 外部連携API（Google Maps, HotPepper）の利用
- 認証系の実装
- DB操作に対してORMを使用
- Dockerによる仮想環境の利用
- DB接続設定に環境変数を利用 (dotenv)
- ユーザーパスワードをハッシュ化して管理 (bcrypt)
- GitHubでブランチを切り、プルリクエストでコードレビューを依頼し、承認を得た後に本番環境へマージ

## 技術内容

- フロントサイド: HTML/CSS/JavaScript
- サーバーサイド: TypeScript Node.js v18.6.0
- フレームワーク: Express v4.16.1
- DB: MySQL v8.0.32
- ORM: Sequelize v6.32.1
- 認証系: passport v0.6.0
- インフラ: Docker v24.0.2
- バージョン管理: git

## 実装した機能
- ユーザー登録
- ログイン機能
- メモカテゴリーの登録,表示,編集
- メモカテゴリーの表示順序をドラッグアンドドロップで入れ替え
- メモの登録,表示,編集
- メモしたお店の地図をGoogleMapsで表示
- メモしたお店がHotPepperに掲載されていれば、そのURLをメモに追加
