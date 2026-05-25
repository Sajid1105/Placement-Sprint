import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-sprint-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      <p className="font-display text-lg font-semibold text-sprint-400">Placement Sprint</p>
    </div>
  );
}
