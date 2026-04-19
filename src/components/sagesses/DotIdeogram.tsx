import { motion } from "framer-motion";

interface Props {
  /** Left sign code (4 rows): 1 = single dot, 2 = double dots */
  leftCode: [number, number, number, number];
  /** Right sign code (4 rows): 1 = single dot, 2 = double dots */
  rightCode: [number, number, number, number];
  size?: number;
  color?: string;
}

/**
 * Dot-based ideogram for a 256-sign Fa figure.
 * Each row has either 1 dot (centered) or 2 dots (side-by-side) per column.
 * Left column = leftCode (sign X), right column = rightCode (sign Y).
 */
const DotIdeogram = ({
  leftCode,
  rightCode,
  size = 200,
  color = "hsl(30, 30%, 12%)",
}: Props) => {
  const rows = 4;
  const colGap = size * 0.28; // distance between the two columns
  const dotSpacing = size * 0.085; // spacing between the two dots when val === 2
  const dotRadius = Math.max(3, size * 0.028);
  const rowSpacing = size * 0.16;

  const totalHeight = rowSpacing * (rows - 1);
  const startY = (size - totalHeight) / 2;
  const centerX = size / 2;
  const leftCx = centerX - colGap / 2;
  const rightCx = centerX + colGap / 2;

  const renderColumnRow = (val: number, cx: number, cy: number, key: string, delay: number) => {
    if (val === 1) {
      return (
        <motion.circle
          key={key}
          cx={cx}
          cy={cy}
          r={dotRadius}
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay }}
        />
      );
    }
    return (
      <g key={key}>
        <motion.circle
          cx={cx - dotSpacing}
          cy={cy}
          r={dotRadius}
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay }}
        />
        <motion.circle
          cx={cx + dotSpacing}
          cy={cy}
          r={dotRadius}
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: delay + 0.04 }}
        />
      </g>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="inline-block"
      aria-hidden="true"
    >
      {leftCode.map((val, i) =>
        renderColumnRow(val, leftCx, startY + i * rowSpacing, `l-${i}`, i * 0.08)
      )}
      {rightCode.map((val, i) =>
        renderColumnRow(val, rightCx, startY + i * rowSpacing, `r-${i}`, 0.35 + i * 0.08)
      )}
    </svg>
  );
};

export default DotIdeogram;
