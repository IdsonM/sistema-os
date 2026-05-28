import requests

BASE_URL = "http://127.0.0.1:8000"


def get_os():
    response = requests.get(f"{BASE_URL}/os/")
    return response.json()


def create_os(data):
    response = requests.post(f"{BASE_URL}/os/", json=data)
    return response.json()