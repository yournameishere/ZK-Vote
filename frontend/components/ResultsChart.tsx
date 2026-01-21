"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { VoteResult } from "@/lib/types";

interface ResultsChartProps {
  results: VoteResult[];
  options: string[];
}

export function ResultsChart({ results, options }: ResultsChartProps) {
  const data = results.map((result, index) => ({
    name: options[result.optionIndex] || `Option ${result.optionIndex + 1}`,
    votes: result.count,
  }));

  const colors = ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" fill="#3B82F6">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
