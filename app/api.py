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
    """상태가 활성인(is_deleted=False) 진단 내역만 반환합니다."""
    all_data = storage_service.load_all()
    active_data = [d for d in all_data if not d.get("is_deleted", False)]
    return active_data

@app.get("/api/diagnoses/trash")
def get_trash_diagnoses():
    """휴지통에 있는(is_deleted=True) 진단 내역만 반환합니다."""
    all_data = storage_service.load_all()
    deleted_data = [d for d in all_data if d.get("is_deleted", False)]
    return deleted_data

@app.post("/api/diagnoses/{diagnosis_id}/restore")
def restore_diagnosis(diagnosis_id: str):
    """휴지통의 진단 내역을 복구합니다."""
    success = storage_service.restore_one(diagnosis_id)
    if not success:
        raise HTTPException(status_code=404, detail="Diagnosis not found in trash")
    return {"status": "success", "message": f"Diagnosis {diagnosis_id} restored"}

@app.post("/api/diagnoses/purge")
def purge_trash():
    """휴지통을 비웁니다. 백엔드에서는 별도 파일에 보관됩니다."""
    count = storage_service.purge_trash()
    return {"status": "success", "message": f"{count} items purged and archived"}

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

@app.post("/api/diagnoses/bulk")
def bulk_upload_diagnoses(request: List[StructuringRequest]):
    """대량의 진단 내역을 한 번에 업로드합니다."""
    results = []
    for item in request:
        try:
            # 대량 업로드는 부하 방지를 위해 최소한의 구조화만 수행하거나 숏컷을 사용함
            result = struct_service.run_structuring_workflow(item.diagnosis, item.perspective)
            storage_service.save_one(result)
            results.append(result)
        except Exception as e:
            continue
    return {"status": "success", "count": len(results), "items": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
