import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Strip emoji and variation selectors from a string
function stripEmojis(str) {
  if (typeof str !== 'string') return str;
  // Match all emoji-like unicode blocks
  return str
    .replace(/\p{Emoji}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\u200D/g, '')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function cleanValue(value) {
  if (typeof value === 'string') return stripEmojis(value);
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = cleanValue(v);
    return out;
  }
  return value;
}

Deno.serve(async (req) => {
  try {
  const base44 = createClientFromRequest(req);

  const lessons = await base44.asServiceRole.entities.Lesson.list('-created_date', 200);
  let updated = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    const fields = ['explanation', 'solution_code', 'starter_code', 'expected_output', 'challenge_description', 'challenge_starter_code', 'challenge_solution_code', 'hints', 'quiz_questions', 'challenge_test_cases'];
    const patch = {};
    let changed = false;

    for (const field of fields) {
      if (lesson[field] !== undefined && lesson[field] !== null) {
        const cleaned = cleanValue(lesson[field]);
        if (JSON.stringify(cleaned) !== JSON.stringify(lesson[field])) {
          patch[field] = cleaned;
          changed = true;
        }
      }
    }

    if (changed) {
      await base44.asServiceRole.entities.Lesson.update(lesson.id, patch);
      updated++;
    } else {
      skipped++;
    }
  }

  return Response.json({ message: `Done. Updated: ${updated}, Skipped (clean): ${skipped}` });
  } catch (err) {
    console.error('ERROR:', err.message, err.stack);
    return Response.json({ error: err.message }, { status: 500 });
  }
});