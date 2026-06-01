import fs from 'fs';

const html = fs.readFileSync('greatfon.html', 'utf8');

// Let's print out text around "formandseek.shop"
const idx = html.indexOf('formandseek.shop');
console.log("Snippet around username:");
console.log(html.substring(idx - 100, idx + 1000));

// Let's print out all images containing "http" or "unsplash" or "cdn"
const urls = html.match(/https?:\/\/[^\s"']+/g) || [];
console.log("Found", urls.length, "absolute URLs in file:");
urls.slice(0, 30).forEach(u => console.log(u));
