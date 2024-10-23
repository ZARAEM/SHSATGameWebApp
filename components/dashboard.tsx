"use client";

import React, { useState, useEffect } from "react";
import { QuestionComponent } from "./question-component";
import { StudentScoreboard } from "./student-scoreboard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  questionType: "grid-in" | "multiple-choice";
  timeLimit: number;
  choices?: { id: string; text: string }[];
  correctAnswer: string;
}

export function Dashboard() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const router = useRouter();

  const handleBackToMain = () => {
    router.push("/");
  };

  const fetchNewQuestion = async () => {
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const questions: Question[] = await response.json();
      setCurrentQuestion(
        questions[Math.floor(Math.random() * questions.length)]
      );
      setShowAnswer(false);
      setFeedback(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = (answer: string | null, isCorrect: boolean) => {
    if (answer && currentQuestion) {
      setShowAnswer(true);
      setFeedback(
        isCorrect
          ? "Correct!"
          : `Incorrect! Your answer was: ${answer}. The correct answer is: ${currentQuestion.correctAnswer}.`
      );
      setScores((prevScores) => ({
        ...prevScores,
        currentUser: (prevScores.currentUser || 0) + (isCorrect ? 1 : 0),
      }));
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="p-4">
        <Button onClick={handleBackToMain} className="mb-4">
          Back to Main Page
        </Button>
      </div>
      <div className="flex-grow p-4">
        {currentQuestion && (
          <>
            <QuestionComponent
              questionText={currentQuestion.questionText}
              questionType={currentQuestion.questionType}
              timeLimit={currentQuestion.timeLimit}
              choices={currentQuestion.choices}
              correctAnswer={currentQuestion.correctAnswer}
              onSubmit={handleSubmit}
            />
            {feedback && <div className="mt-4 text-lg">{feedback}</div>}
            {showAnswer && (
              <Button
                onClick={() => fetchNewQuestion()}
                className="mt-4 w-full"
              >
                Next Question
              </Button>
            )}
          </>
        )}
      </div>
      <div className="w-80 p-4">
        <StudentScoreboard
          students={Object.entries(scores).map(([name, score]) => ({
            id: name,
            name,
            score,
            teamNumber: null,
          }))}
        />
      </div>
    </div>
  );
}
