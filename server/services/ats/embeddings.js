import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Generate embeddings using Gemini (text-embedding-004)
 * NOTE: This model uses v1beta internally (expected)
 */
export async function embedText(text) {
    if (!genAI || !text) return null;

    try {
        const model = genAI.getGenerativeModel({
            model: "text-embedding-004"
        });

        const result = await model.embedContent({
            content: {
                parts: [{ text: text.slice(0, 1000) }]
            }
        });

        return result?.embedding?.values ?? null;

    } catch (err) {
        console.warn("Embedding skipped (beta model)");
        return null;
    }
}

/**
 * Cosine similarity (safe + stable)
 */
export function cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;

    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] ** 2;
        nb += b[i] ** 2;
    }

    return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}
