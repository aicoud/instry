import fetch from 'node-fetch';
import fs from 'fs';

async function start() {
  const username = "formandseek.shop";
  const url = `https://greatfon.com/v/${username}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (res.ok) {
      const html = await res.text();
      fs.writeFileSync("greatfon.html", html);
      console.log("greatfon.html saved. Length:", html.length);
      
      // Let's search for image tags
      const imgMatches = [...html.matchAll(/<img[^>]*src=["']([^"']+)["']/g)];
      console.log("Found", imgMatches.length, "images:");
      imgMatches.slice(0, 15).forEach((m, idx) => {
        console.log(`[${idx}]`, m[1]);
      });
      
      // Let's search for bio
      const bioMatch = html.match(/<div class=["']user_bio["'][^>]*>([\s\S]*?)<\/div>/i) || html.match(/class=["']bio["'][^>]*>([\s\S]*?)<\/div>/i);
      console.log("Bio Match:", bioMatch ? bioMatch[1].trim() : "None");
      
      // Let's search for stats
      const statsMatch = html.match(/<span class=["']user_num["'][^>]*>([\s\S]*?)<\/span>/g);
      console.log("Stats Matches:", statsMatch);
    }
  } catch (e) {
    console.error(e);
  }
}

start();
