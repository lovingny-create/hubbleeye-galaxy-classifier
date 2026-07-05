"use client";

import { Card } from "@/components/ui/card";
import { getGalaxyGuide } from "@/lib/galaxy-data";

interface GalaxyGuideProps {
  galaxyType: string | null;
}

export function GalaxyGuide({ galaxyType }: GalaxyGuideProps) {
  if (!galaxyType) {
    return (
      <Card className="w-full bg-[#131929] border-[#1E2A45] p-4 sm:p-6">
        <div className="text-center text-[#8B9CB8]">
          <p className="text-sm">이미지를 분석하면 은하에 대한 정보가 표시됩니다</p>
        </div>
      </Card>
    );
  }

  const guide = getGalaxyGuide(galaxyType);

  return (
    <Card className="w-full bg-[#131929] border-[#1E2A45] p-4 sm:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-[#00E5FF]">{guide.title}</h3>
        <p className="text-[#F3F4F6] leading-relaxed text-sm">
          {guide.description}
        </p>
      </div>

      <div className="border-t border-[#1E2A45] pt-4">
        <p className="text-[#8B9CB8] text-sm">
          <span className="font-semibold text-[#F3F4F6]">예시: </span>
          {guide.example}
        </p>
      </div>
    </Card>
  );
}
