# HubbleEye 진행상황

## 반응형 디자인 점검/수정
- [x] `frontend/app/page.tsx` — 헤더 타이틀/부제 크기, 그리드 gap, 여백에 브레이크포인트(sm/md) 추가
- [x] `frontend/components/ImageUploader.tsx` — 드롭존 패딩, 아이콘/텍스트 크기, 버튼 배치(모바일에서 세로 스택) 조정
- [x] `frontend/components/ResultCard.tsx` — 결과 타이틀/카드 패딩 반응형 조정
- [x] `frontend/components/GalaxyGuide.tsx` — 카드 패딩/제목 크기 조정
- [x] 브라우저에서 모바일(375px)/태블릿(768px)/데스크톱(1440px+) 뷰포트 시각 확인 (업로드 전/후, 에러 상태 포함)

## GitHub 업로드
- [x] 저장소 구조 파악 (frontend 자체 git, backend/루트는 미초기화)
- [x] `frontend/.git` 제거 후 루트에 `git init`
- [x] 루트 `.gitignore` 작성 (node_modules, .next, .venv, __pycache__ 등 제외)
- [x] 최초 커밋 생성
- [x] `gh repo create lovingny-create/hubbleeye-galaxy-classifier --public` 로 저장소 생성 및 push
- [x] GitHub에서 업로드 결과 확인 → https://github.com/lovingny-create/hubbleeye-galaxy-classifier
