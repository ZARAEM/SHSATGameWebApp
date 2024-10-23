"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { Question } from "@/types/question";
import { MultipleChoice } from "@/components/multiple-choice";
import { GridIn } from "@/components/grid-in";
import { StudentScoreboard } from "@/components/student-scoreboard";
import Link from "next/link";
import { PostSubmissionState } from "@/components/post-submission-state";

const DEFAULT_TIMER = 60;

export default function GamePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [feedback, setFeedback] = useState("");
  const [questionsLeft, setQuestionsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchFromAPI = async <T,>(
    url: string,
    options?: RequestInit
  ): Promise<T> => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`API call failed: ${url}`);
    return response.json();
  };

  const fetchStudents = async () => {
    try {
      const data = await fetchFromAPI<Student[]>("/api/students");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
    }
  };

  const fetchQuestions = async () => {
    try {
      return await fetchFromAPI<Question[]>(
        "/api/questions?askedInSession=false"
      );
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to fetch questions. Please try again.");
      return [];
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchQuestions().then((newQuestions) => {
      setQuestions(newQuestions);
      setTotalQuestions(newQuestions.length);
      setQuestionsLeft(newQuestions.length);
    });
  }, []);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isAnswering && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSubmitAnswer();
    }
    return () => clearInterval(countdown);
  }, [isAnswering, timer]);

  const updateStudentScore = async (student: Student, points: number) => {
    try {
      await fetchFromAPI(`/api/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: student.score + points }),
      });

      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s.id === student.id ? { ...s, score: s.score + points } : s
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating student score:", error);
      setError("Failed to update score. The game will continue.");
      return false;
    }
  };

  const markQuestionAsAsked = async (questionId: string) => {
    try {
      await fetchFromAPI(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ askedInSession: true }),
      });

      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
      return true;
    } catch (error) {
      console.error("Error marking question as asked:", error);
      setError("Failed to update question status. The game will continue.");
      return false;
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    const isCorrect = studentAnswer === currentQuestion.correctAnswer;
    setFeedback(
      `${isCorrect ? "Correct" : "Incorrect"}! The answer is: ${
        currentQuestion.correctAnswer
      }`
    );

    if (isCorrect) {
      const currentStudent = students[currentStudentIndex];
      await updateStudentScore(currentStudent, currentQuestion.points);
    }

    await markQuestionAsAsked(currentQuestion.id);

    const nextIndex = (currentStudentIndex + 1) % students.length;
    setCurrentStudentIndex(nextIndex);

    setIsAnswering(false);
    setIsSubmitted(true);
    console.log(`Correct answer: ${currentQuestion.correctAnswer}`);
  };

  const handleAnswerChange = (answer: string) => {
    setStudentAnswer(answer);
  };

  const handleContinue = async () => {
    setIsSubmitted(false);
    setFeedback("");
    setStudentAnswer("");

    const newQuestions = await fetchQuestions();

    if (newQuestions.length === 0) {
      setQuestions([]);
      setCurrentQuestion(null);
      setIsReady(false);
      setIsAnswering(false);
      setQuestionsLeft(0);
      setFeedback("Game Over! No more questions left.");
      return;
    }

    setQuestions(newQuestions);
    setQuestionsLeft(newQuestions.length - 1);
    const newQuestion =
      newQuestions[Math.floor(Math.random() * newQuestions.length)];
    setCurrentQuestion(newQuestion);
    setIsReady(true);
    setIsAnswering(true);
    setTimer(DEFAULT_TIMER);
    setIsSubmitted(false);
  };

  const handleStart = async () => {
    if (questions.length === 0) {
      setError("No questions available!");
      return;
    }
    const newQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(newQuestion);
    setError(null);
    setIsReady(true);
    setIsAnswering(true);
    setTimer(newQuestion.timeAllowed || DEFAULT_TIMER);
    setFeedback("");
    setIsSubmitted(false);
    setQuestionsLeft(questions.length - 1);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-grow">
        <div className="p-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-primary hover:underline cursor-pointer"
          >
            ← Back to Main Page
          </Link>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
            Questions Left: {questionsLeft}
          </div>
        </div>
        <div className="flex-grow p-4">
          {!isReady ? (
            <div className="h-full flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold mb-8 text-primary">
                First Student
              </h2>
              <p className="text-2xl mb-12">
                {students[currentStudentIndex]?.name}
              </p>
              <Button
                onClick={handleStart}
                className="w-40"
                disabled={questions.length === 0}
              >
                Start
              </Button>
              {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                {!isSubmitted && ( // Add this condition
                  <div className="flex items-center gap-2">
                    <span className="text-xl">Current Student:</span>
                    <span className="text-xl font-semibold">
                      {students[currentStudentIndex]?.name}
                    </span>
                  </div>
                )}
                {isAnswering && (
                  <span className="text-lg font-medium">
                    Time Left: {timer} seconds
                  </span>
                )}
              </div>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {isSubmitted ? (
                <PostSubmissionState
                  question={currentQuestion!}
                  nextStudentName={students[currentStudentIndex]?.name}
                  feedback={feedback}
                  onContinue={handleContinue}
                  studentAnswer={studentAnswer}
                />
              ) : (
                <div className="flex flex-col items-center">
                  <h3 className="text-lg mb-4 text-center">
                    {currentQuestion?.text}
                  </h3>
                  {currentQuestion?.imageUrl && (
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Question"
                      className="mb-4 max-w-md rounded-lg shadow-md"
                    />
                  )}
                  {currentQuestion?.questionType === "multiple-choice" ? (
                    <MultipleChoice
                      onChange={handleAnswerChange}
                      disabled={isSubmitted}
                    />
                  ) : (
                    <GridIn
                      onChange={handleAnswerChange}
                      disabled={isSubmitted}
                    />
                  )}
                  <Button
                    onClick={handleSubmitAnswer}
                    className="w-40 mt-6"
                    disabled={!studentAnswer}
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-80">
        <StudentScoreboard students={students} />
      </div>
    </div>
  );
}
