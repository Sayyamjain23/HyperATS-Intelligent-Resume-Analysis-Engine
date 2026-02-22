import { GoogleGenerativeAI } from "@google/generative-ai";
import pkg from "@google/generative-ai/package.json" assert { type: "json" };

console.log("Gemini SDK Version:", pkg.version);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const result = await genAI.listModels();
    console.log("AVAILABLE MODELS:\n");
    console.log(result);
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
