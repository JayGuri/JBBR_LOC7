from flask import Blueprint, request, jsonify
import json
import os

signup_blueprint = Blueprint("signup", __name__)

USER_FILE = "users.json"

# Ensure users.json exists
if not os.path.exists(USER_FILE):
    with open(USER_FILE, "w") as f:
        json.dump({}, f)

@signup_blueprint.route("/", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")

    if not name or not username or not password:
        return jsonify({"message": "All fields are required"}), 400

    with open(USER_FILE, "r") as f:
        users = json.load(f)

    if username in users:
        return jsonify({"message": "User already exists"}), 400

    users[username] = {"name": name, "password": password}

    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

    return jsonify({"message": "Signup successful"}), 200
