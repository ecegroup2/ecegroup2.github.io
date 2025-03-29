
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  color?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

const HealthMetricCard = ({
  title,
  value,
  unit,
  icon,
  color = "text-primary",
  trend,
  status = 'normal',
  className,
}: HealthMetricCardProps) => {
  const statusClasses = {
    normal: "bg-green-50 text-health-good",
    warning: "bg-amber-50 text-health-warning",
    critical: "bg-red-50 text-destructive",
  };

  return (
    <div 
      className={cn(
        "glass-morphism rounded-xl p-5 card-hover animate-float-up bg-slate-800", 
        className
      )}
    >
      {/* for upper section of testing result */}
      <div className="flex justify-between items-start mb-4 bg-black p-4 border rounded-md">
        <div>
          <h3 className="text-lg font-bold text-muted-foreground">{title}</h3>
          <div className="flex items-end gap-1 mt-1">
            <span className={`text-3xl font-bold ${color}`}>{value}</span>
            {unit && <span className="text-sm text-muted-foreground self-end mb-1">{unit}</span>}
          </div>
        </div>
        <div className={cn("p-2 rounded-full", color)}>{icon}</div>
      </div>
      
      {/* for increase or decrease all test */}
      <div className="flex justify-between items-center">
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={trend.isUp ? "text-health-warning" : "text-health-good"}
            >
              {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">from average</span>
          </div>
        )}
        
        {status && (
          <div className={cn("text-xs px-2 py-1 rounded-full", statusClasses[status])}>
            {status === 'normal' && "Normal"}
            {status === 'warning' && "Warning"}
            {status === 'critical' && "Critical"}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMetricCard;
