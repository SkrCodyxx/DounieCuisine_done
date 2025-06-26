from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Dounie Cuisine API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)