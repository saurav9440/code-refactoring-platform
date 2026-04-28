import Groq from 'groq-sdk';

let groqClient;

export const initializeAI = () => {
  if (process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } else {
    console.warn("GROQ_API_KEY is not set. AI features will be disabled or mocked.");
  }
};

export const getCodeAnalysisAndRefactor = async (code, language) => {
  if (!groqClient || process.env.GROQ_API_KEY === 'your_api_key_here') {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return mockAIResponse();
  }

  try {
    const prompt = `You are an expert ${language} developer. Analyze the following code.
Provide a JSON response with the following keys:
- "summary": A high-level 2-sentence summary of what the code does.
- "analogy": A brief real-world analogy.
- "lineByLine": Array of objects like { "line": 1, "explanation": "..." }. Keep explanations concise.
- "qualityScore": Integer from 0-100 indicating code quality.
- "issues": Array of strings detailing bugs or bad practices.
- "refactoredCode": The complete optimized and refactored code.

Code:
${code}`;

    const response = await groqClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Use active model
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

const mockAIResponse = () => {
  return {
    summary: "This is a mocked summary because the API key is missing.",
    analogy: "It's like a placeholder.",
    lineByLine: [{ line: 1, explanation: "Mock line" }],
    qualityScore: 75,
    issues: ["Mock issue 1"],
    refactoredCode: "// Mock refactored code"
  };
};
