import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { messages } = req.body;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages,
        max_tokens: 350,
        n: 1,
        stop: null,
        temperature: 0.5,
      });

      res.status(200).json(completion.data);
    } catch (error) {
      res.status(500).json({ error: "Error calling OpenAI API" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
