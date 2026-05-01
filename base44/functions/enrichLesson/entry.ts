import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { lessonId } = await req.json();
    if (!lessonId) return Response.json({ error: 'lessonId required' }, { status: 400 });

    const lessons = await base44.asServiceRole.entities.Lesson.filter({ id: lessonId });
    const lesson = lessons[0];
    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404 });

    const prompt = `You are an expert curriculum designer for an interactive coding education platform (like ZyBooks or Codecademy). 
    
Lesson title: "${lesson.title}"
Concept: "${lesson.concept || lesson.title}"
Existing explanation (markdown): 
${lesson.explanation || "(none yet)"}

Your job is to enrich this lesson with ENGAGING, interactive supplementary content. Be specific, concrete, and practical.

Generate the following:

1. key_terms: 3-5 key vocabulary terms with concise, plain-English definitions
2. callouts: 3-4 callouts. Each has:
   - type: "tip" | "warning" | "analogy" | "insight"
   - title: short descriptive title (optional, keep it short)
   - content: 1-3 sentence explanation. Be concrete and helpful.
   - position: "before" | "after" (relative to main explanation). Put "analogy" and most others "after".
3. concept_diagram: a flow diagram showing the main process/pipeline with 3-6 steps. Each step has "label" (short) and optional "desc" (very short, ~5 words)
4. inline_quizzes: 2-3 multiple-choice questions to check understanding mid-lesson. Each has:
   - question: a clear, specific question about the concept
   - options: array of 3-4 answer strings (make distractors plausible)
   - correct_index: 0-based index of the correct answer
   - explanation: 1-2 sentences explaining WHY that's correct
5. video_search_query: a short YouTube search query (5-8 words) that would find a great explainer video for this concept (we'll use this to find a video to embed). Keep it specific.
6. quiz_questions: array of 3 multiple-choice questions for the end-of-lesson quiz. Each: { question, options: string[], correct_index: number, explanation }
7. participation_activities: array of 1-2 participation activities (ZyBooks style). Each has:
   - activity_title: short title
   - questions: array of 3-4 questions. Each: { question, type: "true_false"|"fill_in", correct_answer: string, explanation }

Make all content match the dark, technical, professional aesthetic of a modern coding bootcamp. No fluff. Every callout, quiz, and term should add real learning value.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          key_terms: {
            type: "array",
            items: {
              type: "object",
              properties: {
                term: { type: "string" },
                definition: { type: "string" }
              }
            }
          },
          callouts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                title: { type: "string" },
                content: { type: "string" },
                position: { type: "string" }
              }
            }
          },
          concept_diagram: {
            type: "object",
            properties: {
              title: { type: "string" },
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    desc: { type: "string" }
                  }
                }
              }
            }
          },
          inline_quizzes: {
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
          video_search_query: { type: "string" },
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

    // Update the lesson with all new enrichment data
    await base44.asServiceRole.entities.Lesson.update(lessonId, {
      key_terms: result.key_terms || [],
      callouts: result.callouts || [],
      concept_diagram: result.concept_diagram || null,
      inline_quizzes: result.inline_quizzes || [],
      video_search_query: result.video_search_query || "",
      quiz_questions: result.quiz_questions?.length ? result.quiz_questions : (lesson.quiz_questions || []),
      participation_activities: result.participation_activities?.length ? result.participation_activities : (lesson.participation_activities || []),
    });

    return Response.json({ success: true, title: lesson.title, video_search_query: result.video_search_query });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});