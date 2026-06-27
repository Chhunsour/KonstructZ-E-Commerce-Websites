import { matchProductAndSpec } from "../src/components/chat/matchingEngine";
import { getReply, emptyMemory } from "../src/components/chat/engine";

interface TestCase {
  input: string;
  expectedProductKey: string | null;
  expectedIntent: string | null;
  expectedType: "direct" | "clarify" | "not_found";
}

const testCases: TestCase[] = [
  { input: "terror hp", expectedProductKey: null, expectedIntent: "Horsepower", expectedType: "clarify" },
  { input: "teror hp", expectedProductKey: null, expectedIntent: "Horsepower", expectedType: "clarify" },
  { input: "xxv power", expectedProductKey: null, expectedIntent: "Horsepower", expectedType: "clarify" },
  { input: "terror xxv engine", expectedProductKey: null, expectedIntent: "Engine", expectedType: "clarify" },
  { input: "tyrant weight", expectedProductKey: null, expectedIntent: "Weight", expectedType: "clarify" },
  { input: "tyrant 17 dig", expectedProductKey: "tyrant 17", expectedIntent: "Digging Depth", expectedType: "direct" },
  { input: "stomp lift", expectedProductKey: null, expectedIntent: "Lift Capacity", expectedType: "clarify" },
  { input: "509 lift", expectedProductKey: "0509", expectedIntent: "Lift Capacity", expectedType: "direct" },
  { input: "x1300 hp", expectedProductKey: "x1300", expectedIntent: "Horsepower", expectedType: "direct" },
  { input: "vigor 2 weight", expectedProductKey: "forklift (2.0 ton)", expectedIntent: "Weight", expectedType: "direct" },
  { input: "forklift height", expectedProductKey: null, expectedIntent: "Dimensions", expectedType: "clarify" },
  { input: "skoop engine", expectedProductKey: null, expectedIntent: "Engine", expectedType: "clarify" },
  { input: "roller weight", expectedProductKey: null, expectedIntent: "Weight", expectedType: "clarify" },
  { input: "pallet fork 509", expectedProductKey: "0509", expectedIntent: null, expectedType: "direct" },
  { input: "does fork fit stomp", expectedProductKey: null, expectedIntent: null, expectedType: "clarify" },
  { input: "ship overseas", expectedProductKey: null, expectedIntent: "Shipping", expectedType: "clarify" },
  { input: "warranty", expectedProductKey: null, expectedIntent: "Warranty", expectedType: "clarify" }
];

