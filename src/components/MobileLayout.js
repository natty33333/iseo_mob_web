'use client';

import { useState } from 'react';
import styles from './MobileLayout.module.css';

export default function MobileLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
                </div>
                <ul className={styles.menuList}>
                    <li onClick={toggleMenu}>홈</li>
                    <li onClick={() => { alert('아직 준비중인 기능입니다!'); toggleMenu(); }}>시간표</li>
                    <li onClick={toggleMenu}>로그인</li>
                    <li onClick={() => { alert('아직 준비중인 기능입니다!'); toggleMenu(); }}>문의하기</li>
                </ul>
            </nav>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>

            {/* Bottom Navigation */}

        </div>
    );
}
