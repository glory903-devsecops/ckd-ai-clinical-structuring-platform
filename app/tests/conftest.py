import pytest
import os
import json
from app.services.storage_service import StorageService

@pytest.fixture
def test_storage():
    test_file = "app/data/test_diagnoses_archive.json"
    # Ensure fresh start
    if os.path.exists(test_file):
        os.remove(test_file)
    
    storage = StorageService(file_path=test_file)
    yield storage
    
    # Cleanup after tests
    if os.path.exists(test_file):
        os.remove(test_file)

@pytest.fixture
def mock_diagnosis():
    return {
        "disease": "Chronic Kidney Disease Stage 4",
        "rawContent": "65세 남성 고혈압 환자, eGFR 25로 CKD 4단계 진단됨.",
        "preference": "치료 단계 중심",
        "overview": "Test overview",
        "sections": [],
        "keywords": ["CKD 4", "고혈압"]
    }
