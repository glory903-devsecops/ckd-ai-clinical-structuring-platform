import pytest
from fastapi.testclient import TestClient
from app.api import app
from app.services.storage_service import StorageService
import os

# Create a separate TestClient
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_data():
    # Setup test file path before each test
    test_file = "app/data/test_diagnoses_archive.json"
    if os.path.exists(test_file):
        os.remove(test_file)
    
    # Patch the storage service in the app
    # In api.py, it's imported as 'from app.services.storage_service import storage_service'
    import app.api as api_module
    api_module.storage_service = StorageService(file_path=test_file)
    
    yield
    
    # Cleanup
    if os.path.exists(test_file):
        os.remove(test_file)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_structure_diagnosis():
    payload = {
        "diagnosis": "사구체신염 환자 CKD 4단계",
        "perspective": "치료 단계 중심"
    }
    response = client.post("/api/structure", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "CKD 4" in data["keywords"]
    assert "사구체신염" in data["keywords"]
    assert data["rawContent"] == payload["diagnosis"]

def test_crud_flow():
    # 1. Create (Structure)
    payload = {"diagnosis": "고혈압 및 단백뇨 소견"}
    post_res = client.post("/api/structure", json=payload)
    diagnosis_id = post_res.json()["id"]
    
    # 2. Read (Get All)
    get_res = client.get("/api/diagnoses")
    assert any(d["id"] == diagnosis_id for d in get_res.json())
    
    # 3. Update
    update_payload = {"rawContent": "수정된 진단 내용"}
    put_res = client.put(f"/api/diagnoses/{diagnosis_id}", json=update_payload)
    assert put_res.status_code == 200
    
    # Verify update
    get_res_2 = client.get("/api/diagnoses")
    updated_item = next(d for d in get_res_2.json() if d["id"] == diagnosis_id)
    assert updated_item["rawContent"] == "수정된 진단 내용"
    
    # 4. Delete
    del_res = client.delete(f"/api/diagnoses/{diagnosis_id}")
    assert del_res.status_code == 200
    
    # Verify deletion
    get_res_3 = client.get("/api/diagnoses")
    assert not any(d["id"] == diagnosis_id for d in get_res_3.json())
