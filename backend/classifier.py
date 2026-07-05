"""
Google Teachable Machine TensorFlow Lite 모델을 사용한 은하 분류기
"""

import numpy as np
from PIL import Image
from pathlib import Path
import os

# TensorFlow Lite 모델 로드
try:
    import tensorflow as tf
    print("TensorFlow을 사용하여 TFLite 모델 로드")
except ImportError:
    print("TensorFlow이 없으므로 tf-lite-runtime 사용")
    import tflite_runtime.interpreter as tflite
    tf = None

# 모델 경로
MODEL_DIR = Path(__file__).parent.parent / "converted_tflite"
MODEL_PATH = MODEL_DIR / "model_unquant.tflite"
LABELS_PATH = MODEL_DIR / "labels.txt"

# 상수
IMAGE_SIZE = 224

# 레이블 로드
LABELS_KO = []
with open(LABELS_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line:
            parts = line.split(maxsplit=1)
            if len(parts) == 2:
                LABELS_KO.append(parts[1])

print("=" * 60)
print("Google Teachable Machine TFLite 은하 분류기")
print("=" * 60)
print(f"모델: {MODEL_PATH.name}")
print(f"클래스: {LABELS_KO}")
print(f"이미지 크기: {IMAGE_SIZE}x{IMAGE_SIZE}")

# 영문 레이블 매핑
LABELS_EN = {
    '타원은하': 'Elliptical',
    '정상나선은하': 'Normal Spiral',
    '막대나선은하': 'Barred Spiral',
    '불규칙은하': 'Irregular'
}

# 모델 로드
print("\n모델 로드 중...")
try:
    with open(MODEL_PATH, "rb") as f:
        model_content = f.read()
    if tf is not None:
        interpreter = tf.lite.Interpreter(model_content=model_content)
    else:
        interpreter = tflite.Interpreter(model_content=model_content)
except Exception as e:
    print(f"모델 바이트 로드 실패, model_path로 재시도: {e}")
    if tf is not None:
        interpreter = tf.lite.Interpreter(model_path=str(MODEL_PATH))
    else:
        interpreter = tflite.Interpreter(model_path=str(MODEL_PATH))

interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print(f"입력 shape: {input_details[0]['shape']}")
print(f"출력 shape: {output_details[0]['shape']}")
print("모델 로드 완료!")


def predict(image: Image.Image) -> dict:
    """
    은하 이미지를 분류하고 결과를 반환합니다.

    Args:
        image: PIL Image 객체

    Returns:
        분류 결과 딕셔너리
    """

    # 이미지 전처리
    image_rgb = image.convert('RGB')
    image_resized = image_rgb.resize((IMAGE_SIZE, IMAGE_SIZE))

    # Google Teachable Machine TFLite float 모델: float32, [-1, 1] 범위
    image_array = (np.array(image_resized, dtype=np.float32) / 127.5) - 1.0

    # 배치 차원 추가 (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)

    # 모델 입력 설정
    input_index = input_details[0]['index']
    interpreter.set_tensor(input_index, image_array)

    # 추론 실행
    interpreter.invoke()

    # 결과 추출 (TM 모델은 이미 소프트맥스 확률값 출력)
    output_index = output_details[0]['index']
    predictions = interpreter.get_tensor(output_index)[0]

    # 4개 클래스 확률 (모두 표시)
    prob_4class = {}
    for i, label_ko in enumerate(LABELS_KO):
        prob_4class[label_ko] = float(predictions[i])

    # 모든 클래스 정렬
    sorted_probs = sorted(prob_4class.items(), key=lambda x: x[1], reverse=True)

    # 주요 분류
    primary_class = sorted_probs[0][0]
    primary_confidence = sorted_probs[0][1]

    return {
        "primary": primary_class,
        "primary_en": LABELS_EN.get(primary_class, "Unknown"),
        "confidence": float(primary_confidence),
        "top3": [
            {"label": class_name, "prob": float(prob)}
            for class_name, prob in sorted_probs
        ]
    }
