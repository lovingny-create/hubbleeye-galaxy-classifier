"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityBars } from "./ProbabilityBars";
import { Loader2 } from "lucide-react";

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

export function ResultCard({ result, isLoading }: ResultCardProps) {
  if (!result && !isLoading) {
    return (
      <Card className="w-full h-full bg-[#131929] border-[#1E2A45] p-4 sm:p-6 flex items-center justify-center min-h-64 sm:min-h-96">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl mb-4">🔭</div>
          <p className="text-[#8B9CB8] text-base sm:text-lg px-2">
            이미지를 업로드하면 분석 결과가 여기 표시됩니다
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full h-full bg-[#131929] border-[#1E2A45] p-4 sm:p-6 flex items-center justify-center min-h-64 sm:min-h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#00E5FF] animate-spin mx-auto mb-4" />
          <p className="text-[#F3F4F6] font-semibold">이미지를 분석하는 중...</p>
          <p className="text-[#8B9CB8] text-sm mt-2">잠시만 기다려주세요</p>
        </div>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <Card className="w-full bg-[#131929] border-[#1E2A45] p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-3">
        <p className="text-[#8B9CB8] text-sm uppercase tracking-wider font-semibold">
          분류 결과
        </p>
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#00E5FF] break-keep">
            {result.primary}
          </h2>
          <p className="text-[#8B9CB8] text-sm">{result.primary_en}</p>
        </div>
      </div>

      <div className="border-t border-[#1E2A45] pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#8B9CB8] text-sm font-semibold">신뢰도</span>
          <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50">
            {(result.confidence * 100).toFixed(1)}%
          </Badge>
        </div>
      </div>

      <div className="border-t border-[#1E2A45] pt-6">
        <ProbabilityBars predictions={result.top3} />
      </div>
    </Card>
  );
}
