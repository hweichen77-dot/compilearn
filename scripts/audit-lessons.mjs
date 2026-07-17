import { PROJECTS, LESSONS, getLessonsByProject } from "../src/content/index.js";

const projById = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
const trackOf = p => p?.track || (p?.category === "apcsp" ? "apcsp" : p?.category === "apcsa" ? "apcsa" : "ai");
const isProduct = p => p?.kind === "product";

const AI_TELLS = [
  /\bdelve\b/i, /\bleverage(s|d|ing)?\b/i, /\brobust\b/i, /\bseamless(ly)?\b/i,
  /\bmoreover\b/i, /\bfurthermore\b/i, /\bin conclusion\b/i, /\bit'?s worth noting\b/i,
  /\bunlock(s|ing)?\b/i, /\bempower(s|ed|ing)?\b/i, /\bnavigat(e|ing) the\b/i,
  /\bin today'?s\b/i, /\bever-(evolving|changing)\b/i, /\bgame.?chang/i,
];

const rows = [];
const projRows = [];

for (const p of PROJECTS) {
  const ls = getLessonsByProject(p.id);
  const declared = p.lessons_count;
  const orders = ls.map(l => l.order).sort((a, b) => a - b);
  const gaps = [];
  for (let i = 0; i < orders.length - 1; i++) {
    if (orders[i + 1] - orders[i] > 1.0001) gaps.push(`${orders[i]}->${orders[i+1]}`);
  }
  const dupOrder = orders.length !== new Set(orders).size;
  projRows.push({
    id: p.id, title: p.title, track: trackOf(p), kind: p.kind || "module",
    declared, actual: ls.length,
    mismatch: declared != null && declared !== ls.length,
    gaps, dupOrder,
    diff: p.difficulty,
  });

  for (const l of ls) {
    const exp = l.explanation || "";
    const expLen = exp.length;
    const hasCode = /```/.test(exp);
    const kt = l.key_terms?.length || 0;
    const iq = l.inline_quizzes?.length || 0;
    const qq = l.quiz_questions?.length || 0;
    const anim = l.animated_diagrams?.length || 0;
    const worked = (l.worked_examples?.length || 0) + (l.step_throughs?.length || 0);
    const pa = l.participation_activities?.length || 0;
    const recall = iq + qq + pa;
    const illustrative = !!l.illustrative;
    const hasChallenge = !!l.challenge_title;
    const hasSolution = !!(l.challenge_solution_code || l.solution_code);
    const hasTests = (l.challenge_test_cases?.length || 0) > 0;
    const tells = AI_TELLS.filter(re => re.test(exp)).map(re => re.source);
    const emdash = /—/.test(JSON.stringify(l));
    const curly = /[‘’“”]/.test(JSON.stringify(l));

    const flags = [];
    if (expLen < 500) flags.push(`THIN_EXPLANATION(${expLen})`);
    if (!hasCode && !["apcsp"].includes(trackOf(p)) && !illustrative) flags.push("NO_CODE_BLOCK");
    if (recall === 0) flags.push("NO_ACTIVE_RECALL");
    if (anim === 0) flags.push("NO_DIAGRAM");
    if (kt === 0) flags.push("NO_KEY_TERMS");
    if (!illustrative && !hasChallenge) flags.push("NO_CHALLENGE");
    if (hasChallenge && !hasTests) flags.push("CHALLENGE_NO_TESTS");
    if (hasChallenge && !hasSolution) flags.push("CHALLENGE_NO_SOLUTION");
    if (tells.length) flags.push("AI_TELLS:" + tells.join("|"));
    if (emdash) flags.push("EM_DASH");
    if (curly) flags.push("CURLY_QUOTE");

    rows.push({
      id: l.id, pid: p.id, track: trackOf(p), kind: p.kind || "module",
      title: l.title, order: l.order, illustrative,
      expLen, hasCode, kt, recall, anim, worked, hasChallenge, hasTests, hasSolution,
      flags,
    });
  }
}

const emit = (label, x) => console.log(label, x);

console.log("=".repeat(70));
console.log("STRUCTURAL / POLISH AUDIT — " + LESSONS.length + " lessons, " + PROJECTS.length + " projects");
console.log("=".repeat(70));

console.log("\n## A. LESSON COUNT MISMATCHES (declared vs actual)");
const mism = projRows.filter(r => r.mismatch);
mism.forEach(r => emit("  ", `${r.id} "${r.title}" declared=${r.declared} actual=${r.actual}`));
if (!mism.length) console.log("  none");

console.log("\n## B. ORDER GAPS / DUPLICATE ORDERS");
const badOrder = projRows.filter(r => r.gaps.length || r.dupOrder);
badOrder.forEach(r => emit("  ", `${r.id}: gaps=[${r.gaps.join(",")}] dupOrder=${r.dupOrder}`));
if (!badOrder.length) console.log("  none");

console.log("\n## C. BROKEN CHALLENGES (missing tests or solution)");
const broken = rows.filter(r => r.flags.some(f => f.startsWith("CHALLENGE_NO")));
broken.forEach(r => emit("  ", `${r.id} "${r.title}" ${r.flags.filter(f=>f.startsWith("CHALLENGE")).join(",")}`));
if (!broken.length) console.log("  none");

console.log("\n## D. AI TELLS / EM DASH / CURLY QUOTES");
const dirty = rows.filter(r => r.flags.some(f => /AI_TELLS|EM_DASH|CURLY/.test(f)));
dirty.forEach(r => emit("  ", `${r.id} "${r.title}" ${r.flags.filter(f=>/AI_TELLS|EM_DASH|CURLY/.test(f)).join(" ")}`));
if (!dirty.length) console.log("  none");

console.log("\n## E. THIN EXPLANATIONS (<500 chars, non-illustrative)");
const thin = rows.filter(r => r.flags.some(f => f.startsWith("THIN")) && !r.illustrative);
thin.sort((a,b)=>a.expLen-b.expLen).forEach(r => emit("  ", `${r.id} "${r.title}" len=${r.expLen} [${r.track}]`));
if (!thin.length) console.log("  none");

console.log("\n## F. ENRICHMENT COVERAGE BY TRACK (lessons missing each aid)");
const byTrack = {};
for (const r of rows) {
  const t = r.track; byTrack[t] = byTrack[t] || { n:0, noDiagram:0, noRecall:0, noKeyTerms:0, noWorked:0, noChallenge:0 };
  const b = byTrack[t]; b.n++;
  if (r.anim===0) b.noDiagram++;
  if (r.recall===0) b.noRecall++;
  if (r.kt===0) b.noKeyTerms++;
  if (r.worked===0) b.noWorked++;
  if (!r.illustrative && !r.hasChallenge) b.noChallenge++;
}
console.log("  track | n | noDiagram noRecall noKeyTerms noWorked noChallenge");
for (const [t,b] of Object.entries(byTrack))
  console.log(`  ${t}: ${b.n} | ${b.noDiagram} ${b.noRecall} ${b.noKeyTerms} ${b.noWorked} ${b.noChallenge}`);

console.log("\n## G. CURRICULUM AI TRACK — under-enriched lessons (no diagram AND no recall)");
const cur = rows.filter(r => r.kind !== "product" && r.track === "ai");
const curBare = cur.filter(r => r.anim===0 && r.recall===0);
console.log(`  curriculum lessons: ${cur.length}, bare(no diagram+no recall): ${curBare.length}`);
const curByProj = {};
curBare.forEach(r => { curByProj[r.pid] = (curByProj[r.pid]||0)+1; });
Object.entries(curByProj).forEach(([pid,c]) => emit("  ", `${pid}: ${c} bare lessons`));

console.log("\n## H. EXPLANATION LENGTH DISTRIBUTION");
const lens = rows.filter(r=>!r.illustrative).map(r=>r.expLen).sort((a,b)=>a-b);
const pct = q => lens[Math.floor(lens.length*q)];
console.log(`  min=${lens[0]} p10=${pct(.1)} p25=${pct(.25)} median=${pct(.5)} p75=${pct(.75)} p90=${pct(.9)} max=${lens[lens.length-1]}`);

console.log("\n## SUMMARY COUNTS");
const flagCount = {};
rows.forEach(r => r.flags.forEach(f => { const k=f.split("(")[0].split(":")[0]; flagCount[k]=(flagCount[k]||0)+1; }));
Object.entries(flagCount).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>emit("  ", `${k}: ${v}`));
