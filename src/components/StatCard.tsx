interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:shadow-glow transition-shadow">
    {icon && <div className="text-primary mb-2 flex justify-center">{icon}</div>}
    <div className="font-display text-3xl font-bold text-foreground">{value}</div>
    <div className="text-muted-foreground text-sm uppercase tracking-wider mt-1">{label}</div>
  </div>
);

export default StatCard;
