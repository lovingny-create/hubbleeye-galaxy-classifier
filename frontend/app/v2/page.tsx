"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploaderV2 } from "@/components/v2/ImageUploaderV2";
import { ResultCardV2 } from "@/components/v2/ResultCardV2";
import { GalaxyGuideV2 } from "@/components/v2/GalaxyGuideV2";
import { Sparkles, ArrowRight } from "lucide-react";

interface PredictionResult {
  primary: string;
  primary_en: string;
  confidence: number;
  top3: Array<{ label: string; prob: number }>;
}

export default function HomeV2() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("분석에 실패했어요. 다시 시도해볼까요?");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasImage = selectedFile !== null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50/50 to-orange-50/30 text-slate-800 font-sans selection:bg-purple-200">
      {/* Decorative top shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[150px] fill-white/40">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 max-w-2xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-purple-600 font-bold text-sm shadow-sm border border-purple-100">
            <Sparkles size={16} />
            <span>AI 은하 도우미</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800">
            HubbleEye
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium">
            우주 사진을 올리면 똑똑한 AI가 은하의 형태를 친절하게 알려드려요.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm max-w-3xl mx-auto flex items-start gap-3">
            <span className="text-red-500 font-bold mt-0.5">!</span>
            <div>
              <p className="font-bold text-red-800">앗, 문제가 생겼어요</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Input */}
          <div className="lg:col-span-5 space-y-6">
            <ImageUploaderV2
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              isLoading={isLoading}
            />

            {hasImage && (
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  "열심히 분석하고 있어요..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    은하 분석 시작하기 
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Right Column - Result */}
          <div className="lg:col-span-7 space-y-8">
            <ResultCardV2 result={result} isLoading={isLoading} />
            
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-6 ml-2">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">?</span>
                <h2 className="text-2xl font-extrabold text-slate-800">
                  이 은하는 어떤 특징이 있나요?
                </h2>
              </div>
              <GalaxyGuideV2 galaxyType={result?.primary || null} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 py-10 bg-white/40 border-t border-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 font-medium text-sm">
            Galaxy Zoo 데이터셋으로 학습한 AI 모델을 사용합니다.<br className="md:hidden" />
            <span className="hidden md:inline"> • </span>
            본 서비스는 교육용 프로토타입입니다.
          </p>
        </div>
      </div>
    </main>
  );
}
