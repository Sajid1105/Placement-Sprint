import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

const STATUS_COLORS = {
  complete: 'bg-emerald-500',
  partial: 'bg-amber-500',
  missed: 'bg-red-500/80',
  today: 'bg-blue-500 ring-2 ring-blue-300',
  future: 'bg-slate-600',
};

function formatDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function Calendar() {
  const [view, setView] = useState('month');
  const [selected, setSelected] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['calendar', month, year],
    queryFn: () =>
      api.get('/calendar', { params: { month, year } }).then((r) => r.data),
  });

  const { data: heatmap } = useQuery({
    queryKey: ['calendar-heatmap'],
    queryFn: () => api.get('/calendar/heatmap').then((r) => r.data.heatmap),
    enabled: view === 'heatmap',
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => api.put(`/calendar/${selected.date}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const [form, setForm] = useState({ hours: 0, notes: '', topics: '', tasks: '', questions: 0 });

  const openDay = async (day) => {
    if (day.status === 'future') return;
    const dateStr = formatDate(day.date);
    const { data: res } = await api.get(`/calendar/${dateStr}`);
    const e = res.entry;
    setSelected({ ...day, date: dateStr });
    setForm({
      hours: e.hours || 0,
      notes: e.notes || '',
      topics: (e.topics || []).join(', '),
      tasks: (e.tasks || []).join('\n'),
      questions: e.questions || 0,
    });
  };

  const save = () => {
    saveMutation.mutate({
      hours: parseFloat(form.hours) || 0,
      notes: form.notes,
      topics: form.topics.split(',').map((t) => t.trim()).filter(Boolean),
      tasks: form.tasks.split('\n').filter(Boolean),
      questions: parseInt(form.questions, 10) || 0,
      completed: parseFloat(form.hours) >= 5,
    });
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  const days = data?.days || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          {['month', 'week', 'heatmap'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize ${view === v ? 'bg-sprint-600 text-white' : 'btn-secondary'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card text-center"><p className="text-2xl font-bold text-emerald-400">{stats.currentStreak}</p><p className="text-xs text-slate-400">Current streak</p></div>
        <div className="card text-center"><p className="text-2xl font-bold">{stats.longestStreak}</p><p className="text-xs text-slate-400">Longest streak</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-sprint-400">{stats.consistency}%</p><p className="text-xs text-slate-400">Consistency</p></div>
      </div>

      {view !== 'heatmap' && (
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary" onClick={() => { const m = month === 1 ? 12 : month - 1; setMonth(m); if (m === 12) setYear(year - 1); }}>←</button>
          <span className="font-medium">{new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button type="button" className="btn-secondary" onClick={() => { const m = month === 12 ? 1 : month + 1; setMonth(m); if (m === 1) setYear(year + 1); }}>→</button>
        </div>
      )}

      {view === 'heatmap' && heatmap && (
        <div className="card overflow-x-auto">
          <div className="grid grid-cols-10 gap-1 sm:grid-cols-12 md:grid-cols-15">
            {heatmap.map((h) => (
              <div
                key={h.dayNumber}
                title={`Day ${h.dayNumber}: ${h.hours}h`}
                className={`aspect-square rounded ${['bg-slate-700', 'bg-sprint-900', 'bg-sprint-700', 'bg-sprint-500', 'bg-sprint-400'][h.level]}`}
              />
            ))}
          </div>
        </div>
      )}

      {(view === 'month' || view === 'week') && (
        <div className={`grid gap-2 ${view === 'week' ? 'grid-cols-7' : 'grid-cols-7 sm:grid-cols-10'}`}>
          {days.map((day) => (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => openDay(day)}
              disabled={day.status === 'future'}
              className={`flex flex-col items-center rounded-lg p-2 transition hover:ring-1 hover:ring-sprint-500 disabled:cursor-not-allowed disabled:opacity-40 ${view === 'week' ? 'min-h-[80px]' : 'min-h-[56px]'}`}
            >
              <span className={`mb-1 h-3 w-3 rounded-full ${STATUS_COLORS[day.status]}`} />
              <span className="text-xs font-medium">D{day.dayNumber}</span>
              <span className="text-[10px] text-slate-500">{day.hours}h</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> ≥5h</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Partial</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Missed</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Today</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-600" /> Future</span>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              className="card max-h-[90vh] w-full max-w-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-semibold">Day {selected.dayNumber} — {selected.date}</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-slate-400">Hours</label>
                  <input className="input" type="number" step="0.5" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Topics (comma-separated)</label>
                  <input className="input" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Questions solved</label>
                  <input className="input" type="number" value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Tasks (one per line)</label>
                  <textarea className="input min-h-[80px]" value={form.tasks} onChange={(e) => setForm({ ...form, tasks: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Notes</label>
                  <textarea className="input min-h-[100px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-primary" onClick={save} disabled={saveMutation.isPending}>Save</button>
                <button type="button" className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
