'use client';

import Image from 'next/image';
import ImageSlider from '@/components/ImageSlider';
import { useState, useEffect } from 'react';

export default function Home() {
  const images = [
    { src: '/iso_main.png', alt: '이소에 메인' },
    { src: '/isoe_1st.png', alt: '이소에 1주년' }
  ];

  const [topRankers, setTopRankers] = useState([]);

  useEffect(() => {
    fetch('/api/game/rank')
      .then(res => res.json())
      .then(data => {
        if (data.rankings) {
          setTopRankers(data.rankings.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  const handleChzzkClick = (e) => {
    e.preventDefault();

    const channelId = '343c202c69ba6d11b7ec51741f9591ac';
    const webUrl = `https://chzzk.naver.com/${channelId}`;
    const ua = navigator.userAgent;

    if (/Android/i.test(ua)) {
      // Android: Attempt to open app via intent scheme
      window.location.href = `intent://chzzk/live/${channelId}#Intent;scheme=navergame;package=com.navercorp.game.android.community;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      // iOS: Attempt to open app via navergame scheme
      window.location.href = `navergame://chzzk/live/${channelId
        } `;
      setTimeout(() => {
        if (document.hasFocus()) {
          window.location.href = webUrl;
        }
      }, 2500);
    } else {
      // Desktop: Open web version in a new window as requested
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleChzzkLink = (e) => {
    e.preventDefault();

    const channelId = "343c202c69ba6d11b7ec51741f9591ac";
    const webUrl = `https://chzzk.naver.com/${channelId}`;
    const appScheme = `navergame://chzzk/show/channel/${channelId}`;

    let isAppOpened = false;

    // 1. 앱이 열렸는지 감지하는 리스너
    const handleBlur = () => {
      isAppOpened = true; // 앱이 열려서 화면이 가려짐
    };
    window.addEventListener('blur', handleBlur, { once: true });

    // 2. 앱 호출 시도 (iframe 방식이 가장 조용함)
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appScheme;
    document.body.appendChild(iframe);

    // 3. 0.5초~1초 정도 기다려보고, 앱이 안 열렸으면 그때서야 새 창 열기
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.removeEventListener('blur', handleBlur);

      // 앱이 안 열렸을 때(isAppOpened가 여전히 false일 때)만 새 창 오픈!
      if (!isAppOpened && !document.hidden) {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 800); // 0.8초 정도가 앱 실행 팝업을 기다려주기에 적당합니다.
  };


  const handleTwitterClick = (e) => {
    e.preventDefault();
    window.open('https://x.com/V_lSOE', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100%',
      height: '100%'
    }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <ImageSlider images={images} />
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#fbbf24' }}>🏆 명예의 전당 🏆</h3>
        {topRankers.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {topRankers.map((ranker, idx) => {
              const medals = ['🥇 1위', '🥈 2위', '🥉 3위'];
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>{medals[idx]}</span>
                  <span style={{ fontWeight: 'bold', color: '#67e8f9', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{ranker.name || '익명'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>{Number(ranker.score).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', opacity: 0.6, margin: 0 }}>랭킹 데이터를 불러오는 중...</p>
        )}
      </div>

      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
        <a
          href="javascript:void(0)"
          onClick={handleChzzkLink}
          className="btn btn-primary"
          style={{ maxWidth: '280px', width: '100%' }}
        >
          치지직 바로가기 🎮
        </a>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <a
          href="https://www.youtube.com/@i_soe"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            maxWidth: '280px',
            width: '100%',
            backgroundColor: '#d64848ff',
            color: 'white'
          }}
        >
          유튜브 바로가기 📺
        </a>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <a
          href="/game"
          className="btn"
          style={{
            maxWidth: '280px',
            width: '100%',
            backgroundColor: '#67e8f9', // 산뜻하고 밝은 민트/하늘색 톤
            color: '#000',
            fontWeight: 'bold'
          }}
        >
          미니 게임 🎮
        </a>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <a
          href="https://x.com/V_lSOE"
          onClick={handleTwitterClick}
          className="btn btn-secondary"
          style={{ maxWidth: '280px', width: '100%' }}
        >
          트위터 바로가기 🐦
        </a>
      </div>
    </div>
  );
}
