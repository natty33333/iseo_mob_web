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
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeUser = async () => {
        if (!registration) return;

        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
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
            alert('알림 권한을 허용해 주세요!');
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
