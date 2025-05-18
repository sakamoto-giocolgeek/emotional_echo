module Api
  module V1
    class CommentsController < ApplicationController
      # GET /api/v1/comments
      # 初期表示用のコメントは返さないようにする
      def index
        # comments = Comment.order(created_at: :desc).limit(20)
        render json: [] # 空の配列を返す
      end

      # POST /api/v1/comments
      def create
        comment = Comment.new(comment_params)

        # ****** SentimentAnalyzerService を呼び出す ******
        begin
          comment.sentiment_score = SentimentAnalyzerService.analyze(comment.content)
        rescue StandardError => e
          # サービス呼び出し自体で予期せぬエラーが起きた場合 (サービス内で処理されるはずだが念のため)
          Rails.logger.error("Error calling SentimentAnalyzerService: #{e.message}")
          comment.sentiment_score = 0.5 # デフォルト値
        end
        # ************************************************

        if comment.save
          # 保存成功後、Action Cable経由でブロードキャスト
          # チャンネル名は 'comments_channel' など、任意の名前にする
          ActionCable.server.broadcast('comments_channel', comment.as_json)
          render json: comment, status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def comment_params
        params.require(:comment).permit(:content)
      end
    end
  end
end 