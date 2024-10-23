"use client";

import { Question } from "@/types/question";
import { Button } from "./ui/button";
import { MultipleChoice } from "./multiple-choice";
import { GridIn } from "./grid-in";
import { motion } from "framer-motion";

interface PostSubmissionStateProps {
  question: Question;
  nextStudentName: string;
  feedback: string;
  onContinue: () => void;
  studentAnswer: string;
}

export function PostSubmissionState({
  question,
  nextStudentName,
  feedback,
  onContinue,
  studentAnswer,
}: PostSubmissionStateProps) {
  console.log("PostSubmissionState props:", {
    correctAnswer: question.correctAnswer,
    studentAnswer,
    isCorrect: studentAnswer === question.correctAnswer,
  });

  const isCorrect = studentAnswer === question.correctAnswer;

  return (
    <div className="flex w-full gap-8 px-12">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-10%" }}
        transition={{ duration: 0.5 }}
        className="flex-1 px-4"
      >
        <h3 className="text-lg mb-4 text-center opacity-75">{question.text}</h3>
        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt="Question"
            className="mb-4 max-w-md rounded-lg shadow-md opacity-75 mx-auto"
          />
        )}
        {question.questionType === "multiple-choice" ? (
          <MultipleChoice
            onChange={() => {}}
            disabled={true}
            correctAnswer={question.correctAnswer}
            selectedAnswer={studentAnswer}
            showCorrectness={true}
            choices={question.choices}
          />
        ) : (
          <>
            <GridIn
              onChange={() => {}}
              disabled={true}
              correctAnswer={question.correctAnswer}
              selectedAnswer={studentAnswer}
              showCorrectness={true}
            />
            <div className="mt-4 text-center space-y-2">
              <p className="text-gray-600">
                Your answer:{" "}
                <span className="font-medium">{studentAnswer}</span>
              </p>
            </div>
          </>
        )}
        <div
          className={`mt-4 text-center ${
            feedback.includes("Correct") ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </div>
      </motion.div>

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center px-4"
      >
        <h2 className="text-4xl font-bold mb-8 text-primary">Next Student</h2>
        <p className="text-2xl mb-12">{nextStudentName}</p>
        <Button onClick={onContinue} className="w-48 h-12 text-lg">
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
