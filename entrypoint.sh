#!/bin/bash

# Start FastAPI in the background
echo "Starting FastAPI on port 8000..."
uvicorn app.api:app --host 0.0.0.0 --port 8000 &

# Start Streamlit in the foreground
echo "Starting Streamlit on port 8501..."
streamlit run app/main.py --server.port=8501 --server.address=0.0.0.0
