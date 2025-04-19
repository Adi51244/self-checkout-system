from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import sys

# Add the backend directory to Python path
backend_path = Path(__file__).parent
sys.path.append(str(backend_path))

import product

app = FastAPI()

# Configure CORS with specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static directory exists
static_dir = Path("static")
static_dir.mkdir(exist_ok=True)

# Mount static files with proper configuration
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(product.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
