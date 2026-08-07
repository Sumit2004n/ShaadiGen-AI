type EmptyStateProps = {
  emoji: string;
  title: string;
  hint: string;
};

export function EmptyState({ emoji, title, hint }: EmptyStateProps) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <p className="text-4xl">{emoji}</p>
      <p className="mt-3 font-semibold text-stone-700">{title}</p>
      <p className="mt-1 text-sm text-stone-500">{hint}</p>
    </div>
  );
}
