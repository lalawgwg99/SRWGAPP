import { GoogleGenAI } from "@google/genai";
import { SearchResult, StoreInfo } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const findNearestStore = async (
  userLocation: string, 
  latitude?: number, 
  longitude?: number
): Promise<SearchResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Required model for Maps Grounding
    
    let locationContext = "";
    let toolConfig = {};

    // If we have precise coordinates, pass them to the tool config
    if (latitude && longitude) {
      toolConfig = {
        googleMaps: {
          retrievalConfig: {
            latLng: {
              latitude,
              longitude
            }
          }
        }
      };
      locationContext = `(使用者精確座標: ${latitude}, ${longitude})`;
    } else {
       // Regular text search
       toolConfig = {
        googleMaps: {}
       };
    }

    const prompt = `
      使用者位於：${userLocation} ${locationContext}。
      請利用 Google Maps 工具，找出距離這個位置 **最近的 3 間**「家樂福 (Carrefour)」分店（包含家樂福超市、Market 或量販店）。
      
      請嚴格依照以下規則回答，這非常重要：
      1. 不要輸出任何開場白或結尾語。
      2. 請務必估算或獲取店家與使用者的距離。
      3. 請針對每一家店輸出 **一行** 資料，使用 | 符號分隔，格式如下：
         店名 | 完整地址 | 電話 | 營業時間 | 距離數字(請包含單位km或公尺)
      
      範例格式：
      家樂福五甲店 | 高雄市鳳山區林森路291號 | 07-766-2288 | 09:00–23:00 | 1.2 km
      家樂福超市鳳山中山店 | 高雄市鳳山區中山路100號 | 07-123-4567 | 24小時營業 | 850 m
      
      如果找不到電話或營業時間，請填「無」。
      如果無法精確計算距離，請根據地圖相對位置估算一個數值。
      請依照距離由近到遠排序。
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [toolConfig],
        temperature: 0.1, 
      },
    });

    const candidate = response.candidates?.[0];
    
    if (!candidate) {
      throw new Error("No response from AI");
    }

    const text = candidate.content?.parts?.map(p => p.text).join('') || "";
    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];

    // Parse the text into structured data
    const stores: StoreInfo[] = [];
    const lines = text.split('\n').filter(l => l.trim().length > 0);

    for (const line of lines) {
      // Clean up the line and split
      const parts = line.split('|').map(s => s.trim());
      
      // We expect 5 parts. Sometimes models output markdown lists like "- Name", remove leading non-alphanumeric
      const name = parts[0]?.replace(/^[\-\*\d\.\s]+/, '') || "未知名稱";

      if (parts.length >= 2) {
        stores.push({
          name: name,
          address: parts[1] || "",
          phone: parts[2] || "無資訊",
          hours: parts[3] || "無資訊",
          // Ensure we grasp the distance even if it's the last part
          distance: parts[4] || "計算中..." 
        });
      }
    }

    // Fallback logic
    if (stores.length === 0 && text.length > 0) {
        stores.push({
            name: "搜尋結果",
            address: text,
            phone: "",
            hours: "",
            distance: ""
        });
    }

    return {
      stores,
      rawText: text,
      groundingChunks: groundingChunks as any
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};