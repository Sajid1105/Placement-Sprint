import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { api } from '../api/client';

const COLUMNS = [
  { id: 'wishlist', label: 'Wishlist', color: 'border-slate-500' },
  { id: 'applied', label: 'Applied', color: 'border-blue-500' },
  { id: 'oa', label: 'OA', color: 'border-amber-500' },
  { id: 'interview', label: 'Interview', color: 'border-purple-500' },
  { id: 'offer', label: 'Offer', color: 'border-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'border-red-500' },
];

export default function Applications() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', package: '', link: '', notes: '' });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => api.get('/applications').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/applications', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setShowForm(false);
      setForm({ company: '', role: '', package: '', link: '', notes: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => api.patch(`/applications/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  const board = data?.board || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Application Tracker</h1>
        <button type="button" className="btn-primary" onClick={() => setShowForm(true)}><Plus size={18} /> Add</button>
      </div>
      {showForm && (
        <div className="card grid gap-3 sm:grid-cols-2">
          {['company', 'role', 'package', 'link'].map((f) => (
            <input key={f} className="input" placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          ))}
          <textarea className="input sm:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="button" className="btn-primary" onClick={() => createMutation.mutate({ ...form, status: 'wishlist' })}>Save</button>
          <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className={`min-w-[260px] flex-shrink-0 rounded-xl border-t-4 bg-surface-card p-3 ${col.color}`}>
            <h3 className="mb-3 text-sm font-semibold">{col.label} ({(board[col.id] || []).length})</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {(board[col.id] || []).map((app) => (
                <div key={app._id} className="rounded-lg bg-surface p-3 text-sm">
                  <p className="font-semibold">{app.company}</p>
                  <p className="text-slate-400">{app.role}</p>
                  {app.package && <p className="text-xs text-sprint-500">{app.package}</p>}
                  <select
                    className="input mt-2 text-xs"
                    value={app.status}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: app._id,
                        body: {
                          status: e.target.value,
                          applied: ['applied', 'oa', 'interview', 'offer'].includes(e.target.value),
                        },
                      })
                    }
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
