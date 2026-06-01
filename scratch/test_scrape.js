import fetch from 'node-fetch';
import fs from 'fs';

async function test() {
  const username = "formandseek.shop";
  console.log("Fetching Picuki...");
  try {
    const res = await fetch(`https://www.picuki.com/profile/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    console.log("Picuki status:", res.status);
    const text = await res.text();
    fs.writeFileSync("picuki.html", text);
    console.log("Picuki html saved. Length:", text.length);
  } catch (e) {
    console.error("Picuki failed:", e.message);
  }

  console.log("Fetching Imginn...");
  try {
    const res2 = await fetch(`https://imginn.com/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
      }
    });
    console.log("Imginn status:", res2.status);
    const text2 = await res2.text();
    fs.writeFileSync("imginn.html", text2);
    console.log("Imginn html saved. Length:", text2.length);
  } catch (e) {
    console.error("Imginn failed:", e.message);
  }
}

test();
