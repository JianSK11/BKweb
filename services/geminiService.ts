import { GoogleGenAI } from "@google/genai";
import type { Book, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateBookDescription = async (title: string, author: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Cannot generate description.");
  }
  
  try {
    const prompt = `Generate a captivating, one-paragraph blurb for an online bookstore with a magical, whimsical theme. The book is titled "${title}" by the author ${author}. The tone should be enticing and make someone want to buy it. Do not use markdown or special formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating book description:", error);
    throw new Error("Failed to generate AI description. Please try again or write one manually.");
  }
};

export const generateFoxResponse = async (history: ChatMessage[], books: Book[]) => {
    if (!API_KEY) {
        throw new Error("API key is not configured. The fox assistant is unavailable.");
    }

    const systemInstruction = `You are Foxxy, a cute, clever, and slightly mischievous fox spirit. You are the guardian of this enchanted library in a magical forest. Your job is to help visitors by answering their questions about the author's books. The author of all books here is Sakila Kumari. You speak in a friendly, whimsical, and encouraging tone. Use forest and magic-themed metaphors sometimes (e.g., 'Let's rustle through the pages,' 'That's a sparkling question!'). You have access to the library's catalog. When asked for recommendations or details, use the information provided. If you mention a book, always give its title and price. Provide the PayPal link when a user seems interested in buying. Here is the current catalog of books: ${JSON.stringify(books.map(b => ({title: b.title, author: b.author, description: b.description, price: b.price, payPalLink: b.payPalLink})), null, 2)}`;

    try {
        const contents = [...history];
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction,
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting response from fox assistant:", error);
        throw new Error("Foxxy seems to be napping! Please try again in a moment.");
    }
}