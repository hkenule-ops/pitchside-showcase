import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  delay?: number;
}

const StatCard = ({ label, value, change, icon, delay = 0 }: Props) => {
  const up = (change ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass glass-hover rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="font-mono text-2xl font-semibold tabular">{value}</div>
      {change !== undefined && (
        <div className={`mt-1 flex items-center gap-1 text-xs font-mono ${up ? "text-bull" : "text-bear"}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {up ? "+" : ""}{change.toFixed(2)}%
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
