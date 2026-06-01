/**
 * Brett's Mortgage Lead Dashboard — Local Server
 * 
 * First time setup:
 *   npm install
 * 
 * To start:
 *   Double-click START.bat
 *   OR run: node server.js
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const APIFY_TOKEN = "apify_api_xNiOFoGx0eUf8EtecJgNZM8redGopC26VNqm";

// ─── HTTP HELPER ─────────────────────────────────────────────────────────────

function apiRequest(reqUrl, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(reqUrl);
    const reqOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };
    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── GOOGLE MAPS SCRAPER ─────────────────────────────────────────────────────

async function scrapeGoogleMaps(cities, searchType, maxPerCity, onProgress) {
  const ACTOR_ID = "compass~crawler-google-places";
  const allData = [];

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const query = `${searchType} in ${city}`;
    onProgress({ type: "city", text: `[${i+1}/${cities.length}] ${city}...` });

    try {
      // Start run
      const startRes = await apiRequest(
        `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
        { method: "POST", headers: { "Content-Type": "application/json" } },
        { searchStringsArray: [query], maxCrawledPlacesPerSearch: maxPerCity, language: "en", countryCode: "us", includeWebResults: false }
      );
      if (startRes.status !== 201) throw new Error(`HTTP ${startRes.status}`);
      const runId = startRes.body.data.id;
      const datasetId = startRes.body.data.defaultDatasetId;

      // Poll
      let attempts = 0;
      while (attempts < 40) {
        await sleep(8000);
        const statusRes = await apiRequest(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
        const s = statusRes.body.data?.status;
        if (s === "SUCCEEDED") break;
        if (s === "FAILED" || s === "ABORTED") throw new Error(`Run ${s}`);
        attempts++;
        onProgress({ type: "poll", text: `  Waiting for ${city}... (${attempts * 8}s)` });
      }

      // Get results
      const dataRes = await apiRequest(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=${maxPerCity}`);
      const items = Array.isArray(dataRes.body) ? dataRes.body : [];
      const processed = processGoogleItems(items, city);
      allData.push(...processed);
      onProgress({ type: "success", text: `  ✅ ${items.length} companies found in ${city}` });

    } catch (err) {
      onProgress({ type: "error", text: `  ❌ ${city}: ${err.message}` });
    }
  }
  return allData;
}

function processGoogleItems(items, city) {
  return items.map(item => {
    const contactName = item.ownerName || item.owner?.name || item.claimedBy || "";
    const company = {
      city,
      name: item.title || item.name || "",
      contactName,
      contactSource: contactName ? "Google Maps" : "",
      address: item.address || "",
      phone: item.phone || item.phoneUnformatted || "",
      website: item.website || "",
      rating: parseFloat(item.totalScore || item.rating) || 0,
      reviewCount: parseInt(item.reviewsCount || item.reviewCount) || 0,
      category: (item.categories || []).join(", ") || "",
      mapsUrl: item.url || item.googleMapsUrl || "",
    };
    company.intentLevel = scoreGoogle(company);
    company.outreachMsg = outreachGoogle(company);
    company.linkedInTip = contactName
      ? `Search LinkedIn for: '${contactName}' at '${company.name}' — verify Owner, Broker, or Branch Manager`
      : `Search LinkedIn for: '${company.name}' — look for Owner, Founder, Broker, Branch Manager, or Loan Officer`;
    return company;
  });
}

function scoreGoogle(c) {
  let s = 0;
  if (c.rating >= 4.5) s += 3; else if (c.rating >= 4.0) s += 2; else if (c.rating >= 3.5) s += 1;
  if (c.reviewCount >= 100) s += 3; else if (c.reviewCount >= 50) s += 2; else if (c.reviewCount >= 20) s += 1;
  if (c.website) s += 2;
  if (c.phone) s += 1;
  if (s >= 6) return "🔥 Hot"; if (s >= 3) return "🟢 Warm"; return "🟡 Worth Noting";
}

function outreachGoogle(c) {
  const firstName = c.contactName ? c.contactName.split(" ")[0] : null;
  const hi = firstName ? `Hi ${firstName}` : "Hi there";
  const reviews = c.reviewCount ? ` with ${c.reviewCount} reviews` : "";

  if (c.rating >= 4.5 || c.reviewCount >= 50)
    return `${hi} — I noticed ${c.name} is one of the top-rated mortgage companies in ${c.city}${reviews}. A strong reputation like yours deserves a website that converts visitors at the same level.\n\nMobile Wise AI built a free Web Audit Report for your site that shows exactly where you\'re losing leads — bounce rate, form abandonment, and 12 other conversion issues.\n\nClick the image below to see your report and hear Tess, our conversational sales AI, and how she can boost your pre-qualified leads 3-5x.\n\nBest Regards,\nBrett Duncan — Your AI Conversion Specialist`;
  if (c.rating >= 4.0 || c.reviewCount >= 20)
    return `${hi} — I came across ${c.name} while researching top mortgage companies in ${c.city}. Most local lenders are losing leads every day to slow follow-up and poor website conversion — and never even know it.\n\nMobile Wise AI built a free Web Audit Report for your site that shows exactly where you\'re losing leads — bounce rate, form abandonment, and 12 other conversion issues.\n\nClick the image below to see your report and hear Tess, our conversational sales AI, and how she can boost your pre-qualified leads 3-5x.\n\nBest Regards,\nBrett Duncan — Your AI Conversion Specialist`;
  return `${hi} — I saw ${c.name} while researching mortgage companies in ${c.city} and wanted to reach out.\n\nMobile Wise AI built a free Web Audit Report for your site that shows exactly where you\'re losing leads — bounce rate, form abandonment, and 12 other conversion issues.\n\nClick the image below to see your report and hear Tess, our conversational sales AI, and how she can boost your pre-qualified leads 3-5x.\n\nBest Regards,\nBrett Duncan — Your AI Conversion Specialist`;
}

// ─── FACEBOOK AD SCRAPER ──────────────────────────────────────────────────────

const ENTERPRISE_BLACKLIST = ["rocket mortgage","quicken loans","loandepot","united wholesale mortgage","chase","wells fargo","bank of america","citibank","us bank","pnc","sofi","better.com","guaranteed rate","lendingtree","bankrate","nerdwallet","credible","credit karma","experian","equifax"];

async function scrapeFacebook(cities, searchType, onProgress) {
  const ACTOR_ID = "curious_coder~facebook-ads-library-scraper";

  // Build keywords combining searchType + city
  const urls = cities.map(city => ({
    url: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(searchType + " " + city)}&search_type=keyword_unordered&media_type=all`
  }));

  onProgress({ type: "city", text: `Starting Facebook Ad Library scrape for ${cities.length} cities...` });

  try {
    const startRes = await apiRequest(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
      { method: "POST", headers: { "Content-Type": "application/json" } },
      {
        count: 200,
        "scrapePageAds-dot-activeStatus": "active",
        "scrapePageAds-dot-countryCode": "US",
        "scrapePageAds-dot-sortBy": "impressions_desc",
        proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
        urls
      }
    );

    if (startRes.status !== 201) throw new Error(`HTTP ${startRes.status}`);
    const runId = startRes.body.data.id;
    const datasetId = startRes.body.data.defaultDatasetId;
    onProgress({ type: "city", text: `Run started — this takes 5–10 minutes...` });

    // Poll
    let attempts = 0;
    while (attempts < 80) {
      await sleep(15000);
      const statusRes = await apiRequest(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
      const s = statusRes.body.data?.status;
      if (s === "SUCCEEDED") break;
      if (s === "FAILED" || s === "ABORTED") throw new Error(`Run ${s}`);
      attempts++;
      onProgress({ type: "poll", text: `  Waiting... (${Math.round(attempts * 15 / 60)} min)` });
    }

    // Get results
    let allItems = [], offset = 0;
    while (true) {
      const dataRes = await apiRequest(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=1000&offset=${offset}`);
      const items = Array.isArray(dataRes.body) ? dataRes.body : [];
      if (!items.length) break;
      allItems = allItems.concat(items);
      if (items.length < 1000) break;
      offset += 1000;
    }

    onProgress({ type: "success", text: `  ✅ ${allItems.length} raw ads retrieved` });
    return processFacebookItems(allItems, cities);

  } catch (err) {
    onProgress({ type: "error", text: `❌ Facebook scrape failed: ${err.message}` });
    return [];
  }
}

function processFacebookItems(items, cities) {
  // Deduplicate by page name
  const companyMap = {};
  for (const item of items) {
    const name = (item.page_name || "").trim();
    if (!name) continue;
    if (ENTERPRISE_BLACKLIST.some(b => name.toLowerCase().includes(b))) continue;
    const kw = (() => { try { return decodeURIComponent(new URL(item.url || "").searchParams.get("q") || ""); } catch { return ""; } })();
    const platform = (item.publisher_platform || []).join(", ");
    if (!companyMap[name]) {
      companyMap[name] = {
        name, facebookPage: item.snapshot?.page_profile_uri || "",
        adSnippet: (item.snapshot?.body?.text || "").slice(0, 120),
        cta: item.snapshot?.cta_text || "",
        domain: (() => { try { return new URL(item.snapshot?.link_url || "").hostname.replace("www.", ""); } catch { return ""; } })(),
        followers: item.snapshot?.page_like_count || 0,
        keywordsMatched: kw ? [kw] : [],
        adStartDate: item.start_date_formatted || "",
        allPlatforms: new Set(platform.split(", ").filter(Boolean)),
      };
    } else {
      const c = companyMap[name];
      if (kw && !c.keywordsMatched.includes(kw)) c.keywordsMatched.push(kw);
      platform.split(", ").filter(Boolean).forEach(p => c.allPlatforms.add(p));
    }
  }

  return Object.values(companyMap).map(c => {
    c.platforms = Array.from(c.allPlatforms).join(", ");
    c.keywordsMatched = c.keywordsMatched.join(", ");
    c.intentLevel = scoreFacebook(c);
    c.outreachMsg = outreachFacebook(c);
    c.linkedInTip = `Search LinkedIn for: '${c.name}' — look for Owner, Founder, Broker, Branch Manager, or VP Sales`;
    return c;
  });
}

function scoreFacebook(c) {
  let s = 0;
  const platforms = (c.platforms || "").split(",").filter(Boolean).length;
  const keywords = (c.keywordsMatched || "").split(",").filter(Boolean).length;
  const followers = parseInt(c.followers) || 0;
  if (platforms >= 4) s += 2; else if (platforms >= 2) s += 1;
  if (keywords >= 3) s += 2; else if (keywords >= 2) s += 1;
  if (followers >= 5000) s += 2; else if (followers >= 1000) s += 1;
  if (keywords >= 2) s = Math.min(s + 2, 12);
  if (s >= 8) return "🔥 Hot"; if (s >= 4) return "🟢 Warm"; return "🟡 Worth Noting";
}

function outreachFacebook(c) {
  const kw = (c.keywordsMatched || "").split(",")[0] || "mortgage";
  if (c.intentLevel === "🔥 Hot")
    return `Hi ${c.name} — saw you're running active ads across ${c.platforms} for ${kw}. You're clearly investing in paid social to drive mortgage leads. The challenge most companies hit is converting that paid traffic once it lands — slow forms, no follow-up, leads going cold. We built a conversational AI that converts 3–5x more paid visitors into applications without touching your ad spend. Worth a 15-minute demo?`;
  if (c.intentLevel === "🟢 Warm")
    return `Hi ${c.name} — noticed you're running Facebook ads for ${kw}. Most mortgage companies running paid social lose 60–70% of those clicks to slow forms and no follow-up. We built an AI that fixes that — turns more of your existing paid traffic into booked appointments. Happy to show you a quick demo.`;
  return `Hi ${c.name} — saw you're advertising on Facebook in the mortgage space. If you're scaling paid social, now's the perfect time to make sure your conversion layer is ready for the traffic. We help mortgage companies turn more paid clicks into applications using conversational AI. Happy to show you a quick 5-minute demo.`;
}

// ─── XLSX BUILDER ─────────────────────────────────────────────────────────────

function buildGoogleXLSX(data, cities, searchType) {
  const XLSX = require("xlsx");
  const wb = XLSX.utils.book_new();
  const order = { "🔥 Hot": 0, "🟢 Warm": 1, "🟡 Worth Noting": 2 };
  data.sort((a, b) => {
    const ci = cities.indexOf(a.city) - cities.indexOf(b.city);
    if (ci !== 0) return ci;
    if (order[a.intentLevel] !== order[b.intentLevel]) return order[a.intentLevel] - order[b.intentLevel];
    return b.rating - a.rating;
  });

  // Summary
  const summaryRows = [["City","Total","🔥 Hot","🟢 Warm","🟡 Worth Noting"]];
  for (const city of cities) {
    const cd = data.filter(r => r.city === city);
    summaryRows.push([city, cd.length, cd.filter(r=>r.intentLevel==="🔥 Hot").length, cd.filter(r=>r.intentLevel==="🟢 Warm").length, cd.filter(r=>r.intentLevel==="🟡 Worth Noting").length]);
  }
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary["!cols"] = [{wch:28},{wch:8},{wch:10},{wch:10},{wch:16}];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // All Leads
  const headers = ["ContactName","CompanyName","Phone","Email","Website","Reviews","Address","GoogleMapsURL","City","OutreachMsg"];
  const rows = data.map(r => [r.contactName,r.name,r.phone,"",r.website,r.reviewCount,r.address,r.mapsUrl,r.city,r.outreachMsg]);
  const wsAll = XLSX.utils.aoa_to_sheet([headers,...rows]);
  wsAll["!cols"] = [{wch:14},{wch:22},{wch:30},{wch:22},{wch:14},{wch:16},{wch:30},{wch:8},{wch:8},{wch:22},{wch:35},{wch:35},{wch:65},{wch:65}];
  XLSX.utils.book_append_sheet(wb, wsAll, "All Leads");

  // Per-city
  for (const city of cities) {
    const cd = data.filter(r => r.city === city);
    if (!cd.length) continue;
    const cityRows = cd.map(r => [r.intentLevel,r.name,r.contactName,r.contactSource,r.phone,r.website,r.rating,r.reviewCount,r.address,r.mapsUrl,r.outreachMsg,r.linkedInTip]);
    const ws = XLSX.utils.aoa_to_sheet([["IntentLevel","CompanyName","ContactName","ContactSource","Phone","Website","Rating","Reviews","Address","GoogleMapsURL","OutreachMsg","LinkedInSearchTip"],...cityRows]);
    ws["!cols"] = [{wch:14},{wch:30},{wch:22},{wch:14},{wch:16},{wch:30},{wch:8},{wch:8},{wch:35},{wch:35},{wch:60},{wch:60}];
    XLSX.utils.book_append_sheet(wb, ws, city.slice(0,31).replace(/[:\\/?\*\[\]]/g,""));
  }

  const filename = `google_maps_leads_${new Date().toISOString().slice(0,10)}.xlsx`;
  const filepath = path.join(__dirname, filename);
  XLSX.writeFile(wb, filepath);
  return filename;
}

function buildFacebookXLSX(data) {
  const XLSX = require("xlsx");
  const wb = XLSX.utils.book_new();
  const order = { "🔥 Hot": 0, "🟢 Warm": 1, "🟡 Worth Noting": 2 };
  data.sort((a, b) => {
    if (order[a.intentLevel] !== order[b.intentLevel]) return order[a.intentLevel] - order[b.intentLevel];
    return ((b.keywordsMatched||"").split(",").length) - ((a.keywordsMatched||"").split(",").length);
  });

  const headers = ["IntentLevel","CompanyName","FacebookPage","AdSnippet","CTA","Domain","Followers","Platforms","KeywordsMatched","AdStartDate","OutreachMsg","LinkedInSearchTip"];
  const rows = data.map(r => [r.intentLevel,r.name,r.facebookPage,r.adSnippet,r.cta,r.domain,r.followers,r.platforms,r.keywordsMatched,r.adStartDate,r.outreachMsg,r.linkedInTip]);
  const ws = XLSX.utils.aoa_to_sheet([headers,...rows]);
  ws["!cols"] = [{wch:14},{wch:30},{wch:35},{wch:40},{wch:14},{wch:25},{wch:10},{wch:28},{wch:35},{wch:14},{wch:60},{wch:60}];
  XLSX.utils.book_append_sheet(wb, ws, "FB Ad Leads");

  const filename = `facebook_ad_leads_${new Date().toISOString().slice(0,10)}.xlsx`;
  const filepath = path.join(__dirname, filename);
  XLSX.writeFile(wb, filepath);
  return filename;
}

// ─── SERVER ───────────────────────────────────────────────────────────────────

// Store SSE clients and job state
const sseClients = new Map();
let jobId = 0;

function sendSSE(id, data) {
  const client = sseClients.get(id);
  if (client) client.write(`data: ${JSON.stringify(data)}\n\n`);
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // Serve main UI
  if (parsed.pathname === "/" || parsed.pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(path.join(__dirname, "index.html")));
    return;
  }

  // SSE stream for progress
  if (parsed.pathname === "/events") {
    const id = parseInt(parsed.query.jobId);
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    sseClients.set(id, res);
    req.on("close", () => sseClients.delete(id));
    return;
  }

  // Download file
  if (parsed.pathname === "/download") {
    const file = parsed.query.file;
    const filepath = path.join(__dirname, path.basename(file));
    if (fs.existsSync(filepath)) {
      res.writeHead(200, {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${path.basename(filepath)}"`,
      });
      fs.createReadStream(filepath).pipe(res);
    } else {
      res.writeHead(404); res.end("Not found");
    }
    return;
  }

  // Start Google Maps scrape
  if (parsed.pathname === "/scrape/google" && req.method === "POST") {
    let body = "";
    req.on("data", d => body += d);
    req.on("end", async () => {
      const { cities, searchType, maxPerCity } = JSON.parse(body);
      const id = ++jobId;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ jobId: id }));

      // Run async
      setTimeout(async () => {
        try {
          const data = await scrapeGoogleMaps(cities, searchType, maxPerCity, (msg) => sendSSE(id, msg));
          if (data.length) {
            const filename = buildGoogleXLSX(data, cities, searchType);
            sendSSE(id, { type: "done", filename, total: data.length, hot: data.filter(r=>r.intentLevel==="🔥 Hot").length, warm: data.filter(r=>r.intentLevel==="🟢 Warm").length, noting: data.filter(r=>r.intentLevel==="🟡 Worth Noting").length });
          } else {
            sendSSE(id, { type: "error", text: "No results retrieved." });
          }
        } catch (err) {
          sendSSE(id, { type: "error", text: err.message });
        }
      }, 100);
    });
    return;
  }

  // Start Facebook scrape
  if (parsed.pathname === "/scrape/facebook" && req.method === "POST") {
    let body = "";
    req.on("data", d => body += d);
    req.on("end", async () => {
      const { cities, searchType } = JSON.parse(body);
      const id = ++jobId;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ jobId: id }));

      setTimeout(async () => {
        try {
          const data = await scrapeFacebook(cities, searchType, (msg) => sendSSE(id, msg));
          if (data.length) {
            const filename = buildFacebookXLSX(data);
            sendSSE(id, { type: "done", filename, total: data.length, hot: data.filter(r=>r.intentLevel==="🔥 Hot").length, warm: data.filter(r=>r.intentLevel==="🟢 Warm").length, noting: data.filter(r=>r.intentLevel==="🟡 Worth Noting").length });
          } else {
            sendSSE(id, { type: "error", text: "No results retrieved." });
          }
        } catch (err) {
          sendSSE(id, { type: "error", text: err.message });
        }
      }, 100);
    });
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Brett's Mortgage Lead Dashboard");
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Opening in browser...");

  // Auto-open browser
  const { exec } = require("child_process");
  exec(`start http://localhost:${PORT}`);
});
