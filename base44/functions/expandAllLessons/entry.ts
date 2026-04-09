import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all lessons
    const lessons = await base44.asServiceRole.entities.Lesson.list();
    const results = [];

    for (const lesson of lessons) {
      try {
        const prompt = `You are an expert programming educator writing rich zyBooks-style lesson content.

LESSON TITLE: "${lesson.title}"
CONCEPT: "${lesson.concept || lesson.title}"
CURRENT EXPLANATION:
${lesson.explanation || "(none yet)"}
STARTER CODE:
${lesson.starter_code || "(none)"}

Write a COMPREHENSIVE, detailed lesson explanation in Markdown. Requirements:
1. **Bold all key terms and important keywords** using **term** syntax
2. Clear intro paragraph explaining WHY this concept matters
3. Core concept section with thorough but accessible explanation  
4. 2-3 concrete code examples using \`\`\`js ... \`\`\` blocks (progressively complex)
5. "How It Works" breakdown using numbered steps
6. Common mistakes section with \`\`\`js bad example \`\`\` blocks
7. A real-world analogy that makes the concept click
8. Quick reference summary with key syntax at the bottom

Write at college intro-CS level. Bold ALL important keywords, concepts, function names, and technical terms throughout the text. The explanation should be 700-1000 words. Do NOT use emoji.

Also generate:
- 3 multiple choice quiz questions testing deep understanding
- 2 participation activities (mix of true/false and fill_in questions)`;

        const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          model: 'claude_sonnet_4_6',
          response_json_schema: {
            type: "object",
            properties: {
              explanation: { type: "string" },
              quiz_questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: { type: "array", items: { type: "string" } },
                    correct_index: { type: "number" },
                    explanation: { type: "string" }
                  }
                }
              },
              participation_activities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    activity_title: { type: "string" },
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question: { type: "string" },
                          type: { type: "string" },
                          correct_answer: { type: "string" },
                          explanation: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        await base44.asServiceRole.entities.Lesson.update(lesson.id, {
          explanation: result.explanation,
          ...(result.quiz_questions?.length > 0 ? { quiz_questions: result.quiz_questions } : {}),
          ...(result.participation_activities?.length > 0 ? { participation_activities: result.participation_activities } : {}),
        });

        results.push({ id: lesson.id, title: lesson.title, status: 'success' });
        console.log(`✓ Expanded: ${lesson.title}`);
      } catch (err) {
        results.push({ id: lesson.id, title: lesson.title, status: 'error', error: err.message });
        console.error(`✗ Failed: ${lesson.title} — ${err.message}`);
      }
    }

    const succeeded = results.filter(r => r.status === 'success').length;
    return Response.json({ 
      success: true, 
      total: lessons.length, 
      succeeded, 
      failed: lessons.length - succeeded,
      results 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});