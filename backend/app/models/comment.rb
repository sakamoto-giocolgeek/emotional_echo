class Comment < ApplicationRecord
  validates :content, presence: true
  # sentiment_score はコントローラーで設定

  # Turbo Streams用のbroadcasts_toは削除
  # broadcasts_to ->(comment) { :comments }, inserts_by: :prepend, target: "comments_container"
end
