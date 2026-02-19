'use client';

import React from 'react';

export default function SupportPage() {
    return (
        <div style={{
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem'
        }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffffff' }}>☕ 개발자 커피사주기</h1>

            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid #eee'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</div>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#555' }}>따뜻한 응원 한마디가<br />큰 힘이 됩니다!</h2>
                <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: '1.6' }}>
                    이소에 앱을 더 좋게 만들기 위해<br />
                    항상 노력하고 있습니다.
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <a
                        href="https://www.postype.com/@rumi1111/post/21676135"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#000000ff', // 포스타입 브랜드 느낌의 레드 혹은 포인트 컬러
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '2rem',
                            fontSize: '1rem',
                            fontWeight: '700',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(251, 255, 0, 0.3)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 59, 48, 0.4)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.3)'; }}
                    >
                        포스타입으로 후원하기 📮
                    </a>
                </div>

                <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666' }}>
                    위 버튼을 클릭하면 후원 페이지로 이동합니다.
                </p>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
                항상 이용해 주셔서 감사합니다. ❤️
            </p>
        </div>
    );
}
