import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, Check, ExternalLink, ChevronRight } from 'lucide-react';
import { api } from '../api/client';

const CAT_COLORS = { JAVA: 'border-amber-500', DSA: 'border-sprint-500', CORE: 'border-purple-500', PLACEMENT: 'border-pink-500' };

export default function Timeline() {
  const [detail, setDetail] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: () => api.get('/timeline').then((r) => r.data),
  });

  const completeMutation = useMutation({
    mutationFn: (dayNumber) => api.post(`/timeline/${dayNumber}/complete`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timeline'] }),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  const days = data?.days || [];
  const byWeek = {};
  days.forEach((d) => {
    if (!byWeek[d.week]) byWeek[d.week] = [];
    byWeek[d.week].push(d);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">60-Day Roadmap</h1>
        <p className="text-slate-400">Unlocked through day {data.unlockedThrough} · Auto-unlock daily</p>
      </div>

      {Object.keys(byWeek)
        .sort((a, b) => a - b)
        .map((week) => (
          <section key={week} className="card">
            <h2 className="font-display text-lg font-semibold text-sprint-400">Week {week}</h2>
            <div className="mt-4 space-y-2">
              {byWeek[week].map((day) => (
                <motion.button
                  key={day.dayNumber}
                  type="button"
                  layout
                  onClick={() => setDetail(day)}
                  className={`flex w-full items-center gap-3 rounded-lg border-l-4 bg-surface p-3 text-left transition hover:bg-surface-card ${CAT_COLORS[day.category]} ${day.locked ? 'opacity-50' : ''}`}
                >
                  {day.locked ? <Lock size={18} className="text-slate-500" /> : day.progress?.completed ? <Check size={18} className="text-emerald-400" /> : <span className="w-[18px] text-center text-xs text-slate-500">{day.dayNumber}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Day {day.dayNumber}: {day.title}</p>
                    <p className="text-xs text-slate-500 truncate">{day.topics?.join(' · ')}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-500 flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </section>
        ))}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={() => setDetail(null)}>
          <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-sprint-500">{detail.category} · Day {detail.dayNumber}</span>
                <h3 className="font-display text-xl font-bold">{detail.title}</h3>
              </div>
              {!detail.locked && !detail.progress?.completed && (
                <button type="button" className="btn-primary text-sm" onClick={() => completeMutation.mutate(detail.dayNumber)} disabled={completeMutation.isPending}>
                  Mark complete
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400">{detail.topics?.join(', ')} · {detail.hours}h target</p>
            {detail.revision && <p className="mt-3 rounded-lg bg-surface p-3 text-sm">{detail.revision}</p>}
            {detail.videos?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-300">Videos</h4>
                <ul className="mt-2 space-y-2">
                  {detail.videos.map((v, i) => (
                    <li key={i}>
                      <a href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-sprint-400 hover:underline">
                        {v.title} ({v.source}) <ExternalLink size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detail.questions?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-300">Questions</h4>
                <ul className="mt-2 space-y-2">
                  {detail.questions.map((q, i) => (
                    <li key={i}>
                      <a href={q.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-sprint-400 hover:underline">
                        {q.title} — {q.difficulty} <ExternalLink size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button type="button" className="btn-secondary mt-4 w-full" onClick={() => setDetail(null)}>Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
