import fetch from 'node-fetch';
import fs from 'fs';

async function testProxy() {
  const username = "formandseek.shop";
  const target = `https://www.picuki.com/profile/${username}`;
  
  console.log("Fetching Picuki via corsproxy.io...");
  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(target)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("corsproxy.io status:", res.status);
    if (res.ok) {
      const text = await res.text();
      fs.writeFileSync("picuki_corsproxy.html", text);
      console.log("Success! Saved html. Length:", text.length);
    }
  } catch (e) {
    console.error("corsproxy.io failed:", e.message);
  }

  console.log("Fetching Picuki via codetabs...");
  try {
    const res2 = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("codetabs status:", res2.status);
    if (res2.ok) {
      const text2 = await res2.text();
      fs.writeFileSync("picuki_codetabs.html", text2);
      console.log("Success! Saved html. Length:", text2.length);
    }
  } catch (e) {
    console.error("codetabs failed:", e.message);
  }
}

testProxy();
