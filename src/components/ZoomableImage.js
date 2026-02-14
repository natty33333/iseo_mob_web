'use client';

import { useState } from 'react';

export default function ZoomableImage({ src, alt }) {
    const [isZoomed, setIsZoomed] = useState(false);

    const toggleZoom = () => setIsZoomed(!isZoomed);

    return (
        <>
            <div
                onClick={toggleZoom}
                style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    cursor: 'zoom-in'
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
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 3000,
                        cursor: 'zoom-out',
                        padding: '1rem',
                        backdropFilter: 'blur(5px)'
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
                            animation: 'zoomIn 0.3s ease-out'
                        }}
                    />
                    <button
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
                            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        ✕
                    </button>
                    <style jsx>{`
                        @keyframes zoomIn {
                            from { opacity: 0; transform: scale(0.9); }
                            to { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}
