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
    const appScheme = `navergame://chzzk/show/channel/${channelId}`;
    const webUrl = `https://chzzk.naver.com/${channelId}`;

    // 1. [핵심] a 태그를 동적으로 생성해서 강제 클릭 유도
    // location.href 보다 브라우저의 '앱 열기' 팝업을 더 잘 끌어냅니다.
    const trigger = document.createElement("a");
    trigger.href = appScheme;
    trigger.style.display = "none";
    document.body.appendChild(trigger);
    trigger.click(); // 강제 클릭!
    document.body.removeChild(trigger);

    // 2. 앱 미설치 시 웹으로 보내는 로직 (타이머)
    const start = Date.now();
    const checkApp = setTimeout(() => {
      const end = Date.now();
      // 1.5초가 지났는데도 여전히 브라우저가 보이고(hidden이 아님),
      // 앱으로 갔다 온 게 아니라면(시간 차이가 2초 미만이면) 웹 이동
      if (!document.hidden && end - start < 2000) {
        window.location.href = webUrl;
      }
    }, 1500);

    window.onblur = () => clearTimeout(checkApp);
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
