import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';

export async function DELETE(request) {
    try {
        const session = await getServerSession();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: "Missing inquiry ID" }, { status: 400 });
        }

        // 본인의 문의글만 삭제할 수 있도록 이메일 조건 추가
        const { rowCount } = await sql`
      DELETE FROM inquiries 
      WHERE id = ${id} AND email = ${session.user.email}
    `;

        if (rowCount === 0) {
            return NextResponse.json({ error: "Inquiry not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Inquiry deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
