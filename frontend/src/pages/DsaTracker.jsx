import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/client';

const DIFF_COLORS = { Easy: 'text-emerald-400', Medium: 'text-amber-400', Hard: 'text-red-400' };

export default function DsaTracker() {
  const [topic, setTopic] = useState('');
  const [filter, setFilter] = useState('all');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['dsa', topic, filter],
    queryFn: () =>
      api
        .get('/dsa', {
          params: {
            ...(topic && { topic }),
            ...(filter === 'solved' && { solved: 'true' }),
            ...(filter === 'unsolved' && { solved: 'false' }),
          },
        })
        .then((r) => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, solved }) => api.patch(`/dsa/${id}`, { solved, incrementAttempt: !solved }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dsa'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  const chartData = Object.entries(data?.stats?.byTopic || {}).map(([name, v]) => ({
    name: name.slice(0, 12),
    solved: v.solved,
    total: v.total,
  }));

  const topics = [...new Set((data?.problems || []).map((p) => p.topic))];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">DSA Tracker</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card"><p className="text-2xl font-bold">{data?.stats?.solved}/{data?.stats?.total}</p><p className="text-xs text-slate-400">Solved</p></div>
        <div className="card"><p className="text-2xl font-bold text-emerald-400">{data?.stats?.byDifficulty?.Easy || 0}</p><p className="text-xs text-slate-400">Easy</p></div>
        <div className="card"><p className="text-2xl font-bold text-amber-400">{data?.stats?.byDifficulty?.Medium || 0}</p><p className="text-xs text-slate-400">Medium+</p></div>
      </div>
      {chartData.length > 0 && (
        <div className="card h-64">
          <h2 className="mb-2 text-sm font-semibold">Progress by topic</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid #2d3a4f' }} />
              <Bar dataKey="solved" fill="#14b8a6" name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <select className="input max-w-[180px]" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {['all', 'solved', 'unsolved'].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${filter === f ? 'bg-sprint-600 text-white' : 'btn-secondary'}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {(data?.problems || []).map((p) => (
          <div key={p._id} className="card flex flex-wrap items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => toggleMutation.mutate({ id: p._id, solved: !p.userProgress?.solved })}
              className={`rounded-full p-1 ${p.userProgress?.solved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface text-slate-500'}`}
            >
              <Check size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:text-sprint-400 flex items-center gap-1">
                {p.title} <ExternalLink size={14} />
              </a>
              <p className="text-xs text-slate-500">{p.topic} · {p.platform} · Attempts: {p.userProgress?.attempts || 0}</p>
            </div>
            <span className={`text-sm font-medium ${DIFF_COLORS[p.difficulty]}`}>{p.difficulty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
