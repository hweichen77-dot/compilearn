import test from "node:test";
import assert from "node:assert/strict";
import { pickDailyLab, dayStamp, msUntilNextDay } from "./dailyLab.js";
import LABS from "../content/playgroundLabs.js";

test("the same day always picks the same lab", () => {
  const a = pickDailyLab(LABS, new Date("2026-08-01T04:00:00Z"));
  const b = pickDailyLab(LABS, new Date("2026-08-01T22:30:00Z"));
  assert.equal(a.id, b.id);
  assert.equal(a.dailyStamp, "2026-08-01");
});

test("consecutive days do not all collapse onto one lab", () => {
  const picks = new Set();
  for (let d = 1; d <= 28; d++) {
    picks.add(pickDailyLab(LABS, new Date(`2026-09-${String(d).padStart(2, "0")}T12:00:00Z`)).id);
  }
  assert.ok(picks.size >= 5, `only ${picks.size} distinct labs across 28 days`);
});

test("the stamp rolls over on UTC date, not local time", () => {
  assert.equal(dayStamp(new Date("2026-08-01T23:59:59Z")), "2026-08-01");
  assert.equal(dayStamp(new Date("2026-08-02T00:00:01Z")), "2026-08-02");
});

test("countdown to the next lab is under a day and never negative", () => {
  const ms = msUntilNextDay(new Date("2026-08-01T23:00:00Z"));
  assert.equal(ms, 60 * 60 * 1000);
  assert.ok(msUntilNextDay(new Date("2026-08-01T00:00:00Z")) <= 24 * 60 * 60 * 1000);
});

test("an empty lab list returns null instead of throwing", () => {
  assert.equal(pickDailyLab([], new Date()), null);
  assert.equal(pickDailyLab(null, new Date()), null);
});
