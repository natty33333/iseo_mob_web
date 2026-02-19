import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // users 테이블 생성 (중복 방지를 위해 email을 PRIMARY KEY로 설정)
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        name TEXT,
        image TEXT,
        last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        return NextResponse.json({ message: "Users table created or already exists" }, { status: 200 });
    } catch (error) {
        console.error("Init users error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
