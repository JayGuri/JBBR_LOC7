const API_URL = "http://127.0.0.1:5000";

// Signup Function
function signup() {
    const name = document.getElementById("signupName").value;
    const username = document.getElementById("signupUser").value;
    const password = document.getElementById("signupPass").value;
    
    fetch(`${API_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("signupMsg").innerText = data.message;
    });
}

// Login Function
function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("loginMsg").innerText = data.message;
        if (data.message === "Login successful") {
            localStorage.setItem("user", username);
            window.location.href = "dashboard.html";
        }
    });
}
