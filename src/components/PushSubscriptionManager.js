'use client';

import { useEffect, useState } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export default function PushSubscriptionManager() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then((reg) => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then((sub) => {
                    setIsSubscribed(!!sub);
                });
            });
        }
    }, []);

    const urlBase64ToUint8Array = (base64String) => {
        // 공백 및 불필요한 문자 제거
        const base64 = base64String.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const fullBase64 = base64 + padding;

        const rawData = window.atob(fullBase64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeUser = async () => {
        if (!registration) return;

        try {
            // 모든 공백, 줄바꿈 제거 (Vercel이나 .env에서 의도치 않게 들어간 경우 대비)
            const cleanedKey = VAPID_PUBLIC_KEY.replace(/\s/g, '');
            const applicationServerKey = urlBase64ToUint8Array(cleanedKey);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey,
            });

            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription }),
            });

            if (response.ok) {
                setIsSubscribed(true);
                alert('알림 구독이 완료되었습니다! 🔔');
            }
        } catch (error) {
            console.error('Failed to subscribe:', error);
            if (error.name === 'NotAllowedError') {
                alert('알림 권한이 거부되었습니다. 브라우저 설정에서 알림 권한을 허용해 주세요!');
            } else if (error.name === 'InvalidCharacterError' || error.message.includes('65 bytes')) {
                alert('VAPID 키 설정에 문제가 있습니다. 관리자에게 문의하세요.');
            } else {
                alert('알림 구독 중 오류가 발생했습니다: ' + error.message);
            }
        }
    };

    const unsubscribeUser = async () => {
        if (!registration) return;

        const sub = await registration.pushManager.getSubscription();
        if (sub) {
            await sub.unsubscribe();
            // 서버에서도 삭제하는 로직을 추가할 수 있지만, 여기서는 클라이언트만 해제
            setIsSubscribed(false);
            alert('알림 구독이 해제되었습니다.');
        }
    };

    if (!VAPID_PUBLIC_KEY) return null;

    return (
        <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
            <button
                onClick={isSubscribed ? unsubscribeUser : subscribeUser}
                className={isSubscribed ? "btn btn-secondary" : "btn btn-primary"}
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
            >
                {isSubscribed ? '🔕 알림 끄기' : '🔔 알림 받기'}
            </button>
        </div>
    );
}
