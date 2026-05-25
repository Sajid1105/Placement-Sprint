import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { api } from '../api/client';

export default function Readiness() {
  const { data, isLoading } = useQuery({
    queryKey: ['readiness'],
    queryFn: () => api.get('/readiness').then((r) => r.data),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  const chartData = [
    { name: 'Java', score: data.breakdown?.java?.score || 0, weight: 30 },
    { name: 'DSA', score: data.breakdown?.dsa?.score || 0, weight: 40 },
    { name: 'Core', score: data.breakdown?.core?.score || 0, weight: 20 },
    { name: 'Consistency', score: data.breakdown?.consistency?.score || 0, weight: 10 },
  ];

  const COLORS = ['#f59e0b', '#14b8a6', '#a855f7', '#3b82f6'];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold">Placement Readiness</h1>
      <div className="card text-center py-8">
        <p className="text-6xl font-bold text-sprint-400">{data.score}%</p>
        <p className="mt-2 text-slate-400">Weighted score: Java 30% · DSA 40% · Core 20% · Consistency 10%</p>
      </div>
      <div className="card h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8' }} width={70} />
            <Tooltip contentStyle={{ background: '#1a2332', border: '1px solid #2d3a4f' }} />
            <Bar dataKey="score" radius={4}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data.weaknesses?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold">Weaknesses to improve</h2>
          <ul className="mt-3 space-y-3">
            {data.weaknesses.map((w) => (
              <li key={w.area} className="flex items-center justify-between">
                <span>{w.area}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-surface">
                    <div className="h-full bg-amber-500" style={{ width: `${w.score}%` }} />
                  </div>
                  <span className="text-sm text-amber-400">{w.score}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
