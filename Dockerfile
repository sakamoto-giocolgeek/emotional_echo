# Rubyの公式イメージをベースにする
ARG RUBY_VERSION=3.2.2
FROM ruby:$RUBY_VERSION

# 必要なOSパッケージをインストール
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    pkg-config \
    libpq-dev \
    nodejs \
    yarn \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Gemfileをコピーしてbundle installを実行
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install --jobs $(nproc) --retry 3

# アプリケーションコードをコピー (backend全体をコピー)
COPY backend/. ./

# ポート3000を公開
EXPOSE 3000

# コンテナ起動時に実行されるスクリプト
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# デフォルトのコマンドをPumaサーバー起動に変更
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"] 
