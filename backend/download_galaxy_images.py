"""
자동으로 Astronomy 이미지를 다운로드하는 스크립트
Google Teachable Machine 학습용 은하 이미지 수집
"""

import os
import requests
from pathlib import Path
from urllib.parse import urljoin

def download_from_wikimedia():
    """Wikimedia Commons에서 은하 이미지 다운로드 (무료, 고품질)"""

    output_dir = Path("training_data")

    # 각 카테고리별 이미지 URL 모음 (Commons.wikimedia.org)
    # 실제 은하 이미지들의 URL
    images = {
        "elliptical": [
            # M87, M32, M110 등 유명한 타원은하
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M87_jet.jpg/1024px-M87_jet.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/M32_Andromeda_Companion.jpg/1024px-M32_Andromeda_Companion.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/M110_Andromeda_Satellite.jpg/1024px-M110_Andromeda_Satellite.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Centaurus_A_jets.jpg/1024px-Centaurus_A_jets.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/NGC_1132.jpg/1024px-NGC_1132.jpg",
        ],
        "spiral": [
            # M51, M74, M31 등 유명한 나선은하
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Whirlpool_Galaxy-HST.jpg/1024px-Whirlpool_Galaxy-HST.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Andromeda_Galaxy_%28with_h-alpha%29.jpg/1024px-Andromeda_Galaxy_%28with_h-alpha%29.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/M74_Hubble_Heritage.jpg/1024px-M74_Hubble_Heritage.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pinwheel_Galaxy_M101.jpg/1024px-Pinwheel_Galaxy_M101.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Triangulum_Galaxy.jpg/1024px-Triangulum_Galaxy.jpg",
        ],
        "irregular": [
            # LMC, SMC, NGC 4449 등 불규칙은하
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Large_Magellanic_Cloud.jpg/1024px-Large_Magellanic_Cloud.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Small_Magellanic_Cloud.jpg/1024px-Small_Magellanic_Cloud.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/NGC_4449.jpg/1024px-NGC_4449.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/NGC_5253.jpg/1024px-NGC_5253.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/NGC_4214.jpg/1024px-NGC_4214.jpg",
        ]
    }

    print("=" * 70)
    print("Wikimedia Commons에서 은하 이미지 다운로드")
    print("=" * 70)

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })

    total_downloaded = 0

    for class_name, urls in images.items():
        class_dir = output_dir / class_name
        class_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n[{class_name.upper()}] 다운로드 중...")

        for i, url in enumerate(urls, 1):
            try:
                response = session.get(url, timeout=10)
                if response.status_code == 200:
                    filename = class_dir / f"{class_name}_{i:02d}.jpg"
                    with open(filename, 'wb') as f:
                        f.write(response.content)
                    print("[OK] {}/{}: {}".format(i, len(urls), filename.name))
                    total_downloaded += 1
                else:
                    print("[FAIL] {}/{}: HTTP {}".format(i, len(urls), response.status_code))
            except Exception as e:
                print("[FAIL] {}/{}: {}".format(i, len(urls), str(e)[:50]))

    print("\n" + "=" * 70)
    print(f"다운로드 완료: {total_downloaded} 개 이미지")
    print(f"위치: ./training_data/")
    print("\n다음 단계:")
    print("1. https://teachablemachine.withgoogle.com/ 접속")
    print("2. 이미지 프로젝트 시작")
    print("3. training_data 폴더의 이미지들 업로드")
    print("4. 모델 학습 및 내보내기")
    print("=" * 70)

if __name__ == "__main__":
    download_from_wikimedia()
