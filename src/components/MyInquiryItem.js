'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyInquiryItem({ item }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('정말 이 문의를 삭제하시겠습니까?')) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/contact/delete?id=${item.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('문의가 삭제되었습니다.');
                window.location.reload(); // 리스트 갱신을 위해 새로고침
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="card" style={{ padding: '1.2rem', opacity: isDeleting ? 0.5 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>{item.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                        작성일: {new Date(item.created_at).toLocaleDateString()}
                    </span>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: 'var(--muted-foreground)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--destructive))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                    title="삭제하기"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.8rem', whiteSpace: 'pre-wrap' }}>{item.content}</p>

            {item.answer && (
                <div style={{
                    marginTop: '0.5rem',
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(66, 133, 244, 0.08)',
                    borderRadius: '8px',
                    borderLeft: '4px solid #4285F4'
                }}>
                    <p style={{ fontSize: '0.8rem', color: '#4285F4', fontWeight: 'bold', marginBottom: '0.4rem' }}>관리자 답변 💬</p>
                    <p style={{ fontSize: '0.9rem', color: 'white', whiteSpace: 'pre-wrap' }}>{item.answer}</p>
                </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', justifyContent: 'space-between' }}>
                <span>치지직 닉네임: {item.nickname}</span>
                <span>상태: <span style={{ color: item.answer ? 'var(--primary)' : '#ff9800' }}>
                    {item.answer ? '답변완료' : '확인대기'}
                </span></span>
            </div>
        </div>
    );
}
