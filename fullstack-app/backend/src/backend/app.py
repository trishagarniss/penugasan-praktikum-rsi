from fastapi import FastAPI
from src.backend.routes import account_route, event_route, user_route, role_route, registration_route
from src.backend.middlewares.cors_middleware import setup_cors

app = FastAPI(
    title="API Praktikum RSI Kelompok 2",
    description="Dokumentasi API untuk tugas CRUD"
)

setup_cors(app)

@app.get("/")
def read_root():
    return {"message": "Server Backend Sedang Berjalan Cuyy!"}

app.include_router(account_route.router)
app.include_router(event_route.router)
app.include_router(registration_route.router)
app.include_router(role_route.router)
app.include_router(user_route.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)