import { list } from '@vercel/blob';

// 매번 최신 목록을 가져오도록 설정
export const revalidate = 0;

export default async function SchedulePage() {
    let latestSchedule = null;

    try {
        // Blob에 저장된 파일 목록 가져오기 (prefix가 schedule-인 것만)
        const { blobs } = await list({ prefix: 'schedule-' });

        if (blobs.length > 0) {
            // 업로드 시간 순으로 정렬하여 가장 최신 것 선택
            latestSchedule = blobs.sort((a, b) =>
                new Date(b.uploadedAt) - new Date(a.uploadedAt)
            )[0];
        }
    } catch (error) {
        console.error('Blob list error:', error);
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '1rem', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📅 이번 주 시간표</h1>

            {latestSchedule ? (
                <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <img
                        src={latestSchedule.url}
                        alt="이번 주 시간표"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>
            ) : (
                <div className="card" style={{ padding: '3rem 1rem' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>아직 등록된 시간표가 없습니다. 😭</p>
                </div>
            )}

            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                * 시간표는 관리자에 의해 매주 업데이트됩니다.
            </p>
        </div>
    );
}
