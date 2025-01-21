import path from 'path';
import { LogReader } from './LogReader';
import { TextFilter } from './TextFilter';

export class SearchOrchestrator {
  private logReader: LogReader;
  private textFilter: TextFilter;
  private readonly LOG_DIR = '/var/log';
  private readonly MAX_LINES = 100000;

  constructor() {
    this.logReader = new LogReader();
    this.textFilter = new TextFilter();
  }
  

  /**
   * Searches the specified log file for the last N lines, optionally filtering by a keyword
   * @param filename The name of the log file in /var/log
   * @param numLines Number of lines to retrieve (max 100000)
   * @param keyword Optional keyword to filter results
   * @returns Promise<string[]> Array of matching log lines
   */
  public async searchLogs(
    filename: string,
    numLines: number,
    keyword?: string
  ): Promise<string[]> {
    // Validate inputs
    if (!filename) {
      throw new Error('Filename is required');
    }

    if (numLines <= 0 || numLines > this.MAX_LINES) {
      throw new Error(`Number of lines must be between 1 and ${this.MAX_LINES}`);
    }

    // Ensure the file path is within /var/log
    const filePath = path.join(this.LOG_DIR, path.basename(filename));
    if (!filePath.startsWith(this.LOG_DIR)) {
      throw new Error('Invalid file path - must be within /var/log');
    }

    // Store results for filtering
    const results: string[] = [];

    // Read and process the log lines
    await this.logReader.readLastNLines(filePath, numLines, async (lines) => {
      if (keyword) {
        const filteredLines = this.textFilter.filterByKeyword(lines, keyword);
        results.push(...filteredLines);
      } else {
        results.push(...lines);
      }
    });

    return results;
  }
}