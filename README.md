# FavoriteShopMemo

Udemyで新たに学習したTypeScript、Git、Dockerのアウトプットとして、ポートフォリオ2作品目を作成

## コンセプト

- 情報集約メモアプリ

## 制作きっかけ

- これまで標準的なメモアプリを使用する際には、文章やURLリンク等のテキスト情報を書き留めていたが、後に見返す際には情報が不十分だと感じてしまい、結局Webで再検索して情報を取得していた。
- そこで、テキスト情報だけでなく地図情報等も集約できるアプリを作成してみた。

## 重視した点

- 外部連携 API（Google Map, HotPepper）の利用
- GitHub でブランチを切り、プルリクエストでコードレビューを依頼し、承認を得た後に本番環境へマージ
- 認証系の実装(できるだけ自力で)
- DB操作に対してORMを使用
- Dockerによる仮想環境の利用

## 技術内容

- 言語: HTML/CSS/TypeScript(JavaScript)
- バックエンド: Node.js v18.6.0
- フレームワーク: Express v4.16.1
- DB: MySQL v8.0.32
- ORM: Sequelize v6.32.1
- 認証系: passport v0.6.0
- インフラ: Docker v24.0.2
- バージョン管理: git
