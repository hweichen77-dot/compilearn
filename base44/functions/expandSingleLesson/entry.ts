import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { lessonId } = await req.json();
    if (!lessonId) {
      return Response.json({ error: 'lessonId required' }, { status: 400 });
    }

    const lessons = await base44.asServiceRole.entities.Lesson.filter({ id: lessonId });
    const lesson = lessons[0];
    if (!lesson) {
      return Response.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const prompt = `You are an expert programming educator writing rich zyBooks-style lesson content.

LESSON TITLE: "${lesson.title}"
CONCEPT: "${lesson.concept || lesson.title}"
CURRENT EXPLANATION:
${lesson.explanation || "(none yet)"}
STARTER CODE:
${lesson.starter_code || "(none)"}

Write a COMPREHENSIVE, detailed lesson explanation in Markdown. Requirements:
1. **Bold all key terms and important keywords** using **term** syntax throughout the text
2. Clear intro paragraph explaining WHY this concept matters and what problem it solves
3. Core concept section with thorough but accessible explanation
4. 2-3 concrete code examples using \`\`\`js ... \`\`\` blocks (progressively complex)
5. "How It Works" breakdown using numbered steps
6. Common mistakes section with \`\`\`js bad example \`\`\` blocks and explanations
7. A real-world analogy that makes the concept click for beginners
8. Quick reference summary with key syntax at the bottom

Write at college intro-CS level. **Bold ALL important keywords, concepts, function names, and technical terms** throughout the text. The explanation should be 700-1000 words. Do NOT use emoji.

Also generate:
- 3 multiple choice quiz questions testing deep understanding (not just memorization)
- 2 participation activities (mix of true/false and fill_in questions) with good explanations`;

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

    await base44.asServiceRole.entities.Lesson.update(lessonId, {
      explanation: result.explanation,
      ...(result.quiz_questions?.length > 0 ? { quiz_questions: result.quiz_questions } : {}),
      ...(result.participation_activities?.length > 0 ? { participation_activities: result.participation_activities } : {}),
    });

    return Response.json({ success: true, title: lesson.title });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});