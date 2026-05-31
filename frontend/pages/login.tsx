import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">You are already signed in.</p>
        <Link href="/dashboard" className="text-red-500 hover:text-red-400">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <LoginForm />
      <p className="text-sm text-gray-500 mt-4 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-red-500 hover:text-red-400">
          Register
        </Link>
      </p>
    </div>
  );
}
