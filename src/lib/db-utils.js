import { sql } from '@vercel/postgres';

/**
 * 답변이 달린 지 14일이 지난 문의 내역을 DB에서 영구 삭제합니다.
 */
export async function cleanupOldInquiries() {
    try {
        await sql`
            DELETE FROM inquiries 
            WHERE answered_at IS NOT NULL 
            AND answered_at < NOW() - INTERVAL '14 days'
        `;
        console.log('Old inquiries cleaned up successfully.');
    } catch (error) {
        console.error('Inquiries cleanup error:', error);
    }
}
