const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Outscraper = require('outscraper');

const PORT = 3001;
require('dotenv').config();
const API_KEY = process.env.OUTSCRAPER_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
    console.error("Error: API_KEY not set in .env")
    process.exit(1)
}

const client = new Outscraper(API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/reviews', async (req, res) => {
    const placeId = req.query.place_id;
    if (!placeId) return res.status(400).send("Missing place_id");

    try {
        const response = await client.googleMapsSearch([`place_id:${placeId}`], {
            reviewsLimit: 10,
            language: 'en',
        });

        if (response && response[0]) {
            res.json({
                place_details: {
                    name: response[0].name,
                    address: response[0].full_address,
                    rating: response[0].rating,
                },
                reviews_data: response[0].reviews_data
            });
        } else {
            return res.status(400).send('No Data found');
        }
    } catch (error) {
        console.error('Outscraper error:', error);
        res.status(500).send('Outscraper API request failed.');
    }
});

app.post('/analyze', async (req, res) => {
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env' });

    const { placeName, reviews, sentiment, reviewTexts } = req.body;
    const prompt = `You are a review intelligence analyst. Analyze these user reviews for "${placeName}".

Return ONLY a valid JSON object with:
- "summary": 2 sentences. Analytical, specific, data-driven. Don't start with "Overall" or "In summary".
- "positiveHighlights": Array of exactly 3 strings (1 sentence each), specific positive themes with evidence.
- "negativeHighlights": Array of exactly 2 strings (1 sentence each), specific negative themes with evidence.
- "trend": One word only — "improving", "declining", or "stable".

Reviews (${reviews.length} total, ${sentiment.posPct}% positive):
${reviewTexts}

Return ONLY valid JSON. No markdown, no extra text.`;

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        const result = JSON.parse(
            response.data.content[0].text.trim().replace(/```json|```/g, '').trim()
        );
        res.json(result);
    } catch (error) {
        console.error('Claude API error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data?.error?.message || error.message });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});