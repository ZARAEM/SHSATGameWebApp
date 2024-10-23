"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QuestionType = "grid-in" | "multiple-choice";

export interface QuestionComponentProps {
  questionText: string;
  questionType: QuestionType;
  timeLimit: number;
  choices?: { id: string; text: string }[];
  correctAnswer: string;
  onSubmit: (answer: string | null, isCorrect: boolean) => void;
}

export function QuestionComponent({
  questionText,
  questionType,
  timeLimit,
  choices,
  correctAnswer,
  onSubmit
}: QuestionComponentProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    const isCorrect = answer === correctAnswer;
    onSubmit(answer, isCorrect);
  };

  return (
    <div className="w-full max-w-[95%] mx-auto p-6 space-y-6 bg-background rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-foreground">{questionText}</h2>
      <div className="text-lg font-semibold">Time left: {timeLeft} seconds</div>
      {questionType === "multiple-choice" && (
        <div className="py-4">
          {choices?.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => setAnswer(choice.id)}
              className={`w-full mb-2 ${answer === choice.id ? 'bg-blue-500' : ''}`}
            >
              {choice.text} ({choice.id.toUpperCase()})
            </Button>
          ))}
        </div>
      )}
      {questionType === "grid-in" && (
        <Input
          type="text"
          placeholder="Enter your answer"
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full"
        />
      )}
      <Button 
        onClick={handleSubmit}
        className="w-full"
        disabled={answer === null}
      >
        Submit
      </Button>
    </div>
  );
}