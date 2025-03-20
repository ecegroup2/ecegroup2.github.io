
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface VitalChartProps {
  data: Array<{ time: string; value: number }>;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  yAxisLabel?: string;
  className?: string;
  unit?: string;
  name?: string;
}

const VitalChart = ({
  data,
  color,
  gradientFrom,
  gradientTo,
  yAxisLabel,
  className,
  unit = "",
  name = "Value",
}: VitalChartProps) => {
  return (
    <div className={cn("chart-container p-1 h-[250px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`colorGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.3} />
              <stop offset="95%" stopColor={gradientTo} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
            style={{ fontSize: '0.75rem' }}
            minTickGap={30}
          />
          <YAxis
            domain={["dataMin - 10", "dataMax + 10"]}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '0.75rem' }}
            tickFormatter={(tick) => `${tick}${unit}`}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fontSize: "0.75rem", fill: "#64748b" }
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 shadow-md rounded-lg border">
                    <p className="text-xs text-slate-500">{payload[0].payload.time}</p>
                    <p className="text-sm font-medium">
                      {name}: <span className="font-semibold" style={{ color }}>{payload[0].value}{unit}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#colorGradient-${color})`}
            animationDuration={1000}
            activeDot={{ r: 4, strokeWidth: 1, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalChart;
