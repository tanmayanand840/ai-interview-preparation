const SkeletonCard = () => {
  return (
    <div className="bg-card/80 p-6 rounded-2xl animate-pulse border border-white/10 shadow-[0_12px_24px_rgba(2,6,23,0.35)]">
      <div className="h-4 bg-surface/90 rounded w-1/3 mb-4" />
      <div className="h-9 bg-surface/90 rounded w-1/2 mb-4" />
      <div className="h-2 bg-surface/90 rounded w-full" />
    </div>
  );
};

export default SkeletonCard;
