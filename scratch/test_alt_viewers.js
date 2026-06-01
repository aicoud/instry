import fetch from 'node-fetch';
import fs from 'fs';

async function testUrl(url) {
  try {
    console.log("Fetching", url);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("Status:", res.status);
    if (res.ok) {
      const text = await res.text();
      console.log("Length:", text.length);
      return text;
    }
  } catch (e) {
    console.error("Failed:", e.message);
  }
  return null;
}

async function start() {
  const username = "formandseek.shop";
  await testUrl(`https://greatfon.com/v/${username}`);
  await testUrl(`https://anonyig.com/profile/${username}`);
}

start();
