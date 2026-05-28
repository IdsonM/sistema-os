from app.core.security import create_token

fake_user = {
    "username": "admin",
    "password": "123456"
}

def authenticate(username: str, password: str):
    if username == fake_user["username"] and password == fake_user["password"]:
        return create_token({"sub": username})
    return None