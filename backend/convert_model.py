"""
Google Teachable Machine (TensorFlow.js) 모델을 Python SavedModel로 변환
"""

import json
import os
from pathlib import Path

def convert_tfjs_to_savedmodel():
    """TensorFlow.js 모델을 SavedModel 형식으로 변환"""

    model_dir = Path(__file__).parent.parent / "tm-my-image-model"
    output_dir = model_dir / "saved_model"

    print("=" * 70)
    print("TensorFlow.js 모델을 SavedModel로 변환 중...")
    print("=" * 70)
    print(f"입력: {model_dir}/model.json")
    print(f"출력: {output_dir}/")

    try:
        # tensorflowjs_converter 명령어 구성
        model_json = model_dir / "model.json"

        # 명령어: tensorflowjs_converter
        cmd = (
            f"tensorflowjs_converter "
            f"--input_format=tfjs_layers_model "
            f"--output_format=tf_saved_model "
            f"{model_json} {output_dir}"
        )

        print(f"\n실행 명령어:")
        print(cmd)
        print("\n변환 중...")

        ret = os.system(cmd)

        if ret == 0:
            print("\n✓ 변환 성공!")
            print(f"SavedModel 저장 위치: {output_dir}")
            return True
        else:
            print(f"\n✗ 변환 실패 (코드: {ret})")
            return False

    except Exception as e:
        print(f"\n오류: {str(e)}")
        return False


if __name__ == "__main__":
    convert_tfjs_to_savedmodel()
