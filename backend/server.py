from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Dounie Cuisine API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure selon vos besoins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/dounie_cuisine")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dounie_cuisine")

# Global MongoDB client
mongodb_client: Optional[AsyncIOMotorClient] = None
database = None

# Pydantic models
class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetVerify(BaseModel):
    code: str

class PasswordResetComplete(BaseModel):
    code: str
    newPassword: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    firstName: str
    lastName: str
    role: str

# Database connection functions
async def connect_to_mongo():
    """Create database connection"""
    global mongodb_client, database
    mongodb_client = AsyncIOMotorClient(MONGO_URL)
    database = mongodb_client[DATABASE_NAME]
    logger.info("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        logger.info("Disconnected from MongoDB")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok", 
        "timestamp": "2025-06-26T17:40:00Z",
        "service": "Dounie Cuisine API",
        "version": "1.0.0"
    }

# Authentication endpoints
@app.post("/api/auth/login", response_model=dict)
async def login(login_data: LoginRequest):
    """Login endpoint - simplified for now"""
    # Cette implémentation sera complétée selon les besoins
    if login_data.username == "admin" and login_data.password == "Admin123!":
        user = {
            "id": "1",
            "username": "admin",
            "email": "admin@dounie-cuisine.ca",
            "firstName": "Admin",
            "lastName": "Dounie",
            "role": "admin"
        }
        return {"user": user, "token": "fake-jwt-token"}
    elif login_data.username == "staff" and login_data.password == "Staff123!":
        user = {
            "id": "2", 
            "username": "staff",
            "email": "staff@dounie-cuisine.ca",
            "firstName": "Staff",
            "lastName": "Member",
            "role": "staff"
        }
        return {"user": user, "token": "fake-jwt-token"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_current_user():
    """Get current user endpoint"""
    # Implémentation simplifiée
    return {"message": "Authentication required"}

# Password recovery endpoints (as per FINAL_TASKS_COMPLETION.md)
@app.post("/api/admin/generate-password-reset")
async def generate_password_reset(request: PasswordResetRequest):
    """Generate password reset code (admin only)"""
    # Générer un code de récupération
    import random
    import string
    from datetime import datetime, timedelta
    
    reset_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    expires_at = datetime.now() + timedelta(hours=24)
    
    # Simuler la sauvegarde en base (à implémenter avec MongoDB)
    logger.info(f"Generated reset code {reset_code} for {request.email}")
    
    return {
        "resetCode": reset_code,
        "expiresAt": expires_at.isoformat(),
        "message": "Code de récupération généré avec succès"
    }

@app.get("/api/admin/password-reset-codes")
async def get_password_reset_codes():
    """List active reset codes (admin only)"""
    # Simuler des codes actifs
    codes = [
        {
            "code": "ABC12345",
            "email": "staff@dounie-cuisine.ca",
            "expiresAt": "2025-06-27T17:40:00Z",
            "used": False
        }
    ]
    return codes

@app.post("/api/auth/verify-reset-code")
async def verify_reset_code(request: PasswordResetVerify):
    """Verify reset code (public endpoint)"""
    # Simuler la vérification
    if request.code in ["ABC12345", "STAFF123"]:
        user = {
            "id": "2",
            "firstName": "Staff",
            "lastName": "Member", 
            "email": "staff@dounie-cuisine.ca"
        }
        return {"valid": True, "user": user}
    else:
        return {"valid": False, "message": "Code invalide ou expiré"}

@app.post("/api/auth/reset-password")
async def reset_password(request: PasswordResetComplete):
    """Reset password (public endpoint)"""
    # Simuler le reset
    if request.code in ["ABC12345", "STAFF123"] and len(request.newPassword) >= 8:
        return {"message": "Mot de passe réinitialisé avec succès"}
    else:
        raise HTTPException(status_code=400, detail="Code invalide ou mot de passe trop faible")

# Quote system endpoints (as mentioned in FINAL_TASKS_COMPLETION.md)
@app.get("/api/quotes")
async def get_quotes():
    """Get all quotes"""
    return []

@app.post("/api/quotes")
async def create_quote(quote_data: dict):
    """Create new quote"""
    # Simuler la création
    quote_id = "quote_001"
    return {"id": quote_id, **quote_data}

@app.post("/api/quotes/{quote_id}/send")
async def send_quote(quote_id: str):
    """Send quote (manual notification system)"""
    return {
        "message": "Devis prêt à envoyer",
        "note": "Envoi manuel requis - le système génère le devis mais l'envoi par email doit être fait manuellement par l'administrateur"
    }

# Menu endpoints (basic structure)
@app.get("/api/menu")
async def get_menu():
    """Get menu items"""
    return []

@app.post("/api/menu")
async def create_menu_item(item_data: dict):
    """Create menu item"""
    return {"id": "menu_001", **item_data}

# Reservations endpoints (basic structure)  
@app.get("/api/reservations")
async def get_reservations():
    """Get reservations"""
    return []

@app.post("/api/reservations")
async def create_reservation(reservation_data: dict):
    """Create reservation"""
    return {"id": "reservation_001", **reservation_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)