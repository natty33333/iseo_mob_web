import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import webpush from 'web-push';

const ADMIN_EMAILS = ['dumi3345@gmail.com', '0Aoi.Soe0@gmail.com'];

// VAPID 설정 (환경 변수에서 가져옴)
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
    webpush.setVapidDetails(
        'mailto:dumi3345@gmail.com',
        publicKey,
        privateKey
    );
} else {
    console.warn('⚠️ VAPID keys are missing. Push notifications will not work until keys are set in environment variables.');
}

export async function POST(request) {
    try {
        const session = await getServerSession();

        if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, body, url } = await request.json();

        if (!title || !body) {
            return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
        }

        // 모든 구독자 가져오기
        const { rows: subscriptions } = await sql`SELECT * FROM push_subscriptions`;

        const notifications = subscriptions.map(sub => {
            const pushSubscription = JSON.parse(sub.subscription);
            return webpush.sendNotification(
                pushSubscription,
                JSON.stringify({
                    title,
                    body,
                    url: url || '/'
                })
            ).catch(async (err) => {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    // 만료된 구독 삭제
                    await sql`DELETE FROM push_subscriptions WHERE id = ${sub.id}`;
                }
                console.error('Send notification error for sub:', sub.id, err.message);
            });
        });

        await Promise.all(notifications);

        return NextResponse.json({ message: `Sent to ${subscriptions.length} subscribers` }, { status: 200 });
    } catch (error) {
        console.error('Push send error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
