"use client";

import { Progress } from "@/components/ui/progress";

interface ProbabilityItem {
  label: string;
  prob: number;
}

interface ProbabilityBarsProps {
  predictions: ProbabilityItem[];
}

export function ProbabilityBarsV2({ predictions }: ProbabilityBarsProps) {
  return (
    <div className="w-full space-y-5">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        AI 분석 상세
      </h3>
      {predictions.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">
              {index + 1}. {item.label}
            </span>
            <span className="text-sm font-bold text-purple-600">
              {(item.prob * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${item.prob * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
