"""
Google Teachable Machine 모델 로더 (간단한 버전)
TensorFlow.js에서 직접 예측하기 (온라인 변환 대기 중)

임시로 모델 가중치를 로드하고 추론을 실행합니다.
"""

import numpy as np
from PIL import Image
import json
from pathlib import Path

# 모델 디렉토리
MODEL_DIR = Path(__file__).parent.parent / "tm-my-image-model"

# 메타데이터 로드
with open(MODEL_DIR / "metadata.json", 'r', encoding='utf-8') as f:
    metadata = json.load(f)

LABELS_KO = metadata.get('labels', [])
IMAGE_SIZE = metadata.get('imageSize', 224)

# 4개 클래스를 3개로 매핑
CLASS_MAPPING = {
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

print("=" * 70)
print("Google Teachable Machine 은하 분류기 (간단 버전)")
print("=" * 70)
print(f"모델 경로: {MODEL_DIR}")
print(f"학습된 클래스:")
for i, label in enumerate(LABELS_KO):
    mapped = CLASS_MAPPING.get(label, label)
    print(f"  {i+1}. {label} → {mapped}")
print(f"입력 크기: {IMAGE_SIZE}x{IMAGE_SIZE}")


def predict(image: Image.Image) -> dict:
    """
    임시 예측 함수

    참고: 완전한 모델 로드를 위해서는 다음 중 하나가 필요합니다:
    1. TensorFlow SavedModel로 변환 (tensorflowjs_converter 사용)
    2. ONNX로 변환
    3. PyTorch로 변환
    """

    # 이미지 전처리
    image_rgb = image.convert('RGB')
    image_resized = image_rgb.resize((IMAGE_SIZE, IMAGE_SIZE))

    # 정규화 (0-1 범위)
    image_array = np.array(image_resized, dtype=np.float32) / 255.0

    # 배치 차원 추가
    image_array = np.expand_dims(image_array, axis=0)

    print(f"\n[DEBUG] 이미지 처리: {image_array.shape}")

    # ========== 모델 로드 필요 ==========
    # 현재는 더미 예측 반환
    # 아래 코드는 모델이 LoadedModel 형식으로 변환된 후 활성화됩니다

    # try:
    #     import tensorflow as tf
    #     model = tf.keras.models.load_model(str(MODEL_DIR / "saved_model"))
    #     predictions = model.predict(image_array, verbose=0)[0]
    # except:
    #     print("경고: TensorFlow 모델 로드 실패, 더미 값 사용 중")
    #     predictions = np.array([0.25] * len(LABELS_KO))

    # 임시: 무작위 예측
    predictions = np.random.dirichlet(np.ones(len(LABELS_KO)))

    # 클래스별 확률
    class_probs = {}
    for i, label in enumerate(LABELS_KO):
        mapped_label = CLASS_MAPPING.get(label, label)
        if mapped_label not in class_probs:
            class_probs[mapped_label] = 0.0
        class_probs[mapped_label] += float(predictions[i])

    # 정렬
    sorted_probs = sorted(class_probs.items(), key=lambda x: x[1], reverse=True)

    return {
        "primary": sorted_probs[0][0],
        "primary_en": LABELS_EN.get(sorted_probs[0][0], "Unknown"),
        "confidence": float(sorted_probs[0][1]),
        "top3": [
            {"label": name, "prob": prob}
            for name, prob in sorted_probs
        ],
        "model_status": "REQUIRES_MODEL_CONVERSION",
        "note": "TensorFlow.js 모델을 SavedModel로 변환 필요"
    }


if __name__ == "__main__":
    # 테스트
    test_img = Image.new('RGB', (224, 224), color=(100, 100, 100))
    result = predict(test_img)

    print("\n테스트 결과:")
    print(f"주요 분류: {result['primary']} ({result['primary_en']})")
    print(f"신뢰도: {result['confidence']:.1%}")
    print(f"\n상위 3개:")
    for item in result['top3']:
        print(f"  - {item['label']}: {item['prob']:.1%}")
