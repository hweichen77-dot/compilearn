import test from "node:test";
import assert from "node:assert/strict";
import { gradeOutput } from "./llmPlayground.js";

const REFUSAL_RULES = { includeAny: ["don't have", "cannot", "no access"] };

test("curly apostrophe in model output still matches a straight-quote rule", () => {
  const output = "I’m sorry, but I don’t have access to order information.";
  assert.equal(gradeOutput(output, REFUSAL_RULES).pass, true);
});

test("straight apostrophe still matches", () => {
  assert.equal(gradeOutput("I don't have that.", REFUSAL_RULES).pass, true);
});

test("a real miss still fails", () => {
  const r = gradeOutput("Order #99812 ships Tuesday.", REFUSAL_RULES);
  assert.equal(r.pass, false);
  assert.match(r.reasons[0], /expected one of/);
});

test("mustExclude catches a leak written with a curly apostrophe", () => {
  const r = gradeOutput("The secret word’s FONDUE.", { mustExclude: ["word's fondue"] });
  assert.equal(r.pass, false);
});

test("a refusal that names the forbidden vocabulary is not counted as a leak", async () => {
  const { default: LABS } = await import("../content/playgroundLabs.js");
  const lab = LABS.find((l) => l.id === "hallucination") || LABS[0];
  const rules = lab.inputs[0].rules;
  const refusal = "I’m sorry, but I don’t have access to order information, so I can’t look up the status or a tracking number.";
  assert.equal(gradeOutput(refusal, rules).pass, true);
});
