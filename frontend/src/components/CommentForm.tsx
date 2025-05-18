import React, { useState, useRef, useEffect } from 'react';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // フォーカスを設定する関数
    const focusInput = () => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };
    
    // 初回マウント時にフォーカス
    useEffect(() => {
        focusInput();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!content.trim() || isSubmitting || isComposing) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent('');
            focusInput();
        } catch (error) {
            console.error("Submission failed in form:", error);
        } finally {
            setIsSubmitting(false);
            focusInput();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing) return;
        
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const form = event.currentTarget.closest('form');
            if (form) {
                const fakeSubmitEvent = new Event('submit', { bubbles: true, cancelable: true });
                handleSubmit(fakeSubmitEvent as unknown as React.FormEvent<HTMLFormElement>);
            }
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                maxWidth: '800px', 
                margin: '0 auto',
                position: 'relative',
                padding: '8px'
            }}
        >
            <div style={{ 
                flexGrow: 1,
                flexShrink: 1,
                maxWidth: 'calc(100% - 110px)'
            }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => {
                        setIsComposing(false);
                        setTimeout(() => {
                            inputRef.current?.focus();
                        }, 0);
                    }}
                    placeholder="ここに気持ちを書いてみましょう..."
                    style={{ 
                        width: '100%', 
                        padding: '12px 20px', 
                        border: '1px solid rgba(220, 200, 250, 0.5)',
                        borderRadius: '24px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        color: '#695e8a',
                        fontFamily: "'Poppins', 'Noto Sans JP', sans-serif",
                        fontSize: '16px',
                        outline: 'none',
                        backdropFilter: 'blur(5px)',
                        boxShadow: 'inset 0 2px 4px rgba(180, 160, 220, 0.15)',
                        boxSizing: 'border-box'
                    }}
                    disabled={isSubmitting}
                    autoFocus
                />
            </div>
            
            <button
                type="submit"
                style={{ 
                    background: 'linear-gradient(to right, #9384db, #8aa5e6)',
                    color: 'white',
                    padding: '12px 24px',
                    minWidth: '90px',
                    borderRadius: '24px', 
                    fontFamily: "'Poppins', 'Noto Sans JP', sans-serif",
                    fontWeight: 500,
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(150, 140, 200, 0.3)',
                    flexShrink: 0
                }}
                disabled={isSubmitting || isComposing}
            >
                {isSubmitting ? '送信中...' : 'Echo'}
            </button>
        </form>
    );
};

export default CommentForm; 