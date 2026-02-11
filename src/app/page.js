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

    // 1. [사파리 대응] 일단 새 탭으로 웹 페이지를 엽니다.
    // 사파리는 사용자 액션(클릭) 직후가 아니면 window.open을 차단하므로 
    // 함수 시작하자마자 실행하는 것이 가장 안전합니다.
    const newWindow = window.open(webUrl, '_blank', 'noopener,noreferrer');

    // 2. [앱 호출 시도] 앱이 있다면 여기서 앱이 열립니다.
    // 앱이 열리면 위에서 연 새 탭(웹)은 뒤로 가거나 그대로 남습니다.
    const appScheme = `navergame://chzzk/show/channel/${channelId}`;

    // iframe 방식으로 앱 호출 시도 (현재 페이지가 바뀌는 것을 방지하고 에러를 무시함)
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appScheme;
    document.body.appendChild(iframe);

    // 잠시 후 iframe 제거
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
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
