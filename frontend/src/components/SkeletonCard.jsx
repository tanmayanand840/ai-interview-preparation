const SkeletonCard = () => {
  return (
    <div className="bg-card p-6 rounded-2xl animate-pulse border border-white/5">
      <div className="h-4 bg-surface rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-surface rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonCard;