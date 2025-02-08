from flask import Flask, jsonify
from flask_cors import CORS
from routes.login import login_blueprint
from routes.signup import signup_blueprint

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Register Routes
app.register_blueprint(signup_blueprint, url_prefix="/signup")
app.register_blueprint(login_blueprint, url_prefix="/login")

@app.route("/")
def home():
    return jsonify({"message": "Flask Backend Running!"})

if __name__ == "__main__":
    app.run(debug=True)
