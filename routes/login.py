from flask import Blueprint, request, jsonify
import json

login_blueprint = Blueprint("login", __name__)

USER_FILE = "users.json"

@login_blueprint.route("/", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    with open(USER_FILE, "r") as f:
        users = json.load(f)

    if username in users and users[username]["password"] == password:
        return jsonify({"message": "Login successful", "username": username}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
