# python_verify/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import face_recognition
import numpy as np
from io import BytesIO
from PIL import Image

app = FastAPI()

def load_image_from_bytes(data: bytes):
    try:
        img = face_recognition.load_image_file(BytesIO(data))
        return img
    except Exception as e:
        raise

@app.post("/verify")
async def verify(idFront: UploadFile = File(...), selfie: UploadFile = File(...), idBack: UploadFile | None = None):
    try:
        id_bytes = await idFront.read()
        selfie_bytes = await selfie.read()

        id_img = load_image_from_bytes(id_bytes)
        selfie_img = load_image_from_bytes(selfie_bytes)

        id_encodings = face_recognition.face_encodings(id_img)
        selfie_encodings = face_recognition.face_encodings(selfie_img)

        if len(id_encodings) == 0:
            return JSONResponse({"match": False, "error": "No face found in ID image"}, status_code=200)
        if len(selfie_encodings) == 0:
            return JSONResponse({"match": False, "error": "No face found in selfie"}, status_code=200)

        id_encoding = id_encodings[0]
        selfie_encoding = selfie_encodings[0]

        distances = face_recognition.face_distance([id_encoding], selfie_encoding)
        distance = float(distances[0])

        # typical threshold: 0.6 ; lower = stricter (0.45 very strict)
        threshold = 0.6
        match = distance <= threshold

        return {"match": match, "distance": distance, "threshold": threshold}
    except Exception as e:
        return JSONResponse({"match": False, "error": str(e)}, status_code=500)
