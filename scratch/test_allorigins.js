import fetch from 'node-fetch';
import fs from 'fs';

async function test() {
  const username = "formandseek.shop";
  console.log("Fetching Imginn via allorigins...");
  try {
    const targetUrl = encodeURIComponent(`https://imginn.com/${username}/`);
    const res = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
    console.log("Status:", res.status);
    const json = await res.json();
    const html = json.contents;
    fs.writeFileSync("imginn_allorigins.html", html);
    console.log("Imginn via allorigins html saved. Length:", html.length);
    
    // Let's check if we see any class names or images
    const hasItem = html.includes("class=\"item\"");
    const hasAvatar = html.includes("avatar");
    console.log("Has class item:", hasItem);
    console.log("Has avatar:", hasAvatar);
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

test();
