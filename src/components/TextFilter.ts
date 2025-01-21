export class TextFilter {
    /**
     * Filters lines that contain the given keyword (case-insensitive).
     * @param lines Array of strings to search through.
     * @param keyword Keyword to search for in lines.
     * @returns Filtered lines containing the keyword.
     */
    public filterByKeyword(lines: string[], keyword: string): string[] {
      const lowerKeyword = keyword.toLowerCase();
      return lines.filter((line) => line.toLowerCase().includes(lowerKeyword));
    }
  }
  