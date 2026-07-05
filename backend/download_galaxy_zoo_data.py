"""
Galaxy Zoo 2 데이터 다운로드 및 분류 스크립트
Google Teachable Machine 학습용 이미지 준비
"""

import os
import shutil
import pandas as pd
from pathlib import Path

def download_galaxy_zoo_data():
    """Galaxy Zoo 2 데이터 다운로드"""
    print("=" * 60)
    print("Galaxy Zoo 2 데이터 다운로드 시작")
    print("=" * 60)

    # 데이터 디렉토리 생성
    data_dir = Path("galaxy_zoo_data")
    data_dir.mkdir(exist_ok=True)

    try:
        from galaxy_datasets import gz2

        print("\n[1/3] Galaxy Zoo 2 데이터셋 로드 중...")
        catalog, label_cols = gz2(
            root=str(data_dir),
            train=True,
            download=True
        )
        print(f"✓ 로드 완료! 총 {len(catalog)} 개의 은하")

        # 분류 데이터 필터링
        print("\n[2/3] 은하 분류 필터링 중...")

        # 타원은하: smooth + 큰 bulge
        elliptical = catalog[
            (catalog.get('t01_smooth_or_features_a01_smooth_fraction', 0) > 0.75) &
            (catalog.get('t05_bulge_shape_a04_no_bulge_fraction', 0) < 0.5)
        ].head(80)

        # 나선은하: spiral structure 확인
        spiral = catalog[
            catalog.get('t04_spiral_a01_spiral_fraction', 0) > 0.75
        ].head(80)

        # 불규칙은하: odd/irregular
        irregular = catalog[
            catalog.get('t06_odd_a02_odd_fraction', 0) > 0.75
        ].head(80)

        print(f"✓ 타원은하: {len(elliptical)} 개")
        print(f"✓ 나선은하: {len(spiral)} 개")
        print(f"✓ 불규칙은하: {len(irregular)} 개")

        # 이미지 추출
        print("\n[3/3] 이미지 정리 중...")
        output_dir = Path("training_data")

        for class_name, df in [
            ("elliptical", elliptical),
            ("spiral", spiral),
            ("irregular", irregular)
        ]:
            class_dir = output_dir / class_name
            class_dir.mkdir(parents=True, exist_ok=True)

            count = 0
            for idx, row in df.iterrows():
                try:
                    # Galaxy Zoo 2의 이미지 파일명
                    img_id = row.get('asset_id', row.get('objid', None))
                    if img_id is None:
                        continue

                    # 소스 이미지 경로
                    src = data_dir / "images" / f"{img_id}.jpg"
                    if not src.exists():
                        src = data_dir / "images" / f"{int(img_id)}.jpg"

                    if src.exists():
                        dst = class_dir / f"{class_name}_{count:03d}.jpg"
                        shutil.copy2(src, dst)
                        count += 1
                except Exception as e:
                    continue

            print(f"✓ {class_name}: {count} 개 이미지 저장됨")

        print("\n" + "=" * 60)
        print("✓ 다운로드 완료!")
        print("다음 단계: Google Teachable Machine에 업로드")
        print("경로: ./training_data/")
        print("=" * 60)

    except ImportError:
        print("\n⚠ galaxy-datasets 설치 필요")
        print("설치: pip install galaxy-datasets")
        print("\n또는 수동으로 다운로드:")
        print("1. https://zenodo.org/record/3565489 방문")
        print("2. images_gz2.zip 다운로드 (3.4 GB)")
        print("3. 이 스크립트 재실행")

if __name__ == "__main__":
    download_galaxy_zoo_data()
