import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 py-2 rounded font-medium transition"
      >
        {submitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
