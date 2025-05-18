# Emotional Echo

感情を分析し、ユーザーの感情状態に基づいて適切なレスポンスを提供するWebアプリケーションです。

## 技術スタック

### バックエンド
- Ruby on Rails 7.2.2
- PostgreSQL 15
- OpenAI API (感情分析用)

### フロントエンド
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Action Cable (WebSocket)

## 開発環境のセットアップ

### 必要条件
- Docker
- Docker Compose
- Node.js (フロントエンド開発用)
- Ruby (バックエンド開発用)

### 環境変数の設定
1. プロジェクトのルートディレクトリに`.env`ファイルを作成
2. 以下の環境変数を設定:
```
OPENAI_API_KEY=your_api_key_here
```

### アプリケーションの起動
1. リポジトリをクローン:
```bash
git clone [repository_url]
cd emotional_echo
```

2. Dockerコンテナのビルドと起動:
```bash
docker-compose up --build
```

3. アプリケーションにアクセス:
- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3001

## 開発

### バックエンド開発
```bash
cd backend
bundle install
rails server
```

### フロントエンド開発
```bash
cd frontend
yarn install
yarn dev
```

## テスト
### バックエンド
```bash
cd backend
bundle exec rspec
```

### フロントエンド
```bash
cd frontend
yarn test
```

## デプロイ
本番環境へのデプロイ手順は[デプロイガイド](docs/deployment.md)を参照してください。

## セットアップ手順（公開リポジトリ用）

このリポジトリは**機密情報を含まない状態**で公開されています。`config/master.key`は含まれていません。利用者は各自で`master.key`を生成し、credentialsを設定してください。

### 1. リポジトリのクローン
```sh
git clone https://github.com/sakamoto-giocolgeek/emotional_echo.git
cd emotional_echo
```

### 2. 必要な依存パッケージのインストール
（例: Railsの場合）
```sh
bundle install
```

### 3. `master.key`の生成とcredentialsの設定

1. `config/master.key`が存在しない場合、以下のコマンドで新規作成できます。
   ```sh
   EDITOR=vi rails credentials:edit
   ```
   - エディタが開くので、必要な設定（例: `secret_key_base`やAPIキーなど）を記入し、保存してください。
   - この操作で`config/master.key`と`config/credentials.yml.enc`が自動生成されます。

2. `config/master.key`は**絶対に公開しないでください**。
   - サーバーやCI/CD環境には安全な方法で配布してください。

### 4. データベースのセットアップ
```sh
rails db:setup
```

### 5. サーバーの起動
```sh
rails server
```

---

## 注意事項
- `config/credentials.yml.enc`は暗号化されているためgit管理されていますが、`config/master.key`は**含まれていません**。
- `master.key`がないとcredentialsの内容は利用できません。
- 各自で`master.key`を生成し、必要な設定を行ってください。
- セキュリティのため、`master.key`は**絶対に公開リポジトリに含めないでください**。

---

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。 