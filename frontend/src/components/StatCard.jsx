const getScoreColor = (score) => {
  const numeric = parseFloat(score);
  if (numeric >= 8) return "text-green-400";
  if (numeric >= 5) return "text-yellow-400";
  return "text-red-400";
};

const StatCard = ({ title, value, subtitle, percentage, icon: Icon }) => {
  return (
    <article className="relative bg-card/85 p-6 rounded-2xl border border-white/10 shadow-[0_12px_28px_rgba(2,6,23,0.38)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo to-cyan opacity-80" />

      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-textMuted text-sm font-medium tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className="h-9 w-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-cyan">
            <Icon size={16} />
          </div>
        )}
      </div>

      <p className={`text-4xl font-bold leading-none ${getScoreColor(value)}`}>
        {value}
      </p>

      {subtitle && <p className="text-xs text-textMuted mt-3">{subtitle}</p>}

      {percentage !== undefined && percentage !== null && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px] text-textMuted">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-surface/90 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default StatCard;
