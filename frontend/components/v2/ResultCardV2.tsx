"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityBarsV2 } from "./ProbabilityBarsV2";
import { Loader2, Sparkles } from "lucide-react";

interface PredictionResult {
  primary: string;
  primary_en: string;
  confidence: number;
  top3: Array<{ label: string; prob: number }>;
}

interface ResultCardProps {
  result: PredictionResult | null;
  isLoading: boolean;
}

export function ResultCardV2({ result, isLoading }: ResultCardProps) {
  if (!result && !isLoading) {
    return (
      <Card className="w-full h-full bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-slate-500 font-medium text-lg">
            분석을 시작하면<br/>결과가 여기에 나타나요
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full h-full bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-14 h-14 text-purple-500 animate-spin mx-auto mb-6" />
          <p className="text-slate-800 font-bold text-xl">AI가 사진을 분석하고 있어요...</p>
          <p className="text-slate-500 text-sm mt-3">신비로운 우주의 비밀을 푸는 중</p>
        </div>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <Card className="w-full bg-white/90 backdrop-blur-md border-purple-100 shadow-xl rounded-3xl p-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <p className="text-slate-500 text-sm font-bold tracking-wide">
            분석 완료
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            {result.primary}
          </h2>
          <p className="text-slate-400 text-lg">{result.primary_en}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-4 bg-purple-50 p-4 rounded-2xl">
          <span className="text-slate-600 font-bold">AI 확신도</span>
          <Badge className="bg-purple-100 text-purple-700 border-none px-3 py-1 text-sm font-bold rounded-full">
            {(result.confidence * 100).toFixed(1)}%
          </Badge>
        </div>
      </div>

      <div className="pt-2">
        <ProbabilityBarsV2 predictions={result.top3} />
      </div>
    </Card>
  );
}
