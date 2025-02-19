"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid  } from "recharts";
import { format } from "date-fns";

export default function ScoreChart({ score, firstDate, data }: { score: number; firstDate: Date; data: { date: Date; value: number }[] }) {
    let processedData: { date: number; value: number }[] = [];
    let lastValue = score;
  
    if (data.length === 0) {
        
        return (
            <div className="m-auto mt-10 w-2/3 lg:w-1/2 h-96 p-6 rounded-2xl bg-zinc-900 shadow-lg">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                        { date: firstDate.getTime(), value: score },
                        { date: new Date().getTime(), value: score }
                    ]}>
                        <XAxis
                            dataKey="date"
                            type="number"
                            scale="time"
                            domain={["auto", "auto"]}
                            tickFormatter={(timestamp) => format(new Date(timestamp), "MMM dd HH:mm")}
                            stroke="white"
                            tick= {{ className: "text-gray-400 text-2xl" }}
                        />
                        <YAxis stroke="white" tick={{ className: "text-gray-400 text-sm" }} />
                        <Tooltip
                            labelFormatter={(timestamp) => format(new Date(timestamp), "MMM dd HH:mm")}
                            formatter={(value) => [value, "Score"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="rgb(251, 191, 36)"
                            strokeWidth={3}
                            fill="rgba(251, 191, 36, 0.3)"
                            dot={false}
                            activeDot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );

    } else {
        for (let i = 0; i < data.length; i++) {
            processedData.push({
            date: data[i].date.getTime(),
            value: lastValue,
            });
            lastValue -= data[i].value;
        }
    
        processedData.push({
            date: firstDate.getTime(),
            value: lastValue,
        });
    
        // invert the data
        processedData = processedData.reverse();
    }

    return (
        <div className="m-auto mt-10 w-2/3 lg:w-1/2 h-96 p-6 rounded-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processedData}>
          {/* X-Axis */}
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={["auto", "auto"]}
            tickFormatter={(timestamp) => format(new Date(timestamp), "MMM dd HH:mm")}
            stroke="white"
            tick={{ className: "text-gray-400 text-sm" }}
          />

          {/* Y-Axis */}
          <YAxis stroke="white" tick={{ className: "text-gray-400 text-sm" }} />

          {/* Grid with dashed lines */}
          <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.2)" />

          {/* Tooltip */}
          <Tooltip
            content={({ label, payload }) => {
              if (!payload || payload.length === 0) return null;

              const value = payload[0].value;
              const index = processedData.findIndex((d) => d.date === label);
              const prevValue = index > 0 ? processedData[index - 1].value : null;
              const difference = prevValue !== null ? value - prevValue : "-";

              return (
                <div className="rounded-lg bg-white/30 backdrop-blur-md p-2 text-black shadow-md">
                  <p className="text-xs text-gray-900">{format(new Date(label), "MMM dd HH:mm")}</p>
                  <p className="text-sm font-semibold">Score: {value}</p>
                  {prevValue !== null && (
                    <p className="text-xs text-gray-700">Change: {difference}</p>
                  )}
                </div>
              );
            }}
          />

          {/* Gradient Fill */}
          <defs>
            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="rgb(251, 191, 36)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area Graph */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(251, 191, 36)" // Amber-400
            strokeWidth={3}
            fill="url(#gradientFill)" // Use gradient fill
            dot={false} // Hide points
            activeDot={false} // Hide hover dots
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    );
}
