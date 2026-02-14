'use client';

import { useState } from 'react';

export default function AdminAnswerForm({ inquiryId, initialAnswer }) {
    const [answer, setAnswer] = useState(initialAnswer || '');
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(!initialAnswer);
    const [hasAnswer, setHasAnswer] = useState(!!initialAnswer);

    const handleSave = async () => {
        if (!answer.trim()) return;

        setSaving(true);
        try {
            const response = await fetch('/api/admin/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: inquiryId, answer })
            });

            if (response.ok) {
                alert('답변이 저장되었습니다. ✅');
                setHasAnswer(true);
                setIsEditing(false);
            } else {
                alert('저장 실패했습니다.');
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (!isEditing && !hasAnswer) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.85rem', padding: '0.5rem' }}
            >
                답변 달기 ✍️
            </button>
        );
    }

    if (!isEditing && hasAnswer) {
        return (
            <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: 'rgba(66, 133, 244, 0.1)', borderRadius: '8px', border: '1px solid rgba(66, 133, 244, 0.3)' }}>
                <p style={{ fontSize: '0.8rem', color: '#4285F4', fontWeight: 'bold', marginBottom: '0.4rem' }}>관리자 답변</p>
                <p style={{ fontSize: '0.9rem', color: 'white', whiteSpace: 'pre-wrap' }}>{answer}</p>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: '0.75rem', padding: 0, marginTop: '0.5rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    수정하기
                </button>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '0.8rem' }}>
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변 내용을 입력하세요..."
                rows="3"
                style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--primary)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    resize: 'none',
                    marginBottom: '0.5rem'
                }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                    취소
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !answer.trim()}
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                    {saving ? '저장 중...' : '답변 저장'}
                </button>
            </div>
        </div>
    );
}
