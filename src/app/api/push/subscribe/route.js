import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const session = await getServerSession();
        const { subscription } = await request.json();

        if (!subscription) {
            return NextResponse.json({ error: "Missing subscription" }, { status: 400 });
        }

        const email = session?.user?.email || 'anonymous';
        const subStr = JSON.stringify(subscription);

        // 이미 존재하는 구독인지 확인 (endpoint 기준)
        const endpoint = subscription.endpoint;
        const { rows } = await sql`SELECT id FROM push_subscriptions WHERE subscription LIKE ${'%' + endpoint + '%'}`;

        if (rows.length > 0) {
            // 이미 존재하면 업데이트 (이메일 갱신 등)
            await sql`
        UPDATE push_subscriptions 
        SET email = ${email}, subscription = ${subStr} 
        WHERE id = ${rows[0].id}
      `;
        } else {
            // 새로 추가
            await sql`
        INSERT INTO push_subscriptions (subscription, email)
        VALUES (${subStr}, ${email})
      `;
        }

        return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
