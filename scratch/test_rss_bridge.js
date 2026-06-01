import fetch from 'node-fetch';
import fs from 'fs';

async function testRssBridge() {
  const username = "formandseek.shop";
  console.log("Fetching from RSS-Bridge official instance...");
  
  // We can try different format parameters (Json, Mrss, Atom)
  const url = `https://rss-bridge.org/bridge01/?action=display&bridge=Instagram&u=${username}&format=Json`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("Status:", res.status);
    if (res.ok) {
      const data = await res.json();
      fs.writeFileSync("rss_bridge.json", JSON.stringify(data, null, 2));
      console.log("Success! Saved json. Items count:", data.items ? data.items.length : 0);
      if (data.items && data.items.length > 0) {
        console.log("First item sample:", JSON.stringify(data.items[0], null, 2));
      }
    } else {
      const text = await res.text();
      console.log("Failed. Response text:", text.substring(0, 500));
    }
  } catch (e) {
    console.error("RSS-Bridge test failed:", e.message);
  }
}

testRssBridge();
