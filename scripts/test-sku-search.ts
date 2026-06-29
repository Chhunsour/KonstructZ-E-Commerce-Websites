import { getReply } from "../src/components/chat/engine";

const testCases = [
  "TYPH-0611",
  "typh0611",
  "0611",
  "TYPH-061",
  "TYPH-0612",
  "sku typh 0612",
  "GTIN 5061030740958",
  "5061030740958",
  "what product is TYPH-0611",
  "find sku for vigor 1.5",
  "wrong sku TYPH-9999",
  "do you have sku for stomp 509",
  "product code 509",
  "sku for terror xix storm"
];

const mockMemory = {
  turn: 0,
  awaiting: null,
  activeMachine: undefined,
  quoteSlots: undefined,
  recentlyViewedIds: []
};

console.log("=== STARTING SKU SEARCH TESTS ===");
for (const testCase of testCases) {
  console.log(`\n----------------------------------------`);
  console.log(`Query: "${testCase}"`);

  const { answer } = getReply(testCase, mockMemory as any, "EN");
  console.log("Response Markdown:\n");
  console.log(answer.markdown);

  if (answer.followups) {
    console.log("\nFollow-ups:", answer.followups);
  }
}
console.log("\n=== SKU SEARCH TESTS COMPLETED ===");
