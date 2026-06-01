import fs from 'fs';

try {
  const filePath = '/Users/Aykut/.gemini/antigravity/brain/af2539f2-59d8-4edb-aef7-ff467501d5ba/form_and_seek_logo_1779713199722.png';
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  console.log("Base64 string ready! Length:", base64.length);
  // Write to a text file so we can read it easily
  fs.writeFileSync('scratch/logo_base64.txt', `data:image/png;base64,${base64}`);
  console.log("Saved to scratch/logo_base64.txt");
} catch (e) {
  console.error(e);
}
