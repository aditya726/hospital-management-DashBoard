from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from starlette import status
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
from pymongo import MongoClient
import os 

load_dotenv()

route = APIRouter(
    prefix = '/auth',
    tags = ['auth']
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
# Token expiration time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # You can adjust this value as needed

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["staff-management"]  # Replace with your database name
users_collection = db["staff"]  # Replace with your users collection name

#password hashing and unhashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")
ouath2_Bearer = OAuth2PasswordBearer(tokenUrl = 'auth/token')

class UserRegistration(BaseModel):
    username:str
    email:str
    password:str
    
class Token(BaseModel):
    access_token:str
    token_type:str 


# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_username(username: str):
    return users_collection.find_one({"username": username})


# Routes
@route.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegistration):
    # Check if the user already exists
    if get_user_by_username(user.username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Hash the password and save the user to the database
    hashed_password = hash_password(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(user_data)
    return {"message": "User registered successfully"}


@route.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Authenticate the user
    user = get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create a JWT token
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}


@route.get("/me")
async def get_current_user(token: Annotated[str, Depends(ouath2_Bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = get_user_by_username(username)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return {"username": user["username"], "email": user["email"]}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")