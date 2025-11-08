
import { GoogleGenAI, Modality, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImage = async (
  imageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.promptFeedback?.blockReason) {
      throw new Error(`Request was blocked due to ${response.promptFeedback.blockReason}. Please adjust your prompt or image.`);
    }

    const candidate = response.candidates?.[0];

    if (!candidate) {
      throw new Error('The model did not return a response. This may be due to safety settings.');
    }

    // Happy path: we have an image.
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    // If no image, inspect the response for clues and provide a better error message.
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      let friendlyMessage = `Image generation stopped unexpectedly. Reason: ${candidate.finishReason}.`;
      if (candidate.finishReason === 'NO_IMAGE') {
        friendlyMessage = 'The AI was unable to generate an image for this request. This can happen if the request is unclear, not feasible, or violates content policies. Please try rephrasing your request or using a different image.';
      } else if (candidate.finishReason === 'SAFETY') {
        friendlyMessage = 'The request was blocked for safety reasons. Please modify your prompt or image and try again.';
      }
      throw new Error(friendlyMessage);
    }

    if (response.text) {
      throw new Error(`The model returned a text message instead of an image: "${response.text}"`);
    }
    
    throw new Error('No image data found in response. The model may have failed to generate an image without providing a reason.');
  } catch (error) {
    console.error("Error editing image:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while editing the image with the Gemini API.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    throw new Error('No image was generated.');
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
};

export const analyzeImage = async (
  imageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageData,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image with Gemini API.");
  }
};

export const startChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and knowledgeable assistant for Garcia Roofing. You answer questions about roofing materials, installation processes, warranties, and scheduling estimates. You are professional and courteous.',
    },
  });
};
