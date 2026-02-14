'use client';

import { useState, useEffect } from 'react';

export default function ZoomableImage({ src, alt }) {
    const [isZoomed, setIsZoomed] = useState(false);

    const toggleZoom = () => {
        console.log('Toggle zoom clicked, current state:', isZoomed);
        setIsZoomed(!isZoomed);
    };

    // ESC 키로 닫기 기능 추가
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsZoomed(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // 확대 시 스크롤 방지
    useEffect(() => {
        if (isZoomed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isZoomed]);

    return (
        <>
            <div
                onClick={toggleZoom}
                style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    cursor: 'zoom-in',
                    transition: 'transform 0.2s ease'
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            {/* 확대 모달 오버레이 */}
            {isZoomed && (
                <div
                    onClick={toggleZoom}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999, // 최대한 높게 설정
                        cursor: 'zoom-out',
                        padding: '1rem',
                        backdropFilter: 'blur(10px)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            boxShadow: '0 0 40px rgba(0,0,0,0.8)'
                        }}
                    />

                    {/* 닫기 버튼 */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            zIndex: 10000,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
