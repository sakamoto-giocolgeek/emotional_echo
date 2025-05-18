import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { createConsumer } from '@rails/actioncable';
import CommentBubble from './components/CommentBubble';
import { CommentForm } from './utils/moduleResolver';
import './App.css'; // CSSファイルをインポート

// APIとWebSocketのエンドポイントURL (Viteの環境変数から取得)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/cable';

// コメントの型定義
interface Comment {
  id: number;
  content: string;
  sentiment_score: number;
  created_at: string;
}

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const cable = useRef<ReturnType<typeof createConsumer> | null>(null);

  // Action Cable接続 (初回レンダリング時のみ)
  useEffect(() => {
    // すでに接続があれば切断して再接続 (開発時のホットリロード対策)
    if (cable.current) {
        cable.current.disconnect();
    }

    console.log(`Connecting Action Cable to ${wsUrl}`);
    cable.current = createConsumer(wsUrl);

    const channel = cable.current.subscriptions.create('CommentsChannel', {
      connected: () => {
        console.log('Connected to CommentsChannel');
      },
      disconnected: () => {
        console.log('Disconnected from CommentsChannel');
      },
      received: (newComment: Comment) => {
        console.log('Received new comment:', newComment);
        // すでに存在するコメントでなければ追加
        setComments((prevComments) =>
            prevComments.find(c => c.id === newComment.id)
                ? prevComments
                : [...prevComments, newComment]
        );
      },
    });

    // コンポーネントアンマウント時に接続を切断
    return () => {
      console.log('Disconnecting Action Cable');
      channel.unsubscribe();
      cable.current?.disconnect();
    };
  }, []); // wsUrl を依存配列に追加するとURL変更時に再接続するが、通常は不要

  // コメント投稿ハンドラ
  const handleCommentSubmit = async (content: string) => {
    try {
      await axios.post(`${apiUrl}/comments`, { comment: { content } });
      // 投稿成功後、WebSocket経由でコメントが追加されるので、ここでは何もしない
    } catch (error) {
      console.error('Error submitting comment:', error);
      // エラーハンドリング (例: ユーザーに通知)
      if (axios.isAxiosError(error) && error.response) {
         alert(`コメントの投稿に失敗しました: ${error.response.data?.errors?.join(', ')}`);
      } else {
         alert('コメントの投稿中に不明なエラーが発生しました。');
      }
    }
  };

  // コメント削除ハンドラ
  const handleRemoveComment = useCallback((idToRemove: number) => {
    console.log(`[App] Removing comment ${idToRemove}`);
    setComments((prevComments) => prevComments.filter((c) => c.id !== idToRemove));
  }, []);

  // ページ全体のスタイルをHTMLとbodyに適用
  useEffect(() => {
    // アニメーション用のスタイルシートを作成
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      /* キーフレームアニメーションの定義 */
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* アニメーション用スタイル */
      #animated-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1000;
        background: linear-gradient(-45deg, #f8f4ff, #f4f8ff, #fff8fc, #f9f4ff, #fffde7);
        background-size: 400% 400%;
        animation: gradientAnimation 20s ease infinite;
      }
      
      /* モヤモヤ効果用スタイル */
      .gradient-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -999;
        pointer-events: none;
        opacity: 0.4;
      }
      
      /* 1つ目のオーバーレイ */
      #gradient-overlay-1 {
        background: radial-gradient(circle at 30% 40%, 
          rgba(180, 200, 255, 0.3) 0%, 
          rgba(255, 255, 255, 0) 60%);
        filter: blur(100px);
        animation: moveAround1 30s ease-in-out infinite alternate;
      }
      
      /* 2つ目のオーバーレイ */
      #gradient-overlay-2 {
        background: radial-gradient(circle at 70% 60%, 
          rgba(250, 180, 230, 0.3) 0%, 
          rgba(255, 255, 255, 0) 60%);
        filter: blur(100px);
        animation: moveAround2 35s ease-in-out infinite alternate;
      }
      
      /* 3つ目のオーバーレイ */
      #gradient-overlay-3 {
        background: radial-gradient(ellipse at 40% 70%, 
          rgba(190, 225, 255, 0.3) 0%, 
          rgba(255, 255, 255, 0) 70%);
        filter: blur(110px);
        animation: moveAround3 45s ease-in-out infinite alternate;
      }
      
      /* アニメーション定義 */
      @keyframes moveAround1 {
        0% { transform: translate(-5%, -5%) scale(1.1); }
        100% { transform: translate(5%, 5%) scale(0.9); }
      }
      
      @keyframes moveAround2 {
        0% { transform: translate(5%, -5%) scale(0.9); }
        100% { transform: translate(-5%, 5%) scale(1.1); }
      }
      
      @keyframes moveAround3 {
        0% { transform: translate(0%, 5%) scale(1); }
        100% { transform: translate(0%, -5%) scale(1.2); }
      }
      
      /* バブルアニメーション */
      @keyframes fadeInAndFloat {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        10% {
          opacity: 1;
          transform: translateY(15px);
        }
        80% {
          opacity: 1;
          transform: translateY(-30px);
        }
        100% {
          opacity: 0;
          transform: translateY(-50px);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    // 背景とオーバーレイ要素を作成して追加
    // アニメーション付きの背景要素
    const animatedBg = document.createElement('div');
    animatedBg.id = 'animated-bg';
    document.body.appendChild(animatedBg);
    
    // モヤモヤ効果用オーバーレイ
    const overlay1 = document.createElement('div');
    overlay1.id = 'gradient-overlay-1';
    overlay1.className = 'gradient-overlay';
    document.body.appendChild(overlay1);
    
    const overlay2 = document.createElement('div');
    overlay2.id = 'gradient-overlay-2';
    overlay2.className = 'gradient-overlay';
    document.body.appendChild(overlay2);
    
    const overlay3 = document.createElement('div');
    overlay3.id = 'gradient-overlay-3';
    overlay3.className = 'gradient-overlay';
    document.body.appendChild(overlay3);
    
    // フォントの追加
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500;700&display=swap';
    document.head.appendChild(fontLink);
    
    // クリーンアップ関数
    return () => {
      // 追加した要素を全て削除
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
      if (document.body.contains(animatedBg)) {
        document.body.removeChild(animatedBg);
      }
      if (document.body.contains(overlay1)) {
        document.body.removeChild(overlay1);
      }
      if (document.body.contains(overlay2)) {
        document.body.removeChild(overlay2);
      }
      if (document.body.contains(overlay3)) {
        document.body.removeChild(overlay3);
      }
      if (document.head.contains(fontLink)) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  return (
    <>
      {/* サービスタイトル */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{ 
          fontFamily: "'Poppins', 'Noto Sans JP', sans-serif", 
          fontSize: '36px', 
          fontWeight: 600,
          letterSpacing: '2px',
          background: 'linear-gradient(45deg, #8e82c8, #6e9cd2, #d186b3)', // 紫、水色、ピンクのグラデーション
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.2)'
        }}>
          Emotional <span style={{ fontWeight: 600 }}>Echo</span>
        </h1>
      </div>
    
      {/* コメント表示エリア */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        overflow: 'hidden' 
      }}>
        {comments.map((comment) => (
          <CommentBubble
            key={comment.id}
            comment={comment}
            onRemove={handleRemoveComment}
          />
        ))}
      </div>

      {/* 画面下部のフォーム - 明示的に下部固定 */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '16px 20px',
        backgroundColor: 'rgba(240, 240, 255, 0.65)', // 薄い紫がかった白
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(210, 200, 250, 0.4)', // 薄い紫のボーダー
        boxShadow: '0 -4px 16px rgba(180, 170, 230, 0.12)', // 紫がかった影
        zIndex: 1000
      }}>
        <CommentForm 
          key={Date.now()}
          onSubmit={handleCommentSubmit} 
        />
      </div>
    </>
  );
}

export default App;
