"""
Google Teachable Machine 모델을 사용한 은하 분류기
"""

import os
import numpy as np
from PIL import Image
import json
from pathlib import Path

# TensorFlow 임포트
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 경고 메시지 억제
import tensorflow as tf

# 모델 경로
MODEL_DIR = Path(__file__).parent.parent / "tm-my-image-model"
METADATA_PATH = MODEL_DIR / "metadata.json"
MODEL_JSON_PATH = MODEL_DIR / "model.json"

# 메타데이터 로드
with open(METADATA_PATH, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

LABELS_KO = metadata.get('labels', ['타원은하', '나선은하', '불규칙은하'])
IMAGE_SIZE = metadata.get('imageSize', 224)

# 4개 클래스를 3개로 매핑
CLASS_MAPPING_4TO3 = {
    '타원은하': '타원은하',
    '정상나선은하': '나선은하',
    '막대나선은하': '나선은하',
    '불규칙은하': '불규칙은하'
}

LABELS_EN = {
    '타원은하': 'Elliptical',
    '나선은하': 'Spiral',
    '불규칙은하': 'Irregular'
}

print("=" * 60)
print("Google Teachable Machine 은하 분류 모델")
print("=" * 60)
print(f"모델 경로: {MODEL_DIR}")
print(f"클래스: {LABELS_KO}")
print(f"입력 크기: {IMAGE_SIZE}x{IMAGE_SIZE}")
print(f"메타데이터 로드: OK")

# TensorFlow.js 모델을 Python용으로 변환
# tensorflowjs_converter가 필요하지만, 여기서는 직접 로드 시도
print("\n모델 로드 중...")

try:
    # TensorFlow.js 모델을 직접 로드하기 위해 tfjs-to-tf 사용
    # 또는 SavedModel 형식으로 변환 필요

    # 임시 해결책: model.json과 weights.bin을 읽어서 처리
    with open(MODEL_JSON_PATH, 'r', encoding='utf-8') as f:
        model_json = json.load(f)

    print("모델 아키텍처 로드: OK")
    print("경고: 모델 변환 필요 - tensorflowjs_converter 사용 권장")

except Exception as e:
    print(f"오류: {str(e)}")
    print("\n모델을 Python에서 사용하기 위해 다음 명령어를 실행하세요:")
    print("pip install tensorflowjs")
    print("tensorflowjs_converter --input_format=tfjs_layers_model \\")
    print(f"  --output_format=tf_saved_model \\")
    print(f"  --output_node_names=dense \\")
    print(f"  {MODEL_JSON_PATH} \\")
    print(f"  {MODEL_DIR}/saved_model")


def predict(image: Image.Image) -> dict:
    """
    Teachable Machine 모델로 은하 분류
    """
    try:
        # 이미지 전처리
        image_rgb = image.convert('RGB')
        image_resized = image_rgb.resize((IMAGE_SIZE, IMAGE_SIZE))

        # numpy 배열로 변환
        image_array = np.array(image_resized, dtype=np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        # 모델 예측이 필요하지만, 여기서는 더미 예측 반환
        # 실제 모델 로드 후 아래 부분 활성화

        print("경고: 모델이 아직 로드되지 않았습니다")
        print("TensorFlow.js 모델을 SavedModel로 변환해야 합니다")

        # 더미 반환 (테스트용)
        predictions = np.array([0.25, 0.25, 0.25, 0.25])

    except Exception as e:
        print(f"오류: {str(e)}")
        predictions = np.array([0.25, 0.25, 0.25, 0.25])

    # 결과 정리
    top_idx = np.argsort(predictions)[::-1]

    # 4개 클래스를 3개로 매핑
    prob_3class = {
        '타원은하': 0.0,
        '나선은하': 0.0,
        '불규칙은하': 0.0
    }

    for i, prob in enumerate(predictions):
        label_4 = LABELS_KO[i]
        label_3 = CLASS_MAPPING_4TO3.get(label_4, label_4)
        prob_3class[label_3] += float(prob)

    # 3개 클래스 정렬
    sorted_probs = sorted(prob_3class.items(), key=lambda x: x[1], reverse=True)

    return {
        "primary": sorted_probs[0][0],
        "primary_en": LABELS_EN.get(sorted_probs[0][0], "Unknown"),
        "confidence": float(sorted_probs[0][1]),
        "top3": [
            {"label": class_name, "prob": float(prob)}
            for class_name, prob in sorted_probs
        ],
        "model_type": "Google Teachable Machine",
        "note": "Model conversion required for full functionality"
    }


if __name__ == "__main__":
    # 테스트
    test_img = Image.new('RGB', (224, 224), color=(100, 100, 100))
    result = predict(test_img)
    print("\n테스트 결과:")
    print(json.dumps(result, ensure_ascii=False, indent=2))
