# Carrefour Helper - 幫你找找 AI

<div align="center">
  <img src="https://img.shields.io/badge/Designed%20by-%E5%BE%B7-blue?style=for-the-badge" alt="Designed by 德">
  <br>
  <p>這是一個智慧型的家樂福分店搜尋與運費查詢助手，採用最新的 AI 技術與極簡的 iOS 風格介面設計。</p>
</div>

## ✨ 主要功能

### 1. 🏪 找分店 (智慧搜尋)

透過 Google Gemini AI 技術，理解您的自然語言指令，並運用 Google Maps 資料精準定位。

- **智慧理解**：您可以輸入「顧客地址」、「高雄鳳山」或直接按「定位目前位置」。
- **詳細資訊**：提供店名、地址、電話、營業時間以及與您的距離。
- **一鍵導航**：點擊搜尋結果即可開啟 Google Maps 進行導航。

### 2. 🚚 查運費 (即時查詢)

快速查詢各分店的跨區運送費用。

- **模糊搜尋**：輸入「五甲」、「WG」等關鍵字即可快速找到對應店家的運費表。
- **清晰列表**：清楚列出不同區域的運費價格與備註。

## 🛠️ 技術架構

- **前端框架**：React 19 + Vite
- **AI 模型**：Google Gemini 2.5 Flash (搭配 Google Maps Grounding)
- **樣式設計**：TailwindCSS + Glassmorphism (毛玻璃特效)
- **部署平台**：Cloudflare Pages / Vercel

## 🚀 快速開始

### 前置需求

1. 安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)
2. 申請 [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 安裝步驟

1. **下載專案**
   \`\`\`bash
   git clone <https://github.com/lalawgwg99/SRWGAPP.git>
   cd SRWGAPP
   \`\`\`

2. **安裝套件**
   \`\`\`bash
   npm install
   \`\`\`

3. **設定環境變數**
   請在專案根目錄建立 `.env.local` 檔案，並填入您的 API Key：
   \`\`\`env
   GEMINI_API_KEY=您的_GEMINI_API_KEY
   \`\`\`

4. **啟動開發伺服器**
   \`\`\`bash
   npm run dev
   \`\`\`
   開啟瀏覽器訪問 `http://localhost:3000` 即可使用。

## ☁️ 部署說明 (Cloudflare Pages)

1. 將程式碼推送到您的 GitHub Repository。
2. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
3. 進入 **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**。
4. 選擇本專案 `SRWGAPP`。
5. **Build Settings (建置設定)**：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Environment Variables (環境變數)**：
   - 設定 `GEMINI_API_KEY` 為您的 API Key。
7. 點擊 **Save and Deploy** 完成部署。

## 🔒 隱私與安全

- 本程式僅使用瀏覽器的地理定位功能進行查詢，不會儲存您的位置資訊。
- API Key 僅在伺服器端或本地環境使用，請勿將 `.env.local` 上傳至公開的 GitHub。

---
<div align="center">
  Designed by 德
</div>
