import { expect } from "chai";
import { TextFilter } from "../src/components/TextFilter";

describe("TextFilter", () => {
  const tf = new TextFilter();

  describe("filterByKeyword", () => {
    const testLines = [
      "ERROR: System failed to respond",
      "INFO: Operation completed successfully",
      "DEBUG: Processing request",
      "ERROR: Database connection timeout",
      "WARNING: Low memory condition",
    ];

    it("should find lines containing the keyword (case-insensitive)", () => {
      const result = tf.filterByKeyword(testLines, "error");
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal([
        "ERROR: System failed to respond",
        "ERROR: Database connection timeout"
      ]);
    });

    it("should return empty array when no matches found", () => {
      const result = tf.filterByKeyword(testLines, "nonexistent");
      expect(result).to.have.lengthOf(0);
      expect(result).to.deep.equal([]);
    });

    it("should handle empty input array", () => {
      const result = tf.filterByKeyword([], "error");
      expect(result).to.have.lengthOf(0);
      expect(result).to.deep.equal([]);
    });

    it("should match partial words", () => {
      const result = tf.filterByKeyword(testLines, "warn");
      expect(result).to.have.lengthOf(1);
      expect(result).to.deep.equal(["WARNING: Low memory condition"]);
    });

    it("should handle special characters in keyword", () => {
      const specialLines = [
        "Test (parentheses) here",
        "Test [brackets] here",
        "Test normal text"
      ];
      const result = tf.filterByKeyword(specialLines, "(parentheses)");
      expect(result).to.have.lengthOf(1);
      expect(result).to.deep.equal(["Test (parentheses) here"]);
    });
  });
});