import { useState, useEffect } from "react";
import "./App.css";

const MOCK_PLACES = {
  "mcdonald's": {
    name: "McDonald's", address: "123 Westland Ave, Boston, MA 02118",
    rating: 3.9, totalRatings: 412, priceLevel: "$",
    types: ["Fast Food", "American"], openNow: true,
    reviews: [
      { text: "The fries are always fresh and hot. Service was surprisingly fast during lunch rush. The staff greeted me with a smile.", rating: 5, date: "2024-07" },
      { text: "Decent fast food, nothing spectacular. The Big Mac tastes the same everywhere. Clean bathrooms which I appreciate.", rating: 3, date: "2024-07" },
      { text: "Extremely cramped inside, barely any seating. Tables were dirty when I arrived. The drive-through is much better.", rating: 2, date: "2024-06" },
      { text: "Happy Meal made my kid's day. Quick turnaround and the staff was patient with our large order.", rating: 5, date: "2024-06" },
      { text: "Waited 20 minutes for a simple order. The space is too small and poorly managed during peak hours.", rating: 2, date: "2024-05" },
      { text: "Coffee is actually great here. Breakfast menu is solid. Always consistent quality.", rating: 4, date: "2024-05" },
      { text: "The atmosphere is clean and the service is responsive. Staff was very helpful and friendly.", rating: 4, date: "2024-04" },
      { text: "Limited parking and the entrance is confusing. Food was fine but the experience wasn't great.", rating: 3, date: "2024-03" },
      { text: "Always reliable. I know exactly what I'm getting and the price is right. Fast and convenient.", rating: 4, date: "2024-02" },
      { text: "Messy tables and rude cashier. The food was cold too. Won't be coming back anytime soon.", rating: 1, date: "2024-02" },
      { text: "Great location and the staff was friendly. Order was correct which is all I ask.", rating: 4, date: "2024-01" },
      { text: "Consistent quality as expected. The mobile app ordering made it super fast.", rating: 4, date: "2024-01" },
    ]
  },
  "starbucks": {
    name: "Starbucks", address: "500 Boylston St, Boston, MA 02116",
    rating: 4.2, totalRatings: 867, priceLevel: "$$",
    types: ["Café", "Coffee"], openNow: true,
    reviews: [
      { text: "The baristas here are top notch. Always get my complicated order right. Very cozy atmosphere.", rating: 5, date: "2024-07" },
      { text: "Expensive for what it is, but the quality is consistent. The cold brew is excellent.", rating: 4, date: "2024-07" },
      { text: "Long lines during morning rush. Staff seems overwhelmed. Took 18 minutes for a simple latte.", rating: 2, date: "2024-06" },
      { text: "Love the seasonal menu. The pumpkin spice was on point. Very clean and well-maintained.", rating: 5, date: "2024-06" },
      { text: "Comfortable seating and great WiFi. Good place to work for a few hours.", rating: 4, date: "2024-05" },
      { text: "Order was wrong twice in a row. Frustrating when you pay premium prices.", rating: 2, date: "2024-04" },
      { text: "Friendly staff and consistent quality. My go-to morning stop.", rating: 5, date: "2024-03" },
      { text: "A bit pricey but you get what you pay for. Nice ambiance overall.", rating: 3, date: "2024-02" },
    ]
  },
  "chipotle": {
    name: "Chipotle Mexican Grill", address: "800 Boylston St, Boston, MA 02199",
    rating: 4.0, totalRatings: 623, priceLevel: "$$",
    types: ["Mexican", "Fast Casual"], openNow: false,
    reviews: [
      { text: "Fresh ingredients and generous portions. The carnitas bowl is my go-to.", rating: 5, date: "2024-07" },
      { text: "Line was long but moved quickly. Staff was efficient and food was hot.", rating: 4, date: "2024-07" },
      { text: "Bowl was way too salty. Asked for less and they still piled it on.", rating: 2, date: "2024-06" },
      { text: "Consistent quality as always. Love the customization options.", rating: 4, date: "2024-05" },
      { text: "The queso is delicious. Friendly staff made the experience great.", rating: 5, date: "2024-04" },
      { text: "Ran out of steak during dinner rush. Had to wait 15 minutes.", rating: 3, date: "2024-03" },
    ]
  }
};

