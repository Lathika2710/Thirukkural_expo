import os
import random
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

# Load the existing .env file from the project directory.
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Use the existing environment variable. The value is never sent to the browser.
API_KEY = os.getenv("THIRUKKURAL_API_KEY")

app = Flask(__name__)

# GetThirukkural v3 API endpoint documented by the Thirukkural API service.
# The API expects the application ID as the "appid" query parameter.
API_URL = "https://getthirukkural.appspot.com/api/3.0/kural/{number}"

def fetch_kural(number):
    if not API_KEY:
        raise RuntimeError("API configuration error")

    params = {
        "appid": API_KEY,
        "format": "json",
    }

    response = requests.get(
        API_URL.format(number=number),
        params=params,
        timeout=10,
    )

    if response.status_code >= 400:
        raise requests.RequestException("Thirukkural API request failed")

    data = response.json()

    # The API can return an error object even with an HTTP success response.
    if isinstance(data, dict) and "error" in data:
        raise requests.RequestException("Thirukkural API returned an error")

    return {
        "number": data.get("number", number),
        "kural": " ".join(
            part for part in [data.get("line1"), data.get("line2")] if part
        ).strip(),
        "line1": data.get("line1", ""),
        "line2": data.get("line2", ""),
        "porul": data.get("urai1") or data.get("tam_exp") or "",
        "athigaram": data.get("athigaram") or data.get("chap_tam") or "",
        "athigaram_number": data.get("athigaram_number"),
        "paal": data.get("paal", ""),
        "iyal": data.get("iyal", ""),
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/kural/<int:number>", methods=["GET"])
def get_kural(number):
    if number < 1 or number > 1330:
        return jsonify({
            "success": False,
            "message": "குறள் எண் 1 முதல் 1330 வரை இருக்க வேண்டும்."
        }), 400

    try:
        result = fetch_kural(number)
        return jsonify({"success": True, "data": result})
    except RuntimeError:
        return jsonify({
            "success": False,
            "message": "API configuration error. Please check the .env configuration."
        }), 500
    except (requests.RequestException, ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "திருக்குறள் தகவலை பெற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
        }), 502


@app.route("/api/random", methods=["GET"])
def random_kural():
    return get_kural(random.randint(1, 1330))


if __name__ == "__main__":
    app.run(debug=True)
