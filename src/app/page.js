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
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

    if (!isMobile) {
      // On PC, open the link in a new window
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    } else {
      // On real mobile devices, try to launch the app
      if (/Android/i.test(ua)) {
        // Updated scheme to 'chizizic' based on verified app scheme info
        window.location.href = `intent://channel/${channelId}#Intent;scheme=chizizic;package=com.navercorp.game.android.community;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
      } else {
        // iOS: Using chizizic scheme
        window.location.href = `chizizic://channel/${channelId}`;
        setTimeout(() => {
          if (document.hasFocus()) {
            window.location.href = webUrl;
          }
        }, 2500);
      }
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
