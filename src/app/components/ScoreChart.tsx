"use client";

import Amount, { AmountColor } from "./Amount";
import { AreaChart } from "./AreaChart";
import { FormatDateOptions } from "date-fns";

interface ChartData {
  date: string;
  score: number;
}

export function ScoreChart({ score, firstDate, data }: { score: number; firstDate: Date; data: { date: Date; value: number }[] }) {
  let processedData: ChartData[] = [];
  let lastValue = score;

  processedData.push({
    date: "Current score",
    score: lastValue,
  });


  for (let i = 0; i < data.length; i++) {
    processedData.push({
      date: data[i].date.toISOString(),
      score: lastValue,
    });
    lastValue -= data[i].value;
  }


  processedData.push({
    date: "Start score",
    score: lastValue,
  });

  // invert the data
  processedData = processedData.reverse();

  return (
    <div className="m-auto w-xl lg:w-full h-96">
      <AreaChart className="h-80"
        data={processedData}
        index="date"
        categories={["score"]}
        colors={["amber"]}
        // showXAxis={false}
        showLegend={false}
        startEndOnly={true}
      />
    </div>
  );
}
