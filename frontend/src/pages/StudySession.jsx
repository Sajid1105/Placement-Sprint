import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import { api } from '../api/client';

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function StudySession() {
  const [elapsed, setElapsed] = useState(0);
  const [topic, setTopic] = useState('General');
  const intervalRef = useRef(null);
  const qc = useQueryClient();

  const { data: session, refetch } = useQuery({
    queryKey: ['active-session'],
    queryFn: () => api.get('/sessions/active').then((r) => r.data.session),
    refetchInterval: 5000,
  });

  const startMutation = useMutation({
    mutationFn: () => api.post('/sessions/start', { topic }),
    onSuccess: () => refetch(),
  });

  const pauseMutation = useMutation({
    mutationFn: (id) => api.post(`/sessions/${id}/pause`),
    onSuccess: () => refetch(),
  });

  const resumeMutation = useMutation({
    mutationFn: (id) => api.post(`/sessions/${id}/resume`),
    onSuccess: () => refetch(),
  });

  const endMutation = useMutation({
    mutationFn: (id) => api.post(`/sessions/${id}/end`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['calendar'] });
      refetch();
      setElapsed(0);
    },
  });

  useEffect(() => {
    if (session?.status === 'active' && session.startedAt) {
      const tick = () => {
        const start = new Date(session.startedAt).getTime();
        const paused = session.totalPausedMs || 0;
        setElapsed(Date.now() - start - paused);
      };
      tick();
      intervalRef.current = setInterval(tick, 1000);
      return () => clearInterval(intervalRef.current);
    }
    if (session?.status === 'paused' && session.startedAt) {
      const start = new Date(session.startedAt).getTime();
      const pausedAt = session.pausedAt ? new Date(session.pausedAt).getTime() : Date.now();
      setElapsed(pausedAt - start - (session.totalPausedMs || 0));
    }
    return () => clearInterval(intervalRef.current);
  }, [session]);

  const { data: history } = useQuery({
    queryKey: ['session-history'],
    queryFn: () => api.get('/sessions/history').then((r) => r.data.sessions),
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-2xl font-bold text-center">Study Session</h1>
      <motion.div className="card text-center py-10" layout>
        <p className="font-display text-5xl font-bold tabular-nums text-sprint-400 md:text-6xl">
          {formatTime(elapsed)}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {session ? `${session.status} · ${session.topic}` : 'No active session'}
        </p>
      </motion.div>
      {!session && (
        <div>
          <label className="text-xs text-slate-400">Topic</label>
          <input className="input mt-1" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
      )}
      <div className="flex justify-center gap-3">
        {!session && (
          <button type="button" className="btn-primary" onClick={() => startMutation.mutate()} disabled={startMutation.isPending}>
            <Play size={18} /> Start
          </button>
        )}
        {session?.status === 'active' && (
          <>
            <button type="button" className="btn-secondary" onClick={() => pauseMutation.mutate(session._id)}>
              <Pause size={18} /> Pause
            </button>
            <button type="button" className="btn-primary bg-red-600 hover:bg-red-500" onClick={() => endMutation.mutate(session._id)}>
              <Square size={18} /> End
            </button>
          </>
        )}
        {session?.status === 'paused' && (
          <>
            <button type="button" className="btn-primary" onClick={() => resumeMutation.mutate(session._id)}>
              <Play size={18} /> Resume
            </button>
            <button type="button" className="btn-secondary" onClick={() => endMutation.mutate(session._id)}>
              <Square size={18} /> End
            </button>
          </>
        )}
      </div>
      <p className="text-center text-xs text-slate-500">≥5 hours/day boosts your streak · Earn XP every 10 minutes</p>
      {history?.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold">Recent sessions</h2>
          <ul className="mt-3 space-y-2">
            {history.slice(0, 5).map((s) => (
              <li key={s._id} className="flex justify-between text-sm text-slate-400">
                <span>{s.topic}</span>
                <span>{Math.round((s.durationMinutes || 0) / 60 * 10) / 10}h · +{s.xpEarned} XP</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
