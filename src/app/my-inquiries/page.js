import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { cleanupOldInquiries } from '@/lib/db-utils';
import MyInquiryItem from '@/components/MyInquiryItem';

export const revalidate = 0;

export default async function MyInquiriesPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/');
    }

    await cleanupOldInquiries();

    const userEmail = session.user.email;
    let myInquiries = [];

    try {
        const { rows } = await sql`
            SELECT * FROM inquiries 
            WHERE email = ${userEmail} 
            ORDER BY created_at DESC
            LIMIT 20
        `;
        myInquiries = rows;
    } catch (error) {
        console.error('Fetch my inquiries error:', error);
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', textAlign: 'center' }}>📝 내 문의내역</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textAlign: 'center', marginBottom: '1.5rem' }}>
                * 답변 완료 후 14일이 지난 문의는 개인정보 보호를 위해 자동 삭제됩니다.
            </p>

            {myInquiries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', textAlign: 'center', marginBottom: '1rem' }}>
                        총 {myInquiries.length}건의 문의 내역이 있습니다.
                    </p>
                    {myInquiries.map((item) => (
                        <MyInquiryItem key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>아직 작성하신 문의 내역이 없습니다. 🍃</p>
                    <a href="/contact" className="btn btn-primary">문의 작성하러 가기</a>
                </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/" style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', textDecoration: 'underline' }}>홈으로 돌아가기</a>
            </div>
        </div>
    );
}
