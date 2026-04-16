FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing .pyc files and set output to unbuffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Fix Line Endings and Permissions explicitly for Windows environments
RUN tr -d '\r' < entrypoint.sh > temp.sh && mv temp.sh entrypoint.sh
RUN chmod +x entrypoint.sh

# Expose ports: 8501 (Streamlit), 8000 (FastAPI)
EXPOSE 8501
EXPOSE 8000

# Use the entrypoint script
CMD ["./entrypoint.sh"]
