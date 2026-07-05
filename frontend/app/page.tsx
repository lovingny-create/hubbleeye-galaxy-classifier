"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultCard } from "@/components/ResultCard";
import { GalaxyGuide } from "@/components/GalaxyGuide";

interface PredictionResult {
  primary: string;
  primary_en: string;
  confidence: number;
  top3: Array<{ label: string; prob: number }>;
}

export default function Home() {
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
        throw new Error("분석 실패. 다시 시도해주세요.");
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
    <main className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] py-6 px-3 sm:py-8 sm:px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-[#00E5FF]">🔭 HubbleEye</span>
          </h1>
          <p className="text-[#8B9CB8] text-sm sm:text-base md:text-lg px-2">
            우주 사진을 올리면 AI가 은하의 형태를 분석해 드립니다
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
            <p className="font-semibold">오류</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Input and Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Input */}
          <div className="space-y-4">
            <ImageUploader
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              isLoading={isLoading}
            />

            {hasImage && (
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full h-12 bg-[#00E5FF] text-[#0B0F19] font-bold hover:bg-[#00B8CC] disabled:opacity-50"
              >
                {isLoading ? "분석 중..." : "🔍 분석하기"}
              </Button>
            )}
          </div>

          {/* Right Column - Result */}
          <div>
            <ResultCard result={result} isLoading={isLoading} />
          </div>
        </div>

        {/* Galaxy Guide */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F3F4F6] mb-4">
            📚 은하 도감
          </h2>
          <GalaxyGuide galaxyType={result?.primary || null} />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-[#1E2A45]">
        <p className="text-center text-[#8B9CB8] text-xs sm:text-sm px-2">
          Galaxy Zoo 데이터셋으로 학습한 AI 모델을 사용하고 있습니다.
          <br />
          본 서비스는 교육용 프로토타입입니다.
        </p>
      </div>
    </main>
  );
}
