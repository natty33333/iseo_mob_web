import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { ADMIN_EMAILS } from '@/lib/admin-config';


export async function POST(request) {
    const session = await getServerSession();

    if (!session || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
        return NextResponse.json({ error: "Missing filename or body" }, { status: 400 });
    }

    try {
        // 1. 기존에 있던 시간표 파일들을 찾아서 모두 삭제 (용량 관리)
        const { blobs } = await list({ prefix: 'schedule-' });
        if (blobs.length > 0) {
            await del(blobs.map(blob => blob.url));
        }

        // 2. 새로운 시간표 업로드
        const newFilename = `schedule-${Date.now()}-${filename}`;
        const blob = await put(newFilename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
