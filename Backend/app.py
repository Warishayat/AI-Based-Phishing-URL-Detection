from fastapi import FastAPI
from Routes.auth_route import auth_router
from Database.database import engine,Base
from Routes.upishing_route import domain_router
from Routes.domain_route import pishing_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI(title="Ai Pishing Dtection")
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(domain_router)
app.include_router(pishing_router)

@app.get("/")
def home():
    return {"message": "Pishing-API's is running"}
