const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

const aiService = {
  // Service 1 - Generate smart replies based on recent chat history
  generateSmartReplies: async function (chatHistory, userTone = "casual") {
    const prompt = `You are an intelligent chat assistant built into a messaging app. 
      Analyze the following chat history and generate 3 short, natural, and context-aware replies for the user to send next.
      Adapt to a "${userTone}" tone. 
      Return ONLY a raw JSON array of 3 strings. Do not include markdown formatting or the word "json".

      Chat History:
      ${chatHistory}`;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const text = result?.response?.text();
      return JSON.parse(text.trim());
    } catch (error) {
      console.log("Failed to generate smart replies:", error);
      return [];
    }
  },

  // Service 2 - Predicting the next few words
  generatePredictiveText: async function (currentDraft, userTone = "casual") {
    if (!currentDraft || currentDraft.length < 3) return [];

    const prompt = `
      You are an autocorrect and autocomplete engine. The user is currently typing: "${currentDraft}".
      Provide 3 logical, short completions (1-4 words max) to finish their sentence.
      Tone: ${userTone}.
      Return ONLY a raw JSON array of 3 strings. Do not include markdown formatting.
    `;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      console.log("ai chat service, predictions, result=", result);
      const text = result?.response?.text();
      return JSON.parse(text.trim());
    } catch (error) {
      console.log("Failed to generate predictive text:", error);
      return [];
    }
  },
};

module.exports = aiService;
