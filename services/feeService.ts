
import { FEE_SHEET_URLS } from "../data/fees";
import { StoreFeeData, FeeSchedule } from "../types";

// Simple in-memory cache
let globalCache: StoreFeeData[] | null = null;
let isFetching = false;

/**
 * Robust CSV Parser
 * Handles newlines within quoted cells correctly, which simple split('\n') cannot do.
 */
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuote = false;
  
  // Normalize line endings to \n to simplify parsing
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const nextChar = normalizedText[i+1];
    
    if (char === '"') {
      if (inQuote && nextChar === '"') {
        // Handle escaped quotes ("") inside a quoted string
        currentCell += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        inQuote = !inQuote;
      }
    } else if (char === ',' && !inQuote) {
      // End of cell
      currentRow.push(currentCell.trim()); // Trim whitespace around values
      currentCell = '';
    } else if (char === '\n' && !inQuote) {
      // End of row
      currentRow.push(currentCell.trim());
      
      // Filter out completely empty rows to reduce noise
      if (currentRow.some(cell => cell.length > 0)) {
         rows.push(currentRow);
      }
      
      currentRow = [];
      currentCell = '';
    } else {
      // Regular character
      currentCell += char;
    }
  }
  
  // Push the very last row if it exists
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
    }
  }
  
  return rows;
};

/**
 * Helper to clean up messy Google Sheet tab names or copy artifacts
 * e.g. "「「WG五甲」的副本」的副本" -> "WG五甲"
 */
const cleanStoreName = (rawName: string): string => {
  let name = rawName;
  
  // 1. Remove standard prefix "店別：" or unit info
  name = name.replace(/^店別[:：]\s*/, '').replace(/[\(（]單位[:：].*?[\)）]/g, '');

  // 2. Recursive cleanup for "Copy of" or "的副本"
  let previous = '';
  while (name !== previous) {
      previous = name;
      name = name.replace(/的副本/g, '').replace(/Copy of/g, '').trim();
  }
  
  // 3. Remove brackets: 「LR」 -> LR, [LR] -> LR
  name = name.replace(/[「」\[\]]/g, ' ').trim();
  
  // 4. Final cleanup
  return name.replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();
};

/**
 * Fetches and parses a single CSV URL
 * HANDLES FLAT DATABASE STYLE with FILL DOWN Logic
 */
const fetchSheetData = async (url: string, sheetIndex: number): Promise<StoreFeeData[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    
    const csvText = await response.text();
    
    // Use the robust parser instead of split('\n')
    const rows = parseCSV(csvText);

    if (rows.length < 2) return [];

    // Temporary map to group rows by Store Name (Column A)
    const storeMap = new Map<string, StoreFeeData>();
    let lastStoreName = ''; // Tracks the last seen store name for "Fill Down"

    // Start from index 1 (skip global header row 0)
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      
      // Column Mapping:
      // Col 0 (A) = Store Name (e.g. "LR", "WG五甲")
      // Col 1 (B) = Fee / Price (e.g. "200")
      // Col 2 (C) = Range / Area (e.g. "旗津")
      // Col 3 (D) = Note (Optional)
      
      const rawName = cols[0] || '';
      const price = cols[1] || '';
      const range = cols[2] || '';
      const note = cols[3] || '';

      // Logic: If Column A has a value, use it and update lastStoreName.
      // If Column A is empty, use lastStoreName (Fill Down).
      let storeName = '';
      
      if (rawName) {
        const cleaned = cleanStoreName(rawName);
        if (cleaned.length > 0) {
           storeName = cleaned;
           lastStoreName = storeName;
        } else {
           storeName = lastStoreName;
        }
      } else {
        storeName = lastStoreName;
      }

      // If we still don't have a store name (e.g. empty rows at very start), skip
      if (!storeName) continue;

      // Initialize group if not exists
      if (!storeMap.has(storeName)) {
        storeMap.set(storeName, {
          id: `${sheetIndex}_${storeName}`, 
          storeName: storeName,
          schedules: []
        });
      }

      // Filter out header-like rows inside the data
      if (price.includes('跨區費') || range.includes('範圍') || range.includes('欄位')) {
        continue;
      }

      // Add valid data rows (Price or Range must exist)
      if (price || range) {
        storeMap.get(storeName)?.schedules.push({ price, range, note });
      }
    }

    const data = Array.from(storeMap.values());
    console.log(`Sheet ${sheetIndex} parsed: ${data.length} stores found. Total rows processed: ${rows.length}`);
    return data;

  } catch (error) {
    console.error(`Error parsing sheet ${url}:`, error);
    return [];
  }
};

/**
 * Main service function to get data
 */
const getAllFeeData = async (): Promise<StoreFeeData[]> => {
  if (globalCache) return globalCache;
  
  if (isFetching) {
    while (isFetching) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (globalCache) return globalCache;
    }
  }

  isFetching = true;
  try {
    const promises = FEE_SHEET_URLS.map((url, index) => fetchSheetData(url, index));
    const results = await Promise.all(promises);
    
    // Flatten the array because each sheet might contain multiple stores now
    globalCache = results.flat();
    console.log("Total loaded stores:", globalCache.length);
    return globalCache;
  } finally {
    isFetching = false;
  }
};

export const searchStoreFees = async (query: string): Promise<StoreFeeData[]> => {
  const allData = await getAllFeeData();

  if (!query) return [];

  // Fuzzy Search: Convert both to lowercase and check for inclusion
  const lowerQuery = query.toLowerCase().trim();

  // STRICTLY searching Column A (Store Name)
  return allData.filter(storeGroup => {
    return storeGroup.storeName.toLowerCase().includes(lowerQuery);
  });
};
