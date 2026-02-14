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
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { data: session } = useSession();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) setIsAdminMenuOpen(false); // 메뉴 닫힐 때 서브메뉴도 닫기
    };

    const toggleAdminMenu = (e) => {
        e.stopPropagation();
        setIsAdminMenuOpen(!isAdminMenuOpen);
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
                    <h2>메뉴</h2>
                    {session?.user && (
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{session.user.name.length > 2 ? session.user.name.slice(1) : session.user.name}님 반가워요!</p>
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
                                    <li onClick={() => { alert('문의함 확인 페이지로 이동합니다.'); toggleMenu(); }} className={styles.subMenu}>
                                        └ 문의함 확인
                                    </li>
                                </>
                            )}
                        </>
                    )}

                    {session ? (
                        <li onClick={() => { signOut({ callbackUrl: '/' }); toggleMenu(); }}>로그아웃</li>
                    ) : (
                        <li onClick={openLoginModal}>로그인</li>
                    )}
                    <li onClick={() => {
                        if (!session) {
                            alert('로그인한 사용자만 문의가 가능합니다!');
                        }
                        toggleMenu();
                    }}>문의하기</li>
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
