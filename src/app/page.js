'use client';

import Image from 'next/image';
import ImageSlider from '@/components/ImageSlider';

export default function Home() {
  const images = [
    { src: '/iso_main.png', alt: '이소에 메인' },
    { src: '/isoe_1st.png', alt: '이소에 1주년' }
  ];

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
      window.location.href = `navergame://chzzk/live/${channelId}`;
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
        <h1>환영합니다! 👋</h1>
        <p>이소에를 위한 사이트입니다.</p>
      </div>


      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <a
          href="https://chzzk.naver.com/343c202c69ba6d11b7ec51741f9591ac"
          onClick={handleChzzkClick}
          className="btn btn-primary"
          style={{ maxWidth: '280px', width: '100%' }}
        >
          치지직 바로가기 🎮
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
