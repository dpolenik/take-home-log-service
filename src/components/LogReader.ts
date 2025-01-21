import * as fs from "fs";
import * as readline from "readline";

export class LogReader {
  private static readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB chunk size
  private static readonly MAX_LINES = 100000; // Reasonable maximum for most use cases

  /**
   * Reads the last `numLines` lines of a file, processes them in chunks, and stops once we hit the start of the file or hit the maximum number of lines.
   * @param filePath Path to the file.
   * @param numLines Number of lines from the end to read (max 100,000).
   * @param processLines A callback to process each chunk of lines read.
   * @param options Configuration options for reading.
   */
  public async readLastNLines(
    filePath: string,
    numLines: number,
    processLines: (lines: string[]) => Promise<void>,
    options: {
      //keep it configurable
      maxLineLength?: number;
      chunkSize?: number;
    } = {}
  ): Promise<void> {
    // Input validation
    if (numLines <= 0) {
      throw new Error("Number of lines must be greater than 0.");
    }
    if (numLines > LogReader.MAX_LINES) {
      throw new Error(`Cannot request more than ${LogReader.MAX_LINES} lines for memory safety.`);
    }

    const maxLineLength = options.maxLineLength || 1024 * 10; // 10KB default max line length
    const chunkSize = options.chunkSize || LogReader.DEFAULT_CHUNK_SIZE; // default chunk size

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath, {
        encoding: "utf-8",
        highWaterMark: chunkSize,
      });

      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity, // Handle all instances of CR LF
      });

      const linesBuffer: string[] = [];
      let totalBufferSize = 0;
      const maxBufferSize = numLines * maxLineLength;

      rl.on("line", (line) => {
        if (line.length > maxLineLength) {
          line = line.slice(0, maxLineLength) + "... [truncated]";
        }

        totalBufferSize += line.length;
        
        // If buffer gets too large, remove oldest lines
        while (totalBufferSize > maxBufferSize && linesBuffer.length > 0) {
          const removedLine = linesBuffer.pop();
          if (removedLine) {
            totalBufferSize -= removedLine.length;
          }
        }

        linesBuffer.unshift(line);
        if (linesBuffer.length > numLines) {
          const removedLine = linesBuffer.pop();
          if (removedLine) {
            totalBufferSize -= removedLine.length;
          }
        }
      });

      rl.on("close", async () => {
        try {
          await processLines(linesBuffer);
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      const cleanup = () => {
        stream.destroy();
        rl.close();
      };

      rl.on("error", (err) => {
        cleanup();
        reject(err);
      });

      stream.on("error", (err) => {
        cleanup();
        reject(err);
      });
    });
  }
}