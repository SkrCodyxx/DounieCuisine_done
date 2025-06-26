from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from datetime import datetime, timedelta
import random
import string

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Dounie Cuisine API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    try:
        mongodb_client = AsyncIOMotorClient(MONGO_URL)
        database = mongodb_client[DATABASE_NAME]
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")

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
        "timestamp": datetime.now().isoformat(),
        "service": "Dounie Cuisine API",
        "version": "1.0.0"
    }

# In-memory storage for reset codes and user credentials
reset_codes_storage = {}
user_credentials = {
    "admin": {"password": "Admin123!", "user_data": {
        "id": "1", "username": "admin", "email": "admin@dounie-cuisine.ca",
        "firstName": "Admin", "lastName": "Dounie", "role": "admin"
    }},
    "staff": {"password": "Staff123!", "user_data": {
        "id": "2", "username": "staff", "email": "staff@dounie-cuisine.ca", 
        "firstName": "Staff", "lastName": "Member", "role": "staff"
    }}
}

# Authentication endpoints
@app.post("/api/auth/login", response_model=dict)
async def login(login_data: LoginRequest):
    """Login endpoint - improved with dynamic credentials"""
    if login_data.username in user_credentials:
        stored_creds = user_credentials[login_data.username]
        if stored_creds["password"] == login_data.password:
            return {"user": stored_creds["user_data"], "token": "fake-jwt-token"}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_current_user():
    """Get current user endpoint"""
    return {"message": "Authentication required"}

# Password recovery endpoints
@app.post("/api/admin/generate-password-reset")
async def generate_password_reset(request: PasswordResetRequest):
    """Generate password reset code (admin only)"""
    reset_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    expires_at = datetime.now() + timedelta(hours=24)
    
    # Save code in memory
    reset_codes_storage[reset_code] = {
        "email": request.email,
        "expires_at": expires_at,
        "used": False
    }
    
    logger.info(f"Generated reset code {reset_code} for {request.email}")
    
    return {
        "resetCode": reset_code,
        "expiresAt": expires_at.isoformat(),
        "message": "Code de récupération généré avec succès"
    }

@app.get("/api/admin/password-reset-codes")
async def get_password_reset_codes():
    """List active reset codes (admin only)"""
    active_codes = []
    for code, data in reset_codes_storage.items():
        if data["expires_at"] > datetime.now() and not data["used"]:
            active_codes.append({
                "code": code,
                "email": data["email"],
                "expiresAt": data["expires_at"].isoformat(),
                "used": data["used"]
            })
    
    return active_codes

@app.post("/api/auth/verify-reset-code")
async def verify_reset_code(request: PasswordResetVerify):
    """Verify reset code (public endpoint)"""
    if request.code in reset_codes_storage:
        code_data = reset_codes_storage[request.code]
        if code_data["expires_at"] > datetime.now() and not code_data["used"]:
            # Simulate user based on email
            if code_data["email"] == "staff@dounie-cuisine.ca":
                user = {
                    "id": "2",
                    "firstName": "Staff",
                    "lastName": "Member", 
                    "email": "staff@dounie-cuisine.ca"
                }
            else:
                user = {
                    "id": "1",
                    "firstName": "Admin",
                    "lastName": "Dounie",
                    "email": code_data["email"]
                }
            return {"valid": True, "user": user}
    
    return {"valid": False, "message": "Code invalide ou expiré"}

@app.post("/api/auth/reset-password")
async def reset_password(request: PasswordResetComplete):
    """Reset password (public endpoint)"""
    if request.code in reset_codes_storage:
        code_data = reset_codes_storage[request.code]
        if code_data["expires_at"] > datetime.now() and not code_data["used"]:
            if len(request.newPassword) >= 8:
                # Update user password
                email = code_data["email"]
                for username, creds in user_credentials.items():
                    if creds["user_data"]["email"] == email:
                        user_credentials[username]["password"] = request.newPassword
                        logger.info(f"Password updated for user {username}")
                        break
                
                # Mark code as used
                reset_codes_storage[request.code]["used"] = True
                return {"message": "Mot de passe réinitialisé avec succès"}
            else:
                raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au moins 8 caractères")
    
    raise HTTPException(status_code=400, detail="Code invalide ou mot de passe trop faible")

# Quote system endpoints
@app.get("/api/quotes")
async def get_quotes():
    """Get all quotes"""
    return []

@app.post("/api/quotes")
async def create_quote(quote_data: dict):
    """Create new quote"""
    quote_id = f"quote_{random.randint(1000, 9999)}"
    return {"id": quote_id, **quote_data}

@app.post("/api/quotes/{quote_id}/send")
async def send_quote(quote_id: str):
    """Send quote (manual notification system)"""
    return {
        "message": "Devis prêt à envoyer",
        "note": "Envoi manuel requis - le système génère le devis mais l'envoi par email doit être fait manuellement par l'administrateur"
    }

# Menu endpoints
@app.get("/api/menu")
async def get_menu():
    """Get menu items"""
    return [
        {
            "id": "1",
            "name": "Poule nan Sos",
            "description": "Poulet traditionnel en sauce créole",
            "price": 24.99,
            "category": "plats"
        },
        {
            "id": "2", 
            "name": "Riz Collé aux Pois",
            "description": "Riz aux haricots rouges, plat national",
            "price": 18.99,
            "category": "plats"
        },
        {
            "id": "3",
            "name": "Poisson Gros Sel", 
            "description": "Poisson grillé aux épices créoles",
            "price": 28.99,
            "category": "plats"
        }
    ]

@app.post("/api/menu")
async def create_menu_item(item_data: dict):
    """Create menu item"""
    return {"id": f"menu_{random.randint(1000, 9999)}", **item_data}

# Reservations endpoints
@app.get("/api/reservations")
async def get_reservations():
    """Get reservations"""
    return []

@app.post("/api/reservations")
async def create_reservation(reservation_data: dict):
    """Create reservation"""
    return {"id": f"reservation_{random.randint(1000, 9999)}", **reservation_data}

# Dashboard statistics endpoint
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return {
        "totalOrders": 0,
        "totalRevenue": 0,
        "pendingReservations": 0,
        "activeMenuItems": 3
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)