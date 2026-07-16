import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { UserRole } from '@/types';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  if (!role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
        <h1 className="text-4xl font-bold text-gray-800" style={{ fontSize: '36px' }}>
          🏠 绿房子
        </h1>
        <p className="text-xl text-gray-500" style={{ fontSize: '22px' }}>
          请选择你的角色
        </p>
        <div className="flex gap-6">
          <button
            className="px-8 py-4 text-2xl rounded-2xl text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
            style={{
              fontSize: '24px',
              minWidth: '160px',
              minHeight: '64px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            }}
            onClick={() => { setRole('parent'); navigate('/monitor'); }}
          >
            👨‍👩‍👧 我是家长
          </button>
          <button
            className="px-8 py-4 text-2xl rounded-2xl text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
            style={{
              fontSize: '24px',
              minWidth: '160px',
              minHeight: '64px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            onClick={() => { setRole('child'); navigate('/game'); }}
          >
            🌟 我是星宝
          </button>
        </div>
      </div>
    );
  }

  return <Outlet context={{ role }} />;
}
