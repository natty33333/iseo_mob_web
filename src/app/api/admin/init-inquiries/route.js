import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. 테이블이 없다면 생성
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        nickname TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. 이미 테이블이 있는 경우컬럼 추가 시도
    try {
      await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email TEXT`;
      await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS answer TEXT`;
      await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS answered_at TIMESTAMP WITH TIME ZONE`;
    } catch (e) {
      console.log("Columns might already exist or error adding them:", e.message);
    }

    // 3. 푸시 알림 구독 테이블 생성
    try {
      await sql`
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id SERIAL PRIMARY KEY,
                subscription TEXT NOT NULL,
                email TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
    } catch (e) {
      console.error("Error creating push_subscriptions table:", e.message);
    }

    return NextResponse.json({ message: "Inquiries table and Push table updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
