
import { GoogleGenAI, Chat, GenerateContentResponse, Content, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION, PERSONAS, PersonaKey } from "../constants";

let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key missing");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

// Convert files to base64 parts
export const filesToParts = async (files: File[]): Promise<Part[]> => {
  return Promise.all(
    files.map(async (file) => {
      return new Promise<Part>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1];
          resolve({
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );
};

interface ChatConfigOptions {
  mode: 'default' | 'search' | 'think';
  persona: PersonaKey;
  history?: Content[];
}

interface StreamUpdate {
  text?: string;
  groundingMetadata?: {
    web?: { uri: string; title: string }[];
    maps?: { uri: string; title: string }[];
  };
}

// Re-creates a chat session preserving history but updating tools/config
export const streamChatResponse = async (
  message: string,
  files: File[],
  options: ChatConfigOptions,
  onChunk: (update: StreamUpdate) => void
): Promise<void> => {
  const ai = getAI();
  
  let model = 'gemini-2.5-flash';
  let tools: any[] | undefined;
  let thinkingConfig: any | undefined;

  if (options.mode === 'think') {
    model = 'gemini-2.5-flash'; 
    thinkingConfig = { thinkingBudget: 1024 }; 
  } else if (options.mode === 'search') {
    model = 'gemini-2.5-flash';
    tools = [{ googleSearch: {} }];
  }

  // Get instruction based on persona
  const instruction = PERSONAS[options.persona]?.instruction || SYSTEM_INSTRUCTION;

  // Create a fresh chat session with the desired config and previous history
  const chat = ai.chats.create({
    model: model,
    history: options.history,
    config: {
      systemInstruction: instruction,
      temperature: 0.7,
      tools: tools,
      thinkingConfig: thinkingConfig,
    },
  });

  // Prepare content
  let contents: string | Part[] = message;
  if (files.length > 0) {
    const fileParts = await filesToParts(files);
    contents = [{ text: message }, ...fileParts];
  }

  try {
    const resultStream = await chat.sendMessageStream({ message: contents });
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      
      const update: StreamUpdate = {};
      
      if (c.text) {
        update.text = c.text;
      }

      // Extract grounding chunks if available
      if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = c.candidates[0].groundingMetadata.groundingChunks;
        const webSources = chunks
          .filter((c: any) => c.web)
          .map((c: any) => c.web);
        
        if (webSources.length > 0) {
          update.groundingMetadata = { web: webSources };
        }
      }

      if (update.text || update.groundingMetadata) {
        onChunk(update);
      }
    }
  } catch (error) {
    console.error("Error in stream:", error);
    throw error;
  }
};
