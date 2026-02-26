const getScoreColor = (score) => {
  const numeric = parseFloat(score);
  if (numeric >= 8) return "text-green-400";
  if (numeric >= 5) return "text-yellow-400";
  return "text-red-400";
};

const StatCard = ({ title, value, subtitle, percentage }) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5 hover:shadow-glow transition-all duration-300">

      <h3 className="text-textMuted text-sm mb-2">{title}</h3>

      <p className={`text-3xl font-bold ${getScoreColor(value)}`}>
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-textMuted mt-2">{subtitle}</p>
      )}

      {percentage && (
        <div className="mt-4 w-full bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo to-cyan transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;