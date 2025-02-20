"use client";

import { da } from "date-fns/locale";
import Amount, { AmountColor } from "./Amount";
import { AreaChart, TooltipProps } from "./AreaChart";
import { Transaction } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";


interface ChartData {
  description: string;
  change: number;
  score: number;
  index: number;
}



export function ScoreChart({ score, firstDate, data }: { score: number; firstDate: Date; data: Transaction[] }) {

  const formatDescription = (type: string) => {
    switch (type) {
      case "BET":
        return "Bet placed";
      case "PAYOUT":
        return "Bet won";
      case "TICKET":
        return "Ticket finished";
      default:
        return "Unknown";
    }
  }

  const formatChange = (change: number) => {
    if (change == 0) return <></>
    
    if (change > 0) {
      return (
        <div className="flex items-center text-green-400 font-semibold drop-shadow-md">
          <ArrowUpIcon className="size-5" /> {change}
        </div>
      );
    }
    return (
      <div className="flex items-center text-red-400 font-semibold drop-shadow-md">
        <ArrowDownIcon className="size-5" /> {-change}
      </div>
    );
  }

  let processedData: ChartData[] = [];

  if (data.length === 0) {
    processedData.push({
      description: "Start score",
      index: 0,
      change: 0,
      score: score,
    });

    processedData.push({
      description: "Current score",
      index: data.length + 1,
      change: 0,
      score: score,
    });
  
  } else {
    processedData.push({
      description: "Start score",
      index: 0,
      change: 0,
      score: data[0].finalBalance - data[0].change,
    });
    
    for (let i = 0; i < data.length; i++) {
      processedData.push({
        index: i + 1,
        description: formatDescription(data[i].type),
        change: data[i].change,
        score: data[i].finalBalance,
      });
    }
  }





  const Tooltip = ({ payload, active, label }: TooltipProps) => {
    if (!active || !payload) return null;
    const data = payload[0].payload as ChartData;

    return (
      <div className="bg-zinc-400/50 rounded-lg p-3 shadow-md">
        <p className="text-center mx-2 font-bold">{data.description}</p>
        <div className="flex gap-2 ml-2 justify-between">
          {formatChange(data.change)}
          <Amount amount={<p className="font-semibold">{data.score}</p>} size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto w-xl lg:w-full h-96">
      <AreaChart className="h-80"
        data={processedData}
        index="description"
        categories={["score"]}
        colors={["amber"]}
        showLegend={false}
        showXAxis={false}
        customTooltip={Tooltip}
      />
    </div>
  );
}
