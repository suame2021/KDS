from fastapi import FastAPI
import contextlib
from app.repo import db_session_manager
from app.routes import register_all_routes
from fastapi.middleware.cors import CORSMiddleware



@contextlib.asynccontextmanager
async def life_span(app):
    await db_session_manager.start()
    yield
    await db_session_manager.end()
    


app = FastAPI(title="KDS",lifespan=life_span)



all_origins = ["http://localhost:5173"]


register_all_routes(app)

app.add_middleware(
    CORSMiddleware,
            allow_credentials=True,
        allow_headers= ["*"],
        allow_origins=all_origins,
        allow_methods=["*"]
)



