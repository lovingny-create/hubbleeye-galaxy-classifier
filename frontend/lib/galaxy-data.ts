export interface GalaxyInfo {
  title: string;
  description: string;
  example: string;
}

export const GALAXY_GUIDE: Record<string, GalaxyInfo> = {
  "타원은하": {
    title: "타원은하 (Elliptical Galaxy)",
    description:
      "별 생성 활동이 거의 없는 성숙한 은하입니다. 구형(E0)부터 납작한 타원형(E7)까지 형태가 다양하며, 주로 늙은 적색 별들로 구성됩니다. 타원은하는 우주에서 매우 흔한 형태이며, 특히 거대한 타원은하들이 우주의 중심부에 집중되어 있습니다.",
    example: "대표 은하: M87 (처녀자리, 초거대 블랙홀 사진의 주인공)",
  },
  "정상나선은하": {
    title: "정상나선은하 (Normal Spiral Galaxy)",
    description:
      "중심의 구형 팽대부에서 나선팔이 바로 휘어져 나오는 은하입니다. 나선팔에는 가스와 먼지 성운이 풍부하여 젊고 밝은 별들이 활발하게 생성되고 있습니다. 허블 분류표에서 S (Sa, Sb, Sc)로 표시됩니다.",
    example: "대표 은하: 안드로메다 은하(M31), 바람개비 은하(M101), 핑휠 은하(M74)",
  },
  "막대나선은하": {
    title: "막대나선은하 (Barred Spiral Galaxy)",
    description:
      "중심부 팽대부를 가로지르는 막대 모양의 구조가 존재하며, 그 막대의 양 끝에서 나선팔이 뻗어 나오는 은하입니다. 우리 은하(Milky Way)도 막대나선은하에 속하는 것으로 밝혀졌으며, 허블 분류표에서 SB (SBa, SBb, SBc)로 표시됩니다.",
    example: "대표 은하: 우리 은하(Milky Way), NGC 1300, M109",
  },
  "불규칙은하": {
    title: "불규칙은하 (Irregular Galaxy)",
    description:
      "뚜렷한 나선팔이나 타원 형태가 없는 은하입니다. 주로 은하 간 충돌·조석력으로 형태가 뒤틀렸거나, 별 생성이 매우 활발한 젊은 은하입니다. 불규칙은하는 우주 초기에 더 흔했을 것으로 예상되며, 현재는 우주 전체 은하의 약 3%를 차지합니다.",
    example: "대표 은하: 대마젤란운(LMC), 소마젤란운(SMC) — 우리 은하의 위성 은하",
  },
};

export function getGalaxyGuide(galaxyType: string): GalaxyInfo {
  return (
    GALAXY_GUIDE[galaxyType] || {
      title: "미분류",
      description: "해당 은하 유형에 대한 정보를 찾을 수 없습니다.",
      example: "다시 시도해주세요.",
    }
  );
}
