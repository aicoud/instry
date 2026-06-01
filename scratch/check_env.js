console.log("GEMINI_API_KEY present in system env:", !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
  console.log("Key length:", process.env.GEMINI_API_KEY.length);
}
