import json

USERS_FILE = "backend/users.json"

def load_users():
    try:
        with open(USERS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

def save_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)
