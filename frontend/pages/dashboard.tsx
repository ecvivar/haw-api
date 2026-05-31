import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { healthService, type HealthResponse } from '../services/api';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState('');

  useEffect(() => {
    healthService
      .check()
      .then(setHealth)
      .catch((err) => setHealthError(err.message));
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Profile</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Username:</span>{' '}
            <span className="text-gray-200">{user?.username}</span>
          </div>
          <div>
            <span className="text-gray-400">Email:</span>{' '}
            <span className="text-gray-200">{user?.email}</span>
          </div>
          <div>
            <span className="text-gray-400">Role:</span>{' '}
            <span className="text-gray-200">{user?.role}</span>
          </div>
          <div>
            <span className="text-gray-400">UUID:</span>{' '}
            <span className="text-gray-200 text-xs">{user?.uuid}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">API Health</h2>
        {health ? (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Status:</span>{' '}
              <span
                className={
                  health.status === 'healthy' ? 'text-green-400' : 'text-red-400'
                }
              >
                {health.status}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Database:</span>{' '}
              <span className="text-gray-200">{health.database}</span>
            </div>
            <div>
              <span className="text-gray-400">Uptime:</span>{' '}
              <span className="text-gray-200">
                {Math.round(health.uptime / 60)}m
              </span>
            </div>
          </div>
        ) : healthError ? (
          <p className="text-red-400 text-sm">{healthError}</p>
        ) : (
          <div className="animate-pulse h-4 bg-gray-700 rounded w-48" />
        )}
      </div>
    </div>
  );
}
