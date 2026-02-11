'use client';

import styles from './MobileLayout.module.css';

export default function MobileLayout({ children }) {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <span>🫧이소에</span>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>

            {/* Bottom Navigation */}

        </div>
    );
}
