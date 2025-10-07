'use client';

import Link from 'next/link';
import useUserStore from '../app/stores/useUserStore';
import s from './Header.module.css';

export default function Header() {
  // *** VARIABLES ***
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  // *** FUNCTIONS/HANDLERS ***
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={s.header}>
      <div className={s['header-container']}>
        <Link href="/" className={s['header-logo']}>
          Horse-MS
        </Link>

        <nav className={s['header-nav']}>
          {user && (
            <>
              <span className={s['header-user']}>
                {user.display_name || user.email}
                {user.isAdmin && <span className={s['header-admin-badge']}>Admin</span>}
              </span>
              <button onClick={handleLogout} className={s['header-logout-btn']}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
