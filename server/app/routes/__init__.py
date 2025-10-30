from .auth.auth import auth

def register_all_routes(app):
    app.include_router(auth)