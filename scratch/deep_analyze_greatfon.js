import fs from 'fs';

const html = fs.readFileSync('greatfon.html', 'utf8');

// Let's find any mentions of jpg, png, webp or cdninstagram
const jpgs = html.match(/[^\s"']+\.(?:jpg|png|webp|jpeg)[^\s"']*/gi) || [];
console.log("JPG/PNG/WEBP URLs found in greatfon.html:", jpgs.length);
jpgs.slice(0, 20).forEach(j => console.log(j));

const cdns = html.match(/[^\s"']*(?:cdninstagram|fbcdn)[^\s"']*/gi) || [];
console.log("CDN links found:", cdns.length);
cdns.slice(0, 20).forEach(c => console.log(c));
