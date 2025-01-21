import { expect } from "chai";
import { LogReader } from "../src/components/LogReader";

describe("readLastNLines", () => {
  const filePath = "./test/test-log.txt";
  const logReader = new LogReader();

  it("should return the last 5 lines in reverse order", async () => {
    const expected = [
      "10: Mad Max the cat",
      "9: I love Daisy Dog",
      "8: Mad Max the cat",
      "7: I love Daisy Dog",
      "6: Mad Max the cat",
    ];

    const collected: string[] = [];
    await logReader.readLastNLines(filePath, 5, async (lines) => {
      // Since we are collecting lines chunk by chunk, reverse ensures correct order
      collected.unshift(...lines);
    });

    expect(collected).to.deep.equal(expected);
  });

  it("should handle fewer lines than requested", async () => {
    // If file has 10 lines and we request 20, 
    // we just get the 10 lines available
    const collected: string[] = [];
    await logReader.readLastNLines(filePath, 20, async (lines) => {
      collected.unshift(...lines.reverse());
    });

    expect(collected).to.have.lengthOf(10);
  });

  it("should fail if numLines <= 0", async () => {
    try {
      await logReader.readLastNLines(filePath, 0, async () => {});
      throw new Error("Expected error was not thrown.");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal("Number of lines must be greater than 0.");
      } else {
        throw new Error("Caught non-Error instance.");
      }
    }
  });
});
