from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from classifier import predict

app = FastAPI(title="HubbleEye API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def classify_galaxy(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))
    return predict(image)

@app.get("/health")
async def health():
    return {"status": "ok"}
