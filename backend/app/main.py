from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings, logger
from app.routers import datemate_router, call_router, webhook_router, assistant_router, analytics_router

# Create FastAPI app instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend service for DateMate Vapi agent creation and general Vapi interactions."
)
# ADD cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Include routers
app.include_router(datemate_router.router)
app.include_router(call_router.router)
app.include_router(webhook_router.router)
app.include_router(assistant_router.router)
app.include_router(analytics_router.router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Vapi Backend Service...")
    if not settings.VAPI_API_KEY:
        logger.critical("VAPI_API_KEY is not set. The application may not function correctly with Vapi.")
    # You can add other startup logic here, like initializing DB connections if needed


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Vapi Backend Service...")
    # Add cleanup logic here if needed


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} v{settings.VERSION}"}