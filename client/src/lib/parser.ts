export interface ParsedReport {
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

  const lokacija = lines[0];
  
  const getValue = (key: string): number => {
    // Regex to find "Key: Value" or "Key:Value", case insensitive, handling comma as decimal
    const regex = new RegExp(`${key}\\s*[:]?\\s*([\\d,.]+)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      // Replace comma with dot for float parsing
      return parseFloat(match[1].replace(',', '.'));
    }
    return 0;
  };

  const getPriimki = (): string[] => {
    const lastLine = lines[lines.length - 1];
    // Look for content inside parentheses at the end of the text or specific line
    const match = lastLine.match(/\((.*?)\)/);
    if (match && match[1]) {
      return match[1].split(',').map(name => name.trim());
    }
    return [];
  };

  return {
    lokacija,
    obiskani: getValue('Obiskani'),
    odzvani: getValue('Odzvani'),
    fix: getValue('Fix'),
    mob: getValue('Mob'),
    vs: getValue('VS'),
    tw: getValue('TW'),
    ure: getValue('Ure'),
    priimki: getPriimki(),
  };
}
