#!/bin/bash
set -e

echo "===================================================="
echo "CDDP Local Server Initialization..."
echo "Timestamp: $(date)"
echo "Working Directory: $(pwd)"
echo "PYTHONPATH: $PYTHONPATH"
echo "===================================================="

# Start FastAPI in the background
echo "[1/2] Launching FastAPI on port 8000..."
uvicorn app.api:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Wait a moment for FastAPI to initialize
sleep 2
echo "[Success] FastAPI (PID: $FASTAPI_PID) is running in background."

# Start Streamlit in the foreground
echo "[2/2] Launching Streamlit Expert UI on port 8501..."
streamlit run app/main.py --server.port=8501 --server.address=0.0.0.0
