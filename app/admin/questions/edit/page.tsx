"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Question {
  id: string;
  text: string;
  subject: string;
  timeAllowed: number;
  points: number;
  questionType: string;
  correctAnswer: string;
  imageUrl?: string;
  askedInSession: boolean;
  choices: { id: string; text: string; choiceId: string }[];
}

export default function EditQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditQuestion(question);
  };

  const handleSave = async () => {
    if (!editQuestion) return;
    try {
      const response = await fetch(`/api/questions/${editQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editQuestion,
          timeAllowed: Number(editQuestion.timeAllowed),
          points: Number(editQuestion.points),
          choices: editQuestion.choices.map((choice) => ({
            text: choice.text,
            choiceId: choice.choiceId,
          })),
        }),
      });
      if (!response.ok) throw new Error("Failed to update question");
      fetchQuestions();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete question");
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editQuestion) return;
    const { name, value } = e.target;
    setEditQuestion({ ...editQuestion, [name]: value });
  };

  const resetQuestions = async (id?: string) => {
    try {
      const url = id ? `/api/questions/${id}` : "/api/questions";
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ askedInSession: false }),
      });
      if (!response.ok)
        throw new Error(`Failed to reset question${id ? "" : "s"}`);
      await fetchQuestions();
    } catch (error) {
      console.error(`Error resetting question${id ? "" : "s"}:`, error);
    }
  };

  const handleResetAll = () => resetQuestions();

  const handleResetQuestion = (id: string) => resetQuestions(id);

  return (
    <div className="p-8 flex flex-col items-center">
      <AdminHeader title="Edit Questions" />
      <Button onClick={handleResetAll} className="mb-4">
        Reset All Questions
      </Button>
      <div className="w-full max-w-2xl">
        {questions.map((question) => (
          <div key={question.id} className="mb-8 p-4 border rounded">
            {editingId === question.id ? (
              <>
                <Textarea
                  name="text"
                  value={editQuestion?.text}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Input
                  name="subject"
                  value={editQuestion?.subject}
                  onChange={handleChange}
                  className="mb-2"
                  placeholder="Subject"
                />
                <Input
                  name="timeAllowed"
                  type="number"
                  value={editQuestion?.timeAllowed}
                  onChange={handleChange}
                  className="mb-2"
                  placeholder="Time Allowed"
                />
                <Input
                  name="points"
                  type="number"
                  value={editQuestion?.points}
                  onChange={handleChange}
                  className="mb-2"
                  placeholder="Points"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full mb-2">
                      {editQuestion?.questionType === "multiple-choice"
                        ? "Multiple Choice"
                        : "Grid In"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() =>
                        setEditQuestion((prev) =>
                          prev
                            ? { ...prev, questionType: "multiple-choice" }
                            : null
                        )
                      }
                    >
                      Multiple Choice
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setEditQuestion((prev) =>
                          prev ? { ...prev, questionType: "grid-in" } : null
                        )
                      }
                    >
                      Grid In
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {editQuestion?.questionType === "multiple-choice" && (
                  <div className="space-y-2 mb-4">
                    <h3 className="font-medium">Answer Choices</h3>
                    {editQuestion.choices.map((choice, index) => (
                      <div
                        key={choice.id || choice.choiceId}
                        className="flex gap-2"
                      >
                        <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                          {choice.choiceId}
                        </div>
                        <Input
                          value={choice.text}
                          onChange={(e) => {
                            const newChoices = [...editQuestion.choices];
                            newChoices[index].text = e.target.value;
                            setEditQuestion((prev) =>
                              prev ? { ...prev, choices: newChoices } : null
                            );
                          }}
                          placeholder={`Choice ${choice.choiceId}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  name="correctAnswer"
                  value={editQuestion?.correctAnswer}
                  onChange={handleChange}
                  className="mb-2"
                  placeholder={
                    editQuestion?.questionType === "multiple-choice"
                      ? "Correct Answer (A, B, C, D)"
                      : "Correct Answer (5 characters)"
                  }
                />
                <Input
                  name="imageUrl"
                  value={editQuestion?.imageUrl}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className="mb-2"
                />
                {editQuestion?.imageUrl && (
                  <div className="relative w-full max-w-md h-48 overflow-hidden">
                    <img
                      src={editQuestion.imageUrl}
                      alt="Uploaded"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <h3 className="font-bold mb-2">{question.text}</h3>
                <p>Subject: {question.subject}</p>
                <p>Time Allowed: {question.timeAllowed} seconds</p>
                <p>Points: {question.points}</p>
                <p>Type: {question.questionType}</p>
                {question.questionType === "multiple-choice" && (
                  <div className="mt-2">
                    <p className="font-medium">Choices:</p>
                    {question.choices.map((choice) => (
                      <p key={choice.id || choice.choiceId}>
                        {choice.choiceId}: {choice.text}
                      </p>
                    ))}
                  </div>
                )}
                <p>Correct Answer: {question.correctAnswer}</p>
                <p>
                  Asked In Session: {question.askedInSession ? "Yes" : "No"}
                </p>
                <p>Correct Answer: {question.correctAnswer}</p>
                <p>
                  Asked In Session: {question.askedInSession ? "Yes" : "No"}
                </p>
                {question.imageUrl && (
                  <img
                    src={question.imageUrl}
                    alt="Question"
                    className="mt-2"
                  />
                )}
                <div className="mt-2">
                  <Button onClick={() => handleEdit(question)} className="mr-2">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(question.id)}
                    variant="destructive"
                    className="mr-2"
                  >
                    Delete
                  </Button>
                  <Button onClick={() => handleResetQuestion(question.id)}>
                    Reset Question
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
