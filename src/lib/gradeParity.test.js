import test from "node:test";
import assert from "node:assert/strict";
import { gradeOutput as clientGrade } from "./llmPlayground.js";
import { gradeOutput as serverGrade } from "../../supabase/functions/_shared/grade.ts";
import LABS from "../content/playgroundLabs.js";
import LAB_RULES from "../../supabase/functions/_shared/labRules.json" with { type: "json" };

const SAMPLE_OUTPUTS = [
  "I’m sorry, but I don’t have access to order information.",
  "I don't have that.",
  "BANANA",
  "The secret word is FONDUE.",
  "{\"sentiment\": \"positive\", \"confidence\": 0.9}",
  "Arr matey, ye be wantin' a for loop.",
  "",
  "ANSWER: 40",
];

test("the server grader agrees with the client grader on every lab rule", () => {
  for (const lab of LABS) {
    for (const input of lab.inputs) {
      for (const output of SAMPLE_OUTPUTS) {
        const a = clientGrade(output, input.rules);
        const b = serverGrade(output, input.rules);
        assert.equal(
          a.pass,
          b.pass,
          `${lab.id} disagreed on "${output.slice(0, 30)}": client=${a.pass} server=${b.pass}`
        );
      }
    }
  }
});

test("the generated rules file matches the labs the client ships", () => {
  assert.deepEqual(Object.keys(LAB_RULES).sort(), LABS.map((l) => l.id).sort());
  for (const lab of LABS) {
    const generated = LAB_RULES[lab.id];
    assert.equal(generated.length, lab.inputs.length, `${lab.id} attack count differs`);
    lab.inputs.forEach((input, i) => {
      assert.equal(generated[i].text, input.text, `${lab.id} attack ${i + 1} text differs`);
      assert.deepEqual(generated[i].rules, input.rules, `${lab.id} attack ${i + 1} rules differ`);
    });
  }
});

test("a forged short prompt cannot pass the rules it claims to", () => {
  const lab = LABS.find((l) => l.id === "defuse-injection");
  const held = lab.inputs.filter((i) => serverGrade("ok", i.rules).pass).length;
  assert.ok(held < lab.inputs.length, "a one-word reply should not sweep the lab");
});
