import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">HawAPI</h1>
      <p className="text-xl text-gray-400 mb-2">
        A Free and Open Source API for Stranger Things
      </p>
      <p className="text-gray-500 mb-8 max-w-lg">
        Explore characters, actors, episodes, seasons, games, locations, soundtracks and more
        from the world of Stranger Things.
      </p>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-medium transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-medium transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-gray-600 hover:border-gray-500 px-6 py-3 rounded font-medium transition"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
