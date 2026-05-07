from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router

# 🔥 NEW IMPORT
from .db.database import init_db

app = FastAPI()

# 🔥 INITIALIZE DATABASE
init_db()

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 ROUTES
app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "message": "UBID System Running Successfully!"
    }