import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import AdminAnswerForm from '@/components/AdminAnswerForm';
import { cleanupOldInquiries } from '@/lib/db-utils';

export const revalidate = 0;

export default async function AdminInquiriesPage() {
    const session = await getServerSession();
    const ADMIN_EMAILS = ['dumi3345@gmail.com', '0Aoi.Soe0@gmail.com'];

    if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
        redirect('/');
    }

    // 데이터 정리 (14일 지난 답변글 삭제)
    await cleanupOldInquiries();

    let inquiries = [];
    try {
        // 최신순 50개만 가져오기 (기본 페이징)
        const { rows } = await sql`
            SELECT * FROM inquiries 
            ORDER BY created_at DESC 
            LIMIT 50
        `;
        inquiries = rows;
    } catch (error) {
        console.error('Fetch inquiries error:', error);
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>📬 문의함 내역</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                * 답변 완료 후 14일이 지난 문의는 개인정보 보호를 위해 자동 삭제됩니다.
            </p>

            {inquiries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {inquiries.map((item) => (
                        <div key={item.id} className="card" style={{ padding: '1.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>{item.title}</h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.8rem', whiteSpace: 'pre-wrap' }}>{item.content}</p>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div>
                                    <span style={{ color: 'var(--muted-foreground)' }}>작성자: </span>
                                    <span style={{ fontWeight: 'bold' }}>{item.nickname}</span>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--muted-foreground)' }}>이메일: </span>
                                    <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>{item.email || '미확인'}</span>
                                </div>
                            </div>

                            {/* 답변 관리 폼 추가 */}
                            <AdminAnswerForm inquiryId={item.id} initialAnswer={item.answer} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>아직 도착한 문의가 없습니다. 🍃</p>
                </div>
            )}
        </div>
    );
}
