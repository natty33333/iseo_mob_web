import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";

export async function POST(request) {
    try {
        const session = await getServerSession();
        const { title, content, nickname } = await request.json();

        if (!title || !content || !nickname) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const email = session?.user?.email || 'anonymous';

        // DB에 문의 내용 저장 (이메일 추가)
        await sql`
      INSERT INTO inquiries (title, content, nickname, email)
      VALUES (${title}, ${content}, ${nickname}, ${email})
    `;

        return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Submit inquiry error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
