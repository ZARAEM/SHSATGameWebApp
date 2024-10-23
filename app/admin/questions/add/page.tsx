"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminHeader } from "@/components/admin-header";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function AddQuestion() {
  const [question, setQuestion] = useState({
    text: '',
    subject: '',
    timeAllowed: '',
    points: '',
    questionType: 'multiple-choice',
    correctAnswer: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...question,
          timeAllowed: parseInt(question.timeAllowed),
          points: parseInt(question.points),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add question');
      }
      alert('Question added successfully');
      setQuestion({
        text: '',
        subject: '',
        timeAllowed: '',
        points: '',
        questionType: 'multiple-choice',
        correctAnswer: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question');
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <AdminHeader title="Add Question" />
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <Textarea
          name="text"
          value={question.text}
          onChange={handleChange}
          placeholder="Question Text"
          required
        />
        <Input
          name="subject"
          value={question.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />
        <Input
          name="timeAllowed"
          type="number"
          value={question.timeAllowed}
          onChange={handleChange}
          placeholder="Time Allowed (seconds)"
          required
        />
        <Input
          name="points"
          type="number"
          value={question.points}
          onChange={handleChange}
          placeholder="Points"
          required
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full mb-2">
              {question.questionType === 'multiple-choice' ? 'Multiple Choice' : 'Grid In'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem onClick={() => setQuestion(prev => ({ ...prev, questionType: 'multiple-choice' }))}>
              Multiple Choice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setQuestion(prev => ({ ...prev, questionType: 'grid-in' }))}>
              Grid In
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {question.questionType === "multiple-choice" ? (
          <Input
            name="correctAnswer"
            value={question.correctAnswer}
            onChange={handleChange}
            placeholder="Correct Answer (A, B, C, D)"
            required
          />
        ) : (
          <Input
            name="correctAnswer"
            value={question.correctAnswer}
            onChange={handleChange}
            placeholder="Correct Answer (5 characters)"
            required
          />
        )}
        <Input
          name="imageUrl"
          value={question.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
        {question.imageUrl && (
          <div className="relative w-full max-w-md h-48 overflow-hidden">
            <img
              src={question.imageUrl}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <Button type="submit">Add Question</Button>
      </form>
    </div>
  );
}