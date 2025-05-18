class CommentsChannel < ApplicationCable::Channel
  # クライアントが接続したときに呼ばれる
  def subscribed
    # 'comments_channel' という名前のストリームからデータを受け取るように設定
    stream_from "comments_channel"
    puts "Client subscribed to comments_channel" # デバッグ用
  end

  # クライアントが切断したときに呼ばれる
  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    puts "Client unsubscribed from comments_channel" # デバッグ用
  end
end 