function runTests() {
  console.log("=== Part 1: Chatbot Matching Engine Test Suite ===");
  let passedCount = 0;
  
  testCases.forEach((tc, idx) => {
    // Mock local storage inside node for tests
    (global as any).window = { localStorage: { getItem: () => null } };
    (global as any).localStorage = { getItem: () => null };

    const res = matchProductAndSpec(tc.input);
    
    let pass = true;
    if (res.type !== tc.expectedType) pass = false;
    
    if (tc.expectedProductKey) {
      if (!res.product || !res.product.name.toLowerCase().includes(tc.expectedProductKey)) {
        pass = false;
      }
    } else {
      if (res.product !== null && tc.expectedType === "clarify") {
        pass = false;
      }
    }
    
    if (tc.expectedIntent !== undefined) {
      if (res.intent !== tc.expectedIntent) {
        pass = false;
      }
    }

    if (pass) {
      passedCount++;
      console.log(`[PASS] Case #${idx + 1}: "${tc.input}" matched to "${res.product?.name || "Ambiguous / Multiple"}", Spec: "${res.intent || "None"}", Match: ${res.type}`);
    } else {
      console.log(`[FAIL] Case #${idx + 1}: "${tc.input}"`);
      console.log(`       Expected Product: ${tc.expectedProductKey || "None"}, Intent: ${tc.expectedIntent || "None"}, Match: ${tc.expectedType}`);
      console.log(`       Got Product: ${res.product?.name || "None"}, Intent: ${res.intent || "None"}, Match: ${res.type} (Confidence: ${res.confidence})`);
    }
  });

  console.log(`\nMatching Results: ${passedCount} / ${testCases.length} Passed`);
  if (passedCount < testCases.length) {
    process.exit(1);
  }

  console.log("\n=== Part 2: Chatbot Dialogue & Flow Tests ===");
  let flowPassed = 0;
  let flowTotal = 0;

  const assertContains = (text: string, sub: string, name: string) => {
    flowTotal++;
    const cleanText = text.replace(/[*_`|#\-]/g, "").replace(/\s+/g, " ");
    const cleanSub = sub.replace(/[*_`|#\-]/g, "").replace(/\s+/g, " ");
    if (cleanText.toLowerCase().includes(cleanSub.toLowerCase())) {
      flowPassed++;
      console.log(`[PASS] Dialogue Flow: ${name}`);
    } else {
      console.log(`[FAIL] Dialogue Flow: ${name}`);
      console.log(`       Expected to contain: "${sub}"`);
      console.log(`       Got response: "${text}"`);
    }
  };

  // Test 1: Wrong machine correction
  const wrongRes1 = getReply("can forklift dig trench", emptyMemory(), "EN");
  assertContains(wrongRes1.answer.markdown, "not the right machine", "Wrong Machine Redirect (Forklift Dig)");

  const wrongRes2 = getReply("can roller lift pallet", emptyMemory(), "EN");
  assertContains(wrongRes2.answer.markdown, "not the right machine", "Wrong Machine Redirect (Roller Pallet)");

  // Test 2: Sizing / comparison
  const compRes1 = getReply("which stomp is stronger", emptyMemory(), "EN");
  assertContains(compRes1.answer.markdown, "stomp x1300 is the stronger", "Sizing Comparison (Stomp HP)");

  // Test 3: Terminology / explanation
  const explainRes = getReply("what does digging depth mean", emptyMemory(), "EN");
  assertContains(explainRes.answer.markdown, "digging depth indicates", "Spec Explanation Helper (Digging depth)");

  // Test 4: Active memory follow-up
  let mem = emptyMemory();
  const initRes = getReply("terror xi", mem, "EN");
  mem = initRes.memory;
  const followUpRes = getReply("hp?", mem, "EN");
  assertContains(followUpRes.answer.markdown, "13.5 hp", "Active Memory Spec Follow-up (Terror XI HP)");

  // Test 5: Guided Lead/Quote Flow
  let quoteMem = emptyMemory();
  const step1 = getReply("contact sales", quoteMem, "EN");
  assertContains(step1.answer.markdown, "step 1", "Quote Flow Start");
  quoteMem = step1.memory;

  const step2 = getReply("Alice Smith", quoteMem, "EN");
  assertContains(step2.answer.markdown, "step 2", "Quote Flow Name Input");
  quoteMem = step2.memory;

  const step3 = getReply("alice@example.com", quoteMem, "EN");
  assertContains(step3.answer.markdown, "step 3", "Quote Flow Contact Input");
  quoteMem = step3.memory;

  const step4 = getReply("Terror XXV", quoteMem, "EN");
  assertContains(step4.answer.markdown, "step 4", "Quote Flow Product Input");
  quoteMem = step4.memory;

  const step5 = getReply("Excavation work", quoteMem, "EN");
  assertContains(step5.answer.markdown, "step 5", "Quote Flow Job Input");
  quoteMem = step5.memory;

  const stepFinal = getReply("California, USA", quoteMem, "EN");
  assertContains(stepFinal.answer.markdown, "quote request summary", "Quote Flow Summary Compilation");
  assertContains(stepFinal.answer.markdown, "Alice Smith", "Quote Summary Name Check");

  console.log(`\nFlow Results: ${flowPassed} / ${flowTotal} Passed`);
  
  if (flowPassed < flowTotal) {
    process.exit(1);
  }

  console.log("\nAll chatbot accuracy and dialog flow verification checks passed successfully!");
}

runTests();
