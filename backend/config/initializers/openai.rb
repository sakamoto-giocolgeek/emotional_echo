OpenAI.configure do |config|
  # 環境変数 'OPENAI_API_KEY' から API キーを読み込む
  # fetch は環境変数が存在しない場合にエラーを発生させる
  config.access_token = ENV.fetch('OPENAI_API_KEY')
  # もし環境変数がなくてもエラーにしたくない場合は ENV['OPENAI_API_KEY'] を使う
  # config.access_token = ENV['OPENAI_API_KEY']

  # オプション: 組織IDが必要な場合
  # config.organization_id = ENV.fetch("OPENAI_ORGANIZATION_ID", nil) # nilはデフォルト値
end 