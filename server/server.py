import json
import os
import re

from anthropic import Anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    name = data.get("name")
    address = data.get("address")
    place_id = data.get("place_id")
    lat = data.get("lat")
    lng = data.get("lng")

    if not name:
        return jsonify({"error": "Missing place name"}), 400

    prompt = f"""You are a review intelligence analyst. Based on your knowledge of "{name}" \
located at "{address}" (place_id: {place_id}, coordinates: {lat}, {lng}), provide a structured \
analysis of this place's reputation and typical customer experience.

Return ONLY a valid JSON object with these exact keys:
- "summary": 2–3 sentences. Analytical and specific — describe what this place is known for and \
the general customer experience. Do not start with "Overall" or "In summary".
- "positiveHighlights": Array of exactly 3 strings (1 sentence each). Specific positive themes \
with concrete detail.
- "negativeHighlights": Array of exactly 2 strings (1 sentence each). Specific complaints or \
common weaknesses.
- "trend": Exactly one word — "improving", "declining", or "stable".
- "sentimentScore": Integer 0–100 representing overall sentiment.
- "keyThemes": Array of 4–5 objects, each with "theme" (string) and "score" (integer 0–100). \
Use themes relevant to this type of venue (e.g. Service Speed, Food Quality, Atmosphere, Value, \
Wait Times).

Return ONLY valid JSON. No markdown, no code fences, no extra text."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    text = message.content[0].text.strip()
    # Strip markdown code fences if the model includes them
    text = re.sub(r"```(?:json)?\n?", "", text).strip().rstrip("`").strip()

    return jsonify(json.loads(text))


if __name__ == "__main__":
    app.run(port=3001, debug=True)
