import { sql } from '@vercel/postgres';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { cleanupOldInquiries } from '@/lib/db-utils';

export const revalidate = 0;

export default async function MyInquiriesPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/');
    }

    // 데이터 정리 (14일 지난 답변글 삭제)
    await cleanupOldInquiries();

    const userEmail = session.user.email;
    let myInquiries = [];

    try {
        // 현재 로그인한 사용자의 최신 문의 20개만 가져오기
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
                        <div key={item.id} className="card" style={{ padding: '1.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>{item.title}</h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.8rem', whiteSpace: 'pre-wrap' }}>{item.content}</p>

                            {/* 답변 내용이 있는 경우 표시 */}
                            {item.answer && (
                                <div style={{
                                    marginTop: '0.5rem',
                                    marginBottom: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(66, 133, 244, 0.08)',
                                    borderRadius: '8px',
                                    borderLeft: '4px solid #4285F4'
                                }}>
                                    <p style={{ fontSize: '0.8rem', color: '#4285F4', fontWeight: 'bold', marginBottom: '0.4rem' }}>관리자 답변 💬</p>
                                    <p style={{ fontSize: '0.9rem', color: 'white', whiteSpace: 'pre-wrap' }}>{item.answer}</p>
                                </div>
                            )}

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>치지직 닉네임: {item.nickname}</span>
                                <span>상태: <span style={{ color: item.answer ? 'var(--primary)' : '#ff9800' }}>
                                    {item.answer ? '답변완료' : '확인대기'}
                                </span></span>
                            </div>
                        </div>
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
