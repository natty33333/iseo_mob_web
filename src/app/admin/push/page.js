'use client';

import { useState } from 'react';

export default function AdminPushPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [url, setUrl] = useState('/');
    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !body) return;

        setSending(true);
        try {
            const response = await fetch('/api/admin/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, body, url })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`알림 전송 성공!`);
                setTitle('');
                setBody('');
            } else {
                alert('알림 전송 실패');
            }
        } catch (error) {
            console.error('Push send error:', error);
            alert('오류 발생');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📢 전체 푸시 발송</h1>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <form onSubmit={handleSend}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>알림 제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 새로운 공지사항이 있습니다!"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>알림 내용</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="알림 상세 내용을 입력하세요."
                            rows="4"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', resize: 'none' }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>클릭 시 이동할 경로 (생략가능)</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="예: /schedule"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending || !title || !body}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        {sending ? '발송 중...' : '푸시 알림 발송 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}
