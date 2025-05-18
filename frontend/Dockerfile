# Node.jsの公式イメージを使用 (LTSバージョン推奨)
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json と yarn.lock をコピーして依存関係をインストール
# これらを先にコピーすることで、コード変更時に毎回インストールし直すのを防ぐ
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# アプリケーションコードをコピー
COPY . .

# Vite開発サーバーが使用するポートを公開 (デフォルトは5173)
EXPOSE 5173

# 開発サーバーを起動 (Viteのデフォルト)
# ホストを 0.0.0.0 にしてコンテナ外からのアクセスを許可
CMD ["yarn", "dev", "--host", "0.0.0.0"] 