import requests
import json

data = {
    "name": "Script Test",
    "nic": "ScriptNIC",
    "languages": "English",
    "country": "Sri Lanka",
    "profileImage": "picures/Counselor.jpg",
    "details": {
        "dob": "1990-01-01",
        "civilStatus": "married",
        "education": "PhD",
        "experience": 10
    }
}

try:
    r = requests.post("http://127.0.0.1:8000/api/counselors", json=data)
    print(f"Status Code: {r.status_code}")
    print(f"Response: {r.text}")
except Exception as e:
    print(f"Error: {e}")