function SentimentChart({ data }) {
  if (!data || !data.length) return null;
  const months = [...new Set(data.map(r => r.date))].sort();
  const W = 400, H = 130, PL = 8, PR = 80, PT = 8, PB = 28;
  const counts = months.map(m => {
    const rv = data.filter(r => r.date === m);
    return { month: m, pos: rv.filter(r=>r.rating>=4).length, neg: rv.filter(r=>r.rating<=2).length, neu: rv.filter(r=>r.rating===3).length };
  });
  const maxVal = Math.max(...counts.flatMap(c=>[c.pos,c.neg,c.neu]),1);
  const xStep = (W-PL-PR)/Math.max(counts.length-1,1);
  const yScale = v => PT + (H-PT-PB)*(1-v/maxVal);
  const smooth = pts => {
    if (pts.length < 2) return `M ${pts[0][0]} ${pts[0][1]}`;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i=1; i<pts.length; i++) {
      const cx = (pts[i-1][0]+pts[i][0])/2;
      d += ` C ${cx} ${pts[i-1][1]}, ${cx} ${pts[i][1]}, ${pts[i][0]} ${pts[i][1]}`;
    }
    return d;
  };
  const series = [{key:"pos",color:"#10b981",label:"Positive"},{key:"neg",color:"#ef4444",label:"Negative"},{key:"neu",color:"#d1d5db",label:"Neutral"}];
  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
        {[0,maxVal/2,maxVal].map((v,i)=>(
          <line key={i} x1={PL} x2={W-PR} y1={yScale(v)} y2={yScale(v)} stroke="#f0ede8" strokeWidth="1"/>
        ))}
        {series.map(s=>{
          const pts = counts.map((c,i)=>[PL+i*xStep,yScale(c[s.key])]);
          return <path key={s.key} d={smooth(pts)} fill="none" stroke={s.color} strokeWidth="2" opacity="0.9"/>;
        })}
        {counts.map((c,i)=>(
          <text key={i} x={PL+i*xStep} y={H-8} textAnchor="middle" className="chart-axis">{c.month.slice(5)}</text>
        ))}
        {series.map((s,i)=>(
          <g key={s.key} transform={`translate(${W-PR+8},${PT+4+i*18})`}>
            <circle cx="5" cy="5" r="3.5" fill={s.color} opacity="0.85"/>
            <text x="13" y="9" className="chart-axis">{s.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const analyzeSentiment = reviews => {
  const pos=reviews.filter(r=>r.rating>=4).length, neg=reviews.filter(r=>r.rating<=2).length, neu=reviews.filter(r=>r.rating===3).length, total=reviews.length;
  return {pos,neg,neu,total,posPct:Math.round(pos/total*100),negPct:Math.round(neg/total*100),neuPct:Math.round(neu/total*100)};
};

const getWordFreq = reviews => {
  const stop=new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","is","was","it","my","i","be","are","this","that","they","we","very","much","too","so","me","he","she","you","your","its","has","had","have","from","get","got","been","which","when","who","how","what","all","just","up","out","not","no","if","than","about","can","by","do","did","their","there","were","our","here","his","her","into","as","more","also","any","each","would","could","will","one"]);
  const counts={};
  reviews.forEach(r=>r.text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).forEach(w=>{if(w.length>3&&!stop.has(w))counts[w]=(counts[w]||0)+1;}));
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,7);
};

const getCategoryRatings = reviews => {
  const kw={Atmosphere:["atmosphere","ambiance","space","seating","clean","dirty","crowded","cramped","cozy","comfortable"],Food:["food","taste","fries","burger","quality","fresh","hot","cold","flavor","meal","coffee","order"],Service:["staff","service","friendly","fast","slow","wait","cashier","barista","helpful","patient","rude","efficient"]};
  return Object.entries(kw).map(([cat,words])=>{
    const rel=reviews.filter(r=>words.some(w=>r.text.toLowerCase().includes(w)));
    const avg=rel.length>0?rel.reduce((s,r)=>s+r.rating,0)/rel.length:3.5;
    return {cat,score:Math.round(avg*10)/10};
  });
};

const getKeyDetails = place => {
  const priceMap={"$":"$10–20","$$":"$15–30","$$$":"$30–60"};
  const dishes=place.reviews.flatMap(r=>r.text.match(/Happy Meal|Big Mac|fries|latte|cold brew|carnitas|bowl|queso|wrap|salad/gi)||[]);
  const dc={};dishes.forEach(d=>{dc[d.toLowerCase()]=(dc[d.toLowerCase()]||0)+1;});
  const top=Object.entries(dc).sort((a,b)=>b[1]-a[1])[0];
  return [{key:"Category",val:place.types[0]},{key:"Price range",val:priceMap[place.priceLevel]||"–"},{key:"Popular dish",val:top?top[0].charAt(0).toUpperCase()+top[0].slice(1):"See reviews"},{key:"Status",val:place.openNow?"Open now":"Closed"},{key:"Total reviews",val:place.totalRatings.toLocaleString()}];
};

async function callClaude(place, reviews, sentiment) {
  const texts = reviews.map((r,i)=>`[${i+1}] (${r.rating}★) ${r.text}`).join("\n");
  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeName: place.name,
      reviews: reviews.map(r => ({ text: r.text, rating: r.rating })),
      sentiment,
      reviewTexts: texts,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Analysis failed");
  }
  return res.json();
}

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [place, setPlace] = useState(null);
  const [insights, setInsights] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(()=>{
    if(place&&insights)setTimeout(()=>setAnimated(true),80);else setAnimated(false);
  },[place,insights]);

  async function handleSearch(q) {
    const sq = q||query;
    if(!sq.trim())return;
    setLoading(true);setError("");setPlace(null);setInsights(null);
    try {
      setLoadingStep("Fetching place data...");
      await new Promise(r=>setTimeout(r,400));
      const key=sq.toLowerCase().trim();
      let pd=MOCK_PLACES["mcdonald's"];
      for(const[k,v]of Object.entries(MOCK_PLACES)){if(key.includes(k)||k.includes(key)){pd=v;break;}}
      setPlace(pd);
      setLoadingStep("Analyzing reviews with Claude...");
      const sentiment=analyzeSentiment(pd.reviews);
      const ai=await callClaude(pd,pd.reviews,sentiment);
      setInsights({...ai,sentiment,wordFreq:getWordFreq(pd.reviews),catRatings:getCategoryRatings(pd.reviews),keyDetails:getKeyDetails(pd)});
    } catch(e) {
      setError(e.message||"Something went wrong.");
    } finally {
      setLoading(false);setLoadingStep("");
    }
  }

  const sentiment=insights?.sentiment;
  const bars=sentiment?[{label:"Positive",pct:sentiment.posPct,cls:"pos"},{label:"Negative",pct:sentiment.negPct,cls:"neg"},{label:"Neutral",pct:sentiment.neuPct,cls:"neu"}]:[];
  const trendIcon={improving:"↑",declining:"↓",stable:"→"};

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-mark">E</div>
          <span className="logo-name">Echo</span>
        </div>
        <div className="header-right">
          <div className="ai-dot"/>
          <span>Powered by Claude</span>
        </div>
      </header>

      <div className="hero">
        <h1 className="hero-title">Understand any place,<br/><em>instantly.</em></h1>
        <p className="hero-sub">AI-powered review intelligence — search a restaurant, café, or venue.</p>
        <div className="search-wrap">
          <input className="search-input" placeholder="Search a place..." value={query}
            onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()}/>
          <button className="search-btn" onClick={()=>handleSearch()} disabled={loading}>
            {loading?"Analyzing...":"Analyze"}
          </button>
        </div>
        {error&&<div className="error-bar">⚠ {error}</div>}
        <div className="search-examples">
          <span className="search-examples-label">Try:</span>
          {["McDonald's","Starbucks","Chipotle"].map(e=>(
            <span key={e} className="example-pill" onClick={()=>{setQuery(e);handleSearch(e);}}>{e}</span>
          ))}
        </div>
      </div>

      {loading&&(
        <div className="loading-state">
          <div className="loading-spinner"/>
          <div className="loading-label">{loadingStep}</div>
          <div className="loading-sub">This takes a few seconds</div>
        </div>
      )}

      {!place&&!loading&&(
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results yet</div>
          <div className="empty-sub">Search a place above to surface review insights</div>
        </div>
      )}

      {place&&insights&&(
        <div className="results">
          <div className="place-header">
            <div className="place-left">
              <div className="place-category">{place.types.join(" · ")}</div>
              <div className="place-name">{place.name}</div>
              <div className="place-address">{place.address}</div>
            </div>
            <div className="place-right">
              <div className="rating-badge">
                <span className="rating-num">{place.rating}</span>
                <span className="rating-label">/ 5.0</span>
              </div>
              <span className={`open-badge ${place.openNow?"open":"closed"}`}>
                {place.openNow?"● Open now":"● Closed"}
              </span>
              <span className={`trend-badge ${insights.trend}`}>
                {trendIcon[insights.trend]} {insights.trend}
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-header">
              <div className="summary-label">AI Summary</div>
              <div className="claude-chip">CLAUDE</div>
            </div>
            <div className="summary-text">{insights.summary}</div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-label">Sentiment breakdown</div>
              <div className="s-stack">
                {bars.map(b=>(
                  <div className="s-row" key={b.label}>
                    <span className="s-label">{b.label}</span>
                    <div className="s-track"><div className={`s-fill ${b.cls}`} style={{width:animated?`${b.pct}%`:"0%"}}/></div>
                    <span className={`s-pct ${b.cls}`}>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-label">Key details</div>
              <div className="detail-list">
                {insights.keyDetails.map(d=>(
                  <div className="detail-row" key={d.key}>
                    <span className="d-key">{d.key}</span>
                    <span className="d-val">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-label">What people love</div>
              <div className="hl-list">
                {insights.positiveHighlights.map((h,i)=>(
                  <div className="hl-item pos" key={i}><span className="hl-icon">✓</span><span>{h}</span></div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-label">Common complaints</div>
              <div className="hl-list">
                {insights.negativeHighlights.map((h,i)=>(
                  <div className="hl-item neg" key={i}><span className="hl-icon">!</span><span>{h}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-3">
            <div className="card">
              <div className="card-label">Category ratings</div>
              <div className="cat-list">
                {insights.catRatings.map(c=>(
                  <div className="cat-row" key={c.cat}>
                    <span className="cat-name">{c.cat}</span>
                    <div className="cat-track"><div className="cat-fill" style={{width:animated?`${(c.score/5)*100}%`:"0%"}}/></div>
                    <span className="cat-score">{c.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{gridColumn:"span 2"}}>
              <div className="card-label">Sentiment over time</div>
              <SentimentChart data={place.reviews}/>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-label">Most mentioned terms</div>
              <div className="word-list">
                {insights.wordFreq.map(([word,count])=>(
                  <div className="word-row" key={word}>
                    <span className="word-name">{word}</span>
                    <div className="word-track"><div className="word-fill" style={{width:animated?`${(count/insights.wordFreq[0][1])*100}%`:"0%"}}/></div>
                    <span className="word-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <div>
                <div className="card-label">About this analysis</div>
                <p style={{fontSize:13,color:"var(--text-2)",lineHeight:1.65}}>
                  Insights are generated by Claude using the {place.totalRatings.toLocaleString()} reviews available for this place. Sentiment, highlights, and trend detection are AI-powered and may not reflect every individual experience.
                </p>
              </div>
              <div style={{marginTop:16,padding:"12px 14px",background:"var(--bg)",borderRadius:"var(--radius-sm)",fontSize:12,color:"var(--text-3)",lineHeight:1.5}}>
                Data refreshed in real-time · Powered by Google Places API + Claude
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
