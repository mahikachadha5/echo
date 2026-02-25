const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, address, place_id, lat, lng } = data;

  if (!name) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing place name' }) };
  }

  const prompt = `You are a review intelligence analyst. Based on your knowledge of "${name}" \
located at "${address}" (place_id: ${place_id}, coordinates: ${lat}, ${lng}), provide a structured \
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
- "bestFor": Array of exactly 4 objects, each with "label" (string, ideal occasion or visitor type, \
e.g. "Special occasion", "Date night", "Families", "Solo travel") and "mentions" (integer, estimated \
review mention count).
- "whenToGo": Object with "bestTime" (string) and "avoid" (string) — specific times, days, or \
seasons based on review patterns.
- "headsUp": Array of 2–4 strings. Specific warnings or common complaints visitors should know.
- "insiderTips": Array of 2–3 strings. Specific tips that regular customers know.
- "suggestedQuestions": Array of exactly 4 strings. Contextually relevant questions a first-time \
visitor might ask about this specific place.
- "reservationUrl": String URL to book a reservation if this is a restaurant or reservable venue — \
prefer a direct Resy listing URL, then OpenTable, then the venue's own reservations page. Return null \
if the place does not take reservations or is not a dining/hospitality venue.

Return ONLY valid JSON. No markdown, no code fences, no extra text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    let text = message.content[0].text.trim();
    text = text.replace(/```(?:json)?\n?/g, '').trim().replace(/`+$/, '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    console.error('Analyze error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
