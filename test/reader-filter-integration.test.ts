import { expect } from "chai";
import { LogReader } from "../src/components/LogReader";
import { TextFilter } from "../src/components/TextFilter";

describe("LogReader and TextFilter Integration", () => {
  const filePath = "./test/test-log.txt";
  const logReader = new LogReader();
  const tf = new TextFilter();

  it("should find all 'Daisy Dog' entries in the last 5 lines", async () => {
    const results: string[] = [];
    
    await logReader.readLastNLines(filePath, 5, async (lines) => {
      const filteredLines = tf.filterByKeyword(lines, "Daisy Dog");
      results.push(...filteredLines);
    });

    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.include("Daisy Dog");
    expect(results.every(line => line.includes("Daisy Dog"))).to.be.true;
  });

  it("should find all 'Mad Max' entries in the last 6 lines", async () => {
    const results: string[] = [];
    
    await logReader.readLastNLines(filePath, 6, async (lines) => {
      const filteredLines = tf.filterByKeyword(lines, "Mad Max");
      results.push(...filteredLines);
    });

    expect(results).to.have.lengthOf(3);
    expect(results.every(line => line.includes("Mad Max"))).to.be.true;
  });

  it("should handle case-insensitive search", async () => {
    const results: string[] = [];
    
    await logReader.readLastNLines(filePath, 4, async (lines) => {
      const filteredLines = tf.filterByKeyword(lines, "mad max");
      results.push(...filteredLines);
    });

    expect(results).to.have.lengthOf(2);
    expect(results.every(line => line.includes("Mad Max"))).to.be.true;
  });

  it("should return no results for non-existent text", async () => {
    const results: string[] = [];
    
    await logReader.readLastNLines(filePath, 10, async (lines) => {
      const filteredLines = tf.filterByKeyword(lines, "nonexistent");
      results.push(...filteredLines);
    });

    expect(results).to.have.lengthOf(0);
  });

  it("should maintain correct line numbers when filtering", async () => {
    const results: string[] = [];
    
    await logReader.readLastNLines(filePath, 3, async (lines) => {
      const filteredLines = tf.filterByKeyword(lines, "Daisy Dog");
      results.push(...filteredLines);
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.include("9: I love Daisy Dog");
  });

  it("should handle searching entire file and respect line order", async () => {
    const results: string[] = [];
    
    await logReader.readLastNLines(filePath, 10, async (lines) => {
      const filteredLines = tf.filterByKeyword(lines, "Mad Max");
      results.push(...filteredLines);
    });

    expect(results).to.have.lengthOf(5);
    expect(results[0]).to.equal("10: Mad Max the cat");
    expect(results[4]).to.equal("2: Mad Max the cat");
  });
});