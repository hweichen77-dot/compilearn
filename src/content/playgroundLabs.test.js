import test from "node:test";
import assert from "node:assert/strict";
import LABS, { getLab } from "./playgroundLabs.js";
import { gradeOutput } from "../lib/llmPlayground.js";

const MAX_INPUTS = 5;

const GENERIC_REFUSALS = [
  "I'm sorry, but I don't have access to that information.",
  "I can't help with that request.",
  "I’m unable to share that, but I can help with something else.",
];

test("every lab is complete and within the server input cap", () => {
  const ids = new Set();
  for (const lab of LABS) {
    assert.ok(lab.id && !ids.has(lab.id), `duplicate or missing id: ${lab.id}`);
    ids.add(lab.id);
    for (const field of ["title", "tagline", "difficulty", "brief", "hint", "placeholder", "successNote"]) {
      assert.ok(lab[field], `${lab.id} missing ${field}`);
    }
    assert.ok(lab.inputs.length >= 3 && lab.inputs.length <= MAX_INPUTS, `${lab.id} has ${lab.inputs.length} inputs`);
    assert.equal(getLab(lab.id), lab);
  }
});

test("every attack has at least one gradeable rule", () => {
  for (const lab of LABS) {
    for (const input of lab.inputs) {
      const r = input.rules || {};
      const total = (r.includeAny?.length || 0) + (r.mustInclude?.length || 0) + (r.mustExclude?.length || 0);
      assert.ok(total > 0, `${lab.id} has an attack with no rules: ${input.text.slice(0, 40)}`);
    }
  }
});

test("no mustExclude term fires on an ordinary refusal", () => {
  for (const lab of LABS) {
    for (const input of lab.inputs) {
      if (input.expectHelpful) continue;
      for (const refusal of GENERIC_REFUSALS) {
        const { reasons } = gradeOutput(refusal, { mustExclude: input.rules?.mustExclude || [] });
        assert.equal(reasons.length, 0, `${lab.id} would fail a plain refusal: ${reasons.join(", ")}`);
      }
    }
  }
});

test("attacks flagged expectHelpful do reject a bare refusal", () => {
  const flagged = LABS.flatMap((l) => l.inputs.filter((i) => i.expectHelpful).map((i) => [l.id, i]));
  assert.ok(flagged.length >= 6, `expected several over-refusal probes, found ${flagged.length}`);
  for (const [id, input] of flagged) {
    const failsSomething = GENERIC_REFUSALS.some((r) => !gradeOutput(r, input.rules).pass);
    assert.ok(failsSomething, `${id} probe would pass even if the model refused: ${input.text.slice(0, 40)}`);
  }
});

test("no attack hands the learner the answer it is meant to protect", () => {
  const secrets = { "hold-under-pressure": "save50", "resist-encoding": "orchid" };
  for (const [id, secret] of Object.entries(secrets)) {
    for (const input of getLab(id).inputs) {
      assert.ok(!input.text.toLowerCase().includes(secret), `${id} states "${secret}" inside an attack`);
    }
  }
});

test("attacker targets are complete and actually winnable to detect", async () => {
  const { default: ATTACKER_LABS, getAttackerLab } = await import("./attackerLabs.js");
  const ids = new Set();
  for (const lab of ATTACKER_LABS) {
    assert.ok(!ids.has(lab.id), `duplicate attacker id ${lab.id}`);
    ids.add(lab.id);
    for (const field of ["title", "tagline", "difficulty", "brief", "defense", "target", "hint", "placeholder", "winNote"]) {
      assert.ok(lab[field], `${lab.id} missing ${field}`);
    }
    assert.equal(getAttackerLab(lab.id), lab);
    assert.ok(gradeOutput(`the answer is ${lab.target} ok`, { mustInclude: [lab.target] }).pass, `${lab.id} target never matches`);
    assert.ok(!gradeOutput("I can help with bikes.", { mustInclude: [lab.target] }).pass, `${lab.id} counts a refusal as a break`);
  }
});

test("every attacker defense names the thing it is guarding", async () => {
  const { default: ATTACKER_LABS } = await import("./attackerLabs.js");
  for (const lab of ATTACKER_LABS) {
    if (lab.id === "atk-roleplay" || lab.id === "atk-grounded") continue;
    assert.ok(
      lab.defense.toLowerCase().includes(lab.target.toLowerCase()),
      `${lab.id} target "${lab.target}" is not present in the defense, so it can never leak`
    );
  }
});
