from fastapi import FastAPI
from Routes.auth_route import auth_router
from Database.database import engine,Base
from Routes.upishing_route import domain_router
from Routes.domain_route import pishing_router

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Ai Pishing Dtection")


app.include_router(auth_router)
app.include_router(domain_router)
app.include_router(pishing_router)

@app.get("/")
def home():
    return {"message": "API is running"}