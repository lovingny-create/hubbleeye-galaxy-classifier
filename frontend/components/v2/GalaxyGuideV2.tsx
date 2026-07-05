"use client";

import { Card } from "@/components/ui/card";
import { getGalaxyGuide } from "@/lib/galaxy-data";
import { BookOpen } from "lucide-react";

interface GalaxyGuideProps {
  galaxyType: string | null;
}

export function GalaxyGuideV2({ galaxyType }: GalaxyGuideProps) {
  if (!galaxyType) {
    return (
      <Card className="w-full bg-white/60 backdrop-blur-sm border-transparent shadow-sm rounded-3xl p-8">
        <div className="flex flex-col items-center justify-center text-center text-slate-400 py-4">
          <BookOpen className="w-8 h-8 mb-3 opacity-50" />
          <p className="font-medium">결과에 따른 맞춤형 도감 정보가 이곳에 표시됩니다</p>
        </div>
      </Card>
    );
  }

  const guide = getGalaxyGuide(galaxyType);

  return (
    <Card className="w-full bg-gradient-to-br from-white to-purple-50/50 border-purple-100 shadow-lg rounded-3xl p-8 space-y-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
            도감
          </span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-800">{guide.title}</h3>
        <p className="text-slate-600 leading-relaxed text-base pt-2">
          {guide.description}
        </p>
      </div>

      <div className="relative z-10 bg-white/80 p-4 rounded-2xl shadow-sm border border-slate-50 mt-4">
        <p className="text-slate-700 text-sm">
          <span className="font-extrabold text-purple-600 mr-2">🌟 유명한 예시:</span>
          {guide.example}
        </p>
      </div>
    </Card>
  );
}
