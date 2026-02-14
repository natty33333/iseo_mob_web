'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './MobileLayout.module.css';
import LoginModal from './LoginModal';

export default function MobileLayout({ children }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isInquiryMenuOpen, setIsInquiryMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { data: session } = useSession();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) {
            setIsAdminMenuOpen(false);
            setIsInquiryMenuOpen(false);
        }
    };

    const toggleAdminMenu = (e) => {
        e.stopPropagation();
        setIsAdminMenuOpen(!isAdminMenuOpen);
        setIsInquiryMenuOpen(false);
    };

    const toggleInquiryMenu = (e) => {
        e.stopPropagation();
        setIsInquiryMenuOpen(!isInquiryMenuOpen);
        setIsAdminMenuOpen(false);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsMenuOpen(false);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    // 관리자 이메일 목록 (여기에 권한을 줄 이메일을 추가하세요)
    const ADMIN_EMAILS = ['dumi3345@gmail.com', '0Aoi.Soe0@gmail.com'];
    const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <button
                    className={styles.homeButton}
                    onClick={() => router.push('/')}
                    aria-label="Home"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <span className={styles.title}>💧이소에🫧</span>
                <button
                    className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
                    onClick={toggleMenu}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            {/* Side Menu Overlay */}
            <div
                className={`${styles.overlay} ${isMenuOpen ? styles.overlayOpen : ''}`}
                onClick={toggleMenu}
            />

            {/* Side Menu */}
            <nav className={`${styles.sideMenu} ${isMenuOpen ? styles.sideMenuOpen : ''}`}>
                <div className={styles.sideMenuHeader}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ margin: 0 }}>메뉴</h2>
                        {!session && (
                            <button onClick={openLoginModal} className={styles.headerLoginBtn}>로그인</button>
                        )}
                    </div>
                    {session?.user && (
                        <div className={styles.userInfo}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p className={styles.userName}>{session.user.name.length > 2 ? session.user.name.slice(1) : session.user.name}님 반가워요!</p>
                                <button
                                    onClick={() => { signOut({ callbackUrl: '/' }); toggleMenu(); }}
                                    className={styles.logoutBtn}
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <ul className={styles.menuList}>
                    <li onClick={() => { router.push('/'); toggleMenu(); }}>홈</li>
                    <li onClick={() => { router.push('/schedule'); toggleMenu(); }}>시간표</li>

                    {/* 관리자 전용 메뉴 */}
                    {isAdmin && (
                        <>
                            <li onClick={toggleAdminMenu} style={{ color: '#4285F4', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                ⚙️ 관리자 설정
                                <span>{isAdminMenuOpen ? '▴' : '▾'}</span>
                            </li>
                            {isAdminMenuOpen && (
                                <>
                                    <li onClick={() => { router.push('/admin/schedule'); toggleMenu(); }} className={styles.subMenu}>
                                        └ 시간표등록
                                    </li>
                                    <li onClick={() => { router.push('/admin/inquiries'); toggleMenu(); }} className={styles.subMenu}>
                                        └ 문의함 확인
                                    </li>
                                </>
                            )}
                        </>
                    )}

                    {/* 문의 메뉴 (서브메뉴 형태) */}
                    <li onClick={toggleInquiryMenu} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        💬 문의
                        <span>{isInquiryMenuOpen ? '▴' : '▾'}</span>
                    </li>
                    {isInquiryMenuOpen && (
                        <>
                            <li onClick={() => {
                                if (session) {
                                    router.push('/contact');
                                    toggleMenu();
                                } else {
                                    alert('로그인한 사용자만 문의가 가능합니다! 🔒');
                                    openLoginModal();
                                }
                            }} className={styles.subMenu}>
                                └ 문의하기
                            </li>
                            {session && (
                                <li onClick={() => { router.push('/my-inquiries'); toggleMenu(); }} className={styles.subMenu}>
                                    └ 내 문의내역
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </nav>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

            {/* Bottom Navigation */}

        </div>
    );
}
