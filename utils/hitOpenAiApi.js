import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const hitOpenAiApi = async (prompt) => {

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: false,
    temperature: 0.5,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })
  
  return response.choices[0]?.message?.content
}

export {hitOpenAiApi}