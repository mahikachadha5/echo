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
analysis of this place's reputation and customer experience.

Return ONLY a valid JSON object with exactly these keys:
- "claudeTake": One punchy, opinionated sentence (under 20 words) capturing the essence of this \
place. Write as if recommending to a trusted friend. Avoid generic phrases like "a must-visit".
- "sentimentScore": Integer 0–100 representing overall public sentiment.
- "trend": Exactly one word — "improving", "declining", or "stable".
- "trendDescription": One sentence explaining the sentiment trend based on recent vs older reviews.
- "keyThemes": Array of 5–7 objects ordered by score descending, each with "theme" (string), \
"score" (integer 0–100), and "mentions" (integer, estimated review mention count). Use themes \
relevant to this venue type (e.g. Food quality, Service, Ambiance, Value, Wait time).
- "vibeTags": Array of 4–6 short strings describing the emotional tone and vibe \
(e.g. "Intimate", "Worth every penny", "Hidden gem").
- "bestFor": Array of exactly 4 strings describing ideal occasions or visitor types \
(e.g. "Special occasion", "Date night", "Families", "Solo travel").
- "whenToGo": Object with "bestTime" (string) and "avoid" (string) — specific times, days, or \
seasons based on review patterns.
- "headsUp": Array of 2–4 strings. Specific warnings or common complaints visitors should know.
- "insiderTips": Array of 2–3 strings. Specific tips that regular customers know.
- "suggestedQuestions": Array of exactly 4 strings. Contextually relevant questions a first-time \
visitor might ask about this specific place.

Return ONLY valid JSON. No markdown, no code fences, no extra text."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    text = message.content[0].text.strip()
    text = re.sub(r"```(?:json)?\n?", "", text).strip().rstrip("`").strip()

    return jsonify(json.loads(text))


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    name = data.get("name")
    address = data.get("address")
    question = data.get("question")

    if not question:
        return jsonify({"error": "Missing question"}), 400

    prompt = f"""You are answering a question about "{name}" located at "{address}".

Question: {question}

Answer in 2–3 sentences. Be specific, direct, and helpful. Draw on your knowledge of this place."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )

    return jsonify({"answer": message.content[0].text.strip()})


if __name__ == "__main__":
    app.run(port=3001, debug=True)
