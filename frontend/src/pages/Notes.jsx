import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Search, Plus, Trash2 } from 'lucide-react';
import { api } from '../api/client';

const FOLDERS = ['Java', 'DSA', 'DBMS', 'OS', 'CN', 'General'];

export default function Notes() {
  const [folder, setFolder] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const qc = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', folder, search],
    queryFn: () =>
      api.get('/notes', { params: { ...(folder && { folder }), ...(search && { q: search }) } }).then((r) => r.data.notes),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      selected
        ? api.put(`/notes/${selected}`, { title, content, folder: folder || 'General' })
        : api.post('/notes', { title, content, folder: folder || 'General' }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      if (!selected) setSelected(res.data.note._id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      setSelected(null);
      setTitle('');
      setContent('');
    },
  });

  const debouncedSave = useCallback(() => {
    if (!title.trim() && !content.trim()) return;
    saveMutation.mutate();
  }, [title, content, selected]);

  useEffect(() => {
    const t = setTimeout(debouncedSave, 1500);
    return () => clearTimeout(t);
  }, [title, content, debouncedSave]);

  const openNote = async (id) => {
    const { data } = await api.get(`/notes/${id}`);
    setSelected(id);
    setTitle(data.note.title);
    setContent(data.note.content);
  };

  const newNote = () => {
    setSelected(null);
    setTitle('Untitled');
    setContent('');
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      <aside className="card flex w-full flex-col lg:w-72">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 text-slate-500" size={16} />
            <input className="input pl-8" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button type="button" className="btn-primary p-2" onClick={newNote}><Plus size={18} /></button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <button type="button" className={`rounded px-2 py-0.5 text-xs ${!folder ? 'bg-sprint-600' : 'bg-surface'}`} onClick={() => setFolder('')}>All</button>
          {FOLDERS.map((f) => (
            <button key={f} type="button" className={`rounded px-2 py-0.5 text-xs ${folder === f ? 'bg-sprint-600' : 'bg-surface'}`} onClick={() => setFolder(f)}>{f}</button>
          ))}
        </div>
        <ul className="mt-3 flex-1 overflow-y-auto space-y-1">
          {(notes || []).map((n) => (
            <li key={n._id}>
              <button
                type="button"
                onClick={() => openNote(n._id)}
                className={`w-full rounded-lg px-2 py-2 text-left text-sm ${selected === n._id ? 'bg-sprint-600/20' : 'hover:bg-surface'}`}
              >
                <p className="font-medium truncate">{n.title}</p>
                <p className="text-xs text-slate-500">{n.folder}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="card flex flex-1 flex-col min-h-0">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <input className="input flex-1 border-0 bg-transparent text-lg font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} />
          {selected && (
            <button type="button" className="text-red-400" onClick={() => deleteMutation.mutate(selected)}><Trash2 size={18} /></button>
          )}
          <button type="button" className="btn-secondary text-xs" onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
        </div>
        {preview ? (
          <div className="prose prose-invert mt-4 flex-1 overflow-y-auto max-w-none prose-a:text-sprint-400">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="mt-4 flex-1 resize-none bg-transparent font-mono text-sm text-slate-200 focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Markdown notes..."
          />
        )}
        <p className="mt-2 text-xs text-slate-500">Autosaves every 1.5s</p>
      </div>
    </div>
  );
}
