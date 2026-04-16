from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.structuring_service import StructuringService
from app.services.storage_service import storage_service
from typing import Optional, List, Any

app = FastAPI(title="CDDP Clinical API with Full CRUD")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StructuringRequest(BaseModel):
    diagnosis: str
    perspective: Optional[str] = "치료 단계 중심"

class UpdateRequest(BaseModel):
    rawContent: str

struct_service = StructuringService()

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "CDDP-Backend-CRUD"}

@app.get("/api/diagnoses")
def get_all_diagnoses():
    return storage_service.load_all()

@app.post("/api/structure")
def structure_diagnosis(request: StructuringRequest):
    try:
        result = struct_service.run_structuring_workflow(request.diagnosis, request.perspective)
        storage_service.save_one(result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/diagnoses/{diagnosis_id}")
def delete_diagnosis(diagnosis_id: str):
    """특정 진단 내역을 영구 삭제합니다."""
    success = storage_service.delete_one(diagnosis_id)
    if not success:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return {"status": "success", "message": f"Diagnosis {diagnosis_id} deleted"}

@app.put("/api/diagnoses/{diagnosis_id}")
def update_diagnosis(diagnosis_id: str, request: UpdateRequest):
    """특정 진단 내역의 텍스트 내용을 수정합니다."""
    success = storage_service.update_one(diagnosis_id, request.rawContent)
    if not success:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return {"status": "success", "message": f"Diagnosis {diagnosis_id} updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
