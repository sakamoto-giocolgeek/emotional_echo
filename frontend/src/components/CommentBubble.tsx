import React, { useEffect, useState, useRef } from 'react';

interface Comment {
    id: number;
    content: string;
    sentiment_score: number;
    created_at: string;
}

interface CommentBubbleProps {
    comment: Comment;
    onRemove: (id: number) => void;
}

const CommentBubble: React.FC<CommentBubbleProps> = ({ comment, onRemove }) => {
    // useRefを使って初期位置を保存
    const positionRef = useRef({
        top: Math.floor(Math.random() * 50 + 10), // 10%〜60%の範囲でランダム
        left: Math.floor(Math.random() * 70 + 15), // 15%〜85%の範囲でランダム
    });
    
    // useStateではなくuseRefを使う
    const animationStartedRef = useRef(false);
    
    // 感情スコアに基づく色を計算 - よりエモーショナルなカラーパレット
    const getColor = (score: number) => {
        if (score < 0.3) {
            return 'rgba(255, 190, 200, 0.8)'; // ピンク (ネガティブ)
        } else if (score < 0.5) {
            return 'rgba(255, 205, 170, 0.8)'; // オレンジピンク (やや否定的)
        } else if (score < 0.7) {
            return 'rgba(185, 210, 250, 0.8)'; // 水色 (やや肯定的)
        } else {
            return 'rgba(200, 185, 255, 0.8)'; // 薄紫 (ポジティブ)
        }
    };
    
    const backgroundColor = getColor(comment.sentiment_score);
    const textColor = 'rgba(80, 80, 110, 0.95)';
    
    useEffect(() => {
        // 既にアニメーションが始まっている場合は何もしない
        if (animationStartedRef.current) return;
        animationStartedRef.current = true;
        
        // 削除タイマーのみを設定
        const timer = setTimeout(() => {
            onRemove(comment.id);
        }, 5000);
        
        return () => clearTimeout(timer);
    }, [comment.id, onRemove]);
    
    return (
        <div
            style={{
                position: 'fixed',
                top: `${positionRef.current.top}%`,
                left: `${positionRef.current.left}%`,
                backgroundColor: backgroundColor,
                color: textColor,
                padding: '15px 25px',
                borderRadius: '30px',
                boxShadow: '0 4px 15px rgba(180, 160, 220, 0.25), 0 1px 3px rgba(255, 255, 255, 0.3)',
                fontSize: '18px',
                fontWeight: 500,
                fontFamily: "'Poppins', 'Noto Sans JP', sans-serif",
                zIndex: 50,
                maxWidth: '300px',
                textAlign: 'center',
                animation: 'fadeInAndFloat 5s forwards',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.7)'
            }}
        >
            {comment.content}
        </div>
    );
};

export default CommentBubble; 