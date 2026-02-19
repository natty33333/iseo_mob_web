import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/admin-config';


export async function POST(request) {
    try {
        const session = await getServerSession();

        // 관리자 권한 확인
        if (!session || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, answer } = await request.json();

        if (!id || answer === undefined) {
            return NextResponse.json({ error: "Missing inquiry ID or answer" }, { status: 400 });
        }

        // 해당 ID의 문의글에 답변 저장 및 답변 일시 기록
        // 만약 답변을 지우는 경우(answer가 빈값인 경우) answered_at도 null로 초기화
        if (answer && answer.trim()) {
            await sql`
        UPDATE inquiries 
        SET answer = ${answer}, answered_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
        } else {
            await sql`
        UPDATE inquiries 
        SET answer = NULL, answered_at = NULL
        WHERE id = ${id}
      `;
        }

        return NextResponse.json({ message: "Answer saved successfully" }, { status: 200 });
    } catch (error) {
        console.error('Save answer error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
