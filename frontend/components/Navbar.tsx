import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-red-500">
          HawAPI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-red-400 transition">
                Dashboard
              </Link>
              <span className="text-gray-400">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-red-400 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
