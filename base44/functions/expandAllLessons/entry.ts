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

    const expandLesson = async (lesson) => {
      const prompt = `You are an expert programming educator writing rich zyBooks-style lesson content.

LESSON TITLE: "${lesson.title}"
CONCEPT: "${lesson.concept || lesson.title}"
CURRENT EXPLANATION:
${lesson.explanation || "(none yet)"}
STARTER CODE:
${lesson.starter_code || "(none)"}

Write a COMPREHENSIVE, detailed lesson explanation in Markdown. Requirements:
1. **Bold all key terms and important keywords** using **term** syntax throughout the entire explanation
2. Clear intro paragraph (2-3 sentences) explaining WHY this concept matters and what real problem it solves
3. Core concept section with thorough but accessible explanation using plain language
4. 2-3 concrete code examples using \`\`\`js ... \`\`\` blocks (progressively complex, each with a comment explaining what it demonstrates)
5. "How It Works" breakdown using numbered steps
6. Common mistakes section with \`\`\`js bad/good examples and a clear explanation of why the mistake happens
7. A real-world analogy paragraph that makes the concept click for a total beginner
8. Quick reference summary box at the bottom with key syntax

Write at college intro-CS level. **Bold ALL important keywords, concepts, function names, method names, and technical terms** throughout. The explanation should be 800-1200 words. Do NOT use emoji.

Also generate:
- 3 multiple choice quiz questions testing deep understanding (not just memorization)
- 2 participation activities (mix of true_false and fill_in types) with clear, educational explanations`;

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

      console.log(`✓ Expanded: ${lesson.title}`);
      return { id: lesson.id, title: lesson.title, status: 'success' };
    };

    // Process all lessons in parallel
    const settled = await Promise.allSettled(lessons.map(expandLesson));
    const results = settled.map((s, i) =>
      s.status === 'fulfilled' ? s.value : { id: lessons[i].id, title: lessons[i].title, status: 'error', error: s.reason?.message }
    );

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