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

export async function generateBusinessScenarios(businessType: string, enterpriseName: string) {
  const prompt = `Generate EXACTLY 5 financial scenarios for a ${businessType} business named "${enterpriseName}". 
Return ONLY a valid JSON array with this exact structure, no additional text:
[
  {
    "name": "scenario name in Spanish",
    "income_multiplier": number between 0.5 and 2.0,
    "expense_multiplier": number between 0.5 and 2.0,
    "payment_delay_days": number between 0 and 90
  }
]

Requirements:
- Exactly 5 realistic scenarios
- Scenarios must be relevant to ${businessType} industry
- Include varied situations (optimistic, pessimistic, crisis, growth, stable)
- Scenario names in Spanish
- Use realistic multiplier values
- Only return valid JSON array, nothing else`;

  const result = await model.generateContent(prompt);
  const text = (await result.response).text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI did not return valid JSON array');
  }

  const scenarios = JSON.parse(jsonMatch[0]);
  
  if (!Array.isArray(scenarios) || scenarios.length !== 5) {
    throw new Error('AI did not return exactly 5 scenarios');
  }

  return scenarios;
}