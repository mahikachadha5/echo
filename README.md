# Echo

AI-powered review intelligence for any place. Search any restaurant, hotel, or venue and get instant insights.

🔗 **[echoreviews.netlify.app](https://echoreviews.netlify.app)**

---

## What it does

Echo transforms public reviews into structured insights.

- **Sentiment score** with trend analysis (improving, stable, or declining)
- **Topic breakdown** — what people talk about most, ranked by mention sentiment
- **Best for** — occasion tags
- **When to go** — best and worst times based on review patterns
- **Heads up** — recurring complaints worth knowing before you visit
- **Pro tips** — hidden gems most people miss
- **Ask about this place** — follow-up questions answered by Claude

---

## Tech stack

- **Frontend** — React, CSS
- **Backend** — Node.js, Netlify Functions
- **APIs** — Anthropic Claude API, Google Places API, Google Maps JavaScript API
- **Deployment** — Netlify

---

## Running locally

### Prerequisites
- Node.js
- A Google Maps API key with Places API enabled
- An Anthropic API key

### Setup

```bash
# Clone the repo
git clone https://github.com/mahikachadha5/echo.git
cd echo

# Install frontend dependencies
npm install --prefix client

# Install root dependencies
npm install
```

Create a `client/.env` file:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
```

Create a `server/.env` file:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
# Start the frontend
npm start --prefix client
```

For Netlify Functions locally, install the Netlify CLI and run:
```bash
netlify dev
```
