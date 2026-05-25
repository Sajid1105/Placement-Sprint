import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Clock,
  CheckCircle2,
  Target,
  Send,
  Play,
  FileText,
  CalendarDays,
} from 'lucide-react';
import { api } from '../api/client';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sprint-500 border-t-transparent" />
      </div>
    );
  }

  const readinessChart = [{ name: 'Ready', value: data.placementReadiness, fill: '#14b8a6' }];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{data.hero}</h1>
        <p className="mt-1 text-slate-400">
          Day {data.currentDay} of {data.sprintDays} · {data.daysRemaining} days remaining
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Flame, label: 'Streak', value: data.currentStreak, sub: `Best: ${data.longestStreak}` },
          { icon: Clock, label: 'Hours studied', value: data.hoursStudied, sub: `Today: ${data.todayHours}h` },
          { icon: CheckCircle2, label: 'Questions solved', value: data.questionsSolved },
          { icon: Send, label: 'Applications', value: data.applicationsSent },
        ].map(({ icon: Icon, label, value, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card"
          >
            <Icon className="text-sprint-500" size={22} />
            <p className="mt-2 text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
            {sub && <p className="text-xs text-slate-500">{sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Daily goal — {data.dailyGoalHours} hours</h2>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-surface">
            <motion.div
              className="h-full rounded-full bg-sprint-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (data.todayHours / data.dailyGoalHours) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-400">
            {data.todayHours} / {data.dailyGoalHours} hours today
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Sprint: June 1 → Day 60 · Consistency {data.consistency}%
          </p>
        </div>

        <div className="card flex flex-col items-center">
          <h2 className="font-display text-lg font-semibold">Placement readiness</h2>
          <div className="h-40 w-full">
            <ResponsiveContainer>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={readinessChart}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#2d3a4f' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-3xl font-bold text-sprint-400">{data.placementReadiness}%</p>
          <Link to="/readiness" className="mt-2 text-sm text-sprint-500 hover:underline">
            View breakdown
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/session" className="btn-primary">
            <Play size={16} /> Start session
          </Link>
          <Link to="/notes" className="btn-secondary">
            <FileText size={16} /> Open notes
          </Link>
          <Link to="/timeline" className="btn-secondary">
            <CalendarDays size={16} /> Today&apos;s plan
          </Link>
        </div>
      </div>

      {data.weaknesses?.length > 0 && (
        <div className="card border-amber-500/30">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Target size={20} className="text-amber-400" />
            Focus areas
          </h2>
          <ul className="mt-3 space-y-2">
            {data.weaknesses.map((w) => (
              <li key={w.area} className="flex justify-between text-sm">
                <span>{w.area}</span>
                <span className="text-amber-400">{w.score}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-sm text-slate-500">
        Level {data.level} · {data.xp} XP · Goal: {data.goal} · Target: {data.targetPackage}
      </p>
    </div>
  );
}
