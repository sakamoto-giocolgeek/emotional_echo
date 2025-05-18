class ApplicationController < ActionController::API
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern
  # APIモードではCSRF保護は通常不要
  # protect_from_forgery with: :exception
end
