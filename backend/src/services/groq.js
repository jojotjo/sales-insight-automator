const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateSummary(salesData) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a senior sales analyst at Rabbitt AI preparing executive briefings for C-suite leadership.",
      },
      {
        role: "user",
        content: `
Analyze the sales data below and write a professional executive summary (3-5 paragraphs) including:
- Overall revenue and performance highlights
- Top performing products and regions
- Notable trends, risks, or anomalies
- A brief forward-looking recommendation

Write in a confident, professional tone. No raw data tables — insights only.

--- SALES DATA ---
${salesData}
--- END DATA ---
        `,
      },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

module.exports = { generateSummary };