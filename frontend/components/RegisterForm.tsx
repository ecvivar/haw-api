import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ firstName, lastName, username, email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Username *</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Password *</label>
        <input
          type="password"
          required
          minLength={6}
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
        {submitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
