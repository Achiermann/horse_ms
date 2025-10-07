'use client';

import Link from 'next/link';
import useUserStore from '../app/stores/useUserStore';
import '../styles/Header.css';

export default function Header() {
  // *** VARIABLES ***
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  // *** FUNCTIONS/HANDLERS ***
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-logo">
          Horse-MS
        </Link>

        <nav className="header-nav">
          {user && (
            <>
              <span className="header-user">
                {user.display_name || user.email}
                {user.isAdmin && <span className="header-admin-badge">Admin</span>}
              </span>
              <button onClick={handleLogout} className="header-logout-btn">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
