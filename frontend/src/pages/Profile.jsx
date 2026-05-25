import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    goal: user?.goal || '',
    targetPackage: user?.targetPackage || '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <div className="card">
        <p className="text-sm text-slate-400">{user?.email}</p>
        <p className="mt-2 text-sm">Streak: {user?.currentStreak} · Level {user?.level} · {user?.xp} XP</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {['name', 'goal', 'targetPackage'].map((field) => (
          <div key={field}>
            <label className="mb-1 block text-xs capitalize text-slate-400">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              className="input"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
