import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
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
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      <RegisterForm />
      <p className="text-sm text-gray-500 mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-red-500 hover:text-red-400">
          Sign In
        </Link>
      </p>
    </div>
  );
}
