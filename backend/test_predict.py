import requests

token = ""
try:
    res = requests.post("http://127.0.0.1:8000/auth/register", json={
        "username": "testuser_jwt_debug",
        "email": "debug@jwt.com",
        "password": "testpassword"
    })
    print("Register:", res.json())
    token = res.json().get("access_token")
except Exception as e:
    token = "error"

if token and token != "error":
    img_path = r"C:\Users\kashy\.gemini\antigravity\brain\36114784-f558-4f3d-994b-82328aa76d75\sample_skin_lesion_1774546620325.png"
    with open(img_path, "rb") as f:
        files = {"file": f}
        headers = {"Authorization": f"Bearer {token}"}
        res2 = requests.post("http://127.0.0.1:8000/predict/", files=files, headers=headers)
    print("Predict:", res2.status_code, res2.text)
