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

    // 1. 일단 웹창을 띄웁니다 (보험)
    const newWindow = window.open(webUrl, '_blank', 'noopener,noreferrer');

    // 2. 앱 호출 시도 (iframe 방식)
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appScheme;
    document.body.appendChild(iframe);

    // 3. [핵심] 앱이 열리면(브라우저가 포커스를 잃으면) 새로 연 웹창을 닫아버림
    const closeWebWindow = () => {
      if (newWindow) {
        newWindow.close(); // 앱이 열렸으니 웹창은 필요 없음!
      }
    };

    // 사용자가 앱으로 빠져나가는 순간 실행
    window.addEventListener('blur', closeWebWindow, { once: true });

    // 0.5초 안에 앱이 안 열리면 그냥 웹창을 유지 (앱 없는 경우)
    setTimeout(() => {
      window.removeEventListener('blur', closeWebWindow);
      document.body.removeChild(iframe);
    }, 500);
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
