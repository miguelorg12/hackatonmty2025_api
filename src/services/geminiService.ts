import model from "../config/geminiAI";
import { ResponseMode, MODE_PROMPTS } from "../types/gemini";

export async function generateResponse(
  prompt: string,
  mode: ResponseMode = ResponseMode.NORMAL,
  maxLength?: number
) {
  const instruction = MODE_PROMPTS[mode];
  const lengthLimit = maxLength ? `Max ${maxLength} characters.\n\n` : '';
  const fullPrompt = `${instruction}\n${lengthLimit}${prompt}`;

  const result = await model.generateContent(fullPrompt);
  const text = (await result.response).text();

  return maxLength && text.length > maxLength 
    ? text.substring(0, maxLength - 3) + '...' 
    : text;
}