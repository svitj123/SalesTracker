export interface ParsedReport {
  agent?: string;
  lokacija: string;
  obiskani: number;
  odzvani: number;
  fix: number;
  mob: number;
  vs: number;
  tw: number;
  ure: number;
  priimki: string[];
}

export function parseReport(text: string): ParsedReport {
  const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    throw new Error("Empty report");
  }

  // Helper to extract value by key (case insensitive, handles various separators)
  const getValue = (keyPattern: string | RegExp): number => {
    // Regex to find "Key: Value" or "Key:Value", case insensitive, handling comma as decimal
    // Supports "Varni splet (VS):" by matching the end of the key
    const regex = new RegExp(`${typeof keyPattern === 'string' ? keyPattern : keyPattern.source}\\s*[:]?\\s*([\\d,.]+)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      // Replace comma with dot for float parsing
      return parseFloat(match[1].replace(',', '.'));
    }
    return 0;
  };

  // 1. Extract Agent Name (First line if it ends with colon, or just the first line if it looks like a name)
  let agent = undefined;
  let lokacija = lines[0]; // Default location to first line (old format)

  // Check for New Format characteristics
  const hasTeren = lines.some(l => l.toLowerCase().startsWith('teren:'));
  
  if (hasTeren) {
    // New Format
    // First line is likely Agent
    if (lines[0].endsWith(':')) {
      agent = lines[0].replace(':', '').trim();
    } else {
      agent = lines[0];
    }

    // Find Location (Teren)
    const terenLine = lines.find(l => l.toLowerCase().startsWith('teren:'));
    if (terenLine) {
      lokacija = terenLine.substring(6).trim(); // Remove "Teren:"
    }
  } else {
    // Old Format: Location is always first line
    lokacija = lines[0];
    // Agent might be missing or implied
  }

  // 2. Extract Arrays (Priimki)
  const getPriimki = (): string[] => {
    // Try finding "Priimki strank:" line
    const priimkiLine = lines.find(l => l.toLowerCase().startsWith('priimki strank:'));
    if (priimkiLine) {
      const namesPart = priimkiLine.substring(15).trim(); // Remove "Priimki strank:"
      if (namesPart === '/' || namesPart === '') return [];
      return namesPart.split(',').map(name => name.trim()).filter(n => n.length > 0);
    }

    // Fallback to old format: (Name, Name) at end
    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/\((.*?)\)/);
    if (match && match[1]) {
      return match[1].split(',').map(name => name.trim());
    }
    return [];
  };

  return {
    agent,
    lokacija,
    obiskani: getValue('Obiskani'),
    odzvani: getValue('Odzvani'),
    fix: getValue('Fix'),
    mob: getValue('Mob'),
    vs: getValue(/(?:Varni splet \(VS\)|VS)/), // Support both "Varni splet (VS)" and just "VS"
    tw: getValue(/(?:Turbo WiFi \(TW\)|TW)/), // Support both "Turbo WiFi (TW)" and just "TW"
    ure: getValue('Ure'), // Regex in getValue handles numbers, we just need to ensure it stops before 'h' if present
    priimki: getPriimki(),
  };
}
