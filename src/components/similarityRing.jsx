import React from "react"

const SimilarityRing = ({ similarity = "0%", size = 48, strokeWidth = 3.5 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Parse similarity string (e.g., "92%" -> 92)
  const parsedPercentage = typeof similarity === "string"
    ? parseFloat(similarity.replace("%", ""))
    : similarity

  const clampedPercentage = Math.min(100, Math.max(0, parsedPercentage || 0))
  const offset = circumference - (clampedPercentage / 100) * circumference

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" /> {/* amber-500 */}
            <stop offset="100%" stopColor="#d97706" /> {/* amber-600 */}
          </linearGradient>
        </defs>
        {/* Track circle */}
        <circle
          className="stroke-stone-100"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke="url(#goldGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      {/* Label Overlay */}
      <div className="absolute flex flex-col items-center justify-center leading-none text-center">
        <span className="text-[11px] font-bold text-stone-900 leading-none">
          {Math.round(clampedPercentage)}%
        </span>
        <span className="text-[6px] font-semibold text-amber-600 uppercase tracking-widest leading-none mt-0.5">
          Match
        </span>
      </div>
    </div>
  )
}

export default SimilarityRing
