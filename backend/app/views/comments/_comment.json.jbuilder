json.extract! comment, :id, :content, :sentiment_score, :created_at, :updated_at
json.url comment_url(comment, format: :json)
