'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminSchedulePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [blob, setBlob] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        try {
            const response = await fetch(
                `/api/admin/upload?filename=${file.name}`,
                {
                    method: 'POST',
                    body: file,
                },
            );

            const newBlob = await response.json();
            if (newBlob.url) {
                setBlob(newBlob);
                alert('시간표가 성공적으로 업로드되었습니다!');
            } else {
                alert('업로드 실패: ' + (newBlob.error || '알 수 없는 오류'));
            }
        } catch (error) {
            alert('업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📅 시간표 등록</h1>

            <div className="card">
                <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            시간표 이미지 선택
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => fileInputRef.current.click()}
                            style={{ marginBottom: '1rem', width: '200px' }}
                        >
                            파일 선택하기
                        </button>

                        {preview && (
                            <div style={{ marginTop: '1rem', textAlign: 'center', width: '100%' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>미리보기</p>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!file || uploading}
                            style={{ width: '200px' }}
                        >
                            {uploading ? '업로드 중...' : '시간표 등록하기'}
                        </button>
                    </div>
                </form>
            </div>

            {blob && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(52, 168, 83, 0.1)', borderRadius: '8px', border: '1px solid #34A853', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#34A853', fontWeight: 'bold' }}>✅ 업로드 완료!</p>
                </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={() => router.push('/')}
                    className="btn btn-secondary"
                    style={{ width: '200px' }}
                >
                    홈으로 가기 🏠
                </button>
            </div>
        </div>
    );
}
