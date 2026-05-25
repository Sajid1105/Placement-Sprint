import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Check } from 'lucide-react';
import { api } from '../api/client';

const CATEGORIES = ['ALL', 'JAVA', 'DSA', 'CORE', 'PLACEMENT'];

export default function Resources() {
  const [category, setCategory] = useState('ALL');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['resources', category],
    queryFn: () =>
      api
        .get('/resources', { params: category !== 'ALL' ? { category } : {} })
        .then((r) => r.data.resources),
  });

  const progressMutation = useMutation({
    mutationFn: ({ id, body }) => api.patch(`/resources/${id}/progress`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] }),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Learning Resources</h1>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-lg px-3 py-1.5 text-sm ${category === c ? 'bg-sprint-600 text-white' : 'btn-secondary'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(data || []).map((r) => (
          <article key={r._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-sprint-500">{r.category}</span>
                <h3 className="font-display text-lg font-semibold">{r.topic}</h3>
                {r.subtopic && <p className="text-sm text-slate-500">{r.subtopic}</p>}
              </div>
            </div>
            {r.revision && <p className="mt-2 text-sm text-slate-400">{r.revision}</p>}
            <div className="mt-4 space-y-3">
              {r.video?.url && (
                <div className="flex items-center justify-between gap-2">
                  <a href={r.video.url} target="_blank" rel="noreferrer" className="text-sm text-sprint-400 hover:underline flex items-center gap-1">
                    Watch: {r.video.title} <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    className={`rounded p-1 ${r.progress?.videoCompleted ? 'text-emerald-400' : 'text-slate-500'}`}
                    onClick={() => progressMutation.mutate({ id: r._id, body: { videoCompleted: !r.progress?.videoCompleted } })}
                  >
                    <Check size={18} />
                  </button>
                </div>
              )}
              {r.practice?.url && (
                <div className="flex items-center justify-between gap-2">
                  <a href={r.practice.url} target="_blank" rel="noreferrer" className="text-sm text-sprint-400 hover:underline flex items-center gap-1">
                    Practice: {r.practice.title} <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    className={`rounded p-1 ${r.progress?.practiceCompleted ? 'text-emerald-400' : 'text-slate-500'}`}
                    onClick={() => progressMutation.mutate({ id: r._id, body: { practiceCompleted: !r.progress?.practiceCompleted } })}
                  >
                    <Check size={18} />
                  </button>
                </div>
              )}
              {r.notes?.url && (
                <a href={r.notes.url} target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:underline flex items-center gap-1">
                  Notes: {r.notes.title} <ExternalLink size={14} />
                </a>
              )}
            </div>
            {['easy', 'medium', 'hard'].map((diff) =>
              r.questions?.[diff]?.length > 0 ? (
                <div key={diff} className="mt-3">
                  <p className="text-xs font-medium capitalize text-slate-500">{diff}</p>
                  <ul className="mt-1 space-y-1">
                    {r.questions[diff].map((q, i) => (
                      <li key={i}>
                        <a href={q.url} target="_blank" rel="noreferrer" className="text-xs text-sprint-500 hover:underline">
                          {q.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
