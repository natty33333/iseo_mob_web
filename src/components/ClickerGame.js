"use client";

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './ClickerGame.module.css';

export default function ClickerGame({
    maxHp = 1000000,
    idleImage = "😐",
    hitImage = "😵",
    koImage = "💀"
}) {
    const { data: session } = useSession();

    const [score, setScore] = useState(0);
    const [hp, setHp] = useState(maxHp);
    const [status, setStatus] = useState('idle'); // 'idle', 'hit', 'ko'
    const [hits, setHits] = useState([]);

    // Server Sync State
    const [rankings, setRankings] = useState([]);
    const [lastSyncedScore, setLastSyncedScore] = useState(0);
    const [myRankIndex, setMyRankIndex] = useState(-1);
    const [rankUpMessage, setRankUpMessage] = useState(false);

    // Nickname State
    const [nickname, setNickname] = useState('');
    const [isEditingNickname, setIsEditingNickname] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const containerRef = useRef(null);
    const hitTimeoutRef = useRef(null);
    const syncTimeoutRef = useRef(null);

    // Audio function to support rapid overlapping clicks
    const playHitSound = () => {
        const audio = new Audio('/hit.mp3');
        audio.volume = 0.5; // 너무 시끄럽지 않게 볼륨 조절
        audio.play().catch(e => console.log('Audio play failed (maybe no interaction yet): ', e));
    };

    // Initial Fetch
    useEffect(() => {
        fetch('/api/game/rank')
            .then(res => res.json())
            .then(data => {
                if (data.rankings) {
                    setRankings(data.rankings);

                    if (session?.user?.email) {
                        const myIndex = data.rankings.findIndex(r => r.email === session.user.email);
                        if (myIndex !== -1) {
                            const myDbScore = Number(data.rankings[myIndex].score);
                            setScore(myDbScore);
                            setLastSyncedScore(myDbScore);
                            setMyRankIndex(myIndex);

                            // Initialize nickname from DB if available (and not just google token name if possible, though we don't have distinction here easily)
                            if (data.rankings[myIndex].name) {
                                setNickname(data.rankings[myIndex].name);
                            }

                            // Adjust HP based on existing hits
                            const remainingHp = Math.max(0, maxHp - myDbScore);
                            setHp(remainingHp);
                            if (remainingHp === 0) setStatus('ko');
                        }
                    }
                }
            })
            .catch(console.error);
    }, [session?.user?.email, maxHp]);

    // Handle Ranking Updates and Animation
    const updateRankingsWithAnimation = (newRankings) => {
        setRankings(newRankings);

        if (session?.user?.email) {
            const newIndex = newRankings.findIndex(r => r.email === session.user.email);

            // Check for Rank Up (index is smaller means rank is higher)
            if (myRankIndex !== -1 && newIndex !== -1 && newIndex < myRankIndex) {
                setRankUpMessage(true);
                setTimeout(() => setRankUpMessage(false), 2000);
            }

            setMyRankIndex(newIndex);
        }
    };

    // Sync Debounce logic
    useEffect(() => {
        if (!session?.user?.email) return;

        if (score > lastSyncedScore) {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

            syncTimeoutRef.current = setTimeout(() => {
                fetch('/api/game/rank', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score, nickname: nickname || undefined })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            updateRankingsWithAnimation(data.rankings);
                            setLastSyncedScore(score);
                        }
                    })
                    .catch(console.error);
            }, 1000); // 1초간 입력이 멈추거나 모이면 동기화 (네트워크 부하 방지)
        }

        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        };
    }, [score, lastSyncedScore, session?.user?.email, myRankIndex, nickname]);

    // Force explicit save of nickname
    const handleSaveNickname = () => {
        setIsEditingNickname(false);
        // Trigger immediate sync
        fetch('/api/game/rank', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score, nickname })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    updateRankingsWithAnimation(data.rankings);
                }
            })
            .catch(console.error);
    };

    const handleRefreshRanking = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        fetch('/api/game/rank')
            .then(res => res.json())
            .then(data => {
                if (data.rankings) {
                    updateRankingsWithAnimation(data.rankings);
                }
            })
            .catch(console.error)
            .finally(() => {
                setTimeout(() => setIsRefreshing(false), 500);
            });
    };

    const handleInteraction = (e) => {
        if (hp <= 0) return;

        playHitSound();

        // 햅틱 진동 효과 (모바일 기기 지원)
        if (typeof window !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50); // 50ms 동안 짧게 진동
        }

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;

            // Touch fallback if necessary (standard onClick might not have touches on all types)
            if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            } else if (e.nativeEvent && e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
                clientX = e.nativeEvent.touches[0].clientX;
                clientY = e.nativeEvent.touches[0].clientY;
            }

            const x = clientX - rect.left - 20;
            const y = clientY - rect.top - 20;

            const newHit = {
                id: Date.now() + Math.random(),
                x,
                y,
                rotation: (Math.random() - 0.5) * 40
            };

            setHits(prev => [...prev, newHit]);

            setTimeout(() => {
                setHits(prev => prev.filter(hit => hit.id !== newHit.id));
            }, 600);
        }

        setScore(prev => prev + 1);

        setHp(prev => {
            const nextHp = prev - 1;
            if (nextHp <= 0) {
                setStatus('ko');
                if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);
                return 0;
            }
            return nextHp;
        });

        if (hp > 1) {
            setStatus('hit');
            if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);
            hitTimeoutRef.current = setTimeout(() => {
                setStatus(prevStatus => prevStatus === 'ko' ? 'ko' : 'idle');
            }, 300);
        }
    };

    let currentImage = idleImage;
    if (status === 'hit') currentImage = hitImage;
    else if (status === 'ko') currentImage = koImage;

    const hpPercentage = (hp / maxHp) * 100;

    return (
        <div style={{ width: '100%', maxWidth: '500px' }}>
            {/* Nickname Header Editor */}
            {session?.user && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                    {isEditingNickname ? (
                        <>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="새 닉네임"
                                maxLength={15}
                                style={{
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '1rem',
                                    border: '1px solid hsl(var(--border))',
                                    backgroundColor: 'hsl(var(--input))',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    width: '120px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSaveNickname}
                                style={{
                                    padding: '0.3rem 0.8rem',
                                    backgroundColor: '#67e8f9',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >저장</button>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                                닉네임: <span style={{ color: '#67e8f9', fontWeight: 'bold' }}>{nickname || session.user.name || '익명'}</span>
                            </div>
                            <button
                                onClick={() => setIsEditingNickname(true)}
                                style={{
                                    padding: '0.2rem 0.6rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid hsl(var(--border))',
                                    color: 'hsl(var(--foreground))',
                                    borderRadius: '1rem',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >변경</button>
                        </>
                    )}
                </div>
            )}

            {/* Game Card */}
            <div className={styles.container} ref={containerRef} onPointerDown={handleInteraction}>

                {/* RANK UP ANIMATION OVERLAY */}
                {rankUpMessage && (
                    <div className={styles.rankUpAnim}>
                        RANK UP! 🚀
                    </div>
                )}

                <div className={styles.header}>
                    <div className={styles.score}>{score.toLocaleString()}</div>
                    <div className={styles.hpContainer}>
                        <div
                            className={styles.hpBar}
                            style={{ width: `${hpPercentage}%`, backgroundColor: hpPercentage > 30 ? 'hsl(var(--destructive))' : '#ff0000' }}
                        ></div>
                        <div className={styles.hpText}>{hp.toLocaleString()} / {maxHp.toLocaleString()} HP</div>
                    </div>
                </div>

                <div
                    className={`${styles.characterArea} ${status === 'hit' ? styles.hit : ''} ${status === 'ko' ? styles.ko : ''}`}
                >
                    <div className={styles.character}>
                        {currentImage}
                    </div>
                </div>

                {hits.map(hit => (
                    <div
                        key={hit.id}
                        className={styles.floatingText}
                        style={{
                            left: hit.x,
                            top: hit.y,
                            transform: `rotate(${hit.rotation}deg)`
                        }}
                    >
                        -1 HP
                    </div>
                ))}
            </div>

            {/* Ranking List Area */}
            <div className={styles.rankingContainer}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1.5rem' }}>
                    <h3 className={styles.rankingTitle} style={{ margin: 0 }}>🏆 터치 랭킹 🏆</h3>
                    <button
                        onClick={handleRefreshRanking}
                        style={{
                            position: 'absolute',
                            right: 0,
                            background: 'transparent',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'transform 0.3s'
                        }}
                        title="순위 새로고침"
                    >
                        <span style={{
                            display: 'inline-block',
                            transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
                            transition: 'transform 0.5s ease-in-out'
                        }}>
                            🔄
                        </span>
                    </button>
                </div>

                {rankings.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>아직 참여한 유저가 없습니다.</p>
                ) : (
                    <ul className={styles.rankingList}>
                        {rankings.map((userRank, index) => {
                            const isMe = session?.user?.email === userRank.email;

                            let medal = `#${index + 1}`;
                            if (index === 0) medal = '🥇';
                            else if (index === 1) medal = '🥈';
                            else if (index === 2) medal = '🥉';

                            return (
                                <li key={userRank.email} className={`${styles.rankingItem} ${isMe ? styles.myRank : ''}`}>
                                    <div className={styles.rankNum}>{medal}</div>

                                    <div className={styles.rankName}>{userRank.name || '익명'}</div>
                                    <div className={styles.rankScore}>{Number(userRank.score).toLocaleString()} hits</div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
