#!/bin/bash
set -e

# Rails特有のserver.pidが存在すれば削除
if [ -f /app/tmp/pids/server.pid ]; then
  rm /app/tmp/pids/server.pid
fi

# 初回起動時や必要に応じてデータベースのセットアップを行う
bundle exec rails db:prepare

# docker-compose.yml の command や Dockerfile の CMD で指定されたコマンドを実行
exec "$@" 
