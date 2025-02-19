"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";


// Convert date objects to timestamps (Recharts requires numerical values for correct spacing)

export default function ScoreChart({ score, firstDate, data }: {score: number, firstDate: Date,  data: { date: Date, value: number }[] }) {

    if (data.length === 0) {
        return (
            <>
            </>
        );
    }
    
    let processedData : { date: number, value: number }[] = [];
    let lastValue = score;
    
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


    return (
        <div className="m-auto mt-10 w-2/3 lg:w-1/2 h-100 p-8 rounded-2xl bg-zinc-800">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                    <XAxis
                        dataKey="date"
                        type="number" // Important for correct time spacing
                        scale="time"
                        domain={["auto", "auto"]}
                        tickFormatter={(timestamp) => format(new Date(timestamp), "MMM dd HH:mm")}
                        stroke="white"
                    />
                    <YAxis stroke="white" />
                    <Tooltip
                        labelFormatter={(timestamp) => format(new Date(timestamp), "MMM dd HH:mm")}
                        formatter={(value) => [value, "Score"]}
                        labelStyle={{ color: "black" }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--color-amber-400)" strokeWidth={4} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
