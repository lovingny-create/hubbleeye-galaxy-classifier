"use client";

import { Progress } from "@/components/ui/progress";

interface ProbabilityItem {
  label: string;
  prob: number;
}

interface ProbabilityBarsProps {
  predictions: ProbabilityItem[];
}

export function ProbabilityBars({ predictions }: ProbabilityBarsProps) {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-sm font-semibold text-[#8B9CB8] uppercase tracking-wider">
        예측 확률 분포
      </h3>
      {predictions.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#F3F4F6]">
              {index + 1}. {item.label}
            </span>
            <span className="text-sm font-bold text-[#00E5FF]">
              {(item.prob * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#1E2A45] overflow-hidden">
            <div
              className="h-full bg-[#00E5FF] rounded-full transition-all"
              style={{ width: `${item.prob * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
