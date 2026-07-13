"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DiaryEntry } from "@/lib/types";

export function TrendChart({ entries }: { entries: DiaryEntry[] }) {
  const data = [...entries]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .filter((e) => typeof e.weightKg === "number")
    .map((e) => ({ date: new Date(e.date).toLocaleDateString("lt-LT", { month: "short", day: "numeric" }), Svoris: e.weightKg }));

  if (data.length < 2) {
    return <p className="text-sm text-muted-foreground">Reikia bent 2 svorio įrašų grafikui rodyti.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" fontSize={12} stroke="hsl(var(--muted-foreground))" />
        <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="Svoris" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
