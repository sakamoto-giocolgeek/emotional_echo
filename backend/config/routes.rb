Rails.application.routes.draw do
  # API 用の名前空間
  namespace :api do
    namespace :v1 do
      # コメント取得と作成のエンドポイント
      resources :comments, only: [:index, :create]
    end
  end

  # Action Cable の WebSocket 接続エンドポイント
  mount ActionCable.server => '/cable'

  # ヘルスチェック用 (任意)
  # get "up" => "rails/health#show", as: :rails_health_check

  # ルートパスはAPIモードでは通常不要
  # root "comments#index"
end 