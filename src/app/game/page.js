"use client";

import { useSession } from 'next-auth/react';
import ClickerGame from '@/components/ClickerGame';

export default function GamePage() {
    const { data: session, status } = useSession();

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', position: 'relative' }}>
            {/* 로그인 안 된 경우 투명 오버레이 띄우기 */}
            {status === 'unauthenticated' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        padding: '2rem',
                        borderRadius: 'var(--radius)',
                        textAlign: 'center',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>로그인이 필요합니다</h2>
                        <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem' }}>
                            소에 클리커 미니 게임을 즐기시려면<br />먼저 로그인을 해주세요!
                        </p>
                        {/* 보통 헤더에 로그인 버튼이 있거나, 여기서 직접 LoginModal 트리거가 가능합니다. */}
                        <p style={{ fontSize: '0.9rem', color: '#67e8f9' }}>
                            (우측 상단 메뉴를 통해 로그인해주세요)
                        </p>
                    </div>
                </div>
            )}

            <h1 style={{ marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>소에 클리커</h1>
            <p style={{ marginBottom: '30px', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
                이소에를 터치해서 공격하세요! 체력이 0이 되면 기절합니다.
            </p>

            <ClickerGame
                maxHp={1000000}
                idleImage={<img src="/images/game/idle.png" alt="idle" style={{ width: '200px', height: 'auto', pointerEvents: 'none' }} />}
                hitImage={<img src="/images/game/hit.png" alt="hit" style={{ width: '200px', height: 'auto', pointerEvents: 'none' }} />}
                koImage={<img src="/images/game/hit.png" alt="ko" style={{ width: '200px', height: 'auto', pointerEvents: 'none' }} />}
            />
        </div>
    );
}
