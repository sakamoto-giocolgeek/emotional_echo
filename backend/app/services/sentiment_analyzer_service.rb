require 'openai'
require 'json'

class SentimentAnalyzerService
  # OpenAI API クライアントのインスタンス
  # initializer で初期化しても良い
  # client = OpenAI::Client.new

  # 分析を実行するメソッド
  def self.analyze(text)
    client = OpenAI::Client.new # メソッド内で毎回 new するか、クラス変数/インスタンス変数にするかはお好みで

    # OpenAI APIに送るプロンプト
    # 出力形式を指示して、スコアを抽出しやすくする
    prompt = <<~PROMPT
    以下のテキストの感情を分析し、-1.0 (非常にネガティブ) から 1.0 (非常にポジティブ) の間の数値スコアで評価してください。
    結果はJSON形式で {"sentiment_score": 数値} のように返してください。

    テキスト: "#{text}"
    PROMPT

    begin
      # Chat Completions API を呼び出す (モデルは適宜選択)
      response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo", # または "gpt-4" など
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2, # 結果の多様性を抑える
          max_tokens: 50    # 応答の最大長を制限
        }
      )

      # レスポンスからJSON文字列を取得
      json_response = response.dig("choices", 0, "message", "content")

      if json_response
        # JSONをパース
        parsed_response = JSON.parse(json_response)
        raw_score = parsed_response["sentiment_score"].to_f

        # スコアを -1.0〜1.0 から 0.0〜1.0 の範囲に正規化
        normalized_score = (raw_score + 1.0) / 2.0

        # 範囲内に収める (念のため)
        normalized_score.clamp(0.0, 1.0)
      else
        # 応答が期待通りでない場合、デフォルト値 (中間) を返す
        Rails.logger.error("OpenAI API response content was nil or unexpected: #{response}")
        0.5
      end

    rescue JSON::ParserError => e
      # JSONパースに失敗した場合
      Rails.logger.error("Failed to parse OpenAI API response: #{e.message}")
      Rails.logger.error("Response body: #{json_response}")
      0.5 # デフォルト値
    rescue OpenAI::Error => e
      # OpenAI API呼び出しでエラーが発生した場合
      Rails.logger.error("OpenAI API error: #{e.message}")
      0.5 # デフォルト値
    rescue StandardError => e
      # その他の予期せぬエラー
      Rails.logger.error("Unexpected error during sentiment analysis: #{e.message}")
      0.5 # デフォルト値
    end
  end
end 