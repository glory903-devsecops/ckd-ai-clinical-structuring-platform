import json
import os
from typing import List, Dict, Any
from datetime import datetime

class StorageService:
    def __init__(self, file_path: str = "app/data/diagnoses_archive.json"):
        self.file_path = file_path
        # Ensure data directory exists
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        
        # Initialize file if not exists
        if not os.path.exists(self.file_path):
            self._save_to_file([])

    def load_all(self) -> List[Dict[str, Any]]:
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading archive: {e}")
            return []

    def save_one(self, diagnosis_data: Dict[str, Any]):
        all_data = self.load_all()
        
        # Add id and timestamp if not present
        if "id" not in diagnosis_data:
            diagnosis_data["id"] = int(datetime.now().timestamp() * 1000)
        if "saved_at" not in diagnosis_data:
            diagnosis_data["saved_at"] = datetime.now().isoformat()
            
        all_data.insert(0, diagnosis_data)
        self._save_to_file(all_data)

    def delete_one(self, diagnosis_id: Any):
        all_data = self.load_all()
        # Convert IDs to string for safer comparison
        original_count = len(all_data)
        all_data = [d for d in all_data if str(d.get("id")) != str(diagnosis_id)]
        
        if len(all_data) < original_count:
            self._save_to_file(all_data)
            return True
        return False

    def update_one(self, diagnosis_id: Any, updated_content: str):
        all_data = self.load_all()
        found = False
        for d in all_data:
            if str(d.get("id")) == str(diagnosis_id):
                d["rawContent"] = updated_content
                d["updated_at"] = datetime.now().isoformat()
                found = True
                break
        
        if found:
            self._save_to_file(all_data)
            return True
        return False

    def _save_to_file(self, data: List[Dict[str, Any]]):
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving archive: {e}")

storage_service = StorageService()
