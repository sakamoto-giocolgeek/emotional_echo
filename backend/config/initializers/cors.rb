# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境のReactサーバーのオリジン
    origins 'http://localhost:5173', 'http://127.0.0.1:5173'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      # credentials: true # Cookieや認証情報を使う場合はtrueにする
      credentials: false
  end

  # 本番環境用の設定例 (必要に応じて変更)
  # allow do
  #   origins 'YOUR_FRONTEND_DOMAIN.com' # 本番のフロントエンドドメイン
  #   resource '*',
  #     headers: :any,
  #     methods: [:get, :post, :options, :head],
  #     credentials: true
  # end
end 