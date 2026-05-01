import React from "react";
import LessonExplanation from "./LessonExplanation";

/**
 * Renders the core markdown explanation inside the white reading area.
 * Dark-themed enhancements (callouts, quizzes, video, diagram) are handled
 * separately by LessonEnhancements, rendered outside the white box.
 */
export default function RichLessonPanel({ lesson }) {
  if (!lesson) return null;

  return (
    <LessonExplanation explanation={lesson.explanation || ""} concept={null} />
  );
}